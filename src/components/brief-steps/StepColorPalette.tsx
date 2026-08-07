import React, { useState, useEffect } from 'react';
import { BriefFormData } from '../../types';
import { Palette, Wand2, Trash2, Image as ImageIcon, LayoutTemplate, UploadCloud } from 'lucide-react';
import { hexToHSV, hsvToHex } from '../../utils/colorUtils';
import { ColorWheelTab } from './ColorWheelTab';
import { ImageUploaderTab } from './ImageUploaderTab';

interface ColorPaletteProps {
    formData: BriefFormData;
    updateDomainData: (data: any) => void;
}

const StepColorPalette: React.FC<ColorPaletteProps> = ({ formData, updateDomainData }) => {
    const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'wheel' | 'designer'>('presets');
    const [palette, setPalette] = useState<string[]>([]);
    const [activeHSV, setActiveHSV] = useState({ h: 210, s: 100, v: 100 });
    const [hexInput, setHexInput] = useState('#0077FF');
    const [isDesignerSelected, setIsDesignerSelected] = useState(false);

    const isSocial = formData.briefType === 'social';
    const activeDomain = isSocial ? formData.socialDetails : formData.logoDetails;

    // Initialize from activeDomain
    useEffect(() => {
        if (activeDomain.favoriteColors === 'متروك للمصمم') {
            setIsDesignerSelected(true);
            setActiveTab('designer');
        } else if (activeDomain.favoriteColors === 'image_inspiration') {
            setIsDesignerSelected(false);
            setActiveTab('upload');
        } else if (activeDomain.favoriteColors) {
            const hexes = activeDomain.favoriteColors.match(/#[0-9a-fA-F]{3,6}/g);
            if (hexes && hexes.length > 0) {
                const formatted = hexes.map(c => c.toUpperCase());
                setPalette(formatted);
                
                const lastHsv = hexToHSV(formatted[formatted.length - 1]);
                if (!isNaN(lastHsv.h)) {
                    setActiveHSV(lastHsv);
                    setHexInput(formatted[formatted.length - 1]);
                }
                setIsDesignerSelected(false);
                // If it's standard hex colors, default to presets or wheel
                if (activeTab !== 'presets' && activeTab !== 'wheel') {
                    setActiveTab('presets');
                }
            }
        }
    }, [activeDomain.favoriteColors]);

    const savePalette = (newPalette: string[]) => {
        setIsDesignerSelected(false);
        updateDomainData({ favoriteColors: newPalette.length > 0 ? newPalette.join('، ') : '' });
    };

    const handleTabChange = (tab: 'presets' | 'upload' | 'wheel' | 'designer') => {
        setActiveTab(tab);
        if (tab === 'designer') {
            setIsDesignerSelected(true);
            updateDomainData({ favoriteColors: 'متروك للمصمم' });
        } else if (tab === 'upload') {
            setIsDesignerSelected(false);
            if (activeDomain.inspirationImage) {
                updateDomainData({ favoriteColors: 'image_inspiration' });
            }
        } else {
            setIsDesignerSelected(false);
            if (activeDomain.favoriteColors === 'متروك للمصمم' || activeDomain.favoriteColors === 'image_inspiration') {
                updateDomainData({ favoriteColors: palette.length > 0 ? palette.join('، ') : '' });
            }
        }
    };

    const handleAddColor = () => {
        const activeHex = hsvToHex(activeHSV.h, activeHSV.s, activeHSV.v);
        const newPalette = [...palette, activeHex];
        setPalette(newPalette);
        savePalette(newPalette);
    };

    const removeColor = (index: number) => {
        const newPalette = palette.filter((_, i) => i !== index);
        setPalette(newPalette);
        savePalette(newPalette);
    };

    const applyPreset = (colors: string[]) => {
        setPalette(colors);
        savePalette(colors);
        
        if (colors.length > 0) {
            const lastHsv = hexToHSV(colors[colors.length - 1]);
            if (!isNaN(lastHsv.h)) {
                setActiveHSV(lastHsv);
                setHexInput(colors[colors.length - 1]);
            }
        }
    };

    const getDynamicHint = () => {
        if (activeTab === 'presets') {
            return {
                title: '⚠️ تنبيه وإرشاد مهم:',
                text: (
                    <div className="space-y-2 mt-1">
                        <p>اللوحات المعروضة أدناه هي نماذج استرشادية للعرض والاستلهام فقط وليست اعتماداً نهائياً لهويتك البصرية، واختيارك لأي منها يتم بناءً على تفضيلك ومسؤوليتك.</p>
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5 mt-2">
                            <span className="font-bold text-brand-lime mb-1.5 block">💡 لضمان أفضل نتيجة:</span>
                            <ul className="list-none space-y-1.5 text-xs sm:text-sm text-zinc-300">
                                <li className="flex items-start gap-1.5">
                                    <span className="text-brand-lime mt-0.5">•</span>
                                    <span>تفقّد أيقونة البحث 🔍 داخل كارت كل فئة لاستكشاف مئات باليتات الألوان على Pinterest.</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                    <span className="text-brand-lime mt-0.5">•</span>
                                    <span>الصور التي تعجبك وتستلهم منها هناك، يرجى رفعها عبر تبويب (رفع صورة استلهام) ليعتمدها المصمم بدقة.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                )
            };
        } else if (activeTab === 'wheel') {
            return {
                title: '⚠️ تنبيه حاسم:',
                text: 'الألوان هي البصمة الأولى لعلامتك التجارية والانطباع الأول لدى عملائك. يرجى التأكد بتمهل من اختيارك، حيث سنعتمد هذه الدرجات كأساس متين لبناء كافة عناصر الهوية البصرية.'
            };
        } else if (activeTab === 'upload') {
            return {
                title: '⚠️ تنبيه حاسم:',
                text: 'رفع صورة الاستلهام يعني استخراجنا المباشر لنغمة الألوان وروح التصميم من صورتك لبناء الهوية. يرجى التأكد من رفع صورة تعكس رؤيتك الدقيقة وطموح مشروعك.'
            };
        } else {
            return {
                title: '✨ خيار ذكي وآمن:',
                text: 'سيتولى المصمم دراسة مجالك ومنافسيك واختيار باليت ألوان مخصصة ومدروسة سيكولوجياً لضمان تميز علامتك التجارية.'
            };
        }
    };
    
    const hint = getDynamicHint();

    return (
        <div className="space-y-6 animate-fadeIn select-none">
            
            {/* --- DYNAMIC HINT SECTION --- */}
            <div className="bg-zinc-950 border border-brand-lime/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_0_15px_rgba(204,255,0,0.1)] backdrop-blur-sm relative overflow-hidden" dir="rtl">
                <div className="absolute top-0 left-0 w-2 h-full bg-brand-lime"></div>
                <h3 className="text-brand-lime text-sm sm:text-lg font-bold mb-1.5 sm:mb-2 flex items-center gap-2">
                    {hint.title}
                </h3>
                <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-medium">
                    {hint.text}
                </div>
            </div>

            {/* --- TOP SECTION: CONTROLS --- */}
            <div className="bg-brand-dark border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                
                {/* Tabs Navigation */}
                <div className="w-full flex border-b border-white/10 p-1 sm:p-1.5 bg-brand-black gap-1">
                    <button type="button" onClick={() => handleTabChange('presets')} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all rounded-lg sm:rounded-xl ${activeTab === 'presets' ? 'text-brand-lime bg-brand-dark border-b-2 border-brand-lime shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <LayoutTemplate className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">لوحات جاهزة</span>
                    </button>
                    <button type="button" onClick={() => handleTabChange('upload')} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all rounded-lg sm:rounded-xl ${activeTab === 'upload' ? 'text-brand-lime bg-brand-dark border-b-2 border-brand-lime shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <UploadCloud className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">رفع صورة استلهام</span>
                    </button>
                    <button type="button" onClick={() => handleTabChange('wheel')} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all rounded-lg sm:rounded-xl ${activeTab === 'wheel' ? 'text-brand-lime bg-brand-dark border-b-2 border-brand-lime shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">عجلة الألوان</span>
                    </button>
                    <button type="button" onClick={() => handleTabChange('designer')} className={`flex-1 py-2.5 sm:py-3 px-1 sm:px-3 text-[11px] sm:text-sm font-bold flex items-center justify-center gap-1 sm:gap-2 transition-all rounded-lg sm:rounded-xl ${activeTab === 'designer' ? 'text-brand-lime bg-brand-dark border-b-2 border-brand-lime shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <Wand2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> <span className="truncate">دع الخيار للمصمم</span>
                    </button>
                </div>

                <div className="p-6 min-h-[420px] flex flex-col justify-center relative">
                    
                    {(activeTab === 'wheel' || activeTab === 'presets') && (
                        <ColorWheelTab 
                            activeTab={activeTab}
                            activeHSV={activeHSV}
                            setActiveHSV={setActiveHSV}
                            hexInput={hexInput}
                            setHexInput={setHexInput}
                            handleAddColor={handleAddColor}
                            applyPreset={applyPreset}
                            currentPalette={palette}
                        />
                    )}

                    {activeTab === 'upload' && (
                        <ImageUploaderTab 
                            formData={formData} 
                            updateDomainData={updateDomainData} 
                        />
                    )}

                    {activeTab === 'designer' && (
                        <div className="text-center py-16 px-4 max-w-2xl mx-auto animate-fadeIn">
                            <div className="w-24 h-24 bg-gradient-to-br from-brand-lime/30 to-brand-lime/5 rounded-full flex items-center justify-center mx-auto mb-8 text-brand-lime shadow-[0_0_30px_rgba(204,255,0,0.15)] ring-1 ring-brand-lime/30">
                                <Wand2 size={48} className="animate-pulse" />
                            </div>
                            <h4 className="text-3xl text-white font-extrabold mb-4">دع الأمر لنظرتنا الإبداعية! ✨</h4>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                سنقوم باختيار أفضل باليتة ألوان تعكس هوية ونشاط مشروعك بشكل احترافي وجذاب، مخصصة حصرياً لعلامتك التجارية.
                            </p>
                        </div>
                    )}

                </div>
            </div>

            {/* --- BOTTOM SECTION: DYNAMIC SWATCHES PALETTE --- */}
            <div className={`w-full transition-all duration-500 ${(isDesignerSelected || activeTab === 'upload') ? 'opacity-40 grayscale blur-[2px] pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                        <div className="bg-zinc-900 p-1.5 rounded-lg text-lime-400 shadow-sm inline-flex items-center justify-center">
                            <Palette className="w-5 h-5" strokeWidth={2} />
                        </div>
                        لوحة العينات الديناميكية
                    </h3>
                    <span className="text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                        {palette.length} ألوان
                    </span>
                </div>
                
                <div className="flex flex-wrap gap-4 bg-brand-dark p-6 rounded-3xl border border-white/10 shadow-2xl min-h-[160px]">
                    {palette.length === 0 ? (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2 opacity-50 py-4">
                            <Palette size={32} />
                            <p className="font-semibold text-sm">اللوحة فارغة، قم بإضافة ألوان من العجلة أو اختر لوحة جاهزة</p>
                        </div>
                    ) : (
                        palette.map((c, i) => (
                            <div key={i} className="group flex flex-col items-center gap-3 animate-fadeIn">
                                <div 
                                    className="relative w-20 h-28 rounded-2xl shadow-lg border border-white/10 transition-transform transform hover:scale-105 hover:-translate-y-1"
                                    style={{ backgroundColor: c }}
                                >
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px] rounded-2xl flex flex-col items-center justify-center gap-3">
                                        <button 
                                            type="button" 
                                            onClick={() => removeColor(i)}
                                            className="p-2 rounded-full shadow-xl transition-all bg-red-500/80 text-white hover:bg-red-500"
                                            title="حذف اللون"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-gray-300 uppercase tracking-wider">{c}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>

        </div>
    );
};

export default StepColorPalette;
