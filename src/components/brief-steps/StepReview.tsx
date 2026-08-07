import React, { forwardRef } from 'react';
import { BriefFormData } from '../../types';
import { APPLICATION_OPTIONS, LOGO_TYPE_EXAMPLES } from '../../constants';
import { X, Image as ImageIcon } from 'lucide-react';

interface StepReviewProps {
    formData: BriefFormData;
    removeUploadedFile: (e: React.MouseEvent, index: number) => void;
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

const StepReview = forwardRef<HTMLDivElement, StepReviewProps>(({ formData, removeUploadedFile }, ref) => {
    if (import.meta.env.DEV) console.log('[DEV] StepReview formData:', formData);


    const logo = formData.logoDetails;
    
    // Fallbacks
    const moodboardArray: string[] = logo.moodboard ?? [];

    return (
        <div className="space-y-8 animate-fadeIn" ref={ref}>

            {/* Client Info Reference */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-normal text-gray-900">معلومات العميل</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Row label="اسم العميل" value={formData.clientName} />
                    <Row label="اسم الشركة" value={formData.companyName} />
                    <Row label="رقم الهاتف" value={<span dir="ltr">{formData.phone || 'لم يتم تحديد هذا الخيار'}</span>} />
                    <Row label="البريد الإلكتروني" value={<span dir="ltr">{formData.email || 'لم يتم تحديد هذا الخيار'}</span>} />
                </div>
            </div>

            {/* Project Details Reference */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-normal text-gray-900">تفاصيل المشروع</h3>
                </div>
                <div className="space-y-6">
                    <Row label="اسم المشروع" value={formData.projectName} />
                    <Row label="نبذة عن المشروع" value={formData.projectDescription} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Row label="المجال" value={formData.projectType} />
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">الهوية اللونية</span>
                            {logo.favoriteColors === 'image_inspiration' && logo.inspirationImage ? (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-center min-h-[52px]">
                                    <img src={logo.inspirationImage} className="w-24 h-24 object-cover rounded-lg border border-zinc-300 shadow-sm" alt="استلهام الألوان" />
                                </div>
                            ) : logo.favoriteColors === 'designer_choice' ? (
                                <div className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100 min-h-[52px] flex items-center">
                                    تُترك الخيارات للمصمم 🎨
                                </div>
                            ) : (
                                <div className="-mt-6">
                                    <Row label="" value={logo.favoriteColors} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Specs & Timeline */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-normal text-gray-900">المواصفات والجدول</h3>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        <Row label="نوع الشعار" value={LOGO_TYPE_EXAMPLES.find(t => t.id === logo.logoType)?.label || logo.logoType} />
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">التطبيقات المطلوبة</span>
                        <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {Object.entries(logo.applications || {}).filter(([_, v]) => v).map(([k, _]) => {
                                const app = APPLICATION_OPTIONS.find(a => a.key === k);
                                return <span key={k} className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{app ? app.label.split('(')[0] : k}</span>
                            })}
                            {logo.otherApplication && <span className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{logo.otherApplication}</span>}
                            {Object.values(logo.applications || {}).every(v => !v) && !logo.otherApplication && <span className="text-gray-400 italic text-sm font-bold">لم يتم تحديد هذا الخيار</span>}
                        </div>
                    </div>
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


                    {/* Moodboard */}
                    <div className="space-y-2">
                        <span className="text-sm font-bold text-gray-400 block">صور التصور المبدئي ({moodboardArray.length})</span>
                        {moodboardArray.length === 0 ? (
                            <p className="font-bold text-gray-400 italic text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">لم يتم تحديد هذا الخيار</p>
                        ) : (
                            <div className="flex flex-wrap gap-3">
                                {moodboardArray.map((img: string, index: number) => (
                                    <div key={index} className="relative group overflow-hidden border border-zinc-200 rounded-lg aspect-square bg-white w-20 h-20 sm:w-24 sm:h-24">
                                        <img src={img} alt={`Moodboard ${index + 1}`} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                            <button type="button" onClick={(e) => removeUploadedFile(e, index)} className="bg-red-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-105">
                                                <X size={16} className="sm:w-5 sm:h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-normal text-gray-900">ملاحظات إضافية</h3>
                </div>
                {!logo.notes ? (
                    <p className="font-bold text-gray-400 italic text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">لم يتم تحديد هذا الخيار</p>
                ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-800 font-bold whitespace-pre-wrap">
                        {logo.notes}
                    </div>
                )}
            </div>

        </div>
    );
});

StepReview.displayName = 'StepReview';

export default StepReview;

