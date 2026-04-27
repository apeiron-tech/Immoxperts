import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, User, Calendar, FileText, Eye, LucideIcon } from 'lucide-react';
import type { DashboardPriorityItem, UrgencyLevel, PriorityItemType } from '../types';
import PanelCard from './PanelCard';
import SourceBadge from './SourceBadge';

const URGENCY_DOT: Record<UrgencyLevel, string> = {
  en_retard: 'bg-rose-500',
  aujourdhui: 'bg-amber-500',
  cette_semaine: 'bg-amber-300',
  a_surveiller: 'bg-slate-300',
};

const TYPE_ICON: Partial<Record<PriorityItemType, LucideIcon>> = {
  action_en_retard: User,
  rdv_du_jour: Calendar,
  rdv_a_preparer: Eye,
  signature_imminente: FileText,
  signal_prospection_chaud: User,
};

const SOURCE_TONE: Record<string, 'violet' | 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
  Estimation: 'violet',
  Agenda: 'blue',
  Invest: 'violet',
  Leads: 'green',
  Prospection: 'amber',
  Pilotage: 'blue',
};

interface Props {
  priorities: DashboardPriorityItem[];
  totalCount: number;
}

const PrioritiesPanel: React.FC<Props> = ({ priorities, totalCount }) => {
  const navigate = useNavigate();

  const handleCta = (item: DashboardPriorityItem) => {
    const cta = item.cta_primary;
    if (cta.action === 'open_route' && cta.href) navigate(cta.href);
    // open_drawer / open_modal → demo : console.log
    // eslint-disable-next-line no-console
    else console.log('[dashboard] CTA', cta);
  };

  return (
    <PanelCard
      title="Mes priorités du jour"
      right={
        <span className="inline-flex items-center h-[18px] px-1.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-600">
          {totalCount}
        </span>
      }
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/activite/pilotage')}
          className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
        >
          <span>Voir toutes mes tâches</span>
          <ArrowRight size={12} />
        </button>
      }
      bodyClassName="divide-y divide-slate-100 overflow-auto"
    >
      {priorities.length === 0 && (
        <div className="p-4 text-[12px] text-slate-500 text-center">
          🎉 Tout est à jour. Aucune action urgente.
        </div>
      )}
      {priorities.map(item => {
        const Icon = TYPE_ICON[item.type] ?? User;
        return (
          <div
            key={item.id}
            className="px-2.5 py-1.5 flex items-center gap-2 hover:bg-slate-50/50 transition-colors"
          >
            <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${URGENCY_DOT[item.urgency]}`} />
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              <Icon size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-slate-900 truncate">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {item.subtitle}
              </div>
            </div>
            <SourceBadge label={item.source_label} tone={SOURCE_TONE[item.source_label] ?? 'gray'} />
            <button
              type="button"
              onClick={() => handleCta(item)}
              className="flex-shrink-0 h-6 px-2 rounded-md bg-white border border-slate-200 hover:border-propsight-300 hover:text-propsight-700 text-[11px] font-medium text-slate-700 transition-colors"
            >
              {item.cta_primary.label}
            </button>
          </div>
        );
      })}
    </PanelCard>
  );
};

export default PrioritiesPanel;
