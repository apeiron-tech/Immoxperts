import React from 'react';
import {
  Building2,
  FileText,
  Briefcase,
  TrendingUp,
  Target,
  Home,
  Key,
  LucideIcon,
} from 'lucide-react';
import { Avatar, Chip, IconButton, StatusDot, formatRelativeDate } from './primitives';
import type { PortfolioItem, PortfolioObjectType } from '../types';

const TYPE_ICON: Record<PortfolioObjectType, LucideIcon> = {
  bien: Home,
  estimation_rapide: TrendingUp,
  avis_valeur: FileText,
  etude_locative: FileText,
  opportunite: Target,
  dossier_invest: Briefcase,
  mandat: Key,
};

const RISK_TONE = {
  bloque: 'red' as const,
  a_relancer: 'orange' as const,
  ok: 'green' as const,
};

interface Props {
  items: PortfolioItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const TeamPortfolioTable: React.FC<Props> = ({ items, selectedId, onSelect }) => {
  const gridCols =
    'minmax(160px,1.4fr) 80px minmax(160px,1.2fr) minmax(120px,1fr) minmax(110px,0.9fr) 80px 100px minmax(130px,1fr) minmax(130px,1fr) 90px 38px';
  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div
        className="grid items-center px-2.5 py-1.5 border-b border-slate-200 bg-slate-50 text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0"
        style={{ gridTemplateColumns: gridCols }}
      >
        <span>Objet</span>
        <span>Type</span>
        <span>Adresse / zone</span>
        <span>Responsable</span>
        <span>Client / lead</span>
        <span>Statut</span>
        <span className="text-right">Valeur</span>
        <span>Dernière activité</span>
        <span>Prochaine action</span>
        <span>Qualité / risque</span>
        <span />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.map(item => {
          const Icon = TYPE_ICON[item.type] ?? Building2;
          return (
            <div
              key={item.id}
              className={`grid items-center px-2.5 py-2 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedId === item.id ? 'bg-propsight-50 border-l-2 border-l-violet-500' : ''
              }`}
              style={{ gridTemplateColumns: gridCols }}
              onClick={() => onSelect?.(item.id)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="flex-shrink-0 w-6 h-6 rounded-md bg-propsight-50 text-propsight-600 flex items-center justify-center">
                  <Icon size={12} />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-semibold text-slate-800 truncate leading-tight">{item.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{item.type_label}</div>
                </div>
              </div>
              <span className="text-[10.5px] text-slate-600 truncate">{item.type_label}</span>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-700 truncate">{item.adresse}</div>
                {item.zone_label && <div className="text-[10px] text-slate-500">{item.zone_label}</div>}
              </div>
              <div className="flex items-center gap-1.5 min-w-0">
                <Avatar
                  initials={item.collaborator_label.split(' ').map(s => s[0]).join('').slice(0, 2)}
                  color="#8B5CF6"
                  size={18}
                />
                <span className="text-[11px] text-slate-700 truncate">{item.collaborator_label}</span>
              </div>
              <span className="text-[11px] text-slate-700 truncate">{item.client_label ?? '—'}</span>
              <div>
                <Chip tone={item.statut_tone === 'neutral' ? 'slate' : item.statut_tone}>{item.statut}</Chip>
              </div>
              <div className="text-right">
                <div className="text-[11.5px] font-semibold text-slate-800 tabular-nums">
                  {item.valeur_label}
                </div>
                {item.valeur_unit && <div className="text-[9.5px] text-slate-400">{item.valeur_unit}</div>}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-700 truncate">{item.last_activity_label}</div>
                <div className="text-[10px] text-slate-400">{formatRelativeDate(item.last_activity_at)}</div>
              </div>
              <div className="min-w-0 text-[11px] text-propsight-700 truncate">{item.next_action_label ?? '—'}</div>
              <div className="flex items-center gap-1.5">
                <StatusDot tone={RISK_TONE[item.risk]} />
                <span className="text-[11px] tabular-nums text-slate-700">
                  {item.quality_score ?? '—'}{' '}
                  <span className="text-[9.5px] text-slate-400">/ {item.risk_label}</span>
                </span>
              </div>
              <div className="flex justify-end">
                <IconButton title="Actions" onClick={e => e.stopPropagation()}>
                  <span className="text-slate-400 text-[13px] leading-none">⋯</span>
                </IconButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamPortfolioTable;
