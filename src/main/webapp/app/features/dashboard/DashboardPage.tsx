import React, { useState } from 'react';
import { MOCK_DASHBOARD_SUMMARY } from './_mocks/dashboard';
import type { DashboardPeriod, DashboardScope } from './types';
import DashboardHeader from './components/DashboardHeader';
import KpiStrip from './components/KpiStrip';
import PrioritiesPanel from './components/PrioritiesPanel';
import AlertsPanel from './components/AlertsPanel';
import RapportsEngagementPanel from './components/RapportsEngagementPanel';
import PortfolioHealthPanel from './components/PortfolioHealthPanel';
import PulseMarketPanel from './components/PulseMarketPanel';
import TerritoryPanel from './components/TerritoryPanel';

const DashboardPage: React.FC = () => {
  const summary = MOCK_DASHBOARD_SUMMARY;

  const [period, setPeriod] = useState<DashboardPeriod>(summary.meta.period);
  const [scope, setScope] = useState<DashboardScope>(summary.meta.scope);
  const [zone, setZone] = useState<{ id: string; label: string }>({
    id: summary.meta.zone_id ?? 'paris-15',
    label: summary.meta.zone_label ?? 'Paris 15e',
  });

  return (
    <div className="flex flex-col h-full min-h-0 bg-neutral-50 overflow-auto px-4 py-3 gap-2.5">
        {/* Page header */}
        <div className="flex-shrink-0">
          <DashboardHeader
            period={period}
            onPeriodChange={setPeriod}
            zoneId={zone.id}
            zoneLabel={zone.label}
            onZoneChange={(id, label) => setZone({ id, label })}
            scope={scope}
            onScopeChange={setScope}
            quickActions={summary.quick_actions}
          />
        </div>

        {/* KPI strip */}
        <div className="flex-shrink-0">
          <KpiStrip kpis={summary.kpis} />
        </div>

        {/* Main grid — 3 rows fitting remaining height */}
        <div className="flex-1 min-h-0 grid gap-2.5 grid-rows-[minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,0.9fr)]">
          {/* Row 1 — Priorités + Alertes */}
          <div className="grid grid-cols-2 gap-2.5 min-h-0">
            <div className="min-h-0">
              <PrioritiesPanel
                priorities={summary.priorities}
                totalCount={summary.counts.total_priorities}
              />
            </div>
            <div className="min-h-0">
              <AlertsPanel
                alerts={summary.alerts}
                totalCount={summary.counts.total_alerts_unread}
              />
            </div>
          </div>

          {/* Row 2 — Rapports (phare) | Santé + Pouls empilés */}
          <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-2.5 min-h-0">
            <div className="min-h-0">
              <RapportsEngagementPanel
                rapports={summary.rapports}
                totalCount={summary.counts.total_rapports_90j}
              />
            </div>
            <div className="grid grid-rows-2 gap-2.5 min-h-0">
              <div className="min-h-0">
                <PortfolioHealthPanel health={summary.portfolio_health} />
              </div>
              <div className="min-h-0">
                {summary.pulse_market && <PulseMarketPanel pulse={summary.pulse_market} />}
              </div>
            </div>
          </div>

          {/* Row 3 — Opportunités & signaux territoire */}
          <div className="min-h-0">
            <TerritoryPanel territory={summary.territory} />
          </div>
        </div>
    </div>
  );
};

export default DashboardPage;
