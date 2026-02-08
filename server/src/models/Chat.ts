import mongoose, { Document, Schema } from "mongoose";

export interface IChat extends Document {
    userId: mongoose.Types.ObjectId;
    docId: mongoose.Types.ObjectId;
    messages: {
        role: "user" | "assistant";
        content: string;
        timestamp: Date;
    }[];
    createdAt: Date;
}

const ChatSchema = new Schema<IChat>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    docId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true
    },
    messages: [
        {
            role: {
                type: String,
                enum: ["user", "assistant"],
                required: true
            }, // "user" = question, "assistant" = AI answer
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const Chat = mongoose.model<IChat>("Chat", ChatSchema);