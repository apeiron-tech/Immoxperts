import React from 'react';
import PublicHeader, { PublicHeaderVariant } from './PublicHeader';
import PublicFooter, { PublicFooterVariant } from './PublicFooter';

interface Props {
  children: React.ReactNode;
  headerVariant?: PublicHeaderVariant;
  footerVariant?: PublicFooterVariant;
}

const PublicShell: React.FC<Props> = ({
  children,
  headerVariant = 'standard',
  footerVariant = 'full',
}) => (
  <div className="min-h-screen flex flex-col bg-white text-slate-900 antialiased selection:bg-propsight-200/60">
    <PublicHeader variant={headerVariant} />
    <main className="flex-1">{children}</main>
    <PublicFooter variant={footerVariant} />
  </div>
);

export default PublicShell;
