import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // استيراد ملف التنسيقات المخصص

// البحث عن عنصر الجذر في ملف HTML لربط تطبيق الرياكت به
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// إنشاء جذر الرياكت وتصيير التطبيق بداخله
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);