import React from 'react';
import { GripVertical, Check, ChevronRight } from 'lucide-react';
import type { WidgetStep } from '../types';

interface Props {
  step: WidgetStep;
  selected: boolean;
  onSelect: () => void;
}

const StepListItem: React.FC<Props> = ({ step, selected, onSelect }) => {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-2.5 py-2.5 rounded-md transition-colors group flex items-center gap-2 ${
        selected ? 'bg-propsight-50 border border-propsight-200' : 'border border-transparent hover:bg-slate-50'
      }`}
    >
      <GripVertical size={14} className="text-slate-300 group-hover:text-slate-400 flex-shrink-0" />
      <div
        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
          selected ? 'bg-propsight-600 text-white' : 'bg-slate-100 text-slate-600'
        }`}
      >
        {step.index}
      </div>
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${selected ? 'text-propsight-900' : 'text-slate-900'}`}>{step.name}</div>
        <div className="text-xs text-slate-500 truncate">{step.subtitle}</div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
            step.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {step.active ? 'Actif' : 'Masqué'}
        </span>
        {step.complete ? (
          <Check size={14} className="text-emerald-500" />
        ) : (
          <div className="w-3.5 h-3.5 rounded-full border border-slate-300" />
        )}
        <ChevronRight size={13} className="text-slate-300" />
      </div>
    </button>
  );
};

export default StepListItem;
