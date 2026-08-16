'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetCars, useDeleteCar } from '@/features/cars/hooks/useCars';
import CarTable from '@/features/cars/components/CarTable';
import CarFilterBar from '@/features/cars/components/CarFilterBar';
import CarSubNav from '@/features/cars/components/CarSubNav';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Car } from 'lucide-react';
import { toast } from 'sonner';

export default function CarsPage() {
  // ⚠️ استفاده از استور ماندگار فیلترهای خودروها
  const { carFilters, setCarFilter, resetCarFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // فراخوانی API خودروها با فیلترهای ماندگار
  const { data, isLoading } = useGetCars({
    pageNumber: carFilters.page,
    pageSize: 20,
    model: carFilters.model || undefined,
    englishTitle: carFilters.englishTitle || undefined,
    carManufacturerId: carFilters.carManufacturerId || undefined,
    carTypeId: carFilters.carTypeId || undefined,
    vehicleType: carFilters.vehicleType ? (carFilters.vehicleType as any) : undefined,
    isAutomatic: carFilters.isAutomatic === '' ? undefined : carFilters.isAutomatic === 'true',
    creatorId: carFilters.creatorId || undefined,
    isActive: carFilters.isActive === '' ? undefined : carFilters.isActive === 'true',
  });

  const deleteMutation = useDeleteCar();

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('مدل خودرو با موفقیت حذف شد.');
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
            <Car className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت مدل‌های خودرو (Cars)</h1>
            <p className="text-xs text-neutral-400">تعریف مدل‌های مختلف خودروها جهت تخصیص قطعات</p>
          </div>
        </div>

        <Link
          href="/cars/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف خودرو جدید</span>
        </Link>
      </div>

      {/* نوار تب‌های زیرمجموعه خودروها */}
      <CarSubNav />

      {/* نوار فیلتر متصل به استور ماندگار */}
      <CarFilterBar
        model={carFilters.model}
        setModel={(val) => setCarFilter('model', val)}
        englishTitle={carFilters.englishTitle}
        setEnglishTitle={(val) => setCarFilter('englishTitle', val)}
        carManufacturerId={carFilters.carManufacturerId}
        setCarManufacturerId={(val) => setCarFilter('carManufacturerId', val)}
        carTypeId={carFilters.carTypeId}
        setCarTypeId={(val) => setCarFilter('carTypeId', val)}
        vehicleType={carFilters.vehicleType}
        setVehicleType={(val) => setCarFilter('vehicleType', val)}
        isAutomatic={carFilters.isAutomatic}
        setIsAutomatic={(val) => setCarFilter('isAutomatic', val)}
        creatorId={carFilters.creatorId}
        setCreatorId={(val) => setCarFilter('creatorId', val)}
        isActive={carFilters.isActive}
        setIsActive={(val) => setCarFilter('isActive', val)}
        onReset={resetCarFilters}
      />

      {/* جدول خودروها */}
      <CarTable
        cars={data?.items || []}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setCarFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف مدل خودرو"
        description="آیا از حذف این مدل خودرو اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}