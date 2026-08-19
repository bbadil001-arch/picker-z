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

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "RandomizerWheel" });
  });

  // XML Sitemap Endpoint
  app.get("/sitemap.xml", (req, res) => {
    const host = req.get("host") || "randomizerwheel.com";
    const protocol = req.protocol || "https";
    const baseUrl = `${protocol}://${host}`;
    const languages = ["en", "ar", "fr", "es", "zh", "th", "tl", "ko", "ja"];

    const routes = [
      { path: "", priority: "1.0", changefreq: "daily" },
      { path: "yesno", priority: "0.9", changefreq: "daily" },
      { path: "numbers", priority: "0.9", changefreq: "daily" },
      { path: "names", priority: "0.9", changefreq: "daily" },
      { path: "articles", priority: "0.9", changefreq: "weekly" },
      { path: "articles/how-randomizer-wheel-works-fairness-algorithm", priority: "0.85", changefreq: "monthly" },
      { path: "articles/how-to-run-instagram-tiktok-giveaways-raffles", priority: "0.85", changefreq: "monthly" },
      { path: "articles/10-creative-classroom-wheel-spinner-ideas-teachers", priority: "0.85", changefreq: "monthly" },
      { path: "articles/decision-making-truth-or-dare-party-games-wheel", priority: "0.85", changefreq: "monthly" },
      { path: "faq", priority: "0.8", changefreq: "weekly" },
      { path: "privacy", priority: "0.7", changefreq: "monthly" },
      { path: "terms", priority: "0.7", changefreq: "monthly" },
      { path: "about", priority: "0.7", changefreq: "monthly" },
      { path: "cookies", priority: "0.7", changefreq: "monthly" },
      { path: "disclaimer", priority: "0.7", changefreq: "monthly" },
      { path: "contact", priority: "0.7", changefreq: "monthly" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .map((route) => {
    const pageUrl = route.path ? `${baseUrl}/#/${route.path}` : `${baseUrl}/`;
    return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/?lang=${l}${route.path ? `&#47;${route.path}` : ""}"/>`).join("\n")}
  </url>`;
  })
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  });

  // robots.txt
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "randomizerwheel.com";
    const protocol = req.protocol || "https";
    const baseUrl = `${protocol}://${host}`;

    res.type("text/plain");
    res.send(`User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml`);
  });

  // API endpoint for AI Option Generator using Gemini
  app.post("/api/ai-options", async (req, res) => {
    try {
      const { topic, lang = "ar", count = 0 } = req.body || {};

      if (!topic || typeof topic !== "string" || !topic.trim()) {
        return res.status(400).json({ error: "Topic is required" });
      }

      const reqCount = Number(count) || 0;
      const apiKey = process.env.GEMINI_API_KEY;
      let generatedOptions: string[] | null = null;

      if (apiKey && apiKey.trim().length > 5) {
        const candidateModels = [
          "gemini-3.7-flash",
          "gemini-3.6-flash",
          "gemini-3.5-flash",
          "gemini-3.1-flash-lite",
        ];

        for (const modelName of candidateModels) {
          try {
            const ai = new GoogleGenAI({
              apiKey: apiKey.trim(),
              httpOptions: {
                headers: {
                  "User-Agent": "aistudio-build",
                },
              },
            });

            const countDirective = reqCount > 0
              ? `Provide exactly ${reqCount} items.`
              : `If this topic is a closed or well-defined set (for example: "countries of Africa", "US states", "Arab countries", "months", "zodiac signs", etc.), provide ALL elements of the entire set without omitting any. Otherwise provide a comprehensive, high-quality list of 20 to 30 rich choices.`;

            const prompt = `You are a generator for a spin wheel & decision-maker application.
Topic: "${topic.trim()}"
Language: ${lang === "ar" ? "Arabic" : "English"}
Quantity: ${countDirective}

Rules:
- Give clean, accurate, distinct names or entries.
- Return ONLY a JSON array of strings: ["Item 1", "Item 2", "Item 3", ...]
- Do NOT include markdown code blocks, backticks, or any preamble or explanation.`;

            const response = await ai.models.generateContent({
              model: modelName,
              contents: prompt,
            });

            const rawText = response.text ? response.text.trim() : "";
            if (rawText) {
              const cleaned = rawText
                .replace(/^```(json)?/gi, "")
                .replace(/```$/g, "")
                .trim();

              try {
                const parsed = JSON.parse(cleaned);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  generatedOptions = parsed
                    .map((item) => String(item).trim())
                    .filter((item) => item.length > 0);
                  if (generatedOptions.length > 0) {
                    break; // Success!
                  }
                }
              } catch {
                // If not strict JSON, parse line-by-line
                const lines = rawText
                  .split("\n")
                  .map((l) => l.replace(/^(\d+[\.\)\-:]\s*|[\*\-•]\s*|["'\[\],])/g, "").trim())
                  .filter((l) => l.length > 0 && !l.startsWith("{") && !l.startsWith("}"));

                if (lines.length >= 2) {
                  generatedOptions = lines;
                  break;
                }
              }
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} failed:`, modelErr?.message || modelErr);
          }
        }
      }

      if (generatedOptions && generatedOptions.length > 0) {
        if (reqCount > 0) {
          return res.json({ options: generatedOptions.slice(0, reqCount) });
        }
        return res.json({ options: generatedOptions });
      }

      // Fallback generator when API key is missing or model endpoint is unreachable
      const lower = topic.toLowerCase();
      const isAr = lang === "ar";

      // Built-in intelligent options for common topics (Complete sets)
      if (lower.includes("africa") || lower.includes("افريقيا") || lower.includes("إفريقيا")) {
        const africa = isAr
          ? [
              "الجزائر", "أنغولا", "بنين", "بوتسوانا", "بوركينا فاسو", "بوروندي", "الرأس الأخضر",
              "الكاميرون", "إفريقيا الوسطى", "تشاد", "جزر القمر", "الكونغو الديمقراطية", "جمهورية الكونغو",
              "جيبوتي", "مصر", "غينيا الاستوائية", "إريتريا", "إسواتيني", "إثيوبيا", "الغابون",
              "غامبيا", "غانا", "غينيا", "غينيا بيساو", "كوت ديفوار", "كينيا", "ليسوتو", "ليبيريا",
              "ليبيا", "مدغشقر", "مالاوي", "مالي", "موريتانيا", "موريشيوس", "المغرب", "موزمبيق",
              "ناميبيا", "النيجر", "نيجيريا", "رواندا", "ساو تومي", "السنغال", "سيشل",
              "سيراليون", "الصومال", "جنوب إفريقيا", "جنوب السودان", "السودان", "تنزانيا", "توغو",
              "تونس", "أوغندا", "زامبيا", "زيمبابوي"
            ]
          : [
              "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde",
              "Cameroon", "Central African Republic", "Chad", "Comoros", "DR Congo", "Republic of the Congo",
              "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon",
              "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia",
              "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique",
              "Namibia", "Niger", "Nigeria", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles",
              "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo",
              "Tunisia", "Uganda", "Zambia", "Zimbabwe"
            ];
        return res.json({ options: reqCount > 0 ? africa.slice(0, reqCount) : africa });
      }

      if (lower.includes("arab") || lower.includes("عرب") || lower.includes("الوطن العربي")) {
        const arab = isAr
          ? [
              "المملكة العربية السعودية", "مصر", "الإمارات العربية المتحدة", "المغرب", "قطر", "الكويت",
              "الأردن", "سلطنة عُمان", "البحرين", "تونس", "الجزائر", "لبنان", "العراق", "سوريا",
              "فلسطين", "اليمن", "السودان", "ليبيا", "موريتانيا", "الصومال", "جيبوتي", "جزر القمر"
            ]
          : [
              "Saudi Arabia", "Egypt", "UAE", "Morocco", "Qatar", "Kuwait", "Jordan", "Oman",
              "Bahrain", "Tunisia", "Algeria", "Lebanon", "Iraq", "Syria", "Palestine", "Yemen",
              "Sudan", "Libya", "Mauritania", "Somalia", "Djibouti", "Comoros"
            ];
        return res.json({ options: reqCount > 0 ? arab.slice(0, reqCount) : arab });
      }

      if (lower.includes("asia") || lower.includes("اسيا") || lower.includes("آسيا")) {
        const asia = isAr
          ? ["اليابان", "كوريا الجنوبية", "الصين", "الهند", "تايلاند", "السعودية", "الإمارات", "إندونيسيا", "سنغافورة", "ماليزيا", "الفلبين", "تركيا", "فيتنام", "باكستان", "عُمان", "قطر", "الكويت"]
          : ["Japan", "South Korea", "China", "India", "Thailand", "Saudi Arabia", "UAE", "Indonesia", "Singapore", "Malaysia", "Philippines", "Turkey", "Vietnam", "Pakistan", "Oman", "Qatar", "Kuwait"];
        return res.json({ options: reqCount > 0 ? asia.slice(0, reqCount) : asia });
      }

      if (lower.includes("europe") || lower.includes("اوروبا") || lower.includes("أوروبا")) {
        const europe = isAr
          ? ["فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "المملكة المتحدة", "سويسرا", "هولندا", "اليونان", "النرويج", "السويد", "البرتغال", "النمسا", "بلجيكا", "الدنمارك", "فنلندا", "أيرلندا", "بولندا", "التشيك"]
          : ["France", "Germany", "Italy", "Spain", "United Kingdom", "Switzerland", "Netherlands", "Greece", "Norway", "Sweden", "Portugal", "Austria", "Belgium", "Denmark", "Finland", "Ireland", "Poland", "Czech Republic"];
        return res.json({ options: reqCount > 0 ? europe.slice(0, reqCount) : europe });
      }

      if (lower.includes("food") || lower.includes("eat") || lower.includes("طعام") || lower.includes("أكل") || lower.includes("عشاء")) {
        const food = isAr
          ? ["بيتزا إيطالية", "سوشي طازج", "تاكو مكسيكي", "برجر مشوي", "كاري تايلاندي", "نودلز رامن", "مشويات على الفحم", "شاورما عربي", "باستا ثمار البحر", "ستيك ريب آي", "دجاج بروستد", "فلافل وحمص", "برياني لحم", "مشاوي مشكلة"]
          : ["Italian Pizza", "Fresh Sushi", "Mexican Tacos", "Gourmet Burger", "Thai Curry", "Ramen Noodles", "BBQ Mixed Grill", "Shawarma Wrap", "Seafood Pasta", "Ribeye Steak", "Crispy Chicken", "Falafel Plate", "Biryani", "Kebab"];
        return res.json({ options: reqCount > 0 ? food.slice(0, reqCount) : food });
      }

      // Default procedural generator
      const clean = topic.trim();
      const defaultCount = reqCount > 0 ? reqCount : 20;
      const generic = isAr
        ? Array.from({ length: defaultCount }, (_, i) => `${clean} - خيار ${i + 1}`)
        : Array.from({ length: defaultCount }, (_, i) => `${clean} - Choice ${i + 1}`);

      return res.json({ options: generic });
    } catch (err: any) {
      console.error("AI options generation error:", err);
      return res.status(200).json({
        options: [
          `${req.body?.topic || "Option"} 1`,
          `${req.body?.topic || "Option"} 2`,
          `${req.body?.topic || "Option"} 3`,
          `${req.body?.topic || "Option"} 4`,
        ],
      });
    }
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
