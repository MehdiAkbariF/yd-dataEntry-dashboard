'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetPartById, useDeletePart } from '@/features/parts/hooks/useParts';
import SEOPreview from '@/components/common/SEOPreview';
import Badge from '@/components/ui/Badge';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import {
  ArrowRight, Edit, Trash2, Cpu, Sparkles, HelpCircle,
  Calendar, User, Cpu as CpuIcon, Loader2
} from 'lucide-react';

export default function ViewPartPage() {
  const params = useParams();
  const router = useRouter();
  const partId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: part, isLoading, isError } = useGetPartById(partId);
  const deleteMutation = useDeletePart();

  const getIconUrl = (path: string | null) => {
    if (!path || path === '/noimage.webp') return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  const handleDelete = () => {
    deleteMutation.mutate(partId, {
      onSuccess: () => {
        router.push('/parts');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت جزئیات قطعه...</span>
      </div>
    );
  }

  if (isError || !part) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات قطعه.</span>
        <span className="text-xs text-neutral-500">قطعه یافت نشد یا حذف شده است.</span>
      </div>
    );
  }

  const iconUrl = getIconUrl(part.icon);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* هدر بالایی */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/parts"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{part.name}</h1>
              <Badge variant={part.isActive ? 'success' : 'danger'} size="sm">
                {part.isActive ? 'فعال' : 'غیرفعال'}
              </Badge>
            </div>
            <p className="text-xs text-amber-500 font-mono mt-0.5 dir-ltr text-right">
              {part.englishTitle || '---'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/parts/edit/${part.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>ویرایش قطعه</span>
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
        <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
          {iconUrl ? (
            <Image src={iconUrl} alt={part.name} fill className="object-contain p-4" unoptimized />
          ) : (
            <CpuIcon className="h-16 w-16 text-amber-500/50" />
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-neutral-800 pb-4">
            <div>
              <span className="text-[11px] text-neutral-500 block">دسته‌بندی:</span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {part.partCategory?.name || '---'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-neutral-500 block">درصد سود یدک‌چی:</span>
              <span className="text-xs font-mono font-bold text-amber-400 block mt-0.5">
                {part.yadakchiProfitPercent}%
              </span>
            </div>
          </div>

          {/* استاندارد عنوان‌نویسی */}
          {part.productNameEntryStandard && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs">
              <span className="text-amber-500 font-bold flex items-center gap-1.5 mb-1">
                <HelpCircle className="h-3.5 w-3.5" /> استاندارد عنوان‌نویسی تیم محتوا:
              </span>
              <p className="text-neutral-300 font-mono leading-relaxed">{part.productNameEntryStandard}</p>
            </div>
          )}

          {/* ویژگی‌ها */}
          <div>
            <span className="text-xs font-bold text-neutral-400 block mb-2">ویژگی‌های تعریف‌شده ({part.properties?.length || 0}):</span>
            <div className="flex flex-wrap gap-1.5">
              {part.properties && part.properties.length > 0 ? (
                part.properties.map((p: any) => (
                  <Badge key={p.id} variant="neutral" size="sm">
                    {p.name}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-neutral-500">ویژگی متصلی یافت نشد.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* توضیحات HTML */}
      {part.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>توضیحات کامل قطعه</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: part.description }}
          />
        </div>
      )}

      {/* سئو و حسابرسی */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOPreview
          title={part.seoInformation?.title || part.name}
          description={part.seoInformation?.description}
          canonicalUrl={part.seoInformation?.canonicalUrl || part.name.toLowerCase().replace(/\s+/g, '-')}
        />

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3 text-xs">
          <h3 className="font-bold text-amber-500">حسابرسی ثبت</h3>
          <div className="space-y-2 text-neutral-300">
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">ایجادکننده:</span>
              <span className="font-bold">{part.creator || 'سیستم'}</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500">آخرین ویرایش‌کننده:</span>
              <span className="font-bold">{part.updater || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">تاریخ ثبت:</span>
              <span className="font-mono dir-ltr">{new Date(part.createDate).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف قطعه"
        description="آیا از حذف این قطعه پایه اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}