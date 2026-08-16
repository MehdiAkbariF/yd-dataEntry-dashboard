'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetParts, useTogglePartStatus, useDeletePart } from '@/features/parts/hooks/useParts';
import PartTable from '@/features/parts/components/PartTable';
import PartFilterBar from '@/features/parts/components/PartFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export default function PartsPage() {
  // ⚠️ استفاده از استور ماندگار فیلترهای قطعات
  const { partFilters, setPartFilter, resetPartFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // فراخوانی API قطعات با فیلترهای پایدار
  const { data, isLoading } = useGetParts({
    pageNumber: partFilters.page,
    pageSize: 20,
    name: partFilters.name || undefined,
    englishTitle: partFilters.englishTitle || undefined,
    description: partFilters.description || undefined,
    partCategoryId: partFilters.partCategoryId || undefined,
    creatorId: partFilters.creatorId || undefined,
    updaterId: partFilters.updaterId || undefined,
    hasSeo: partFilters.hasSeo === '' ? undefined : partFilters.hasSeo === 'true',
    hasDescription: partFilters.hasDescription === '' ? undefined : (partFilters.hasDescription as any),
    isActive: partFilters.isActive === '' ? undefined : partFilters.isActive === 'true',
  });

  const toggleMutation = useTogglePartStatus();
  const deleteMutation = useDeletePart();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    toggleMutation.mutate(
      { id, isActive: !currentStatus },
      {
        onSuccess: () => toast.success('وضعیت قطعه به‌روزرسانی شد.'),
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('قطعه با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت قطعات پایه (Part)</h1>
            <p className="text-xs text-neutral-400">تعریف و مدیریت انواع قطعات و دسته‌بندی‌های استاندارد</p>
          </div>
        </div>

        <Link
          href="/parts/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف قطعه جدید</span>
        </Link>
      </div>

      {/* نوار فیلتر متصل به استور ماندگار */}
      <PartFilterBar
        name={partFilters.name}
        setName={(val) => setPartFilter('name', val)}
        englishTitle={partFilters.englishTitle}
        setEnglishTitle={(val) => setPartFilter('englishTitle', val)}
        description={partFilters.description}
        setDescription={(val) => setPartFilter('description', val)}
        partCategoryId={partFilters.partCategoryId}
        setPartCategoryId={(val) => setPartFilter('partCategoryId', val)}
        creatorId={partFilters.creatorId}
        setCreatorId={(val) => setPartFilter('creatorId', val)}
        updaterId={partFilters.updaterId}
        setUpdaterId={(val) => setPartFilter('updaterId', val)}
        hasSeo={partFilters.hasSeo}
        setHasSeo={(val) => setPartFilter('hasSeo', val)}
        hasDescription={partFilters.hasDescription}
        setHasDescription={(val) => setPartFilter('hasDescription', val)}
        isActive={partFilters.isActive}
        setIsActive={(val) => setPartFilter('isActive', val)}
        onReset={resetPartFilters}
      />

      {/* جدول قطعات */}
      <PartTable
        parts={data?.items || []}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDelete={(id) => setDeleteId(id)}
        isTogglingId={togglingId}
      />

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPartFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف قطعه"
        description="آیا از حذف این قطعه پایه اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}