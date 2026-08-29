import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import App from './App';
import './index.css';
import Lenis from 'lenis';

// ── حماية: تعطيل console في بيئة الإنتاج لمنع تسريب بيانات المستخدمين ──
if (import.meta.env.PROD) {
  console.log   = () => {};
  console.debug = () => {};
  console.info  = () => {};
  // console.warn/error مُبقى عليه لمراقبة الأخطاء الحقيقية في Vercel logs
}


// تهيئة التمرير السلس باستخدام Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time: number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Lazy load Admin Panel — لا يُحمَّل إلا عند زيارة مسار /admin
const AdminApp = lazy(() => import('./admin/AdminApp'));

// البحث عن عنصر الجذر في ملف HTML لربط تطبيق الرياكت به
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* مسار لوحة التحكم — منفصل عن الموقع الرئيسي */}
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<div className="flex h-screen items-center justify-center text-white/50">جاري التحميل...</div>}>
              <AdminApp />
            </Suspense>
          }
        />
        {/* الموقع الرئيسي */}
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    <Analytics />
  </React.StrictMode>
);