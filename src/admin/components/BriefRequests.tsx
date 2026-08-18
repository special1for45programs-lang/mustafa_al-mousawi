import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { getBriefRequests, updateBriefRequestStatus, deleteBriefRequest, updateBriefRequestTerms, BriefRequestWithId } from '../../lib/firestore';
import { isSocialRequest, isLogoRequest } from '../../types';
import { Eye, X, Instagram, TrendingUp, Star, Layers, Download, Trash2 } from 'lucide-react';
import AdminPageWrapper from './AdminPageWrapper';
import { PACKAGES_DATA } from '../../constants';

const getDefaultTermsForPackage = (req: BriefRequestWithId) => {
  const isSocial = isSocialRequest(req);
  const pkgNameEn = (req.selectedPackageName || '').toLowerCase();
  
  if (isSocial) {
    return PACKAGES_DATA.dynamicTerms?.social_default || [];
  } else {
    if (pkgNameEn.includes('الاقتصادية') || pkgNameEn.includes('lite')) {
      return PACKAGES_DATA.dynamicTerms?.logo_lite || [];
    } else if (pkgNameEn.includes('النمو') || pkgNameEn.includes('startup')) {
      return PACKAGES_DATA.dynamicTerms?.logo_startup || [];
    } else if (pkgNameEn.includes('المتميزة') || pkgNameEn.includes('premium')) {
       return PACKAGES_DATA.dynamicTerms?.logo_premium || [];
    } else if (pkgNameEn.includes('النخبة') || pkgNameEn.includes('elite')) {
       return PACKAGES_DATA.dynamicTerms?.logo_elite || [];
    }
    return PACKAGES_DATA.terms || [];
  }
};

// ==========================================
// ثوابت الحالات
// ==========================================
const statusColors = {
  new:         'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  in_progress: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  completed:   'bg-green-500/10 text-green-400 border-green-500/20',
  archived:    'bg-gray-500/10 text-gray-400 border-gray-500/20',
};
const statusLabels = {
  new: 'جديد', in_progress: 'قيد التنفيذ', completed: 'مكتمل', archived: 'مؤرشف',
};

// تصنيفات نوع الطلب
const categoryMeta: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  logo:          { label: 'شعار',       color: 'text-brand-lime',  Icon: Star },
  branding:      { label: 'هوية بصرية', color: 'text-purple-400',  Icon: Layers },
  social_posts:  { label: 'بوستات',     color: 'text-pink-400',    Icon: Instagram },
  social_plans:  { label: 'اشتراك شهري',color: 'text-blue-400',    Icon: TrendingUp },
};

const VISUAL_STYLE_LABELS: Record<string, string> = {
  modern: '✨ حديث ومودرن',
  formal: '🏛️ رسمي ورصين',
  luxury: '👑 فاخر ومريح',
  bold:   '⚡ جريء وعالي التباين',
};

// ==========================================
// مكوّن صف بيانات في المودال
// ==========================================
const InfoRow: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5">
      <span className="block text-gray-500 text-xs mb-1.5 font-bold uppercase tracking-wider">{label}</span>
      <span className="text-white text-sm leading-relaxed whitespace-pre-wrap">{value}</span>
    </div>
  );
};

// ==========================================
// مكوّن قسم سوشيال ميديا داخل المودال
// ==========================================
const SocialDataSection: React.FC<{ req: BriefRequestWithId }> = ({ req }) => {
  const sd = req.socialDetails;
  if (!sd || Object.keys(sd).length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        <Instagram size={16} className="text-pink-400" />
        <h4 className="text-white font-bold">تفاصيل السوشيال ميديا</h4>
      </div>

      {/* المنصات */}
      {sd.platforms?.length > 0 && (
        <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5">
          <span className="block text-gray-500 text-xs mb-2 font-bold uppercase tracking-wider">المنصات المستهدفة</span>
          <div className="flex flex-wrap gap-2">
            {sd.platforms.map(p => (
              <span key={p} className="bg-brand-lime/10 text-brand-lime text-xs font-bold px-2.5 py-1 rounded-full border border-brand-lime/20">
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      <InfoRow label="المنتجات / الخدمات" value={sd.productsServices} />
      
      {sd.postsList && sd.postsList.length > 0 && (
        <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5 space-y-4">
          <span className="block text-gray-500 text-xs font-bold uppercase tracking-wider">تفاصيل البوستات المطلوبة</span>
          {sd.postsList.map((post: any, i: number) => (
            <div key={i} className="border-r-2 border-brand-lime pr-4 py-1">
              <div className="text-white text-sm font-bold mb-1">
                النوع: {post.customCategory || post.category}
              </div>
              <div className="text-gray-300 text-sm mb-1"><span className="text-brand-lime font-bold">العنوان:</span> {post.headline}</div>
              <div className="text-gray-400 text-sm leading-relaxed"><span className="text-brand-lime font-bold">الفكرة:</span> {post.concept}</div>
            </div>
          ))}
        </div>
      )}

      {sd.visualStyle && (
        <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5">
          <span className="block text-gray-500 text-xs mb-1.5 font-bold uppercase tracking-wider">الأسلوب البصري</span>
          <span className="text-white text-sm font-bold">{VISUAL_STYLE_LABELS[sd.visualStyle] || sd.visualStyle}</span>
        </div>
      )}

      {sd.favoriteColors === 'image_inspiration' && sd.inspirationImage && (
        <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5">
          <span className="block text-gray-500 text-xs mb-3 font-bold uppercase tracking-wider">صورة الاستلهام اللوني</span>
          <img src={sd.inspirationImage} alt="Inspiration" className="w-32 h-32 object-cover rounded-lg border border-white/10" loading="lazy" />
        </div>
      )}

      {sd.additionalNotes && <InfoRow label="ملاحظات إضافية" value={sd.additionalNotes} />}
    </div>
  );
};

// ==========================================
// المكوّن الرئيسي
// ==========================================
const BriefRequests: React.FC = () => {
  const [requests, setRequests]       = useState<BriefRequestWithId[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedReq, setSelectedReq] = useState<BriefRequestWithId | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingTerms, setEditingTerms] = useState(false);
  const [customTermsDraft, setCustomTermsDraft] = useState<{icon: string, text: string}[]>([]);

  useEffect(() => {
    if (selectedReq) {
      setEditingTerms(false);
      if (selectedReq.customTerms && selectedReq.customTerms.length > 0) {
        setCustomTermsDraft(selectedReq.customTerms);
      } else {
        setCustomTermsDraft(getDefaultTermsForPackage(selectedReq));
      }
    }
  }, [selectedReq?.id]);

  const handleSaveTerms = async () => {
    if (!selectedReq) return;
    try {
      await updateBriefRequestTerms(selectedReq.id, customTermsDraft);
      const updatedReq = { ...selectedReq, customTerms: customTermsDraft };
      setSelectedReq(updatedReq);
      setRequests(requests.map(r => r.id === updatedReq.id ? updatedReq : r));
      setEditingTerms(false);
    } catch (error) {
      console.error('Error saving terms', error);
      alert('فشل حفظ الشروط.');
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await getBriefRequests();
      data.sort((a, b) => {
        const timeA = a.submittedAt?.toMillis?.() ?? 0;
        const timeB = b.submittedAt?.toMillis?.() ?? 0;
        return timeB - timeA;
      });
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleStatusChange = async (id: string, status: 'new' | 'in_progress' | 'completed' | 'archived') => {
    try {
      await updateBriefRequestStatus(id, status);
      fetchRequests();
      if (selectedReq?.id === id) setSelectedReq({ ...selectedReq, status });
    } catch (error) {
      console.error('Error updating status', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBriefRequest(id);
      setDeleteConfirmId(null);
      fetchRequests();
      if (selectedReq?.id === id) setSelectedReq(null);
    } catch (error) {
      console.error('Error deleting request', error);
      alert('فشل الحذف. حاول مرة أخرى.');
    }
  };

  // تطبيق الفلاتر
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const statusOk   = filter === 'all'   || r.status === filter;
      const catOk      = categoryFilter === 'all' || r.briefCategory === categoryFilter;
      return statusOk && catOk;
    });
  }, [requests, filter, categoryFilter]);



  const exportData = () => {
    // Placeholder export functionality
    const csvContent = "data:text/csv;charset=utf-8," 
      + filteredRequests.map(r => `${r.clientName},${r.briefCategory},${r.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "requests_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportBtn = (
    <button
      onClick={exportData}
      className="bg-brand-gray text-white border border-white/10 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-brand-lime focus:outline-none font-semibold w-full sm:w-auto"
    >
      <Download size={20} />
      تصدير البيانات
    </button>
  );

  return (
    <AdminPageWrapper
      title="الطلبات الواردة"
      subtitle={`${requests.length} طلب إجمالاً`}
      actionButton={exportBtn}
    >
      <div className="space-y-6">

        {/* الفلاتر */}
        <div className="flex gap-4 flex-wrap bg-brand-dark p-4 rounded-xl border border-white/10">
          {/* فلتر التصنيف */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
          >
            <option value="all">كل الأنواع</option>
            <option value="logo">شعار</option>
            <option value="branding">هوية بصرية</option>
            <option value="social_posts">بوستات</option>
            <option value="social_plans">اشتراك شهري</option>
          </select>
          {/* فلتر الحالة */}
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-brand-dark border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-lime"
          >
            <option value="all">جميع الحالات</option>
            <option value="new">الجديدة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">المكتملة</option>
            <option value="archived">المؤرشفة</option>
          </select>
        </div>

      {/* الجدول / حالة الفراغ */}
      {loading ? (
        <div className="flex items-center justify-center h-40 text-gray-500 gap-3">
          <div className="w-5 h-5 border-2 border-brand-lime border-t-transparent rounded-full animate-spin" />
          جاري التحميل...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-brand-dark border border-white/10 rounded-xl p-12 text-center text-gray-500">
          لا توجد طلبات لعرضها.
        </div>
      ) : (
        <div className="bg-brand-dark border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-brand-gray/30 border-b border-white/10 text-gray-400 text-sm">
                <tr>
                  <th className="p-4 font-normal">العميل</th>
                  <th className="p-4 font-normal">الباقة</th>
                  <th className="p-4 font-normal">التصنيف</th>
                  <th className="p-4 font-normal">التاريخ</th>
                  <th className="p-4 font-normal">الحالة</th>
                  <th className="p-4 font-normal">عرض</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRequests.map(req => {
                  const cat = categoryMeta[req.briefCategory || 'logo'];
                  const CatIcon = cat?.Icon || Star;
                  return (
                    <tr key={req.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="text-white font-medium">{req.clientName}</p>
                        <p className="text-xs text-gray-500">{req.companyName}</p>
                        {req.phone && <p className="text-xs text-gray-600 mt-0.5" dir="ltr">{req.phone}</p>}
                      </td>
                      <td className="p-4">
                        <p className="text-gray-300 text-sm">{req.selectedPackageName || '—'}</p>
                        {req.selectedPackagePrice && (
                          <p className="text-brand-lime text-xs font-bold">
                            {req.selectedPackagePrice.toLocaleString('en-US')} د.ع
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        {cat && (
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${cat.color}`}>
                            <CatIcon size={13} />
                            {cat.label}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-gray-400 text-sm">
                        {req.submittedAt?.toMillis
                          ? new Date(req.submittedAt.toMillis()).toLocaleDateString('ar-SA')
                          : req.date}
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs border ${statusColors[req.status]}`}>
                          {statusLabels[req.status]}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setSelectedReq(req)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-all hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-brand-lime focus:outline-none"
                            title="عرض التفاصيل"
                          >
                            <Eye size={18} />
                          </button>
                          {deleteConfirmId !== req.id && (
                            <button
                              onClick={() => setDeleteConfirmId(req.id)}
                              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none"
                              title="حذف نهائي"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                          {deleteConfirmId === req.id && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-lg">
                              <span className="text-red-400 text-xs font-bold">تأكيد الحذف؟</span>
                              <button onClick={() => handleDelete(req.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded">نعم</button>
                              <button onClick={() => setDeleteConfirmId(null)} className="bg-gray-600 hover:bg-gray-700 text-white text-xs px-2 py-1 rounded">إلغاء</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==========================================
          مودال التفاصيل
      ========================================== */}
      {selectedReq && (
        <div data-lenis-prevent="true" className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 w-full max-w-2xl my-8 relative">
            <button onClick={() => setSelectedReq(null)} className="absolute top-5 left-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <X size={22} />
            </button>

            {/* رأس المودال */}
            <div className="flex justify-between items-start mb-6 pl-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {(() => {
                    const cat = categoryMeta[selectedReq.briefCategory || 'logo'];
                    if (!cat) return null;
                    const Icon = cat.Icon;
                    return <span className={`flex items-center gap-1 text-xs font-bold ${cat.color}`}><Icon size={13} />{cat.label}</span>;
                  })()}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {isSocialRequest(selectedReq) ? selectedReq.companyName : (selectedReq.projectName || 'طلب تصميم')}
                </h3>
                <p className="text-gray-400 text-sm mt-0.5">
                  {selectedReq.clientName}
                  {selectedReq.selectedPackageName && (
                    <span className="mr-2 text-brand-lime font-bold">· {selectedReq.selectedPackageName}</span>
                  )}
                </p>
              </div>
              {/* تغيير الحالة */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">الحالة:</span>
                <select
                  value={selectedReq.status}
                  onChange={e => handleStatusChange(selectedReq.id, e.target.value as 'new' | 'in_progress' | 'completed' | 'archived')}
                  className="bg-brand-black border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-brand-lime"
                >
                  <option value="new">جديد</option>
                  <option value="in_progress">قيد التنفيذ</option>
                  <option value="completed">مكتمل</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>

            {/* ==========================================
                محتوى المودال — حسب نوع الطلب
            ========================================== */}
            <div className="space-y-5">

              {/* معلومات التواصل — مشتركة */}
              <div className="grid grid-cols-2 gap-3">
                <InfoRow label="رقم الهاتف"        value={selectedReq.phone} />
                <InfoRow label="البريد الإلكتروني" value={selectedReq.email} />
              </div>

              {/* ─── مسار السوشيال ميديا ─── */}
              {isSocialRequest(selectedReq) && (
                <SocialDataSection req={selectedReq} />
              )}

              {/* ─── مسار الشعار / الهوية ─── */}
              {!isSocialRequest(selectedReq) && (
                (() => {
                  const logo = selectedReq.logoDetails;
                  if (!logo) return null;
                  return (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <InfoRow label="مجال العمل"     value={selectedReq.projectType} />
                        <InfoRow label="الألوان المفضلة" value={logo.favoriteColors} />
                        <InfoRow label="الموعد النهائي"  value={logo.deadline} />
                        <InfoRow label="النمط التصميمي"  value={VISUAL_STYLE_LABELS[logo.designStyle] || logo.designStyle} />
                        <InfoRow label="نوع الشعار"      value={selectedReq.logoTypeName || logo.logoType} />
                      </div>

                      {/* صور الاستلهام وأنواع الشعار */}
                      <div className="flex flex-wrap gap-4 mt-4">
                        {selectedReq.logoTypeImagesBase64 && selectedReq.logoTypeImagesBase64.length > 0 && (
                          <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5 w-fit">
                            <span className="block text-gray-500 text-xs mb-3 font-bold uppercase tracking-wider">نوع الشعار المختار</span>
                            <div className="flex gap-2">
                              {selectedReq.logoTypeImagesBase64.map((img: string, i: number) => (
                                <div key={i} className="bg-white p-2 rounded-lg inline-block">
                                  <img src={img} alt={`Logo Type ${i + 1}`} className="w-24 h-24 object-contain" loading="lazy" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {logo.favoriteColors === 'image_inspiration' && logo.inspirationImage && (
                          <div className="bg-brand-black/50 p-4 rounded-lg border border-white/5 w-fit">
                            <span className="block text-gray-500 text-xs mb-3 font-bold uppercase tracking-wider">صورة الاستلهام اللوني</span>
                            <img src={logo.inspirationImage} alt="Inspiration" className="w-32 h-32 object-cover rounded-lg border border-white/10" loading="lazy" />
                          </div>
                        )}
                      </div>
                      {selectedReq.projectDescription && (
                        <div>
                          <h4 className="text-white font-bold mb-2 text-sm">وصف المشروع</h4>
                          <p className="text-gray-300 bg-brand-black p-4 rounded-lg border border-white/5 whitespace-pre-wrap text-sm leading-relaxed">
                            {selectedReq.projectDescription}
                          </p>
                        </div>
                      )}
                      {logo.notes && (
                        <div>
                          <h4 className="text-white font-bold mb-2 text-sm">ملاحظات إضافية</h4>
                          <p className="text-gray-300 bg-brand-black p-4 rounded-lg border border-white/5 whitespace-pre-wrap text-sm leading-relaxed">
                            {logo.notes}
                          </p>
                        </div>
                      )}
                      {/* صور المودبورد */}
                      {logo.moodboard?.length > 0 && (
                        <div>
                          <h4 className="text-white font-bold mb-3 text-sm">الصور المرجعية</h4>
                          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                            {logo.moodboard.map((src: string, i: number) => (
                              <img key={i} src={src} alt={`ref-${i}`}
                                className="w-full aspect-square object-cover rounded-lg border border-white/10" />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>

            {/* ==========================================
                قسم شروط وترتيبات العمل المخصصة
            ========================================== */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-bold text-lg flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-lime rounded-full"></span>
                  شروط وترتيبات العمل
                </h4>
                {!editingTerms ? (
                  <button onClick={() => setEditingTerms(true)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors font-bold">
                    تعديل الشروط المخصصة
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={handleSaveTerms} className="text-xs bg-brand-lime hover:bg-lime-400 text-black px-3 py-1.5 rounded-lg transition-colors font-bold">
                      حفظ التغييرات
                    </button>
                    <button onClick={() => {
                      setEditingTerms(false);
                      setCustomTermsDraft(selectedReq.customTerms?.length ? selectedReq.customTerms : getDefaultTermsForPackage(selectedReq));
                    }} className="text-xs bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-1.5 rounded-lg transition-colors font-bold">
                      إلغاء
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-brand-black/50 p-4 rounded-xl border border-white/5 space-y-3">
                {(!editingTerms ? (selectedReq.customTerms?.length ? selectedReq.customTerms : getDefaultTermsForPackage(selectedReq)) : customTermsDraft).map((term, index) => (
                  <div key={index} className="flex items-start gap-3 bg-brand-dark p-3 rounded-lg border border-white/5">
                    {!editingTerms ? (
                      <>
                        <span className="text-xl">{term.icon}</span>
                        <span className="text-sm text-gray-300 font-medium pt-0.5 leading-relaxed">{term.text}</span>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={term.icon}
                          onChange={(e) => {
                            const newDraft = customTermsDraft.map((item, i) => 
                              i === index ? { ...item, icon: e.target.value } : item
                            );
                            setCustomTermsDraft(newDraft);
                          }}
                          className="w-12 bg-black border border-white/10 rounded-md px-2 py-1.5 text-center text-white text-sm focus:outline-none focus:border-brand-lime"
                          placeholder="Icon"
                        />
                        <textarea
                          value={term.text}
                          onChange={(e) => {
                            const newDraft = customTermsDraft.map((item, i) => 
                              i === index ? { ...item, text: e.target.value } : item
                            );
                            setCustomTermsDraft(newDraft);
                          }}
                          className="flex-1 bg-black border border-white/10 rounded-md px-3 py-1.5 text-white text-sm focus:outline-none focus:border-brand-lime min-h-[60px]"
                          placeholder="نص الشرط..."
                        />
                        <button
                          onClick={() => {
                            const newDraft = customTermsDraft.filter((_, i) => i !== index);
                            setCustomTermsDraft(newDraft);
                          }}
                          className="text-red-500 hover:text-red-400 p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                ))}

                {editingTerms && (
                  <button
                    onClick={() => setCustomTermsDraft([...customTermsDraft, { icon: '✨', text: '' }])}
                    className="w-full mt-2 py-2 border-2 border-dashed border-white/10 hover:border-brand-lime/50 rounded-lg text-gray-400 hover:text-brand-lime transition-colors text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <span>+</span> إضافة شرط جديد
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
    </AdminPageWrapper>
  );
};

export default BriefRequests;
