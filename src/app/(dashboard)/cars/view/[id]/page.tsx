'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetCarById, useDeleteCar, useUpdateCar } from '@/features/cars/hooks/useCars';
import SEOPreview from '@/components/common/SEOPreview';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowRight, Edit, Trash2, Car, Sparkles,
  Calendar, User, Car as CarIcon, Loader2
} from 'lucide-react';

export default function ViewCarPage() {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: car, isLoading, isError } = useGetCarById(carId);
  const deleteMutation = useDeleteCar();
  const updateMutation = useUpdateCar();

  const getCoverUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  const handleToggleStatus = (newStatus: boolean) => {
    if (!car) return;
    const formData = new FormData();
    formData.append('Id', car.id);
    formData.append('Model', car.model);
    formData.append('EnglishTitle', car.englishTitle || '');
    formData.append('IsActive', String(newStatus));

    updateMutation.mutate(formData, {
      onSuccess: () => toast.success('وضعیت نمایش خودرو تغییر یافت.'),
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(carId, {
      onSuccess: () => {
        toast.success('مدل خودرو با موفقیت حذف شد.');
        router.push('/cars');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات خودرو...</span>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات خودرو.</span>
      </div>
    );
  }

  const coverUrl = getCoverUrl(car.cover);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* هدر بالایی */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{car.model}</h1>
            </div>
            <p className="text-xs text-amber-500 font-mono mt-0.5 dir-ltr text-right">
              {car.englishTitle || '---'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
            <Switch
              checked={car.isActive}
              onChange={handleToggleStatus}
              isLoading={updateMutation.isPending}
              label={car.isActive ? 'فعال' : 'غیرفعال'}
            />
          </div>

          <Link
            href={`/cars/edit/${car.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>ویرایش خودرو</span>
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 className="h-4 w-4" />
            <span>حذف</span>
          </button>
        </div>
      </div>

      {/* اطلاعات اصلی */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
          {coverUrl ? (
            <Image src={coverUrl} alt={car.model} fill className="object-contain p-2" unoptimized />
          ) : (
            <CarIcon className="h-16 w-16 text-neutral-700" />
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-amber-500 mb-2">مشخصات اصلی خودرو</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[11px] text-neutral-500 block">شرکت خودروساز:</span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {car.carManufacturer?.name ? `${car.carManufacturer.name} (${car.carManufacturer.englishTitle || ''})` : '---'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 block">نوع خودرو (CarType):</span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {car.carType?.name || '---'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 block">نوع گیربکس:</span>
              <Badge variant={car.isAutomatic ? 'info' : 'neutral'} size="sm" className="mt-1">
                {car.isAutomatic ? 'اتوماتیک' : 'دنده‌ای (دستی)'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* توضیحات HTML */}
      {car.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>توضیحات کامل و مشخصات فنی خودرو</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: car.description }}
          />
        </div>
      )}

      {/* سئو و حسابرسی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOPreview
          title={car.seoInformation?.title || car.model}
          description={car.seoInformation?.description}
          canonicalUrl={car.seoInformation?.canonicalUrl || car.model.toLowerCase().replace(/\s+/g, '-')}
        />

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3 text-xs">
          <h3 className="font-bold text-amber-500">حسابرسی ثبت</h3>
          <div className="space-y-2 text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">ایجادکننده:</span>
              <span className="font-bold">{car.creator?.fullName || car.creator?.userName || 'سیستم'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">آخرین ویرایش‌کننده:</span>
              <span className="font-bold">{car.updater?.fullName || car.updater?.userName || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">تاریخ ثبت:</span>
              <span className="font-mono dir-ltr">{new Date(car.createDate).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف مدل خودرو"
        description="آیا از حذف این مدل خودرو اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}