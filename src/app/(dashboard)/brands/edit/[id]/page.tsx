'use client';

import { useParams } from 'next/navigation';
import BrandForm from '@/features/brands/components/BrandForm';
import { useGetBrandById } from '@/features/brands/hooks/useBrands';
import { Loader2 } from 'lucide-react';

export default function EditBrandPage() {
  const params = useParams();
  const brandId = params?.id as string;

  const { data: brandData, isLoading, isError } = useGetBrandById(brandId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات برند...</span>
      </div>
    );
  }

  if (isError || !brandData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات برند.</span>
      </div>
    );
  }

  return <BrandForm initialData={brandData} isEditMode={true} />;
}