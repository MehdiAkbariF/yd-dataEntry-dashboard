'use client';

import { useState } from 'react';
import { useGetTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/features/tags/hooks/useTags';
import TagTable from '@/features/tags/components/TagTable';
import TagFilterBar from '@/features/tags/components/TagFilterBar';
import TagModal from '@/features/tags/components/TagModal';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { TagListItem } from '@/features/tags/types';
import { Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';

export default function TagsPage() {
  const [page, setPage] = useState(1);
  const [value, setValue] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const [isActive, setIsActive] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagListItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetTags({
    pageNumber: page,
    pageSize: 20,
    value: value || undefined,
    creatorId: creatorId || undefined,
    isActive: isActive === '' ? undefined : isActive === 'true',
  });

  const createMutation = useCreateTag();
  const updateMutation = useUpdateTag();
  const deleteMutation = useDeleteTag();

  const handleOpenCreateModal = () => {
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tag: TagListItem) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const handleSaveTag = (tagValue: string) => {
    if (selectedTag) {
      updateMutation.mutate(
        { id: selectedTag.id, value: tagValue },
        {
          onSuccess: () => {
            toast.success('برچسب با موفقیت به‌روزرسانی شد.');
            setIsModalOpen(false);
          },
        }
      );
    } else {
      createMutation.mutate(tagValue, {
        onSuccess: () => {
          toast.success('برچسب جدید با موفقیت ایجاد شد.');
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('برچسب با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  const handleResetFilters = () => {
    setValue('');
    setCreatorId('');
    setIsActive('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت برچسب‌ها (Tags)</h1>
            <p className="text-xs text-neutral-400">ثبت و مدیریت برچسب‌های کلمات کلیدی برای محصولات</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>افزودن برچسب جدید</span>
        </button>
      </div>

      {/* نوار فیلتر */}
      <TagFilterBar
        value={value}
        setValue={setValue}
        creatorId={creatorId}
        setCreatorId={setCreatorId}
        isActive={isActive}
        setIsActive={setIsActive}
        onReset={handleResetFilters}
      />

      {/* جدول نمایش تگ‌ها */}
      <TagTable
        tags={data?.items || []}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={(id) => setDeleteId(id)}
      />

      {/* صفحه‌بندی وسط‌چین */}
      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      {/* مودال ایجاد/ویرایش تگ */}
      <TagModal
        isOpen={isModalOpen}
        initialTag={selectedTag}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onSave={handleSaveTag}
        onClose={() => setIsModalOpen(false)}
      />

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف برچسب"
        description="آیا از حذف این برچسب اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}