'use client';

import { useParams } from 'next/navigation';
import ProductForm from '@/features/products/components/ProductForm';
import { useGetProductById } from '@/features/products/hooks/useProducts';
import { Loader2, Copy } from 'lucide-react';

export default function DuplicateProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const { data: productData, isLoading, isError } = useGetProductById(productId);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center gap-4 rounded-3xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm">
        <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
        <span className="text-sm font-medium text-neutral-400">در حال دریافت و کپی اطلاعات کاتالوگ محصول...</span>
      </div>
    );
  }

  if (isError || !productData) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border border-red-500/20 bg-red-500/5 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات محصول.</span>
        <span className="text-xs text-neutral-500">ممکن است محصول مرجع حذف شده باشد.</span>
      </div>
    );
  }

  // آماده‌سازی دقیق داده‌ها برای ایجاد محصول کپی
  const duplicateInitialData = {
    ...productData,
    id: undefined, // 🚨 حذف شناسه اصلی تا یک محصول کاملاً جدید ایجاد شود نه آپدیت
    title: `${productData.title} (کپی)`,
    englishTitle: `${productData.englishTitle || ''} (Copy)`.trim(),
    productCode: '', // خالی کردن کد محصول تا در سیستم تکراری تولید نشود
    partNumber: '', // پیشنهاد می‌شود پارت نامبر هم خالی شود یا بماند (بسته به سیاست سیستم)
    seoInformation: {
      ...productData.seoInformation,
      id: undefined,
      title: `(کپی) ${productData.seoInformation?.title || productData.title}`,
      canonicalUrl: `${productData.seoInformation?.canonicalUrl || ''}-copy`,
    },
    // اطمینان از قرار گرفتن کامل آبجکت‌های برند و قطعه برای لود صحیح دراپ‌داون‌ها
    brand: productData.brand,
    part: productData.part,
    cars: productData.cars || [],
    tags: productData.tags || [],
    relatedProducts: productData.relatedProducts || [],
    productImages: productData.productImages || [],
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <Copy className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">تکثیر محصول</h1>
          <p className="text-xs text-neutral-400">ایجاد محصول جدید بر پایه ساختار محصول: {productData.title}</p>
        </div>
      </div>
      
      {/* پاس دادن داده‌ها با حالت isEditMode = false (چون قراره Create بشه) و flag جدید isDuplicateMode */}
      <ProductForm initialData={duplicateInitialData} isEditMode={false} isDuplicateMode={true} />
    </div>
  );
}