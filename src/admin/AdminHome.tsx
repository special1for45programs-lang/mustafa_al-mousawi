import React, { useEffect, useState } from 'react';
import { getBriefRequests, BriefRequestWithId } from '../lib/firestore';
import { Inbox, Clock, CheckCircle } from 'lucide-react';
import AdminPageWrapper from './components/AdminPageWrapper';

const categoryLabels: Record<string, string> = {
  logo: 'تصميم الشعار',
  branding: 'الهوية البصرية',
  social_posts: 'تصاميم السوشيال ميديا',
  social_plans: 'باقات إدارة الحسابات',
  other: 'أخرى'
};

const categoryColors: Record<string, string> = {
  logo: 'bg-brand-lime',
  branding: 'bg-purple-500',
  social_posts: 'bg-pink-500',
  social_plans: 'bg-blue-500',
  other: 'bg-gray-500'
};

const statusLabels: Record<string, string> = {
  new: 'جديد',
  in_progress: 'قيد التنفيذ',
  completed: 'مكتمل',
  archived: 'مؤرشف'
};

const statusColors: Record<string, string> = {
  new: 'bg-brand-lime/10 text-brand-lime',
  in_progress: 'bg-blue-500/10 text-blue-400',
  completed: 'bg-green-500/10 text-green-400',
  archived: 'bg-gray-500/10 text-gray-400'
};

const AdminHome: React.FC = () => {
  const [requests, setRequests] = useState<BriefRequestWithId[]>([]);
  const [stats, setStats] = useState({ newRequests: 0, inProgressRequests: 0, completedRequests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestsData = await getBriefRequests();
        setRequests(requestsData);
        setStats({
          newRequests: requestsData.filter((r: BriefRequestWithId) => r.status === 'new').length,
          inProgressRequests: requestsData.filter((r: BriefRequestWithId) => r.status === 'in_progress').length,
          completedRequests: requestsData.filter((r: BriefRequestWithId) => r.status === 'completed').length
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-gray-400 p-8 text-center text-xl">جاري التحميل...</div>;
  }

  // Derive stats
  const categoryCounts: Record<string, number> = {};
  const packageCounts: Record<string, number> = {};

  requests.forEach(req => {
    const cat = req.briefCategory || 'other';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    
    const pkg = req.selectedPackageName;
    if (pkg) {
      packageCounts[pkg] = (packageCounts[pkg] || 0) + 1;
    }
  });

  const totalRequests = requests.length || 1;

  // Recent 5 requests by submittedAt
  const recentRequests = [...requests]
    .sort((a, b) => {
      const timeA = typeof a.submittedAt === 'string' ? new Date(a.submittedAt).getTime() : a.submittedAt?.toMillis?.() ?? 0;
      const timeB = typeof b.submittedAt === 'string' ? new Date(b.submittedAt).getTime() : b.submittedAt?.toMillis?.() ?? 0;
      return timeB - timeA;
    })
    .slice(0, 5);

  const topPackages = Object.entries(packageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <AdminPageWrapper title="لوحة القيادة" subtitle="نظرة عامة على أداء الموقع والطلبات">
      <div className="space-y-8 animate-fade-in" dir="rtl">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 shrink-0">
          <div className="bg-brand-dark rounded-xl p-4 flex-1 border border-white/5 flex items-center gap-4">
            <div className="bg-brand-lime/10 p-3 rounded-lg text-brand-lime">
              <Inbox size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">طلبات جديدة</p>
              <p className="text-2xl font-bold text-white">{stats.newRequests}</p>
            </div>
          </div>
          <div className="bg-brand-dark rounded-xl p-4 flex-1 border border-white/5 flex items-center gap-4">
            <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">قيد التنفيذ</p>
              <p className="text-2xl font-bold text-white">{stats.inProgressRequests}</p>
            </div>
          </div>
          <div className="bg-brand-dark rounded-xl p-4 flex-1 border border-white/5 flex items-center gap-4">
            <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">مكتملة</p>
              <p className="text-2xl font-bold text-white">{stats.completedRequests}</p>
            </div>
          </div>
        </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-6 pt-4 border-t border-white/5">توزيع البيانات</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-6">توزيع الطلبات حسب الخدمة</h4>
          <div className="space-y-6">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const percentage = Math.round((count / totalRequests) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-300">{categoryLabels[cat] || cat}</span>
                    <span className="text-white font-bold">{count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${categoryColors[cat] || 'bg-gray-500'}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(categoryCounts).length === 0 && (
              <p className="text-gray-400 text-center py-4">لا توجد بيانات متاحة</p>
            )}
          </div>
        </div>

        {/* Top Packages */}
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-6">
          <h4 className="text-xl font-bold text-white mb-6">الباقات الأكثر طلباً</h4>
          <div className="space-y-4">
            {topPackages.map(([pkgName, count], idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-white font-medium">{pkgName}</span>
                <span className="bg-brand-lime/10 px-3 py-1 rounded-lg text-brand-lime font-bold text-sm">{count} طلب</span>
              </div>
            ))}
            {topPackages.length === 0 && (
              <p className="text-gray-400 text-center py-4">لا توجد باقات مطلوبة حتى الآن</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-brand-dark border border-white/5 rounded-2xl p-6">
        <h4 className="text-xl font-bold text-white mb-6">أحدث الطلبات</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {recentRequests.map(req => {
            const dateStr = typeof req.submittedAt === 'string' 
              ? new Date(req.submittedAt).toLocaleDateString('ar-IQ')
              : req.submittedAt?.toDate?.().toLocaleDateString('ar-IQ') ?? 'تاريخ غير معروف';

            return (
              <div key={req.id} className="p-4 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h5 className="text-white font-bold mb-1">{req.clientName}</h5>
                    <p className="text-sm text-gray-400">{req.selectedPackageName || categoryLabels[req.briefCategory || 'other']}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-md ${statusColors[req.status] || statusColors['new']}`}>
                    {statusLabels[req.status] || statusLabels['new']}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-4 flex justify-end">
                  <span>{dateStr}</span>
                </div>
              </div>
            );
          })}
          {recentRequests.length === 0 && (
            <p className="text-gray-400 col-span-full text-center py-4">لا توجد طلبات حديثة</p>
          )}
        </div>
      </div>
      </div>
    </AdminPageWrapper>
  );
};

export default AdminHome;
