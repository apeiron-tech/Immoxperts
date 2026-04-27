import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { Lead, StageMeta } from '../types';

interface Props {
  stage: StageMeta;
  leads: Lead[];
  totalCount: number;
  totalValeur: number;
  onLeadClick: (l: Lead) => void;
}

const formatEur = (n: number) => `${n.toLocaleString('fr-FR')} €`;

const KanbanColumn: React.FC<Props> = ({ stage, leads, totalCount, totalValeur, onLeadClick }) => {
  const remaining = totalCount - leads.length;
  return (
    <div className="flex flex-col bg-slate-50/40 rounded-md border border-slate-200 min-w-[210px] max-w-[260px] flex-1 h-full min-h-0">
      <header className={`flex items-center justify-between px-2.5 py-2 border-b ${stage.headerBorder} ${stage.headerBg} rounded-t-md flex-shrink-0`}>
        <div className="min-w-0">
          <p className={`text-[12px] font-semibold leading-tight ${stage.textColor}`}>{stage.label}</p>
          <p className="text-[10px] text-slate-600 leading-tight truncate tabular-nums">
            {totalCount} leads · {formatEur(totalValeur)}
          </p>
        </div>
        <button
          type="button"
          className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-white/60 transition-colors flex-shrink-0"
          title="Options colonne"
          onClick={() => console.warn('[Leads] Menu colonne', stage.id)}
        >
          <MoreHorizontal size={13} />
        </button>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
        {leads.length === 0 ? (
          <p className="text-[11px] text-slate-400 text-center py-6">Aucun lead à ce stade</p>
        ) : (
          leads.map(lead => <KanbanCard key={lead.lead_id} lead={lead} onClick={onLeadClick} />)
        )}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => console.warn('[Leads] Charger plus', stage.id)}
            className="w-full text-center text-[11px] text-blue-600 hover:text-blue-700 font-medium py-1.5 hover:bg-white/60 rounded transition-colors"
          >
            + {remaining} leads
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
