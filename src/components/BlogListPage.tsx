import React, { useState, useMemo } from 'react';
import { ARTICLES, Article } from '../data/articles';
import { Language } from '../types';
import { t } from '../utils/translations';
import { BookOpen, Clock, Calendar, ArrowRight, Search, Tag, Sparkles, Disc, Filter } from 'lucide-react';

interface BlogListPageProps {
  lang: Language;
  onSelectArticle: (slug: string) => void;
  onBackToHome: () => void;
}

export const BlogListPage: React.FC<BlogListPageProps> = ({
  lang,
  onSelectArticle,
  onBackToHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    ARTICLES.forEach((a) => {
      const catName = lang === 'ar' ? a.category.ar : a.category.en;
      cats.add(catName);
    });
    return Array.from(cats);
  }, [lang]);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const title = article.title[lang] || article.title.en;
      const desc = article.description[lang] || article.description.en;
      const cat = lang === 'ar' ? article.category.ar : article.category.en;
      const keywords = article.keywords.join(' ');

      const matchesSearch =
        !searchQuery.trim() ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        keywords.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || cat === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [lang, searchQuery, selectedCategory]);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto pt-2 pb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold">
          <BookOpen className="w-4 h-4" />
          <span>{t(lang, 'navArticles')}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {t(lang, 'blogTitle')}
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          {t(lang, 'blogSub')}
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(lang, 'searchArticles')}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all rtl:pl-4 rtl:pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white rtl:right-auto rtl:left-3"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick stats */}
          <div className="text-xs text-slate-400 font-medium">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {t(lang, 'allCategories')}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/20'
                  : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Search className="w-10 h-10 text-slate-500 mx-auto" />
          <p className="text-slate-300 font-semibold">No articles found matching your query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((article) => {
            const title = article.title[lang] || article.title.en;
            const description = article.description[lang] || article.description.en;
            const categoryName = lang === 'ar' ? article.category.ar : article.category.en;

            return (
              <a
                key={article.slug}
                href={`#/articles/${article.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectArticle(article.slug);
                  window.location.hash = `#/articles/${article.slug}`;
                }}
                className="group flex flex-col justify-between bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 sm:p-7 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 cursor-pointer"
              >
                <div className="space-y-4">
                  {/* Category & Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <Tag className="w-3 h-3" />
                      {categoryName}
                    </span>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
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

                  {/* Title */}
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors leading-snug">
                    {title}
                  </h2>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">
                    {description}
                  </p>
                </div>

                {/* Footer Read Action */}
                <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                    By {article.author}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 group-hover:text-amber-300 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                    <span>{t(lang, 'readArticle')}</span>
                    <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
