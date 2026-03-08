
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    email : string;
    name : string;
    password : string;
    credits : number;
    plan : "free" | "pro";
    createdAt : Date;

}

const UserSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        default: 5
    }, // Free tier: 3 docs/day
    plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

export const User = mongoose.model<IUser>("User", UserSchema);


