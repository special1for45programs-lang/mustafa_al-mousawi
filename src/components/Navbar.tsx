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

          {/* زر قائمة الموبايل (Hamburger Menu) */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-brand-lime p-2 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={26} className="text-brand-lime" /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل المنبثقة */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950/95 backdrop-blur-xl border-b border-white/10 absolute w-full left-0 shadow-2xl animate-fadeIn" dir="rtl">
          <div className="px-4 pt-3 pb-5 space-y-2">
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
                  onClick={() => setIsOpen(false)} // إغلاق القائمة عند النقر
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                    isBrief
                      ? 'bg-brand-lime text-black font-bold hover:bg-lime-400 shadow-lg shadow-brand-lime/20 justify-between mt-2'
                      : isActive
                      ? 'text-brand-lime bg-brand-lime/10 border border-brand-lime/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent size={20} className={isBrief ? 'text-black' : isActive ? 'text-brand-lime' : 'text-gray-400'} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && !isBrief && (
                    <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse"></span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
