import React from 'react';
import { Check, X, Image as ImageIcon } from 'lucide-react';
import { BriefFormData } from '../../types';
import { SelectedPackage } from '../../App';
import { DESIGN_STYLES } from '../../utils/designConstants';

interface SocialStepReviewProps {
  formData: BriefFormData;
  selectedPackage: SelectedPackage | null;
  removeUploadedFile?: (e: React.MouseEvent, index: number) => void;
}

const Row = ({ label, value }: { label: string; value?: string | string[] | null | React.ReactNode }) => {
  const isEmpty = !value || (Array.isArray(value) && value.length === 0);
  
  return (
    <div className="space-y-1">
      <span className="text-sm font-bold text-gray-400 block">{label}</span>
      {isEmpty ? (
        <p className="font-bold text-gray-400 italic text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
          لم يتم تحديد هذا الخيار
        </p>
      ) : Array.isArray(value) ? (
        <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
          {value.map((v, i) => (
            <span key={i} className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{v}</span>
          ))}
        </div>
      ) : typeof value === 'string' && value.includes('#') ? (
        <div className="flex flex-wrap gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[52px] items-center">
          {value.split('، ').map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-white border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
              <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} />
              <span className="text-xs font-semibold text-gray-700" dir="ltr">{c}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">{value}</div>
      )}
    </div>
  );
};



const SocialStepReview: React.FC<SocialStepReviewProps> = ({ formData, selectedPackage, removeUploadedFile }) => {
  const sd = formData.socialDetails;

  // Fallbacks
  const dsKey = sd?.designStyle ?? '';
  const designStyleObj = DESIGN_STYLES.find(s => s.id === dsKey);

  // Multi-image: use inspirationImages array; fall back to single inspirationImage for old data
  const inspirationImagesArray: string[] =
    sd?.inspirationImages && sd.inspirationImages.length > 0
      ? sd.inspirationImages
      : sd?.inspirationImage ? [sd.inspirationImage] : [];

  return (
    <div className="space-y-6 animate-fadeIn">

      {/* بانر الباقة */}
      {selectedPackage && (
        <div className="bg-brand-lime/10 border border-brand-lime/40 rounded-2xl p-4 flex items-center gap-3">
          <div className="bg-brand-lime w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
            <Check size={18} className="text-black" />
          </div>
          <div>
            <p className="text-xs font-bold text-brand-lime/70 uppercase tracking-wider">الباقة المختارة</p>
            <p className="font-normal text-gray-900">{selectedPackage.name}
              <span className="text-gray-500 font-normal mr-2">({selectedPackage.price.toLocaleString('en-US')} د.ع)</span>
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
            <h3 className="text-xl font-normal text-gray-900">معلومات العميل</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Row label="اسم العميل"        value={formData.clientName} />
            <Row label="اسم الشركة/الحساب" value={formData.companyName} />
            <Row label="رقم الهاتف"        value={<span dir="ltr">{formData.phone || 'لم يتم تحديد هذا الخيار'}</span>} />
            <Row label="البريد الإلكتروني" value={<span dir="ltr">{formData.email || 'لم يتم تحديد هذا الخيار'}</span>} />
            <Row label="مجال العمل"        value={formData.projectType} />
            <Row label="لغة المنشورات"     value={formData.postsLanguage} />
            <div className="space-y-1 md:col-span-2">
                <span className="text-sm font-bold text-gray-400 block">الهوية اللونية</span>
                {sd?.favoriteColors === 'designer_choice' || sd?.favoriteColors === 'متروك للمصمم' ? (
                    <div className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[52px] flex items-center">
                        تُترك الخيارات للمصمم 🎨
                    </div>
                ) : (
                    <div className="-mt-6">
                        <Row label="" value={sd?.favoriteColors} />
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Target Audience Reference */}
      {(formData.targetAge || formData.targetGender || formData.targetDescription) && (
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                  <h3 className="text-xl font-normal text-gray-900">الجمهور المستهدف</h3>
              </div>
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Row label="الفئة العمرية" value={formData.targetAge} />
                      <Row label="الجنس المستهدف" value={formData.targetGender} />
                  </div>
                  <Row label="وصف واهتمامات الجمهور" value={formData.targetDescription} />
              </div>
          </div>
      )}

      {/* Competitors Reference */}
      {formData.competitors && (
          <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                  <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                  <h3 className="text-xl font-normal text-gray-900">المنافسون</h3>
              </div>
              <Row label="المنافسون في السوق" value={formData.competitors} />
          </div>
      )}

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
            <h3 className="text-xl font-normal text-gray-900">تفاصيل السوشيال ميديا</h3>
        </div>
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <Row label="المنصات المستهدفة"       value={sd?.platforms} />
                <Row label="روابط الحسابات الحالية"  value={sd?.currentAccountsLinks} />
                <Row label="أنواع المحتوى"           value={sd?.contentMix} />
                <Row label="جاهزية الشعار والملفات"  value={sd?.assetsAvailability} />
                <Row label="المنتجات / الخدمات"      value={sd?.productsServices} />
            </div>

            {/* Dynamic Posts List */}
            {sd?.postsList && sd.postsList.length > 0 && (
                <div className="space-y-3 mt-6">
                    <span className="text-sm font-bold text-gray-400 block">تفاصيل البوستات المطلوبة ({sd.postsList.length})</span>
                    <div className="grid grid-cols-1 gap-4">
                        {sd.postsList.map((post, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-white text-gray-900 border border-gray-200 px-3 py-1 rounded-full text-xs font-bold">بوست {index + 1}</span>
                                    <span className="text-sm font-bold text-gray-700">
                                        {post.category === 'أخرى (تصنيف مخصص)' ? (post.customCategory || 'أخرى') : post.category}
                                    </span>
                                </div>
                                <div className="font-bold text-gray-900 mt-1">{post.headline || '-'}</div>
                                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{post.concept || '-'}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Visual References */}
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
              <h3 className="text-xl font-normal text-gray-900 flex items-center gap-2">
                  <ImageIcon className="text-gray-900 w-6 h-6" />
                  المراجع البصرية
              </h3>
          </div>

          <div className="space-y-6">
              {/* Design Style */}
              <div className="space-y-2">
                  <span className="text-sm font-bold text-gray-400 block">النمط التصميمي المختار</span>
                  {!dsKey ? (
                      <p className="font-bold text-gray-400 italic text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">لم يتم تحديد هذا الخيار</p>
                  ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          {designStyleObj ? (
                              <>
                                  <img src={designStyleObj.img} alt={designStyleObj.name} className="w-32 h-32 object-cover rounded-lg shadow-sm border border-zinc-200 shrink-0" />
                                  <div className="space-y-1">
                                      <h4 className="font-bold text-gray-900 text-lg">{designStyleObj.name}</h4>
                                      <p className="text-sm text-gray-500 line-clamp-3">{designStyleObj.desc}</p>
                                  </div>
                              </>
                          ) : (
                              <p className="text-gray-800 font-bold">{dsKey}</p>
                          )}
                      </div>
                  )}
              </div>
              
              {/* Inspiration Images */}
              {inspirationImagesArray.length > 0 && (
                  <div className="space-y-2 mt-6">
                      <span className="text-sm font-bold text-gray-400 block">صور النمط المسبق / الاستلهام</span>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {inspirationImagesArray.map((src, i) => (
                                  <div key={i} className="relative rounded-xl overflow-hidden border border-zinc-200 shadow-sm bg-white p-2">
                                      <img src={src} alt={`مرجع ${i + 1}`} className="w-full h-auto max-h-[400px] object-contain rounded-lg" />
                                      {i === 0 && <span className="absolute top-4 right-4 bg-brand-lime text-brand-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">رئيسية</span>}
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              )}
          </div>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
              <h3 className="text-xl font-normal text-gray-900">ملاحظات إضافية</h3>
          </div>
          {!sd?.additionalNotes ? (
              <p className="font-bold text-gray-400 italic text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">لم يتم تحديد هذا الخيار</p>
          ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-800 font-bold whitespace-pre-wrap">
                  {sd?.additionalNotes}
              </div>
          )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 font-bold">
        ✅ بعد الإرسال: سيصلك تأكيد عبر الواتساب خلال ساعة. يرجى التأكد من صحة رقم هاتفك.
      </div>
    </div>
  );
};

export default SocialStepReview;
