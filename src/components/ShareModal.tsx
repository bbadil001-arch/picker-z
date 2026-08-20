import React, { useState } from 'react';
import { Language } from '../types';
import { X, Share2, Copy, Check, ExternalLink, MessageCircle, Send } from 'lucide-react';
import { copyTextToClipboard } from '../utils/clipboard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  title?: string;
  items?: string[];
  winnerName?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  lang,
  title,
  items = [],
  winnerName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build the share URL with the current wheel items & title
  const cleanTitle = title || (lang === 'ar' ? 'عجلة القرعة العشوائية' : 'Randomizer Wheel');
  const shareDataObj = {
    title: title || '',
    items: items,
  };
  const query = '?wheel=' + encodeURIComponent(JSON.stringify(shareDataObj));
  const fullUrl = `${window.location.origin}/${query}`;

  const shareMessage = winnerName
    ? lang === 'ar'
      ? `🏆 الفائز في قرعة (${cleanTitle}) هو: "${winnerName}"! جرب حظك وأدر العجلة الآن على RandomizerWheel:`
      : `🏆 Winner of (${cleanTitle}): "${winnerName}"! Spin the wheel and test your luck on RandomizerWheel:`
    : lang === 'ar'
    ? `🎯 أدر عجلة القرعة (${cleanTitle}) واكتشف النتيجة فوراً على RandomizerWheel:`
    : `🎯 Spin the wheel (${cleanTitle}) for instant random picks on RandomizerWheel:`;

  const handleCopy = async () => {
    const success = await copyTextToClipboard(fullUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cleanTitle,
          text: shareMessage,
          url: fullUrl,
        });
      } catch (e) {}
    }
  };

  // Social share URLs
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedText = encodeURIComponent(shareMessage);

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(cleanTitle)}&body=${encodedText}%0A%0A${encodedUrl}`;

  const isRtl = lang === 'ar';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {winnerName
                ? lang === 'ar'
                  ? 'مشاركة نتيجة القرعة'
                  : 'Share Winner Result'
                : lang === 'ar'
                ? 'مشاركة ونشر العجلة'
                : 'Share Wheel'}
            </h3>
            <p className="text-xs text-slate-400 truncate max-w-[240px] sm:max-w-xs">
              {cleanTitle}
            </p>
          </div>
        </div>

        {/* Winner Highlight Box (if available) */}
        {winnerName && (
          <div className="mb-4 p-3 bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-500/15 border border-amber-500/30 rounded-2xl flex items-center gap-3">
            <span className="text-2xl">🏆</span>
            <div className="overflow-hidden">
              <div className="text-[11px] text-amber-400/80 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'النتيجة المختارة' : 'Winner Pick'}
              </div>
              <div className="text-base font-extrabold text-amber-300 truncate">
                {winnerName}
              </div>
            </div>
          </div>
        )}

        {/* Direct Link Box with Copy Button */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            {lang === 'ar' ? 'رابط المشاركة المباشر:' : 'Direct Share Link:'}
          </label>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-700/80 rounded-2xl p-1.5 pl-3">
            <input
              type="text"
              readOnly
              value={fullUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="bg-transparent text-xs sm:text-sm text-slate-300 focus:outline-none w-full font-mono select-all truncate"
            />
            <button
              onClick={handleCopy}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-md'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'نسخ' : 'Copy'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Share Grid */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 mb-2">
            {lang === 'ar' ? 'المشاركة الفورية عبر المنصات:' : 'Share via social platforms:'}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 text-emerald-300 hover:text-emerald-200 transition group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 text-sky-300 hover:text-sky-200 transition group"
            >
              <svg className="w-5 h-5 fill-current text-sky-400 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="text-[11px] font-bold">X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 text-blue-300 hover:text-blue-200 transition group"
            >
              <Send className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">Telegram</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 text-indigo-300 hover:text-indigo-200 transition group"
            >
              <ExternalLink className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold">Facebook</span>
            </a>
          </div>

          {/* Native Web Share API option if supported on mobile/supported desktop */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full mt-2 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-400 border border-slate-700/80 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'خيارات مشاركة النظام' : 'More Share Options'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
