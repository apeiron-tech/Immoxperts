import React from 'react';
import { DonutSlice } from '../../types';
import { formatEurCompact } from '../../_utils/calculs';

interface Props {
  slices: DonutSlice[];
  size?: number;
}

const Donut: React.FC<Props> = ({ slices, size = 64 }) => {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  const r = 38;
  const c = 2 * Math.PI * r;
  let cumulative = 0;

  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 100 100" width={size} height={size} className="flex-shrink-0">
        <circle cx="50" cy="50" r={r} fill="white" stroke="#f1f5f9" strokeWidth="14" />
        {slices.map(sl => {
          const portion = sl.value / total;
          const dash = c * portion;
          const offset = c * cumulative;
          cumulative += portion;
          return (
            <circle
              key={sl.label}
              cx="50" cy="50" r={r}
              fill="none"
              stroke={sl.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
            />
          );
        })}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900" style={{ fontSize: 12, fontWeight: 600 }}>
          {formatEurCompact(total)}
        </text>
      </svg>
      <ul className="text-[10px] space-y-0.5 min-w-0 flex-1">
        {slices.map(sl => (
          <li key={sl.label} className="flex items-center justify-between gap-1.5 min-w-0">
            <span className="inline-flex items-center gap-1 min-w-0">
              <span className="w-1.5 h-1.5 rounded-sm flex-shrink-0" style={{ backgroundColor: sl.color }} />
              <span className="text-slate-700 truncate">{sl.label}</span>
            </span>
            <span className="text-slate-900 font-medium tabular-nums flex-shrink-0">{sl.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Donut;
