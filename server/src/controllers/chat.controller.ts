import { Request, Response } from 'express';
import { Chat } from '../models/Chat.js';
import { ChunkDocs } from '../models/Chunk.js';
import { DocumentModel } from '../models/Document.js';
import { User } from '../models/User.js';
import { embedChunks } from '../utils/document.utils.js';
import genAI from '../config/gemini.js';

const CHAT_MODEL_CANDIDATES = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
];

const isModelNotFoundError = (error: unknown): boolean => {
    const status = (error as { status?: number })?.status;
    return status === 404;
};

const isRateLimitError = (error: unknown): boolean => {
    const status = (error as { status?: number })?.status;
    return status === 429;
};

const extractRetryDelay = (error: unknown): string | null => {
    const details = (error as { errorDetails?: Array<{ ["@type"]?: string; retryDelay?: string }> })?.errorDetails;
    if (!Array.isArray(details)) return null;
    const retryInfo = details.find((item) =>
        item?.["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
    );
    return retryInfo?.retryDelay ?? null;
};

const generateChatReply = async (
    formattedHistory: { role: "user" | "model"; parts: { text: string }[] }[],
    prompt: string
): Promise<string> => {
    let lastError: unknown = null;
    let rateLimitError: unknown = null;

    for (const modelName of CHAT_MODEL_CANDIDATES) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const chat = model.startChat({
                history: formattedHistory,
                generationConfig: { temperature: 0.3 },
            });

            const result = await chat.sendMessage(prompt);
            return result.response.text() ?? "No response generated.";
        } catch (error) {
            lastError = error;
            if (isRateLimitError(error) && !rateLimitError) {
                rateLimitError = error;
            }
            if (!isModelNotFoundError(error) && !isRateLimitError(error)) {
                throw error;
            }
        }
    }

    throw rateLimitError ?? lastError ?? new Error("No compatible chat model found.");
};





// ── Helper: cosine similarity between two vectors ────────────────────────────
const cosineSimilarity = (a: number[], b: number[]): number => {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
};


// ── POST /api/chat/message ────────────────────────────────────────────────────
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { message, docId } = req.body;

        if (!message || !docId) {
            res.status(400).json({ message: "message and docId are required." });
            return;
        }

        // 1. Check document exists and belongs to user
        const document = await DocumentModel.findById(docId);
        if (!document) {
            res.status(404).json({ message: "Document not found." });
            return;
        }
        if (document.userId.toString() !== userId) {
            res.status(403).json({ message: "Not authorized to chat with this document." });
            return;
        }
        if (document.status !== "ready") {
            res.status(422).json({ message: "Document is not ready yet." });
            return;
        }

        // 2. Check credits
        const user = await User.findById(userId);
        if (!user || user.credits <= 0) {
            res.status(403).json({ message: "No credits remaining. Please upgrade your plan." });
            return;
        }

        // 3. Vectorize the user's query
        const [queryEmbedding] = await embedChunks([message]);

        // 4. Fetch all chunks for this document and find top 3 by cosine similarity
        const allChunks = await ChunkDocs.find({ docId });

        const scoredChunks = allChunks
            .map((chunk) => ({
                content: chunk.content,
                score: cosineSimilarity(queryEmbedding, chunk.embedding),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        const context = scoredChunks.map((c) => c.content).join("\n\n---\n\n");

        // 5. Fetch existing chat history for this doc (for conversation continuity)
        const existingChat = await Chat.findOne({ userId, docId });
        const historyMessages = existingChat
            ? existingChat.messages.map((m) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            }))
            : [];

        // 6. Build prompt and call OpenAI
        const systemPrompt = `You are a helpful assistant that answers questions strictly based on the provided document context. 
If the answer is not found in the context, say "I couldn't find that information in the document."
Do not use outside knowledge.

Context from document:
${context}`;

        const formattedHistory: { role: "user" | "model"; parts: { text: string }[] }[] = historyMessages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
        }));

        const assistantReply = await generateChatReply(
            formattedHistory,
            `${systemPrompt}\n\nUser question: ${message}`
        );

        // 7. Save/update chat history — upsert so one chat doc per user+document
        await Chat.findOneAndUpdate(
            { userId, docId },
            {
                $push: {
                    messages: {
                        $each: [
                            { role: "user", content: message, timestamp: new Date() },
                            { role: "assistant", content: assistantReply, timestamp: new Date() },
                        ],
                    },
                },
            },
            { upsert: true, new: true }
        );

        // 8. Deduct credit
        await User.findByIdAndUpdate(userId, { $inc: { credits: -1 } });

        res.status(200).json({
            success: true,
            reply: assistantReply,
        });

    } catch (error) {
        console.error("Chat error:", error);
        if (error instanceof Error && error.message.toLowerCase().includes("fetch failed")) {
            res.status(503).json({ message: "AI service is temporarily unavailable. Please try again." });
            return;
        }
        if (isModelNotFoundError(error)) {
            res.status(503).json({ message: "No compatible AI model is available. Please check Gemini configuration." });
            return;
        }
        if (isRateLimitError(error)) {
            const retryDelay = extractRetryDelay(error);
            res.status(429).json({
                message: "AI rate limit reached. Please retry shortly.",
                ...(retryDelay && { retryAfter: retryDelay }),
            });
            return;
        }
        res.status(500).json({ message: "Internal server error.", error });
    }
};

// ── GET /api/chat/:docId ──────────────────────────────────────────────────────
export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { docId } = req.params;

        // Verify document belongs to user
        const document = await DocumentModel.findById(docId);
        if (!document) {
            res.status(404).json({ message: "Document not found." });
            return;
        }
        if (document.userId.toString() !== userId) {
            res.status(403).json({ message: "Not authorized." });
            return;
        }

        const chat = await Chat.findOne({ userId, docId }).select("messages -_id");

        res.status(200).json({
            success: true,
            messages: chat?.messages ?? [],
        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
};