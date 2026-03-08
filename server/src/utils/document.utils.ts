// utils/document.utils.ts
import { Readable } from "stream";
import cloudinary from "../config/cloudinary.js";
import genAI from "../config/gemini.js";
const pdfParse = require("pdf-parse");

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
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

    const result = await model.embedContent(text);

    return result.embedding.values;
};

export const embedChunks = async (
    chunks: string[],
    batchSize = 20
): Promise<number[][]> => {
    const embeddings: number[][] = [];

    for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);

        const batchEmbeddings = await Promise.all(batch.map(getEmbedding));
        embeddings.push(...batchEmbeddings);

        if (i + batchSize < chunks.length) {
            await new Promise((res) => setTimeout(res, 200));
        }
    }

    return embeddings;
};