import React from 'react';
import { SocialDetails } from '../../types';
import {
  Instagram,
  Facebook,
  Music, // TikTok
  Twitter,
  Ghost, // Snapchat
  Linkedin,
  Youtube,
  Send, // Telegram
  Globe
} from 'lucide-react';

interface SocialStepPlatformsProps {
  socialData: SocialDetails;
  updateSocialData: (data: Partial<SocialDetails>) => void;
}

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram / إنستغرام', icon: Instagram, activeClass: 'border-[#E4405F] bg-[#E4405F]/10 text-[#E4405F]' },
  { id: 'facebook',  label: 'Facebook / فيسبوك',  icon: Facebook, activeClass: 'border-[#1877F2] bg-[#1877F2]/10 text-[#1877F2]' },
  { id: 'tiktok',    label: 'TikTok / تيك توك',    icon: Music, activeClass: 'border-gray-900 bg-gray-900/10 text-gray-900' },
  { id: 'twitter',   label: 'X (تويتر)',         icon: Twitter, activeClass: 'border-gray-900 bg-gray-900/10 text-gray-900' },
  { id: 'snapchat',  label: 'Snapchat / سناب شات',  icon: Ghost, activeClass: 'border-[#D97706] bg-[#D97706]/10 text-[#D97706]' },
  { id: 'linkedin',  label: 'LinkedIn / لينكدإن',  icon: Linkedin, activeClass: 'border-[#0A66C2] bg-[#0A66C2]/10 text-[#0A66C2]' },
  { id: 'youtube',   label: 'YouTube / يوتيوب',   icon: Youtube, activeClass: 'border-[#FF0000] bg-[#FF0000]/10 text-[#FF0000]' },
  { id: 'telegram',  label: 'Telegram / تيليجرام',  icon: Send, activeClass: 'border-[#26A5E4] bg-[#26A5E4]/10 text-[#26A5E4]' },
];

const CONTENT_MIX_OPTIONS = [
  "عروض بيع وترويج",
  "محتوى تثقيفي ونصائح",
  "اقتباسات وعبارات",
  "مسابقات وتفاعل",
  "تغطية فعاليات"
];

const SocialStepPlatforms: React.FC<SocialStepPlatformsProps> = ({
  socialData, updateSocialData,
}) => {

  const togglePlatform = (id: string) => {
    const current = socialData.platforms || [];
    const updated = current.includes(id)
      ? current.filter(p => p !== id)
      : [...current, id];
    updateSocialData({ platforms: updated });
  };

  const toggleContentMix = (option: string) => {
    const current = socialData.contentMix || [];
    const updated = current.includes(option)
      ? current.filter(o => o !== option)
      : [...current, option];
    updateSocialData({ contentMix: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* روابط الحسابات الحالية */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">
          روابط الحسابات الحالية <span className="text-xs font-normal text-gray-400 mr-1">(اختياري)</span>
        </label>
        <textarea
          value={socialData.currentAccountsLinks || ''}
          onChange={e => updateSocialData({ currentAccountsLinks: e.target.value })}
          placeholder="ضع روابط حساباتك الحالية هنا لنتمكن من الاطلاع عليها، أو اترك الحقل فارغاً إذا كان الحساب جديداً..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-base sm:text-sm text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed"
        />
      </div>

      {/* المنصات المستهدفة */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-800">
          المنصات المستهدفة <span className="text-red-500">*</span>
          <span className="text-gray-400 font-normal mr-1">(اختر كل ما ينطبق)</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLATFORMS.map(p => {
            const selected = (socialData.platforms || []).includes(p.id);
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => togglePlatform(p.id)}
                className={`group flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all duration-200
                  ${selected
                    ? p.activeClass + ' shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-white'
                  }`}
              >
                {p.icon ? (
                  <p.icon className={`w-5 h-5 transition-colors duration-200 ${selected ? '' : 'text-gray-400 group-hover:text-gray-600'}`} />
                ) : (
                  <Globe className={`w-5 h-5 transition-colors duration-200 ${selected ? '' : 'text-gray-400 group-hover:text-gray-600'}`} />
                )}
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>
        {(socialData.platforms || []).length === 0 && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            ⚠️ يرجى اختيار منصة واحدة على الأقل
          </p>
        )}
      </div>

      {/* أنواع المحتوى المطلوب تصميمه */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-800">
          أنواع المحتوى المطلوب تصميمه <span className="text-xs font-normal text-gray-400 mr-1">(اختر ما ينطبق)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CONTENT_MIX_OPTIONS.map(option => {
            const selected = (socialData.contentMix || []).includes(option);
            return (
              <label
                key={option}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  selected ? 'border-brand-lime bg-brand-lime/10' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleContentMix(option)}
                  className="w-4 h-4 text-brand-lime focus:ring-brand-lime border-gray-300 rounded"
                />
                <span className={`text-sm font-semibold ${selected ? 'text-slate-800' : 'text-gray-600'}`}>
                  {option}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* جاهزية الشعار والملفات */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">
          جاهزية الشعار والملفات <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            value={socialData.assetsAvailability || ''}
            onChange={e => updateSocialData({ assetsAvailability: e.target.value })}
            className="w-full bg-white text-gray-900 border border-gray-200 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-brand-lime focus:border-brand-lime outline-none transition-all font-semibold text-base sm:text-sm"
            required
          >
            <option value="" disabled className="text-gray-900">اختر الحالة...</option>
            <option value="لدي شعار مفرغ بجودة عالية" className="text-gray-900">لدي شعار مفرغ بجودة عالية</option>
            <option value="لدي شعار لكن يحتاج إعادة رسم أو تفريغ" className="text-gray-900">لدي شعار لكن يحتاج إعادة رسم أو تفريغ</option>
            <option value="لا أملك شعاراً وأحتاج تصميمه أولاً" className="text-gray-900">لا أملك شعاراً وأحتاج تصميمه أولاً</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SocialStepPlatforms;
