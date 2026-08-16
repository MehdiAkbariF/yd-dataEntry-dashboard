'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BrandListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2, Award, CheckCircle2, XCircle } from 'lucide-react';
import { getMediaUrl } from '@/lib/config';

interface BrandTableProps {
  brands: BrandListItem[];
  isLoading: boolean;
  onConfirmToggle: (id: string, currentStatus: boolean | null) => void;
  onDelete: (id: string) => void;
  confirmingId: string | null;
}

export default function BrandTable({
  brands,
  isLoading,
  onConfirmToggle,
  onDelete,
  confirmingId,
}: BrandTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست برندها...</span>
        </div>
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ برندی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">لوگو</th>
            <th className="p-4">نام برند / انگلیسی</th>
            <th className="p-4">کشور</th>
            <th className="p-4 text-center">صفحه اصلی</th>
            <th className="p-4 text-center">تایید مدیریت</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {brands.map((brand) => {
            // ⚠️ استفاده از کانفیگ مرکزی برای ساخت آدرس معتبر تصویر
            const imageUrl = getMediaUrl(brand.image);

            return (
              <tr key={brand.id} className="hover:bg-neutral-800/30 transition-all">
                {/* لوگو */}
                <td className="p-4">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={brand.imageAlt || brand.name}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    ) : (
                      <Award className="h-5 w-5 text-amber-500/70" />
                    )}
                  </div>
                </td>

                {/* نام و انگلیسی */}
                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{brand.name}</span>
                    {brand.englishTitle && (
                      <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right truncate">
                        {brand.englishTitle}
                      </span>
                    )}
                  </div>
                </td>

                {/* کشور */}
                <td className="p-4 text-neutral-300">
                  <span>{brand.country || '---'}</span>
                </td>

                {/* صفحه اصلی */}
                <td className="p-4 text-center">
                  <Badge variant={brand.isInMain ? 'warning' : 'neutral'} size="sm">
                    {brand.isInMain ? 'صفحه اصلی' : 'عادی'}
                  </Badge>
                </td>

                {/* وضعیت تایید ConfirmBrand */}
                <td className="p-4 text-center">
                  <button
                    onClick={() => onConfirmToggle(brand.id, brand.isConfirmed)}
                    disabled={confirmingId === brand.id}
                    className="inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {confirmingId === brand.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : brand.isConfirmed ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>تاییدشده</span>
                      </Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">
                        <XCircle className="h-3 w-3 text-neutral-500" />
                        <span>در انتظار تایید</span>
                      </Badge>
                    )}
                  </button>
                </td>

                {/* وضعیت نمایش */}
                <td className="p-4 text-center">
                  <Badge variant={brand.isActive ? 'success' : 'danger'} size="sm">
                    {brand.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </td>

                {/* عملیات */}
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/brands/view/${brand.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده برند"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/brands/edit/${brand.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش برند"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onDelete(brand.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف برند"
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