'use client';

import { TagListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Loader2, Tag as TagIcon } from 'lucide-react';

interface TagTableProps {
  tags: TagListItem[];
  isLoading: boolean;
  onEdit: (tag: TagListItem) => void;
  onDelete: (id: string) => void;
}

export default function TagTable({
  tags,
  isLoading,
  onEdit,
  onDelete,
}: TagTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت برچسب‌ها...</span>
        </div>
      </div>
    );
  }

  if (tags.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ برچسبی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">عنوان برچسب</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-neutral-800/30 transition-all">
              <td className="p-4 font-bold text-amber-400">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-3.5 w-3.5 text-neutral-500" />
                  <span>#{tag.value}</span>
                </div>
              </td>

              <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                {new Date(tag.createDate).toLocaleDateString('fa-IR')}
              </td>

              <td className="p-4 text-center">
                <Badge variant={tag.isActive ? 'success' : 'danger'} size="sm">
                  {tag.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </td>

              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onEdit(tag)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                    title="ویرایش برچسب"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onDelete(tag.id)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                    title="حذف برچسب"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}