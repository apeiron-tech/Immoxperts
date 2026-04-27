import React from 'react';
import BlockShell from './BlockShell';
import { Entrant } from '../../types';
import { MOCK_ENTRANTS } from '../../_mocks/pilotage';

const handleClick = (e: Entrant) => {
  console.warn('[Pilotage] Entrant clic', e.lead_id);
};

const EntrantsRecents: React.FC = () => (
  <BlockShell
    title="Entrants récents"
    showMenu
    footer={
      <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
        Voir tous les entrants →
      </button>
    }
  >
    <ul>
      {MOCK_ENTRANTS.map(item => (
        <li
          key={item.lead_id}
          onClick={() => handleClick(item)}
          className="flex items-center gap-2 px-3 py-1 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">
            {item.initiales}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-slate-900 truncate leading-tight">{item.nom}</p>
            <p className="text-[11px] text-slate-500 truncate">{item.sousInfo}</p>
          </div>
          <span className="text-[10px] text-slate-400 flex-shrink-0">{item.time}</span>
        </li>
      ))}
    </ul>
  </BlockShell>
);

export default EntrantsRecents;
