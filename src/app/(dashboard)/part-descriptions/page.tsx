'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useGetPartCarDescriptions,
  useGetCarTypePartDescriptions,
  useTogglePartCarDescriptionStatus,
  useDeletePartCarDescription,
} from '@/features/part-descriptions/hooks/usePartDescriptions';
import { partDescriptionService } from '@/services/partDescriptionService';
import PartCarDescriptionTable from '@/features/part-descriptions/components/PartCarDescriptionTable';
import CarTypePartDescriptionTable from '@/features/part-descriptions/components/CarTypePartDescriptionTable';
import PartDescriptionFilterBar from '@/features/part-descriptions/components/PartDescriptionFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, FileText, Car, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function PartDescriptionsPage() {
  // ⚠️ استفاده از استور ماندگار فیلترها و تب‌ها
  const { partDescriptionFilters, setPartDescriptionFilter, resetPartDescriptionFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // لیست توضیحات مدل خودرو (Tab 1)
  const { data: carData, isLoading: isCarLoading } = useGetPartCarDescriptions({
    pageNumber: partDescriptionFilters.page,
    pageSize: 20,
    searchedValue: partDescriptionFilters.searchedValue || undefined,
    partId: partDescriptionFilters.partId || undefined,
    creatorId: partDescriptionFilters.creatorId || undefined,
    isActive: partDescriptionFilters.isActive === '' ? undefined : partDescriptionFilters.isActive === 'true',
  });

  // لیست توضیحات نوع خودرو (Tab 2)
  const { data: carTypeData, isLoading: isCarTypeLoading } = useGetCarTypePartDescriptions({
    pageNumber: partDescriptionFilters.page,
    pageSize: 20,
    searchedValue: partDescriptionFilters.searchedValue || undefined,
    partId: partDescriptionFilters.partId || undefined,
    creatorId: partDescriptionFilters.creatorId || undefined,
    isActive: partDescriptionFilters.isActive === '' ? undefined : partDescriptionFilters.isActive === 'true',
  });

  const toggleMutation = useTogglePartCarDescriptionStatus();
  const deleteMutation = useDeletePartCarDescription();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    if (partDescriptionFilters.activeTab === 'car') {
      toggleMutation.mutate(
        { id, isActive: !currentStatus },
        {
          onSuccess: () => toast.success('وضعیت نمایش تغییر یافت.'),
          onSettled: () => setTogglingId(null),
        }
      );
    } else {
      partDescriptionService.toggleCarTypePartDescriptionStatus(id, !currentStatus)
        .then(() => toast.success('وضعیت نمایش تغییر یافت.'))
        .finally(() => setTogglingId(null));
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    if (partDescriptionFilters.activeTab === 'car') {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          toast.success('توضیحات با موفقیت حذف شد.');
          setDeleteId(null);
        },
      });
    } else {
      partDescriptionService.deleteCarTypePartDescription(deleteId)
        .then(() => {
          toast.success('توضیحات با موفقیت حذف شد.');
          setDeleteId(null);
        });
    }
  };

  const currentData = partDescriptionFilters.activeTab === 'car' ? carData : carTypeData;

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">توضیحات تخصصی قطعه-خودرو</h1>
            <p className="text-xs text-neutral-400">مدیریت توضیحات اختصاصی برای ترکیب قطعات و مدل‌ها یا انواع خودرو</p>
          </div>
        </div>

        <Link
          href={`/part-descriptions/new?type=${partDescriptionFilters.activeTab}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>ثبت توضیحات جدید ({partDescriptionFilters.activeTab === 'car' ? 'مدل خودرو' : 'نوع خودرو'})</span>
        </Link>
      </div>

      {/* سوییچر تب‌ها متصل به استور ماندگار */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
        <button
          onClick={() => setPartDescriptionFilter('activeTab', 'car')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            partDescriptionFilters.activeTab === 'car'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Car className="h-4 w-4" />
          <span>توضیحات مدل‌های خودرو (PartCarDescription)</span>
        </button>

        <button
          onClick={() => setPartDescriptionFilter('activeTab', 'carType')}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            partDescriptionFilters.activeTab === 'carType'
              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
              : 'text-neutral-400 hover:bg-neutral-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>توضیحات نوع خودرو (CarTypePartDescription)</span>
        </button>
      </div>

      {/* نوار فیلتر متصل به استور ماندگار */}
      <PartDescriptionFilterBar
        searchedValue={partDescriptionFilters.searchedValue}
        setSearchedValue={(val) => setPartDescriptionFilter('searchedValue', val)}
        partId={partDescriptionFilters.partId}
        setPartId={(val) => setPartDescriptionFilter('partId', val)}
        creatorId={partDescriptionFilters.creatorId}
        setCreatorId={(val) => setPartDescriptionFilter('creatorId', val)}
        isActive={partDescriptionFilters.isActive}
        setIsActive={(val) => setPartDescriptionFilter('isActive', val)}
        onReset={resetPartDescriptionFilters}
      />

      {/* نمایش جدول بر اساس تب فعال */}
      {partDescriptionFilters.activeTab === 'car' ? (
        <PartCarDescriptionTable
          items={carData?.items || []}
          isLoading={isCarLoading}
          onToggleStatus={handleToggleStatus}
          onDelete={(id) => setDeleteId(id)}
          isTogglingId={togglingId}
        />
      ) : (
        <CarTypePartDescriptionTable
          items={carTypeData?.items || []}
          isLoading={isCarTypeLoading}
          onToggleStatus={handleToggleStatus}
          onDelete={(id) => setDeleteId(id)}
          isTogglingId={togglingId}
        />
      )}

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {currentData && (
        <Pagination
          currentPage={currentData.currentPage}
          totalPages={currentData.totalPages}
          onPageChange={(newPage) => setPartDescriptionFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف توضیحات تخصصی"
        description="آیا از حذف این توضیحات اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}