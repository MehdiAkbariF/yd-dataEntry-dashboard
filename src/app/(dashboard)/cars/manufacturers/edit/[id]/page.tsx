'use client';

import { useParams } from 'next/navigation';
import CarManufacturerForm from '@/features/cars/components/CarManufacturerForm';
import { carService } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function EditCarManufacturerPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['car-manufacturer', id],
    queryFn: async () => {
      const list = await carService.getCarManufacturers();
      return list.find((m: any) => m.id === id);
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return <CarManufacturerForm initialData={data} isEditMode={true} />;
}