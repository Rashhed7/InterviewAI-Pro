import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("Checking key format...");
const userKey = process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE";
console.log("User key starts with AIzaSy:", userKey.startsWith("AIzaSy"));
console.log("User key length:", userKey.length);
