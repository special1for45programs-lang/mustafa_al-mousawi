import React, { useState, useEffect } from 'react';
import { getPackagesData, updatePackagesData } from '../../lib/firestore';
import { PACKAGES_DATA } from '../../constants';
import { Save, Plus, Trash2 } from 'lucide-react';
import AdminPageWrapper from './AdminPageWrapper';

const StatusToggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
  <div className="flex items-center gap-2">
    <span className="text-xs text-gray-400">{active !== false ? 'متاح' : 'مغلق مؤقتاً'}</span>
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${active !== false ? 'bg-brand-lime' : 'bg-gray-600'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${active !== false ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

const PackagesEditor: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'logo' | 'branding' | 'social' | 'terms'>('logo');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pkgData = await getPackagesData();
        if (pkgData) {
          setData(pkgData);
        } else {
          // Fallback to constants
          setData(JSON.parse(JSON.stringify(PACKAGES_DATA)));
        }
      } catch (error) {
        console.error('Error fetching packages', error);
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
      await updatePackagesData(data);
      setSaveMessage('تم الحفظ بنجاح!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving packages', error);
      setSaveMessage('حدث خطأ أثناء الحفظ');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-brand-lime border-t-transparent rounded-full animate-spin"></div>
        <span className="mr-3 text-gray-400">جاري التحميل...</span>
      </div>
    );
  }

  if (!data) return null;

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
      title="إدارة الباقات والأسعار"
      subtitle="تعديل وتحديث أسعار ومميزات باقات الخدمات."
      actionButton={saveBtn}
    >
      <div className="space-y-6">

      <div className="flex border-b border-white/10 gap-4 mb-6 overflow-x-auto">
        {[
          { id: 'logo', label: 'تصميم الشعارات' },
          { id: 'branding', label: 'الهوية البصرية' },
          { id: 'social', label: 'السوشيال ميديا' },
          { id: 'terms', label: 'الشروط والأحكام' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'logo' | 'branding' | 'social' | 'terms')}
            className={`pb-4 px-4 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id ? 'border-brand-lime text-brand-lime font-bold' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'logo' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.logoDesign.map((pkg: import('../../types').LogoPackage & { active?: boolean }, index: number) => (
            <div key={pkg.id} className="bg-brand-dark border border-white/10 rounded-xl p-6 relative">
              <div className="absolute top-6 left-6">
                <StatusToggle active={pkg.active} onToggle={() => {
                  const newData = { ...data };
                  newData.logoDesign[index].active = pkg.active === false ? true : false;
                  setData(newData);
                }} />
              </div>
              <h3 className="text-lg text-white font-bold mb-4">{pkg.name} ({pkg.nameEn})</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">السعر (د.ع)</label>
                  <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={pkg.price} onChange={e => {
                    const newData = { ...data };
                    newData.logoDesign[index].price = Number(e.target.value);
                    setData(newData);
                  }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">عدد التعديلات</label>
                    <input type="text" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={pkg.revisions} onChange={e => {
                      const newData = { ...data };
                      newData.logoDesign[index].revisions = e.target.value;
                      setData(newData);
                    }} />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">مدة التسليم</label>
                    <input type="text" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={pkg.deliveryDays} onChange={e => {
                      const newData = { ...data };
                      newData.logoDesign[index].deliveryDays = e.target.value;
                      setData(newData);
                    }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">صيغ التسليم</label>
                  <div className="flex flex-wrap gap-4">
                    {['SVG', 'PNG', 'PDF', 'JPEG', 'EPS'].map(format => (
                      <label key={format} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-white">
                        <input type="checkbox" className="accent-brand-lime w-4 h-4" checked={pkg.deliveries?.includes(format)} onChange={e => {
                          const newData = { ...data };
                          if (!newData.logoDesign[index].deliveries) newData.logoDesign[index].deliveries = [];
                          if (e.target.checked) {
                            newData.logoDesign[index].deliveries.push(format);
                          } else {
                            newData.logoDesign[index].deliveries = newData.logoDesign[index].deliveries.filter((f: string) => f !== format);
                          }
                          setData(newData);
                        }} />
                        {format}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">المميزات</label>
                  <div className="space-y-2">
                    {pkg.features.map((feat: string, fIndex: number) => (
                      <div key={fIndex} className="flex gap-2">
                        <input type="text" className="flex-1 bg-brand-black border border-white/10 rounded p-2 text-white text-sm focus:border-brand-lime outline-none" value={feat} onChange={e => {
                          const newData = { ...data };
                          newData.logoDesign[index].features[fIndex] = e.target.value;
                          setData(newData);
                        }} />
                        <button onClick={() => {
                          const newData = { ...data };
                          newData.logoDesign[index].features.splice(fIndex, 1);
                          setData(newData);
                        }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors" title="حذف" aria-label="حذف"><Trash2 size={18}/></button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => {
                    const newData = { ...data };
                    newData.logoDesign[index].features.push('ميزة جديدة');
                    setData(newData);
                  }} className="text-brand-lime text-sm flex items-center gap-1 mt-3 hover:underline">
                    <Plus size={16}/> إضافة ميزة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="bg-brand-dark border border-white/10 rounded-xl p-6 relative w-full">
          <div className="absolute top-6 left-6">
            <StatusToggle active={data.branding.active} onToggle={() => {
              const newData = { ...data };
              newData.branding.active = data.branding.active === false ? true : false;
              setData(newData);
            }} />
          </div>
          <h3 className="text-lg text-white font-bold mb-6">{data.branding.name}</h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">السعر الأصلي (د.ع)</label>
                <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={data.branding.originalPrice} onChange={e => {
                  const newData = { ...data };
                  newData.branding.originalPrice = Number(e.target.value);
                  setData(newData);
                }} />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">السعر الحالي (د.ع)</label>
                <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={data.branding.currentPrice} onChange={e => {
                  const newData = { ...data };
                  newData.branding.currentPrice = Number(e.target.value);
                  setData(newData);
                }} />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">المميزات الأساسية</label>
              <div className="space-y-2">
                {data.branding.features.map((feat: string, fIndex: number) => (
                  <div key={fIndex} className="flex gap-2">
                    <input type="text" className="flex-1 bg-brand-black border border-white/10 rounded p-2 text-white text-sm focus:border-brand-lime outline-none" value={feat} onChange={e => {
                      const newData = { ...data };
                      newData.branding.features[fIndex] = e.target.value;
                      setData(newData);
                    }} />
                    <button onClick={() => {
                      const newData = { ...data };
                      newData.branding.features.splice(fIndex, 1);
                      setData(newData);
                    }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const newData = { ...data };
                newData.branding.features.push('ميزة جديدة');
                setData(newData);
              }} className="text-brand-lime text-sm flex items-center gap-1 mt-3 hover:underline">
                <Plus size={16}/> إضافة ميزة
              </button>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-2">الهدايا والإضافات المجانية (Bonuses)</label>
              <div className="space-y-2">
                {data.branding.bonuses.map((bonus: string, bIndex: number) => (
                  <div key={bIndex} className="flex gap-2">
                    <input type="text" className="flex-1 bg-brand-black border border-white/10 rounded p-2 text-white text-sm focus:border-brand-lime outline-none" value={bonus} onChange={e => {
                      const newData = { ...data };
                      newData.branding.bonuses[bIndex] = e.target.value;
                      setData(newData);
                    }} />
                    <button onClick={() => {
                      const newData = { ...data };
                      newData.branding.bonuses.splice(bIndex, 1);
                      setData(newData);
                    }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))}
              </div>
              <button onClick={() => {
                const newData = { ...data };
                if (!newData.branding.bonuses) newData.branding.bonuses = [];
                newData.branding.bonuses.push('هدية جديدة');
                setData(newData);
              }} className="text-brand-lime text-sm flex items-center gap-1 mt-3 hover:underline">
                <Plus size={16}/> إضافة هدية
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'social' && (
        <div className="space-y-8 w-full">
          <div className="bg-brand-dark border border-white/10 rounded-xl p-6 w-full">
            <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-lime"></span>
              البوستات الفردية
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-white">
                <thead className="border-b border-white/10">
                  <tr>
                    <th className="py-2 px-4 text-gray-400 font-normal text-sm w-1/3">الكمية</th>
                    <th className="py-2 px-4 text-gray-400 font-normal text-sm">السعر (د.ع)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.socialMedia.individualPosts.map((post: import('../../types').SocialPost, index: number) => (
                    <tr key={index} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold">{post.quantity} بوست</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <input type="number" className="bg-brand-black border border-white/10 rounded p-2 text-white w-32 focus:border-brand-lime outline-none" value={post.price} onChange={e => {
                            const newData = { ...data };
                            newData.socialMedia.individualPosts[index].price = Number(e.target.value);
                            setData(newData);
                          }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-lg text-white font-bold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-lime"></span>
              الباقات الشهرية
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.socialMedia.monthlyPlans.map((plan: import('../../types').SocialPlan & { active?: boolean }, index: number) => (
                <div key={plan.id} className="bg-brand-dark border border-white/10 rounded-xl p-6 relative">
                  <div className="absolute top-6 left-6">
                    <StatusToggle active={plan.active} onToggle={() => {
                      const newData = { ...data };
                      newData.socialMedia.monthlyPlans[index].active = plan.active === false ? true : false;
                      setData(newData);
                    }} />
                  </div>
                  <h4 className="text-md text-white font-bold mb-4">{plan.name} ({plan.nameEn})</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">السعر الشهري (د.ع)</label>
                      <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none" value={plan.price} onChange={e => {
                        const newData = { ...data };
                        newData.socialMedia.monthlyPlans[index].price = Number(e.target.value);
                        setData(newData);
                      }} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">بوست / شهر</label>
                        <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none text-center" value={plan.postsPerMonth} onChange={e => {
                          const newData = { ...data };
                          newData.socialMedia.monthlyPlans[index].postsPerMonth = Number(e.target.value);
                          setData(newData);
                        }} />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">ستوري / شهر</label>
                        <input type="number" className="w-full bg-brand-black border border-white/10 rounded p-2 text-white focus:border-brand-lime outline-none text-center" value={plan.storiesPerMonth} onChange={e => {
                          const newData = { ...data };
                          newData.socialMedia.monthlyPlans[index].storiesPerMonth = Number(e.target.value);
                          setData(newData);
                        }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-2">مميزات إضافية</label>
                      <div className="space-y-2">
                        {plan.extras?.map((extra: string, eIndex: number) => (
                          <div key={eIndex} className="flex gap-2">
                            <input type="text" className="flex-1 bg-brand-black border border-white/10 rounded p-2 text-white text-sm focus:border-brand-lime outline-none" value={extra} onChange={e => {
                              const newData = { ...data };
                              newData.socialMedia.monthlyPlans[index].extras[eIndex] = e.target.value;
                              setData(newData);
                            }} />
                            <button onClick={() => {
                              const newData = { ...data };
                              newData.socialMedia.monthlyPlans[index].extras.splice(eIndex, 1);
                              setData(newData);
                            }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors"><Trash2 size={18}/></button>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => {
                        const newData = { ...data };
                        if(!newData.socialMedia.monthlyPlans[index].extras) newData.socialMedia.monthlyPlans[index].extras = [];
                        newData.socialMedia.monthlyPlans[index].extras.push('ميزة جديدة');
                        setData(newData);
                      }} className="text-brand-lime text-sm flex items-center gap-1 mt-3 hover:underline">
                        <Plus size={16}/> إضافة ميزة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'terms' && (
        <div className="bg-brand-dark border border-white/10 rounded-xl p-6 w-full">
          <h3 className="text-lg text-white font-bold mb-6">الشروط والأحكام العامة</h3>
          <div className="space-y-4">
            {data.terms.map((term: string, index: number) => (
              <div key={index} className="flex gap-4 items-start bg-brand-black/50 p-4 rounded-lg border border-white/5">
                <span className="text-brand-lime font-bold mt-2 bg-brand-lime/10 w-8 h-8 flex items-center justify-center rounded shrink-0">
                  {index + 1}
                </span>
                <textarea className="flex-1 bg-brand-black border border-white/10 rounded p-3 text-white text-sm min-h-[80px] focus:border-brand-lime outline-none resize-y" value={term} onChange={e => {
                  const newData = { ...data };
                  newData.terms[index] = e.target.value;
                  setData(newData);
                }} />
                <button onClick={() => {
                  const newData = { ...data };
                  newData.terms.splice(index, 1);
                  setData(newData);
                }} className="text-red-500 hover:bg-red-500/10 p-2 rounded transition-colors mt-1" title="حذف الشرط">
                  <Trash2 size={20}/>
                </button>
              </div>
            ))}
            <button onClick={() => {
              const newData = { ...data };
              newData.terms.push('');
              setData(newData);
            }} className="text-brand-lime flex items-center gap-2 hover:bg-brand-lime/10 p-3 rounded-lg transition-colors border border-dashed border-brand-lime/30 mt-4 w-full justify-center">
              <Plus size={20}/> إضافة شرط جديد
            </button>
          </div>
        </div>
      )}
    </div>
    </AdminPageWrapper>
  );
};

export default PackagesEditor;
