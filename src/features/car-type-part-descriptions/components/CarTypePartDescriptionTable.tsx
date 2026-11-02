'use client';

import Link from 'next/link';
import { CarTypePartDescriptionListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2 } from 'lucide-react';

interface Props {
  items: CarTypePartDescriptionListItem[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  isTogglingId: string | null;
  currentPage?: number;
  pageSize?: number;
}

export default function CarTypePartDescriptionTable({
  items,
  isLoading,
  onToggleStatus,
  onDelete,
  isTogglingId,
  currentPage = 1,
  pageSize = 30,
}: Props) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ آیتمی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4 text-center w-14">ردیف</th>
            <th className="p-4">قطعه</th>
            <th className="p-4">نوع خودرو</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4">ویرایش‌کننده</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {items.map((item, index) => {
            const rowNumber = (currentPage - 1) * pageSize + index + 1;
            return (
              <tr key={item.id} className="hover:bg-neutral-800/30 transition-all">
                <td className="p-4 text-center font-mono text-[12px] font-bold text-neutral-400">
                  {rowNumber}
                </td>
                <td className="p-4 font-bold text-white">{item.part}</td>
                <td className="p-4 text-neutral-300">
                  {item.carType?.name || '—'}
                  {item.carType?.englishTitle && (
                    <span className="block font-mono text-[10px] text-neutral-500 dir-ltr text-right">
                      {item.carType.englishTitle}
                    </span>
                  )}
                </td>
                <td className="p-4 text-neutral-300">{item.creator || 'سیستم'}</td>
                <td className="p-4 text-neutral-300">{item.updater || '—'}</td>
                <td className="p-4 text-neutral-400 dir-ltr text-right font-mono text-[11px]">
                  {new Date(item.createDate).toLocaleDateString('fa-IR')}
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => onToggleStatus(item.id, item.isActive)}
                    disabled={isTogglingId === item.id}
                    className="inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTogglingId === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : (
                      <Badge variant={item.isActive ? 'success' : 'danger'} size="sm">
                        {item.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    )}
                  </button>
                </td>
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/car-type-part-descriptions/view/${item.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/car-type-part-descriptions/edit/${item.id}`}
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}