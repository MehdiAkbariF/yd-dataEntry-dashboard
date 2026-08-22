'use client';

import { useState } from 'react';
import BlogSubNav from '@/features/blogs/components/BlogSubNav';
import BlogCommentTable from '@/features/blogs/components/BlogCommentTable';
import BlogCommentFilterBar from '@/features/blogs/components/BlogCommentFilterBar';
import BlogCommentReplyModal from '@/features/blogs/components/BlogCommentReplyModal';
import Pagination from '@/components/common/Pagination';
import {
  useGetBlogComments,
  useConfirmBlogComment,
  useReplyBlogComment,
} from '@/features/blogs/hooks/useBlogs';
import { BlogPostCommentListItem } from '@/features/blogs/types';
import { useFilterStore } from '@/store/useFilterStore';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function BlogCommentsPage() {
  const { blogCommentFilters, setBlogCommentFilter, resetBlogCommentFilters } = useFilterStore();

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [selectedReplyComment, setSelectedReplyComment] = useState<BlogPostCommentListItem | null>(null);

  const { data, isLoading } = useGetBlogComments({
    pageNumber: blogCommentFilters.page,
    pageSize: 20,
    searchedValue: blogCommentFilters.searchedValue || undefined,
    blogPostId: blogCommentFilters.blogPostId || undefined,
    isConfirmed: blogCommentFilters.isConfirmed === '' ? undefined : blogCommentFilters.isConfirmed === 'true',
    isReply: blogCommentFilters.isReply === '' ? undefined : blogCommentFilters.isReply === 'true',
  });

  const confirmMutation = useConfirmBlogComment();
  const replyMutation = useReplyBlogComment();

  const handleConfirm = (id: string) => {
    setConfirmingId(id);
    confirmMutation.mutate(id, {
      onSuccess: () => toast.success('دیدگاه با موفقیت تایید و منتشر شد.'),
      onSettled: () => setConfirmingId(null),
    });
  };

  const handleSendReply = (commentId: string, replyText: string) => {
    replyMutation.mutate(
      { commentId, replyText },
      {
        onSuccess: () => {
          toast.success('پاسخ شما با موفقیت ثبت شد.');
          setSelectedReplyComment(null);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">مدیریت نظرات وبلاگ (Blog Comments)</h1>
          <p className="text-xs text-neutral-400">بررسی، تایید و پاسخ‌دهی به نظرات کاربران مقالات</p>
        </div>
      </div>

      <BlogSubNav />

      <BlogCommentFilterBar
        searchedValue={blogCommentFilters.searchedValue}
        setSearchedValue={(val) => setBlogCommentFilter('searchedValue', val)}
        blogPostId={blogCommentFilters.blogPostId}
        setBlogPostId={(val) => setBlogCommentFilter('blogPostId', val)}
        isConfirmed={blogCommentFilters.isConfirmed}
        setIsConfirmed={(val) => setBlogCommentFilter('isConfirmed', val)}
        isReply={blogCommentFilters.isReply}
        setIsReply={(val) => setBlogCommentFilter('isReply', val)}
        onReset={resetBlogCommentFilters}
      />

      <BlogCommentTable
        comments={data?.items || []}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        onOpenReply={(c) => setSelectedReplyComment(c)}
        confirmingId={confirmingId}
      />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setBlogCommentFilter('page', newPage)}
        />
      )}

      <BlogCommentReplyModal
        isOpen={!!selectedReplyComment}
        comment={selectedReplyComment}
        isLoading={replyMutation.isPending}
        onSendReply={handleSendReply}
        onClose={() => setSelectedReplyComment(null)}
      />
    </div>
  );
}