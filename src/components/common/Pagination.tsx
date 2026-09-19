// src/components/common/Pagination.tsx
'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, ArrowLeft, Layers } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount?: number | string | null;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (newPageSize: number) => void;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize = 20,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
  onPageChange,
}: PaginationProps) {
  const [jumpPage, setJumpPage] = useState<string>('');

  const parsedTotalCount =
    typeof totalCount === 'number'
      ? totalCount
      : typeof totalCount === 'string' && !isNaN(Number(totalCount))
      ? Number(totalCount)
      : undefined;

  if (totalPages <= 1 && parsedTotalCount === undefined) return null;

  const handleJumpSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpPage('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-neutral-800 bg-neutral-900/50 px-4 py-4 sm:px-6 rounded-2xl select-none">
      
      {/* بخش ۱: تعداد کل رکوردها و سلکتور تعداد در هر صفحه */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
        {parsedTotalCount !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-300 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-neutral-400">تعداد کل:</span>
            <span className="font-mono font-black text-amber-400 text-xs sm:text-sm">
              {parsedTotalCount.toLocaleString('fa-IR')}
            </span>
            <span className="text-neutral-500 text-[11px]">مورد</span>
          </div>
        )}

        {/* سلکتور تعداد نمایش در صفحه */}
        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-neutral-400 font-bold bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-xl">
            <span>نمایش:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent text-amber-400 font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option} className="bg-neutral-900 text-neutral-200">
                  {option} در صفحه
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* بخش ۲: دکمه‌های قبلی / بعدی و شماره صفحه فعلی */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 transition-all cursor-pointer"
          title="صفحه قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-bold">
          <span className="text-neutral-400">صفحه</span>
          <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 font-bold text-amber-400 font-mono">
            {currentPage.toLocaleString('fa-IR')}
          </span>
          <span className="text-neutral-400">از</span>
          <span className="text-neutral-200 font-mono">
            {totalPages.toLocaleString('fa-IR')}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 transition-all cursor-pointer"
          title="صفحه بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      {/* بخش ۳: پرش سریع به صفحه دلخواه */}
      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <span className="text-xs text-neutral-400 font-bold">پرش به صفحه:</span>
        <div className="relative flex items-center">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder={`${currentPage}`}
            className="w-16 h-8 px-2 text-center text-xs font-bold font-mono rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-200 placeholder-neutral-600 focus:border-amber-500 focus:outline-none transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
          className="h-8 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1 transition-all disabled:opacity-30 cursor-pointer"
        >
          <span>برو</span>
          <ArrowLeft className="w-3 h-3" />
        </button>
      </form>

    </div>
  );
}