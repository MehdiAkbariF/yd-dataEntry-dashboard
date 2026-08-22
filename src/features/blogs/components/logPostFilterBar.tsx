'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { AsyncSelect } from '@/components/ui/AsyncSelect';
import { blogService } from '@/services/blogService';
import { userService } from '@/services/userService';
import { Filter, RotateCcw, Search } from 'lucide-react';

interface BlogPostFilterBarProps {
  title: string;
  setTitle: (val: string) => void;
  blogCategoryId: string;
  setBlogCategoryId: (val: string) => void;
  userId: string;
  setUserId: (val: string) => void;
  isActive: string;
  setIsActive: (val: string) => void;
  onReset: () => void;
}

export default function BlogPostFilterBar({
  title,
  setTitle,
  blogCategoryId,
  setBlogCategoryId,
  userId,
  setUserId,
  isActive,
  setIsActive,
  onReset,
}: BlogPostFilterBarProps) {
  const fetchCategories = async (q: string) => {
    const res = await blogService.getCategories({ title: q, pageSize: 50 });
    return (res.items || []).map((c) => ({ value: c.id, label: c.title }));
  };

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
          <span>فیلتر و جستجوی مقالات بلاگ (Blog Posts)</span>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-amber-400 transition-all"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>ریست فیلترها</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
        <Input
          label="عنوان مقاله"
          placeholder="جستجو در عنوان مقاله..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Search className="h-4 w-4" />}
        />

        <AsyncSelect
          label="دسته‌بندی بلاگ"
          placeholder="انتخاب دسته‌بندی..."
          value={blogCategoryId}
          onChange={setBlogCategoryId}
          fetchOptions={fetchCategories}
        />

        <AsyncSelect
          label="نویسنده (Creator)"
          placeholder="انتخاب کاربر..."
          value={userId}
          onChange={setUserId}
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