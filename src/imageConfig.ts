import identity1 from './imagesOfMyWorks/MyiVsualIdentity/1.jpg';
import identity2 from './imagesOfMyWorks/MyiVsualIdentity/2.jpg';
import identity3 from './imagesOfMyWorks/MyiVsualIdentity/3.jpg';
import identity4 from './imagesOfMyWorks/MyiVsualIdentity/4.jpg';
import identity5 from './imagesOfMyWorks/MyiVsualIdentity/5.jpg';
import identity6 from './imagesOfMyWorks/MyiVsualIdentity/6.jpg';
import identity7 from './imagesOfMyWorks/MyiVsualIdentity/7.jpg';
import identity8 from './imagesOfMyWorks/MyiVsualIdentity/8.jpg';
import identity9 from './imagesOfMyWorks/MyiVsualIdentity/9.jpg';

import lian1 from './imagesOfMyWorks/Lian/Artboard 1@300x-100.jpg';
import lian2 from './imagesOfMyWorks/Lian/Artboard 2@300x-100.jpg';
import lian3 from './imagesOfMyWorks/Lian/Artboard 3@300x-100.jpg';
import lian4 from './imagesOfMyWorks/Lian/Artboard 4@300x-100.jpg';
import lian5 from './imagesOfMyWorks/Lian/Artboard 5@300x-100.jpg';
import lian6 from './imagesOfMyWorks/Lian/Artboard 6@300x-100.jpg';
import lian7 from './imagesOfMyWorks/Lian/Artboard 7@300x-100.jpg';
import lian8 from './imagesOfMyWorks/Lian/Artboard 8@300x-100.jpg';
import lian9 from './imagesOfMyWorks/Lian/Artboard 9@300x-100.jpg';

import eng1 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 1-20.jpg';
import eng2 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 2-20.jpg';
import eng3 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 3-20.jpg';
import eng4 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 4-20.jpg';
import eng5 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 5-20.jpg';
import eng6 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 6-20.jpg';
import eng7 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 7-20.jpg';
import eng8 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 8-20.jpg';
import eng9 from './imagesOfMyWorks/EngineeringInnovationOffice/Artboard 9-20.jpg';

import draw1 from './imagesOfMyWorks/MyDrawings/2022-05-16_1652714565283.png';
import draw2 from './imagesOfMyWorks/MyDrawings/20251202_223916.jpg';
import draw3 from './imagesOfMyWorks/MyDrawings/٢٠٢١٠٢٢٤_١٤٤٧٠٢.jpg';
import draw4 from './imagesOfMyWorks/MyDrawings/٢٠٢١٠٣٠١_١٧٢٤١٠.jpg';
import draw5 from './imagesOfMyWorks/MyDrawings/٢٠٢٢٠٢١٣_٠٨٣٨١٩.jpg';
import draw6 from './imagesOfMyWorks/MyDrawings/٢٠٢٣٠٨٢٨_١٥٣٢٠٤.jpg';

// ... (Metadata comments)

// ============================================
// صور الهوية البصرية (Brand Assets)
// ============================================

export const BRAND_LOGOS = {
    main: "/Images/logo.png",
    white: "/Images/logoWhite.png",
    black: "/Images/logoS1.png",
    frame: "/Images/logoFrame.png",
};

export const PROFILE_IMAGE = "/Images/mustafaAlMussawi.jpg";

// Load logo examples dynamically from folders
// @ts-ignore
const logoFiles = import.meta.glob('./assets/logos/**/*.{png,jpg,jpeg,svg,webp}', { eager: true, as: 'url' });

const getImagesForType = (folderName: string) => {
    const images = Object.keys(logoFiles)
        .filter(path => path.includes(`/logos/${folderName}/`))
        .map(path => logoFiles[path]);

    // If no images found, return empty array (UI will handle this)
    return images.length > 0 ? images : [];
};

export const LOGO_EXAMPLES_BY_TYPE = {
    text: getImagesForType('TextLogo'),
    symbolic: getImagesForType('SymbolicLogo'),
    innovative: getImagesForType('InnovativeLogo'),
    double: getImagesForType('DoubleLogo'),
    arabic: getImagesForType('Arabic Logo'),
    lettermark: getImagesForType('Lettermark'),
    emblem: getImagesForType('Emblem'),
    mascot: getImagesForType('Mascot'),
    threeD: getImagesForType('3D'),
};

// Keep the old one for backward compatibility or default images if needed
export const LOGO_TYPE_EXAMPLES = {
    text: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Coca-Cola_logo.svg/320px-Coca-Cola_logo.svg.png",
    symbolic: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/320px-Logo_NIKE.svg.png",
    innovative: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Louis_Vuitton_logo_and_wordmark.svg/320px-Louis_Vuitton_logo_and_wordmark.svg.png",
    double: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Adobe_Corporate_logo.svg/320px-Adobe_Corporate_logo.svg.png",
    arabic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Arabic_Calligraphy.svg/320px-Arabic_Calligraphy.svg.png",
    lettermark: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IBM_logo.svg/320px-IBM_logo.svg.png",
    emblem: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/320px-Starbucks_Corporation_Logo_2011.svg.png",
    mascot: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/KFC_logo.svg/320px-KFC_logo.svg.png",
    threeD: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/PlayStation_3_logo.svg/320px-PlayStation_3_logo.svg.png",
};

// ============================================
// صور محفظة الأعمال (Portfolio Images)
// ============================================

// مشروع 1: هويتي البصرية (عوضاً عن غديري)
export const PROJECT_GHADIRI = {
    thumbnail: identity1,
    heroImage: identity2,
    gallery: [
        identity1, identity2, identity3, identity4, identity5, identity6, identity7, identity8, identity9
    ]
};

// مشروع 2: ليان
export const PROJECT_LAYAN = {
    thumbnail: lian1,
    heroImage: lian2,
    gallery: [
        lian1, lian2, lian3, lian4, lian5, lian6, lian7, lian8, lian9
    ]
};

// مشروع 3: مكتب الابتكار الهندسي
export const PROJECT_ENGINEERING = {
    thumbnail: eng1,
    heroImage: eng2,
    gallery: [
        eng1, eng2, eng3, eng4, eng5, eng6, eng7, eng8, eng9
    ]
};

// مشروع 4: باكيتك (كما هو)
export const PROJECT_DRAWINGS = {
    thumbnail: draw6,
    heroImage: draw1,
    gallery: [
        draw1, draw2, draw3, draw4, draw5, draw6
    ]
};

/**
 * ملاحظات مهمة لإدارة الصور:
 * 
 * 1. أحجام الصور الموصى بها:
 *    - Thumbnail: 1600x900 بكسل
 *    - Hero Image: 2400x1350 بكسل
 *    - Gallery: 1200x800 بكسل
 * 
 * 2. صيغ الملفات المدعومة:
 *    - JPG/JPEG (للصور الفوتوغرافية)
 *    - PNG (للصور ذات الخلفية الشفافة)
 *    - SVG (للشعارات والرسومات)
 * 
 * 3. لتحسين الأداء:
 *    - قلل حجم الصور قبل رفعها
 *    - استخدم أدوات ضغط مثل TinyPNG
 *    - تأكد من ألا يتجاوز حجم الصورة الواحدة 500KB
 */
