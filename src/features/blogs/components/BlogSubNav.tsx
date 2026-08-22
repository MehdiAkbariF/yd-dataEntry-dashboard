'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Layers, MessageSquare } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { title: 'مقالات بلاگ (BlogPosts)', href: '/blogs', icon: BookOpen },
  { title: 'دسته‌بندی‌های بلاگ (Categories)', href: '/blogs/categories', icon: Layers },
  { title: 'نظرات بلاگ (Comments)', href: '/blogs/comments', icon: MessageSquare },
];

export default function BlogSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/blogs'
            ? pathname === '/blogs' || pathname.startsWith('/blogs/new') || pathname.startsWith('/blogs/edit')
            : pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-sm'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </div>
  );
}