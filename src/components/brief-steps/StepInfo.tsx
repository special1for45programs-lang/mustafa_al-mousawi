import React from 'react';
import { StepProps } from './types';

const StepInfo: React.FC<StepProps> = ({ formData, updateFormData }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">اسم العميل <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleChange}
                        placeholder="الاسم الكامل"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">اسم الشركة</label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="اسم الشركة أو المؤسسة"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">اسم المشروع (للتضمين في الشعار)</label>
                    <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder="الاسم كما سيظهر في الشعار"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">رقم الهاتف</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="يفضل رقم واتساب"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">البريد الإلكتروني <span className="text-red-500">*</span></label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="لاستلام ملفات المشروع"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">نبذة عن المشروع / الشركة <span className="text-red-500">*</span></label>
                <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleChange}
                    placeholder="ما هو نشاط الشركة؟ من هم العملاء المستهدفين؟ ما هي القيم التي تود إيصالها؟"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400 resize-none leading-relaxed"
                    required
                ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">مجال العمل</label>
                    <input
                        type="text"
                        name="projectType"
                        value={formData.projectType}
                        onChange={handleChange}
                        placeholder="مثال: عقارات، تقنية، مطعم..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">الألوان المفضلة</label>
                    <input
                        type="text"
                        name="favoriteColors"
                        value={formData.favoriteColors}
                        onChange={handleChange}
                        placeholder="مثال: أزرق وذهبي، ألوان ترابية..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>
        </div>
    );
};

export default StepInfo;
