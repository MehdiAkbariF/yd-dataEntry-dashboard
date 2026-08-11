'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGetPartCarDescriptionById, useDeletePartCarDescription, useTogglePartCarDescriptionStatus } from '@/features/part-descriptions/hooks/usePartDescriptions';
import SEOPreview from '@/components/common/SEOPreview';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Edit, Trash2, FileText, Sparkles, Loader2 } from 'lucide-react';

export default function ViewPartDescriptionPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data, isLoading, isError } = useGetPartCarDescriptionById(id);
  const deleteMutation = useDeletePartCarDescription();
  const toggleMutation = useTogglePartCarDescriptionStatus();

  const handleToggleStatus = (newStatus: boolean) => {
    toggleMutation.mutate(
      { id, isActive: newStatus },
      {
        onSuccess: () => toast.success('وضعیت نمایش تغییر یافت.'),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('توضیحات با موفقیت حذف شد.');
        router.push('/part-descriptions');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت جزئیات...</span>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">اطلاعات یافت نشد.</span>
      </div>
    );
  }

  // ⚠️ استخراج ایمن نام قطعه از آبجکت جهت جلوگیری از ارور ری‌اکت
  const partDisplayName = typeof data.part === 'object' ? data.part?.name : data.part || 'قطعه مشخص‌نشده';

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/part-descriptions"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">توضیحات تخصصی: {partDisplayName}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
            <Switch
              checked={data.isActive}
              onChange={handleToggleStatus}
              isLoading={toggleMutation.isPending}
              label={data.isActive ? 'فعال' : 'غیرفعال'}
            />
          </div>

          <Link
            href={`/part-descriptions/edit/${data.id}?type=car`}
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

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <span className="text-xs font-bold text-amber-500">مدل‌های خودرو مرتبط:</span>
        <div className="flex flex-wrap gap-1.5">
          {data.cars && data.cars.map((c: any) => (
            <Badge key={c.id} variant="neutral" size="sm">{c.model}</Badge>
          ))}
        </div>
      </div>

      {data.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>متن کامل توضیحات</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: data.description }}
          />
        </div>
      )}

      <SEOPreview
        title={data.seoInformation?.title || partDisplayName}
        description={data.seoInformation?.description}
        canonicalUrl={data.seoInformation?.canonicalUrl}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف توضیحات"
        description="آیا از حذف اطمینان دارید؟"
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}