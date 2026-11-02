'use client';

import { useParams } from 'next/navigation';
import CarTypePartDescriptionForm from '@/features/car-type-part-descriptions/components/CarTypePartDescriptionForm';
import { useGetCarTypePartDescriptionById } from '@/features/car-type-part-descriptions/hooks/useCarTypePartDescriptions';

export default function EditPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetCarTypePartDescriptionById(id);

  if (isLoading) return <p className="text-neutral-400 text-sm">در حال بارگذاری...</p>;
  if (!data) return <p className="text-red-400 text-sm">یافت نشد.</p>;

  return <CarTypePartDescriptionForm initialData={data} isEditMode />;
}