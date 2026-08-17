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
import { useProductForm } from '../hooks/useProductForm';
import { useProductProperties } from '../hooks/useProductProperties';
import { productService } from '@/services/productService';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner';
import { Save, Loader2, ArrowRight, Package, Sparkles, Link2, Sliders, Info } from 'lucide-react';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

interface ProductFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function ProductForm({ initialData, isEditMode = false }: ProductFormProps) {
  const router = useRouter();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const { dependencies, actions, propertiesLoading } = useProductForm();
  const {
    properties,
    propertyValues,
    setPropertyValue,
    setPropertyValues,
    loadProperties,
    resetProperties,
  } = useProductProperties();

  const [existingDetails, setExistingDetails] = useState<any[]>([]);

  // ⚠️ استیت مربوط به قوانین نام‌گذاری قطعه (productNameEntryStandard)
  const [productNameStandard, setProductNameStandard] = useState<string | null>(
    initialData?.part?.productNameEntryStandard || null
  );

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

  const [height, setHeight] = useState(initialData?.height ? String(initialData.height) : '0');
  const [width, setWidth] = useState(initialData?.width ? String(initialData.width) : '0');
  const [length, setLength] = useState(initialData?.length ? String(initialData.length) : '0');
  const [weight, setWeight] = useState(initialData?.weight ? String(initialData.weight) : '0');
  const [isFragile, setIsFragile] = useState(initialData?.isFragile || false);
  const [isTipaxSendable, setIsTipaxSendable] = useState(initialData?.isTipaxSendable ?? true);

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [galleryItems, setGalleryItems] = useState<GalleryFileItem[]>([]);
  const [note, setNote] = useState(initialData?.note || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoInformation?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoInformation?.description || '');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(initialData?.seoInformation?.canonicalUrl || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // تابع برای دریافت اطلاعات کامل قطعه از API و استخراج productNameEntryStandard
  const fetchPartStandardRule = async (pId: string) => {
    if (!pId) {
      setProductNameStandard(null);
      return;
    }
    try {
      const res = await apiClient.get<any>('/api/A_Part/Part', { params: { Id: pId } });
      const partData = res.data;
      if (partData && partData.productNameEntryStandard) {
        setProductNameStandard(partData.productNameEntryStandard);
      } else {
        setProductNameStandard(null);
      }
    } catch (e) {
      console.error('Failed to fetch part details:', e);
      setProductNameStandard(null);
    }
  };

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

      if (pId) {
        loadProperties(pId);
        actions.fetchPropertiesForPart(pId);
        // اگر در initialData استاندارد نبود، با API بگیر
        if (initialData?.part?.productNameEntryStandard) {
          setProductNameStandard(initialData.part.productNameEntryStandard);
        } else {
          fetchPartStandardRule(pId);
        }
      }

      if (initialData.id) {
        productService.getProductDetails(initialData.id).then((details) => {
          setExistingDetails(details);
          if (details && details.length > 0) {
            const mappedValues: Record<string, any> = {};
            details.forEach((d: any) => {
              if (d.propertyId) {
                const rawVal = d.value;
                if (rawVal && typeof rawVal === 'string' && rawVal.includes(',')) {
                  mappedValues[d.propertyId] = rawVal.split(',').map((s: string) => s.trim());
                } else if (rawVal && typeof rawVal === 'string') {
                  mappedValues[d.propertyId] = [rawVal.trim()];
                } else {
                  mappedValues[d.propertyId] = rawVal;
                }
              }
            });
            setPropertyValues(mappedValues);
          }
        }).catch((err) => console.error('Error loading product details:', err));
      }

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
  }, [initialData, loadProperties, actions, setPropertyValues]);

  const handlePartChange = (selectedPartId: string) => {
    setPartId(selectedPartId);
    setPropertyValues({});
    if (selectedPartId) {
      loadProperties(selectedPartId);
      actions.fetchPropertiesForPart(selectedPartId);
      fetchPartStandardRule(selectedPartId); // 👈 فراخوانی گرفتن قانون نام‌گذاری
    } else {
      resetProperties();
      setProductNameStandard(null);
    }
  };

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
        const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
        }
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

          if (productId) {
            await Promise.all(
              Object.entries(propertyValues).map(async ([propId, val]) => {
                if (val !== undefined && val !== null && val !== '') {
                  const finalVal = Array.isArray(val) ? val.join(', ') : String(val);
                  const foundExisting = existingDetails.find((d: any) => d.propertyId === propId);

                  const detailForm = new FormData();

                  if (foundExisting) {
                    detailForm.append('Id', foundExisting.id);
                    detailForm.append('Value', finalVal);
                    await productService.updateProductDetail(detailForm);
                  } else {
                    detailForm.append('ProductId', productId);
                    detailForm.append('PropertyId', propId);
                    detailForm.append('Value', finalVal);
                    await productService.createProductDetail(detailForm);
                  }
                }
              })
            );
          }

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
          console.error('Details, gallery or relation error:', e);
        }

        toast.success(isEditMode ? 'محصول با موفقیت به‌روزرسانی شد!' : 'محصول با موفقیت ثبت شد!');
        router.push('/products');
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const activeProperties = properties.length > 0 ? properties : dependencies.partProperties;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-6xl mx-auto pb-24">
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
          <Switch checked={isActive} onChange={setIsActive} label={isActive ? 'وضعیت: فعال' : 'وضعیت: غیرفعال'} />
        </div>
      </div>

      {/* ⚠️ بنر قوانین نام‌گذاری محصول (ProductNameEntryStandard) */}
      {productNameStandard && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 shadow-xl backdrop-blur-md animate-fadeIn">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Info className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              قوانین و استاندارد نام‌گذاری این قطعه:
            </h4>
            <p className="text-xs font-mono font-bold text-white bg-neutral-950/80 px-3 py-2 rounded-xl border border-neutral-800 dir-ltr text-right inline-block">
              {productNameStandard}
            </p>
          </div>
        </div>
      )}

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
              onChange={handlePartChange}
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

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Sliders className="h-4 w-4" />
          <span>مشخصات فنی و ویژگی‌های قطعه (Product Properties)</span>
        </div>

        {propertiesLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-neutral-400 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span>در حال دریافت ویژگی‌های این قطعه...</span>
          </div>
        ) : activeProperties.length === 0 ? (
          <div className="text-xs text-neutral-500 py-4 text-center">
            {partId ? 'هیچ ویژگی فنی برای این قطعه تعریف نشده است.' : 'لطفاً ابتدا یک قطعه پایه (Part) انتخاب کنید.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {activeProperties.map((prop: any) => {
              const propType = String(prop.type);
              const currentValue = propertyValues[prop.id] || [];
if (propType === 'MultiSelect' || propType === '1') {
                const multiOptions = (dependencies.propertyMultiSelects[prop.id] || []).map((m: any) => ({
                  value: m.value,
                  label: m.value,
                }));

                // ⚠️ دریافت مقادیر انتخاب شده به صورت آرایه امن
                const selectedMultiValues = Array.isArray(currentValue)
                  ? currentValue
                  : typeof currentValue === 'string' && currentValue
                  ? currentValue.split(',').map((s) => s.trim())
                  : [];

                const initialMultiOpts = selectedMultiValues.map((val: string) => ({
                  value: val,
                  label: val,
                }));

                return (
                  <div key={prop.id} className="sm:col-span-2">
                    <MultiAsyncSelect
                      label={`${prop.name} ${prop.isRequired ? '*' : ''}`}
                      placeholder={`انتخاب مقادیر ${prop.name}...`}
                      selectedValues={selectedMultiValues}
                      initialOptions={initialMultiOpts}
                      onChange={(vals: string[]) => {
                        // ⚠️ ذخیره آرایه انتخاب‌شده در استیت propertyValues
                        setPropertyValue(prop.id, vals);
                      }}
                      fetchOptions={async () => multiOptions}
                    />
                  </div>
                );
              }
              return (
                <Input
                  key={prop.id}
                  label={`${prop.name} ${prop.isRequired ? '*' : ''}`}
                  placeholder={`مقدار ${prop.name} را وارد کنید...`}
                  value={typeof currentValue === 'string' ? currentValue : currentValue[0] || ''}
                  onChange={(e) => setPropertyValue(prop.id, e.target.value)}
                />
              );
            })}
          </div>
        )}
      </div>

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

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و نقد و بررسی محصول (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

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

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6">
          <ProductGalleryUploader
            items={galleryItems}
            onChange={setGalleryItems}
            onDeleteServerImage={handleDeleteServerImage}
          />
        </div>
      </div>

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

      <SEOPreview
        title={seoTitle || title}
        description={seoDescription}
        canonicalUrl={seoCanonicalUrl || title.toLowerCase().replace(/\s+/g, '-')}
      />

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