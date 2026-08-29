import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ClientReview } from '../types';
import { Star } from 'lucide-react';

const TestimonialsMarquee: React.FC = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        const filtered = fetched.filter(r => r.rating >= 4);
        setReviews(filtered);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) return null;

  // Duplicate the array for a seamless infinite scroll loop
  const displayReviews = [...reviews, ...reviews, ...reviews];

  return (
    <section className="py-20 overflow-hidden relative bg-black/20">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          آراء <span className="text-brand-lime">شركاء النجاح</span>
        </h2>
        <p className="text-gray-400">نفخر بثقة عملائنا في خدماتنا</p>
      </div>

      <div className="relative flex overflow-x-hidden group" dir="rtl">
        <div className="animate-marquee-rtl flex gap-6 hover:[animation-play-state:paused]">
          {displayReviews.map((review, idx) => (
            <div 
              key={idx} 
              className="w-[300px] shrink-0 glass-pill p-6 rounded-3xl flex flex-col gap-4"
            >
              <div className="flex items-center gap-1.5" dir="ltr">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star}
                    className={`w-5 h-5 ${star <= review.rating ? 'fill-brand-lime text-brand-lime drop-shadow-[0_0_8px_rgba(204,255,0,0.4)]' : 'text-white/10'}`}
                  />
                ))}
              </div>
              <p className="text-gray-200 text-sm leading-relaxed min-h-[60px]">
                "{review.comment || 'خدمة ممتازة وعمل احترافي، شكراً لكم.'}"
              </p>
              <div className="mt-auto border-t border-white/10 pt-4">
                <p className="text-white font-bold text-sm">
                  {review.clientName || 'عميل مميز'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
