'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { apiClient } from '@/lib/axios';
import { Loader2 } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { setAuthenticated, logoutState } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // اگر در صفحه لاگین هستیم، نیازی به بررسی اعتبار نیست
    if (pathname.startsWith('/login')) {
      setChecking(false);
      return;
    }

    const verifyAuth = async () => {
      try {
        // فراخوانی یک API سبک برای سنجش اعتبار کوکی HttpOnly
        await apiClient.get('/api/A_Part/Tag?PageNumber=1&PageSize=1');
        setAuthenticated(true);
      } catch (error: any) {
        // در صورت عدم داشتن کوکی یا انقضا
        logoutState();
        if (!pathname.startsWith('/login')) {
          router.push('/login');
        }
      } finally {
        setChecking(false);
      }
    };

    verifyAuth();
  }, [pathname, router, setAuthenticated, logoutState]);

  if (checking && !pathname.startsWith('/login')) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-neutral-200">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
          <span className="text-sm font-medium text-neutral-300">در حال بررسی اعتبار دسترسی...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}