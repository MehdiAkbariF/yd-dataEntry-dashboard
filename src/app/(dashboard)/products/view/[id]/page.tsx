'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useGetProductById, useDeleteProduct, useToggleProductStatus } from '@/features/products/hooks/useProducts';
import SEOPreview from '@/components/common/SEOPreview';
import Badge from '@/components/ui/Badge';
import { Switch } from '@/components/ui/Switch';
import ConfirmModal from '@/components/common/ConfirmModal';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowRight, Edit, Trash2, Package, Car, Tag, Sparkles,
  Calendar, User, Image as ImageIcon, Loader2
} from 'lucide-react';

export default function ViewProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: product, isLoading, isError } = useGetProductById(productId);
  const deleteMutation = useDeleteProduct();
  const toggleMutation = useToggleProductStatus();

  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  const handleToggleStatus = (newStatus: boolean) => {
    toggleMutation.mutate(
      { id: productId, isActive: newStatus },
      {
        onSuccess: () => toast.success('وضعیت نمایش محصول تغییر یافت.'),
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(productId, {
      onSuccess: () => {
        toast.success('محصول با موفقیت حذف شد.');
        router.push('/products');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        <span className="text-xs text-neutral-400">در حال دریافت جزئیات محصول...</span>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/40 text-red-400">
        <span className="text-sm font-bold">خطا در دریافت اطلاعات محصول.</span>
        <span className="text-xs text-neutral-500">محصول یافت نشد یا حذف شده است.</span>
      </div>
    );
  }

  const mainImageUrl = getImageUrl(product.image);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* هدر بالایی و عملیات */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-all"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white">{product.title}</h1>
            </div>
            <p className="text-xs text-amber-500 font-mono mt-0.5 dir-ltr text-right">
              کد محصول: {product.productCode}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* ⚠️ تاگل آنی وضعیت فعال در صفحه View */}
          <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-1.5">
            <Switch
              checked={product.isActive}
              onChange={handleToggleStatus}
              isLoading={toggleMutation.isPending}
              label={product.isActive ? 'فعال' : 'غیرفعال'}
            />
          </div>

          <Link
            href={`/products/edit/${product.id}`}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-all"
          >
            <Edit className="h-4 w-4" />
            <span>ویرایش محصول</span>
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

      {/* کارت اصلی اطلاعات + تصویر */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950 flex items-center justify-center p-4">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={product.imageAlt || product.title}
                fill
                className="object-contain p-2"
                unoptimized
              />
            ) : (
              <ImageIcon className="h-12 w-12 text-neutral-700" />
            )}
          </div>

          {product.productImages && product.productImages.length > 0 && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-2">
              <span className="text-xs font-bold text-amber-500">گالری تصاویر ({product.productImages.length})</span>
              <div className="grid grid-cols-3 gap-2">
                {product.productImages.map((imgItem: any) => {
                  const url = getImageUrl(imgItem?.image);
                  if (!url) return null;
                  return (
                    <div key={imgItem.id} className="relative h-16 w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
                      <Image src={url} alt={imgItem.imageAlt || 'گالری'} fill className="object-cover" unoptimized />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-neutral-800 pb-6">
            <div>
              <span className="text-[11px] text-neutral-500 block">عنوان انگلیسی:</span>
              <span className="text-xs font-mono font-bold text-neutral-200 dir-ltr text-right block mt-0.5">
                {product.englishTitle || '---'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 block">پارت نامبر / شماره فنی:</span>
              <span className="text-xs font-mono font-bold text-amber-400 dir-ltr text-right block mt-0.5">
                {product.partNumber || '---'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 block">برند سازنده:</span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {product.brand?.name ? `${product.brand.name} (${product.brand.englishTitle || ''})` : '---'}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-neutral-500 block">نوع قطعه پایه:</span>
              <span className="text-xs font-bold text-neutral-200 block mt-0.5">
                {product.part?.name || '---'}
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2">
              <Car className="h-4 w-4" />
              <span>خودروهای سازگار ({product.cars?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.cars && product.cars.length > 0 ? (
                product.cars.map((car: any) => (
                  <Badge key={car.id} variant="neutral" size="sm">
                    {car.model} ({car.englishTitle})
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-neutral-500">خودرویی ثبت نشده است.</span>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-500 mb-2">
              <Tag className="h-4 w-4" />
              <span>برچسب‌ها / تگ‌ها ({product.tags?.length || 0})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {product.tags && product.tags.length > 0 ? (
                product.tags.map((tag: any) => (
                  <Badge key={tag.id} variant="info" size="sm">
                    #{tag.value}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-neutral-500">تگی ثبت نشده است.</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-center text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 block">ابعاد (cm):</span>
              <span className="font-mono text-neutral-200 font-bold">{product.length}x{product.width}x{product.height}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">وزن (kg):</span>
              <span className="font-mono text-neutral-200 font-bold">{product.weight}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">شکستنی:</span>
              <span className={product.isFragile ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {product.isFragile ? 'بله' : 'خیر'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-500 block">ارسال با تیپاکس:</span>
              <span className={product.isTipaxSendable ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                {product.isTipaxSendable ? 'مجاز' : 'غیرمجاز'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {product.description && (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-500 font-bold text-sm">
            <Sparkles className="h-4 w-4" />
            <span>نقد و بررسی و توضیحات کامل</span>
          </div>
          <div
            className="prose prose-invert max-w-none text-xs leading-relaxed text-neutral-200 p-2 rounded-xl bg-neutral-950/60 border border-neutral-800"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SEOPreview
          title={product.seoInformation?.title || product.title}
          description={product.seoInformation?.description}
          canonicalUrl={product.seoInformation?.canonicalUrl || product.title.toLowerCase().replace(/\s+/g, '-')}
        />

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 space-y-4 text-xs">
          <h3 className="font-bold text-amber-500 mb-2">اطلاعات ثبت و حسابرسی (Audit Info)</h3>
          <div className="space-y-2 text-neutral-300">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> ایجادکننده:</span>
              <span className="font-bold text-white">{product.creator || 'سیستم'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-500 flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> آخرین ویرایش‌کننده:</span>
              <span className="font-bold text-white">{product.updater || '---'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-500 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> تاریخ ثبت:</span>
              <span className="font-mono dir-ltr">{new Date(product.createDate).toLocaleDateString('fa-IR')}</span>
            </div>
          </div>

          {product.note && (
            <div className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-300">
              <span className="font-bold block mb-1">یادداشت داخلی:</span>
              <p>{product.note}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        title="حذف محصول"
        description="آیا از حذف این محصول اطمینان دارید؟ این عملیات غیرقابل بازگشت است."
        isLoading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
}