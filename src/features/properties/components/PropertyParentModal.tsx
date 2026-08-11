'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { PropertyParentListItem } from '../types';
import MediaUploader from '@/components/common/MediaUploader';
import { Layers, Loader2, X, Save } from 'lucide-react';

interface PropertyParentModalProps {
  isOpen: boolean;
  initialParent?: PropertyParentListItem | null;
  isLoading?: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function PropertyParentModal({
  isOpen,
  initialParent,
  isLoading,
  onSave,
  onClose,
}: PropertyParentModalProps) {
  const [name, setName] = useState('');
  const [priority, setPriority] = useState('0');
  const [iconAlt, setIconAlt] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialParent) {
      setName(initialParent.name);
      setPriority(String(initialParent.priority || 0));
      setIconAlt(initialParent.iconAlt || '');
    } else {
      setName('');
      setPriority('0');
      setIconAlt('');
    }
    setError('');
  }, [initialParent, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('عنوان گروه نمی‌تواند خالی باشد');
      return;
    }

    const formData = new FormData();
    if (initialParent?.id) {
      formData.append('Id', initialParent.id);
    }
    formData.append('Name', name);
    formData.append('Priority', priority);
    if (iconFile) formData.append('Icon', iconFile);
    if (iconFile) formData.append('IconFile', iconFile);
    if (iconAlt) formData.append('IconAlt', iconAlt);

    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>{initialParent ? 'ویرایش گروه ویژگی' : 'تعریف گروه جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="عنوان گروه ویژگی *"
            placeholder="مثلاً: مشخصات کلی، مشخصات فنی..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
          />

          <Input
            label="اولویت نمایش"
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            dir="ltr"
          />

          <MediaUploader
            label="آیکون گروه"
            onFileSelect={setIconFile}
            previewUrl={initialParent?.icon ? `https://api.yadakchi.com${initialParent.icon}` : null}
          />

          <Input
            label="متن جایگزین آیکون (IconAlt)"
            placeholder="توضیح آیکون"
            value={iconAlt}
            onChange={(e) => setIconAlt(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>در حال ذخیره...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>ذخیره گروه</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}