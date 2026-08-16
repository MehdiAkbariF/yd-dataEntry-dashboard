'use client';

import { useParams } from 'next/navigation';
import CarTypeForm from '@/features/cars/components/CarTypeForm';
import { carService } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function EditCarTypePage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading } = useQuery({
    queryKey: ['car-type', id],
    queryFn: async () => {
      const list = await carService.getCarTypes();
      return list.find((t: any) => t.id === id);
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

  return <CarTypeForm initialData={data} isEditMode={true} />;
}