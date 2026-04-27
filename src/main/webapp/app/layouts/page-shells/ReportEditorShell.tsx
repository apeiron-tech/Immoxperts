import React from 'react';

interface Props {
  title?: React.ReactNode;
  toolbar?: React.ReactNode;
  editor: React.ReactNode;
  preview: React.ReactNode;
}

const ReportEditorShell: React.FC<Props> = ({ title, toolbar, editor, preview }) => (
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
      <div className="w-[480px] flex-shrink-0 border-r border-neutral-200 bg-white overflow-auto">{editor}</div>
      <div className="flex-1 min-w-0 bg-neutral-50 overflow-auto">{preview}</div>
    </div>
  </div>
);

export default ReportEditorShell;
