'use client';

import { useParams } from 'next/navigation';
import PartDescriptionForm from '@/features/part-descriptions/components/PartDescriptionForm';
import { useGetPartCarDescriptionById } from '@/features/part-descriptions/hooks/usePartDescriptions';
import { Loader2 } from 'lucide-react';

export default function EditPartDescriptionPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data, isLoading, isError } = useGetPartCarDescriptionById(id);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">اطلاعات یافت نشد.</span>
      </div>
    );
  }

  return <PartDescriptionForm initialData={data} isEditMode={true} />;
}