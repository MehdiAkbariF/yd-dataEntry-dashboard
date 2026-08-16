'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { MultiAsyncSelect, SelectOption } from '@/components/ui/MultiAsyncSelect';
import { Switch } from '@/components/ui/Switch';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import { useCreatePartDescription, useUpdatePartDescription } from '../hooks/usePartDescriptions';
import { carService } from '@/services/carService';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, FileText, Sparkles } from 'lucide-react';

interface PartDescriptionFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

function PartDescriptionFormContent({ initialData, isEditMode = false }: PartDescriptionFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const descType = (searchParams.get('type') as 'car' | 'carType') || 'car';

  const createMutation = useCreatePartDescription(descType);
  const updateMutation = useUpdatePartDescription(descType);

  const [partId, setPartId] = useState(initialData?.part?.id || '');
  const [partName, setPartName] = useState(
    typeof initialData?.part === 'object' ? initialData?.part?.name : initialData?.part || ''
  );

  const [carIds, setCarIds] = useState<string[]>(initialData?.cars?.map((c: any) => c.id) || []);
  const [initialCarOptions, setInitialCarOptions] = useState<SelectOption[]>(
    initialData?.cars?.map((c: any) => ({ value: c.id, label: c.model })) || []
  );

  const [carTypeId, setCarTypeId] = useState(initialData?.carType?.id || '');
  const [carTypeName, setCarTypeName] = useState(initialData?.carType?.name || '');

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
      if (initialData.part) {
        setPartId(typeof initialData.part === 'object' ? initialData.part.id : initialData.part);
        setPartName(typeof initialData.part === 'object' ? initialData.part.name : initialData.part);
      }
      if (initialData.cars) {
        setCarIds(initialData.cars.map((c: any) => c.id));
        setInitialCarOptions(initialData.cars.map((c: any) => ({ value: c.id, label: c.model })));
      }
      if (initialData.carType) {
        setCarTypeId(initialData.carType.id);
        setCarTypeName(initialData.carType.name);
      }
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

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', { params: { Name: q, PageSize: 30 } });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  const fetchCars = async (q: string) => {
    const res = await apiClient.get<any>('/api/Admin/A_Product/CarsName', { params: { Model: q, PageSize: 30 } });
    return (res.data || []).map((c: any) => ({ value: c.id, label: `${c.model} (${c.englishTitle})` }));
  };

  const fetchCarTypes = async (q: string) => {
    const list = await carService.getCarTypes(q);
    return list.map((t: any) => ({ value: t.id, label: t.name }));
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
    if (!partId) errs.partId = 'انتخاب قطعه الزامی است';
    if (!description.trim()) errs.description = 'متن توضیحات نمی‌تواند خالی باشد';
    if (descType === 'car' && carIds.length === 0) errs.carIds = 'انتخاب حداقل یک خودرو الزامی است';
    if (descType === 'carType' && !carTypeId) errs.carTypeId = 'انتخاب نوع خودرو الزامی است';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً فیلدهای اجباری را تکمیل کنید.');
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id) {
      formData.append('Id', initialData.id);
    }

    formData.append('PartId', partId);
    formData.append('Description', description);
    formData.append('IsActive', String(isActive));

    if (descType === 'car') {
      carIds.forEach((id) => formData.append('CarIds', id));
    } else {
      formData.append('CarTypeId', carTypeId);
    }

    const hasSeoInput = seoTitle.trim() || seoDescription.trim() || seoCanonicalUrl.trim();

    if (isEditMode && seoId) {
      formData.append('SEOInformation.Id', seoId);
    }

    if (hasSeoInput) {
      if (seoTitle.trim()) formData.append('SEOInformation.Title', seoTitle.trim());
      if (seoDescription.trim()) formData.append('SEOInformation.Description', seoDescription.trim());
      if (seoCanonicalUrl.trim()) formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl.trim());
    }

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: () => {
        toast.success(isEditMode ? 'توضیحات به‌روزرسانی شد!' : 'توضیحات با موفقیت ثبت شد!');
        router.push('/part-descriptions');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/part-descriptions"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? 'ویرایش توضیحات تخصصی' : 'ثبت توضیحات تخصصی جدید'}
            </h1>
            <p className="text-xs text-neutral-400">توضیحات اختصاصی برای ترکیب قطعه و مدل‌های خودرو</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/80 px-4 py-2">
          <Switch checked={isActive} onChange={setIsActive} label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'} />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <FileText className="h-4 w-4" />
          <span>انتخاب قطعه و خودروهای هدف</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <AsyncSelect
              label="قطعه پایه *"
              placeholder="انتخاب قطعه..."
              value={partId}
              initialLabel={partName}
              onChange={setPartId}
              fetchOptions={fetchParts}
            />
            {errors.partId && <p className="mt-1 text-[11px] text-red-400">{errors.partId}</p>}
          </div>

          {descType === 'car' ? (
            <div>
              <MultiAsyncSelect
                label="خودروهای مرتبط *"
                placeholder="انتخاب مدل‌های خودرو..."
                selectedValues={carIds}
                initialOptions={initialCarOptions}
                onChange={setCarIds}
                fetchOptions={fetchCars}
              />
              {errors.carIds && <p className="mt-1 text-[11px] text-red-400">{errors.carIds}</p>}
            </div>
          ) : (
            <div>
              <AsyncSelect
                label="نوع خودرو (CarType) *"
                placeholder="انتخاب نوع خودرو..."
                value={carTypeId}
                initialLabel={carTypeName}
                onChange={setCarTypeId}
                fetchOptions={fetchCarTypes}
              />
              {errors.carTypeId && <p className="mt-1 text-[11px] text-red-400">{errors.carTypeId}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>متن کامل توضیحات تخصصی (HTML Content) *</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
        {errors.description && <p className="text-[11px] text-red-400">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (اختیاری)</h3>
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="عنوان جهت نمایش در گوگل..."
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
            placeholder="canonical-url"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>

        <SEOPreview
          title={seoTitle || partName}
          description={seoDescription}
          canonicalUrl={seoCanonicalUrl || partName.toLowerCase().replace(/\s+/g, '-')}
        />
      </div>

      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/part-descriptions')}
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
              <span>ذخیره توضیحات (Ctrl+S)</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default function PartDescriptionForm(props: PartDescriptionFormProps) {
  return (
    <Suspense fallback={null}>
      <PartDescriptionFormContent {...props} />
    </Suspense>
  );
}