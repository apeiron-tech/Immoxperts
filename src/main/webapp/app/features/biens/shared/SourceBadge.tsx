import React from 'react';
import { SourceAnnonce } from '../types';

interface Props {
  source: SourceAnnonce;
  size?: 'sm' | 'md';
}

const LABELS: Record<SourceAnnonce, string> = {
  seloger: 'SeLoger',
  pap: 'PAP',
  leboncoin: 'leboncoin',
  logic_immo: 'LOGIC-IMMO',
  bienici: "bien'ici",
};

const COLORS: Record<SourceAnnonce, { bg: string; fg: string }> = {
  seloger: { bg: 'bg-red-50', fg: 'text-red-600' },
  pap: { bg: 'bg-blue-50', fg: 'text-blue-700' },
  leboncoin: { bg: 'bg-orange-50', fg: 'text-orange-600' },
  logic_immo: { bg: 'bg-amber-50', fg: 'text-amber-700' },
  bienici: { bg: 'bg-sky-50', fg: 'text-sky-700' },
};

const SourceBadge: React.FC<Props> = ({ source, size = 'sm' }) => {
  const c = COLORS[source];
  const px = size === 'sm' ? 'px-1.5 h-4 text-[9px]' : 'px-2 h-5 text-[10px]';
  return (
    <span className={`inline-flex items-center rounded ${px} ${c.bg} ${c.fg} font-bold uppercase tracking-wider`}>
      {LABELS[source]}
    </span>
  );
};

export default SourceBadge;
