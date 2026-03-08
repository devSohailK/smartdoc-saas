import { Request, Response } from 'express';
import { DocumentModel } from "../models/Document.js";
import { User } from '../models/User.js';
import { ChunkDocs } from '../models/Chunk.js';
import { Chat } from '../models/Chat.js';
import { uploadToCloudinary, extractTextFromPDF, chunkText, embedChunks } from '../utils/document.utils.js'
import { Metadata } from 'pdf-parse';


export const uplaodDocuments = async (req: Request, res: Response): Promise<void> => {
    let documentRecord = null;

    try {
        if (!req.file) {
            res.status(400).json({ message: "No pdf file uploaded." })
            return;
        }

        const userId = req.userId
        const buffer = req.file.buffer;
        const originalname = req.file.originalname;

        const user = await User.findById(userId);
        if (!user || user.credits <= 0) {
            res.status(403).json({ message: "No credits remaining." });
            return;
        }

        const cloudUrl = await uploadToCloudinary(buffer, originalname);

        documentRecord = await DocumentModel.create({
            userId,
            filename: originalname,
            fileUrl: cloudUrl,
            status: "processing",
        });


        const rawText = await extractTextFromPDF(buffer);

        if (!rawText.trim()) {
            await documentRecord.updateOne({ status: "failed" });
            res.status(422).json({ message: "Could not extract text from PDF. It may be scanned/image-based." });
            return;
        }

        const chunks = chunkText(rawText, 1000, 100);
        const chunkTexts = chunks.map(chunk => chunk.text);
        const embeddings = await embedChunks(chunkTexts);

        const chunk_docs = chunks.map((chunk, index) => ({
            docId: documentRecord!._id,
            content : chunk.text,
            embedding: embeddings[index],
            metadata: chunk.metadata
        }));

        await ChunkDocs.insertMany(chunk_docs);


        // ── 9. Mark document as ready + deduct credit atomically ──────────────
        await Promise.all([
            documentRecord.updateOne({ status: "ready" }),
            User.findByIdAndUpdate(userId, { $inc: { credits: -1 } }),
        ]);

        res.status(200).json({
            success: true,
            message: "Document processed.",
            document: {
                id: documentRecord._id,
                filename: originalname,
                cloudUrl,
                chunks: chunks.length,
            },
        });
    } catch (error) {
        // If anything fails mid-way, mark document as failed so user isn't left with a ghost record
        if (documentRecord) {
            await documentRecord.updateOne({ status: "failed" }).catch(() => { });
        }

        console.error("Document upload error:", error);
        res.status(500).json({ message: "Document processing failed.", error });
    }

}




export const getDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;

        const documnets = await DocumentModel.find({ userId }).sort({ createdAt: -1 }).select("-__v");


        res.status(200).json({
            success: true,
            count: documnets.length,
            documnets,

        });

    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
};


export const deleteDocuments = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.userId;
        const { id } = req.params;

        const document = await DocumentModel.findById(id);

        if (!document) {
            res.status(404).json({ message: "Document not found." });
            return;
        }

        // Prevent user from deleting another user's document
        if (document.userId.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this document." });
            return;
        }

        // ── 2. Delete everything associated with this document atomically ──────
        await Promise.all([
            DocumentModel.findByIdAndDelete(id),                  // delete document record
            ChunkDocs.deleteMany({ docId: id }),                 // delete all chunks + vectors
            Chat.deleteMany({ docId: id }),                     // delete all chat history
        ]);



        res.status(200).json({
            success: true,
            message: "Document and all associated data deleted successfully.",
        });


    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error });
    }
}