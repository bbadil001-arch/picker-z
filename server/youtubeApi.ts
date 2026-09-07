/**
 * Real YouTube Data API v3 and Direct Innertube Integration for comment extraction and giveaway draws.
 * Securely calls YouTube server-side with zero exposure to clients.
 */

export interface YouTubeCommentItem {
  id: string;
  username: string;
  comment: string;
  timestamp: string;
  likes: number;
  avatarUrl?: string;
}

export interface YouTubeFetchResult {
  success: boolean;
  videoTitle?: string;
  channelTitle?: string;
  thumbnailUrl?: string;
  totalCommentsReported?: number;
  comments?: YouTubeCommentItem[];
  error?: string;
  errorAr?: string;
  errorType?: 'INVALID_URL' | 'NO_API_KEY' | 'REFERRER_RESTRICTION' | 'COMMENTS_DISABLED' | 'VIDEO_NOT_FOUND' | 'QUOTA_EXCEEDED' | 'API_ERROR';
  solution?: string;
  solutionAr?: string;
}

/**
 * Extracts YouTube Video ID from any standard URL format or direct ID.
 */
export function extractYouTubeVideoId(inputUrl: string): string | null {
  if (!inputUrl || typeof inputUrl !== 'string') return null;

  const trimmed = inputUrl.trim();

  // If already an 11-char ID
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

/**
 * Fetches Video Metadata via YouTube oEmbed (Fast, reliable, zero keys needed)
 */
export async function fetchVideoOEmbed(videoId: string): Promise<{ title: string; channel: string; thumbnail: string } | null> {
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
  } catch (e) {
    // Ignore oembed failure, fallback to defaults
  }
  return null;
}

/**
 * Direct YouTube Innertube Extractor
 * Extracts real comments directly from public YouTube videos without API key restrictions.
 */
export async function fetchYouTubeCommentsDirect(
  videoId: string,
  maxFetchCount: number = 500
): Promise<YouTubeFetchResult | null> {
  try {
    const oembed = await fetchVideoOEmbed(videoId);
    let videoTitle = oembed?.title || 'YouTube Giveaway Video';
    let channelTitle = oembed?.channel || 'YouTube Creator';
    let thumbnailUrl = oembed?.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    let totalCommentsReported = 0;

    // Fetch video watch page to acquire Innertube keys and initial comment token
    const watchRes = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9,ar;q=0.8',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!watchRes.ok) {
      return null;
    }

    const html = await watchRes.text();

    const innertubeApiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1] || 'AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8';
    const clientVersion = html.match(/"INNERTUBE_CONTEXT_CLIENT_VERSION":"([^"]+)"/)?.[1] || '2.20260904.01.00';
    const tokenMatch = html.match(/"continuationCommand":\{"token":"([^"]+)"/);
    let currentToken = tokenMatch?.[1];

    if (!currentToken) {
      // If no continuation token, check if comments are disabled or video unplayable
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
    let page = 0;
    const maxPages = Math.min(Math.ceil(maxFetchCount / 20), 12);

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

      // Extract comment header count text if available
      const header = nextData.onResponseReceivedEndpoints?.[0]?.reloadContinuationItemsCommand?.continuationItems?.[0]?.commentsHeaderRenderer;
      if (header?.countText?.runs) {
        const numStr = header.countText.runs.map((r: any) => r.text).join('').replace(/\D/g, '');
        if (numStr) totalCommentsReported = parseInt(numStr, 10);
      }

      // Parse comment mutations
      const mutations = nextData.frameworkUpdates?.entityBatchUpdate?.mutations || [];
      for (const m of mutations) {
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
            });
          }
        }
      }

      // Find next pagination continuation token
      currentToken = undefined;
      const eps = nextData.onResponseReceivedEndpoints || [];
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

    if (comments.length > 0) {
      return {
        success: true,
        videoTitle,
        channelTitle,
        thumbnailUrl,
        totalCommentsReported: totalCommentsReported || comments.length,
        comments,
      };
    }

    return null;
  } catch (err: any) {
    console.warn('YouTube direct extraction note:', err?.message);
    return null;
  }
}

/**
 * Fetches comments via Google YouTube Data API v3.
 */
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

  let videoTitle = 'YouTube Giveaway Video';
  let channelTitle = 'YouTube Creator';
  let thumbnailUrl = '';
  let totalCommentsReported = 0;

  try {
    const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${encodeURIComponent(videoId)}&key=${apiKey}`;
    const videoRes = await fetch(videoUrl, { headers });
    const videoData: any = await videoRes.json();

    if (!videoRes.ok) {
      const errReason = videoData?.error?.details?.[0]?.reason || videoData?.error?.errors?.[0]?.reason || '';
      const errMsg = videoData?.error?.message || 'Failed to fetch video details';

      if (errReason === 'API_KEY_HTTP_REFERRER_BLOCKED' || errMsg.includes('Requests from referer')) {
        return {
          success: false,
          errorType: 'REFERRER_RESTRICTION',
          error: 'Google Cloud blocked this request due to HTTP Referrer restriction on your API key.',
          errorAr: 'تم حظر الطلب لأن مفتاح YouTube API محمي بقيود النطاق (HTTP Referrer Restriction) في Google Cloud Console.',
          solution: 'In Google Cloud Console -> APIs & Services -> Credentials -> Click your API Key -> Under "Application restrictions", choose "None" (or add your current application domains).',
          solutionAr: 'لحل المشكلة: اذهب إلى Google Cloud Console > Credentials > اضغط على المفتاح > في خيار Application restrictions اختر "None" (أو أضف نطاقات التطبيق).',
        };
      }

      if (errReason === 'quotaExceeded') {
        return {
          success: false,
          errorType: 'QUOTA_EXCEEDED',
          error: 'YouTube Data API daily quota exceeded.',
          errorAr: 'تم تجاوز الحصة اليومية لمفتاح YouTube Data API.',
        };
      }
    }

    if (videoData.items && videoData.items.length > 0) {
      const item = videoData.items[0];
      videoTitle = item.snippet?.title || videoTitle;
      channelTitle = item.snippet?.channelTitle || channelTitle;
      thumbnailUrl = item.snippet?.thumbnails?.medium?.url || item.snippet?.thumbnails?.default?.url || '';
      totalCommentsReported = parseInt(item.statistics?.commentCount || '0', 10);
    } else {
      return {
        success: false,
        errorType: 'VIDEO_NOT_FOUND',
        error: 'YouTube video not found. Please check that the URL or Video ID is correct and publicly accessible.',
        errorAr: 'لم يتم العثور على الفيديو. يرجى التأكد من صحة الرابط وأن الفيديو عام وغير خاص.',
      };
    }
  } catch (err: any) {
    console.warn('YouTube video metadata fetch error:', err?.message);
  }

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

      if (nextPageToken) {
        queryParams.set('pageToken', nextPageToken);
      }

      const commentUrl = `https://www.googleapis.com/youtube/v3/commentThreads?${queryParams.toString()}`;
      const res = await fetch(commentUrl, { headers });
      const data: any = await res.json();

      if (!res.ok) {
        const errReason = data?.error?.details?.[0]?.reason || data?.error?.errors?.[0]?.reason || '';
        const errMsg = data?.error?.message || 'Failed to fetch comments';

        if (errReason === 'API_KEY_HTTP_REFERRER_BLOCKED' || errMsg.includes('Requests from referer')) {
          return {
            success: false,
            errorType: 'REFERRER_RESTRICTION',
            error: 'Google Cloud blocked this request due to HTTP Referrer restriction on your API key.',
            errorAr: 'تم حظر الطلب لأن مفتاح YouTube API محمي بقيود النطاق (HTTP Referrer Restriction) في Google Cloud Console.',
            solution: 'In Google Cloud Console -> APIs & Services -> Credentials -> Click your API Key -> Under "Application restrictions", choose "None" (or add your current application domains).',
            solutionAr: 'لحل المشكلة: اذهب إلى Google Cloud Console > Credentials > اضغط على المفتاح > في خيار Application restrictions اختر "None" (أو أضف نطاقات التطبيق).',
          };
        }

        if (errReason === 'commentsDisabled') {
          return {
            success: false,
            errorType: 'COMMENTS_DISABLED',
            error: 'Comments are disabled on this video by the creator.',
            errorAr: 'التعليقات معطلة على هذا الفيديو من قِبل منشئ المحتوى.',
          };
        }

        if (errReason === 'quotaExceeded') {
          return {
            success: false,
            errorType: 'QUOTA_EXCEEDED',
            error: 'YouTube API daily quota exceeded.',
            errorAr: 'تم استهلاك الحصة اليومية المسموحة لـ YouTube API.',
          };
        }

        return {
          success: false,
          errorType: 'API_ERROR',
          error: errMsg,
          errorAr: 'حدث خطأ أثناء جلب التعليقات من YouTube.',
        };
      }

      if (data.items && Array.isArray(data.items)) {
        for (const item of data.items) {
          const topComment = item.snippet?.topLevelComment?.snippet;
          if (topComment) {
            comments.push({
              id: item.id || `yt_${comments.length + 1}`,
              username: topComment.authorDisplayName || '@unknown_user',
              comment: topComment.textDisplay || topComment.textOriginal || '',
              timestamp: topComment.publishedAt ? new Date(topComment.publishedAt).toLocaleDateString() : 'Recent',
              likes: topComment.likeCount || 0,
              avatarUrl: topComment.authorProfileImageUrl || '',
            });
          }

          if (comments.length >= maxFetchCount) {
            break;
          }
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
  } catch (fetchErr: any) {
    return {
      success: false,
      errorType: 'API_ERROR',
      error: fetchErr?.message || 'Network error while contacting YouTube',
      errorAr: 'خطأ في الاتصال بخوادم YouTube.',
    };
  }
}

/**
 * Master YouTube comment fetcher:
 * 1. Tries Direct Innertube Extraction (fast, zero key configuration, reliable for public videos).
 * 2. If needed, falls back to YouTube Data API v3.
 */
export async function fetchYouTubeComments(
  videoId: string,
  apiKey: string,
  clientReferer?: string,
  maxFetchCount: number = 500
): Promise<YouTubeFetchResult> {
  // Strategy 1: Direct YouTube Live Comment Extractor
  const directResult = await fetchYouTubeCommentsDirect(videoId, maxFetchCount);
  if (directResult && directResult.success && directResult.comments && directResult.comments.length > 0) {
    return directResult;
  }

  // If comments were explicitly disabled on this video, return that directly
  if (directResult && directResult.errorType === 'COMMENTS_DISABLED') {
    return directResult;
  }

  // Strategy 2: Official YouTube Data API v3
  if (apiKey) {
    const apiResult = await fetchViaDataApiV3(videoId, apiKey, clientReferer, maxFetchCount);
    if (apiResult.success) {
      return apiResult;
    }
    // If API returned a specific restriction error and direct also had no comments
    if (apiResult.errorType === 'REFERRER_RESTRICTION' && directResult?.comments?.length) {
      return directResult;
    }
    if (apiResult.errorType === 'REFERRER_RESTRICTION') {
      return apiResult;
    }
  }

  // If direct returned a result even if 0 comments or metadata
  if (directResult) {
    return directResult;
  }

  return {
    success: false,
    errorType: 'API_ERROR',
    error: 'Could not extract comments from this YouTube video. Please check that the video is public or upload a comments file.',
    errorAr: 'تعذر استخراج التعليقات من هذا الرابط. يرجى التأكد من أن الفيديو عام أو استخدام خيار رفع ملف التعليقات.',
  };
}
