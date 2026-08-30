import React, { useEffect, useState, useRef, MouseEvent, TouchEvent } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ClientReview } from '../types';
import { Star, X } from 'lucide-react';
import ReviewAvatar from './ReviewAvatar';

const TestimonialsMarquee: React.FC = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedReview, setSelectedReview] = useState<ClientReview | null>(null);

  // Drag State
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Auto Scroll State
  const requestRef = useRef<number>(0);
  const isHovered = useRef(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(
          collection(db, 'reviews'),
          orderBy('createdAt', 'desc'),
          limit(15)
        );
        const querySnapshot = await getDocs(q);
        const fetched: ClientReview[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as ClientReview);
        });
        
        // Filter rating >= 4 in-memory
        const filtered = fetched.filter(r => r.isVisible === true);
        setReviews(filtered);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Seamless Auto-Scroll Logic via JS (Superior for Drag/Swipe)
  // Replaces the CSS keyframe to allow perfect native drag and touch swipe
  useEffect(() => {
    if (loading || reviews.length === 0 || !containerRef.current) return;

    const container = containerRef.current;
    let speed = 1; // pixels per frame

    const scroll = () => {
      if (!isHovered.current && !isDragging) {
        container.scrollLeft -= speed; // RTL scrolls left natively (negative or positive depending on browser, let's use +speed for standard RTL scroll direction)
        
        // If we've scrolled past half the total scrollable width, reset to 0 for a seamless loop
        // In standard RTL, scrollLeft goes from 0 to negative.
        if (Math.abs(container.scrollLeft) >= (container.scrollWidth / 2)) {
          container.scrollLeft = 0;
        }
      }
      requestRef.current = requestAnimationFrame(scroll);
    };

    // requestRef.current = requestAnimationFrame(scroll);
    // return () => cancelAnimationFrame(requestRef.current!);
  }, [loading, reviews, isDragging]);

  // Since the user explicitly requested CSS keyframe animation "Fix the CSS keyframe animation for a true, seamless RTL loop using duplicated arrays ([...reviews, ...reviews]). Ensure it translates precisely from 0 to 50%", we will use a hybrid approach that honors the CSS keyframe requirement, while wrapping it in a draggable controller.

  if (loading || reviews.length === 0) return null;

  // Duplicated array for seamless 0 to 50% translation loop
  const displayReviews = [...reviews, ...reviews];

  // Drag Handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX - scrollLeft);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const newScroll = clientX - startX;
    setScrollLeft(newScroll);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <section className="py-20 w-full overflow-hidden bg-brand-black relative">
        <div className="text-center mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            آراء <span className="text-brand-lime">شركاء النجاح</span>
          </h2>
          <p className="text-gray-400">نفخر بثقة عملائنا في خدماتنا</p>
        </div>

        {/* Full-Width Edge-to-Edge Container */}
        <div 
          className={`relative w-full overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={(e) => handleDragStart(e.pageX)}
          onMouseMove={(e) => handleDragMove(e.pageX)}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
          onTouchEnd={handleDragEnd}
          dir="rtl"
        >
          {/* Drag Wrapper */}
          <div style={{ transform: `translateX(${scrollLeft}px)`, transition: isDragging ? 'none' : 'transform 0.3s ease-out' }}>
            
            {/* The CSS Animated Track */}
            <div className={`flex w-max gap-6 animate-marquee-rtl ${(isDragging || isHovered.current) ? '[animation-play-state:paused]' : 'hover:[animation-play-state:paused]'}`}>
              {displayReviews.map((review, idx) => (
                <div 
                  key={idx} 
                  onClick={() => !isDragging && setSelectedReview(review)}
                  className="w-[320px] sm:w-[380px] shrink-0 glass-pill p-6 sm:p-8 rounded-3xl flex flex-col gap-4 transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-5 h-5 ${star <= review.rating ? 'fill-brand-lime text-brand-lime drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'text-white/10'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Clean Text without Quotes & Uniform Height via line-clamp-3 */}
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-3 min-h-[60px]">
                    {review.comment || 'خدمة ممتازة وعمل احترافي، شكراً لكم.'}
                  </p>
                  
                  <div className="mt-auto border-t border-white/10 pt-4 flex items-center gap-3">
                    <ReviewAvatar name={review.clientName} />
                    <p className="text-white font-bold text-base">
                      {review.clientName || 'عميل مميز'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Expandable Review Modal (Glassmorphism) */}
      {selectedReview && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedReview(null)}
          />
          <div 
            className="relative w-full max-w-xl glass-pill rounded-3xl p-8 sm:p-10 animate-fadeIn"
            dir="rtl"
          >
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-1.5 mb-6" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-6 h-6 ${star <= selectedReview.rating ? 'fill-brand-lime text-brand-lime drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]' : 'text-white/10'}`}
                />
              ))}
            </div>
            
            <p className="text-white text-lg leading-loose mb-8">
              {selectedReview.comment || 'خدمة ممتازة وعمل احترافي، شكراً لكم.'}
            </p>
            
            <div className="border-t border-white/10 pt-6 flex items-center gap-4">
              <ReviewAvatar name={selectedReview.clientName} className="w-12 h-12 text-xl" />
              <p className="text-brand-lime font-bold text-xl">
                {selectedReview.clientName || 'عميل مميز'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestimonialsMarquee;
