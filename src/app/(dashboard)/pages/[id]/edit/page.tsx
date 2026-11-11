// src/app/(dashboard)/pages/[id]/edit/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CodePageEditor } from '@/features/page-builder/components/CodePageEditor';
import { useUpdatePage } from '@/features/page-builder/hooks/usePageMutations';
import { usePageDetails, usePageCategories } from '@/features/page-builder/hooks/usePages';

const ROUTES = { LIST: '/pages' };

export default function EditPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: pageData, isLoading, isError } = usePageDetails(id);
  const { data: categories = [] } = usePageCategories();
  const updatePage = useUpdatePage();

  const [meta, setMeta] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (pageData?.meta) {
      setMeta({
        title: pageData.meta.title || '',
        slug: pageData.meta.slug || '',
        seoTitle: pageData.meta.seo?.metaTitle || '',
        seoDescription: pageData.meta.seo?.metaDescription || '',
        canonicalUrl: pageData.meta.seo?.canonicalUrl || '',
        // اگر API ساختار متفاوتی دارد (مثلاً pageData.meta.category?.id)
        // فقط همین خط را مطابق آن تغییر دهید:
        categoryId:
          (pageData.meta as any).categoryId ||
          (pageData.meta as any).category?.id ||
          '',
      });
    }
  }, [pageData]);

  const generateSlug = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!meta.title.trim()) errs.title = 'عنوان الزامی است';
    if (!meta.slug.trim()) errs.slug = 'آدرس (slug) الزامی است';
    if (!meta.categoryId) errs.categoryId = 'دسته‌بندی الزامی است';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(meta.slug)) {
      errs.slug = 'آدرس باید فقط شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (content: { html: string; css: string }) => {
    if (!validate()) {
      toast.error('لطفاً فیلدهای اجباری را تکمیل کنید');
      throw new Error('validation failed');
    }

    await updatePage.mutateAsync({
      id,
      // اگر useUpdatePage شما مثل useCreatePage ساختار
      // { request, categoryId } می‌گیرد، اینجا هم همان را بگذارید.
      request: {
        meta: {
          title: meta.title,
          slug: meta.slug,
          englishTitle: meta.slug,
          seo: {
            metaTitle: meta.seoTitle || meta.title,
            metaDescription: meta.seoDescription || meta.title,
            canonicalUrl: meta.canonicalUrl || `/page/${meta.slug}`,
          },
        },
        content,
      },
      categoryId: meta.categoryId,
    } as any);

    toast.success('تغییرات ذخیره شد');
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-neutral-950">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <span className="text-sm text-neutral-400">
          در حال دریافت اطلاعات صفحه...
        </span>
      </div>
    );
  }

  if (isError || !pageData) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3 bg-neutral-950">
        <span className="text-sm font-bold text-red-400">
          صفحه مورد نظر یافت نشد
        </span>
        <button
          onClick={() => router.push(ROUTES.LIST)}
          className="text-xs text-amber-500 hover:underline"
        >
          بازگشت به لیست
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      {/* Meta Panel */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 p-4 shrink-0">
        {/* ردیف اول: عنوان، slug، دسته‌بندی */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              عنوان صفحه *
            </label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => {
                setMeta({ ...meta, title: e.target.value });
                setErrors((er) => ({ ...er, title: '' }));
              }}
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
            {errors.title && (
              <p className="mt-1 text-[10px] text-red-400">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              آدرس (slug) *
            </label>
            <div className="flex items-center">
              <span
                className="text-[11px] text-neutral-500 pl-2 font-mono"
                dir="ltr"
              >
                /page/
              </span>
              <input
                type="text"
                value={meta.slug}
                onChange={(e) => {
                  setMeta({ ...meta, slug: generateSlug(e.target.value) });
                  setErrors((er) => ({ ...er, slug: '' }));
                }}
                placeholder="about-us"
                dir="ltr"
                className="flex-1 h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
              />
            </div>
            {errors.slug && (
              <p className="mt-1 text-[10px] text-red-400">{errors.slug}</p>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              دسته‌بندی *
            </label>
            <select
              value={meta.categoryId}
              onChange={(e) => {
                setMeta({ ...meta, categoryId: e.target.value });
                setErrors((er) => ({ ...er, categoryId: '' }));
              }}
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-[10px] text-red-400">
                {errors.categoryId}
              </p>
            )}
          </div>
        </div>

        {/* ردیف دوم: SEO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto mt-4">
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              عنوان SEO
            </label>
            <input
              type="text"
              value={meta.seoTitle}
              onChange={(e) =>
                setMeta({ ...meta, seoTitle: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              توضیحات SEO
            </label>
            <input
              type="text"
              value={meta.seoDescription}
              onChange={(e) =>
                setMeta({ ...meta, seoDescription: e.target.value })
              }
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              Canonical URL
            </label>
            <input
              type="text"
              value={meta.canonicalUrl}
              onChange={(e) =>
                setMeta({ ...meta, canonicalUrl: e.target.value })
              }
              dir="ltr"
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <CodePageEditor
          initialHtml={pageData.content.html}
          initialCss={pageData.content.css}
          onSave={handleSave}
          isSaving={updatePage.isPending}
          headerTitle={`ویرایش: ${pageData.meta.title}`}
          onBack={() => router.push(ROUTES.LIST)}
          headerActions={
            <a
              href={`https://www.yadakchi.com/page/${pageData.meta.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>مشاهده در سایت</span>
            </a>
          }
        />
      </div>
    </div>
  );
}