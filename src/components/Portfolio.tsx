import React, { useState, useEffect } from 'react';
import { ExternalLink, Instagram, FolderDown } from 'lucide-react';
import ResourcesModal from './ResourcesModal';

const INSTAGRAM_URL = "https://www.instagram.com/mustafa.al_moussawi/";

interface InstagramPost {
  id: string;
  mediaUrl?: string;
  permalink?: string;
  caption?: string;
}

const Portfolio: React.FC = () => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isResourcesOpen, setIsResourcesOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = import.meta.env.VITE_IG_FEED_URL;
        if (!url) throw new Error("No URL found in .env.local");
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Smart parsing: Handle both direct array OR object with .posts
        let fetchedPosts: InstagramPost[] = [];
        if (Array.isArray(data)) {
          fetchedPosts = data;
        } else if (data && Array.isArray(data.posts)) {
          fetchedPosts = data.posts;
        } else {
          throw new Error("Unrecognized data format.");
        }

        // 1. The exact unique shortcodes of the 3 pinned posts
        const pinnedShortcodes = [
          "DakQ3PogER7", 
          "DakREQ2gtOv", 
          "DakRiCgAoiE"  
        ];

        // 2. Extract pinned posts in the EXACT order defined above
        const pinnedPosts = pinnedShortcodes.map(code => 
          fetchedPosts.find(post => post.permalink && post.permalink.includes(code))
        ).filter(Boolean) as InstagramPost[];

        // 3. Extract the rest of the posts
        const otherPosts = fetchedPosts.filter(post => 
          !pinnedShortcodes.some(code => post.permalink && post.permalink.includes(code))
        );

        // 4. Combine them: Pinned first, then the rest
        const sortedPosts = [...pinnedPosts, ...otherPosts];

        // 5. Update the state
        setPosts(sortedPosts.slice(0, 9));
      } catch (err: any) {
        console.error("Feed error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div id="portfolio" className="py-24 bg-brand-black relative overflow-hidden flex flex-col items-center px-4 w-full">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen"></div>

      <div className="flex flex-col items-center justify-center w-full py-10 relative z-10">
        
        {/* The Section Title */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">أحدث الهويات البصرية والأعمال</h2>
          <div className="w-24 h-1 bg-brand-lime mx-auto rounded-full"></div>
        </div>

        {/* 1. Loading State */}
        {loading && (
          <div className="text-white my-10 text-xl animate-pulse">
            جاري تحميل الأعمال من انستغرام...
          </div>
        )}

        {/* 2. Error State (CRITICAL FOR DEBUGGING) */}
        {error && (
          <div className="bg-red-900/50 text-red-200 p-6 rounded-2xl my-10 border border-red-500 text-center max-w-2xl">
            <h3 className="font-bold text-xl mb-2">حدث خطأ في جلب البيانات:</h3>
            <p>{error}</p>
          </div>
        )}

        {/* 3. Empty State */}
        {!loading && !error && posts.length === 0 && (
          <div className="text-white my-10">لا توجد أعمال للعرض حالياً.</div>
        )}

        {/* 4. Success State (The Grid) */}
        {!loading && !error && posts.length > 0 && (
          <div className="grid grid-cols-3 gap-1 md:gap-4 lg:gap-6 w-full max-w-6xl mx-auto my-12 px-2">
            {posts.map((post) => (
              <a 
                key={post.id} 
                href={post.permalink || INSTAGRAM_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-3xl aspect-square group bg-gray-900 relative"
              >
                <img 
                  src={post.mediaUrl} 
                  alt="Instagram Post" 
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-brand-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center p-6 text-center backdrop-blur-sm">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 flex flex-col items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-brand-lime flex items-center justify-center text-black">
                      <Instagram size={28} />
                    </div>
                    <span className="text-white font-bold text-lg flex items-center gap-2">
                      عرض المشروع على انستغرام 
                      <ExternalLink size={18} className="rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* The absolute bulletproof CTA Button */}
        <a 
          href="https://www.instagram.com/mustafa.al_mousawi" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-12 mx-auto flex w-fit items-center gap-3 bg-[#c4ff00] text-black font-bold py-3 px-8 rounded-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span className="text-lg">تابع المزيد من الأعمال على انستغرام</span>
        </a>

        {/* Premium Banner for Resource Library */}
        <div 
          onClick={() => setIsResourcesOpen(true)}
          className="mt-16 mx-auto w-full max-w-3xl cursor-pointer group bg-brand-dark/50 backdrop-blur-md border border-brand-lime/20 rounded-2xl p-6 md:p-8 flex items-center justify-between transition-all duration-300 hover:border-brand-lime/60 hover:bg-brand-dark/70 hover:shadow-[0_0_30px_rgba(196,255,0,0.15)]"
        >
          <div className="flex items-center gap-5 md:gap-6">
            <div className="bg-brand-lime/10 p-4 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <FolderDown className="w-10 h-10 text-brand-lime" />
            </div>
            <div className="flex flex-col gap-1 text-right">
              <h3 className="text-white font-bold text-xl md:text-2xl">مكتبة المصادر الحصرية</h3>
              <p className="text-gray-400 text-sm md:text-base">احصل على أدوات، ملحقات، وملفات مجانية تساعدك في تطوير مشاريعك</p>
            </div>
          </div>
          <div className="hidden sm:flex bg-brand-lime/10 rounded-full p-2 group-hover:bg-brand-lime transition-colors duration-300 shrink-0 mr-4">
            <ExternalLink className="w-5 h-5 text-brand-lime group-hover:text-black rtl:rotate-180" />
          </div>
        </div>
      </div>
      
      {/* Conditional Lightweight Modal */}
      {isResourcesOpen && (
        <ResourcesModal 
          isOpen={isResourcesOpen} 
          onClose={() => setIsResourcesOpen(false)} 
        />
      )}
    </div>
  );
};

export default Portfolio;