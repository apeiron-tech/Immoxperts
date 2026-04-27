import React from 'react';
import { StatutMandat } from '../types';

interface Props {
  statut: StatutMandat | null;
  size?: 'sm' | 'md';
}

const STYLES: Record<Exclude<StatutMandat, null>, { bg: string; fg: string; label: string }> = {
  mandat_exclusif: { bg: 'bg-propsight-50', fg: 'text-propsight-700', label: 'Mandat exclusif' },
  mandat_simple: { bg: 'bg-slate-100', fg: 'text-slate-700', label: 'Mandat simple' },
  sous_compromis: { bg: 'bg-amber-50', fg: 'text-amber-700', label: 'Sous compromis' },
  estimation_en_cours: { bg: 'bg-blue-50', fg: 'text-blue-700', label: 'Estimation en cours' },
  prospection: { bg: 'bg-slate-50', fg: 'text-slate-600', label: 'Prospection' },
};

const StatutBadge: React.FC<Props> = ({ statut, size = 'sm' }) => {
  if (!statut) return <span className="text-xs text-slate-400">—</span>;
  const s = STYLES[statut];
  const px = size === 'sm' ? 'px-2 h-5 text-[11px]' : 'px-2.5 h-6 text-[12px]';
  return (
    <span className={`inline-flex items-center rounded ${px} ${s.bg} ${s.fg} font-medium whitespace-nowrap`}>
      {s.label}
    </span>
  );
};

export default StatutBadge;
