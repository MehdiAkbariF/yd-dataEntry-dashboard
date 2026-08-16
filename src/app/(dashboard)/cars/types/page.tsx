'use client';

import { useState } from 'react';
import Link from 'next/link';
import CarSubNav from '@/features/cars/components/CarSubNav';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useDeleteCarType } from '@/features/cars/hooks/useCars';
import { carService } from '@/services/carService';
import { useFilterStore } from '@/store/useFilterStore';
import { useQuery } from '@tanstack/react-query';
import Badge from '@/components/ui/Badge';
import { Plus, Layers, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function CarTypesPage() {
  const { carTypeFilters, setCarTypeFilter } = useFilterStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: carTypes = [], isLoading } = useQuery({
    queryKey: ['car-types', carTypeFilters],
    queryFn: () => carService.getCarTypes(carTypeFilters.name),
  });

  const deleteMutation = useDeleteCarType();

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => {
        toast.success('نوع خودرو با موفقیت حذف شد.');
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
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">انواع خودرو (CarTypes)</h1>
            <p className="text-xs text-neutral-400">مدیریت دسته‌بندی پلتفرم‌های خودرویی (مانند خانواده پراید، پژو...)</p>
          </div>
        </div>

        <Link
          href="/cars/types/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Plus className="h-4 w-4" />
          <span>تعریف نوع خودرو جدید</span>
        </Link>
      </div>

      {/* نوار تب‌های زیرمجموعه */}
      <CarSubNav />

      {/* جدول انواع خودرو */}
      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      ) : (
        <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
              <tr>
                <th className="p-4">نام نوع خودرو / انگلیسی</th>
                <th className="p-4">شرکت خودروساز</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4 text-center">وضعیت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {carTypes.map((t: any) => (
                <tr key={t.id} className="hover:bg-neutral-800/30 transition-all">
                  <td className="p-4 font-bold text-white">
                    <span>{t.name}</span>
                    {t.englishTitle && (
                      <span className="block font-mono text-[10px] text-neutral-500 dir-ltr text-right">
                        {t.englishTitle}
                      </span>
                    )}
                  </td>

                  <td className="p-4 font-bold text-amber-400">
                    {t.carManufacturer?.name || '---'}
                  </td>

                  <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                    {new Date(t.createDate).toLocaleDateString('fa-IR')}
                  </td>

                  <td className="p-4 text-center">
                    <Badge variant={t.isActive ? 'success' : 'danger'} size="sm">
                      {t.isActive ? 'فعال' : 'غیرفعال'}
                    </Badge>
                  </td>

                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Link
                        href={`/cars/types/view/${t.id}`}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                        title="مشاهده"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/cars/types/edit/${t.id}`}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                        title="ویرایش"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      <button
                        onClick={() => setDeleteId(t.id)}
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
      )}

      {/* مودال حذف */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="حذف نوع خودرو"
        description="آیا از حذف این نوع خودرو اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
}