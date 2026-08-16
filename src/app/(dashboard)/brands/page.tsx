'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetBrands, useConfirmBrand, useDeleteBrand } from '@/features/brands/hooks/useBrands';
import BrandTable from '@/features/brands/components/BrandTable';
import BrandFilterBar from '@/features/brands/components/BrandFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandsPage() {
  // ⚠️ استفاده از استور ماندگار فیلترهای برند
  const { brandFilters, setBrandFilter, resetBrandFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // فراخوانی API برندها با فیلترهای پایدار
  const { data, isLoading } = useGetBrands({
    pageNumber: brandFilters.page,
    pageSize: 20,
    name: brandFilters.name || undefined,
    englishTitle: brandFilters.englishTitle || undefined,
    creatorId: brandFilters.creatorId || undefined,
    isInMain: brandFilters.isInMain === '' ? undefined : brandFilters.isInMain === 'true',
    isConfirmed: brandFilters.isConfirmed === '' ? undefined : brandFilters.isConfirmed === 'true',
    isActive: brandFilters.isActive === '' ? undefined : brandFilters.isActive === 'true',
  });

  const confirmMutation = useConfirmBrand();
  const deleteMutation = useDeleteBrand();

  const handleConfirmToggle = (id: string, currentConfirmed: boolean | null) => {
    setConfirmingId(id);
    confirmMutation.mutate(
      { id, isConfirmed: !currentConfirmed },
      {
        onSuccess: () => toast.success('وضعیت تایید برند تغییر یافت.'),
        onSettled: () => setConfirmingId(null),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('برند با موفقیت حذف شد.');
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
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت برندها (Brands)</h1>
            <p className="text-xs text-neutral-400">ثبت و مدیریت برندها و تولیدکنندگان قطعات</p>
          </div>
        </div>

        <Link
          href="/brands/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>افزودن برند جدید</span>
        </Link>
      </div>

      {/* نوار فیلتر متصل به استور ماندگار */}
      <BrandFilterBar
        name={brandFilters.name}
        setName={(val) => setBrandFilter('name', val)}
        englishTitle={brandFilters.englishTitle}
        setEnglishTitle={(val) => setBrandFilter('englishTitle', val)}
        creatorId={brandFilters.creatorId}
        setCreatorId={(val) => setBrandFilter('creatorId', val)}
        isInMain={brandFilters.isInMain}
        setIsInMain={(val) => setBrandFilter('isInMain', val)}
        isConfirmed={brandFilters.isConfirmed}
        setIsConfirmed={(val) => setBrandFilter('isConfirmed', val)}
        isActive={brandFilters.isActive}
        setIsActive={(val) => setBrandFilter('isActive', val)}
        onReset={resetBrandFilters}
      />

      {/* جدول نمایش برندها */}
      <BrandTable
        brands={data?.items || []}
        isLoading={isLoading}
        onConfirmToggle={handleConfirmToggle}
        onDelete={(id) => setDeleteId(id)}
        confirmingId={confirmingId}
      />

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setBrandFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف برند"
        description="آیا از حذف این برند اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}