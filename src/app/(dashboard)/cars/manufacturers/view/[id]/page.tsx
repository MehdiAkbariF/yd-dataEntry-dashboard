'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { carService } from '@/services/carService';
import { useQuery } from '@tanstack/react-query';
import Badge from '@/components/ui/Badge';
import { ArrowRight, Edit, Factory, Loader2 } from 'lucide-react';

// دریافت BASE_URL از env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

export default function ViewCarManufacturerPage() {
  const params = useParams();
  const id = params?.id as string;

  const { data: manufacturer, isLoading } = useQuery({
    queryKey: ['car-manufacturer', id],
    queryFn: async () => {
      const list = await carService.getCarManufacturers();
      return list.find((m: any) => m.id === id);
    },
    enabled: !!id,
  });

  if (isLoading || !manufacturer) {
    return (
      <div className="flex h-96 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  // استفاده از BASE_URL به جای هاردکد
  const iconUrl = manufacturer.icon ? `${BASE_URL}${manufacturer.icon}` : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/cars/manufacturers"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold text-white">{manufacturer.name}</h1>
        </div>

        <Link
          href={`/cars/manufacturers/edit/${manufacturer.id}`}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400"
        >
          <Edit className="h-4 w-4" />
          <span>ویرایش</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-64 w-full rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
          {iconUrl ? (
            <Image 
              src={iconUrl} 
              alt={manufacturer.name} 
              fill 
              className="object-contain p-4" 
              unoptimized 
            />
          ) : (
            <Factory className="h-16 w-16 text-neutral-700" />
          )}
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 text-xs">
          <div className="flex justify-between border-b border-neutral-800 pb-3">
            <span className="text-neutral-500">عنوان انگلیسی:</span>
            <span className="font-mono font-bold">{manufacturer.englishTitle || '---'}</span>
          </div>
          <div className="flex justify-between border-b border-neutral-800 pb-3">
            <span className="text-neutral-500">وضعیت نمایش:</span>
            <Badge variant={manufacturer.isActive ? 'success' : 'danger'} size="sm">
              {manufacturer.isActive ? 'فعال' : 'غیرفعال'}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}