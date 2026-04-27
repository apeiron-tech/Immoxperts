import React from 'react';
import { Info } from 'lucide-react';
import { Avatar, ProgressBar, Chip } from './primitives';
import type { Collaborateur } from '../types';

interface Props {
  collaborateurs: Collaborateur[];
}

const WorkloadPanel: React.FC<Props> = ({ collaborateurs }) => {
  const sorted = [...collaborateurs]
    .filter(c => c.role !== 'VIEWER')
    .sort((a, b) => b.workload_score - a.workload_score);

  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-1.5">
          <h3 className="text-[12.5px] font-semibold text-slate-800">Charge équipe</h3>
          <button className="text-slate-400 hover:text-slate-600" title="Calcul sans temps agenda (V1.5)">
            <Info size={11} />
          </button>
        </div>
        <button className="text-[10.5px] text-propsight-700 hover:underline">Voir tout</button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {sorted.slice(0, 4).map(c => {
          const tone =
            c.workload_status === 'surcharge'
              ? 'red'
              : c.workload_status === 'charge'
                ? 'orange'
                : c.workload_status === 'normal'
                  ? 'slate'
                  : 'emerald';
          const label =
            c.workload_status === 'surcharge'
              ? 'Surcharge'
              : c.workload_status === 'charge'
                ? 'Chargé'
                : c.workload_status === 'normal'
                  ? 'Normal'
                  : 'Disponible';
          return (
            <div key={c.user_id} className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
              <Avatar initials={c.initials} color={c.avatar_color} size={22} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-[11.5px] font-semibold text-slate-800 truncate">{c.display_name}</div>
                  <Chip tone={tone === 'slate' ? 'slate' : tone === 'emerald' ? 'green' : tone === 'orange' ? 'orange' : 'red'}>
                    {label}
                  </Chip>
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="flex-1">
                    <ProgressBar
                      value={c.workload_score}
                      tone={tone}
                      height={3}
                    />
                  </div>
                  <span className="text-[10.5px] text-slate-500 tabular-nums">{c.workload_score}/100</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WorkloadPanel;
