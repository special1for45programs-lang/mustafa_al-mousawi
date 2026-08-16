import React, { useMemo } from 'react';
import { LogoDetails } from '../../types';
import { APPLICATION_CATEGORIES, PACKAGES_DATA } from '../../constants';
import { SelectedPackage } from '../../App';
import { Lock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface StepDetailsProps {
    logoDetails: LogoDetails;
    updateLogoDetails: (data: Partial<LogoDetails>) => void;
    selectedPackage?: SelectedPackage | null;
    onUpgradePackage?: (pkg: SelectedPackage) => void;
}

const StepDetails: React.FC<StepDetailsProps> = ({ logoDetails, updateLogoDetails, selectedPackage, onUpgradePackage }) => {

    const limit = useMemo(() => {
        if (!selectedPackage) return 2;
        if (selectedPackage.id === 'lite') return 2;
        if (selectedPackage.id === 'startup') return 3;
        if (selectedPackage.id === 'premium') return 5;
        if (selectedPackage.id === 'elite' || selectedPackage.id === 'elite_pro') return 8;
        return Infinity; // Full Branding or others
    }, [selectedPackage]);

    const selectedCount = Object.values(logoDetails.applications || {}).filter(Boolean).length;

    const handleCheckboxChange = (category: 'applications', name: string) => {
        const isCurrentlySelected = logoDetails.applications?.[name];
        
        if (!isCurrentlySelected && selectedCount >= limit) {
            toast.error(`لقد وصلت للحد الأقصى المسموح (${limit} تطبيقات) لباقتك الحالية.`);
            return;
        }

        updateLogoDetails({
            [category]: {
                ...logoDetails[category],
                [name]: !isCurrentlySelected
            }
        });
    };

    const handleUpgrade = () => {
        if (onUpgradePackage) {
            const b = PACKAGES_DATA.branding;
            onUpgradePackage({
                id: 'branding',
                name: b.name,
                nameEn: 'FULL BRANDING',
                price: b.currentPrice,
                type: 'branding'
            });
            toast.success('تم الترقية إلى باقة الهوية الشاملة بنجاح!');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateLogoDetails({ [e.target.name]: e.target.value });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Applications */}
            <div className="space-y-4">
                <h3 className="text-lg font-normal text-gray-900">التطبيقات المطلوبة</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-gray-500 text-sm">اختر المنتجات التي تريد تطبيق الشعار عليها</p>
                    {limit < Infinity && (
                        <div className="bg-brand-lime/10 border border-brand-lime text-brand-dark px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 w-fit">
                            <span>متبقي لك {Math.max(0, limit - selectedCount)} من أصل {limit} تطبيقات</span>
                        </div>
                    )}
                </div>
                <div className="space-y-6">
                    {limit < Infinity && (
                        <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="bg-amber-500/20 p-2 rounded-full">
                                    <Zap size={20} className="text-amber-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-amber-900 text-sm sm:text-base">تحتاج تطبيقات إضافية لمشروعك؟</p>
                                    <p className="text-amber-700 text-xs sm:text-sm">قم بترقية باقتك إلى الهوية الشاملة لفتح كافة المزايا بدون حدود.</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors whitespace-nowrap"
                            >
                                ترقية الباقة الآن
                            </button>
                        </div>
                    )}
                    
                    {APPLICATION_CATEGORIES.map((category, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <h4 className="font-bold text-gray-800 mb-3">{category.title}</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                {category.items.map((option) => {
                                    const isSelected = !!logoDetails.applications?.[option.key];
                                    const isLocked = !isSelected && selectedCount >= limit;
                                    
                                    return (
                                        <div
                                            key={option.key}
                                            onClick={() => !isLocked && handleCheckboxChange('applications', option.key)}
                                            className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 bg-white 
                                                ${isSelected ? 'border-brand-lime bg-brand-lime/5 cursor-pointer hover:-translate-y-1 hover:shadow-xl' : 
                                                  isLocked ? 'border-gray-100 opacity-50 cursor-not-allowed' : 'border-gray-200 hover:border-gray-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl'}`}
                                        >
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <div className={`w-5 h-5 sm:w-5 sm:h-5 rounded border flex items-center justify-center shrink-0 transition-colors 
                                                    ${isSelected ? 'bg-brand-lime border-brand-lime' : 'border-gray-300 bg-white'}`}>
                                                    {isSelected && <span className="text-black font-bold text-[10px] sm:text-xs">✓</span>}
                                                </div>
                                                <span className={`font-bold text-xs sm:text-sm truncate 
                                                    ${isSelected ? 'text-gray-900' : isLocked ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                                                    {option.label}
                                                </span>
                                            </div>
                                            {isLocked && (
                                                <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                                    <Lock size={10} />
                                                    <span className="hidden lg:inline">متاح في الباقات الأعلى أو الهوية الشاملة</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
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
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
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
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">تاريخ التسليم</label>
                    <input
                        type="date"
                        name="deadline"
                        value={logoDetails.deadline}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400"
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
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none"
                ></textarea>
            </div>

        </div>
    );
};

export default StepDetails;
