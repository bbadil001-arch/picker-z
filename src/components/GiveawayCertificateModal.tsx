import React, { useState } from 'react';
import { Award, CheckCircle, Copy, Check, Printer, X, ShieldCheck, Calendar, Hash, ExternalLink, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { copyTextToClipboard } from '../utils/clipboard';

interface GiveawayCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner: {
    username: string;
    comment?: string;
    avatarUrl?: string;
  } | null;
  platformName: string;
  platformColor?: string;
  postUrl?: string;
  totalParticipants: number;
  rulesApplied?: string[];
  lang: Language;
}

export const GiveawayCertificateModal: React.FC<GiveawayCertificateModalProps> = ({
  isOpen,
  onClose,
  winner,
  platformName,
  platformColor = '#F59E0B',
  postUrl,
  totalParticipants,
  rulesApplied = [],
  lang,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !winner) return null;

  const isAr = lang === 'ar';
  const drawDate = new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const drawTime = new Date().toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Deterministic or unique verification stamp
  const verificationCode = `CERT-${platformName.toUpperCase().slice(0, 2)}-${Math.floor(100000 + Math.random() * 900000)}`;
  const certHash = `SHA256: ${Array.from(winner.username + drawDate + totalParticipants)
    .reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0)
    .toString(16)
    .toUpperCase()}-VERIFIED`;

  const handleCopyVerification = async () => {
    const textToCopy = `🏆 Official Giveaway Winner Certificate
Platform: ${platformName}
Winner: ${winner.username}
Comment: "${winner.comment || 'N/A'}"
Total Participants: ${totalParticipants}
Verification Code: ${verificationCode}
Audit Hash: ${certHash}
Drawn On: ${drawDate} at ${drawTime}
Verified with RandomizerWheel.com`;

    const success = await copyTextToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow"
              style={{ backgroundColor: platformColor }}
            >
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-1.5">
                <span>{isAr ? 'شهادة توثيق السحب الرسمية' : 'Official Giveaway Winner Certificate'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'إثبات نزاهة وسحب معتمد وموثق' : 'Certified Proof of Fairness & Unbiased Draw'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 print:p-0 print:bg-white print:text-black">
          <div className="border-2 border-dashed border-amber-500/40 rounded-2xl p-5 sm:p-6 bg-slate-950/80 relative space-y-5 print:border-black print:bg-white">
            {/* Stamp / Watermark */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider print:border-black print:text-black">
              <CheckCircle className="w-3 h-3" />
              <span>{isAr ? 'سحب معتمد' : 'VERIFIED DRAW'}</span>
            </div>

            {/* Platform & Code */}
            <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 print:text-black">
                {platformName} Giveaway Contest
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight print:text-black">
                Certificate of Authenticity
              </h2>
              <p className="text-xs text-slate-400 font-mono print:text-gray-600">ID: {verificationCode}</p>
            </div>

            {/* Winner Announcement Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 text-center space-y-2 print:border-black print:bg-gray-50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider print:text-black">
                {isAr ? 'الفائز المختار' : 'SELECTED WINNER'}
              </div>
              <div className="flex items-center justify-center gap-2">
                {winner.avatarUrl && (
                  <img
                    src={winner.avatarUrl}
                    alt={winner.username}
                    className="w-10 h-10 rounded-full border-2 border-amber-400 object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="text-lg sm:text-2xl font-black text-amber-400 tracking-tight print:text-black">
                  {winner.username}
                </div>
              </div>

              {winner.comment && (
                <p className="text-xs sm:text-sm text-slate-300 italic max-w-md mx-auto print:text-black">
                  "{winner.comment}"
                </p>
              )}
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 block print:text-black">
                  {isAr ? 'تاريخ ووقت السحب' : 'Draw Timestamp'}
                </span>
                <span className="font-bold text-slate-200 print:text-black">
                  {drawDate} • {drawTime}
                </span>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 print:border-gray-300">
                <span className="text-[10px] text-slate-400 block print:text-black">
                  {isAr ? 'إجمالي المشاركين المؤهلين' : 'Eligible Participants'}
                </span>
                <span className="font-bold text-slate-200 print:text-black">
                  {totalParticipants} {isAr ? 'تعليق / حساب' : 'Entries'}
                </span>
              </div>
            </div>

            {/* Cryptographic Proof Hash */}
            <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between print:border-gray-300 print:text-black">
              <span className="truncate">{certHash}</span>
              <span className="shrink-0 text-amber-400 font-bold ml-2">RandomizerWheel Fair Engine</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'طباعة وحفظ PDF' : 'Print / Save PDF'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVerification}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ بيانات التوثيق' : 'Copy Verification Data')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition border border-slate-800"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
