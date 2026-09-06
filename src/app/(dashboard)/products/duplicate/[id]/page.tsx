'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/features/products/components/ProductForm';
import { useGetProductById } from '@/features/products/hooks/useProducts';
import { Loader2 } from 'lucide-react';

export default function DuplicateProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { data: productData, isLoading, isError } = useGetProductById(productId);

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات محصول جهت تکثیر...</span>
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات محصول.</span>
        <span className="text-xs text-neutral-500">ممکن است محصول مورد نظر حذف شده باشد.</span>
      </div>
    );
  }

  // آماده‌سازی داده‌ها برای ایجاد محصول کپی
  const duplicateInitialData = {
    ...productData,
    title: `${productData.title} (کپی)`,
    productCode: '', // خالی کردن کد محصول تا تکراری تولید نشود
  };

  return <ProductForm initialData={duplicateInitialData} isEditMode={false} />;
}