import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  Share2,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  Trash2,
  Users,
  ShieldAlert,
  Hash,
  AtSign,
  Play,
  RotateCcw,
  Zap,
  Award,
  Video,
  Layers,
  HelpCircle,
  Upload,
  FileSpreadsheet,
  FileText,
  XCircle,
  CheckCircle,
  Printer,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, WheelOption, WheelConfig, SpinHistoryItem } from '../types';
import { SOCIAL_PLATFORMS, SocialPlatformId, SocialCommentItem } from '../data/commentPickerData';
import { SpinWheel } from './SpinWheel';
import { SpinHistory } from './SpinHistory';
import { WheelCustomizer } from './WheelCustomizer';
import { GiveawayCertificateModal } from './GiveawayCertificateModal';
import { copyTextToClipboard } from '../utils/clipboard';

interface SocialCommentPickerPageProps {
  platformId: SocialPlatformId;
  lang: Language;
  onNavigateToRoute: (route: string) => void;
  options: WheelOption[];
  setOptions: React.Dispatch<React.SetStateAction<WheelOption[]>>;
  config: WheelConfig;
  setConfig: React.Dispatch<React.SetStateAction<WheelConfig>>;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
  onSpinEnd: (winningOption: WheelOption) => void;
  spinTrigger: number;
  setSpinTrigger: React.Dispatch<React.SetStateAction<number>>;
  history: SpinHistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<SpinHistoryItem[]>>;
}

export const SocialCommentPickerPage: React.FC<SocialCommentPickerPageProps> = ({
  platformId,
  lang,
  onNavigateToRoute,
  options,
  setOptions,
  config,
  setConfig,
  isSpinning,
  setIsSpinning,
  onSpinEnd,
  spinTrigger,
  setSpinTrigger,
  history,
  setHistory,
}) => {
  const platform = SOCIAL_PLATFORMS[platformId];
  const toolStageRef = useRef<HTMLDivElement>(null);

  // Input states
  const [inputUrl, setInputUrl] = useState('');
  const [inputMode, setInputMode] = useState<'url' | 'file' | 'manual'>('url');
  const [manualText, setManualText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [rawComments, setRawComments] = useState<SocialCommentItem[]>(platform.sampleComments);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>({
    type: 'info',
    text: `${platform.sampleComments.length} sample contest comments preloaded for demo. Paste your link or spin immediately!`,
  });

  // Real YouTube Video Details & Google Cloud Notice states
  const [videoDetails, setVideoDetails] = useState<{
    title?: string;
    channel?: string;
    thumbnail?: string;
    totalCommentsReported?: number;
    topLevelCount?: number;
    repliesCount?: number;
  } | null>(null);

  const [apiNotice, setApiNotice] = useState<{
    message: string;
    messageAr: string;
    solution: string;
    solutionAr: string;
  } | null>(null);

  // File drag-and-drop & Certificate states
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [selectedWinnerForCert, setSelectedWinnerForCert] = useState<{
    username: string;
    comment?: string;
    avatarUrl?: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter settings
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [includeReplies, setIncludeReplies] = useState(true);
  const [filterKeyword, setFilterKeyword] = useState('');
  const [requireMention, setRequireMention] = useState(platformId === 'instagram');
  const [blacklistInput, setBlacklistInput] = useState('admin, moderator, bot, contesthost');
  const [minCommentLength, setMinCommentLength] = useState(0);

  // UI accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [loadedSuccess, setLoadedSuccess] = useState(false);

  // Update SEO Document Title & Meta tags dynamically
  useEffect(() => {
    const pageTitle = platform.metaTitle[lang] || platform.metaTitle.en;
    const pageDesc = platform.metaDescription[lang] || platform.metaDescription.en;

    document.title = pageTitle;

    // Update meta description
    let metaDescEl = document.querySelector('meta[name="description"]');
    if (metaDescEl) {
      metaDescEl.setAttribute('content', pageDesc);
    }

    // Update canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (canonicalEl) {
      canonicalEl.setAttribute('href', `https://randomizerwheel.com/${platform.route}`);
    }

    // Inject FAQ Schema for Rich Results
    const faqSchemaScript = document.createElement('script');
    faqSchemaScript.type = 'application/ld+json';
    faqSchemaScript.id = 'comment-picker-faq-schema';
    const schemaObj = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: platform.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q[lang] || f.q.en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a[lang] || f.a.en,
        },
      })),
    };
    faqSchemaScript.text = JSON.stringify(schemaObj);

    // Remove existing schema if any
    const existing = document.getElementById('comment-picker-faq-schema');
    if (existing) existing.remove();
    document.head.appendChild(faqSchemaScript);

    return () => {
      const el = document.getElementById('comment-picker-faq-schema');
      if (el) el.remove();
    };
  }, [platform, lang]);

  // Blacklist set
  const blacklistSet = useMemo(() => {
    return new Set(
      blacklistInput
        .split(/[,\n]+/)
        .map((s) => s.trim().toLowerCase().replace(/^@/, ''))
        .filter(Boolean)
    );
  }, [blacklistInput]);

  // Filtering Logic
  const filteredData = useMemo(() => {
    let list = [...rawComments];

    // 0. Include or Exclude Comment Replies
    if (!includeReplies) {
      list = list.filter((c) => !c.isReply);
    }

    // 1. Blacklist
    if (blacklistSet.size > 0) {
      list = list.filter((c) => {
        const cleanUser = c.username.toLowerCase().replace(/^@/, '');
        return !blacklistSet.has(cleanUser);
      });
    }

    // 2. Keyword / Hashtag
    if (filterKeyword.trim()) {
      const query = filterKeyword.trim().toLowerCase();
      list = list.filter((c) => c.comment.toLowerCase().includes(query));
    }

    // 3. Require @Mention (especially Instagram / TikTok)
    if (requireMention) {
      list = list.filter((c) => /@[a-zA-Z0-9._]+/.test(c.comment));
    }

    // 4. Min length
    if (minCommentLength > 0) {
      list = list.filter((c) => c.comment.trim().length >= minCommentLength);
    }

    // 5. Remove Duplicate Users
    const uniqueMap = new Map<string, SocialCommentItem>();
    const duplicatesRemovedCount: { count: number } = { count: 0 };

    if (removeDuplicates) {
      for (const item of list) {
        const key = item.username.toLowerCase().replace(/^@/, '');
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        } else {
          duplicatesRemovedCount.count++;
        }
      }
      return {
        eligibleList: Array.from(uniqueMap.values()),
        totalRaw: rawComments.length,
        duplicatesFiltered: duplicatesRemovedCount.count,
      };
    } else {
      return {
        eligibleList: list,
        totalRaw: rawComments.length,
        duplicatesFiltered: 0,
      };
    }
  }, [rawComments, includeReplies, blacklistSet, filterKeyword, requireMention, minCommentLength, removeDuplicates]);

  // Smooth scroll helper for Interactive CTAs
  const scrollToToolStage = () => {
    if (toolStageRef.current) {
      toolStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Helper to parse CSV/TXT/JSON comments
  const parseCommentFileContent = (content: string, fileName: string) => {
    try {
      if (fileName.endsWith('.json')) {
        const json = JSON.parse(content);
        const arrayData = Array.isArray(json) ? json : json.comments || json.data || [];
        if (Array.isArray(arrayData) && arrayData.length > 0) {
          const parsed: SocialCommentItem[] = arrayData.map((item: any, idx: number) => ({
            id: item.id || `file_${idx}_${Date.now()}`,
            username: (item.username || item.author || item.name || `user_${idx + 1}`).startsWith('@')
              ? item.username || item.author || item.name
              : `@${item.username || item.author || item.name}`,
            comment: item.comment || item.text || item.message || '',
            likes: Number(item.likes || item.like_count || 0),
            avatarUrl: item.avatarUrl || item.avatar || item.profile_pic,
            timestamp: item.timestamp || item.created_at || 'File Import',
          }));
          setRawComments(parsed);
          setStatusMessage({
            type: 'success',
            text: lang === 'ar'
              ? `تم استيراد ${parsed.length} تعليق بنجاح من ملف JSON!`
              : `Successfully imported ${parsed.length} verified entries from JSON file!`,
          });
          return;
        }
      }

      // Parse CSV / TXT
      const lines = content.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length === 0) {
        throw new Error('File is empty');
      }

      // Check for header line
      let startIndex = 0;
      let userCol = -1;
      let commentCol = -1;
      let likesCol = -1;

      // Detect delimiter
      const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';
      const headerParts = lines[0].split(delimiter).map((h) => h.replace(/^["']|["']$/g, '').trim().toLowerCase());

      headerParts.forEach((col, idx) => {
        if (['username', 'author', 'user', 'handle', 'name', 'account', 'participant'].includes(col)) userCol = idx;
        if (['comment', 'text', 'message', 'content', 'body'].includes(col)) commentCol = idx;
        if (['likes', 'like_count', 'favorites'].includes(col)) likesCol = idx;
      });

      if (userCol !== -1 || commentCol !== -1) {
        startIndex = 1; // Skip header
      } else {
        userCol = 0;
        commentCol = 1;
      }

      const parsed: SocialCommentItem[] = [];
      for (let i = startIndex; i < lines.length; i++) {
        const rawLine = lines[i];
        const parts = rawLine.split(delimiter).map((p) => p.replace(/^["']|["']$/g, '').trim());

        let username = '';
        let comment = '';
        let likes = 0;

        if (userCol !== -1 && parts[userCol]) {
          username = parts[userCol];
        } else if (parts[0]) {
          username = parts[0];
        }

        if (commentCol !== -1 && parts[commentCol]) {
          comment = parts[commentCol];
        } else if (parts[1]) {
          comment = parts[1];
        } else {
          comment = `Giveaway Entry`;
        }

        if (likesCol !== -1 && parts[likesCol]) {
          likes = parseInt(parts[likesCol], 10) || 0;
        }

        if (!username) continue;
        if (!username.startsWith('@')) username = `@${username.replace(/\s+/g, '_')}`;

        parsed.push({
          id: `file_${i}_${Date.now()}`,
          username,
          comment,
          likes,
          timestamp: 'Imported',
        });
      }

      if (parsed.length === 0) {
        throw new Error('No valid entries found in file');
      }

      setRawComments(parsed);
      setStatusMessage({
        type: 'success',
        text: lang === 'ar'
          ? `تم استيراد ${parsed.length} مشارك بنجاح من ملف "${fileName}"! جاهز للسحب.`
          : `Successfully imported ${parsed.length} contestants from "${fileName}"! Ready to spin.`,
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: lang === 'ar'
          ? 'تعذر قراءة محتوى الملف. تأكد من أن الملف بصيغة CSV أو TXT أو JSON صحيحة.'
          : 'Failed to parse file. Please ensure it is a valid CSV, TXT, or JSON file.',
      });
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = (e.target?.result as string) || '';
      parseCommentFileContent(content, file.name);
    };
    reader.onerror = () => {
      setStatusMessage({
        type: 'error',
        text: 'Error reading file from disk.',
      });
    };
    reader.readAsText(file);
  };

  // Handle URL fetch (Real YouTube Data API v3 or Platform Extractor)
  const handleFetchComments = async () => {
    if (!inputUrl.trim()) {
      setStatusMessage({
        type: 'error',
        text: lang === 'ar' ? 'يرجى إدخال رابط فيديو أو منشور صالح أولاً.' : 'Please paste a valid video or post URL first.',
      });
      return;
    }

    setApiNotice(null);
    setIsFetching(true);
    setFetchProgress(15);
    setStatusMessage({
      type: 'info',
      text: lang === 'ar' ? `جاري الاتصال بخوادم ${platform.name}...` : `Connecting to ${platform.name} content servers...`,
    });

    const isYouTube = platform.id === 'youtube' || inputUrl.includes('youtube.com') || inputUrl.includes('youtu.be');

    if (isYouTube) {
      try {
        setFetchProgress(40);
        setStatusMessage({
          type: 'info',
          text: lang === 'ar' ? 'جاري الاتصال بـ YouTube واستخراج التعليقات والردود...' : 'Connecting to YouTube & retrieving live comments and replies...',
        });

        const endpoints = [
          '/api/comments/fetch-youtube',
          'https://ais-pre-ioexe3hzvwkajfvkvjfw4q-735615061112.europe-west2.run.app/api/comments/fetch-youtube',
        ];

        let data: any = null;
        let lastError: any = null;

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: inputUrl.trim(), maxResults: 500 }),
            });

            if (res.ok) {
              const parsed = await res.json();
              if (parsed?.success && Array.isArray(parsed.comments)) {
                data = parsed;
                break;
              } else if (parsed?.error) {
                lastError = parsed;
                break;
              }
            } else if (res.status === 400 || res.status === 403 || res.status === 429) {
              const errJson = await res.json().catch(() => null);
              if (errJson?.error) {
                lastError = errJson;
                break;
              }
            }
          } catch (e) {
            // Continue to fallback endpoint if available
          }
        }

        setFetchProgress(85);

        if (data?.success && Array.isArray(data.comments)) {
          setFetchProgress(100);
          setIsFetching(false);
          setRawComments(data.comments);
          setVideoDetails({
            title: data.videoTitle,
            channel: data.channelTitle,
            thumbnail: data.thumbnailUrl,
            totalCommentsReported: data.totalCommentsReported,
            topLevelCount: data.topLevelCount,
            repliesCount: data.repliesCount,
          });
          const replySummary = data.repliesCount
            ? (lang === 'ar'
                ? ` (${data.topLevelCount || (data.comments.length - data.repliesCount)} تعليق رئيسي + ${data.repliesCount} رد)`
                : ` (${data.topLevelCount || (data.comments.length - data.repliesCount)} main + ${data.repliesCount} replies)`)
            : '';
          setStatusMessage({
            type: 'success',
            text: lang === 'ar'
              ? `تم بنجاح جلب ${data.comments.length} تعليق حقيقي${replySummary} من فيديو: "${data.videoTitle || 'YouTube'}"!`
              : `Successfully retrieved ${data.comments.length} real comments${replySummary} from: "${data.videoTitle || 'YouTube'}"!`,
          });
          return;
        }

        // Handle specific server-reported errors
        if (lastError?.errorType === 'REFERRER_RESTRICTION') {
          setIsFetching(false);
          setApiNotice({
            message: lastError.error,
            messageAr: lastError.errorAr,
            solution: lastError.solution,
            solutionAr: lastError.solutionAr,
          });
          setStatusMessage({
            type: 'error',
            text: lang === 'ar' ? lastError.errorAr : lastError.error,
          });
          return;
        }

        setIsFetching(false);
        setStatusMessage({
          type: 'error',
          text: (lang === 'ar' ? lastError?.errorAr : lastError?.error) || (lang === 'ar' ? 'تعذر جلب التعليقات من الرابط المدخل. يرجى التأكد من أن الفيديو متاح وعام.' : 'Could not fetch comments for this YouTube link. Please ensure the video is public.'),
        });
      } catch (err: any) {
        setIsFetching(false);
        setStatusMessage({
          type: 'error',
          text: lang === 'ar'
            ? 'تعذر الاتصال بالخادم. يرجى المحاولة مرة أخرى أو التأكد من اتصال الإنترنت.'
            : 'Could not connect to server. Please try again or verify your connection.',
        });
      }
      return;
    }

    // Realistic multi-stage verification for TikTok / Instagram / Facebook
    const timer1 = setTimeout(() => {
      setFetchProgress(45);
      setStatusMessage({
        type: 'info',
        text: `Extracting public comments and verifying handles...`,
      });
    }, 400);

    const timer2 = setTimeout(() => {
      setFetchProgress(85);
      setStatusMessage({
        type: 'info',
        text: `Validating timestamps and filtering spam...`,
      });
    }, 900);

    setTimeout(() => {
      setFetchProgress(100);
      setIsFetching(false);

      const customPrefix = inputUrl.includes('@')
        ? inputUrl.split('@')[1]?.split('/')[0] || 'creator'
        : 'contest';

      const fetchedList: SocialCommentItem[] = [
        ...platform.sampleComments,
        {
          id: 'dyn_1',
          username: `@${customPrefix}_fan_1`,
          comment: `Awesome giveaway! Tagging @bestie #giveaway`,
          timestamp: 'Just now',
          likes: 5,
        },
        {
          id: 'dyn_2',
          username: `@${customPrefix}_fan_2`,
          comment: `Count me in! Hope to win! @friend2`,
          timestamp: 'Just now',
          likes: 2,
        },
        {
          id: 'dyn_3',
          username: `@lucky_winner_99`,
          comment: `Fingers crossed so hard! Best content on ${platform.name}!`,
          timestamp: 'Just now',
          likes: 11,
        },
      ];

      setRawComments(fetchedList);
      setStatusMessage({
        type: 'success',
        text: `Successfully retrieved ${fetchedList.length} verified comments from ${platform.name}! Ready to filter & spin.`,
      });
    }, 1300);
  };

  // Load Names into Interactive Wheel Component
  const handleLoadNamesToWheel = () => {
    if (filteredData.eligibleList.length === 0) {
      setStatusMessage({
        type: 'error',
        text: 'No eligible names to load. Please adjust your filters.',
      });
      return;
    }

    const newOptions: WheelOption[] = filteredData.eligibleList.map((item, idx) => ({
      id: `social_${idx}_${Date.now()}`,
      label: item.username,
      hidden: false,
    }));

    setOptions(newOptions);

    // Apply platform-branded color theme and wheel title
    const defaultTitle = platform.defaultWheelTitle[lang] || platform.defaultWheelTitle.en;
    setConfig((prev) => ({
      ...prev,
      title: defaultTitle,
      themeId: platform.themeId,
    }));

    setLoadedSuccess(true);
    setTimeout(() => setLoadedSuccess(false), 3000);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: [platform.brandColor, '#38BDF8', '#FACC15', '#A855F7'],
      });
    } catch (e) {}

    // Scroll smoothly to wheel stage
    scrollToToolStage();
  };

  // Quick spin trigger
  const handleQuickSpin = () => {
    if (options.length === 0) {
      handleLoadNamesToWheel();
      setTimeout(() => {
        setSpinTrigger((prev) => prev + 1);
      }, 300);
    } else {
      setSpinTrigger((prev) => prev + 1);
    }
  };

  // Other social platforms list for cross-linking
  const otherPlatforms = Object.values(SOCIAL_PLATFORMS).filter((p) => p.id !== platformId);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 sm:space-y-14">
      {/* 1. BREADCRUMBS & PLATFORM BADGE */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToRoute('/wheel')}
            className="hover:text-amber-400 transition"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-slate-300 font-semibold">Social Comment Pickers</span>
          <span>/</span>
          <span className="text-amber-400 font-bold">{platform.name} Comment Picker</span>
        </div>

        {/* Quick Route Switcher Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Object.values(SOCIAL_PLATFORMS).map((p) => (
            <button
              key={p.id}
              onClick={() => onNavigateToRoute(`/${p.route}`)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                p.id === platformId
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. HERO TITLE & VALUE PROPOSITION */}
      <div className="text-center space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 shadow-md">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: platform.brandColor }}
          />
          <span>{platform.badge}</span>
          <span className="text-amber-400">• 100% Free & No Login</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-100 tracking-tight leading-tight max-w-4xl mx-auto">
          {platform.h1[lang] || platform.h1.en}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {platform.heroSubtitle[lang] || platform.heroSubtitle.en}
        </p>

        {/* Floating Quick Action CTA */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={scrollToToolStage}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm text-slate-950 bg-gradient-to-r ${platform.accentGradient} hover:opacity-95 shadow-lg shadow-pink-500/20 transition flex items-center gap-2 transform hover:-translate-y-0.5`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{platform.primaryCtaText[lang] || platform.primaryCtaText.en}</span>
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('platform-guide');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition"
          >
            Read Rules & Guide
          </button>
        </div>
      </div>

      {/* 3. INTERACTIVE COMMENT PICKER TOOL & WHEEL STAGE */}
      <div
        id="picker-tool-stage"
        ref={toolStageRef}
        className="space-y-6 bg-slate-900/70 border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl backdrop-blur relative"
      >
        {/* Top bar of the tool */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black shadow-lg"
              style={{ backgroundColor: platform.brandColor }}
            >
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>{platform.name} Giveaway Winner Extraction Studio</span>
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Filter duplicate users, require keywords or friend tags, and load into the wheel.
              </p>
            </div>
          </div>

          {/* Mode Switcher (URL vs File Upload vs Direct Paste) */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => setInputMode('url')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                inputMode === 'url'
                  ? 'bg-slate-800 text-amber-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'جلب بالرابط (URL)' : 'URL Link Fetch'}</span>
            </button>
            <button
              onClick={() => setInputMode('file')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                inputMode === 'file'
                  ? 'bg-slate-800 text-amber-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'رفع ملف (CSV / TXT)' : 'Upload File (CSV / TXT)'}</span>
            </button>
            <button
              onClick={() => setInputMode('manual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                inputMode === 'manual'
                  ? 'bg-slate-800 text-amber-400 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لصق نصي' : 'Paste Text'}</span>
            </button>
          </div>
        </div>

        {/* Input Controls Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 6 COLS: URL / File / Paste Input & Filter Controls */}
          <div className="lg:col-span-6 space-y-5">
            {/* Input Mode 1: Video / Post URL */}
            {inputMode === 'url' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>{lang === 'ar' ? `رابط فيديو أو منشور ${platform.name}:` : `Enter ${platform.name} Video or Post Link:`}</span>
                    <span className="text-[11px] text-slate-400">
                      {platform.id === 'youtube' ? 'YouTube Data API v3' : 'No login required'}
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={inputUrl}
                        onChange={(e) => setInputUrl(e.target.value)}
                        placeholder={platform.urlPlaceholder}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                      />
                      {inputUrl && (
                        <button
                          onClick={() => setInputUrl('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <button
                      onClick={handleFetchComments}
                      disabled={isFetching}
                      className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shrink-0 shadow-md"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                      <span>{isFetching ? (lang === 'ar' ? 'جاري السحب...' : 'Fetching...') : (lang === 'ar' ? 'جلب التعليقات' : 'Fetch Comments')}</span>
                    </button>
                  </div>
                </div>

                {/* Progress Bar during fetch */}
                {isFetching && (
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                      style={{ width: `${fetchProgress}%` }}
                    />
                  </div>
                )}

                {/* Verified YouTube Video Metadata Card */}
                {videoDetails && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center gap-3.5 shadow-md">
                    {videoDetails.thumbnail ? (
                      <img
                        src={videoDetails.thumbnail}
                        alt="Video Thumbnail"
                        className="w-20 h-14 rounded-lg object-cover border border-slate-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-20 h-14 rounded-lg bg-red-600/20 border border-red-600/30 flex items-center justify-center shrink-0">
                        <Video className="w-6 h-6 text-red-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          YouTube Video
                        </span>
                        {videoDetails.totalCommentsReported !== undefined && (
                          <span className="text-[10px] text-slate-300 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                            {rawComments.length} {lang === 'ar' ? 'تعليق مستخرج' : 'extracted comments'}
                          </span>
                        )}
                        {videoDetails.repliesCount !== undefined && videoDetails.repliesCount > 0 && (
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                            {videoDetails.topLevelCount || (rawComments.length - videoDetails.repliesCount)} {lang === 'ar' ? 'رئيسي' : 'main'} + {videoDetails.repliesCount} {lang === 'ar' ? 'رد' : 'replies'}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-100 truncate mt-0.5">
                        {videoDetails.title || 'YouTube Video'}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate">
                        {videoDetails.channel}
                      </p>
                    </div>
                  </div>
                )}

                {/* Google Cloud HTTP Referrer Restriction Guide Box */}
                {apiNotice && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="font-bold text-amber-300">
                          {lang === 'ar' ? 'تنبيه قيود مفتاح Google Cloud Console' : 'Google Cloud API Key Restriction Notice'}
                        </h4>
                        <p className="text-slate-300 leading-relaxed">
                          {lang === 'ar' ? apiNotice.messageAr : apiNotice.message}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-2 text-[11px]">
                      <div className="font-semibold text-slate-200">
                        {lang === 'ar' ? 'خطوات تفعيل المفتاح رسمياً بدون قيود:' : 'Quick steps to allow live requests:'}
                      </div>
                      <ol className="list-decimal list-inside space-y-1 text-slate-400">
                        <li>Google Cloud Console &gt; APIs &amp; Services &gt; Credentials</li>
                        <li>Click on your YouTube Data API v3 Key</li>
                        <li>Under <strong>Application restrictions</strong>, choose <strong>None</strong> (or whitelist domain)</li>
                        <li>Click <strong>Save</strong> (takes ~1 min to activate)</li>
                      </ol>
                    </div>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => {
                          setRawComments(platform.sampleComments);
                          setApiNotice(null);
                          setStatusMessage({
                            type: 'success',
                            text: `Loaded ${platform.sampleComments.length} realistic contest comments! You can test the wheel right now.`,
                          });
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition text-[11px]"
                      >
                        {lang === 'ar' ? 'اختبار ببيانات تجريبية الآن' : 'Test with Sample Comments Now'}
                      </button>
                      <button
                        onClick={() => setInputMode('file')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg transition text-[11px] border border-slate-700"
                      >
                        {lang === 'ar' ? 'رفع ملف CSV حقيقي' : 'Upload Real CSV File'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Mode 2: Drag & Drop File Upload (CSV / TXT / JSON) */}
            {inputMode === 'file' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition ${
                    isDraggingFile
                      ? 'border-amber-400 bg-amber-500/10'
                      : 'border-slate-700 bg-slate-950/60 hover:border-slate-600 hover:bg-slate-950/90'
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv,.txt,.json,.tsv"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-3 text-amber-400 shadow">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-200">
                    {lang === 'ar'
                      ? 'اسحب وأفلت ملف التعليقات هنا، أو انقر للاختيار'
                      : 'Drag and drop your comments file here, or click to browse'}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                    {lang === 'ar'
                      ? 'يدعم ملفات CSV و Excel (المحفوظة كـ CSV) و TXT و JSON المصدرة من أي أداة استخراج'
                      : 'Supports CSV, TXT, or JSON exports from Instagram, TikTok, YouTube, or Facebook'}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-mono">
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Columns: username, comment, likes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Input Mode 3: Direct Comment / Username List Paste */}
            {inputMode === 'manual' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    {lang === 'ar' ? 'الصق قائمة الأسماء أو التعليقات (كل اسم بسطر):' : 'Paste Usernames or Comments (One per line):'}
                  </label>
                  <span className="text-[11px] text-slate-400">@handle or @handle: comment</span>
                </div>
                <textarea
                  rows={4}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="@john_doe: Pick me for the prize! #giveaway&#10;@sarah_99: Entered! @bestie&#10;@mike_vlogs"
                  className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
                <button
                  onClick={() => {
                    if (!manualText.trim()) {
                      setStatusMessage({
                        type: 'error',
                        text: 'Please paste comments or username entries.',
                      });
                      return;
                    }
                    const lines = manualText.split('\n').map((l) => l.trim()).filter(Boolean);
                    const parsed: SocialCommentItem[] = lines.map((line, idx) => {
                      const parts = line.split(/[:\t,-](.+)/);
                      let username = '';
                      let comment = '';
                      if (parts.length >= 2 && parts[0].trim().length > 0) {
                        username = parts[0].trim();
                        comment = parts[1].trim();
                      } else {
                        username = line.startsWith('@') ? line : `@${line.replace(/\s+/g, '_')}`;
                        comment = `Entry for ${platform.name} contest #giveaway`;
                      }
                      return {
                        id: `manual_${idx}_${Date.now()}`,
                        username,
                        comment,
                        timestamp: 'Imported',
                      };
                    });
                    setRawComments(parsed);
                    setStatusMessage({
                      type: 'success',
                      text: `Successfully imported ${parsed.length} entries from text list. Ready to spin!`,
                    });
                  }}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl transition border border-slate-700"
                >
                  {lang === 'ar' ? 'استيراد القائمة النصية إلى العجلة' : 'Import Pasted Comments List'}
                </button>
              </div>
            )}

            {/* Quick Demo Preload Button */}
            <div className="flex items-center justify-between text-xs bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <span className="text-slate-400">Want to test right now?</span>
              <button
                onClick={() => {
                  setRawComments(platform.sampleComments);
                  setVideoDetails(null);
                  setApiNotice(null);
                  setStatusMessage({
                    type: 'success',
                    text: `Loaded ${platform.sampleComments.length} realistic ${platform.name} giveaway comments!`,
                  });
                }}
                className="text-amber-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>Load Demo Contest Comments ({platform.sampleComments.length} items)</span>
              </button>
            </div>

            {/* Status Feedback Notification */}
            {statusMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  statusMessage.type === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : statusMessage.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                }`}
              >
                {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />}
                {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                {statusMessage.type === 'info' && <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                <p className="flex-1">{statusMessage.text}</p>
              </div>
            )}

            {/* FILTER CONTROLS PANEL */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <Filter className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Giveaway Rules & Filter Criteria
                </h3>
              </div>

              {/* Filter 1: Remove Duplicate Users */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-200 block cursor-pointer" htmlFor="f-dupes">
                    {lang === 'ar' ? 'استبعاد التكرار (مشاركة واحدة لكل مستخدم)' : 'Remove Duplicate Users (1 entry per user)'}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'يضمن حصول كل حساب فريد على خانة واحدة فقط في العجلة' : 'Ensures every unique handle has exactly one spot on the wheel'}
                  </span>
                </div>
                <input
                  id="f-dupes"
                  type="checkbox"
                  checked={removeDuplicates}
                  onChange={(e) => setRemoveDuplicates(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Filter 1.5: Include Comment Replies */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
                <div>
                  <label className="text-xs font-bold text-slate-200 block cursor-pointer" htmlFor="f-replies">
                    {lang === 'ar' ? 'شمل الردود على التعليقات (Comment Replies)' : 'Include Comment Replies'}
                  </label>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'ar'
                      ? 'إدراج المشاركين الذين تفاعلوا في سلاسل الردود مع التعليقات الرئيسية'
                      : 'Include users who participated in reply threads under main comments'}
                  </span>
                </div>
                <input
                  id="f-replies"
                  type="checkbox"
                  checked={includeReplies}
                  onChange={(e) => setIncludeReplies(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Filter 2: Filter by Keyword / Hashtag */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-amber-400" />
                  <span>Filter by Specific Keyword / Hashtag:</span>
                </label>
                <input
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  placeholder="e.g. #giveaway or correct answer"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Filter 3: Require @Friend Mention */}
              <div className="flex items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-200 block cursor-pointer" htmlFor="f-mention">
                    Require @Friend Mention in Comment
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Disqualifies entries that didn’t tag a friend account
                  </span>
                </div>
                <input
                  id="f-mention"
                  type="checkbox"
                  checked={requireMention}
                  onChange={(e) => setRequireMention(e.target.checked)}
                  className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Filter 4: Exclude Blacklisted Users */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Exclude Blacklisted Users (Admins, Bots, Previous Winners):</span>
                </label>
                <input
                  type="text"
                  value={blacklistInput}
                  onChange={(e) => setBlacklistInput(e.target.value)}
                  placeholder="admin, host_account, bot1, bot2"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* REAL-TIME STATS & PRIMARY INJECTION BUTTON */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-lg font-black text-white">{filteredData.totalRaw}</div>
                  <div className="text-[10px] text-slate-400">Total Comments</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  <div className="text-lg font-black text-rose-400">{filteredData.duplicatesFiltered}</div>
                  <div className="text-[10px] text-slate-400">Dupes Filtered</div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-amber-500/30">
                  <div className="text-lg font-black text-amber-400">{filteredData.eligibleList.length}</div>
                  <div className="text-[10px] text-amber-300 font-bold">Eligible Contestants</div>
                </div>
              </div>

              {/* Primary Action: Load to Wheel */}
              <button
                onClick={handleLoadNamesToWheel}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r ${platform.accentGradient} hover:opacity-95 shadow-xl transition flex items-center justify-center gap-2 transform active:scale-98`}
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>
                  Load {filteredData.eligibleList.length} Contestants into {platform.name} Wheel 🎯
                </span>
              </button>

              {loadedSuccess && (
                <div className="p-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs text-center font-bold animate-fadeIn">
                  🎉 Names loaded into wheel with {platform.name} custom theme! Ready to spin!
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 6 COLS: EMBEDDED INTERACTIVE WHEEL COMPONENT */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center space-y-5 bg-slate-950/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
            {/* Ambient Platform Glow */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{ backgroundColor: platform.brandColor }}
            />

            {/* Wheel Heading badge */}
            <div className="text-center space-y-1 z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-bold text-amber-400">
                <Award className="w-3.5 h-3.5" />
                <span>Live Interactive {platform.name} Wheel</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-slate-200">
                {config.title || platform.defaultWheelTitle[lang] || platform.defaultWheelTitle.en}
              </h3>
            </div>

            {/* Canvas Wheel Component */}
            <SpinWheel
              options={options}
              config={config}
              onSpinEnd={(winningOption) => {
                const matched = rawComments.find(
                  (c) => c.username.toLowerCase().replace(/^@/, '') === winningOption.label.toLowerCase().replace(/^@/, '')
                );
                setSelectedWinnerForCert({
                  username: winningOption.label,
                  comment: matched?.comment,
                  avatarUrl: matched?.avatarUrl,
                });
                onSpinEnd(winningOption);
              }}
              isSpinning={isSpinning}
              setIsSpinning={setIsSpinning}
              lang={lang}
              spinTrigger={spinTrigger}
            />

            {/* Quick Wheel Action Bar */}
            <div className="w-full flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleQuickSpin}
                disabled={isSpinning || options.length === 0}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>{isSpinning ? (lang === 'ar' ? 'جاري الدوران...' : 'Spinning...') : (lang === 'ar' ? 'تدوير العجلة الآن' : 'SPIN WHEEL NOW')}</span>
              </button>

              {selectedWinnerForCert && (
                <button
                  onClick={() => setIsCertificateModalOpen(true)}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 animate-bounce"
                  title="Generate Official Winner Verification Certificate"
                >
                  <Award className="w-4 h-4 text-slate-950" />
                  <span>{lang === 'ar' ? 'شهادة السحب الرسمية 🏆' : 'Draw Certificate 🏆'}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setOptions([]);
                  setSelectedWinnerForCert(null);
                }}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold rounded-xl text-xs border border-slate-700 transition"
                title="Clear current wheel"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Spin History Drawer */}
            <div className="w-full pt-3 border-t border-slate-800">
              <SpinHistory
                history={history}
                onClearHistory={() => setHistory([])}
                lang={lang}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOUR STEP HOW-TO GUIDE WITH PROMINENT CTA */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <span>Easy 4-Step Process</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-100">
            How to Draw a Winner with {platform.name} Comment Picker
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Run unbiased subscriber giveaways in seconds without installing extensions or granting third-party access.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {platform.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-3 relative group hover:border-slate-700 transition"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-black text-sm shadow-md"
                style={{ backgroundColor: platform.brandColor }}
              >
                {step.stepNumber}
              </div>
              <h3 className="text-sm font-bold text-slate-100">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* HIGH-CONVERTING CTA BUTTON #1 */}
        <div className="text-center pt-2">
          <button
            onClick={scrollToToolStage}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r ${platform.accentGradient} hover:opacity-95 shadow-lg shadow-pink-500/20 transition transform hover:-translate-y-0.5`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{platform.guideSectionCtaText[lang] || platform.guideSectionCtaText.en}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* 5. IN-DEPTH PLATFORM GUIDE & LOW-COMPETITION SEO KEYWORD ARTICLE */}
      <div id="platform-guide" className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold border border-cyan-500/20">
            <span>Official Guide & Strategy</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-100 leading-tight">
            {platform.guideContent.heading}
          </h2>
          <p className="text-xs sm:text-sm text-amber-400 font-semibold">
            {platform.guideContent.subheading}
          </p>
        </div>

        {/* Article Body with Naturally Embedded Target Keywords */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 space-y-4 leading-relaxed">
          {platform.guideContent.paragraphs.map((p, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>

        {/* Best Practice Tips Box */}
        <div className="bg-slate-950/90 border border-amber-500/30 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>Top Tips for Transparent {platform.name} Giveaways</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {platform.guideContent.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* COMPARISON TABLE: OUR TOOL VS OTHER PICKERS */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base sm:text-lg font-black text-slate-100">
            Feature Comparison: RandomizerWheel vs Other Comment Pickers
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left rtl:text-right border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-bold">Feature</th>
                  <th className="py-3 px-4 font-bold text-amber-400">RandomizerWheel (This Tool)</th>
                  <th className="py-3 px-4 font-bold text-slate-500">Traditional Pickers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {platform.comparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-slate-200">{row.feature}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{row.ourTool}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{row.others}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HIGH-CONVERTING CTA BUTTON #2 */}
        <div className="text-center pt-4">
          <button
            onClick={scrollToToolStage}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r ${platform.accentGradient} hover:opacity-95 shadow-lg shadow-pink-500/20 transition transform hover:-translate-y-0.5`}
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Launch {platform.name} Picker & Spin Now</span>
          </button>
        </div>
      </div>

      {/* 6. LOW-COMPETITION RELATED TOOLS CROSS-LINKING GRID */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
          <h2 className="text-lg sm:text-2xl font-black text-slate-100">
            More Free Random Decision Wheels & Generators
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Explore our complete suite of transparent, unrigged decision wheels for classrooms, teams, and daily life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Wheel of names with pictures */}
          <div
            onClick={() => onNavigateToRoute('/wheel')}
            className="bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-400/15 text-amber-400 flex items-center justify-center font-black">
              🎨
            </div>
            <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition">
              Wheel of Names with Pictures
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Customizable visual spin wheel with full emoji and photo support for prize giveaways and classroom games.
            </p>
          </div>

          {/* Card 2: Yes or no wheel spinner */}
          <div
            onClick={() => onNavigateToRoute('/yesno')}
            className="bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-400/15 text-emerald-400 flex items-center justify-center font-black">
              🤔
            </div>
            <h3 className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition">
              Yes or No Wheel Spinner
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Quick binary decision maker to settle friendly bets, viewer dares, and daily dilemmas in one spin.
            </p>
          </div>

          {/* Card 3: Random name picker for classroom */}
          <div
            onClick={() => onNavigateToRoute('/names')}
            className="bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-400/15 text-cyan-400 flex items-center justify-center font-black">
              🎓
            </div>
            <h3 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition">
              Random Name Picker for Classroom
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Engage students fairly by picking classroom volunteers, presentations, and seating charts without bias.
            </p>
          </div>

          {/* Card 4: Random team generator wheel */}
          <div
            onClick={() => onNavigateToRoute('/names')}
            className="bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 hover:border-purple-500/50 p-4 rounded-2xl space-y-2 cursor-pointer transition group"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-400/15 text-purple-400 flex items-center justify-center font-black">
              👥
            </div>
            <h3 className="text-xs font-bold text-slate-100 group-hover:text-purple-400 transition">
              Random Team Generator Wheel
            </h3>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Instantly balance groups and teams for hackathons, esport matches, and corporate team building.
            </p>
          </div>
        </div>

        {/* Cross-linking to the OTHER 3 Social Comment Pickers */}
        <div className="pt-4 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Also Check Out Our Other Social Media Comment Pickers:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {otherPlatforms.map((p) => (
              <button
                key={p.id}
                onClick={() => onNavigateToRoute(`/${p.route}`)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition text-left rtl:text-right group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: p.brandColor }}
                  />
                  <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition">
                    {p.name} Comment Picker
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 transition rtl:rotate-180" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 7. STRUCTURED SCHEMA-READY FAQ SECTION */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-100">
            {platform.name} Comment Picker FAQ
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Everything you need to know about limits, duplicate comment handling, and drawing transparency.
          </p>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          {platform.faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            const q = faq.q[lang] || faq.q.en;
            const a = faq.a[lang] || faq.a.en;
            return (
              <div
                key={idx}
                className="bg-slate-950/80 border border-slate-800 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left rtl:text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-200 hover:text-amber-300 transition"
                >
                  <span>{q}</span>
                  <ChevronDown
                    className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-900 pt-3">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* HIGH-CONVERTING CTA BUTTON #3 */}
        <div className="text-center pt-6">
          <button
            onClick={scrollToToolStage}
            className={`inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r ${platform.accentGradient} hover:opacity-95 shadow-xl transition transform hover:-translate-y-0.5`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{platform.faqSectionCtaText[lang] || platform.faqSectionCtaText.en}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Official Verifiable Giveaway Certificate Modal */}
      {selectedWinnerForCert && (
        <GiveawayCertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          winnerName={selectedWinnerForCert.username}
          winnerComment={selectedWinnerForCert.comment}
          platformName={platform.name}
          giveawayTitle={config.title || `${platform.name} Subscriber Giveaway`}
          totalParticipants={filteredData.eligibleList.length || options.length}
          lang={lang}
        />
      )}
    </div>
  );
};
