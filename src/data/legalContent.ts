import { Language } from '../types';

export interface LegalSection {
  title: string;
  content: string[];
}

export interface LegalDoc {
  title: string;
  lastUpdated: string;
  summary: string;
  sections: LegalSection[];
}

export type LegalDocType = 'privacy' | 'terms' | 'about' | 'cookies' | 'disclaimer';

export const LEGAL_DOCS: Record<LegalDocType, Record<Language, LegalDoc>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'February 2026',
      summary: 'At RandomizerWheel.com, accessible from https://randomizerwheel.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information collected and recorded by RandomizerWheel.com and how we use it.',
      sections: [
        {
          title: '1. Consent & Scope',
          content: [
            'By using our website, you hereby consent to our Privacy Policy and agree to its terms.',
            'This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that they shared and/or collect in RandomizerWheel.com. This policy is not applicable to any information collected offline or via channels other than this website.',
          ],
        },
        {
          title: '2. Information We Collect and Client-Side Storage',
          content: [
            'RandomizerWheel is designed with a privacy-first architecture. All wheel configurations, custom choices, colors, and spin history are stored directly in your browser’s LocalStorage.',
            'We do not upload your custom wheel text, name lists, or private options to external central databases unless you explicitly use the optional AI generation or share link features.',
            'When you contact us directly via email or our contact form, we may receive additional information such as your name, email address, the contents of the message, and any other information you choose to provide.',
          ],
        },
        {
          title: '3. Log Files and Web Analytics',
          content: [
            'RandomizerWheel.com follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.',
            'These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users’ movement on the website, and gathering demographic information.',
          ],
        },
        {
          title: '4. Google AdSense & DoubleClick DART Cookies',
          content: [
            'Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.randomizerwheel.com and other sites on the internet.',
            'Google’s use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.',
            'Users may opt out of personalized advertising by visiting Google Ads Settings (https://www.google.com/settings/ads) or through the Network Advertising Initiative opt-out page at https://www.aboutads.info/choices/.',
          ],
        },
        {
          title: '5. Third-Party Advertising Partners',
          content: [
            'Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners include Google AdSense and its certified advertising network partners.',
            'Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on RandomizerWheel.com, which are sent directly to users’ browsers. They automatically receive your IP address when this occurs.',
            'Please note that RandomizerWheel.com has no access to or control over these cookies that are used by third-party advertisers.',
          ],
        },
        {
          title: '6. GDPR Data Protection Rights (EU Users)',
          content: [
            'We would like to make sure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following:',
            '• The right to access: You have the right to request copies of your personal data.',
            '• The right to rectification: You have the right to request that we correct any information you believe is inaccurate.',
            '• The right to erasure: You have the right to request that we erase your personal data under certain conditions.',
            '• The right to restrict processing: You have the right to request that we restrict the processing of your personal data.',
            '• The right to data portability: You have the right to request that we transfer the data that we have collected to another organization, or directly to you.',
            'If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at yhpro.help@gmail.com.',
          ],
        },
        {
          title: '7. CCPA / CPRA Privacy Rights (Do Not Sell My Personal Information)',
          content: [
            'Under the California Consumer Privacy Act (CCPA) and CPRA, California consumers have the right to:',
            '• Request that a business disclose the categories and specific pieces of personal data that a business has collected about consumers.',
            '• Request that a business delete any personal data about the consumer that a business has collected.',
            '• Request that a business that sells or shares a consumer’s personal data, not sell or share the consumer’s personal data.',
            'We do not sell personal information. If you wish to make a request, please contact us at yhpro.help@gmail.com.',
          ],
        },
        {
          title: '8. Children’s Information (COPPA)',
          content: [
            'Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.',
            'RandomizerWheel.com does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.',
          ],
        },
      ],
    },
    ar: {
      title: 'سياسة الخصوصية (Privacy Policy)',
      lastUpdated: 'فبراير 2026',
      summary: 'في موقع RandomizerWheel.com، المتاح عبر الرابط https://randomizerwheel.com، تعد خصوصية زوارنا إحدى أهم أولوياتنا. توضح وثيقة سياسة الخصوصية هذه أنواع المعلومات التي يتم جمعها وتسجيلها وكيفية استخدامها وفق أعلى معايير الشفافية والامتثال لسياسات Google AdSense.',
      sections: [
        {
          title: '1. الموافقة ونطاق السياسة',
          content: [
            'باستخدامك لموقعنا، فإنك توافق بموجب هذا على سياسة الخصوصية الخاصة بنا وتوافق على شروطها.',
            'تنطبق سياسة الخصوصية هذه فقط على أنشطتنا عبر الإنترنت وهي صالحة لزوار موقعنا فيما يتعلق بالمعلومات التي يشاركونها أو يجمعونها في RandomizerWheel.com. ولا تنطبق هذه السياسة على أي معلومات يتم جمعها دون اتصال بالإنترنت أو عبر قنوات أخرى غير هذا الموقع.',
          ],
        },
        {
          title: '2. المعلومات التي نجمعها والتخزين المحلي بالمتصفح',
          content: [
            'تم تصميم موقع RandomizerWheel ليكون آمناً ويحترم الخصوصية لأقصى درجة. يتم حفظ جميع خيارات العجلة وأسمائها والألوان وسجل القرعات محلياً على جهازك داخل الذاكرة المحلية لمتصفحك (LocalStorage).',
            'نحن لا نرفع قوائمك أو أسماء المشتركين الخاصة بك إلى خوادم خارجية مركزية إلا إذا طلبت صراحة استخدام التوليد بالذكاء الاصطناعي أو إنشاء رابط مشاركة.',
            'عندما تتواصل معنا عبر البريد الإلكتروني أو نموذج الاتصال، قد نتلقى معلومات إضافية مثل اسمك وعنوان بريدك الإلكتروني ومحتوى الرسالة وأي مرفقات تختار تقديمها.',
          ],
        },
        {
          title: '3. ملفات السجل (Log Files) وإحصاءات الزوار',
          content: [
            'يتبع RandomizerWheel.com إجراءً قياسياً لاستخدام ملفات السجل. تسجل هذه الملفات الزوار عند زيارتهم للمواقع الإلكترونية. تتضمن المعلومات التي تجمعها ملفات السجل عناوين بروتوكول الإنترنت (IP)، ونوع المتصفح، ومزود خدمة الإنترنت (ISP)، وطابع التاريخ والوقت، وصفحات الإحالة/الخروج، وعدد النقرات.',
            'هذه المعلومات ليست مرتبطة بأي معلومات تحدد الهوية الشخصية. الغرض من هذه المعلومات هو تحليل الاتجاهات، وإدارة الموقع، وتتبع حركة المستخدمين، وجمع المعلومات الديموغرافية العامة.',
          ],
        },
        {
          title: '4. إعلانات Google AdSense وملفات تعريف الارتباط DART',
          content: [
            'تعتبر Google إحدى الشركات الخارجية المعتمدة لتقديم الإعلانات على موقعنا. تستخدم Google ملفات تعريف الارتباط المعروفة باسم ملفات تعريف الارتباط DART لعرض الإعلانات لزوار موقعنا استناداً إلى زيارتهم لموقع www.randomizerwheel.com والمواقع الأخرى على شبكة الإنترنت.',
            'يتيح استخدام Google لملفات تعريف الارتباط الإعلانية لها ولشركائها عرض إعلانات للمستخدمين استناداً إلى زيارتهم لموقعنا أو مواقع أخرى.',
            'يمكن للمستخدمين إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة إعدادات إعلانات Google عبر الرابط (https://www.google.com/settings/ads) أو من خلال موقع Network Advertising Initiative عبر (https://www.aboutads.info/choices/).',
          ],
        },
        {
          title: '5. شركاء الإعلانات وشبكات الطرف الثالث',
          content: [
            'قد يستخدم بعض شركائنا الإعلانيين ملفات تعريف الارتباط وإشارات الويب على موقعنا. يشمل شركاؤنا الإعلانيون Google AdSense وشبكاته الإعلانية المعتمدة.',
            'تستخدم خوادم الإعلانات أو شبكات الإعلانات التابعة لجهات خارجية تقنيات مثل ملفات تعريف الارتباط، أو JavaScript، أو إشارات الويب المستخدمة في إعلاناتها وروابطها التي تظهر على موقع RandomizerWheel.com والتي يتم إرسالها مباشرة إلى متصفح المستخدمين، وتتلقى تلقائياً عنوان IP الخاص بك عند حدوث ذلك.',
            'يرجى ملاحظة أن RandomizerWheel.com ليس لديه إمكانية الوصول إلى ملفات تعريف الارتباط هذه أو التحكم فيها التي يستخدمها معلنون من جهات خارجية.',
          ],
        },
        {
          title: '6. حقوق حماية البيانات بموجب القانون العام للاتحاد الأوروبي (GDPR)',
          content: [
            'نود التأكد من أنك على دراية كاملة بجميع حقوق حماية البيانات الخاصة بك. يحق لكل مستخدم ما يلي:',
            '• الحق في الوصول: يحق لك طلب نسخ من بياناتك الشخصية.',
            '• الحق في التصحيح: يحق لك طلب تصحيح أي معلومات تعتقد أنها غير دقيقة.',
            '• الحق في المسح: يحق لك طلب مسح بياناتك الشخصية في ظل ظروف معينة.',
            '• الحق في تقييد المعالجة أو الاعتراض عليها ونقل البيانات.',
            'إذا قدمت طلباً، فلدينا شهر واحد للرد عليك. لممارسة أي من هذه الحقوق، يرجى التواصل معنا عبر yhpro.help@gmail.com.',
          ],
        },
        {
          title: '7. قانون خصوصية المستهلك في كاليفورنيا (CCPA / CPRA)',
          content: [
            'بموجب قانون CCPA/CPRA، يحق للمستهلكين في كاليفورنيا معرفة فئات البيانات الشخصية التي يجمعها النشاط التجاري، والمطالبة بحذفها، وعدم بيع أو مشاركة بياناتهم الشخصية.',
            'نحن نؤكد أننا لا نبيع البيانات الشخصية نهائياً. لتقديم أي استفسار، يرجى مراسلتنا عبر yhpro.help@gmail.com.',
          ],
        },
        {
          title: '8. خصوصية الأطفال وحمايتهم (COPPA)',
          content: [
            'لا يقوم موقع RandomizerWheel.com بجمع أي معلومات تعريف شخصية عن عمد من الأطفال الذين تقل أعمارهم عن 13 عاماً. إذا كنت تعتقد أن طفلك قدم هذا النوع من المعلومات على موقعنا، فإننا نشجعك بشدة على الاتصال بنا فوراً وسنبذل قصارى جهدنا لإزالة هذه المعلومات على الفور من سجلاتنا.',
          ],
        },
      ],
    },
    fr: {
      title: 'Politique de Confidentialité',
      lastUpdated: 'Février 2026',
      summary: 'Chez RandomizerWheel.com, accessible via https://randomizerwheel.com, la vie privée de nos visiteurs est une priorité absolue. Cette politique décrit les types de données collectées et leur utilisation en conformité avec Google AdSense et le RGPD.',
      sections: [
        {
          title: '1. Consentement et Champ d’application',
          content: [
            'En utilisant notre site Web, vous consentez à notre politique de confidentialité et acceptez ses termes.',
            'Cette politique s’applique uniquement à nos activités en ligne et aux visiteurs de RandomizerWheel.com.',
          ],
        },
        {
          title: '2. Données et stockage local côté client',
          content: [
            'RandomizerWheel enregistre vos choix de roue et configurations localement sur votre navigateur (LocalStorage). Nous ne collectons pas vos données de tirage privées.',
          ],
        },
        {
          title: '3. Google AdSense et Cookies DART',
          content: [
            'Google utilise des cookies (y compris les cookies DART) pour diffuser des annonces pertinentes auprès des visiteurs en fonction de leurs visites sur le Web.',
            'Vous pouvez désactiver la personnalisation des annonces via https://www.google.com/settings/ads.',
          ],
        },
        {
          title: '4. Vos droits RGPD',
          content: [
            'Conformément au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression de vos données personnelles en nous contactant à yhpro.help@gmail.com.',
          ],
        },
      ],
    },
    es: {
      title: 'Política de Privacidad',
      lastUpdated: 'Febrero de 2026',
      summary: 'En RandomizerWheel.com, accesible desde https://randomizerwheel.com, la privacidad de nuestros visitantes es de suma importancia. Esta Política de Privacidad detalla la información recopilada y cómo se utiliza.',
      sections: [
        {
          title: '1. Consentimiento',
          content: [
            'Al utilizar nuestro sitio web, usted acepta nuestra Política de Privacidad y sus términos.',
          ],
        },
        {
          title: '2. Almacenamiento Local y Privacidad',
          content: [
            'Todas las opciones y configuraciones de la ruleta se guardan en el almacenamiento local de su navegador (LocalStorage). No almacenamos sus listas privadas en servidores externos.',
          ],
        },
        {
          title: '3. Google AdSense y Cookies DART',
          content: [
            'Google utiliza cookies DART para mostrar anuncios a los usuarios según sus visitas en la web. Puede inhabilitar los anuncios personalizados en https://www.google.com/settings/ads.',
          ],
        },
        {
          title: '4. Contacto y Derechos de Privacidad',
          content: [
            'Para cualquier solicitud de privacidad o derechos GDPR/CCPA, puede contactarnos en yhpro.help@gmail.com.',
          ],
        },
      ],
    },
    zh: {
      title: '隐私政策 (Privacy Policy)',
      lastUpdated: '2026年2月',
      summary: '在 RandomizerWheel.com，我们高度重视访客的隐私。本隐私政策文件概述了我们收集的信息类型及其使用方式，符合 Google AdSense 和全球隐私合规标准。',
      sections: [
        {
          title: '1. 用户同意',
          content: [
            '使用我们的网站即表示您同意我们的隐私政策并遵守其条款。',
          ],
        },
        {
          title: '2. 本地存储与数据安全',
          content: [
            '您的转盘选项与个性化设置均保存在浏览器的 LocalStorage 中，保障您的私人抽签数据安全。',
          ],
        },
        {
          title: '3. Google AdSense 与广告 Cookie',
          content: [
            'Google 作为第三方供应商，使用 Cookie 在本网站上投放广告。用户可以通过访问 Google 广告设置 (https://www.google.com/settings/ads) 来选择停用个性化广告。',
          ],
        },
      ],
    },
    th: {
      title: 'นโยบายความเป็นส่วนตัว (Privacy Policy)',
      lastUpdated: 'กุมภาพันธ์ 2026',
      summary: 'ที่ RandomizerWheel.com ความเป็นส่วนตัวของผู้ใช้งานคือสิ่งสำคัญสูงสุดสำหรับเรา เอกสารนโยบายนี้อธิบายถึงข้อมูลที่มีการบันทึกและการใช้งานตามมาตรฐาน Google AdSense',
      sections: [
        {
          title: '1. การยินยอม',
          content: [
            'การใช้งานเว็บไซต์ของเราถือว่าคุณยอมรับนโยบายความเป็นส่วนตัวนี้',
          ],
        },
        {
          title: '2. คุกกี้และ Google AdSense',
          content: [
            'Google ใช้คุกกี้เพื่อแสดงโฆษณาตามความสนใจ คุณสามารถปิดการใช้งานโฆษณาส่วนบุคคลได้ที่ https://www.google.com/settings/ads',
          ],
        },
      ],
    },
    tl: {
      title: 'Patakaran sa Privacy (Privacy Policy)',
      lastUpdated: 'Pebrero 2026',
      summary: 'Sa RandomizerWheel.com, mahalaga sa amin ang inyong privacy. Ipinapaliwanag ng dokumentong ito ang impormasyong kinokolekta at kung paano ito ginagamit alinsunod sa Google AdSense.',
      sections: [
        {
          title: '1. Pahintulot',
          content: [
            'Sa paggamit ng aming website, sumasang-ayon ka sa aming Patakaran sa Privacy.',
          ],
        },
        {
          title: '2. Google AdSense at Cookies',
          content: [
            'Gumagamit ang Google ng DART cookies upang maghatid ng mga anunsyo. Maaaring mag-opt out sa https://www.google.com/settings/ads.',
          ],
        },
      ],
    },
    ko: {
      title: '개인정보 처리방침 (Privacy Policy)',
      lastUpdated: '2026년 2월',
      summary: 'RandomizerWheel.com은 사용자의 개인정보 보호를 최우선으로 생각합니다. 본 방침은 Google AdSense 및 국제 개인정보 보호 규정에 따른 데이터 수집 및 관리 기준을 명시합니다.',
      sections: [
        {
          title: '1. 동의 및 범위',
          content: [
            '본 웹사이트를 이용함으로써 귀하는 개인정보 처리방침에 동의하게 됩니다.',
          ],
        },
        {
          title: '2. Google AdSense 및 쿠키 정책',
          content: [
            'Google은 사용자의 이전 방문 기록을 바탕으로 광고를 게재하기 위해 쿠키를 사용합니다. 맞춤 광고 설정은 https://www.google.com/settings/ads 에서 변경할 수 있습니다.',
          ],
        },
      ],
    },
    ja: {
      title: 'プライバシーポリシー (Privacy Policy)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com では、利用者の皆様のプライバシー保護を極めて重要視しています。本ポリシーでは、Google AdSense の基準に則った情報収集および利用方針を定めています。',
      sections: [
        {
          title: '1. 同意',
          content: [
            '当ウェブサイトをご利用いただくことで、本プライバシーポリシーに同意したものとみなされます。',
          ],
        },
        {
          title: '2. Google AdSense と Cookie について',
          content: [
            'Google などの第三者配信事業者は Cookie を使用して広告を配信します。ユーザーは広告設定 (https://www.google.com/settings/ads) でパーソナライズ広告を無効にできます。',
          ],
        },
      ],
    },
  },

  terms: {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'February 2026',
      summary: 'Welcome to RandomizerWheel.com. By accessing or using our interactive wheel spinner, random number generator, and related utilities, you agree to be bound by these Terms of Service.',
      sections: [
        {
          title: '1. Permitted Use & Service Description',
          content: [
            'RandomizerWheel.com provides free, interactive web-based decision making, raffle drawing, and random selection tools.',
            'You agree to use the service only for lawful, harmless, and ethical purposes. You may not use the service to generate hate speech, harassment, illegal gambling schemes, or malicious content.',
          ],
        },
        {
          title: '2. Random Generation & Fair Algorithm Disclaimer',
          content: [
            'Our spinning physics and number generator utilize standard cryptographic pseudo-random number generation (PRNG) algorithms.',
            'While designed to provide unbiased, equitable, and fair random distributions, all outputs are provided on an "AS IS" and "AS AVAILABLE" basis. RandomizerWheel.com makes no warranties regarding the legal, financial, or regulatory suitability of draws for formal state lotteries or legally regulated wagering without official third-party audit.',
          ],
        },
        {
          title: '3. User Content & Intellectual Property',
          content: [
            'You retain all rights to the custom text, option lists, and titles you enter into the wheel spinner. You grant RandomizerWheel.com no proprietary rights over your custom user input.',
            'All interface assets, sound synthesis, code, graphics, brand identity, and wheel mechanics are the intellectual property of RandomizerWheel.com and protected by international copyright laws.',
          ],
        },
        {
          title: '4. Limitation of Liability',
          content: [
            'In no event shall RandomizerWheel.com, its creators, or affiliates be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use this service, or any decisions made based on the outcome of a spin.',
          ],
        },
        {
          title: '5. Changes to Terms',
          content: [
            'We reserve the right to modify these terms at any time. Continued use of the website following any changes constitutes acceptance of the revised Terms of Service.',
          ],
        },
      ],
    },
    ar: {
      title: 'شروط الاستخدام والخدمة (Terms of Service)',
      lastUpdated: 'فبراير 2026',
      summary: 'أهلاً بك في موقع RandomizerWheel.com. باستخدامك لعجلة القرعة ومولد الأرقام وأدوات الاختيار العشوائي، فإنك توافق على الالتزام بشروط الخدمة الموضحة أدناه.',
      sections: [
        {
          title: '1. الاستخدام المسموح ووصف الخدمة',
          content: [
            'يقدم موقع RandomizerWheel.com أدوات مجانية وتفاعلية عبر الويب للمساعدة في اتخاذ القرارات، وإجراء السحوبات العشوائية، والمسابقات المدرسية والترفيهية.',
            'أنت توافق على استخدام الخدمة فقط للأغراض القانونية والأخلاقية. يُحظر تماماً استخدام الموقع في أي أنشطة تنتهك القوانين أو توليد محتوى مسيء أو ضار.',
          ],
        },
        {
          title: '2. خوارزميات التوليد العشوائي وإخلاء المسؤولية',
          content: [
            'تعتمد محاكاة حركة العجلة ومولد الأرقام على خوارزميات رياضية عشوائية دقيقة ونزيهة (PRNG) تضمن التكافؤ التام بين جميع الخيارات.',
            'تُقدَّم الخدمة "كما هي" دون أي ضمانات قانونية أو تجارية للسحوبات واليانصيب الرسمية المنظمة بموجب تشريعات خاصة دون تدقيق جهات ترخيص خارجية.',
          ],
        },
        {
          title: '3. حقوق الملكية الفكرية',
          content: [
            'يحتفظ المستخدم بكامل الحقوق في النصوص والأسماء والقوائم التي يقوم بإدخالها في العجلة.',
            'جميع عناصر التصميم، والشفرات البرمجية، والمؤثرات الصوتية، والعلامة التجارية لموقع RandomizerWheel.com محمية بموجب قوانين حقوق النشر والملكية الفكرية.',
          ],
        },
        {
          title: '4. حدود المسؤولية',
          content: [
            'لا يتحمل موقع RandomizerWheel.com أو القائمون عليه أي مسؤولية عن أي قرارات شخصية أو تجارية أو نتائج تترتب على استخدام سحوبات العجلة أو مخرجات التوليد العشوائي.',
          ],
        },
      ],
    },
    fr: {
      title: 'Conditions d’Utilisation (Terms of Service)',
      lastUpdated: 'Février 2026',
      summary: 'En utilisant RandomizerWheel.com, vous acceptez d’être lié par les présentes conditions d’utilisation régissant nos outils de tirage au sort.',
      sections: [
        {
          title: '1. Utilisation Autorisée',
          content: [
            'Notre service est gratuit et destiné à la prise de décision, aux jeux, tirages au sort scolaires et animations.',
          ],
        },
        {
          title: '2. Limitation de Responsabilité',
          content: [
            'Les tirages sont générés à des fins de divertissement. RandomizerWheel.com décline toute responsabilité quant aux conséquences des décisions prises.',
          ],
        },
      ],
    },
    es: {
      title: 'Términos de Servicio (Terms of Service)',
      lastUpdated: 'Febrero de 2026',
      summary: 'Al utilizar RandomizerWheel.com, usted acepta estos Términos de Servicio para el uso de nuestras herramientas interactivas de sorteos y decisiones.',
      sections: [
        {
          title: '1. Uso Aceptable',
          content: [
            'El servicio se proporciona para entretenimiento, educación y toma de decisiones imparciales.',
          ],
        },
      ],
    },
    zh: {
      title: '服务条款 (Terms of Service)',
      lastUpdated: '2026年2月',
      summary: '欢迎使用 RandomizerWheel.com。访问并使用我们的幸运大转盘和数字抽取工具即代表您同意本服务条款。',
      sections: [
        {
          title: '1. 合法使用',
          content: [
            '本网站提供的工具仅用于娱乐、教学和日常决策支持。',
          ],
        },
      ],
    },
    th: {
      title: 'ข้อกำหนดการใช้งาน (Terms of Service)',
      lastUpdated: 'กุมภาพันธ์ 2026',
      summary: 'ข้อกำหนดการใช้งานเครื่องมือวงล้อสุ่มและระบบสุ่มตัวเลขของ RandomizerWheel.com',
      sections: [
        {
          title: '1. การใช้งานที่ได้รับอนุญาต',
          content: [
            'บริการนี้จัดทำขึ้นเพื่อความบันเทิงและการตัดสินใจทั่วไปอย่างเป็นกลาง',
          ],
        },
      ],
    },
    tl: {
      title: 'Mga Tuntunin ng Serbisyo (Terms of Service)',
      lastUpdated: 'Pebrero 2026',
      summary: 'Mga tuntunin sa paggamit ng RandomizerWheel.com para sa mga raffle at pagpili.',
      sections: [
        {
          title: '1. Paggamit',
          content: [
            'Ang serbisyong ito ay libre para sa pampublikong libangan at patas na pagpili.',
          ],
        },
      ],
    },
    ko: {
      title: '이용약관 (Terms of Service)',
      lastUpdated: '2026년 2월',
      summary: 'RandomizerWheel.com의 서비스 이용약관 및 사용자 권리 안내입니다.',
      sections: [
        {
          title: '1. 서비스 이용 목적',
          content: [
            '본 서비스는 오락, 학습, 공정한 의사결정을 돕기 위해 무료로 제공됩니다.',
          ],
        },
      ],
    },
    ja: {
      title: '利用規約 (Terms of Service)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com の利用規約およびサービス利用条件です。',
      sections: [
        {
          title: '1. 利用条件',
          content: [
            '当サイトのルーレットおよび数字抽選ツールは、エンターテインメントおよび公平な抽選目的で提供されています。',
          ],
        },
      ],
    },
  },

  about: {
    en: {
      title: 'About Us',
      lastUpdated: 'February 2026',
      summary: 'RandomizerWheel.com is a premier, privacy-focused online wheel spinner, random name picker, and decision-making platform built for educators, content creators, event hosts, and everyday decision makers worldwide.',
      sections: [
        {
          title: 'Our Mission & Philosophy',
          content: [
            'Making decisions should be fun, unbiased, and effortless. Whether you are picking a lucky winner in a live classroom raffle, deciding where to eat dinner with friends, or generating random numbers for a giveaway, RandomizerWheel provides an engaging, visually polished experience.',
            'We believe in radical transparency, cryptographic fairness, and user privacy. That is why our tools work right in your browser without requiring account registrations, downloads, or harvesting personal information.',
          ],
        },
        {
          title: 'Key Features & Technological Excellence',
          content: [
            '• True Physics Spinning Animation: Realistic deceleration physics with smooth 60fps canvas rendering and responsive ticker sound effects.',
            '• 9 Global Languages: Fully translated interface and RTL support for international audiences across North America, Europe, the Middle East, Asia, and Latin America.',
            '• AI-Powered Topic Lists: Instant intelligent option generation powered by advanced AI for trivia, educational topics, and fun games.',
            '• Flexible Number & Yes/No Modes: Dedicated high-speed tools for raffles, boolean decision making, and custom lists.',
            '• Custom Color Themes & Branding: Full control over palette presets, audio volume, and slice weights.',
          ],
        },
        {
          title: 'Our Commitment to Quality & Community',
          content: [
            'We continuously update RandomizerWheel based on community feedback. If you have an idea for a new feature, a custom preset suggestion, or need technical assistance, our support team is always ready to assist you at yhpro.help@gmail.com.',
          ],
        },
      ],
    },
    ar: {
      title: 'من نحن (About Us)',
      lastUpdated: 'فبراير 2026',
      summary: 'موقع RandomizerWheel.com هو منصة رائدة وتفاعلية متخصصة في عجلة القرعة واختيار الأسماء العشوائية وحسم القرارات، صُممت لخدمة المعلمين، وصناع المحتوى، ومنظمي الفعاليات والمستخدمين في جميع أنحاء العالم.',
      sections: [
        {
          title: 'رؤيتنا ورسالتنا',
          content: [
            'نؤمن بأن اتخاذ القرارات وإجراء السحوبات والمسابقات يجب أن يكون تجربة ممتعة، شفافة، وعادلة بنسبة 100%. سواء كنت تجري سحب جوائز مباشر في الفصل الدراسي، أو تختار وجبة عشاء مع العائلة، أو تولد أرقاماً لبطاقات السحب، يوفر لك RandomizerWheel الأداة المثالية بتصميم راقٍ وعصري.',
            'نلتزم بأعلى معايير الخصوصية والأمان؛ لذلك تعمل جميع الأدوات مباشرة داخل متصفحك دون الحاجة لتسجيل حساب أو تنزيل برامج أو جمع بيانات شخصية.',
          ],
        },
        {
          title: 'أبرز مميزات المنصة والتقنيات المستخدمة',
          content: [
            '• محاكاة فيزيائية واقعية للدوران: حركة دوران سلسة بمعدل 60 إطاراً في الثانية مع مؤثرات صوتية تفاعلية تحاكي العجلة الحقيقية.',
            '• دعم كامل لـ 9 لغات عالمية: واجهة كاملة باللغة العربية مع دعم تام للكتابة من اليمين لليسار (RTL) بالإضافة للإنجليزية والفرنسية والإسبانية وغيرها.',
            '• توليد ذكي بالذكاء الاصطناعي: إمكانية توليد قوائم متكاملة فورياً لأي موضوع يخطر ببالك (دول، مطاعم، ألعاب، أسئلة تحديات).',
            '• أدوات مخصصة لحسم (نعم أم لا) وتوليد الأرقام العشوائية لبطاقات السحب.',
            '• ثيمات ألوان متنوعة وإمكانية تخصيص أصوات الدوران بالكامل.',
          ],
        },
        {
          title: 'التواصل والدعم الفني',
          content: [
            'نعمل باستمرار على تطوير الموقع وإضافة ميزات جديدة بناءً على اقتراحاتكم. يسعدنا دائماً تواصلكم معنا عبر البريد الإلكتروني: yhpro.help@gmail.com.',
          ],
        },
      ],
    },
    fr: {
      title: 'À Propos de Nous (About Us)',
      lastUpdated: 'Février 2026',
      summary: 'RandomizerWheel.com est votre plateforme de référence pour les roues de décision interactives, tirages au sort de noms et générateurs de nombres.',
      sections: [
        {
          title: 'Notre Mission',
          content: [
            'Offrir des outils de tirage au sort équitables, fluides et accessibles dans le monde entier en 9 langues.',
          ],
        },
      ],
    },
    es: {
      title: 'Sobre Nosotros (About Us)',
      lastUpdated: 'Febrero de 2026',
      summary: 'RandomizerWheel.com es una plataforma líder para sorteos aleatorios, toma de decisiones y ruletas personalizadas.',
      sections: [
        {
          title: 'Nuestra Misión',
          content: [
            'Brindar herramientas de sorteo gratuitas, justas e intuitivas para educadores, creadores y usuarios de todo el mundo.',
          ],
        },
      ],
    },
    zh: {
      title: '关于我们 (About Us)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com 致力于为全球用户提供公平、直观且功能强大的在线幸运大转盘与随机抽签工具。',
      sections: [
        {
          title: '我们的使命',
          content: [
            '让每一次决策和抽奖都充满乐趣与透明度。',
          ],
        },
      ],
    },
    th: {
      title: 'เกี่ยวกับเรา (About Us)',
      lastUpdated: 'กุมภาพันธ์ 2026',
      summary: 'RandomizerWheel.com ผู้ให้บริการวงล้อสุ่มและโปรแกรมจับฉลากออนไลน์ที่โปร่งใสและใช้งานง่ายที่สุด',
      sections: [
        {
          title: 'พันธกิจของเรา',
          content: [
            'สร้างประสบการณ์การตัดสินใจและการจับรางวัลที่สนุกและยุติธรรมสำหรับทุกคน',
          ],
        },
      ],
    },
    tl: {
      title: 'Tungkol sa Amin (About Us)',
      lastUpdated: 'Pebrero 2026',
      summary: 'Ang RandomizerWheel.com ay ang inyong maaasahang kasama para sa patas at masayang spin wheel raffle.',
      sections: [
        {
          title: 'Aming Misyon',
          content: [
            'Magbigay ng libre at madaling gamiting randomizer tool para sa lahat.',
          ],
        },
      ],
    },
    ko: {
      title: '회사 소개 (About Us)',
      lastUpdated: '2026년 2월',
      summary: 'RandomizerWheel.com은 전 세계 사용자를 위한 공정하고 직관적인 온라인 돌림판 및 랜덤 추첨 플랫폼입니다.',
      sections: [
        {
          title: '우리의 비전',
          content: [
            '교육, 이벤트, 일상의 모든 결정을 재미있고 공정하게 지원합니다.',
          ],
        },
      ],
    },
    ja: {
      title: '当サイトについて (About Us)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com は、誰でも簡単に使える高品質なオンラインルーレット＆名前抽選ツールです。',
      sections: [
        {
          title: 'ミッション',
          content: [
            '透明性と公平性に優れた抽選体験を世界中のユーザーにお届けします。',
          ],
        },
      ],
    },
  },

  cookies: {
    en: {
      title: 'Cookie Policy',
      lastUpdated: 'February 2026',
      summary: 'This Cookie Policy explains what cookies are, how RandomizerWheel.com uses cookies and similar technologies, and how you can manage your preferences.',
      sections: [
        {
          title: '1. What Are Cookies?',
          content: [
            'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide a better browsing experience.',
          ],
        },
        {
          title: '2. How We Use Cookies & Local Storage',
          content: [
            '• Essential & Functional Preferences: We use browser LocalStorage to remember your custom wheel options, selected theme, sound volume, and language preference.',
            '• Google Advertising Cookies (DART): Google AdSense uses cookies to serve ads based on your visit to this and other websites.',
            '• Analytics & Performance: Cookies may be used to understand how visitors interact with the site to optimize performance.',
          ],
        },
        {
          title: '3. Managing & Disabling Cookies',
          content: [
            'You can choose to disable cookies through your individual browser options (e.g., Chrome, Safari, Firefox, Edge). More detailed information about cookie management with specific web browsers can be found at the browsers’ respective websites.',
            'To opt out of Google AdSense personalized advertising cookies specifically, visit https://www.google.com/settings/ads.',
          ],
        },
      ],
    },
    ar: {
      title: 'سياسة ملفات تعريف الارتباط (Cookie Policy)',
      lastUpdated: 'فبراير 2026',
      summary: 'توضح سياسة ملفات تعريف الارتباط هذه ما هي ملفات الكوكيز وكيفية استخدام موقع RandomizerWheel.com لها وكيف يمكنك إدارة تفضيلاتك.',
      sections: [
        {
          title: '1. ما هي ملفات تعريف الارتباط (Cookies)؟',
          content: [
            'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهاز الكمبيوتر أو هاتفك عند زيارة المواقع الإلكترونية لتسهيل التصفح وتذكر التفضيلات وتحسين تجربة الاستخدام.',
          ],
        },
        {
          title: '2. كيف نستخدم ملفات تعريف الارتباط والذاكرة المحلية؟',
          content: [
            '• التفضيلات الأساسية: نستخدم الذاكرة المحلية (LocalStorage) لتذكر خيارات العجلة الخاصة بك، ولغة الموقع، والثيم المفضل.',
            '• إعلانات Google AdSense: تستخدم Google ملفات تعريف الارتباط لعرض إعلانات ملائمة للزوار استناداً إلى زياراتهم السابقة.',
          ],
        },
        {
          title: '3. كيفية التحكم في ملفات تعريف الارتباط وإلغاء تفعيلها',
          content: [
            'يمكنك تعطيل أو حذف ملفات تعريف الارتباط من خلال إعدادات متصفحك (مثل Chrome، Safari، Firefox).',
            'لإلغاء الاشتراك في الإعلانات المخصصة من Google، يرجى زيارة: https://www.google.com/settings/ads.',
          ],
        },
      ],
    },
    fr: {
      title: 'Politique des Cookies (Cookie Policy)',
      lastUpdated: 'Février 2026',
      summary: 'Cette politique explique l’utilisation des cookies sur RandomizerWheel.com et vos options de gestion.',
      sections: [
        {
          title: '1. Utilisation des Cookies',
          content: [
            'Nous utilisons le stockage local pour vos préférences et Google AdSense pour diffuser des annonces pertinentes.',
          ],
        },
      ],
    },
    es: {
      title: 'Política de Cookies (Cookie Policy)',
      lastUpdated: 'Febrero de 2026',
      summary: 'Explicación sobre el uso de cookies y almacenamiento local en RandomizerWheel.com.',
      sections: [
        {
          title: '1. Uso de Cookies',
          content: [
            'Utilizamos cookies para guardar preferencias y mostrar publicidad relevante a través de Google AdSense.',
          ],
        },
      ],
    },
    zh: {
      title: 'Cookie 政策 (Cookie Policy)',
      lastUpdated: '2026年2月',
      summary: '本页面说明 RandomizerWheel.com 如何使用 Cookie 及本地存储技术。',
      sections: [
        {
          title: '1. Cookie 用途',
          content: [
            '用于保存用户转盘配置，并通过 Google AdSense 展示相关广告。',
          ],
        },
      ],
    },
    th: {
      title: 'นโยบายคุกกี้ (Cookie Policy)',
      lastUpdated: 'กุมภาพันธ์ 2026',
      summary: 'นโยบายการใช้งานคุกกี้ของ RandomizerWheel.com',
      sections: [
        {
          title: '1. การใช้งานคุกกี้',
          content: [
            'ใช้สำหรับบันทึกการตั้งค่าวงล้อและการแสดงโฆษณาที่เกี่ยวข้อง',
          ],
        },
      ],
    },
    tl: {
      title: 'Patakaran sa Cookies (Cookie Policy)',
      lastUpdated: 'Pebrero 2026',
      summary: 'Impormasyon ukol sa paggamit ng cookies sa RandomizerWheel.com.',
      sections: [
        {
          title: '1. Paggamit ng Cookies',
          content: [
            'Ginagamit para sa mga setting ng wheel at mga anunsyo mula sa Google AdSense.',
          ],
        },
      ],
    },
    ko: {
      title: '쿠키 정책 (Cookie Policy)',
      lastUpdated: '2026년 2월',
      summary: 'RandomizerWheel.com의 쿠키 사용 및 관리 안내입니다.',
      sections: [
        {
          title: '1. 쿠키의 사용 목적',
          content: [
            '사용자 설정 저장 및 Google AdSense 광고 최적화를 위해 사용됩니다.',
          ],
        },
      ],
    },
    ja: {
      title: 'Cookie ポリシー (Cookie Policy)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com における Cookie の利用目的と管理方法について説明します。',
      sections: [
        {
          title: '1. Cookie の利用目的',
          content: [
            '設定の保存および Google AdSense による適切な広告配信のために利用されます。',
          ],
        },
      ],
    },
  },

  disclaimer: {
    en: {
      title: 'Disclaimer',
      lastUpdated: 'February 2026',
      summary: 'General information, random simulation, and fair-use disclaimers for RandomizerWheel.com.',
      sections: [
        {
          title: '1. Entertainment & General Purpose Only',
          content: [
            'All wheel spinners, number pickers, and decision makers provided on RandomizerWheel.com are created for entertainment, recreational, educational, and general decision-making purposes only.',
            'RandomizerWheel.com is not an official gambling, lottery, or regulated casino wagering operator.',
          ],
        },
        {
          title: '2. No Warranties or Liability',
          content: [
            'We make every reasonable effort to ensure high uptime and mathematical randomness. However, the service is provided on an "as is" basis without any express or implied warranties.',
          ],
        },
      ],
    },
    ar: {
      title: 'إخلاء المسؤولية (Disclaimer)',
      lastUpdated: 'فبراير 2026',
      summary: 'بيان إخلاء المسؤولية العامة وطبيعة المخرجات العشوائية على موقع RandomizerWheel.com.',
      sections: [
        {
          title: '1. أغراض ترفيهية وتعليمية فقط',
          content: [
            'تُقدَّم جميع عجلات القرعة ومولدات الأرقام على موقع RandomizerWheel.com لأغراض الترفيه والتعليم وتنظيم المسابقات واتخاذ القرارات الودية فقط.',
            'الموقع ليس منصة للمقامرة أو اليانصيب المالي الرسمي الخاضع لتراخيص مراهنات.',
          ],
        },
        {
          title: '2. حدود الضمانات',
          content: [
            'يتم توفير الموقع ومخرجاته "كما هي" دون أي ضمانات تجارية أو تعويضات عن قرارات يتخذها المستخدمون استناداً لنتائج السحب.',
          ],
        },
      ],
    },
    fr: {
      title: 'Avis de Non-Responsabilité (Disclaimer)',
      lastUpdated: 'Février 2026',
      summary: 'Avertissement légal et clause de non-responsabilité pour RandomizerWheel.com.',
      sections: [
        {
          title: '1. Fins de divertissement uniquement',
          content: [
            'Les outils sont fournis à des fins éducatives et de divertissement uniquement.',
          ],
        },
      ],
    },
    es: {
      title: 'Descargo de Responsabilidad (Disclaimer)',
      lastUpdated: 'Febrero de 2026',
      summary: 'Descargo de responsabilidad para RandomizerWheel.com.',
      sections: [
        {
          title: '1. Solo entretenimiento',
          content: [
            'Todas las herramientas se ofrecen con fines recreativos y educativos.',
          ],
        },
      ],
    },
    zh: {
      title: '免责声明 (Disclaimer)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com 平台通用免责声明。',
      sections: [
        {
          title: '1. 仅限娱乐与决策参考',
          content: [
            '本网站所有工具仅用于娱乐、教学及日常参考。',
          ],
        },
      ],
    },
    th: {
      title: 'ข้อจำกัดความรับผิดชอบ (Disclaimer)',
      lastUpdated: 'กุมภาพันธ์ 2026',
      summary: 'ข้อจำกัดความรับผิดชอบทางกฎหมายของ RandomizerWheel.com',
      sections: [
        {
          title: '1. เพื่อความบันเทิงเท่านั้น',
          content: [
            'เครื่องมือทั้งหมดมีไว้สำหรับความบันเทิงและการศึกษาเท่านั้น',
          ],
        },
      ],
    },
    tl: {
      title: 'Pagtanggi sa Pananagutan (Disclaimer)',
      lastUpdated: 'Pebrero 2026',
      summary: 'Pagtanggi sa pananagutan para sa RandomizerWheel.com.',
      sections: [
        {
          title: '1. Para sa Libangan Lamang',
          content: [
            'Ang lahat ng resulta ay para sa libangan at edukasyon lamang.',
          ],
        },
      ],
    },
    ko: {
      title: '면책 조항 (Disclaimer)',
      lastUpdated: '2026년 2월',
      summary: 'RandomizerWheel.com의 법적 면책 조항 안내입니다.',
      sections: [
        {
          title: '1. 오락 및 참고용',
          content: [
            '본 사이트의 모든 추첨 도구는 오락 및 일반적인 참고 목적으로만 제공됩니다.',
          ],
        },
      ],
    },
    ja: {
      title: '免責事項 (Disclaimer)',
      lastUpdated: '2026年2月',
      summary: 'RandomizerWheel.com における法的免責事項です。',
      sections: [
        {
          title: '1. エンターテインメント目的',
          content: [
            '当サイトのすべての機能は娯楽および教育目的でのみ提供されています。',
          ],
        },
      ],
    },
  },
};
