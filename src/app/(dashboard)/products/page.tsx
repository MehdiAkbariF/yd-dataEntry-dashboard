'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetProducts, useToggleProductStatus, useDeleteProduct } from '@/features/products/hooks/useProducts';
import ProductTable from '@/features/products/components/ProductTable';
import ProductFilterBar from '@/features/products/components/ProductFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Package } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductsPage() {
  const { productFilters, setProductFilter, resetProductFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // فراخوانی API محصولات همراه با پارامتر carId
  const { data, isLoading } = useGetProducts({
    pageNumber: productFilters.page,
    pageSize: 20,
    title: productFilters.title || undefined,
    productCode: productFilters.productCode || undefined,
    isActive: productFilters.isActive === '' ? undefined : productFilters.isActive === 'true',
    creatorId: productFilters.creatorId || undefined,
    updaterId: productFilters.updaterId || undefined,
    brandId: productFilters.brandId || undefined,
    partId: productFilters.partId || undefined,
    carId: productFilters.carId || undefined, // 👈 ارسال فیلتر خودرو به سرور
  });

  const toggleMutation = useToggleProductStatus();
  const deleteMutation = useDeleteProduct();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    toggleMutation.mutate(
      { id, isActive: !currentStatus },
      {
        onSuccess: () => toast.success('وضعیت نمایش محصول تغییر یافت.'),
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('محصول با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت محصولات</h1>
            <p className="text-xs text-neutral-400">مشاهده، فیلتر و مدیریت جامع تمام محصولات فروشگاه</p>
          </div>
        </div>

        <Link
          href="/products/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>ایجاد محصول جدید</span>
        </Link>
      </div>

      {/* نوار فیلتر متصل به استور ماندگار */}
      <ProductFilterBar
        title={productFilters.title}
        setTitle={(val) => setProductFilter('title', val)}
        productCode={productFilters.productCode}
        setProductCode={(val) => setProductFilter('productCode', val)}
        isActive={productFilters.isActive}
        setIsActive={(val) => setProductFilter('isActive', val)}
        creatorId={productFilters.creatorId}
        setCreatorId={(val) => setProductFilter('creatorId', val)}
        updaterId={productFilters.updaterId}
        setUpdaterId={(val) => setProductFilter('updaterId', val)}
        brandId={productFilters.brandId}
        setBrandId={(val) => setProductFilter('brandId', val)}
        partId={productFilters.partId}
        setPartId={(val) => setProductFilter('partId', val)}
        carId={productFilters.carId} // 👈 افزودن فیلتر خودرو به بار
        setCarId={(val) => setProductFilter('carId', val)}
        onReset={resetProductFilters}
      />

      {/* جدول لیست محصولات */}
      <ProductTable
        products={data?.items || []}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDelete={(id) => setDeleteId(id)}
        isTogglingId={togglingId}
      />

      {/* صفحه‌بندی متصل به استور ماندگار */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setProductFilter('page', newPage)}
        />
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف محصول"
        description="آیا از حذف این محصول اطمینان دارید؟ این عملیات قابل بازگشت نیست."
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}