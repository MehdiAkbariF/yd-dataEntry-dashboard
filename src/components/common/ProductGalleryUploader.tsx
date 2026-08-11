'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Images as GalleryIcon } from 'lucide-react';

export interface GalleryFileItem {
  id: string;
  file: File;
  alt: string;
  preview: string;
}

interface ProductGalleryUploaderProps {
  label?: string;
  items: GalleryFileItem[];
  onChange: (items: GalleryFileItem[]) => void;
}

export default function ProductGalleryUploader({
  label = 'گالری تصاویر محصول',
  items,
  onChange,
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
    onChange(items.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3 w-full">
      <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
        <GalleryIcon className="h-4 w-4" />
        <span>{label}</span>
      </div>

      {/* منطقه درگ و دراپ چندتایی */}
      <label className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950 hover:border-amber-500/50 hover:bg-neutral-900/50 transition-all">
        <div className="flex flex-col items-center justify-center gap-1.5 text-neutral-500">
          <UploadCloud className="h-6 w-6 text-neutral-400" />
          <span className="text-xs font-medium">افزودن تصاویر به گالری (امکان انتخاب همزمان چند عکس)</span>
        </div>
        <input type="file" accept="image/*" multiple onChange={handleFilesSelect} className="hidden" />
      </label>

      {/* کارت‌های گالری با ورودی Alt */}
      {items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-950 p-2.5"
            >
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-neutral-900">
                <Image src={item.preview} alt="پیش‌نمایش گالری" fill className="object-cover" unoptimized />
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-2 left-2 rounded-lg bg-red-500/80 p-1 text-white hover:bg-red-600 transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <span className="absolute bottom-2 right-2 rounded bg-neutral-950/80 px-1.5 py-0.5 text-[10px] text-amber-400 font-bold">
                  عکس {index + 1}
                </span>
              </div>

              <input
                type="text"
                placeholder="متن جایگزین عکس (Alt)..."
                value={item.alt}
                onChange={(e) => handleAltChange(item.id, e.target.value)}
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}