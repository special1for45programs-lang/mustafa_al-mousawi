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



import { useBriefForm } from '../hooks/useBriefForm';

interface BriefFormProps {
  selectedPackage: SelectedPackage | null;
  onClearPackage: () => void;
  onUpgradePackage?: (pkg: SelectedPackage) => void;
}

const BriefForm: React.FC<BriefFormProps> = ({ selectedPackage, onClearPackage, onUpgradePackage }) => {
  const {
    step,
    setStep,
    isSubmitting,
    isSuccess,
    formData,
    isGeneratingPdf,
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
    downloadPDF,
    handleSubmit
  } = useBriefForm(selectedPackage);

  if (isSuccess) return <SuccessView resetForm={resetForm} />;

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


