'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { userService } from '@/services/userService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface TagFilterBarProps {
  value: string;
  setValue: (val: string) => void;
  creatorId: string;
  setCreatorId: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function TagFilterBar({
  value,
  setValue,
  creatorId,
  setCreatorId,
  isActive,
  setIsActive,
  onReset,
}: TagFilterBarProps) {
  const fetchUsers = async (query: string) => {
    const users = await userService.getUsers(query);
    return users.map((u) => ({
      value: u.id,
      label: u.fullName ? `${u.fullName} (${u.userName})` : u.userName,
    }));
  };

  return (
    <div className="relative z-30 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
        <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
          <Filter className="h-4 w-4" />
          <span>فیلتر و جستجوی برچسب‌ها (Tag Filters)</span>
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
          label="عنوان برچسب"
          placeholder="مثال: جلوبندی، چراغ جلو..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        <AsyncSelect
          label="ایجادکننده"
          placeholder="انتخاب کاربر..."
          value={creatorId}
          onChange={setCreatorId}
          fetchOptions={fetchUsers}
        />

        <Select
          label="وضعیت نمایش"
          value={isActive}
          onChange={(e) => setIsActive(e.target.value)}
          options={[
            { value: '', label: 'همه وضعیت‌ها' },
            { value: 'true', label: 'فعال' },
            { value: 'false', label: 'غیرفعال' },
          ]}
        />
      </div>
    </div>
  );
}