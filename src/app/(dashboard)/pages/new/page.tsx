// src/app/(dashboard)/pages/new/page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PageBuilderEditor } from '@/features/page-builder/components/PageBuilderEditor';
import { useCreatePage } from '@/features/page-builder/hooks/usePageMutations';
import { usePageCategories } from '@/features/page-builder/hooks/usePages';
import { PAGE_BUILDER_CONSTANTS } from '@/features/page-builder/constants/pageBuilder.constants';

interface PageMetaForm {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  categoryId: string;
}

const EMPTY_SCHEMA = {
  content: [],
  root: {
    props: {
      title: 'صفحه جدید',
      backgroundColor: '',
      maxWidth: 'lg',
    },
  },
};

export default function NewPageEditor() {
  const router = useRouter();
  const createPage = useCreatePage();
  const { data: categories = [] } = usePageCategories();

  const [meta, setMeta] = useState<PageMetaForm>({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (input: string): string => {
    return input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');
  };

  const handleTitleChange = (value: string) => {
    setMeta((m) => ({
      ...m,
      title: value,
      slug: m.slug === '' ? generateSlug(value) : m.slug,
    }));
    setErrors((e) => ({ ...e, title: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!meta.title.trim()) errs.title = 'عنوان صفحه الزامی است';
    if (!meta.slug.trim()) errs.slug = 'آدرس (slug) الزامی است';
    if (!meta.categoryId) errs.categoryId = 'دسته‌بندی صفحه الزامی است';
    if (!PAGE_BUILDER_CONSTANTS.SLUG_PATTERN.test(meta.slug)) {
      errs.slug =
        'آدرس باید فقط شامل حروف انگلیسی کوچک، اعداد و خط تیره باشد';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePublish = async (data: any) => {
    if (!validate()) {
      toast.error('لطفاً فیلدهای اجباری فرم را تکمیل کنید');
      return;
    }

    try {
      const result = await createPage.mutateAsync({
        request: {
          meta: {
            slug: meta.slug,
            title: meta.title,
            englishTitle: meta.slug,
            seo: {
              metaTitle: meta.seoTitle || meta.title,
              metaDescription: meta.seoDescription || meta.title,
              canonicalUrl: meta.canonicalUrl || `/page/${meta.slug}`,
            },
          },
          schema: data,
        },
        categoryId: meta.categoryId,
      });

      toast.success('صفحه با موفقیت ایجاد شد');
      if (result?.meta?.id) {
        router.push(PAGE_BUILDER_CONSTANTS.ROUTES.EDIT(result.meta.id));
      } else {
        router.push(PAGE_BUILDER_CONSTANTS.ROUTES.LIST);
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'خطا در ذخیره صفحه');
    }
  };

  return (
    <div className="h-screen flex flex-col" dir="rtl">
      {/* Top Bar */}
      <div className="border-b border-neutral-800 p-4 bg-neutral-900 flex items-center gap-4 flex-wrap shrink-0">
        <button
          type="button"
          onClick={() => router.push(PAGE_BUILDER_CONSTANTS.ROUTES.LIST)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white transition-all"
        >
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-white">ساخت صفحه جدید</h1>
        </div>

        <div className="flex-1" />

        {createPage.isPending && (
          <div className="flex items-center gap-2 text-xs text-amber-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>در حال ذخیره...</span>
          </div>
        )}
      </div>

      {/* Meta Panel */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 p-4 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              عنوان صفحه *
            </label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="مثال: درباره ما"
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
                onChange={(e) =>
                  setMeta({ ...meta, slug: generateSlug(e.target.value) })
                }
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
              onChange={(e) =>
                setMeta({ ...meta, categoryId: e.target.value })
              }
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
              placeholder="در صورت خالی بودن، از عنوان صفحه استفاده می‌شود"
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

      {/* Puck Editor */}
      <div className="flex-1 overflow-hidden bg-neutral-950">
        <PageBuilderEditor
          data={EMPTY_SCHEMA as any}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}