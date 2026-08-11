'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // اگر در صفحه لاگین هستیم، چک کردن لزومی ندارد
    if (pathname.startsWith('/login')) {
      setChecking(false);
      return;
    }

    // در غیر این صورت وضعیت بررسی می‌شود
    setChecking(false);
  }, [pathname, isAuthenticated, router]);

  if (checking || (isLoading && !pathname.startsWith('/login'))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-neutral-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium">در حال بررسی اعتبار دسترسی...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}