import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Info } from 'lucide-react';
import { SocialDetails, PostItem } from '../../types';

interface SocialStepContentProps {
  socialData: SocialDetails;
  updateSocialData: (data: Partial<SocialDetails>) => void;
  selectedPackageName?: string;
}

const CATEGORIES = [
  "ترويجي / بيعي",
  "تثقيفي / توعوي",
  "تفاعلي / مجتمعي",
  "تعريفي بالنشاط",
  "أخرى (تصنيف مخصص)"
];

const CustomCategoryDropdown = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: string[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-lg px-3 py-2 text-sm text-gray-900 font-semibold text-right flex justify-between items-center transition-all ${
          isOpen ? 'border-brand-lime ring-2 ring-brand-lime' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <span>{value || "اختر التصنيف..."}</span>
        <svg className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>
      
      {isOpen && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto py-1">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                value === option 
                  ? 'bg-brand-lime/10 text-gray-900 font-bold' 
                  : 'text-gray-900 font-medium hover:bg-gray-100'
              }`}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SocialStepContent: React.FC<SocialStepContentProps> = ({
  socialData, updateSocialData, selectedPackageName
}) => {
  const postsList = socialData.postsList || [];

  const getMaxPosts = () => {
    if (!selectedPackageName) return Infinity;
    
    // Explicit known package mappings
    if (selectedPackageName.includes('حضور')) return 8;
    if (selectedPackageName.includes('مستمر')) return 12;
    if (selectedPackageName.includes('تأثير') || selectedPackageName.includes('شامل')) return 15;
    if (selectedPackageName.includes('نمو')) return 15; // explicit fix for 'نمو'
    if (selectedPackageName.includes('بوست واحد')) return 1;
    
    // Fallback: extract numbers
    const match = selectedPackageName.match(/\d+/);
    if (match) return parseInt(match[0], 10);
    
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

  const handlePostChange = (index: number, updates: Partial<PostItem>) => {
    const updated = [...postsList];
    updated[index] = { ...updated[index], ...updates };
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
            <p className="text-xs font-bold text-brand-lime mt-1 bg-brand-black inline-block px-2 py-0.5 rounded">
              المنشورات المضافة: {postsList.length} {maxPosts !== Infinity ? `من ${maxPosts}` : ''}
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
              {index > 0 && (
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
              )}
              
              <h4 className="text-sm font-bold text-slate-800 mb-4 border-b border-gray-100 pb-2">
                بوست رقم {index + 1}
              </h4>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">تصنيف البوست</label>
                    <CustomCategoryDropdown
                      value={post.category}
                      options={CATEGORIES}
                      onChange={(newVal) => {
                        const updates: Partial<PostItem> = { category: newVal };
                        if (newVal !== "أخرى (تصنيف مخصص)") {
                            updates.customCategory = '';
                        }
                        handlePostChange(index, updates);
                      }}
                    />
                    {post.category === "أخرى (تصنيف مخصص)" && (
                      <div className="mt-2 animate-fadeIn">
                        <input
                          type="text"
                          value={post.customCategory || ''}
                          onChange={(e) => handlePostChange(index, { customCategory: e.target.value })}
                          placeholder="اكتب التصنيف المخصص..."
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime text-sm text-gray-900 font-medium"
                          required
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700">عنوان البوست رئيسي</label>
                    <input
                      type="text"
                      value={post.headline}
                      onChange={(e) => handlePostChange(index, { headline: e.target.value })}
                      placeholder="مثال: عرض خاص، مسابقة، إلخ..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime text-sm text-gray-900 font-medium"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700">شرح الفكرة / المحتوى</label>
                  <textarea
                    value={post.concept}
                    onChange={(e) => handlePostChange(index, { concept: e.target.value })}
                    placeholder="اشرح فكرة التصميم والنص المراد إضافته..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 h-20 outline-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime resize-none text-sm text-gray-900 font-medium"
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

export default React.memo(SocialStepContent);
