import React from 'react';
import { DPE } from '../types';

interface Props {
  value: DPE;
  size?: 'sm' | 'md';
}

const COLORS: Record<NonNullable<DPE>, string> = {
  A: '#008F3D',
  B: '#4CB849',
  C: '#C7D933',
  D: '#F5E93B',
  E: '#F9B233',
  F: '#EC7D2A',
  G: '#E30613',
};

const DPEBadge: React.FC<Props> = ({ value, size = 'sm' }) => {
  if (!value) return <span className="text-xs text-slate-400">—</span>;
  const dim = size === 'sm' ? 'w-5 h-5 text-[10px]' : 'w-6 h-6 text-[11px]';
  const color = COLORS[value];
  const isLight = ['C', 'D'].includes(value);
  return (
    <span
      className={`inline-flex items-center justify-center ${dim} rounded font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}
      style={{ backgroundColor: color }}
    >
      {value}
    </span>
  );
};

export default DPEBadge;
