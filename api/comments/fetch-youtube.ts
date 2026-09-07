/**
 * Self-contained Vercel Serverless Function for YouTube Comment Extraction.
 * Zero external relative imports - runs reliably in isolated serverless environments.
 */

interface YouTubeCommentItem {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  likes: number;
  avatarUrl?: string;
  isReply?: boolean;
}

interface YouTubeFetchResult {
  success: boolean;
  videoTitle?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  totalCommentsReported?: number;
  topLevelCount?: number;
  repliesCount?: number;
  comments?: YouTubeCommentItem[];
  error?: string;
  errorAr?: string;
  errorType?: 'INVALID_URL' | 'NO_API_KEY' | 'REFERRER_RESTRICTION' | 'COMMENTS_DISABLED' | 'VIDEO_NOT_FOUND' | 'QUOTA_EXCEEDED' | 'API_ERROR';
  solution?: string;
  solutionAr?: string;
}

function extractYouTubeVideoId(inputUrl: string): string | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;
  const trimmed = inputUrl.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }
  try {
    const patterns = [
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/i,
    ];
    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function fetchVideoOEmbed(videoId: string): Promise<{ title: string; channel: string; thumbnail: string } | null> {
  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&format=json`;
    const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
    if (res.ok) {
      const data: any = await res.json();
      return {
        title: data.title || 'YouTube Video',
        channel: data.author_name || 'YouTube Creator',
        thumbnail: data.thumbnail_url || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      };
    }
  } catch (e) {}
  return null;
}

async function fetchYouTubeCommentsDirect(
  videoId: string,
  maxFetchCount: number = 500
): Promise<YouTubeFetchResult | null> {
  try {
    const oembed = await fetchVideoOEmbed(videoId);
    let videoTitle = oembed?.title || 'YouTube Giveaway Video';
    let channelTitle = oembed?.channel || 'YouTube Creator';
    let thumbnailUrl = oembed?.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    let totalCommentsReported = 0;

    const watchRes = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!watchRes.ok) return null;

    const html = await watchRes.text();
    const innertubeApiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1] || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    const clientVersion = html.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/)?.[1] || '2.20260904.01.00';
    const tokenMatch = html.match(/"continuationCommand":\{"token":"([^"]+)"/);
    let currentToken = tokenMatch?.[1];

    if (!currentToken) {
      if (html.includes('"commentsDisabled":true')) {
        return {
          success: false,
          errorType: 'COMMENTS_DISABLED',
          videoTitle,
          channelTitle,
          thumbnailUrl,
          error: 'Comments are turned off for this video by the creator.',
          errorAr: 'ميزة التعليقات معطلة على هذا الفيديو من قِبل منشئ المحتوى.',
        };
      }
      return null;
    }

    const comments: YouTubeCommentItem[] = [];
    const replyTokens: string[] = [];
    let page = 0;
    const maxPages = Math.min(Math.ceil(maxFetchCount / 20), 25);

    function parseMutations(muts: any[], isReply: boolean = false) {
      for (const m of muts) {
        const payload = m.payload?.commentEntityPayload;
        if (payload) {
          const rawName = payload.author?.displayName || 'User';
          const username = rawName.startsWith('@') ? rawName : `@${rawName.replace(/\s+/g, '_')}`;
          const commentText = payload.properties?.content?.content || '';
          const likesRaw = payload.toolbar?.likeCountNotliked || '0';
          const likes = parseInt(String(likesRaw).replace(/\D/g, ''), 10) || 0;
          const timestamp = payload.properties?.publishedTime || 'Recent';
          const avatarUrl = payload.author?.avatarThumbnailUrl || '';

          if (commentText && !comments.some((c) => c.comment === commentText && c.username === username)) {
            comments.push({
              id: `yt_${comments.length + 1}`,
              username,
              comment: commentText,
              likes,
              timestamp,
              avatarUrl,
              isReply,
            });
          }
        }
      }
    }

    while (currentToken && page < maxPages && comments.length < maxFetchCount) {
      page++;
      const nextRes = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${innertubeApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({
          context: {
            client: {
              clientName: 'WEB',
              clientVersion,
            },
          },
          continuation: currentToken,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!nextRes.ok) break;
      const nextData: any = await nextRes.json();

      const header = nextData.onResponseReceivedEndpoints?.[0]?.reloadContinuationItemsCommand?.continuationItems?.[0]?.commentsHeaderRenderer;
      if (header?.countText?.runs) {
        const numStr = header.countText.runs.map((r: any) => r.text).join('').replace(/\D/g, '');
        if (numStr) totalCommentsReported = parseInt(numStr, 10);
      }

      const mutations = nextData.frameworkUpdates?.entityBatchUpdate?.mutations || [];
      parseMutations(mutations, false);

      const eps = nextData.onResponseReceivedEndpoints || [];
      for (const ep of eps) {
        const list = ep.reloadContinuationItemsCommand?.continuationItems || ep.appendContinuationItemsAction?.continuationItems || [];
        for (const item of list) {
          if (item.commentThreadRenderer) {
            const replies = item.commentThreadRenderer.replies?.commentRepliesRenderer?.contents;
            if (replies) {
              for (const r of replies) {
                const token = r.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token;
                if (token && !replyTokens.includes(token)) {
                  replyTokens.push(token);
                }
              }
            }
          }
        }
      }

      currentToken = undefined;
      for (const ep of eps) {
        const list = ep.reloadContinuationItemsCommand?.continuationItems || ep.appendContinuationItemsAction?.continuationItems || [];
        for (const item of list) {
          if (item.continuationItemRenderer?.continuationEndpoint?.continuationCommand?.token) {
            currentToken = item.continuationItemRenderer.continuationEndpoint.continuationCommand.token;
            break;
          }
        }
        if (currentToken) break;
      }
    }

    const topLevelCount = comments.length;

    if (replyTokens.length > 0 && comments.length < maxFetchCount) {
      for (let i = 0; i < replyTokens.length && comments.length < maxFetchCount; i += 5) {
        const batch = replyTokens.slice(i, i + 5);
        await Promise.all(
          batch.map(async (rToken) => {
            try {
              const rRes = await fetch(`https://www.youtube.com/youtubei/v1/next?key=${innertubeApiKey}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                },
                body: JSON.stringify({
                  context: { client: { clientName: 'WEB', clientVersion } },
                  continuation: rToken,
                }),
                signal: AbortSignal.timeout(8000),
              });
              if (rRes.ok) {
                const rData: any = await rRes.json();
                const rMutations = rData.frameworkUpdates?.entityBatchUpdate?.mutations || [];
                parseMutations(rMutations, true);
              }
            } catch (e) {}
          })
        );
      }
    }

    const repliesCount = Math.max(0, comments.length - topLevelCount);

    if (comments.length > 0) {
      return {
        success: true,
        videoTitle,
        channelTitle,
        thumbnailUrl,
        totalCommentsReported: totalCommentsReported || comments.length,
        topLevelCount,
        repliesCount,
        comments,
      };
    }
    return null;
  } catch (err: any) {
    return null;
  }
}

async function fetchViaDataApiV3(
  videoId: string,
  apiKey: string,
  clientReferer?: string,
  maxFetchCount: number = 500
): Promise<YouTubeFetchResult> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'User-Agent': 'RandomizerWheel-CommentPicker/1.0',
  };
  if (clientReferer) {
    headers['Referer'] = clientReferer;
  }

  let videoTitle = 'YouTube Video';
  let channelTitle = 'YouTube Creator';
  let thumbnailUrl = '';
  let totalCommentsReported = 0;

  try {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(videoId)}&key=${apiKey}`;
    const videoRes = await fetch(videoUrl, { headers });
    const videoData: any = await videoRes.json();

    if (videoData.items && videoData.items.length > 0) {
      const item = videoData.items[0];
      videoTitle = item.snippet?.title || videoTitle;
      channelTitle = item.snippet?.channelTitle || channelTitle;
      thumbnailUrl = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '';
      totalCommentsReported = parseInt(item.statistics?.commentCount || '0', 10);
    }
  } catch (e) {}

  const comments: YouTubeCommentItem[] = [];
  let nextPageToken: string | undefined = undefined;
  let pageCount = 0;
  const maxPages = Math.ceil(maxFetchCount / 100);

  try {
    do {
      pageCount++;
      const queryParams = new URLSearchParams({
        part: 'snippet',
        videoId: videoId,
        maxResults: '100',
        textFormat: 'plainText',
        key: apiKey,
      });
      if (nextPageToken) queryParams.set('pageToken', nextPageToken);

      const commentUrl = `https://www.googleapis.com/youtube/v3/commentThreads?${queryParams.toString()}`;
      const res = await fetch(commentUrl, { headers });
      const data: any = await res.json();

      if (!res.ok) {
        const errReason = data?.error?.details?.[0]?.reason || data?.error?.errors?.[0]?.reason || '';
        if (errReason === 'commentsDisabled') {
          return {
            success: false,
            errorType: 'COMMENTS_DISABLED',
            error: 'Comments are disabled on this video by the creator.',
            errorAr: 'التعليقات معطلة على هذا الفيديو من قِبل منشئ المحتوى.',
          };
        }
        return {
          success: false,
          errorType: 'API_ERROR',
          error: data?.error?.message || 'Failed to fetch comments',
          errorAr: 'حدث خطأ أثناء جلب التعليقات من YouTube.',
        };
      }

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          const topComment = item.snippet?.topLevelComment?.snippet;
          if (topComment) {
            comments.push({
              id: item.id || `yt_${comments.length + 1}`,
              username: topComment.authorDisplayName || '@user',
              comment: topComment.textDisplay || topComment.textOriginal || '',
              timestamp: topComment.publishedAt ? new Date(topComment.publishedAt).toLocaleDateString() : 'Recent',
              likes: topComment.likeCount || 0,
              avatarUrl: topComment.authorProfileImageUrl || '',
            });
          }
          if (comments.length >= maxFetchCount) break;
        }
      }
      nextPageToken = data.nextPageToken;
    } while (nextPageToken && pageCount < maxPages && comments.length < maxFetchCount);

    return {
      success: true,
      videoTitle,
      channelTitle,
      thumbnailUrl,
      totalCommentsReported: totalCommentsReported || comments.length,
      comments,
    };
  } catch (err: any) {
    return {
      success: false,
      errorType: 'API_ERROR',
      error: err?.message || 'Failed to connect to YouTube Data API',
      errorAr: 'خطأ في الاتصال بخوادم YouTube.',
    };
  }
}

async function parseBody(req: any): Promise<any> {
  if (req.body) {
    if (typeof req.body === 'object') return req.body;
    try {
      return JSON.parse(req.body);
    } catch (e) {
      return {};
    }
  }
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk: any) => {
      raw += chunk;
    });
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw));
      } catch (e) {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

export default async function handler(req: any, res: any) {
  // Universal CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
  }

  try {
    const body = await parseBody(req);
    const { url, maxResults } = body || {};

    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        success: false,
        errorType: 'INVALID_URL',
        error: 'Please enter a valid YouTube video link or Video ID.',
        errorAr: 'يرجى إدخال رابط فيديو يوتيوب أو معرّف فيديو صالح.',
      });
    }

    const videoId = extractYouTubeVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        errorType: 'INVALID_URL',
        error: 'Could not extract a valid YouTube video ID from the provided link.',
        errorAr: 'تعذر استخراج معرّف فيديو صالح من الرابط المدخل.',
      });
    }

    const count = typeof maxResults === 'number' ? Math.min(Math.max(maxResults, 10), 1000) : 500;

    // First attempt: Direct live Innertube extraction (no Google Cloud quota required)
    const directRes = await fetchYouTubeCommentsDirect(videoId, count);
    if (directRes && directRes.success && directRes.comments && directRes.comments.length > 0) {
      return res.status(200).json(directRes);
    }

    if (directRes && directRes.errorType === 'COMMENTS_DISABLED') {
      return res.status(200).json(directRes);
    }

    // Second attempt: YouTube Data API v3
    const apiKey = process.env.YOUTUBE_API_KEY || 'AIzaSyCpEo7CMEYwsJ9EVfTmYUtend5pSCNFTjc';
    const clientReferer = req.headers?.['referer'] || req.headers?.['origin'] || undefined;
    const apiRes = await fetchViaDataApiV3(videoId, apiKey, clientReferer, count);

    if (apiRes.success) {
      return res.status(200).json(apiRes);
    }

    if (directRes) {
      return res.status(200).json(directRes);
    }

    return res.status(200).json({
      success: false,
      errorType: 'API_ERROR',
      error: apiRes.error || 'Could not extract comments from this YouTube video. Please check that the video is public.',
      errorAr: apiRes.errorAr || 'تعذر استخراج التعليقات من هذا الفيديو. يرجى التأكد من أن الفيديو عام أو استخدام خيار رفع الملف.',
    });
  } catch (err: any) {
    console.error('Serverless function execution error:', err);
    return res.status(200).json({
      success: false,
      errorType: 'API_ERROR',
      error: 'An unexpected error occurred while processing YouTube comments.',
      errorAr: 'حدث خطأ غير متوقع أثناء معالجة تعليقات يوتيوب.',
    });
  }
}
