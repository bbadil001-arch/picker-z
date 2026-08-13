import React, { useState } from 'react';
import { ChevronDown, Zap, Palette, HelpCircle, Gift, Users, Award, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface SEOContentProps {
  lang: Language;
}

export const SEOContentSection: React.FC<SEOContentProps> = ({ lang }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = lang === 'ar' ? [
    {
      q: 'ما هو موقع RandomizerWheel وما هي أداة عجلة القرعة؟',
      a: 'RandomizerWheel هو موقع مجاني واحترافي يوفر عجلة قرعة دوارة (Picker Wheel) لاختيار الأسماء والأرقام والقرارات عشوائياً. يُستخدم الموقع للمسابقات، القرعة، اختيار الطلاب في الفصول الدراسية، واتخاذ القرارات اليومية بسرعة.',
    },
    {
      q: 'هل نتائج العجلة عشوائية بنسبة 100% ومضمونة؟',
      a: 'نعم، يعتمد موقع RandomizerWheel على خوارزمية توليد أرقام عشوائية متقدمة (PRNG) مع محاكاة فيزيائية لحركة العجلة، مما يضمن أن كل تدويرة عشوائية تماماً وغير قابلة للتنبؤ أو التلاعب بها.',
    },
    {
      q: 'كيف يمكنني تخصيص ألوان وأصوات العجلة الدوارة؟',
      a: 'يمكنك بسهولة اختيار ثيمات ألوان متعددة (مثل ألوان النيون، الزمرد الملكي، الباستيل الهادئ) أو تخصيص الألوان لكل خيار بشكل منفصل، بالإضافة إلى التحكم في المؤثرات الصوتية ومدة التدوير من تبويب "تخصيص الثيم والإعدادات".',
    },
    {
      q: 'هل يمكنني حفظ العجلة ومشاركتها مع الآخرين؟',
      a: 'بالتأكيد! يمكنك مشاركة رابط العجلة مع أصدقائك أو متابعيك على انستقرام وتيك توك، وسيتم حفظ جميع الخيارات والإعدادات تلقائياً على جهازك.',
    },
    {
      q: 'ما الميزات التي تميز RandomizerWheel عن PickerWheel التقليدي؟',
      a: 'يتميز RandomizerWheel بدعم كامل للغة العربية والإنجليزية، وتوليد الخيارات بالذكاء الاصطناعي، ومؤثرات صوتية متطورة بدون الحاجة للتحميل، مع تصميم سلس وسريع يعمل على كافة الجوالات والأجهزة.',
    },
  ] : [
    {
      q: 'What is RandomizerWheel and how does the Picker Wheel work?',
      a: 'RandomizerWheel is a free customizable decision maker and random name picker wheel. It lets you create interactive spin wheels for giveaways, raffles, classroom activities, and daily decision making.',
    },
    {
      q: 'Is the wheel spin result 100% fair and unbiased?',
      a: 'Yes! RandomizerWheel uses cryptographically secure pseudo-random physics simulation to guarantee that every spin is completely random and unpredictable.',
    },
    {
      q: 'How can I customize wheel colors and sound effects?',
      a: 'You can choose from vibrant pre-made themes (Neon, Emerald & Gold, Soft Pastel, Sunset Glow) or set custom colors per option, adjust spin duration, and toggle sound effects directly from the settings tab.',
    },
    {
      q: 'Can I use RandomizerWheel for Instagram or TikTok giveaways?',
      a: 'Yes! It is perfect for live stream raffles and giveaways. You can enter participant names, spin the wheel live, and celebrate with victory sound and confetti effects.',
    },
    {
      q: 'Is RandomizerWheel free to use on mobile devices?',
      a: 'Yes! RandomizerWheel is 100% free with no sign-up required, and is fully optimized for smartphones, tablets, laptops, and desktop computers.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-8 sm:mt-12 space-y-8 sm:space-y-12 text-slate-300 px-2 sm:px-4">
      {/* 1. Main SEO Intro Card */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-xl backdrop-blur">
        <div className="space-y-2.5 text-center ltr:text-left rtl:text-right">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>RandomizerWheel.com</span>
          </span>

          <h2 className="text-xl sm:text-3xl font-black text-slate-100 leading-snug">
            {lang === 'ar'
              ? 'عجلة القرعة واختيار الأسماء العشوائي الأفضل اونلاين (Randomizer Wheel)'
              : 'The Ultimate Customizable Spin Wheel & Random Name Picker'}
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {lang === 'ar'
              ? 'موقع RandomizerWheel هو الأداة الاحترافية الأولى لاختيار الأسماء والأرقام والقرارات عشوائياً بدون تسجيل وبشكل مجاني 100%. سواء كنت تبحث عن أداة لإجراء قرعة مسابقات انستقرام وتيك توك، أو اختيار الطلاب في الفصل الدراسي، أو حسم قرار يومي مثل ماذا نأكل اليوم، توفر لك عجلة القرعة تجربة ممتعة وسريعة مع تخصيص شامل للألوان والأصوات.'
              : 'RandomizerWheel is a powerful, highly customizable spin wheel generator designed for giveaways, decision making, team picking, and raffles. Customize colors, add options in seconds, toggle sounds, and spin for instant fair results.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-slate-700/60">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'عشوائية مطلقة 100%' : '100% Fair Randomness'}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              {lang === 'ar'
                ? 'محاكاة فيزيائية شفافة تضمن نتائج عادلة وغير قابلة للتواطؤ أو التنبؤ.'
                : 'Advanced physics simulation ensures unbiased and completely unpredictable results.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Palette className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'تخصيص الألوان والأصوات' : 'Custom Colors & Sounds'}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              {lang === 'ar'
                ? 'مخططات ألوان جذابة (مثل الزمرد والذهب والنيون) ومؤثرات صوتية حماسية.'
                : 'Choose from vibrant color themes and realistic ticking audio effects.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/60 border border-slate-700/60 space-y-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'ذكاء اصطناعي للخيارات' : 'AI Option Generator'}
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              {lang === 'ar'
                ? 'توليد قوائم واقتراحات ذكية بنقرة زر واحدة باستخدام نموذج Gemini AI.'
                : 'Generate tailored list suggestions automatically with Google Gemini AI.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Popular Use Cases Section */}
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-lg sm:text-2xl font-black text-slate-100">
            {lang === 'ar' ? 'أبرز الاستخدامات لعجلة القرعة العشوائية' : 'Popular Use Cases'}
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            {lang === 'ar'
              ? 'تخدم أداة RandomizerWheel كافة الاحتياجات التعليمية، الترفيهية، والتجارية.'
              : 'RandomizerWheel serves various educational, entertainment, and business purposes.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'قرعة المسابقات وهدايا السوشيال ميديا' : 'Giveaways & Raffles'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'سحب الفائزين في مسابقات انستقرام، تويتر، وتيك توك على البث المباشر بكل شفافية.'
                : 'Pick winners live for social media contests and promotional raffles.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'الفصول الدراسية والطلاب' : 'Classroom & Education'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'اختيار الطلاب عشوائياً للإجابة أو توزيع المهام والمجموعات في المدرسة.'
                : 'Randomly pick students for questions and assign class project groups.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'ألعاب الصراحة والتحدي' : 'Party & Board Games'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'تدوير العجلة لألعاب الصراحة أو الجرأة (Truth or Dare) والفعاليات العائلية.'
                : 'Spin for Truth or Dare, icebreaker questions, and party games.'}
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">
              {lang === 'ar' ? 'حسم القرارات اليومية' : 'Daily Decision Maker'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar'
                ? 'حسم الخيارات الصعبة مثل اختيار مطعم العشاء، مكان التنزه، أو فيلم السهرة.'
                : 'Decide what to eat for dinner, movies to watch, or weekend destinations.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Frequently Asked Questions (FAQ Accordion for SEO Snippets) */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="text-center space-y-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-100">
            {lang === 'ar' ? 'الأسئلة الشائعة حول عجلة القرعة (FAQ)' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'ar'
              ? 'إجابات على أبرز تساؤلات المستخدمين حول أداة RandomizerWheel'
              : 'Common questions about RandomizerWheel features'}
          </p>
        </div>

        <div className="space-y-2.5 max-w-3xl mx-auto">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-slate-800/60 border border-slate-700/70 rounded-2xl overflow-hidden transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-3.5 sm:p-4 text-left rtl:text-right font-bold text-xs sm:text-sm text-slate-100 flex items-center justify-between gap-3 hover:bg-slate-700/40 transition"
                >
                  <span className="min-w-0 pr-2">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-amber-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-700/40 pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
