import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

// پیکربندی فونت ایران یکان با پشتیبانی از اعداد فارسی
const iranYekan = localFont({
  src: [
    {
      path: '../../public/Font/IranYekan/woff2/IRANYekanXFaNum-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/Font/IranYekan/woff2/IRANYekanWebFn-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/Font/IranYekan/woff2/IRANYekanXFaNum-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-iran-yekan',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'پنل مدیریت محتوای یدک‌چی',
  description: 'سیستم اختصاصی ورود اطلاعات و تولید محتوای قطعات خودرو',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={`dark ${iranYekan.variable}`}>
      <body className="font-sans bg-neutral-950 text-neutral-100 antialiased selection:bg-amber-500 selection:text-black">
        <ReactQueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}