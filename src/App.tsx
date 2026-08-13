import React, { useState, useEffect } from 'react';
import { WheelOption, WheelConfig, SpinHistoryItem } from './types';
import { SpinWheel } from './components/SpinWheel';
import { OptionManager } from './components/OptionManager';
import { WheelCustomizer } from './components/WheelCustomizer';
import { WinnerModal } from './components/WinnerModal';
import { SpinHistory } from './components/SpinHistory';
import { SEOContentSection } from './components/SEOContentSection';
import { Header } from './components/Header';
import { Sparkles } from 'lucide-react';

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
  const [lang, setLang] = useState<'ar' | 'en'>(() => {
    try {
      const saved = localStorage.getItem('rw_lang');
      if (saved === 'ar' || saved === 'en') return saved;
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

  // Synchronize document dir and language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('rw_lang', lang);
    } catch (e) {}
  }, [lang]);

  // Check URL hash for shared wheel
  useEffect(() => {
    try {
      if (window.location.hash.startsWith('#wheel=')) {
        const jsonStr = decodeURIComponent(window.location.hash.replace('#wheel=', ''));
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
      }
    } catch (e) {}
  }, []);

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

    // Record in history
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

    // Auto remove if enabled
    if (config.autoRemoveWinner) {
      setOptions((prev) => prev.filter((opt) => opt.id !== winningOption.id));
    }
  };

  // Remove winner manually
  const handleRemoveWinner = (id: string) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== id));
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
      {/* Header Navbar */}
      <Header lang={lang} setLang={setLang} onShare={handleShare} />

      {/* Main Wheel Studio Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8">
        {/* Wheel Title */}
        <div className="text-center space-y-1.5 px-2">
          <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 tracking-tight leading-snug break-words">
            {config.title || (lang === 'ar' ? 'عجلة القرعة والخيارات العشوائية' : 'Randomizer Wheel')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            {lang === 'ar'
              ? 'موقع RandomizerWheel.com | أضف الخيارات، خصص الألوان وأدر العجلة الآن'
              : 'RandomizerWheel.com | Add choices, customize colors, and spin for instant results!'}
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
        <SEOContentSection lang={lang} />
      </main>

      {/* Winner Modal */}
      <WinnerModal
        winner={winner}
        onClose={() => setWinner(null)}
        onRemoveWinner={handleRemoveWinner}
        lang={lang}
      />

      {/* Footer */}
      <footer className="w-full bg-slate-900/90 border-t border-slate-800 py-6 mt-12 sm:mt-16 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">RandomizerWheel.com</span>
            <span>© 2026 - {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>{lang === 'ar' ? 'مصمم بعناية لأعلى أداء' : 'Built for speed and responsive performance'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
          </div>
        </div>
      </footer>
    </div>
  );
}
