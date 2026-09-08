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

const baseIndexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
const baseUrl = 'https://randomizerwheel.com';

// Known static routes metadata
const staticRouteMeta = {
  'youtube-comment-picker': {
    title: 'YouTube Comment Picker - Random Winner Generator | RandomizerWheel',
    desc: 'Pick random winners from YouTube video comments for giveaways and contests. 100% fair, transparent, and free.',
    type: 'WebApplication',
  },
  'instagram-comment-picker': {
    title: 'Instagram Comment Picker - Giveaway Winner Generator | RandomizerWheel',
    desc: 'Free Instagram comment picker for giveaways, raffles, and contests. Select random winners from posts and reels.',
    type: 'WebApplication',
  },
  'tiktok-comment-picker': {
    title: 'TikTok Comment Picker - Random Raffle & Contest Picker | RandomizerWheel',
    desc: 'Pick random winners from TikTok video comments for live giveaways and contests. Fast, fair, and free.',
    type: 'WebApplication',
  },
  'facebook-comment-picker': {
    title: 'Facebook Comment Picker - Live Contest & Raffle Spinner | RandomizerWheel',
    desc: 'Fair random winner selector for Facebook page posts, contest comments, and live event draws.',
    type: 'WebApplication',
  },
  yesno: {
    title: 'Yes or No Wheel - Instant Decision Spinner | RandomizerWheel',
    desc: 'Spin the Yes or No Wheel for instant answers to any decision. 100% fair, unbiased, and fast decision maker.',
    type: 'WebApplication',
  },
  numbers: {
    title: 'Random Number Generator Wheel (1-100+) | RandomizerWheel',
    desc: 'Customizable random number generator with wheel animation, range selection, and duplicate elimination.',
    type: 'WebApplication',
  },
  names: {
    title: 'Random Name Picker Wheel - Classroom & Team Generator | RandomizerWheel',
    desc: 'Pick random student names and team members fairly with customizable colors and sound effects.',
    type: 'WebApplication',
  },
  articles: {
    title: 'Guides, Tutorials & Strategies | RandomizerWheel Blog',
    desc: 'Explore in-depth guides on giveaway strategies, classroom engagement, decision making, and randomness math.',
    type: 'CollectionPage',
  },
  sitemap: {
    title: 'Complete Site Directory & All Links (HTML Sitemap) | RandomizerWheel',
    desc: 'Browse all interactive spin wheel tools, social comment pickers, comprehensive guides, and legal resources.',
    type: 'WebPage',
  },
  faq: {
    title: 'Frequently Asked Questions (FAQ) | RandomizerWheel',
    desc: 'Find answers to common questions about RandomizerWheel features, fairness algorithms, and custom options.',
    type: 'FAQPage',
  },
  privacy: {
    title: 'Privacy Policy | RandomizerWheel',
    desc: 'Learn how RandomizerWheel protects your privacy and personal data in compliance with GDPR and CCPA.',
    type: 'WebPage',
  },
  terms: {
    title: 'Terms of Service | RandomizerWheel',
    desc: 'Review the terms and conditions for utilizing RandomizerWheel free web tools and spin services.',
    type: 'WebPage',
  },
  about: {
    title: 'About Us | RandomizerWheel',
    desc: 'Learn about the mission, team, and physics simulation technology powering RandomizerWheel.',
    type: 'AboutPage',
  },
  cookies: {
    title: 'Cookie Policy | RandomizerWheel',
    desc: 'Information regarding local browser storage and cookie practices on RandomizerWheel.',
    type: 'WebPage',
  },
  disclaimer: {
    title: 'Disclaimer | RandomizerWheel',
    desc: 'Legal disclaimers regarding simulated randomness and recreational tool use on RandomizerWheel.',
    type: 'WebPage',
  },
  contact: {
    title: 'Contact Us & Support | RandomizerWheel',
    desc: 'Get in touch with the RandomizerWheel support team for inquiries, feedback, or assistance.',
    type: 'ContactPage',
  },
};

const staticRoutes = [
  ...Object.keys(staticRouteMeta),
  ...(ARTICLES || []).map((art) => `articles/${art.slug}`),
];

console.log(`Generating SEO-optimized static route entrypoints for ${staticRoutes.length} pages...`);

function renderPageHtml(route) {
  let title = 'RandomizerWheel | Custom Spin Wheel & Random Name Picker';
  let desc = 'RandomizerWheel is the ultimate free customizable spin wheel spinner and random name picker for giveaways, raffles, decisions, and games.';
  let canonicalUrl = `${baseUrl}/${route}`;
  let schemaSnippet = '';

  if (staticRouteMeta[route]) {
    title = staticRouteMeta[route].title;
    desc = staticRouteMeta[route].desc;
    schemaSnippet = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${staticRouteMeta[route].type}",
  "name": "${title.replace(/"/g, '\\"')}",
  "description": "${desc.replace(/"/g, '\\"')}",
  "url": "${canonicalUrl}"
}
</script>`;
  } else if (route.startsWith('articles/')) {
    const slug = route.replace('articles/', '');
    const art = (ARTICLES || []).find((a) => a.slug === slug);
    if (art) {
      title = `${art.title.en} | RandomizerWheel`;
      desc = art.description.en;
      schemaSnippet = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${art.title.en.replace(/"/g, '\\"')}",
  "description": "${art.description.en.replace(/"/g, '\\"')}",
  "datePublished": "${art.publishedDate}T00:00:00Z",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${canonicalUrl}"
  },
  "publisher": {
    "@type": "Organization",
    "name": "RandomizerWheel",
    "url": "${baseUrl}"
  }
}
</script>`;
    }
  }

  let html = baseIndexHtml;

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // Replace Description
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${desc}" />`);

  // Replace Canonical
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace OG Tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i, `<meta property="og:description" content="${desc}" />`);
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace Twitter Tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:title" content="${title}" />`);
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:description" content="${desc}" />`);
  html = html.replace(/<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  // Inject Schema
  if (schemaSnippet) {
    html = html.replace('</head>', `${schemaSnippet}\n</head>`);
  }

  return html;
}

for (const route of staticRoutes) {
  const customizedHtml = renderPageHtml(route);

  // 1. Create route directory e.g. dist/youtube-comment-picker/index.html
  const routeDir = path.join(distDir, route);
  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }
  fs.writeFileSync(path.join(routeDir, 'index.html'), customizedHtml, 'utf-8');

  // 2. Also create flat .html file e.g. dist/youtube-comment-picker.html for hosts that support cleanUrls
  const flatHtmlPath = path.join(distDir, `${route}.html`);
  const flatHtmlDir = path.dirname(flatHtmlPath);
  if (!fs.existsSync(flatHtmlDir)) {
    fs.mkdirSync(flatHtmlDir, { recursive: true });
  }
  fs.writeFileSync(flatHtmlPath, customizedHtml, 'utf-8');
}

// 3. Ensure _redirects is copied to dist
const redirectsSrc = path.join(__dirname, 'public', '_redirects');
if (fs.existsSync(redirectsSrc)) {
  fs.copyFileSync(redirectsSrc, path.join(distDir, '_redirects'));
}

console.log('Successfully generated all SEO-optimized static HTML route entrypoints in dist/');
