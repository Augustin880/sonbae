import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { DrawerModal } from '@/ui/components/DrawerModal';
import { Sidebar } from '@/ui/layouts/Sidebar';
import { TopNav } from '@/ui/layouts/TopNav';

export function AppLayout() {
  const [sidebarOuvrir, setSidebarOuvrir] = useState(false);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-ui focus:bg-surface focus:px-4 focus:py-2 focus:font-bold focus:text-brand"
        href="#main-content"
      >
        Aller au contenu principal
      </a>

      <div className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">
        <Sidebar />
      </div>

      <DrawerModal onClose={() => setSidebarOuvrir(false)} open={sidebarOuvrir} title="Navigation">
        <Sidebar onNavigate={() => setSidebarOuvrir(false)} />
      </DrawerModal>

      <div className="lg:pl-72">
        <TopNav onOuvrirSidebar={() => setSidebarOuvrir(true)} />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8" id="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
