import React from 'react';

interface Props {
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  panel: React.ReactNode;
  map: React.ReactNode;
}

const SplitMapPageShell: React.FC<Props> = ({ title, toolbar, panel, map }) => (
  <div className="flex flex-col h-full min-h-0">
    {(title || toolbar) && (
      <div className="flex-shrink-0 bg-white border-b border-neutral-200 px-6 pt-3 pb-2 flex items-center justify-between gap-3">
        {typeof title === 'string' ? (
          <h1 className="text-[20px] font-semibold text-neutral-900">{title}</h1>
        ) : (
          title
        )}
        {toolbar}
      </div>
    )}
    <div className="flex-1 min-h-0 flex overflow-hidden">
      <div className="w-[420px] flex-shrink-0 border-r border-neutral-200 bg-white overflow-auto">{panel}</div>
      <div className="flex-1 min-w-0 bg-neutral-100">{map}</div>
    </div>
  </div>
);

export default SplitMapPageShell;
