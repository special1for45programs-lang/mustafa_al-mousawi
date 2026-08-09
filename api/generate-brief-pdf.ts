import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Telegram Config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Type for social media form data
export interface SocialDetails {
  favoriteColors: string;
  designStyle: string;
  postsPatternImages: string[];
  platforms: string[];
  businessType: string;
  productsServices: string;
  postIdeas: string;
  visualStyle: 'modern' | 'formal' | 'luxury' | 'bold' | '';
  additionalNotes: string;
}

export interface LogoDetails {
  favoriteColors: string;
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

// Type for form data
interface BriefFormData {
  clientStatus: 'new' | 'current';
  date: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  projectName: string;
  projectDescription: string;
  projectType: string;

  briefType: 'logo' | 'social' | '';
  logoDetails: LogoDetails;
  socialDetails: SocialDetails;

  // Dynamic multi-category fields
  briefCategory?: 'logo' | 'branding' | 'social_posts' | 'social_plans';
  selectedPackageName?: string;
  selectedPackagePrice?: number;
}

// Application labels mapping
const APP_LABELS: Record<string, string> = {
  businessCard: 'الكروت الشخصية',
  letterHead: 'ورق الخطابات الرسمي',
  envelope: 'الظرف',
  folder: 'ملف الأوراق',
  stamp: 'الختم الرسمي',
  packaging: 'علب وتغليف المنتجات',
  bag: 'أكياس التسوق',
  sticker: 'ملصقات',
  productTags: 'ليبل وبطاقات المنتجات',
  thankYouCards: 'بطاقات الشكر والتقييم',
  menu: 'قائمة الطعام',
  cups: 'أكواب القهوة والمشروبات',
  napkins: 'مناديل ومفارش الطاولات',
  socialMedia: 'قوالب منشورات السوشيال ميديا',
  profilePic: 'صور الحسابات',
  website: 'واجهة الموقع الإلكتروني',
  emailSignature: 'توقيع البريد الإلكتروني',
  powerpoint: 'قوالب عروض PowerPoint',
  companyProfile: 'بروفايل الشركة التعريفى (PDF)',
  signage: 'لوحة المحل واللافتات الخارجية',
  vehicle: 'تصميم وتغليف سيارات الشركة',
  uniform: 'زي الموظفين',
  rollups: 'رول أب وستاندات المعارض'
};

// ==========================================
// Build dynamic Telegram caption based on brief type
// ==========================================
function buildTelegramCaption(formData: BriefFormData): string {
  const isSocial = formData.briefType === 'social' || formData.briefCategory === 'social_posts' || formData.briefCategory === 'social_plans';

  const header = isSocial
    ? `📱 طلب سوشيال ميديا جديد!`
    : `🚀 مشروع جديد!`;

  const base = [
    header,
    ``,
    `👤 العميل: ${formData.clientName}`,
    `🏢 الشركة: ${formData.companyName}`,
    `📞 الهاتف: ${formData.phone || '—'}`,
    formData.email ? `📧 البريد: ${formData.email}` : '',
  ];

  if (formData.selectedPackageName) {
    base.push(`📦 الباقة: ${formData.selectedPackageName}`);
    if (formData.selectedPackagePrice) {
      base.push(`💰 السعر: ${formData.selectedPackagePrice.toLocaleString('en-US')} د.ع`);
    }
  }

  if (isSocial && formData.socialDetails) {
    const sd = formData.socialDetails;
    base.push(``);
    base.push(`📊 تفاصيل السوشيال:`);
    if (sd.platforms?.length) base.push(`📱 المنصات: ${sd.platforms.join(', ')}`);
    if (sd.productsServices)   base.push(`🛡️ النشاط: ${sd.productsServices.substring(0, 150)}`);
    if (sd.postIdeas)          base.push(`💡 أفكار: ${sd.postIdeas.substring(0, 200)}`);
    if (sd.visualStyle)        base.push(`🎨 الأسلوب: ${sd.visualStyle}`);
    if (sd.additionalNotes)    base.push(`📝 ملاحظات: ${sd.additionalNotes.substring(0, 150)}`);
  } else {
    // Logo / Branding path
    const logo = formData.logoDetails;
    if (formData.projectName)        base.push(`\n📋 المشروع: ${formData.projectName}`);
    if (formData.projectType)        base.push(`🏢 مجال العمل: ${formData.projectType}`);
    if (logo.deadline)           base.push(`⏰ موعد التسليم: ${logo.deadline}`);
  }

  return base.filter(Boolean).join('\n');
}

// Generate HTML template for PDF
function generatePdfHTML(formData: BriefFormData): string {
  const isSocial = formData.briefType === 'social' || formData.briefCategory === 'social_posts' || formData.briefCategory === 'social_plans';

  const logo = formData.logoDetails || {} as any;
  const sd = formData.socialDetails || {} as any;

  // Resolve inspiration images for social: prefer inspirationImages[], fall back to inspirationImage
  const socialInspirationImages: string[] =
    isSocial
      ? (sd.inspirationImages && sd.inspirationImages.length > 0
          ? sd.inspirationImages
          : sd.inspirationImage ? [sd.inspirationImage] : [])
      : [];

  const hasInspirationImages = isSocial
    ? socialInspirationImages.length > 0
    : (logo.favoriteColors === 'image_inspiration' && logo.inspirationImage);

  const selectedApps = Object.entries(logo.applications || {})
    .filter(([_, v]) => v)
    .map(([k, _]) => APP_LABELS[k] || k);

  if (logo.otherApplication) {
    selectedApps.push(logo.otherApplication);
  }

  const logoTypeLabels: Record<string, string> = {
    'text':       'شعار نصي',
    'symbolic':   'شعار رمزي',
    'innovative': 'شعار مبتكر',
    'double':     'شعار مزدوج',
    'arabic':     'شعار بالخط العربي',
  };

  const visualStyleLabels: Record<string, string> = {
    'modern': '✨ حديث ومودرن',
    'formal': '🏐️ رسمي ورصين',
    'luxury': '👑 فاخر ومريح',
    'bold':   '⚡ جريء وعالي التباين',
  };

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Cairo', sans-serif;
      background: #ffffff;
      color: #1a1a1a;
      font-size: 12px;
      line-height: 1.6;
      direction: rtl;
    }
    
    .page {
      width: 210mm;
      margin: 0 auto;
      background: white;
      display: flex;
      flex-direction: column;
    }
    
    /* Header */
    .header {
      width: 100%;
    }
    
    .header img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .header-text h1 {
      color: #ffffff;
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
    }
    
    .header-text p {
      color: rgba(255,255,255,0.8);
      font-size: 11px;
      letter-spacing: 1px;
    }
    
    /* Content */
    .content {
      flex: 1;
      padding: 30px 40px;
      background: #fdfdfd;
    }
    
    /* Section */
    .section {
      background: #ffffff;
      padding: 24px;
      border-radius: 40px;
      border: 1px solid #f3f4f6;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      margin-bottom: 24px;
    }
    
    .section:last-child {
      margin-bottom: 0;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f3f4f6;
    }
    
    .section-indicator {
      width: 6px;
      height: 32px;
      background: #d4ff00;
      border-radius: 9999px;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 400;
      color: #111827;
    }
    
    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 24px;
    }
    
    .grid-full {
      grid-column: span 2;
    }
    
    /* Field */
    .field {
      margin-bottom: 16px;
    }
    
    .field-label {
      font-size: 14px;
      font-weight: 700;
      color: #9ca3af;
      margin-bottom: 8px;
      display: block;
    }
    
    .field-value {
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
      min-height: 48px;
      display: flex;
      align-items: center;
    }
    
    .field-value.large {
      font-size: 18px;
    }
    
    .field-value.multiline {
      min-height: 80px;
      line-height: 1.8;
      align-items: flex-start;
      white-space: pre-wrap;
    }
    
    .field-value.budget {
      background: rgba(212, 255, 0, 0.15);
      border: 1px solid #d4ff00;
      justify-content: center;
      text-align: center;
    }
    
    .field-value.ltr {
      direction: ltr;
      justify-content: flex-end;
    }
    
    /* Tags */
    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 16px;
    }
    
    .tag {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      color: #374151;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .empty-tag {
      color: #9ca3af;
      font-style: italic;
      font-weight: 700;
      font-size: 14px;
      background: transparent;
      box-shadow: none;
      padding: 0;
      border: none;
    }
    
    /* Notes */
    .notes-box {
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 12px;
      padding: 16px;
      color: #78350f;
      font-weight: 600;
      line-height: 1.8;
    }
    
    /* Images Gallery */
    .images-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 16px;
      background: #f9fafb;
      border: 1px solid #f3f4f6;
      border-radius: 12px;
      padding: 16px;
    }
    
    .gallery-image {
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e5e7eb;
      background: white;
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    .gallery-image img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
    }
    
    /* Footer */
    .footer {
      background: #000000;
      padding: 20px 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      direction: ltr;
    }
    
    .instagram-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .instagram-icon svg {
      width: 20px;
      height: 20px;
      fill: #d4ff00;
    }
    
    .instagram-handle {
      color: #d4ff00;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Header -->
    <div class="header">
      <img src="https://mustafa-kappa.vercel.app/Images/pdf-header.png" alt="Header">
    </div>
    
    <!-- Content -->
    <div class="content">
      
      <!-- معلومات العميل -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">معلومات العميل</div>
        </div>
        <div class="grid">
          <div class="field">
            <div class="field-label">اسم العميل</div>
            <div class="field-value">${formData.clientName || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">اسم الشركة</div>
            <div class="field-value">${formData.companyName || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">رقم الهاتف</div>
            <div class="field-value ltr">${formData.phone || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">البريد الإلكتروني</div>
            <div class="field-value ltr">${formData.email || '-'}</div>
          </div>
        </div>
        ${formData.selectedPackageName ? `
        <div class="field" style="margin-top: 8px;">
          <div class="field-label">الباقة المختارة</div>
          <div class="field-value budget">${formData.selectedPackageName}${formData.selectedPackagePrice ? ` &mdash; ${formData.selectedPackagePrice.toLocaleString('en-US')} د.ع` : ''}</div>
        </div>
        ` : ''}
      </div>
      
      <!-- تفاصيل المشروع -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">تفاصيل المشروع</div>
        </div>
        <div class="field">
          <div class="field-label">اسم المشروع</div>
          <div class="field-value large">${formData.projectName || '-'}</div>
        </div>
        ${!isSocial ? `
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">نبذة عن المشروع</div>
          <div class="field-value multiline">${formData.projectDescription || 'لا يوجد وصف'}</div>
        </div>
        ` : ''}
        <div class="grid" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">المجال</div>
            <div class="field-value">${formData.projectType || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">الألوان المفضلة</div>
            <div class="field-value">
              ${(isSocial ? sd.favoriteColors : logo.favoriteColors) === 'image_inspiration' 
                ? 'صورة ملحقة (انظر قسم المراجع البصرية)' 
                : (isSocial ? sd.favoriteColors : logo.favoriteColors)?.includes('#') 
                  ? `<div class="tags" style="display: flex; gap: 8px;">
                       ${(isSocial ? sd.favoriteColors : logo.favoriteColors).split('، ').map((c: string) => `
                         <div style="display: flex; align-items: center; gap: 6px; background: #fff; padding: 4px 8px; border: 1px solid #eee; border-radius: 6px;">
                           <div style="width: 14px; height: 14px; border-radius: 50%; background-color: ${c}; border: 1px solid #ddd;"></div>
                           <span style="font-size: 11px;">${c}</span>
                         </div>
                       `).join('')}
                     </div>`
                  : (isSocial ? sd.favoriteColors || '-' : logo.favoriteColors || '-')}
            </div>
          </div>
        </div>
      </div>
      
      ${isSocial && sd ? `
      <!-- تفاصيل السوشيال ميديا -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">تفاصيل السوشيال ميديا</div>
        </div>
        <div class="field">
          <div class="field-label">المنصات المستهدفة</div>
          <div class="tags">
            ${sd.platforms?.map((p: string) => `<span class="tag">${p}</span>`).join('') || '<span class="empty-tag">-</span>'}
          </div>
        </div>
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">المنتجات / الخدمات</div>
          <div class="field-value multiline">${sd.productsServices || '-'}</div>
        </div>
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">أفكار البوستات</div>
          <div class="field-value multiline">${sd.postIdeas || '-'}</div>
        </div>
        <div class="grid" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">الأسلوب البصري للمنشورات</div>
            <div class="field-value">${visualStyleLabels[sd.visualStyle] || sd.visualStyle || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">نمط التصميم المختار</div>
            <div class="field-value">${(formData as any).designStyleName || sd.designStyle || '-'}</div>
          </div>
        </div>
        ${sd.additionalNotes ? `
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">ملاحظات إضافية للسوشيال</div>
          <div class="field-value multiline">${sd.additionalNotes}</div>
        </div>
        ` : ''}
      </div>
      ` : `
      <!-- المواصفات والجدول (تصميم شعار) -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">المواصفات والجدول</div>
        </div>
        <div class="grid">
          <div class="field">
            <div class="field-label">نوع الشعار</div>
            <div class="field-value">${logoTypeLabels[logo.logoType] || logo.logoType || '-'}</div>
          </div>
        </div>
        <div class="field" style="margin-top: 15px;">
          <div class="field-label">التطبيقات المطلوبة</div>
          <div class="tags">
            ${selectedApps.length > 0
      ? selectedApps.map((app: string) => `<span class="tag">${app}</span>`).join('')
      : '<span class="empty-tag">لم يتم اختيار تطبيقات</span>'
    }
          </div>
        </div>
        <div class="grid" style="margin-top: 15px;">
          <div class="field">
            <div class="field-label">تاريخ البدء</div>
            <div class="field-value">${logo.startDate || '-'}</div>
          </div>
          <div class="field">
            <div class="field-label">تاريخ التسليم</div>
            <div class="field-value">${logo.deadline || '-'}</div>
          </div>
        </div>
      </div>
      `}
      
      ${(formData as any).designStyleImageBase64 || ((formData as any).logoTypeImagesBase64 && (formData as any).logoTypeImagesBase64.length > 0) || (logo.moodboard && logo.moodboard.length > 0) || (sd.postsPatternImages && sd.postsPatternImages.length > 0) || (!isSocial && logo.designStyle) || hasInspirationImages ? `
      <!-- المراجع البصرية -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">المراجع البصرية والأنماط</div>
        </div>
        
        ${hasInspirationImages ? `
        <div class="field" style="margin-bottom: 20px;">
          <div class="field-label">${isSocial ? `صور النمط المسبق المرفوعة (${socialInspirationImages.length}):` : 'صورة الاستلهام اللوني:'}</div>
          <div class="images-gallery" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 10px;">
            ${isSocial
              ? socialInspirationImages.map((src: string, i: number) => `
                <div class="gallery-image" style="position: relative; background: #f9fafb; padding: 12px; border: 1px solid #eee; border-radius: 8px;">
                  <img src="${src}" alt="مرجع ${i + 1}" style="width:100%; height:auto; max-height: 400px; object-fit:contain; border-radius: 4px;">
                  ${i === 0 ? `<span style="position:absolute;top:8px;right:8px;background:#d4ff00;color:#000;font-size:10px;font-weight:700;padding:4px 8px;border-radius:999px;box-shadow: 0 2px 4px rgba(0,0,0,0.1);">رئيسية</span>` : ''}
                </div>`).join('')
              : `<div class="gallery-image"><img src="${logo.inspirationImage}" alt="Inspiration"></div>`}
          </div>
        </div>
        ` : ''}

        ${!isSocial && (formData as any).logoTypeImagesBase64 && (formData as any).logoTypeImagesBase64.length > 0 ? `
        <div class="field" style="margin-bottom: 20px;">
          <div class="field-label" style="display: flex; justify-content: space-between; align-items: center;">
            <span>نوع الشعار المختار: ${(formData as any).logoTypeName || logoTypeLabels[logo.logoType]}</span>
            ${(formData as any).logoTypeDesc ? `<span style="font-size: 11px; background: #f3f4f6; padding: 2px 8px; border-radius: 12px; font-weight: normal; color: #666;">${(formData as any).logoTypeDesc}</span>` : ''}
          </div>
          <div class="images-gallery" style="grid-template-columns: repeat(3, minmax(0, 1fr)); margin-top: 10px; gap: 10px;">
            ${(formData as any).logoTypeImagesBase64.map((img: string) => `
              <div class="gallery-image" style="padding: 10px; background: #fff; border: 1px solid #eee; aspect-ratio: 1; display: flex; align-items: center; justify-content: center;">
                <img src="${img}" alt="Logo Type" style="max-width: 100%; max-height: 100%; object-fit: contain;">
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        ${(!isSocial && logo.designStyle) || (formData as any).designStyleImageBase64 ? `
        <div class="field" style="margin-bottom: 20px;">
          <div class="field-label">النمط التصميمي المختار: ${(formData as any).designStyleName || (isSocial ? sd.designStyle : logo.designStyle)}</div>
          ${(formData as any).designStyleImageBase64 ? `
          <div class="images-gallery" style="grid-template-columns: 180px; margin-top: 10px;">
            <div class="gallery-image">
              <img src="${(formData as any).designStyleImageBase64}" alt="Design Style">
            </div>
          </div>
          ` : ''}
        </div>
        ` : ''}
      
        ${logo.moodboard && logo.moodboard.length > 0 ? `
        <div class="field">
          <div class="field-label">الصور المرفقة (${logo.moodboard.length})</div>
          <div class="images-gallery">
            ${logo.moodboard.map((img: string, index: number) => `
              <div class="gallery-image">
                <img src="${img}" alt="مرفق ${index + 1}">
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}

        ${sd.postsPatternImages && sd.postsPatternImages.length > 0 ? `
        <div class="field">
          <div class="field-label">أنماط المنشورات (${sd.postsPatternImages.length})</div>
          <div class="images-gallery">
            ${sd.postsPatternImages.map((img: string, index: number) => `
              <div class="gallery-image">
                <img src="${img}" alt="نمط ${index + 1}">
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
      </div>
      ` : ''}
      
      ${logo.notes ? `
      <!-- ملاحظات -->
      <div class="section">
        <div class="section-header">
          <div class="section-indicator"></div>
          <div class="section-title">ملاحظات إضافية</div>
        </div>
        <div class="notes-box">${logo.notes}</div>
      </div>
      ` : ''}
      
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <div class="instagram-icon">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </div>
      <span class="instagram-handle">@mustafa.al_mousawi</span>
    </div>
  </div>
</body>
</html>
`;
}

// Generate PDF using Puppeteer
async function generatePdfWithPuppeteer(html: string): Promise<Buffer> {
  console.log('[API] 🎨 Launching browser...');

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: { width: 794, height: 1200 }, // A4 width in pixels at 96 DPI
    executablePath: await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Set content
    await page.setContent(html, { waitUntil: 'networkidle0' });

    // Get the actual content height
    const contentHeight = await page.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    });

    console.log('[API] 📐 Content height:', contentHeight);

    // Generate PDF with dynamic height (single long page)
    console.log('[API] 📄 Generating PDF...');
    const pdfBuffer = await page.pdf({
      width: '210mm',  // A4 width
      height: `${contentHeight + 20}px`,  // Dynamic height based on content
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
    console.log('[API] ✅ Browser closed');
  }
}

// Send PDF to Telegram
async function sendPdfToTelegram(
  pdfBuffer: Buffer,
  fileName: string,
  caption: string
): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('[API] ⚠️ Telegram not configured');
    return false;
  }

  try {
    console.log('[API] 📱 Sending PDF to Telegram...');

    // Create form data for Telegram
    const boundary = '----FormBoundary' + Math.random().toString(36).substring(2);

    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="caption"\r\n\r\n${caption}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="document"; filename="${fileName}"\r\n`;
    body += `Content-Type: application/pdf\r\n\r\n`;

    const textEncoder = new TextEncoder();
    const bodyStart = textEncoder.encode(body);
    const bodyEnd = textEncoder.encode(`\r\n--${boundary}--\r\n`);

    const fullBody = new Uint8Array(bodyStart.length + pdfBuffer.length + bodyEnd.length);
    fullBody.set(bodyStart, 0);
    fullBody.set(pdfBuffer, bodyStart.length);
    fullBody.set(bodyEnd, bodyStart.length + pdfBuffer.length);

    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: fullBody
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[API] ❌ Telegram Error:', error);
      return false;
    }

    console.log('[API] ✅ PDF sent to Telegram successfully!');
    return true;
  } catch (error) {
    console.error('[API] ❌ Telegram Error:', error);
    return false;
  }
}

// Generate email HTML
function generateEmailHTML(formData: BriefFormData): string {
  const logo = formData.logoDetails || {} as any;
  const isSocial = formData.briefType === 'social' || formData.briefCategory === 'social_posts' || formData.briefCategory === 'social_plans';

  const selectedApps = Object.entries(logo.applications || {})
    .filter(([_, v]) => v)
    .map(([k, _]) => APP_LABELS[k] || k)
    .join('، ');

  return `
    <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #000000; padding: 25px 30px; text-align: center; border-bottom: 3px solid #d4ff00;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🚀 مشروع جديد!</h1>
      </div>

      <!-- Content -->
      <div style="padding: 30px;">
        
        <div style="background: #f9fafb; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
          <h2 style="color: #d4ff00; background: #000; padding: 10px 15px; border-radius: 8px; margin: -20px -20px 15px -20px; font-size: 16px;">📋 ${formData.projectName || 'طلب سوشيال ميديا'}</h2>
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>العميل:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formData.clientName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>الشركة:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${formData.companyName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>الهاتف:</strong></td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;" dir="ltr">${formData.phone || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;"><strong>البريد:</strong></td>
              <td style="padding: 8px 0;" dir="ltr">${formData.email || '-'}</td>
            </tr>
          </table>
        </div>

        <div style="background: rgba(212, 255, 0, 0.1); border: 1px solid #d4ff00; border-radius: 10px; padding: 15px; text-align: center; margin-bottom: 20px;">
          <span style="font-size: 24px; font-weight: bold;">${formData.selectedPackagePrice ? `${formData.selectedPackagePrice.toLocaleString('en-US')} د.ع` : 'لم يحدد'}</span>
          <br>
          <span style="color: #666; font-size: 12px;">الميزانية / السعر</span>
        </div>

        <p style="color: #666; line-height: 1.8;">${formData.projectDescription || 'لا يوجد وصف'}</p>

        ${!isSocial && selectedApps ? `<p style="margin-top: 15px;"><strong>التطبيقات:</strong> ${selectedApps}</p>` : ''}
        ${!isSocial && logo.notes ? `<div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-top: 15px;"><strong>ملاحظات:</strong> ${logo.notes}</div>` : ''}
        ${isSocial && formData.socialDetails?.additionalNotes ? `<div style="background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px; margin-top: 15px;"><strong>ملاحظات:</strong> ${formData.socialDetails.additionalNotes}</div>` : ''}

      </div>

      <!-- Footer -->
      <div style="background: #000000; padding: 15px; text-align: center;">
        <span style="color: #d4ff00; font-weight: bold;">📎 ملف PDF مرفق</span>
      </div>

    </div>
  `;
}


// ============================================================
//  SECURITY LAYER 1 — CORS Origin Whitelist
// ============================================================
const ALLOWED_ORIGINS = new Set([
  'https://mustafa-al-mousawi.web.app',
  'https://www.mustafa-al-mousawi.web.app',
  'https://mustafa-kappa.vercel.app',
  // Add any custom domain here when registered, e.g.:
  // 'https://www.mustafa-design.com',
]);

/** Returns the allowed origin string if the request origin is permitted, else null. */
function resolveAllowedOrigin(req: VercelRequest): string | null {
  const origin = (req.headers['origin'] ?? '') as string;
  const referer = (req.headers['referer'] ?? '') as string;

  // Always allow in local development
  if (origin === 'http://localhost:5173' || referer.startsWith('http://localhost:5173')) {
    return 'http://localhost:5173';
  }

  if (ALLOWED_ORIGINS.has(origin)) return origin;

  // Fallback: check referer host against whitelist
  try {
    const refererHost = new URL(referer).origin;
    if (ALLOWED_ORIGINS.has(refererHost)) return refererHost;
  } catch {
    // invalid referer URL — ignore
  }

  return null;
}

// ============================================================
//  SECURITY LAYER 2 — In-Memory Rate Limiter
// ============================================================
interface RateRecord { count: number; resetAt: number }
const rateLimitMap = new Map<string, RateRecord>();

const RATE_LIMIT_MAX    = 5;           // max submissions per window
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): { limited: boolean; retryAfterSec: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return { limited: false, retryAfterSec: 0 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    const retryAfterSec = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfterSec };
  }

  record.count++;
  return { limited: false, retryAfterSec: 0 };
}

// ============================================================
//  SECURITY LAYER 3 — Server-Side Payload Validator
// ============================================================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ~4 MB expressed as Base64 character count (Base64 ≈ 1.37× raw bytes)
const MAX_BASE64_CHARS = Math.ceil(4 * 1024 * 1024 * 1.37);

interface ValidationResult { valid: boolean; error?: string }

function validatePayload(formData: unknown): ValidationResult {
  if (!formData || typeof formData !== 'object') {
    return { valid: false, error: 'البيانات المُرسَلة غير صالحة.' };
  }

  const fd = formData as Record<string, unknown>;

  // ── Required string fields ──────────────────────────────────
  for (const field of ['clientName', 'phone', 'briefType'] as const) {
    if (!fd[field] || typeof fd[field] !== 'string' || !(fd[field] as string).trim()) {
      return { valid: false, error: `الحقل المطلوب "${field}" مفقود أو فارغ.` };
    }
  }

  // ── briefType enum ───────────────────────────────────────────
  if (!['logo', 'social'].includes(fd['briefType'] as string)) {
    return { valid: false, error: 'نوع الطلب (briefType) غير صالح.' };
  }

  // ── Optional email format ────────────────────────────────────
  if (fd['email'] && typeof fd['email'] === 'string' && fd['email'].trim()) {
    if (!EMAIL_REGEX.test(fd['email'] as string)) {
      return { valid: false, error: 'صيغة البريد الإلكتروني غير صحيحة.' };
    }
  }

  // ── Base64 size guards (prevents memory crash / payload injection) ──
  const logoDetails = fd['logoDetails'] as Record<string, unknown> | undefined;
  const socialDetails = fd['socialDetails'] as Record<string, unknown> | undefined;

  // Check inspirationImage on both paths
  for (const details of [logoDetails, socialDetails]) {
    if (!details) continue;
    const img = details['inspirationImage'];
    if (typeof img === 'string' && img.startsWith('data:') && img.length > MAX_BASE64_CHARS) {
      return { valid: false, error: 'حجم صورة الاستلهام يتجاوز الحد المسموح به (4MB).' };
    }
  }

  // Check moodboard array items
  if (logoDetails && Array.isArray(logoDetails['moodboard'])) {
    for (const item of logoDetails['moodboard'] as unknown[]) {
      if (typeof item === 'string' && item.startsWith('data:') && item.length > MAX_BASE64_CHARS) {
        return { valid: false, error: 'إحدى صور التصور المبدئي تتجاوز الحد المسموح به (4MB).' };
      }
    }
  }

  // Check postsPatternImages for social path
  if (socialDetails && Array.isArray(socialDetails['postsPatternImages'])) {
    for (const item of socialDetails['postsPatternImages'] as unknown[]) {
      if (typeof item === 'string' && item.startsWith('data:') && item.length > MAX_BASE64_CHARS) {
        return { valid: false, error: 'إحدى صور النماذج تتجاوز الحد المسموح به (4MB).' };
      }
    }
  }

  return { valid: true };
}

// ============================================================
//  MAIN HANDLER
// ============================================================
export default async function handler(req: VercelRequest, res: VercelResponse) {

  // ── CORS: resolve and enforce origin whitelist ──────────────
  const allowedOrigin = resolveAllowedOrigin(req);

  if (allowedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
    res.setHeader('Vary', 'Origin');
  } else {
    // Unknown origin — reject immediately (handles CSRF)
    return res.status(403).json({ error: 'Access denied: origin not permitted.' });
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate Limiting ───────────────────────────────────────────
  const clientIp =
    ((req.headers['x-forwarded-for'] as string) ?? '').split(',')[0].trim() ||
    (req.socket?.remoteAddress ?? 'unknown');

  const { limited, retryAfterSec } = checkRateLimit(clientIp);
  if (limited) {
    res.setHeader('Retry-After', String(retryAfterSec));
    return res.status(429).json({
      error: 'لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً.',
      retryAfterSeconds: retryAfterSec,
    });
  }

  // ── Payload Validation ──────────────────────────────────────
  const { formData } = (req.body ?? {}) as { formData?: unknown };

  if (!formData) {
    return res.status(400).json({ error: 'المعلومات المطلوبة غير مكتملة (formData مفقود).' });
  }

  const validation = validatePayload(formData);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  // ── Business Logic (unchanged) ──────────────────────────────
  try {
    const brief = formData as BriefFormData;
    const { projectName } = brief;

    console.log('[API] 🚀 Processing project:', projectName);

    // Step 1: Generate PDF
    console.log('[API] 📄 Generating PDF with Puppeteer...');
    const html = generatePdfHTML(brief);
    const pdfBuffer = await generatePdfWithPuppeteer(html);

    const pdfFileName = brief.briefCategory?.startsWith('social')
      ? `Social_${brief.companyName || brief.clientName || 'Brief'}.pdf`
      : `Brief_${brief.projectName || brief.companyName || 'Project'}.pdf`;

    console.log('[API] ✅ PDF generated, size:', pdfBuffer.length, 'bytes');

    // Step 2: Send to Telegram
    const telegramCaption = buildTelegramCaption(brief);
    await sendPdfToTelegram(pdfBuffer, pdfFileName, telegramCaption);

    // Step 3: Send Email (designer only)
    if (process.env.RESEND_API_KEY) {
      try {
        console.log('[API] 📧 Sending email to designer...');
        await resend.emails.send({
          from: 'onboarding@resend.dev',
          to: ['mustafahaidar0955@gmail.com'],
          subject: `📋 مشروع جديد: ${projectName}`,
          html: generateEmailHTML(brief),
          attachments: [{
            filename: pdfFileName,
            content: pdfBuffer.toString('base64'),
          }],
        });
        console.log('[API] ✅ Email sent successfully!');
      } catch (emailError: any) {
        console.error('[API] ❌ Email Error:', emailError.message);
        // Non-fatal — continue
      }
    }

    // Step 4: Return PDF to client
    return res.status(200).json({
      success: true,
      message: 'تم إنشاء وإرسال الملف بنجاح!',
      pdf: pdfBuffer.toString('base64'),
      fileName: pdfFileName,
    });

  } catch (error: any) {
    console.error('[API] ❌ Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      details: error.message,
    });
  }
}
