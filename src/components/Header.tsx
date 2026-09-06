import React, { useState, useEffect } from 'react';
import { Disc, Share2, Globe, Check, Maximize, Minimize, Menu, X, Sparkles, BookOpen, CheckCircle2, Dices, HelpCircle, UserCheck, Mail, ChevronDown, MessageSquare } from 'lucide-react';
import { Language } from '../types';
import { LANGUAGES, t } from '../utils/translations';
import { LegalDocType } from '../data/legalContent';

export type ActivePage =
  | 'wheel'
  | 'yesno'
  | 'numbers'
  | 'names'
  | 'articles'
  | 'article-detail'
  | 'legal'
  | 'contact'
  | 'faq'
  | 'tiktok-comment-picker'
  | 'instagram-comment-picker'
  | 'facebook-comment-picker'
  | 'youtube-comment-picker';

interface HeaderProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onShare: () => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenContact?: () => void;
  onOpenLegal?: (tab: LegalDocType) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  onShare,
  activePage,
  setActivePage,
  onOpenContact,
  onOpenLegal,
}) => {
  const [copiedShare, setCopiedShare] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pickersDropdownOpen, setPickersDropdownOpen] = useState(false);

  const socialPickerItems: { id: ActivePage; label: string; href: string; color: string }[] = [
    { id: 'tiktok-comment-picker', label: 'TikTok Comment Picker', href: '/tiktok-comment-picker', color: '#FE2C55' },
    { id: 'instagram-comment-picker', label: 'Instagram Comment Picker', href: '/instagram-comment-picker', color: '#E1306C' },
    { id: 'youtube-comment-picker', label: 'YouTube Comment Picker', href: '/youtube-comment-picker', color: '#FF0000' },
    { id: 'facebook-comment-picker', label: 'Facebook Comment Picker', href: '/facebook-comment-picker', color: '#1877F2' },
  ];

  const isSocialPickerActive = [
    'tiktok-comment-picker',
    'instagram-comment-picker',
    'facebook-comment-picker',
    'youtube-comment-picker',
  ].includes(activePage);

  useEffect(() => {
    const handleFullscreenChange = () => {
      try {
        setIsFullscreen(!!document.fullscreenElement);
      } catch (e) {}
    };
    try {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        try {
          document.removeEventListener('fullscreenchange', handleFullscreenChange);
        } catch (e) {}
      };
    } catch (e) {}
  }, []);

  const toggleFullscreen = () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement && typeof document.documentElement.requestFullscreen === 'function') {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      } else {
        if (typeof document.exitFullscreen === 'function') {
          document.exitFullscreen().catch(() => {});
        }
      }
    } catch (e) {
      // Catch SecurityError in sandboxed contexts
    }
  };

  const handleShareClick = () => {
    onShare();
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const navItems = [
    { id: 'wheel' as ActivePage, labelKey: 'navWheel', icon: Disc, href: '/wheel' },
    { id: 'yesno' as ActivePage, labelKey: 'navYesNo', icon: CheckCircle2, href: '/yesno' },
    { id: 'numbers' as ActivePage, labelKey: 'navNumbers', icon: Dices, href: '/numbers' },
    { id: 'names' as ActivePage, labelKey: 'navNames', icon: UserCheck, href: '/names' },
    { id: 'articles' as ActivePage, labelKey: 'navArticles', icon: BookOpen, href: '/articles' },
    { id: 'faq' as ActivePage, labelKey: 'navFaq', icon: HelpCircle, href: '/faq' },
  ];

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand Link */}
        <a
          href="/wheel"
          onClick={(e) => {
            e.preventDefault();
            setActivePage('wheel');
          }}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-400 hover:bg-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 shrink-0 group-hover:scale-105 transition-all">
            <svg viewBox="0 0 24 24" className="w-5 h-5 sm:w-5.5 sm:h-5.5" fill="none">
              <circle cx="12" cy="12" r="6.8" stroke="#090d16" strokeWidth="2.8" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.2" fill="#090d16" />
            </svg>
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
              {t(lang, 'siteTitle')}
            </p>
          </div>
        </a>

        {/* Desktop Navigation Pages Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800 relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.id ||
              (item.id === 'articles' && activePage === 'article-detail');
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                  setPickersDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{t(lang, item.labelKey)}</span>
              </a>
            );
          })}

          {/* Social Comment Pickers Dropdown Menu */}
          <div
            className="relative"
            onMouseEnter={() => setPickersDropdownOpen(true)}
            onMouseLeave={() => setPickersDropdownOpen(false)}
          >
            <button
              onClick={() => setPickersDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSocialPickerActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <MessageSquare className={`w-3.5 h-3.5 ${isSocialPickerActive ? 'stroke-[2.5]' : 'text-slate-400'}`} />
              <span>{t(lang, 'navCommentPickers')}</span>
              <span className="px-1.5 py-0.2 text-[9px] font-black rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/30">
                New
              </span>
              <ChevronDown className={`w-3 h-3 transition-transform ${pickersDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {pickersDropdownOpen && (
              <div className="absolute top-full rtl:right-0 ltr:left-0 mt-1.5 w-60 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fadeIn space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  Giveaway Winner Pickers
                </div>
                {socialPickerItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage(item.id);
                      setPickersDropdownOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition ${
                      activePage === item.id
                        ? 'bg-slate-800 text-amber-400'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Contact Us Button / Link */}
          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenContact) {
                onOpenContact();
              } else {
                setActivePage('contact');
              }
            }}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 transition shadow-sm"
            title={t(lang, 'contactUs')}
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline text-[11px] sm:text-xs">
              {t(lang, 'contactUs')}
            </span>
          </a>

          {/* Share Button */}
          <button
            onClick={handleShareClick}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition"
            title={t(lang, 'share')}
          >
            {copiedShare ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] sm:text-xs">{t(lang, 'copied')}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="hidden xs:inline text-[11px] sm:text-xs">{t(lang, 'share')}</span>
              </>
            )}
          </button>

          {/* 9 Language Selector Dropdown */}
          <div className="relative flex items-center bg-slate-800 hover:bg-slate-700/90 text-amber-300 rounded-xl border border-slate-700 transition px-2 py-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0 mr-1 rtl:ml-1 rtl:mr-0" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="bg-transparent text-[11px] sm:text-xs font-bold text-amber-300 focus:outline-none cursor-pointer pr-1"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code} className="bg-slate-900 text-white font-medium">
                  {l.flag} {l.name}
                </option>
              ))}
            </select>
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            title={t(lang, 'fullscreen')}
            className="p-1.5 sm:p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition hidden xs:flex"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden pt-3 pb-2 border-t border-slate-800 mt-2 space-y-1.5 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activePage === item.id ||
              (item.id === 'articles' && activePage === 'article-detail');
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{t(lang, item.labelKey)}</span>
              </a>
            );
          })}

          {/* Mobile Comment Pickers Group */}
          <div className="pt-2 border-t border-slate-800">
            <div className="px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{t(lang, 'navCommentPickers')}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-400 text-[9px] font-black">
                Giveaways
              </span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              {socialPickerItems.map((item) => {
                const isActive = activePage === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault();
                      setActivePage(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.label.replace(' Comment Picker', '')}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <a
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              if (onOpenContact) {
                onOpenContact();
              } else {
                setActivePage('contact');
              }
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-amber-300 bg-amber-500/10 border border-amber-500/20"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{t(lang, 'contactUs')}</span>
          </a>

          {onOpenLegal && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[11px]">
              <a
                href="/privacy"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('privacy');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'privacyPolicy')}
              </a>
              <a
                href="/terms"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('terms');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'termsOfService')}
              </a>
              <a
                href="/about"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('about');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'aboutUs')}
              </a>
              <a
                href="/cookies"
                onClick={(e) => {
                  e.preventDefault();
                  onOpenLegal('cookies');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'cookiePolicy')}
              </a>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
