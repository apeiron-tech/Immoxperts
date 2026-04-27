import React from 'react';
import { DpeGes } from '../../types';

const DPE_CONFIG: { value: DpeGes; label: string; color: string }[] = [
  { value: 'A', label: 'A', color: 'bg-green-600 text-white' },
  { value: 'B', label: 'B', color: 'bg-green-400 text-white' },
  { value: 'C', label: 'C', color: 'bg-yellow-400 text-white' },
  { value: 'D', label: 'D', color: 'bg-orange-400 text-white' },
  { value: 'E', label: 'E', color: 'bg-orange-500 text-white' },
  { value: 'F', label: 'F', color: 'bg-red-500 text-white' },
  { value: 'G', label: 'G', color: 'bg-red-700 text-white' },
];

interface Props {
  value: DpeGes;
  onChange: (v: DpeGes) => void;
  label?: string;
}

export const DPESelector: React.FC<Props> = ({ value, onChange, label }) => (
  <div>
    {label && <p className="text-xs text-slate-500 mb-1.5">{label}</p>}
    <div className="flex gap-1">
      {DPE_CONFIG.map(({ value: v, label: l, color }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`w-8 h-8 rounded text-xs font-bold transition-all ${color} ${
            value === v ? 'ring-2 ring-offset-1 ring-slate-700 scale-110' : 'opacity-60 hover:opacity-90'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  </div>
);
