import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarX,
  Clock,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  LucideIcon,
} from 'lucide-react';
import type { DashboardPortfolioHealth, DashboardPortfolioHealthCategory } from '../types';
import PanelCard from './PanelCard';

const ICONS: Record<string, LucideIcon> = {
  CalendarX,
  Clock,
  AlertTriangle,
  Sparkles,
};

const SEVERITY_TONE: Record<DashboardPortfolioHealthCategory['severity'], string> = {
  critical: 'bg-rose-50 text-rose-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-sky-50 text-sky-600',
  opportunity: 'bg-propsight-50 text-propsight-600',
};

interface Props {
  health: DashboardPortfolioHealth;
}

const PortfolioHealthPanel: React.FC<Props> = ({ health }) => {
  const navigate = useNavigate();

  const handleCta = (cat: DashboardPortfolioHealthCategory) => {
    if (cat.cta.action === 'open_route' && cat.cta.href) navigate(cat.cta.href);
    // eslint-disable-next-line no-console
    else console.log('[dashboard] CTA portfolio', cat.cta);
  };

  return (
    <PanelCard
      title="Santé portefeuille mandats"
      footer={
        <button
          type="button"
          onClick={() => navigate('/app/biens/portefeuille')}
          className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
        >
          <span>Voir tout le portefeuille</span>
          <ArrowRight size={12} />
        </button>
      }
      bodyClassName="divide-y divide-slate-100 overflow-auto"
    >
      {health.health_categories.map(cat => {
        const Icon = ICONS[cat.icon] ?? Clock;
        const tone = SEVERITY_TONE[cat.severity];
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCta(cat)}
            className="w-full text-left px-2.5 py-1.5 flex items-center gap-2 hover:bg-slate-50/50 transition-colors"
          >
            <span className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center ${tone}`}>
              <Icon size={12} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-medium text-slate-900 truncate">
                {cat.label}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                {cat.excerpt}
              </div>
            </div>
            <span className="flex-shrink-0 text-[13px] font-semibold text-slate-900 tabular-nums">
              {cat.count}
            </span>
            <ChevronRight size={13} className="text-slate-300 flex-shrink-0" />
          </button>
        );
      })}
    </PanelCard>
  );
};

export default PortfolioHealthPanel;
