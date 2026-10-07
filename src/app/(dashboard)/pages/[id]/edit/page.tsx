// src/app/(dashboard)/pages/[id]/edit/page.tsx

'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ArrowRight, Loader2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { PageBuilderEditor } from '@/features/page-builder/components/PageBuilderEditor';
import { useUpdatePage } from '@/features/page-builder/hooks/usePageMutations';
import { usePageDetails } from '@/features/page-builder/hooks/usePages';
import { PAGE_BUILDER_CONSTANTS } from '@/features/page-builder/constants/pageBuilder.constants';

interface PageMetaForm {
  title: string;
  slug: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

export default function EditPageEditor() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { data: pageData, isLoading, isError } = usePageDetails(id);
  const updatePage = useUpdatePage();

  const [meta, setMeta] = useState<PageMetaForm>({
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

  const handlePublish = async (data: any) => {
    try {
      await updatePage.mutateAsync({
        id,
        meta: {
          title: meta.title,
          slug: meta.slug,
          englishTitle: meta.slug,
          url: `/page/${meta.slug}`,
          seo: {
            metaTitle: meta.seoTitle || meta.title,
            metaDescription: meta.seoDescription || meta.title,
            canonicalUrl: meta.canonicalUrl || `/page/${meta.slug}`,
          },
        },
        schema: data,
      });
      toast.success('صفحه با موفقیت به‌روزرسانی شد');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'خطا در ذخیره تغییرات');
    }
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
          onClick={() => router.push(PAGE_BUILDER_CONSTANTS.ROUTES.LIST)}
          className="text-xs text-amber-500 hover:underline"
        >
          بازگشت به لیست صفحات
        </button>
      </div>
    );
  }

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
          <h1 className="text-sm font-bold text-white">
            ویرایش: {pageData.meta.title}
          </h1>
          <span className="text-[10px] text-neutral-500 font-mono" dir="ltr">
            /page/{pageData.meta.slug}
          </span>
        </div>

        <div className="flex-1" />

        <a
          href={`https://www.yadakchi.com/page/${pageData.meta.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white text-xs transition-all"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span>مشاهده در سایت</span>
        </a>

        {updatePage.isPending && (
          <div className="flex items-center gap-2 text-xs text-amber-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>در حال ذخیره...</span>
          </div>
        )}
      </div>

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
            <input              type="text"
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
          data={pageData.schema as any}
          onPublish={handlePublish}
        />
      </div>
    </div>
  );
}