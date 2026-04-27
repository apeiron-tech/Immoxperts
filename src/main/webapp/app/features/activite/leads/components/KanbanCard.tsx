import React from 'react';
import { Globe, Radar, User, Upload, Calculator, ThumbsUp, LucideIcon } from 'lucide-react';
import { Intention, Lead, LeadBadge, LeadSource } from '../types';

const INTENTION_BAR: Record<Intention, string> = {
  vente:   '#a78bfa',
  achat:   '#2dd4bf',
  locatif: '#fbbf24',
  estim:   '#94a3b8',
};

const INTENTION_CHIP: Record<Intention, { bg: string; fg: string; label: string }> = {
  vente:   { bg: 'bg-propsight-50', fg: 'text-propsight-700', label: 'Vente' },
  achat:   { bg: 'bg-teal-50',   fg: 'text-teal-700',   label: 'Achat' },
  locatif: { bg: 'bg-amber-50',  fg: 'text-amber-700',  label: 'Locatif' },
  estim:   { bg: 'bg-slate-100', fg: 'text-slate-700',  label: 'Estim' },
};

const SOURCE_META: Record<LeadSource, { Icon: LucideIcon; color: string; label: string }> = {
  widget:        { Icon: Globe,      color: 'text-propsight-500', label: 'Widget' },
  pige:          { Icon: Radar,      color: 'text-orange-500', label: 'Pige' },
  manuel:        { Icon: User,       color: 'text-slate-400',  label: 'Manuel' },
  import:        { Icon: Upload,     color: 'text-blue-500',   label: 'Import' },
  estimation:    { Icon: Calculator, color: 'text-teal-500',   label: 'Estimation' },
  recommandation:{ Icon: ThumbsUp,   color: 'text-pink-500',   label: 'Recommandation' },
};

const BADGE_STYLES: Record<LeadBadge, string> = {
  'Exclusif':    'bg-propsight-600 text-white',
  'Urgent':      'bg-red-600 text-white',
  'À relancer':  'bg-amber-100 text-amber-800',
};

interface Props {
  lead: Lead;
  onClick: (l: Lead) => void;
}

const formatPrix = (lead: Lead): string => {
  if (lead.prix === null) return '—';
  if (lead.intention === 'locatif') return `${lead.prix.toLocaleString('fr-FR')} € / mois`;
  return `${lead.prix.toLocaleString('fr-FR')} €`;
};

const KanbanCard: React.FC<Props> = ({ lead, onClick }) => {
  const intentionChip = INTENTION_CHIP[lead.intention];
  const source = SOURCE_META[lead.source];
  const SourceIcon = source.Icon;

  return (
    <div
      onClick={() => onClick(lead)}
      className="relative bg-white border border-slate-200 rounded-md pl-3 pr-2.5 py-2 cursor-pointer hover:border-slate-300 hover:shadow-sm transition-all group"
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-md"
        style={{ backgroundColor: INTENTION_BAR[lead.intention] }}
      />

      {lead.badge && (
        <span className={`absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-sm ${BADGE_STYLES[lead.badge]}`}>
          {lead.badge}
        </span>
      )}

      <div className="flex items-center gap-1.5 mb-1">
        <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[9px] font-semibold flex-shrink-0">
          {lead.initiales}
        </div>
        <p className="text-[12px] font-semibold text-slate-900 truncate flex-1">{lead.nom}</p>
        {!lead.badge && <SourceIcon size={11} className={source.color} aria-label={source.label} />}
      </div>

      <p className="text-[10px] text-slate-500 flex items-center gap-1 mb-1">
        <SourceIcon size={9} className={source.color} />
        <span className="truncate">{lead.sousStatut || source.label}</span>
      </p>

      <p className="text-[11px] text-slate-600 truncate mb-0.5">{lead.adresse}</p>
      <p className="text-[12px] font-semibold text-slate-900 tabular-nums mb-1.5">{formatPrix(lead)}</p>

      <div className="flex items-center justify-between gap-1.5">
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${intentionChip.bg} ${intentionChip.fg}`}>
          {intentionChip.label}
        </span>
        <div className="flex items-center gap-1.5 min-w-0">
          {lead.commission !== null && (
            <span className="text-[11px] font-semibold text-slate-900 tabular-nums">
              {lead.commission.toLocaleString('fr-FR')} €
            </span>
          )}
          {lead.prochaineAction?.retard && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
          <span className="text-[10px] text-slate-400 truncate">{lead.age}</span>
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
