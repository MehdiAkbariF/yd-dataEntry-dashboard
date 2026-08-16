'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { carService } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import SEOPreview from '@/components/common/SEOPreview';
import { ArrowRight, Edit, Layers, Loader2, Sparkles } from 'lucide-react';

export default function ViewCarTypePage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: carType, isLoading } = useQuery({
    queryKey: ['car-type', id],
    queryFn: async () => {
      const list = await carService.getCarTypes();
      return list.find((t: any) => t.id === id);
    },
    enabled: !!id,
  });

  if (isLoading || !carType) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars/types"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold text-white">{carType.name} ({carType.englishTitle})</h1>
        </div>

        <Link
          href={`/cars/types/edit/${carType.id}`}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400"
        >
          <Edit className="h-4 w-4" />
          <span>ویرایش</span>
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 text-xs space-y-3">
        <span className="text-neutral-500 block">شرکت خودروساز مرتبط:</span>
        <span className="font-bold text-amber-400 text-sm block">{carType.carManufacturer?.name || '---'}</span>
      </div>

      {carType.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>توضیحات کامل</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-3 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: carType.description }}
          />
        </div>
      )}

      <SEOPreview
        title={carType.seoInformation?.title || carType.name}
        description={carType.seoInformation?.description}
        canonicalUrl={carType.seoInformation?.canonicalUrl}
      />
    </div>
  );
}