import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ClientReview } from '../../types';
import { updateReviewVisibility, deleteReview } from '../../lib/firestore';
import toast from 'react-hot-toast';
import { Loader2, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import ReviewAvatar from '../../components/ReviewAvatar';

const formatDate = (date: any) => {
  if (!date) return 'تاريخ غير معروف';
  if (typeof date === 'string') {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'تاريخ غير معروف' : d.toLocaleDateString('ar-SA');
  }
  if (typeof date.toDate === 'function') return date.toDate().toLocaleDateString('ar-SA');
  if (date instanceof Date) return date.toLocaleDateString('ar-SA');
  return 'تاريخ غير معروف';
};

const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'reviews'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetched: ClientReview[] = [];
      querySnapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as ClientReview);
      });
      setReviews(fetched);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('حدث خطأ أثناء جلب التقييمات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleVisibility = async (id: string | undefined, currentStatus: boolean) => {
    if (!id) return;
    setActionLoading(id);
    try {
      await updateReviewVisibility(id, !currentStatus);
      toast.success(currentStatus ? 'تم إخفاء التقييم' : 'تم إظهار التقييم');
      setReviews(prev => prev.map(r => r.id === id ? { ...r, isVisible: !currentStatus } : r));
    } catch (error) {
      toast.error('حدث خطأ أثناء تحديث حالة التقييم');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم نهائياً؟')) return;
    
    setActionLoading(id);
    try {
      await deleteReview(id);
      toast.success('تم حذف التقييم بنجاح');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast.error('حدث خطأ أثناء حذف التقييم');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 md:p-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">إدارة التقييمات</h1>
          <p className="text-gray-400">تحكم في إظهار وإخفاء آراء العملاء</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 text-brand-lime animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-brand-dark/50 rounded-2xl border border-white/5">
          <p className="text-gray-400">لا توجد تقييمات حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className={`bg-brand-dark border rounded-2xl p-6 transition-colors ${review.isVisible ? 'border-brand-lime/30' : 'border-white/10'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{review.clientName || 'عميل مميز'}</h3>
                  <div className="flex items-center gap-1 mt-2" dir="ltr">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-brand-lime text-brand-lime' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleVisibility(review.id, review.isVisible)}
                    disabled={actionLoading === review.id}
                    className={`p-2 rounded-lg transition-colors ${review.isVisible ? 'bg-brand-lime text-black hover:bg-lime-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
                    title={review.isVisible ? "إخفاء التقييم" : "إظهار التقييم"}
                  >
                    {actionLoading === review.id ? <Loader2 className="w-5 h-5 animate-spin" /> : review.isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={actionLoading === review.id}
                    className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                    title="حذف التقييم"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                {review.comment || 'لا يوجد تعليق نصي.'}
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                <span>
                  {formatDate(review.createdAt)}
                </span>
                <span className={review.isVisible ? 'text-brand-lime' : 'text-gray-500'}>
                  {review.isVisible ? 'مرئي' : 'مخفي'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
