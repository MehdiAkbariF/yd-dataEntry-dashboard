'use client';

import { useState, useRef } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useQuery } from '@tanstack/react-query';
import MobileSidebar from './MobileSidebar';
import { LogOut, User, Search, Columns, Globe, Loader2, FileUp } from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
  const { user } = useAuthStore();
  const { splitMode, setSplitMode, setExternalUrl } = useWorkspaceStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = user?.id || '';

  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ['user-profile', currentUserId],
    queryFn: () => userService.getUserById(currentUserId),
    enabled: !!currentUserId && currentUserId.length > 10,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authService.logout();
    setIsLoggingOut(false);
  };

  // ⚠️ هندلینگ خوانش فایل اکسل یا عکس و پی‌دی‌اف
  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      
      // اگر فایل اکسل است یک پیشوند excel: اضافه می‌کنیم تا کامپوننت Split آن را به جدول تبدیل کند
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setExternalUrl(`excel:${fileUrl}`);
      } else {
        setExternalUrl(fileUrl);
      }
      
      setSplitMode('external');
    }
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 md:px-6 backdrop-blur-md transition-all">
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

        {/* ⚠️ دکمه انتخاب فایل اکسل، عکس و پی‌دی‌اف */}
        <button
          onClick={() => fileInputRef.current?.click()}
          title="باز کردن فایل اکسل، PDF، عکس یا متن از کامپیوتر شما در پنجره کناری"
          className="hidden lg:flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-bold text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
        >
          <FileUp className="h-4 w-4" />
          <span>فایل محلی / اکسل</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleLocalFileSelect}
          className="hidden"
          accept=".pdf,.txt,.html,.htm,.png,.jpg,.jpeg,.webp,.csv,.xlsx,.xls"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 text-amber-400">
            {isUserLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="hidden flex-col text-right sm:flex">
            <span className="text-xs font-bold text-white">
              {userProfile?.fullName || user?.fullName || 'کاربر سیستم'}
            </span>
            <span className="text-[10px] text-amber-500 font-mono dir-ltr text-right">
              {userProfile?.phoneNumber || user?.phoneNumber || user?.userName || '---'}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="خروج از حساب"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95 disabled:opacity-50"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}