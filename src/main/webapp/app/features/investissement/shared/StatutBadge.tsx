import React from 'react';
import { OpportunityStatus, DossierStatus } from '../types';
import { labelStatutOpp, labelStatutDossier, colorStatutDossier } from '../utils/persona';

export const StatutOppBadge: React.FC<{ status: OpportunityStatus }> = ({ status }) => {
  const colors: Record<OpportunityStatus, string> = {
    nouveau: 'bg-propsight-50 text-propsight-700 border-propsight-200',
    a_qualifier: 'bg-amber-50 text-amber-700 border-amber-200',
    compare: 'bg-sky-50 text-sky-700 border-sky-200',
    a_arbitrer: 'bg-orange-50 text-orange-700 border-orange-200',
    suivi: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ecarte: 'bg-slate-50 text-slate-500 border-slate-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${colors[status]}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {labelStatutOpp(status)}
    </span>
  );
};

export const StatutDossierBadge: React.FC<{ status: DossierStatus }> = ({ status }) => {
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${colorStatutDossier(status)}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {labelStatutDossier(status)}
    </span>
  );
};

export const DPEBadge: React.FC<{ value: string }> = ({ value }) => {
  const colors: Record<string, string> = {
    A: 'bg-emerald-600 text-white',
    B: 'bg-lime-500 text-white',
    C: 'bg-yellow-400 text-slate-900',
    D: 'bg-amber-400 text-slate-900',
    E: 'bg-orange-500 text-white',
    F: 'bg-red-500 text-white',
    G: 'bg-red-700 text-white',
  };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-[10px] font-bold ${colors[value] ?? 'bg-slate-300'}`}>
      {value}
    </span>
  );
};
