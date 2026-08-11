'use client';

import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center border-t border-neutral-800 bg-neutral-900/40 px-4 py-4 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1 text-xs">
          <span className="text-neutral-400">صفحه</span>
          <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 font-bold text-amber-400">
            {currentPage}
          </span>
          <span className="text-neutral-400">از {totalPages}</span>
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}