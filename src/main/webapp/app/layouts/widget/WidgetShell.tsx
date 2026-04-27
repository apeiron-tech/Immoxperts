import React from 'react';
import { Outlet } from 'react-router-dom';

const WidgetShell: React.FC = () => (
  <div className="min-h-screen bg-white flex flex-col">
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-neutral-200 py-2 text-center text-[11px] text-neutral-400">
      Propulsé par Propsight
    </footer>
  </div>
);

export default WidgetShell;
