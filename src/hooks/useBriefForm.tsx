import React, { useState, useRef, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { BriefFormData, SocialDetails, LogoDetails, BaseBriefData, PostItem } from '../types';
import { APPLICATION_CATEGORIES, LOGO_TYPE_EXAMPLES } from '../constants';
import { DESIGN_STYLES } from '../utils/designConstants';
import { SelectedPackage } from '../App';
import { addBriefRequest, updateBriefImages } from '../lib/firestore';
import { BriefFormDataSchema } from '../utils/validation';

// ==========================================
// ثوابت
// ==========================================

const getInitialSocialData = (): SocialDetails => ({
  favoriteColors:   '',
  inspirationImage: '',
  inspirationImages: [],
  designStyle:      '',
  platforms:        [],
  businessType:     '',
  productsServices: '',
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


export const useBriefForm = (selectedPackage: SelectedPackage | null) => {
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

  // ─── حماية التنقل: منع الخروج العرضي من النموذج ─────────────────────
  useEffect(() => {
    const hasData = formData.clientName || formData.phone || formData.projectName;
    if (!hasData || isSuccess) return;

    // Fix A: تحذير عند إغلاق التبويب أو التحديث
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ''; // required for browser to show the dialog
    };

    // Fix B: اعتراض زر الرجوع للتنقل بين خطوات النموذج
    const handlePopState = () => {
      if (step > 1) {
        setStep(prev => prev - 1);
        scrollFormToTop();
        // Re-push state so next back press is also intercepted
        window.history.pushState({ step }, '', window.location.href);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [formData.clientName, formData.phone, formData.projectName, isSuccess, step]);

  // ─── دفع حالة تاريخ المتصفح عند تقديم الخطوة ──────────────────────────────────

  // ─── تحديث البيانات ───────────────────────────────────────────────────
  const updateFormData = useCallback((data: Partial<BaseBriefData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateLogoData = useCallback((data: Partial<LogoDetails>) => {
    setFormData(prev => ({
      ...prev,
      logoDetails: { ...prev.logoDetails, ...data },
    }));
  }, []);

  const updateSocialData = useCallback((data: Partial<SocialDetails>) => {
    setFormData(prev => ({
      ...prev,
      socialDetails: { ...prev.socialDetails, ...data },
    }));
  }, []);

  // ─── إزالة صورة مرفقة ─────────────────────────────────────────────────
  // ─── إزالة صورة مرفقة ─────────────────────────────────────────────────
  const removeUploadedFile = useCallback((e: React.MouseEvent, index: number, isSocialPath: boolean = false) => {
    e.stopPropagation();
    if (!isSocialPath) {
      setFormData(prev => ({ 
        ...prev, 
        logoDetails: {
          ...prev.logoDetails,
          moodboard: prev.logoDetails.moodboard.filter((_, i) => i !== index)
        }
      }));
    }
  }, []);

  // ─── إعادة تعيين النموذج ─────────────────────────────────────────────
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    setIsPdfDownloaded(false);
  }, []);

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
      if (step === 3 && (!formData.socialDetails.platforms.length || !formData.socialDetails.assetsAvailability)) {
        toast.error('يرجى اختيار منصة واحدة على الأقل وتحديد جاهزية الشعار للمتابعة.');
        return false;
      }
      if (step === 4 && (!formData.socialDetails.postsList || formData.socialDetails.postsList.length === 0)) {
        toast.error('يرجى إضافة تفاصيل بوست واحد على الأقل للمتابعة.');
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
      delete strippedData.logoTypeImagesBase64;
      if (strippedData.logoDetails) {
        delete strippedData.logoDetails.inspirationImage;
        delete strippedData.logoDetails.moodboard;
      }
      if (strippedData.socialDetails) {
        delete strippedData.socialDetails.inspirationImage;
        delete strippedData.socialDetails.inspirationImages;
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
            if (styleObj && styleObj.name) {
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
        const nextStep = step + 1;
        setStep(nextStep);
        // Push a history entry so the browser back button triggers popstate
        window.history.pushState({ step: nextStep }, '', window.location.href);
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

  return {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    formData,
    isGeneratingPdf,
    isPdfDownloaded,
    botTrap,
    setBotTrap,
    formRef,
    isSocial,
    STEPS,
    scrollFormToTop,
    updateFormData,
    updateLogoData,
    updateSocialData,
    removeUploadedFile,
    resetForm,
    validateStep,
    downloadPDF,
    handleSubmit
  };
};
