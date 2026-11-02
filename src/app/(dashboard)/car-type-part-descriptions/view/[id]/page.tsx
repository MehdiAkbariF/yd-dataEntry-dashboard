'use client';

import { useParams } from 'next/navigation';
import { useGetCarTypePartDescriptionById } from '@/features/car-type-part-descriptions/hooks/useCarTypePartDescriptions';

export default function ViewPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetCarTypePartDescriptionById(id);

  if (isLoading) return <p className="text-neutral-400 text-sm">در حال بارگذاری...</p>;
  if (!data) return <p className="text-red-400 text-sm">یافت نشد.</p>;

  return (
    <div className="space-y-4 max-w-3xl">
      <h1 className="text-lg font-bold text-white">مشاهده توضیحات قطعه-خودرو</h1>
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3 text-xs">
        <Row label="قطعه" value={data.partName || data.partId} />
        <Row label="نوع خودرو" value={data.carTypeName || data.carTypeId} />
        <Row label="توضیحات" value={data.description} />
        <Row label="عنوان سئو" value={data.seoInformation?.title || '—'} />
        <Row label="Canonical" value={data.seoInformation?.canonicalUrl || '—'} />
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-neutral-800 pb-2">
      <span className="w-32 text-neutral-400">{label}:</span>
      <span className="text-white flex-1">{value || '—'}</span>
    </div>
  );
}