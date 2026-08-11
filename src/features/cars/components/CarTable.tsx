'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CarListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2, Car as CarIcon } from 'lucide-react';

interface CarTableProps {
  cars: CarListItem[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export default function CarTable({ cars, isLoading, onDelete }: CarTableProps) {
  const getCoverUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست مدل‌های خودرو...</span>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ خودرویی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">کاور</th>
            <th className="p-4">مدل خودرو / انگلیسی</th>
            <th className="p-4">خودروساز / نوع</th>
            <th className="p-4 text-center">گیربکس</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4 text-center">وضعیت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {cars.map((car) => {
            const coverUrl = getCoverUrl(car.cover);

            return (
              <tr key={car.id} className="hover:bg-neutral-800/30 transition-all">
                {/* کاور */}
                <td className="p-4">
                  <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={car.coverAlt || car.model}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <CarIcon className="h-6 w-6 text-neutral-600" />
                    )}
                  </div>
                </td>

                {/* مدل و انگلیسی */}
                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{car.model}</span>
                    {car.englishTitle && (
                      <span className="font-mono text-[10px] text-neutral-500 dir-ltr text-right truncate">
                        {car.englishTitle}
                      </span>
                    )}
                  </div>
                </td>

                {/* خودروساز و CarType */}
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-amber-400">
                      {car.carManufacturer?.name || '---'}
                    </span>
                    {car.carType && (
                      <span className="text-[10px] text-neutral-400">
                        نوع: {car.carType.name}
                      </span>
                    )}
                  </div>
                </td>

                {/* گیربکس */}
                <td className="p-4 text-center">
                  <Badge variant={car.isAutomatic ? 'info' : 'neutral'} size="sm">
                    {car.isAutomatic ? 'اتوماتیک' : 'دنده‌ای'}
                  </Badge>
                </td>

                {/* ایجادکننده */}
                <td className="p-4 text-neutral-300">
                  <span>{car.creator?.fullName || car.creator?.userName || 'سیستم'}</span>
                </td>

                {/* وضعیت */}
                <td className="p-4 text-center">
                  <Badge variant={car.isActive ? 'success' : 'danger'} size="sm">
                    {car.isActive ? 'فعال' : 'غیرفعال'}
                  </Badge>
                </td>

                {/* عملیات */}
                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <Link
                      href={`/cars/view/${car.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده جزئیات خودرو"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/cars/edit/${car.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش خودرو"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onDelete(car.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف خودرو"
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