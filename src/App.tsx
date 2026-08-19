import React, { useState, useEffect, useCallback } from 'react';
import { WheelOption, WheelConfig, SpinHistoryItem, Language } from './types';
import { SpinWheel } from './components/SpinWheel';
import { OptionManager } from './components/OptionManager';
import { WheelCustomizer } from './components/WheelCustomizer';
import { WinnerModal } from './components/WinnerModal';
import { SpinHistory } from './components/SpinHistory';
import { SEOContentSection } from './components/SEOContentSection';
import { Header, ActivePage } from './components/Header';
import { NumberGeneratorTool } from './components/NumberGeneratorTool';
import { ContactModal } from './components/ContactModal';
import { LegalModal } from './components/LegalModal';
import { BlogListPage } from './components/BlogListPage';
import { ArticleDetailPage } from './components/ArticleDetailPage';
import { FullLegalPage } from './components/FullLegalPage';
import { ContactPage } from './components/ContactPage';
import { LegalDocType } from './data/legalContent';
import { ARTICLES } from './data/articles';
import { LANGUAGES, t } from './utils/translations';
import { Sparkles, Dices, HelpCircle, CheckCircle2, UserCheck, Disc, Mail, Shield, BookOpen } from 'lucide-react';

const DEFAULT_OPTIONS: WheelOption[] = [
  { id: '1', label: 'Emma Watson', hidden: false },
  { id: '2', label: 'Liam Miller', hidden: false },
  { id: '3', label: 'Sophia Garcia', hidden: false },
  { id: '4', label: 'Jackson Taylor', hidden: false },
  { id: '5', label: 'Olivia Johnson', hidden: false },
  { id: '6', label: 'Noah Smith', hidden: false },
  { id: '7', label: 'Ava Davis', hidden: false },
  { id: '8', label: 'Lucas Wilson', hidden: false },
];

const DEFAULT_CONFIG: WheelConfig = {
  title: 'Raffle Winner Spinner 🎉',
  spinDuration: 5,
  soundEnabled: true,
  volume: 0.7,
  autoRemoveWinner: false,
  themeId: 'vibrant',
  customBgColor: '#0F172A',
  customTextColor: '#FFFFFF',
  customPointerColor: '#F59E0B',
  tickerType: 'top',
};

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('wheel');
  const [currentArticleSlug, setCurrentArticleSlug] = useState<string>('');
  const [legalTab, setLegalTab] = useState<LegalDocType>('privacy');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);

  const [lang, setLang] = useState<Language>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang') as Language;
      if (urlLang && LANGUAGES.some((l) => l.code === urlLang)) return urlLang;

      const saved = localStorage.getItem('rw_lang') as Language;
      if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
    } catch (e) {}
    return 'en';
  });

  const [options, setOptions] = useState<WheelOption[]>(() => {
    try {
      const saved = localStorage.getItem('rw_options');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_OPTIONS;
  });

  const [config, setConfig] = useState<WheelConfig>(() => {
    try {
      const saved = localStorage.getItem('rw_config');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_CONFIG;
  });

  const [history, setHistory] = useState<SpinHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('rw_history');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });

  const [winner, setWinner] = useState<WheelOption | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinTrigger, setSpinTrigger] = useState(0);

  // Synchronize document dir and language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('rw_lang', lang);
    } catch (e) {}
  }, [lang]);

  // URL Hash Router parser
  const parseRouteFromHash = useCallback(() => {
    const rawHash = window.location.hash.trim();
    if (!rawHash || rawHash === '#' || rawHash === '#/') {
      setActivePage('wheel');
      return;
    }

    if (rawHash.startsWith('#wheel=')) {
      try {
        const jsonStr = decodeURIComponent(rawHash.replace('#wheel=', ''));
        const parsed = JSON.parse(jsonStr);
        if (parsed.items && Array.isArray(parsed.items)) {
          const loadedOptions: WheelOption[] = parsed.items.map((item: string, idx: number) => ({
            id: 'shared_' + idx + '_' + Date.now(),
            label: item,
            hidden: false,
          }));
          setOptions(loadedOptions);
        }
        if (parsed.title) {
          setConfig((prev) => ({ ...prev, title: parsed.title }));
        }
        setActivePage('wheel');
      } catch (e) {}
      return;
    }

    const cleanHash = rawHash.replace(/^#\/?/, '');

    if (cleanHash === 'wheel' || cleanHash === '') {
      setActivePage('wheel');
    } else if (cleanHash === 'yesno') {
      setActivePage('yesno');
      const yesnoItems = lang === 'ar' ? ['نعم', 'لا', 'ربما', 'مرة أخرى'] : ['YES', 'NO', 'MAYBE', 'SPIN AGAIN'];
      setOptions(
        yesnoItems.map((lbl, idx) => ({
          id: 'yn_' + idx,
          label: lbl,
          hidden: false,
        }))
      );
      setConfig((prev) => ({
        ...prev,
        title: t(lang, 'yesNoTitle'),
      }));
    } else if (cleanHash === 'numbers') {
      setActivePage('numbers');
    } else if (cleanHash === 'names') {
      setActivePage('names');
      setConfig((prev) => ({
        ...prev,
        title: t(lang, 'namesTitle'),
      }));
    } else if (cleanHash === 'faq') {
      setActivePage('wheel');
      setTimeout(() => {
        const el = document.getElementById('faq-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else if (cleanHash === 'articles') {
      setActivePage('articles');
    } else if (cleanHash.startsWith('articles/')) {
      const slug = cleanHash.replace('articles/', '');
      setCurrentArticleSlug(slug);
      setActivePage('article-detail');
    } else if (['privacy', 'terms', 'about', 'cookies', 'disclaimer'].includes(cleanHash)) {
      setLegalTab(cleanHash as LegalDocType);
      setActivePage('legal');
    } else if (cleanHash === 'contact') {
      setActivePage('contact');
    }
  }, [lang]);

  // Listen to hash change & popstate
  useEffect(() => {
    parseRouteFromHash();
    const handleHashChange = () => parseRouteFromHash();
    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handleHashChange);
    };
  }, [parseRouteFromHash]);

  // Handle page menu navigation clicks
  const handlePageSelect = (page: ActivePage) => {
    if (page === 'article-detail') {
      setActivePage('article-detail');
      return;
    }

    if (page === 'yesno') {
      window.location.hash = '#/yesno';
    } else if (page === 'numbers') {
      window.location.hash = '#/numbers';
    } else if (page === 'names') {
      window.location.hash = '#/names';
    } else if (page === 'articles') {
      window.location.hash = '#/articles';
    } else if (page === 'contact') {
      window.location.hash = '#/contact';
    } else if (page === 'faq') {
      setActivePage('wheel');
      window.location.hash = '#/faq';
      const el = document.getElementById('faq-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.hash = '#/wheel';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLegal = (tab: LegalDocType) => {
    setLegalTab(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (slug: string) => {
    setCurrentArticleSlug(slug);
    window.location.hash = `#/articles/${slug}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rw_options', JSON.stringify(options));
    } catch (e) {}
  }, [options]);

  useEffect(() => {
    try {
      localStorage.setItem('rw_config', JSON.stringify(config));
    } catch (e) {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('rw_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  // Handle spin finish
  const handleSpinEnd = (winningOption: WheelOption) => {
    setWinner(winningOption);

    const historyItem: SpinHistoryItem = {
      id: Date.now().toString(),
      winner: winningOption.label,
      timestamp: new Date().toLocaleTimeString(lang === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      totalOptionsCount: options.filter((o) => !o.hidden).length,
    };

    setHistory((prev) => [historyItem, ...prev]);

    if (config.autoRemoveWinner) {
      setOptions((prev) => prev.filter((opt) => opt.id !== winningOption.id));
    }
  };

  // Remove winner manually
  const handleRemoveWinner = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  // Spin Again handler from Winner Modal
  const handleSpinAgain = () => {
    setWinner(null);
    setTimeout(() => {
      setSpinTrigger((prev) => prev + 1);
    }, 150);
  };

  // Load numbers into wheel
  const handleLoadNumbersIntoWheel = (numbers: number[]) => {
    const numOptions: WheelOption[] = numbers.map((n, idx) => ({
      id: 'num_' + idx + '_' + Date.now(),
      label: String(n),
      hidden: false,
    }));
    setOptions(numOptions);
    setConfig((prev) => ({
      ...prev,
      title: lang === 'ar' ? 'عجلة سحب الأرقام 🎲' : 'Random Number Spinner 🎲',
    }));
    handlePageSelect('wheel');
  };

  // Generate share URL
  const handleShare = () => {
    const shareObj = {
      title: config.title,
      items: options.map((o) => o.label),
    };
    const hash = '#wheel=' + encodeURIComponent(JSON.stringify(shareObj));
    const fullUrl = window.location.origin + window.location.pathname + hash;
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${
        lang === 'ar' ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header Navbar with pages menu */}
      <Header
        lang={lang}
        setLang={setLang}
        onShare={handleShare}
        activePage={activePage}
        setActivePage={handlePageSelect}
        onOpenContact={() => handlePageSelect('contact')}
        onOpenLegal={handleOpenLegal}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        {/* VIEW 1: NUMBER GENERATOR PAGE */}
        {activePage === 'numbers' && (
          <NumberGeneratorTool lang={lang} onLoadIntoWheel={handleLoadNumbersIntoWheel} />
        )}

        {/* VIEW 2: ARTICLES & GUIDES LIST */}
        {activePage === 'articles' && (
          <BlogListPage
            lang={lang}
            onSelectArticle={handleSelectArticle}
            onBackToHome={() => handlePageSelect('wheel')}
          />
        )}

        {/* VIEW 3: ARTICLE DETAIL PAGE */}
        {activePage === 'article-detail' && (
          <ArticleDetailPage
            slug={currentArticleSlug || ARTICLES[0].slug}
            lang={lang}
            onBackToArticles={() => handlePageSelect('articles')}
            onNavigateToArticle={handleSelectArticle}
            onNavigateToPage={handlePageSelect}
          />
        )}

        {/* VIEW 4: FULL LEGAL PAGE (AdSense compliance) */}
        {activePage === 'legal' && (
          <FullLegalPage
            lang={lang}
            currentTab={legalTab}
            onSelectTab={handleOpenLegal}
            onBackToHome={() => handlePageSelect('wheel')}
            onOpenContact={() => handlePageSelect('contact')}
          />
        )}

        {/* VIEW 5: CONTACT PAGE */}
        {activePage === 'contact' && (
          <ContactPage
            lang={lang}
            onBackToHome={() => handlePageSelect('wheel')}
            onNavigateToFaq={() => handlePageSelect('faq')}
          />
        )}

        {/* VIEW 6: SPIN WHEEL STUDIO (Default / Main / Yes-No / Names) */}
        {(activePage === 'wheel' || activePage === 'yesno' || activePage === 'names' || activePage === 'faq') && (
          <>
            {/* Wheel Title */}
            <div className="text-center space-y-1.5 px-2">
              <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 tracking-tight leading-snug break-words">
                {config.title || t(lang, 'mainTitle')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
                {t(lang, 'subTitle')}
              </p>
            </div>

            {/* 2 Column Layout: Left Spin Stage, Right Control Panels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* LEFT: Spin Wheel Interactive Stage (7 cols) */}
              <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-5 sm:space-y-6 bg-slate-900/60 border border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl backdrop-blur relative overflow-hidden w-full">
                {/* Background ambient glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Canvas Wheel Component */}
                <SpinWheel
                  options={options}
                  config={config}
                  onSpinEnd={handleSpinEnd}
                  isSpinning={isSpinning}
                  setIsSpinning={setIsSpinning}
                  lang={lang}
                  spinTrigger={spinTrigger}
                />

                {/* Spin History */}
                <SpinHistory
                  history={history}
                  onClearHistory={() => setHistory([])}
                  lang={lang}
                />
              </div>

              {/* RIGHT: Controls (Options Manager & Customizer) (5 cols) */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6 w-full">
                {/* Option List Manager */}
                <OptionManager options={options} setOptions={setOptions} lang={lang} />

                {/* Customizer Settings */}
                <WheelCustomizer config={config} setConfig={setConfig} lang={lang} />
              </div>
            </div>

            {/* SEO Article & FAQ Content Section */}
            <div id="faq-section">
              <SEOContentSection lang={lang} />
            </div>
          </>
        )}
      </main>

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onSpinAgain={handleSpinAgain}
        onRemoveWinner={handleRemoveWinner}
        lang={lang}
      />

      {/* Contact & Request Help Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        lang={lang}
        currentOptions={options}
      />

      {/* Google AdSense Compliance Legal Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        lang={lang}
        initialTab={legalTab}
        onOpenContact={() => {
          setIsLegalOpen(false);
          handlePageSelect('contact');
        }}
      />

      {/* Comprehensive AdSense-Compliant Footer */}
      <footer className="w-full bg-slate-900/95 border-t border-slate-800 py-8 sm:py-10 mt-12 sm:mt-16 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Top Row: Brand & Purpose */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pb-6 border-b border-slate-800/80">
            {/* Col 1: Brand & Bio */}
            <div className="md:col-span-1 space-y-2.5">
              <a
                href="#/wheel"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageSelect('wheel');
                }}
                className="flex items-center gap-2 group cursor-pointer"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black group-hover:scale-105 transition-transform">
                  <Disc className="w-4 h-4" />
                </div>
                <span className="text-base font-black text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
                  Randomizer<span className="text-amber-400">Wheel</span>.com
                </span>
              </a>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed">
                {lang === 'ar'
                  ? 'منصة الاختيار العشوائي والقرعة الإلكترونية الشفافة والمجانية 100%. خوارزميات نزيهة لدعم المعلمين، منظمي المسابقات وحسم القرارات اليومية.'
                  : 'Free, transparent, and unbiased decision-making wheel and random name picker for giveaways, classrooms, and daily choices.'}
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-slate-300">support@randomizerwheel.com</span>
              </div>
            </div>

            {/* Col 2: Interactive Tools Navigation */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                {lang === 'ar' ? 'أدوات القرعة' : 'Random Tools'}
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="#/wheel"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('wheel');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'navWheel')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/yesno"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('yesno');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'navYesNo')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/numbers"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('numbers');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'navNumbers')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/names"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('names');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'navNames')}
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: SEO Articles & Guides */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>{t(lang, 'navArticles')}</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="#/articles"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('articles');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right font-semibold text-amber-400/90"
                  >
                    {t(lang, 'blogTitle')}
                  </a>
                </li>
                {ARTICLES.slice(0, 3).map((art) => (
                  <li key={art.slug}>
                    <a
                      href={`#/articles/${art.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelectArticle(art.slug);
                      }}
                      className="hover:text-amber-400 transition block text-left rtl:text-right truncate max-w-[220px]"
                      title={art.title[lang] || art.title.en}
                    >
                      {art.title[lang] || art.title.en}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Legal & AdSense Policy Pages */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'السياسات والخصوصية' : 'Legal & Policies'}</span>
              </h4>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <a
                    href="#/privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('privacy');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'privacyPolicy')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/terms"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('terms');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'termsOfService')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/about"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('about');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'aboutUs')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/cookies"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('cookies');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'cookiePolicy')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/disclaimer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenLegal('disclaimer');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right"
                  >
                    {t(lang, 'disclaimer')}
                  </a>
                </li>
                <li>
                  <a
                    href="#/contact"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageSelect('contact');
                    }}
                    className="hover:text-amber-400 transition block text-left rtl:text-right text-amber-400/90 font-medium"
                  >
                    {t(lang, 'contactUs')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-[11px] text-slate-400">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-semibold text-slate-300">RandomizerWheel.com</span>
              <span>•</span>
              <span>© 2026 {t(lang, 'allRightsReserved')}</span>
              <span>•</span>
              <span className="text-slate-400">GDPR, CCPA & AdSense Compliant</span>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="#/contact"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageSelect('contact');
                }}
                className="flex items-center gap-1 text-slate-300 hover:text-amber-400 transition group cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{t(lang, 'requestHelp')}</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
