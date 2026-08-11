'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreateBrand, useUpdateBrand } from '../hooks/useBrands';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Award } from 'lucide-react';

interface BrandFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function BrandForm({ initialData, isEditMode = false }: BrandFormProps) {
  const router = useRouter();
  const createMutation = useCreateBrand();
  const updateMutation = useUpdateBrand();

  const [name, setName] = useState(initialData?.name || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [countryId, setCountryId] = useState(initialData?.countryId || '');
  const [isInMain, setIsInMain] = useState(initialData?.isInMain || false);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEnglishTitle(initialData.englishTitle || '');
      setImageAlt(initialData.imageAlt || '');
      setCountryId(initialData.countryId || '');
      setIsInMain(initialData.isInMain || false);
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
    if (!name.trim()) errs.name = 'نام برند نمی‌تواند خالی باشد';
    if (!englishTitle.trim()) errs.englishTitle = 'عنوان انگلیسی برند نمی‌تواند خالی باشد';

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
    formData.append('EnglishTitle', englishTitle);
    formData.append('IsInMain', String(isInMain));
    formData.append('IsActive', String(isActive));

    if (countryId) formData.append('CountryId', countryId);
    if (imageFile) formData.append('Image', imageFile);
    if (imageAlt) formData.append('ImageAlt', imageAlt);

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'برند با موفقیت به‌روزرسانی شد!' : 'برند جدید با موفقیت ایجاد شد!');
        router.push('/brands');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-24">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/brands"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش برند: ${initialData?.name}` : 'افزودن برند جدید'}
            </h1>
            <p className="text-xs text-neutral-400">شناسنامه و لوح هویت برند را وارد کنید</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch
            checked={isActive}
            onChange={setIsActive}
            label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'}
          />
        </div>
      </div>

      {/* مشخصات اصلی */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Award className="h-4 w-4" />
          <span>اطلاعات پایه برند</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="نام برند (فارسی) *"
            placeholder="مثال: بهران"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="عنوان انگلیسی (English Title) *"
            placeholder="Behran"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            error={errors.englishTitle}
            dir="ltr"
          />

          <div className="flex items-center gap-6 pt-4">
            <Switch
              checked={isInMain}
              onChange={setIsInMain}
              label={isInMain ? 'نمایش در صفحه اصلی: بله' : 'نمایش در صفحه اصلی: خیر'}
            />
          </div>
        </div>
      </div>

      {/* لوگو برند */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <MediaUploader
          label="تصویر لوگوی برند"
          onFileSelect={setImageFile}
          previewUrl={initialData?.image ? `https://api.yadakchi.com${initialData.image}` : null}
        />
        <Input
          label="متن جایگزین لوگو (ImageAlt)"
          placeholder="توضیح لوگو برای سئو"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>

      {/* نوار چسبان پایین */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/brands')}
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
              <span>{isEditMode ? 'ذخیره تغییرات برند (Ctrl+S)' : 'ثبت برند جدید (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}