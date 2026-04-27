import React from 'react';

interface Props {
  title: string;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
  className?: string;
}

const PanelCard: React.FC<Props> = ({ title, subtitle, right, footer, children, bodyClassName = '', className = '' }) => (
  <section className={`flex flex-col h-full min-h-0 overflow-hidden bg-white border border-slate-200 rounded-lg ${className}`}>
    <header className="flex items-center justify-between px-3 py-2 border-b border-slate-100 flex-shrink-0 gap-2">
      <div className="min-w-0 flex items-center gap-1.5">
        <h2 className="text-[12.5px] font-semibold text-slate-900 truncate">{title}</h2>
        {subtitle && <span className="text-[11px] text-slate-400 truncate">{subtitle}</span>}
      </div>
      {right && <div className="flex-shrink-0 flex items-center gap-1.5">{right}</div>}
    </header>
    <div className={`flex-1 min-h-0 ${bodyClassName}`}>{children}</div>
    {footer && (
      <footer className="px-3 py-1.5 border-t border-slate-100 flex-shrink-0">
        {footer}
      </footer>
    )}
  </section>
);

export default PanelCard;
