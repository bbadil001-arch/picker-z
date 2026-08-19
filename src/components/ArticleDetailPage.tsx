import React, { useState, useEffect } from 'react';
import { Article, ARTICLES } from '../data/articles';
import { Language } from '../types';
import { t } from '../utils/translations';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Check,
  Tag,
  ChevronDown,
  Sparkles,
  Disc,
  HelpCircle,
  BookOpen,
  ArrowRight,
  List,
  AlertCircle,
  Lightbulb,
  Info,
} from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
  lang: Language;
  onBackToArticles: () => void;
  onNavigateToArticle: (slug: string) => void;
  onNavigateToPage: (page: 'wheel' | 'yesno' | 'numbers' | 'names') => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  lang,
  onBackToArticles,
  onNavigateToArticle,
  onNavigateToPage,
}) => {
  const [copied, setCopied] = useState(false);
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const article = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];

  const title = article.title[lang] || article.title.en;
  const description = article.description[lang] || article.description.en;
  const categoryName = lang === 'ar' ? article.category.ar : article.category.en;
  const sections = article.sections[lang] || article.sections.en;
  const faqs = article.faqs[lang] || article.faqs.en || [];

  // Related articles (exclude current)
  const relatedArticles = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Copy link
  const handleCopyLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#/articles/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Social share
  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp' | 'telegram') => {
    const url = encodeURIComponent(
      `${window.location.origin}${window.location.pathname}#/articles/${article.slug}`
    );
    const text = encodeURIComponent(title);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  // Structured Data Schema for Google
  useEffect(() => {
    const jsonLdData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: title,
          description: description,
          author: {
            '@type': 'Organization',
            name: article.author,
          },
          publisher: {
            '@type': 'Organization',
            name: 'RandomizerWheel.com',
            url: 'https://randomizerwheel.com',
          },
          datePublished: article.publishedDate,
          inLanguage: lang,
          keywords: article.keywords.join(', '),
        },
        ...(faqs.length > 0
          ? [
              {
                '@type': 'FAQPage',
                mainEntity: faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              },
            ]
          : []),
      ],
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-json-ld';
    script.text = JSON.stringify(jsonLdData);
    document.head.appendChild(script);

    return () => {
      const existing = document.getElementById('article-json-ld');
      if (existing) existing.remove();
    };
  }, [article, title, description, lang, faqs]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Breadcrumb Navigation */}
      <nav className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-400 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToPage('wheel')}
            className="hover:text-amber-400 transition-colors font-medium"
          >
            {t(lang, 'navWheel')}
          </button>
          <span>/</span>
          <button
            onClick={onBackToArticles}
            className="hover:text-amber-400 transition-colors font-medium"
          >
            {t(lang, 'navArticles')}
          </button>
          <span>/</span>
          <span className="text-slate-200 font-semibold truncate max-w-[200px] sm:max-w-xs">
            {title}
          </span>
        </div>

        <button
          onClick={onBackToArticles}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
          <span>{t(lang, 'backToArticles')}</span>
        </button>
      </nav>

      {/* Main Article Container */}
      <article className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-8 lg:p-10 shadow-2xl space-y-8">
        {/* Article Header */}
        <header className="space-y-4 border-b border-slate-800 pb-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Tag className="w-3 h-3" />
              {categoryName}
            </span>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {article.readTimeMinutes} {t(lang, 'minRead')}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.publishedDate}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
            {description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-400 font-medium">
              <span>{t(lang, 'author')}: </span>
              <span className="text-slate-200 font-bold">{article.author}</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-slate-700 transition-all text-xs flex items-center gap-1.5"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? t(lang, 'copied') : t(lang, 'share')}</span>
              </button>
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/40 transition-colors text-xs font-bold"
                title="Share on WhatsApp"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="px-2.5 py-1.5 rounded-xl bg-sky-950/40 border border-sky-800/50 text-sky-400 hover:bg-sky-900/40 transition-colors text-xs font-bold"
                title="Share on Twitter"
              >
                X / Twitter
              </button>
            </div>
          </div>
        </header>

        {/* Table of Contents */}
        {sections.length > 1 && (
          <div className="bg-slate-950/70 rounded-2xl border border-slate-800 p-5 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <List className="w-4 h-4" />
              <span>{t(lang, 'tableOfContents')}</span>
            </div>
            <ul className="space-y-1.5 text-sm text-slate-300 list-inside">
              {sections.map((section, idx) => (
                <li key={idx}>
                  <a
                    href={`#section-${idx}`}
                    className="hover:text-amber-400 hover:underline transition-colors cursor-pointer"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body Content */}
        <div className="space-y-10 text-slate-200">
          {sections.map((section, idx) => (
            <section key={idx} id={`section-${idx}`} className="space-y-4 scroll-mt-20">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-400 tracking-tight flex items-center gap-2 border-b border-slate-800/60 pb-2">
                <span>{section.heading}</span>
              </h2>

              <div className="space-y-3.5 text-sm sm:text-base leading-relaxed text-slate-300">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li key={bpIdx} className="flex items-start gap-2 text-sm sm:text-base text-slate-300">
                      <span className="text-amber-400 font-bold shrink-0 mt-1">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div
                  className={`p-4 sm:p-5 rounded-2xl border flex items-start gap-3.5 ${
                    section.callout.type === 'tip'
                      ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                      : section.callout.type === 'warning'
                      ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                      : 'bg-indigo-950/20 border-indigo-500/30 text-indigo-200'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {section.callout.type === 'tip' ? (
                      <Lightbulb className="w-5 h-5 text-amber-400" />
                    ) : section.callout.type === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-rose-400" />
                    ) : (
                      <Info className="w-5 h-5 text-indigo-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm sm:text-base">{section.callout.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {section.callout.text}
                    </p>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQs Accordion */}
        {faqs.length > 0 && (
          <div className="space-y-4 pt-8 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                {t(lang, 'articleFaq')}
              </h3>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndices.includes(fIdx);
                return (
                  <div
                    key={fIdx}
                    className="rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleFaq(fIdx)}
                      className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-bold text-sm sm:text-base text-slate-100 hover:text-amber-400 transition-colors"
                      dir={lang === 'ar' ? 'rtl' : 'ltr'}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Keyword Tags for Search Engines */}
        <div className="pt-6 border-t border-slate-800 space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Topics & Keywords:
          </span>
          <div className="flex flex-wrap gap-2">
            {article.keywords.map((kw, kwIdx) => (
              <span
                key={kwIdx}
                className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs hover:border-slate-700 transition-colors"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Interactive CTA Widget */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-amber-950/20 border border-amber-500/30 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 mx-auto shadow-lg shadow-amber-500/30">
            <Disc className="w-6 h-6 animate-spin-slow" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-lg sm:text-xl font-black text-white">
              {article.suggestedAction?.label[lang] || t(lang, 'clickToSpin')}
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Put this guide into practice immediately with our free, transparent randomizer tools.
            </p>
          </div>

          <button
            onClick={() => onNavigateToPage(article.suggestedAction?.targetPage || 'wheel')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{article.suggestedAction?.label[lang] || t(lang, 'backToWheel')}</span>
          </button>
        </div>
      </article>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>{t(lang, 'relatedArticles')}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedArticles.map((rel) => {
              const relTitle = rel.title[lang] || rel.title.en;
              const relDesc = rel.description[lang] || rel.description.en;
              return (
                <a
                  key={rel.slug}
                  href={`#/articles/${rel.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToArticle(rel.slug);
                    window.location.hash = `#/articles/${rel.slug}`;
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group bg-slate-900/80 hover:bg-slate-900 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all space-y-2 cursor-pointer"
                >
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {lang === 'ar' ? rel.category.ar : rel.category.en}
                  </span>
                  <h4 className="text-base font-bold text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {relTitle}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2">{relDesc}</p>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
