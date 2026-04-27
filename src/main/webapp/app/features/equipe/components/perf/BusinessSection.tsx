import React from 'react';
import { Segmented } from '../primitives';
import type { CaMonthlyPoint, MandatsStatusSlice } from '../../types';

interface Props {
  monthly: CaMonthlyPoint[];
  mandats: MandatsStatusSlice[];
  mandatsTotal: number;
}

const TONE_FILL: Record<string, string> = {
  violet: '#8B5CF6',
  blue: '#3B82F6',
  orange: '#F59E0B',
  green: '#10B981',
  slate: '#94A3B8',
};

const CaBarChart: React.FC<{ points: CaMonthlyPoint[]; mode: 'CA' | 'Mandats' }> = ({ points, mode }) => {
  const max = Math.max(...points.map(p => (mode === 'CA' ? p.ca_realise : p.mandats)));
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 flex items-end gap-3 pt-4">
        {points.map(p => {
          const value = mode === 'CA' ? p.ca_realise : p.mandats;
          const h = (value / max) * 100;
          return (
            <div key={p.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="text-[10px] font-semibold text-slate-700 tabular-nums"
                style={{ marginBottom: 2 }}
              >
                {mode === 'CA'
                  ? `${(p.ca_realise / 1000).toFixed(2).replace('.', ',')} M€`
                  : p.mandats}
              </div>
              <div
                className="w-full bg-propsight-500 rounded-t-md"
                style={{ height: `${h}%`, minHeight: 4 }}
              />
              <div className="text-[10px] text-slate-500">{p.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const MandatsDonut: React.FC<{ slices: MandatsStatusSlice[]; total: number }> = ({ slices, total }) => {
  const size = 140;
  const radius = 54;
  const stroke = 18;
  const circ = 2 * Math.PI * radius;
  let cursor = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#F1F5F9"
          strokeWidth={stroke}
          fill="none"
        />
        {slices.map((s, i) => {
          const dash = (s.pct / 100) * circ;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={TONE_FILL[s.tone]}
              strokeWidth={stroke}
              fill="none"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeDashoffset={-cursor}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          cursor += dash;
          return el;
        })}
        <text
          x={size / 2}
          y={size / 2 - 2}
          textAnchor="middle"
          className="text-[17px] font-bold fill-slate-900"
        >
          {total}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 14}
          textAnchor="middle"
          className="text-[9.5px] fill-slate-500"
        >
          mandats
        </text>
      </svg>
      <div className="space-y-1 flex-1">
        {slices.map(s => (
          <div key={s.label} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: TONE_FILL[s.tone] }}
            />
            <span className="text-slate-600 flex-1 truncate">{s.label}</span>
            <span className="font-semibold text-slate-800 tabular-nums">{s.value} ({s.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const BusinessSection: React.FC<Props> = ({ monthly, mandats, mandatsTotal }) => {
  const [mode, setMode] = React.useState<'CA' | 'Mandats'>('CA');
  return (
    <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(340px,1fr)] gap-2 min-h-0">
      <div className="bg-white border border-slate-200 rounded-md p-3 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-1">
          <div className="text-[11.5px] font-semibold text-slate-800">CA par mois (réalisé)</div>
          <Segmented
            value={mode}
            onChange={v => setMode(v as 'CA' | 'Mandats')}
            options={[
              { value: 'CA', label: 'CA' },
              { value: 'Mandats', label: 'Mandats' },
            ]}
          />
        </div>
        <CaBarChart points={monthly} mode={mode} />
        <div className="text-[10px] text-slate-400 mt-1">May, 6 mois · 1,32 M€</div>
      </div>
      <div className="bg-white border border-slate-200 rounded-md p-3 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[11.5px] font-semibold text-slate-800">Mandats par statut</div>
          <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
        </div>
        <MandatsDonut slices={mandats} total={mandatsTotal} />
      </div>
    </div>
  );
};

export default BusinessSection;
