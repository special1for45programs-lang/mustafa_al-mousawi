import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Briefcase, Package, FileText, Inbox, LogOut, ExternalLink, Menu, X, Phone, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { getPortfolioProjects, getBriefRequests } from '../lib/firestore';

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
    { to: '/admin/portfolio', icon: Briefcase, label: 'معرض الأعمال' },
    { to: '/admin/packages', icon: Package, label: 'الباقات والأسعار' },
    { to: '/admin/resume', icon: FileText, label: 'السيرة الذاتية' },
    { to: '/admin/contacts', icon: Phone, label: 'معلومات التواصل' },
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
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 right-0 z-30 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:mr-64">
        {/* Top Header (Mobile) */}
        <header className="lg:hidden bg-brand-dark border-b border-white/5 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">لوحة الإدارة</h2>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>



        <main className="flex-1">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
