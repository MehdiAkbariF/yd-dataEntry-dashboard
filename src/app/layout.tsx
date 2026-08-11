import type { Metadata } from 'next';
import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'پنل مدیریت تولید محتوا | یدک‌چی',
  description: 'پنل اختصاصی Data Entry قطعات خودرو',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className="bg-neutral-950 text-neutral-100 antialiased selection:bg-amber-500 selection:text-black">
        <ReactQueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}