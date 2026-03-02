import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    
    if (!process.env.MONGO_URI) {
      throw new Error("❌ MONGO_URI is missing in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error("❌ Unknown Database Error");
    }
    
    process.exit(1);
  }
};