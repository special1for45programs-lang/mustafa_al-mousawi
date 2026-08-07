import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, Instagram, MessageCircle, Send, Mail, MapPin, Phone, Check, AlertCircle } from 'lucide-react';
import AdminPageWrapper from './AdminPageWrapper';

interface ContactData {
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  instagramHandle: string;
  telegram: string;
  telegramHandle: string;
  email: string;
  location: string;
}

const defaultData: ContactData = {
  whatsapp: '+9647835091952',
  whatsappDisplay: '07835091952',
  instagram: 'https://www.instagram.com/mustafa.al_mousawi',
  instagramHandle: '@mustafa.al_mousawi',
  telegram: 'https://t.me/mustafa_al_moussawi',
  telegramHandle: '@mustafa_al_moussawi',
  email: 'mustafahaidar0955@gmail.com',
  location: 'البصرة، العراق',
};

export default function ContactEditor() {
  const [data, setData] = useState<ContactData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const docRef = doc(db, 'siteConfig', 'contact');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
        setData(docSnap.data() as ContactData);
      } else {
        // Use real defaults (no empty strings)
        setData(defaultData);
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
      setData(defaultData); // fallback to defaults on error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const docRef = doc(db, 'siteConfig', 'contact');
      await setDoc(docRef, data);
      setMessage({ type: 'success', text: 'تم حفظ التغييرات بنجاح' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving contact data:', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ البيانات' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof ContactData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-lime"></div>
      </div>
    );
  }

  const saveButton = (
    <button
      type="submit"
      form="contact-form"
      disabled={saving}
      className="flex items-center justify-center gap-2 px-6 py-2.5 bg-brand-lime text-brand-black font-semibold rounded-lg hover:bg-brand-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
    >
      {saving ? (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-black"></div>
      ) : (
        <Save className="w-5 h-5" />
      )}
      <span>حفظ التغييرات</span>
    </button>
  );

  return (
    <AdminPageWrapper
      title="معلومات التواصل"
      subtitle="قم بإدارة روابط وحسابات التواصل الاجتماعي الخاصة بك."
      actionButton={saveButton}
    >
      <div className="space-y-6">

      {message && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 ${
            message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <p>{message.text}</p>
        </div>
      )}

      <form id="contact-form" onSubmit={handleSave} className="bg-brand-dark border border-white/10 rounded-xl p-6 space-y-6">
        
        {/* WhatsApp */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-lime border-b border-white/10 pb-2">
            <MessageCircle className="w-5 h-5" />
            <h3 className="font-semibold text-lg">واتساب (WhatsApp)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">رقم الهاتف (للرابط)</label>
              <input
                type="text"
                value={data.whatsapp}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                placeholder="+9647700000000"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">الرقم المعروض</label>
              <input
                type="text"
                value={data.whatsappDisplay}
                onChange={(e) => handleChange('whatsappDisplay', e.target.value)}
                placeholder="0770 000 0000"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Telegram */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-lime border-b border-white/10 pb-2">
            <Send className="w-5 h-5" />
            <h3 className="font-semibold text-lg">تيليجرام (Telegram)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">رابط الحساب</label>
              <input
                type="text"
                value={data.telegram}
                onChange={(e) => handleChange('telegram', e.target.value)}
                placeholder="https://t.me/username"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">المعرف (Handle)</label>
              <input
                type="text"
                value={data.telegramHandle}
                onChange={(e) => handleChange('telegramHandle', e.target.value)}
                placeholder="@username"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Instagram */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-lime border-b border-white/10 pb-2">
            <Instagram className="w-5 h-5" />
            <h3 className="font-semibold text-lg">انستغرام (Instagram)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">رابط الحساب</label>
              <input
                type="text"
                value={data.instagram}
                onChange={(e) => handleChange('instagram', e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">المعرف (Handle)</label>
              <input
                type="text"
                value={data.instagramHandle}
                onChange={(e) => handleChange('instagramHandle', e.target.value)}
                placeholder="@username"
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Email & Location */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-brand-lime border-b border-white/10 pb-2">
            <Mail className="w-5 h-5" />
            <h3 className="font-semibold text-lg">معلومات أخرى</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">البريد الإلكتروني</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="example@domain.com"
                  className="w-full bg-brand-black border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors text-left"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-sm text-gray-300">الموقع</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  value={data.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="بغداد، العراق"
                  className="w-full bg-brand-black border border-white/10 rounded-lg pr-10 pl-4 py-2 text-white focus:outline-none focus:border-brand-lime focus:ring-1 focus:ring-brand-lime transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
    </AdminPageWrapper>
  );
}
