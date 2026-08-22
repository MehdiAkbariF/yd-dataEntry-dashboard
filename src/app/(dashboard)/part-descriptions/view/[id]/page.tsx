'use client';

import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useGetPartCarDescriptionById,
  useGetCarTypePartDescriptionById,
} from '@/features/part-descriptions/hooks/usePartDescriptions';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Edit, FileText, Layers, Car, Loader2, Calendar, User } from 'lucide-react';

export default function ViewPartDescriptionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params?.id as string;
  const type = (searchParams.get('type') as 'car' | 'carType') || 'car';

  const { data: carData, isLoading: isCarLoading } = useGetPartCarDescriptionById(
    type === 'car' ? id : ''
  );
  const { data: carTypeData, isLoading: isCarTypeLoading } = useGetCarTypePartDescriptionById(
    type === 'carType' ? id : ''
  );

  const isLoading = type === 'car' ? isCarLoading : isCarTypeLoading;
  const data = type === 'car' ? carData : carTypeData;

  if (isLoading) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3 text-neutral-400">
        <p className="text-sm">اطلاعاتی برای این مورد یافت نشد.</p>
        <button
          onClick={() => router.push('/part-descriptions')}
          className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs text-white"
        >
          بازگشت به لیست
        </button>
      </div>
    );
  }

  const partName = typeof data.part === 'object' ? data.part?.name : data.part;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* هدر */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/part-descriptions"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">مشاهده جزئیات توضیحات تخصصی</h1>
            <p className="text-xs text-neutral-400">
              نوع: {type === 'car' ? 'مدل‌های خودرو' : 'نوع خودرو (CarType)'}
            </p>
          </div>
        </div>

        <Link
          href={`/part-descriptions/edit/${id}?type=${type}`}
          className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/10"
        >
          <Edit className="h-4 w-4" />
          <span>ویرایش</span>
        </Link>
      </div>

      {/* اطلاعات قطعه و خودرو */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            <FileText className="h-4 w-4" />
            <span>قطعه مربوطه</span>
          </div>
          <p className="text-sm font-bold text-white">{partName || '---'}</p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
            {type === 'car' ? <Car className="h-4 w-4" /> : <Layers className="h-4 w-4" />}
            <span>{type === 'car' ? 'خودروهای متصل' : 'نوع خودرو (CarType)'}</span>
          </div>
          {type === 'car' ? (
            <div className="flex flex-wrap gap-1.5">
              {data.cars?.map((c: any) => (
                <Badge key={c.id} variant="neutral" size="sm">
                  {c.model}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm font-bold text-white">
              {data.carType?.name} {data.carType?.englishTitle ? `(${data.carType.englishTitle})` : ''}
            </p>
          )}
        </div>
      </div>

      {/* محتوای توضیحات */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
        <h3 className="text-xs font-bold text-amber-400">محتوای توضیحات (HTML):</h3>
        <div
          className="prose prose-invert max-w-none text-xs leading-relaxed border border-neutral-800 bg-neutral-950 p-4 rounded-xl"
          dangerouslySetInnerHTML={{ __html: data.description || '<p>بدون توضیحات</p>' }}
        />
      </div>

      {/* اطلاعات سیستمی */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-neutral-500" />
          <span>ثبت‌کننده: {data.creator || 'سیستم'}</span>
        </div>
        {data.createDate && (
          <div className="flex items-center gap-2 font-mono dir-ltr">
            <Calendar className="h-4 w-4 text-neutral-500" />
            <span>{new Date(data.createDate).toLocaleDateString('fa-IR')}</span>
          </div>
        )}
      </div>
    </div>
  );
}