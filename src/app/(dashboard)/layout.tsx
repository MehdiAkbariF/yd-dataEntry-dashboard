import Header from '@/components/common/Header';
import Sidebar from '@/components/common/Sidebar';
import ScratchpadDrawer from '@/components/scratchpad/ScratchpadDrawer';
import AuthGuard from '@/components/common/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen w-full overflow-hidden bg-neutral-950">
        {/* Sidebar راست */}
        <Sidebar />

        {/* بخش اصلی محتوا */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-neutral-950">
            {children}
          </main>
        </div>

        {/* دفترچه یادداشت همراه اپراتور */}
        <ScratchpadDrawer />
      </div>
    </AuthGuard>
  );
}