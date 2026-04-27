import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import WidgetCard from '../components/WidgetCard';
import KpiCard from '../components/KpiCard';
import ActivityTimeline from '../components/ActivityTimeline';
import { MOCK_WIDGETS } from '../_mocks/widgets';
import { HUB_KPI } from '../_mocks/kpi';
import { RECENT_ACTIVITY } from '../_mocks/activity';

const WidgetsHub: React.FC = () => {
  return (
    <div className="max-w-[1320px] mx-auto px-8 py-8 space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Widgets publics</h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Vue d'ensemble des plugins publics installés : performance, activité récente et accès rapide à la configuration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {HUB_KPI.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaUnit={k.deltaUnit as '%' | 'pts'}
            hint={k.hint}
            format={k.format}
            icon={(['views', 'starts', 'leads', 'completion'] as const)[i]}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {MOCK_WIDGETS.map(w => (
          <WidgetCard key={w.id} widget={w} />
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-md">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <h2 className="text-sm font-semibold text-slate-900">Activité récente</h2>
          <Link
            to="/app/activite/performance"
            className="inline-flex items-center gap-1 text-xs text-propsight-600 hover:text-propsight-700 font-medium"
          >
            Voir toute l'activité <ExternalLink size={11} />
          </Link>
        </div>
        <div className="px-2 py-1">
          <ActivityTimeline entries={RECENT_ACTIVITY} />
        </div>
      </div>
    </div>
  );
};

export default WidgetsHub;
