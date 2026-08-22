'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Cpu,
  Sliders,
  Layers,
  FileText,
  Car,
  Factory,
  Award,
  Tag,
  BookOpen,
} from 'lucide-react';
import clsx from 'clsx';

const menuGroups = [
  {
    title: 'اصلی',
    items: [
      { title: 'داشبورد', href: '/', icon: LayoutDashboard },
      { title: 'محصولات (Products)', href: '/products', icon: Package },
      { title: 'وبلاگ و مقالات (Blog)', href: '/blogs', icon: BookOpen },
    ],
  },
  {
    title: 'قطعات و ساختار',
    items: [
      { title: 'قطعات پایه (Part)', href: '/parts', icon: Cpu },
      { title: 'دسته‌بندی قطعات', href: '/parts/categories', icon: Layers },
      { title: 'ویژگی‌های قطعات', href: '/properties', icon: Sliders },
      { title: 'توضیحات قطعه-خودرو', href: '/part-descriptions', icon: FileText },
    ],
  },
  {
    title: 'خودروها',
    items: [
      { title: 'مدل‌های خودرو (Cars)', href: '/cars', icon: Car },
      { title: 'انواع خودرو (CarTypes)', href: '/cars/types', icon: Layers },
      { title: 'شرکت‌های خودروساز', href: '/cars/manufacturers', icon: Factory },
    ],
  },
  {
    title: 'برند و برچسب',
    items: [
      { title: 'برندها (Brands)', href: '/brands', icon: Award },
      { title: 'برچسب‌ها (Tags)', href: '/tags', icon: Tag },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-l border-neutral-800 bg-neutral-900/60 p-4 flex flex-col justify-between hidden md:flex transition-colors">
      <div>
        <div className="flex items-center gap-3 px-3 py-4 border-b border-neutral-800 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500 font-black text-neutral-950 text-lg shadow-md shadow-amber-500/20">
            ید
          </div>
          <div>
            <h2 className="font-bold text-sm text-white">پنل محتوا یدک‌چی</h2>
            <span className="text-[10px] text-amber-500 font-medium">نسخه Data Entry 2.0</span>
          </div>
        </div>

        <nav className="space-y-5 overflow-y-auto max-h-[72vh] pr-1">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                {group.title}
              </span>

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-medium transition-all',
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
            </div>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-center">
        <p className="text-[11px] text-neutral-400">
          وضعیت اتصال: <span className="text-emerald-400 font-bold">برقرار</span>
        </p>
      </div>
    </aside>
  );
}