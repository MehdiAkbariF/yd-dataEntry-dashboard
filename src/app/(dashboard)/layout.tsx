'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import ScratchpadDrawer from '@/components/scratchpad/ScratchpadDrawer';
import SplitWorkspace from '@/components/common/SplitWorkspace';
import AuthGuard from '@/components/common/AuthGuard';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const isEmbed = searchParams.get('embed') === 'true';

  // ⚠️ اگر در حالت اسپلیت (Embed) بودیم، فقط محتوا بدون سایدبار تودرتو رندر شود
  if (isEmbed) {
    return (
      <div className="min-h-screen bg-neutral-950 p-4 md:p-6 text-neutral-100 overflow-y-auto">
        {children}
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-neutral-950 text-neutral-100">
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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}