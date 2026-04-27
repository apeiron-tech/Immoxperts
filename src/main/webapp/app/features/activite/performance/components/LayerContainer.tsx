import React from 'react';

interface Props {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const LayerContainer: React.FC<Props> = ({ number, title, children, className = '' }) => (
  <section className={`bg-white border border-slate-200 rounded-md p-2 ${className}`}>
    <header className="flex items-center mb-1.5 flex-shrink-0">
      <h2 className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
        <span className="text-slate-400">{number}.</span> {title}
      </h2>
    </header>
    <div className="flex-1 min-h-0 flex flex-col gap-1.5">{children}</div>
  </section>
);

export default LayerContainer;
