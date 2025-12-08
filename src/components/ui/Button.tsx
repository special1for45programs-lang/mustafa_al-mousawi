import React from 'react';

// تعريف خصائص الزر
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'; // أنماط الزر المختلفة
  size?: 'sm' | 'md' | 'lg'; // أحجام الزر
  fullWidth?: boolean; // هل يأخذ الزر كامل العرض؟
}

// مكون الزر القابل لإعادة الاستخدام في جميع أنحاء التطبيق
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  // التنسيقات الأساسية المشتركة
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-50 disabled:cursor-not-allowed";
  
  // تنسيقات كل نمط
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200 border border-transparent",
    secondary: "bg-brand-gray text-white hover:bg-neutral-700 border border-transparent",
    outline: "bg-transparent text-white border border-white/20 hover:border-white hover:bg-white/5",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
  };

  // تنسيقات الأحجام
  const sizes = {
    sm: "text-sm px-3 py-1.5 rounded-md",
    md: "text-sm px-6 py-3 rounded-lg",
    lg: "text-base px-8 py-4 rounded-lg",
  };

  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};