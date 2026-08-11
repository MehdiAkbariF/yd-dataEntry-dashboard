'use client';

import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import ScratchpadDrawer from '@/components/scratchpad/ScratchpadDrawer';
import SplitWorkspace from '@/components/common/SplitWorkspace';
import AuthGuard from '@/components/common/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  // ⚠️ در صورت بودن در حالت embed (پنجره مرجع اسپلیت)، سایدبار و هدر تکراری رندر نمی‌شوند
  if (isEmbed) {
    return <div className="min-h-screen bg-neutral-950 p-4 text-neutral-100">{children}</div>;
  }

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden bg-neutral-950">
            <SplitWorkspace>{children}</SplitWorkspace>
          </main>
        </div>

        <ScratchpadDrawer />
      </div>
    </AuthGuard>
  );
}