import React, { useState } from 'react';
import { Disc, Globe, Maximize, Minimize, Share2, Check, Menu, X, Dices, HelpCircle, UserCheck, CheckCircle2, Mail, Shield } from 'lucide-react';
import { Language } from '../types';
import { LegalDocType } from '../data/legalContent';
import { LANGUAGES, t } from '../utils/translations';

export type ActivePage = 'wheel' | 'yesno' | 'numbers' | 'names' | 'faq';

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { id: 'wheel' as ActivePage, labelKey: 'navWheel', icon: Disc },
    { id: 'yesno' as ActivePage, labelKey: 'navYesNo', icon: CheckCircle2 },
    { id: 'numbers' as ActivePage, labelKey: 'navNumbers', icon: Dices },
    { id: 'names' as ActivePage, labelKey: 'navNames', icon: UserCheck },
    { id: 'faq' as ActivePage, labelKey: 'navFaq', icon: HelpCircle },
  ];

  const currentLangObj = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 px-3 sm:px-6 py-2.5 sm:py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Brand */}
        <div
          onClick={() => setActivePage('wheel')}
          className="flex items-center gap-2 sm:gap-2.5 min-w-0 cursor-pointer group"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
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
              {t(lang, 'siteTitle')}
            </p>
          </div>
        </div>

        {/* Desktop Navigation Pages Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'stroke-[2.5]' : 'text-slate-400'}`} />
                <span>{t(lang, item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Contact Us Button */}
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 transition shadow-sm"
              title={t(lang, 'contactUs')}
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline text-[11px] sm:text-xs">
                {t(lang, 'contactUs')}
              </span>
            </button>
          )}

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
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
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
              </button>
            );
          })}

          {onOpenContact && (
            <button
              onClick={() => {
                onOpenContact();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-amber-300 bg-amber-500/10 border border-amber-500/20"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>{t(lang, 'contactUs')}</span>
            </button>
          )}

          {onOpenLegal && (
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                onClick={() => {
                  onOpenLegal('privacy');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'privacyPolicy')}
              </button>
              <button
                onClick={() => {
                  onOpenLegal('terms');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'termsOfService')}
              </button>
              <button
                onClick={() => {
                  onOpenLegal('about');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'aboutUs')}
              </button>
              <button
                onClick={() => {
                  onOpenLegal('cookies');
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-center font-medium"
              >
                {t(lang, 'cookiePolicy')}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
