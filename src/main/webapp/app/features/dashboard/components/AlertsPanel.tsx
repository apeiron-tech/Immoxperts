import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingDown,
  Building2,
  FileText,
  Zap,
  BarChart3,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import type { DashboardAlertItem } from '../types';
import PanelCard from './PanelCard';
import SourceBadge from './SourceBadge';

const ICONS: Record<string, LucideIcon> = {
  TrendingDown,
  Building2,
  FileText,
  Zap,
  BarChart3,
};

const ICON_TONE: Record<string, string> = {
  TrendingDown: 'bg-rose-50 text-rose-600',
  Building2: 'bg-slate-100 text-slate-600',
  FileText: 'bg-propsight-50 text-propsight-600',
  Zap: 'bg-amber-50 text-amber-600',
  BarChart3: 'bg-emerald-50 text-emerald-600',
};

const SOURCE_TONE: Record<string, 'violet' | 'blue' | 'green' | 'amber' | 'red' | 'gray'> = {
  Observatoire: 'blue',
  Concurrence: 'red',
  Estimation: 'violet',
  Réglementaire: 'amber',
  Marché: 'green',
  Veille: 'blue',
};

interface Props {
  alerts: DashboardAlertItem[];
  totalCount: number;
}

const AlertsPanel: React.FC<Props> = ({ alerts, totalCount }) => {
  const navigate = useNavigate();

  const handleCta = (item: DashboardAlertItem) => {
    const cta = item.cta_primary;
    if (cta.action === 'open_route' && cta.href) navigate(cta.href);
    // eslint-disable-next-line no-console
    else console.log('[dashboard] CTA', cta);
  };

  return (
    <PanelCard
      title="Alertes prioritaires"
      right={
        <span className="inline-flex items-center h-[18px] px-1.5 rounded bg-slate-100 text-[10.5px] font-medium text-slate-600">
          {totalCount}
        </span>
      }
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/veille/notifications')}
          className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
        >
          <span>Voir toutes les alertes</span>
          <ArrowRight size={12} />
        </button>
      }
      bodyClassName="divide-y divide-slate-100 overflow-auto"
    >
      {alerts.map(item => {
        const Icon = ICONS[item.icon] ?? Zap;
        const iconTone = ICON_TONE[item.icon] ?? 'bg-slate-100 text-slate-600';
        return (
          <div
            key={item.id}
            className="px-2.5 py-1.5 flex items-center gap-2 hover:bg-slate-50/50 transition-colors"
          >
            <span className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${iconTone}`}>
              <Icon size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-slate-900 truncate flex items-center gap-1.5">
                {item.title}
                {item.is_unread && <span className="w-1.5 h-1.5 rounded-full bg-propsight-500" />}
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

export default AlertsPanel;
