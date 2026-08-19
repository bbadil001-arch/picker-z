import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory sliding window rate limiter for anti-abuse and DDoS protection
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 40; // Max 40 requests/minute per IP

function apiRateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "unknown-ip";
  const now = Date.now();

  const record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    res.setHeader("Retry-After", Math.ceil((record.resetTime - now) / 1000));
    return res.status(429).json({
      error: "Too many requests. Please slow down and try again in a minute.",
    });
  }

  record.count++;
  next();
}

// Clean up stale rate limiter memory every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Anti-XSS and input sanitization helper
function sanitizeInput(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "") // Strip raw tag brackets
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Strip control characters
    .trim()
    .slice(0, 120); // Cap length to 120 chars
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security: Remove Express identity header
  app.disable("x-powered-by");

  // Security: Strict payload size limiter to prevent memory exhaustion attacks
  app.use(express.json({ limit: "25kb" }));

  // Security: Comprehensive HTTP Security Headers Middleware
  app.use((req, res, next) => {
    // Prevent MIME-sniffing
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Clickjacking protection (ALLOW-FROM / SAMEORIGIN)
    res.setHeader("X-Frame-Options", "SAMEORIGIN");

    // XSS Protection for legacy browsers
    res.setHeader("X-XSS-Protection", "1; mode=block");

    // Strict Referrer Policy
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

    // Restrict unauthorized browser sensor/hardware APIs
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");

    // Content Security Policy (allows Google Fonts, inline Tailwind/Vite runtime, local API)
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; media-src 'self' data: blob:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com;"
    );

    next();
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "RandomizerWheel", secure: true });
  });

  // XML Sitemap Endpoint with Clean URLs (No #)
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
    const pageUrl = route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`;
    return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${route.path}?lang=${l}"/>`).join("\n")}
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

  // API endpoint for AI Option Generator using Gemini (Protected with Rate Limiter & Sanitization)
  app.post("/api/ai-options", apiRateLimiter, async (req, res) => {
    try {
      const { topic, lang = "ar", count = 0 } = req.body || {};

      const sanitizedTopic = sanitizeInput(String(topic || ""));
      if (!sanitizedTopic) {
        return res.status(400).json({ error: "A valid topic string is required (max 120 characters)." });
      }

      // Whitelist language parameter
      const allowedLangs = ["en", "ar", "fr", "es", "zh", "th", "tl", "ko", "ja"];
      const validatedLang = allowedLangs.includes(String(lang)) ? String(lang) : "en";

      // Bound count parameter
      const reqCount = Math.min(Math.max(Number(count) || 0, 0), 50);
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

            const prompt = `You are a safe generator for a spin wheel & decision-maker application.
Topic: "${sanitizedTopic}"
Language: ${validatedLang === "ar" ? "Arabic" : "English"}
Quantity: ${countDirective}

Rules:
- Give clean, appropriate, distinct names or entries.
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
                    .map((item) => sanitizeInput(String(item)))
                    .filter((item) => item.length > 0);
                  if (generatedOptions.length > 0) {
                    break; // Success!
                  }
                }
              } catch {
                // If not strict JSON, parse line-by-line safely
                const lines = rawText
                  .split("\n")
                  .map((l) => sanitizeInput(l.replace(/^(\d+[\.\)\-:]\s*|[\*\-•]\s*|["'\[\],])/g, "")))
                  .filter((l) => l.length > 0 && !l.startsWith("{") && !l.startsWith("}"));

                if (lines.length >= 2) {
                  generatedOptions = lines;
                  break;
                }
              }
            }
          } catch (modelErr: any) {
            console.warn(`Model ${modelName} fallback triggered:`, modelErr?.message || "model error");
          }
        }
      }

      if (generatedOptions && generatedOptions.length > 0) {
        if (reqCount > 0) {
          return res.json({ options: generatedOptions.slice(0, reqCount) });
        }
        return res.json({ options: generatedOptions });
      }

      // Safe built-in fallback generator
      const lower = sanitizedTopic.toLowerCase();
      const isAr = validatedLang === "ar";

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

      // Default safe procedural generator
      const defaultCount = reqCount > 0 ? reqCount : 20;
      const generic = isAr
        ? Array.from({ length: defaultCount }, (_, i) => `${sanitizedTopic} - خيار ${i + 1}`)
        : Array.from({ length: defaultCount }, (_, i) => `${sanitizedTopic} - Choice ${i + 1}`);

      return res.json({ options: generic });
    } catch (err: any) {
      // Never expose error stack traces
      return res.status(200).json({
        options: [
          `Option 1`,
          `Option 2`,
          `Option 3`,
          `Option 4`,
        ],
      });
    }
  });

  // Vite development server or static serving (SPA fallback)
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
    console.log(`RandomizerWheel server running securely on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
