'use client';

import { useParams, useSearchParams } from 'next/navigation';
import {
  useGetPartCarDescriptionById,
  useGetCarTypePartDescriptionById,
} from '@/features/part-descriptions/hooks/usePartDescriptions';
import PartDescriptionForm from '@/features/part-descriptions/components/PartDescriptionForm';
import { Loader2 } from 'lucide-react';

export default function EditPartDescriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const type = (searchParams.get('type') as 'car' | 'carType') || 'car';

  const { data: carData, isLoading: isCarLoading } = useGetPartCarDescriptionById(
    type === 'car' ? id : ''
  );
  const { data: carTypeData, isLoading: isCarTypeLoading } = useGetCarTypePartDescriptionById(
    type === 'carType' ? id : ''
  );

  const isLoading = type === 'car' ? isCarLoading : isCarTypeLoading;
  const initialData = type === 'car' ? carData : carTypeData;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return <PartDescriptionForm initialData={initialData} isEditMode={true} />;
}