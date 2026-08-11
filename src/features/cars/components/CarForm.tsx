'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { Switch } from '@/components/ui/Switch';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreateCar, useUpdateCar } from '../hooks/useCars';
import { carService } from '@/services/carService';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Car, Sparkles } from 'lucide-react';

interface CarFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function CarForm({ initialData, isEditMode = false }: CarFormProps) {
  const router = useRouter();
  const createMutation = useCreateCar();
  const updateMutation = useUpdateCar();

  // فیلدهای اصلی
  const [model, setModel] = useState(initialData?.model || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [vehicleType, setVehicleType] = useState(initialData?.vehicleType || 'خودروسبک');
  const [isAutomatic, setIsAutomatic] = useState(initialData?.isAutomatic || false);
  const [isUsedForProduct, setIsUsedForProduct] = useState(initialData?.isUsedForProduct ?? true);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [carManufacturerId, setCarManufacturerId] = useState(
    initialData?.carManufacturerId || initialData?.carManufacturer?.id || ''
  );
  const [carManufacturerName, setCarManufacturerName] = useState(
    initialData?.carManufacturer?.name || ''
  );

  const [carTypeId, setCarTypeId] = useState(
    initialData?.carTypeId || initialData?.carType?.id || ''
  );
  const [carTypeName, setCarTypeName] = useState(
    initialData?.carType?.name || ''
  );

  // تصاویر و توضیحات
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverAlt, setCoverAlt] = useState(initialData?.coverAlt || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // سئو SEO
  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoInformation?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoInformation?.description || '');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(initialData?.seoInformation?.canonicalUrl || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // لود داده‌های اولیه در حالت Edit
  useEffect(() => {
    if (initialData) {
      setModel(initialData.model || '');
      setEnglishTitle(initialData.englishTitle || '');
      setVehicleType(initialData.vehicleType || 'خودروسبک');
      setIsAutomatic(initialData.isAutomatic || false);
      setIsUsedForProduct(initialData.isUsedForProduct ?? true);
      setIsActive(initialData.isActive ?? true);

      const mId = initialData.carManufacturerId || initialData.carManufacturer?.id || '';
      setCarManufacturerId(mId);
      setCarManufacturerName(initialData.carManufacturer?.name || '');

      const tId = initialData.carTypeId || initialData.carType?.id || '';
      setCarTypeId(tId);
      setCarTypeName(initialData.carType?.name || '');

      setCoverAlt(initialData.coverAlt || '');
      setDescription(initialData.description || '');

      if (initialData.seoInformation) {
        setSeoId(initialData.seoInformation.id || '');
        setSeoTitle(initialData.seoInformation.title || '');
        setSeoDescription(initialData.seoInformation.description || '');
        setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
      }
    }
  }, [initialData]);

  // توابع دریافت خودروسازان و نوع خودروها
  const fetchManufacturers = async (q: string) => {
    const list = await carService.getCarManufacturers(q);
    return list.map((m: any) => ({ value: m.id, label: m.name }));
  };

  const fetchCarTypes = async (q: string) => {
    const list = await carService.getCarTypes(q);
    return list.map((t: any) => ({ value: t.id, label: t.name }));
  };

  // کلید میانبر Ctrl + S
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
    if (!model.trim()) errs.model = 'مدل خودرو نمی‌تواند خالی باشد';
    if (!englishTitle.trim()) errs.englishTitle = 'عنوان انگلیسی نمی‌تواند خالی باشد';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً فیلدهای اجباری فرم را تکمیل کنید.');
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id) {
      formData.append('Id', initialData.id);
    }

    formData.append('Model', model);
    formData.append('EnglishTitle', englishTitle);
    formData.append('VehicleType', vehicleType);
    formData.append('IsAutomatic', String(isAutomatic));
    formData.append('IsUsedForProduct', String(isUsedForProduct));
    formData.append('IsActive', String(isActive));

    if (carManufacturerId) formData.append('CarManufacturerId', carManufacturerId);
    if (carTypeId) formData.append('CarTypeId', carTypeId);
    if (description) formData.append('Description', description);

    if (coverFile) formData.append('Cover', coverFile);
    if (coverAlt) formData.append('CoverAlt', coverAlt);

    if (seoId) formData.append('SEOInformation.Id', seoId);
    formData.append('SEOInformation.Title', seoTitle || model);
    formData.append('SEOInformation.Description', seoDescription || model);
    formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl || model.toLowerCase().replace(/\s+/g, '-'));

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'مدل خودرو با موفقیت به‌روزرسانی شد!' : 'مدل خودرو جدید با موفقیت ثبت شد!');
        router.push('/cars');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش خودرو: ${initialData?.model}` : 'تعریف خودرو جدید (Car)'}
            </h1>
            <p className="text-xs text-neutral-400">شناسنامه و مشخصات مدل خودرو را ثبت کنید</p>
          </div>
        </div>

        {/* تاگل وضعیت فعال */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch
            checked={isActive}
            onChange={setIsActive}
            label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'}
          />
        </div>
      </div>

      {/* ۱. مشخصات پایه خودرو */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Car className="h-4 w-4" />
          <span>اطلاعات شناسنامه خودرو</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="مدل خودرو (فارسی) *"
            placeholder="مثال: پژو 206 SD"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            error={errors.model}
          />

          <Input
            label="عنوان انگلیسی (English Title) *"
            placeholder="peugeot 206 SD"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            error={errors.englishTitle}
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

          <AsyncSelect
            label="نوع خودرو (CarType)"
            placeholder="انتخاب نوع خودرو..."
            value={carTypeId}
            initialLabel={carTypeName}
            onChange={setCarTypeId}
            fetchOptions={fetchCarTypes}
          />

          <Select
            label="کلاس کاربری خودرو"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            options={[
              { value: 'خودروسبک', label: 'خودرو سبک' },
              { value: 'خودروسنگین', label: 'خودرو سنگین' },
            ]}
          />

          <div className="flex items-center gap-6 pt-6">
            <Switch
              checked={isAutomatic}
              onChange={setIsAutomatic}
              label={isAutomatic ? 'گیربکس: اتوماتیک' : 'گیربکس: دنده‌ای (دستی)'}
            />
          </div>
        </div>
      </div>

      {/* ۲. توضیحات کامل خودرو با ادیتور */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و مشخصات فنی خودرو (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      {/* ۳. کاور و سئو */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <MediaUploader
            label="تصویر کاور خودرو"
            onFileSelect={setCoverFile}
            previewUrl={initialData?.cover ? `https://api.yadakchi.com${initialData.cover}` : null}
          />
          <Input
            label="متن جایگزین کاور (CoverAlt)"
            placeholder="توضیح تصویر برای سئو"
            value={coverAlt}
            onChange={(e) => setCoverAlt(e.target.value)}
          />
        </div>

        {/* تنظیمات سئو */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (SEO Information)</h3>
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="خرید قطعات پژو 206 SD با بهترین قیمت"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <Input
            label="توضیحات سئو (Meta Description)"
            placeholder="توضیحات خلاصه جهت نمایش در گوگل..."
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
          <Input
            label="آدرس کانونی (Canonical URL)"
            placeholder="peugeot-206-sd"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      {/* پیش‌نمایش زنده سئو */}
      <SEOPreview
        title={seoTitle || model}
        description={seoDescription}
        canonicalUrl={seoCanonicalUrl || model.toLowerCase().replace(/\s+/g, '-')}
      />

      {/* نوار چسبان پایین صفحه */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/cars')}
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
              <span>{isEditMode ? 'ذخیره تغییرات خودرو (Ctrl+S)' : 'ثبت خودرو جدید (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}