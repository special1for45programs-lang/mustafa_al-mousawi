import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Briefcase, Layers, FileText, Compass, Sparkles } from 'lucide-react';
import { NAVIGATION, ASSETS } from '../constants';
import { Button } from './ui/Button';

// مكون شريط التنقل العلوي (Navbar)
const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // حالة القائمة في وضع الموبايل
  const [activeSection, setActiveSection] = useState('home'); // حالة القسم النشط حالياً

  // تتبع التمرير لتحديد القسم النشط وتحديث القائمة العلوية
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // إضافة إزاحة صغيرة

      // البحث عن القسم الحالي
      const sections = NAVIGATION.map(item => item.path.replace('#', ''));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20" dir="ltr">
          
          {/* الشعار واسم العلامة التجارية */}
          <a href="#home" className="flex-shrink-0 group">
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }} dir="ltr">
              <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                <img 
                  src={ASSETS.logo} 
                  alt="Mustafa Al Mousawi Logo" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const parent = target.parentElement;
                    if (parent) {
                      target.style.display = 'none';
                      parent.innerText = 'M';
                      parent.classList.add('text-brand-lime', 'font-bold', 'text-3xl');
                    }
                  }}
                />
              </div>
              <div className="flex flex-col text-left items-start">
                <span className="font-bold leading-none text-white tracking-wider uppercase text-sm group-hover:text-brand-lime transition-colors text-left">
                  MUSTAFA
                </span>
                <span className="text-gray-500 text-xs leading-none uppercase tracking-widest text-left">
                  AL MOUSAWI
                </span>
              </div>
            </div>
          </a>

          {/* قائمة التنقل لسطح المكتب (Desktop Menu) */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse" dir="rtl">
            {/* عرض الروابط باستثناء الأزرار الخاصة */}
            {NAVIGATION.filter(item => item.path !== '#brief' && item.path !== '#resume').map((item) => {
              const isActive = activeSection === item.path.replace('#', '');
              return (
                <a
                  key={item.path}
                  href={item.path}
                  className={`text-base font-medium transition-colors relative py-2 ${
                    isActive ? 'text-brand-lime' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                  {/* خط تحت العنصر النشط */}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-brand-lime transform transition-transform duration-300 ${isActive ? 'scale-x-100' : 'scale-x-0'}`}></span>
                </a>
              );
            })}
            
            {/* زر السيرة الذاتية */}
            <a href="#resume">
              <Button 
                variant="outline" 
                size="sm" 
                className={`hover:text-brand-lime hover:border-brand-lime ${activeSection === 'resume' ? 'border-brand-lime text-brand-lime' : ''}`}
              >
                السيرة الذاتية
              </Button>
            </a>

            {/* زر الحث على اتخاذ إجراء (CTA) */}
            <a href="#brief">
              <Button variant="primary" size="sm" className="bg-brand-lime text-black hover:bg-white border-none font-bold">
                ابدأ مشروعك
              </Button>
            </a>
          </div>

        </div>
      </div>

      {/* شريط التنقل السفلي للموبايل (Bottom Navigation Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-around items-center bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/10 px-2 py-3 pb-safe" dir="rtl">
        {NAVIGATION.map((item) => {
          const sectionId = item.path.replace('#', '');
          const isActive = activeSection === sectionId;
          const isBrief = item.path === '#brief';

          let IconComponent = Home;
          if (item.path === '#portfolio') IconComponent = Briefcase;
          if (item.path === '#packages') IconComponent = Layers;
          if (item.path === '#resume') IconComponent = FileText;
          if (item.path === '#process') IconComponent = Compass;
          if (item.path === '#brief') IconComponent = Sparkles;

          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all relative ${
                isBrief 
                  ? 'text-black bg-brand-lime -mt-6 shadow-lg shadow-brand-lime/20 h-14 w-14 rounded-full' 
                  : isActive
                  ? 'text-brand-lime'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <IconComponent size={isBrief ? 24 : 22} className={isBrief ? 'mb-1' : ''} />
              {!isBrief && (
                <span className="text-[10px] font-medium">{item.label}</span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
