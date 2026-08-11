'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { userService } from '@/services/userService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface PartCategoryFilterBarProps {
  name: string;
  setName: (val: string) => void;
  englishTitle: string;
  setEnglishTitle: (val: string) => void;
  parent: string;
  setParent: (val: string) => void;
  thumbnailAlt: string;
  setThumbnailAlt: (val: string) => void;
  creatorId: string;
  setCreatorId: (val: string) => void;
  updaterId: string;
  setUpdaterId: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function PartCategoryFilterBar({
  name,
  setName,
  englishTitle,
  setEnglishTitle,
  parent,
  setParent,
  thumbnailAlt,
  setThumbnailAlt,
  creatorId,
  setCreatorId,
  updaterId,
  setUpdaterId,
  isActive,
  setIsActive,
  onReset,
}: PartCategoryFilterBarProps) {
  // دریافت لیست کاربران برای فیلتر ایجادکننده و ویرایش‌کننده
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
          <span>فیلتر و جستجوی کامل دسته‌بندی قطعات (PartCategory Filters)</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>ریست فیلترها</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* ۱. نام دسته‌بندی */}
        <Input
          label="نام دسته‌بندی (فارسی)"
          placeholder="مثال: سیستم موتور"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        {/* ۲. عنوان انگلیسی */}
        <Input
          label="عنوان انگلیسی"
          placeholder="engine-system"
          value={englishTitle}
          onChange={(e) => setEnglishTitle(e.target.value)}
          dir="ltr"
        />

        {/* ۳. عنوان والد */}
        <Input
          label="دسته‌بندی والد (Parent)"
          placeholder="جستجو در عنوان والد..."
          value={parent}
          onChange={(e) => setParent(e.target.value)}
        />

        {/* ۴. متن Alt کاور */}
        <Input
          label="متن جایگزین کاور (ThumbnailAlt)"
          placeholder="متن سئوی تصویر کاور..."
          value={thumbnailAlt}
          onChange={(e) => setThumbnailAlt(e.target.value)}
        />

        {/* ۵. ایجادکننده */}
        <AsyncSelect
          label="ایجادکننده (Creator)"
          placeholder="انتخاب کاربر..."
          value={creatorId}
          onChange={setCreatorId}
          fetchOptions={fetchUsers}
        />

        {/* ۶. ویرایش‌کننده */}
        <AsyncSelect
          label="ویرایش‌کننده (Updater)"
          placeholder="انتخاب کاربر..."
          value={updaterId}
          onChange={setUpdaterId}
          fetchOptions={fetchUsers}
        />

        {/* ۷. وضعیت نمایش */}
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