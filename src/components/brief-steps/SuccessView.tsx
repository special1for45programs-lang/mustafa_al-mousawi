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
                <h2 className="text-3xl font-bold text-white mb-6">تم استلام معلومات مشروعك بنجاح! 🚀</h2>
                
                <p className="text-gray-300 mb-10 text-lg leading-relaxed bg-brand-black/50 p-6 rounded-xl border border-white/5">
                    يقوم مصطفى حالياً بمراجعة التفاصيل، وسيتم التواصل معك مباشرة عبر الواتسآب/التليجرام لمشاركة نسخة الملف والبدء بالعمل.
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
