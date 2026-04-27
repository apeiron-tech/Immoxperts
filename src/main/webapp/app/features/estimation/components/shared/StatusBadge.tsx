import React from 'react';
import { StatutEstimation } from '../../types';

const CONFIG: Record<StatutEstimation, { label: string; className: string }> = {
  brouillon: { label: 'Brouillon', className: 'bg-slate-100 text-slate-600' },
  finalisee: { label: 'Finalisée', className: 'bg-blue-50 text-blue-700' },
  envoyee: { label: 'Envoyée', className: 'bg-propsight-50 text-propsight-700' },
  ouverte: { label: 'Ouverte', className: 'bg-green-50 text-green-700' },
  archivee: { label: 'Archivée', className: 'bg-slate-100 text-slate-400' },
};

export const StatusBadge: React.FC<{ statut: StatutEstimation }> = ({ statut }) => {
  const { label, className } = CONFIG[statut];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70" />
      {label}
    </span>
  );
};
