import React from 'react';

interface AdminPageWrapperProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}

const AdminPageWrapper: React.FC<AdminPageWrapperProps> = ({ title, subtitle, actionButton, children }) => {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-6 animate-fadeIn" dir="rtl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {actionButton && (
          <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
            {actionButton}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-full relative">
        {children}
      </div>
    </div>
  );
};

export default AdminPageWrapper;
