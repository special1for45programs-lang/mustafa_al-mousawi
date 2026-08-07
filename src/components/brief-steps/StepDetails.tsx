import React from 'react';
import { LogoDetails } from '../../types';
import { APPLICATION_OPTIONS } from '../../constants';

interface StepDetailsProps {
    logoDetails: LogoDetails;
    updateLogoDetails: (data: Partial<LogoDetails>) => void;
}

const StepDetails: React.FC<StepDetailsProps> = ({ logoDetails, updateLogoDetails }) => {
    const handleCheckboxChange = (category: 'applications', name: string) => {
        updateLogoDetails({
            [category]: {
                ...logoDetails[category],
                [name]: !logoDetails[category][name as keyof typeof logoDetails['applications']]
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateLogoDetails({ [e.target.name]: e.target.value });
    };


    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Applications */}
            <div className="space-y-4">
                <h3 className="text-lg font-normal text-gray-900">التطبيقات المطلوبة</h3>
                <p className="text-gray-500 text-sm">اختر المنتجات التي تريد تطبيق الشعار عليها</p>
                <div className="grid grid-cols-2 md:grid-cols-2 gap-2 sm:gap-3">
                    {APPLICATION_OPTIONS.map((option) => (
                        <div
                            key={option.key}
                            onClick={() => handleCheckboxChange('applications', option.key)}
                            className={`py-2 px-2.5 sm:p-4 rounded-xl border-2 cursor-pointer flex items-center gap-2 sm:gap-3 transition-all ${logoDetails.applications[option.key] ? 'border-brand-lime bg-brand-lime/5' : 'border-gray-200 hover:border-gray-300'}`}
                        >
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${logoDetails.applications[option.key] ? 'bg-brand-lime border-brand-lime' : 'border-gray-300 bg-white'}`}>
                                {logoDetails.applications[option.key] && <span className="text-black font-bold text-xs sm:text-sm">✓</span>}
                            </div>
                            <span className={`font-bold text-xs sm:text-base truncate ${logoDetails.applications[option.key] ? 'text-gray-900' : 'text-gray-500'}`}>{option.label}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-4">
                    <label className="text-sm font-semibold text-slate-800 block mb-2">تطبيقات أخرى (اختياري)</label>
                    <input
                        type="text"
                        name="otherApplication"
                        value={logoDetails.otherApplication}
                        onChange={handleChange}
                        placeholder="أضف تطبيقات أخرى مفصولة بفاصلة..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400"
                    />
                </div>

            </div>

            {/* Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">تاريخ البدء</label>
                    <input
                        type="date"
                        name="startDate"
                        value={logoDetails.startDate}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">تاريخ التسليم</label>
                    <input
                        type="date"
                        name="deadline"
                        value={logoDetails.deadline}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-800">ملاحظات إضافية</label>
                <textarea
                    name="notes"
                    value={logoDetails.notes}
                    onChange={handleChange}
                    placeholder="أي تفاصيل أخرى تود إضافتها..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400 resize-none"
                ></textarea>
            </div>

        </div>
    );
};

export default StepDetails;
