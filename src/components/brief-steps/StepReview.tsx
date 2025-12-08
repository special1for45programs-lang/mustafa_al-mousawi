import React, { forwardRef } from 'react';
import { BriefFormData } from '../../types';
import { APPLICATION_OPTIONS, LOGO_TYPE_EXAMPLES } from '../../constants';
import { X } from 'lucide-react';

interface StepReviewProps {
    formData: BriefFormData;
    removeUploadedFile: (e: React.MouseEvent, index: number) => void;
}

const StepReview = forwardRef<HTMLDivElement, StepReviewProps>(({ formData, removeUploadedFile }, ref) => {
    return (
        <div className="space-y-8 animate-fadeIn" ref={ref}>

            {/* Client Info Reference */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">معلومات العميل</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">اسم العميل</span>
                        <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.clientName || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">اسم الشركة</span>
                        <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.companyName || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">رقم الهاتف</span>
                        <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100" dir="ltr">{formData.phone || '-'}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">البريد الإلكتروني</span>
                        <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100" dir="ltr">{formData.email || '-'}</p>
                    </div>
                </div>
            </div>

            {/* Project Details Reference */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">تفاصيل المشروع</h3>
                </div>
                <div className="space-y-6">
                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">اسم المشروع</span>
                        <p className="font-bold text-gray-900 text-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">{formData.projectName || '-'}</p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">نبذة عن المشروع</span>
                        <p className="font-medium text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap min-h-[100px]">{formData.projectDescription || '-'}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">المجال</span>
                            <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.projectType || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">الألوان المفضلة</span>
                            <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.favoriteColors || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Specs & Timeline */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                    <h3 className="text-xl font-bold text-gray-900">المواصفات والجدول</h3>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">نوع الشعار</span>
                            <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{LOGO_TYPE_EXAMPLES.find(t => t.id === formData.logoType)?.label || formData.logoType}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">الميزانية</span>
                            <div className="font-bold text-black border-2 border-brand-lime bg-brand-lime/10 px-4 py-3 rounded-xl text-center shadow-sm">
                                {formData.budget}$
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <span className="text-sm font-bold text-gray-400 block">التطبيقات المطلوبة</span>
                        <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            {Object.entries(formData.applications).filter(([_, v]) => v).map(([k, _]) => {
                                const app = APPLICATION_OPTIONS.find(a => a.key === k);
                                return <span key={k} className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{app ? app.label.split('(')[0] : k}</span>
                            })}
                            {formData.otherApplication && <span className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 shadow-sm">{formData.otherApplication}</span>}
                            {Object.values(formData.applications).every(v => !v) && !formData.otherApplication && <span className="text-gray-400 italic">لا توجد تطبيقات مختارة</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">تاريخ البدء</span>
                            <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.startDate || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-gray-400 block">تاريخ التسليم</span>
                            <p className="font-bold text-gray-800 text-lg bg-gray-50 p-3 rounded-xl border border-gray-100">{formData.deadline || '-'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Attachments & Notes */}
            {formData.moodboard.length > 0 && (
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">المرفقات</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.moodboard.map((img, index) => (
                            <div key={index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                                <img src={img} alt={`Moodboard ${index + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button type="button" onClick={(e) => removeUploadedFile(e, index)} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {formData.notes && (
                <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                        <h3 className="text-xl font-bold text-gray-900">ملاحظات إضافية</h3>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-800 font-bold whitespace-pre-wrap">
                        {formData.notes}
                    </div>
                </div>
            )}

        </div>
    );
});

StepReview.displayName = 'StepReview';

export default StepReview;
