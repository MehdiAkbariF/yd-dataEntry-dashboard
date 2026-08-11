'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Cpu, Car, Award, Tag, MessageSquare, HelpCircle, Layers } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  {
    title: 'محصولات (Product)',
    href: '/products',
    icon: Package,
  },
  {
    title: 'قطعات خودرو (Part)',
    href: '/parts',
    icon: Cpu,
  },
  {
    title: 'دسته‌بندی قطعات',
    href: '/parts/categories',
    icon: Layers,
  },
  {
    title: 'مدیریت خودروها (Cars)',
    href: '/cars',
    icon: Car,
  },
  {
    title: 'برندها (Brands)',
    href: '/brands',
    icon: Award,
  },
  {
    title: 'برچسب‌ها (Tags)',
    href: '/tags',
    icon: Tag,
  },
  {
    title: 'نظرات کاربران',
    href: '/comments',
    icon: MessageSquare,
  },
  {
    title: 'پرسش و پاسخ‌ها',
    href: '/inquiries',
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-neutral-800 bg-neutral-900/60 p-4 flex flex-col justify-between hidden md:flex">
      <div>
        {/* برند لاگوی پنل */}
        <div className="flex items-center gap-3 px-3 py-4 border-b border-neutral-800 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-neutral-950 text-lg">
            ید
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">پنل محتوا یدک‌چی</h2>
            <span className="text-[10px] text-amber-500 font-medium">نسخه Data Entry 2.0</span>
          </div>
        </div>

        {/* منوهای اصلی */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all',
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                    : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'
                )}
              >
                <Icon className={clsx('h-4 w-4', isActive ? 'text-amber-400' : 'text-neutral-500')} />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* اطلاعات پایین منو */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-center">
        <p className="text-[11px] text-neutral-400">وضعیت اتصال: <span className="text-emerald-400 font-bold">برقرار</span></p>
      </div>
    </aside>
  );
}