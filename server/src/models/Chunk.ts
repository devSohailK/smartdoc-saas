import mongoose, { Document, Schema } from "mongoose";

export interface IChunk extends Document {
  docId: mongoose.Types.ObjectId;
  content: string;
  embedding: number[]; // Array of 1536 numbers for OpenAI
  metadata: Map<string, string>; // e.g., { pageNumber: "3" }
}

const ChunkSchema = new Schema<IChunk>({
  docId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true
  },
  content: {
    type: String,
    required: true
  }, // The actual text snippet
  // The Vector Embedding (Array of 1536 numbers for OpenAI)
  embedding: {
    type: [Number],
    required: true
  },
  metadata: {
    type: Map,
    of: String
  }, // e.g., { pageNumber: "3" }
});

export const ChunkDocs = mongoose.model<IChunk>("Chunk", ChunkSchema);