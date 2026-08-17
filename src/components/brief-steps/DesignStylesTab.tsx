import React, { useState, useEffect } from 'react';
import { CheckCircle2, ExternalLink, Search } from 'lucide-react';
import { BriefFormData } from '../../types';
import { DESIGN_STYLES } from '../../utils/designConstants';

interface DesignStylesProps {
    formData: BriefFormData;
    updateDomainData: (data: any) => void;
    onGoToPatternTab?: () => void;
}

export const DesignStylesTab: React.FC<DesignStylesProps> = ({ formData, updateDomainData, onGoToPatternTab }) => {
    const isSocial = formData.briefType === 'social';
    const activeDomain = isSocial ? formData.socialDetails : formData.logoDetails;
    const [selectedStyle, setSelectedStyle] = useState<string>(activeDomain.designStyle || '');
    
    useEffect(() => {
        setSelectedStyle(activeDomain.designStyle || '');
    }, [activeDomain.designStyle]);
    
    const handleStyleSelect = (styleId: string) => {
        setSelectedStyle(styleId);
        updateDomainData({ designStyle: styleId });
    };

    return (
        <div className="w-full mx-auto animate-fadeIn">
            <div className="text-center mb-6 sm:mb-8">
                <h4 className="text-xl sm:text-2xl text-white font-bold mb-1.5 sm:mb-2">أنماط التصميم</h4>
                <p className="text-gray-400 text-xs sm:text-sm">اختر النمط البصري الذي يمثل علامتك التجارية على وسائل التواصل الاجتماعي.</p>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-4 items-start w-full">
                {DESIGN_STYLES.map((style) => {
                    const isSelected = selectedStyle === style.id;
                    return (
                        <div 
                            key={style.id} 
                            className={`group relative flex flex-col rounded-lg sm:rounded-2xl overflow-hidden bg-zinc-900/90 border transition-all duration-300 shadow-lg ${
                                isSelected 
                                    ? 'border-brand-lime shadow-[0_0_20px_rgba(204,255,0,0.2)] scale-[1.01]' 
                                    : 'border-zinc-800 hover:border-brand-lime/50'
                            }`}
                        >
                            {/* Top Image Banner (1:1 Aspect Ratio) */}
                            <button 
                                type="button" 
                                onClick={() => handleStyleSelect(style.id)}
                                className="relative w-full aspect-square overflow-hidden bg-zinc-950 rounded-t-lg sm:rounded-t-2xl text-right focus:outline-none"
                            >
                                <img 
                                    src={style.img} 
                                    alt={style.name} 
                                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                />
                                {isSelected && (
                                    <div className="absolute top-1 right-1 sm:top-3 sm:right-3 bg-brand-lime text-black rounded-full p-0.5 sm:p-1.5 shadow-lg z-20">
                                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
                                    </div>
                                )}
                            </button>
                            
                            {/* Bottom Content Box */}
                            <div className="p-1.5 sm:p-3 flex flex-col gap-1 sm:gap-3 bg-zinc-900/90 rounded-b-lg sm:rounded-b-2xl border-t border-zinc-800/80">
                                <button 
                                    type="button" 
                                    onClick={() => handleStyleSelect(style.id)}
                                    className="text-right focus:outline-none flex flex-col"
                                >
                                    <h4 className={`text-[10px] sm:text-base font-bold mb-0.5 sm:mb-1 transition-colors ${isSelected ? 'text-brand-lime' : 'text-white'}`}>
                                        {style.name}
                                    </h4>
                                    <p className="hidden sm:block text-[8px] sm:text-xs text-gray-400 leading-tight line-clamp-2">{style.desc}</p>
                                </button>

                                {/* Pinterest Button */}
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const searchUrl = `https://www.pinterest.com/search/pins/?q=${encodeURIComponent(style.pinterestQuery)}`;
                                        window.open(searchUrl, '_blank', 'noopener,noreferrer');
                                    }}
                                    className={`w-full flex items-center justify-center gap-0.5 sm:gap-2 py-1 sm:py-2.5 px-1 sm:px-3 rounded sm:rounded-xl text-[9px] sm:text-xs font-semibold transition-all border mt-0.5 sm:mt-1 ${
                                        isSelected 
                                            ? 'bg-brand-lime text-black border-brand-lime hover:bg-lime-400' 
                                            : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white'
                                    }`}
                                >
                                    <Search className="w-2.5 h-2.5 sm:w-4 sm:h-4 shrink-0" />
                                    <span className="truncate">البحث في Pinterest</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Instruction Banner at bottom of Design Styles */}
            <div className="mt-6 sm:mt-10 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-zinc-900 via-brand-dark to-zinc-900 border border-brand-lime/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-right">
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    <span className="font-bold text-lime-400">📌 وجدت تصميماً أعجبك على Pinterest؟</span> قم بتنزيل الصورة على جهازك، ثم انتقل لتبويب <span className="font-bold text-white">نمط مسبق</span> في الأعلى وارفقها مباشرة لنسهل عليك تطبيق الفكرة. يمكنك استخدام زر البحث في Pinterest أسفل كل نمط لاستلهام المزيد من الأفكار.
                </p>
                <button
                    type="button"
                    onClick={onGoToPatternTab}
                    className="flex-shrink-0 bg-brand-lime text-black px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold hover:bg-lime-400 transition-all shadow-lg flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                >
                    <span className="font-semibold">الانتقال إلى نمط مسبق ➔</span>
                </button>
            </div>
        </div>
    );
};
