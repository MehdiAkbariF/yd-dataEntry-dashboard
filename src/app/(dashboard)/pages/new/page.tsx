// src/app/(dashboard)/pages/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CodePageEditor } from '@/features/page-builder/components/CodePageEditor';
import { useCreatePage } from '@/features/page-builder/hooks/usePageMutations';
import { usePageCategories } from '@/features/page-builder/hooks/usePages';

const ROUTES = { LIST: '/pages', EDIT: (id: string) => `/pages/${id}/edit` };

export default function NewPageEditor() {
  const router = useRouter();
  const createPage = useCreatePage();
  const { data: categories = [] } = usePageCategories();

  const [meta, setMeta] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
    categoryId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generateSlug = (input: string) =>
    input
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-');

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
        content,
      },
      categoryId: meta.categoryId,
    });
    toast.success('صفحه ایجاد شد');
    if (result?.meta?.id) {
      router.push(ROUTES.EDIT(result.meta.id));
    } else {
      router.push(ROUTES.LIST);
    }
  };

  return (
    <div className="h-screen flex flex-col" dir="rtl">
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

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <CodePageEditor
          onSave={handleSave}
          isSaving={createPage.isPending}
          headerTitle="ساخت صفحه جدید"
          onBack={() => router.push(ROUTES.LIST)}
        />
      </div>
    </div>
  );
}