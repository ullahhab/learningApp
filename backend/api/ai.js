import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GOOGLE_API_KEY;
const genai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Assuming frontend sends { prompt: "..." }
      const { prompt } = req.body;

      const response = await genai.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      res.status(200).json({ message: "Processed successfully!", response });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } else if (req.method === "GET") {
    console.debug("API key:", JSON.stringify(apiKey));
    const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Define AI in 2 lines and fast response",
      });
    console.log("AI Resp", response.text);
    res.status(200).json({ message: "Successful response" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}