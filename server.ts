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
      
      if (apiKey) {
        try {
          const ai = new GoogleGenAI({
            apiKey,
            httpOptions: {
              headers: {
                "User-Agent": "aistudio-build",
              },
            },
          });

          const prompt = `Generate a list of exactly ${count} short, creative, and clear options for a spin wheel choice app based on this topic: "${topic}".
Language requested: ${lang === "ar" ? "Arabic" : "English"}.
Return ONLY a valid JSON array of strings, without markdown formatting, code blocks, or extra text.
Example format: ["Option 1", "Option 2", "Option 3"]`;

          const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });

          const responseText = response.text ? response.text.trim() : "";
          
          // Clean up json if wrapped in backticks
          const cleanedJson = responseText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          const options = JSON.parse(cleanedJson);

          if (Array.isArray(options) && options.length > 0) {
            return res.json({ options });
          }
        } catch (apiErr) {
          console.warn("Gemini API call failed, falling back to smart topic options:", apiErr);
        }
      }

      // Smart Fallback generator if API key is not configured or fails
      const fallbackTemplates: Record<string, string[]> = {
        ar: [
          `${topic} - خيار 1`,
          `${topic} - خيار 2`,
          `${topic} - خيار 3`,
          `${topic} - خيار 4`,
          `${topic} - خيار 5`,
          `${topic} - خيار 6`,
          `${topic} - خيار 7`,
          `${topic} - خيار 8`,
        ],
        en: [
          `${topic} - Choice 1`,
          `${topic} - Choice 2`,
          `${topic} - Choice 3`,
          `${topic} - Choice 4`,
          `${topic} - Choice 5`,
          `${topic} - Choice 6`,
          `${topic} - Choice 7`,
          `${topic} - Choice 8`,
        ],
      };

      const fallbackList = fallbackTemplates[lang] || fallbackTemplates.en;
      return res.json({ options: fallbackList });
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
