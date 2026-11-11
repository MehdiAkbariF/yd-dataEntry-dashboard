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
    <div className="flex flex-col lg:flex-row items-center justify-between gap-4 border-t border-default bg-surface-1 px-5 py-4 rounded-lg select-none">
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        {parsedTotalCount !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-surface-2 border border-default text-secondary">
            <Layers className="w-3.5 h-3.5 text-[color:var(--accent-fg)]" />
            <span className="text-tertiary">تعداد کل:</span>
            <span className="font-mono font-bold text-[color:var(--accent-fg)] text-xs">
              {parsedTotalCount.toLocaleString('fa-IR')}
            </span>
            <span className="text-tertiary text-2xs">مورد</span>
          </div>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 text-secondary font-semibold bg-surface-2 border border-default px-3 py-1.5 rounded-md">
            <span>نمایش:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="bg-transparent text-[color:var(--accent-fg)] font-mono font-bold text-xs focus:outline-none cursor-pointer"
            >
              {pageSizeOptions.map((option) => (
                <option key={option} value={option} className="bg-surface-3 text-primary">
                  {option} در صفحه
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="btn btn-secondary btn-icon btn-sm"
          title="صفحه قبلی"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <span className="text-tertiary">صفحه</span>
          <span className="rounded-md bg-[color:var(--accent-subtle)] px-2.5 py-1 font-bold text-[color:var(--accent-fg)] font-mono">
            {currentPage.toLocaleString('fa-IR')}
          </span>
          <span className="text-tertiary">از</span>
          <span className="text-primary font-mono">{totalPages.toLocaleString('fa-IR')}</span>
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="btn btn-secondary btn-icon btn-sm"
          title="صفحه بعدی"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleJumpSubmit} className="flex items-center gap-2">
        <span className="text-xs text-tertiary font-semibold">پرش به صفحه:</span>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={jumpPage}
          onChange={(e) => setJumpPage(e.target.value)}
          placeholder={`${currentPage}`}
          className="field w-16 h-8 px-2 text-center text-xs font-bold font-mono"
        />
        <button
          type="submit"
          disabled={!jumpPage || parseInt(jumpPage, 10) < 1 || parseInt(jumpPage, 10) > totalPages}
          className="btn btn-secondary btn-sm"
        >
          <span>برو</span>
          <ArrowLeft className="w-3 h-3" />
        </button>
      </form>
    </div>
  );
}