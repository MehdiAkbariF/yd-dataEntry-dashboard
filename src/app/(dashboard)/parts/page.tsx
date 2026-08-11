'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGetParts, useTogglePartStatus, useDeletePart } from '@/features/parts/hooks/useParts';
import PartTable from '@/features/parts/components/PartTable';
import PartFilterBar from '@/features/parts/components/PartFilterBar';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Plus, Cpu } from 'lucide-react';
import { toast } from 'sonner';

export default function PartsPage() {
  const [page, setPage] = useState(1);

  // فیلترهای کامل
  const [name, setName] = useState('');
  const [englishTitle, setEnglishTitle] = useState('');
  const [description, setDescription] = useState('');
  const [partCategoryId, setPartCategoryId] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [updaterId, setUpdaterId] = useState('');
  const [hasSeo, setHasSeo] = useState('');
  const [hasDescription, setHasDescription] = useState('');
  const [isActive, setIsActive] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // فراخوانی API قطعات با تمام فیلترهای کامل
  const { data, isLoading } = useGetParts({
    pageNumber: page,
    pageSize: 20,
    name: name || undefined,
    englishTitle: englishTitle || undefined,
    description: description || undefined,
    partCategoryId: partCategoryId || undefined,
    creatorId: creatorId || undefined,
    updaterId: updaterId || undefined,
    hasSeo: hasSeo === '' ? undefined : hasSeo === 'true',
    hasDescription: hasDescription === '' ? undefined : (hasDescription as any),
    isActive: isActive === '' ? undefined : isActive === 'true',
  });

  const toggleMutation = useTogglePartStatus();
  const deleteMutation = useDeletePart();

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    toggleMutation.mutate(
      { id, isActive: !currentStatus },
      {
        onSuccess: () => toast.success('وضعیت قطعه به‌روزرسانی شد.'),
        onSettled: () => setTogglingId(null),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('قطعه با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  const handleResetFilters = () => {
    setName('');
    setEnglishTitle('');
    setDescription('');
    setPartCategoryId('');
    setCreatorId('');
    setUpdaterId('');
    setHasSeo('');
    setHasDescription('');
    setIsActive('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت قطعات پایه (Part)</h1>
            <p className="text-xs text-neutral-400">تعریف و مدیریت انواع قطعات و دسته‌بندی‌های استاندارد</p>
          </div>
        </div>

        <Link
          href="/parts/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف قطعه جدید</span>
        </Link>
      </div>

      {/* نوار فیلتر جامع */}
      <PartFilterBar
        name={name}
        setName={setName}
        englishTitle={englishTitle}
        setEnglishTitle={setEnglishTitle}
        description={description}
        setDescription={setDescription}
        partCategoryId={partCategoryId}
        setPartCategoryId={setPartCategoryId}
        creatorId={creatorId}
        setCreatorId={setCreatorId}
        updaterId={updaterId}
        setUpdaterId={setUpdaterId}
        hasSeo={hasSeo}
        setHasSeo={setHasSeo}
        hasDescription={hasDescription}
        setHasDescription={setHasDescription}
        isActive={isActive}
        setIsActive={setIsActive}
        onReset={handleResetFilters}
      />

      {/* جدول قطعات */}
      <PartTable
        parts={data?.items || []}
        isLoading={isLoading}
        onToggleStatus={handleToggleStatus}
        onDelete={(id) => setDeleteId(id)}
        isTogglingId={togglingId}
      />

      {/* صفحه‌بندی */}
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
        title="حذف قطعه"
        description="آیا از حذف این قطعه پایه اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}