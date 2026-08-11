'use client';

import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import MobileSidebar from './MobileSidebar';
import { LogOut, User, Search, Columns, Globe } from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
  const { user } = useAuthStore();
  const { splitMode, setSplitMode } = useWorkspaceStore();

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 md:px-6 backdrop-blur-md transition-all">
      {/* سمت راست: منوی موبایل + دکمه سرچ سریع */}
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <button
          onClick={() => alert('کلید میانبر سرچ سریع')}
          className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400 hover:border-neutral-700 transition-all md:px-4"
        >
          <Search className="h-4 w-4 text-neutral-500" />
          <span className="hidden sm:inline">جستجوی سریع در سیستم...</span>
          <span className="sm:hidden">جستجو...</span>
          <kbd className="hidden md:inline rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] text-neutral-400">Ctrl + K</kbd>
        </button>

        {/* ⚠️ دکمه ۱: اسپلیت دوپنجره‌ای درون‌برنامه‌ای */}
        <button
          onClick={() => setSplitMode(splitMode === 'internal' ? 'none' : 'internal')}
          title="باز کردن دو صفحه از خود پنل کنار هم"
          className={clsx(
            'hidden lg:flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all',
            splitMode === 'internal'
              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-lg shadow-amber-500/10'
              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
          )}
        >
          <Columns className="h-4 w-4" />
          <span>اسپلیت پنل</span>
        </button>

        {/* ⚠️ دکمه ۲: مرورگر وب همراه (آدرس دلخواه خارجی) */}
        <button
          onClick={() => setSplitMode(splitMode === 'external' ? 'none' : 'external')}
          title="باز کردن مرورگر آزاد جهت سرچ آدرس‌های خارجی"
          className={clsx(
            'hidden lg:flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold transition-all',
            splitMode === 'external'
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-lg shadow-blue-500/10'
              : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
          )}
        >
          <Globe className="h-4 w-4" />
          <span>مرورگر همراه</span>
        </button>
      </div>

      {/* سمت چپ: پروفایل کاربر + دکمه خروج */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-amber-400">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden flex-col text-right sm:flex">
            <span className="text-xs font-bold text-neutral-200">{user?.fullName || 'اپراتور محتوا'}</span>
            <span className="text-[10px] text-neutral-500">{user?.userName || 'کاربر سیستم'}</span>
          </div>
        </div>

        <button
          onClick={() => authService.logout()}
          title="خروج از حساب"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}