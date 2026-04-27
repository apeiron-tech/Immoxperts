import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Avatar, PrimaryButton, SecondaryButton, WorkloadBadge } from './primitives';
import type { Collaborateur } from '../types';

interface Props {
  open: boolean;
  onClose: () => void;
  leadsCount: number;
  collaborateurs: Collaborateur[];
  mode?: 'single' | 'bulk';
}

// Algo V1 : zone + charge
function recommandation(collabs: Collaborateur[]): Collaborateur[] {
  return [...collabs]
    .filter(c => c.role !== 'VIEWER')
    .sort((a, b) => a.workload_score - b.workload_score);
}

const AssignModal: React.FC<Props> = ({ open, onClose, leadsCount, collaborateurs, mode = 'bulk' }) => {
  const [mapping, setMapping] = useState<Record<string, number>>({});
  if (!open) return null;
  const reco = recommandation(collaborateurs).slice(0, 6);

  const total = Object.values(mapping).reduce((a, b) => a + b, 0);

  const autoAssign = () => {
    const per = Math.floor(leadsCount / reco.length);
    const remainder = leadsCount - per * reco.length;
    const next: Record<string, number> = {};
    reco.forEach((c, i) => {
      next[c.user_id] = per + (i < remainder ? 1 : 0);
    });
    setMapping(next);
  };

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('[Demo] Assignation bulk', { mapping, mode, leadsCount });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/40 z-[500]" onClick={onClose} />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] max-w-[94vw] bg-white rounded-lg shadow-2xl z-[501] flex flex-col max-h-[80vh]">
        <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200">
          <div>
            <div className="text-[14px] font-bold text-slate-900">
              Assigner {leadsCount} leads
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Distribution recommandée : zone + charge (V1)
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} />
          </button>
        </div>

        <div className="px-4 py-2 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-600">
            {total} / {leadsCount} leads assignés
          </span>
          <button
            onClick={autoAssign}
            className="inline-flex items-center gap-1 text-[11px] text-propsight-700 hover:underline font-medium"
          >
            <Sparkles size={11} />
            Suggestion auto
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {reco.map(c => (
            <div key={c.user_id} className="flex items-center gap-3 px-4 py-2">
              <Avatar initials={c.initials} color={c.avatar_color} size={28} />
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-slate-800 truncate">{c.display_name}</div>
                <div className="text-[10.5px] text-slate-500 truncate">
                  {c.zones.map(z => z.label).join(', ')}
                </div>
              </div>
              <div className="w-28">
                <WorkloadBadge score={c.workload_score} status={c.workload_status} compact />
              </div>
              <input
                type="number"
                min={0}
                max={leadsCount}
                value={mapping[c.user_id] ?? 0}
                onChange={e =>
                  setMapping(m => ({ ...m, [c.user_id]: Math.max(0, parseInt(e.target.value || '0', 10)) }))
                }
                className="w-16 text-[12px] text-center border border-slate-200 rounded-md px-1 py-0.5 tabular-nums"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-1.5 px-4 py-3 border-t border-slate-200 bg-slate-50">
          <SecondaryButton size="sm" onClick={onClose}>
            Annuler
          </SecondaryButton>
          <PrimaryButton size="sm" onClick={handleSubmit} disabled={total === 0}>
            Assigner {total > 0 ? `(${total})` : ''}
          </PrimaryButton>
        </div>
      </div>
    </>
  );
};

export default AssignModal;
