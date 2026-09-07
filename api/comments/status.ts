export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyCpEo7CMEYwsJ9EVfTmYUtend5pSCNFTjc';
  return res.status(200).json({
    youtubeConfigured: !!apiKey,
    platforms: {
      youtube: { active: !!apiKey, provider: 'YouTube Data API v3' },
      tiktok: { active: true, provider: 'Smart Extractor & File Import' },
      instagram: { active: true, provider: 'Smart Extractor & File Import' },
      facebook: { active: true, provider: 'Smart Extractor & File Import' },
    },
  });
}
