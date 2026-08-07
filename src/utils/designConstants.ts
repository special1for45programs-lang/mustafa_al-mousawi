import imgMinimalist from '../assets/images/styles/minimalist.jpg';
import imgModern from '../assets/images/styles/modern.jpg';
import imgLuxury from '../assets/images/styles/luxury.jpg';
import imgBold from '../assets/images/styles/bold.jpg';
import imgClassic from '../assets/images/styles/classic.jpg';
import imgAbstract from '../assets/images/styles/abstract.jpg';
import imgFuturistic from '../assets/images/styles/futuristic.jpg';
import imgOrganic from '../assets/images/styles/organic.jpg';
import img3d from '../assets/images/styles/3d.jpg';

export interface IndustryPalette {
    id: string;
    label: string;
    desc: string;
    tags: string[];
    colors: string[];
    pinterestQuery: string;
}

export const INDUSTRY_PALETTES: IndustryPalette[] = [
    { 
        id: 'food', 
        label: 'طهي ومطاعم', 
        desc: 'ألوان دافئة تفتح الشهية وتعطي إحساساً بالراحة والترحيب.',
        tags: ['طباخ', 'مطعم', 'أكل', 'طعام', 'كافيه', 'شيف'],
        colors: ['#2A1B18', '#5C3D2E', '#B85042', '#E7BB41', '#F4F1DE'],
        pinterestQuery: 'restaurant food branding color palette'
    },
    { 
        id: 'luxury', 
        label: 'عطور وفخامة', 
        desc: 'درجات الداكن مع الذهبي والبيج لتعكس الرقي والحصرية.',
        tags: ['عطور', 'بخور', 'فخامة', 'ملكي', 'ذهب', 'تجميل'],
        colors: ['#0A0A0A', '#1A1A1A', '#4A4A4A', '#D4AF37', '#F9F6F0'],
        pinterestQuery: 'luxury perfume branding color palette'
    },
    {
        id: 'realestate',
        label: 'عقارات وبناء',
        desc: 'درجات الكحلي والرمادي الدافئ لتعكس الثقة والاستقرار.',
        tags: ['عقارات', 'مقاولات', 'هندسة', 'بناء', 'مجمع'],
        colors: ['#1E293B', '#334155', '#475569', '#94A3B8', '#F1F5F9'],
        pinterestQuery: 'real estate construction branding color palette'
    },
    {
        id: 'sports',
        label: 'رياضة ولياقة',
        desc: 'ألوان حيوية كالأحمر والبرتقالي والأسود تعكس الطاقة والقوة.',
        tags: ['رياضة', 'جيم', 'لياقة', 'تدريب', 'طاقة'],
        colors: ['#000000', '#1F2937', '#DC2626', '#EA580C', '#F97316'],
        pinterestQuery: 'fitness gym branding color palette'
    },
    {
        id: 'kids',
        label: 'أطفال وألعاب',
        desc: 'ألوان باستيل مبهجة ولطيفة تجذب الانتباه وتعكس المرح.',
        tags: ['أطفال', 'ألعاب', 'روضة', 'تعليم', 'حضانة'],
        colors: ['#FF9AA2', '#FFB7B2', '#FFDAC1', '#E2F0CB', '#B5EAD7'],
        pinterestQuery: 'kids toys branding color palette'
    },
    {
        id: 'law',
        label: 'قانون ومحاماة',
        desc: 'درجات الزيتي، الكحلي، والبني الكلاسيكي لتعكس الرزانة والعدل.',
        tags: ['قانون', 'محاماة', 'استشارات', 'عدل'],
        colors: ['#1C2A39', '#2E4053', '#194A3E', '#8C6B4A', '#D4C4B7'],
        pinterestQuery: 'law firm corporate branding color palette'
    },
    { 
        id: 'medical', 
        label: 'صحة وطبي', 
        desc: 'يوحي بالنقاء والسلامة والرعاية الموثوقة بألوان السماوي.',
        tags: ['طب', 'صيدلية', 'عيادة', 'صحة', 'علاج'],
        colors: ['#0B3B60', '#145EA8', '#29A0B1', '#98D7C2', '#F1F9F9'],
        pinterestQuery: 'medical healthcare branding color palette'
    },
    { 
        id: 'tech', 
        label: 'تقنية وتطبيقات', 
        desc: 'ألوان أزرق سيان وبنفسجي وداكن تعكس الابتكار والمستقبل.',
        tags: ['برمجيات', 'تقنية', 'ذكاء اصطناعي', 'تطبيق'],
        colors: ['#0F172A', '#1E293B', '#3B82F6', '#0EA5E9', '#8B5CF6'],
        pinterestQuery: 'tech app UI branding color palette'
    },
    {
        id: 'fashion',
        label: 'أزياء وتجميل',
        desc: 'درجات ناعمة من الوردي والبيج لتبرز الأناقة والجمال.',
        tags: ['أزياء', 'تجميل', 'ميك اب', 'ملابس', 'موضة'],
        colors: ['#4A3B42', '#8B5A6A', '#C78C9E', '#E6C5D0', '#F7EBE8'],
        pinterestQuery: 'fashion beauty branding color palette'
    },
    {
        id: 'cars',
        label: 'سيارات ومحركات',
        desc: 'ألوان صلبة كالفضي المعدني، الكحلي، والأحمر لتعكس السرعة.',
        tags: ['سيارات', 'محركات', 'معرض', 'غسيل', 'سرعة'],
        colors: ['#111111', '#2C3E50', '#7F8C8D', '#BDC3C7', '#E74C3C'],
        pinterestQuery: 'automotive car branding color palette'
    },
    {
        id: 'cafe',
        label: 'مقاهي ومخابز',
        desc: 'درجات البن المكسرات تعطي شعوراً بالدفء ورائحة القهوة.',
        tags: ['مقهى', 'قهوة', 'مخبز', 'حلى', 'كوفي'],
        colors: ['#3E2723', '#4E342E', '#6D4C41', '#8D6E63', '#D7CCC8'],
        pinterestQuery: 'bakery coffee shop branding color palette'
    },
    {
        id: 'education',
        label: 'تعليم وتدريب',
        desc: 'أزرق وأصفر فاتح لتحفيز التركيز، الذكاء، والانفتاح.',
        tags: ['تعليم', 'معهد', 'تدريب', 'مدرسة', 'جامعة'],
        colors: ['#1A237E', '#283593', '#3949AB', '#FFCA28', '#FFF8E1'],
        pinterestQuery: 'education academy branding color palette'
    }
];

export const DESIGN_STYLES = [
  { 
    id: 'minimal', 
    name: 'مينيمال (Minimal)', 
    desc: 'بسيط، نظيف، يركز على المساحات السلبية.', 
    img: imgMinimalist, 
    gradient: 'from-slate-900 via-gray-900 to-zinc-950',
    pinterestQuery: 'minimalist social media post design layout' 
  },
  { 
    id: 'modern', 
    name: 'مودرن (Modern)', 
    desc: 'عصري، خطوط واضحة، ألوان متناسقة.', 
    img: imgModern, 
    gradient: 'from-blue-950 via-slate-900 to-zinc-950',
    pinterestQuery: 'modern instagram post design layout' 
  },
  { 
    id: 'luxury', 
    name: 'فاخر (Luxury)', 
    desc: 'أنيق، ألوان ذهبية وداكنة، راقي.', 
    img: imgLuxury, 
    gradient: 'from-amber-950 via-zinc-900 to-black',
    pinterestQuery: 'luxury branding social media post design' 
  },
  { 
    id: 'bold', 
    name: 'جريء (Bold)', 
    desc: 'تباين عالي، ألوان فاقعة، ملفت للنظر.', 
    img: imgBold, 
    gradient: 'from-rose-950 via-purple-950 to-zinc-950',
    pinterestQuery: 'bold typography social media poster design' 
  },
  { 
    id: 'classic', 
    name: 'كلاسيكي (Classic)', 
    desc: 'تقليدي، موثوق، ألوان هادئة ودافئة.', 
    img: imgClassic, 
    gradient: 'from-amber-950/80 via-stone-900 to-zinc-950',
    pinterestQuery: 'classic vintage social media post design' 
  },
  { 
    id: 'abstract', 
    name: 'تجريدي (Abstract)', 
    desc: 'أشكال هندسية متداخلة، إبداعي وغير تقليدي.', 
    img: imgAbstract, 
    gradient: 'from-indigo-950 via-slate-900 to-zinc-950',
    pinterestQuery: 'abstract graphic design social media post' 
  },
  { 
    id: 'futuristic', 
    name: 'مستقبلي (Futuristic)', 
    desc: 'ألوان نيون داكنة، تأثيرات تكنولوجية.', 
    img: imgFuturistic, 
    gradient: 'from-cyan-950 via-fuchsia-950 to-zinc-950',
    pinterestQuery: 'futuristic neon social media poster design' 
  },
  { 
    id: 'natural', 
    name: 'طبيعي (Natural)', 
    desc: 'ألوان ترابية، عضوي ومريح للعين.', 
    img: imgOrganic, 
    gradient: 'from-emerald-950 via-stone-900 to-zinc-950',
    pinterestQuery: 'organic natural earthy social media design' 
  },
  { 
    id: '3d', 
    name: 'ثلاثي الأبعاد (3D)', 
    desc: 'عناصر بارزة ومجسمة، حيوي وعميق.', 
    img: img3d, 
    gradient: 'from-violet-950 via-blue-950 to-zinc-950',
    pinterestQuery: '3d graphic design social media post banner' 
  },
];
