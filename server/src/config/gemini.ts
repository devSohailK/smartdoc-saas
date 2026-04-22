// config/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "./env.js";

if (!env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is missing in environment configuration.");
}

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

export default genAI;