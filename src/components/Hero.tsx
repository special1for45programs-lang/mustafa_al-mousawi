import React, { useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/Button';
import { ASSETS } from '../constants';

// مكون الواجهة الرئيسية (Hero Section)
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const moveX = (clientX - window.innerWidth / 2) * 0.01;
      const moveY = (clientY - window.innerHeight / 2) * 0.01;

      heroRef.current.style.setProperty('--move-x', `${moveX}px`);
      heroRef.current.style.setProperty('--move-y', `${moveY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-brand-black">
      {/* الخلفية والمؤثرات البصرية */}
      <div className="absolute inset-0 bg-brand-black pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-neutral-800/30 via-brand-black to-brand-black opacity-60"></div>
        {/* نمط الشبكة (Grid Pattern) لإضافة لمسة تقنية */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* أشكال هندسية عائمة للمزيد من الجمالية */}
      <div
        className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-brand-lime/20 rotate-45 animate-float opacity-40 transition-transform duration-100 ease-out"
        style={{ transform: 'translate(var(--move-x), var(--move-y)) rotate(45deg)' }}
      ></div>
      <div
        className="absolute bottom-1/3 right-10 w-24 h-24 bg-gradient-to-tr from-brand-lime/10 to-transparent rounded-full animate-float delay-700 opacity-30 transition-transform duration-100 ease-out"
        style={{ transform: 'translate(calc(var(--move-x) * -1), calc(var(--move-y) * -1))' }}
      ></div>
      <div className="absolute top-20 right-1/3 w-4 h-4 bg-brand-lime rounded-full animate-pulse opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-20">

          {/* العمود الأيمن (النصوص) - في وضع RTL يظهر يميناً */}
          <div className="flex-1 text-right">
            <div className="inline-block mb-6 overflow-hidden">
              <span className="py-2 px-4 rounded-full bg-brand-lime/10 text-brand-lime border border-brand-lime/20 text-sm font-bold tracking-wider uppercase animate-fadeIn inline-block transform hover:scale-105 transition-transform cursor-default">
                مصطفى الموسوي
              </span>
            </div>

            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-relaxed lg:leading-loose mb-8 tracking-tight animate-fadeIn delay-100">
              نصمم <span className="text-brand-lime relative inline-block group">
                هويات
                {/* خط تجميلي تحت الكلمة */}
                <svg className="absolute w-full h-3 -bottom-1 right-0 text-brand-lime opacity-40 group-hover:opacity-100 transition-opacity duration-500" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" className="path-animate" />
                </svg>
              </span> <br />
              تترك أثراً دائماً.
            </h1>

            <p className="text-xl text-gray-400 max-w-2xl mb-12 leading-loose font-light animate-fadeIn delay-200">
              أنا لا أصمم شعارات فحسب. أنا أحول أفكار العمل المجردة إلى أنظمة بصرية أيقونية تجذب الانتباه وترفع قيمة علامتك التجارية في السوق.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 animate-fadeIn delay-300">
              <a href="#brief">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto bg-brand-lime text-black hover:bg-white border-none font-bold px-10 py-4 text-lg shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all duration-300">
                  ابدأ مشروعك
                  <ArrowLeft className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </Button>
              </a>
              <a href="#portfolio">
                <Button variant="outline" size="lg" className="w-full sm:w-auto hover:text-brand-lime hover:border-brand-lime px-10 py-4 text-lg backdrop-blur-sm bg-white/5 border-white/10">
                  شاهد الأعمال
                </Button>
              </a>
            </div>
          </div>

          {/* العمود الأيسر (الصورة الشخصية) */}
          <div className="flex-1 relative w-full max-w-lg md:max-w-none animate-fadeIn delay-150 perspective-1000">
            {/* إطارات زخرفية خلف الصورة */}
            <div
              className="absolute inset-0 border-2 border-brand-lime rounded-2xl transform translate-x-4 translate-y-4 opacity-50 hidden md:block transition-transform duration-500 hover:translate-x-6 hover:translate-y-6"
            ></div>
            <div className="absolute inset-0 bg-brand-gray/20 rounded-2xl transform -translate-x-4 -translate-y-4 hidden md:block"></div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group transform transition-transform duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity"></div>
              <img
                src={ASSETS.profile}
                alt="Mustafa Al Moussawi"
                loading="eager"
                fetchPriority="high"
                className="w-full h-full object-cover filter contrast-110 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                // صورة بديلة في حال عدم التحميل
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop";
                }}
              />

              {/* شارة عائمة فوق الصورة */}
              <div className="absolute bottom-6 right-6 z-20 bg-brand-lime/90 backdrop-blur text-black px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 hover:-translate-y-1">
                <p className="font-bold text-sm">Design Director</p>
                <p className="text-xs opacity-80 font-mono">Based in Basra</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* عناصر زخرفية عائمة في الخلفية */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-brand-lime/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-20 right-0 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default Hero;
