import React from 'react';
import { Check } from 'lucide-react';
import { niveauCoherence } from '../utils/scoring';

interface Props {
  pct: number;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

const CoherencePill: React.FC<Props> = ({ pct, showLabel = true, size = 'md' }) => {
  const n = niveauCoherence(pct);
  const paddingClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border font-medium ${n.color} ${paddingClass}`}>
      {pct >= 60 && <Check size={size === 'sm' ? 10 : 12} />}
      {showLabel ? `Cohérence ${pct}%` : `${pct}%`}
    </span>
  );
};

export default CoherencePill;
