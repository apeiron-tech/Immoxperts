import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import PublicHeader from 'app/features/public/layout/PublicHeader';
import PublicFooter from 'app/features/public/layout/PublicFooter';

export type PublicShellVariant = 'marketing' | 'marketing-pro' | 'search' | 'map' | 'simulator';
export type PublicShellFooter = 'full' | 'minimal';
export type PublicShellHeader = 'standard' | 'marketing-pro';

interface PublicShellProps {
  variant?: PublicShellVariant;
  footer?: PublicShellFooter;
  header?: PublicShellHeader;
}

const PublicShell: React.FC<PublicShellProps> = ({ variant = 'marketing', footer = 'full', header = 'standard' }) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader variant={header} />
      <main data-variant={variant} className="flex-1">
        <Outlet />
      </main>
      <PublicFooter variant={footer} />
    </div>
  );
};

export default PublicShell;
