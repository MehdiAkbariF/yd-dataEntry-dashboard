'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CarSubNav from '@/features/cars/components/CarSubNav';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useDeleteCarManufacturer } from '@/features/cars/hooks/useCars';
import { carService } from '@/services/carService';
import { useFilterStore } from '@/store/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import Badge from '@/components/ui/Badge';
import { getMediaUrl } from '@/lib/config';
import { Plus, Factory, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CarManufacturersPage() {
  const { carManufacturerFilters, setCarManufacturerFilter } = useFilterStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: manufacturers = [], isLoading } = useQuery({
    queryKey: ['car-manufacturers', carManufacturerFilters],
    queryFn: () => carService.getCarManufacturers(carManufacturerFilters.name),
  });

  const deleteMutation = useDeleteCarManufacturer();

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('شرکت خودروساز با موفقیت حذف شد.');
        setDeleteId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* هدر صفحه */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Factory className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">شرکت‌های خودروساز (CarManufacturers)</h1>
            <p className="text-xs text-neutral-400">مدیریت برندها و کارخانجات تولیدکننده خودرو</p>
          </div>
        </div>

        <Link
          href="/cars/manufacturers/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف خودروساز جدید</span>
        </Link>
      </div>

      {/* نوار تب‌های زیرمجموعه */}
      <CarSubNav />

      {/* جدول نمایش خودروسازان */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
              <tr>
                <th className="p-4">لوگو</th>
                <th className="p-4">نام خودروساز / انگلیسی</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4 text-center">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {manufacturers.map((m: any) => {
                const iconUrl = getMediaUrl(m.icon);
                return (
                  <tr key={m.id} className="hover:bg-neutral-800/30 transition-all">
                    <td className="p-4">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                        {iconUrl ? (
                          <Image src={iconUrl} alt={m.name} fill className="object-contain p-1" unoptimized />
                        ) : (
                          <Factory className="h-5 w-5 text-amber-500/70" />
                        )}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-white">
                      <span>{m.name}</span>
                      {m.englishTitle && (
                        <span className="block font-mono text-[10px] text-neutral-500 dir-ltr text-right">
                          {m.englishTitle}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                      {new Date(m.createDate).toLocaleDateString('fa-IR')}
                    </td>

                    <td className="p-4 text-center">
                      <Badge variant={m.isActive ? 'success' : 'danger'} size="sm">
                        {m.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Link
                          href={`/cars/manufacturers/view/${m.id}`}
                          className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                          title="مشاهده"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        <Link
                          href={`/cars/manufacturers/edit/${m.id}`}
                          className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                          title="ویرایش"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>

                        <button
                          onClick={() => setDeleteId(m.id)}
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
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف خودروساز"
        description="آیا از حذف این شرکت خودروساز اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}