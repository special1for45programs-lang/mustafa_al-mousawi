
// ==========================================
// تصنيف نوع الطلب
// ==========================================
export type BriefCategory = 'logo' | 'branding' | 'social_posts' | 'social_plans';

export interface PostItem {
  category: string;
  customCategory?: string;
  headline: string;
  concept: string;
}

// ==========================================
// بيانات مسار السوشيال ميديا
// ==========================================
export interface SocialDetails {
  favoriteColors: string;
  inspirationImage: string;
  inspirationImages: string[];       // صور النمط المسبق (متعددة حتى 10)
  designStyle: string;
  platforms: string[];
  businessType: string;
  productsServices: string;
  visualStyle: 'modern' | 'formal' | 'luxury' | 'bold' | '';
  additionalNotes: string;
  currentAccountsLinks?: string;
  contentMix?: string[];
  assetsAvailability?: string;
  postsList?: PostItem[];
}

// ==========================================
// بيانات مسار الشعار والهوية
// ==========================================
export interface LogoDetails {
  favoriteColors: string;
  inspirationImage: string;
  designStyle: string;
  logoType: 'text' | 'symbolic' | 'innovative' | 'double' | 'arabic' | '';
  moodboard: string[];
  applications: Record<string, boolean>;
  otherApplication: string;
  paperSizes: {
    dl: boolean;
    a5: boolean;
    a4: boolean;
    a3: boolean;
  };
  startDate: string;
  deadline: string;
  notes: string;
}

// ==========================================
// البيانات الأساسية المشتركة
// ==========================================
export interface BaseBriefData {
  clientStatus: 'new' | 'current';
  date: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;

  projectName: string;
  projectDescription: string;
  projectType: string;

  logoLanguage?: string;
  targetAge?: string;
  targetGender?: string;
  targetDescription?: string;
  competitors?: string;
  postsLanguage?: string;

  briefCategory?: BriefCategory;
  selectedPackageName?: string;
  selectedPackagePrice?: number;
}

// ==========================================
// الهيكل الجامع للاستمارة
// ==========================================
export interface BriefFormData extends BaseBriefData {
  briefType: 'logo' | 'social' | '';
  logoDetails: LogoDetails;
  socialDetails: SocialDetails;
  designStyleName?: string;
  logoTypeImageBase64?: string[]; // Fixed type from string to string[]
  logoTypeImagesBase64?: string[]; // Added this to match usage in BriefRequests.tsx
  logoTypeName?: string;
  logoTypeDesc?: string;
  telegramFileIds?: string[];
  customTerms?: PackageTerm[];
}

export function isSocialRequest(req: BriefFormData): boolean {
  return req.briefType === 'social' || req.briefCategory === 'social_posts' || req.briefCategory === 'social_plans';
}

export function isLogoRequest(req: BriefFormData): boolean {
  return req.briefType === 'logo' || req.briefCategory === 'logo' || req.briefCategory === 'branding';
}

// تعريف عنصر التنقل في القائمة العلوية
export interface NavItem {
  label: string; // النص الظاهر
  path: string; // الرابط (ID القسم)
}

// ==========================================
// أنواع بيانات الباقات والأسعار
// ==========================================

export interface LogoPackage {
  id: string;
  name: string;           // الاسم العربي (مثل: الاقتصادية)
  nameEn: string;         // الاسم الإنجليزي (مثل: LITE)
  price: number;          // السعر بالدينار العراقي
  category: 'logo';       // تصنيف صريح
  target: string;         // الفئة المستهدفة
  benefit: string;        // الفائدة (تكتب باللون الأخضر)
  badge?: string;         // شارة اختيارية (مثل: الأكثر طلباً)
  isPopular?: boolean;    // هل هي الأكثر طلباً؟
  isFeatured?: boolean;   // هل هي المميزة/الأغلى؟
  features: string[];     // قائمة المخرجات (المحتوى)
  deliveries: string[];   // صيغ الملفات المسلّمة (PNG, SVG...)
  revisions: number | string; // عدد التعديلات
  deliveryDays: string;   // مدة التسليم
}

export interface BrandingPackage {
  name: string;
  category: 'branding';   // تصنيف صريح
  originalPrice: number;  // السعر القديم (مشطوب)
  currentPrice: number;   // السعر الحالي
  savings: number;        // قيمة التوفير
  target?: string;        // الفئة المستهدفة (اختياري)
  benefit: string;        // الفائدة الأساسية
  features: string[];     // قائمة الميزات المشمولة
  bonuses: string[];      // الهدايا المجانية
  revisions: number | string;
  deliveryDays: string;
}

export interface SocialPost {
  quantity: number;       // عدد البوستات
  price: number;          // السعر بالدينار
  savings?: number;       // قيمة التوفير مقارنة بالسعر الفردي
  category: 'social_posts'; // تصنيف صريح
}

export interface SocialPlan {
  id: string;
  name: string;           // الاسم العربي (مثل: حضور)
  nameEn: string;         // الاسم الإنجليزي
  price: number;          // السعر الشهري بالدينار
  category: 'social_plans'; // تصنيف صريح
  benefit: string;        // הפائدة
  postsPerMonth: number;
  storiesPerMonth: number;
  extras: string[];       // مميزات إضافية (تنسيق الحساب، جدولة النشر، إلخ)
  isPopular?: boolean;
}

export interface PackageTerm {
  icon: string; // Emoji character
  text: string;
}

export interface PackagesData {
  logoDesign: LogoPackage[];
  branding: BrandingPackage;
  socialMedia: {
    individualPosts: SocialPost[];
    monthlyPlans: SocialPlan[];
  };
  terms: PackageTerm[];
  dynamicTerms?: Record<string, PackageTerm[]>;
}

// ==========================================
// أنواع بيانات لوحة التحكم
// ==========================================

export interface BriefRequestRecord extends BriefFormData {
  id: string;
  submittedAt: string | { toMillis: () => number; toDate: () => Date };
  status: 'new' | 'in_progress' | 'completed' | 'archived';
  telegramFileIds?: string[];
}

export interface ClientReview {
  id?: string;
  clientName?: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string | { toMillis: () => number; toDate: () => Date };
}
