'use client';

import Image from 'next/image';
import { UploadCloud, X, Images as GalleryIcon } from 'lucide-react';

export interface GalleryFileItem {
  id: string;
  file?: File | null;
  alt: string;
  preview: string;
}

interface ProductGalleryUploaderProps {
  label?: string;
  items: GalleryFileItem[];
  onChange: (items: GalleryFileItem[]) => void;
  onDeleteServerImage?: (imageId: string) => void;
}

export default function ProductGalleryUploader({
  label = 'گالری تصاویر محصول',
  items,
  onChange,
  onDeleteServerImage,
}: ProductGalleryUploaderProps) {
  const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newItems: GalleryFileItem[] = files.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      alt: '',
      preview: URL.createObjectURL(file),
    }));

    onChange([...items, ...newItems]);
  };

  const handleAltChange = (id: string, newAlt: string) => {
    onChange(
      items.map((item) => (item.id === id ? { ...item, alt: newAlt } : item))
    );
  };

  const handleRemove = (id: string) => {
    const target = items.find((item) => item.id === id);
    if (target && !target.file && onDeleteServerImage) {
      onDeleteServerImage(id);
    }
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <GalleryIcon className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <span className="text-[11px] text-neutral-400">تعداد تصاویر: {items.length}</span>
      </div>

      {/* منطقه آپلود چندتایی */}
      <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950 hover:border-amber-500/50 hover:bg-neutral-900/50 transition-all">
        <div className="flex flex-col items-center justify-center gap-1 text-neutral-500">
          <UploadCloud className="h-5 w-5 text-neutral-400" />
          <span className="text-xs font-medium">افزودن عکس به گالری (انتخاب همزمان چندین فایل)</span>
        </div>
        <input type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden" />
      </label>

      {/* نمایش تصاویر گالری (هم سرور و هم جدید) */}
      {items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-2 group"
            >
              <div className="relative h-24 w-full overflow-hidden rounded-lg bg-neutral-900">
                <Image src={item.preview} alt={item.alt || 'گالری'} fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-1.5 left-1.5 rounded-lg bg-red-500/90 p-1 text-white hover:bg-red-600 transition-all shadow-md"
                  title="حذف از گالری"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-1.5 right-1.5 rounded bg-neutral-950/80 px-1.5 py-0.5 text-[9px] text-amber-400 font-bold">
                  {item.file ? 'جدید' : 'موجود'}
                </span>
              </div>

              <input
                type="text"
                placeholder="متن جایگزین (Alt)..."
                value={item.alt}
                onChange={(e) => handleAltChange(item.id, e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2 py-1 text-[11px] text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}