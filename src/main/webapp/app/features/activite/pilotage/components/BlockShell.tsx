import React from 'react';
import { Maximize2, MoreHorizontal } from 'lucide-react';

interface Props {
  title: string;
  rightSlot?: React.ReactNode;
  showExpand?: boolean;
  showMenu?: boolean;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const BlockShell: React.FC<Props> = ({
  title,
  rightSlot,
  showExpand = false,
  showMenu = true,
  footer,
  children,
  className = '',
  bodyClassName = '',
}) => {
  return (
    <section className={`bg-white border border-slate-200 rounded-md flex flex-col h-full min-h-0 ${className}`}>
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-[12px] font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-0.5">
          {rightSlot}
          {showExpand && (
            <button
              type="button"
              title="Agrandir"
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Maximize2 size={12} />
            </button>
          )}
          {showMenu && (
            <button
              type="button"
              title="Options"
              className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreHorizontal size={13} />
            </button>
          )}
        </div>
      </header>
      <div className={`flex-1 min-h-0 overflow-y-auto ${bodyClassName}`}>{children}</div>
      {footer && <div className="border-t border-slate-200 px-3 py-1.5 flex-shrink-0">{footer}</div>}
    </section>
  );
};

export default BlockShell;
