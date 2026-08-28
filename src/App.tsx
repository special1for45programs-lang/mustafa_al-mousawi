import React, { useState, useEffect, Suspense, lazy, useCallback } from 'react';
import GlassSidebar from './components/GlassSidebar';
import FixedLogo from './components/FixedLogo';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar'; // Eager Load
import Hero from './components/Hero'; // Eager Load
import { Toaster } from 'react-hot-toast';
import { ArrowUp, Loader2 } from 'lucide-react';

// Lazy load below-the-fold components for better performance
const Footer = lazy(() => import('./components/Footer'));
const Portfolio = lazy(() => import('./components/Portfolio'));
const Packages = lazy(() => import('./components/Packages'));
const Process = lazy(() => import('./components/Process'));
const BriefForm = lazy(() => import('./components/BriefForm'));
const Resume = lazy(() => import('./components/Resume'));

// نوع الباقة المختارة الذي يُمرَّر من Packages إلى BriefForm
export interface SelectedPackage {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  type: 'logo' | 'branding' | 'social';
  category?: 'logo' | 'branding' | 'social_posts' | 'social_plans';
}

const LoadingFallback = () => (
  <div className="flex items-center justify-center w-full h-64">
    <Loader2 className="w-10 h-10 text-brand-lime animate-spin" />
  </div>
);

// المكون الرئيسي للتطبيق (Single Page Application Layout)
const App: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  // الباقة التي اختارها العميل — تُمرَّر من Packages إلى BriefForm
  const [selectedPackage, setSelectedPackage] = useState<SelectedPackage | null>(null);

  useEffect(() => {
    let ticking = false;
    const updateScrollState = () => {
      setShowScrollTop(prev => prev !== (window.scrollY > 400) ? (window.scrollY > 400) : prev);
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollState);
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // عند اختيار باقة: تحديث الحالة ثم التمرير لقسم الاستمارة
  const handlePackageSelect = useCallback((pkg: SelectedPackage) => {
    setSelectedPackage(pkg);
    setTimeout(() => {
      const briefSection = document.getElementById('brief');
      if (briefSection) {
        briefSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, []);

  return (
    <ErrorBoundary>
      <Toaster position="top-center" />
      <div className="min-h-screen bg-brand-black flex flex-col relative overflow-x-hidden max-lg:pb-24">

        {/* Sidebar - Desktop Only (Eager) */}
        <div className="hidden lg:block">
          <GlassSidebar />
        </div>

        {/* Fixed Logo - Desktop Only (Eager) */}
        <div className="hidden lg:block">
          <FixedLogo />
        </div>

        {/* Navbar - Mobile Only (Eager) */}
        <div className="lg:hidden">
          <Navbar />
        </div>

        {/* المحتوى الرئيسي */}
        <main className="flex-grow z-10 relative lg:pr-20">
          
          {/* قسم الهيرو (البداية) - محمل فوراً */}
          <section id="home">
            <Hero />
          </section>

          {/* الأقسام السفلية محملة متأخراً مع Suspense الخاص بها */}
          <Suspense fallback={<LoadingFallback />}>
            {/* قسم الأعمال */}
            <section id="portfolio">
              <Portfolio />
            </section>

            {/* قسم الباقات والأسعار */}
            <section id="packages">
              <Packages onPackageSelect={handlePackageSelect} />
            </section>

            {/* قسم السيرة الذاتية */}
            <section id="resume">
              <Resume />
            </section>

            {/* قسم طريقة العمل */}
            <section id="process">
              <Process />
            </section>

            {/* قسم الاستمارة — يظهر محتواه الكامل عند اختيار باقة */}
            <section id="brief">
              <BriefForm selectedPackage={selectedPackage} onClearPackage={() => setSelectedPackage(null)} onUpgradePackage={handlePackageSelect} />
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
          aria-label="Scroll to top"
          className={`fixed bottom-24 left-4 sm:bottom-8 sm:left-8 z-30 hidden lg:flex items-center justify-center p-3 bg-brand-lime text-black rounded-full shadow-lg transition-all duration-300 hover:bg-white hover:scale-110 active:scale-95 active:opacity-80 ${
            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
          }`}
        >
          <ArrowUp size={24} />
        </button>
      </div>
    </ErrorBoundary>
  );
};

export default App;