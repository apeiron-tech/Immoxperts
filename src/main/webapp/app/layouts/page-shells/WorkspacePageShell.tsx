import React from 'react';

interface Props {
  title?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

const WorkspacePageShell: React.FC<Props> = ({ title, breadcrumb, toolbar, children }) => (
  <div className="flex flex-col h-full min-h-0">
    {(title || breadcrumb) && (
      <div className="flex-shrink-0 bg-white border-b border-neutral-200 px-6 pt-3 pb-2">
        {breadcrumb && <div className="text-[12px] text-neutral-500 mb-1">{breadcrumb}</div>}
        <div className="flex items-center justify-between gap-3">
          {typeof title === 'string' ? (
            <h1 className="text-[20px] font-semibold text-neutral-900">{title}</h1>
          ) : (
            title
          )}
          {toolbar}
        </div>
      </div>
    )}
    <div className="flex-1 min-h-0 overflow-hidden">{children}</div>
  </div>
);

export default WorkspacePageShell;
