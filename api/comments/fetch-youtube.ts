import { fetchYouTubeComments, extractYouTubeVideoId } from '../../server/youtubeApi';

export default async function handler(req: any, res: any) {
  // CORS headers for serverless deployments
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      errorAr: 'طريقة الطلب غير مسموح بها، يرجى استخدام POST.',
    });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { url, maxResults } = body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        errorType: 'INVALID_URL',
        error: 'Please provide a valid YouTube video URL or ID.',
        errorAr: 'يرجى تقديم رابط أو معرّف فيديو يوتيوب صالح.',
      });
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        errorType: 'INVALID_URL',
        error: 'Could not detect a valid YouTube Video ID from the provided link.',
        errorAr: 'تعذر استخراج معرّف فيديو YouTube صالح من الرابط المدخل.',
      });
    }

    const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyCpEo7CMEYwsJ9EVfTmYUtend5pSCNFTjc';
    const clientReferer = req.headers?.['referer'] || req.headers?.['origin'] || undefined;
    const count = typeof maxResults === 'number' ? Math.min(Math.max(maxResults, 10), 1000) : 500;

    const result = await fetchYouTubeComments(videoId, apiKey, clientReferer, count);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (err: any) {
    console.error('Vercel API error:', err);
    return res.status(500).json({
      success: false,
      errorType: 'API_ERROR',
      error: err?.message || 'Server error while fetching comments',
      errorAr: 'حدث خطأ في الخادم أثناء جلب التعليقات.',
    });
  }
}
