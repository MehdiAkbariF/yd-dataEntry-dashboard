'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
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
import { getMediaUrl } from '@/lib/config';
import { toast } from 'sonner';
import {
  Save,
  Loader2,
  ArrowRight,
  Package,
  Sparkles,
  Link2,
  Sliders,
  Info,
  Ban,
  Globe,
} from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
  isEditMode?: boolean;
  isDuplicateMode?: boolean;
}

export default function ProductForm({
  initialData,
  isEditMode = false,
  isDuplicateMode = false,
}: ProductFormProps) {
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

  const [, setExistingDetails] = useState<any[]>([]);

  const [productNameStandard, setProductNameStandard] = useState<string | null>(
    initialData?.part?.productNameEntryStandard || null
  );

  const [title, setTitle] = useState(initialData?.title || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [partNumber, setPartNumber] = useState(initialData?.partNumber || '');
  const [isActive, setIsActive] = useState(
    isEditMode ? initialData?.isActive ?? true : false
  );

  const [brandId, setBrandId] = useState(
    initialData?.brandId || initialData?.brand?.id || ''
  );
  const [brandName, setBrandName] = useState(initialData?.brand?.name || '');

  const [partId, setPartId] = useState(
    initialData?.partId || initialData?.part?.id || ''
  );
  const [partName, setPartName] = useState(initialData?.part?.name || '');

  const [carIds, setCarIds] = useState<string[]>(
    initialData?.cars?.map((c: any) => c.id) || []
  );

  const [tagIds, setTagIds] = useState<string[]>(
    initialData?.tags?.map((t: any) => t.id) || []
  );

  const [relatedProductIds, setRelatedProductIds] = useState<string[]>(
    initialData?.relatedProducts?.map((r: any) => r.id) || []
  );

  const [height, setHeight] = useState(
    initialData?.height ? String(initialData.height) : '0'
  );
  const [width, setWidth] = useState(
    initialData?.width ? String(initialData.width) : '0'
  );
  const [length, setLength] = useState(
    initialData?.length ? String(initialData.length) : '0'
  );
  const [weight, setWeight] = useState(
    initialData?.weight ? String(initialData.weight) : '0'
  );
  const [isFragile, setIsFragile] = useState(initialData?.isFragile || false);
  const [isTipaxSendable, setIsTipaxSendable] = useState(
    initialData?.isTipaxSendable ?? true
  );

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');
  const [galleryItems, setGalleryItems] = useState<GalleryFileItem[]>([]);
  const [note, setNote] = useState(initialData?.note || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
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

  // ============================================================
  // ✅ کش گزینه‌های انتخاب‌شده (برای MultiSelect ها)
  // این cache باعث می‌شود label گزینه‌های انتخاب‌شده هرگز از دست نرود
  // ============================================================

  // 🚗 Cars Options Cache
  const [carOptionsCache, setCarOptionsCache] = useState<Map<string, string>>(
    () => {
      const map = new Map<string, string>();
      (initialData?.cars || []).forEach((c: any) => {
        map.set(c.id, `${c.model} (${c.englishTitle || ''})`);
      });
      return map;
    }
  );

  // 🏷️ Tags Options Cache
  const [tagOptionsCache, setTagOptionsCache] = useState<Map<string, string>>(
    () => {
      const map = new Map<string, string>();
      (initialData?.tags || []).forEach((t: any) => {
        map.set(t.id, t.value);
      });
      return map;
    }
  );

  // 🔗 Related Products Options Cache
  const [relatedOptionsCache, setRelatedOptionsCache] = useState<
    Map<string, string>
  >(() => {
    const map = new Map<string, string>();
    (initialData?.relatedProducts || []).forEach((r: any) => {
      map.set(r.id, r.title);
    });
    return map;
  });

  // ============================================================
  // ✅ گزینه‌های اولیه داینامیک برای هر MultiSelect
  // این memo ها همیشه با selectedIds و cache همگام هستند
  // ============================================================

  const carInitialOptions = useMemo<SelectOption[]>(
    () =>
      carIds.map((id) => ({
        value: id,
        label: carOptionsCache.get(id) || id,
      })),
    [carIds, carOptionsCache]
  );

  const tagInitialOptions = useMemo<SelectOption[]>(
    () =>
      tagIds.map((id) => ({
        value: id,
        label: tagOptionsCache.get(id) || id,
      })),
    [tagIds, tagOptionsCache]
  );

  const relatedInitialOptions = useMemo<SelectOption[]>(
    () =>
      relatedProductIds.map((id) => ({
        value: id,
        label: relatedOptionsCache.get(id) || id,
      })),
    [relatedProductIds, relatedOptionsCache]
  );

  // ============================================================
  // ✅ Fetch Part Standard Rule
  // ============================================================
  const fetchPartStandardRule = useCallback(async (pId: string) => {
    if (!pId) {
      setProductNameStandard(null);
      return;
    }
    try {
      const res = await apiClient.get<any>('/api/A_Part/Part', {
        params: { Id: pId },
      });
      const partData = res.data;
      if (partData && partData.productNameEntryStandard) {
        setProductNameStandard(partData.productNameEntryStandard);
      } else {
        setProductNameStandard(null);
      }
    } catch (e) {
      setProductNameStandard(null);
    }
  }, []);

  // ============================================================
  // ✅ Effect اصلی: مقداردهی اولیه فرم
  // ============================================================
  useEffect(() => {
    if (!initialData) {
      setIsActive(false);
      return;
    }

    // --- اطلاعات پایه ---
    setTitle(initialData.title || '');
    setEnglishTitle(initialData.englishTitle || '');
    setPartNumber(initialData.partNumber || '');
    setIsActive(isEditMode ? initialData.isActive ?? true : false);

    // --- برند ---
    const bId = initialData.brandId || initialData.brand?.id || '';
    const bName = initialData.brandName || initialData.brand?.name || '';
    setBrandId(bId);
    setBrandName(bName);

    // --- قطعه ---
    const pId = initialData.partId || initialData.part?.id || '';
    const pName = initialData.partName || initialData.part?.name || '';
    setPartId(pId);
    setPartName(pName);

    // --- خودروها ---
    if (initialData.cars) {
      const ids = initialData.cars.map((c: any) => c.id);
      setCarIds(ids);
      setCarOptionsCache(() => {
        const map = new Map<string, string>();
        initialData.cars.forEach((c: any) => {
          map.set(c.id, `${c.model} (${c.englishTitle || ''})`);
        });
        return map;
      });
    }

    // --- تگ‌ها ---
    if (initialData.tags) {
      const ids = initialData.tags.map((t: any) => t.id);
      setTagIds(ids);
      setTagOptionsCache(() => {
        const map = new Map<string, string>();
        initialData.tags.forEach((t: any) => {
          map.set(t.id, t.value);
        });
        return map;
      });
    }

    // --- محصولات مرتبط ---
    if (initialData.relatedProducts) {
      const ids = initialData.relatedProducts.map((r: any) => r.id);
      setRelatedProductIds(ids);
      setRelatedOptionsCache(() => {
        const map = new Map<string, string>();
        initialData.relatedProducts.forEach((r: any) => {
          map.set(r.id, r.title);
        });
        return map;
      });
    }

    // --- گالری تصاویر ---
    if (
      initialData.productImages &&
      Array.isArray(initialData.productImages)
    ) {
      const mappedGallery: GalleryFileItem[] = initialData.productImages.map(
        (img: any) => ({
          id: isDuplicateMode ? undefined : img.id,
          file: null,
          alt: img.imageAlt || '',
          preview: getMediaUrl(img.image) || '',
        })
      );
      setGalleryItems(mappedGallery);
    }

    // --- ابعاد و بسته‌بندی ---
    setHeight(initialData.height ? String(initialData.height) : '0');
    setWidth(initialData.width ? String(initialData.width) : '0');
    setLength(initialData.length ? String(initialData.length) : '0');
    setWeight(initialData.weight ? String(initialData.weight) : '0');
    setIsFragile(initialData.isFragile || false);
    setIsTipaxSendable(initialData.isTipaxSendable ?? true);

    setImageAlt(initialData.imageAlt || '');
    setNote(initialData.note || '');
    setDescription(initialData.description || '');

    // --- SEO ---
    if (initialData.seoInformation) {
      setSeoId(isDuplicateMode ? '' : initialData.seoInformation.id || '');
      setSeoTitle(initialData.seoInformation.title || '');
      setSeoDescription(initialData.seoInformation.description || '');
      setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
    }
  }, [initialData, isDuplicateMode, isEditMode]);

  // ============================================================
  // ✅ Effect مستقل: بارگذاری Properties + مقادیرشان
  // این effect بعد از effect اصلی اجرا می‌شود و مسئول:
  //   1. لود properties مربوط به partId
  //   2. لود مقادیر property مربوط به محصول مرجع (در حالت Edit یا Duplicate)
  // ============================================================
  useEffect(() => {
    if (!initialData) return;

    const pId = initialData.partId || initialData.part?.id || '';
    if (!pId) {
      resetProperties();
      setProductNameStandard(null);
      return;
    }

    // ✅ ProductNameEntryStandard
    if (initialData?.part?.productNameEntryStandard) {
      setProductNameStandard(initialData.part.productNameEntryStandard);
    } else {
      fetchPartStandardRule(pId);
    }

    // ✅ لود کردن Properties و مقادیر به صورت orchestrated
    const loadPropsAndValues = async () => {
      // 1) اول properties (فیلدهای فنی) قطعه را لود کن
      await loadProperties(pId);
      actions.fetchPropertiesForPart(pId);

      // 2) سپس مقادیر (values) را از محصول مرجع لود کن
      const referenceProductId =
        initialData.id || (isDuplicateMode ? initialData.referenceId : null);

      if (!referenceProductId) return;

      try {
        const details = await productService.getProductDetails(referenceProductId);
        setExistingDetails(details || []);

        if (details && details.length > 0) {
          const mappedValues: Record<string, any> = {};
          details.forEach((d: any) => {
            if (d.propertyId) {
              const rawVal = d.value;
              if (
                rawVal &&
                typeof rawVal === 'string' &&
                rawVal.includes(',')
              ) {
                mappedValues[d.propertyId] = rawVal
                  .split(',')
                  .map((s: string) => s.trim());
              } else if (rawVal && typeof rawVal === 'string') {
                mappedValues[d.propertyId] = [rawVal.trim()];
              } else {
                mappedValues[d.propertyId] = rawVal;
              }
            }
          });
          setPropertyValues(mappedValues);
        }
      } catch (e) {
        console.error('[ProductForm] Failed to load product details:', e);
      }
    };

    loadPropsAndValues();
  }, [
    initialData,
    isDuplicateMode,
    loadProperties,
    actions,
    setPropertyValues,
    resetProperties,
    fetchPartStandardRule,
  ]);

  // ============================================================
  // ✅ Keyboard Shortcut: Ctrl+S
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        const submitBtn = document.getElementById(
          'submit-btn'
        ) as HTMLButtonElement;
        if (submitBtn && !submitBtn.disabled) {
          submitBtn.click();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ============================================================
  // ✅ Handlers
  // ============================================================
  const handleNumberFocus = (
    value: string | number,
    setter: (val: string) => void
  ) => {
    if (value === '0' || value === 0) {
      setter('');
    }
  };

  const handlePartChange = (val: string, label: string) => {
    setPartId(val);
    setPartName(label);
    setErrors((prev) => ({ ...prev, partId: '' }));
    setPropertyValues({});
    if (val) {
      loadProperties(val);
      actions.fetchPropertiesForPart(val);
      fetchPartStandardRule(val);
    } else {
      resetProperties();
      setProductNameStandard(null);
    }
  };

  const handleBrandChange = (val: string, label: string) => {
    setBrandId(val);
    setBrandName(label);
    setErrors((prev) => ({ ...prev, brandId: '' }));
  };

  const handleSetNoSeo = () => {
    setSeoTitle('no seo');
    setSeoDescription('no seo');
    setSeoCanonicalUrl('no seo');
    toast.info('مقادیر سئو روی "no seo" تنظیم شدند.');
  };

  // ============================================================
  // ✅ Fetch Functions (همراه با به‌روزرسانی cache)
  // ============================================================

  const fetchBrands = async (q: string) => {
    const res = await apiClient.get<any[]>(
      '/api/Admin/A_Product/BrandsName',
      { params: { Name: q } }
    );
    return (res.data || []).map((b) => ({ value: b.id, label: b.name }));
  };

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', {
      params: { Name: q, PageSize: 30 },
    });
    return (res.data.items || []).map((p: any) => ({
      value: p.id,
      label: p.name,
    }));
  };

  const fetchCars = async (q: string) => {
    const res = await apiClient.get<any>('/api/Admin/A_Product/CarsName', {
      params: { Model: q, PageSize: 30 },
    });
    const options = (res.data || []).map((c: any) => ({
      value: c.id,
      label: `${c.model} (${c.englishTitle || ''})`,
    }));

    // ✅ آپدیت cache
    setCarOptionsCache((prev) => {
      const next = new Map(prev);
      options.forEach((opt: SelectOption) => next.set(opt.value, opt.label));
      return next;
    });

    return options;
  };

  const fetchTags = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/Tag', {
      params: { Value: q, PageSize: 30 },
    });
    const options = (res.data.items || []).map((t: any) => ({
      value: t.id,
      label: t.value,
    }));

    // ✅ آپدیت cache
    setTagOptionsCache((prev) => {
      const next = new Map(prev);
      options.forEach((opt: SelectOption) => next.set(opt.value, opt.label));
      return next;
    });

    return options;
  };

  const fetchProductTitles = async (q: string) => {
    const res = await apiClient.get<any>(
      '/api/Admin/A_Product/ProductTitles',
      { params: { Title: q, PageNumber: 1 } }
    );
    const options = (res.data.items || []).map((p: any) => ({
      value: p.id,
      label: p.title,
    }));

    // ✅ آپدیت cache
    setRelatedOptionsCache((prev) => {
      const next = new Map(prev);
      options.forEach((opt: SelectOption) => next.set(opt.value, opt.label));
      return next;
    });

    return options;
  };

  // ============================================================
  // ✅ Validation
  // ============================================================
  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'عنوان فارسی محصول نمی‌تواند خالی باشد';
    if (!englishTitle.trim())
      errs.englishTitle = 'عنوان انگلیسی محصول نمی‌تواند خالی باشد';
    if (!brandId) errs.brandId = 'برند محصول نمی‌تواند خالی باشد';
    if (!partId) errs.partId = 'قطعه محصول نمی‌تواند خالی باشد';
    if (carIds.length === 0)
      errs.carIds = 'خودروهای سازگار نمی‌تواند خالی باشد';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleDeleteServerImage = async (imageId: string) => {
    if (isDuplicateMode) return;
    try {
      await productService.deleteProductImage(imageId);
      toast.success('تصویر گالری حذف گردید.');
    } catch (e) {
      console.error('Delete image error:', e);
    }
  };

  // ============================================================
  // ✅ Submit
  // ============================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error(
        'لطفاً فیلدهای اجباری فرم را که با رنگ قرمز مشخص شده‌اند تکمیل کنید.'
      );
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id && !isDuplicateMode) {
      formData.append('Id', initialData.id);
      formData.append('IsImageDeleted', String(false));
    }

    formData.append('Title', title.trim());
    formData.append('EnglishTitle', englishTitle.trim());
    formData.append('BrandId', brandId);
    formData.append('PartId', partId);

    carIds.forEach((id) => formData.append('CarIds', id));

    if (partNumber) formData.append('PartNumber', partNumber.trim());
    if (note) formData.append('Note', note.trim());
    if (description) formData.append('Description', description);

    formData.append('Height', String(Math.round(Number(height) || 0)));
    formData.append('Width', String(Math.round(Number(width) || 0)));
    formData.append('Length', String(Math.round(Number(length) || 0)));
    formData.append('Weight', String(Number(weight) || 0));
    formData.append('IsFragile', String(isFragile));
    formData.append('IsTipaxSendable', String(isTipaxSendable));

    if (mainImage) formData.append('Image', mainImage);
    if (imageAlt) formData.append('ImageAlt', imageAlt.trim());

    tagIds.forEach((id) => formData.append('TagIds', id));

    if (isEditMode && seoId && !isDuplicateMode)
      formData.append('SEOInformation.Id', seoId);
    if (
      seoTitle.trim() ||
      seoDescription.trim() ||
      seoCanonicalUrl.trim()
    ) {
      formData.append('SEOInformation.Title', seoTitle || title);
      formData.append('SEOInformation.Description', seoDescription || title);
      formData.append(
        'SEOInformation.CanonicalUrl',
        seoCanonicalUrl || title.toLowerCase().replace(/\s+/g, '-')
      );
    }

    let detailIndex = 0;
    Object.entries(propertyValues).forEach(([propId, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        const finalVal = Array.isArray(val)
          ? val.join(',')
          : String(val).trim();
        if (finalVal) {
          const detailItem = {
            propertyId: propId,
            value: finalVal,
          };
          formData.append(
            `ProductDetails[${detailIndex}]`,
            JSON.stringify(detailItem)
          );
          detailIndex++;
        }
      }
    });

    const activeMutation =
      isEditMode && !isDuplicateMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: async (resProduct: any) => {
        const newProductId =
          isEditMode && !isDuplicateMode
            ? initialData?.id
            : resProduct?.id || resProduct;

        try {
          if ((isEditMode || isDuplicateMode) && newProductId) {
            await productService.toggleActiveStatus(newProductId, isActive);
          }

          const newGalleryFiles = galleryItems.filter(
            (item) => item.file !== null
          );
          if (newGalleryFiles.length > 0 && newProductId) {
            const files = newGalleryFiles.map(
              (item) => item.file as File
            );
            const alts = newGalleryFiles.map(
              (item) => item.alt || title
            );
            await productService.uploadProductImages(
              newProductId,
              files,
              alts
            );
          }

          if (relatedProductIds.length > 0 && newProductId) {
            await productService.setProductRelations(
              newProductId,
              relatedProductIds
            );
          }
        } catch (e) {
          console.error('Gallery or relation error:', e);
        }

        toast.success(
          isDuplicateMode
            ? 'محصول با موفقیت تکثیر و ثبت شد!'
            : isEditMode
            ? 'محصول با موفقیت به‌روزرسانی شد!'
            : 'محصول با موفقیت ثبت شد!'
        );
        router.push('/products');
      },
      onError: (err: any) => {
        toast.error(
          err?.response?.data?.message || err?.message || 'خطا در ثبت اطلاعات.'
        );
      },
    });
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const activeProperties =
    properties.length > 0 ? properties : dependencies.partProperties;

  // ============================================================
  // ✅ Render
  // ============================================================
  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => {
        if (
          e.key === 'Enter' &&
          (e.target as HTMLElement).tagName !== 'TEXTAREA'
        ) {
          e.preventDefault();
        }
      }}
      className="space-y-8 max-w-6xl mx-auto pb-24"
    >
      {!isDuplicateMode && (
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
                {isEditMode
                  ? `ویرایش محصول: ${initialData?.title}`
                  : 'افزودن محصول جدید'}
              </h1>
              <p className="text-xs text-neutral-400">
                اطلاعات کامل قطعه خودرو را وارد و ذخیره نمایید
              </p>
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
      )}

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

      {/* ============ اطلاعات پایه ============ */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Package className="h-4 w-4" />
          <span>اطلاعات پایه و شناسنامه محصول</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
              key={partId || 'empty-part'}
              label="نوع قطعه پایه (Part) *"
              placeholder="انتخاب قطعه پایه..."
              value={partId}
              initialLabel={partName}
              onChange={handlePartChange}
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
              key={brandId || 'empty-brand'}
              label="برند سازنده *"
              placeholder="انتخاب برند..."
              value={brandId}
              initialLabel={brandName}
              onChange={(val, label) => handleBrandChange(val, label)}
              fetchOptions={fetchBrands}
            />
            {errors.brandId && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.brandId}
              </p>
            )}
          </div>

          {/* ✅ خودروها: key ثابت + initialOptions داینامیک */}
          <div className="sm:col-span-2 lg:col-span-3">
            <MultiAsyncSelect
              key="cars-multiselect"
              label="خودروهای مرتبط (CarIds) *"
              placeholder="جستجو و انتخاب خودروهای سازگار..."
              selectedValues={carIds}
              initialOptions={carInitialOptions}
              onChange={(vals) => {
                setCarIds(vals);
                setErrors((prev) => ({ ...prev, carIds: '' }));
              }}
              fetchOptions={fetchCars}
            />
            {errors.carIds && (
              <p className="mt-1 text-[11px] text-red-400">
                {errors.carIds}
              </p>
            )}
          </div>

          {/* ✅ تگ‌ها: key ثابت + initialOptions داینامیک */}
          <div className="sm:col-span-2 lg:col-span-3">
            <MultiAsyncSelect
              key="tags-multiselect"
              label="برچسب‌ها / تگ‌ها (TagIds)"
              placeholder="انتخاب برچسب‌های مرتبط..."
              selectedValues={tagIds}
              initialOptions={tagInitialOptions}
              onChange={setTagIds}
              fetchOptions={fetchTags}
            />
          </div>
        </div>
      </div>

      {/* ============ مشخصات فنی ============ */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <Sliders className="h-4 w-4" />
          <span>
            مشخصات فنی و ویژگی‌های قطعه (Product Properties)
          </span>
        </div>

        {propertiesLoading ? (
          <div className="flex items-center justify-center py-8 gap-2 text-neutral-400 text-xs">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span>در حال دریافت ویژگی‌های این قطعه...</span>
          </div>
        ) : activeProperties.length === 0 ? (
          <div className="text-xs text-neutral-500 py-4 text-center">
            {partId
              ? 'هیچ ویژگی فنی برای این قطعه تعریف نشده است.'
              : 'لطفاً ابتدا یک قطعه پایه (Part) انتخاب کنید.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activeProperties.map((prop: any) => {
              const propType = String(prop.type);
              const currentValue = propertyValues[prop.id] || [];

              if (propType === 'MultiSelect' || propType === '1') {
                const multiOptions = (
                  dependencies.propertyMultiSelects[prop.id] || []
                ).map((m: any) => ({
                  value: m.id || m.value,
                  label: m.value,
                }));

                const selectedMultiValues = Array.isArray(currentValue)
                  ? currentValue
                  : typeof currentValue === 'string' && currentValue
                  ? currentValue.split(',').map((s) => s.trim())
                  : [];

                const initialMultiOpts = selectedMultiValues.map(
                  (val: string) => {
                    const matched = multiOptions.find(
                      (o: any) => o.value === val
                    );
                    return {
                      value: val,
                      label: matched ? matched.label : val,
                    };
                  }
                );

                return (
                  <div
                    key={`${prop.id}-${selectedMultiValues.length}`}
                    className="sm:col-span-2"
                  >
                    <MultiAsyncSelect
                      label={`${prop.name} ${prop.isRequired ? '*' : ''}`}
                      placeholder={`انتخاب مقادیر ${prop.name}...`}
                      selectedValues={selectedMultiValues}
                      initialOptions={initialMultiOpts}
                      onChange={(vals: string[]) => {
                        setPropertyValue(prop.id, vals);
                      }}
                      fetchOptions={async () => multiOptions}
                    />
                  </div>
                );
              }

              return (
                <div key={prop.id} className="space-y-1.5">
                  <label className="block text-xs font-medium text-neutral-300">
                    {prop.name}{' '}
                    {prop.isRequired && (
                      <span className="text-red-400">*</span>
                    )}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={`مقدار ${prop.name} را وارد کنید...`}
                    value={
                      typeof currentValue === 'string'
                        ? currentValue
                        : currentValue[0] || ''
                    }
                    onChange={(e) =>
                      setPropertyValue(prop.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.stopPropagation();
                      }
                    }}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 transition-all resize-y min-h-[44px]"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============ محصولات مرتبط ============ */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Link2 className="h-4 w-4" />
          <span>محصولات مرتبط (Related Products)</span>
        </div>
        <MultiAsyncSelect
          key="related-products-multiselect"
          label="انتخاب محصولات مشابه یا مکمل"
          placeholder="جستجو در عنوان محصولات..."
          selectedValues={relatedProductIds}
          initialOptions={relatedInitialOptions}
          onChange={setRelatedProductIds}
          fetchOptions={fetchProductTitles}
        />
      </div>

      {/* ============ توضیحات ============ */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3 shadow-lg shadow-black/20">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>توضیحات و نقد و بررسی محصول (HTML Content)</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
      </div>

      {/* ============ تصاویر ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
          <MediaUploader
            label="تصویر اصلی محصول"
            onFileSelect={setMainImage}
            previewUrl={
              isDuplicateMode && initialData?.image
                ? getMediaUrl(initialData.image)
                : getMediaUrl(initialData?.image)
            }
          />
          <Input
            label="متن جایگزین تصویر اصلی (ImageAlt)"
            placeholder="توضیح تصویر اصلی برای سئو"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 shadow-lg shadow-black/20">
          <ProductGalleryUploader
            items={galleryItems}
            onChange={setGalleryItems}
            onDeleteServerImage={handleDeleteServerImage}
          />
        </div>
      </div>

      {/* ============ ابعاد و SEO ============ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
          <h3 className="text-sm font-bold text-amber-500 flex items-center gap-2">
            <Package className="w-4 h-4" /> ابعاد، وزن و بسته‌بندی
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="طول (cm)"
              type="number"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              onFocus={() => handleNumberFocus(length, setLength)}
              dir="ltr"
            />
            <Input
              label="عرض (cm)"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
              onFocus={() => handleNumberFocus(width, setWidth)}
              dir="ltr"
            />
            <Input
              label="ارتفاع (cm)"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              onFocus={() => handleNumberFocus(height, setHeight)}
              dir="ltr"
            />
            <Input
              label="وزن (kg)"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              onFocus={() => handleNumberFocus(weight, setWeight)}
              dir="ltr"
            />
          </div>

          <div className="flex items-center gap-6 pt-3">
            <label className="flex items-center gap-2 text-xs font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isFragile}
                onChange={(e) => setIsFragile(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>کالای شکستنی است</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-bold text-neutral-300 cursor-pointer hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={isTipaxSendable}
                onChange={(e) => setIsTipaxSendable(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span>قابل ارسال با تیپاکس</span>
            </label>
          </div>

          <div className="pt-2">
            <Input
              label="یادداشت داخلی دیتا اینتری (Note)"
              placeholder="توضیحات خصوصی برای تیم پشتیبانی"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Globe className="h-4 w-4" />
              <span>تنظیمات سئو (SEO Information)</span>
            </div>

            <button
              type="button"
              onClick={handleSetNoSeo}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="پر کردن فیلدهای سئو با no seo"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>عدم نیاز به سئو</span>
            </button>
          </div>

          <div className="space-y-4">
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
      </div>

      <SEOPreview
        title={seoTitle || title}
        description={seoDescription}
        canonicalUrl={
          seoCanonicalUrl || title.toLowerCase().replace(/\s+/g, '-')
        }
      />

      {/* ============ Sticky Footer ============ */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-700/80 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/products')}
          className="rounded-xl border border-neutral-700 bg-neutral-950 px-5 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-800 transition-all"
        >
          انصراف و بازگشت
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
              <span>
                {isDuplicateMode
                  ? 'ثبت و تکثیر محصول'
                  : isEditMode
                  ? 'ذخیره تغییرات (Ctrl+S)'
                  : 'ذخیره محصول (Ctrl+S)'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}