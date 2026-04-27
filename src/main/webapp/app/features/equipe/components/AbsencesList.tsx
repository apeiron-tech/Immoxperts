import React from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { Chip, SecondaryButton, IconButton } from './primitives';
import type { Absence } from '../types';

const TYPE_LABEL: Record<Absence['type'], string> = {
  conges: 'Congés',
  maladie: 'Maladie',
  formation: 'Formation',
  autre: 'Autre',
};
const TYPE_TONE: Record<Absence['type'], 'violet' | 'blue' | 'orange' | 'slate'> = {
  conges: 'violet',
  maladie: 'orange',
  formation: 'blue',
  autre: 'slate',
};

function formatPeriod(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  if (s.toDateString() === e.toDateString()) return s.toLocaleDateString('fr-FR', opts);
  return `${s.toLocaleDateString('fr-FR', opts)} → ${e.toLocaleDateString('fr-FR', opts)}`;
}

interface Props {
  absences: Absence[];
  onDeclare?: () => void;
  onEdit?: (a: Absence) => void;
  onDelete?: (a: Absence) => void;
}

const AbsencesList: React.FC<Props> = ({ absences, onDeclare, onEdit, onDelete }) => (
  <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
    <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
      <h3 className="text-[12.5px] font-semibold text-slate-800">Absences déclarées</h3>
      <SecondaryButton size="sm" icon={<Plus size={10} />} onClick={onDeclare}>
        Déclarer
      </SecondaryButton>
    </div>
    <div className="flex-1 min-h-0 overflow-y-auto">
      {absences.length === 0 ? (
        <div className="p-4 text-center text-[11.5px] text-slate-500">
          Aucune absence déclarée.
        </div>
      ) : (
        absences.map(a => (
          <div
            key={a.absence_id}
            className="flex items-center gap-2 px-3 py-1.5 border-b border-slate-100 text-[11px]"
          >
            <span className="font-semibold text-slate-800 flex-1 min-w-0 truncate">
              {a.collaborator_label}
            </span>
            <Chip tone={TYPE_TONE[a.type]}>{TYPE_LABEL[a.type]}</Chip>
            <span className="text-slate-600 whitespace-nowrap">
              {formatPeriod(a.period_start, a.period_end)}
            </span>
            <IconButton onClick={() => onEdit?.(a)} title="Éditer">
              <Edit2 size={11} />
            </IconButton>
            <IconButton onClick={() => onDelete?.(a)} title="Supprimer">
              <Trash2 size={11} />
            </IconButton>
          </div>
        ))
      )}
    </div>
  </div>
);

export default AbsencesList;
