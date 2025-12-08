import React from 'react';
import { StepProps } from './types';
import { APPLICATION_OPTIONS } from '../../constants';

const StepDetails: React.FC<StepProps> = ({ formData, updateFormData }) => {
    const handleCheckboxChange = (category: 'applications', name: string) => {
        updateFormData({
            [category]: {
                ...formData[category],
                [name]: !formData[category][name as keyof typeof formData['applications']]
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateFormData({ [e.target.name]: e.target.value });
    };


    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Applications */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">التطبيقات المطلوبة</h3>
                <p className="text-gray-500 text-sm">اختر المنتجات التي تريد تطبيق الشعار عليها</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {APPLICATION_OPTIONS.map((option) => (
                        <div
                            key={option.key}
                            onClick={() => handleCheckboxChange('applications', option.key)}
                            className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all ${formData.applications[option.key] ? 'border-brand-lime bg-brand-lime/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${formData.applications[option.key] ? 'bg-brand-lime border-brand-lime' : 'border-gray-300 bg-white'}`}>
                                {formData.applications[option.key] && <span className="text-black font-bold">✓</span>}
                            </div>
                            <span className={`font-bold ${formData.applications[option.key] ? 'text-gray-900' : 'text-gray-500'}`}>{option.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="text-sm font-bold text-gray-500 block mb-2">تطبيقات أخرى (اختياري)</label>
                    <input
                        type="text"
                        name="otherApplication"
                        value={formData.otherApplication}
                        onChange={handleChange}
                        placeholder="أضف تطبيقات أخرى مفصولة بفاصلة..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>

            </div>

            {/* Budget & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="space-y-4 md:col-span-2">
                    <label className="text-sm font-bold text-gray-500">الميزانية المقترحة</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {['20-50', '50-100', '100-150', '150-200', '200-500'].map((range) => (
                            <label key={range} className={`cursor-pointer text-center py-3 rounded-xl border-2 transition-all font-bold text-sm ${formData.budget === range ? 'bg-brand-lime border-brand-lime text-black' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                                {range}$
                                <input type="radio" name="budget" value={range} checked={formData.budget === range} onChange={handleChange} className="hidden" />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">تاريخ البدء</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-500">تاريخ التسليم</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500">ملاحظات إضافية</label>
                <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="أي تفاصيل أخرى تود إضافتها..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-bold text-gray-900 placeholder:text-gray-400 resize-none"
                ></textarea>
            </div>

        </div>
    );
};

export default StepDetails;
