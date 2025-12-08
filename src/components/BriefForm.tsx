import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Instagram } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from './ui/Button';
import { BriefFormData } from '../types';
import { APPLICATION_OPTIONS } from '../constants';


// Import New Components
import StepInfo from './brief-steps/StepInfo';
import StepStyle from './brief-steps/StepStyle';
import StepDetails from './brief-steps/StepDetails';
import StepReview from './brief-steps/StepReview';
import SuccessView from './brief-steps/SuccessView';
import { renderToStaticMarkup } from 'react-dom/server';
import BriefPdfTemplate from './BriefPdfTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// مكون استمارة بدء المشروع (Brief Form)
const BriefForm: React.FC = () => {
  const [step, setStep] = useState(1); // تتبع خطوة الاستمارة الحالية
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة الإرسال (توليد PDF)
  const [isSuccess, setIsSuccess] = useState(false); // حالة النجاح




  // الحالة المبدئية للبيانات
  const [formData, setFormData] = useState<BriefFormData>({
    clientStatus: 'new',
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    companyName: '',
    phone: '',
    email: '',
    projectName: '',
    projectDescription: '',
    projectType: '',
    favoriteColors: '',
    logoType: 'text',
    moodboard: [],
    // تهيئة جميع الخيارات بـ false
    applications: APPLICATION_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.key]: false }), {}),
    otherApplication: '',
    paperSizes: {
      dl: false,
      a5: false,
      a4: false,
      a3: false,
    },
    startDate: '',
    deadline: '',
    budget: '100-150',
    notes: ''
  });  // مرجع لحاوية النموذج للتمرير إليها
  const formRef = useRef<HTMLDivElement>(null);
  // مرجع لحاوية PDF المخفية
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  // مرجع لتتتبع التحميل الأول (لمنع التمرير عند فتح الصفحة)
  const isFirstRender = useRef(true);

  // الانتقال إلى بداية النموذج عند تغيير الخطوة
  useEffect(() => {
    // منع التمرير في المرة الأولى (عند تحميل الصفحة)
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  // تحديث البيانات (Generic Updater)
  const updateFormData = (data: Partial<BriefFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };



  // حذف صورة محددة من المرفقات
  const removeUploadedFile = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setFormData(prev => ({
      ...prev,
      moodboard: prev.moodboard.filter((_, i) => i !== index)
    }));
  };

  // إعادة تعيين النموذج لبدء مشروع جديد
  const resetForm = () => {
    setFormData({
      clientStatus: 'new',
      date: new Date().toISOString().split('T')[0],
      clientName: '',
      companyName: '',
      phone: '',
      email: '',
      projectName: '',
      projectDescription: '',
      projectType: '',
      favoriteColors: '',
      logoType: 'text',
      moodboard: [],
      applications: APPLICATION_OPTIONS.reduce((acc, curr) => ({ ...acc, [curr.key]: false }), {}),
      otherApplication: '',
      paperSizes: { dl: false, a5: false, a4: false, a3: false },
      startDate: '',
      deadline: '',
      budget: '100-150',
      notes: ''
    });
    setStep(1);
    setIsSuccess(false);
    setIsSubmitting(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // دالة توليد ملف PDF وإرساله عبر API
  const generateAndSendPDF = async () => {
    setIsSubmitting(true);
    console.log('[Frontend] Starting Client-Side PDF generation...');

    try {
      console.log('[Frontend] Starting Client-Side PDF generation...');

      // 1. Validate container reference
      if (!pdfContainerRef.current) {
        throw new Error('❌ PDF container reference is null - DOM element not found');
      }

      if (!(pdfContainerRef.current instanceof HTMLElement)) {
        throw new Error('❌ PDF container is not a valid HTML element');
      }

      // 2. Validate that BriefPdfTemplate has rendered (check for children)
      if (!pdfContainerRef.current.children || pdfContainerRef.current.children.length === 0) {
        throw new Error('❌ PDF template did not render - container is empty. Check formData values.');
      }

      console.log('[Frontend] ✅ Container validated. Children count:', pdfContainerRef.current.children.length);
      console.log('[Frontend] ✅ Container HTML length:', pdfContainerRef.current.innerHTML.length);

      // 3. Wait for images to load
      console.log('[Frontend] Waiting for images and fonts to load...');
      const images = pdfContainerRef.current.querySelectorAll('img');
      const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => {
            console.warn('[Frontend] Image failed to load:', img.src);
            resolve(); // Continue even if image fails
          };
          setTimeout(resolve, 5000); // Timeout after 5s
        });
      });

      await Promise.all(imagePromises);
      await new Promise(resolve => setTimeout(resolve, 500)); // Extra safety margin

      console.log('[Frontend] ✅ All resources loaded. Starting html2canvas...');
      console.log('[Frontend] Container element:', pdfContainerRef.current);
      console.log('[Frontend] Container tagName:', pdfContainerRef.current.tagName);
      console.log('[Frontend] Container clientWidth:', pdfContainerRef.current.clientWidth);
      console.log('[Frontend] Container clientHeight:', pdfContainerRef.current.clientHeight);

      // Temporarily move container to visible area for capture (some browsers need this)
      const originalTop = pdfContainerRef.current.style.top;
      const originalLeft = pdfContainerRef.current.style.left;
      pdfContainerRef.current.style.top = '0';
      pdfContainerRef.current.style.left = '0';
      pdfContainerRef.current.style.zIndex = '99999';

      // Small delay to let browser re-position
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(pdfContainerRef.current, {
        scale: 2, // جودة عالية
        useCORS: true, // للسماح بتحميل الصور الخارجية
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794, //        windowWidth: 794,
      });

      // Move container back off-screen
      pdfContainerRef.current.style.top = originalTop;
      pdfContainerRef.current.style.left = originalLeft;
      pdfContainerRef.current.style.zIndex = '-1';

      console.log('[Frontend] Canvas created. Generating PDF...');
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // إضافة الصورة للـ PDF (fit to page)
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // 2. تحميل الملف للمستخدم فوراً
      console.log('[Frontend] Saving PDF locally...');
      const pdfFileName = `Brief_${formData.projectName || 'Project'}.pdf`;
      pdf.save(pdfFileName);

      // 3. تجهيز الملف للإرسال
      const pdfBlob = pdf.output('blob');
      const reader = new FileReader();

      const pdfBase64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // إزالة الـ prefix (data:application/pdf;base64,)
          const base64Content = base64String.split(',')[1];
          resolve(base64Content);
        };
        reader.readAsDataURL(pdfBlob);
      });

      // 4. إرسال إلى الـ API للإيميل
      console.log('[Frontend] Sending PDF to API for email...');
      const response = await fetch('/api/generate-brief-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pdfBase64: pdfBase64, // نرسل الملف الجاهز
          projectName: formData.projectName,
          clientName: formData.clientName,
          companyName: formData.companyName,
          clientEmail: formData.email
        }),
      });

      if (!response.ok) {
        let errorMsg = `Server Error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.details || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          errorMsg = await response.text();
        }
        throw new Error(errorMsg);
      } else {
        console.log('[Frontend] Email sent successfully!');
      }

      // إشعار العميل بالنجاح الكامل
      toast.success('✅ تم تحميل ملف PDF وإرساله بنجاح!', {
        duration: 5000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ccff00',
        },
        iconTheme: {
          primary: '#ccff00',
          secondary: '#1a1a1a',
        },
      });

      setIsSuccess(true);

    } catch (error: any) {
      console.error('[Frontend] PDF Generation Error:', error);
      // Show detailed error
      const errorMessage = error instanceof Error ? error.message : typeof error === 'object' ? JSON.stringify(error) : String(error);
      alert(`حدث خطأ أثناء إنشاء الملف:\n${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // معالجة التنقل بين الخطوات والإرسال النهائي
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else {
      // إشعار المستخدم قبل الإرسال
      const shouldProceed = window.confirm(
        "📥 سيتم تحميل نسخة من ملف PDF على جهازك\n" +
        "📧 وإرسال نسخة إلى المصمم عبر البريد الإلكتروني\n" +
        "📱 وإرسال نسخة عبر التليقرام\n\n" +
        "هل تود المتابعة؟"
      );
      if (shouldProceed) {
        generateAndSendPDF();
      }
    }
  };

  // شاشة النجاح
  if (isSuccess) {
    return <SuccessView resetForm={resetForm} />;
  }

  // شاشة التحميل المحسنة
  if (isSubmitting) {
    return (
      <div className="py-24 bg-brand-black font-sans relative overflow-hidden select-none min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg mx-auto px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            {/* أيقونة متحركة */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-brand-lime/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-brand-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-3">جاري إعداد ملف المشروع...</h3>
            <p className="text-gray-500 mb-8">قد تستغرق هذه العملية حتى 30 ثانية</p>

            {/* شريط التقدم */}
            <div className="w-full bg-gray-100 rounded-full h-2 mb-8 overflow-hidden">
              <div className="bg-brand-lime h-full rounded-full animate-pulse" style={{ width: '60%', animation: 'loading 2s ease-in-out infinite' }}></div>
            </div>

            {/* ملاحظات مهمة */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-right">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2 justify-end">
                <span>ملاحظات مهمة</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </h4>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li className="flex items-start gap-2 justify-end">
                  <span>سيتم تحميل ملف PDF تلقائياً على جهازك</span>
                  <span>📥</span>
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>سيصل المصمم نسخة عبر البريد والتليقرام</span>
                  <span>📧</span>
                </li>
                <li className="flex items-start gap-2 justify-end">
                  <span>لا تغلق الصفحة حتى اكتمال العملية</span>
                  <span>⚠️</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-brand-black font-sans relative overflow-hidden select-none">



      <div className="w-full max-w-7xl mx-auto md:pr-4 lg:pr-8 xl:pr-12 relative z-10">

        {/* PDF Render Container - Positioned off-screen for rendering */}
        <div
          ref={pdfContainerRef}
          style={{
            position: 'absolute',
            top: '-50000px',
            left: '-50000px',
            width: '794px',
            height: 'auto',
            backgroundColor: '#ffffff',
            zIndex: -1
          }}
        >
          <BriefPdfTemplate formData={formData} />
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ابدأ مشروعك</h2>
          <p className="text-gray-400 text-lg">دعنا نحول رؤيتك إلى واقع ملموس</p>
        </div>

        {/* شريط التقدم (Step Indicator) */}
        <div ref={formRef} className="flex justify-between items-center max-w-2xl mx-auto mb-16 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-brand-gray -z-10 rounded-full"></div>
          <div
            className="absolute top-1/2 right-0 h-1 bg-brand-lime -z-10 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>

          {[
            { num: 1, label: 'المعلومات' },
            { num: 2, label: 'النمط' },
            { num: 3, label: 'التفاصيل' },
            { num: 4, label: 'مراجعة' }
          ].map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-3">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 z-10 
                ${step >= s.num ? 'bg-brand-lime border-brand-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.5)]' : 'bg-brand-dark border-brand-gray text-gray-500'}`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className={`text-sm font-bold transition-colors ${step >= s.num ? 'text-brand-lime' : 'text-gray-500'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* نموذج الإدخال */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-12 relative z-20 mx-4 md:mx-auto">

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Header: Client Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6 border-b border-gray-100 pb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {step === 1 && 'المعلومات الأساسية'}
                  {step === 2 && 'النمط والتفضيلات'}
                  {step === 3 && 'تفاصيل المشروع'}
                  {step === 4 && 'مراجعة الطلب'}
                </h3>
                <p className="text-gray-500">الخطوة {step} من 4</p>
              </div>

              {/* خيار العميل (جديد / سابق) - يظهر فقط في الخطوة 1 */}
              {step === 1 && (
                <div className="bg-gray-100 p-1.5 rounded-xl inline-flex relative">
                  <div
                    className={`absolute inset-y-1.5 w-1/2 bg-white rounded-lg shadow-sm transition-all duration-300 ease-out border border-gray-200 ${formData.clientStatus === 'current' ? 'right-1.5' : 'right-[calc(50%-0.375rem)]'}`}
                  ></div>
                  <button
                    type="button"
                    onClick={() => updateFormData({ clientStatus: 'current' })}
                    className={`relative z-10 px-8 py-3 rounded-lg font-bold transition-colors ${formData.clientStatus === 'current' ? 'text-black' : 'text-gray-500'}`}
                  >
                    عميل سابق
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData({ clientStatus: 'new' })}
                    className={`relative z-10 px-8 py-3 rounded-lg font-bold transition-colors ${formData.clientStatus === 'new' ? 'text-black' : 'text-gray-500'}`}
                  >
                    عميل جديد
                  </button>
                </div>
              )}
            </div>

            {/* Step Components */}
            {step === 1 && <StepInfo formData={formData} updateFormData={updateFormData} />}
            {step === 2 && <StepStyle formData={formData} updateFormData={updateFormData} />}
            {step === 3 && <StepDetails formData={formData} updateFormData={updateFormData} />}
            {step === 4 && <StepReview formData={formData} removeUploadedFile={removeUploadedFile} />}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-10 mt-10 border-t border-gray-100/10">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 px-6 py-3 rounded-xl transition-all font-bold"
                >
                  <ArrowRight className="ml-2 w-5 h-5" /> {step === 4 ? 'تعديل البيانات' : 'السابق'}
                </button>
              ) : <div></div>}

              {step < 4 ? (
                <Button
                  type="submit"
                  className="bg-brand-lime text-black hover:bg-lime-400 px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  {step === 3 ? 'مراجعة' : 'التالي'} <ArrowLeft className="mr-2 w-5 h-5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`bg-brand-lime text-black hover:bg-lime-400 font-bold px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-lime-300/20 transition-all ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {isSubmitting ? 'جاري المعالجة...' : 'تأكيد وإرسال'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BriefForm;
