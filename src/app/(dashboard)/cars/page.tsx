'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetCars, useDeleteCar } from '@/features/cars/hooks/useCars';
import CarTable from '@/features/cars/components/CarTable';
import CarFilterBar from '@/features/cars/components/CarFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Plus, Car } from 'lucide-react';
import { toast } from 'sonner';

export default function CarsPage() {
  const [page, setPage] = useState(1);

  // فیلترهای کامل
  const [model, setModel] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [carManufacturerId, setCarManufacturerId] = useState('');
  const [carTypeId, setCarTypeId] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [isAutomatic, setIsAutomatic] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [isActive, setIsActive] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // فراخوانی API خودروها
  const { data, isLoading } = useGetCars({
    pageNumber: page,
    pageSize: 20,
    model: model || undefined,
    englishTitle: englishTitle || undefined,
    carManufacturerId: carManufacturerId || undefined,
    carTypeId: carTypeId || undefined,
    vehicleType: vehicleType ? (vehicleType as any) : undefined,
    isAutomatic: isAutomatic === '' ? undefined : isAutomatic === 'true',
    creatorId: creatorId || undefined,
    isActive: isActive === '' ? undefined : isActive === 'true',
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

  const handleResetFilters = () => {
    setModel('');
    setEnglishTitle('');
    setCarManufacturerId('');
    setCarTypeId('');
    setVehicleType('');
    setIsAutomatic('');
    setCreatorId('');
    setIsActive('');
    setPage(1);
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

      {/* نوار فیلتر کامل */}
      <CarFilterBar
        model={model}
        setModel={setModel}
        englishTitle={englishTitle}
        setEnglishTitle={setEnglishTitle}
        carManufacturerId={carManufacturerId}
        setCarManufacturerId={setCarManufacturerId}
        carTypeId={carTypeId}
        setCarTypeId={setCarTypeId}
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
        isAutomatic={isAutomatic}
        setIsAutomatic={setIsAutomatic}
        creatorId={creatorId}
        setCreatorId={setCreatorId}
        isActive={isActive}
        setIsActive={setIsActive}
        onReset={handleResetFilters}
      />

      {/* جدول خودروها */}
      <CarTable
        cars={data?.items || []}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* صفحه‌بندی وسط‌چین */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
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