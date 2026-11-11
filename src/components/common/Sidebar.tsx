'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, Cpu, Sliders, Layers, FileText,
  Car, Factory, Award, Tag, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
      { title: 'توضیحات قطعه-نوع خودرو', href: '/car-type-part-descriptions', icon: FileText },
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
  {
    title: 'صفحات استاتیک',
    items: [{ title: 'صفحات', href: '/pages', icon: Award }],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar-token p-4 flex flex-col justify-between hidden md:flex">
      <div>
        <div className="flex items-center gap-3 px-3 py-3 border-b border-subtle mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--accent)] font-black text-[color:var(--accent-contrast)] text-lg">
            ید
          </div>
          <div>
            <h2 className="font-bold text-sm text-primary">پنل محتوا یدک‌چی</h2>
            <span className="text-2xs text-[color:var(--accent-fg)] font-semibold">
              نسخه Data Entry 2.1
            </span>
          </div>
        </div>

        <nav className="space-y-6 overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <span className="px-3 text-2xs font-bold text-tertiary uppercase tracking-wider block mb-2">
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
                    data-active={isActive}
                    className="sidebar-link"
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0',
                        isActive ? 'text-[color:var(--accent-fg)]' : 'text-tertiary'
                      )}
                    />
                    <span className="truncate">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      <div className="rounded-md border border-default bg-surface-2 p-3 text-center">
        <p className="text-xs text-tertiary">
          وضعیت اتصال:{' '}
          <span className="text-[color:var(--success-fg)] font-bold">برقرار</span>
        </p>
      </div>
    </aside>
  );
}