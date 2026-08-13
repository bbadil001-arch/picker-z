import React, { useState } from 'react';
import { Mail, Send, Copy, Check, MessageSquare, HelpCircle, Sparkles, X, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';
import { WheelOption, Language } from '../types';
import { t } from '../utils/translations';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  currentOptions?: WheelOption[];
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  lang,
  currentOptions = [],
}) => {
  const CONTACT_EMAIL = 'yhpro.help@gmail.com';

  const [requestType, setRequestType] = useState<string>('feature');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeWheelData, setIncludeWheelData] = useState(false);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Build mailto link as direct alternative
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  const handleSendMailto = () => {
    const typeLabels: Record<string, string> = {
      feature: 'Request New Options / Feature',
      bug: 'Report Issue / Bug',
      template: 'Custom Wheel Template Request',
      help: 'General Help & Support',
    };

    let fullBody = `Name: ${senderName || 'Anonymous'}\nSender Email: ${senderEmail || 'Not provided'}\nRequest Type: ${typeLabels[requestType] || requestType}\n\nMessage:\n${message}\n`;

    if (includeWheelData && currentOptions.length > 0) {
      fullBody += `\n--- Attached Current Wheel Options (${currentOptions.length}) ---\n` +
        currentOptions.map((o) => `• ${o.label}`).join('\n');
    }

    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject || `[RandomizerWheel Support] ${typeLabels[requestType] || 'Help Request'}`
    )}&body=${encodeURIComponent(fullBody)}`;

    window.open(mailtoUrl, '_blank');
  };

  const handleResetForm = () => {
    setIsSubmitted(false);
    setMessage('');
    setSubject('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-[95vw] sm:w-full p-4 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100">
                {lang === 'ar' ? 'تواصل معنا واطلب مساعدة / خيارات جديدة' : 'Contact Us & Request Help'}
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'ar' ? 'يسعدنا استقبال آرائك واقتراحاتك لتطوير العجلة' : 'We love to hear your feedback & feature requests'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Direct Contact Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-yellow-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
              {lang === 'ar' ? 'البريد الإلكتروني المباشر للدعم:' : 'Direct Support Email:'}
            </span>
            <p className="text-xs sm:text-sm font-mono font-bold text-slate-100 select-all">
              {CONTACT_EMAIL}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedEmail ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ البريد' : 'Copy Email')}</span>
            </button>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=RandomizerWheel%20Help%20Request`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إرسال بريد' : 'Mail Us'}</span>
            </a>
          </div>
        </div>

        {/* Form Body or Success Confirmation */}
        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-100">
                {lang === 'ar' ? 'تم تجهيز الطلب بنجاح! 🎉' : 'Request Prepared Successfully! 🎉'}
              </h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {lang === 'ar'
                  ? 'شكراً لك! يمكنك إكمال إرسال الرسالة مباشرة عبر برنامج البريد الخاص بك بضغطة زر:'
                  : 'Thank you! You can now send your message directly via your email client below:'}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={handleSendMailto}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" />
                <span>{lang === 'ar' ? 'فتح تطبيق البريد والإرسال' : 'Open Email App & Send'}</span>
              </button>

              <button
                onClick={handleResetForm}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
              >
                {lang === 'ar' ? 'كتابة طلب آخر' : 'Submit Another Request'}
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Request Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{lang === 'ar' ? 'نوع الطلب أو الاستفسار:' : 'Request Category:'}</span>
              </label>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'feature', labelEn: 'Request Options / Feature', labelAr: 'طلب خيارات / ميزة جديدة' },
                  { id: 'help', labelEn: 'General Help & Support', labelAr: 'مساعدة واستفسار عام' },
                  { id: 'template', labelEn: 'Custom Wheel Template', labelAr: 'اقتراح قالب عجلة جاهز' },
                  { id: 'bug', labelEn: 'Report Issue / Bug', labelAr: 'الإبلاغ عن مشكلة' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRequestType(item.id)}
                    className={`p-2 rounded-xl border text-left rtl:text-right font-medium transition ${
                      requestType === item.id
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {lang === 'ar' ? item.labelAr : item.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Sender Name & Email Input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  {lang === 'ar' ? 'الاسم (اختياري):' : 'Your Name (Optional):'}
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: محمد' : 'e.g. Alex'}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400">
                  {lang === 'ar' ? 'بريدك الإلكتروني (للتواصل معك):' : 'Your Email (For replies):'}
                </label>
                <input
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Subject Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">
                {lang === 'ar' ? 'عنوان الرسالة / الموضوع:' : 'Subject:'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'اكتب عنوان موجز للطلب...'
                    : 'Brief subject for your request...'
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Message Body Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400">
                {lang === 'ar' ? 'تفاصيل الطلب أو الاقتراح:' : 'Request Details & Description:'}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
                placeholder={
                  lang === 'ar'
                    ? 'اكتب تفاصيل الخيارات التي ترغب بإضافتها أو شرح المشكلة التي تواجهها هنا...'
                    : 'Describe the options you would like added, or the help/features you need...'
                }
                className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none custom-scrollbar"
              />
            </div>

            {/* Attach Current Options Toggle */}
            {currentOptions.length > 0 && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                <span className="text-slate-300">
                  {lang === 'ar'
                    ? `إرفاق قائمة الخيارات الحالية (${currentOptions.length} عنصر)`
                    : `Attach current wheel list (${currentOptions.length} items)`}
                </span>
                <button
                  type="button"
                  onClick={() => setIncludeWheelData(!includeWheelData)}
                  className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
                    includeWheelData ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-slate-950 transition-transform ${
                      includeWheelData ? 'translate-x-4 rtl:-translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 transition"
            >
              <Send className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? lang === 'ar'
                    ? 'جاري تجهيز الطلب...'
                    : 'Processing Request...'
                  : lang === 'ar'
                  ? 'إرسال طلب الدعم والخيارات'
                  : 'Submit Request / Apply for Help'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
