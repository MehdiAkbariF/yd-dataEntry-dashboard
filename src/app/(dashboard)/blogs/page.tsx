'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  useGetBlogPosts,
  usePublishBlogPost,
  useDeleteBlogPost,
} from '@/features/blogs/hooks/useBlogs';
import BlogPostTable from '@/features/blogs/components/BlogPostTable';
import BlogPostFilterBar from '@/features/blogs/components/logPostFilterBar';
import BlogSubNav from '@/features/blogs/components/BlogSubNav';
import Pagination from '@/components/common/Pagination';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useFilterStore } from '@/store/useFilterStore';
import { Plus, BookOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogPostsPage() {
  const { blogPostFilters, setBlogPostFilter, resetBlogPostFilters } = useFilterStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const { data, isLoading } = useGetBlogPosts({
    pageNumber: blogPostFilters.page,
    pageSize: 20,
    title: blogPostFilters.title || undefined,
    blogCategoryId: blogPostFilters.blogCategoryId || undefined,
    userId: blogPostFilters.userId || undefined,
    isActive: blogPostFilters.isActive === '' ? undefined : blogPostFilters.isActive === 'true',
  });

  const publishMutation = usePublishBlogPost();
  const deleteMutation = useDeleteBlogPost();

  const handlePublish = (id: string) => {
    setPublishingId(id);
    publishMutation.mutate(id, {
      onSuccess: () => toast.success('مقاله با موفقیت منتشر گردید.'),
      onSettled: () => setPublishingId(null),
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('مقاله با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">مدیریت مقالات وبلاگ (BlogPosts)</h1>
            <p className="text-xs text-neutral-400">تولید، بررسی و انتشار محتوای متنی و مقالات تخصصی</p>
          </div>
        </div>

        <Link
          href="/blogs/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>نگارش مقاله جدید</span>
        </Link>
      </div>

      <BlogSubNav />

      <BlogPostFilterBar
        title={blogPostFilters.title}
        setTitle={(val) => setBlogPostFilter('title', val)}
        blogCategoryId={blogPostFilters.blogCategoryId}
        setBlogCategoryId={(val) => setBlogPostFilter('blogCategoryId', val)}
        userId={blogPostFilters.userId}
        setUserId={(val) => setBlogPostFilter('userId', val)}
        isActive={blogPostFilters.isActive}
        setIsActive={(val) => setBlogPostFilter('isActive', val)}
        onReset={resetBlogPostFilters}
      />

      <BlogPostTable
        posts={data?.items || []}
        isLoading={isLoading}
        onPublish={handlePublish}
        onDelete={(id) => setDeleteId(id)}
        publishingId={publishingId}
      />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setBlogPostFilter('page', newPage)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف مقاله"
        description="آیا از حذف این مقاله اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}