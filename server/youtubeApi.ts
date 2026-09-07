/**
 * Real YouTube Data API v3 integration for comment extraction and giveaway draws.
 * Securely calls Google APIs server-side without exposing keys to clients.
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
    // Regex for standard formats
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
 * Fetches real comments from YouTube Data API v3.
 */
export async function fetchYouTubeComments(
  videoId: string,
  apiKey: string,
  clientReferer?: string,
  maxFetchCount: number = 500
): Promise<YouTubeFetchResult> {
  if (!apiKey) {
    return {
      success: false,
      errorType: 'NO_API_KEY',
      error: 'YouTube API Key is not configured on the server.',
      errorAr: 'مفتاح YouTube API غير معرّف على الخادم.',
      solution: 'Define YOUTUBE_API_KEY in your environment variables.',
      solutionAr: 'قم بإضافة متغير YOUTUBE_API_KEY في إعدادات البيئة.',
    };
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'User-Agent': 'RandomizerWheel-CommentPicker/1.0',
  };

  if (clientReferer) {
    headers['Referer'] = clientReferer;
  }

  let videoTitle = 'YouTube Giveaway Video';
  let channelTitle = 'YouTube Creator';
  let thumbnailUrl = '';
  let totalCommentsReported = 0;

  // 1. Fetch Video Details
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

  // 2. Fetch Comments (Pagination support)
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
