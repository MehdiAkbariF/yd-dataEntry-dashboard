// src/app/(dashboard)/pages/page.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus,
  FileText,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Search,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePagesList } from '@/features/page-builder/hooks/usePages';
import { useDeletePage } from '@/features/page-builder/hooks/usePageMutations';
import { PAGE_BUILDER_CONSTANTS } from '@/features/page-builder/constants/pageBuilder.constants';

export default function PagesListPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const { data: pages = [], isLoading } = usePagesList({
    title: search,
    pageNumber: 1,
    pageSize: 100,
  });
  const deleteMutation = useDeletePage();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`آیا از حذف صفحه «${title}» مطمئن هستید؟`)) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('صفحه با موفقیت حذف شد');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'خطا در حذف صفحه');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24" dir="rtl">
      {/* هدر */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">صفحات استاتیک</h1>
            <p className="text-xs text-neutral-400">
              مدیریت صفحاتی که در فوتر سایت نمایش داده می‌شوند
            </p>
          </div>
        </div>

        <Link
          href={PAGE_BUILDER_CONSTANTS.ROUTES.NEW}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>صفحه جدید</span>
        </Link>
      </div>

      {/* جستجو */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
        <input
          type="text"
          placeholder="جستجو در عنوان صفحات..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-11 pr-10 pl-4 rounded-xl border border-neutral-800 bg-neutral-900 text-white placeholder:text-neutral-500 text-sm focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50"
        />
      </div>

      {/* لیست */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
          <span className="text-sm">در حال دریافت لیست صفحات...</span>
        </div>
      ) : pages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center border border-dashed border-neutral-800 rounded-2xl">
          <FileText className="h-12 w-12 text-neutral-600" />
          <span className="text-sm font-bold text-neutral-400">
            هیچ صفحه‌ای یافت نشد
          </span>
          <p className="text-xs text-neutral-500 max-w-sm">
            با کلیک روی دکمه «صفحه جدید» اولین صفحه استاتیک خود را بسازید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pages.map((page) => (
            <div
              key={page.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 hover:border-amber-500/30 transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">
                    {page.title}
                  </h3>
                  <p
                    className="text-[11px] text-neutral-500 mt-1 font-mono"
                    dir="ltr"
                  >
                    /page/{page.slug}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    page.status === 'published'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}
                >
                  {page.status === 'published' ? 'منتشر شده' : 'پیش‌نویس'}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-neutral-800">
                <button
                  onClick={() =>
                    router.push(PAGE_BUILDER_CONSTANTS.ROUTES.EDIT(page.id))
                  }
                  className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-amber-500 text-black text-xs font-bold hover:bg-amber-400 transition-all"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>ویرایش</span>
                </button>

                <a
                  href={`https://www.yadakchi.com/page/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all"
                  title="مشاهده در سایت"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>

                <button
                  onClick={() => handleDelete(page.id, page.title)}
                  disabled={deleteMutation.isPending}
                  className="flex items-center justify-center w-9 h-9 rounded-xl border border-neutral-800 text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all disabled:opacity-50"
                  title="حذف"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}