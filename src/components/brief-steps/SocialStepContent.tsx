import React from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { SocialDetails } from '../../types';

interface SocialStepContentProps {
  socialData: SocialDetails;
  updateSocialData: (data: Partial<SocialDetails>) => void;
  selectedPackageName?: string;
}

const CATEGORIES = [
  "ترويجي / بيعي",
  "تثقيفي / توعوي",
  "تفاعلي / مجتمعي",
  "تعريفي بالنشاط"
];

const SocialStepContent: React.FC<SocialStepContentProps> = ({
  socialData, updateSocialData, selectedPackageName
}) => {
  const postsList = socialData.postsList || [];

  const getMaxPosts = () => {
    if (!selectedPackageName) return Infinity;
    const match = selectedPackageName.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    if (selectedPackageName.includes('حضور')) return 8;
    if (selectedPackageName.includes('مستمر')) return 12;
    if (selectedPackageName.includes('تأثير') || selectedPackageName.includes('شامل')) return 15;
    if (selectedPackageName.includes('بوست واحد')) return 1;
    return Infinity;
  };

  const maxPosts = getMaxPosts();

  const handleAddPost = () => {
    if (postsList.length >= maxPosts) {
      alert("لقد وصلت للحد الأقصى لعدد البوستات في باقتك الحالية. لترقية باقتك، يرجى التواصل معنا أو إضافة ملاحظة عامة.");
      return;
    }
    updateSocialData({
      postsList: [...postsList, { category: 'ترويجي / بيعي', headline: '', concept: '' }]
    });
  };

  const handleRemovePost = (index: number) => {
    const updated = postsList.filter((_, i) => i !== index);
    updateSocialData({ postsList: updated });
  };

  const handlePostChange = (index: number, field: string, value: string) => {
    const updated = [...postsList];
    updated[index] = { ...updated[index], [field]: value };
    updateSocialData({ postsList: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* تفاصيل البوستات (البطاقات) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-semibold text-slate-800">
              تفاصيل ومحتوى البوستات <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mt-1">
              اكتب أفكار وعناوين البوستات المطلوبة (الحد الأقصى لباقتك: {maxPosts === Infinity ? 'غير محدود' : maxPosts})
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddPost}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-lime text-brand-black text-xs font-bold rounded-lg hover:bg-brand-lime/90 transition-colors active:scale-95"
          >
            <Plus size={14} />
            إضافة بوست
          </button>
        </div>

        {postsList.length === 0 && (
          <div className="text-center py-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <p className="text-sm text-gray-500">لم تقم بإضافة أي بوستات بعد.</p>
          </div>
        )}

        <div className="space-y-4">
          {postsList.map((post, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative">
              <div className="absolute top-4 left-4">
                <button
                  type="button"
                  onClick={() => handleRemovePost(index)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                  title="حذف البوست"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                بوست رقم {index + 1}
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">تصنيف البوست</label>
                    <div className="relative">
                      <select
                        value={post.category}
                        onChange={(e) => handlePostChange(index, 'category', e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 appearance-none outline-none focus:ring-2 focus:ring-brand-lime text-sm"
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-gray-500">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">عنوان البوست رئيسي</label>
                    <input
                      type="text"
                      value={post.headline}
                      onChange={(e) => handlePostChange(index, 'headline', e.target.value)}
                      placeholder="مثال: عرض خاص، مسابقة، إلخ..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-lime text-sm"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">شرح الفكرة / المحتوى</label>
                  <textarea
                    value={post.concept}
                    onChange={(e) => handlePostChange(index, 'concept', e.target.value)}
                    placeholder="اشرح فكرة التصميم والنص المراد إضافته..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 h-20 outline-none focus:ring-2 focus:ring-brand-lime resize-none text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {postsList.length >= maxPosts && maxPosts !== Infinity && (
          <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <p>لقد وصلت للحد الأقصى لعدد البوستات في باقتك الحالية ({maxPosts}). لترقية باقتك، يرجى التواصل معنا أو إضافة ملاحظة في الحقل أدناه.</p>
          </div>
        )}
      </div>

      {/* ملاحظات إضافية */}
      <div className="space-y-2 pt-4 border-t border-gray-100">
        <label className="text-sm font-semibold text-slate-800">ملاحظات إضافية (اختياري)</label>
        <textarea
          value={socialData.additionalNotes}
          onChange={e => updateSocialData({ additionalNotes: e.target.value })}
          placeholder="أي تفاصيل أخرى تود إضافتها عن البوستات بشكل عام..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-24 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed text-sm"
        />
      </div>

    </div>
  );
};

export default SocialStepContent;
