import React from 'react';
import { WheelConfig } from '../types';
import { COLOR_THEMES } from '../utils/colorThemes';
import { Palette, Volume2, VolumeX, Clock, Settings2, Check } from 'lucide-react';

interface WheelCustomizerProps {
  config: WheelConfig;
  setConfig: React.Dispatch<React.SetStateAction<WheelConfig>>;
  lang: 'ar' | 'en';
}

export const WheelCustomizer: React.FC<WheelCustomizerProps> = ({ config, setConfig, lang }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xl w-full space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-700">
        <Settings2 className="w-5 h-5 text-amber-400 shrink-0" />
        <h2 className="text-base sm:text-lg font-bold text-slate-100">
          {lang === 'ar' ? 'تخصيص الثيم والإعدادات' : 'Theme & Settings'}
        </h2>
      </div>

      {/* 1. Wheel Title Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300">
          {lang === 'ar' ? 'عنوان العجلة / السؤال:' : 'Wheel Title / Heading:'}
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => setConfig((prev) => ({ ...prev, title: e.target.value }))}
          placeholder={lang === 'ar' ? 'مثال: قرعة الفائز بالمسابقة' : 'e.g. Raffle Winner Spinner'}
          className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* 2. Color Theme Palette Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{lang === 'ar' ? 'مخطط الألوان (Color Theme):' : 'Color Palette Theme:'}</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {COLOR_THEMES.map((theme) => {
            const isSelected = config.themeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setConfig((prev) => ({ ...prev, themeId: theme.id }))}
                className={`p-2.5 rounded-xl border text-left rtl:text-right flex items-center justify-between gap-2 transition ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/80 text-amber-300 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/60 border-slate-700/60 hover:border-slate-600 text-slate-200'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{theme.name[lang] || theme.name.en}</div>
                  {/* Swatch dots */}
                  <div className="flex items-center gap-1 mt-1.5">
                    {theme.colors.slice(0, 6).map((c, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-slate-950/40 shadow-sm shrink-0"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Spin Duration Slider */}
      <div className="space-y-2 pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{lang === 'ar' ? 'مدة التدوير (بالثواني):' : 'Spin Duration (Seconds):'}</span>
          </label>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-800">
            {config.spinDuration} {lang === 'ar' ? 'ثواني' : 'sec'}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="20"
          value={config.spinDuration}
          onChange={(e) => setConfig((prev) => ({ ...prev, spinDuration: Number(e.target.value) }))}
          className="w-full accent-amber-500 bg-slate-900 rounded-lg cursor-pointer h-2"
        />
      </div>

      {/* 4. Sound Effects Settings */}
      <div className="space-y-2 pt-2 border-t border-slate-700/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            {config.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{lang === 'ar' ? 'المؤثرات الصوتية:' : 'Sound Effects:'}</span>
          </label>

          <button
            onClick={() => setConfig((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              config.soundEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {config.soundEnabled
              ? lang === 'ar'
                ? 'مفعل ✅'
                : 'Enabled ✅'
              : lang === 'ar'
              ? 'مكتوم 🔇'
              : 'Muted 🔇'}
          </button>
        </div>

        {config.soundEnabled && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-slate-400 min-w-[50px]">
              {lang === 'ar' ? 'الصوت:' : 'Volume:'}
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.volume}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, volume: Number(e.target.value) }))
              }
              className="flex-1 accent-amber-500 bg-slate-900 rounded-lg cursor-pointer h-2"
            />
            <span className="text-xs font-mono text-slate-300">
              {Math.round(config.volume * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* 5. Auto Remove Winner Toggle */}
      <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between gap-3">
        <div className="space-y-0.5 min-w-0">
          <label className="text-xs font-bold text-slate-200 block truncate">
            {lang === 'ar' ? 'إزالة الفائز تلقائياً:' : 'Auto-Remove Winner:'}
          </label>
          <p className="text-[11px] text-slate-400 leading-tight">
            {lang === 'ar'
              ? 'حذف الخيار الفائز تلقائياً من العجلة بعد التدوير'
              : 'Automatically remove winning option after spin'}
          </p>
        </div>

        <button
          onClick={() =>
            setConfig((prev) => ({ ...prev, autoRemoveWinner: !prev.autoRemoveWinner }))
          }
          className={`w-12 h-6 rounded-full transition-colors relative p-0.5 shrink-0 ${
            config.autoRemoveWinner ? 'bg-amber-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
              config.autoRemoveWinner ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
