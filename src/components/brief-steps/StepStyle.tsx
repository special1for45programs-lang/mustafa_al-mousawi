import React, { useRef } from 'react';
import { StepProps } from './types';
import { LOGO_TYPE_EXAMPLES } from '../../constants';
import { Upload, X } from 'lucide-react';

const StepStyle: React.FC<StepProps> = ({ formData, updateFormData }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoTypeSelect = (id: string) => {
        updateFormData({ logoType: id });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (formData.moodboard.length >= 5) {
                alert("لقد وصلت للحد الأقصى (5 صور). يرجى حذف صورة قبل إضافة أخرى.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("حجم الملف كبير جداً. يرجى اختيار صورة أقل من 5 ميجابايت.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                updateFormData({ moodboard: [...formData.moodboard, reader.result as string] });
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeUploadedFile = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        updateFormData({ moodboard: formData.moodboard.filter((_, i) => i !== index) });
    };

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* Logo Types */}
            <div className="flex flex-col gap-6">
                {LOGO_TYPE_EXAMPLES.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => handleLogoTypeSelect(type.id)}
                        className={`cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex flex-col md:flex-row items-center justify-between gap-6 group bg-gray-50 hover:shadow-lg ${formData.logoType === type.id ? 'border-brand-lime shadow-[0_0_15px_rgba(204,255,0,0.3)]' : 'border-gray-200 hover:border-brand-lime/30'}`}
                    >
                        <div className="flex items-center gap-4 min-w-[180px]">
                            <div className="font-bold text-lg text-gray-900 uppercase tracking-wider">{type.labelEn}</div>
                        </div>

                        {/* Center: Images - Updated Grid Layout */}
                        <div className="flex-1 flex flex-wrap justify-center gap-3 py-2 px-4 w-full">
                            {type.images && type.images.length > 0 ? (
                                type.images.map((img: string, idx: number) => (
                                    <div key={idx} className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={img} alt={`${type.label} example ${idx + 1}`} className="w-full h-full object-contain p-2" />
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400 text-sm italic">لا توجد أمثلة</div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 min-w-[150px] justify-end">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${formData.logoType === type.id ? 'border-brand-lime bg-brand-lime' : 'border-gray-300 group-hover:border-brand-lime/50'}`}>
                                {formData.logoType === type.id && <div className="w-2.5 h-2.5 bg-black rounded-full"></div>}
                            </div>
                            <div className="font-bold text-lg text-gray-900 text-right">{type.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Moodboard Upload */}
            <div className="mt-12 space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h4 className="text-xl font-bold text-gray-900">هل لديك تصور مبدئي؟</h4>
                        <p className="text-gray-500 text-sm">أرفق صور لشعارات تعجبك أو سكتشات (حتى 5 صور)</p>
                    </div>
                    <span className="text-sm font-bold text-gray-400">{formData.moodboard.length}/5</span>
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                />

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-lime hover:bg-brand-lime/5 transition-all group"
                    >
                        <Upload className="text-gray-400 group-hover:text-brand-lime mb-2" />
                        <span className="text-xs font-bold text-gray-500 group-hover:text-gray-700">رفع صورة</span>
                    </div>

                    {formData.moodboard.map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-xl relative group overflow-hidden border border-gray-200">
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
