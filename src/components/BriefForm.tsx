import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Download, Send } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import toast from 'react-hot-toast';
import BriefPdfDocument from './BriefPdfDocument';
import { Button } from './ui/Button';
import { BriefFormData } from '../types';
import { APPLICATION_OPTIONS } from '../constants';
import { useFormAutosave, loadSavedFormData, clearSavedFormData } from '../hooks/useFormAutosave';

// Import New Components
import StepInfo from './brief-steps/StepInfo';
import StepStyle from './brief-steps/StepStyle';
import StepDetails from './brief-steps/StepDetails';
import StepReview from './brief-steps/StepReview';
import SuccessView from './brief-steps/SuccessView';

// مفتاح حفظ البيانات في localStorage
const FORM_STORAGE_KEY = 'brief_form_data';

// البيانات المبدئية للاستمارة
const getInitialFormData = (): BriefFormData => ({
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
});

// مكون استمارة بدء المشروع (Brief Form)
const BriefForm: React.FC = () => {
  const [step, setStep] = useState(1); // تتبع خطوة الاستمارة الحالية
  const [isSubmitting, setIsSubmitting] = useState(false); // حالة الإرسال (توليد PDF)
  const [isSuccess, setIsSuccess] = useState(false); // حالة النجاح
  const [showRestorePrompt, setShowRestorePrompt] = useState(false); // حالة نافذة الاستعادة

  // الحالة المبدئية للبيانات
  const [formData, setFormData] = useState<BriefFormData>(getInitialFormData());

  // مرجع لحاوية النموذج للتمرير إليها
  const formRef = useRef<HTMLDivElement>(null);
  // مرجع لتتتبع التحميل الأول (لمنع التمرير عند فتح الصفحة)
  const isFirstRender = useRef(true);

  // تفعيل الحفظ التلقائي
  useFormAutosave(FORM_STORAGE_KEY, formData, 2000);

  // التحقق من وجود بيانات محفوظة عند التحميل
  useEffect(() => {
    const savedData = loadSavedFormData<BriefFormData>(FORM_STORAGE_KEY);
    if (savedData && (savedData.clientName || savedData.projectName || savedData.companyName)) {
      // إظهار نافذة الاستعادة فقط إذا كانت هناك بيانات مهمة
      setShowRestorePrompt(true);
    }
  }, []);

  // استعادة البيانات المحفوظة
  const handleRestoreData = () => {
    const savedData = loadSavedFormData<BriefFormData>(FORM_STORAGE_KEY);
    if (savedData) {
      setFormData(savedData);
      toast.success('✅ تم استعادة البيانات المحفوظة!', {
        duration: 3000,
        style: { background: '#1a1a1a', color: '#fff', border: '1px solid #ccff00' },
      });
    }
    setShowRestorePrompt(false);
  };

  // تجاهل البيانات المحفوظة
  const handleDiscardSavedData = () => {
    clearSavedFormData(FORM_STORAGE_KEY);
    setShowRestorePrompt(false);
  };

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

  // حالات توليد وتحميل PDF
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isPdfDownloaded, setIsPdfDownloaded] = useState(false);

  // دالة توليد وتحميل PDF على جانب العميل
  const downloadPDF = async () => {
    setIsGeneratingPdf(true);
    console.log('[Frontend] 📄 Generating PDF on client-side...');
    console.log('[Frontend] Form data:', JSON.stringify(formData, null, 2));

    try {
      // توليد PDF باستخدام @react-pdf/renderer
      console.log('[Frontend] Creating PDF document...');
      const pdfDoc = <BriefPdfDocument formData={formData} />;

      console.log('[Frontend] Converting to blob...');
      const blob = await pdf(pdfDoc).toBlob();

      console.log('[Frontend] Blob created, size:', blob.size);

      // إنشاء رابط تحميل
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Brief_${formData.projectName || 'Project'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('[Frontend] ✅ PDF downloaded successfully!');

      // تفعيل حالة "تم التحميل" لإظهار زر الإرسال
      setIsPdfDownloaded(true);

      toast.success('✅ تم تحميل ملف PDF بنجاح! يمكنك الآن إرساله للمصمم', {
        duration: 4000,
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

    } catch (error: any) {
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      const errorStack = error?.stack || '';
      console.error('[Frontend] ❌ PDF Generation Error:', errorMessage);
      console.error('[Frontend] ❌ Error Stack:', errorStack);
      console.error('[Frontend] ❌ Full Error Object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

      toast.error(`حدث خطأ أثناء توليد PDF: ${errorMessage.substring(0, 100)}`, {
        duration: 7000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ff0000',
        },
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // دالة إرسال البيانات إلى API (بدون PDF)
  const sendFormData = async () => {
    setIsSubmitting(true);
    console.log('[Frontend] 📤 Sending form data to API...');

    try {
      // إرسال البيانات إلى الـ API
      const response = await fetch('/api/generate-brief-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData }),
      });

      if (!response.ok) {
        let errorMsg = `Server Error (${response.status})`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.details || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          // If JSON parsing fails, use the status text instead
          errorMsg = response.statusText || errorMsg;
        }
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('[Frontend] ✅ Success:', result.message);

      // إشعار العميل بالنجاح
      toast.success('✅ تم إرسال البيانات بنجاح!', {
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
      console.error('[Frontend] ❌ Error:', error);
      const errorMessage = error instanceof Error ? error.message : typeof error === 'object' ? JSON.stringify(error) : String(error);
      toast.error(`حدث خطأ: ${errorMessage}`, {
        duration: 7000,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid #ff0000',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // معالجة التنقل بين الخطوات والإرسال النهائي
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
    } else if (isPdfDownloaded) {
      // الإرسال بعد تحميل PDF
      const shouldProceed = window.confirm(
        "📧 سيتم إرسال تفاصيل المشروع إلى المصمم عبر البريد الإلكتروني\n" +
        "📱 وإرسال نسخة عبر التليقرام\n\n" +
        "هل تود المتابعة؟"
      );
      if (shouldProceed) {
        sendFormData();
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
            <p className="text-gray-500 mb-8">قد تستغرق هذه العملية حتى 15 ثانية</p>

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
                  <span>سيتم إنشاء ملف PDF احترافي بتصميم عالي الجودة</span>
                  <span>📄</span>
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

      {/* نافذة استعادة البيانات المحفوظة */}
      {showRestorePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4 text-center" dir="rtl">
            <div className="w-16 h-16 bg-brand-lime/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-brand-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">وجدنا بيانات محفوظة!</h3>
            <p className="text-gray-500 mb-6">
              يبدو أنك كنت تملأ استمارة سابقاً. هل تريد استعادة البيانات المحفوظة؟
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleDiscardSavedData}
                className="px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-bold transition-all"
              >
                البدء من جديد
              </button>
              <button
                onClick={handleRestoreData}
                className="px-6 py-3 bg-brand-lime text-black hover:bg-lime-400 rounded-xl font-bold transition-all shadow-lg"
              >
                استعادة البيانات
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto md:pr-4 lg:pr-8 xl:pr-12 relative z-10">

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
                /* زر واحد يتغير حسب الحالة */
                !isPdfDownloaded ? (
                  /* زر تحميل PDF */
                  <button
                    type="button"
                    onClick={downloadPDF}
                    disabled={isGeneratingPdf}
                    className={`flex items-center gap-3 bg-brand-lime text-black hover:bg-lime-400 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-lime-300/20 transition-all ${isGeneratingPdf ? 'opacity-75 cursor-wait' : ''}`}
                  >
                    <Download className="w-6 h-6" />
                    {isGeneratingPdf ? 'جاري إنشاء الملف...' : 'تحميل ملف PDF'}
                  </button>
                ) : (
                  /* زر إرسال للمصمم */
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-3 bg-brand-lime text-black hover:bg-lime-400 font-bold px-10 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl hover:shadow-lime-300/20 transition-all animate-pulse ${isSubmitting ? 'opacity-75 cursor-wait animate-none' : ''}`}
                  >
                    <Send className="w-6 h-6" />
                    {isSubmitting ? 'جاري الإرسال...' : 'إرسال للمصمم'}
                  </Button>
                )
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BriefForm;
