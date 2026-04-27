import React from 'react';
import ProSidebar from './ProSidebar';
import ProHeader from './ProHeader';

interface Props {
  children: React.ReactNode;
}

const ProLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50 text-slate-900">
      <ProSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ProHeader />
        <main className="flex-1 min-h-0 overflow-hidden">{children}</main>
      </div>
    </div>
  );
};

export default ProLayout;
