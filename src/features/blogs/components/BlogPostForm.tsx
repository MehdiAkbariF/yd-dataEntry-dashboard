'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { MultiAsyncSelect, SelectOption } from '@/components/ui/MultiAsyncSelect';
import ProEditor from '@/components/editor/ProEditor';
import SEOPreview from '@/components/common/SEOPreview';
import MediaUploader from '@/components/common/MediaUploader';
import { useCreateBlogPost, useUpdateBlogPost } from '../hooks/useBlogs';
import { blogService } from '@/services/blogService';
import { carService } from '@/services/carService';
import { apiClient } from '@/lib/axios';
import { getMediaUrl } from '@/lib/config';
import { toast } from 'sonner';
import { BlogPostFAQ } from '../types';
import {
  Save,
  Loader2,
  ArrowRight,
  BookOpen,
  Sparkles,
  HelpCircle,
  Plus,
  Trash2,
  Car,
  Cpu,
  Ban,
  Globe,
} from 'lucide-react';

interface BlogPostFormProps {
  initialData?: any;
  isEditMode?: boolean;
}

export default function BlogPostForm({ initialData, isEditMode = false }: BlogPostFormProps) {
  const router = useRouter();
  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const [title, setTitle] = useState(initialData?.title || '');
  const [englishTitle, setEnglishTitle] = useState(initialData?.englishTitle || '');
  const [blogCategoryId, setBlogCategoryId] = useState(initialData?.blogCategoryId || '');
  const [blogCategoryName, setBlogCategoryName] = useState(initialData?.blogCategory?.title || '');
  const [readTime, setReadTime] = useState(initialData?.readTime ? String(initialData.readTime) : '5');
  const [summary, setSummary] = useState(initialData?.summary || initialData?.summarry || '');
  const [description, setDescription] = useState(initialData?.description || '');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAlt, setImageAlt] = useState(initialData?.imageAlt || '');

  const [carTypeIds, setCarTypeIds] = useState<string[]>(
    initialData?.carTypes?.map((c: any) => c.id) || []
  );
  const [initialCarTypeOptions, setInitialCarTypeOptions] = useState<SelectOption[]>(
    initialData?.carTypes?.map((c: any) => ({ value: c.id, label: c.name })) || []
  );

  const [partIds, setPartIds] = useState<string[]>(
    initialData?.parts?.map((p: any) => p.id) || []
  );
  const [initialPartOptions, setInitialPartOptions] = useState<SelectOption[]>(
    initialData?.parts?.map((p: any) => ({ value: p.id, label: p.name })) || []
  );

  const [faqs, setFaqs] = useState<BlogPostFAQ[]>(initialData?.faQs || []);

  // فیلدهای سئو SEO (اجباری)
  const [seoId, setSeoId] = useState(initialData?.seoInformation?.id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoInformation?.title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoInformation?.description || '');
  const [seoCanonicalUrl, setSeoCanonicalUrl] = useState(initialData?.seoInformation?.canonicalUrl || '');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setEnglishTitle(initialData.englishTitle || '');
      setBlogCategoryId(initialData.blogCategoryId || '');
      setBlogCategoryName(initialData.blogCategory?.title || '');
      setReadTime(initialData.readTime ? String(initialData.readTime) : '5');
      setSummary(initialData.summary || initialData.summarry || '');
      setDescription(initialData.description || '');
      setImageAlt(initialData.imageAlt || '');

      if (initialData.carTypes) {
        setCarTypeIds(initialData.carTypes.map((c: any) => c.id));
        setInitialCarTypeOptions(initialData.carTypes.map((c: any) => ({ value: c.id, label: c.name })));
      }

      if (initialData.parts) {
        setPartIds(initialData.parts.map((p: any) => p.id));
        setInitialPartOptions(initialData.parts.map((p: any) => ({ value: p.id, label: p.name })));
      }

      if (initialData.faQs && Array.isArray(initialData.faQs)) {
        setFaqs(initialData.faQs);
      }

      if (initialData.seoInformation) {
        setSeoId(initialData.seoInformation.id || '');
        setSeoTitle(initialData.seoInformation.title || '');
        setSeoDescription(initialData.seoInformation.description || '');
        setSeoCanonicalUrl(initialData.seoInformation.canonicalUrl || '');
      }
    }
  }, [initialData]);

  const fetchBlogCategories = async (q: string) => {
    const res = await blogService.getCategories({ title: q, pageSize: 50 });
    return (res.items || []).map((c) => ({ value: c.id, label: c.title }));
  };

  const fetchCarTypes = async (q: string) => {
    const list = await carService.getCarTypes(q);
    return list.map((t: any) => ({ value: t.id, label: t.name }));
  };

  const fetchParts = async (q: string) => {
    const res = await apiClient.get<any>('/api/A_Part/PartsName', { params: { Name: q, PageSize: 30 } });
    return (res.data.items || []).map((p: any) => ({ value: p.id, label: p.name }));
  };

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  // تابع پر کردن خودکار فیلدهای سئو با no seo
  const handleSetNoSeo = () => {
    setSeoTitle('no seo');
    setSeoDescription('no seo');
    setSeoCanonicalUrl('no seo');
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated.seoTitle;
      delete updated.seoDescription;
      delete updated.seoCanonicalUrl;
      return updated;
    });
    toast.info('مقادیر سئو روی "no seo" تنظیم شدند.');
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
    if (!title.trim()) errs.title = 'عنوان مقاله الزامی است';
    if (!englishTitle.trim()) errs.englishTitle = 'عنوان انگلیسی الزامی است';
    if (!blogCategoryId) errs.blogCategoryId = 'انتخاب دسته‌بندی بلاگ الزامی است';
    if (!summary.trim()) errs.summary = 'خلاصه مقاله الزامی است';
    if (!description.trim()) errs.description = 'متن اصلی مقاله الزامی است';
    if (!isEditMode && !imageFile) errs.image = 'تصویر شاخص مقاله الزامی است';

    // اعتبارسنجی اجباری بودن سئو
    if (!seoTitle.trim()) errs.seoTitle = 'عنوان سئو (Meta Title) الزامی است';
    if (!seoDescription.trim()) errs.seoDescription = 'توضیحات سئو (Meta Description) الزامی است';
    if (!seoCanonicalUrl.trim()) errs.seoCanonicalUrl = 'آدرس کانونیکال (Canonical URL) الزامی است';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('لطفاً تمام فیلدهای اجباری فرم و سئو را تکمیل کنید.');
      return;
    }

    const formData = new FormData();
    if (isEditMode && initialData?.id) {
      formData.append('Id', initialData.id);
    }

    formData.append('BlogCategoryId', blogCategoryId);
    formData.append('Title', title);
    formData.append('EnglishTitle', englishTitle);
    formData.append('Summary', summary);
    formData.append('Description', description);
    formData.append('ReadTime', readTime || '5');

    if (imageFile) formData.append('Image', imageFile);
    if (imageAlt) formData.append('ImageAlt', imageAlt);

    // سئو اجباری
    if (isEditMode && seoId) formData.append('SEOInformation.Id', seoId);
    formData.append('SEOInformation.Title', seoTitle.trim());
    formData.append('SEOInformation.Description', seoDescription.trim());
    formData.append('SEOInformation.CanonicalUrl', seoCanonicalUrl.trim());

    if (!isEditMode) {
      carTypeIds.forEach((id) => formData.append('CarTypeIds', id));
      partIds.forEach((id) => formData.append('PartIds', id));
      faqs.forEach((faq, index) => {
        formData.append(`FAQs[${index}].Question`, faq.question);
        formData.append(`FAQs[${index}].Answer`, faq.answer);
      });
    }

    const activeMutation = isEditMode ? updateMutation : createMutation;

    activeMutation.mutate(formData, {
      onSuccess: async (resPost: any) => {
        const postId = initialData?.id || resPost?.id || resPost;

        if (isEditMode && postId) {
          try {
            if (carTypeIds.length > 0) {
              await blogService.setPostCarTypes(postId, carTypeIds);
            }
            if (partIds.length > 0) {
              await blogService.setPostParts(postId, partIds);
            }
            const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim());
            if (validFaqs.length > 0) {
              await blogService.savePostFAQs(postId, validFaqs);
            }
          } catch (err) {
            console.error('Failed to sync secondary post relations:', err);
          }
        }

        toast.success(isEditMode ? 'مقاله با موفقیت به‌روزرسانی شد!' : 'مقاله جدید با موفقیت ایجاد شد!');
        router.push('/blogs');
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
            href="/blogs"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">
              {isEditMode ? `ویرایش مقاله: ${initialData?.title}` : 'نگارش مقاله جدید در وبلاگ'}
            </h1>
            <p className="text-xs text-neutral-400">تولید و انتشار محتوای تخصصی و مقالات آموزشی</p>
          </div>
        </div>
      </div>

      {/* ۱. اطلاعات اصلی مقاله */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm mb-2">
          <BookOpen className="h-4 w-4" />
          <span>مشخصات و شناسنامه مقاله</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="عنوان مقاله (فارسی) *"
            placeholder="مثال: راهنمای تعویض شمع موتور خودرو"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <Input
            label="عنوان انگلیسی (English Title) *"
            placeholder="spark-plug-replacement-guide"
            value={englishTitle}
            onChange={(e) => setEnglishTitle(e.target.value)}
            error={errors.englishTitle}
            dir="ltr"
          />

          <div>
            <AsyncSelect
              label="دسته‌بندی بلاگ *"
              placeholder="انتخاب دسته‌بندی..."
              value={blogCategoryId}
              initialLabel={blogCategoryName}
              onChange={setBlogCategoryId}
              fetchOptions={fetchBlogCategories}
            />
            {errors.blogCategoryId && <p className="mt-1 text-[11px] text-red-400">{errors.blogCategoryId}</p>}
          </div>

          <Input
            label="زمان تخمینی مطالعه (دقیقه)"
            type="number"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value)}
            dir="ltr"
          />

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              خلاصه مقاله (چکیده جهت نمایش در کارت‌ها و سوشال) *
            </label>
            <textarea
              rows={3}
              placeholder="خلاصه‌ای جذاب از مقاله بنویسید..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none leading-relaxed"
            />
            {errors.summary && <p className="mt-1 text-[11px] text-red-400">{errors.summary}</p>}
          </div>
        </div>
      </div>

      {/* ۲. محتوای کامل با ادیتور متنی */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
          <Sparkles className="h-4 w-4" />
          <span>محتوا و متن کامل مقاله (HTML Body) *</span>
        </div>
        <ProEditor value={description} onChange={setDescription} />
        {errors.description && <p className="text-[11px] text-red-400">{errors.description}</p>}
      </div>

      {/* ۳. تصویر شاخص و رسانه */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <MediaUploader
          label="تصویر اصلی مقاله *"
          onFileSelect={setImageFile}
          previewUrl={initialData?.imageUrl ? getMediaUrl(initialData.imageUrl) : null}
        />
        {errors.image && <p className="text-[11px] text-red-400">{errors.image}</p>}
        <Input
          label="متن جایگزین تصویر (ImageAlt) *"
          placeholder="توضیح تصویر شاخص برای سئو..."
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
        />
      </div>

      {/* ۴. ارتباط مقاله با خودروها و قطعات */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2 font-bold">
              <Car className="h-4 w-4" />
              <span>اتصال به انواع خودرو (CarTypes)</span>
            </div>
            <MultiAsyncSelect
              placeholder="جستجو و انتخاب انواع خودرو..."
              selectedValues={carTypeIds}
              initialOptions={initialCarTypeOptions}
              onChange={setCarTypeIds}
              fetchOptions={fetchCarTypes}
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 mb-2 font-bold">
              <Cpu className="h-4 w-4" />
              <span>اتصال به قطعات پایه (Parts)</span>
            </div>
            <MultiAsyncSelect
              placeholder="جستجو و انتخاب قطعات..."
              selectedValues={partIds}
              initialOptions={initialPartOptions}
              onChange={setPartIds}
              fetchOptions={fetchParts}
            />
          </div>
        </div>
      </div>

      {/* ۵. سوالات متداول (FAQs) */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <HelpCircle className="h-4 w-4" />
            <span>سوالات متداول مقاله (FAQ Schema)</span>
          </div>
          <button
            type="button"
            onClick={handleAddFaq}
            className="flex items-center gap-1.5 rounded-xl bg-neutral-800 px-3 py-1.5 text-xs font-bold text-amber-400 hover:bg-neutral-700 transition-all"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>افزودن پرسش و پاسخ</span>
          </button>
        </div>

        {faqs.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-4">هیچ پرسش و پاسخی ثبت نشده است.</p>
        ) : (
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 relative group">
                <button
                  type="button"
                  onClick={() => handleRemoveFaq(index)}
                  className="absolute top-3 left-3 text-neutral-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <Input
                  label={`پرسش ${index + 1}`}
                  placeholder="عنوان سوال متداول..."
                  value={faq.question}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                />
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">پاسخ پرسش</label>
                  <textarea
                    rows={2}
                    placeholder="پاسخ کوتاه و شفاف..."
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-2.5 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ۶. تنظیمات سئو (اجباری) و دکمه عدم نیاز به سئو */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
              <Globe className="h-4 w-4" />
              <span>تنظیمات سئو (SEO Information) *</span>
            </div>

            {/* دکمه عدم نیاز به سئو */}
            <button
              type="button"
              onClick={handleSetNoSeo}
              className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"
              title="پر کردن تمام فیلدهای سئو با no seo"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>عدم نیاز به سئو</span>
            </button>
          </div>

          <Input
            label="عنوان سئو (Meta Title) *"
            placeholder="عنوان جذاب برای موتورهای جستجو..."
            value={seoTitle}
            onChange={(e) => {
              setSeoTitle(e.target.value);
              if (errors.seoTitle) setErrors((prev) => ({ ...prev, seoTitle: '' }));
            }}
            error={errors.seoTitle}
          />

          <Input
            label="توضیحات سئو (Meta Description) *"
            placeholder="توضیحات خلاصه جهت نمایش در گوگل..."
            value={seoDescription}
            onChange={(e) => {
              setSeoDescription(e.target.value);
              if (errors.seoDescription) setErrors((prev) => ({ ...prev, seoDescription: '' }));
            }}
            error={errors.seoDescription}
          />

          <Input
            label="آدرس کانونیکال (Canonical URL) *"
            placeholder="spark-plug-guide"
            value={seoCanonicalUrl}
            onChange={(e) => {
              setSeoCanonicalUrl(e.target.value);
              if (errors.seoCanonicalUrl) setErrors((prev) => ({ ...prev, seoCanonicalUrl: '' }));
            }}
            error={errors.seoCanonicalUrl}
            dir="ltr"
          />
        </div>

        <SEOPreview
          title={seoTitle || title}
          description={seoDescription || summary}
          canonicalUrl={seoCanonicalUrl || englishTitle.toLowerCase().replace(/\s+/g, '-')}
        />
      </div>

      {/* نوار چسبان پایین صفحه */}
      <div className="sticky bottom-4 z-40 flex items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => router.push('/blogs')}
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
              <span>{isEditMode ? 'ذخیره تغییرات مقاله (Ctrl+S)' : 'ذخیره و ایجاد مقاله (Ctrl+S)'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}