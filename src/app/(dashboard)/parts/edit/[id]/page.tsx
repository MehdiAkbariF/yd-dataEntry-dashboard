'use client';

import { useParams } from 'next/navigation';
import PartForm from '@/features/parts/components/PartForm';
import { useGetPartById } from '@/features/parts/hooks/useParts';
import { Loader2 } from 'lucide-react';

export default function EditPartPage() {
  const params = useParams();
  const partId = params?.id as string;

  const { data: partData, isLoading, isError } = useGetPartById(partId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات قطعه...</span>
      </div>
    );
  }

  if (isError || !partData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات قطعه.</span>
        <span className="text-xs text-neutral-500">قطعه مورد نظر یافت نشد.</span>
      </div>
    );
  }

  return <PartForm initialData={partData} isEditMode={true} />;
}