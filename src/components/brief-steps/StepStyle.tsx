import React, { useRef, useState } from 'react';
import { LogoDetails } from '../../types';
import { LOGO_TYPE_EXAMPLES } from '../../constants';
import { Upload, X, Users, Sparkles, TrendingUp, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { compressImageBase64 } from '../../utils/imageUtils';

interface StepStyleProps {
    logoDetails: LogoDetails;
    updateLogoDetails: (data: Partial<LogoDetails>) => void;
}

// =====================================================================
// Dynamic explanation data for each logo type
// =====================================================================
const LOGO_TYPE_INFO: Record<string, {
    audience: string;
    features: string[];
    strategy: string;
}> = {
    text: {
        audience: 'المشاريع التي يحمل اسمها قيمة تسويقية كبيرة، كالعلامات التجارية الشخصية، المكاتب المهنية، شركات المحاماة والاستشارات.',
        features: [
            'التايبوغرافي هو الهوية — كل حرف يحمل رسالة',
            'سهل التكيف على جميع الأحجام والخلفيات',
            'تناسق بصري عالي مع العناصر النصية الأخرى',
            'خيارات لا نهاية لها في وزن الخط وتباعده',
        ],
        strategy: 'يُرسّخ الاسم مباشرةً في ذهن العميل دون وسيط بصري — مثالي لبناء علامة شخصية قوية وذات ثقل مهني.',
    },
    symbolic: {
        audience: 'الشركات التقنية، التطبيقات، الفرق الرياضية، والمشاريع التي تستهدف جمهوراً عالمياً متنوع اللغات.',
        features: [
            'أيقونة مستقلة تعمل بدون النص',
            'قوة تعبيرية عالية في مساحة صغيرة',
            'يتجاوز حواجز اللغة والثقافة',
            'مرونة استخدام كـ App Icon أو Favicon',
        ],
        strategy: 'بعد ترسّخه في الأذهان، يصبح الرمز وحده كافياً للتعريف بالعلامة — كما فعلت Nike وApple وTwitter.',
    },
    innovative: {
        audience: 'المشاريع الإبداعية، وكالات التصميم، شركات الأزياء الحديثة، وكل من يريد أن يُفاجئ السوق بهوية لا تُنسى.',
        features: [
            'يكسر القوالب التقليدية بأسلوب مدروس',
            'يدمج الرمز والنص بطريقة غير متوقعة',
            'تفاصيل بصرية تكشف عن نفسها مع الوقت',
            'قابل للتطور دون فقدان جوهره الأصلي',
        ],
        strategy: 'يخلق تجربة "لحظة الإدراك" عند الجمهور — عندما يدرك المعنى المخفي تنشأ علاقة عاطفية حقيقية مع العلامة.',
    },
    double: {
        audience: 'الشركات المتوسطة والكبيرة، المؤسسات التعليمية، الجهات الحكومية، وأي علامة تحتاج إلى الوضوح والمرونة معاً.',
        features: [
            'رمز + نص = هوية كاملة ومتماسكة',
            'يُستخدم الجزء الرمزي مستقلاً حين الحاجة',
            'يعطي مرونة تصميمية استثنائية في التطبيقات',
            'الأكثر شيوعاً بين العلامات العالمية الكبرى',
        ],
        strategy: 'يمنح العلامة حياتين: الرمز للتعرف السريع والاسم للمصداقية — مزيج يصعب المنافسة عليه على المدى البعيد.',
    },
    arabic: {
        audience: 'المشاريع التي تستهدف السوق العربي وتريد إبراز هويتها الثقافية الأصيلة: العطور، الضيافة، التراث، الفنادق الفاخرة.',
        features: [
            'الخط العربي الفصيح يُضفي أصالة لا تُضاهى',
            'كاليغرافي يدوي أو رقمي بروح فنية حرة',
            'قوة بصرية استثنائية وفرادة تصميمية',
            'يعمل بشكل رائع عند التكبير للطباعة',
        ],
        strategy: 'الفخامة العربية الأصيلة أصبحت ميزة تنافسية عالمية — يجعل علامتك تتحدث بلغة الثقافة قبل لغة التجارة.',
    },
};

const StepStyle: React.FC<StepStyleProps> = ({ logoDetails, updateLogoDetails }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Tracks which card the user has explicitly clicked — null on initial load
    const [activeExplanationId, setActiveExplanationId] = useState<string | null>(null);

    const handleLogoTypeSelect = (id: string) => {
        updateLogoDetails({ logoType: id as LogoDetails['logoType'] });
        setActiveExplanationId(id);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (logoDetails.moodboard.length >= 5) {
                toast.error("لقد وصلت للحد الأقصى (5 صور). يرجى حذف صورة قبل إضافة أخرى.");
                return;
            }
            if (!file.type.startsWith('image/')) {
                toast.error("الرجاء رفع ملف صورة صالح (JPEG، PNG، إلخ).");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت.");
                return;
            }

            try {
                const compressedImage = await compressImageBase64(file, 1200, 0.75);
                updateLogoDetails({ moodboard: [...logoDetails.moodboard, compressedImage] });
            } catch (error) {
                console.error('[Moodboard] Compression failed:', error);
                toast.error("فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.");
            }
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeUploadedFile = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        updateLogoDetails({ moodboard: logoDetails.moodboard.filter((_, i) => i !== index) });
    };

    const selectedInfo = activeExplanationId ? LOGO_TYPE_INFO[activeExplanationId] : null;

    return (
        <div className="space-y-5 animate-fadeIn">
            {/* Logo Type Cards */}
            <div className="flex flex-col gap-4">
                {LOGO_TYPE_EXAMPLES.map((type) => {
                    const isSelected = logoDetails.logoType === type.id;
                    return (
                        <div key={type.id} className="flex flex-col">
                            {/* Main Card — always a horizontal row */}
                            <div
                                onClick={() => handleLogoTypeSelect(type.id)}
                                className={`
                                    relative overflow-hidden cursor-pointer rounded-2xl sm:rounded-3xl
                                    border-2 transition-all duration-300
                                    flex flex-col sm:flex-row sm:items-center justify-between
                                    gap-3 sm:gap-4 group
                                    ${isSelected
                                        ? 'border-[#d4ff00] ring-1 ring-[#d4ff00]/50 bg-white p-3 sm:p-5'
                                        : 'bg-gray-50 border-gray-200 hover:border-[#d4ff00]/50 hover:bg-white hover:shadow-lg p-3 sm:p-4'
                                    }
                                `}
                            >
                                {/* Selected accent bar */}
                                {isSelected && (
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-[#d4ff00] rounded-r-3xl" />
                                )}

                                {/* Card Header (Mobile) / Right Block (Desktop) */}
                                <div className="flex flex-row items-center justify-between sm:justify-start gap-2 shrink-0 w-full sm:w-[160px] md:w-[190px] pr-2 sm:pr-3">
                                    <div className="flex flex-col justify-center min-w-0">
                                        <div className={`font-bold text-sm sm:text-base leading-tight transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {type.label}
                                        </div>
                                        <div className="text-[11px] sm:text-xs text-gray-400 mt-1 leading-tight">{type.desc}</div>
                                    </div>
                                    
                                    {/* Mobile Only: English Label & Badge on the Left */}
                                    <div className="sm:hidden flex items-center gap-2 shrink-0 text-left" dir="ltr">
                                        {isSelected && (
                                            <div className="bg-[#d4ff00] rounded-full p-1 animate-fadeIn shadow-sm">
                                                <Check className="w-3 h-3 text-black" strokeWidth={3} />
                                            </div>
                                        )}
                                        <span className={`text-[10px] font-mono uppercase tracking-widest font-semibold ${isSelected ? 'text-gray-900' : 'text-neutral-400'}`}>
                                            {type.labelEn}
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile: Images Grid (Bottom) | Desktop: Images Row (Center) */}
                                <div className="w-full sm:flex-1 grid grid-cols-4 sm:flex sm:flex-row sm:flex-wrap items-center sm:justify-center gap-1.5 sm:gap-2 md:gap-3 py-4 mt-1 sm:mt-0" dir="ltr">
                                    {type.images && type.images.length > 0 ? (
                                        type.images.slice(0, 4).map((img: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`
                                                    bg-white rounded-lg sm:rounded-xl border shrink-0
                                                    transition-all duration-200
                                                    aspect-square sm:aspect-auto w-full sm:w-20 md:w-24 h-auto min-h-[5rem]
                                                    ${isSelected ? 'border-brand-lime/30 shadow-sm' : 'border-gray-200'}
                                                `}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${type.label} example ${idx + 1}`}
                                                    className="w-full h-full object-contain p-1.5 sm:p-2"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-300 text-xs italic px-4 col-span-4 text-center">
                                            لا توجد أمثلة
                                        </div>
                                    )}
                                </div>

                                {/* Desktop Only: English Label & Badge on the Left */}
                                <div className="hidden sm:flex items-center justify-end gap-2 shrink-0 w-[110px] md:w-[150px] text-left" dir="ltr">
                                    {isSelected && (
                                        <div className="bg-[#d4ff00] rounded-full p-1 animate-fadeIn shadow-sm">
                                            <Check className="w-3.5 h-3.5 text-black" strokeWidth={3} />
                                        </div>
                                    )}
                                    <span className={`text-xs font-mono uppercase tracking-widest font-semibold ${isSelected ? 'text-gray-900' : 'text-neutral-400'}`}>
                                        {type.labelEn}
                                    </span>
                                </div>
                            </div>

                            {/* Dynamic Explanation Panel — only after explicit user click */}
                             {activeExplanationId === type.id && selectedInfo && (
                                <div
                                    className="mt-1 rounded-2xl border border-brand-lime/30 bg-gradient-to-br from-zinc-950 to-zinc-900 overflow-hidden animate-fadeIn"
                                    dir="rtl"
                                >
                                    {/* Panel header */}
                                    <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
                                        <ChevronDown size={14} className="text-brand-lime" />
                                        <span className="text-brand-lime font-bold text-xs tracking-wide uppercase">
                                            تعرّف على هذا النمط
                                        </span>
                                    </div>

                                    <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                                        {/* 🎯 Target Audience */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-1.5">
                                                    <Users size={14} className="text-brand-lime" />
                                                </div>
                                                <span className="text-brand-lime font-bold text-xs">لمن يُناسب هذا النمط؟</span>
                                            </div>
                                            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                                                {selectedInfo.audience}
                                            </p>
                                        </div>

                                        {/* ✨ Visual Features */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-1.5">
                                                    <Sparkles size={14} className="text-brand-lime" />
                                                </div>
                                                <span className="text-brand-lime font-bold text-xs">أبرز المميزات البصرية</span>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {selectedInfo.features.map((feat, i) => (
                                                    <li key={i} className="flex items-start gap-1.5 text-zinc-300 text-xs sm:text-sm">
                                                        <span className="text-brand-lime mt-0.5 shrink-0">▸</span>
                                                        <span>{feat}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* 💡 Strategic Power */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-1.5">
                                                    <TrendingUp size={14} className="text-brand-lime" />
                                                </div>
                                                <span className="text-brand-lime font-bold text-xs">القوة الاستراتيجية</span>
                                            </div>
                                            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                                                {selectedInfo.strategy}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Moodboard Upload */}
            <div className="mt-8 sm:mt-12 space-y-4">
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div>
                        <h4 className="text-base sm:text-xl font-bold text-gray-900">هل لديك تصور مبدئي؟</h4>
                        <p className="text-gray-500 text-xs sm:text-sm">أرفق صور لشعارات تعجبك أو سكتشات (حتى 5 صور)</p>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-400">{logoDetails.moodboard.length}/5</span>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="h-32 sm:h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-lime hover:bg-brand-lime/5 transition-all group"
                    >
                        <Upload className="text-gray-400 group-hover:text-brand-lime mb-2 w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="text-xs font-semibold text-slate-800 group-hover:text-gray-700">رفع صورة</span>
                    </div>

                    {logoDetails.moodboard.map((img, idx) => (
                        <div key={idx} className="h-32 sm:h-48 bg-gray-100 rounded-xl relative group overflow-hidden border border-gray-200">
                            <img src={img} alt="Moodboard" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => removeUploadedFile(e, idx)}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default React.memo(StepStyle);
