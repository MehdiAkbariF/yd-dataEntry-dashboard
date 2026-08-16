'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { Switch } from '@/components/ui/Switch';
import ProEditor from '@/components/editor/ProEditor';
import { carService } from '@/services/carService';
import { Layers, Loader2, X, Save } from 'lucide-react';

interface CarTypeModalProps {
  isOpen: boolean;
  initialType?: any | null;
  isLoading?: boolean;
  onSave: (formData: FormData) => void;
  onClose: () => void;
}

export default function CarTypeModal({
  isOpen,
  initialType,
  isLoading,
  onSave,
  onClose,
}: CarTypeModalProps) {
  const [name, setName] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [carManufacturerId, setCarManufacturerId] = useState('');
  const [carManufacturerName, setCarManufacturerName] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);

  // سئو SEO
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState('');

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialType) {
      setName(initialType.name || '');
      setEnglishTitle(initialType.englishTitle || '');
      setCarManufacturerId(initialType.carManufacturerId || initialType.carManufacturer?.id || '');
      setCarManufacturerName(initialType.carManufacturer?.name || '');
      setDescription(initialType.description || '');
      setIsActive(initialType.isActive ?? true);

      if (initialType.seoInformation) {
        setSeoTitle(initialType.seoInformation.title || '');
        setSeoDescription(initialType.seoInformation.description || '');
        setSeoCanonicalUrl(initialType.seoInformation.canonicalUrl || '');
      }
    } else {
      setName('');
      setEnglishTitle('');
      setCarManufacturerId('');
      setCarManufacturerName('');
      setDescription('');
      setIsActive(true);
      setSeoTitle('');
      setSeoDescription('');
      setSeoCanonicalUrl('');
    }
    setError('');
  }, [initialType, isOpen]);

  if (!isOpen) return null;

  const fetchManufacturers = async (q: string) => {
    const list = await carService.getCarManufacturers(q);
    return list.map((m: any) => ({ value: m.id, label: m.name }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('نام نوع خودرو نمی‌تواند خالی باشد');
      return;
    }

    const formData = new FormData();
    if (initialType?.id) {
      formData.append('Id', initialType.id);
    }
    formData.append('Name', name);
    formData.append('EnglishTitle', englishTitle);
    formData.append('IsActive', String(isActive));
    if (carManufacturerId) formData.append('CarManufacturerId', carManufacturerId);
    if (description) formData.append('Description', description);

    if (seoTitle) formData.append('SEOInformation.Title', seoTitle);
    if (seoDescription) formData.append('SEOInformation.Description', seoDescription);
    if (seoCanonicalUrl) formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl);

    onSave(formData);
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl z-10 space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Layers className="h-4 w-4" />
            <span>{initialType ? 'ویرایش نوع خودرو' : 'تعریف نوع خودرو جدید'}</span>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="نام نوع خودرو (فارسی) *"
              placeholder="مثال: پراید، پژو..."
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              error={error}
            />

            <Input
              label="عنوان انگلیسی"
              placeholder="Pride"
              value={englishTitle}
              onChange={(e) => setEnglishTitle(e.target.value)}
              dir="ltr"
            />

            <div className="sm:col-span-2">
              <AsyncSelect
                label="شرکت خودروساز"
                placeholder="انتخاب خودروساز..."
                value={carManufacturerId}
                initialLabel={carManufacturerName}
                onChange={setCarManufacturerId}
                fetchOptions={fetchManufacturers}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">توضیحات</label>
            <ProEditor value={description} onChange={setDescription} />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 border-t border-neutral-800 pt-3">
            <Input label="عنوان سئو (Title)" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            <Input label="آدرس کانونی (Canonical)" value={seoCanonicalUrl} onChange={(e) => setSeoCanonicalUrl(e.target.value)} dir="ltr" />
          </div>

          {initialType && (
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
                  <span>ذخیره نوع خودرو</span>
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