import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AuthShell: React.FC = () => (
  <div className="min-h-screen bg-neutral-50 flex flex-col">
    <header className="pt-10 pb-8 flex justify-center">
      <Link to="/" className="text-lg font-semibold text-neutral-900">
        Propsight
      </Link>
    </header>
    <main className="flex-1 flex items-start justify-center px-4">
      <div className="w-full max-w-md bg-white border border-neutral-200 rounded-lg shadow-sm p-6">
        <Outlet />
      </div>
    </main>
    <footer className="py-6 text-center text-[11px] text-neutral-500">
      © {new Date().getFullYear()} Propsight
    </footer>
  </div>
);

export default AuthShell;
