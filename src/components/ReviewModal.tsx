import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { addClientReview } from '../lib/firestore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientName: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, clientName }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('يرجى تحديد تقييم');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addClientReview({
        clientName,
        rating,
        comment,
        isApproved: false,
        createdAt: new Date().toISOString(), // this gets overwritten by serverTimestamp in the db layer but satisfies the type if needed, or we omit it depending on the exact Omit. Wait, in Omit<ClientReview, 'id'>, createdAt is present.
      });
      toast.success('تم إرسال تقييمك بنجاح. شكراً لك!');
      setRating(0);
      setComment('');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        className="relative w-full max-w-lg glass-pill rounded-3xl p-6 sm:p-8 animate-fadeIn"
        dir="rtl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5"
          disabled={isSubmitting}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">كيف كانت تجربتك؟</h2>
          <p className="text-gray-400 text-sm">مرحباً {clientName}، رأيك يهمنا جداً لتطوير خدماتنا</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2" dir="ltr">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                disabled={isSubmitting}
                className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-10 h-10 transition-colors duration-200 ${
                    star <= (hoverRating || rating)
                      ? 'fill-brand-lime text-brand-lime drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]'
                      : 'text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              تعليقك (اختياري)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isSubmitting}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-lime/50 focus:border-brand-lime transition-all resize-none min-h-[120px]"
              placeholder="شاركنا تفاصيل تجربتك..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full flex items-center justify-center gap-2 bg-brand-lime text-black font-bold py-3.5 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'إرسال التقييم'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
