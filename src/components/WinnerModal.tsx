import React, { useEffect } from 'react';
import { WheelOption } from '../types';
import confetti from 'canvas-confetti';
import { Trophy, Trash2, RotateCcw, Copy, Check } from 'lucide-react';

interface WinnerModalProps {
  winner: WheelOption | null;
  onClose: () => void;
  onRemoveWinner: (id: string) => void;
  lang: 'ar' | 'en';
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  onClose,
  onRemoveWinner,
  lang,
}) => {
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    if (winner) {
      // Fire celebratory confetti explosion
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
        });
      } catch (e) {}
    }
  }, [winner]);

  if (!winner) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(winner.label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRemove = () => {
    onRemoveWinner(winner.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border-2 border-amber-500/80 rounded-3xl max-w-md w-[92vw] sm:w-full p-5 sm:p-6 text-center shadow-2xl shadow-amber-500/20 relative space-y-4 sm:space-y-5 animate-scaleUp">
        {/* Glow effect */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-amber-500/30 rounded-full blur-2xl pointer-events-none" />

        {/* Trophy Icon Badge */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-500 to-yellow-300 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40 border-4 border-slate-900">
          <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-slate-950 fill-slate-950 animate-bounce" />
        </div>

        <div>
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {lang === 'ar' ? '🎉 الفائز في القرعة' : '🎉 Winner Selected'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-2.5 px-2 break-words leading-tight">
            {winner.label}
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1 sm:pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 sm:py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            <span>{lang === 'ar' ? 'تدوير مرة أخرى' : 'Spin Again'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleRemove}
              className="py-2.5 px-3 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-4 h-4 shrink-0" />
              <span className="truncate">{lang === 'ar' ? 'إزالة الفائز' : 'Remove Winner'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 shrink-0" />
                  <span className="truncate">{lang === 'ar' ? 'نسخ الاسم' : 'Copy Name'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
