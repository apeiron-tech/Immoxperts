import React from 'react';
import type { FunnelStage } from '../../types';

interface Props {
  stages: FunnelStage[];
  highlighted?: string;
  onSelect?: (key: string) => void;
}

const FunnelVisualization: React.FC<Props> = ({ stages, highlighted, onSelect }) => {
  return (
    <div className="space-y-1">
      {stages.map((s, idx) => {
        const width = Math.max(8, s.pct_from_top);
        const isHighlighted = highlighted === s.key;
        return (
          <button
            key={s.key}
            onClick={() => onSelect?.(s.key)}
            className={`w-full flex items-center gap-2 hover:bg-slate-50 rounded-md px-1.5 py-1 transition-colors ${
              isHighlighted ? 'bg-propsight-50 ring-1 ring-propsight-300' : ''
            }`}
          >
            <div className="w-32 flex-shrink-0 text-left">
              <div className="text-[11px] font-semibold text-slate-800 leading-tight">{s.label}</div>
              <div className="text-[15px] font-bold text-slate-900 tabular-nums leading-tight">
                {s.value.toLocaleString('fr-FR')}
              </div>
            </div>
            <div className="flex-1 flex items-center gap-1.5">
              <div
                className={`h-5 rounded-md ${
                  idx === stages.length - 1 || s.key === 'mandats'
                    ? 'bg-propsight-500'
                    : idx === 0
                      ? 'bg-propsight-200'
                      : 'bg-propsight-300'
                }`}
                style={{ width: `${width}%` }}
              />
              <span className="text-[10.5px] text-slate-500 tabular-nums whitespace-nowrap">
                {s.pct_from_top} %
              </span>
            </div>
            <span className="text-[10.5px] text-slate-500 tabular-nums w-14 text-right">
              {idx > 0 ? `${s.pct_from_previous} %` : ''}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FunnelVisualization;
