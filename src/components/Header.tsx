import React, { useState } from 'react';
import { Disc, Globe, Maximize, Minimize, Share2, Check } from 'lucide-react';

interface HeaderProps {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  onShare: () => void;
}

export const Header: React.FC<HeaderProps> = ({ lang, setLang, onShare }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const handleShareClick = () => {
    onShare();
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
            <Disc className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] truncate">
                Randomizer<span className="text-amber-400">Wheel</span>
              </span>
              <span className="hidden md:inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                .com
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium truncate hidden sm:block">
              {lang === 'ar' ? 'عجلة القرعة واختيار الأسماء' : 'Spin Wheel & Random Name Picker'}
            </p>
          </div>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
            title={lang === 'ar' ? 'مشاركة العجلة' : 'Share Wheel'}
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] sm:text-xs">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="hidden xs:inline text-[11px] sm:text-xs">{lang === 'ar' ? 'مشاركة' : 'Share'}</span>
              </>
            )}
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => {
              const newLang = lang === 'ar' ? 'en' : 'ar';
              setLang(newLang);
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-bold border border-slate-700 transition"
            title={lang === 'ar' ? 'تغيير اللغة إلى الانجليزية' : 'Switch Language to Arabic'}
          >
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] sm:text-xs">{lang === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={lang === 'ar' ? 'ملء الشاشة' : 'Fullscreen'}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
