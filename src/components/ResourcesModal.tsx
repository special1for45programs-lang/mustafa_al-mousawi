import React, { useState, useEffect } from 'react';
import { Download, FileArchive, FileImage, X, FolderDown } from 'lucide-react';
import { getResourcesData } from '../lib/firestore';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getFileIcon = (type: string) => {
  switch (type) {
    case 'zip':
      return <FileArchive className="text-brand-lime w-6 h-6" />;
    case 'psd':
    case 'pdf':
      return <FileImage className="text-brand-lime w-6 h-6" />;
    default:
      return <Download className="text-brand-lime w-6 h-6" />;
  }
};

const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose }) => {
  const [resources, setResources] = useState<{ id: string; title: string; type: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const fetchResources = async () => {
        try {
          setLoading(true);
          const data = await getResourcesData();
          if (data && data.resources) {
            setResources(data.resources);
          }
        } catch (error) {
          console.error("Failed to fetch resources:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchResources();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div 
        dir="rtl"
        className="relative w-full max-w-2xl bg-brand-dark/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all"
      >
        <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Download className="text-brand-lime" />
            مكتبة المصادر والأدوات
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-10 h-10 border-4 border-brand-lime border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">جاري تحميل الملفات...</p>
            </div>
          ) : resources.length > 0 ? (
            resources.map((resource) => (
              <div 
                key={resource.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-brand-lime/50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-lime/10 rounded-lg group-hover:scale-110 transition-transform">
                    {getFileIcon(resource.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{resource.title}</h3>
                    <span className="text-xs text-gray-400 uppercase tracking-widest bg-black/50 px-2 py-1 rounded mt-1 inline-block">
                      {resource.type}
                    </span>
                  </div>
                </div>
                
                <a 
                  href={resource.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-transparent border border-brand-lime text-brand-lime hover:bg-brand-lime hover:text-black font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">تحميل</span>
                </a>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="bg-brand-lime/10 p-6 rounded-full mb-6 border border-brand-lime/20 shadow-[0_0_30px_rgba(196,255,0,0.15)]">
                <FolderDown className="w-12 h-12 text-brand-lime" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">المكتبة قيد التجهيز</h3>
              <p className="text-gray-400 max-w-md leading-relaxed text-sm sm:text-base">
                ترقبوا قريباً أحدث الأدوات والملفات المجانية لمساعدتكم في مشاريعكم!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcesModal;
