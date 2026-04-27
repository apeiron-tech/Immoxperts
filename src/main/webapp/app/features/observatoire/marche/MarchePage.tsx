import React, { useMemo, useState } from 'react';
import { Building2, TrendingUp, ShieldCheck, Rows3, Copy, Bell, Eye, Target } from 'lucide-react';
import {
  PageHeader,
  KpiStrip,
  InsightStrip,
  Card,
  Chip,
  SourceConfidence,
  ActionsFooter,
  FilterBar,
  FilterChip,
  PrimaryButton,
  SecondaryButton,
  ExportButton,
  CreerAlerteButton,
  ConfidenceDots,
  KpiItem,
} from '../components/primitives';
import ObservatoireMap from '../components/ObservatoireMap';
import {
  DEFAULT_ZONE,
  MARCHE_VENTE_KPIS,
  MARCHE_LOCATION_KPIS,
  MARCHE_RENDEMENT_KPIS,
  MARCHE_VENTE_RANGE,
  MARCHE_VENTE_TIMESERIES,
  MARCHE_VENTE_SEGMENTS,
  MARCHE_VENTE_DISTRIBUTION,
  MARCHE_VENTE_COMPARABLES_VENDUS,
  MARCHE_VENTE_COMPARABLES_EN_VENTE,
  MARCHE_VENTE_COMPARABLES_INVENDUS,
  MARCHE_NEIGHBORS,
  MARCHE_VENTE_CONFIDENCE,
  MARCHE_VENTE_INSIGHTS,
  MARCHE_VENTE_TAGS,
} from '../_mocks/observatoire';

type Mode = 'vente' | 'location' | 'rendement';

const MODE_OPTIONS = [
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
  { value: 'rendement', label: 'Rendement' },
];

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
];

const SEGMENT_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'studio_t1', label: 'Studio / T1' },
  { value: 't2', label: 'T2' },
  { value: 't3', label: 'T3' },
  { value: 't4_plus', label: 'T4 et +' },
];

const SURFACE_OPTIONS = [
  { value: 'all', label: 'Toutes' },
  { value: '<30', label: '< 30 m²' },
  { value: '30_50', label: '30–50 m²' },
  { value: '50_75', label: '50–75 m²' },
  { value: '75_100', label: '75–100 m²' },
  { value: '100+', label: '100 m²+' },
];

const PERIOD_OPTIONS = [
  { value: '6m', label: '6 mois' },
  { value: '12m', label: '12 mois' },
  { value: '24m', label: '24 mois' },
  { value: '5y', label: '5 ans' },
];

const SOURCE_OPTIONS = [
  { value: 'mixed', label: 'DVF + annonces' },
  { value: 'dvf', label: 'DVF' },
  { value: 'annonces', label: 'Annonces' },
];

const ZONE_OPTIONS = [
  { value: 'paris-3e', label: 'Paris 3e' },
  { value: 'paris-4e', label: 'Paris 4e' },
  { value: 'paris-11e', label: 'Paris 11e' },
  { value: 'paris-10e', label: 'Paris 10e' },
  { value: 'paris-2e', label: 'Paris 2e' },
];

const formatEuroInt = (n: number) => n.toLocaleString('fr-FR') + ' €/m²';
const formatPct = (n: number) => (n > 0 ? '+' : '') + n.toFixed(1) + ' %';

/* ------------------------------------------------------------------ */
/* Fourchette                                                          */
/* ------------------------------------------------------------------ */

const RangeBlock: React.FC = () => {
  const r = MARCHE_VENTE_RANGE;
  const pct = ((r.median - r.low) / (r.high - r.low)) * 100;
  return (
    <Card title="Fourchette de prix de vente">
      <div className="relative h-4 mt-0.5">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-gradient-to-r from-propsight-100 via-propsight-300 to-propsight-500" />
        <div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-propsight-600 shadow-sm"
          style={{ left: `${pct}%` }}
        />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1.5">
        <div>
          <div className="text-[9.5px] text-slate-400">Prix bas</div>
          <div className="text-[11.5px] font-semibold text-slate-900">{formatEuroInt(r.low)}</div>
        </div>
        <div className="text-center">
          <div className="text-[9.5px] text-propsight-600 font-medium">Prix médian</div>
          <div className="text-[11.5px] font-semibold text-propsight-700">{formatEuroInt(r.median)}</div>
        </div>
        <div className="text-right">
          <div className="text-[9.5px] text-slate-400">Prix haut</div>
          <div className="text-[11.5px] font-semibold text-slate-900">{formatEuroInt(r.high)}</div>
        </div>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Evolution chart                                                     */
/* ------------------------------------------------------------------ */

const EvolutionChart: React.FC = () => {
  const [period, setPeriod] = useState<'6m' | '12m' | '24m'>('12m');
  const data = MARCHE_VENTE_TIMESERIES;
  const visible = period === '6m' ? data.slice(-6) : period === '24m' ? data : data;
  const min = Math.min(...visible.map(d => d.low ?? d.median));
  const max = Math.max(...visible.map(d => d.high ?? d.median));
  const maxVol = Math.max(...visible.map(d => d.volume ?? 0));

  const w = 100;
  const h = 60;
  const chartPad = 4;
  const xStep = (w - 2 * chartPad) / (visible.length - 1);
  const scaleY = (v: number) => h - chartPad - ((v - min) / (max - min)) * (h - 2 * chartPad - 18);

  const medianPath = visible
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${chartPad + i * xStep} ${scaleY(p.median)}`)
    .join(' ');

  const areaPath = visible.reduce((acc, p, i) => {
    const x = chartPad + i * xStep;
    return acc + `${i === 0 ? 'M' : 'L'} ${x} ${scaleY(p.high ?? p.median)} `;
  }, '') +
    visible
      .slice()
      .reverse()
      .map((p, i) => {
        const x = chartPad + (visible.length - 1 - i) * xStep;
        return `L ${x} ${scaleY(p.low ?? p.median)}`;
      })
      .join(' ') +
    ' Z';

  return (
    <Card
      title="Évolution du prix médian DVF (€/m²)"
      action={
        <div className="flex items-center gap-0.5 bg-slate-100 rounded p-0.5">
          {(['6M', '12M', '24M'] as const).map(p => {
            const key = p.toLowerCase() as typeof period;
            return (
              <button
                key={p}
                onClick={() => setPeriod(key)}
                className={`h-5 px-1.5 text-[10px] rounded font-medium transition-colors ${
                  period === key ? 'bg-white text-propsight-700 shadow-sm' : 'text-slate-500'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      }
    >
      <div className="mt-1">
        <div className="flex items-center gap-3 mb-1 text-[10px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-0.5 w-3 bg-propsight-600 inline-block" />
            Médian DVF
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-propsight-100 inline-block" />
            Fourchette (P10–P90)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-slate-200 inline-block" />
            Volume DVF
          </span>
        </div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 100 }} preserveAspectRatio="none">
          {/* Volume bars */}
          {visible.map((p, i) => {
            const barH = ((p.volume ?? 0) / maxVol) * 14;
            return (
              <rect
                key={`v_${i}`}
                x={chartPad + i * xStep - 2}
                y={h - chartPad - barH}
                width={4}
                height={barH}
                fill="#CBD5E1"
                opacity={0.6}
              />
            );
          })}
          {/* Range area */}
          <path d={areaPath} fill="#C4B5FD" opacity={0.3} />
          {/* Median line */}
          <path d={medianPath} stroke="#7C3AED" strokeWidth={0.6} fill="none" />
          {/* Dots */}
          {visible.map((p, i) => (
            <circle key={`d_${i}`} cx={chartPad + i * xStep} cy={scaleY(p.median)} r={0.8} fill="#7C3AED" />
          ))}
        </svg>
        <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
          {visible
            .filter((_, i) => i % Math.ceil(visible.length / 6) === 0)
            .map(p => (
              <span key={p.period}>{p.period}</span>
            ))}
          <span>{visible[visible.length - 1]?.period}</span>
        </div>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Segments table                                                      */
/* ------------------------------------------------------------------ */

const SegmentsTable: React.FC = () => (
  <Card title="Segments" action={<button className="text-[10.5px] text-propsight-600 hover:underline">Voir tous →</button>}>
    <table className="w-full">
      <thead>
        <tr className="text-[10px] text-slate-400 uppercase tracking-wide">
          <th className="text-left pb-1 font-medium">Segment</th>
          <th className="text-right pb-1 font-medium">Prix médian €/m²</th>
          <th className="text-right pb-1 font-medium">Volume</th>
          <th className="text-right pb-1 font-medium">Évol. 12m</th>
        </tr>
      </thead>
      <tbody>
        {MARCHE_VENTE_SEGMENTS.map(s => (
          <tr key={s.segment_id} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
            <td className="py-1.5 text-[11.5px] text-slate-800 font-medium">{s.label}</td>
            <td className="py-1.5 text-[11.5px] text-right text-slate-700">{s.median_value.toLocaleString('fr-FR')}</td>
            <td className="py-1.5 text-[11.5px] text-right text-slate-500">{s.volume}</td>
            <td className="py-1.5 text-[11.5px] text-right">
              <span className={s.evolution_12m_pct && s.evolution_12m_pct > 0 ? 'text-emerald-600 font-medium' : 'text-rose-600 font-medium'}>
                {s.evolution_12m_pct !== undefined && formatPct(s.evolution_12m_pct)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Distribution                                                        */
/* ------------------------------------------------------------------ */

const DistributionBlock: React.FC = () => {
  const max = Math.max(...MARCHE_VENTE_DISTRIBUTION.map(b => b.count));
  const medianBin = 4;
  const p25Bin = 2;
  const p75Bin = 5;
  return (
    <Card title="Distribution des prix (€/m²)">
      <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-propsight-200 inline-block" />P25 : 10 120 €
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-propsight-500 inline-block" />Médiane : 11 420 €
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-propsight-300 inline-block" />P75 : 12 850 €
        </span>
      </div>
      <div className="flex items-end gap-0.5 h-[54px]">
        {MARCHE_VENTE_DISTRIBUTION.map((b, i) => {
          const height = (b.count / max) * 100;
          const color =
            i === medianBin
              ? 'bg-propsight-500'
              : i === p25Bin || i === p75Bin
              ? 'bg-propsight-300'
              : 'bg-propsight-200';
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className={`${color} rounded-sm w-full`} style={{ height: `${height}%` }} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
        <span>6k</span>
        <span>8k</span>
        <span>10k</span>
        <span>12k</span>
        <span>14k</span>
        <span>16k</span>
        <span>18k</span>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Comparables                                                         */
/* ------------------------------------------------------------------ */

const ComparablesBlock: React.FC = () => {
  const [tab, setTab] = useState<'vendus' | 'en_vente' | 'invendus'>('vendus');
  const list =
    tab === 'vendus'
      ? MARCHE_VENTE_COMPARABLES_VENDUS
      : tab === 'en_vente'
      ? MARCHE_VENTE_COMPARABLES_EN_VENTE
      : MARCHE_VENTE_COMPARABLES_INVENDUS;
  return (
    <Card
      title="Comparables"
      action={
        <div className="flex items-center gap-0.5 bg-slate-100 rounded p-0.5">
          {(
            [
              ['vendus', 'Vendus'],
              ['en_vente', 'En vente'],
              ['invendus', 'Invendus'],
            ] as [typeof tab, string][]
          ).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`h-5 px-2 text-[10.5px] rounded font-medium transition-colors ${
                tab === k ? 'bg-white text-propsight-700 shadow-sm' : 'text-slate-500'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      }
    >
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-slate-400 uppercase tracking-wide">
            <th className="text-left pb-1 font-medium">Adresse approximative</th>
            <th className="text-right pb-1 font-medium">Dist.</th>
            <th className="text-right pb-1 font-medium">Surf.</th>
            <th className="text-right pb-1 font-medium">Pièces</th>
            <th className="text-right pb-1 font-medium">Prix</th>
            <th className="text-right pb-1 font-medium">€/m²</th>
            <th className="text-right pb-1 font-medium">Date</th>
          </tr>
        </thead>
        <tbody>
          {list.map(c => (
            <tr key={c.comparable_id} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
              <td className="py-1.5 text-[11.5px] text-slate-800">{c.address_label}</td>
              <td className="py-1.5 text-[11px] text-right text-slate-500">{c.distance_m} m</td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{c.surface_m2} m²</td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{c.rooms}</td>
              <td className="py-1.5 text-[11.5px] text-right text-slate-800 font-medium">
                {c.price?.toLocaleString('fr-FR')} €
              </td>
              <td className="py-1.5 text-[11.5px] text-right text-slate-700">
                {c.value_per_m2.toLocaleString('fr-FR')}
              </td>
              <td className="py-1.5 text-[11px] text-right text-slate-500">{c.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="text-[10.5px] text-propsight-600 hover:underline mt-1">
        Voir tous les biens vendus ({MARCHE_VENTE_COMPARABLES_VENDUS.length * 120}) →
      </button>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Neighbor zones                                                      */
/* ------------------------------------------------------------------ */

const NeighborZonesBlock: React.FC = () => (
  <Card
    title="Zones voisines"
    action={<button className="text-[10.5px] text-propsight-600 hover:underline">Ouvrir comparatif →</button>}
  >
    <table className="w-full">
      <thead>
        <tr className="text-[10px] text-slate-400 uppercase tracking-wide">
          <th className="text-left pb-1 font-medium">Zone</th>
          <th className="text-right pb-1 font-medium">Prix médian</th>
          <th className="text-right pb-1 font-medium">Évol. 12m</th>
          <th className="text-right pb-1 font-medium">Volume</th>
        </tr>
      </thead>
      <tbody>
        {MARCHE_NEIGHBORS.map(n => (
          <tr key={n.zone_id} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
            <td className="py-1.5 text-[11.5px] text-slate-800">
              {n.label} <span className="text-slate-400 font-normal">({n.code_postal})</span>
            </td>
            <td className="py-1.5 text-[11.5px] text-right text-slate-700">{n.median_value.toLocaleString('fr-FR')} €</td>
            <td className="py-1.5 text-[11.5px] text-right text-emerald-600 font-medium">
              {formatPct(n.evolution_12m_pct)}
            </td>
            <td className="py-1.5 text-[11.5px] text-right text-slate-500">{n.volume}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Zone summary banner                                                 */
/* ------------------------------------------------------------------ */

const ZoneSummary: React.FC = () => (
  <Card>
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[12.5px] font-semibold text-slate-900">{DEFAULT_ZONE.label}</h2>
          <span className="text-[10.5px] text-slate-500">
            Arrondissement · {DEFAULT_ZONE.parent_label} · 624 ventes DVF · 1 248 annonces · 12 mois
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
        {MARCHE_VENTE_TAGS.map(t => (
          <Chip key={t} color="violet">
            {t}
          </Chip>
        ))}
      </div>
    </div>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

const MarchePage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('vente');
  const [zone, setZone] = useState('paris-3e');
  const [type, setType] = useState('appartement');
  const [segment, setSegment] = useState('all');
  const [surface, setSurface] = useState('all');
  const [period, setPeriod] = useState('12m');
  const [source, setSource] = useState('mixed');

  const kpis: KpiItem[] = useMemo(() => {
    const base =
      mode === 'vente'
        ? MARCHE_VENTE_KPIS
        : mode === 'location'
        ? MARCHE_LOCATION_KPIS
        : MARCHE_RENDEMENT_KPIS;
    const icons: Record<string, { icon: React.ReactNode; accent: KpiItem['accent'] }> = {
      prix_median: { icon: <Building2 size={13} />, accent: 'violet' },
      loyer_median: { icon: <Building2 size={13} />, accent: 'violet' },
      rendement_brut: { icon: <Target size={13} />, accent: 'violet' },
      evolution_12m: { icon: <TrendingUp size={13} />, accent: 'emerald' },
      volume_dvf: { icon: <Rows3 size={13} />, accent: 'amber' },
      volume_annonces: { icon: <Rows3 size={13} />, accent: 'amber' },
      confiance: { icon: <ShieldCheck size={13} />, accent: 'violet' },
    };
    return base.map(k => ({ ...k, ...icons[k.id] }));
  }, [mode]);

  return (
    <>
      <PageHeader
        title="Marché"
        zoneLabel={DEFAULT_ZONE.label}
        zoneCode={DEFAULT_ZONE.code_postal ?? ''}
        subtitle="Analysez les prix, loyers, rendements et dynamiques de transaction par zone."
        actions={
          <>
            <PrimaryButton>
              <Copy size={11} />
              Comparer une zone
            </PrimaryButton>
            <CreerAlerteButton />
            <ExportButton />
          </>
        }
      />

      <FilterBar>
        <FilterChip label="Zone" value={zone} options={ZONE_OPTIONS} onChange={setZone} />
        <FilterChip label="Mode" value={mode} options={MODE_OPTIONS} onChange={v => setMode(v as Mode)} />
        <FilterChip label="Type" value={type} options={TYPE_OPTIONS} onChange={setType} />
        <FilterChip label="Segment" value={segment} options={SEGMENT_OPTIONS} onChange={setSegment} />
        <FilterChip label="Surface" value={surface} options={SURFACE_OPTIONS} onChange={setSurface} />
        <FilterChip label="Période" value={period} options={PERIOD_OPTIONS} onChange={setPeriod} />
        <FilterChip label="Source" value={source} options={SOURCE_OPTIONS} onChange={setSource} />
      </FilterBar>

      <KpiStrip kpis={kpis} />

      <div className="flex-1 grid grid-cols-[1fr_400px] gap-2 p-2 overflow-hidden min-h-0">
        {/* Left panel — scrollable */}
        <div className="min-h-0 min-w-0 overflow-y-auto pr-1 space-y-2">
          <ZoneSummary />
          <div className="grid grid-cols-2 gap-2">
            <InsightStrip items={MARCHE_VENTE_INSIGHTS} />
            <RangeBlock />
          </div>
          <EvolutionChart />
          <div className="grid grid-cols-2 gap-2">
            <SegmentsTable />
            <DistributionBlock />
          </div>
          <ComparablesBlock />
          <NeighborZonesBlock />
          <SourceConfidence
            level={MARCHE_VENTE_CONFIDENCE.level}
            reasons={MARCHE_VENTE_CONFIDENCE.reasons}
            items={[
              { label: 'Source prix', value: 'DVF' },
              { label: 'Source annonces', value: 'Agrégateur annonces' },
              { label: 'Période', value: '12 mois' },
              { label: 'Dernière MAJ', value: 'avril 2026' },
              { label: 'Granularité', value: 'Arrondissement' },
              { label: 'Volume', value: '624 ventes' },
            ]}
          />
        </div>

        {/* Right panel — map fixed */}
        <div className="min-h-0 min-w-0 flex flex-col">
          <ObservatoireMap
            title="Carte marché"
            layerLabel="Prix au m² DVF"
            layerOptions={['Prix au m² DVF', 'Volume DVF', 'Évolution 12 mois', 'Écart annonces / DVF']}
            showGradient
            dotDensity="medium"
            dotColor="#7C3AED"
            legend={[
              { color: '#7C3AED', label: 'Biens vendus', shape: 'dot' },
              { color: '#F59E0B', label: 'Annonces actives', shape: 'dot' },
              { color: '#94A3B8', label: 'Biens suivis', shape: 'dot' },
              { color: '#16A34A', label: 'Zones suivies', shape: 'square' },
            ]}
            extraLegend={
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded border border-slate-200 text-[10px]">
                <span className="text-slate-400">Échelle €/m²</span>
                <div className="h-2 w-24 rounded-sm bg-gradient-to-r from-propsight-200 via-propsight-400 to-propsight-700" />
                <span className="text-slate-500">6k</span>
                <span className="text-slate-500">18k</span>
              </div>
            }
          />
        </div>
      </div>

      <ActionsFooter
        actions={[
          { label: 'Ouvrir biens vendus DVF', icon: <Eye size={10} /> },
          { label: 'Voir annonces actives', icon: <Eye size={10} /> },
          { label: 'Ouvrir opportunités', icon: <Target size={10} /> },
          { label: 'Ouvrir Radar', icon: <Eye size={10} /> },
          { label: 'Créer alerte prix', icon: <Bell size={10} /> },
        ]}
      />
    </>
  );
};

export default MarchePage;
