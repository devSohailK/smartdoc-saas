// utils/document.utils.ts
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import genAI from "../config/gemini.js";

import pdfParse from "pdf-parse";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableGeminiError = (error: unknown): boolean => {
    if (!(error instanceof Error)) return false;
    const message = error.message.toLowerCase();
    return (
        message.includes("fetch failed") ||
        message.includes("econnreset") ||
        message.includes("etimedout") ||
        message.includes("temporarily unavailable")
    );
};

export const uploadToCloudinary = (buffer: Buffer, filename: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",
                folder: "documents",
                public_id: `${Date.now()}-${filename}`,
            },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve(result.secure_url);
            }
        );
        Readable.from(buffer).pipe(uploadStream);
    });
};

export const extractTextFromPDF = async (buffer: Buffer): Promise<string> => {
    const data = await pdfParse(buffer);
    return data.text;
    
};

export const chunkText = (text: string, chunkSize = 1000, overlap = 100): { text: string; metadata: Map<string, string> }[] => {

    const chunks: { text: string; metadata: Map<string, string> }[] = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < text.length) {
        const end = start + chunkSize;
        chunks.push({
            text: text.slice(start, end),
            metadata: new Map([
                ["chunkIndex", String(chunkIndex)],
                ["startChar", String(start)],
                ["endChar", String(end)],
            ])
        });
        start = end - overlap;
        chunkIndex++;
    }

    return chunks.filter((chunk) => chunk.text.trim().length > 0);
};


export const getEmbedding = async (text: string): Promise<number[]> => {
    // Use the Gemini embedding model supported by current API versions.
    const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            const shouldRetry = attempt < maxAttempts && isRetryableGeminiError(error);
            if (!shouldRetry) throw error;
            await sleep(300 * attempt);
        }
    }

    throw new Error("Failed to generate embedding after retries.");
};

export const embedChunks = async (
    chunks: string[],
    batchSize = 5
): Promise<number[][]> => {
    const embeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const batchResults: number[][] = [];

        // ❌ NO Promise.all — sequential calls
        for (const chunk of batch) {
            const embedding = await getEmbedding(chunk);
            batchResults.push(embedding);

            // small delay between requests (prevents ECONNRESET)
            await new Promise((res) => setTimeout(res, 150));
        }

        embeddings.push(...batchResults);

        // delay between batches (important)
        await new Promise((res) => setTimeout(res, 500));
    }

    return embeddings;
};