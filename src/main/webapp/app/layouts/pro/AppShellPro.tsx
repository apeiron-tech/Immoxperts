import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderPro from './HeaderPro';
import SidebarPro from './SidebarPro';
import CommandSearch from './CommandSearch';
import EntityDrawerShell from 'app/shared/drawers/EntityDrawerShell';
import AIDrawer from 'app/shared/drawers/AIDrawer';
import { ToastProvider as ProspectionToastProvider } from 'app/features/prospection/components/shared/Toast';
import { ToastProvider as VeilleToastProvider } from 'app/features/veille/components/shared/Toast';

const AppShellPro: React.FC = () => (
  <ProspectionToastProvider>
    <VeilleToastProvider>
      <div className="h-screen flex flex-col bg-white text-neutral-900 overflow-hidden">
        <HeaderPro />
        <div className="flex-1 flex overflow-hidden">
          <SidebarPro />
          <main className="flex-1 min-w-0 overflow-auto bg-neutral-50">
            <Outlet />
          </main>
        </div>
        <CommandSearch />
        <EntityDrawerShell />
        <AIDrawer />
      </div>
    </VeilleToastProvider>
  </ProspectionToastProvider>
);

export default AppShellPro;
