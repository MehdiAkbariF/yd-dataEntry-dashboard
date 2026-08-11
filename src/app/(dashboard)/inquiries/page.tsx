'use client';

import { useState } from 'react';
import { useGetInquiries, useConfirmInquiry } from '@/features/inquiries/hooks/useInquiries';
import InquiryTable from '@/features/inquiries/components/InquiryTable';
import InquiryFilterBar from '@/features/inquiries/components/InquiryFilterBar';
import Pagination from '@/components/common/Pagination';
import { HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function InquiriesPage() {
  const [page, setPage] = useState(1);
  const [searchedValue, setSearchedValue] = useState('');
  const [isConfirmed, setIsConfirmed] = useState('');
  const [isReply, setIsReply] = useState('');
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data, isLoading } = useGetInquiries({
    pageNumber: page,
    pageSize: 20,
    searchedValue: searchedValue || undefined,
    isConfirmed: isConfirmed === '' ? undefined : isConfirmed === 'true',
    isReply: isReply === '' ? undefined : isReply === 'true',
  });

  const confirmMutation = useConfirmInquiry();

  const handleConfirm = (inquiryId: string) => {
    setConfirmingId(inquiryId);
    confirmMutation.mutate(inquiryId, {
      onSuccess: () => {
        toast.success('پرسش کاربر با موفقیت تایید و منتشر شد.');
      },
      onSettled: () => setConfirmingId(null),
    });
  };

  const handleResetFilters = () => {
    setSearchedValue('');
    setIsConfirmed('');
    setIsReply('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
          <HelpCircle className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">مدیریت پرسش و پاسخ‌ها</h1>
          <p className="text-xs text-neutral-400">بررسی و انتشار سوالات کاربران درباره محصولات</p>
        </div>
      </div>

      <InquiryFilterBar
        searchedValue={searchedValue}
        setSearchedValue={setSearchedValue}
        isConfirmed={isConfirmed}
        setIsConfirmed={setIsConfirmed}
        isReply={isReply}
        setIsReply={setIsReply}
        onReset={handleResetFilters}
      />

      <InquiryTable
        inquiries={data?.items || []}
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