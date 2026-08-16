'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useTableFilters<T extends Record<string, any>>(defaultFilters: T) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // خوانش فیلترهای جاری از روی URL یا مقادیر پیش‌فرض
  const filters = useCallback(() => {
    const current: Record<string, any> = { ...defaultFilters };
    searchParams.forEach((value, key) => {
      if (value !== undefined && value !== '') {
        current[key] = value;
      }
    });
    return current as T;
  }, [searchParams, defaultFilters])();

  // تغییر یک فیلتر خاص و به‌روزرسانی زنده URL
  const setFilter = useCallback(
    (key: keyof T, value: any) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value !== undefined && value !== '' && value !== null) {
        params.set(String(key), String(value));
      } else {
        params.delete(String(key));
      }

      // در صورت تغییر فیلترهای سرچ (غیر از شماره صفحه)، صفحه به ۱ ریست شود
      if (key !== 'page' && key !== 'pageNumber') {
        params.set('page', '1');
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  // پاکسازی تمام فیلترها
  const resetFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return { filters, setFilter, resetFilters };
}