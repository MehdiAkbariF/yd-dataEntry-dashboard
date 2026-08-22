'use client';

import Image from 'next/image';
import Link from 'next/link';
import { BlogPostListItem } from '../types';
import Badge from '@/components/ui/Badge';
import { getMediaUrl } from '@/lib/config';
import { Edit, Trash2, Loader2, BookOpen, Clock, Send } from 'lucide-react';

interface BlogPostTableProps {
  posts: BlogPostListItem[];
  isLoading: boolean;
  onPublish: (id: string) => void;
  onDelete: (id: string) => void;
  publishingId: string | null;
}

export default function BlogPostTable({
  posts,
  isLoading,
  onPublish,
  onDelete,
  publishingId,
}: BlogPostTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
        <div className="flex flex-col items-center gap-2 text-neutral-400">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-xs">در حال دریافت مقالات بلاگ...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40 text-neutral-500">
        <p className="text-sm font-medium">هیچ مقاله‌ای یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="relative z-10 overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl">
      <table className="w-full text-right text-xs">
        <thead className="border-b border-neutral-800 bg-neutral-950/80 text-neutral-400">
          <tr>
            <th className="p-4">تصویر</th>
            <th className="p-4">عنوان مقاله / انگلیسی</th>
            <th className="p-4">دسته‌بندی</th>
            <th className="p-4 text-center">زمان مطالعه</th>
            <th className="p-4 text-center">وضعیت انتشار</th>
            <th className="p-4">نویسنده</th>
            <th className="p-4">تاریخ ثبت</th>
            <th className="p-4 text-center">عملیات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/60">
          {posts.map((post) => {
            const imageUrl = getMediaUrl(post.imageUrl);

            return (
              <tr key={post.id} className="hover:bg-neutral-800/30 transition-all">
                <td className="p-4">
                  <div className="relative h-12 w-16 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={post.imageAlt || post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <BookOpen className="h-6 w-6 text-neutral-600" />
                    )}
                  </div>
                </td>

                <td className="p-4 max-w-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-white leading-relaxed line-clamp-1">{post.title}</span>
                    {post.englishTitle && (
                      <span className="font-mono text-[10px] text-neutral-500 truncate dir-ltr text-right">
                        {post.englishTitle}
                      </span>
                    )}
                  </div>
                </td>

                <td className="p-4">
                  <Badge variant="info" size="sm">
                    {post.blogCategory?.title || 'عمومی'}
                  </Badge>
                </td>

                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1 font-mono text-neutral-300">
                    <Clock className="h-3.5 w-3.5 text-amber-500" />
                    <span>{post.readTime} دقیقه</span>
                  </div>
                </td>

                <td className="p-4 text-center">
                  <Badge variant={post.status === 'Published' ? 'success' : 'warning'} size="sm">
                    {post.status === 'Published' ? 'منتشر شده' : 'پیش‌نویس'}
                  </Badge>
                </td>

                <td className="p-4 text-neutral-300">
                  <span>{post.creator?.fullName || post.creator?.userName || 'سیستم'}</span>
                </td>

                <td className="p-4 text-neutral-400 font-mono text-[11px] dir-ltr text-right">
                  {new Date(post.createDate).toLocaleDateString('fa-IR')}
                </td>

                <td className="p-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    {post.status !== 'Published' && (
                      <button
                        onClick={() => onPublish(post.id)}
                        disabled={publishingId === post.id}
                        className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                        title="انتشار عمومی مقاله"
                      >
                        {publishingId === post.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    )}

                    <Link
                      href={`/blogs/edit/${post.id}`}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-amber-500/30 hover:text-amber-400 transition-all"
                      title="ویرایش مقاله"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => onDelete(post.id)}
                      className="rounded-lg border border-neutral-800 bg-neutral-950 p-2 text-neutral-400 hover:border-red-500/30 hover:text-red-400 transition-all"
                      title="حذف مقاله"
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