import React, { useState, useEffect } from 'react';
import { getResumeData, updateResumeData } from '../../lib/firestore';
import { Save, Plus, X, Edit2, Check, Loader2 } from 'lucide-react';
import { RESUME_DATA } from '../../constants';
import AdminPageWrapper from './AdminPageWrapper';

interface ResumeData {
  name: string;
  title: string;
  about: string;
  education: string;
  skills: string[];
  courses: string[];
  contact: Record<string, string>;
  [key: string]: unknown; // allow extra Firestore fields
}

const ResumeEditor: React.FC = () => {
  const [data, setData] = useState<ResumeData>({
    name: '', title: '', about: '', education: '', skills: [], courses: [], contact: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [message, setMessage] = useState<{type: 'success'|'error', text: string} | null>(null);

  const [skillInput, setSkillInput] = useState('');
  const [courseInput, setCourseInput] = useState('');

  // Editing state for skills and courses
  const [editingSkill, setEditingSkill] = useState<{index: number, value: string} | null>(null);
  const [editingCourse, setEditingCourse] = useState<{index: number, value: string} | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeData = await getResumeData();
        if (resumeData && Object.keys(resumeData).length > 0) {
          setData(resumeData);
        } else {
          // Fallback to static constants
          setData(RESUME_DATA as ResumeData);
        }
      } catch (error) {
        console.error('Error fetching resume', error);
        setData(RESUME_DATA as ResumeData); // Fallback on error
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await updateResumeData(data);
      setMessage({ type: 'success', text: 'تم حفظ السيرة الذاتية بنجاح!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving resume', error);
      setMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddArrayItem = (field: 'skills' | 'courses', value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (value.trim()) {
      setData({ ...data, [field]: [...(data[field] || []), value.trim()] });
      setter('');
    }
  };

  const handleRemoveArrayItem = (field: 'skills' | 'courses', index: number) => {
    const newArray = [...(data[field] || [])];
    newArray.splice(index, 1);
    setData({ ...data, [field]: newArray });
  };

  const handleUpdateArrayItem = (field: 'skills' | 'courses', index: number, newValue: string) => {
    if (newValue.trim()) {
      const newArray = [...(data[field] || [])];
      newArray[index] = newValue.trim();
      setData({ ...data, [field]: newArray });
    }
  };

  const handleContactChange = (field: string, value: string) => {
    setData({
      ...data,
      contact: {
        ...(data.contact || {}),
        [field]: value
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-brand-lime">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  const saveButton = (
    <button
      onClick={handleSave}
      disabled={saving}
      className="bg-brand-lime text-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors disabled:opacity-50 font-semibold w-full sm:w-auto"
    >
      {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
      {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
    </button>
  );

  return (
    <AdminPageWrapper
      title="إدارة السيرة الذاتية"
      subtitle="تعديل وتحديث المعلومات الشخصية والمهارات في السيرة الذاتية"
      actionButton={saveButton}
    >
      <div className="space-y-6 max-w-4xl mx-auto" dir="rtl">

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
          {message.text}
        </div>
      )}

      <div className="bg-brand-dark border border-white/10 rounded-xl p-6 space-y-8">
        
        {/* القسم 1: المعلومات الشخصية */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-brand-lime border-b border-white/10 pb-2">المعلومات الشخصية</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">الاسم</label>
              <input type="text" value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">المسمى الوظيفي</label>
              <input type="text" value={data.title || ''} onChange={e => setData({...data, title: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">نبذة عني</label>
            <textarea value={data.about || ''} onChange={e => setData({...data, about: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none h-32" />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">التعليم</label>
            <input type="text" value={data.education || ''} onChange={e => setData({...data, education: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" />
          </div>
        </div>

        {/* القسم 2: المهارات */}
        <div>
          <h3 className="text-xl font-semibold text-brand-lime border-b border-white/10 pb-2 mb-4">المهارات</h3>
          <div className="space-y-3 mb-4">
            {(data.skills || []).map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-brand-black border border-white/10 rounded-lg p-3">
                {editingSkill?.index === i ? (
                  <>
                    <input 
                      type="text" 
                      value={editingSkill.value} 
                      onChange={e => setEditingSkill({ ...editingSkill, value: e.target.value })}
                      className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-3 py-1 text-white focus:border-brand-lime outline-none"
                    />
                    <button onClick={() => { handleUpdateArrayItem('skills', i, editingSkill.value); setEditingSkill(null); }} className="text-green-400 hover:text-green-300 bg-white/5 p-2 rounded-lg"><Check size={18} /></button>
                    <button onClick={() => setEditingSkill(null)} className="text-gray-400 hover:text-gray-300 bg-white/5 p-2 rounded-lg"><X size={18} /></button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-300">{item}</span>
                    <button onClick={() => setEditingSkill({ index: i, value: item })} className="text-brand-lime hover:text-[#b3e600] bg-white/5 p-2 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleRemoveArrayItem('skills', i)} className="text-red-400 hover:text-red-300 bg-white/5 p-2 rounded-lg"><X size={18} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('skills', skillInput, setSkillInput))} className="flex-1 bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" placeholder="أضف مهارة جديدة..." />
            <button onClick={() => handleAddArrayItem('skills', skillInput, setSkillInput)} className="bg-brand-gray px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-white"><Plus size={20} /></button>
          </div>
        </div>

        {/* القسم 3: الدورات التدريبية */}
        <div>
          <h3 className="text-xl font-semibold text-brand-lime border-b border-white/10 pb-2 mb-4">الدورات التدريبية</h3>
          <div className="space-y-3 mb-4">
            {(data.courses || []).map((item: string, i: number) => (
              <div key={i} className="flex items-center gap-3 bg-brand-black border border-white/10 rounded-lg p-3">
                {editingCourse?.index === i ? (
                  <>
                    <input 
                      type="text" 
                      value={editingCourse.value} 
                      onChange={e => setEditingCourse({ ...editingCourse, value: e.target.value })}
                      className="flex-1 bg-brand-dark border border-white/10 rounded-lg px-3 py-1 text-white focus:border-brand-lime outline-none"
                    />
                    <button onClick={() => { handleUpdateArrayItem('courses', i, editingCourse.value); setEditingCourse(null); }} className="text-green-400 hover:text-green-300 bg-white/5 p-2 rounded-lg"><Check size={18} /></button>
                    <button onClick={() => setEditingCourse(null)} className="text-gray-400 hover:text-gray-300 bg-white/5 p-2 rounded-lg"><X size={18} /></button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 text-gray-300">{item}</span>
                    <button onClick={() => setEditingCourse({ index: i, value: item })} className="text-brand-lime hover:text-[#b3e600] bg-white/5 p-2 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={() => handleRemoveArrayItem('courses', i)} className="text-red-400 hover:text-red-300 bg-white/5 p-2 rounded-lg"><X size={18} /></button>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={courseInput} onChange={e => setCourseInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddArrayItem('courses', courseInput, setCourseInput))} className="flex-1 bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" placeholder="أضف دورة جديدة..." />
            <button onClick={() => handleAddArrayItem('courses', courseInput, setCourseInput)} className="bg-brand-gray px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 text-white"><Plus size={20} /></button>
          </div>
        </div>

        {/* القسم 4: معلومات التواصل */}
        <div>
          <h3 className="text-xl font-semibold text-brand-lime border-b border-white/10 pb-2 mb-4">معلومات التواصل</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">الموقع (Location)</label>
              <input type="text" value={data.contact?.location || ''} onChange={e => handleContactChange('location', e.target.value)} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">انستقرام (Instagram)</label>
              <input type="text" value={data.contact?.instagram || ''} onChange={e => handleContactChange('instagram', e.target.value)} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">تيليجرام (Telegram Handle)</label>
              <input type="text" value={data.contact?.telegramHandle || ''} onChange={e => handleContactChange('telegramHandle', e.target.value)} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني (Email)</label>
              <input type="email" value={data.contact?.email || ''} onChange={e => handleContactChange('email', e.target.value)} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" dir="ltr" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">واتساب (WhatsApp Display)</label>
              <input type="text" value={data.contact?.whatsappDisplay || ''} onChange={e => handleContactChange('whatsappDisplay', e.target.value)} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" dir="ltr" />
            </div>
          </div>
        </div>

      </div>
    </div>
    </AdminPageWrapper>
  );
};

export default ResumeEditor;
