import React from 'react';
import BlockShell from './BlockShell';
import { AgendaItem, AgendaStatut } from '../../types';
import { MOCK_AGENDA } from '../../_mocks/pilotage';

const STATUT_STYLES: Record<AgendaStatut, string> = {
  'Confirmé': 'bg-green-50 text-green-700',
  'À faire':  'bg-amber-50 text-amber-700',
  'Interne':  'bg-slate-100 text-slate-600',
};

const handleClick = (item: AgendaItem) => {
  console.warn('[Pilotage] Agenda clic', item.id, item.lead_id);
};

const AgendaDuJour: React.FC = () => (
  <BlockShell
    title="Agenda du jour"
    showExpand
    showMenu
    footer={
      <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
        Voir tout l'agenda →
      </button>
    }
  >
    <ul>
      {MOCK_AGENDA.map(item => (
        <li
          key={item.id}
          onClick={() => handleClick(item)}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
        >
          <span className="text-[11px] font-medium text-slate-500 tabular-nums w-9 flex-shrink-0">{item.heure}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-900 truncate leading-tight">{item.titre}</p>
            <p className="text-[11px] text-slate-500 truncate">{item.sousInfo}</p>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 ${STATUT_STYLES[item.statut]}`}>{item.statut}</span>
        </li>
      ))}
    </ul>
  </BlockShell>
);

export default AgendaDuJour;
