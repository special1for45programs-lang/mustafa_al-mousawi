import React, { useState } from 'react';
import { Search, PenTool, Layers, Monitor, Target, Layout, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

// مسارات العمل والبيانات
const processData = {
  logo: {
    title: "مسار الشعارات والهويات",
    steps: [
      {
        icon: Search,
        title: "1. الاستكشاف والتحليل الشامل",
        description: "نبدأ بتحليل موجزك. نتعمق في منافسيك، وجمهورك، و'السبب' وراء مشروعك. هنا تولد الاستراتيجية."
      },
      {
        icon: PenTool,
        title: "2. تطوير الأفكار والمفاهيم",
        description: "أنتقل إلى كراسة الرسم. لا أجهزة كمبيوتر حتى الآن. مجرد أفكار خام تتدفق على الورق للعثور على أقوى الاستعارات لعلامتك التجارية."
      },
      {
        icon: Layers,
        title: "3. التشبيك والرسم الهندسي الدقيق",
        description: "يتم تحويل أفضل المفاهيم رقمياً باستخدام Adobe Illustrator. نختبرها على خلفيات وأحجام وتطبيقات مختلفة."
      },
      {
        icon: Monitor,
        title: "4. التطبيقات البصرية والمحاكاة",
        description: "نضع الشعار في بيئته الحقيقية لنرى كيف يتفاعل مع العالم الخارجي والمطبوعات والشاشات."
      },
    ]
  },
  social: {
    title: "مسار السوشيال ميديا",
    steps: [
      {
        icon: Target,
        title: "1. تحليل النشاط التجاري والجمهور المستهدف",
        description: "نحدد أهداف تواجدك الرقمي ونحلل سلوك جمهورك لضمان تقديم محتوى يلامس اهتماماتهم."
      },
      {
        icon: Layout,
        title: "2. صياغة الأفكار والبناء البصري",
        description: "نضع الهيكل العام للمنشورات وتوزيع العناصر البصرية بطريقة تضمن انسيابية القراءة والجاذبية."
      },
      {
        icon: Sparkles,
        title: "3. التصميم والإخراج الإبداعي عالي التباين",
        description: "نطبق الألوان، الصور، والنصوص بأسلوب إبداعي يبرز هويتك ويجعل المحتوى لافتاً للانتباه."
      },
    ]
  }
};

const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'logo' | 'social'>('logo');

  const currentData = processData[activeTab];

  return (
    <div className="py-24 bg-brand-black relative overflow-hidden">
       {/* عناصر خلفية */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent pointer-events-none"></div>
       <div className="absolute top-1/2 left-10 w-20 h-20 border border-brand-lime/10 rounded-lg rotate-12 animate-float pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* عنوان القسم */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">العلم وراء الفن</h2>
          <p className="text-gray-400 text-lg mb-8">
            العمل العظيم لا يتم "تلفيقه" في لحظة. هو نتيجة عملية صارمة من الحذف، والتحسين، والتفكير الاستراتيجي.
          </p>
        </div>

        {/* Tab Switcher (Fluid & Equal Width) */}
        <div className="w-full max-w-md mx-auto flex items-center justify-center p-1 sm:p-1.5 bg-zinc-900/90 rounded-full border border-white/10 mb-12 sm:mb-20 gap-1 shadow-lg">
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`flex-1 py-2.5 sm:py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-center transition-all duration-300 ${
              activeTab === 'logo'
                ? 'bg-brand-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            مسار الشعارات والهويات
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`flex-1 py-2.5 sm:py-3 px-4 rounded-full font-bold text-xs sm:text-sm text-center transition-all duration-300 ${
              activeTab === 'social'
                ? 'bg-brand-lime text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            مسار السوشيال ميديا
          </button>
        </div>

        {/* الجدول الزمني للخطوات */}
        <div className="relative min-h-[600px]">
            {/* خط عمودي في المنتصف (للشاشات الكبيرة) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-lime/50 to-transparent"></div>

            <div key={activeTab} className="space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
              {currentData.steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* المحتوى النصي */}
                    <div className="flex-1 w-full md:w-1/2 md:px-12 text-center md:text-right group">
                       <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-brand-lime text-black mb-4 shadow-[0_0_15px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 md:w-8 md:h-8" />
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-lime transition-colors">{step.title}</h3>
                       <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>

                    {/* نقطة الربط على الخط الزمني */}
                    <div className="relative flex items-center justify-center w-8 h-8">
                       <div className="w-4 h-4 rounded-full bg-brand-lime ring-4 ring-black z-10 transition-all duration-300 group-hover:ring-brand-lime/20 group-hover:scale-125"></div>
                    </div>

                    {/* جانب فارغ للتوازن */}
                    <div className="flex-1 hidden md:block w-1/2"></div>
                  </div>
                );
              })}
            </div>
        </div>



      </div>
    </div>
  );
};

export default Process;
