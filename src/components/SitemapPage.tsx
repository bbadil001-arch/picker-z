import React, { useState, useMemo } from 'react';
import { ARTICLES } from '../data/articles';
import { Language } from '../types';
import { t } from '../utils/translations';
import {
  Compass,
  Disc,
  Youtube,
  Instagram,
  Facebook,
  CheckCircle2,
  Dices,
  UserCheck,
  BookOpen,
  Shield,
  Search,
  ExternalLink,
  Calendar,
  Clock,
  Tag,
  ArrowUpRight,
  FileText,
  FileCode,
  Sparkles,
  HelpCircle,
  Mail,
  ChevronRight,
} from 'lucide-react';
import { LegalDocType } from '../data/legalContent';

interface SitemapPageProps {
  lang: Language;
  onNavigateToPage: (page: string) => void;
  onSelectArticle: (slug: string) => void;
  onOpenLegal: (tab: LegalDocType) => void;
}

export const SitemapPage: React.FC<SitemapPageProps> = ({
  lang,
  onNavigateToPage,
  onSelectArticle,
  onOpenLegal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const tools = [
    {
      id: 'wheel',
      path: '/wheel',
      name: lang === 'ar' ? 'عجلة القرعة واختيار الأسماء المخصصة' : 'Custom Spin Wheel & Name Picker',
      desc:
        lang === 'ar'
          ? 'عجلة قرعة تفاعلية لاختيار الأسماء، الأرقام والقرارات مع مؤثرات صوتية وألوان متعددة.'
          : 'Interactive customizable wheel spinner for names, raffles, and decisions with sound effects.',
      icon: Disc,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-400 border-amber-500/30',
      badge: lang === 'ar' ? 'الأداة الرئيسية' : 'Core Tool',
    },
    {
      id: 'youtube-comment-picker',
      path: '/youtube-comment-picker',
      name: lang === 'ar' ? 'قرعة تعليقات يوتيوب (YouTube Comment Picker)' : 'YouTube Comment Picker',
      desc:
        lang === 'ar'
          ? 'سحب فائز عشوائي من تعليقات فيديوهات اليوتيوب للمسابقات والسحوبات بشفافية.'
          : 'Pick random winners from YouTube video comments for giveaways and contests.',
      icon: Youtube,
      color: 'from-red-500/20 to-red-600/10 text-red-400 border-red-500/30',
      badge: lang === 'ar' ? 'سوشيال ميديا' : 'Social Giveaway',
    },
    {
      id: 'instagram-comment-picker',
      path: '/instagram-comment-picker',
      name: lang === 'ar' ? 'قرعة تعليقات انستقرام (Instagram Comment Picker)' : 'Instagram Comment Picker',
      desc:
        lang === 'ar'
          ? 'اختيار فائز عشوائي في مسابقات منشورات وريلز انستقرام مباشرة وبدون تسجيل.'
          : 'Randomly choose winners from Instagram post and reels comments for promotions.',
      icon: Instagram,
      color: 'from-pink-500/20 to-purple-600/10 text-pink-400 border-pink-500/30',
      badge: lang === 'ar' ? 'سوشيال ميديا' : 'Social Giveaway',
    },
    {
      id: 'tiktok-comment-picker',
      path: '/tiktok-comment-picker',
      name: lang === 'ar' ? 'قرعة تعليقات تيك توك (TikTok Comment Picker)' : 'TikTok Comment Picker',
      desc:
        lang === 'ar'
          ? 'أداة سحب الفائزين في مسابقات فيديوهات وبثوث تيك توك بنقرة زر واحدة.'
          : 'Raffle winner generator for TikTok video and live giveaway comments.',
      icon: Sparkles,
      color: 'from-cyan-500/20 to-blue-600/10 text-cyan-400 border-cyan-500/30',
      badge: lang === 'ar' ? 'سوشيال ميديا' : 'Social Giveaway',
    },
    {
      id: 'facebook-comment-picker',
      path: '/facebook-comment-picker',
      name: lang === 'ar' ? 'قرعة تعليقات فيسبوك (Facebook Comment Picker)' : 'Facebook Comment Picker',
      desc:
        lang === 'ar'
          ? 'سحب عشوائي عادل لتعليقات صفحات ومجموعات فيسبوك في المسابقات الترويجية.'
          : 'Fair random winner selector for Facebook page posts and contest comments.',
      icon: Facebook,
      color: 'from-blue-500/20 to-indigo-600/10 text-blue-400 border-blue-500/30',
      badge: lang === 'ar' ? 'سوشيال ميديا' : 'Social Giveaway',
    },
    {
      id: 'yesno',
      path: '/yesno',
      name: lang === 'ar' ? 'عجلة نعم أو لا (Yes or No Wheel)' : 'Yes or No Wheel Spinner',
      desc:
        lang === 'ar'
          ? 'حسم القرارات السريعة وتجاوز التردد بنقرة واحدة بين نعم، لا، أو ربما.'
          : 'Instant answers to binary dilemmas: Yes, No, or Maybe with single-click spin.',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-teal-600/10 text-emerald-400 border-emerald-500/30',
      badge: lang === 'ar' ? 'اتخاذ القرارات' : 'Decision Tool',
    },
    {
      id: 'numbers',
      path: '/numbers',
      name: lang === 'ar' ? 'عجلة الأرقام العشوائية (Random Number Wheel)' : 'Random Number Generator Wheel',
      desc:
        lang === 'ar'
          ? 'توليد أرقام عشوائية بنطاقات مخصصة مع خيار منع التكرار ومحاكاة العجلة.'
          : 'Generate random numbers with customizable ranges, elimination, and spin animations.',
      icon: Dices,
      color: 'from-amber-500/20 to-orange-600/10 text-amber-400 border-amber-500/30',
      badge: lang === 'ar' ? 'أرقام وإحصاء' : 'Numbers',
    },
    {
      id: 'names',
      path: '/names',
      name: lang === 'ar' ? 'أداة اختيار الأسماء للطلاب والفرق' : 'Classroom & Team Name Picker',
      desc:
        lang === 'ar'
          ? 'اختيار عادل للطلاب في الفصول المدرسية وتوزيع فرق العمل بنزاهة تامة.'
          : 'Fair random name selector for teachers, classrooms, and team building games.',
      icon: UserCheck,
      color: 'from-purple-500/20 to-indigo-600/10 text-purple-400 border-purple-500/30',
      badge: lang === 'ar' ? 'فصول دراسية' : 'Classroom',
    },
  ];

  type LegalItem = {
    id: LegalDocType | 'contact';
    path: string;
    name: string;
    desc: string;
  };

  const legalPages: LegalItem[] = [
    {
      id: 'privacy',
      path: '/privacy',
      name: lang === 'ar' ? 'سياسة الخصوصية (Privacy Policy)' : 'Privacy Policy',
      desc:
        lang === 'ar'
          ? 'التزامنا الكامل بحماية بيانات المستخدمين والامتثال لمعايير GDPR و CCPA.'
          : 'Our strict user data protection standards and GDPR/CCPA compliance statement.',
    },
    {
      id: 'terms',
      path: '/terms',
      name: lang === 'ar' ? 'شروط الخدمة (Terms of Service)' : 'Terms of Service',
      desc:
        lang === 'ar'
          ? 'الشروط والأحكام الخاصة باستخدام موقع RandomizerWheel وأدواته المجانية.'
          : 'Terms, rules, and conditions for utilizing our free web tools and spinners.',
    },
    {
      id: 'about',
      path: '/about',
      name: lang === 'ar' ? 'من نحن (About Us)' : 'About Us',
      desc:
        lang === 'ar'
          ? 'نبذة عن رسالة الموقع وفريق العمل والتقنيات المستخدمة في خوارزميات النزاهة.'
          : 'Our mission, team, and physics simulation technology behind RandomizerWheel.',
    },
    {
      id: 'cookies',
      path: '/cookies',
      name: lang === 'ar' ? 'سياسة ملفات تعريف الارتباط (Cookies Policy)' : 'Cookie Policy',
      desc:
        lang === 'ar'
          ? 'كيف نستخدم التخزين المحلي وملفات الكوكيز لحفظ إعدادات وثيمات المستخدم.'
          : 'Transparent information regarding local browser storage and cookie practices.',
    },
    {
      id: 'disclaimer',
      path: '/disclaimer',
      name: lang === 'ar' ? 'إخلاء المسؤولية (Disclaimer)' : 'Disclaimer',
      desc:
        lang === 'ar'
          ? 'توضيح طبيعة النتائج العشوائية واستخدام الأدوات في الأنشطة الترفيهية والتنظيمية.'
          : 'Legal disclaimers regarding simulated randomness and recreational tool use.',
    },
    {
      id: 'contact',
      path: '/contact',
      name: lang === 'ar' ? 'اتصل بنا والدعم الفني (Contact Us)' : 'Contact Us',
      desc:
        lang === 'ar'
          ? 'قنوات التواصل المباشرة لاقتراح الميزات وطلب المساعدة والدعم الفني.'
          : 'Direct support channels for user inquiries, suggestions, and partner requests.',
    },
  ];

  // Category list
  const categories = useMemo(() => {
    const cats = new Set<string>();
    ARTICLES.forEach((a) => {
      const cat = lang === 'ar' ? a.category.ar : a.category.en;
      cats.add(cat);
    });
    return Array.from(cats);
  }, [lang]);

  // Filtered tools
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter((t) => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
  }, [searchQuery, tools]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((art) => {
      const title = (art.title[lang] || art.title.en).toLowerCase();
      const desc = (art.description[lang] || art.description.en).toLowerCase();
      const cat = (lang === 'ar' ? art.category.ar : art.category.en).toLowerCase();
      const keywords = art.keywords.join(' ').toLowerCase();
      const q = searchQuery.toLowerCase().trim();

      const matchesSearch = !q || title.includes(q) || desc.includes(q) || cat.includes(q) || keywords.includes(q);
      const matchesCategory = activeCategory === 'all' || (lang === 'ar' ? art.category.ar : art.category.en) === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [lang, searchQuery, activeCategory]);

  const totalPages = tools.length + ARTICLES.length + legalPages.length + 2; // + /articles index + /sitemap

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto pt-4 pb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs sm:text-sm font-bold">
          <Compass className="w-4 h-4" />
          <span>{lang === 'ar' ? 'خريطة الموقع ودليل الروابط' : 'HTML Sitemap & Directory'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          {lang === 'ar' ? 'دليل جميع صفحات وروابط RandomizerWheel' : 'Complete Site Directory & All Links'}
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'تصفح كافة الأدوات التفاعلية، عجلات القرعة، سحوبات السوشيال ميديا، والمقالات التعليمية المفصلة والسياسات المفهرسة رسمياً.'
            : 'Explore all interactive tools, giveaway comment pickers, comprehensive articles, and policy documents available on RandomizerWheel.'}
        </p>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{totalPages} {lang === 'ar' ? 'صفحة ورابط مفهرس' : 'Indexed Pages & Links'}</span>
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
            {tools.length} {lang === 'ar' ? 'أدوات تفاعلية' : 'Interactive Tools'}
          </span>
          <span className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-semibold">
            {ARTICLES.length} {lang === 'ar' ? 'مقالات وأدلة' : 'Comprehensive Articles'}
          </span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-400 hover:bg-amber-500/20 font-semibold flex items-center gap-1 transition"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>sitemap.xml</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في كافة الروابط والمقالات...' : 'Search all pages, tools, and guides...'}
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

          <div className="text-xs text-slate-400 font-medium">
            {lang === 'ar'
              ? `تم العثور على ${filteredTools.length + filteredArticles.length} رابط`
              : `Found ${filteredTools.length + filteredArticles.length} links`}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              activeCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Interactive Tools & Spin Wheels */}
      {filteredTools.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Disc className="w-5 h-5 text-amber-400" />
              <span>{lang === 'ar' ? 'الأدوات وعجلات القرعة التفاعلية (8)' : 'Interactive Wheels & Picker Tools (8)'}</span>
            </h2>
            <span className="text-xs text-slate-400">
              {lang === 'ar' ? 'أدوات مجانية بدون تسجيل' : 'Free & Instant Access'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <a
                  key={tool.id}
                  href={tool.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateToPage(tool.id);
                  }}
                  className={`group flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-gradient-to-b ${tool.color} border bg-slate-900/80 hover:bg-slate-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl cursor-pointer`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-slate-950/60 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-950/60 text-slate-300 border border-slate-700/50">
                        {tool.badge}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                      {tool.name}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-amber-400">
                    <span className="font-mono text-[10px]">{tool.path}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 2: Complete Articles & Guides Directory */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>
                {lang === 'ar'
                  ? `دليل المقالات والأدلة الإرشادية (${filteredArticles.length})`
                  : `Comprehensive Guides & Articles Directory (${filteredArticles.length})`}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'استراتيجيات المسابقات، أفكار الفصول المدرسية، وحسم القرارات الرياضية والعلمية'
                : 'In-depth tutorials for giveaways, classroom engagement, algorithms, and decision making'}
            </p>
          </div>

          <a
            href="/articles"
            onClick={(e) => {
              e.preventDefault();
              onNavigateToPage('articles');
            }}
            className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>{t(lang, 'blogTitle')}</span>
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </a>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
            <p className="text-slate-300 font-semibold">
              {lang === 'ar' ? 'لم يتم العثور على مقالات مطابقة' : 'No articles match your search criteria.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveCategory('all');
              }}
              className="text-xs text-amber-400 font-bold hover:underline"
            >
              {lang === 'ar' ? 'إعادة ضبط البحث' : 'Reset filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const title = article.title[lang] || article.title.en;
              const desc = article.description[lang] || article.description.en;
              const cat = lang === 'ar' ? article.category.ar : article.category.en;
              const date = article.publishedDate;
              const readTime = article.readTime[lang] || article.readTime.en;

              return (
                <a
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelectArticle(article.slug);
                  }}
                  className="group flex flex-col justify-between p-5 rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1 font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                        <Tag className="w-3 h-3" />
                        <span>{cat}</span>
                      </span>

                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{date}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{readTime}</span>
                        </span>
                      </div>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-400 transition leading-snug">
                      {title}
                    </h3>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-[11px] text-slate-400 group-hover:text-amber-400 font-medium">
                    <span className="font-mono text-[10px] text-slate-500 truncate max-w-[280px]">
                      /articles/{article.slug}
                    </span>
                    <span className="flex items-center gap-1 shrink-0 font-bold">
                      <span>{lang === 'ar' ? 'قراءة المقال' : 'Read Article'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION 3: Legal, Privacy & Compliance Pages */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span>{lang === 'ar' ? 'السياسات، الخصوصية والدعم الفني (6)' : 'Legal, Privacy & Compliance (6)'}</span>
          </h2>
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? 'متوافق مع AdSense و GDPR' : 'AdSense & GDPR Compliant'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {legalPages.map((page) => (
            <a
              key={page.id}
              href={page.path}
              onClick={(e) => {
                e.preventDefault();
                if (page.id === 'contact') {
                  onNavigateToPage('contact');
                } else {
                  onOpenLegal(page.id);
                }
              }}
              className="group p-4 sm:p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition">
                    {page.name}
                  </h3>
                  <FileText className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {page.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500 group-hover:text-amber-400">
                <span className="font-mono">{page.path}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SECTION 4: Machine-Readable SEO Feeds */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left rtl:sm:text-right">
          <h4 className="text-xs font-bold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'بيانات الزحف والفهرسة لمحركات البحث (Search Console)' : 'Search Engine Crawling Endpoints'}</span>
          </h4>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'ملفات XML المحدثة تلقائياً مع علامات hreflang لدعم التعدد اللغوي وفهرسة جوجل الفورية.'
              : 'Auto-synchronized XML and robots feeds with full hreflang multilingual alternate directives.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>/sitemap.xml</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>/robots.txt</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
