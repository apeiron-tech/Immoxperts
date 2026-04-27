import React, { useState } from 'react';
import { ArrowRight, Calendar, Download, Sparkles } from 'lucide-react';
import StudioLayout from '../layout/StudioLayout';
import KpiTile from '../shared/KpiTile';
import SectionCard from '../shared/SectionCard';
import ChannelBadge from '../shared/ChannelBadge';
import {
  CHANNEL_PERFORMANCE,
  formatEuros,
  formatNumber,
  FUNNEL_STEPS,
  MARKETING_PROPERTIES,
} from '../_mocks/marketing';

type Tab = 'overview' | 'canal' | 'bien' | 'contenu' | 'zone' | 'collaborateur' | 'attribution';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Vue globale' },
  { id: 'canal', label: 'Par canal' },
  { id: 'bien', label: 'Par bien' },
  { id: 'contenu', label: 'Par contenu' },
  { id: 'zone', label: 'Par zone' },
  { id: 'collaborateur', label: 'Par collaborateur' },
  { id: 'attribution', label: 'Attribution' },
];

const KPIS = [
  { id: 'impressions', label: 'Impressions', value: '354 412', delta: '+18 %', trend: 'up' as const },
  { id: 'clicks', label: 'Clics', value: '19 848', delta: '+22 %', trend: 'up' as const },
  { id: 'leads', label: 'Leads', value: '389', delta: '+24 %', trend: 'up' as const },
  { id: 'rdv', label: 'RDV', value: '128', delta: '+14 %', trend: 'up' as const },
  { id: 'mandats', label: 'Mandats', value: '18', delta: '+38 %', trend: 'up' as const },
  { id: 'ca_pipe', label: 'CA pipe', value: '342 K€', delta: '+12 %', trend: 'up' as const },
  { id: 'depense', label: 'Dépense', value: '8 412 €', delta: '+9 %', trend: 'up' as const },
  { id: 'cpl', label: 'CPL moyen', value: '21,60 €', delta: '−12 %', trend: 'down' as const, hint: 'baisse positive' },
];

const CONTENT_ANGLES = [
  { angle: 'Juste prix', leads: 84, cpl: 18.4, mandats: 4 },
  { angle: 'Quartier / vie locale', leads: 62, cpl: 22.1, mandats: 3 },
  { angle: 'Mandat exclusif', leads: 48, cpl: 28.5, mandats: 5 },
  { angle: 'Estimation gratuite', leads: 95, cpl: 12.8, mandats: 2 },
  { angle: 'Rendement / investissement', leads: 38, cpl: 32.7, mandats: 2 },
  { angle: 'DPE & rénovation', leads: 28, cpl: 24.0, mandats: 1 },
  { angle: 'Visite virtuelle', leads: 22, cpl: 19.2, mandats: 1 },
  { angle: 'Nouveau prix', leads: 12, cpl: 30.0, mandats: 0 },
];

const ZONES = [
  { zone: 'Antibes (06)', leads: 96, cpl: 19.0, mandats: 4, note: 'Meilleur CPL Meta Ads sur la côte' },
  { zone: 'Lyon 6e – 7e (69)', leads: 78, cpl: 22.4, mandats: 5, note: 'Engagement fort, conversion à booster' },
  { zone: 'Paris 15e (75)', leads: 64, cpl: 28.2, mandats: 3, note: 'Coût par lead vendeur 32 % inférieur à la moyenne' },
  { zone: 'Bordeaux Chartrons (33)', leads: 38, cpl: 36.4, mandats: 2, note: 'LinkedIn sur-performe pour investissement' },
  { zone: 'Nantes Centre (44)', leads: 42, cpl: 24.8, mandats: 2, note: 'Tension forte, campagnes courtes recommandées' },
];

const TEAM = [
  { agent: 'Sophie Martin', kits: 14, leads: 72, conv: 31, cpl: 18.4, mandats: 6 },
  { agent: 'Karim Benali', kits: 11, leads: 58, conv: 24, cpl: 21.0, mandats: 4 },
  { agent: 'Lucie Tran', kits: 9, leads: 42, conv: 19, cpl: 26.5, mandats: 3 },
  { agent: 'Pierre Adam', kits: 6, leads: 28, conv: 15, cpl: 32.0, mandats: 2 },
];

const FunnelChart: React.FC = () => {
  const max = FUNNEL_STEPS[0].value;
  return (
    <div className="space-y-1.5">
      {FUNNEL_STEPS.map((step, idx) => {
        const widthPct = Math.max(8, (step.value / max) * 100);
        const isLast = idx === FUNNEL_STEPS.length - 1;
        return (
          <div key={step.id} className="grid grid-cols-[140px_minmax(0,1fr)_120px] items-center gap-3">
            <div className="text-[12px] text-neutral-700 font-medium">{step.label}</div>
            <div className="relative h-7 bg-neutral-50 rounded">
              <div
                className={`h-full rounded flex items-center px-2 ${
                  isLast ? 'bg-propsight-600 text-white' : 'bg-propsight-200 text-propsight-900'
                }`}
                style={{ width: `${widthPct}%` }}
              >
                <span className="text-[12px] font-semibold tabular-nums">{formatNumber(step.value)}</span>
              </div>
            </div>
            <div className="text-[11px] text-neutral-600 text-right">
              {step.conversion !== undefined && (
                <span className="text-success-700 font-medium">{step.conversion.toFixed(1)} % conversion</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ChannelTable: React.FC = () => (
  <table className="w-full text-[12px]">
    <thead className="bg-neutral-50/50">
      <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
        <th className="py-2 pl-3 font-semibold">Canal</th>
        <th className="py-2 px-2 text-right font-semibold">Impressions</th>
        <th className="py-2 px-2 text-right font-semibold">Clics</th>
        <th className="py-2 px-2 text-right font-semibold">CTR</th>
        <th className="py-2 px-2 text-right font-semibold">Interactions</th>
        <th className="py-2 px-2 text-right font-semibold">Leads</th>
        <th className="py-2 px-2 text-right font-semibold">RDV</th>
        <th className="py-2 px-2 text-right font-semibold">Mandats</th>
        <th className="py-2 px-2 text-right font-semibold">Dépense</th>
        <th className="py-2 pr-3 text-right font-semibold">CPL</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-100">
      {CHANNEL_PERFORMANCE.map(p => (
        <tr key={p.channel} className="hover:bg-neutral-50/60">
          <td className="py-2 pl-3"><ChannelBadge channel={p.channel} withLabel /></td>
          <td className="py-2 px-2 text-right tabular-nums">{formatNumber(p.impressions)}</td>
          <td className="py-2 px-2 text-right tabular-nums">{formatNumber(p.clicks)}</td>
          <td className="py-2 px-2 text-right tabular-nums">{p.ctr.toFixed(1)} %</td>
          <td className="py-2 px-2 text-right tabular-nums">{p.interactions}</td>
          <td className="py-2 px-2 text-right tabular-nums font-medium text-neutral-900">{p.leads}</td>
          <td className="py-2 px-2 text-right tabular-nums">{p.rdv}</td>
          <td className="py-2 px-2 text-right tabular-nums text-propsight-700 font-medium">{p.mandats}</td>
          <td className="py-2 px-2 text-right tabular-nums">{p.spend > 0 ? formatEuros(p.spend) : '—'}</td>
          <td className="py-2 pr-3 text-right tabular-nums">{p.cpl ? `${p.cpl.toFixed(1)} €` : '—'}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PerformanceMarketingPage: React.FC = () => {
  const [tab, setTab] = useState<Tab>('overview');
  return (
    <StudioLayout
      title="Performance"
      breadcrumbCurrent="Performance"
      headerRight={
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <Calendar size={13} />
            30 derniers jours
          </button>
          <button className="px-2.5 py-1.5 text-[12.5px] border border-neutral-200 rounded-md text-neutral-700 bg-white hover:border-neutral-300 inline-flex items-center gap-1.5">
            <Download size={13} />
            Exporter
          </button>
        </div>
      }
    >
      <div className="h-full overflow-y-auto p-5 space-y-4">
        <div className="grid grid-cols-4 xl:grid-cols-8 gap-3">
          {KPIS.map(k => (
            <KpiTile
              key={k.id}
              label={k.label}
              value={k.value}
              delta={k.delta}
              trend={k.trend}
              hint={k.hint}
              invertTrendSemantics={k.id === 'cpl'}
            />
          ))}
        </div>

        <div className="border-b border-neutral-200 flex items-center gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-[12.5px] font-medium border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id
                  ? 'text-propsight-700 border-propsight-600'
                  : 'text-neutral-600 border-transparent hover:text-neutral-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <>
            <SectionCard title="Funnel d'attribution" subtitle="Impressions → Mandats">
              <FunnelChart />
            </SectionCard>
            <div className="grid grid-cols-2 gap-3">
              <SectionCard title="Recommandations performance" subtitle="Issues automatiquement de l'analyse">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[12.5px]">
                    <Sparkles size={14} className="text-propsight-600 flex-shrink-0 mt-0.5" />
                    <span>Dupliquez l'angle « juste prix » sur 3 biens similaires — CPL 18 € vs 22 € moyen.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[12.5px]">
                    <Sparkles size={14} className="text-propsight-600 flex-shrink-0 mt-0.5" />
                    <span>Réduisez le budget LinkedIn : CPL 36,7 € — 2,4× le coût Meta.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[12.5px]">
                    <Sparkles size={14} className="text-propsight-600 flex-shrink-0 mt-0.5" />
                    <span>Le canal Email convertit peu en volume mais fort en mandat (×3 vs Insta).</span>
                  </li>
                  <li className="flex items-start gap-2 text-[12.5px]">
                    <Sparkles size={14} className="text-propsight-600 flex-shrink-0 mt-0.5" />
                    <span>Relancez les interactions Google : taux RDV 38 %.</span>
                  </li>
                </ul>
              </SectionCard>
              <SectionCard title="Top 5 — Performance par canal" subtitle="Tri par mandats attribués">
                <table className="w-full text-[12px]">
                  <thead>
                    <tr className="text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                      <th className="py-1.5 text-left">Canal</th>
                      <th className="py-1.5 text-right">Leads</th>
                      <th className="py-1.5 text-right">Mandats</th>
                      <th className="py-1.5 text-right">CPL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {[...CHANNEL_PERFORMANCE].sort((a, b) => b.mandats - a.mandats).slice(0, 5).map(p => (
                      <tr key={p.channel}>
                        <td className="py-1.5"><ChannelBadge channel={p.channel} withLabel /></td>
                        <td className="py-1.5 text-right tabular-nums">{p.leads}</td>
                        <td className="py-1.5 text-right tabular-nums text-propsight-700 font-semibold">{p.mandats}</td>
                        <td className="py-1.5 text-right tabular-nums">{p.cpl ? `${p.cpl.toFixed(1)} €` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </SectionCard>
            </div>
          </>
        )}

        {tab === 'canal' && (
          <SectionCard title="Performance par canal" subtitle={`${CHANNEL_PERFORMANCE.length} canaux mesurés`}>
            <ChannelTable />
          </SectionCard>
        )}

        {tab === 'bien' && (
          <SectionCard title="Performance par bien" subtitle="Triée par leads générés">
            <table className="w-full text-[12px]">
              <thead className="bg-neutral-50/50">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-2 pl-3 font-semibold">Bien</th>
                  <th className="py-2 px-2 font-semibold">Statut</th>
                  <th className="py-2 px-2 text-right font-semibold">Vues</th>
                  <th className="py-2 px-2 text-right font-semibold">Leads</th>
                  <th className="py-2 px-2 text-right font-semibold">CPL</th>
                  <th className="py-2 px-2 text-right font-semibold">Score marketing</th>
                  <th className="py-2 pr-3 font-semibold">Recommandation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {MARKETING_PROPERTIES.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/60">
                    <td className="py-2 pl-3 font-medium text-neutral-900">{p.bienLabel}<div className="text-[10.5px] text-neutral-500 font-normal">{p.ville}</div></td>
                    <td className="py-2 px-2 text-neutral-600">{p.status.replace(/_/g, ' ')}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{formatNumber(p.views30d)}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium text-neutral-900">{p.leads30d}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{p.cpl ? `${p.cpl.toFixed(1)} €` : '—'}</td>
                    <td className="py-2 px-2 text-right tabular-nums text-neutral-700">{p.publishabilityScore} / 100</td>
                    <td className="py-2 pr-3 text-[11.5px] text-propsight-700">{p.recommendation ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )}

        {tab === 'contenu' && (
          <SectionCard title="Performance par angle de contenu" subtitle="Leads, CPL et mandats par angle éditorial">
            <table className="w-full text-[12px]">
              <thead className="bg-neutral-50/50">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-2 pl-3 font-semibold">Angle</th>
                  <th className="py-2 px-2 text-right font-semibold">Leads</th>
                  <th className="py-2 px-2 text-right font-semibold">CPL</th>
                  <th className="py-2 px-2 text-right font-semibold">Mandats</th>
                  <th className="py-2 pr-3 text-right font-semibold">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {CONTENT_ANGLES.map(c => (
                  <tr key={c.angle} className="hover:bg-neutral-50/60">
                    <td className="py-2 pl-3 font-medium text-neutral-900">{c.angle}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium">{c.leads}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{c.cpl.toFixed(1)} €</td>
                    <td className="py-2 px-2 text-right tabular-nums text-propsight-700 font-semibold">{c.mandats}</td>
                    <td className="py-2 pr-3 text-right">
                      {c.cpl < 20 ? (
                        <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-success-50 text-success-700">★ À dupliquer</span>
                      ) : c.cpl > 30 ? (
                        <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-700">À ajuster</span>
                      ) : (
                        <span className="text-[10.5px] font-medium px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">Standard</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )}

        {tab === 'zone' && (
          <SectionCard title="Performance par zone" subtitle="Lecture par arrondissement / commune">
            <table className="w-full text-[12px]">
              <thead className="bg-neutral-50/50">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-2 pl-3 font-semibold">Zone</th>
                  <th className="py-2 px-2 text-right font-semibold">Leads</th>
                  <th className="py-2 px-2 text-right font-semibold">CPL</th>
                  <th className="py-2 px-2 text-right font-semibold">Mandats</th>
                  <th className="py-2 pr-3 font-semibold">Note Propsight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {ZONES.map(z => (
                  <tr key={z.zone} className="hover:bg-neutral-50/60">
                    <td className="py-2 pl-3 font-medium text-neutral-900">{z.zone}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium">{z.leads}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{z.cpl.toFixed(1)} €</td>
                    <td className="py-2 px-2 text-right tabular-nums text-propsight-700 font-semibold">{z.mandats}</td>
                    <td className="py-2 pr-3 text-[11.5px] text-neutral-600">{z.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )}

        {tab === 'collaborateur' && (
          <SectionCard title="Performance par collaborateur" subtitle="Adoption, kits, leads et mandats">
            <table className="w-full text-[12px]">
              <thead className="bg-neutral-50/50">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wide text-neutral-500 border-b border-neutral-100">
                  <th className="py-2 pl-3 font-semibold">Agent</th>
                  <th className="py-2 px-2 text-right font-semibold">Kits créés</th>
                  <th className="py-2 px-2 text-right font-semibold">Leads</th>
                  <th className="py-2 px-2 text-right font-semibold">Conversion</th>
                  <th className="py-2 px-2 text-right font-semibold">CPL</th>
                  <th className="py-2 pr-3 text-right font-semibold">Mandats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {TEAM.map(t => (
                  <tr key={t.agent} className="hover:bg-neutral-50/60">
                    <td className="py-2 pl-3 font-medium text-neutral-900">{t.agent}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{t.kits}</td>
                    <td className="py-2 px-2 text-right tabular-nums font-medium">{t.leads}</td>
                    <td className="py-2 px-2 text-right tabular-nums">{t.conv} %</td>
                    <td className="py-2 px-2 text-right tabular-nums">{t.cpl.toFixed(1)} €</td>
                    <td className="py-2 pr-3 text-right tabular-nums text-propsight-700 font-semibold">{t.mandats}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )}

        {tab === 'attribution' && (
          <SectionCard
            title="Modèles d'attribution"
            subtitle="Comparez l'origine des mandats selon plusieurs modèles"
          >
            <div className="grid grid-cols-2 gap-3 text-[12.5px]">
              {[
                { name: 'Last click', pct: '42 %', detail: 'Privilégie le dernier touchpoint avant lead' },
                { name: 'First click', pct: '28 %', detail: 'Récompense la captation initiale (notoriété)' },
                { name: 'Assisté', pct: '64 %', detail: 'Comptabilise tous les touchpoints intermédiaires' },
                { name: 'Pondéré Propsight', pct: '100 %', detail: 'Modèle recommandé : pondération en U sur le funnel' },
              ].map(m => (
                <div key={m.name} className="border border-neutral-200 rounded-lg p-3 hover:border-propsight-300">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-neutral-900">{m.name}</span>
                    <span className="text-[12px] text-propsight-700 font-semibold">{m.pct} couverture</span>
                  </div>
                  <p className="text-[11.5px] text-neutral-600 mt-1">{m.detail}</p>
                  <button className="mt-2 inline-flex items-center gap-1 text-[11.5px] font-medium text-propsight-700 hover:text-propsight-900">
                    Appliquer ce modèle <ArrowRight size={11} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 border border-propsight-200 bg-propsight-50/50 rounded p-3 text-[12px] text-neutral-800">
              <strong className="font-semibold text-neutral-900">Exemple — Mandat n° 12 084</strong>
              <p className="mt-1">Attribué à 60 % au widget estimation et 40 % à une campagne Meta « Acquisition vendeurs Lyon 6e ». Le modèle pondéré Propsight permet de partager le crédit entre les touchpoints qualifiants.</p>
            </div>
          </SectionCard>
        )}
      </div>
    </StudioLayout>
  );
};

export default PerformanceMarketingPage;
