import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Home, TrendingUp, Building2, CalendarX, Users, BarChart3, LucideIcon } from 'lucide-react';
import type { DashboardTerritoryItem, TerritoryItemType } from '../types';
import PanelCard from './PanelCard';

const TYPE_ICON: Record<TerritoryItemType, LucideIcon> = {
  opportunite_invest: Home,
  bien_suivi_mouvement: Home,
  annonce_opportunite: Home,
  signal_radar: CalendarX,
  signal_dvf: BarChart3,
  signal_dpe: Users,
  signal_marche: TrendingUp,
};

const TYPE_ICON_BG: Record<TerritoryItemType, string> = {
  opportunite_invest: 'bg-propsight-50 text-propsight-600',
  bien_suivi_mouvement: 'bg-sky-50 text-sky-600',
  annonce_opportunite: 'bg-slate-100 text-slate-600',
  signal_radar: 'bg-rose-50 text-rose-600',
  signal_dvf: 'bg-emerald-50 text-emerald-600',
  signal_dpe: 'bg-amber-50 text-amber-600',
  signal_marche: 'bg-emerald-50 text-emerald-600',
};

const BADGE_TONE: Record<string, string> = {
  violet: 'bg-propsight-50 text-propsight-700 border-propsight-100',
  blue: 'bg-sky-50 text-sky-700 border-sky-100',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-rose-50 text-rose-700 border-rose-100',
  gray: 'bg-slate-100 text-slate-600 border-slate-200',
};

interface Props {
  territory: DashboardTerritoryItem[];
}

const TerritoryPanel: React.FC<Props> = ({ territory }) => {
  const navigate = useNavigate();

  const { opportunities, signals } = useMemo(() => {
    const o = territory.filter(t => t.side === 'opportunites').sort((a, b) => a.rank - b.rank);
    const s = territory.filter(t => t.side === 'signaux').sort((a, b) => a.rank - b.rank);
    return { opportunities: o, signals: s };
  }, [territory]);

  const handleCta = (item: DashboardTerritoryItem) => {
    const cta = item.cta_primary;
    if (cta.action === 'open_route' && cta.href) navigate(cta.href);
    // eslint-disable-next-line no-console
    else console.log('[dashboard] CTA territory', cta);
  };

  const renderItem = (item: DashboardTerritoryItem) => {
    const Icon = TYPE_ICON[item.type] ?? Home;
    const iconTone = TYPE_ICON_BG[item.type];
    return (
      <div
        key={item.id}
        className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-slate-50/50 transition-colors"
      >
        <span className={`flex-shrink-0 w-7 h-7 rounded-md flex items-center justify-center ${iconTone}`}>
          <Icon size={13} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[12.5px] font-medium text-slate-900 truncate">{item.title}</span>
            {typeof item.score === 'number' && (
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                Score <span className="font-semibold text-slate-700">{item.score}</span>
              </span>
            )}
            {item.metric_label && !item.score && (
              <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                {item.metric_label}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[11.5px] text-slate-500 truncate">{item.subtitle}</span>
            {item.score && item.metric_label && (
              <>
                <span className="text-slate-200 text-[11px]">·</span>
                <span className="text-[11px] text-emerald-600 font-medium whitespace-nowrap">
                  {item.metric_label}
                </span>
              </>
            )}
          </div>
        </div>
        <span className={`flex-shrink-0 inline-flex items-center h-[20px] px-1.5 rounded border text-[10.5px] font-medium ${BADGE_TONE[item.badge.tone]}`}>
          {item.badge.label}
        </span>
        <button
          type="button"
          onClick={() => handleCta(item)}
          className="flex-shrink-0 h-6 px-2 rounded-md bg-white border border-slate-200 hover:border-propsight-300 hover:text-propsight-700 text-[11px] font-medium text-slate-700 transition-colors"
        >
          {item.cta_primary.label}
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-2.5 min-h-0 h-full">
      <PanelCard
        title="Top 3 opportunités"
        footer={
          <button
            type="button"
            onClick={() => navigate('/app/investissement/opportunites')}
            className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
          >
            <span>Voir toutes les opportunités</span>
            <ArrowRight size={12} />
          </button>
        }
        bodyClassName="divide-y divide-slate-100 overflow-auto"
      >
        {opportunities.map(renderItem)}
      </PanelCard>

      <PanelCard
        title="Top 3 signaux Radar"
        footer={
          <button
            type="button"
            onClick={() => navigate('/app/prospection/radar')}
            className="w-full flex items-center justify-between text-[12px] text-propsight-600 hover:text-propsight-700 font-medium"
          >
            <span>Voir tous les signaux</span>
            <ArrowRight size={12} />
          </button>
        }
        bodyClassName="divide-y divide-slate-100 overflow-auto"
      >
        {signals.map(renderItem)}
      </PanelCard>
    </div>
  );
};

export default TerritoryPanel;
