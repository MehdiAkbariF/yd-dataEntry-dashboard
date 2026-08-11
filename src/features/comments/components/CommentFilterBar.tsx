'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface CommentFilterBarProps {
  searchedValue: string;
  setSearchedValue: (val: string) => void;
  isConfirmed: string;
  setIsConfirmed: (val: string) => void;
  isIncognito: string;
  setIsIncognito: (val: string) => void;
  onReset: () => void;
}

export default function CommentFilterBar({
  searchedValue,
  setSearchedValue,
  isConfirmed,
  setIsConfirmed,
  isIncognito,
  setIsIncognito,
  onReset,
}: CommentFilterBarProps) {
  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر و جستجوی دیدگاه‌های کاربران</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>ریست فیلترها</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Input
          label="جستجو در متن نظر یا نویسنده"
          placeholder="تایپ کلمه کلیدی..."
          value={searchedValue}
          onChange={(e) => setSearchedValue(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        <Select
          label="وضعیت تایید"
          value={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.value)}
          options={[
            { value: '', label: 'همه وضعیت‌ها' },
            { value: 'true', label: 'تاییدشده' },
            { value: 'false', label: 'در انتظار تایید' },
          ]}
        />

        <Select
          label="ارسال ناشناس"
          value={isIncognito}
          onChange={(e) => setIsIncognito(e.target.value)}
          options={[
            { value: '', label: 'همه' },
            { value: 'true', label: 'ناشناس' },
            { value: 'false', label: 'با نام' },
          ]}
        />
      </div>
    </div>
  );
}