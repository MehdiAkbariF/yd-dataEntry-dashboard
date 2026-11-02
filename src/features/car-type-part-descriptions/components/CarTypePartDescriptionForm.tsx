// src/features/car-type-part-descriptions/components/CarTypePartDescriptionForm.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import MediaUploader from '@/components/common/MediaUploader';
import ProEditor from '@/components/editor/ProEditor';   // ← اضافه شد
import SEOPreview from '@/components/common/SEOPreview';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  ArrowRight,
  FileText,   // ← آیکون جدید برای بخش توضیحات
} from 'lucide-react';
import {
  useCreateCarTypePartDescription,
  useUpdateCarTypePartDescription,
} from '../hooks/useCarTypePartDescriptions';

interface Props {
  initialData?: any;
  isEditMode?: boolean;
}

export default function CarTypePartDescriptionForm({
  initialData,
  isEditMode = false,
}: Props) {
  const router = useRouter();
  const createMutation = useCreateCarTypePartDescription();
  const updateMutation = useUpdateCarTypePartDescription();

  const [partId, setPartId] = useState(
    initialData?.partId || initialData?.part?.id || ''
  );
  const [partName, setPartName] = useState(initialData?.partName || '');
  const [carTypeId, setCarTypeId] = useState(
    initialData?.carTypeId || initialData?.carType?.id || ''
  );
  const [carTypeName, setCarTypeName] = useState(
    initialData?.carType?.name || ''
  );

  // ← description حالا HTML است که از ProEditor میاد
  const [description, setDescription] = useState(
    initialData?.description || ''
  );

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  const [seoTitle, setSeoTitle] = useState(
    initialData?.seoInformation?.title || ''
  );
  const [seoDescription, setSeoDescription] = useState(
    initialData?.seoInformation?.description || ''
  );
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(
    initialData?.seoInformation?.canonicalUrl || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', {
      params: { Name: q, PageSize: 30 },
    });
    return (res.data.items || []).map((p: any) => ({
      value: p.id,
      label: p.name,
    }));
  };

  const fetchCarTypes = async (q: string) => {
    const res = await apiClient.get<any>('/api/Admin/A_Product/CarsName', {
      params: { Model: q, PageSize: 30 },
    });
    return (res.data || []).map((c: any) => ({
      value: c.id,
      label: `${c.model} (${c.englishTitle || ''})`,
    }));
  };

  // ─── اعتبارسنجی: بررسی HTML خالی (فقط تگ‌های خالی مثل <p></p>) ───
  const isDescriptionEmpty = (html: string) => {
    if (!html) return true;
    const stripped = html
      .replace(/<[^>]*>/g, '')      // حذف تگ‌ها
      .replace(/&nbsp;/g, '')       // حذف nbsp
      .trim();
    return stripped.length === 0;
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!partId) e.partId = 'قطعه الزامی است';
    if (!carTypeId) e.carTypeId = 'نوع خودرو الزامی است';
    if (isDescriptionEmpty(description))
      e.description = 'توضیحات الزامی است';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      toast.error('لطفاً فیلدهای الزامی را تکمیل کنید.');
      return;
    }

    const fd = new FormData();
    if (isEditMode && initialData?.id) fd.append('Id', initialData.id);
    fd.append('PartId', partId);
    fd.append('CarTypeId', carTypeId);
    fd.append('Description', description); // ← HTML از ProEditor

    imageFiles.forEach((f) => fd.append('DescriptionImageFiles', f));
    videoFiles.forEach((f) => fd.append('DescriptionVideoFiles', f));

    if (seoTitle) fd.append('SEOInformation.Title', seoTitle);
    if (seoDescription)
      fd.append('SEOInformation.Description', seoDescription);
    if (seoCanonicalUrl)
      fd.append('SEOInformation.CanonicalUrl', seoCanonicalUrl);

    const mutation = isEditMode ? updateMutation : createMutation;
    mutation.mutate(fd, {
      onSuccess: () => {
        toast.success(isEditMode ? 'ویرایش انجام شد.' : 'ایجاد انجام شد.');
        router.push('/car-type-part-descriptions');
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            'خطا در ذخیره اطلاعات'
        );
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        // جلوگیری از submit با Enter داخل ادیتور
        if (
          e.key === 'Enter' &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA'
        ) {
          // فقط اگر داخل ادیتور نیست
        }
      }}
      className="space-y-8 max-w-5xl mx-auto pb-24"
    >
      {/* هدر */}
      <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => router.push('/car-type-part-descriptions')}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
        >
          <ArrowRight className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-white">
            {isEditMode
              ? 'ویرایش توضیحات قطعه-خودرو'
              : 'افزودن توضیحات قطعه-خودرو'}
          </h1>
          <p className="text-xs text-neutral-400">
            توضیحات، تصاویر، ویدیوها و تنظیمات سئو را وارد کنید
          </p>
        </div>
      </div>

      {/* اطلاعات پایه */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <FileText className="h-4 w-4" />
          <span>اطلاعات پایه</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <AsyncSelect
              label="قطعه (Part) *"
              placeholder="انتخاب قطعه..."
              value={partId}
              initialLabel={partName}
              onChange={(val, label) => {
                setPartId(val);
                setPartName(label);
                setErrors((p) => ({ ...p, partId: '' }));
              }}
              fetchOptions={fetchParts}
            />
            {errors.partId && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.partId}
              </p>
            )}
          </div>

          <div>
            <AsyncSelect
              label="نوع خودرو (CarType) *"
              placeholder="انتخاب خودرو..."
              value={carTypeId}
              initialLabel={carTypeName}
              onChange={(val, label) => {
                setCarTypeId(val);
                setCarTypeName(label);
                setErrors((p) => ({ ...p, carTypeId: '' }));
              }}
              fetchOptions={fetchCarTypes}
            />
            {errors.carTypeId && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.carTypeId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* توضیحات با ProEditor */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <FileText className="h-4 w-4" />
          <span>توضیحات (HTML Content) *</span>
        </div>

        <ProEditor value={description} onChange={setDescription} />

        {errors.description && (
          <p className="text-[11px] text-red-400">{errors.description}</p>
        )}
      </div>

      {/* تصاویر و ویدیوها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg shadow-black/20">
          <MediaUploader
            label="تصاویر توضیحات (DescriptionImageFiles)"
            multiple
            onFilesSelect={setImageFiles}
          />
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg shadow-black/20">
          <MediaUploader
            label="ویدیوهای توضیحات (DescriptionVideoFiles)"
            accept="video/*"
            multiple
            onFilesSelect={setVideoFiles}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
        <h3 className="text-sm font-bold text-amber-500">
          تنظیمات سئو (SEO Information)
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="عنوان مناسب برای موتورهای جستجو..."
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
          />
          <Input
            label="توضیحات سئو (Meta Description)"
            placeholder="توضیحات خلاصه..."
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
          />
          <Input
            label="آدرس کانونی (Canonical URL)"
            placeholder="canonical-url-slug"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      <SEOPreview
        title={seoTitle}
        description={seoDescription}
        canonicalUrl={seoCanonicalUrl}
      />

      {/* Sticky Footer */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-700/80 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/car-type-part-descriptions')}
          className="rounded-xl border border-neutral-700 bg-neutral-950 px-5 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-800 transition-all"
        >
          انصراف و بازگشت
        </button>
        <button
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
              <span>{isEditMode ? 'ذخیره تغییرات' : 'ذخیره'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}