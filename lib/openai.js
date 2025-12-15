// app/lib/openai.js
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  // This will show up in your terminal when dev server starts
  throw new Error("OPENAI_API_KEY is not set in .env.local");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
