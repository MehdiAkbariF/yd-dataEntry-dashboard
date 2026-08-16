'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Layers, Factory } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { title: 'مدل‌های خودرو (Cars)', href: '/cars', icon: Car },
  { title: 'انواع خودرو (CarTypes)', href: '/cars/types', icon: Layers },
  { title: 'شرکت‌های خودروساز (CarManufacturers)', href: '/cars/manufacturers', icon: Factory },
];

export default function CarSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 border-b border-neutral-800 pb-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all',
              isActive
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
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