import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI Option Generator using Gemini
  app.post("/api/ai-options", async (req, res) => {
    try {
      const { topic, lang = "ar", count = 8 } = req.body;

      if (!topic || typeof topic !== "string") {
        return res.status(400).json({ error: "Topic is required" });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "GEMINI_API_KEY is not configured",
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Generate a list of exactly ${count} short, creative, and clear options for a spin wheel choice app based on this topic: "${topic}".
Language requested: ${lang === "ar" ? "Arabic" : "English"}.
Return ONLY a valid JSON array of strings, without markdown formatting, code blocks, or extra text.
Example format: ["الخيار 1", "الخيار 2", "الخيار 3"]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text ? response.text.trim() : "";
      
      // Clean up json if wrapped in backticks
      const cleanedJson = responseText
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const options = JSON.parse(cleanedJson);

      if (!Array.isArray(options)) {
        throw new Error("Response was not an array");
      }

      return res.json({ options });
    } catch (err: any) {
      console.error("AI options generation error:", err);
      return res.status(500).json({
        error: "Failed to generate options using AI",
        details: err?.message || String(err),
      });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "RandomizerWheel" });
  });

  // Vite development server or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RandomizerWheel server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
