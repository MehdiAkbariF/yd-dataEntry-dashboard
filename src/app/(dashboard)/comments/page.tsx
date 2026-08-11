'use client';

import { useState } from 'react';
import { useGetComments, useConfirmComment } from '@/features/comments/hooks/useComments';
import CommentTable from '@/features/comments/components/CommentTable';
import CommentFilterBar from '@/features/comments/components/CommentFilterBar';
import Pagination from '@/components/common/Pagination';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function CommentsPage() {
  const [page, setPage] = useState(1);
  const [searchedValue, setSearchedValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState('');
  const [isIncognito, setIsIncognito] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data, isLoading } = useGetComments({
    pageNumber: page,
    pageSize: 20,
    searchedValue: searchedValue || undefined,
    isConfirmed: isConfirmed === '' ? undefined : isConfirmed === 'true',
    isIncognito: isIncognito === '' ? undefined : isIncognito === 'true',
  });

  const confirmMutation = useConfirmComment();

  const handleConfirm = (commentId: string) => {
    setConfirmingId(commentId);
    confirmMutation.mutate(commentId, {
      onSuccess: () => {
        toast.success('دیدگاه کاربر با موفقیت تایید و منتشر شد.');
      },
      onSettled: () => setConfirmingId(null),
    });
  };

  const handleResetFilters = () => {
    setSearchedValue('');
    setIsConfirmed('');
    setIsIncognito('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">مدیریت نظرات کاربران</h1>
          <p className="text-xs text-neutral-400">بررسی و تایید نظرات ثبت‌شده روی محصولات</p>
        </div>
      </div>

      <CommentFilterBar
        searchedValue={searchedValue}
        setSearchedValue={setSearchedValue}
        isConfirmed={isConfirmed}
        setIsConfirmed={setIsConfirmed}
        isIncognito={isIncognito}
        setIsIncognito={setIsIncognito}
        onReset={handleResetFilters}
      />

      <CommentTable
        comments={data?.items || []}
        isLoading={isLoading}
        onConfirm={handleConfirm}
        confirmingId={confirmingId}
      />

      {data && (
        <Pagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}