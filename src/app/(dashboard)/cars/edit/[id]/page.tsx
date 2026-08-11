'use client';

import { useParams } from 'next/navigation';
import CarForm from '@/features/cars/components/CarForm';
import { useGetCarById } from '@/features/cars/hooks/useCars';
import { Loader2 } from 'lucide-react';

export default function EditCarPage() {
  const params = useParams();
  const carId = params?.id as string;

  const { data: carData, isLoading, isError } = useGetCarById(carId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات کامل خودرو...</span>
      </div>
    );
  }

  if (isError || !carData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات خودرو.</span>
        <span className="text-xs text-neutral-500">خودرو یافت نشد یا حذف شده است.</span>
      </div>
    );
  }

  return <CarForm initialData={carData} isEditMode={true} />;
}