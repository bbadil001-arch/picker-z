import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ARTICLES } from './src/data/articles/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtmlPath)) {
  console.error('Error: dist/index.html does not exist. Run vite build first.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

const staticRoutes = [
  'youtube-comment-picker',
  'instagram-comment-picker',
  'tiktok-comment-picker',
  'facebook-comment-picker',
  'yesno',
  'numbers',
  'names',
  'articles',
  'faq',
  'privacy',
  'terms',
  'about',
  'cookies',
  'disclaimer',
  'contact',
  ...(ARTICLES || []).map((art) => `articles/${art.slug}`),
];

console.log(`Generating static route entrypoints for ${staticRoutes.length} pages...`);

for (const route of staticRoutes) {
  // 1. Create route directory e.g. dist/youtube-comment-picker/index.html
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml, 'utf-8');

  // 2. Also create flat .html file e.g. dist/youtube-comment-picker.html for hosts that support cleanUrls
  const flatHtmlPath = path.join(distDir, `${route}.html`);
  const flatHtmlDir = path.dirname(flatHtmlPath);
  if (!fs.existsSync(flatHtmlDir)) {
    fs.mkdirSync(flatHtmlDir, { recursive: true });
  }
  fs.writeFileSync(flatHtmlPath, indexHtml, 'utf-8');
}

// 3. Ensure _redirects is copied to dist
const redirectsSrc = path.join(__dirname, 'public', '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
}

console.log('Successfully generated all static HTML route entrypoints in dist/');
