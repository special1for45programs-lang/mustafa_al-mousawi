import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { BriefFormData } from '../../types';

interface PresetPatternTabProps {
    formData: BriefFormData;
    updateDomainData: (data: any) => void;
}

export const PresetPatternTab: React.FC<PresetPatternTabProps> = ({ formData, updateDomainData }) => {
    const patternFileInputRef = useRef<HTMLInputElement>(null);
    const isSocial = formData.briefType === 'social';
    const activeDomain = isSocial ? formData.socialDetails : formData.logoDetails;

    // Safe access — postsPatternImages lives on socialDetails
    const postsPatternImages: string[] = isSocial
        ? (formData.socialDetails.postsPatternImages ?? [])
        : [];

    const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let { width, height } = img;
                    if (width > maxWidth) { height = (height * maxWidth) / width; width = maxWidth; }
                    if (height > maxWidth) { width = (width * maxWidth) / height; height = maxWidth; }
                    canvas.width = width; canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) { reject(new Error('Failed to get canvas context')); return; }
                    ctx.drawImage(img, 0, 0, width, height);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target?.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    };

    const handlePatternUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const currentImages = postsPatternImages;
            if (currentImages.length >= 5) {
                alert("لقد وصلت للحد الأقصى (5 صور). يرجى حذف صورة قبل إضافة أخرى.");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert("حجم الملف كبير جداً. يرجى اختيار صورة أقل من 10 ميجابايت.");
                return;
            }
            try {
                const compressedImage = await compressImage(file, 800, 0.7);
                updateDomainData({ postsPatternImages: [...currentImages, compressedImage] });
            } catch (error) {
                console.error('Compression failed:', error);
                alert("فشل في معالجة الصورة. يرجى المحاولة مرة أخرى.");
            }
        }
        if (patternFileInputRef.current) patternFileInputRef.current.value = '';
    };

    const removePatternFile = (e: React.MouseEvent, index: number) => {
        e.stopPropagation();
        const currentImages = postsPatternImages;
        updateDomainData({ postsPatternImages: currentImages.filter((_, i) => i !== index) });
    };

    return (
        <div className="flex flex-col items-center justify-center gap-6 w-full max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
            <div className="text-center mb-4">
                <h4 className="text-2xl text-white font-bold mb-2">أنماط المنشورات السابقة</h4>
                <p className="text-gray-400 text-sm">ارفع حتى 5 صور من منشوراتك السابقة لتساعدنا في فهم النمط التصميمي الذي ترغب في الاستمرار عليه.</p>
            </div>
            
            <input
                type="file"
                ref={patternFileInputRef}
                onChange={handlePatternUpload}
                accept="image/*"
                className="hidden"
            />

            {postsPatternImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center w-full mx-auto">
                    <div
                        onClick={() => patternFileInputRef.current?.click()}
                        className="w-48 h-48 sm:w-56 sm:h-56 mx-auto border-2 border-dashed border-gray-600 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-lime hover:bg-brand-lime/5 transition-all group p-4 text-center bg-zinc-900/60 shadow-xl mx-auto"
                    >
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-brand-lime/10 mb-3 transition-colors">
                            <Upload className="text-gray-400 group-hover:text-brand-lime w-8 h-8 transition-colors" />
                        </div>
                        <span className="text-sm font-semibold text-gray-300 group-hover:text-white mb-1">رفع صورة</span>
                        <span className="text-xs text-gray-500">اضغط لرفع نموذج أو فكرة أعجبتك</span>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl mx-auto" dir="rtl">
                    {postsPatternImages.length < 5 && (
                        <div
                            onClick={() => patternFileInputRef.current?.click()}
                            className="aspect-square border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-brand-lime hover:bg-brand-lime/5 transition-all group bg-zinc-900/50"
                        >
                            <Upload className="text-gray-400 group-hover:text-brand-lime mb-2" />
                            <span className="text-xs font-semibold text-gray-400 group-hover:text-white">إضافة المزيد</span>
                        </div>
                    )}

                    {postsPatternImages.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square bg-gray-800 rounded-xl relative group overflow-hidden border border-gray-700 shadow-md">
                            <img src={img} alt="Pattern" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={(e) => removePatternFile(e, idx)}
                                    className="bg-red-500 text-white p-2.5 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
