import React from 'react';
import { StepProps } from './types';

const StepInfo: React.FC<StepProps> = ({ formData, updateFormData }) => {
    const isSocial = formData.briefType === 'social';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">اسم العميل <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="الاسم الكامل"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="name"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">اسم الشركة / الحساب <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="اسم الشركة، الصفحة، أو اتركه فارغاً"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="organization"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-800">اسم المشروع / النشاط <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="اسم المشروع أو النشاط التجاري"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="on"
                        required
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">رقم الهاتف / واتسآب <span className="text-red-500">*</span></label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="07XX XXX XXXX"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="tel"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">البريد الإلكتروني <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="لاستلام ملفات المشروع"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="email"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                    {isSocial ? 'نبذة تعريفية مختصرة' : 'نبذة عن المشروع / الشركة'}
                    <span className={isSocial ? "text-xs font-normal text-gray-400 mr-1" : "text-red-500 mr-1"}>
                        {isSocial ? '(اختياري)' : '*'}
                    </span>
                </label>
                <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    placeholder={isSocial ? "أي تفاصيل تعريفية عامة عن نشاطك..." : "ما هو نشاط الشركة؟ من هم العملاء المستهدفين؟ ما هي القيم التي تود إيصالها؟"}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed"
                    required={!isSocial}
                ></textarea>
            </div>
            
            {!isSocial && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-800">مجال العمل</label>
                    <input
                        type="text"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        placeholder="مثال: تقنية، مطاعم، ملابس..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                        autoComplete="on"
                    />
                </div>
            </div>
            )}
        </div>
    );
};

export default StepInfo;
