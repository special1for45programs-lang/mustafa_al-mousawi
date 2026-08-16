import React, { useState } from 'react';
import { Check, Star, Zap, TrendingUp, Layers, ChevronLeft, ChevronDown } from 'lucide-react';
import { PACKAGES_DATA } from '../constants';
import { SelectedPackage } from '../App';

// ==========================================
// مكوّن قسم الباقات والأسعار
// ==========================================

interface PackagesProps {
  onPackageSelect: (pkg: SelectedPackage) => void;
}

// دالة تنسيق السعر بالدينار العراقي
const formatPrice = (price: number) =>
  price.toLocaleString('en-US') + ' د.ع';

// ألوان التبويبات
const TABS = [
  { id: 'logo',     label: 'تصميم الشعار',    icon: Star },
  { id: 'branding', label: 'الهوية البصرية',  icon: Layers },
  { id: 'social',   label: 'سوشيال ميديا',    icon: TrendingUp },
];

// ==========================================
// Tab 1: بطاقات شعارات
// ==========================================
const LogoCard: React.FC<{ pkg: any, onSelect: (pkg: SelectedPackage) => void }> = ({ pkg, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-2xl
        ${pkg.isPopular
          ? 'border-brand-lime bg-gradient-to-b from-brand-lime/10 to-brand-dark shadow-[0_0_30px_rgba(204,255,0,0.15)]'
          : 'border-white/10 bg-brand-dark hover:border-white/25'
        }`}
    >
      {/* شارة الأكثر طلباً */}
      {pkg.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-lime text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          ⭐ {pkg.badge}
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* الاسم والسعر */}
        <div className="mb-4">
          <p className="text-xs font-bold tracking-widest text-brand-lime/70 mb-1 uppercase select-auto">{pkg.nameEn}</p>
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
          <p className="italic text-zinc-400 text-xs mb-4 leading-relaxed">{pkg.target}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{formatPrice(pkg.price)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">🕐 {pkg.deliveryDays}</p>
        </div>

        {/* الفائدة (Benefit) - بارزة */}
        <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-3 mb-5">
          <p className="text-brand-lime text-sm font-semibold leading-relaxed">
            {pkg.benefit}
          </p>
        </div>

        {/* المحتوى (Accordion for mobile) */}
        <div className="flex-1 mb-6">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-bold text-white mb-3 sm:pointer-events-none"
          >
            محتوى الباقة
            <ChevronDown size={16} className={`sm:hidden transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          <div className={`space-y-2.5 overflow-hidden transition-all duration-300 sm:max-h-full sm:opacity-100 ${isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 sm:mt-3'}`}>
            {pkg.features.map((f: string, i: number) => (
              <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                <Check size={15} className="text-brand-lime mt-0.5 shrink-0" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* صيغ الملفات */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {pkg.deliveries.map((d: string) => (
            <span key={d} className="text-[11px] bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded">
              {d}
            </span>
          ))}
        </div>

        {/* زر الطلب */}
        <button
          onClick={() => onSelect({
            id: pkg.id,
            name: pkg.name,
            nameEn: pkg.nameEn,
            price: pkg.price,
            type: 'logo',
            category: pkg.category,
          })}
          className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group mt-auto
            ${pkg.isPopular
              ? 'bg-brand-lime text-black hover:bg-white hover:shadow-lg hover:shadow-brand-lime/20'
              : 'bg-white/10 text-white border border-white/20 hover:bg-brand-lime hover:text-black hover:border-brand-lime'
            }`}
        >
          طلب الباقة
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const LogoTab: React.FC<{ onSelect: (pkg: SelectedPackage) => void }> = ({ onSelect }) => {
  const logos = PACKAGES_DATA.logoDesign;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {logos.map((pkg) => (
        <LogoCard key={pkg.id} pkg={pkg} onSelect={onSelect} />
      ))}
    </div>
  );
};

// ==========================================
// Tab 2: الهوية البصرية المتكاملة
// ==========================================
const BrandingTab: React.FC<{ onSelect: (pkg: SelectedPackage) => void }> = ({ onSelect }) => {
  const b = PACKAGES_DATA.branding;
  const savingsPct = Math.round(((b.originalPrice - b.currentPrice) / b.originalPrice) * 100);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative rounded-2xl border border-brand-lime/40 bg-gradient-to-br from-brand-lime/10 via-brand-dark to-brand-dark overflow-hidden shadow-[0_0_60px_rgba(204,255,0,0.12)]">

        {/* شريط الخصم */}
        <div className="bg-brand-lime text-black text-center py-2 text-sm font-bold tracking-wide">
          🎉 وفّر {savingsPct}% — عرض محدود المدة
        </div>

        <div className="p-8 md:p-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
            <div>
              <p className="text-brand-lime/70 text-xs font-bold tracking-widest uppercase mb-1 select-auto">FULL BRAND IDENTITY</p>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">{b.name}</h3>
              {b.target && <p className="italic text-zinc-400 text-sm mb-2">{b.target}</p>}
            </div>
            <div className="text-right">
              <p className="text-gray-500 line-through text-lg">{formatPrice(b.originalPrice)}</p>
              <p className="text-4xl font-extrabold text-brand-lime">{formatPrice(b.currentPrice)}</p>
              <p className="text-green-400 text-sm mt-1">توفير {formatPrice(b.savings)}</p>
            </div>
          </div>

          {/* الفائدة */}
          <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-xl p-4 mb-6">
            <p className="text-brand-lime text-base font-semibold leading-relaxed">
              {b.benefit}
            </p>
          </div>

          {/* المميزات */}
          <div className="mb-6">
            <h4 className="text-base md:text-lg text-white font-bold mb-4">محتوى الباقة:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {b.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <Check size={16} className="text-brand-lime mt-0.5 shrink-0" />
                  <span className="text-gray-300 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* الإضافات */}
          {b.bonuses && b.bonuses.length > 0 && (
            <div className="bg-brand-lime/5 border border-brand-lime/20 rounded-xl p-4 mb-6">
              <p className="text-brand-lime text-sm font-bold mb-3">🎁 مكافآت مجانية:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {b.bonuses.map((bonus, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Zap size={14} className="text-brand-lime mt-0.5 shrink-0" />
                    <span className="text-gray-300 text-sm">{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => onSelect({
            id: 'branding',
            name: b.name,
            nameEn: 'Full Brand Identity',
            price: b.currentPrice,
            type: 'branding',
            category: b.category,
          })}
            className="w-full py-4 rounded-xl bg-brand-lime text-black font-bold text-lg hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_25px_rgba(204,255,0,0.25)] hover:shadow-[0_0_40px_rgba(204,255,0,0.4)]"
          >
            احجز باقتك الآن
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Tab 3: السوشيال ميديا
// ==========================================
const SocialPlanCard: React.FC<{ plan: any, onSelect: (pkg: SelectedPackage) => void }> = ({ plan, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
        ${plan.isPopular
          ? 'border-brand-lime bg-gradient-to-b from-brand-lime/10 to-brand-dark shadow-[0_0_30px_rgba(204,255,0,0.15)]'
          : 'border-white/10 bg-brand-dark hover:border-white/25'
        }`}
    >
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-lime text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
          ⭐ الأكثر طلباً
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs text-brand-lime/70 font-bold tracking-widest uppercase mb-1 select-auto">{plan.nameEn}</p>
        <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2">{plan.name}</h4>
        
        <p className="text-3xl font-extrabold text-white mt-1 mb-1">{formatPrice(plan.price)}</p>
        <p className="text-gray-500 text-xs mb-5">شهرياً</p>

        {/* الفائدة */}
        <div className="bg-brand-lime/10 border border-brand-lime/20 rounded-lg p-3 mb-5">
          <p className="text-brand-lime text-sm font-semibold leading-relaxed">
            {plan.benefit}
          </p>
        </div>

        {/* المحتوى (Accordion for mobile) */}
        <div className="flex-1 mb-6">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full text-sm font-bold text-white mb-3 sm:pointer-events-none"
          >
            محتوى الباقة
            <ChevronDown size={16} className={`sm:hidden transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
          
          <ul className={`space-y-2.5 overflow-hidden transition-all duration-300 sm:max-h-full sm:opacity-100 ${isExpanded ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0 sm:mt-3'}`}>
            <li className="flex items-start gap-2 text-sm text-gray-300">
              <Check size={14} className="text-brand-lime shrink-0 mt-0.5" />
              <span>{plan.postsPerMonth} بوست / شهر</span>
            </li>
            {plan.storiesPerMonth > 0 && (
              <li className="flex items-start gap-2 text-sm text-gray-300">
                <Check size={14} className="text-brand-lime shrink-0 mt-0.5" />
                <span>{plan.storiesPerMonth} ستوري / شهر</span>
              </li>
            )}
            {plan.extras?.map((ex: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <Check size={14} className="text-brand-lime shrink-0 mt-0.5" />
                <span>{ex}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => onSelect({
            id: plan.id,
            name: plan.name,
            nameEn: plan.nameEn,
            price: plan.price,
            type: 'social',
            category: plan.category,
          })}
          className={`w-full mt-auto py-3 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 group
            ${plan.isPopular
              ? 'bg-brand-lime text-black hover:bg-white'
              : 'bg-white/10 text-white border border-white/20 hover:bg-brand-lime hover:text-black hover:border-brand-lime'
            }`}
        >
          اشترك الآن
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

const SocialTab: React.FC<{ onSelect: (pkg: SelectedPackage) => void }> = ({ onSelect }) => {
  const { individualPosts, monthlyPlans } = PACKAGES_DATA.socialMedia;

  return (
    <div className="space-y-10">
      {/* البوستات الفردية */}
      <div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-5 flex items-center gap-2">
          <Zap size={20} className="text-brand-lime" />
          تصاميم بوستات مفردة
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {individualPosts.map((post) => (
            <div
              key={post.quantity}
              className="bg-brand-dark border border-white/10 hover:border-brand-lime/40 rounded-xl p-5 text-center transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] group"
            >
              <p className="text-3xl font-extrabold text-white mb-1">{post.quantity}</p>
              <p className="text-xs text-gray-500 mb-3">{post.quantity === 1 ? 'بوست مفرد' : `باقة ${post.quantity} بوستات`}</p>
              <p className="text-brand-lime font-bold text-lg">{formatPrice(post.price)}</p>
              {post.savings && (
                <p className="text-green-400 text-xs mt-1">وفّر {formatPrice(post.savings)}</p>
              )}
              <button
                onClick={() => onSelect({
                  id: `social-${post.quantity}`,
                  name: post.quantity === 1 ? 'بوست مفرد' : `باقة ${post.quantity} بوستات`,
                  nameEn: `${post.quantity} Post${post.quantity > 1 ? 's' : ''}`,
                  price: post.price,
                  type: 'social',
                  category: post.category,
                })}
                className="mt-4 w-full py-2 rounded-lg bg-white/8 border border-white/15 text-white text-sm font-semibold hover:bg-brand-lime hover:text-black hover:border-brand-lime transition-all duration-300 group-hover:border-brand-lime/50"
              >
                اطلب الآن
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* الاشتراكات الشهرية */}
      <div>
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-5 flex items-center gap-2">
          <TrendingUp size={20} className="text-brand-lime" />
          اشتراكات إدارة السوشيال ميديا
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {monthlyPlans.map((plan) => (
            <SocialPlanCard key={plan.id} plan={plan} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// المكوّن الرئيسي
// ==========================================
const Packages: React.FC<PackagesProps> = ({ onPackageSelect }) => {
  const [activeTab, setActiveTab] = useState<'logo' | 'branding' | 'social'>('logo');

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-black relative overflow-hidden">
      {/* خلفية زخرفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-lime/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* العنوان */}
        <div className="text-center mb-14">
          <span className="inline-block text-brand-lime text-sm font-bold tracking-widest uppercase mb-3 bg-brand-lime/10 px-4 py-1.5 rounded-full border border-brand-lime/20">
            الباقات والأسعار
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            اختر ما يناسب <span className="text-brand-lime">مشروعك</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            أسعار شفافة بلا رسوم خفية — اختر باقتك وستُفتح لك الاستمارة المخصصة مباشرة.
          </p>
        </div>

        {/* التبويبات (Fluid & Equal Width Across Mobile/Tablet/Desktop) */}
        <div className="w-full max-w-xl mx-auto mb-10">
          <div className="w-full flex gap-1 bg-brand-dark/90 border border-white/10 rounded-xl p-1 sm:p-1.5 backdrop-blur-sm shadow-lg">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 text-center
                  ${activeTab === id
                    ? 'bg-brand-lime text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* محتوى التبويب */}
        <div className="animate-fadeIn">
          {activeTab === 'logo'     && <LogoTab     onSelect={onPackageSelect} />}
          {activeTab === 'branding' && <BrandingTab onSelect={onPackageSelect} />}
          {activeTab === 'social'   && <SocialTab   onSelect={onPackageSelect} />}
        </div>

        {/* شريط الشروط */}
        <div className="mt-14 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <p className="text-brand-lime text-lg font-bold mb-6 text-center">شروط وترتيبات العمل</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PACKAGES_DATA.terms.map((term, i) => (
              <div key={i} className="flex items-start gap-3 bg-zinc-950/50 p-4 rounded-xl border border-white/5">
                <span className="text-xl shrink-0 leading-none mt-0.5">{term.icon}</span>
                <p className="text-zinc-300 text-sm leading-relaxed">{term.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Packages;
