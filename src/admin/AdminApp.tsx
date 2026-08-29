import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import PackagesEditor from './components/PackagesEditor';
import ResumeEditor from './components/ResumeEditor';
import BriefRequests from './components/BriefRequests';
import ContactEditor from './components/ContactEditor';
import ResourcesEditor from './components/ResourcesEditor';
import AdminReviews from './components/AdminReviews';
import AdminHome from './AdminHome';
import ErrorBoundary from '../components/ErrorBoundary';
import BriefDetail from './BriefDetail';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen bg-brand-black flex items-center justify-center text-brand-lime">جاري التحميل...</div>;
  
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

const AdminApp: React.FC = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <div className="min-h-screen bg-brand-black text-white dir-rtl" dir="rtl">
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<AdminHome />} />
            <Route path="packages" element={<PackagesEditor />} />
            <Route path="resume" element={<ResumeEditor />} />
            <Route path="requests" element={<BriefRequests />} />
            <Route path="briefs/:id" element={<BriefDetail />} />
            <Route path="contacts" element={<ContactEditor />} />
            <Route path="resources" element={<ResourcesEditor />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
        </Routes>
      </div>
    </AuthProvider>
    </ErrorBoundary>
  );
};

export default AdminApp;
