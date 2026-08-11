'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { MultiAsyncSelect, SelectOption } from '@/components/ui/MultiAsyncSelect';
import { Switch } from '@/components/ui/Switch';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreatePart, useUpdatePart } from '../hooks/useParts';
import { partService } from '@/services/partService';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Cpu, Sparkles, HelpCircle } from 'lucide-react';

interface PartFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function PartForm({ initialData, isEditMode = false }: PartFormProps) {
  const router = useRouter();
  const createMutation = useCreatePart();
  const updateMutation = useUpdatePart();

  // فیلدهای اصلی
  const [name, setName] = useState(initialData?.name || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [productNameEntryStandard, setProductNameEntryStandard] = useState(
    initialData?.productNameEntryStandard || ''
  );
  const [yadakchiProfitPercent, setYadakchiProfitPercent] = useState(
    initialData?.yadakchiProfitPercent ? String(initialData.yadakchiProfitPercent) : '0'
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true); // ⚠️ تاگل وضعیت

  const [partCategoryId, setPartCategoryId] = useState(
    initialData?.partCategoryId || initialData?.partCategory?.id || ''
  );
  const [partCategoryName, setPartCategoryName] = useState(
    initialData?.partCategory?.name || ''
  );

  const [propertyIds, setPropertyIds] = useState<string[]>(
    initialData?.properties?.map((p: any) => p.id) || []
  );
  const [initialPropertyOptions, setInitialPropertyOptions] = useState<SelectOption[]>(
    initialData?.properties?.map((p: any) => ({
      value: p.id,
      label: p.name,
    })) || []
  );

  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconAlt, setIconAlt] = useState(initialData?.iconAlt || '');
  const [description, setDescription] = useState(initialData?.description || '');

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
      setProductNameEntryStandard(initialData.productNameEntryStandard || '');
      setYadakchiProfitPercent(
        initialData.yadakchiProfitPercent ? String(initialData.yadakchiProfitPercent) : '0'
      );
      setIsActive(initialData.isActive ?? true);

      const catId = initialData.partCategoryId || initialData.partCategory?.id || '';
      setPartCategoryId(catId);
      setPartCategoryName(initialData.partCategory?.name || '');

      if (initialData.properties) {
        setPropertyIds(initialData.properties.map((p: any) => p.id));
        setInitialPropertyOptions(initialData.properties.map((p: any) => ({ value: p.id, label: p.name })));
      }

      setIconAlt(initialData.iconAlt || '');
      setDescription(initialData.description || '');

      if (initialData.seoInformation) {
        setSeoId(initialData.seoInformation.id || '');
        setSeoTitle(initialData.seoInformation.title || '');
        setSeoDescription(initialData.seoInformation.description || '');
        setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
      }
    }
  }, [initialData]);

  const fetchPartCategories = async (q: string) => {
    const categories = await partService.getPartCategoriesName(q);
    return categories.map((c: any) => ({ value: c.id, label: c.name }));
  };

  const fetchProperties = async (q: string) => {
    const props = await partService.getProperties(q);
    return props.map((p: any) => ({ value: p.id, label: p.name }));
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
    if (!name.trim()) errs.name = 'نام قطعه پایه نمی‌تواند خالی باشد';
    if (!partCategoryId) errs.partCategoryId = 'انتخاب دسته‌بندی قطعه الزامی است';

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

    formData.append('Name', name);
    formData.append('PartCategoryId', partCategoryId);
    formData.append('YadakchiProfitPercent', yadakchiProfitPercent);

    if (englishTitle) formData.append('EnglishTitle', englishTitle);
    if (productNameEntryStandard) formData.append('ProductNameEntryStandard', productNameEntryStandard);
    if (description) formData.append('Description', description);

    if (iconFile) formData.append('IconFile', iconFile);
    if (iconAlt) formData.append('IconAlt', iconAlt);

    propertyIds.forEach((id) => formData.append('PropertyIds', id));

    if (seoId) formData.append('SEOInformation.Id', seoId);
    formData.append('SEOInformation.Title', seoTitle || name);
    formData.append('SEOInformation.Description', seoDescription || name);
    formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl || name.toLowerCase().replace(/\s+/g, '-'));

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: async (resPart: any) => {
        const partId = initialData?.id || resPart?.id || resPart;

        try {
          if (isEditMode && partId) {
            await partService.toggleActiveStatus(partId, isActive);
          }
        } catch (e) {
          console.error('Part active status error:', e);
        }

        toast.success(isEditMode ? 'قطعه با موفقیت به‌روزرسانی شد!' : 'قطعه پایه با موفقیت ثبت شد!');
        router.push('/parts');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push('/parts')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش قطعه: ${initialData?.name}` : 'تعریف قطعه جدید (Part)'}
            </h1>
            <p className="text-xs text-neutral-400">شناسنامه پایه قطعه خودرو را ثبت کنید</p>
          </div>
        </div>

        {/* ⚠️ تاگل وضعیت فعال در هدر فرم */}
        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch
            checked={isActive}
            onChange={setIsActive}
            label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'}
          />
        </div>
      </div>

      {/* ۱. اطلاعات پایه قطعه */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Cpu className="h-4 w-4" />
          <span>اطلاعات پایه و شناسنامه قطعه</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="نام قطعه (فارسی) *"
            placeholder="مثال: سنسور اکسیژن"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="عنوان انگلیسی (English Title)"
            placeholder="oxygen-sensor"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            dir="ltr"
          />

          <div>
            <AsyncSelect
              label="دسته‌بندی قطعه *"
              placeholder="انتخاب دسته‌بندی..."
              value={partCategoryId}
              initialLabel={partCategoryName}
              onChange={setPartCategoryId}
              fetchOptions={fetchPartCategories}
            />
            {errors.partCategoryId && <p className="mt-1 text-[11px] text-red-400">{errors.partCategoryId}</p>}
          </div>

          <Input
            label="درصد سود یدک‌چی (%)"
            type="number"
            placeholder="0"
            value={yadakchiProfitPercent}
            onChange={(e) => setYadakchiProfitPercent(e.target.value)}
            dir="ltr"
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-1 font-semibold">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>دستورالعمل / استاندارد عنوان‌نویسی محصول برای تیم محتوا (ProductNameEntryStandard)</span>
            </div>
            <textarea
              rows={2}
              placeholder="مثال: [نام قطعه] + [برند] + [مدل خودرو] + [ویژگی شاخص]"
              value={productNameEntryStandard}
              onChange={(e) => setProductNameEntryStandard(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <MultiAsyncSelect
              label="ویژگی‌های مرتبط با این قطعه (PropertyIds)"
              placeholder="انتخاب ویژگی‌ها (مانند ابعاد، جنس، ولتاژ...)"
              selectedValues={propertyIds}
              initialOptions={initialPropertyOptions}
              onChange={setPropertyIds}
              fetchOptions={fetchProperties}
            />
          </div>
        </div>
      </div>

      {/* ۲. توضیحات قطعه با تکست ادیتور فوق حرفه‌ای */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و راهنمای کامل قطعه (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      {/* ۳. آیکون و سئو */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <MediaUploader
            label="آیکون یا تصویر نمادین قطعه"
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

        {/* تنظیمات سئو */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (SEO Information)</h3>
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="خرید سنسور اکسیژن خودرو | قیمت و مشخصات"
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
            placeholder="oxygen-sensor"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      {/* پیش‌نمایش زنده سئو */}
      <SEOPreview
        title={seoTitle || name}
        description={seoDescription}
        canonicalUrl={seoCanonicalUrl || name.toLowerCase().replace(/\s+/g, '-')}
      />

      {/* نوار چسبان پایین صفحه */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/parts')}
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
              <span>{isEditMode ? 'ذخیره تغییرات قطعه (Ctrl+S)' : 'ثبت قطعه جدید (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}