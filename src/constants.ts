import { NavItem, PackagesData } from './types';
import { Type, Layers, Globe, PenTool, LayoutGrid } from 'lucide-react';
// استيراد إعدادات الصور من ملف مركزي - لتسهيل إدارة جميع الصور في مكان واحد
import { BRAND_LOGOS, PROFILE_IMAGE, LOGO_EXAMPLES_BY_TYPE } from './imageConfig';

// حساب سنوات الخبرة ديناميكياً بناءً على السنة الحالية
const START_YEAR = 2019; // سنة البداية
const CURRENT_YEAR = new Date().getFullYear();
const EXPERIENCE_YEARS = CURRENT_YEAR - START_YEAR;

/**
 * مسارات الصور والأصول المستخدمة في الموقع
 * 
 * ملاحظة: لتغيير الصور، يرجى تعديل ملف src/imageConfig.ts
 * حيث يحتوي على جميع مسارات الصور مع تعليمات مفصلة بالعربية
 */
export const ASSETS = {
  logo: BRAND_LOGOS.main,        // الشعار الرئيسي
  profile: PROFILE_IMAGE          // صورة الملف الشخصي
};

// عناصر قائمة التنقل (الروابط للأقسام في الصفحة الواحدة)
export const NAVIGATION: NavItem[] = [
  { label: 'الرئيسية', path: '#home' },
  { label: 'أعمالي', path: '#portfolio' },
  { label: 'الباقات', path: '#packages' },
  { label: 'السيرة الذاتية', path: '#resume' },
  { label: 'طريقة العمل', path: '#process' },
  { label: 'ابدأ مشروعك', path: '#brief' },
];

// بيانات السيرة الذاتية
export const RESUME_DATA = {
  name: "مصطفى الموسوي", // تم التحديث بناءً على الطلب
  title: "مصمم جرافيكس",
  about: `مصمم جرافيك ذو خبرة تزيد عن ${EXPERIENCE_YEARS} سنوات، متخصص باحترافية في تصميم الشعارات والهوية البصرية. أمتلك مهارة عالية في تصميم وتنسيق منشورات التواصل الاجتماعي والبنرات الإعلانية بأسلوب عصري وجذاب. أركز على تقديم حلول بصرية إبداعية تخدم أهداف العميل وتبرز جمالية العلامة التجارية، مع الالتزام بأعلى معايير الجودة.`,
  education: "كلية علوم الحاسوب وتكنولوجيا المعلومات / قسم نظم المعلومات الحاسوبية / جامعة البصرة",
  contact: {
    location: "البصرة، العراق",
    instagram: "https://www.instagram.com/mustafa.al_mousawi",
    instagramHandle: "@mustafa.al_mousawi",
    telegram: "https://t.me/mustafa_al_moussawi",
    telegramHandle: "@mustafa_al_moussawi",
    email: "mustafahaidar0955@gmail.com",
    whatsapp: "https://wa.me/9647835091952",
    whatsappDisplay: "07835091952"
  },
  skills: [
    "تصميم الشعارات والهوية البصرية",
    "تصميم تصاميم سوشيال ميديا",
    "تصميم البروشورات",
    "الرسم الرقمي + الرسم بالرصاص والفحم",
    "التصوير، وقواعد التثليث + مفاهيم التركيب",
    "شيء من الخط العربي",
    "كتابة المحتوى (متوسط)",
    "برامج أوفيس",
    "إدارة الوقت",
    "قيادة الفريق",
    "الكتابة السريعة على الكيبورد",
    "المونتاج باستخدام DaVinci Resolve"
  ],
  courses: [
    "كورس تعلم الفوتوشوب، لنور ديزاين + لنور حمصي",
    "كورس تعلم الاليستريتور، لمحمد خيال + شيماء النجار",
    "كورس تعلم تصاميم سوشيال ميديا، لنور ديزاين",
    "كورس تعلم أساسيات التصميم، لنور حمصي",
    "كورس تعلم مبادئ الرسم، لسامح عرفة",
    "كورس تعلم التغذية البصرية لنور حمصي",
    "أساسيات التصوير: تكوين الصورة وترتيب العناصر. عند محمد احسان",
    "قواعد الألوان: نظريات ومعاني الألوان | الألوان في التصوير الفوتوغرافي. عند محمد احسان",
    "فن الإضاءة | أساسيات في التصوير الفوتوغرافي والسينمائي. عند محمد احسان",
    "كورس لتعلم برنامج دافينشي ريزولف (DaVinci Resolve) للمونتاج"
  ]
};


export const APPLICATION_CATEGORIES = [
  {
    title: 'الرقمي والسوشيال ميديا',
    items: [
      { key: 'profilePic', label: 'صور الحسابات والأغلفة' },
      { key: 'socialMedia', label: 'قوالب منشورات وستوري السوشيال ميديا' },
      { key: 'companyProfile', label: 'بروفايل الشركة التعريفي (PDF)' },
      { key: 'emailSignature', label: 'توقيع البريد الإلكتروني' },
      { key: 'powerpoint', label: 'قوالب عروض PowerPoint' },
      { key: 'website', label: 'واجهة الموقع / التطبيق' }
    ]
  },
  {
    title: 'المطبوعات والقرطاسية التجارية',
    items: [
      { key: 'businessCard', label: 'كارت شخصي' },
      { key: 'letterHead', label: 'ورقة المراسلات الرسمية A4' },
      { key: 'envelopesFolders', label: 'أظرف وفولدرات أوراق العمل' },
      { key: 'stampsVouchers', label: 'الأختام والسندات المالية' }
    ]
  },
  {
    title: 'التغليف والمنتجات الترويجية',
    items: [
      { key: 'packagingBoxesBags', label: 'أكياس وعلب التغليف' },
      { key: 'labelsStickers', label: 'ملصقات واستيكرات' },
      { key: 'cupsHospitality', label: 'أكواب ومناديل ومستلزمات تقديم' }
    ]
  },
  {
    title: 'اللوحات والتجهيزات الميدانية',
    items: [
      { key: 'signage', label: 'لوحة المحل واللافتات الخارجية' },
      { key: 'rollupsExhibition', label: 'رول أب ومستندات المعارض' },
      { key: 'uniform', label: 'زي الموظفين' },
      { key: 'vehicle', label: 'تصميم وتغليف سيارات الشركة' }
    ]
  }
];

export const APPLICATION_OPTIONS = APPLICATION_CATEGORIES.flatMap(c => c.items);

export const LOGO_TYPE_EXAMPLES = [
  { id: 'text', label: 'شعار نصي', labelEn: 'TEXT LOGO', sub: 'TEXT LOGO', icon: Type, desc: 'يعتمد على الخط والتايبوغرافي', images: LOGO_EXAMPLES_BY_TYPE.text },
  { id: 'symbolic', label: 'شعار رمزي', labelEn: 'SYMBOLIC LOGO', sub: 'SYMBOLIC LOGO', icon: Layers, desc: 'يعتمد على أيقونة أو رمز', images: LOGO_EXAMPLES_BY_TYPE.symbolic },
  { id: 'innovative', label: 'شعار مبتكر', labelEn: 'INNOVATIVE LOGO', sub: 'INNOVATIVE LOGO', icon: PenTool, desc: 'فكرة خارج الصندوق', images: LOGO_EXAMPLES_BY_TYPE.innovative },
  { id: 'double', label: 'شعار مزدوج', labelEn: 'DOUBLE LOGO', sub: 'DOUBLE LOGO', icon: LayoutGrid, desc: 'يجمع بين الرمز والنص', images: LOGO_EXAMPLES_BY_TYPE.double },
  { id: 'arabic', label: 'شعار بالخط العربي', labelEn: 'ARABIC LOGO', sub: 'ARABIC LOGO', icon: Globe, desc: 'كاليغرافي أو خط حر', images: LOGO_EXAMPLES_BY_TYPE.arabic },
];

// ==========================================
// بيانات باقات الخدمات والأسعار
// ==========================================
export const PACKAGES_DATA: PackagesData = {
  logoDesign: [
    {
      id: 'lite',
      name: 'الاقتصادية',
      nameEn: 'LITE',
      price: 35000,
      category: 'logo' as const,
      target: 'للمشاريع المنزلية الناشئة التي تريد انطلاقة سريعة بأقل تكلفة.',
      benefit: 'مظهر مرتب وبسيط أمام زبائنك يغنيك عن الصور العشوائية.',
      features: [
        'خيار تصميمي واحد (خطي/أيقونة)',
        'تعديل واحد مجاني',
        'تسليم بصيغ PNG + JPEG',
      ],
      deliveries: ['PNG', 'JPEG'],
      revisions: 1,
      deliveryDays: '3-5 أيام',
    },
    {
      id: 'startup',
      name: 'النمو',
      nameEn: 'STARTUP',
      price: 75000,
      badge: 'الأكثر طلباً',
      isPopular: true,
      category: 'logo' as const,
      target: 'للمشاريع المبتدئة التي تبحث عن هوية خاصة تواجه بها المنافسين.',
      benefit: 'شعار مبتكر يعبر عن فكرتك ويثبت جديتك بالسوق.',
      features: [
        'خيارين تصميميين (2 Concepts)',
        'جولتين من التعديلات',
        'تسليم الملفات الأساسية (SVG, PNG, PDF)',
      ],
      deliveries: ['SVG', 'PNG', 'PDF'],
      revisions: 2,
      deliveryDays: '5-7 أيام',
    },
    {
      id: 'premium',
      name: 'المتميزة',
      nameEn: 'PREMIUM',
      price: 125000,
      category: 'logo' as const,
      target: 'للمشاريع الطموحة (متاجر، مطاعم، عيادات) التي تريد فرض اسمها.',
      benefit: 'شعار مبني على قواعد هندسية (Grid System) لتبدو كعلامة كبرى.',
      features: [
        '3 خيارات تصميمية مبتكرة',
        'تعديلات مرنة (حتى 5 جولات)',
        'تسليم الملفات المصدرية المفتوحة بالكامل',
      ],
      deliveries: ['SVG', 'PNG', 'PDF'],
      revisions: 5,
      deliveryDays: '7-10 أيام',
    },
    {
      id: 'elite',
      name: 'النخبة',
      nameEn: 'ELITE PRO',
      price: 250000,
      isFeatured: true,
      category: 'logo' as const,
      target: 'الشركات والمؤسسات التي تبحث عن بناء "براند" رصين ومستدام.',
      benefit: 'دراسة شاملة للسوق لابتكار شعار فريد يعيش لسنوات.',
      features: [
        'دراسة السوق والمنافسين',
        '4 خيارات تصميمية احترافية',
        'عرض الشعار على Mockups واقعية',
        'دليل ألوان وخطوط مصغر',
        'كافة الصيغ المصدرية والشفافة',
      ],
      deliveries: ['SVG', 'PNG', 'PDF', 'JPEG'],
      revisions: 'غير محدودة',
      deliveryDays: '10-14 يوم',
    },
  ],
  branding: {
    name: 'الهوية البصرية المتكاملة',
    category: 'branding' as const,
    originalPrice: 550000,
    currentPrice: 390000,
    savings: 160000,
    target: 'للشركات والمشاريع الجادة',
    benefit: 'إنهاء فوضى الألوان وبناء نظام بصري موحد يبرر أسعارك تلقائياً.',
    features: [
      'شعار احترافي (الرئيسي والثانوي)',
      'كتيب الهوية البصرية (Brand Guidelines PDF)',
      '3 بوستات تعريفية للسوشيال ميديا',
      '8-10 أغلفة هايلايت انستغرام',
      'استشارات ومتابعة مجانية لتطبيق الهوية',
    ],
    bonuses: [
      'موكب احترافي مجاني',
      'صور البروفايل لجميع المنصات',
    ],
    revisions: 'مرنة',
    deliveryDays: '14-21 يوم',
  },
  socialMedia: {
    individualPosts: [
      { quantity: 1,  price: 15000,  category: 'social_posts' as const },
      { quantity: 3,  price: 42000,  savings: 3000,  category: 'social_posts' as const },
      { quantity: 6,  price: 78000,  savings: 12000, category: 'social_posts' as const },
      { quantity: 12, price: 144000, savings: 36000, category: 'social_posts' as const },
    ],
    monthlyPlans: [
      {
        id: 'presence',
        name: 'حضور',
        nameEn: 'PRESENCE',
        price: 100000,
        category: 'social_plans' as const,
        benefit: 'تواجد يومي منظم دون انقطاع.',
        postsPerMonth: 8,
        storiesPerMonth: 0,
        extras: ['8 تصاميم احترافية (بوستين أسبوعياً)', 'تنسيق شكل الحساب العام'],
      },
      {
        id: 'growth',
        name: 'نمو',
        nameEn: 'GROWTH',
        price: 180000,
        category: 'social_plans' as const,
        benefit: 'زيادة التفاعل والمبيعات بضخ محتوى بصري جذاب.',
        postsPerMonth: 15,
        storiesPerMonth: 3,
        extras: ['15 تصميم احترافي', '3 ستوريات مجانية', 'جدولة النشر المنتظم'],
        isPopular: true,
      },
      {
        id: 'domination',
        name: 'الهيمنة',
        nameEn: 'DOMINATION',
        price: 320000,
        category: 'social_plans' as const,
        benefit: 'الظهور بمظهر الشركات الكبرى وسيطرة على السوق.',
        postsPerMonth: 26,
        storiesPerMonth: 6,
        extras: ['26 تصميم عالي الجودة', '6 ستوريات تفاعلية', 'تحديث الهايلايت', 'أولوية التنفيذ والرد'],
      },
    ],
  },
  terms: [
    { icon: '💳', text: 'نظام الدفع: يتم دفع 50% من قيمة المشروع كعربون قبل البدء، والباقي عند التسليم النهائي.' },
    { icon: '🔄', text: 'سياسة التعديلات: يحق للعميل 3 جولات من التعديلات المجانية (ما لم يُنص على خلاف ذلك في الباقة).' },
    { icon: '🚫', text: 'سياسة الإلغاء: العربون غير مسترد في حال قرر العميل إلغاء المشروع بعد بدء العمل.' },
    { icon: '📁', text: 'الملفات المستلمة: يتم تسليم الأعمال بالصيغ الاحترافية (AI, PDF, PNG, JPEG) حسب طبيعة الباقة المحددة.' },
  ],
};
