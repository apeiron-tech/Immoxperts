import React from 'react';
import BlockShell from './BlockShell';
import { MandatItem } from '../../types';
import { MOCK_MANDATS } from '../../_mocks/pilotage';

const chipStyle = (jours: number): string => {
  if (jours < 15) return 'bg-red-50 text-red-700';
  if (jours <= 30) return 'bg-amber-50 text-amber-700';
  return 'bg-slate-100 text-slate-600';
};

const handleClick = (m: MandatItem) => {
  console.warn('[Pilotage] Mandat clic', m.mandat_id);
};

const MandatsEcheance: React.FC = () => (
  <BlockShell
    title="Mandats à échéance"
    showMenu
    footer={
      <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
        Voir tous les mandats →
      </button>
    }
  >
    <ul>
      {MOCK_MANDATS.map(m => (
        <li
          key={m.mandat_id}
          onClick={() => handleClick(m)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-slate-500 leading-tight">{m.type}</p>
            <p className="text-[12px] font-medium text-slate-900 truncate leading-tight">{m.adresse}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] text-slate-500 leading-tight">{m.expireLe}</p>
            <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5 tabular-nums ${chipStyle(m.jours)}`}>
              J-{m.jours}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </BlockShell>
);

export default MandatsEcheance;
