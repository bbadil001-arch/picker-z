import React, { useState } from 'react';
import { Shield, FileText, Info, Cookie, AlertTriangle, X, Mail, CheckCircle2, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { LEGAL_DOCS, LegalDocType } from '../data/legalContent';
import { t } from '../utils/translations';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: LegalDocType;
  onOpenContact?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialTab = 'privacy',
  onOpenContact,
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocType>(initialTab);

  // Sync initial tab when opened
  React.useEffect(() => {
    if (initialTab) {
      setActiveDoc(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const docCategoryIcons: Record<LegalDocType, React.ElementType> = {
    privacy: Shield,
    terms: FileText,
    about: Info,
    cookies: Cookie,
    disclaimer: AlertTriangle,
  };

  const navTabs: Array<{ id: LegalDocType; labelKeyEn: string; labelKeyAr: string }> = [
    { id: 'privacy', labelKeyEn: 'Privacy Policy', labelKeyAr: 'سياسة الخصوصية' },
    { id: 'terms', labelKeyEn: 'Terms of Service', labelKeyAr: 'شروط الخدمة' },
    { id: 'about', labelKeyEn: 'About Us', labelKeyAr: 'من نحن' },
    { id: 'cookies', labelKeyEn: 'Cookie Policy', labelKeyAr: 'سياسة الكوكيز' },
    { id: 'disclaimer', labelKeyEn: 'Disclaimer', labelKeyAr: 'إخلاء المسؤولية' },
  ];

  const currentDocMap = LEGAL_DOCS[activeDoc] || LEGAL_DOCS.privacy;
  const currentDoc = currentDocMap[lang] || currentDocMap.en;
  const ActiveIcon = docCategoryIcons[activeDoc] || Shield;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-[96vw] sm:w-full h-[90vh] shadow-2xl flex flex-col overflow-hidden relative">
        {/* Modal Top Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
              <ActiveIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-100 flex items-center gap-2">
                <span>{currentDoc.title}</span>
                <span className="text-[10px] font-bold text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  AdSense Compliant
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'آخر تحديث:' : 'Last Updated:'} {currentDoc.lastUpdated} • RandomizerWheel.com
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Bar */}
        <div className="px-4 sm:px-6 py-2 bg-slate-950/40 border-b border-slate-800 flex items-center gap-1 sm:gap-2 overflow-x-auto custom-scrollbar shrink-0">
          {navTabs.map((tab) => {
            const Icon = docCategoryIcons[tab.id];
            const isActive = activeDoc === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDoc(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{lang === 'ar' ? tab.labelKeyAr : tab.labelKeyEn}</span>
              </button>
            );
          })}

          {onOpenContact && (
            <button
              onClick={() => {
                onClose();
                onOpenContact();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap text-amber-300 hover:bg-amber-500/10 border border-amber-500/20 ml-auto rtl:mr-auto rtl:ml-0"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'ar' ? 'تواصل معنا' : 'Contact Us'}</span>
            </button>
          )}
        </div>

        {/* Document Content Body */}
        <div className="p-4 sm:p-6 sm:px-8 overflow-y-auto custom-scrollbar flex-1 space-y-6 text-slate-300 text-sm leading-relaxed">
          {/* Summary Callout Banner */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'ملخص الوثيقة والالتزام' : 'Policy Overview'}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {currentDoc.summary}
            </p>
          </div>

          {/* Section Items */}
          <div className="space-y-6">
            {currentDoc.sections.map((section, idx) => (
              <div key={idx} className="space-y-2 pb-4 border-b border-slate-800/80 last:border-0">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-4 rounded-full bg-amber-500 shrink-0" />
                  <span>{section.title}</span>
                </h3>
                <div className="space-y-2 text-slate-300 text-xs sm:text-sm pl-3.5 rtl:pr-3.5 rtl:pl-0">
                  {section.content.map((paragraph, pIdx) => (
                    <p key={pIdx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Google AdSense Direct Disclosures Box */}
          {activeDoc === 'privacy' && (
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {lang === 'ar'
                    ? 'إفصاحات جوجل أدسنس الرسمية وحقوق المستخدم'
                    : 'Google AdSense Partner & User Choices'}
                </span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {lang === 'ar'
                  ? 'يلتزم موقع RandomizerWheel.com ببرنامج Google AdSense وشروط الخدمة وسياسات الخصوصية ذات الصلة. يمكنك ضبط تفضيلاتك الإعلانية أو تعطيل ملفات تعريف الارتباط الإعلانية المخصصة في أي وقت عبر الرابط الرسمي أدناه:'
                  : 'RandomizerWheel.com complies with Google AdSense program policies. You can manage or opt out of personalized interest-based advertising at any time by visiting Google Ad Settings:'}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  <span>Google Ads Settings</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition"
                >
                  <span>AboutAds Choice</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <span>© 2026 RandomizerWheel.com</span>
            <span>•</span>
            <span className="font-mono text-amber-400">yhpro.help@gmail.com</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenContact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition"
              >
                {lang === 'ar' ? 'طلب استفسار' : 'Submit Inquiry'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
