import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, FolderDown } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin', icon: Home, label: 'الرئيسية', end: true },
    { to: '/admin/packages', icon: Package, label: 'الباقات والأسعار' },
    { to: '/admin/resume', icon: FileText, label: 'السيرة الذاتية' },
    { to: '/admin/contacts', icon: Phone, label: 'معلومات التواصل' },
    { to: '/admin/resources', icon: FolderDown, label: 'مكتبة المصادر' },
    { to: '/admin/requests', icon: Inbox, label: 'الطلبات الواردة' },
  ];

  const Sidebar = () => (
    <div className="h-full bg-brand-dark border-l border-white/5 w-64 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-2xl font-bold text-white font-['Dubai']">لوحة الإدارة</h2>
      </div>
      <nav className="flex-1 py-4 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-lime/10 text-brand-lime'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={20} />
          <span>زيارة الموقع</span>
        </a>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors w-full text-right"
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-brand-black dir-rtl" dir="rtl">
      {/* Sidebar */}
      <div className={`hidden lg:block fixed inset-y-0 right-0 z-30 transform transition-transform duration-300 translate-x-0`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:mr-64">
        <main className="flex-1 max-lg:pb-24">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* شريط التنقل السفلي للموبايل للإدمن */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center bg-gray-900 border-t border-gray-800 px-2 py-3 pb-safe" dir="rtl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all ${
                isActive
                  ? 'text-brand-lime'
                  : 'text-gray-400 hover:text-white'
              }`
            }
          >
            <item.icon size={22} />
            <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
        {/* زر تسجيل الخروج في الموبايل */}
        <button
          onClick={handleSignOut}
          className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-medium whitespace-nowrap">خروج</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
