'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetPartCategories, useDeletePartCategory } from '@/features/part-categories/hooks/usePartCategories';
import PartCategoryTable from '@/features/part-categories/components/PartCategoryTable';
import PartCategoryFilterBar from '@/features/part-categories/components/PartCategoryFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function PartCategoriesPage() {
  // ⚠️ استفاده از استور ماندگار فیلترهای دسته‌بندی قطعات
  const { partCategoryFilters, setPartCategoryFilter, resetPartCategoryFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // فراخوانی API با فیلترهای پایدار
  const { data, isLoading } = useGetPartCategories({
    pageNumber: partCategoryFilters.page,
    pageSize: 20,
    name: partCategoryFilters.name || undefined,
    englishTitle: partCategoryFilters.englishTitle || undefined,
    parent: partCategoryFilters.parent || undefined,
    thumbnailAlt: partCategoryFilters.thumbnailAlt || undefined,
    creatorId: partCategoryFilters.creatorId || undefined,
    updaterId: partCategoryFilters.updaterId || undefined,
    isActive: partCategoryFilters.isActive === '' ? undefined : partCategoryFilters.isActive === 'true',
  });

  const deleteMutation = useDeletePartCategory();

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت دسته‌بندی قطعات</h1>
            <p className="text-xs text-neutral-400">دسته‌بندی‌ها و زیرمجموعه‌های ساختار قطعات فروشگاه</p>
          </div>
        </div>

        <Link
          href="/parts/categories/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف دسته‌بندی جدید</span>
        </Link>
      </div>

      {/* نوار فیلتر متصل به استور ماندگار */}
      <PartCategoryFilterBar
        name={partCategoryFilters.name}
        setName={(val) => setPartCategoryFilter('name', val)}
        englishTitle={partCategoryFilters.englishTitle}
        setEnglishTitle={(val) => setPartCategoryFilter('englishTitle', val)}
        parent={partCategoryFilters.parent}
        setParent={(val) => setPartCategoryFilter('parent', val)}
        thumbnailAlt={partCategoryFilters.thumbnailAlt}
        setThumbnailAlt={(val) => setPartCategoryFilter('thumbnailAlt', val)}
        creatorId={partCategoryFilters.creatorId}
        setCreatorId={(val) => setPartCategoryFilter('creatorId', val)}
        updaterId={partCategoryFilters.updaterId}
        setUpdaterId={(val) => setPartCategoryFilter('updaterId', val)}
        isActive={partCategoryFilters.isActive}
        setIsActive={(val) => setPartCategoryFilter('isActive', val)}
        onReset={resetPartCategoryFilters}
      />

      {/* جدول دسته‌بندی‌ها */}
      <PartCategoryTable
        categories={data?.items || []}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPartCategoryFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف دسته‌بندی"
        description="آیا از حذف این دسته‌بندی اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}