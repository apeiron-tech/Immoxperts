import React from 'react';
import {
  User,
  Phone,
  Mail,
  FileText,
  Zap,
  Briefcase,
  Calendar,
  Home,
  Eye,
} from 'lucide-react';
import { Avatar, Chip, IconButton, formatRelativeDate } from './primitives';
import type { TeamActivityItem, TeamActivityPriority, TeamActivityStatus } from '../types';

const TYPE_ICON = {
  lead: User,
  action: Phone,
  relance: Mail,
  rdv: Calendar,
  visite: Home,
  signal: Zap,
  notification: Eye,
  rapport: FileText,
  estimation: FileText,
  avis_valeur: FileText,
  etude_locative: FileText,
  opportunite: Briefcase,
  dossier: Briefcase,
};

const TYPE_LABEL: Record<TeamActivityItem['type'], string> = {
  lead: 'Lead',
  action: 'Action',
  relance: 'Relance',
  rdv: 'RDV',
  visite: 'Visite',
  signal: 'Signal',
  notification: 'Notif.',
  rapport: 'Rapport',
  estimation: 'Estim.',
  avis_valeur: 'Avis',
  etude_locative: 'Étude',
  opportunite: 'Opport.',
  dossier: 'Dossier',
};

const TYPE_TONE: Record<TeamActivityItem['type'], 'violet' | 'blue' | 'orange' | 'green' | 'red' | 'slate'> = {
  lead: 'violet',
  action: 'blue',
  relance: 'orange',
  rdv: 'blue',
  visite: 'green',
  signal: 'violet',
  notification: 'slate',
  rapport: 'slate',
  estimation: 'slate',
  avis_valeur: 'orange',
  etude_locative: 'orange',
  opportunite: 'green',
  dossier: 'green',
};

const PRIO_TONE: Record<TeamActivityPriority, 'red' | 'orange' | 'slate'> = {
  haute: 'red',
  moyenne: 'orange',
  basse: 'slate',
};

const STATUS_TONE: Record<TeamActivityStatus, 'violet' | 'blue' | 'orange' | 'green' | 'red' | 'slate'> = {
  nouveau: 'green',
  en_cours: 'blue',
  en_retard: 'red',
  non_assigne: 'orange',
  a_relancer: 'orange',
  ouvert_sans_relance: 'red',
  non_traite: 'red',
  qualifie: 'violet',
};

const STATUS_LABEL: Record<TeamActivityStatus, string> = {
  nouveau: 'Nouveau',
  en_cours: 'En cours',
  en_retard: 'En retard',
  non_assigne: 'Non assigné',
  a_relancer: 'À relancer',
  ouvert_sans_relance: 'Sans relance',
  non_traite: 'Non traité',
  qualifie: 'Qualifié',
};

interface Props {
  items: TeamActivityItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  compact?: boolean;
}

const TeamActivityTable: React.FC<Props> = ({ items, selectedId, onSelect }) => {
  return (
    <div className="flex flex-col min-h-0 h-full bg-white border border-slate-200 rounded-md overflow-hidden">
      <div
        className="grid items-center px-2.5 py-1.5 border-b border-slate-200 bg-slate-50 text-[9.5px] font-semibold text-slate-500 uppercase tracking-wider flex-shrink-0"
        style={{
          gridTemplateColumns:
            'minmax(160px,1.4fr) 70px 70px minmax(120px,1fr) minmax(120px,1fr) minmax(180px,1.4fr) 110px minmax(130px,1fr) minmax(130px,1fr) 68px 82px 80px 36px',
        }}
      >
        <span>Objet</span>
        <span>Type</span>
        <span>Source</span>
        <span>Collab.</span>
        <span>Lead / client</span>
        <span>Bien / adresse</span>
        <span>Zone</span>
        <span>Dernière action</span>
        <span>Prochaine action</span>
        <span className="text-right">Âge</span>
        <span>Priorité</span>
        <span>Statut</span>
        <span />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {items.map(item => {
          const Icon = TYPE_ICON[item.type];
          return (
            <div
              key={item.activity_id}
              className={`grid items-center px-2.5 py-1.5 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors ${
                selectedId === item.activity_id ? 'bg-propsight-50 border-l-2 border-l-violet-500' : ''
              }`}
              style={{
                gridTemplateColumns:
                  'minmax(160px,1.4fr) 70px 70px minmax(120px,1fr) minmax(120px,1fr) minmax(180px,1.4fr) 110px minmax(130px,1fr) minmax(130px,1fr) 68px 82px 80px 36px',
              }}
              onClick={() => onSelect?.(item.activity_id)}
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div
                  className={`flex-shrink-0 w-5 h-5 rounded-md flex items-center justify-center bg-${TYPE_TONE[item.type]}-50 text-${TYPE_TONE[item.type]}-600`}
                  style={{
                    backgroundColor: `var(--${TYPE_TONE[item.type]}-bg)`,
                  }}
                >
                  <Icon size={11} className="text-slate-500" />
                </div>
                <span className="text-[11.5px] font-semibold text-slate-800 truncate">{item.title}</span>
              </div>
              <Chip tone={TYPE_TONE[item.type]}>{TYPE_LABEL[item.type]}</Chip>
              <span className="text-[11px] text-slate-600 truncate">{item.source_label}</span>
              <div className="flex items-center gap-1.5 min-w-0">
                {item.collaborator_label && item.collaborator_label !== 'Non assigné' ? (
                  <>
                    <Avatar
                      initials={item.collaborator_label.split(' ').map(s => s[0]).join('').slice(0, 2)}
                      color="#6366F1"
                      size={18}
                    />
                    <span className="text-[11px] text-slate-700 truncate">
                      {item.collaborator_label}
                    </span>
                  </>
                ) : (
                  <Chip tone="orange">Non assigné</Chip>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-700 truncate">{item.client_label ?? '—'}</div>
                {item.client_contact && (
                  <div className="text-[10px] text-slate-400 truncate">{item.client_contact}</div>
                )}
              </div>
              <div className="min-w-0 text-[11px] text-slate-700 truncate">{item.adresse ?? '—'}</div>
              <div className="min-w-0">
                {item.zone_label && <Chip tone="slate">{item.zone_label}</Chip>}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-700 truncate">
                  {item.derniere_action_label ?? '—'}
                </div>
                {item.derniere_action_at && (
                  <div className="text-[10px] text-slate-400">{formatRelativeDate(item.derniere_action_at)}</div>
                )}
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-slate-700 truncate">
                  {item.prochaine_action_label ?? '—'}
                </div>
                {item.prochaine_action_at && (
                  <div className="text-[10px] text-slate-400">
                    {new Date(item.prochaine_action_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                )}
              </div>
              <div className="text-right text-[11px] text-slate-600 tabular-nums">
                {item.retard_days
                  ? <span className="text-rose-600 font-semibold">+{item.retard_days} j</span>
                  : item.age_days
                    ? `${item.age_days} j`
                    : '—'}
              </div>
              <div>
                <Chip tone={PRIO_TONE[item.priority]}>
                  {item.priority === 'haute' ? 'Haute' : item.priority === 'moyenne' ? 'Moyenne' : 'Basse'}
                </Chip>
              </div>
              <div>
                <Chip tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Chip>
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

export default TeamActivityTable;
