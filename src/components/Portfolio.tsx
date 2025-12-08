import React, { useState } from 'react';
import { X, Share2, Mail, Link as LinkIcon, Check } from 'lucide-react';
import { PROJECTS } from '../constants';
import { Project } from '../types';
import { Button } from './ui/Button';

// مكون معرض الأعمال (Portfolio)
const Portfolio: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null); // حالة المشروع المختار للعرض في النافذة المنبثقة
  const [isCopied, setIsCopied] = useState(false); // حالة نسخ الرابط

  // تأثير لإدارة زر الرجوع في المتصفح/الهاتف
  React.useEffect(() => {
    const handlePopState = () => {
      setSelectedProject(null);
      document.body.style.overflow = 'unset';
    };

    if (selectedProject) {
      // إضافة حالة جديدة للتاريخ عند فتح المشروع
      window.history.pushState({ modalOpen: true }, '');
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [selectedProject]);

  // دالة فتح نافذة تفاصيل المشروع
  const openProject = (project: Project) => {
    setSelectedProject(project);
    document.body.style.overflow = 'hidden'; // منع التمرير في الصفحة الخلفية
  };

  // دالة إغلاق نافذة التفاصيل
  const closeProject = () => {
    // العودة في التاريخ سيقوم بإغلاق النافذة عبر handlePopState
    window.history.back();
  };

  // دالة مشاركة المشروع عبر المنصات المختلفة
  const handleShare = (platform: 'email' | 'copy' | 'native') => {
    if (!selectedProject) return;

    const url = window.location.href;
    const text = `شاهد هذا العمل المميز: ${selectedProject.title} من تصميم مصطفى الموسوي`;

    if (platform === 'native') {
      if (navigator.share) {
        navigator.share({
          title: selectedProject.title,
          text: text,
          url: url,
        }).catch(console.error);
      } else {
        handleShare('copy');
      }
      return;
    }

    switch (platform) {
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(selectedProject.title)}&body=${encodeURIComponent(text + '\n' + url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000); // إخفاء رسالة "تم النسخ" بعد ثانيتين
        break;
    }
  };

  return (
    <div className="py-24 bg-brand-black relative overflow-hidden">

      {/* خلفية تفاعلية بالأشكال الهندسية */}
      <div className="absolute top-0 right-0 w-64 h-64 border-2 border-brand-lime/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 border border-white/5 rotate-12 animate-float pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* عنوان القسم */}
        <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">أعمال مختارة</h2>
            <p className="text-gray-400 max-w-xl text-lg">
              مجموعة مختارة من مشاريع الهوية البصرية حيث يلتقي التفكير الاستراتيجي بالحرفية الدقيقة.
            </p>
          </div>
          <div className="hidden md:block">
            <svg width="60" height="60" viewBox="0 0 60 60" className="text-brand-lime opacity-50 animate-spin-slow">
              <path d="M30 0 L60 30 L30 60 L0 30 Z" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>
          </div>
        </div>

        {/* شبكة عرض المشاريع */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS.map((project) => (
            <div
              key={project.id}
              onClick={() => openProject(project)}
              className="group cursor-pointer block perspective-1000"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900 mb-5 border border-white/5 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(204,255,0,0.15)] group-hover:border-brand-lime/30 transform group-hover:-translate-y-2">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center gap-4">
                  <span className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-100 bg-brand-lime text-black px-8 py-3 rounded-full font-bold shadow-lg hover:bg-white hover:scale-105">
                    عرض المشروع
                  </span>
                  <p className="text-white text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200 opacity-0 group-hover:opacity-100">
                    {project.category}
                  </p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-brand-lime transition-colors pl-2 border-l-4 border-transparent group-hover:border-brand-lime">{project.title}</h3>
              <p className="text-sm text-gray-500 pl-3">{project.category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* نافذة عرض تفاصيل المشروع (Modal) */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-brand-black/95 backdrop-blur-md animate-fadeIn p-0 sm:p-4 md:p-8"
          onClick={closeProject}
        >
          <div className="min-h-full flex items-center justify-center">

            {/* أزرار التحكم (رجوع وإغلاق ومشاركة) */}
            <div className="fixed top-24 left-4 right-4 z-[60] flex items-center justify-between gap-3 pointer-events-none">
              <div className="flex items-center gap-3 pointer-events-auto">
                <button
                  onClick={() => handleShare('native')}
                  className="md:hidden p-3 bg-brand-dark/50 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-brand-lime hover:text-black hover:border-brand-lime transition-all"
                  aria-label="Share"
                >
                  <Share2 size={24} />
                </button>
                <button onClick={closeProject} className="p-3 bg-brand-lime rounded-full text-black hover:bg-white transition-colors shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                  <X size={24} />
                </button>
              </div>

              {/* زر الرجوع */}
              <button
                onClick={closeProject}
                className="pointer-events-auto p-3 px-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-brand-lime hover:text-black hover:border-brand-lime transition-all flex items-center gap-2"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="rtl:rotate-180">
                  <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="hidden sm:inline font-bold">رجوع</span>
              </button>
            </div>

            <div
              className="w-full max-w-5xl bg-[#121212] rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative"
              onClick={(e) => e.stopPropagation()}
            >

              {/* صورة الهيرو داخل النافذة */}
              <div className="w-full h-64 md:h-[450px] relative">
                <img
                  src={selectedProject.heroImage}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                  <span className="bg-brand-lime text-black px-4 py-1.5 rounded-full text-xs font-extrabold uppercase mb-4 inline-block tracking-widest shadow-lg">{selectedProject.category}</span>
                  <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{selectedProject.title}</h2>
                </div>
              </div>

              <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* تفاصيل المشروع (التحدي والحل والصور) */}
                <div className="lg:col-span-2 space-y-10">
                  <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-brand-lime/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-4 text-brand-lime flex items-center gap-2">
                      <span className="w-2 h-2 bg-brand-lime rounded-full shadow-[0_0_10px_#ccff00]"></span>
                      التحدي
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg font-light">{selectedProject.challenge}</p>
                  </div>

                  <div className="bg-white/5 p-8 rounded-2xl border border-white/5 hover:border-brand-lime/10 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-4 text-brand-lime flex items-center gap-2">
                      <span className="w-2 h-2 bg-brand-lime rounded-full shadow-[0_0_10px_#ccff00]"></span>
                      الحل
                    </h3>
                    <p className="text-gray-300 leading-relaxed text-lg font-light">{selectedProject.solution}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-8 pt-4">
                    {selectedProject.gallery.map((img, idx) => (
                      <img key={idx} src={img} alt="Project Detail" className="rounded-xl w-full h-auto object-cover border border-white/5 shadow-lg hover:shadow-2xl transition-all duration-500" />
                    ))}
                  </div>
                </div>

                {/* الشريط الجانبي (المخرجات والمشاركة) */}
                <div className="lg:col-span-1 space-y-8">
                  {/* قائمة المخرجات */}
                  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5 shadow-inner">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 border-b border-white/10 pb-3">المخرجات</h4>
                    <ul className="space-y-4">
                      {selectedProject.deliverables.map((item, i) => (
                        <li key={i} className="text-gray-300 flex items-start gap-3 text-sm">
                          <Check size={18} className="text-brand-lime mt-0.5" /> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* قسم المشاركة */}
                  <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-white/5">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                      <Share2 size={16} className="text-brand-lime" />
                      مشاركة المشروع
                    </h4>
                    <div className="flex justify-between items-center px-1">
                      <button
                        onClick={() => handleShare('email')}
                        className="p-3 bg-white/5 hover:bg-brand-lime hover:text-black rounded-xl transition-all duration-300 group hover:shadow-lg hover:shadow-brand-lime/20"
                        title="Share via Email"
                      >
                        <Mail size={20} />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-3 bg-white/5 hover:bg-brand-lime hover:text-black rounded-xl transition-all duration-300 group relative hover:shadow-lg hover:shadow-brand-lime/20"
                        title="Copy Link"
                      >
                        {isCopied ? <Check size={20} /> : <LinkIcon size={20} />}
                        {isCopied && (
                          <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs bg-brand-lime text-black px-2 py-1 rounded font-bold whitespace-nowrap shadow-lg animate-fadeIn">
                            تم النسخ
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* زر الدعوة للعمل */}
                  <div className="p-8 border border-brand-lime/30 rounded-2xl text-center bg-brand-lime/5 shadow-[0_0_30px_rgba(204,255,0,0.05)]">
                    <h4 className="text-white mb-2 font-bold text-lg">هل أعجبك ما رأيت؟</h4>
                    <p className="text-sm text-gray-400 mb-6">لنصنع شيئاً مميزاً لعلامتك التجارية.</p>
                    <a href="#brief" onClick={closeProject}>
                      <Button fullWidth className="bg-brand-lime text-black hover:bg-white border-none font-bold py-4 text-lg shadow-lg hover:shadow-brand-lime/30">ابدأ مشروعك</Button>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;