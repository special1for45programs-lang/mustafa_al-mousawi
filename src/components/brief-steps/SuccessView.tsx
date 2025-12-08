import React from 'react';
import { Button } from '../ui/Button';
import { Check, Plus } from 'lucide-react';

interface SuccessViewProps {
    resetForm: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({ resetForm }) => {
    return (
        <div className="py-32 bg-brand-black flex items-center justify-center min-h-[60vh]">
            <div className="text-center max-w-lg px-6 bg-brand-dark p-12 rounded-3xl border border-brand-lime/20 shadow-2xl">
                <div className="w-24 h-24 bg-brand-lime/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-brand-lime">
                    <Check size={48} className="text-brand-lime" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-6">تم إرسال الطلب بنجاح!</h2>

                {/* تفاصيل ما تم */}
                <div className="bg-brand-black/50 rounded-xl p-4 mb-6 text-right">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-brand-lime text-xl">📥</span>
                        <span className="text-gray-300">تم تحميل ملف PDF على جهازك</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-brand-lime text-xl">📧</span>
                        <span className="text-gray-300">تم إرسال نسخة للمصمم عبر البريد</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-brand-lime text-xl">📱</span>
                        <span className="text-gray-300">تم إرسال نسخة عبر التليقرام</span>
                    </div>
                </div>

                <p className="text-gray-400 mb-10 text-lg leading-relaxed">
                    سنقوم بمراجعة طلبك والرد عليك في أقرب وقت ممكن.
                </p>
                <div className="flex flex-col gap-4 w-full">
                    <Button
                        onClick={resetForm}
                        variant="primary"
                        size="lg"
                        className="bg-brand-lime text-black hover:bg-white hover:scale-105 shadow-lg w-full font-bold"
                    >
                        <Plus className="ml-2 w-5 h-5" /> ابدأ مشروع جديد
                    </Button>
                    <a href="#home" className="w-full">
                        <Button variant="outline" size="lg" className="hover:text-brand-lime hover:border-brand-lime w-full">العودة للرئيسية</Button>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuccessView;
