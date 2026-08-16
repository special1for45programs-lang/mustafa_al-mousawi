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
  companyName: string;
  updateFormData: (data: { companyName?: string; projectType?: string }) => void;
  projectType: string;
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

const SocialStepPlatforms: React.FC<SocialStepPlatformsProps> = ({
  socialData, updateSocialData, companyName, updateFormData, projectType,
}) => {

  const togglePlatform = (id: string) => {
    const current = socialData.platforms || [];
    const updated = current.includes(id)
      ? current.filter(p => p !== id)
      : [...current, id];
    updateSocialData({ platforms: updated });
  };

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* اسم الشركة / الحساب */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">
            اسم الشركة / الحساب <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={e => updateFormData({ companyName: e.target.value })}
            placeholder="الاسم كما يظهر في حساباتك"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-800">مجال العمل</label>
          <input
            type="text"
            value={projectType}
            onChange={e => updateFormData({ projectType: e.target.value })}
            placeholder="مثال: مطعم، عيادة، متجر إلكتروني..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* وصف المنتجات والخدمات */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-800">
          ما الذي تقدمه / تبيعه؟ <span className="text-red-500">*</span>
        </label>
        <textarea
          value={socialData.productsServices}
          onChange={e => updateSocialData({ productsServices: e.target.value })}
          placeholder="صف بإيجاز منتجاتك أو خدماتك، والجمهور المستهدف..."
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 h-28 focus:ring-2 focus:ring-brand-lime focus:border-transparent outline-none transition-all font-normal text-gray-900 placeholder:text-slate-400 resize-none leading-relaxed"
          required
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

    </div>
  );
};

export default SocialStepPlatforms;
