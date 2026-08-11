'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // جلوگیری از Hydration Mismatch در Next.js
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-9 w-9" />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      title={theme === 'dark' ? 'تغییر به تم روشن' : 'تغییر به تم تاریک'}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/80 text-neutral-400 hover:border-neutral-700 hover:text-white dark:border-neutral-800 dark:bg-neutral-950 transition-all active:scale-95"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500" />
      )}
    </button>
  );
}