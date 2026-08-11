'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetPartCategories, useDeletePartCategory } from '@/features/part-categories/hooks/usePartCategories';
import PartCategoryTable from '@/features/part-categories/components/PartCategoryTable';
import PartCategoryFilterBar from '@/features/part-categories/components/PartCategoryFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function PartCategoriesPage() {
  const [page, setPage] = useState(1);

  // فیلترهای کامل
  const [name, setName] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [parent, setParent] = useState('');
  const [thumbnailAlt, setThumbnailAlt] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [updaterId, setUpdaterId] = useState('');
  const [isActive, setIsActive] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);

  // فراخوانی API با تمام فیلترهای کامل
  const { data, isLoading } = useGetPartCategories({
    pageNumber: page,
    pageSize: 20,
    name: name || undefined,
    englishTitle: englishTitle || undefined,
    parent: parent || undefined,
    thumbnailAlt: thumbnailAlt || undefined,
    creatorId: creatorId || undefined,
    updaterId: updaterId || undefined,
    isActive: isActive === '' ? undefined : isActive === 'true',
  });

  const deleteMutation = useDeletePartCategory();

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  const handleResetFilters = () => {
    setName('');
    setEnglishTitle('');
    setParent('');
    setThumbnailAlt('');
    setCreatorId('');
    setUpdaterId('');
    setIsActive('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت دسته‌بندی قطعات</h1>
            <p className="text-xs text-neutral-400">دسته‌بندی‌ها و زیرمجموعه‌های ساختار قطعات فروشگاه</p>
          </div>
        </div>

        <Link
          href="/parts/categories/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف دسته‌بندی جدید</span>
        </Link>
      </div>

      <PartCategoryFilterBar
        name={name}
        setName={setName}
        englishTitle={englishTitle}
        setEnglishTitle={setEnglishTitle}
        parent={parent}
        setParent={setParent}
        thumbnailAlt={thumbnailAlt}
        setThumbnailAlt={setThumbnailAlt}
        creatorId={creatorId}
        setCreatorId={setCreatorId}
        updaterId={updaterId}
        setUpdaterId={setUpdaterId}
        isActive={isActive}
        setIsActive={setIsActive}
        onReset={handleResetFilters}
      />

      <PartCategoryTable
        categories={data?.items || []}
        isLoading={isLoading}
        onDelete={(id) => setDeleteId(id)}
      />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف دسته‌بندی"
        description="آیا از حذف این دسته‌بندی اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}