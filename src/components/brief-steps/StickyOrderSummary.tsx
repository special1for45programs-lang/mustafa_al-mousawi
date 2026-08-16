import React from 'react';
import { Package, Clock } from 'lucide-react';
import { BriefFormData } from '../../types';
import { SelectedPackage } from '../../App';
import { LOGO_TYPE_EXAMPLES } from '../../constants';
import { DESIGN_STYLES } from '../../utils/designConstants';

interface StickyOrderSummaryProps {
    formData: BriefFormData;
    selectedPackage: SelectedPackage;
    step: number;
    totalSteps: number;
    isSocial: boolean;
}

const StickyOrderSummary: React.FC<StickyOrderSummaryProps> = ({
    formData,
    selectedPackage,
    step,
    totalSteps,
    isSocial,
}) => {
    // Calculate time left (1 min per remaining step)
    const stepsLeft = Math.max(0, totalSteps - step);
    const estimatedTime = stepsLeft * 1;

    // Get selected Logo Type or Design Style
    let selectedStyleName = 'لم يتم التحديد بعد';
    if (isSocial && formData.socialDetails.designStyle) {
        const styleObj = DESIGN_STYLES.find(s => s.id === formData.socialDetails.designStyle);
        if (styleObj) selectedStyleName = styleObj.name;
    } else if (!isSocial && formData.logoDetails.logoType) {
        const typeObj = LOGO_TYPE_EXAMPLES.find(t => t.id === formData.logoDetails.logoType);
        if (typeObj) selectedStyleName = typeObj.label;
    }
    
    // Calculate limit and selected count for logo applications
    let applicationsText = '';
    if (!isSocial) {
        const limit =
            selectedPackage.id === 'lite' ? 2 :
            selectedPackage.id === 'startup' ? 3 :
            selectedPackage.id === 'premium' ? 5 :
            (selectedPackage.id === 'elite' || selectedPackage.id === 'elite_pro') ? 8 : Infinity;
            
        const selectedCount = Object.values(formData.logoDetails.applications || {}).filter(Boolean).length;
        applicationsText = limit === Infinity 
            ? `التطبيقات المختارة: ${selectedCount} (غير محدود)`
            : `التطبيقات المختارة: ${selectedCount} / ${limit}`;
    }

    return (
        <div className="w-full bg-brand-dark text-white p-6 rounded-3xl mt-8 border border-white/10 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div>
                    <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <Package size={20} className="text-brand-lime" />
                        ملخص الطلب
                    </h3>
                    <div className="text-gray-400 text-sm">الباقة المختارة: <span className="text-brand-lime font-bold">{selectedPackage.name}</span></div>
                </div>
                <div className="text-xl font-bold bg-white/5 px-4 py-2 rounded-xl">
                    {selectedPackage.price.toLocaleString('en-US')} د.ع
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex justify-between md:flex-col items-center md:items-start text-sm">
                    <span className="text-gray-400 mb-1">{isSocial ? 'النمط المختار' : 'نوع الشعار'}</span>
                    <span className="font-bold text-base">{step >= (isSocial ? 2 : 3) ? selectedStyleName : 'لم يتم التحديد بعد'}</span>
                </div>

                {!isSocial && step >= 4 && (
                    <div className="flex justify-between md:flex-col items-center md:items-start text-sm">
                        <span className="text-gray-400 mb-1">التطبيقات</span>
                        <span className="font-bold text-base">{applicationsText}</span>
                    </div>
                )}
            </div>

            <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center gap-2">
                <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-gray-400">التقدم: الخطوة {step} من {totalSteps}</span>
                    <span className="flex items-center gap-1 text-brand-lime font-bold">
                        <Clock size={14} />
                        {estimatedTime > 0 ? `باقي ${estimatedTime} دقيقة` : 'الخطوة الأخيرة'}
                    </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                        className="bg-brand-lime h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StickyOrderSummary;
