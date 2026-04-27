import React from 'react';
import { Avatar, WorkloadBadge } from './primitives';
import type { AgendaEvent, Collaborateur, Absence } from '../types';

interface Props {
  collaborateurs: Collaborateur[];
  days: string[];
  events: AgendaEvent[];
  absences: Absence[];
}

const DAYS_LABELS = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'];

const TONE_BG: Record<string, string> = {
  violet: 'bg-propsight-100 text-propsight-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-amber-100 text-amber-700',
  red: 'bg-rose-100 text-rose-700',
  green: 'bg-emerald-100 text-emerald-700',
  slate: 'bg-slate-100 text-slate-600',
};

function formatDayHeader(iso: string, idx: number): string {
  const d = new Date(iso);
  return `${DAYS_LABELS[idx]} ${d.getDate()}`;
}

const AgendaHeatmap: React.FC<Props> = ({ collaborateurs, days, events, absences }) => {
  const gridCols = `170px repeat(${days.length}, minmax(96px, 1fr))`;
  const rows = collaborateurs.slice(0, 5);

  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <h3 className="text-[12.5px] font-semibold text-slate-800">Planning équipe</h3>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          {[
            { tone: 'violet', label: 'RDV vendeur' },
            { tone: 'blue', label: 'Visite' },
            { tone: 'orange', label: 'Estimation' },
            { tone: 'green', label: 'Dossier' },
            { tone: 'slate', label: 'Relance/Appel' },
          ].map(l => (
            <span key={l.label} className="inline-flex items-center gap-1">
              <span className={`inline-block w-2 h-2 rounded-sm ${TONE_BG[l.tone]}`} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      <div
        className="grid items-center px-2 py-1.5 bg-slate-50 border-b border-slate-200 text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0"
        style={{ gridTemplateColumns: gridCols }}
      >
        <span>Collaborateur</span>
        {days.map((d, i) => (
          <span key={d} className="text-center">
            {formatDayHeader(d, i)}
          </span>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {rows.map(collab => {
          const rowEvents = events.filter(e => e.collaborator_id === collab.user_id);
          const rowAbs = absences.filter(a => a.collaborator_id === collab.user_id);
          return (
            <div
              key={collab.user_id}
              className="grid items-stretch border-b border-slate-100"
              style={{ gridTemplateColumns: gridCols }}
            >
              <div className="px-2 py-1.5 flex items-start gap-2 bg-slate-50/40 border-r border-slate-100">
                <Avatar initials={collab.initials} color={collab.avatar_color} size={24} />
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold text-slate-800 truncate leading-tight">
                    {collab.display_name}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    {collab.role === 'OWNER' ? 'Responsable' : collab.role === 'ADMIN' ? 'Manager' : 'Consultant'}
                  </div>
                  <div className="mt-1 w-[130px]">
                    <WorkloadBadge
                      score={collab.workload_score}
                      status={collab.workload_status}
                      compact
                    />
                  </div>
                </div>
              </div>
              {days.map(day => {
                const cellEvents = rowEvents.filter(e => e.day === day);
                const absence = rowAbs.find(a => day >= a.period_start && day <= a.period_end);
                if (absence) {
                  return (
                    <div
                      key={day}
                      className="p-1.5 border-r border-slate-100 bg-slate-50/60 flex items-center justify-center"
                    >
                      <div className="text-[10px] text-slate-400 italic text-center">
                        {absence.type === 'conges'
                          ? 'Congé'
                          : absence.type === 'maladie'
                            ? 'Maladie'
                            : absence.type === 'formation'
                              ? 'Formation'
                              : 'Absence'}
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={day} className="p-1.5 border-r border-slate-100 space-y-1 min-w-0">
                    {cellEvents.slice(0, 3).map(e => (
                      <div
                        key={e.id}
                        className={`px-1 py-0.5 rounded text-[9.5px] leading-tight ${TONE_BG[e.tone]}`}
                      >
                        <div className="font-semibold tabular-nums">{e.hour}</div>
                        <div className="truncate">{e.label}</div>
                        {e.zone_label && <div className="truncate text-[9px] opacity-80">{e.zone_label}</div>}
                      </div>
                    ))}
                    {cellEvents.length === 0 && (
                      <div className="text-[9.5px] text-slate-300">—</div>
                    )}
                    {cellEvents.length > 3 && (
                      <div className="text-[9px] text-slate-500">+ {cellEvents.length - 3}</div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgendaHeatmap;
