import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: "development" | "production" | "test";
  MONGO_URI: string;
  CLIENT_URL: string;
  GEMINI_API_KEY?: string;
  JWT_SECRET?: string;
}

function validateEnv(): EnvConfig {
  const required = ["MONGO_URI"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const errorMessage = 
      `\nMissing required environment variables: ${missing.join(", ")}\n` +
      `\nPlease create a .env file in the server/ directory with the following:\n` +
      `MONGO_URI=mongodb://localhost:27017/smartdoc-saas\n` +
      `(or your MongoDB connection string)\n` +
      `\nSee BACKEND_CONFIG.md for a complete template.\n`;
    
    console.error(errorMessage);
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    PORT: parseInt(process.env.PORT || "5000", 10),
    NODE_ENV: (process.env.NODE_ENV || "development") as EnvConfig["NODE_ENV"],
    MONGO_URI: process.env.MONGO_URI!,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  };
}

// Validate environment variables on import
// This will throw an error if required vars are missing, but with better error message
export const env = validateEnv();
