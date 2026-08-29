import React from 'react';
import { StepProps } from './types';

const StepInfo: React.FC<StepProps> = ({ formData, updateFormData }) => {
    const isSocial = formData.briefType === 'social';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
                        className="form-input-clean"
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
                        className="form-input-clean"
                        autoComplete="organization"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-semibold text-slate-800">{isSocial ? 'اسم الحساب / العلامة التجارية' : 'اسم المشروع / الشعار'} <span className="text-red-500">*</span></label>
                    <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        placeholder={isSocial ? "اكتب اسم حسابك كما يظهر للمتابعين..." : "اكتب الاسم المراد تصميمه بدقة (مثل: أبل، سامسونج...)"}
                        className="form-input-clean"
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
                        className="form-input-clean"
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
                        className="form-input-clean"
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
                    placeholder={isSocial ? "حدثنا عن حسابك... ما هي الخدمات أو المنتجات التي تقدمها؟ وما هو هدفك من هذه المنشورات؟" : "حدثنا عن مشروعك كأنك تروي قصة... ما هي فكرة المشروع؟ وما القيمة التي تميزك عن غيرك؟"}
                    className="form-input-clean h-32 resize-none leading-relaxed"
                    required={!isSocial}
                ></textarea>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">
                    المنافسون <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span>
                </label>
                <textarea
                    name="competitors"
                    value={formData.competitors || ''}
                    onChange={handleChange}
                    placeholder="اذكر 2 أو 3 من أهم منافسيك في السوق، أو ضع روابط حساباتهم..."
                    className="form-input-clean h-32 resize-none leading-relaxed"
                ></textarea>
            </div>
            
            <div className="space-y-6 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {!isSocial && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">مجال العمل</label>
                        <input
                            type="text"
                            name="projectType"
                            value={formData.projectType}
                            onChange={handleChange}
                            placeholder="مثال: تقنية، مطاعم، ملابس..."
                            className="form-input-clean"
                            autoComplete="on"
                        />
                    </div>
                    )}
                    {!isSocial && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">لغة الشعار <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                        <div className="relative">
                            <select
                                name="logoLanguage"
                                value={formData.logoLanguage || ''}
                                onChange={handleChange}
                                className="form-input-clean bg-white font-semibold appearance-none focus:border-brand-lime"
                            >
                                <option value="" disabled className="text-gray-900">اختر لغة الشعار...</option>
                                <option value="عربي فقط" className="text-gray-900">عربي فقط</option>
                                <option value="إنجليزي فقط" className="text-gray-900">إنجليزي فقط</option>
                                <option value="دمج عربي وإنجليزي" className="text-gray-900">دمج عربي وإنجليزي</option>
                                <option value="رمز فقط بدون نص" className="text-gray-900">رمز فقط بدون نص</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    )}
                    {isSocial && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">لغة المنشورات <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                        <div className="relative">
                            <select
                                name="postsLanguage"
                                value={formData.postsLanguage || ''}
                                onChange={handleChange}
                                className="form-input-clean bg-white font-semibold appearance-none focus:border-brand-lime"
                            >
                                <option value="" disabled className="text-gray-900">اختر لغة المنشورات...</option>
                                <option value="عربي فقط" className="text-gray-900">عربي فقط</option>
                                <option value="إنجليزي فقط" className="text-gray-900">إنجليزي فقط</option>
                                <option value="مزج بين اللغتين" className="text-gray-900">مزج بين اللغتين</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    )}
                </div>

                {/* الجمهور المستهدف */}
                <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-base font-bold text-slate-900 mb-4">الجمهور المستهدف</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-800">الفئة العمرية <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                            <div className="relative">
                                <select
                                    name="targetAge"
                                    value={formData.targetAge || ''}
                                    onChange={handleChange}
                                    className="form-input-clean bg-white font-semibold appearance-none focus:border-brand-lime"
                                >
                                    <option value="" disabled className="text-gray-900">اختر الفئة...</option>
                                    <option value="أطفال" className="text-gray-900">أطفال</option>
                                    <option value="مراهقين" className="text-gray-900">مراهقين</option>
                                    <option value="شباب" className="text-gray-900">شباب</option>
                                    <option value="كبار السن" className="text-gray-900">كبار السن</option>
                                    <option value="جميع الفئات" className="text-gray-900">جميع الفئات</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-800">الجنس المستهدف <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                            <div className="relative">
                                <select
                                    name="targetGender"
                                    value={formData.targetGender || ''}
                                    onChange={handleChange}
                                    className="form-input-clean bg-white font-semibold appearance-none focus:border-brand-lime"
                                >
                                    <option value="" disabled className="text-gray-900">اختر الجنس...</option>
                                    <option value="رجال" className="text-gray-900">رجال</option>
                                    <option value="نساء" className="text-gray-900">نساء</option>
                                    <option value="كلاهما" className="text-gray-900">كلاهما</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-800">وصف واهتمامات الجمهور <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span></label>
                        <textarea
                            name="targetDescription"
                            value={formData.targetDescription || ''}
                            onChange={handleChange}
                            placeholder="مثال: أصحاب الشركات الناشئة، أو رياضيين مهتمين بالأكل الصحي..."
                            className="form-input-clean h-24 resize-none leading-relaxed"
                        ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(StepInfo);
