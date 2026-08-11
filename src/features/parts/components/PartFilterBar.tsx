'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { partService } from '@/services/partService';
import { userService } from '@/services/userService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface PartFilterBarProps {
  name: string;
  setName: (val: string) => void;
  englishTitle: string;
  setEnglishTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  partCategoryId: string;
  setPartCategoryId: (val: string) => void;
  creatorId: string;
  setCreatorId: (val: string) => void;
  updaterId: string;
  setUpdaterId: (val: string) => void;
  hasSeo: string;
  setHasSeo: (val: string) => void;
  hasDescription: string;
  setHasDescription: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function PartFilterBar({
  name,
  setName,
  englishTitle,
  setEnglishTitle,
  description,
  setDescription,
  partCategoryId,
  setPartCategoryId,
  creatorId,
  setCreatorId,
  updaterId,
  setUpdaterId,
  hasSeo,
  setHasSeo,
  hasDescription,
  setHasDescription,
  isActive,
  setIsActive,
  onReset,
}: PartFilterBarProps) {
  // دریافت لیست دسته‌بندی‌های قطعات
  const fetchPartCategories = async (q: string) => {
    const categories = await partService.getPartCategoriesName(q);
    return categories.map((c: any) => ({
      value: c.id,
      label: c.name,
    }));
  };

  // دریافت لیست کاربران برای ایجادکننده/ویرایش‌کننده
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
          <span>فیلتر و جستجوی کامل قطعات پایه (Part Filters)</span>
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
        {/* ۱. نام قطعه */}
        <Input
          label="نام قطعه (فارسی)"
          placeholder="مثال: سنسور اکسیژن"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        {/* ۲. عنوان انگلیسی */}
        <Input
          label="عنوان انگلیسی"
          placeholder="oxygen-sensor"
          value={englishTitle}
          onChange={(e) => setEnglishTitle(e.target.value)}
          dir="ltr"
        />

        {/* ۳. سرچ در توضیحات */}
        <Input
          label="متن توضیحات"
          placeholder="سرچ در متن شرح قطعه..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* ۴. دسته‌بندی قطعه */}
        <AsyncSelect
          label="دسته‌بندی قطعه"
          placeholder="انتخاب دسته‌بندی..."
          value={partCategoryId}
          onChange={setPartCategoryId}
          fetchOptions={fetchPartCategories}
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

        {/* ۷. وضعیت داشتن سئو */}
        <Select
          label="وضعیت سئو (HasSeo)"
          value={hasSeo}
          onChange={(e) => setHasSeo(e.target.value)}
          options={[
            { value: '', label: 'همه' },
            { value: 'true', label: 'دارد' },
            { value: 'false', label: 'ندارد' },
          ]}
        />

        {/* ۸. وضعیت داشتن توضیحات */}
        <Select
          label="وضعیت توضیحات"
          value={hasDescription}
          onChange={(e) => setHasDescription(e.target.value)}
          options={[
            { value: '', label: 'همه' },
            { value: 'true', label: 'دارد' },
            { value: 'false', label: 'ندارد' },
          ]}
        />

        {/* ۹. وضعیت فعال/غیرفعال */}
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