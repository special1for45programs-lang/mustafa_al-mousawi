import React, { useState, useEffect } from 'react';
import { Mail, Instagram, Send } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getSiteContactData } from '../lib/firestore';
import { RESUME_DATA } from '../constants';

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

// مكون التذييل (Footer)
const Footer: React.FC = () => {
  const [contactData, setContactData] = useState<any>(RESUME_DATA.contact);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const data = await getSiteContactData();
        if (data) {
          setContactData(data);
        }
      } catch (error) {
        console.error('Error fetching contact data for footer:', error);
      }
    };
    fetchContactData();
  }, []);

  return (
    <footer className="bg-brand-black border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* القسم التعريفي */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-serif text-2xl font-semibold text-white mb-4">Mustafa Al Mousawi</h3>
            <p className="text-gray-400 max-w-sm mb-6 leading-relaxed">
              نصمم شعارات وهويات بصرية تترك أثراً. نحول الأفكار المجردة إلى شعارات أيقونية وأنظمة بصرية متكاملة للشركات الطموحة.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href={contactData.instagram || 'https://instagram.com/mustafa.al_moossawi'} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-lime transition-colors"><Instagram size={20} /></a>
              <a href={contactData.telegram || 'https://t.me/mustafa_al_moussawi'} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-brand-lime transition-colors"><Send size={20} /></a>
            </div>
          </div>

          {/* روابط الموقع */}
          <div>
            <h4 className="text-white font-medium mb-4">خريطة الموقع</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#home" className="hover:text-brand-lime transition-colors">الرئيسية</a></li>
              <li><a href="#portfolio" className="hover:text-brand-lime transition-colors">الأعمال</a></li>
              <li><a href="#process" className="hover:text-brand-lime transition-colors">طريقة العمل</a></li>
              <li><a href="#brief" className="hover:text-brand-lime transition-colors">ابدأ مشروعك</a></li>
            </ul>
          </div>

          {/* معلومات التواصل */}
          <div>
            <h4 className="text-white font-medium mb-4">تواصل معنا</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-brand-lime" />
                <a href={`mailto:${contactData.email}`} className="hover:text-brand-lime transition-colors">{contactData.email}</a>
              </li>
              <li>{contactData.location}</li>
              <li className="text-xs mt-4 text-gray-600">© {new Date().getFullYear()} جميع الحقوق محفوظة.</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;