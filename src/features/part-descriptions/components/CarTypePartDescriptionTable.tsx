'use client';

import Link from 'next/link';
import { CarTypePartDescriptionListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import { Edit, Trash2, Eye, Loader2, FileText } from 'lucide-react';

interface CarTypePartDescriptionTableProps {
  items: CarTypePartDescriptionListItem[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  isTogglingId: string | null;
}

export default function CarTypePartDescriptionTable({
  items,
  isLoading,
  onToggleStatus,
  onDelete,
  isTogglingId,
}: CarTypePartDescriptionTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت توضیحات نوع خودرو...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ توضیحات تخصصی برای نوع خودرو یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">نام قطعه</th>
            <th className="p-4">نوع خودرو (CarType)</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-800/30 transition-all">
              <td className="p-4 font-bold text-amber-400">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-neutral-500" />
                  <span>{item.part}</span>
                </div>
              </td>

              <td className="p-4">
                {item.carType ? (
                  <Badge variant="info" size="sm">
                    {item.carType.name} ({item.carType.englishTitle})
                  </Badge>
                ) : (
                  <span className="text-neutral-500">---</span>
                )}
              </td>

              <td className="p-4 text-neutral-300">
                <span>{item.creator || 'سیستم'}</span>
              </td>

              <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                {new Date(item.createDate).toLocaleDateString('fa-IR')}
              </td>

              <td className="p-4 text-center">
                <Switch
                  checked={item.isActive}
                  onChange={() => onToggleStatus(item.id, item.isActive)}
                  isLoading={isTogglingId === item.id}
                />
              </td>

              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Link
                    href={`/part-descriptions/view/${item.id}?type=carType`}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                    title="مشاهده"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  <Link
                    href={`/part-descriptions/edit/${item.id}?type=carType`}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                    title="ویرایش"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>

                  <button
                    onClick={() => onDelete(item.id)}
                    className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                    title="حذف"
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