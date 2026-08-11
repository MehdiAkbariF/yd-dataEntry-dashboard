'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { TagListItem } from '../types';
import { Tag, Loader2, X, Save } from 'lucide-react';

interface TagModalProps {
  isOpen: boolean;
  initialTag?: TagListItem | null;
  isLoading?: boolean;
  onSave: (value: string) => void;
  onClose: () => void;
}

export default function TagModal({
  isOpen,
  initialTag,
  isLoading,
  onSave,
  onClose,
}: TagModalProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTag) {
      setValue(initialTag.value);
    } else {
      setValue('');
    }
    setError('');
  }, [initialTag, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) {
      setError('عنوان برچسب نمی‌تواند خالی باشد');
      return;
    }
    onSave(value.trim());
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Tag className="h-4 w-4" />
            <span>{initialTag ? 'ویرایش برچسب' : 'تعریف برچسب جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="عنوان برچسب *"
            placeholder="مثلاً: جلوبندی، لنت ترمز..."
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError('');
            }}
            error={error}
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
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
                  <span>ذخیره برچسب</span>
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