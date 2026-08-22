'use client';

import { BlogPostCommentListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { CheckCircle2, Loader2, Reply } from 'lucide-react';

interface BlogCommentTableProps {
  comments: BlogPostCommentListItem[];
  isLoading: boolean;
  onConfirm: (id: string) => void;
  onOpenReply: (comment: BlogPostCommentListItem) => void;
  confirmingId: string | null;
}

export default function BlogCommentTable({
  comments,
  isLoading,
  onConfirm,
  onOpenReply,
  confirmingId,
}: BlogCommentTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت دیدگاه‌ها...</span>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ دیدگاهی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">مقاله</th>
            <th className="p-4">نویسنده دیدگاه</th>
            <th className="p-4">متن دیدگاه</th>
            <th className="p-4 text-center">تاریخ ثبت</th>
            <th className="p-4 text-center">وضعیت تایید</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {comments.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-800/30 transition-all">
              <td className="p-4 font-bold text-amber-400 max-w-xs truncate">
                {item.blogPost?.title || 'مقاله حذف‌شده'}
              </td>

              <td className="p-4 text-neutral-200">
                <span className="font-bold">{item.commentCreator || 'کاربر مهمان'}</span>
                {item.isIncognito && (
                  <span className="block text-[10px] text-neutral-500">ناشناس</span>
                )}
              </td>

              <td className="p-4 max-w-md">
                <p className="text-neutral-300 leading-relaxed line-clamp-2">{item.comment}</p>
                {item.parentId && (
                  <span className="mt-1 inline-flex items-center gap-1 text-[10px] text-blue-400">
                    <Reply className="h-3 w-3" />
                    <span>پاسخ به یک دیدگاه</span>
                  </span>
                )}
              </td>

              <td className="p-4 text-center text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                {new Date(item.createDate).toLocaleDateString('fa-IR')}
              </td>

              <td className="p-4 text-center">
                <Badge variant={item.isConfirmed ? 'success' : 'warning'} size="sm">
                  {item.isConfirmed ? 'تاییدشده' : 'در انتظار تایید'}
                </Badge>
              </td>

              <td className="p-4 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  {!item.isConfirmed && (
                    <button
                      onClick={() => onConfirm(item.id)}
                      disabled={confirmingId === item.id}
                      className="flex items-center gap-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-[11px] font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all disabled:opacity-50"
                    >
                      {confirmingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>تایید</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => onOpenReply(item)}
                    className="flex items-center gap-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-[11px] font-bold text-neutral-300 hover:border-amber-500/40 hover:text-amber-400 transition-all"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    <span>پاسخ</span>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}