import React, { useMemo, useState } from 'react';
import {
  Building2,
  Clock,
  RotateCcw,
  Home,
  Bell,
  Eye,
  Target,
  Lightbulb,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  PageHeader,
  KpiStrip,
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
  KpiItem,
} from '../components/primitives';
import ObservatoireMap from '../components/ObservatoireMap';
import {
  DEFAULT_ZONE,
  TENSION_VENTE_KPIS,
  TENSION_LOCATION_KPIS,
  TENSION_VENTE_SCORE,
  TENSION_LOCATION_SCORE,
  TENSION_DELAYS_VENTE,
  TENSION_DELAYS_LOCATION,
  TENSION_STOCK_VENTE,
  TENSION_STOCK_LOCATION,
  TENSION_REVISIONS_VENTE,
  TENSION_REVISIONS_LOCATION,
  TENSION_ANNONCES_ANCIENNES,
  TENSION_SEGMENTS_VENTE,
  TENSION_SEGMENTS_LOCATION,
  TENSION_SIGNALS_VENTE,
  TENSION_VENTE_INSIGHTS,
  TENSION_LOCATION_INSIGHTS,
  TENSION_VENTE_TAGS,
  TENSION_VENTE_CONFIDENCE,
} from '../_mocks/observatoire';

type Mode = 'vente' | 'location';

const MODE_OPTIONS = [
  { value: 'vente', label: 'Vente' },
  { value: 'location', label: 'Location' },
];

const ZONE_OPTIONS = [
  { value: 'paris-3e', label: 'Paris 3e (75003)' },
  { value: 'paris-4e', label: 'Paris 4e (75004)' },
  { value: 'paris-11e', label: 'Paris 11e (75011)' },
  { value: 'paris-10e', label: 'Paris 10e (75010)' },
];

const TYPE_OPTIONS = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'all', label: 'Tous' },
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
  { value: '75+', label: '75 m²+' },
];

const PERIOD_OPTIONS = [
  { value: '30d', label: '30 jours' },
  { value: '90d', label: '90 jours' },
  { value: '6m', label: '6 mois' },
  { value: '12m', label: '12 mois' },
];

const SOURCE_OPTIONS = [
  { value: 'annonces', label: 'Annonces + DVF' },
  { value: 'dvf', label: 'DVF' },
  { value: 'only_annonces', label: 'Annonces' },
];

/* ------------------------------------------------------------------ */
/* Zone summary                                                        */
/* ------------------------------------------------------------------ */

const ZoneSummary: React.FC<{ mode: Mode }> = ({ mode }) => (
  <Card>
    <div className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[12.5px] font-semibold text-slate-900">{DEFAULT_ZONE.label}</h2>
          <span className="text-[10.5px] text-slate-500">
            Arrondissement · {DEFAULT_ZONE.parent_label} ·{' '}
            {mode === 'vente'
              ? 'Stock 318 · 1 842 annonces · 90 j'
              : 'Stock 654 · 1 842 annonces · 3 216 leads · 12 mois'}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0 flex-wrap justify-end">
        {TENSION_VENTE_TAGS.map(t => (
          <Chip key={t} color={t === 'Vacance faible' ? 'sky' : 'violet'}>
            {t}
          </Chip>
        ))}
      </div>
    </div>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Tensiomètre                                                         */
/* ------------------------------------------------------------------ */

const LABELS: { key: string; label: string; color: string }[] = [
  { key: 'tres_ralenti', label: 'Très ralenti', color: '#E2E8F0' },
  { key: 'ralenti', label: 'Ralenti', color: '#CBD5E1' },
  { key: 'equilibre', label: 'Équilibré', color: '#A78BFA' },
  { key: 'dynamique', label: 'Dynamique', color: '#7C3AED' },
  { key: 'tres_dynamique', label: 'Très dynamique', color: '#5B21B6' },
];

const Tensiometre: React.FC<{ mode: Mode }> = ({ mode }) => {
  const score = mode === 'vente' ? TENSION_VENTE_SCORE : TENSION_LOCATION_SCORE;
  const valuePct = mode === 'location' ? (score.value / 100) * 100 : score.value;
  return (
    <Card title={mode === 'vente' ? 'Niveau de tension marché' : 'Niveau de tension locative'}>
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex h-5 rounded overflow-hidden">
            {LABELS.map(l => (
              <div
                key={l.key}
                className="flex-1 border-r border-white/40 last:border-r-0"
                style={{ backgroundColor: l.color }}
              />
            ))}
          </div>
          <div className="relative h-3 mt-1">
            <div
              className="absolute h-3 w-3 -translate-x-1/2 rounded-full bg-white border-2 border-propsight-600 shadow-sm"
              style={{ left: `${valuePct}%`, top: 0 }}
            />
          </div>
          <div className="flex justify-between mt-1 text-[9.5px] text-slate-400">
            {LABELS.map(l => (
              <span key={l.key}>{l.label}</span>
            ))}
          </div>
        </div>
        <div className="text-right flex-shrink-0 min-w-[80px]">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide">Score</div>
          <div className="text-[22px] font-bold text-propsight-700 leading-none">
            {mode === 'location' ? (score.value / 10).toFixed(1) : score.value}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {mode === 'location' ? '/ 10' : '/ 100'}
          </div>
        </div>
      </div>
      <p className="text-[11px] text-slate-600 mt-2 leading-snug">{score.explanation}</p>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* À retenir (simple card here, richer layout)                         */
/* ------------------------------------------------------------------ */

const ARetenir: React.FC<{ mode: Mode }> = ({ mode }) => {
  const items = mode === 'vente' ? TENSION_VENTE_INSIGHTS : TENSION_LOCATION_INSIGHTS;
  return (
    <Card>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="inline-flex items-center justify-center h-4 w-4 rounded-full bg-amber-100 text-amber-600">
          <Lightbulb size={10} />
        </span>
        <h3 className="text-[12px] font-semibold text-slate-900">À retenir</h3>
      </div>
      <ul className="space-y-1">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-1.5 text-[11.5px] text-slate-700 leading-snug">
            <ArrowRight size={11} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Évolution 12m (simple sparkline with bars)                          */
/* ------------------------------------------------------------------ */

const EvolutionTension: React.FC = () => {
  const points = Array.from({ length: 13 }).map((_, i) => ({
    label: ['mai 24', 'juil. 24', 'sept. 24', 'nov. 24', 'janv. 25', 'mars 25', 'mai 25'][i % 7],
    indice: 5 + ((i * 0.5) % 4),
    stock: 20 + (i % 5) * 4,
  }));

  const w = 100;
  const h = 50;
  const xStep = w / (points.length - 1);
  const min = 4;
  const max = 10;
  const pad = 2;
  const scaleY = (v: number) => h - pad - ((v - min) / (max - min)) * (h - 2 * pad - 10);

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * xStep} ${scaleY(p.indice)}`).join(' ');

  return (
    <Card title="Évolution de la tension (12 mois)">
      <div className="flex items-center gap-3 mb-1 text-[10px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-0.5 w-3 bg-propsight-600 inline-block" />
          Indice de tension
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-propsight-200 inline-block" />
          Stock disponible
        </span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
        {/* Bars */}
        {points.map((p, i) => {
          const barH = (p.stock / 40) * 12;
          return (
            <rect
              key={i}
              x={i * xStep - 1.2}
              y={h - pad - barH}
              width={2.4}
              height={barH}
              fill="#C4B5FD"
              opacity={0.6}
            />
          );
        })}
        <path d={line} stroke="#7C3AED" strokeWidth={0.6} fill="none" />
        {points.map((p, i) => (
          <circle key={i} cx={i * xStep} cy={scaleY(p.indice)} r={0.8} fill="#7C3AED" />
        ))}
      </svg>
      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
        {['mai 24', 'juil. 24', 'sept. 24', 'nov. 24', 'janv. 25', 'mars 25', 'mai 25'].map(p => (
          <span key={p}>{p}</span>
        ))}
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Segments table                                                      */
/* ------------------------------------------------------------------ */

const SegmentsTension: React.FC<{ mode: Mode }> = ({ mode }) => {
  const rows = mode === 'vente' ? TENSION_SEGMENTS_VENTE : TENSION_SEGMENTS_LOCATION;
  const scoreColor = (v: number) =>
    v >= 80 ? 'text-emerald-700 bg-emerald-50' : v >= 60 ? 'text-propsight-700 bg-propsight-50' : v >= 45 ? 'text-amber-700 bg-amber-50' : 'text-rose-700 bg-rose-50';
  return (
    <Card title="Segments">
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-slate-400 uppercase tracking-wide">
            <th className="text-left pb-1 font-medium">Segment</th>
            <th className="text-right pb-1 font-medium">Stock</th>
            <th className="text-right pb-1 font-medium">Délai</th>
            <th className="text-right pb-1 font-medium">Tension</th>
            <th className="text-right pb-1 font-medium">Évol.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(s => (
            <tr key={s.segment_id} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
              <td className="py-1.5 text-[11.5px] text-slate-800 font-medium">{s.label}</td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{s.stock}</td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{s.delay_median} j</td>
              <td className="py-1.5 text-[11px] text-right">
                <span className={`inline-flex items-center justify-center h-5 px-1.5 rounded text-[10.5px] font-semibold ${scoreColor(s.score)}`}>
                  {(s.score / 10).toFixed(1)}
                </span>
              </td>
              <td className="py-1.5 text-[11px] text-right text-emerald-600 font-medium">
                ↑ +{s.revision_pct}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Distribution délais                                                 */
/* ------------------------------------------------------------------ */

const DelaysDistribution: React.FC<{ mode: Mode }> = ({ mode }) => {
  const stats = mode === 'vente' ? TENSION_DELAYS_VENTE : TENSION_DELAYS_LOCATION;
  const max = Math.max(...stats.distribution.map(b => b.share_pct));
  return (
    <Card title="Distribution des délais (jours)">
      <div className="flex items-end gap-1 h-[44px]">
        {stats.distribution.map((b, i) => {
          const height = (b.share_pct / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="text-[9px] text-slate-500 font-medium mb-0.5">{b.share_pct} %</div>
              <div className="bg-propsight-400 rounded-sm w-full" style={{ height: `${height}%` }} />
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-[9px] text-slate-400 mt-1">
        {stats.distribution.map(b => (
          <span key={b.bucket}>{b.bucket}</span>
        ))}
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Annonces anciennes / signaux                                        */
/* ------------------------------------------------------------------ */

const AnnoncesBlock: React.FC = () => {
  const [tab, setTab] = useState<'actives' | 'louees' | 'baisse'>('actives');
  return (
    <Card
      title="Annonces & signaux récents"
      action={
        <div className="flex items-center gap-0.5 bg-slate-100 rounded p-0.5">
          {(
            [
              ['actives', 'Actives'],
              ['louees', 'Louées'],
              ['baisse', 'En baisse'],
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
            <th className="text-left pb-1 font-medium">Adresse</th>
            <th className="text-right pb-1 font-medium">Dist.</th>
            <th className="text-right pb-1 font-medium">Prix</th>
            <th className="text-right pb-1 font-medium">Surf.</th>
            <th className="text-right pb-1 font-medium">Délai</th>
            <th className="text-right pb-1 font-medium">Statut</th>
          </tr>
        </thead>
        <tbody>
          {TENSION_ANNONCES_ANCIENNES.map(a => (
            <tr key={a.id} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
              <td className="py-1.5 text-[11.5px] text-slate-800">{a.label}</td>
              <td className="py-1.5 text-[11px] text-right text-slate-500">
                {((Math.abs(a.age_days) * 3) % 600) + 200} m
              </td>
              <td className="py-1.5 text-[11.5px] text-right text-slate-800 font-medium">
                {a.price?.toLocaleString('fr-FR')} €
              </td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{a.surface} m²</td>
              <td className="py-1.5 text-[11px] text-right text-slate-600">{a.age_days} j</td>
              <td className="py-1.5 text-[11px] text-right">
                <span className="inline-flex items-center gap-1 text-emerald-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Active
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Revisions block                                                     */
/* ------------------------------------------------------------------ */

const RevisionsBlock: React.FC<{ mode: Mode }> = ({ mode }) => {
  const stats = mode === 'vente' ? TENSION_REVISIONS_VENTE : TENSION_REVISIONS_LOCATION;
  return (
    <Card title={mode === 'vente' ? 'Baisses de prix' : 'Révisions de loyers'}>
      <div className="grid grid-cols-3 gap-2 mb-2">
        <div>
          <div className="text-[10px] text-slate-400">Taux de révision</div>
          <div className="text-[15px] font-semibold text-slate-900">{stats.revision_rate_pct} %</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Révision médiane</div>
          <div className="text-[15px] font-semibold text-rose-600">{stats.median_revision_pct.toFixed(1)} %</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Délai moyen</div>
          <div className="text-[15px] font-semibold text-slate-900">{stats.median_days_before_revision} j</div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-[10px] text-slate-400 uppercase tracking-wide">
            <th className="text-left pb-1 font-medium">Segment</th>
            <th className="text-right pb-1 font-medium">Part</th>
            <th className="text-right pb-1 font-medium">Médian</th>
          </tr>
        </thead>
        <tbody>
          {stats.by_segment.map(s => (
            <tr key={s.segment_id} className="border-t border-slate-100">
              <td className="py-1 text-[11.5px] text-slate-800">{s.label}</td>
              <td className="py-1 text-[11.5px] text-right text-slate-700">{s.revision_rate_pct} %</td>
              <td className="py-1 text-[11.5px] text-right text-rose-600 font-medium">
                {s.median_revision_pct.toFixed(1)} %
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const TensionPage: React.FC = () => {
  const [mode, setMode] = useState<Mode>('location');
  const [zone, setZone] = useState('paris-3e');
  const [type, setType] = useState('appartement');
  const [segment, setSegment] = useState('all');
  const [surface, setSurface] = useState('all');
  const [period, setPeriod] = useState('12m');
  const [source, setSource] = useState('annonces');

  const kpis: KpiItem[] = useMemo(() => {
    const base = mode === 'vente' ? TENSION_VENTE_KPIS : TENSION_LOCATION_KPIS;
    const icons: Record<string, { icon: React.ReactNode; accent: KpiItem['accent'] }> = {
      score: { icon: <Building2 size={13} />, accent: 'violet' },
      delai: { icon: <Clock size={13} />, accent: 'amber' },
      stock: { icon: <Home size={13} />, accent: 'violet' },
      rotation: { icon: <RotateCcw size={13} />, accent: 'emerald' },
      baisses: { icon: <AlertTriangle size={13} />, accent: 'rose' },
      vacance: { icon: <Home size={13} />, accent: 'emerald' },
    };
    return base.map(k => ({ ...k, ...icons[k.id] }));
  }, [mode]);

  return (
    <>
      <PageHeader
        title="Tension"
        zoneLabel={DEFAULT_ZONE.label}
        zoneCode={DEFAULT_ZONE.code_postal ?? ''}
        subtitle="Analyse du stock, de la demande, des délais de location et de la liquidité par zone. Ces données alimentent vos rapports et modules du produit."
        actions={
          <>
            <SecondaryButton>
              Comparer une zone
            </SecondaryButton>
            <PrimaryButton>
              <Bell size={11} />
              Créer une alerte
            </PrimaryButton>
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
        <div className="min-h-0 min-w-0 overflow-y-auto pr-1 space-y-2">
          <ZoneSummary mode={mode} />
          <div className="grid grid-cols-2 gap-2">
            <ARetenir mode={mode} />
            <Tensiometre mode={mode} />
          </div>
          <EvolutionTension />
          <div className="grid grid-cols-2 gap-2">
            <SegmentsTension mode={mode} />
            <DelaysDistribution mode={mode} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <AnnoncesBlock />
            <RevisionsBlock mode={mode} />
          </div>
          <SourceConfidence
            level={TENSION_VENTE_CONFIDENCE.level}
            reasons={TENSION_VENTE_CONFIDENCE.reasons}
            items={[
              { label: 'Source principale', value: 'Annonces + DVF' },
              { label: 'Période', value: '12 mois (mai 24 – mai 25)' },
              { label: 'Dernière MAJ', value: '01/05/2025' },
              { label: 'Granularité', value: 'IRIS' },
              { label: 'Volume', value: '1 842 annonces' },
              { label: 'Dispersion', value: 'Moyenne' },
            ]}
          />
        </div>

        <div className="min-h-0 min-w-0 flex flex-col">
          <ObservatoireMap
            title="Carte tension"
            layerLabel="Indice de tension"
            layerOptions={['Indice de tension', 'Délai médian', 'Stock actif', 'Loyers révisés']}
            showGradient
            dotDensity="high"
            dotColor="#7C3AED"
            legend={[
              { color: '#7C3AED', label: 'Annonces actives', shape: 'dot' },
              { color: '#F59E0B', label: 'Biens loués', shape: 'dot' },
              { color: '#94A3B8', label: 'Biens suivis', shape: 'dot' },
              { color: '#16A34A', label: 'Zones suivies', shape: 'square' },
            ]}
          />
        </div>
      </div>

      <ActionsFooter
        actions={[
          { label: 'Ouvrir opportunités', icon: <Target size={10} /> },
          { label: 'Voir annonces actives', icon: <Eye size={10} /> },
          { label: 'Créer alerte tension', icon: <Bell size={10} /> },
          { label: 'Ouvrir observatoire marché', icon: <Building2 size={10} /> },
        ]}
      />
    </>
  );
};

export default TensionPage;
