'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetProducts, useToggleProductStatus, useDeleteProduct } from '@/features/products/hooks/useProducts';
import ProductTable from '@/features/products/components/ProductTable';
import ProductFilterBar from '@/features/products/components/ProductFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Plus, Package } from 'lucide-react';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState('');
  const [productCode, setProductCode] = useState('');
  const [isActive, setIsActive] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [updaterId, setUpdaterId] = useState('');
  const [brandId, setBrandId] = useState('');
  const [partId, setPartId] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // فراخوانی API لیست محصولات با تمام فیلترهای جدید
  const { data, isLoading } = useGetProducts({
    pageNumber: page,
    pageSize: 20,
    title: title || undefined,
    productCode: productCode || undefined,
    isActive: isActive === '' ? undefined : isActive === 'true',
    creatorId: creatorId || undefined,
    updaterId: updaterId || undefined,
    brandId: brandId || undefined,
    partId: partId || undefined,
  });

  const toggleMutation = useToggleProductStatus();
  const deleteMutation = useDeleteProduct();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    toggleMutation.mutate(
      { id, isActive: !currentStatus },
      { onSettled: () => setTogglingId(null) }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  const handleResetFilters = () => {
    setTitle('');
    setProductCode('');
    setIsActive('');
    setCreatorId('');
    setUpdaterId('');
    setBrandId('');
    setPartId('');
    setPage(1);
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

      {/* نوار فیلتر جامع */}
      <ProductFilterBar
        title={title}
        setTitle={setTitle}
        productCode={productCode}
        setProductCode={setProductCode}
        isActive={isActive}
        setIsActive={setIsActive}
        creatorId={creatorId}
        setCreatorId={setCreatorId}
        updaterId={updaterId}
        setUpdaterId={setUpdaterId}
        brandId={brandId}
        setBrandId={setBrandId}
        partId={partId}
        setPartId={setPartId}
        onReset={handleResetFilters}
      />

      {/* جدول لیست محصولات */}
      <ProductTable
        products={data?.items || []}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDelete={(id) => setDeleteId(id)}
        isTogglingId={togglingId}
      />

      {/* صفحه‌بندی در مرکز */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
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