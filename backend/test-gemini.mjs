import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const apiKey = process.env.GEMINI_API_KEY;
console.log("Using Key:", apiKey ? apiKey.substring(0, 10) + "..." : "MISSING");

const genAI = new GoogleGenerativeAI(apiKey);

async function testModels() {
  const candidates = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-pro-latest",
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-pro"
  ];

  for (const modelName of candidates) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const res = await model.generateContent("Say hello in 3 words");
      console.log(`SUCCESS [${modelName}]:`, res.response.text().trim());
      return modelName;
    } catch (err) {
      console.error(`FAILED [${modelName}]:`, err.message);
    }
  }
}

testModels();
