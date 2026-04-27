import React from 'react';
import { Outlet } from 'react-router-dom';

const ReportShell: React.FC = () => (
  <div className="min-h-screen bg-neutral-50 flex flex-col">
    <header className="bg-white border-b border-neutral-200">
      <div className="max-w-[960px] mx-auto px-6 h-14 flex items-center justify-between">
        <div className="text-sm font-semibold text-neutral-900">Propsight</div>
        <div className="text-xs text-neutral-500">Rapport sécurisé</div>
      </div>
    </header>
    <main className="flex-1">
      <Outlet />
    </main>
    <footer className="border-t border-neutral-200 py-3 text-center text-[11px] text-neutral-500">
      Mentions légales · {new Date().getFullYear()}
    </footer>
  </div>
);

export default ReportShell;
