// config/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import {env} from './env.js'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY as string);

export default genAI; 