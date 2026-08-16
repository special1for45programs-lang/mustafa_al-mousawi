import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { updateBriefRequestStatus, BriefRequestWithId } from '../lib/firestore';
import { ArrowRight, Image as ImageIcon, CheckCircle, Clock, Archive, Download } from 'lucide-react';
import AdminPageWrapper from './components/AdminPageWrapper';

const BriefDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [req, setReq] = useState<BriefRequestWithId | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'briefRequests', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setReq({ id: docSnap.id, ...docSnap.data() } as BriefRequestWithId);
        } else {
          setReq(null);
        }
      } catch (error) {
        console.error('Error fetching brief request:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [id]);

  const handleStatusChange = async (newStatus: 'new' | 'in_progress' | 'completed' | 'archived') => {
    if (!req) return;
    try {
      await updateBriefRequestStatus(req.id, newStatus);
      setReq({ ...req, status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return (
      <AdminPageWrapper title="تفاصيل الطلب">
        <div className="flex items-center justify-center h-40 text-brand-lime gap-3">
          <div className="w-6 h-6 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
          جاري التحميل...
        </div>
      </AdminPageWrapper>
    );
  }

  if (!req) {
    return (
      <AdminPageWrapper title="الطلب غير موجود">
        <div className="bg-brand-dark p-8 rounded-2xl border border-white/10 text-center">
          <p className="text-gray-400 mb-6">عذراً، لم نتمكن من العثور على هذا الطلب.</p>
          <button onClick={() => navigate('/admin/requests')} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition">
            العودة للقائمة
          </button>
        </div>
      </AdminPageWrapper>
    );
  }

  const isSocial = req.briefCategory === 'social_posts' || req.briefCategory === 'social_plans';
  const sd = isSocial ? req.socialDetails : req.logoDetails;
  
  // Back button component
  const backBtn = (
    <button onClick={() => navigate('/admin/requests')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg">
      <ArrowRight size={18} /> العودة
    </button>
  );

  return (
    <AdminPageWrapper 
      title={`طلب: ${req.projectName || req.companyName || 'بدون اسم'}`} 
      subtitle={req.clientName}
      actionButton={backBtn}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* العمود الأيمن: معلومات أساسية */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* بيانات العميل */}
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">معلومات العميل</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-gray-500 text-xs mb-1 uppercase">العميل</span>
                <span className="text-white font-bold">{req.clientName}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1 uppercase">الشركة</span>
                <span className="text-white font-bold">{req.companyName}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1 uppercase">رقم الهاتف</span>
                <span className="text-white font-bold" dir="ltr">{req.phone}</span>
              </div>
              <div>
                <span className="block text-gray-500 text-xs mb-1 uppercase">البريد الإلكتروني</span>
                <span className="text-white font-bold">{req.email || '-'}</span>
              </div>
            </div>
          </div>

          {/* تفاصيل المشروع */}
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 shadow-lg">
            <h3 className="text-lg font-bold text-brand-lime mb-4 border-b border-white/10 pb-3">تفاصيل المشروع</h3>
            
            {req.selectedPackageName && (
              <div className="bg-brand-lime/10 border border-brand-lime/20 p-4 rounded-xl mb-6 flex justify-between items-center">
                <div>
                  <span className="block text-brand-lime/80 text-xs mb-1">الباقة المختارة</span>
                  <span className="text-brand-lime font-bold text-lg">{req.selectedPackageName}</span>
                </div>
                {req.selectedPackagePrice && (
                  <div className="text-left">
                    <span className="block text-brand-lime/80 text-xs mb-1">السعر</span>
                    <span className="text-brand-lime font-bold text-lg">{req.selectedPackagePrice.toLocaleString('en-US')} د.ع</span>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              {req.projectDescription && (
                <div>
                  <span className="block text-gray-500 text-xs mb-1 uppercase">وصف المشروع</span>
                  <div className="bg-white/5 p-4 rounded-xl text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {req.projectDescription}
                  </div>
                </div>
              )}
              
              {!isSocial && req.logoDetails?.notes && (
                <div>
                  <span className="block text-gray-500 text-xs mb-1 uppercase">ملاحظات الشعار</span>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-100 text-sm whitespace-pre-wrap leading-relaxed">
                    {req.logoDetails.notes}
                  </div>
                </div>
              )}

              {isSocial && req.socialDetails?.additionalNotes && (
                <div>
                  <span className="block text-gray-500 text-xs mb-1 uppercase">ملاحظات السوشيال</span>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl text-yellow-100 text-sm whitespace-pre-wrap leading-relaxed">
                    {req.socialDetails.additionalNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* معرض الصور المرفوعة (تيليجرام) */}
          {(req as any).telegramFileIds && (req as any).telegramFileIds.length > 0 && (
            <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 shadow-lg">
              <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                <ImageIcon className="text-brand-lime" size={20} />
                <h3 className="text-lg font-bold text-white">الصور المرفوعة ({(req as any).telegramFileIds.length})</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {(req as any).telegramFileIds.map((fileId: string, index: number) => (
                  <a 
                    key={index}
                    href={`/api/get-telegram-image?file_id=${fileId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="block group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-black/50"
                  >
                    <img 
                      src={`/api/get-telegram-image?file_id=${fileId}`} 
                      alt={`مرفق ${index + 1}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Download className="text-white" size={24} />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* العمود الأيسر: إدارة الحالة */}
        <div className="space-y-6">
          <div className="bg-brand-dark p-6 rounded-2xl border border-white/10 shadow-lg sticky top-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-3">إدارة الطلب</h3>
            
            <div className="space-y-3">
              <button 
                onClick={() => handleStatusChange('new')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${req.status === 'new' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
              >
                <Clock size={18} /> تعيين كـ جديد
              </button>
              
              <button 
                onClick={() => handleStatusChange('in_progress')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${req.status === 'in_progress' ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
              >
                <div className="w-2 h-2 rounded-full bg-current animate-pulse" /> قيد التنفيذ
              </button>

              <button 
                onClick={() => handleStatusChange('completed')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${req.status === 'completed' ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
              >
                <CheckCircle size={18} /> مكتمل
              </button>

              <button 
                onClick={() => handleStatusChange('archived')}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${req.status === 'archived' ? 'bg-gray-500/20 border-gray-500 text-gray-300' : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'}`}
              >
                <Archive size={18} /> أرشفة
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminPageWrapper>
  );
};

export default BriefDetail;
