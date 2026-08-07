import React from 'react';
import { Zap } from 'lucide-react';
import { SocialDetails } from '../../types';

interface SocialStepContentProps {
  socialData: SocialDetails;
  updateSocialData: (data: Partial<SocialDetails>) => void;
}


const SocialStepContent: React.FC<SocialStepContentProps> = ({
  socialData, updateSocialData,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">

      {/* أفكار البوستات */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">
          أفكار وعناوين البوستات المطلوبة <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400">
          اكتب أفكار البوستات أو العروض أو الخصومات التي تريد تصميمها — كلما كانت التفاصيل أكثر، كانت النتيجة أفضل.
        </p>
        <textarea
          value={socialData.postIdeas}
          onChange={e => updateSocialData({ postIdeas: e.target.value })}
          placeholder={`مثال:\n• بوست عرض خصم 30% على الوجبات بمناسبة الافتتاح\n• بوست تعريفي بالخدمة الجديدة (توصيل مجاني)\n• بوست عيد ميلاد الشركة مع كوبون خاص`}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-40 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed text-sm"
          required
        />
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Zap size={12} className="text-brand-lime" />
          <span>{socialData.postIdeas?.length || 0} حرف — كلما كانت أفكارك أوضح، كلما جاء التصميم أدق</span>
        </div>
      </div>


      {/* ملاحظات إضافية */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">ملاحظات إضافية (اختياري)</label>
        <textarea
          value={socialData.additionalNotes}
          onChange={e => updateSocialData({ additionalNotes: e.target.value })}
          placeholder="أي تفاصيل أخرى تود إضافتها — ألوان محددة، خطوط تفضلها، أمور تريد تجنبها..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed text-sm"
        />
      </div>

    </div>
  );
};

export default SocialStepContent;
