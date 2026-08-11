'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PartListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2, Cpu } from 'lucide-react';

interface PartTableProps {
  parts: PartListItem[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  isTogglingId: string | null;
}

export default function PartTable({
  parts,
  isLoading,
  onToggleStatus,
  onDelete,
  isTogglingId,
}: PartTableProps) {
  const getIconUrl = (path: string | null) => {
    if (!path || path === '/noimage.webp') return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست قطعات...</span>
        </div>
      </div>
    );
  }

  if (parts.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ قطعه‌ای یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">آیکون</th>
            <th className="p-4">نام قطعه / انگلیسی</th>
            <th className="p-4">دسته‌بندی</th>
            <th className="p-4 text-center">سود یدک‌چی (%)</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {parts.map((part) => {
            const iconUrl = getIconUrl(part.icon);

            return (
              <tr key={part.id} className="hover:bg-neutral-800/30 transition-all">
                {/* آیکون */}
                <td className="p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {iconUrl ? (
                      <Image
                        src={iconUrl}
                        alt={part.name}
                        fill
                        className="object-contain p-1.5"
                        unoptimized
                      />
                    ) : (
                      <Cpu className="h-5 w-5 text-amber-500/70" />
                    )}
                  </div>
                </td>

                {/* نام و انگلیسی */}
                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{part.name}</span>
                    {part.englishTitle && (
                      <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right truncate">
                        {part.englishTitle}
                      </span>
                    )}
                  </div>
                </td>

                {/* دسته‌بندی */}
                <td className="p-4">
                  <Badge variant="info" size="sm">
                    {part.partCategory || 'بدون دسته‌بندی'}
                  </Badge>
                </td>

                {/* درصد سود */}
                <td className="p-4 text-center font-mono text-amber-400 font-bold">
                  {part.yadakchiProfitPercent}%
                </td>

                {/* ایجادکننده */}
                <td className="p-4 text-neutral-300">
                  <span>{part.creator || 'سیستم'}</span>
                </td>

                {/* وضعیت */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => onToggleStatus(part.id, part.isActive)}
                    disabled={isTogglingId === part.id}
                    className="inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTogglingId === part.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : (
                      <Badge variant={part.isActive ? 'success' : 'danger'} size="sm">
                        {part.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    )}
                  </button>
                </td>

                {/* عملیات */}
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/parts/view/${part.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده جزئیات قطعه"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/parts/edit/${part.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش قطعه"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onDelete(part.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف قطعه"
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