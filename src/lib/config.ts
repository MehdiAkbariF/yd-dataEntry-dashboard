// آدرس مرکزی API متصل به فایل‌های محیطی (Environment Variables)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.yadakchi.com';

/**
 * تابع مرکزی برای دریافت آدرس کامل و معتبر تصاویر، لوگوها و ویدیوها
 * @param path آدرس نسبی یا مطلق رسانه
 * @returns آدرس کامل قابل نمایش
 */
export function getMediaUrl(path: string | null | undefined): string | null {
  if (!path || path === '/noimage.webp') return null;

  // اگر آدرس از قبل کامل باشد (مثلاً لینک خارجی)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // اضافه کردن آدرس سرور مرکزی به انتهای مسیر نسبی
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
}