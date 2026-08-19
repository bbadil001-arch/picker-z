import React from 'react';
import { LegalDocType, LEGAL_DOCS } from '../data/legalContent';
import { Language } from '../types';
import { t } from '../utils/translations';
import { Shield, FileText, Info, Cookie, AlertTriangle, ArrowLeft, Printer, Share2, Mail } from 'lucide-react';

interface FullLegalPageProps {
  lang: Language;
  currentTab: LegalDocType;
  onSelectTab: (tab: LegalDocType) => void;
  onBackToHome: () => void;
  onOpenContact: () => void;
}

export const FullLegalPage: React.FC<FullLegalPageProps> = ({
  lang,
  currentTab,
  onSelectTab,
  onBackToHome,
  onOpenContact,
}) => {
  const tabs: { id: LegalDocType; labelKey: string; icon: any }[] = [
    { id: 'privacy', labelKey: 'privacyPolicy', icon: Shield },
    { id: 'terms', labelKey: 'termsOfService', icon: FileText },
    { id: 'about', labelKey: 'aboutUs', icon: Info },
    { id: 'cookies', labelKey: 'cookiePolicy', icon: Cookie },
    { id: 'disclaimer', labelKey: 'disclaimer', icon: AlertTriangle },
  ];

  const doc = LEGAL_DOCS[currentTab]?.[lang] || LEGAL_DOCS[currentTab]?.en;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const url = `${window.location.origin}/${currentTab}`;
    navigator.clipboard.writeText(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Top Breadcrumb & Back */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          <span>{t(lang, 'backToWheel')}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs flex items-center gap-1.5"
            title="Share document link"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">{t(lang, 'share')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors text-xs flex items-center gap-1.5"
            title="Print Document"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <a
              key={tab.id}
              href={`/${tab.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectTab(tab.id);
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{t(lang, tab.labelKey)}</span>
            </a>
          );
        })}
      </div>

      {/* Legal Document Container */}
      <article className="bg-slate-900/90 rounded-2xl border border-slate-800/80 p-5 sm:p-8 lg:p-10 shadow-xl space-y-6">
        {/* Document Header */}
        <div className="space-y-3 border-b border-slate-800 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
            <span>{doc.lastUpdated}</span>
            <span>•</span>
            <span>RandomizerWheel.com</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {doc.title}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {doc.summary}
          </p>
        </div>

        {/* Document Sections */}
        <div className="space-y-8 text-slate-200">
          {doc.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold text-amber-400 flex items-center gap-2">
                <span>{section.title}</span>
              </h2>
              <div className="space-y-2.5 text-sm sm:text-base leading-relaxed text-slate-300">
                {section.content.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Contact Assistance Footer */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/40 p-4 rounded-xl">
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-400">Questions about our policies or data handling?</p>
            <p className="text-sm font-semibold text-slate-200">Our compliance & support team is here to help.</p>
          </div>
          <button
            onClick={onOpenContact}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs sm:text-sm font-bold transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>{t(lang, 'contactUs')}</span>
          </button>
        </div>
      </article>
    </div>
  );
};
