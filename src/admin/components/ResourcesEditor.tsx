import React, { useState, useEffect } from 'react';
import { getResourcesData, updateResourcesData } from '../../lib/firestore';
import { Save, Plus, Trash2, FolderDown } from 'lucide-react';
import AdminPageWrapper from './AdminPageWrapper';

interface ResourceItem {
  id: string;
  title: string;
  type: string;
  url: string;
}

const ResourcesEditor: React.FC = () => {
  const [data, setData] = useState<{ resources: ResourceItem[] }>({ resources: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resData = await getResourcesData();
        if (resData && resData.resources) {
          setData(resData);
        }
      } catch (error) {
        console.error('Error fetching resources data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage('');
    try {
      await updateResourcesData(data);
      setSaveMessage('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving resources', error);
      setSaveMessage('حدث خطأ أثناء الحفظ');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAddResource = () => {
    const newResource: ResourceItem = {
      id: Date.now().toString(),
      title: '',
      type: 'zip',
      url: ''
    };
    setData({ resources: [...data.resources, newResource] });
  };

  const handleDeleteResource = (index: number) => {
    const newData = { ...data };
    newData.resources.splice(index, 1);
    setData(newData);
  };

  const updateResource = (index: number, field: keyof ResourceItem, value: string) => {
    const newData = { ...data };
    newData.resources[index] = { ...newData.resources[index], [field]: value };
    setData(newData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
        <span className="mr-3 text-gray-400">جاري التحميل...</span>
      </div>
    );
  }

  const saveBtn = (
    <div className="flex items-center gap-4">
      {saveMessage && (
        <span className={`text-sm ${saveMessage.includes('نجاح') ? 'text-brand-lime' : 'text-red-500'}`}>
          {saveMessage}
        </span>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-brand-lime text-black px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors disabled:opacity-50 font-semibold w-full sm:w-auto"
      >
        <Save size={20} />
        {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
      </button>
    </div>
  );

  return (
    <AdminPageWrapper
      title="إدارة مكتبة المصادر"
      subtitle="إضافة، تعديل أو حذف الأدوات والملفات المجانية."
      actionButton={saveBtn}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="bg-brand-lime/10 p-2 rounded-lg">
              <FolderDown className="w-6 h-6 text-brand-lime" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">المصادر المتاحة</h3>
              <p className="text-gray-400 text-sm">عدد الملفات الحالية: {data.resources.length}</p>
            </div>
          </div>
          <button 
            onClick={handleAddResource}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus size={18} />
            إضافة ملف جديد
          </button>
        </div>

        {data.resources.length === 0 ? (
          <div className="text-center py-12 bg-brand-dark border border-white/10 rounded-xl">
            <p className="text-gray-400">لا توجد مصادر مضافة حالياً. اضغط على "إضافة ملف جديد" للبدء.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.resources.map((resource, index) => (
              <div key={resource.id} className="bg-brand-dark border border-white/10 rounded-xl p-6 relative group">
                <button 
                  onClick={() => handleDeleteResource(index)}
                  className="absolute top-4 left-4 text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                  title="حذف الملف"
                >
                  <Trash2 size={20} />
                </button>
                
                <h4 className="text-white font-bold mb-5 flex items-center gap-2">
                  <span className="bg-brand-lime text-black w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  الملف {index + 1}
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">عنوان الملف / الأداة</label>
                    <input 
                      type="text" 
                      placeholder="مثال: أداة تنسيق الألوان"
                      className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" 
                      value={resource.title} 
                      onChange={e => updateResource(index, 'title', e.target.value)} 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">نوع الملف (أيقونة العرض)</label>
                    <select 
                      className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none"
                      value={resource.type}
                      onChange={e => updateResource(index, 'type', e.target.value)}
                    >
                      <option value="zip">ملف مضغوط (ZIP)</option>
                      <option value="pdf">كتاب إلكتروني (PDF)</option>
                      <option value="psd">فوتوشوب (PSD)</option>
                      <option value="ai">اليستريتور (AI)</option>
                      <option value="other">رابط عام (Other)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">رابط التحميل المباشر</label>
                    <input 
                      type="url" 
                      placeholder="مثال: https://drive.google.com/..."
                      className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none ltr text-left" 
                      dir="ltr"
                      value={resource.url} 
                      onChange={e => updateResource(index, 'url', e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminPageWrapper>
  );
};

export default ResourcesEditor;
