import React, { useState } from 'react';
import {
  Users,
  Target,
  Calendar,
  FileBarChart,
  TrendingUp,
  Filter,
  Download,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import EquipePageHeader, { OrgSwitcher } from '../components/EquipePageHeader';
import EquipeFiltersBar from '../components/EquipeFiltersBar';
import EquipeKpiRow, { EquipeKpi } from '../components/EquipeKpiRow';
import FunnelVisualization from '../components/perf/FunnelVisualization';
import SourceConversionTable from '../components/perf/SourceConversionTable';
import BusinessSection from '../components/perf/BusinessSection';
import MarketSection from '../components/perf/MarketSection';
import AdoptionSection from '../components/perf/AdoptionSection';
import { PrimaryButton, SecondaryButton, Trend } from '../components/primitives';
import {
  ADOPTION_COLLAB_ROWS,
  ADOPTION_METRICS,
  BUSINESS_KPIS,
  CA_MONTHLY,
  COLLABORATEURS,
  FUNNEL_KPIS,
  FUNNEL_STAGES,
  MANDATS_BY_STATUS,
  MANDATS_TOTAL,
  MARCHE_KPIS,
  MARCHE_ZONES_PERF,
  OBJECTIVE_PROGRESS,
  SOURCE_CONVERSION,
  ZONES,
} from '../_mocks/equipe';

const PerformancePage: React.FC = () => {
  const [period, setPeriod] = useState('30j');
  const [collab, setCollab] = useState('tous');
  const [zone, setZone] = useState('toutes');
  const [highlighted, setHighlighted] = useState<string | undefined>('mandats');

  const funnelKpis: EquipeKpi[] = FUNNEL_KPIS.map(k => ({
    id: k.id,
    label: k.label,
    value: k.value as string,
    delta: k.delta,
    trend: k.trend,
    icon: k.id === 'leads_entrants' ? Users : k.id.includes('mandat') ? Target : TrendingUp,
    tone: 'violet',
  }));

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <EquipePageHeader
        title="Performance business"
        subtitle="Analysez le funnel, les mandats, le CA et le potentiel de marché de votre équipe."
        right={
          <>
            <OrgSwitcher />
            <SecondaryButton icon={<Target size={11} />}>Définir objectifs</SecondaryButton>
            <SecondaryButton icon={<UserPlus size={11} />}>Comparer équipes</SecondaryButton>
            <SecondaryButton icon={<Download size={11} />}>Exporter</SecondaryButton>
            <PrimaryButton icon={<Sparkles size={11} />}>Assistant IA</PrimaryButton>
          </>
        }
      />

      <EquipeFiltersBar
        period={{ value: period, onChange: setPeriod }}
        comparison={{ value: 'periode', onChange: () => undefined }}
        filters={[
          {
            key: 'collab',
            label: 'Collab.',
            value: collab,
            options: [
              { value: 'tous', label: 'Tous' },
              ...COLLABORATEURS.map(c => ({ value: c.user_id, label: c.display_name })),
            ],
            onChange: setCollab,
          },
          {
            key: 'zone',
            label: 'Zone',
            value: zone,
            options: [
              { value: 'toutes', label: 'Toutes' },
              ...ZONES.map(z => ({ value: z.slug, label: z.label })),
            ],
            onChange: setZone,
          },
          {
            key: 'source',
            label: 'Source',
            value: 'toutes',
            options: [
              { value: 'toutes', label: 'Toutes' },
              { value: 'widget', label: 'Widget' },
              { value: 'prospection', label: 'Prospection' },
            ],
            onChange: () => undefined,
          },
        ]}
        activeFiltersCount={2}
      />

      <div className="flex-1 min-h-0 px-3 py-2 overflow-y-auto">
        {/* Layer 1 — Funnel & conversion */}
        <section className="mb-2 bg-white border border-slate-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12.5px] font-bold text-slate-800">Funnel & conversion équipe</div>
            <div className="text-[10.5px] text-slate-500">30 derniers jours</div>
          </div>
          <div className="grid grid-cols-7 gap-1.5 mb-3">
            {FUNNEL_KPIS.map(k => (
              <div key={k.id} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5">
                <div className="text-[10px] text-slate-500 truncate">{k.label}</div>
                <div className="text-[14px] font-bold text-slate-900 tabular-nums leading-tight">
                  {k.value}
                </div>
                {k.delta && (
                  <div className="mt-0.5">
                    <Trend trend={k.trend} text={k.delta} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[minmax(0,1.5fr)_minmax(360px,1fr)] gap-3">
            <div>
              <div className="text-[11px] font-semibold text-slate-800 mb-1.5">
                Funnel équipe (30 derniers jours)
              </div>
              <FunnelVisualization stages={FUNNEL_STAGES} highlighted={highlighted} onSelect={setHighlighted} />
              <div className="flex items-center gap-4 text-[10.5px] text-slate-500 mt-2">
                <span>
                  Taux global lead → mandat :{' '}
                  <span className="font-semibold text-propsight-700">2,1 %</span>
                </span>
                <span>
                  Lead → signature :{' '}
                  <span className="font-semibold text-propsight-700">1,4 %</span>
                </span>
              </div>
            </div>
            <SourceConversionTable rows={SOURCE_CONVERSION} />
          </div>
        </section>

        {/* Layer 2 — Business & mandats */}
        <section className="mb-2 bg-white border border-slate-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12.5px] font-bold text-slate-800">Business & mandats</div>
            <div className="text-[10.5px] text-slate-500">
              Même lib de calcul que Mon activité › Performance
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {BUSINESS_KPIS.map(k => (
              <div key={k.id} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1.5">
                <div className="text-[10px] text-slate-500">{k.label}</div>
                <div className="text-[15px] font-bold text-slate-900 tabular-nums leading-tight">
                  {k.value}
                </div>
                {k.delta && (
                  <div className="mt-0.5">
                    <Trend trend={k.trend} text={k.delta} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <BusinessSection
            monthly={CA_MONTHLY}
            mandats={MANDATS_BY_STATUS}
            mandatsTotal={MANDATS_TOTAL}
          />
        </section>

        {/* Layer 3 — Marché & potentiel */}
        <section className="mb-2 bg-white border border-slate-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12.5px] font-bold text-slate-800">Marché & potentiel</div>
            <div className="text-[10.5px] text-slate-500">
              Hypothèses : commission 3,8 % · panier moyen 520 k€
            </div>
          </div>
          <MarketSection kpis={MARCHE_KPIS} zones={MARCHE_ZONES_PERF} />
        </section>

        {/* Layer 4 — Adoption & coaching */}
        <section className="mb-2 bg-white border border-slate-200 rounded-md p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[12.5px] font-bold text-slate-800">Adoption & coaching</div>
            <div className="text-[10.5px] text-slate-500">
              Suivi usage produit et recommandations
            </div>
          </div>
          <AdoptionSection
            metrics={ADOPTION_METRICS}
            rows={ADOPTION_COLLAB_ROWS}
            objective={OBJECTIVE_PROGRESS}
          />
        </section>
      </div>
    </div>
  );
};

export default PerformancePage;
