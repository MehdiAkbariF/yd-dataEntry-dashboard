// src/app/(dashboard)/pages/[id]/edit/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { CodePageEditor } from '@/features/page-builder/components/CodePageEditor';
import { useUpdatePage } from '@/features/page-builder/hooks/usePageMutations';
import { usePageDetails } from '@/features/page-builder/hooks/usePages';

const ROUTES = { LIST: '/pages' };

export default function EditPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: pageData, isLoading, isError } = usePageDetails(id);
  const updatePage = useUpdatePage();

  const [meta, setMeta] = useState({
    title: '',
    slug: '',
    seoTitle: '',
    seoDescription: '',
    canonicalUrl: '',
  });

  useEffect(() => {
    if (pageData?.meta) {
      setMeta({
        title: pageData.meta.title || '',
        slug: pageData.meta.slug || '',
        seoTitle: pageData.meta.seo?.metaTitle || '',
        seoDescription: pageData.meta.seo?.metaDescription || '',
        canonicalUrl: pageData.meta.seo?.canonicalUrl || '',
      });
    }
  }, [pageData]);

  const handleSave = async (content: { html: string; css: string }) => {
    await updatePage.mutateAsync({
      id,
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
    });
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
          <div>
            <label className="block text-[11px] font-medium text-neutral-300 mb-1.5">
              عنوان صفحه
            </label>
            <input
              type="text"
              value={meta.title}
              onChange={(e) => setMeta({ ...meta, title: e.target.value })}
              className="w-full h-10 rounded-xl border border-neutral-800 bg-neutral-950 px-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
            />
          </div>
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