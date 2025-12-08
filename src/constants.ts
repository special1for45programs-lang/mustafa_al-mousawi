import { Project, NavItem } from './types';
import { Type, Layers, Globe, PenTool, LayoutGrid } from 'lucide-react';
// استيراد إعدادات الصور من ملف مركزي - لتسهيل إدارة جميع الصور في مكان واحد
import { BRAND_LOGOS, PROFILE_IMAGE, PROJECT_GHADIRI, PROJECT_LAYAN, PROJECT_ENGINEERING, PROJECT_DRAWINGS, LOGO_EXAMPLES_BY_TYPE } from './imageConfig';

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
    instagram: "https://www.instagram.com/mustafa.al_moussawi?igsh=cmRsdWY5Z2Y5YzQ1",
    instagramHandle: "@mustafa.al_moussawi",
    telegram: "https://t.me/mustafa_al_moussawi",
    telegramHandle: "@mustafa_al_moussawi",
    email: "mustafahaidar0955@gmail.com"
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

/**
 * بيانات المشاريع المعروضة في قسم الأعمال
 * 
 * لتغيير صور المشاريع، قم بتعديل ملف src/imageConfig.ts
 * حيث يمكنك استبدال الروابط بصور مشاريعك الخاصة
 */
export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'هويتي البصرية',
    category: 'هوية شخصية',
    thumbnail: PROJECT_GHADIRI.thumbnail,
    heroImage: PROJECT_GHADIRI.heroImage,
    gallery: PROJECT_GHADIRI.gallery,
    challenge: 'بناء هوية بصرية شخصية تعكس أسلوبي كمصمم جرافيك، وتجمع بين الاحترافية والإبداع، لتكون واجهة قوية لأعمالي.',
    solution: 'تصميم يعتمد على التباين العالي بين اللون الأسود (الفخامة) واللون الليموني (الطاقة والإبداع)، مع التركيز على الخطوط العصرية والعناصر البصرية الديناميكية التي تعكس التفكير خارج الصندوق.',
    deliverables: ['الشعار الشخصي', 'دليل الهوية البصرية', 'تصاميم التواصل الاجتماعي', 'المطبوعات الشخصية']
  },
  {
    id: '2',
    title: 'ليان',
    category: 'تصميم شعار',
    thumbnail: PROJECT_LAYAN.thumbnail,
    heroImage: PROJECT_LAYAN.heroImage,
    gallery: PROJECT_LAYAN.gallery,
    challenge: 'تصميم شعار لعلامة تجارية أنثوية وناعمة، ربما تختص بالمجوهرات أو الأزياء.',
    solution: 'استخدام خط حر انسيابي باللون البرتقالي الدافئ مع عناصر زخرفية ناعمة توحي بالأنوثة والجمال.',
    deliverables: ['الشعار', 'كيس التسوق', 'بطاقات العمل']
  },
  {
    id: '3',
    title: 'مكتب الابتكار الهندسي',
    category: 'هوية شركات',
    thumbnail: PROJECT_ENGINEERING.thumbnail,
    heroImage: PROJECT_ENGINEERING.heroImage,
    gallery: PROJECT_ENGINEERING.gallery,
    challenge: 'بناء هوية قوية لمكتب هندسي تعكس الدقة، الحداثة، والاحترافية.',
    solution: 'دمج الحروف A و B في شكل هندسي ثلاثي الأبعاد باللون الأزرق الداكن ليعكس الثقة والاستقرار الهندسي.',
    deliverables: ['الشعار', 'الواجهة الخارجية', 'القرطاسية']
  },
  {
    id: '4',
    title: 'رسوماتي',
    category: 'رسم رقمي وتقليدي',
    thumbnail: PROJECT_DRAWINGS.thumbnail,
    heroImage: PROJECT_DRAWINGS.heroImage,
    gallery: PROJECT_DRAWINGS.gallery,
    challenge: 'التعبير عن الأفكار والمشاعر من خلال الرسم الرقمي والتقليدي، وإظهار المهارات الفنية في التكوين والتشريح.',
    solution: 'مجموعة مختارة من الرسومات التي تبرز التنوع في الأسلوب والتقنيات المستخدمة، من الاسكتشات السريعة إلى اللوحات الرقمية المكتملة.',
    deliverables: ['لوحات رقمية', 'سكتشات', 'دراسات فنية']
  }
];

// قائمة التطبيقات الموسعة
export const APPLICATION_OPTIONS = [
  { key: 'businessCard', label: 'الكروت الشخصية (Business Cards)' },
  { key: 'letterHead', label: 'ورق المراسلات (Letterhead)' },
  { key: 'envelope', label: 'الظرف (Envelope)' },
  { key: 'folder', label: 'ملف الأوراق (Folder)' },
  { key: 'socialMedia', label: 'قوالب السوشيال ميديا (Social Media Kit)' },
  { key: 'profilePic', label: 'صور البروفايل (Profile Pictures)' },
  { key: 'packaging', label: 'علب وتغليف (Packaging)' },
  { key: 'bag', label: 'أكياس التسوق (Shopping Bag)' },
  { key: 'signage', label: 'لافتات خارجية (Signage/Billboard)' },
  { key: 'uniform', label: 'زي الموظفين (Uniforms/T-shirts)' },
  { key: 'stamp', label: 'ختم (Stamp/Seal)' },
  { key: 'sticker', label: 'ملصقات (Stickers)' },
  { key: 'website', label: 'واجهة موقع إلكتروني (Website UI)' },
  { key: 'vehicle', label: 'تغليف سيارات (Vehicle Wrap)' },
  { key: 'menu', label: 'قائمة طعام (Menu)' },
];

export const LOGO_TYPE_EXAMPLES = [
  { id: 'text', label: 'شعار نصي', labelEn: 'TEXT LOGO', sub: 'TEXT LOGO', icon: Type, desc: 'يعتمد على الخط والتايبوغرافي', images: LOGO_EXAMPLES_BY_TYPE.text },
  { id: 'symbolic', label: 'شعار رمزي', labelEn: 'SYMBOLIC LOGO', sub: 'SYMBOLIC LOGO', icon: Layers, desc: 'يعتمد على أيقونة أو رمز', images: LOGO_EXAMPLES_BY_TYPE.symbolic },
  { id: 'innovative', label: 'شعار مبتكر', labelEn: 'INNOVATIVE LOGO', sub: 'INNOVATIVE LOGO', icon: PenTool, desc: 'فكرة خارج الصندوق', images: LOGO_EXAMPLES_BY_TYPE.innovative },
  { id: 'double', label: 'شعار مزدوج', labelEn: 'DOUBLE LOGO', sub: 'DOUBLE LOGO', icon: LayoutGrid, desc: 'يجمع بين الرمز والنص', images: LOGO_EXAMPLES_BY_TYPE.double },
  { id: 'arabic', label: 'شعار بالخط العربي', labelEn: 'ARABIC LOGO', sub: 'ARABIC LOGO', icon: Globe, desc: 'كاليغرافي أو خط حر', images: LOGO_EXAMPLES_BY_TYPE.arabic },
];
