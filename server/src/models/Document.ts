import mongoose, { Document as MongooseDocument, Schema } from "mongoose";


export type DocumentStatus = "pending" | "processing" | "ready" | "failed";

export interface IDocumnet extends MongooseDocument {
    userId : mongoose.Types.ObjectId;
    filename : string;
    fileUrl : string;
    status : DocumentStatus;
    createdAt : Date;
}


const DocumentSchema = new Schema<IDocumnet>({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    }, // Link to AWS S3 / Cloudinary
    status: {
        type: String,
        enum: ["pending", "processing", "ready", "failed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const DocumentModel = mongoose.model<IDocumnet>("Document", DocumentSchema); 