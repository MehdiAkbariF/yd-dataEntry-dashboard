'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { Switch } from '@/components/ui/Switch';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import { useCreateCarType, useUpdateCarType } from '../hooks/useCars';
import { carService } from '@/services/carService';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface CarTypeFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function CarTypeForm({ initialData, isEditMode = false }: CarTypeFormProps) {
  const router = useRouter();
  const createMutation = useCreateCarType();
  const updateMutation = useUpdateCarType();

  const [name, setName] = useState(initialData?.name || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [carManufacturerId, setCarManufacturerId] = useState(
    initialData?.carManufacturerId || initialData?.carManufacturer?.id || ''
  );
  const [carManufacturerName, setCarManufacturerName] = useState(
    initialData?.carManufacturer?.name || ''
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // سئو SEO
  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoInformation?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoInformation?.description || '');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(initialData?.seoInformation?.canonicalUrl || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setEnglishTitle(initialData.englishTitle || '');
      setCarManufacturerId(initialData.carManufacturerId || initialData.carManufacturer?.id || '');
      setCarManufacturerName(initialData.carManufacturer?.name || '');
      setDescription(initialData.description || '');
      setIsActive(initialData.isActive ?? true);

      if (initialData.seoInformation) {
        setSeoId(initialData.seoInformation.id || '');
        setSeoTitle(initialData.seoInformation.title || '');
        setSeoDescription(initialData.seoInformation.description || '');
        setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
      }
    }
  }, [initialData]);

  const fetchManufacturers = async (q: string) => {
    const list = await carService.getCarManufacturers(q);
    return list.map((m: any) => ({ value: m.id, label: m.name }));
  };

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
    if (!name.trim()) errs.name = 'نام نوع خودرو نمی‌تواند خالی باشد';

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
    if (carManufacturerId) formData.append('CarManufacturerId', carManufacturerId);
    if (description) formData.append('Description', description);
    formData.append('IsActive', String(isActive));

    const hasSeoInput = seoTitle.trim() || seoDescription.trim() || seoCanonicalUrl.trim();
    if (isEditMode && seoId) formData.append('SEOInformation.Id', seoId);
    if (hasSeoInput) {
      if (seoTitle.trim()) formData.append('SEOInformation.Title', seoTitle.trim());
      if (seoDescription.trim()) formData.append('SEOInformation.Description', seoDescription.trim());
      if (seoCanonicalUrl.trim()) formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl.trim());
    }

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'نوع خودرو به‌روزرسانی شد!' : 'نوع خودرو جدید ثبت شد!');
        router.push('/cars/types');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars/types"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش نوع خودرو: ${initialData?.name}` : 'افزودن نوع خودرو جدید (CarType)'}
            </h1>
            <p className="text-xs text-neutral-400">پلتفرم کلی خودروها (مانند خانواده پراید یا پژو) را ثبت کنید</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch checked={isActive} onChange={setIsActive} label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Layers className="h-4 w-4" />
          <span>اطلاعات پایه نوع خودرو</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="نام نوع خودرو (فارسی) *"
            placeholder="مثال: پراید، پژو..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="عنوان انگلیسی (English Title)"
            placeholder="Pride"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            dir="ltr"
          />

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

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و راهنما (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (اختیاری)</h3>
          <Input label="عنوان سئو (Meta Title)" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          <Input label="توضیحات سئو (Meta Description)" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
          <Input label="آدرس کانونی (Canonical URL)" value={seoCanonicalUrl} onChange={(e) => setSeoCanonicalUrl(e.target.value)} dir="ltr" />
        </div>

        <SEOPreview title={seoTitle || name} description={seoDescription} canonicalUrl={seoCanonicalUrl || name.toLowerCase().replace(/\s+/g, '-')} />
      </div>

      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/cars/types')}
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
              <span>{isEditMode ? 'ذخیره تغییرات (Ctrl+S)' : 'ثبت نوع خودرو (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}