import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}

const SectionCard: React.FC<Props> = ({ title, subtitle, action, children, className, bodyClassName }) => (
  <section className={`bg-white border border-neutral-200 rounded-lg flex flex-col min-h-0 ${className ?? ''}`}>
    <header className="flex items-start justify-between px-4 pt-3.5 pb-2">
      <div>
        <h3 className="text-[13.5px] font-semibold text-neutral-900">{title}</h3>
        {subtitle && <p className="text-[11.5px] text-neutral-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </header>
    <div className={`px-4 pb-3.5 flex-1 min-h-0 ${bodyClassName ?? ''}`}>{children}</div>
  </section>
);

export default SectionCard;
