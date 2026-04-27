import React, { useState } from 'react';
import type { WidgetInstance } from '../../types';
import KpiCard from '../../components/KpiCard';
import FunnelBar from '../../components/FunnelBar';
import {
  PERFORMANCE_KPI,
  FUNNEL_STEPS,
  BEHAVIOR_METRICS,
  CONVERSION_METRICS,
  TOP_ZONES,
  TIMESERIES_30D,
} from '../../_mocks/kpi';

interface Props {
  widget: WidgetInstance;
}

const PerformanceTab: React.FC<Props> = ({ widget }) => {
  const [range, setRange] = useState<'7j' | '30j' | '90j' | '12m'>('30j');

  const maxVues = Math.max(...TIMESERIES_30D.map(d => d.vues));
  const maxLeads = Math.max(...TIMESERIES_30D.map(d => d.leads));

  return (
    <div className="space-y-5">
      {/* Header date range */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Performance du widget</h2>
        <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-white">
          {(['7j', '30j', '90j', '12m'] as const).map(r => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                range === r ? 'bg-propsight-50 text-propsight-700 font-medium' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {r === '7j' ? '7 jours' : r === '30j' ? '30 jours' : r === '90j' ? '90 jours' : '12 mois'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-4 gap-3">
        {PERFORMANCE_KPI.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            value={k.value}
            delta={k.delta}
            deltaUnit={k.deltaUnit as '%' | 'pts'}
            sub={(k as any).sub}
            icon={(['views', 'starts', 'leads', 'completion'] as const)[i]}
          />
        ))}
      </div>

      {/* Funnel */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-4">Entonnoir de conversion</h3>
        <FunnelBar steps={FUNNEL_STEPS} />
      </div>

      {/* Behavior + Conversion */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Comportement</h3>
          <ul className="divide-y divide-slate-100">
            {BEHAVIOR_METRICS.map(m => (
              <li key={m.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-slate-600">{m.label}</span>
                <span className="text-slate-900 font-medium text-right">{m.value}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white border border-slate-200 rounded-md p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Conversion</h3>
          <ul className="divide-y divide-slate-100">
            {CONVERSION_METRICS.map(m => (
              <li key={m.label} className="flex items-center justify-between py-2.5 text-sm">
                <span className="text-slate-600">{m.label}</span>
                <span className="text-slate-900 font-medium text-right">{m.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Timeseries simple (SVG) */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Évolution — 30 derniers jours</h3>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-propsight-500" /> Vues
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Leads
            </span>
          </div>
        </div>
        <svg viewBox="0 0 600 160" className="w-full h-40">
          <g>
            {TIMESERIES_30D.map((d, i) => {
              const x = (i / (TIMESERIES_30D.length - 1)) * 600;
              const yVues = 160 - (d.vues / maxVues) * 140;
              const next = TIMESERIES_30D[i + 1];
              if (!next) return null;
              const xNext = ((i + 1) / (TIMESERIES_30D.length - 1)) * 600;
              const yVuesNext = 160 - (next.vues / maxVues) * 140;
              return (
                <line
                  key={`v${i}`}
                  x1={x}
                  y1={yVues}
                  x2={xNext}
                  y2={yVuesNext}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              );
            })}
            {TIMESERIES_30D.map((d, i) => {
              const x = (i / (TIMESERIES_30D.length - 1)) * 600;
              const yLeads = 160 - (d.leads / maxLeads) * 140;
              const next = TIMESERIES_30D[i + 1];
              if (!next) return null;
              const xNext = ((i + 1) / (TIMESERIES_30D.length - 1)) * 600;
              const yLeadsNext = 160 - (next.leads / maxLeads) * 140;
              return (
                <line
                  key={`l${i}`}
                  x1={x}
                  y1={yLeads}
                  x2={xNext}
                  y2={yLeadsNext}
                  stroke="#10b981"
                  strokeWidth={2}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Top zones */}
      <div className="bg-white border border-slate-200 rounded-md p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          {widget.type === 'estimation_vendeur' ? 'Top quartiers' : 'Top zones'}
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
              <th className="py-2 font-medium">Zone</th>
              <th className="py-2 font-medium">Leads</th>
              <th className="py-2 font-medium">Évolution</th>
            </tr>
          </thead>
          <tbody>
            {TOP_ZONES.map(z => (
              <tr key={z.label} className="border-b border-slate-100">
                <td className="py-2.5 text-slate-900">{z.label}</td>
                <td className="py-2.5 text-slate-700 tabular-nums">{z.leads}</td>
                <td className={`py-2.5 text-xs font-medium ${z.trend.startsWith('-') ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {z.trend}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PerformanceTab;
