'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import MediaUploader from '@/components/common/MediaUploader';
import { Factory, Loader2, X, Save } from 'lucide-react';

// دریافت BASE_URL از env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

interface CarManufacturerModalProps {
  isOpen: boolean;
  initialManufacturer?: any | null;
  isLoading?: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function CarManufacturerModal({
  isOpen,
  initialManufacturer,
  isLoading,
  onSave,
  onClose,
}: CarManufacturerModalProps) {
  const [name, setName] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [countryId, setCountryId] = useState('');
  const [iconAlt, setIconAlt] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialManufacturer) {
      setName(initialManufacturer.name || '');
      setEnglishTitle(initialManufacturer.englishTitle || '');
      setCountryId(initialManufacturer.countryId || '');
      setIconAlt(initialManufacturer.iconAlt || '');
      setIsActive(initialManufacturer.isActive ?? true);
    } else {
      setName('');
      setEnglishTitle('');
      setCountryId('');
      setIconAlt('');
      setIsActive(true);
    }
    setError('');
  }, [initialManufacturer, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('نام خودروساز نمی‌تواند خالی باشد');
      return;
    }

    const formData = new FormData();
    if (initialManufacturer?.id) {
      formData.append('Id', initialManufacturer.id);
    }
    formData.append('Name', name);
    formData.append('EnglishTitle', englishTitle);
    formData.append('IsActive', String(isActive));
    if (countryId) formData.append('CountryId', countryId);
    if (iconFile) formData.append('Icon', iconFile);
    if (iconAlt) formData.append('IconAlt', iconAlt);

    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Factory className="h-4 w-4" />
            <span>{initialManufacturer ? 'ویرایش شرکت خودروساز' : 'تعریف خودروساز جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="نام شرکت خودروساز (فارسی) *"
            placeholder="مثال: ایران خودرو، سایپا..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            error={error}
          />

          <Input
            label="عنوان انگلیسی"
            placeholder="Saipa"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            dir="ltr"
          />

          <MediaUploader
            label="لوگو / آیکون خودروساز"
            onFileSelect={setIconFile}
            previewUrl={initialManufacturer?.icon ? `${BASE_URL}${initialManufacturer.icon}` : null}
          />

          <Input
            label="متن جایگزین آیکون (IconAlt)"
            placeholder="توضیح آیکون"
            value={iconAlt}
            onChange={(e) => setIconAlt(e.target.value)}
          />

          {initialManufacturer && (
            <div className="pt-2">
              <Switch checked={isActive} onChange={setIsActive} label="وضعیت فعال" />
            </div>
          )}

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
                  <span>ذخیره خودروساز</span>
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