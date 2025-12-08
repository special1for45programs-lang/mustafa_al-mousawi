
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
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
        <div className="flex justify-between items-center h-20">
          
          {/* الشعار واسم العلامة التجارية */}
          <a href="#home" className="flex-shrink-0 flex items-center gap-3 group">
            <div className="w-12 h-12 flex items-center justify-center rounded-lg overflow-hidden transition-transform group-hover:scale-105">
              <img 
                src={ASSETS.logo} 
                alt="Mustafa Al Moussawi Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement;
                  if (parent) {
                    target.style.display = 'none';
                    parent.innerText = 'M';
                    parent.classList.add('bg-brand-lime', 'text-black', 'font-bold', 'text-xl');
                  }
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold leading-none text-white tracking-wider uppercase text-sm group-hover:text-brand-lime transition-colors">
                MUSTAFA
              </span>
              <span className="text-gray-500 text-xs leading-none">
                Al Moussawi
              </span>
            </div>
          </a>

          {/* قائمة التنقل لسطح المكتب (Desktop Menu) */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
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
              className="text-gray-400 hover:text-brand-lime p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* قائمة الموبايل المنبثقة */}
      {isOpen && (
        <div className="md:hidden bg-brand-dark border-b border-white/5 absolute w-full left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAVIGATION.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={() => setIsOpen(false)} // إغلاق القائمة عند النقر
                className={`block px-3 py-4 rounded-md text-base font-medium text-right hover:bg-white/5 ${
                  activeSection === item.path.replace('#', '') ? 'text-brand-lime bg-white/5' : 'text-gray-400'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
