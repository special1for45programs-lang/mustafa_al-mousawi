import React, { useEffect, useState } from 'react';
import { RESUME_DATA } from '../constants';
import { getResumeData, getSiteContactData } from '../lib/firestore';
import { CheckCircle2, Award, BookOpen, User, MapPin, Instagram, Send, Mail, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';

// مكون السيرة الذاتية (Resume)
const Resume: React.FC = () => {
  const [resumeData, setResumeData] = useState<any>(RESUME_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getResumeData();
        const contactData = await getSiteContactData();
        
        let mergedData = { ...RESUME_DATA };
        if (data && Object.keys(data as object).length > 0) {
          mergedData = { ...mergedData, ...(data as typeof RESUME_DATA) };
        }
        if (contactData && Object.keys(contactData as object).length > 0) {
          mergedData.contact = { ...mergedData.contact, ...(contactData as typeof RESUME_DATA['contact']) };
        }
        setResumeData(mergedData);
      } catch (error) {
        console.error('Error fetching resume data:', error);
        setResumeData(RESUME_DATA);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-brand-black flex justify-center items-center">
        <Loader2 className="w-12 h-12 text-brand-lime animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-brand-black text-white relative overflow-hidden">

      {/* أشكال هندسية تفاعلية في الخلفية */}
      <div className="absolute top-20 right-10 w-32 h-32 border border-brand-lime/20 rounded-full animate-float opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-40 left-10 w-24 h-24 border border-brand-lime/10 rotate-45 animate-spin-slow opacity-20 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-brand-lime/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* رأس الصفحة (الاسم والمسمى الوظيفي) */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/10 pb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{resumeData?.name}</h1>
            <h2 className="text-xl text-brand-lime font-medium">{resumeData?.title}</h2>
          </div>
          <a href={`mailto:${resumeData?.contact?.email}`}>
            <Button variant="outline" className="gap-2">
              <Mail size={18} />
              تواصل معي
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* المحتوى الرئيسي (الجانب الأيمن في RTL) */}
          <div className="md:col-span-2 space-y-12">

            {/* نبذة عني */}
            <section className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-lime/10 rounded-lg text-brand-lime">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-bold">الملف الشخصي</h3>
              </div>
              <div className="bg-brand-dark p-8 rounded-2xl border border-white/5 leading-loose text-gray-300 text-lg shadow-lg relative overflow-hidden group hover:border-brand-lime/20 transition-colors">
                {/* تأثير ضوئي عند التحويم */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-pulse-ring opacity-0 group-hover:opacity-100 duration-1000"></div>
                {resumeData?.about}
              </div>
            </section>

            {/* الدورات التدريبية */}
            <section className="animate-fadeIn delay-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-lime/10 rounded-lg text-brand-lime">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold">الدورات التدريبية</h3>
              </div>
              <div className="bg-brand-dark rounded-2xl border border-white/5 overflow-hidden">
                {(resumeData?.courses || []).map((course: string, index: number) => (
                  <div key={index} className="p-5 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors flex items-start gap-3">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-brand-lime flex-shrink-0"></div>
                    <span className="text-gray-300">{course}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* الشريط الجانبي (الجانب الأيسر في RTL) */}
          <div className="space-y-10">

            {/* معلومات التواصل */}
            <section className="animate-fadeIn delay-150">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-lime/10 rounded-lg text-brand-lime">
                  <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold">معلومات التواصل</h3>
              </div>
              <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 space-y-5">
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="text-brand-lime flex-shrink-0" size={20} />
                  <span>{resumeData?.contact?.location}</span>
                </div>

                <a href={`mailto:${resumeData?.contact?.email}`} className="flex items-center gap-3 text-gray-300 hover:text-brand-lime transition-colors group">
                  <Mail className="text-brand-lime flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span dir="ltr" className="text-sm">{resumeData?.contact?.email}</span>
                </a>

                <a href={resumeData?.contact?.telegram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-brand-lime transition-colors group">
                  <Send className="text-brand-lime flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span dir="ltr" className="text-sm">{resumeData?.contact?.telegramHandle}</span>
                </a>

                <a href={resumeData?.contact?.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-brand-lime transition-colors group">
                  <Instagram className="text-brand-lime flex-shrink-0 group-hover:scale-110 transition-transform" size={20} />
                  <span dir="ltr" className="text-sm">{resumeData?.contact?.instagramHandle}</span>
                </a>
              </div>
            </section>

            {/* التعليم */}
            <section className="animate-fadeIn delay-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-lime/10 rounded-lg text-brand-lime">
                  <Award size={24} />
                </div>
                <h3 className="text-xl font-bold">التعليم</h3>
              </div>
              <div className="bg-brand-dark p-6 rounded-2xl border border-white/5 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-10 h-10 bg-brand-lime/5 rounded-bl-xl"></div>
                <p className="text-gray-300 leading-relaxed">
                  {resumeData?.education}
                </p>
              </div>
            </section>

            {/* المهارات */}
            <section className="animate-fadeIn delay-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-lime/10 rounded-lg text-brand-lime">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-bold">المهارات</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(resumeData?.skills || []).map((skill: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-brand-lime hover:border-brand-lime/50 transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Resume;