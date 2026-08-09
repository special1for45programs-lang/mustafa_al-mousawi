import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import { BriefFormData } from '../../types';
import { compressImageBase64 } from '../../utils/imageUtils';

interface ImageUploaderTabProps {
    formData: BriefFormData;
    updateDomainData: (data: any) => void;
}

const MAX_IMAGES = 10;
const MAX_SIZE_MB = 5;

export const ImageUploaderTab: React.FC<ImageUploaderTabProps> = ({ formData, updateDomainData }) => {
    const isSocial = formData.briefType === 'social';
    const activeDomain = isSocial ? formData.socialDetails : formData.logoDetails;
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // ─── Social: multi-image mode ──────────────────────────────────────────
    const socialImages: string[] = isSocial
        ? (formData.socialDetails.inspirationImages ?? [])
        : [];

    // ─── Single-file helpers (Logo flow) ─────────────────────────────────

    const validateFile = (file: File): string | null => {
        if (!file.type.startsWith('image/')) return 'الرجاء رفع ملف صورة صالح (JPEG، PNG، إلخ).';
        if (file.size > MAX_SIZE_MB * 1024 * 1024) return `حجم الصورة كبير جداً. الحد الأقصى هو ${MAX_SIZE_MB} ميجابايت.`;
        return null;
    };

    // ─── Logo: single file ────────────────────────────────────────────────
    const handleLogoFile = async (file: File) => {
        setError(null);
        const err = validateFile(file);
        if (err) { setError(err); return; }
        try {
            const base64 = await compressImageBase64(file);
            updateDomainData({ inspirationImage: base64, favoriteColors: 'image_inspiration' });
        } catch { setError('حدث خطأ أثناء قراءة الصورة. يرجى المحاولة مرة أخرى.'); }
    };

    // ─── Social: multi-file ───────────────────────────────────────────────
    const handleSocialFiles = async (files: FileList) => {
        setError(null);
        const remaining = MAX_IMAGES - socialImages.length;
        if (remaining <= 0) {
            setError(`لقد وصلت إلى الحد الأقصى (${MAX_IMAGES} صور).`);
            return;
        }
        const newFiles = Array.from(files).slice(0, remaining);
        const results: string[] = [];
        for (const file of newFiles) {
            const err = validateFile(file);
            if (err) { setError(err); continue; }
            try {
                const base64 = await compressImageBase64(file);
                results.push(base64);
            } catch { setError('حدث خطأ أثناء قراءة إحدى الصور.'); }
        }
        if (results.length > 0) {
            const updated = [...socialImages, ...results];
            updateDomainData({
                inspirationImages: updated,
                inspirationImage: updated[0], // keep first as legacy single
            });
        }
    };

    const removeSocialImage = (index: number) => {
        const updated = socialImages.filter((_, i) => i !== index);
        updateDomainData({
            inspirationImages: updated,
            inspirationImage: updated[0] ?? '',
        });
    };

    const removeLogoImage = () => {
        updateDomainData({ inspirationImage: '', favoriteColors: '' });
        if (inputRef.current) inputRef.current.value = '';
    };

    // ─── Shared drag/drop/change handlers ────────────────────────────────
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (!e.dataTransfer.files.length) return;
        if (isSocial) handleSocialFiles(e.dataTransfer.files);
        else handleLogoFile(e.dataTransfer.files[0]);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault(); e.stopPropagation();
        if (!e.target.files?.length) return;
        if (isSocial) handleSocialFiles(e.target.files);
        else handleLogoFile(e.target.files[0]);
        // reset so same file can be re-selected
        if (inputRef.current) inputRef.current.value = '';
    };

    const openPicker = (e: React.MouseEvent) => {
        e.preventDefault(); e.stopPropagation();
        inputRef.current?.click();
    };

    // ─── SOCIAL MULTI-IMAGE UI ────────────────────────────────────────────
    if (isSocial) {
        const canAddMore = socialImages.length < MAX_IMAGES;
        return (
            <div className="flex flex-col gap-5 w-full max-w-2xl mx-auto py-6 animate-fadeIn">
                {/* Context label */}
                <div className="text-center">
                    <p className="text-gray-400 text-sm leading-relaxed">
                        ارفع صور لمنشورات أو تصاميم أو حسابات تعجبك — سنستلهم منها
                        <strong className="text-brand-lime"> أسلوب تصاميم منشوراتك</strong>.
                        <br />
                        <span className="text-xs text-gray-500">يمكنك رفع حتى {MAX_IMAGES} صور · الحد الأقصى {MAX_SIZE_MB} MB لكل صورة</span>
                    </p>
                </div>

                {/* Uploaded grid */}
                {socialImages.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {socialImages.map((src, i) => (
                            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10 shadow-md bg-brand-dark">
                                <img src={src} alt={`مرجع ${i + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeSocialImage(i); }}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                        title="إزالة الصورة"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                {i === 0 && (
                                    <span className="absolute top-1.5 right-1.5 bg-brand-lime text-brand-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">رئيسية</span>
                                )}
                            </div>
                        ))}

                        {/* Add more slot */}
                        {canAddMore && (
                            <button
                                type="button"
                                onClick={openPicker}
                                className="aspect-square rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 text-gray-500 hover:border-brand-lime/60 hover:text-brand-lime hover:bg-brand-lime/5 transition-all cursor-pointer"
                            >
                                <Plus size={22} />
                                <span className="text-[10px] font-bold">إضافة</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Upload zone — shown when empty or to add more */}
                {socialImages.length === 0 && (
                    <div
                        className={`flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${dragActive ? 'border-brand-lime bg-brand-lime/5 scale-[1.02]' : 'border-white/20 bg-brand-black hover:border-brand-lime/50 hover:bg-white/5'}`}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                        onClick={openPicker}
                    >
                        <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                            <ImageIcon size={32} className="text-brand-lime absolute opacity-20 transform -rotate-12 -translate-x-4 -translate-y-2" />
                            <UploadCloud size={40} className="text-white relative z-10" />
                        </div>
                        <h4 className="text-xl font-bold text-white mb-2">اسحب وأفلت الصور هنا</h4>
                        <p className="text-gray-500 text-center text-sm max-w-sm leading-relaxed mb-6">
                            ارفع صور منشورات أو حسابات تعجبك — حتى {MAX_IMAGES} صور مرة واحدة
                        </p>
                        <button type="button" onClick={openPicker} className="bg-brand-lime text-brand-black px-8 py-3 rounded-xl font-bold hover:bg-lime-400 transition-colors shadow-lg">
                            تصفح الملفات
                        </button>
                    </div>
                )}

                {/* Counter badge */}
                {socialImages.length > 0 && (
                    <div className="flex items-center justify-between px-1">
                        <span className="flex items-center gap-2 text-sm text-brand-lime font-bold">
                            <CheckCircle2 size={16} /> {socialImages.length} {socialImages.length === 1 ? 'صورة مرفوعة' : 'صور مرفوعة'}
                        </span>
                        <span className="text-xs text-gray-500">{MAX_IMAGES - socialImages.length} متبقية</span>
                    </div>
                )}

                <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleChange} className="hidden" />
                {error && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
                        <AlertCircle size={18} className="shrink-0" />
                        <p>{error}</p>
                    </div>
                )}
            </div>
        );
    }

    // ─── LOGO SINGLE-IMAGE UI (unchanged logic, polished) ────────────────
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
                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeLogoImage(); }}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors flex items-center gap-2">
                                <X size={18} /> إزالة الصورة
                            </button>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm text-center">
                        سنقوم باستخراج الدرجات اللونية والروح العامة من هذه الصورة لتبني عليها هوية مشروعك.
                    </p>
                    <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); inputRef.current?.click(); }}
                        className="text-brand-lime hover:text-white transition-colors text-sm underline underline-offset-4 mt-2">
                        أو انقر هنا لتغيير الصورة
                    </button>
                </div>
            ) : (
                <div
                    className={`flex flex-col items-center justify-center p-10 rounded-3xl border-2 border-dashed transition-all cursor-pointer ${dragActive ? 'border-brand-lime bg-brand-lime/5 scale-[1.02]' : 'border-white/20 bg-brand-black hover:border-brand-lime/50 hover:bg-white/5'}`}
                    onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    onClick={openPicker}
                >
                    <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                        <ImageIcon size={32} className="text-brand-lime absolute opacity-20 transform -rotate-12 -translate-x-4 -translate-y-2" />
                        <UploadCloud size={40} className="text-white relative z-10" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">اسحب وأفلت صورة الاستلهام هنا</h4>
                    <p className="text-gray-500 text-center text-sm max-w-sm leading-relaxed mb-6">
                        قم برفع أي صورة، لوحة ألوان، أو تصميم يعجبك لكي نستلهم منه الألوان لهويتك. (الحد الأقصى 5MB)
                    </p>
                    <button type="button" onClick={openPicker} className="bg-brand-lime text-brand-black px-8 py-3 rounded-xl font-bold hover:bg-lime-400 transition-colors shadow-lg">
                        تصفح الملفات
                    </button>
                </div>
            )}
            <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm animate-fadeIn">
                    <AlertCircle size={18} className="shrink-0" />
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
