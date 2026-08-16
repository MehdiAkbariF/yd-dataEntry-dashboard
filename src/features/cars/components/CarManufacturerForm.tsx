'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreateCarManufacturer, useUpdateCarManufacturer } from '../hooks/useCars';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Factory } from 'lucide-react';

interface CarManufacturerFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function CarManufacturerForm({ initialData, isEditMode = false }: CarManufacturerFormProps) {
  const router = useRouter();
  const createMutation = useCreateCarManufacturer();
  const updateMutation = useUpdateCarManufacturer();

  const [name, setName] = useState(initialData?.name || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [countryId, setCountryId] = useState(initialData?.countryId || '');
  const [iconAlt, setIconAlt] = useState(initialData?.iconAlt || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEnglishTitle(initialData.englishTitle || '');
      setCountryId(initialData.countryId || '');
      setIconAlt(initialData.iconAlt || '');
      setIsActive(initialData.isActive ?? true);
    }
  }, [initialData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        document.getElementById('submit-btn')?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'نام خودروساز نمی‌تواند خالی باشد';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً فیلدهای اجباری را وارد کنید.');
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id) {
      formData.append('Id', initialData.id);
    }

    formData.append('Name', name);
    if (englishTitle) formData.append('EnglishTitle', englishTitle);
    formData.append('IsActive', String(isActive));
    if (countryId) formData.append('CountryId', countryId);

    if (iconFile) formData.append('Icon', iconFile);
    if (iconAlt) formData.append('IconAlt', iconAlt);

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'خودروساز به‌روزرسانی شد!' : 'خودروساز جدید ثبت شد!');
        router.push('/cars/manufacturers');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars/manufacturers"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش خودروساز: ${initialData?.name}` : 'افزودن شرکت خودروساز جدید'}
            </h1>
            <p className="text-xs text-neutral-400">شناسنامه و برند خودروسازی را ثبت کنید</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch checked={isActive} onChange={setIsActive} label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Factory className="h-4 w-4" />
          <span>اطلاعات پایه خودروساز</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="نام شرکت خودروساز (فارسی) *"
            placeholder="مثال: ایران خودرو، سایپا..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="عنوان انگلیسی (English Title)"
            placeholder="Saipa"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <MediaUploader
          label="آیکون یا لوگوی شرکت خودروساز"
          onFileSelect={setIconFile}
          previewUrl={initialData?.icon ? `https://api.yadakchi.com${initialData.icon}` : null}
        />
        <Input
          label="متن جایگزین آیکون (IconAlt)"
          placeholder="توضیح آیکون برای سئو"
          value={iconAlt}
          onChange={(e) => setIconAlt(e.target.value)}
        />
      </div>

      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/cars/manufacturers')}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-5 py-2.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800 transition-all"
        >
          انصراف
        </button>

        <button
          id="submit-btn"
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-50 transition-all shadow-lg shadow-amber-500/20"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>در حال ذخیره...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>{isEditMode ? 'ذخیره تغییرات (Ctrl+S)' : 'ثبت خودروساز (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}