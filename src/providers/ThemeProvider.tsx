'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from 'react';

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark" // پنل اختصاصی دارک‌مود برای جلوگیری از خستگی چشم اپراتور
    >
      {children}
    </NextThemesProvider>
  );
}