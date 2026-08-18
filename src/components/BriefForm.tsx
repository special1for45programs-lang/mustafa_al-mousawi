import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Send, Package, X } from 'lucide-react';
import toast from 'react-hot-toast';

import { BriefFormData, SocialDetails, LogoDetails, BaseBriefData } from '../types';
import { APPLICATION_CATEGORIES, LOGO_TYPE_EXAMPLES } from '../constants';
import { DESIGN_STYLES } from '../utils/designConstants';
import { SelectedPackage } from '../App';
import { addBriefRequest, updateBriefImages } from '../lib/firestore';
import { BriefFormDataSchema } from '../utils/validation';

// مكونات الخطوات — شعار / هوية بصرية
import StepInfo    from './brief-steps/StepInfo';
import StepColorPalette from './brief-steps/StepColorPalette';
import StepStyle   from './brief-steps/StepStyle';
import StepDetails from './brief-steps/StepDetails';
import StepReview  from './brief-steps/StepReview';

import SocialStepPlatforms from './brief-steps/SocialStepPlatforms';
import SocialStepContent   from './brief-steps/SocialStepContent';
import SocialStepReview    from './brief-steps/SocialStepReview';
import { DesignStylesTab } from './brief-steps/DesignStylesTab';

import SuccessView from './brief-steps/SuccessView';


// ==========================================
// ثوابت
// ==========================================

const getInitialSocialData = (): SocialDetails => ({
  favoriteColors:   '',
  inspirationImage: '',
  inspirationImages: [],
  designStyle:      '',
  postsPatternImages: [],
  platforms:        [],
  businessType:     '',
  productsServices: '',
  postIdeas:        '',
  visualStyle:      '',
  additionalNotes:  '',
  currentAccountsLinks: '',
  contentMix: [],
  assetsAvailability: '',
  postsList: [{ category: 'ترويجي / بيعي', headline: '', concept: '' }],
});

const getInitialLogoData = (): LogoDetails => ({
  favoriteColors:   '',
  inspirationImage: '',
  designStyle:      '',
  logoType:         '',
  moodboard:        [],
  applications:     APPLICATION_CATEGORIES.flatMap(c => c.items).reduce((acc, curr) => ({ ...acc, [curr.key]: false }), {}),
  otherApplication: '',
  paperSizes:       { dl: false, a5: false, a4: false, a3: false },
  startDate:        '',
  deadline:         '',
  notes:            '',
});

const getInitialBaseData = (): BaseBriefData => ({
  clientStatus:     'new',
  date:             new Date().toISOString().split('T')[0],
  clientName:       '',
  companyName:      '',
  phone:            '',
  email:            '',
  projectName:      '',
  projectDescription: '',
  projectType:      '',
  logoLanguage:     '',
  targetAge:        '',
  targetGender:     '',
  targetDescription: '',
  competitors:      '',
  postsLanguage:    '',
});

const getInitialFormData = (): BriefFormData => ({
  ...getInitialBaseData(),
  briefType:        '',
  logoDetails:      getInitialLogoData(),
  socialDetails:    getInitialSocialData(),
});

// ==========================================
// تحديد نوع المسار بناءً على الباقة
// ==========================================
const isSocialType = (pkg: SelectedPackage | null): boolean =>
  pkg?.type === 'social';

// تسميات الخطوات حسب المسار
const LOGO_STEPS  = ['المعلومات', 'الهوية اللونية', 'الأسلوب', 'التفاصيل', 'مراجعة'];
const SOCIAL_STEPS = ['المعلومات', 'النمط والألوان', 'المنصات', 'البوستات', 'مراجعة'];

// ==========================================
// Props
// ==========================================
interface BriefFormProps {
  selectedPackage: SelectedPackage | null;
  onClearPackage: () => void;
  onUpgradePackage?: (pkg: SelectedPackage) => void;
}

// ==========================================
// المكوّن الرئيسي
// ==========================================
const BriefForm: React.FC<BriefFormProps> = ({ selectedPackage, onClearPackage, onUpgradePackage }) => {
  const [step, setStep]               = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess]     = useState(false);
  const [formData, setFormData]       = useState<BriefFormData>(getInitialFormData());
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);
  const [botTrap, setBotTrap] = useState("");

  const formRef = useRef<HTMLDivElement>(null);

  const isSocial = isSocialType(selectedPackage);
  const STEPS    = isSocial ? SOCIAL_STEPS : LOGO_STEPS;

  // ─── مساعد: التمرير إلى أعلى قسم النموذج (يشمل العنوان وشريط الخطوات) ───────
  const scrollFormToTop = () => {
    document.getElementById('brief')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ─── إعادة الضبط عند تغيير الباقة المختارة ────────────────────────────
  useEffect(() => {
    // Only reset if there's a package.
    if (selectedPackage) {
      const resolvedCategory = selectedPackage.category
        ?? (selectedPackage.type === 'social'
            ? (selectedPackage.id.includes('presence') || selectedPackage.id.includes('growth') || selectedPackage.id.includes('domination')
                ? 'social_plans' : 'social_posts')
            : selectedPackage.type) as BriefFormData['briefCategory'];

      setFormData(prev => ({
        ...getInitialFormData(),
        briefType:            selectedPackage.type === 'social' ? 'social' : 'logo',
        briefCategory:        resolvedCategory,
        selectedPackageName:  selectedPackage.name,
        selectedPackagePrice: selectedPackage.price,
      }));
      setStep(1);
      setIsPdfDownloaded(false);
    }
  }, [selectedPackage?.id]);

  // ─── تحديث البيانات ───────────────────────────────────────────────────
  const updateFormData = (data: Partial<BaseBriefData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const updateLogoData = (data: Partial<LogoDetails>) => {
    setFormData(prev => ({
      ...prev,
      logoDetails: { ...prev.logoDetails, ...data },
    }));
  };

  const updateSocialData = (data: Partial<SocialDetails>) => {
    setFormData(prev => ({
      ...prev,
      socialDetails: { ...prev.socialDetails, ...data },
    }));
  };

  // ─── إزالة صورة مرفقة ─────────────────────────────────────────────────
  const removeUploadedFile = (e: React.MouseEvent, index: number, isSocialPath: boolean = false) => {
    e.stopPropagation();
    if (isSocialPath) {
      setFormData(prev => ({ 
        ...prev, 
        socialDetails: {
          ...prev.socialDetails,
          postsPatternImages: prev.socialDetails.postsPatternImages.filter((_, i) => i !== index)
        }
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        logoDetails: {
          ...prev.logoDetails,
          moodboard: prev.logoDetails.moodboard.filter((_, i) => i !== index)
        }
      }));
    }
  };

  // ─── إعادة تعيين النموذج ─────────────────────────────────────────────
  const resetForm = () => {
    setFormData(getInitialFormData());
    setStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsPdfDownloaded(false);
  };

  // ─── التحقق من صحة البيانات قبل الانتقال ─────────────────────────────
  const validateStep = (): boolean => {
    // 1. Email validation (if provided)
    if (step === 1 && formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error('يرجى إدخال عنوان بريد إلكتروني صحيح.');
        return false;
      }
    }

    // 2. Phone validation (basic length check for valid phone numbers)
    if (step === 1 && formData.phone) {
      if (formData.phone.length < 6) {
        toast.error('يرجى إدخال رقم هاتف صحيح.');
        return false;
      }
    }

    if (isSocial) {
      if (step === 1 && (!formData.clientName || !formData.projectName || !formData.phone)) {
        toast.error('يرجى ملء هذا الحقل المطلوب.');
        return false;
      }
      if (step === 3 && (!formData.socialDetails.platforms.length || !formData.socialDetails.productsServices)) {
        toast.error('يرجى اختيار خيار واحد على الأقل للمتابعة.');
        return false;
      }
      if (step === 4 && (!formData.socialDetails.postIdeas)) {
        toast.error('يرجى ملء هذا الحقل المطلوب.');
        return false;
      }
    } else {
      if (step === 1 && (!formData.clientName || !formData.projectName || !formData.phone)) {
        toast.error('يرجى ملء هذا الحقل المطلوب.');
        return false;
      }
      if (step === 3 && !formData.logoDetails.logoType) {
        toast.error('يرجى اختيار خيار واحد على الأقل للمتابعة.');
        return false;
      }
    }
    return true;
  };

  // ─── توليد وتحميل PDF (API-first + محلي كـ Fallback) ─────────────────
  const downloadPDF = async () => {
    const validation = BriefFormDataSchema.safeParse(formData);
    if (!validation.success) {
      const missingFields = validation.error.issues.map(i => i.message).join('، ');
      toast.error(
        <div dir="rtl" className="flex flex-col gap-1 text-sm">
          <p className="font-bold text-red-500">❌ يرجى إكمال الحقول التالية:</p>
          <p className="text-gray-300">{missingFields}</p>
        </div>,
        { duration: 5000, style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff0000' } }
      );
      return;
    }

    setIsSubmitting(true);
    let loadingToast: string | undefined;

    try {
      loadingToast = toast.loading('جاري تجهيز بيانات المشروع...', {
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #333' }
      });

      // 1. Strip base64 assets for Firestore to keep document lightweight
      const strippedData = JSON.parse(JSON.stringify(formData));
      delete strippedData.designStyleImageBase64;
      delete strippedData.logoTypeImagesBase64;
      if (strippedData.logoDetails) {
        delete strippedData.logoDetails.inspirationImage;
        delete strippedData.logoDetails.moodboard;
      }
      if (strippedData.socialDetails) {
        delete strippedData.socialDetails.inspirationImage;
        delete strippedData.socialDetails.inspirationImages;
        delete strippedData.socialDetails.postsPatternImages;
      }
      
      const briefId = await addBriefRequest(strippedData);
      const baseUrl = window.location.origin;

      setIsGeneratingPdf(true);

      // Try server API first with a 30-second timeout
      let response: Response;
      let rawText: string;
      try {
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 30_000);

        let finalFormData = { ...formData };
        
        // Populate designStyle or logoType base64 if it exists for the active domain
        if (isSocial) {
          const activeDesignStyle = finalFormData.socialDetails.designStyle;
          if (activeDesignStyle) {
            const styleObj = DESIGN_STYLES.find(s => s.id === activeDesignStyle);
            if (styleObj && styleObj.img) {
              finalFormData.designStyleImageBase64 = styleObj.img;
              finalFormData.designStyleName = styleObj.name;
            }
          }
        } else {
          const activeLogoType = finalFormData.logoDetails.logoType;
          if (activeLogoType) {
            const typeObj = LOGO_TYPE_EXAMPLES.find(t => t.id === activeLogoType);
            if (typeObj && typeObj.images && typeObj.images.length > 0) {
              finalFormData.logoTypeImagesBase64 = typeObj.images.slice(0, 4);
              finalFormData.logoTypeName = typeObj.label;
              finalFormData.logoTypeDesc = typeObj.desc;
            }
          }
        }

        response = await fetch('/api/generate-brief-pdf', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ formData: finalFormData, briefId, baseUrl }),
          signal:  controller.signal,
        });
        clearTimeout(timeoutId);

        // Read raw text first — JSON.parse on empty string causes the "Unexpected end" error
        rawText = await response.text();
        if (!rawText || rawText.trim() === '') {
          throw new Error('empty_response');
        }
      } catch (fetchError: unknown) {
        throw fetchError; // Rethrow to be caught by the outer catch
      }

      if (!response.ok) {
        try {
          const errRes = JSON.parse(rawText);
          throw new Error(errRes.details || errRes.error || `Server ${response.status}`);
        } catch {
          throw new Error(`Server Error ${response.status}: ${response.statusText}`);
        }
      }

      let result;
      try {
        result = JSON.parse(rawText);
      } catch {
        throw new Error('Failed to parse server response.');
      }

      if (!result.pdf) {
        throw new Error('no_pdf_data');
      }

      // 4. Update the Firestore document with the returned Telegram fileIds
      if (result.fileIds && result.fileIds.length > 0) {
        try {
          await updateBriefImages(briefId, result.fileIds);
        } catch (e) {
          console.warn('Failed to update brief document with fileIds', e);
        }
      }

      setIsPdfDownloaded(true);
      if (loadingToast) toast.dismiss(loadingToast);
      
      toast.success('تم إرسال معلومات مشروعك بنجاح!', {
        duration: 5000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ccff00' },
      });
      
      setIsSuccess(true);

    } catch (apiError: unknown) {
      if (loadingToast) toast.dismiss(loadingToast);
      
      const isDev = import.meta.env.DEV;
      const errMsg = apiError instanceof Error ? apiError.message : String(apiError);
      
      // Graceful fallback for local development without backend
      if (isDev && (errMsg === 'empty_response' || errMsg.includes('fetch') || (apiError instanceof Error && apiError.name === 'TypeError'))) {
        console.warn('[DEV] Fallback mode active, ignoring API failure:', errMsg);
        setIsSuccess(true);
        toast.success('تم الإرسال بنجاح (وضع التطوير المحلي)', {
          duration: 5000,
          style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ccff00' },
        });
      } else {
        toast.error(
          <div dir="rtl" className="flex flex-col gap-1 text-sm">
            <p className="font-bold text-red-500">❌ عذراً، فشلت عملية الإرسال!</p>
            <p>يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
            <p className="text-xs text-gray-400 mt-1">السبب: {errMsg.substring(0, 100) || 'غير معروف'}</p>
          </div>,
          {
            duration: 7000,
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ff0000', minWidth: '300px' },
          }
        );
      }
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // ─── التعامل مع الإرسال ──────────────────────────────────────────────
  const handleSubmit = (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (botTrap !== "") { console.warn("Bot detected."); return; }
    if (validateStep()) {
      if (step < STEPS.length) {
        setStep(step + 1);
        scrollFormToTop();
      } else if (isPdfDownloaded) {
        setIsSuccess(true);
      }
    } else {
      // التوجيه السلس لأول حقل فارغ مع تأثير وميض أحمر خفيف
      setTimeout(() => {
        const firstInvalid = formRef.current?.querySelector('input:invalid, textarea:invalid, input[required][value=""]') as HTMLElement;
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstInvalid.classList.add('ring-2', 'ring-red-500', 'animate-pulse');
          setTimeout(() => firstInvalid.classList.remove('ring-2', 'ring-red-500', 'animate-pulse'), 2000);
        } else {
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  // ─── حالة النجاح ─────────────────────────────────────────────────────
  if (isSuccess) return <SuccessView resetForm={resetForm} />;

  // ─── الخطوات الحالية بالاسم ──────────────────────────────────────────
  const STEP_TITLES = isSocial
    ? ['معلومات العميل', 'النمط والألوان', 'المنصات والنشاط', 'تفاصيل ومحتوى البوستات', 'مراجعة الطلب']
    : ['المعلومات الأساسية', 'الهوية اللونية', 'النمط والتفضيلات', 'تفاصيل المشروع', 'مراجعة الطلب'];

  return (
    <div className="py-24 bg-brand-black font-sans relative overflow-hidden select-none">



      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 relative z-10 py-0 sm:py-8">

        {/* العنوان */}
        <div className="text-center mb-10 px-4 sm:px-0 mt-8 sm:mt-0">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ابدأ مشروعك</h2>
          <p className="text-gray-400 text-lg">دعنا نحول رؤيتك إلى واقع ملموس</p>
        </div>

        {/* بانر الباقة المختارة أو Placeholder */}
        {selectedPackage ? (
          <div className="max-w-2xl mx-auto mb-10 bg-brand-lime/10 border border-brand-lime/40 rounded-2xl p-5 flex items-center justify-between gap-4 mx-4 sm:mx-auto">
            <div className="flex items-center gap-3">
              <div className="bg-brand-lime/20 p-2.5 rounded-lg">
                <Package size={22} className="text-brand-lime" />
              </div>
              <div>
                <p className="text-xs text-brand-lime/70 font-bold uppercase tracking-widest">
                  {isSocial ? 'باقة سوشيال ميديا' : 'باقة الشعار / الهوية'}
                </p>
                <p className="text-white font-bold text-lg">{selectedPackage.name}</p>
                <p className="text-gray-400 text-sm">{selectedPackage.price.toLocaleString('en-US')} د.ع</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClearPackage}
              aria-label="إزالة الباقة"
              className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-lg"
              title="إزالة الاختيار"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mb-10 bg-brand-dark border border-white/10 rounded-2xl p-6 text-center mx-4 sm:mx-auto">
            <Package size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-bold mb-1">لم تختر باقة بعد</p>
            <p className="text-gray-600 text-sm mb-4">يرجى اختيار الباقة المناسبة أولاً للحصول على استمارة مخصصة لاحتياجاتك.</p>
            <a
              href="#packages"
              className="inline-flex items-center gap-2 bg-brand-lime text-black font-bold px-6 py-2.5 rounded-xl hover:bg-white transition-colors text-sm"
            >
              اختر باقتك الآن
              <ArrowRight size={16} />
            </a>
          </div>
        )}
        {selectedPackage && (
          <div ref={formRef} className="flex justify-between items-center max-w-2xl mx-auto mb-8 sm:mb-16 relative animate-fadeIn px-6 sm:px-0">
            <div className="absolute top-1/2 left-0 w-full h-0.5 sm:h-1 bg-brand-gray -z-10 rounded-full" />
            <div
              className="absolute top-1/2 right-0 h-0.5 sm:h-1 bg-brand-lime -z-10 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
            {STEPS.map((label, i) => {
              const num = i + 1;
              const isCurrent = step === num;
              return (
                <div key={num} className="flex flex-col items-center gap-1.5 sm:gap-3">
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-xl font-bold border-2 sm:border-4 transition-all duration-300 z-10
                    ${step >= num ? 'bg-brand-lime border-brand-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'bg-brand-dark border-brand-gray text-gray-500'}`}
                  >
                    {step > num ? '✓' : num}
                  </div>
                  <span className={`text-[10px] sm:text-sm font-bold transition-colors ${
                    isCurrent ? 'text-brand-lime font-extrabold block' : 'hidden sm:block text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* نموذج الإدخال */}
        {selectedPackage && (
        <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl px-4 pt-6 pb-28 sm:p-8 sm:px-10 relative z-20 w-full max-w-full sm:max-w-5xl mx-0 sm:mx-auto animate-fadeIn min-h-[650px] overflow-x-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" autoComplete="on" noValidate>
            <input type="text" name="contact_me_by_fax_only" value={botTrap} onChange={(e) => setBotTrap(e.target.value)} style={{ display: 'none', opacity: 0, position: 'absolute', top: '-9999px', left: '-9999px' }} tabIndex={-1} autoComplete="off" />

            {/* رأس الخطوة */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 gap-4 sm:gap-6 border-b border-gray-100 pb-6 sm:pb-8">
              <div>
                <div className="flex flex-col gap-1 mb-1 sm:mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {STEP_TITLES[step - 1]}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">
                  الخطوة {step} من {STEPS.length}
                  {isSocial && <span className="mr-2 text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">سوشيال ميديا</span>}
                  {!isSocial && selectedPackage && <span className="mr-2 text-[10px] sm:text-xs bg-brand-lime/20 text-gray-700 px-2 py-0.5 rounded-full font-bold">شعار / هوية</span>}
                </p>
              </div>

              {/* حالة العميل (جديد / سابق) - يظهر في الخطوة 1 فقط */}
              {step === 1 && (
                <div className="bg-gray-100 p-1 rounded-xl inline-flex relative">
                  <div className={`absolute inset-y-1 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out border border-gray-200
                    ${formData.clientStatus === 'current' ? 'right-1' : 'right-[calc(50%-0.25rem)]'}`}
                  />
                  <button type="button" onClick={() => updateFormData({ clientStatus: 'current' })}
                    className={`relative z-10 px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-base rounded-lg font-bold transition-colors ${formData.clientStatus === 'current' ? 'text-black' : 'text-gray-500'}`}>
                    عميل سابق
                  </button>
                  <button type="button" onClick={() => updateFormData({ clientStatus: 'new' })}
                    className={`relative z-10 px-4 sm:px-8 py-2 sm:py-3 text-xs sm:text-base rounded-lg font-bold transition-colors ${formData.clientStatus === 'new' ? 'text-black' : 'text-gray-500'}`}>
                    عميل جديد
                  </button>
                </div>
              )}
            </div>

            {/* ==========================================
                محتوى الخطوات — مسار الشعار / الهوية
            ========================================== */}
            {!isSocial && step === 1 && <StepInfo    formData={formData} updateFormData={updateFormData} />}
            {!isSocial && step === 2 && <StepColorPalette formData={formData} updateDomainData={updateLogoData} />}
            {!isSocial && step === 3 && <StepStyle   logoDetails={formData.logoDetails} updateLogoDetails={updateLogoData} />}
            {!isSocial && step === 4 && (
              <StepDetails
                logoDetails={formData.logoDetails}
                updateLogoDetails={updateLogoData}
                selectedPackage={selectedPackage}
                onUpgradePackage={onUpgradePackage}
              />
            )}
            {!isSocial && step === 5 && (
              <StepReview formData={formData} removeUploadedFile={removeUploadedFile} />
            )}

            {/* ==========================================
                محتوى الخطوات — مسار السوشيال ميديا
            ========================================== */}
            {isSocial && step === 1 && <StepInfo    formData={formData} updateFormData={updateFormData} />}
            {isSocial && step === 2 && (
              <StepColorPalette formData={formData} updateDomainData={updateSocialData} />
            )}
            {isSocial && step === 3 && (
              <SocialStepPlatforms
                socialData={formData.socialDetails}
                updateSocialData={updateSocialData}
                companyName={formData.companyName}
                updateFormData={updateFormData}
                projectType={formData.projectType}
              />
            )}
            {isSocial && step === 4 && (
              <SocialStepContent
                socialData={formData.socialDetails}
                updateSocialData={updateSocialData}
                selectedPackageName={formData.selectedPackageName}
              />
            )}
            {isSocial && step === 5 && (
              <SocialStepReview formData={formData} selectedPackage={selectedPackage} removeUploadedFile={removeUploadedFile} />
            )}



            {/* ==========================================
                أزرار التنقل
            ========================================== */}
            <div className="flex flex-row justify-between items-center pt-6 sm:pt-10 mt-6 sm:mt-10 border-t border-gray-100 gap-2 sm:gap-4">

              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setStep(step - 1); scrollFormToTop(); }}
                  className="flex items-center gap-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all font-bold"
                >
                  <ArrowRight className="w-5 h-5" />
                  {step === STEPS.length ? 'تعديل البيانات' : 'السابق'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    toast.success('تم تفريغ الحقول بنجاح');
                  }}
                  className="flex items-center text-gray-400 hover:text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all text-sm font-semibold"
                >
                  إعادة تعيين الاستمارة
                </button>
              )}

              {step < STEPS.length ? (
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-brand-lime text-black hover:bg-lime-400 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group w-full md:w-auto"
                >
                  {step === STEPS.length - 1 ? 'مراجعة الطلب' : 'التالي'}
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={downloadPDF}
                  disabled={isGeneratingPdf}
                  className={`flex items-center justify-center gap-3 bg-brand-lime text-black hover:bg-lime-400 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-lime-300/20 transition-all w-full md:w-auto ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
                >
                  <Send className="w-6 h-6" />
                  {isGeneratingPdf ? 'جاري الإرسال...' : 'إرسال المشروع / التأكيد'}
                </button>
              )}
            </div>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default BriefForm;
