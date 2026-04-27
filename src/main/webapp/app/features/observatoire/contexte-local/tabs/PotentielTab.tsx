import React from 'react';
import { Check, AlertTriangle, ExternalLink, Zap, X, Clock3 } from 'lucide-react';
import { Card, Chip } from '../../components/primitives';
import { CONTEXTE_POTENTIEL } from '../../_mocks/observatoire';

/* ------------------------------------------------------------------ */
/* Score donut                                                         */
/* ------------------------------------------------------------------ */

const ScoreDonut: React.FC<{ score: number; max?: number }> = ({ score, max = 100 }) => {
  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / max);
  return (
    <svg width={68} height={68} viewBox="0 0 68 68">
      <circle cx={34} cy={34} r={r} stroke="#F1F5F9" strokeWidth={6} fill="none" />
      <circle
        cx={34}
        cy={34}
        r={r}
        stroke="#16A34A"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform="rotate(-90 34 34)"
      />
      <text x={34} y={36} textAnchor="middle" className="fill-slate-900" fontSize={15} fontWeight={700}>
        {score}
      </text>
      <text x={34} y={46} textAnchor="middle" className="fill-slate-400" fontSize={7}>
        /{max}
      </text>
    </svg>
  );
};

const SynthesisBlock: React.FC = () => (
  <Card title="Synthèse du potentiel" sources="OSM / PLU / SITADEL / ADEME">
    <div className="grid grid-cols-[auto_1fr] gap-2.5">
      <div className="flex flex-col items-center">
        <ScoreDonut score={CONTEXTE_POTENTIEL.score} />
        <div className="mt-1 inline-flex items-center gap-1 h-4 px-1.5 rounded bg-emerald-50 text-emerald-700 text-[9.5px] font-medium border border-emerald-100">
          {CONTEXTE_POTENTIEL.verdict_label}
        </div>
      </div>
      <div className="min-w-0">
        <div className="text-[10.5px] font-semibold text-slate-800 mb-0.5">À retenir</div>
        <ul className="space-y-0 mb-1.5">
          {CONTEXTE_POTENTIEL.strengths.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-700 leading-snug">
              <Check size={10} className="text-emerald-600 mt-0.5 flex-shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="text-[10.5px] font-semibold text-slate-800 mb-0.5">Points de vigilance</div>
        <ul className="space-y-0 mb-1.5">
          {CONTEXTE_POTENTIEL.warnings.map((s, i) => (
            <li key={i} className="flex items-start gap-1.5 text-[10.5px] text-slate-700 leading-snug">
              <AlertTriangle size={10} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-200 text-[10px] text-slate-700">
          <Clock3 size={10} className="text-slate-500" />
          <span>Horizon :</span>
          <span className="font-semibold text-slate-900">{CONTEXTE_POTENTIEL.horizon}</span>
        </div>
      </div>
    </div>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Cadastre                                                            */
/* ------------------------------------------------------------------ */

const CadastreBlock: React.FC = () => {
  const c = CONTEXTE_POTENTIEL.cadastre;
  return (
    <Card title="Cadastre & parcelle" sources="Géoportail">
      <div className="grid grid-cols-[68px_1fr] gap-2 items-start">
        <div className="h-16 w-16 rounded border border-slate-200 bg-slate-50 relative overflow-hidden flex-shrink-0">
          <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full">
            <rect width="80" height="80" fill="#F8FAFC" />
            <path d="M 5 5 L 75 10 L 70 70 L 8 65 Z" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
            <path d="M 20 20 L 60 22 L 58 58 L 22 56 Z" fill="#A78BFA" opacity="0.35" stroke="#7C3AED" strokeWidth="0.8" />
          </svg>
        </div>
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-0 text-[10.5px]">
          <div className="text-slate-500">Réf. cadastrale</div>
          <div className="text-slate-800 font-medium text-right text-[10px]">{c.reference}</div>
          <div className="text-slate-500">Parcelle</div>
          <div className="text-slate-800 font-medium text-right">{c.surface_parcelle} m²</div>
          <div className="text-slate-500">Bâtie</div>
          <div className="text-slate-800 font-medium text-right">{c.surface_batie} m²</div>
          <div className="text-slate-500">Libre</div>
          <div className="text-slate-800 font-medium text-right">{c.surface_libre} m²</div>
          <div className="text-slate-500">Emprise</div>
          <div className="text-slate-800 font-medium text-right">{c.emprise_au_sol_pct} %</div>
          <div className="text-slate-500">Bâtiments</div>
          <div className="text-slate-800 font-medium text-right">{c.nb_batiments}</div>
        </div>
      </div>
      <button className="mt-1.5 w-full h-6 rounded border border-propsight-200 bg-propsight-50/60 text-[10px] text-propsight-700 font-medium hover:bg-propsight-100 inline-flex items-center justify-center gap-1 transition-colors">
        <ExternalLink size={10} />
        Voir sur Géoportail
      </button>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* PLU                                                                 */
/* ------------------------------------------------------------------ */

const PluBlock: React.FC = () => {
  const p = CONTEXTE_POTENTIEL;
  return (
    <Card title="PLU & zonage" sources="PLU / Géoportail urbanisme">
      <div className="grid grid-cols-2 gap-x-2 gap-y-0 text-[10.5px]">
        <div className="text-slate-500">Zone PLU</div>
        <div className="text-right">
          <Chip color="violet">{p.plu_zone}</Chip>
        </div>
        <div className="text-slate-500">Destination</div>
        <div className="text-slate-800 font-medium text-right">{p.plu_destination}</div>
        <div className="text-slate-500">Hauteur max.</div>
        <div className="text-slate-800 font-medium text-right">{p.plu_height_max}</div>
        <div className="text-slate-500">Emprise max.</div>
        <div className="text-slate-800 font-medium text-right">{p.plu_emprise_max}</div>
        <div className="text-slate-500">Servitudes</div>
        <div className="text-slate-800 font-medium text-right">{p.plu_servitudes}</div>
        <div className="text-slate-500">ABF</div>
        <div className="text-slate-800 font-medium text-right">{p.plu_abf}</div>
      </div>
      <button className="mt-1.5 w-full h-6 rounded border border-propsight-200 bg-propsight-50/60 text-[10px] text-propsight-700 font-medium hover:bg-propsight-100 inline-flex items-center justify-center gap-1 transition-colors">
        <ExternalLink size={10} />
        Consulter le PLU
      </button>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Permits                                                             */
/* ------------------------------------------------------------------ */

const PermitsBlock: React.FC = () => {
  const badgeColor = (t: string) =>
    t === 'PC' ? 'bg-propsight-100 text-propsight-700' : t === 'DP' ? 'bg-amber-100 text-amber-700' : t === 'PD' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700';
  const statusColor = (s: string) =>
    s === 'Autorisé' ? 'text-emerald-600' : s === 'Déposé' ? 'text-amber-600' : 'text-slate-600';
  return (
    <Card title="Autorisations d'urbanisme (500 m)" sources="SITADEL">
      <table className="w-full">
        <thead>
          <tr className="text-[9.5px] text-slate-400 uppercase tracking-wide">
            <th className="text-left pb-0.5 font-medium">Type</th>
            <th className="text-left pb-0.5 font-medium">Statut</th>
            <th className="text-left pb-0.5 font-medium">Date</th>
            <th className="text-left pb-0.5 font-medium">Projet</th>
            <th className="text-right pb-0.5 font-medium">Lgts</th>
            <th className="text-right pb-0.5 font-medium">Dist.</th>
          </tr>
        </thead>
        <tbody>
          {CONTEXTE_POTENTIEL.permits.map((p, i) => (
            <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/60 cursor-pointer">
              <td className="py-0.5">
                <span className={`inline-flex items-center justify-center h-4 w-6 rounded text-[9px] font-semibold ${badgeColor(p.type)}`}>
                  {p.type}
                </span>
              </td>
              <td className={`py-0.5 text-[10.5px] font-medium ${statusColor(p.statut)}`}>{p.statut}</td>
              <td className="py-0.5 text-[10.5px] text-slate-600">{p.date}</td>
              <td className="py-0.5 text-[10.5px] text-slate-800 truncate max-w-[140px]">{p.projet}</td>
              <td className="py-0.5 text-[10.5px] text-right text-slate-600">{p.logements ?? '—'}</td>
              <td className="py-0.5 text-[10.5px] text-right text-slate-500">{p.distance_m}m</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* DPE / rénovation                                                    */
/* ------------------------------------------------------------------ */

const DpeBlock: React.FC = () => {
  const d = CONTEXTE_POTENTIEL.dpe_distribution;
  const total = d.reduce((a, b) => a + b.share_pct, 0);
  let cumulative = 0;
  const r = 26;
  const center = 32;
  const arcs = d.map(bin => {
    const startAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    cumulative += bin.share_pct;
    const endAngle = (cumulative / total) * 2 * Math.PI - Math.PI / 2;
    const largeArc = bin.share_pct / total > 0.5 ? 1 : 0;
    const x1 = center + r * Math.cos(startAngle);
    const y1 = center + r * Math.sin(startAngle);
    const x2 = center + r * Math.cos(endAngle);
    const y2 = center + r * Math.sin(endAngle);
    return {
      path: `M ${center} ${center} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: bin.color,
      label: bin.grade,
      share: bin.share_pct,
    };
  });
  return (
    <Card title="Potentiel rénovation énergétique" sources="ADEME">
      <div className="grid grid-cols-[auto_1fr] gap-2.5 items-center">
        <svg width={64} height={64} viewBox="0 0 64 64">
          {arcs.map((a, i) => (
            <path key={i} d={a.path} fill={a.color} stroke="white" strokeWidth="0.8" />
          ))}
          <circle cx={center} cy={center} r={12} fill="white" />
        </svg>
        <div className="space-y-0">
          {arcs.map(a => (
            <div key={a.label} className="flex items-center gap-1.5 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-sm" style={{ backgroundColor: a.color }} />
              <span className="text-slate-700 flex-1">{a.label}</span>
              <span className="text-slate-900 font-semibold">{a.share} %</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-1.5 pt-1.5 border-t border-slate-100">
        <div className="text-[10.5px] font-semibold text-slate-800 mb-0.5">Opportunité rénovation</div>
        <p className="text-[10px] text-slate-600 leading-snug mb-1">
          Part importante de biens énergivores. Revalorisation possible après travaux.
        </p>
        <button className="text-[10px] text-propsight-600 hover:underline inline-flex items-center gap-1">
          <Zap size={9} />
          Voir les signaux DPE →
        </button>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Réglementations                                                     */
/* ------------------------------------------------------------------ */

const ReglementationsBlock: React.FC = () => {
  const statusDot = (level: string) =>
    level === 'ok' ? (
      <Check size={10} className="text-emerald-600" />
    ) : level === 'warning' ? (
      <AlertTriangle size={10} className="text-amber-600" />
    ) : (
      <X size={10} className="text-rose-600" />
    );
  return (
    <Card title="Réglementations locales" sources="Service-public.fr">
      <ul className="space-y-0.5">
        {CONTEXTE_POTENTIEL.reglementations.map(r => (
          <li key={r.label} className="flex items-center gap-1.5 text-[10.5px]">
            <span className="flex-1 text-slate-700">{r.label}</span>
            <span className="text-slate-800 font-medium">{r.status}</span>
            {statusDot(r.impact_level)}
          </li>
        ))}
      </ul>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/* Transformabilité                                                    */
/* ------------------------------------------------------------------ */

const LEVEL_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  simple: { label: 'Simple', color: 'text-emerald-600', icon: <Check size={10} /> },
  pertinente: { label: 'Pertinente', color: 'text-propsight-600', icon: <Check size={10} /> },
  a_verifier: { label: 'À vérifier', color: 'text-amber-600', icon: <AlertTriangle size={10} /> },
  contraint: { label: 'Contraint', color: 'text-rose-600', icon: <X size={10} /> },
  vigilance: { label: 'Vigilance', color: 'text-amber-600', icon: <AlertTriangle size={10} /> },
};

const TransformabiliteBlock: React.FC = () => (
  <Card title="Transformabilité" sources="PLU / Données Propsight">
    <div className="grid grid-cols-[1fr_auto] gap-2">
      <ul className="space-y-0.5">
        {CONTEXTE_POTENTIEL.transformabilite.map(t => {
          const m = LEVEL_META[t.level];
          return (
            <li key={t.label} className="flex items-center gap-1.5 text-[10.5px]">
              <span className="flex-1 text-slate-700">{t.label}</span>
              <span className={`inline-flex items-center gap-1 font-medium ${m.color}`}>
                {m.icon}
                {m.label}
              </span>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col items-center justify-center min-w-[90px] bg-slate-50 rounded px-1.5 py-1.5">
        <div className="text-[9px] text-slate-500 uppercase tracking-wide">Potentiel global</div>
        <div className="text-[14px] font-bold text-slate-900 mt-0.5">Moyen</div>
        <div className="mt-1 space-y-0 text-[9px] text-slate-600">
          <div className="flex items-center gap-1">
            <Check size={8} className="text-emerald-600" />
            Rénovation énergétique
          </div>
          <div className="flex items-center gap-1">
            <Check size={8} className="text-emerald-600" />
            Optimisation surfaces
          </div>
          <div className="flex items-center gap-1">
            <Check size={8} className="text-emerald-600" />
            Locatif meublé / coloc.
          </div>
        </div>
      </div>
    </div>
  </Card>
);

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */

const PotentielTab: React.FC = () => (
  <>
    <SynthesisBlock />
    <div className="grid grid-cols-3 gap-2">
      <CadastreBlock />
      <PluBlock />
      <PermitsBlock />
    </div>
    <div className="grid grid-cols-3 gap-2">
      <DpeBlock />
      <ReglementationsBlock />
      <TransformabiliteBlock />
    </div>
  </>
);

export default PotentielTab;
