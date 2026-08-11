'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreatePartCategory, useUpdatePartCategory } from '../hooks/usePartCategories';
import { partService } from '@/services/partService';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Layers, Sparkles } from 'lucide-react';

interface PartCategoryFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function PartCategoryForm({ initialData, isEditMode = false }: PartCategoryFormProps) {
  const router = useRouter();
  const createMutation = useCreatePartCategory();
  const updateMutation = useUpdatePartCategory();

  // فیلدها
  const [name, setName] = useState(initialData?.name || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [parentId, setParentId] = useState(initialData?.parentId || '');
  const [parentName, setParentName] = useState(initialData?.parent?.name || '');
  const [isInMain, setIsInMain] = useState(initialData?.isInMain || false);

  // تصاویر
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailAlt, setThumbnailAlt] = useState(initialData?.thumbnailAlt || '');
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
      setParentId(initialData.parentId || '');
      setParentName(initialData.parent?.name || '');
      setIsInMain(initialData.isInMain || false);
      setThumbnailAlt(initialData.thumbnailAlt || '');
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
    if (!name.trim()) errs.name = 'نام دسته‌بندی نمی‌تواند خالی باشد';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً فیلدهای اجباری را پر کنید.');
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id) {
      formData.append('Id', initialData.id);
    }

    formData.append('Name', name);
    if (englishTitle) formData.append('EnglishTitle', englishTitle);
    if (parentId) formData.append('ParentId', parentId);
    formData.append('IsInMain', String(isInMain));
    if (description) formData.append('Description', description);

    if (thumbnailFile) formData.append('ThumbnailFile', thumbnailFile);
    if (thumbnailAlt) formData.append('ThumbnailAlt', thumbnailAlt);
    if (iconFile) formData.append('IconFile', iconFile);
    if (iconAlt) formData.append('IconAlt', iconAlt);

    if (seoId) formData.append('SEOInformation.Id', seoId);
    formData.append('SEOInformation.Title', seoTitle || name);
    formData.append('SEOInformation.Description', seoDescription || name);
    formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl || name.toLowerCase().replace(/\s+/g, '-'));

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'دسته‌بندی با موفقیت به‌روزرسانی شد!' : 'دسته‌بندی با موفقیت ایجاد شد!');
        router.push('/parts/categories');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
      {/* هدر صفحه */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => router.push('/parts/categories')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">
            {isEditMode ? `ویرایش دسته‌بندی: ${initialData?.name}` : 'تعریف دسته‌بندی جدید'}
          </h1>
          <p className="text-xs text-neutral-400">اطلاعات دسته‌بندی قطعات خودرو را وارد کنید</p>
        </div>
      </div>

      {/* ۱. اطلاعات اصلی */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Layers className="h-4 w-4" />
          <span>اطلاعات پایه دسته‌بندی</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="نام دسته‌بندی (فارسی) *"
            placeholder="مثال: سیستم تعلیق و جلوبندی"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <Input
            label="عنوان انگلیسی (English Title)"
            placeholder="suspension-system"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            dir="ltr"
          />

          <AsyncSelect
            label="دسته‌بندی والد (اختیاری)"
            placeholder="در صورت زیرمجموعه بودن انتخاب کنید..."
            value={parentId}
            initialLabel={parentName}
            onChange={setParentId}
            fetchOptions={fetchPartCategories}
          />

          <div className="flex items-center gap-3 pt-6">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isInMain}
                onChange={(e) => setIsInMain(e.target.checked)}
                className="rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>نمایش در صفحه اصلی (IsInMain)</span>
            </label>
          </div>
        </div>
      </div>

      {/* ۲. توضیحات کامل با ادیتور */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و شرح کامل دسته‌بندی (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      {/* ۳. تصویر شاخص و آیکون */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <MediaUploader
            label="تصویر کاور / بنر دسته‌بندی (Thumbnail)"
            onFileSelect={setThumbnailFile}
            previewUrl={initialData?.thumbnail ? `https://api.yadakchi.com${initialData.thumbnail}` : null}
          />
          <Input
            label="متن جایگزین کاور (ThumbnailAlt)"
            placeholder="توضیح تصویر برای سئو"
            value={thumbnailAlt}
            onChange={(e) => setThumbnailAlt(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <MediaUploader
            label="آیکون نمادین دسته‌بندی (Icon)"
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
      </div>

      {/* ۴. سئو SEO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (SEO Information)</h3>
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="خرید قطعات سیستم تعلیق با بهترین قیمت"
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
            placeholder="suspension-system"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>

        <SEOPreview
          title={seoTitle || name}
          description={seoDescription}
          canonicalUrl={seoCanonicalUrl || name.toLowerCase().replace(/\s+/g, '-')}
        />
      </div>

      {/* نوار چسبان پایین */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/parts/categories')}
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
              <span>{isEditMode ? 'ذخیره تغییرات (Ctrl+S)' : 'ثبت دسته‌بندی (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}