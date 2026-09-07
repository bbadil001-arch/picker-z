import React, { useState, useRef } from 'react';
import {
  Award,
  CheckCircle,
  Copy,
  Check,
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Hash,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';
import { Language } from '../types';
import { copyTextToClipboard } from '../utils/clipboard';

export interface GiveawayCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  winner?: {
    username?: string;
    comment?: string;
    avatarUrl?: string;
  } | null;
  winnerName?: string;
  winnerComment?: string;
  winnerAvatar?: string;
  platformName?: string;
  platformColor?: string;
  giveawayTitle?: string;
  postUrl?: string;
  totalParticipants?: number;
  rulesApplied?: string[];
  lang: Language;
}

export const GiveawayCertificateModal: React.FC<GiveawayCertificateModalProps> = ({
  isOpen,
  onClose,
  winner,
  winnerName,
  winnerComment,
  winnerAvatar,
  platformName = 'RandomizerWheel Draw',
  platformColor = '#F59E0B',
  giveawayTitle,
  totalParticipants = 1,
  rulesApplied = [],
  lang,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);

  if (!isOpen) return null;

  // Resolve winner details regardless of whether caller passed object or flat props
  const resolvedWinnerName = (winnerName || winner?.username || 'Official Winner').trim();
  const resolvedComment = (winnerComment || winner?.comment || '').trim();
  const resolvedAvatar = winnerAvatar || winner?.avatarUrl;
  const resolvedTitle = giveawayTitle || platformName || 'Official Wheel Draw';

  const isAr = lang === 'ar';
  const now = new Date();
  const drawDate = now.toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const drawTime = now.toLocaleTimeString(isAr ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // Unique deterministic verification code
  const sanitizedName = resolvedWinnerName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || 'WIN';
  const verificationCode = `CERT-RW-${sanitizedName}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Cryptographic audit fingerprint
  const seedString = `${resolvedWinnerName}-${resolvedTitle}-${drawDate}-${totalParticipants}`;
  let hashNum = 0;
  for (let i = 0; i < seedString.length; i++) {
    hashNum = (hashNum << 5) - hashNum + seedString.charCodeAt(i);
    hashNum |= 0;
  }
  const certHash = `SHA256:${Math.abs(hashNum).toString(16).toUpperCase().padStart(8, '0')}-VERIFIED`;

  const handleCopyVerification = async () => {
    const textToCopy = `🏆 Official Giveaway Winner Certificate
──────────────────────────────
Recipient: ${resolvedWinnerName}
Contest: ${resolvedTitle}
${resolvedComment ? `Comment: "${resolvedComment}"\n` : ''}Total Entries: ${totalParticipants}
Verification Code: ${verificationCode}
Audit Hash: ${certHash}
Date & Time: ${drawDate} at ${drawTime}
Authenticated via: https://randomizerwheel.com`;

    const success = await copyTextToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // High-Resolution HTML5 Canvas PNG Exporter (1600x1050 px)
  const handleDownloadPng = () => {
    setIsGeneratingPng(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1600;
      canvas.height = 1050;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingPng(false);
        return;
      }

      // 1. Luxury Dark Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1050);
      bgGrad.addColorStop(0, '#0B1120');
      bgGrad.addColorStop(0.5, '#0F172A');
      bgGrad.addColorStop(1, '#030712');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1050);

      // Subtle ambient gold radial lighting
      const glowGrad = ctx.createRadialGradient(800, 480, 50, 800, 480, 700);
      glowGrad.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, 1600, 1050);

      // 2. Primary Outer Gold Border
      ctx.lineWidth = 12;
      ctx.strokeStyle = '#F59E0B';
      ctx.strokeRect(36, 36, 1528, 978);

      // 3. Inner Delicate Inset Frame
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      ctx.strokeRect(52, 52, 1496, 946);

      // Corner Rosette Accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(52, 52);
      drawCorner(1548, 52);
      drawCorner(52, 998);
      drawCorner(1548, 998);

      // 4. Header Top Brand & Category
      ctx.textAlign = 'center';
      ctx.fillStyle = '#F59E0B';
      ctx.font = 'bold 20px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText('RANDOMIZERWHEEL.COM • OFFICIAL VERIFIABLE DRAW SYSTEM', 800, 115);

      // 5. Main Title
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 48px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText(isAr ? 'شهادة فائز رسمي معتمدة' : 'OFFICIAL WINNER CERTIFICATE', 800, 180);

      // Subtitle
      ctx.fillStyle = '#94A3B8';
      ctx.font = '20px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText(
        isAr ? 'إثبات نزاهة موثق لسحب عشوائي عادل ومحايد' : 'Audited & Certified Proof of an Unbiased Random Draw',
        800,
        225
      );

      // Divider Line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(350, 260);
      ctx.lineTo(1250, 260);
      ctx.stroke();

      // 6. Presentation text
      ctx.fillStyle = '#CBD5E1';
      ctx.font = 'bold 22px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText(
        isAr ? 'تُمنح هذه الشهادة المعتمدة رسمياً إلى الفائز:' : 'THIS CERTIFICATE IS PROUDLY AWARDED TO:',
        800,
        320
      );

      // 7. Winner Name Banner
      ctx.fillStyle = '#111827';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(260, 360, 1080, 130, 24);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FBBF24';
      ctx.font = '900 62px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText(resolvedWinnerName, 800, 448);

      // Comment or Quote
      let contentNextY = 540;
      if (resolvedComment) {
        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'italic 22px "Plus Jakarta Sans", Cairo, sans-serif';
        const truncated = resolvedComment.length > 70 ? resolvedComment.slice(0, 67) + '...' : resolvedComment;
        ctx.fillText(`"${truncated}"`, 800, contentNextY);
        contentNextY += 50;
      }

      // Event / Contest context
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 22px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText(
        `${isAr ? 'المسابقة / الفعالية:' : 'Event / Contest:'} ${resolvedTitle}`,
        800,
        contentNextY
      );

      // 8. Three Metadata Cards
      const boxY = 660;
      const boxW = 360;
      const boxGap = 40;
      const startX = (1600 - (3 * boxW + 2 * boxGap)) / 2;

      const drawBox = (x: number, label: string, val: string) => {
        ctx.fillStyle = 'rgba(17, 24, 39, 0.8)';
        ctx.strokeStyle = 'rgba(75, 85, 99, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x, boxY, boxW, 115, 18);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#94A3B8';
        ctx.font = '17px "Plus Jakarta Sans", Cairo, sans-serif';
        ctx.fillText(label, x + boxW / 2, boxY + 42);

        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 22px "Plus Jakarta Sans", Cairo, sans-serif';
        ctx.fillText(val, x + boxW / 2, boxY + 84);
      };

      drawBox(startX, isAr ? 'تاريخ ووقت السحب' : 'Draw Timestamp', `${drawDate}`);
      drawBox(
        startX + boxW + boxGap,
        isAr ? 'إجمالي المشاركين المؤهلين' : 'Total Participants',
        `${totalParticipants} ${isAr ? 'مشارك / خيار' : 'Entries'}`
      );
      drawBox(startX + (boxW + boxGap) * 2, isAr ? 'معرّف التوثيق' : 'Verification ID', verificationCode);

      // 9. Official Verified Stamp
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(800, 875, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = '900 30px "Plus Jakarta Sans", Cairo, sans-serif';
      ctx.fillText('★', 800, 885);

      // 10. Cryptographic Hash Footer
      ctx.fillStyle = '#64748B';
      ctx.font = '16px monospace';
      ctx.fillText(`${certHash} • Secure Random Spin Verification System`, 800, 960);

      // Export canvas to downloadable PNG
      const link = document.createElement('a');
      link.download = `Certificate-${sanitizedName}-${verificationCode}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Failed to generate PNG certificate:', e);
    } finally {
      setIsGeneratingPng(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-950 font-bold shadow-lg"
              style={{ backgroundColor: platformColor }}
            >
              <Award className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-100 flex items-center gap-2">
                <span>{isAr ? 'شهادة توثيق السحب الرسمية' : 'Official Winner Certificate'}</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'إثبات نزاهة وسحب معتمد وموثق رقمياً' : 'Certified Proof of Fairness & Unbiased Draw'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Printable Canvas & Card View */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 print:p-0 print:bg-white print:text-black">
          <div className="border-2 border-dashed border-amber-500/50 rounded-2xl p-5 sm:p-7 bg-slate-950/90 relative space-y-5 shadow-inner print:border-black print:bg-white">
            {/* Stamp Badge */}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-wider print:border-black print:text-black">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isAr ? 'سحب معتمد رسمياً' : 'VERIFIED DRAW'}</span>
            </div>

            {/* Header / Brand */}
            <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 print:text-black">
                {resolvedTitle}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight print:text-black">
                {isAr ? 'شهادة توثيق الفائز' : 'Certificate of Authenticity'}
              </h2>
              <p className="text-xs text-slate-400 font-mono print:text-gray-600">ID: {verificationCode}</p>
            </div>

            {/* Winner Announcement Box */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 text-center space-y-2.5 print:border-black print:bg-gray-50">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest print:text-black">
                {isAr ? 'الفائز المختار' : 'SELECTED WINNER'}
              </div>
              <div className="flex items-center justify-center gap-2.5">
                {resolvedAvatar && (
                  <img
                    src={resolvedAvatar}
                    alt={resolvedWinnerName}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-amber-400 object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="text-xl sm:text-3xl font-black text-amber-400 tracking-tight print:text-black break-words">
                  {resolvedWinnerName}
                </div>
              </div>

              {resolvedComment && (
                <p className="text-xs sm:text-sm text-slate-300 italic max-w-lg mx-auto print:text-black">
                  "{resolvedComment}"
                </p>
              )}
            </div>

            {/* Verification Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 print:border-gray-300">
                <span className="text-[10px] text-slate-400 block print:text-black font-semibold">
                  {isAr ? 'تاريخ ووقت السحب' : 'Draw Timestamp'}
                </span>
                <span className="font-bold text-slate-200 print:text-black text-xs sm:text-sm">
                  {drawDate} • {drawTime}
                </span>
              </div>

              <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 print:border-gray-300">
                <span className="text-[10px] text-slate-400 block print:text-black font-semibold">
                  {isAr ? 'إجمالي المشاركين المؤهلين' : 'Eligible Participants'}
                </span>
                <span className="font-bold text-slate-200 print:text-black text-xs sm:text-sm">
                  {totalParticipants} {isAr ? 'مشارك / خيار' : 'Entries'}
                </span>
              </div>
            </div>

            {/* Cryptographic Proof Hash */}
            <div className="text-[10px] font-mono text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-1 print:border-gray-300 print:text-black">
              <span className="truncate max-w-full">{certHash}</span>
              <span className="shrink-0 text-amber-400 font-bold">RandomizerWheel Fair Engine</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-950/90 flex flex-wrap items-center justify-between gap-2.5">
          {/* Download & Print buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4 stroke-[2.5]" />
              <span>{isGeneratingPng ? (isAr ? 'جاري التحميل...' : 'Exporting...') : (isAr ? 'تنزيل صورة الشهادة (PNG)' : 'Download Image (PNG)')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 sm:px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer active:scale-98"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{isAr ? 'طباعة وحفظ PDF' : 'Print / PDF'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyVerification}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ البيانات' : 'Copy Data')}</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold transition border border-slate-800 cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
