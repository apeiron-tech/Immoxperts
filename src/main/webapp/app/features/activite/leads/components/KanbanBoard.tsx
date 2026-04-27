import React from 'react';
import KanbanColumn from './KanbanColumn';
import { Lead, StageMeta } from '../types';
import { STAGE_TOTALS } from '../_mocks/leads';

interface Props {
  stages: StageMeta[];
  leads: Lead[];
  onLeadClick: (l: Lead) => void;
}

const KanbanBoard: React.FC<Props> = ({ stages, leads, onLeadClick }) => {
  const visibleStages = stages.filter(s => s.id !== 'perdu');
  const perdu = stages.find(s => s.id === 'perdu');

  return (
    <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden">
      <div className="flex gap-2 h-full min-h-0 p-3 pr-2">
        {visibleStages.map(stage => {
          const stageLeads = leads.filter(l => l.stage === stage.id);
          const total = STAGE_TOTALS[stage.id] || { count: stageLeads.length, valeur: 0 };
          return (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              leads={stageLeads}
              totalCount={total.count}
              totalValeur={total.valeur}
              onLeadClick={onLeadClick}
            />
          );
        })}
        {perdu && <CollapsedPerdu stage={perdu} count={STAGE_TOTALS.perdu.count} />}
      </div>
    </div>
  );
};

interface CollapsedProps {
  stage: StageMeta;
  count: number;
}

const CollapsedPerdu: React.FC<CollapsedProps> = ({ stage, count }) => (
  <button
    type="button"
    onClick={() => console.warn('[Leads] Étendre Perdu')}
    title={`${stage.label} (${count})`}
    className={`w-8 flex flex-col items-center justify-start pt-2 rounded-md border ${stage.headerBorder} ${stage.headerBg} hover:bg-red-100 transition-colors flex-shrink-0`}
  >
    <span className={`text-[11px] font-semibold ${stage.textColor}`} style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
      {stage.label} · {count}
    </span>
  </button>
);

export default KanbanBoard;
