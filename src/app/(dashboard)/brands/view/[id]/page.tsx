'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetBrandById, useDeleteBrand, useUpdateBrand } from '@/features/brands/hooks/useBrands';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Edit, Trash2, Award, Calendar, User, Loader2 } from 'lucide-react';

export default function ViewBrandPage() {
  const params = useParams();
  const brandId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: brand, isLoading, isError } = useGetBrandById(brandId);
  const deleteMutation = useDeleteBrand();
  const updateMutation = useUpdateBrand();

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  const handleToggleStatus = (newStatus: boolean) => {
    if (!brand) return;
    const formData = new FormData();
    formData.append('Id', brand.id);
    formData.append('Name', brand.name);
    formData.append('EnglishTitle', brand.englishTitle || '');
    formData.append('IsActive', String(newStatus));

    updateMutation.mutate(formData, {
      onSuccess: () => toast.success('وضعیت نمایش برند تغییر یافت.'),
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت اطلاعات...</span>
      </div>
    );
  }

  if (isError || !brand) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">برند یافت نشد.</span>
      </div>
    );
  }

  const imageUrl = getImageUrl(brand.image);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/brands"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{brand.name}</h1>
              <Badge variant={brand.isConfirmed ? 'success' : 'neutral'} size="sm">
                {brand.isConfirmed ? 'تایید شده' : 'در انتظار تایید'}
              </Badge>
            </div>
            <p className="text-xs text-amber-500 font-mono mt-0.5 dir-ltr text-right">
              {brand.englishTitle || '---'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
            <Switch
              checked={brand.isActive}
              onChange={handleToggleStatus}
              isLoading={updateMutation.isPending}
              label={brand.isActive ? 'فعال' : 'غیرفعال'}
            />
          </div>

          <Link
            href={`/brands/edit/${brand.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>ویرایش</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
          {imageUrl ? (
            <Image src={imageUrl} alt={brand.name} fill className="object-contain p-4" unoptimized />
          ) : (
            <Award className="h-16 w-16 text-amber-500/50" />
          )}
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-amber-500">مشخصات اصلی</h3>
          <div className="space-y-3 text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">نمایش در صفحه اصلی:</span>
              <span className="font-bold">{brand.isInMain ? 'بله' : 'خیر'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">ایجادکننده:</span>
              <span className="font-bold">{brand.creator?.fullName || brand.creator?.userName || 'سیستم'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">تاریخ ثبت:</span>
              <span className="font-mono dir-ltr">{new Date(brand.createDate).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف برند"
        description="آیا از حذف این برند اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate(brandId)}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}