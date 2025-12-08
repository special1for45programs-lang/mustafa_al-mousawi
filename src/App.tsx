import React from 'react';


import GlassSidebar from './components/GlassSidebar';
import FixedLogo from './components/FixedLogo';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useState, useEffect, Suspense, lazy } from 'react';

// Lazy load components for better performance
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const Hero = lazy(() => import('./components/Hero'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Process = lazy(() => import('./components/Process'));
const BriefForm = lazy(() => import('./components/BriefForm'));
const Resume = lazy(() => import('./components/Resume'));

// المكون الرئيسي للتطبيق (Single Page Application Layout)
const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const LoadingFallback = () => (
    <div className="flex items-center justify-center w-full h-64">
      <Loader2 className="w-10 h-10 text-brand-lime animate-spin" />
    </div>
  );

  return (
    <ErrorBoundary>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-brand-black flex flex-col relative overflow-x-hidden">






        {/* Sidebar - Desktop Only */}
        <div className="hidden md:block">
          <GlassSidebar />
        </div>

        {/* Fixed Logo - Desktop Only */}
        <div className="hidden md:block">
          <FixedLogo />
        </div>

        {/* Navbar - Mobile Only */}
        <div className="md:hidden">
          <Suspense fallback={null}>
            <Navbar />
          </Suspense>
        </div>

        {/* المحتوى الرئيسي */}
        <main className="flex-grow z-10 relative">
          <Suspense fallback={<LoadingFallback />}>
            {/* قسم الهيرو (البداية) */}
            <section id="home">
              <Hero />
            </section>

            {/* قسم الأعمال */}
            <section id="portfolio">
              <Portfolio />
            </section>

            {/* قسم السيرة الذاتية */}
            <section id="resume">
              <Resume />
            </section>

            {/* قسم طريقة العمل */}
            <section id="process">
              <Process />
            </section>

            {/* قسم الاستمارة وبدء المشروع */}
            <section id="brief">
              <BriefForm />
            </section>
          </Suspense>
        </main>

        {/* التذييل */}
        <Suspense fallback={null}>
          <Footer />
        </Suspense>

        {/* زر الصعود للأعلى */}
        <button
          onClick={scrollToTop}
          className={`fixed bottom-8 left-8 z-40 p-3 bg-brand-lime text-black rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            }`}
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default App;