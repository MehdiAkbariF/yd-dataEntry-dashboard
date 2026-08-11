'use client';

import Link from 'next/link';
import { Package, Cpu, Car, Award, Tag, Plus, ArrowLeft, Layers, MessageSquare } from 'lucide-react';

const stats = [
  { name: 'محصولات تعریف‌شده', count: '10,476', href: '/products', icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { name: 'قطعات خودرو', count: '1,350', href: '/parts', icon: Cpu, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { name: 'مدل‌های خودرو', count: '118', href: '/cars', icon: Car, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { name: 'برندهای فعال', count: '382', href: '/brands', icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/10' },
];

const quickActions = [
  { title: 'ثبت محصول جدید', desc: 'افزودن قطعه جدید به فروشگاه به همراه گالری و SEO', href: '/products/new', icon: Package },
  { title: 'تعریف قطعه جدید (Part)', desc: 'ایجاد قطعه پایه و ویژگی‌های اختصاصی', href: '/parts/new', icon: Cpu },
  { title: 'افزودن برند جدید', desc: 'ثبت برند یا تولیدکننده جدید قطعات', href: '/brands/new', icon: Award },
  { title: 'تعریف مدل خودرو', desc: 'افزودن خودرو جدید به لیست خودروها', href: '/cars/new', icon: Car },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* هدر خیر مقدم */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
        <h1 className="text-xl font-bold text-white">خوش آمدید به پنل ورود اطلاعات یدک‌چی 👋</h1>
        <p className="mt-1 text-xs text-neutral-400">
          از این پنل می‌توانید محصولات، قطعات، خودروها و برندهای فروشگاه را مدیریت و ثبت کنید.
        </p>
      </div>

      {/* کارت‌های آمار سریع */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-2xl font-black text-white">{stat.count}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-neutral-400 group-hover:text-white transition-all">{stat.name}</span>
                <ArrowLeft className="h-4 w-4 text-neutral-600 group-hover:-translate-x-1 group-hover:text-amber-400 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* دسترسی‌های سریع تولید محتوا */}
      <div>
        <h2 className="text-base font-bold text-white mb-4">میانبرهای ورود اطلاعات سریع</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/80 p-5 hover:border-amber-500/50 hover:bg-neutral-900 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 group-hover:bg-amber-500 group-hover:text-black transition-all">
                      <Plus className="h-4 w-4" />
                    </div>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-all">{action.title}</h3>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}