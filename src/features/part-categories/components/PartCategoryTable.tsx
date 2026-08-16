'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PartCategoryListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2, Layers as LayersIcon } from 'lucide-react';
import { getMediaUrl } from '@/lib/config';

// دریافت BASE_URL از env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

interface PartCategoryTableProps {
  categories: PartCategoryListItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export default function PartCategoryTable({
  categories,
  isLoading,
  onDelete,
}: PartCategoryTableProps) {
  // استفاده از BASE_URL به جای هاردکد
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${BASE_URL}${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست دسته‌بندی‌ها...</span>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ دسته‌بندی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">تصویر/آیکون</th>
            <th className="p-4">نام دسته‌بندی / انگلیسی</th>
            <th className="p-4">والد (Parent)</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {categories.map((category) => {
            const imageUrl = getMediaUrl(category.thumbnail || category.icon);

            return (
              <tr key={category.id} className="hover:bg-neutral-800/30 transition-all">
                <td className="p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={category.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <LayersIcon className="h-5 w-5 text-amber-500/70" />
                    )}
                  </div>
                </td>

                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{category.name}</span>
                    {category.englishTitle && (
                      <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right truncate">
                        {category.englishTitle}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-neutral-400">
                  {category.parent ? (
                    <Badge variant="neutral" size="sm">{category.parent}</Badge>
                  ) : (
                    <span className="text-neutral-600 text-[11px]">دسته‌بندی اصلی</span>
                  )}
                </td>

                <td className="p-4 text-neutral-300">
                  <span>{category.creator || category.updater || 'سیستم'}</span>
                </td>

                <td className="p-4 text-center">
                  <Badge variant={category.isActive ? 'success' : 'danger'} size="sm">
                    {category.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </td>

                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/parts/categories/view/${category.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده جزئیات"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/parts/categories/edit/${category.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش دسته‌بندی"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onDelete(category.id)}
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