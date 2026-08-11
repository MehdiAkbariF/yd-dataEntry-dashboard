'use client';

import { useParams } from 'next/navigation';
import PartCategoryForm from '@/features/part-categories/components/PartCategoryForm';
import { useGetPartCategoryById } from '@/features/part-categories/hooks/usePartCategories';
import { Loader2 } from 'lucide-react';

export default function EditPartCategoryPage() {
  const params = useParams();
  const categoryId = params?.id as string;

  const { data, isLoading, isError } = useGetPartCategoryById(categoryId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات دسته‌بندی...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات دسته‌بندی.</span>
      </div>
    );
  }

  return <PartCategoryForm initialData={data} isEditMode={true} />;
}