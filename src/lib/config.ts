// src/lib/config.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

export function getMediaUrl(path: string | null | undefined): string | null {
  if (!path || path === '/noimage.webp') return null;

  // پیش‌نمایش‌های لوکال (قبل از آپلود)
  if (path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }

  // اگر لینک خارجی مستقل بود
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // تمیز کردن اسلش اول و هدایت به رول پروکسی Next.js
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/media-proxy/${cleanPath}`;
}