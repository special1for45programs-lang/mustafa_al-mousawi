
import React from 'react';
import { Search, PenTool, Layers, Package, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';

// مكون طريقة العمل (Process)
const Process: React.FC = () => {
  // خطوات العمل
  const steps = [
    {
      icon: Search,
      title: "1. الاكتشاف",
      description: "نبدأ بتحليل موجزك. نتعمق في منافسيك، وجمهورك، و'السبب' وراء مشروعك. هنا تولد الاستراتيجية."
    },
    {
      icon: PenTool,
      title: "2. الرسم والمفاهيم",
      description: "أنتقل إلى كراسة الرسم. لا أجهزة كمبيوتر حتى الآن. مجرد أفكار خام تتدفق على الورق للعثور على أقوى الاستعارات لعلامتك التجارية."
    },
    {
      icon: Layers,
      title: "3. التحسين والتطوير",
      description: "يتم تحويل أفضل المفاهيم رقمياً باستخدام Adobe Illustrator. نختبرها على خلفيات وأحجام وتطبيقات مختلفة."
    },
    {
      icon: Package,
      title: "4. التسليم",
      description: "تتلقى دليلاً كاملاً للعلامة التجارية: ملفات فيكتور، أكواد الألوان، أنظمة الخطوط، وأدلة الاستخدام."
    }
  ];

  return (
    <div className="py-24 bg-brand-black relative overflow-hidden">
       {/* عناصر خلفية */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent pointer-events-none"></div>
       <div className="absolute top-1/2 left-10 w-20 h-20 border border-brand-lime/10 rounded-lg rotate-12 animate-float pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* عنوان القسم */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">العلم وراء الفن</h2>
          <p className="text-gray-400 text-lg">
            الشعارات العظيمة لا يتم "تلفيقها" في لحظة. هي نتيجة عملية صارمة من الحذف، والتحسين، والتفكير الاستراتيجي.
          </p>
        </div>

        {/* الجدول الزمني للخطوات */}
        <div className="relative">
            {/* خط عمودي في المنتصف (للشاشات الكبيرة) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-lime/50 to-transparent"></div>

            <div className="space-y-24">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index} className={`flex flex-col md:flex-row items-center gap-8 md:gap-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* المحتوى النصي */}
                    <div className="flex-1 w-full md:w-1/2 md:px-12 text-center md:text-right group">
                       <div className={`inline-flex items-center justify-center p-4 rounded-full bg-brand-lime text-black mb-4 shadow-[0_0_15px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                       </div>
                       <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-brand-lime transition-colors">{step.title}</h3>
                       <p className="text-gray-400 leading-relaxed">{step.description}</p>
                    </div>

                    {/* نقطة الربط على الخط الزمني */}
                    <div className="relative flex items-center justify-center w-8 h-8">
                       <div className="w-4 h-4 rounded-full bg-brand-lime ring-4 ring-black z-10"></div>
                    </div>

                    {/* جانب فارغ للتوازن */}
                    <div className="flex-1 hidden md:block w-1/2"></div>
                  </div>
                );
              })}
            </div>
        </div>

        {/* قسم التسليمات */}
        <div className="mt-32 bg-brand-dark rounded-2xl p-8 md:p-12 border border-brand-lime/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-lime/10 rounded-bl-full animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">ما ستحصل عليه فعلياً</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">
                أنا لا أحتفظ بالملفات كرهينة. عندما ننتهي، ستحصل على كل ما تحتاجه لإطلاق علامتك التجارية بثقة.
              </p>
              <a href="#brief">
                <Button className="bg-brand-lime text-black hover:bg-white border-none font-bold">ابدأ مشروعك</Button>
              </a>
            </div>
            
            <div className="bg-black/40 rounded-xl p-8 border border-white/5 shadow-2xl">
              <h4 className="text-brand-lime font-bold mb-6 uppercase tracking-wider text-sm">حزمة التسليمات</h4>
              <ul className="space-y-4">
                {[
                  "الشعار الرئيسي (Vector AI, EPS, SVG)",
                  "الشعار الثانوي / الرمز (PNG, JPG)",
                  "لوحة الألوان (Hex, CMYK, RGB)",
                  "نظام الخطوط (Typography)",
                  "صور الملفات الشخصية للسوشيال ميديا",
                  "ملف إرشادات العلامة التجارية PDF"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle2 size={20} className="text-brand-lime" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Process;
