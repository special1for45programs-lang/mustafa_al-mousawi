import React, { useRef, useState } from 'react';
import { LogoDetails } from '../../types';
import { LOGO_TYPE_EXAMPLES } from '../../constants';
import { Upload, X, Users, Sparkles, TrendingUp, ChevronDown } from 'lucide-react';
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
                                    flex flex-row items-center justify-between
                                    gap-3 sm:gap-4 group
                                    ${isSelected
                                        ? 'border-brand-lime bg-white shadow-[0_0_0_4px_rgba(204,255,0,0.15)] p-3 sm:p-5'
                                        : 'bg-gray-50 border-gray-200 hover:border-brand-lime/50 hover:bg-white hover:shadow-lg p-3 sm:p-4'
                                    }
                                `}
                            >
                                {/* Selected accent bar */}
                                {isSelected && (
                                    <div className="absolute top-0 right-0 w-1.5 h-full bg-brand-lime rounded-r-3xl" />
                                )}

                                {/* RIGHT: Radio + Arabic Title */}
                                <div className="flex flex-row items-center gap-2 sm:gap-3 shrink-0 w-[120px] sm:w-[160px] md:w-[190px]">
                                    <div className={`
                                        w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                                        ${isSelected ? 'border-brand-lime bg-brand-lime' : 'border-gray-300 group-hover:border-brand-lime/60'}
                                    `}>
                                        {isSelected && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full" />}
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`font-bold text-xs sm:text-base leading-tight ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                                            {type.label}
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-tight">{type.desc}</div>
                                    </div>
                                </div>

                                {/* CENTER: Example Images — strict single horizontal row, no wrap */}
                                <div className="flex-1 flex flex-row flex-nowrap items-center justify-center gap-1.5 sm:gap-2 md:gap-3 overflow-hidden" dir="ltr">
                                    {type.images && type.images.length > 0 ? (
                                        type.images.slice(0, 4).map((img: string, idx: number) => (
                                            <div
                                                key={idx}
                                                className={`
                                                    bg-white rounded-lg sm:rounded-xl overflow-hidden border shrink-0
                                                    transition-all duration-200
                                                    w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24
                                                    ${isSelected ? 'border-brand-lime/30 shadow-sm' : 'border-gray-200'}
                                                `}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${type.label} example ${idx + 1}`}
                                                    className="w-full h-full object-contain p-1 sm:p-2"
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-gray-300 text-xs italic px-4">
                                            لا توجد أمثلة
                                        </div>
                                    )}
                                </div>

                                {/* LEFT: English Label */}
                                <div className="hidden sm:block shrink-0 w-[110px] md:w-[150px] text-left" dir="ltr">
                                    <span className={`font-bold text-[10px] sm:text-xs uppercase tracking-widest select-auto ${isSelected ? 'text-brand-lime' : 'text-gray-400'}`}>
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

export default StepStyle;
