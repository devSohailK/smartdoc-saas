import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async (): Promise<void> => {
  try {
    // The Connection
    const conn = await mongoose.connect(env.MONGO_URI);

    // Success Log (Host is useful for debugging production clusters)
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    // Fatal Error Handling
    if (error instanceof Error) {
      console.error(`Database Connection Error: ${error.message}`);
    } else {
      console.error("Unknown Database Error");
    }
    // Stop the server if DB fails. A server without DB is useless.
    process.exit(1);
  }
};

