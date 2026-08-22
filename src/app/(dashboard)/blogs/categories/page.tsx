'use client';

import { useState } from 'react';
import BlogSubNav from '@/features/blogs/components/BlogSubNav';
import BlogCategoryTable from '@/features/blogs/components/BlogCategoryTable';
import BlogCategoryFilterBar from '@/features/blogs/components/BlogCategoryFilterBar';
import BlogCategoryModal from '@/features/blogs/components/BlogCategoryModal';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import {
  useGetBlogCategories,
  useCreateBlogCategory,
  useUpdateBlogCategory,
  useDeleteBlogCategory,
} from '@/features/blogs/hooks/useBlogs';
import { BlogCategoryListItem } from '@/features/blogs/types';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, Layers } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogCategoriesPage() {
  const { blogCategoryFilters, setBlogCategoryFilter, resetBlogCategoryFilters } = useFilterStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BlogCategoryListItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useGetBlogCategories({
    pageNumber: blogCategoryFilters.page,
    pageSize: 20,
    title: blogCategoryFilters.title || undefined,
    userId: blogCategoryFilters.userId || undefined,
    isActive: blogCategoryFilters.isActive === '' ? undefined : blogCategoryFilters.isActive === 'true',
  });

  const createMutation = useCreateBlogCategory();
  const updateMutation = useUpdateBlogCategory();
  const deleteMutation = useDeleteBlogCategory();

  const handleOpenCreateModal = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cat: BlogCategoryListItem) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleSave = (formData: FormData) => {
    if (selectedCategory) {
      updateMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('دسته‌بندی بلاگ با موفقیت ویرایش شد.');
          setIsModalOpen(false);
        },
      });
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => {
          toast.success('دسته‌بندی جدید بلاگ ایجاد شد.');
          setIsModalOpen(false);
        },
      });
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('دسته‌بندی با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">دسته‌بندی‌های وبلاگ (Blog Categories)</h1>
            <p className="text-xs text-neutral-400">مدیریت موضوعات و دسته‌بندی مقالات وبلاگ</p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف دسته‌بندی جدید</span>
        </button>
      </div>

      <BlogSubNav />

      <BlogCategoryFilterBar
        title={blogCategoryFilters.title}
        setTitle={(val) => setBlogCategoryFilter('title', val)}
        userId={blogCategoryFilters.userId}
        setUserId={(val) => setBlogCategoryFilter('userId', val)}
        isActive={blogCategoryFilters.isActive}
        setIsActive={(val) => setBlogCategoryFilter('isActive', val)}
        onReset={resetBlogCategoryFilters}
      />

      <BlogCategoryTable
        categories={data?.items || []}
        isLoading={isLoading}
        onEdit={handleOpenEditModal}
        onDelete={(id) => setDeleteId(id)}
      />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setBlogCategoryFilter('page', newPage)}
        />
      )}

      <BlogCategoryModal
        isOpen={isModalOpen}
        initialCategory={selectedCategory}
        isLoading={createMutation.isPending || updateMutation.isPending}
        onSave={handleSave}
        onClose={() => setIsModalOpen(false)}
      />

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