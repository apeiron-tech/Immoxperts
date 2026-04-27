import React from 'react';
import BlockShell from './BlockShell';
import { LeadChaud, Priority } from '../../types';
import { MOCK_LEADS_CHAUDS } from '../../_mocks/pilotage';

const PRIORITY_DOTS: Record<Priority, { color: string; label: string }> = {
  haute:   { color: 'bg-red-500',   label: 'Haute' },
  moyenne: { color: 'bg-amber-500', label: 'Moyenne' },
  basse:   { color: 'bg-slate-400', label: 'Basse' },
};

const handleClick = (lead: LeadChaud) => {
  console.warn('[Pilotage] Lead chaud clic', lead.lead_id);
};

const LeadsChauds: React.FC = () => (
  <BlockShell
    title="Leads chauds"
    showMenu
    footer={
      <button type="button" className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium">
        Voir tous les leads chauds →
      </button>
    }
  >
    <ul>
      {MOCK_LEADS_CHAUDS.map(lead => {
        const dot = PRIORITY_DOTS[lead.priority];
        return (
          <li
            key={lead.lead_id}
            onClick={() => handleClick(lead)}
            className="grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-b-0"
          >
            <div className="w-6 h-6 rounded-full bg-propsight-100 text-propsight-700 flex items-center justify-center text-[10px] font-semibold">
              {lead.initiales}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-slate-900 truncate leading-tight">{lead.nom}</p>
              <p className="text-[11px] text-slate-500 truncate">{lead.sousInfo}</p>
            </div>
            <div className="text-right min-w-0">
              <p className="text-[12px] font-medium text-slate-900 tabular-nums leading-tight">{lead.estimation}</p>
              <p className="text-[11px] text-slate-500 truncate">{lead.nextAction}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className={`text-[10px] font-medium ${lead.retard ? 'text-red-600' : 'text-slate-500'}`}>
                {lead.nextDate}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${dot.color}`} title={dot.label} />
            </div>
          </li>
        );
      })}
    </ul>
  </BlockShell>
);

export default LeadsChauds;
