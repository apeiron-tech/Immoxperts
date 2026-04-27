import React, { useMemo, useState } from 'react';
import { MoreHorizontal, Settings2, ArrowUpDown, Mail } from 'lucide-react';
import {
  Avatar,
  Chip,
  IconButton,
  Sparkline,
  WorkloadBadge,
  formatEuro,
} from './primitives';
import type { Collaborateur } from '../types';

export type CollabColumnKey =
  | 'collaborateur'
  | 'role'
  | 'zone'
  | 'leads_actifs'
  | 'actions_retard'
  | 'rdv_semaine'
  | 'mandats'
  | 'ca_pipe'
  | 'charge'
  | 'estimations'
  | 'rapports_envoyes'
  | 'rapports_ouverts'
  | 'tendance';

export const DEFAULT_COLS: CollabColumnKey[] = [
  'collaborateur',
  'zone',
  'leads_actifs',
  'actions_retard',
  'rdv_semaine',
  'mandats',
  'ca_pipe',
  'charge',
];

const ALL_COLS: { key: CollabColumnKey; label: string; width: string; numeric?: boolean }[] = [
  { key: 'collaborateur', label: 'Collaborateur', width: 'minmax(170px, 1.4fr)' },
  { key: 'role', label: 'Rôle', width: '80px' },
  { key: 'zone', label: 'Zone', width: '110px' },
  { key: 'leads_actifs', label: 'Leads actifs', width: '80px', numeric: true },
  { key: 'actions_retard', label: 'Actions retard', width: '100px', numeric: true },
  { key: 'rdv_semaine', label: 'RDV semaine', width: '90px', numeric: true },
  { key: 'mandats', label: 'Mandats', width: '90px', numeric: true },
  { key: 'ca_pipe', label: 'CA pipe', width: '100px', numeric: true },
  { key: 'charge', label: 'Charge', width: '140px' },
  { key: 'estimations', label: 'Estimations', width: '90px', numeric: true },
  { key: 'rapports_envoyes', label: 'Rapports envoyés', width: '120px', numeric: true },
  { key: 'rapports_ouverts', label: 'Rapports ouverts', width: '120px', numeric: true },
  { key: 'tendance', label: 'Tendance', width: '90px' },
];

const ROLE_LABEL: Record<string, string> = {
  OWNER: 'Responsable',
  ADMIN: 'Manager',
  AGENT: 'Consultant',
  VIEWER: 'Lecteur',
};

interface Props {
  collaborateurs: Collaborateur[];
  visibleCols?: CollabColumnKey[];
  onToggleCol?: (cols: CollabColumnKey[]) => void;
  onOpenCollaborateur?: (id: string) => void;
  selectedId?: string;
}

const CollaborateurTable: React.FC<Props> = ({
  collaborateurs,
  visibleCols = DEFAULT_COLS,
  onToggleCol,
  onOpenCollaborateur,
  selectedId,
}) => {
  const [sortBy, setSortBy] = useState<CollabColumnKey>('collaborateur');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [configOpen, setConfigOpen] = useState(false);
  const [internalCols, setInternalCols] = useState<CollabColumnKey[]>(visibleCols);

  const effectiveCols = onToggleCol ? visibleCols : internalCols;

  const sorted = useMemo(() => {
    const arr = [...collaborateurs];
    const dir = sortDir === 'asc' ? 1 : -1;
    arr.sort((a, b) => {
      switch (sortBy) {
        case 'collaborateur':
          return a.display_name.localeCompare(b.display_name) * dir;
        case 'leads_actifs':
          return (a.leads_actifs - b.leads_actifs) * dir;
        case 'actions_retard':
          return (a.actions_retard - b.actions_retard) * dir;
        case 'rdv_semaine':
          return (a.rdv_semaine - b.rdv_semaine) * dir;
        case 'mandats':
          return (a.mandats - b.mandats) * dir;
        case 'ca_pipe':
          return (a.ca_pipe - b.ca_pipe) * dir;
        case 'charge':
          return (a.workload_score - b.workload_score) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [collaborateurs, sortBy, sortDir]);

  const gridCols = effectiveCols
    .map(k => ALL_COLS.find(c => c.key === k)?.width ?? 'auto')
    .concat(['40px'])
    .join(' ');

  const handleSort = (key: CollabColumnKey) => {
    if (sortBy === key) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortBy(key);
      setSortDir('asc');
    }
  };

  const toggleColumn = (key: CollabColumnKey) => {
    const next = effectiveCols.includes(key)
      ? effectiveCols.filter(c => c !== key)
      : [...effectiveCols, key];
    if (onToggleCol) onToggleCol(next);
    else setInternalCols(next);
  };

  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[12.5px] font-semibold text-slate-800">
            Collaborateurs · {collaborateurs.length}
          </h3>
        </div>
        <div className="relative">
          <button
            onClick={() => setConfigOpen(v => !v)}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-[11px] text-slate-600 transition-colors"
          >
            <Settings2 size={11} />
            Configurer colonnes
          </button>
          {configOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-slate-200 rounded-md shadow-lg p-2 w-60">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-1 px-1">
                Afficher
              </div>
              {ALL_COLS.map(c => (
                <label
                  key={c.key}
                  className="flex items-center gap-2 px-1 py-1 rounded hover:bg-slate-50 cursor-pointer text-[11.5px] text-slate-700"
                >
                  <input
                    type="checkbox"
                    className="accent-propsight-600"
                    checked={effectiveCols.includes(c.key)}
                    onChange={() => toggleColumn(c.key)}
                    disabled={c.key === 'collaborateur'}
                  />
                  {c.label}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      <div
        className="grid items-center px-3 py-1.5 border-b border-slate-200 bg-slate-50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0"
        style={{ gridTemplateColumns: gridCols }}
      >
        {effectiveCols.map(key => {
          const col = ALL_COLS.find(c => c.key === key);
          if (!col) return <span key={key} />;
          return (
            <button
              key={key}
              onClick={() => handleSort(key)}
              className={`flex items-center gap-1 ${col.numeric ? 'justify-end' : 'justify-start'} hover:text-slate-700`}
            >
              {col.label}
              {(['collaborateur', 'leads_actifs', 'actions_retard', 'rdv_semaine', 'mandats', 'ca_pipe', 'charge'] as CollabColumnKey[]).includes(key) && (
                <ArrowUpDown size={9} />
              )}
            </button>
          );
        })}
        <span />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {sorted.map(c => (
          <div
            key={c.user_id}
            className={`grid items-center px-3 py-1.5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
              selectedId === c.user_id ? 'bg-propsight-50 border-l-2 border-l-violet-500' : ''
            }`}
            style={{ gridTemplateColumns: gridCols }}
            onClick={() => onOpenCollaborateur?.(c.user_id)}
          >
            {effectiveCols.map(key => {
              switch (key) {
                case 'collaborateur':
                  return (
                    <div key={key} className="flex items-center gap-2 min-w-0">
                      <Avatar initials={c.initials} color={c.avatar_color} size={24} />
                      <div className="min-w-0">
                        <div className="text-[12px] font-semibold text-slate-800 truncate leading-tight">
                          {c.display_name}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">{ROLE_LABEL[c.role]}</div>
                      </div>
                    </div>
                  );
                case 'role':
                  return (
                    <div key={key}>
                      <Chip tone="violet">{c.role}</Chip>
                    </div>
                  );
                case 'zone':
                  return (
                    <div key={key} className="min-w-0">
                      {c.zones[0] && (
                        <span className="text-[11px] text-slate-700 truncate">{c.zones[0].label}</span>
                      )}
                      {c.zones.length > 1 && (
                        <span className="ml-1 text-[10px] text-slate-400">+{c.zones.length - 1}</span>
                      )}
                    </div>
                  );
                case 'leads_actifs':
                  return (
                    <div key={key} className="text-right text-[12px] font-semibold text-slate-700 tabular-nums">
                      {c.leads_actifs}
                    </div>
                  );
                case 'actions_retard':
                  return (
                    <div
                      key={key}
                      className={`text-right text-[12px] font-semibold tabular-nums ${
                        c.actions_retard === 0
                          ? 'text-slate-400'
                          : c.actions_retard_haute > 0
                            ? 'text-rose-600'
                            : 'text-amber-600'
                      }`}
                    >
                      {c.actions_retard}
                    </div>
                  );
                case 'rdv_semaine':
                  return (
                    <div key={key} className="text-right text-[12px] font-semibold text-slate-700 tabular-nums">
                      {c.rdv_semaine}
                    </div>
                  );
                case 'mandats':
                  return (
                    <div key={key} className="text-right text-[12px] tabular-nums">
                      <span className="font-semibold text-slate-800">{c.mandats}</span>
                      {c.mandats_exclusifs > 0 && (
                        <span className="ml-1 text-[9.5px] text-propsight-600">
                          · {c.mandats_exclusifs} excl.
                        </span>
                      )}
                    </div>
                  );
                case 'ca_pipe':
                  return (
                    <div key={key} className="text-right text-[11.5px] font-semibold text-slate-800 tabular-nums">
                      {formatEuro(c.ca_pipe)}
                    </div>
                  );
                case 'charge':
                  return (
                    <div key={key}>
                      <WorkloadBadge score={c.workload_score} status={c.workload_status} />
                    </div>
                  );
                case 'estimations':
                  return (
                    <div key={key} className="text-right text-[11.5px] text-slate-700 tabular-nums">
                      {c.estimations_30j}
                    </div>
                  );
                case 'rapports_envoyes':
                  return (
                    <div key={key} className="text-right text-[11.5px] text-slate-700 tabular-nums">
                      {c.avis_envoyes_30j}
                    </div>
                  );
                case 'rapports_ouverts':
                  return (
                    <div key={key} className="text-right text-[11.5px] text-slate-700 tabular-nums">
                      {c.rapports_ouverts}
                    </div>
                  );
                case 'tendance':
                  return (
                    <div key={key}>
                      <Sparkline values={c.trend_30j} color={c.avatar_color} />
                    </div>
                  );
                default:
                  return <div key={key} />;
              }
            })}
            <div className="flex justify-end">
              <IconButton
                title="Actions"
                onClick={e => e.stopPropagation()}
              >
                <MoreHorizontal size={13} />
              </IconButton>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between px-3 py-1.5 border-t border-slate-200 bg-slate-50 text-[10.5px] text-slate-500 flex-shrink-0">
        <div className="flex items-center gap-1">
          <Mail size={10} />
          <span>
            Gestion des membres dans{' '}
            <a href="/app/parametres/membres" className="text-propsight-600 hover:underline">
              Paramètres › Membres
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollaborateurTable;
