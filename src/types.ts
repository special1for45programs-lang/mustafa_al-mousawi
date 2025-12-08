
// تعريف هيكل بيانات المشروع في معرض الأعمال
export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string; // الصورة المصغرة للمعرض
  heroImage: string; // الصورة الكبيرة داخل التفاصيل
  gallery: string[]; // صور إضافية للمشروع
  challenge: string; // وصف التحدي
  solution: string; // وصف الحل المقترح
  deliverables: string[]; // قائمة المخرجات المسلمة للعميل
}

// تعريف هيكل بيانات استمارة بدء المشروع (Brief Form)
export interface BriefFormData {
  // الصفحة 2: معلومات العميل والمشروع
  clientStatus: 'new' | 'current'; // حالة العميل (جديد أم سابق)
  date: string;
  clientName: string; // أساسي
  companyName: string; // أساسي
  phone: string;
  email: string;

  projectName: string; // أساسي
  projectDescription: string; // أساسي
  projectType: string;
  favoriteColors: string;

  // الصفحة 3: تفضيلات الشعار
  logoType: 'text' | 'symbolic' | 'innovative' | 'double' | 'arabic';
  moodboard: string[]; // الصور المرفقة كـ Base64 strings (max 5)

  // الصفحة 4: التطبيقات والجدول الزمني
  // تم تحويلها إلى سجل مرن لاستيعاب القائمة الموسعة
  applications: Record<string, boolean>;
  otherApplication: string; // حقل نصي للتطبيقات الإضافية

  paperSizes: {
    dl: boolean;
    a5: boolean;
    a4: boolean;
    a3: boolean;
  };
  startDate: string;
  deadline: string;
  budget: '20-50' | '50-100' | '100-150' | '150-200' | '200-500';
  notes: string;
}

// تعريف عنصر التنقل في القائمة العلوية
export interface NavItem {
  label: string; // النص الظاهر
  path: string; // الرابط (ID القسم)
}
