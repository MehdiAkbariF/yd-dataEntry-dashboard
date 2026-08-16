'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetPartCategoryById, useDeletePartCategory } from '@/features/part-categories/hooks/usePartCategories';
import SEOPreview from '@/components/common/SEOPreview';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import { ArrowRight, Edit, Trash2, Layers, Sparkles, Loader2 } from 'lucide-react';

// دریافت BASE_URL از env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

export default function ViewPartCategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: category, isLoading, isError } = useGetPartCategoryById(categoryId);
  const deleteMutation = useDeletePartCategory();

  // استفاده از BASE_URL به جای هاردکد
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">دسته‌بندی یافت نشد.</span>
      </div>
    );
  }

  const thumbnailUrl = getImageUrl(category.thumbnail);
  const iconUrl = getImageUrl(category.icon);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/parts/categories"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{category.name}</h1>
              <Badge variant={category.isActive ? 'success' : 'danger'} size="sm">
                {category.isActive ? 'فعال' : 'غیرفعال'}
              </Badge>
            </div>
            <p className="text-xs text-amber-500 font-mono mt-0.5 dir-ltr text-right">
              {category.englishTitle || '---'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/parts/categories/edit/${category.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>ویرایش</span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
          {thumbnailUrl ? (
            <Image src={thumbnailUrl} alt={category.name} fill className="object-contain p-2" unoptimized />
          ) : (
            <Layers className="h-16 w-16 text-amber-500/50" />
          )}
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-amber-500">مشخصات اصلی</h3>
          <div className="space-y-3 text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">دسته‌بندی والد:</span>
              <span className="font-bold">{category.parent?.name || 'دسته‌بندی اصلی'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">نمایش در صفحه اصلی:</span>
              <span className="font-bold">{category.isInMain ? 'بله' : 'خیر'}</span>
            </div>
          </div>
        </div>
      </div>

      {category.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>توضیحات کامل دسته‌بندی</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: category.description }}
          />
        </div>
      )}

      <SEOPreview
        title={category.seoInformation?.title || category.name}
        description={category.seoInformation?.description}
        canonicalUrl={category.seoInformation?.canonicalUrl || category.name.toLowerCase().replace(/\s+/g, '-')}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف دسته‌بندی"
        description="آیا از حذف این دسته‌بندی اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(categoryId)}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}