'use client';

import { useState } from 'react';
import Image from 'next/image';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

interface MediaUploaderProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
  previewUrl?: string | null;
}

export default function MediaUploader({ label, onFileSelect, previewUrl }: MediaUploaderProps) {
  const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      setLocalPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    onFileSelect(null);
    setLocalPreview(null);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && <label className="block text-xs font-medium text-neutral-300">{label}</label>}

      {localPreview ? (
        <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center group">
          <Image src={localPreview} alt="پیش‌نمایش" fill className="object-contain p-2" unoptimized />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 left-3 rounded-xl bg-red-500/80 p-1.5 text-white hover:bg-red-600 transition-all shadow-lg"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-800 bg-neutral-950 hover:border-amber-500/50 hover:bg-neutral-900/50 transition-all">
          <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
            <UploadCloud className="h-8 w-8 text-neutral-400" />
            <span className="text-xs font-medium">تصویر را کشیده و اینجا رها کنید یا کلیک کنید</span>
            <span className="text-[10px] text-neutral-600">فرمت‌های مجاز: JPG, PNG, WEBP</span>
          </div>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
}