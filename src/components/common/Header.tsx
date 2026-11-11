'use client';

import { useState, useRef } from 'react';
import { authService } from '@/services/authService';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/store/useAuthStore';
import { useWorkspaceStore } from '@/store/useWorkspaceStore';
import { useQuery } from '@tanstack/react-query';
import MobileSidebar from './MobileSidebar';
import ThemeToggle from './ThemeToggle';
import { LogOut, User, Search, Columns, Globe, Loader2, FileUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const { user } = useAuthStore();
  const { splitMode, setSplitMode, setExternalUrl } = useWorkspaceStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserId = user?.id || '';

  const { data: userProfile, isLoading: isUserLoading } = useQuery({
    queryKey: ['user-profile', currentUserId],
    queryFn: () => userService.getUserById(currentUserId),
    enabled: !!currentUserId && currentUserId.length > 5,
  });

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await authService.logout();
    setIsLoggingOut(false);
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        setExternalUrl(`excel:${fileUrl}`);
      } else {
        setExternalUrl(fileUrl);
      }
      setSplitMode('external');
    }
  };

  const displayName =
    userProfile?.fullName || user?.fullName ||
    userProfile?.userName || user?.userName || 'مدیر سیستم';
  const displayPhone =
    userProfile?.phoneNumber || user?.phoneNumber ||
    userProfile?.userName || user?.userName || '---';

  return (
    <header className="header-token flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-2.5">
        <MobileSidebar />

        <button
          onClick={() => alert('کلید میانبر سرچ سریع')}
          className="btn btn-secondary btn-sm gap-2"
        >
          <Search className="h-3.5 w-3.5 text-tertiary" />
          <span className="hidden sm:inline">جستجوی سریع...</span>
          <span className="sm:hidden">جستجو</span>
          <kbd className="hidden md:inline rounded bg-[color:var(--surface-3)] px-1.5 py-0.5 text-2xs font-mono text-tertiary border border-subtle">
            Ctrl + K
          </kbd>
        </button>

        <button
          onClick={() => setSplitMode(splitMode === 'internal' ? 'none' : 'internal')}
          title="باز کردن دو صفحه از خود پنل کنار هم"
          className={cn(
            'hidden lg:flex btn btn-sm gap-1.5',
            splitMode === 'internal'
              ? 'bg-[color:var(--accent-subtle)] text-[color:var(--accent-fg)] border border-[color:var(--accent)]'
              : 'btn-secondary'
          )}
        >
          <Columns className="h-3.5 w-3.5" />
          <span>اسپلیت پنل</span>
        </button>

        <button
          onClick={() => setSplitMode(splitMode === 'external' ? 'none' : 'external')}
          title="باز کردن مرورگر آزاد جهت سرچ آدرس‌های خارجی"
          className={cn(
            'hidden lg:flex btn btn-sm gap-1.5',
            splitMode === 'external'
              ? 'bg-[color:var(--info-subtle)] text-[color:var(--info-fg)] border border-[color:var(--info)]'
              : 'btn-secondary'
          )}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>مرورگر همراه</span>
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          title="باز کردن فایل اکسل، PDF، عکس یا متن از کامپیوتر شما در پنجره کناری"
          className="hidden lg:flex btn btn-secondary btn-sm gap-1.5"
        >
          <FileUp className="h-3.5 w-3.5" />
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
        <ThemeToggle />

        <div className="flex items-center gap-2.5 rounded-md border border-default bg-surface-2 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[color:var(--accent-subtle)] text-[color:var(--accent-fg)]">
            {isUserLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col text-right">
            <span className="text-xs font-bold text-primary leading-snug">{displayName}</span>
            <span className="text-2xs text-[color:var(--accent-fg)] font-mono" dir="ltr">
              {displayPhone}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          title="خروج از حساب"
          className="btn btn-icon btn-sm bg-[color:var(--danger-subtle)] text-[color:var(--danger-fg)] border border-transparent hover:bg-[color:var(--danger)] hover:text-[color:var(--text-inverse)]"
        >
          {isLoggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}