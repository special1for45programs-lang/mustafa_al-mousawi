import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { BriefFormData } from '../../types';

interface ImageUploaderTabProps {
    formData: BriefFormData;
    updateDomainData: (data: any) => void;
}

export const ImageUploaderTab: React.FC<ImageUploaderTabProps> = ({ formData, updateDomainData }) => {
    const isSocial = formData.briefType === 'social';
    const activeDomain = isSocial ? formData.socialDetails : formData.logoDetails;
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File) => {
        setError(null);
        // Check size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            setError('حجم الصورة كبير جداً. الحد الأقصى هو 5 ميجابايت.');
            return;
        }

        // Check type
        if (!file.type.startsWith('image/')) {
            setError('الرجاء رفع ملف صورة صالح (JPEG, PNG, إلخ).');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            updateDomainData({ inspirationImage: base64, favoriteColors: 'image_inspiration' });
        };
        reader.onerror = () => setError('حدث خطأ أثناء قراءة الصورة. يرجى المحاولة مرة أخرى.');
        reader.readAsDataURL(file);
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const removeImage = () => {
        updateDomainData({ inspirationImage: '', favoriteColors: '' });
        if (inputRef.current) inputRef.current.value = '';
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto py-8">
            {activeDomain.inspirationImage ? (
                <div className="flex flex-col items-center gap-4 bg-brand-dark p-6 rounded-2xl border border-brand-lime/30 shadow-lg relative animate-fadeIn">
                    <div className="absolute top-4 right-4 bg-brand-lime text-brand-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md z-10">
                        <CheckCircle2 size={14} /> تم الرفع بنجاح
                    </div>
                    <div className="w-full max-w-sm rounded-xl overflow-hidden border border-white/10 shadow-2xl relative group">
                        <img src={activeDomain.inspirationImage} alt="استلهام" className="w-full h-auto object-cover max-h-64" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                            <button 
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    removeImage();
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2"
                            >
                                <X size={18} /> إزالة الصورة
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm text-center">
                        سنقوم باستخراج الدرجات اللونية والروح العامة من هذه الصورة لتبني عليها هوية مشروعك.
                    </p>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            inputRef.current?.click();
                        }}
                        className="text-brand-lime hover:text-white transition-colors text-sm underline underline-offset-4 mt-2"
                    >
                        أو انقر هنا لتغيير الصورة
                    </button>
                </div>
            ) : (
                <div 
                    className={`flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer relative ${dragActive ? 'border-brand-lime bg-brand-lime/5 scale-[1.02]' : 'border-white/20 bg-brand-black hover:border-brand-lime/50 hover:bg-white/5'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        inputRef.current?.click();
                    }}
                >
                    <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                        <ImageIcon size={32} className="text-brand-lime absolute opacity-20 transform -rotate-12 -translate-x-4 -translate-y-2" />
                        <UploadCloud size={40} className="text-white relative z-10" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">اسحب وأفلت صورة الاستلهام هنا</h4>
                    <p className="text-gray-500 text-center text-sm max-w-sm leading-relaxed mb-6">
                        قم برفع أي صورة، لوحة ألوان، أو تصميم يعجبك لكي نستلهم منه الألوان لهويتك. (الحد الأقصى 5MB)
                    </p>
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // clicking the button bubbles up to the container which clicks the input,
                            // but let's just be explicit here
                            inputRef.current?.click();
                        }}
                        className="bg-brand-lime text-brand-black px-8 py-3 rounded-xl font-bold hover:bg-lime-400 transition-colors shadow-lg"
                    >
                        تصفح الملفات
                    </button>
                </div>
            )}
            
            <input 
                ref={inputRef}
                type="file" 
                accept="image/*" 
                onChange={handleChange} 
                className="hidden" 
            />

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
