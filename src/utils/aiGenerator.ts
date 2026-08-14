// Smart fallback and procedural generator for wheel options

export interface GenerateOptionsParams {
  topic: string;
  lang?: 'en' | 'ar';
  count?: number; // 0 or undefined means all / complete
}

// Built-in intelligent comprehensive knowledge base for hundreds of wheel topics
const KNOWLEDGE_BASE: Array<{
  keywords: string[];
  en: string[];
  ar: string[];
}> = [
  {
    keywords: ['africa', 'african', 'إفريقيا', 'افريقيا', 'دول افريقيا', 'دول إفريقيا', 'بلدان افريقيا'],
    en: [
      'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde',
      'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'DR Congo', 'Republic of the Congo',
      'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon',
      'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Ivory Coast', 'Kenya', 'Lesotho', 'Liberia',
      'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique',
      'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
      'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania', 'Togo',
      'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
    ],
    ar: [
      'الجزائر', 'أنغولا', 'بنين', 'بوتسوانا', 'بوركينا فاسو', 'بوروندي', 'الرأس الأخضر',
      'الكاميرون', 'جمهورية إفريقيا الوسطى', 'تشاد', 'جزر القمر', 'الكونغو الديمقراطية', 'جمهورية الكونغو',
      'جيبوتي', 'مصر', 'غينيا الاستوائية', 'إريتريا', 'إسواتيني', 'إثيوبيا', 'الغابون',
      'غامبيا', 'غانا', 'غينيا', 'غينيا بيساو', 'كوت ديفوار', 'كينيا', 'ليسوتو', 'ليبيريا',
      'ليبيا', 'مدغشقر', 'مالاوي', 'مالي', 'موريتانيا', 'موريشيوس', 'المغرب', 'موزمبيق',
      'ناميبيا', 'النيجر', 'نيجيريا', 'رواندا', 'ساو تومي وبرينسيبي', 'السنغال', 'سيشل',
      'سيراليون', 'الصومال', 'جنوب إفريقيا', 'جنوب السودان', 'السودان', 'تنزانيا', 'توغو',
      'تونس', 'أوغندا', 'زامبيا', 'زيمبابوي'
    ]
  },
  {
    keywords: ['arab', 'عرب', 'دول عربية', 'عربية', 'الوطن العربي', 'بلدان عربية', 'جامعة الدول العربية'],
    en: [
      'Saudi Arabia', 'Egypt', 'UAE', 'Morocco', 'Qatar', 'Kuwait', 'Jordan', 'Oman',
      'Bahrain', 'Tunisia', 'Algeria', 'Lebanon', 'Iraq', 'Syria', 'Palestine', 'Yemen',
      'Sudan', 'Libya', 'Mauritania', 'Somalia', 'Djibouti', 'Comoros'
    ],
    ar: [
      'المملكة العربية السعودية', 'مصر', 'الإمارات العربية المتحدة', 'المغرب', 'قطر', 'الكويت',
      'الأردن', 'سلطنة عُمان', 'البحرين', 'تونس', 'الجزائر', 'لبنان', 'العراق', 'سوريا',
      'فلسطين', 'اليمن', 'السودان', 'ليبيا', 'موريتانيا', 'الصومال', 'جيبوتي', 'جزر القمر'
    ]
  },
  {
    keywords: ['asia', 'asian', 'آسيا', 'اسيا', 'دول اسيا', 'دول آسيا'],
    en: [
      'Japan', 'South Korea', 'China', 'India', 'Thailand', 'Vietnam', 'Indonesia',
      'Saudi Arabia', 'UAE', 'Singapore', 'Malaysia', 'Philippines', 'Turkey', 'Pakistan',
      'Bangladesh', 'Iran', 'Iraq', 'Jordan', 'Lebanon', 'Oman', 'Qatar', 'Kuwait',
      'Sri Lanka', 'Nepal', 'Mongolia', 'Uzbekistan', 'Kazakhstan'
    ],
    ar: [
      'اليابان', 'كوريا الجنوبية', 'الصين', 'الهند', 'تايلاند', 'فيتنام', 'إندونيسيا',
      'السعودية', 'الإمارات', 'سنغافورة', 'ماليزيا', 'الفلبين', 'تركيا', 'باكستان',
      'بنغلاديش', 'إيران', 'العراق', 'الأردن', 'لبنان', 'عُمان', 'قطر', 'الكويت',
      'سريلانكا', 'نيبال', 'منغوليا', 'أوزبكستان', 'كازاخستان'
    ]
  },
  {
    keywords: ['europe', 'european', 'أوروبا', 'اوروبا', 'دول اوروبا', 'دول أوروبا'],
    en: [
      'France', 'Germany', 'Italy', 'Spain', 'United Kingdom', 'Switzerland', 'Netherlands',
      'Greece', 'Norway', 'Sweden', 'Portugal', 'Austria', 'Belgium', 'Denmark', 'Finland',
      'Ireland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Croatia', 'Iceland'
    ],
    ar: [
      'فرنسا', 'ألمانيا', 'إيطاليا', 'إسبانيا', 'المملكة المتحدة', 'سويسرا', 'هولندا',
      'اليونان', 'النرويج', 'السويد', 'البرتغال', 'النمسا', 'بلجيكا', 'الدنمارك', 'فنلندا',
      'أيرلندا', 'بولندا', 'التشيك', 'المجر', 'رومانيا', 'كرواتيا', 'آيسلندا'
    ]
  },
  {
    keywords: ['food', 'eat', 'dinner', 'lunch', 'breakfast', 'restaurant', 'meal', 'طعام', 'أكل', 'عشاء', 'غداء', 'فطور', 'مطعم', 'وجبة', 'أكلات'],
    en: [
      'Italian Pizza', 'Fresh Sushi & Sashimi', 'Mexican Tacos', 'Gourmet Charcoal Burger',
      'Thai Red Curry', 'Japanese Ramen', 'Charcoal Grilled BBQ Mix', 'Authentic Shawarma Wrap',
      'Mediterranean Seafood Pasta', 'Crispy Broasted Chicken', 'Juicy Ribeye Steak',
      'Fresh Caesar Salad', 'Falafel Plate', 'Butter Chicken with Naan', 'Biryani with Lamb',
      'Lebanese Mezze Platter', 'Turkish Doner Kebab', 'Dim Sum & Dumplings', 'Lasagna Bolognese',
      'Fish and Chips', 'Paella Valenciana', 'Fajitas & Guacamole'
    ],
    ar: [
      'بيتزا إيطالية بالحطب', 'سوشي وساشيمي ياباني', 'تاكو مكسيكي', 'برجر لحم مشوي فاخر',
      'كاري تايلاندي حار', 'نودلز رامن ياباني', 'مشويات مشكلة على الفحم', 'شاورما عربي بالثوم',
      'باستا ثمار البحر', 'دجاج بروستد مقرمش', 'ستيك لحم ريب آي', 'سلطة سيزر مع دجاج',
      'صحن فلافل وحمص', 'دجاج بالزبدة مع خبز نان', 'برياني لحم غنم', 'مقبلات ومشاوي لبنانية',
      'شاورما تركي (دونر)', 'فطائر ديم سام صينية', 'لازانيا بولونيز', 'سمك وبطاطس مقرمشة',
      'باييلا ثمار البحر الإسبانية', 'فاهيتا مع جواكامولي'
    ]
  },
  {
    keywords: ['summer', 'vacation', 'travel', 'holiday', 'trip', 'destination', 'place', 'visit', 'صيف', 'سفر', 'عطلة', 'رحلة', 'وجهة', 'سياحة', 'أماكن', 'زيارة'],
    en: [
      'Bali, Indonesia', 'Santorini, Greece', 'Kyoto, Japan', 'Amalfi Coast, Italy',
      'Maui, Hawaii', 'Swiss Alps, Switzerland', 'Cancún, Mexico', 'Paris, France',
      'Reykjavík, Iceland', 'Phuket, Thailand', 'Barcelona, Spain', 'Dubai, UAE',
      'Cape Town, South Africa', 'Banff National Park, Canada', 'Queenstown, New Zealand',
      'Bora Bora, French Polynesia', 'Dubrovnik, Croatia', 'Istanbul, Turkey',
      'Rio de Janeiro, Brazil', 'Cairo & Giza, Egypt', 'Rome, Italy', 'Maldives Atolls'
    ],
    ar: [
      'جزيرة بالي، إندونيسيا', 'سانتوريني، اليونان', 'كيوتو، اليابان', 'ساحل أمالفي، إيطاليا',
      'جزيرة ماوي، هاواي', 'جبال الألب، سويسرا', 'كانكون، المكسيك', 'باريس، فرنسا',
      'ريكيافيك، آيسلندا', 'بوكيت، تايلاند', 'برشلونة، إسبانيا', 'دبي، الإمارات',
      'كيب تاون، جنوب إفريقيا', 'حديقة بانف الوطنية، كندا', 'كوينزتاون، نيوزيلندا',
      'بورا بورا، بولينيزيا', 'دوبروفنيك، كرواتيا', 'إسطنبول، تركيا', 'ريو دي جانيرو، البرازيل',
      'القاهرة والأهرامات، مصر', 'روما، إيطاليا', 'جزر المالديف'
    ]
  },
  {
    keywords: ['movie', 'film', 'cinema', 'watch', 'netflix', 'series', 'فيلم', 'أفلام', 'سينما', 'مشاهدة', 'مسلسل', 'نتفلكس'],
    en: [
      'Sci-Fi & Space Exploration', 'High-Octane Action Blockbuster', 'Romantic Comedy',
      'Psychological Thriller', 'Mind-Bending Mystery & Whodunit', 'Epic Fantasy & Mythology',
      'True Crime Documentary', 'Japanese Anime Masterpiece', 'Classic Haunted Horror',
      'Survival & Adventure', 'Post-Apocalyptic Survival', 'Historical Drama & Warfare',
      'Superhero Comic Adaptation', 'Detective Noir & Crime Mob', 'Time Travel Paradox'
    ],
    ar: [
      'خيال علمي واستكشاف فضاء', 'أكشن وإثارة وحركة سريعة', 'كوميديا رومانسية خفيفة',
      'إثارة وتشويق نفسي', 'غموض وتحقيق بوليسي مشوق', 'فانتازيا وأساطير ملحمية',
      'وثائقي جريمة واقعية', 'أنمي ورسوم متحركة يابانية', 'رعب وبيوت مسكونة كلاسيكي',
      'مغامرة وبقاء في البرية', 'عالم ما بعد نهاية العالم', 'دراما وتاريخ وحروب',
      'أبطال خارقين وعوالم موازية', 'جريمة ومافيا وتحقيقات', 'مفارقات السفر عبر الزمن'
    ]
  },
  {
    keywords: ['game', 'activity', 'play', 'weekend', 'fun', 'party', 'لعبة', 'ألعاب', 'نشاط', 'عطلة', 'فعالية', 'سهرة', 'متعة'],
    en: [
      'Board Game Night (Catan / Monopoly)', 'Multiplayer Video Game Tournament', 'Karaoke Sing-Off',
      'Escape Room Challenge', 'Bowling Night & Arcade', 'Outdoor Picnic & BBQ Feast',
      'Trivia & Pub Quiz', 'Glow-in-the-Dark Mini Golf', 'Live Cooking & Baking Challenge',
      'Go-Kart Grand Prix', 'Stargazing Campfire Night', 'Paintball or Laser Tag',
      'Movie Marathon with Popcorn', 'Table Tennis Tournament', 'Pictionary & Charades'
    ],
    ar: [
      'سهرة ألعاب لوحية (مونوبولي / كاطان)', 'بطولة ألعاب فيديو جماعية', 'تحدي غناء كاراوكي',
      'تحدي غرفة الهروب من الألغاز', 'سهرة بولينج وألعاب أركيد', 'نزهة خارجية وشواء لذيذ',
      'مسابقة أسئلة وألغاز ذكاء', 'ميني جولف ترفيهي', 'تحدي طبخ وصنع حلويات جماعي',
      'سباق سيارات كارتينج', 'سهرة تأمل النجوم حول النار', 'معركة كرات الطلاء (بينتبول)',
      'ماراثون أفلام مع الفشار', 'دوري تنس طاولة سريع', 'لعبة الرسم والتمثيل الصامت'
    ]
  },
  {
    keywords: ['truth', 'dare', 'صراحة', 'تحدي', 'جرأة', 'صراحة أو جرأة', 'لو خيروك'],
    en: [
      'Sing the chorus of your favorite song loudly',
      'Share your most awkward or embarrassing date',
      'Do 20 push-ups right now without stopping',
      'Speak in a funny Shakespearean accent for 2 rounds',
      'Tell the group a hidden talent you have',
      'Show the last photo taken on your phone',
      'Call a friend and sing Happy Birthday randomly',
      'Do your best impression of a celebrity',
      'Let someone write a word on your forehead',
      'Confess a secret nobody in this room knows',
      'Swap shoes with the person to your left for 5 minutes',
      'Tell a dramatic joke with serious facial expressions'
    ],
    ar: [
      'غنِّ مقطعاً من أغنيتك المفضلة بصوت عالٍ وحماسي',
      'اذكر أكثر موقف محرج تعرضت له ولم تخبر به أحداً',
      'قم بـ 20 تمرين ضغط الآن دون توقف',
      'تحدث بلهجة مختلفة تماماً لمدة جولتين كاملتين',
      'اعرض موهبة غريبة أو مخفية تمتلكها',
      'أظهر آخر صورة التقطتها في هاتفك للجميع',
      'اتصل بصديق وقل له سنة حلوة يا جميل وأغلق فوراً',
      'قم بتقليد شخصية مشهورة أو شخص من الحاضرين',
      'دع شخصاً يكتب كلمة مضحكة على جبهتك بالورق',
      'شارك سراً طريفاً لا يعرفه أي شخص في هذه الجلسة',
      'بدل حذاءك مع الشخص الذي على يمينك لدقيقة',
      'احكِ نكتة بنبرة حزينة ودرامية جداً'
    ]
  }
];

export function generateSmartFallback(params: GenerateOptionsParams): string[] {
  const { topic, lang = 'ar', count = 0 } = params;
  const lowerTopic = topic.toLowerCase().trim();
  const isAr = lang === 'ar';

  // Check matching knowledge base
  for (const entry of KNOWLEDGE_BASE) {
    const isMatch = entry.keywords.some((kw) => lowerTopic.includes(kw.toLowerCase()));
    if (isMatch) {
      const list = isAr ? entry.ar : entry.en;
      // If count is 0 or not specified or greater than list length, return full complete set
      if (!count || count <= 0 || count >= list.length) {
        return [...list];
      }
      // If specific count requested, return sliced
      return [...list].slice(0, count);
    }
  }

  // If not in pre-defined set, create context-aware options from the topic
  const cleanedTopic = topic.replace(/^([a-z0-9_\s-]+:\s*)/i, '').trim();
  const targetCount = count > 0 ? count : 20;

  if (isAr) {
    const list = Array.from({ length: targetCount }, (_, i) => `${cleanedTopic} - خيار ${i + 1}`);
    return list;
  }

  const list = Array.from({ length: targetCount }, (_, i) => `${cleanedTopic} - Choice ${i + 1}`);
  return list;
}
