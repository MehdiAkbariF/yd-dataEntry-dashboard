'use client';

import Link from 'next/link';
import { InquiryListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { CheckCircle2, Loader2, ExternalLink, HelpCircle, MessageSquare } from 'lucide-react';

interface InquiryTableProps {
  inquiries: InquiryListItem[];
  isLoading: boolean;
  onConfirm: (id: string) => void;
  confirmingId: string | null;
}

export default function InquiryTable({
  inquiries,
  isLoading,
  onConfirm,
  confirmingId,
}: InquiryTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت پرسش‌ها...</span>
        </div>
      </div>
    );
  }

  if (inquiries.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ پرسشی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">محصول</th>
            <th className="p-4">پرسش‌کننده</th>
            <th className="p-4">متن پرسش</th>
            <th className="p-4 text-center">تعداد پاسخ</th>
            <th className="p-4 text-center">وضعیت تایید</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {inquiries.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-800/30 transition-all">
              {/* محصول */}
              <td className="p-4 max-w-xs">
                {item.product ? (
                  <Link
                    href={`/products/view/${item.productId}`}
                    className="font-bold text-amber-400 hover:underline flex items-center gap-1 leading-relaxed line-clamp-1"
                  >
                    <span>{item.product.title}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </Link>
                ) : (
                  <span className="text-neutral-500">محصول ناپیدا</span>
                )}
              </td>

              {/* نویسنده */}
              <td className="p-4 text-neutral-200">
                <span className="font-bold">{item.inquiryCreator || 'کاربر یدک‌چی'}</span>
                {item.isSellerComment && (
                  <span className="block text-[10px] text-amber-400">فروشنده</span>
                )}
              </td>

              {/* متن پرسش */}
              <td className="p-4 max-w-md">
                <p className="text-neutral-300 leading-relaxed line-clamp-2">{item.comment || 'بدون متن'}</p>
              </td>

              {/* تعداد پاسخ */}
              <td className="p-4 text-center font-mono font-bold text-neutral-300">
                {item.replyCount}
              </td>

              {/* وضعیت تایید */}
              <td className="p-4 text-center">
                <Badge variant={item.isConfirmed ? 'success' : 'warning'} size="sm">
                  {item.isConfirmed ? 'تاییدشده' : 'در انتظار تایید'}
                </Badge>
              </td>

              {/* عملیات */}
              <td className="p-4 text-center">
                {!item.isConfirmed && (
                  <button
                    onClick={() => onConfirm(item.id)}
                    disabled={confirmingId === item.id}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all mx-auto text-[11px] font-bold disabled:opacity-50"
                  >
                    {confirmingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>تایید پرسش</span>
                      </>
                    )}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}