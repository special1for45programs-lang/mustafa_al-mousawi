import React, { useState, useEffect } from 'react';
import { Home, Briefcase, Layers, FileText, Compass } from 'lucide-react';
import { NAVIGATION, ASSETS } from '../constants';
import { Button } from './ui/Button';

// مكون شريط التنقل العلوي (Navbar)
const Navbar: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home'); // القسم النشط للتظليل
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const lastScrollY = React.useRef(0);

  // Mobile Keyboard Detection
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setIsKeyboardOpen(true);
      }
    };
    const handleFocusOut = () => {
      setIsKeyboardOpen(false);
    };

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // تتبع التمرير لتحديد القسم النشط وتحديث القائمة العلوية باستخدام requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const updateScrollState = () => {
      const currentScrollY = window.scrollY;
      const scrollPosition = currentScrollY + 100; // إضافة إزاحة صغيرة

      // البحث عن القسم الحالي
      const sections = NAVIGATION.map(item => item.path.replace('#', ''));
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight) > scrollPosition) {
          setActiveSection(prev => prev !== section ? section : prev);
          break;
        }
      }

      // Smart Scroll Logic with Delta Threshold (50px)
      const delta = currentScrollY - lastScrollY.current;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && currentScrollY > 100) {
          setIsScrollingDown(prev => prev !== true ? true : prev);
        } else if (delta < 0) {
          setIsScrollingDown(prev => prev !== false ? false : prev);
        }
        lastScrollY.current = currentScrollY;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // تشغيل مبدئي لتحديث الحالة
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
    <nav className={`fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5 transition-transform duration-300 transform-gpu will-change-transform ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center lg:justify-between items-center h-20" dir="ltr">
          
          {/* الشعار واسم العلامة التجارية */}
          <a href="#home" className="flex-shrink-0 group">
            <div className="flex items-center gap-3" style={{ flexDirection: 'row' }} dir="ltr">
              <div className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
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
                <span className="text-white text-xs leading-none uppercase tracking-widest text-left">
                  AL MOUSAWI
                </span>
              </div>
            </div>
          </a>

          {/* قائمة التنقل لسطح المكتب (Desktop Menu) */}
          <div className="hidden lg:flex items-center space-x-8 space-x-reverse" dir="rtl">
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
    </nav>

    {/* شريط التنقل السفلي للموبايل (Bottom Navigation Bar) */}
    <div className={`lg:hidden fixed bottom-0 left-0 right-0 z-[60] flex justify-around items-center glass-pill px-2 py-3 mx-4 mb-4 rounded-full transition-all duration-300 ${isKeyboardOpen ? 'translate-y-[150%] opacity-0 pointer-events-none' : (isScrollingDown ? 'translate-y-[150%]' : 'translate-y-0 opacity-100')}`} dir="rtl">
      {NAVIGATION.filter(item => item.path !== '#brief').map((item) => {
        const sectionId = item.path.replace('#', '');
        const isActive = activeSection === sectionId;

        let IconComponent = Home;
        if (item.path === '#portfolio') IconComponent = Briefcase;
        if (item.path === '#packages') IconComponent = Layers;
        if (item.path === '#resume') IconComponent = FileText;
        if (item.path === '#process') IconComponent = Compass;

        return (
          <a
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all relative ${
              isActive
                ? 'text-brand-lime'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <IconComponent size={22} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        );
      })}
    </div>
    </>
  );
};

export default Navbar;
