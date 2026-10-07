// src/features/page-builder/components/Fields/ImagePickerField.tsx

'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export interface ImagePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  /**
   * کال‌بک برای زمانی که کاربر فایل انتخاب می‌کند.
   * این فایل در State بالادست نگه داشته می‌شود تا در لحظه Publish آپلود شود.
   */
  onFileSelected?: (file: File | null) => void;
}

/**
 * نگه‌داری موقت فایل‌های انتخاب‌شده
 * کلید: blob URL (که در Schema ذخیره میشه)
 * مقدار: File object واقعی
 */
export const pendingImageFiles = new Map<string, File>();

export function ImagePickerField({
  value,
  onChange,
  label = 'تصویر',
  onFileSelected,
}: ImagePickerFieldProps) {
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value || '');
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('فقط فایل تصویری مجاز است');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم تصویر باید کمتر از ۵ مگابایت باشد');
      return;
    }

    // ✅ ساخت blob URL موقت
    const blobUrl = URL.createObjectURL(file);

    // ✅ نگه‌داری فایل در رجیستری برای لحظه Publish
    pendingImageFiles.set(blobUrl, file);

    // ✅ آپدیت Schema با blob URL موقت
    onChange(blobUrl);

    // ✅ خبر دادن به کامپوننت والد
    if (onFileSelected) {
      onFileSelected(file);
    }

    toast.success('تصویر آماده است. پس از ذخیره، روی سرور آپلود می‌شود');

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    onChange(urlInput.trim());
    setShowUrlInput(false);
  };

  const handleRemove = () => {
    // اگه blob URL بود، از رجیستری هم پاک کن
    if (value && value.startsWith('blob:')) {
      pendingImageFiles.delete(value);
      URL.revokeObjectURL(value);
    }
    onChange('');
    if (onFileSelected) {
      onFileSelected(null);
    }
  };

  const isBlobUrl = value && value.startsWith('blob:');

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-[11px] font-medium text-neutral-300">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-full rounded-xl border border-neutral-800 overflow-hidden bg-neutral-950 group">
          <img
            src={value}
            alt="preview"
            className="w-full h-auto max-h-48 object-contain"
          />

          {/* بج "منتظر آپلود" برای فایل‌های لوکال */}
          {isBlobUrl && (
            <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-amber-500/90 text-black text-[10px] font-bold">
              در انتظار ذخیره
            </div>
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-all"
            >
              تغییر
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-all"
            >
              حذف
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex flex-col items-center justify-center gap-2 h-24 rounded-xl border-2 border-dashed border-neutral-800 hover:border-amber-500/50 bg-neutral-950 transition-all"
          >
            <Upload className="h-5 w-5 text-neutral-500" />
            <span className="text-[10px] text-neutral-400">آپلود تصویر</span>
            <span className="text-[9px] text-neutral-600">
              (در لحظه ذخیره، به سرور ارسال می‌شود)
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowUrlInput((v) => !v)}
            className="w-16 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 hover:border-amber-500/50 transition-all"
            title="درج آدرس تصویر"
          >
            <LinkIcon className="h-4 w-4 text-neutral-500" />
            <span className="text-[9px] text-neutral-400">URL</span>
          </button>
        </div>
      )}

      {showUrlInput && !value && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            dir="ltr"
            className="flex-1 h-9 rounded-lg border border-neutral-800 bg-neutral-950 px-3 text-xs text-white font-mono focus:outline-none focus:border-amber-500/50"
            onKeyDown={(e) => e.key === 'Enter' && handleApplyUrl()}
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="h-9 px-3 rounded-lg bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-all"
          >
            تایید
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}