import React from 'react';
import { BriefFormData } from '../types';
import { APPLICATION_OPTIONS } from '../constants';

interface BriefPdfTemplateProps {
    formData: BriefFormData;
}

const BriefPdfTemplate: React.FC<BriefPdfTemplateProps> = ({ formData }) => {
    return (
        <div className="bg-white text-gray-900 w-full min-h-screen font-sans flex flex-col" dir="rtl">
            {/* Header - Forced LTR for correct visual alignment (Logo Left, Text Right of it) */}
            <div className="bg-black relative overflow-hidden border-b-2 border-brand-lime h-48 flex items-center px-12 shrink-0" dir="ltr">
                {/* Abstract Wave Pattern - Simulated with SVG */}
                <div className="absolute top-0 right-0 w-2/3 h-full pointer-events-none opacity-40">
                    <svg viewBox="0 0 400 200" preserveAspectRatio="none" className="w-full h-full">
                        <defs>
                            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                                <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
                            </linearGradient>
                        </defs>
                        {/* Curved Geometric Lines */}
                        <path d="M0,200 Q200,200 400,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M20,200 Q210,210 420,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M40,200 Q220,220 440,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M60,200 Q230,230 460,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M80,200 Q240,240 480,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M100,200 Q250,250 500,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M120,200 Q260,260 520,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M140,200 Q270,270 540,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M160,200 Q280,280 560,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                        <path d="M180,200 Q290,290 580,0" fill="none" stroke="url(#waveGradient)" strokeWidth="0.5" />
                    </svg>
                </div>

                <div className="flex items-center gap-6 relative z-10 w-full justify-start">
                    {/* Logo - Fluorescent Green */}
                    <div className="w-24 h-24 flex items-center justify-center">
                        {/* Note: In production, use absolute URL for image if possible or base64 */}
                        <img
                            src="https://mustafa-kappa.vercel.app/Images/logoS1.png"
                            alt="Logo"
                            className="w-20 h-20 object-contain"
                            style={{ filter: 'brightness(0) saturate(100%) invert(76%) sepia(50%) saturate(693%) hue-rotate(24deg) brightness(101%) contrast(101%)' }}
                        />
                    </div>

                    {/* Text */}
                    <div className="flex flex-col items-start">
                        <h1 className="text-6xl font-black text-white font-['Arial'] tracking-wide leading-none uppercase">
                            MUSTAFA
                        </h1>
                        <p className="text-white text-base font-normal tracking-[0.15em] pt-1 opacity-90">
                            Ali Moossawi
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-12 space-y-8 bg-white text-lg flex-grow">

                {/* 1. Client Info */}
                <div className="bg-white border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">معلومات العميل</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">اسم العميل</span>
                            <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.clientName}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">اسم الشركة</span>
                            <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.companyName}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">رقم الهاتف</span>
                            <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100" dir="ltr">{formData.phone}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">البريد الإلكتروني</span>
                            <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100" dir="ltr">{formData.email}</p>
                        </div>
                    </div>
                </div>

                {/* 2. Project Details */}
                <div className="bg-white border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">تفاصيل المشروع</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">اسم المشروع</span>
                            <p className="font-bold text-black text-2xl bg-gray-50 p-4 rounded-xl border border-gray-100">{formData.projectName}</p>
                        </div>
                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">نبذة عن المشروع</span>
                            <p className="font-medium text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-wrap min-h-[100px]">{formData.projectDescription}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">المجال</span>
                                <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.projectType || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">الألوان المفضلة</span>
                                <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.favoriteColors || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Specs & Timeline */}
                <div className="bg-white border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-900">المواصفات والجدول</h2>
                    </div>
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">نوع الشعار</span>
                                <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.logoType}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">الميزانية</span>
                                <div className="font-bold text-black bg-brand-lime/10 border border-brand-lime px-4 py-3 rounded-lg text-center">
                                    {formData.budget}$
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-sm font-bold text-gray-400 block">التطبيقات المطلوبة</span>
                            <div className="flex flex-wrap gap-2 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {Object.entries(formData.applications).filter(([_, v]) => v).map(([k, _]) => {
                                    const app = APPLICATION_OPTIONS.find(a => a.key === k);
                                    return <span key={k} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">{app ? app.label.split('(')[0] : k}</span>
                                })}
                                {formData.otherApplication && <span className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm">{formData.otherApplication}</span>}
                                {Object.values(formData.applications).every(v => !v) && !formData.otherApplication && <span className="text-gray-400 italic text-sm">لم يتم اختيار تطبيقات</span>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">تاريخ البدء</span>
                                <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.startDate || '-'}</p>
                            </div>
                            <div className="space-y-2">
                                <span className="text-sm font-bold text-gray-400 block">تاريخ التسليم</span>
                                <p className="font-bold text-black bg-gray-50 p-3 rounded-lg border border-gray-100">{formData.deadline || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Attachments */}
                {formData.moodboard.length > 0 && (
                    <div className="bg-white border-b border-gray-100 pb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900">المرفقات ({formData.moodboard.length})</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            {formData.moodboard.map((img, index) => (
                                <div key={index} className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                    <img src={img} alt={`Moodboard ${index + 1}`} className="w-full h-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 5. Notes */}
                {formData.notes && (
                    <div className="bg-white pb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-8 bg-brand-lime rounded-full"></div>
                            <h2 className="text-2xl font-bold text-gray-900">ملاحظات إضافية</h2>
                        </div>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-sm text-yellow-900 font-bold whitespace-pre-wrap leading-relaxed">
                            {formData.notes}
                        </div>
                    </div>
                )}

                {/* Footer - Black Strip with Page Number and Instagram - Forced LTR */}
                <div className="bg-black py-6 px-12 flex items-center justify-between mt-auto shrink-0 relative" dir="ltr">

                    {/* Left: Instagram (In LTR, this is Start/Left) */}
                    <div id="pdf-instagram-link" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-lime/20 rounded-lg flex items-center justify-center border border-brand-lime/30">
                            {/* Instagram SVG Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                        </div>
                        <span className="font-bold text-lg text-brand-lime tracking-wide font-['Arial']">
                            mustafa.al_moossawi
                        </span>
                    </div>

                    {/* Center: Page Number */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-brand-lime rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-lg">1</span>
                    </div>

                    {/* Right: Empty for balance */}
                    <div className="w-8"></div>
                </div>
            </div>
        </div>
    );
};

export default BriefPdfTemplate;
