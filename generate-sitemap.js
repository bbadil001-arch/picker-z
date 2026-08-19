import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from './src/data/articles/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUrl = 'https://randomizerwheel.com';
const languages = ['en', 'ar', 'fr', 'es', 'zh', 'th', 'tl', 'ko', 'ja'];
const today = new Date().toISOString().split('T')[0];

const articleRoutes = (ARTICLES || []).map((art) => ({
  path: `articles/${art.slug}`,
  priority: '0.85',
  changefreq: 'monthly',
  lastmod: art.publishedDate || today,
}));

const routes = [
  { path: '', priority: '1.0', changefreq: 'daily', lastmod: today },
  { path: 'yesno', priority: '0.9', changefreq: 'daily', lastmod: today },
  { path: 'numbers', priority: '0.9', changefreq: 'daily', lastmod: today },
  { path: 'names', priority: '0.9', changefreq: 'daily', lastmod: today },
  { path: 'articles', priority: '0.9', changefreq: 'weekly', lastmod: today },
  ...articleRoutes,
  { path: 'faq', priority: '0.8', changefreq: 'weekly', lastmod: today },
  { path: 'privacy', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: 'terms', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: 'about', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: 'cookies', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: 'disclaimer', priority: '0.7', changefreq: 'monthly', lastmod: today },
  { path: 'contact', priority: '0.7', changefreq: 'monthly', lastmod: today },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .map((route) => {
    const pageUrl = route.path ? `${baseUrl}/${route.path}` : `${baseUrl}/`;
    const modDate = route.lastmod || today;
    return `  <url>
    <loc>${pageUrl}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${baseUrl}/${route.path}?lang=${l}"/>`).join('\n')}
  </url>`;
  })
  .join('\n')}
</urlset>`;

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf-8');

const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${baseUrl}/sitemap.xml\n`;
fs.writeFileSync(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf-8');

console.log('Successfully generated static sitemap.xml and robots.txt in public/');
