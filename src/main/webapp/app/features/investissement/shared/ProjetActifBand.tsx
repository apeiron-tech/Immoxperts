import React, { useState, useRef, useEffect } from 'react';
import { Briefcase, ChevronDown, Plus } from 'lucide-react';
import { ProjetInvestisseur } from '../types';
import { formatEuro } from '../utils/finances';
import { labelStrategy } from '../utils/persona';

interface Props {
  projets: ProjetInvestisseur[];
  activeProjectId: string;
  onChangeProject: (id: string) => void;
  onNewProject: () => void;
  compact?: boolean;
}

const ProjetActifBand: React.FC<Props> = ({ projets, activeProjectId, onChangeProject, onNewProject, compact }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = projets.find(p => p.project_id === activeProjectId);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  if (!active) return null;

  return (
    <div className={`rounded-md border border-propsight-200 bg-gradient-to-r from-propsight-50 to-propsight-50/30 ${compact ? 'px-3 py-2' : 'px-4 py-2.5'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-propsight-700">
            <Briefcase size={12} />
            Projet actif
          </div>
          <div className="h-4 w-px bg-propsight-200" />
          <div className="flex items-center gap-3 text-xs min-w-0">
            <span className="font-semibold text-slate-900 truncate">{active.name}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">Budget {formatEuro(active.budget_max)} max</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">{labelStrategy(active.strategy_type)}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-600">Cible {active.yield_target}% · Cash-flow ≥ {formatEuro(active.cashflow_target)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              Changer de projet
              <ChevronDown size={12} />
            </button>
            {open && (
              <div className="absolute right-0 top-full mt-1 w-80 rounded-md border border-slate-200 bg-white shadow-lg z-30">
                <div className="p-2 max-h-80 overflow-y-auto">
                  {projets.map(p => (
                    <button
                      type="button"
                      key={p.project_id}
                      onClick={() => {
                        onChangeProject(p.project_id);
                        setOpen(false);
                      }}
                      className={`w-full text-left rounded-md px-3 py-2 hover:bg-slate-50 ${p.project_id === activeProjectId ? 'bg-propsight-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-slate-900">{p.name}</div>
                        {p.project_id === activeProjectId && <span className="text-[10px] font-semibold text-propsight-700">ACTIF</span>}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {formatEuro(p.budget_max)} · {labelStrategy(p.strategy_type)} · {p.nb_opportunites} opp.
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-2">
                  <button
                    type="button"
                    onClick={() => {
                      onNewProject();
                      setOpen(false);
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-propsight-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-propsight-700"
                  >
                    <Plus size={12} />
                    Nouveau projet
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetActifBand;
