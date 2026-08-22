'use client';

import Image from 'next/image';
import { BlogCategoryListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { getMediaUrl } from '@/lib/config';
import { Edit, Trash2, Layers, Loader2 } from 'lucide-react';

interface BlogCategoryTableProps {
  categories: BlogCategoryListItem[];
  isLoading: boolean;
  onEdit: (category: BlogCategoryListItem) => void;
  onDelete: (id: string) => void;
}

export default function BlogCategoryTable({
  categories,
  isLoading,
  onEdit,
  onDelete,
}: BlogCategoryTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت دسته‌بندی‌های بلاگ...</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ دسته‌بندی بلاگی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">آیکون</th>
            <th className="p-4">عنوان دسته‌بندی</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {categories.map((cat) => {
            const iconUrl = getMediaUrl(cat.iconUrl);

            return (
              <tr key={cat.id} className="hover:bg-neutral-800/30 transition-all">
                <td className="p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {iconUrl ? (
                      <Image src={iconUrl} alt={cat.title} fill className="object-contain p-1" unoptimized />
                    ) : (
                      <Layers className="h-5 w-5 text-amber-500/70" />
                    )}
                  </div>
                </td>

                <td className="p-4 font-bold text-white max-w-xs truncate">{cat.title}</td>

                <td className="p-4 text-neutral-300">
                  {cat.creator?.fullName || cat.creator?.userName || 'سیستم'}
                </td>

                <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                  {new Date(cat.createDate).toLocaleDateString('fa-IR')}
                </td>

                <td className="p-4 text-center">
                  <Badge variant={cat.isActive ? 'success' : 'danger'} size="sm">
                    {cat.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </td>

                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onEdit(cat)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش دسته‌بندی"
                    >
                      <Edit className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => onDelete(cat.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف دسته‌بندی"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}