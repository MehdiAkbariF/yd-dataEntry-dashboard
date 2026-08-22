'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import MediaUploader from '@/components/common/MediaUploader';
import { BlogCategoryListItem } from '../types';
import { getMediaUrl } from '@/lib/config';
import { Layers, Loader2, X, Save } from 'lucide-react';
import { toast } from 'sonner';

interface BlogCategoryModalProps {
  isOpen: boolean;
  initialCategory?: BlogCategoryListItem | null;
  isLoading?: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function BlogCategoryModal({
  isOpen,
  initialCategory,
  isLoading,
  onSave,
  onClose,
}: BlogCategoryModalProps) {
  const [title, setTitle] = useState('');
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCategory && isOpen) {
      setTitle(initialCategory.title || '');
      setIconFile(null);
    } else {
      setTitle('');
      setIconFile(null);
    }
    setError('');
  }, [initialCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('عنوان دسته‌بندی الزامی است');
      return;
    }

    if (!initialCategory && !iconFile) {
      toast.error('آیکون دسته‌بندی الزامی است');
      return;
    }

    const formData = new FormData();
    if (initialCategory?.id) {
      formData.append('Id', initialCategory.id);
    }
    formData.append('Title', title.trim());
    if (iconFile) {
      formData.append('Icon', iconFile);
    }

    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>{initialCategory ? 'ویرایش دسته‌بندی بلاگ' : 'تعریف دسته‌بندی جدید بلاگ'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="عنوان دسته‌بندی *"
            placeholder="مثال: آموزش نگهداری، اخبار خودرو..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setError('');
            }}
            error={error}
            autoFocus
          />

          <MediaUploader
            label="آیکون دسته‌بندی *"
            onFileSelect={setIconFile}
            previewUrl={initialCategory?.iconUrl ? getMediaUrl(initialCategory.iconUrl) : null}
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
                  <span>ذخیره دسته‌بندی</span>
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