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
import ProductGalleryUploader, { GalleryFileItem } from '@/components/common/ProductGalleryUploader';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProducts';
import { productService } from '@/services/productService';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Package, Sparkles, Link2 } from 'lucide-react';

// دریافت BASE_URL از env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

interface ProductFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  // فیلدهای اصلی
  const [title, setTitle] = useState(initialData?.title || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [partNumber, setPartNumber] = useState(initialData?.partNumber || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  const [brandId, setBrandId] = useState(initialData?.brandId || initialData?.brand?.id || '');
  const [brandName, setBrandName] = useState(initialData?.brand?.name || '');

  const [partId, setPartId] = useState(initialData?.partId || initialData?.part?.id || '');
  const [partName, setPartName] = useState(initialData?.part?.name || '');

  const [carIds, setCarIds] = useState<string[]>(initialData?.cars?.map((c: any) => c.id) || []);
  const [initialCarOptions, setInitialCarOptions] = useState<SelectOption[]>(
    initialData?.cars?.map((c: any) => ({
      value: c.id,
      label: `${c.model} (${c.englishTitle || ''})`,
    })) || []
  );

  const [tagIds, setTagIds] = useState<string[]>(initialData?.tags?.map((t: any) => t.id) || []);
  const [initialTagOptions, setInitialTagOptions] = useState<SelectOption[]>(
    initialData?.tags?.map((t: any) => ({
      value: t.id,
      label: t.value,
    })) || []
  );

  const [relatedProductIds, setRelatedProductIds] = useState<string[]>(
    initialData?.relatedProducts?.map((r: any) => r.id) || []
  );
  const [initialRelatedOptions, setInitialRelatedOptions] = useState<SelectOption[]>(
    initialData?.relatedProducts?.map((r: any) => ({
      value: r.id,
      label: r.title,
    })) || []
  );

  // ابعاد و ارسال
  const [height, setHeight] = useState(initialData?.height ? String(initialData.height) : '0');
  const [width, setWidth] = useState(initialData?.width ? String(initialData.width) : '0');
  const [length, setLength] = useState(initialData?.length ? String(initialData.length) : '0');
  const [weight, setWeight] = useState(initialData?.weight ? String(initialData.weight) : '0');
  const [isFragile, setIsFragile] = useState(initialData?.isFragile || false);
  const [isTipaxSendable, setIsTipaxSendable] = useState(initialData?.isTipaxSendable ?? true);

  // تصاویر و توضیحات
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [galleryItems, setGalleryItems] = useState<GalleryFileItem[]>([]);
  const [note, setNote] = useState(initialData?.note || '');
  const [description, setDescription] = useState(initialData?.description || '');

  // سئو SEO
  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoInformation?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoInformation?.description || '');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(initialData?.seoInformation?.canonicalUrl || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // لود اولیه داده‌ها در حالت Edit (تبدیل کامل productImages سرور به galleryItems)
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setEnglishTitle(initialData.englishTitle || '');
      setPartNumber(initialData.partNumber || '');
      setIsActive(initialData.isActive ?? true);

      const bId = initialData.brandId || initialData.brand?.id || '';
      setBrandId(bId);
      setBrandName(initialData.brand?.name || '');

      const pId = initialData.partId || initialData.part?.id || '';
      setPartId(pId);
      setPartName(initialData.part?.name || '');

      if (initialData.cars) {
        setCarIds(initialData.cars.map((c: any) => c.id));
        setInitialCarOptions(initialData.cars.map((c: any) => ({ value: c.id, label: `${c.model} (${c.englishTitle || ''})` })));
      }

      if (initialData.tags) {
        setTagIds(initialData.tags.map((t: any) => t.id));
        setInitialTagOptions(initialData.tags.map((t: any) => ({ value: t.id, label: t.value })));
      }

      if (initialData.relatedProducts) {
        setRelatedProductIds(initialData.relatedProducts.map((r: any) => r.id));
        setInitialRelatedOptions(initialData.relatedProducts.map((r: any) => ({ value: r.id, label: r.title })));
      }

      // ⚠️ مپ کردن گالری تصاویر سرور به گالری فرم
      if (initialData.productImages && Array.isArray(initialData.productImages)) {
        const mappedGallery: GalleryFileItem[] = initialData.productImages.map((img: any) => ({
          id: img.id,
          file: null,
          alt: img.imageAlt || '',
          preview: img.image?.startsWith('http') ? img.image : `${BASE_URL}${img.image}`,
        }));
        setGalleryItems(mappedGallery);
      }

      setHeight(initialData.height ? String(initialData.height) : '0');
      setWidth(initialData.width ? String(initialData.width) : '0');
      setLength(initialData.length ? String(initialData.length) : '0');
      setWeight(initialData.weight ? String(initialData.weight) : '0');
      setIsFragile(initialData.isFragile || false);
      setIsTipaxSendable(initialData.isTipaxSendable ?? true);

      setImageAlt(initialData.imageAlt || '');
      setNote(initialData.note || '');
      setDescription(initialData.description || '');

      if (initialData.seoInformation) {
        setSeoId(initialData.seoInformation.id || '');
        setSeoTitle(initialData.seoInformation.title || '');
        setSeoDescription(initialData.seoInformation.description || '');
        setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
      }
    }
  }, [initialData]);

  const fetchBrands = async (q: string) => {
    const res = await apiClient.get<any[]>('/api/Admin/A_Product/BrandsName', { params: { Name: q } });
    return (res.data || []).map((b) => ({ value: b.id, label: b.name }));
  };

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', { params: { Name: q, PageSize: 30 } });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  const fetchCars = async (q: string) => {
    const res = await apiClient.get<any>('/api/Admin/A_Product/CarsName', { params: { Model: q, PageSize: 30 } });
    return (res.data || []).map((c: any) => ({ value: c.id, label: `${c.model} (${c.englishTitle || ''})` }));
  };

  const fetchTags = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/Tag', { params: { Value: q, PageSize: 30 } });
    return (res.data.items || []).map((t: any) => ({ value: t.id, label: t.value }));
  };

  const fetchProductTitles = async (q: string) => {
    const res = await apiClient.get<any>('/api/Admin/A_Product/ProductTitles', { params: { Title: q, PageNumber: 1 } });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.title }));
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
    if (!title.trim()) errs.title = 'عنوان فارسی محصول نمی‌تواند خالی باشد';
    if (!englishTitle.trim()) errs.englishTitle = 'عنوان انگلیسی محصول نمی‌تواند خالی باشد';
    if (!brandId) errs.brandId = 'شناسه برند محصول نمی‌تواند خالی باشد';
    if (!partId) errs.partId = 'شناسه قطعه محصول نمی‌تواند خالی باشد';
    if (carIds.length === 0) errs.carIds = 'شناسه خودروهای سازگار نمی‌تواند خالی باشد';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDeleteServerImage = async (imageId: string) => {
    try {
      await productService.deleteProductImage(imageId);
      toast.success('تصویر گالری حذف گردید.');
    } catch (e) {
      console.error('Delete image error:', e);
    }
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

    formData.append('Title', title);
    formData.append('EnglishTitle', englishTitle);
    formData.append('BrandId', brandId);
    formData.append('PartId', partId);
    carIds.forEach((id) => formData.append('CarIds', id));

    if (partNumber) formData.append('PartNumber', partNumber);
    if (note) formData.append('Note', note);
    if (description) formData.append('Description', description);

    formData.append('Height', height);
    formData.append('Width', width);
    formData.append('Length', length);
    formData.append('Weight', weight);
    formData.append('IsFragile', String(isFragile));
    formData.append('IsTipaxSendable', String(isTipaxSendable));

    if (mainImage) formData.append('Image', mainImage);
    if (imageAlt) formData.append('ImageAlt', imageAlt);

    tagIds.forEach((id) => formData.append('TagIds', id));

    if (isEditMode && seoId) formData.append('SEOInformation.Id', seoId);
    if (seoTitle.trim() || seoDescription.trim() || seoCanonicalUrl.trim()) {
      formData.append('SEOInformation.Title', seoTitle || title);
      formData.append('SEOInformation.Description', seoDescription || title);
      formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl || title.toLowerCase().replace(/\s+/g, '-'));
    }

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: async (resProduct: any) => {
        const productId = initialData?.id || resProduct?.id || resProduct;

        try {
          if (isEditMode && productId) {
            await productService.toggleActiveStatus(productId, isActive);
          }

          // ⚠️ آپلود فقط تصاویر جدید اضافه شده به گالری
          const newGalleryFiles = galleryItems.filter((item) => item.file !== null);
          if (newGalleryFiles.length > 0 && productId) {
            const files = newGalleryFiles.map((item) => item.file as File);
            const alts = newGalleryFiles.map((item) => item.alt || title);
            await productService.uploadProductImages(productId, files, alts);
          }

          if (relatedProductIds.length > 0 && productId) {
            await productService.setProductRelations(productId, relatedProductIds);
          }
        } catch (e) {
          console.error('Gallery or relation error:', e);
        }

        toast.success(isEditMode ? 'محصول با موفقیت به‌روزرسانی شد!' : 'محصول با موفقیت ثبت شد!');
        router.push('/products');
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
            onClick={() => router.push('/products')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش محصول: ${initialData?.title}` : 'افزودن محصول جدید'}
            </h1>
            <p className="text-xs text-neutral-400">اطلاعات کامل قطعه خودرو را وارد و ذخیره نمایید</p>
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

      {/* ۱. اطلاعات اصلی محصول */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Package className="h-4 w-4" />
          <span>اطلاعات پایه و شناسنامه محصول</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="عنوان محصول (فارسی) *"
            placeholder="مثال: شمع موتور خودرو بوش مدل سوپر پلاس"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <Input
            label="عنوان انگلیسی (English Title) *"
            placeholder="Bosch Super Plus Spark Plug"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            error={errors.englishTitle}
            dir="ltr"
          />

          <Input
            label="شماره فنی / پارت نامبر (PartNumber)"
            placeholder="مثال: FR7DC+"
            value={partNumber}
            onChange={(e) => setPartNumber(e.target.value)}
            dir="ltr"
          />

          <div>
            <AsyncSelect
              label="نوع قطعه پایه (Part) *"
              placeholder="انتخاب قطعه پایه..."
              value={partId}
              initialLabel={partName}
              onChange={setPartId}
              fetchOptions={fetchParts}
            />
            {errors.partId && <p className="mt-1 text-[11px] text-red-400">{errors.partId}</p>}
          </div>

          <div>
            <AsyncSelect
              label="برند سازنده *"
              placeholder="انتخاب برند..."
              value={brandId}
              initialLabel={brandName}
              onChange={setBrandId}
              fetchOptions={fetchBrands}
            />
            {errors.brandId && <p className="mt-1 text-[11px] text-red-400">{errors.brandId}</p>}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <MultiAsyncSelect
              label="خودروهای مرتبط (CarIds) *"
              placeholder="جستجو و انتخاب خودروهای سازگار..."
              selectedValues={carIds}
              initialOptions={initialCarOptions}
              onChange={setCarIds}
              fetchOptions={fetchCars}
            />
            {errors.carIds && <p className="mt-1 text-[11px] text-red-400">{errors.carIds}</p>}
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <MultiAsyncSelect
              label="برچسب‌ها / تگ‌ها (TagIds)"
              placeholder="انتخاب برچسب‌های مرتبط..."
              selectedValues={tagIds}
              initialOptions={initialTagOptions}
              onChange={setTagIds}
              fetchOptions={fetchTags}
            />
          </div>
        </div>
      </div>

      {/* ۲. محصولات مرتبط */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Link2 className="h-4 w-4" />
          <span>محصولات مرتبط (Related Products)</span>
        </div>
        <MultiAsyncSelect
          label="انتخاب محصولات مشابه یا مکمل"
          placeholder="جستجو در عنوان محصولات..."
          selectedValues={relatedProductIds}
          initialOptions={initialRelatedOptions}
          onChange={setRelatedProductIds}
          fetchOptions={fetchProductTitles}
        />
      </div>

      {/* ۳. توضیحات محصول با تکست ادیتور */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و نقد و بررسی محصول (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      {/* ۴. گالری تصاویر و تصویر اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <MediaUploader
            label="تصویر اصلی محصول"
            onFileSelect={setMainImage}
            previewUrl={initialData?.image ? `${BASE_URL}${initialData.image}` : null}
          />
          <Input
            label="متن جایگزین تصویر اصلی (ImageAlt)"
            placeholder="توضیح تصویر اصلی برای سئو"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>

        {/* گالری تصاویر محصول (سرور + جدید) */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <ProductGalleryUploader
            items={galleryItems}
            onChange={setGalleryItems}
            onDeleteServerImage={handleDeleteServerImage}
          />
        </div>
      </div>

      {/* ۵. مشخصات ابعادی و سئو */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">ابعاد، وزن و بسته‌بندی</h3>
          <div className="grid grid-cols-2 gap-3">
            <Input label="طول (cm)" type="number" value={length} onChange={(e) => setLength(e.target.value)} dir="ltr" />
            <Input label="عرض (cm)" type="number" value={width} onChange={(e) => setWidth(e.target.value)} dir="ltr" />
            <Input label="ارتفاع (cm)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} dir="ltr" />
            <Input label="وزن (kg)" type="number" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} dir="ltr" />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>کالای شکستنی است</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isTipaxSendable}
                onChange={(e) => setIsTipaxSendable(e.target.checked)}
                className="rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>قابل ارسال با تیپاکس</span>
            </label>
          </div>

          <Input
            label="یادداشت داخلی دیتا اینتری (Note)"
            placeholder="توضیحات خصوصی برای تیم پشتیبانی"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        {/* تنظیمات سئو */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <h3 className="text-sm font-bold text-amber-500">تنظیمات سئو (SEO Information)</h3>
          <Input
            label="عنوان سئو (Meta Title)"
            placeholder="خرید شمع موتور بوش با بهترین قیمت"
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
            placeholder="bosch-super-plus-spark-plug"
            value={seoCanonicalUrl}
            onChange={(e) => setSeoCanonicalUrl(e.target.value)}
            dir="ltr"
          />
        </div>
      </div>

      {/* پیش‌نمایش زنده سئو */}
      <SEOPreview
        title={seoTitle || title}
        description={seoDescription}
        canonicalUrl={seoCanonicalUrl || title.toLowerCase().replace(/\s+/g, '-')}
      />

      {/* نوار چسبان پایین صفحه */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/products')}
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
              <span>{isEditMode ? 'ذخیره تغییرات (Ctrl+S)' : 'ذخیره محصول (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}