import React, { useRef } from 'react';
import { LogoDetails } from '../../types';
import { LOGO_TYPE_EXAMPLES } from '../../constants';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface StepStyleProps {
    logoDetails: LogoDetails;
    updateLogoDetails: (data: Partial<LogoDetails>) => void;
}

const StepStyle: React.FC<StepStyleProps> = ({ logoDetails, updateLogoDetails }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoTypeSelect = (id: string) => {
        updateLogoDetails({ logoType: id as LogoDetails['logoType'] });
    };

    // دالة ضغط الصور لتقليل الحجم قبل التخزين
    const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;

                    // تصغير الأبعاد مع الحفاظ على النسبة
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxWidth) {
                        width = (width * maxWidth) / height;
                        height = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error('Failed to get canvas context'));
                        return;
                    }

                    ctx.drawImage(img, 0, 0, width, height);

                    // تحويل لـ JPEG مضغوط
                    const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                    resolve(compressedBase64);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
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
                // ضغط الصورة قبل التخزين
                const compressedImage = await compressImage(file, 800, 0.7);
                console.log(`[Moodboard] Original size: ${(file.size / 1024).toFixed(1)}KB, Compressed: ${(compressedImage.length / 1024).toFixed(1)}KB (Base64)`);
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

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Logo Types */}
            <div className="flex flex-col gap-3 sm:gap-6">
                {LOGO_TYPE_EXAMPLES.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => handleLogoTypeSelect(type.id)}
                        className={`relative overflow-hidden cursor-pointer rounded-xl sm:rounded-2xl p-3 sm:p-4 border-2 transition-all duration-300 transform hover:scale-[1.01] active:scale-[0.99] flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-6 group hover:bg-white hover:shadow-xl ${logoDetails.logoType === type.id ? 'bg-white border-brand-lime shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'bg-gray-50 border-gray-200 hover:border-brand-lime/30'}`}
                    >
                        {/* Arabic Title + Radio (First in DOM -> Right in RTL) */}
                        <div className="flex flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3 w-full md:w-[180px] shrink-0">
                            <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${logoDetails.logoType === type.id ? 'border-brand-lime bg-brand-lime' : 'border-gray-300 group-hover:border-brand-lime/50'}`}>
                                {logoDetails.logoType === type.id && <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-black rounded-full"></div>}
                            </div>
                            <div className="font-bold text-sm sm:text-lg text-gray-900 text-right">{type.label}</div>
                        </div>

                        {/* Center: Images */}
                        <div className="flex-1 flex flex-wrap justify-center gap-2 sm:gap-3 py-1 sm:py-2 px-2 sm:px-4 w-full">
                            {type.images && type.images.length > 0 ? (
                                type.images.map((img: string, idx: number) => (
                                    <div key={idx} className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={img} alt={`${type.label} example ${idx + 1}`} className="w-full h-full object-contain p-1.5 sm:p-2" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-xs sm:text-sm italic">لا توجد أمثلة</div>
                            )}
                        </div>

                        {/* English Title (Last in DOM -> Left in RTL) */}
                        <div className="flex flex-row items-center justify-center md:justify-end gap-2 w-full md:w-[180px] shrink-0 hidden sm:flex" dir="ltr">
                            <div className="font-bold text-sm sm:text-lg text-gray-900 uppercase tracking-wider text-left">{type.labelEn}</div>
                        </div>
                    </div>
                ))}
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
