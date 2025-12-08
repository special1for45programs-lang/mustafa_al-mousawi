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
  });

  // --- Auto-Save Logic Start ---
  // استعادة البيانات المحفوظة عند تحميل المكون
  useEffect(() => {
    const savedData = localStorage.getItem('briefFormData');
    const savedStep = localStorage.getItem('briefFormStep');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved form data", e);
      }
    }
    if (savedStep) {
      setStep(parseInt(savedStep));
    }
  }, []);

  // حفظ البيانات عند كل تغيير
  useEffect(() => {
    // لا تقم بالحفظ إذا كنا في حالة النجاح (لأننا نريد تنظيف النموذج)
    if (!isSuccess) {
      localStorage.setItem('briefFormData', JSON.stringify(formData));
      localStorage.setItem('briefFormStep', step.toString());
    }
  }, [formData, step, isSuccess]);
  // --- Auto-Save Logic End ---

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

    // مسح البيانات المحفوظة
    localStorage.removeItem('briefFormData');
    localStorage.removeItem('briefFormStep');
  };

  // دالة توليد ملف PDF وإرساله عبر API
  const generateAndSendPDF = async () => {
    setIsSubmitting(true);
    console.log('[Frontend] Starting PDF generation...');

    try {
      // 1. توليد كود HTML من المكون
      console.log('[Frontend] Rendering PDF template...');
      const pdfContentArray = [
        renderToStaticMarkup(<BriefPdfTemplate formData={formData} />)
      ];

      const pdfHtml = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    'brand-lime': '#ccff00',
                    'brand-black': '#0a0a0a',
                    'brand-dark': '#1a1a1a',
                    'brand-gray': '#333333',
                  },
                  fontFamily: {
                    sans: ['Arial', 'sans-serif'],
                  }
                }
              }
            }
          </script>
          <style>
             @import url('https://fonts.googleapis.com/css2?family=Dubai:wght@300;400;500;700&display=swap');
             body { font-family: 'Dubai', 'Arial', sans-serif; }
          </style>
        </head>
        <body>
          ${pdfContentArray[0]}
        </body>
        </html>
      `;

      console.log('[Frontend] HTML generated, size:', pdfHtml.length, 'characters');

      // 2. إرسال إلى الـ API
      console.log('[Frontend] Calling API endpoint: /api/generate-brief-pdf');
      const response = await fetch('/api/generate-brief-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          html: pdfHtml,
          projectName: formData.projectName,
          clientName: formData.clientName,
          companyName: formData.companyName,
          clientEmail: formData.email
        }),
      });

      console.log('[Frontend] API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('[Frontend] API error response:', errorText);
        throw new Error(`فشل في إنشاء ملف PDF: ${response.status} - ${errorText}`);
      }

      // 3. تحميل ملف PDF الناتج
      console.log('[Frontend] Creating blob from response...');
      const blob = await response.blob();
      console.log('[Frontend] Blob created, size:', blob.size, 'bytes, type:', blob.type);

      if (blob.size === 0) {
        throw new Error('ملف PDF فارغ - فشل في إنشاء الملف');
      }

      console.log('[Frontend] Triggering download...');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Brief_${formData.projectName || 'Project'}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      console.log('[Frontend] PDF downloaded successfully!');

      // إشعار العميل بأن الملف تم تحميله بنجاح
      toast.success('✅ تم تحميل ملف PDF على جهازك بنجاح!', {
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

    } catch (error) {
      console.error('[Frontend] PDF Generation/Sending Error:', error);
      alert(`حدث خطأ أثناء المعالجة أو الإرسال:\n${error instanceof Error ? error.message : 'خطأ غير معروف'}\n\nيرجى التحقق من وحدة التحكم (Console) للحصول على مزيد من التفاصيل.`);
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

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">ابدأ مشروعك</h2>
          <p className="text-gray-400 text-lg">دعنا نحول رؤيتك إلى واقع ملموس</p>
        </div>

        {/* شريط التقدم (Step Indicator) */}
        <div className="flex justify-between items-center max-w-2xl mx-auto mb-16 relative">
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
