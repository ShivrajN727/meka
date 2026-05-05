import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
console.log("KEY =", process.env.GOOGLE_API_KEY);
export async function callGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini error:', err);
    throw new Error('Gemini failed');
  }
}

