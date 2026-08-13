import React from 'react';
import { SpinHistoryItem } from '../types';
import { History, Trash2, Clock } from 'lucide-react';

interface SpinHistoryProps {
  history: SpinHistoryItem[];
  onClearHistory: () => void;
  lang: 'ar' | 'en';
}

export const SpinHistory: React.FC<SpinHistoryProps> = ({ history, onClearHistory, lang }) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-xl w-full space-y-3">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400 shrink-0" />
          <h2 className="text-sm sm:text-base font-bold text-slate-100">
            {lang === 'ar' ? 'سجل الفائزين السابقين' : 'Spin History'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-amber-300 font-semibold border border-slate-600">
            {history.length}
          </span>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مسح السجل' : 'Clear'}</span>
        </button>
      </div>

      <div className="max-h-40 sm:max-h-48 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {history.map((item, idx) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-slate-700/60 text-xs"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                #{history.length - idx}
              </span>
              <span className="font-bold text-slate-100 truncate">{item.winner}</span>
            </div>

            <div className="flex items-center gap-1 text-slate-400 text-[10px] sm:text-[11px] shrink-0">
              <Clock className="w-3 h-3" />
              <span>{item.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
