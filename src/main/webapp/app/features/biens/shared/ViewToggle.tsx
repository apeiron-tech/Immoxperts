import React from 'react';

interface View {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface Props {
  views: View[];
  current: string;
  onChange: (id: string) => void;
}

const ViewToggle: React.FC<Props> = ({ views, current, onChange }) => {
  return (
    <div className="inline-flex items-center border border-slate-200 rounded-md bg-white overflow-hidden">
      {views.map((v, i) => (
        <button
          key={v.id}
          onClick={() => onChange(v.id)}
          className={`flex items-center gap-1.5 h-8 px-3 text-[12px] font-medium transition-colors ${
            current === v.id ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          } ${i < views.length - 1 ? 'border-r border-slate-200' : ''}`}
        >
          {v.icon}
          {v.label}
        </button>
      ))}
    </div>
  );
};

export default ViewToggle;
