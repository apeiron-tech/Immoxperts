import React from 'react';
import type { FunnelStep } from '../types';

interface Props {
  steps: FunnelStep[];
}

const formatNumber = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

const FunnelBar: React.FC<Props> = ({ steps }) => {
  const max = Math.max(...steps.map(s => s.value));
  return (
    <div className="space-y-2">
      {steps.map((s, i) => {
        const pct = (s.value / max) * 100;
        return (
          <div key={s.label} className="grid grid-cols-[160px_1fr_auto] items-center gap-3">
            <span className="text-xs text-slate-600 truncate">{s.label}</span>
            <div className="h-6 bg-slate-100 rounded overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-propsight-500 to-propsight-400 rounded transition-all"
                style={{
                  width: `${pct}%`,
                  opacity: 1 - i * 0.08,
                }}
              />
            </div>
            <div className="text-xs tabular-nums text-right flex items-center gap-2 min-w-[120px] justify-end">
              <span className="font-semibold text-slate-900">{formatNumber(s.value)}</span>
              {s.rate !== undefined && <span className="text-slate-400">({s.rate.toString().replace('.', ',')} %)</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FunnelBar;
