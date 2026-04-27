import React from 'react';
import { AlertTriangle, ArrowUpRight, Inbox } from 'lucide-react';
import { PrimaryButton, SecondaryButton } from './primitives';

interface Props {
  count: number;
  olderThan48h: number;
  onAssign?: () => void;
}

const LeadsUnassignedBanner: React.FC<Props> = ({ count, olderThan48h, onAssign }) => {
  if (count === 0) return null;
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-md flex-shrink-0">
      <div className="flex items-center gap-2 min-w-0">
        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-amber-100 flex items-center justify-center">
          <AlertTriangle size={14} className="text-amber-600" />
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-semibold text-amber-900">
            {count} leads non assignés
            {olderThan48h > 0 && (
              <span className="font-normal text-amber-700"> · {olderThan48h} depuis + 48 h</span>
            )}
          </div>
          <div className="text-[10.5px] text-amber-700">
            L’inbox des leads vit dans le Kanban Leads. Équipe affiche un compteur + assignation rapide.
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <SecondaryButton
          size="sm"
          icon={<Inbox size={11} />}
          onClick={() => (window.location.href = '/app/activite/leads?assigne=null')}
        >
          Voir dans Kanban
          <ArrowUpRight size={10} />
        </SecondaryButton>
        <PrimaryButton size="sm" onClick={onAssign}>
          Assigner
        </PrimaryButton>
      </div>
    </div>
  );
};

export default LeadsUnassignedBanner;
