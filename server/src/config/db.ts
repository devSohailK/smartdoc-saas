import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    // 1. Safety Check: Ensure URI exists before trying to connect
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    // 2. The Connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // 3. Success Log (Host is useful for debugging production clusters)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    // 4. Fatal Error Handling
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error("❌ Unknown Database Error");
    }
    // Stop the server if DB fails. A server without DB is useless.
    process.exit(1);
  }
};