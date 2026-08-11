'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/features/products/components/ProductForm';
import { useGetProductById } from '@/features/products/hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { data: productData, isLoading, isError } = useGetProductById(productId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات کامل محصول...</span>
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات محصول.</span>
        <span className="text-xs text-neutral-500">ممکن است محصول وجود نداشته باشد یا حذف شده باشد.</span>
      </div>
    );
  }

  return <ProductForm initialData={productData} isEditMode={true} />;
}