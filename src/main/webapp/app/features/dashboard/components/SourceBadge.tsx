import React from 'react';
import type { BadgeTone } from '../types';

const TONE_CLASSES: Record<BadgeTone, string> = {
  violet: 'bg-propsight-50 text-propsight-700 border-propsight-100',
  blue: 'bg-sky-50 text-sky-700 border-sky-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-rose-50 text-rose-700 border-rose-100',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface Props {
  label: string;
  tone?: BadgeTone;
}

const SourceBadge: React.FC<Props> = ({ label, tone = 'gray' }) => (
  <span className={`inline-flex items-center h-[20px] px-1.5 rounded border text-[10.5px] font-medium ${TONE_CLASSES[tone]}`}>
    {label}
  </span>
);

export default SourceBadge;
