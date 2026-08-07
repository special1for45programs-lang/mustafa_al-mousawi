import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Briefcase } from 'lucide-react';
import { getPortfolioProjects, addProject, updateProject, deleteProject, uploadImage, uploadImageWithProgress } from '../../lib/firestore';
import type { Project } from '../../types';
import { PROJECTS } from '../../constants';
import AdminPageWrapper from './AdminPageWrapper';

const PortfolioEditor: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: '',
    thumbnail: '',
    heroImage: '',
    gallery: [],
    challenge: '',
    solution: '',
    deliverables: []
  });
  
  const [deliverableInput, setDeliverableInput] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getPortfolioProjects();
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // Fallback to static constants projects
        setProjects(PROJECTS);
      }
    } catch (error) {
      console.error('Error fetching projects', error);
      setProjects(PROJECTS); // fallback on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingId(project.id);
      setFormData(project);
    } else {
      setEditingId(null);
      setFormData({
        title: '', category: '', thumbnail: '', heroImage: '', gallery: [], challenge: '', solution: '', deliverables: []
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.error('Error deleting', error);
    }
  };

  const compressImageToWebP = (file: File, maxWidth: number = 1600, quality: number = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas context failed'));
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Blob conversion failed'));
            },
            'image/webp',
            quality
          );
        };
        img.onerror = () => reject(new Error('Image load failed'));
        if (e.target?.result) img.src = e.target.result as string;
      };
      reader.onerror = () => reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'thumbnail' | 'heroImage') => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const compressedBlob = await compressImageToWebP(file, 1600, 0.8);
      const fileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
      const url = await uploadImageWithProgress(compressedBlob, `portfolio/${Date.now()}_${fileName}`, (prog) => {
        setUploadProgress(prog);
      });
      setFormData({ ...formData, [field]: url });
    } catch (error: any) {
      console.error('Error uploading image', error);
      alert(error.message || 'فشل الاتصال بالخادم أثناء الرفع. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    setUploadProgress(0);
    try {
      const urls: string[] = [];
      const totalFiles = files.length;
      for (let i = 0; i < totalFiles; i++) {
        const compressedBlob = await compressImageToWebP(files[i], 1600, 0.8);
        const fileName = files[i].name.replace(/\.[^/.]+$/, "") + ".webp";
        const url = await uploadImageWithProgress(compressedBlob, `portfolio/gallery/${Date.now()}_${fileName}`, (prog) => {
          const overallProgress = Math.round(((i * 100) + prog) / totalFiles);
          setUploadProgress(overallProgress);
        });
        urls.push(url);
      }
      setFormData({ ...formData, gallery: [...(formData.gallery || []), ...urls] });
    } catch (error: any) {
      console.error('Error uploading gallery', error);
      alert(error.message || 'فشل الاتصال بالخادم أثناء الرفع. يرجى التأكد من اتصالك بالإنترنت والمحاولة مرة أخرى.');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setFormData({ ...formData, deliverables: [...(formData.deliverables || []), deliverableInput.trim()] });
      setDeliverableInput('');
    }
  };

  const handleRemoveDeliverable = (index: number) => {
    const newDeliverables = [...(formData.deliverables || [])];
    newDeliverables.splice(index, 1);
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateProject(editingId, formData);
      } else {
        await addProject(formData as Omit<Project, 'id'>);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error saving project', error);
    }
  };

  const actionBtn = (
    <button
      onClick={() => handleOpenModal()}
      className="bg-brand-lime text-black px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#b3e600] transition-colors font-semibold w-full sm:w-auto"
    >
      <Plus size={20} />
      إضافة مشروع
    </button>
  );

  return (
    <AdminPageWrapper
      title="إدارة معرض الأعمال"
      subtitle="أضف أو عدل مشاريعك في المعرض."
      actionButton={actionBtn}
    >
      <div className="space-y-6">

      {loading ? (
        <div className="text-gray-400">جاري التحميل...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 col-span-3">
          <Briefcase size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">لا توجد مشاريع بعد</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-brand-dark border border-white/10 rounded-xl overflow-hidden group relative">
              <div className="aspect-video relative overflow-hidden bg-brand-gray/50">
                {project.thumbnail && <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white text-lg mb-1">{project.title}</h3>
                <p className="text-sm text-gray-400 mb-4">{project.category}</p>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => handleOpenModal(project)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => setDeleteConfirmId(project.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {deleteConfirmId === project.id && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-10">
                  <p className="text-white font-bold mb-4">هل تأكيد؟</p>
                  <div className="flex gap-4">
                    <button onClick={() => { handleDelete(project.id); setDeleteConfirmId(null); }} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">نعم</button>
                    <button onClick={() => setDeleteConfirmId(null)} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">إلغاء</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div data-lenis-prevent="true" className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-brand-dark border border-white/10 rounded-2xl p-6 w-full max-w-3xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">{editingId ? 'تعديل مشروع' : 'إضافة مشروع جديد'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">عنوان المشروع</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" required />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">التصنيف</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الصورة المصغرة (Thumbnail)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-brand-gray/50 hover:bg-brand-gray px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                      <Upload size={18} /> رفع
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'thumbnail')} />
                    </label>
                    {formData.thumbnail && <img src={formData.thumbnail} alt="thumb" className="h-12 w-12 object-cover rounded" />}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الصورة الرئيسية (Hero)</label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer bg-brand-gray/50 hover:bg-brand-gray px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2">
                      <Upload size={18} /> رفع
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage')} />
                    </label>
                    {formData.heroImage && <img src={formData.heroImage} alt="hero" className="h-12 w-12 object-cover rounded" />}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">معرض الصور</label>
                <div className="flex flex-col gap-4">
                  <label className="cursor-pointer bg-brand-gray/50 hover:bg-brand-gray px-4 py-2 rounded-lg border border-white/10 flex items-center gap-2 w-fit">
                    <Upload size={18} /> رفع صور متعددة
                    <input type="file" multiple className="hidden" accept="image/*" onChange={handleGalleryUpload} />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.gallery?.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`gallery-${i}`} className="h-16 w-16 object-cover rounded" />
                        <button type="button" onClick={() => {
                          const newG = [...formData.gallery!];
                          newG.splice(i, 1);
                          setFormData({...formData, gallery: newG});
                        }} className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} className="text-white"/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">التحدي</label>
                <textarea value={formData.challenge} onChange={e => setFormData({...formData, challenge: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none h-24" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">الحل</label>
                <textarea value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none h-24" />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">المخرجات (Deliverables)</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={deliverableInput} onChange={e => setDeliverableInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddDeliverable())} className="flex-1 bg-brand-black border border-white/10 rounded-lg px-4 py-2 text-white focus:border-brand-lime outline-none" placeholder="اكتب ثم اضغط إضافة" />
                  <button type="button" onClick={handleAddDeliverable} className="bg-brand-gray px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10">إضافة</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.deliverables?.map((del, i) => (
                    <span key={i} className="bg-brand-lime/10 text-brand-lime px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      {del}
                      <button type="button" onClick={() => handleRemoveDeliverable(i)}><X size={14} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white">إلغاء</button>
                {uploading ? (
                  <div className="relative w-48 h-10 bg-brand-gray rounded-lg overflow-hidden flex items-center justify-center border border-brand-lime/20">
                    <div 
                      className="absolute right-0 top-0 bottom-0 bg-brand-lime transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                    <span className="relative z-10 text-white font-bold text-sm" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
                      جاري الرفع... {uploadProgress}%
                    </span>
                  </div>
                ) : (
                  <button type="submit" className="bg-brand-lime text-black px-6 py-2 rounded-lg font-bold hover:bg-[#b3e600]">
                    حفظ المشروع
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminPageWrapper>
  );
};

export default PortfolioEditor;
