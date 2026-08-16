'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
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
} from 'lucide-react';
import clsx from 'clsx';

const menuGroups = [
  {
    title: 'اصلی',
    items: [
      { title: 'داشبورد', href: '/', icon: LayoutDashboard },
      { title: 'محصولات (Products)', href: '/products', icon: Package },
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

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const mobileMenuContent =
    isOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[999] flex md:hidden">
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            />

            <div className="relative flex w-full max-w-xs flex-col bg-neutral-900 border-l border-neutral-800 p-6 shadow-2xl z-10 h-full">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 font-bold text-black text-sm">
                    ید
                  </div>
                  <span className="font-bold text-sm text-white">منوی مدیریت</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-4 overflow-y-auto flex-1">
                {menuGroups.map((group) => (
                  <div key={group.title} className="space-y-1">
                    <span className="px-3 text-[10px] font-bold text-neutral-500 uppercase block mb-1">
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
                          onClick={() => setIsOpen(false)}
                          className={clsx(
                            'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all',
                            isActive
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                              : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
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
          </div>,
          document.body
        )
      : null;

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(true)}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileMenuContent}
    </div>
  );
}