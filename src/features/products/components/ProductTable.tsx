'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ProductListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { Edit, Trash2, Eye, Loader2, Image as ImageIcon } from 'lucide-react';

interface ProductTableProps {
  products: ProductListItem[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentStatus: boolean) => void;
  onDelete: (id: string) => void;
  isTogglingId: string | null;
}

export default function ProductTable({
  products,
  isLoading,
  onToggleStatus,
  onDelete,
  isTogglingId,
}: ProductTableProps) {
  const getImageUrl = (path: string | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://api.yadakchi.com${path}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت لیست محصولات...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ محصولی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">تصویر</th>
            <th className="p-4">عنوان محصول / کد</th>
            <th className="p-4">ایجادکننده</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت نمایش</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {products.map((product) => {
            const imageUrl = getImageUrl(product.image);

            return (
              <tr key={product.id} className="hover:bg-neutral-800/30 transition-all">
                <td className="p-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.imageAlt || product.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon className="h-5 w-5 text-neutral-600" />
                    )}
                  </div>
                </td>

                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{product.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-amber-500">کد: {product.productCode}</span>
                      {product.englishTitle && (
                        <span className="font-mono text-[10px] text-neutral-500 truncate dir-ltr text-right">
                          {product.englishTitle}
                        </span>
                      )}
                    </div>
                  </div>
                </td>

                <td className="p-4 text-neutral-300">
                  <span>{product.creator || 'سیستم'}</span>
                </td>

                <td className="p-4 text-neutral-400 dir-ltr text-right font-mono text-[11px]">
                  {new Date(product.createDate).toLocaleDateString('fa-IR')}
                </td>

                <td className="p-4 text-center">
                  <button
                    onClick={() => onToggleStatus(product.id, product.isActive)}
                    disabled={isTogglingId === product.id}
                    className="inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTogglingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                    ) : (
                      <Badge variant={product.isActive ? 'success' : 'danger'} size="sm">
                        {product.isActive ? 'فعال' : 'غیرفعال'}
                      </Badge>
                    )}
                  </button>
                </td>

                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {/* دکمه جدید: مشاهده کامل جزئیات */}
                    <Link
                      href={`/products/view/${product.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
                      title="مشاهده جزئیات محصول"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>

                    {/* ویرایش */}
                    <Link
                      href={`/products/edit/${product.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش محصول"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    {/* حذف */}
                    <button
                      onClick={() => onDelete(product.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف محصول"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}