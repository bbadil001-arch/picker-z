import React, { useState } from 'react';
import { Dices, Sparkles, RefreshCw, Copy, Check, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NumberGeneratorProps {
  lang: 'ar' | 'en';
  onLoadIntoWheel: (numbers: number[]) => void;
}

export const NumberGeneratorTool: React.FC<NumberGeneratorProps> = ({ lang, onLoadIntoWheel }) => {
  const [minVal, setMinVal] = useState(1);
  const [maxVal, setMaxVal] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const drawn: number[] = [];
      const min = Math.min(minVal, maxVal);
      const max = Math.max(minVal, maxVal);
      const possibleCount = max - min + 1;
      const actualCount = allowDuplicates ? count : Math.min(count, possibleCount);

      if (allowDuplicates) {
        for (let i = 0; i < actualCount; i++) {
          drawn.push(Math.floor(Math.random() * (max - min + 1)) + min);
        }
      } else {
        const pool = Array.from({ length: possibleCount }, (_, i) => min + i);
        for (let i = 0; i < actualCount; i++) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          drawn.push(pool[randomIndex]);
          pool.splice(randomIndex, 1);
        }
      }

      setResults(drawn);
      setIsGenerating(false);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#3B82F6', '#10B981'],
        });
      } catch (e) {}
    }, 400);
  };

  const handleCopy = () => {
    if (results.length === 0) return;
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold">
          <Dices className="w-4 h-4" />
          <span>{lang === 'ar' ? 'مولد الأرقام العشوائية' : 'Random Number Generator'}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-white">
          {lang === 'ar' ? 'سحب وأرقام عشوائية شفافة 100%' : 'Instant Random Number Picker'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          {lang === 'ar' ? 'حدد النطاق (من - إلى) وعدد الأرقام للقرعة أو تذاكر السحب' : 'Set your min/max range and generate numbers instantly for raffles & draws'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Controls Panel */}
        <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-slate-200 pb-2 border-b border-slate-800">
            {lang === 'ar' ? 'إعدادات النطاق' : 'Range Settings'}
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'الحد الأدنى (من):' : 'Min Number:'}
              </label>
              <input
                type="number"
                value={minVal}
                onChange={(e) => setMinVal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400">
                {lang === 'ar' ? 'الحد الأقصى (إلى):' : 'Max Number:'}
              </label>
              <input
                type="number"
                value={maxVal}
                onChange={(e) => setMaxVal(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono focus:border-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400">
              {lang === 'ar' ? 'كم عدد الأرقام المطلوبة؟' : 'How Many Numbers?'}
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white font-mono focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <label className="text-xs font-bold text-slate-300">
              {lang === 'ar' ? 'السماح بتكرار الأرقام:' : 'Allow Duplicates:'}
            </label>
            <button
              onClick={() => setAllowDuplicates(!allowDuplicates)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                allowDuplicates ? 'bg-amber-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  allowDuplicates ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl shadow-lg shadow-amber-500/20 text-base flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{lang === 'ar' ? 'توليد أرقام عشوائية' : 'Generate Numbers'}</span>
          </button>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col items-center justify-center min-h-[300px] text-center space-y-5">
          {results.length === 0 ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <Dices className="w-8 h-8" />
              </div>
              <p className="text-sm text-slate-400">
                {lang === 'ar' ? 'اضغط زر "توليد أرقام عشوائية" لعرض النتائج هنا' : 'Click "Generate Numbers" to show results here'}
              </p>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {lang === 'ar' ? '🎉 الأرقام العشوائية المستخرجة' : '🎉 Generated Numbers'}
              </span>

              <div className="flex flex-wrap items-center justify-center gap-3">
                {results.map((num, i) => (
                  <div
                    key={i}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black text-2xl sm:text-3xl flex items-center justify-center shadow-lg shadow-amber-500/20 animate-scaleUp font-mono"
                  >
                    {num}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-800">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ النتائج' : 'Copy Results')}</span>
                </button>

                <button
                  onClick={() => onLoadIntoWheel(results)}
                  className="px-4 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 rounded-xl text-xs font-bold border border-amber-500/30 transition flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ar' ? 'تحميل الأرقام في عجلة دوارة' : 'Load into Wheel Spinner'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
