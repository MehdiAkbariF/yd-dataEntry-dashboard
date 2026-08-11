'use client';

import { PropertyListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Loader2, Sliders } from 'lucide-react';

interface PropertyTableProps {
  properties: PropertyListItem[];
  isLoading: boolean;
  onEdit: (property: PropertyListItem) => void;
  onDelete: (id: string) => void;
}

export default function PropertyTable({
  properties,
  isLoading,
  onEdit,
  onDelete,
}: PropertyTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت ویژگی‌ها...</span>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ ویژگی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">عنوان ویژگی</th>
            <th className="p-4">نوع ورودی</th>
            <th className="p-4">گروه اصلی (Parent)</th>
            <th className="p-4 text-center">اولویت</th>
            <th className="p-4 text-center">ویژگی اصلی</th>
            <th className="p-4 text-center">قابلیت فیلتر</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {properties.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-800/30 transition-all">
              <td className="p-4 font-bold text-white">
                <div className="flex items-center gap-2">
                  <Sliders className="h-3.5 w-3.5 text-amber-500" />
                  <span>{item.name}</span>
                </div>
              </td>

              <td className="p-4 font-mono dir-ltr text-right">
                <Badge variant={item.type === 'MultiSelect' ? 'info' : 'neutral'} size="sm">
                  {item.type}
                </Badge>
              </td>

              <td className="p-4 text-neutral-300">
                {item.propertyParent?.name || 'بدون گروه'}
              </td>

              <td className="p-4 text-center font-mono text-amber-400 font-bold">
                {item.priority}
              </td>

              <td className="p-4 text-center">
                <Badge variant={item.isMain ? 'warning' : 'neutral'} size="sm">
                  {item.isMain ? 'اصلی' : 'عادی'}
                </Badge>
              </td>

              <td className="p-4 text-center">
                <Badge variant={item.isFilter ? 'success' : 'neutral'} size="sm">
                  {item.isFilter ? 'بله' : 'خیر'}
                </Badge>
              </td>

              <td className="p-4 text-center">
                <Badge variant={item.isActive ? 'success' : 'danger'} size="sm">
                  {item.isActive ? 'فعال' : 'غیرفعال'}
                </Badge>
              </td>

              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => onEdit(item)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                    title="ویرایش ویژگی"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                    title="حذف ویژگی"
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