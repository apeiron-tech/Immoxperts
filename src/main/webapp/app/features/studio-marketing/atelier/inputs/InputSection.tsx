import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
  hint?: string;
}

const InputSection: React.FC<Props> = ({ title, children, hint }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <h3 className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
        {title}
      </h3>
      {hint && <span className="text-[10.5px] text-neutral-400">{hint}</span>}
    </div>
    {children}
  </div>
);

export default InputSection;
