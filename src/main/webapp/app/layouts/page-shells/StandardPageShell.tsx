import React from 'react';

interface Props {
  title?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  toolbar?: React.ReactNode;
  kpis?: React.ReactNode;
  children: React.ReactNode;
}

const StandardPageShell: React.FC<Props> = ({ title, breadcrumb, toolbar, kpis, children }) => (
  <div className="flex flex-col min-h-full">
    {(title || breadcrumb) && (
      <div className="bg-white border-b border-neutral-200 px-6 pt-4 pb-3">
        {breadcrumb && <div className="text-[12px] text-neutral-500 mb-1">{breadcrumb}</div>}
        <div className="flex items-center justify-between gap-3">
          {typeof title === 'string' ? (
            <h1 className="text-[22px] font-semibold text-neutral-900">{title}</h1>
          ) : (
            title
          )}
          {toolbar}
        </div>
      </div>
    )}
    {kpis && <div className="px-6 pt-4">{kpis}</div>}
    <div className="flex-1 px-6 py-4">{children}</div>
  </div>
);

export default StandardPageShell;
