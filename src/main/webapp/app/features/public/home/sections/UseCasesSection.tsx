import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Home, Calculator, TrendingUp, Map, MapPin, GraduationCap, Train, Store } from 'lucide-react';

interface UseCase {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  icon: typeof Home;
  visual: React.ReactNode;
}

/* ──────────────── VISUALS ──────────────── */

const VisualAcheterLouer: React.FC = () => (
  <div className="relative w-full aspect-[4/3] rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm">
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-semibold text-propsight-700 uppercase tracking-wider">Annonces · 75015</span>
        <span className="text-[11px] text-neutral-400">42 résultats</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="h-5 px-2 rounded text-[10px] font-semibold bg-neutral-100 text-neutral-700">Achat</span>
        <span className="h-5 px-2 rounded text-[10px] font-medium text-neutral-500">Location</span>
      </div>
    </div>
    <div className="p-4 space-y-2">
      {[
        { surface: '68 m²', rooms: 'T3', price: '595 000 €', psqm: '8 750', verdict: 'positive', tag: '−5% vs marché' },
        { surface: '54 m²', rooms: 'T2', price: '610 000 €', psqm: '11 296', verdict: 'neutral', tag: 'Au prix' },
        { surface: '78 m²', rooms: 'T4', price: '835 000 €', psqm: '10 705', verdict: 'negative', tag: '+8% vs marché' },
      ].map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.32, delay: 0.12 + i * 0.08 }}
          className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-2.5"
        >
          <div className="w-10 h-10 rounded-md bg-neutral-100 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-semibold text-neutral-900">{row.surface} · {row.rooms}</span>
              <span className="text-[10.5px] text-neutral-400">Rue Lecourbe</span>
            </div>
            <div className="text-[10.5px] text-neutral-500 tabular-nums">{row.psqm} €/m²</div>
          </div>
          <div className="text-right">
            <div className="text-[12.5px] font-semibold text-neutral-900 tabular-nums">{row.price}</div>
            <span className={`estate-badge estate-badge--${row.verdict}`}>{row.tag}</span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const VisualEstimer: React.FC = () => (
  <div className="relative w-full aspect-[4/3] rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm">
    <div className="px-4 py-2.5 border-b border-neutral-100">
      <span className="text-[11px] font-semibold text-propsight-700 uppercase tracking-wider">Estimation</span>
    </div>
    <div className="p-5 flex flex-col h-[calc(100%-44px)]">
      <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-neutral-200 bg-neutral-50/60 mb-3">
        <MapPin size={12} className="text-neutral-400" />
        <span className="text-[12px] text-neutral-700">12 rue Lecourbe, 75015 Paris</span>
      </div>

      <div className="mb-4">
        <div className="text-[10.5px] text-neutral-500 uppercase tracking-wide">Valeur estimée</div>
        <div className="flex items-baseline gap-2 mt-1">
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="text-[30px] font-semibold text-neutral-900 tabular-nums tracking-[-0.02em]"
          >
            632 000 €
          </motion.span>
          <span className="text-[12px] text-emerald-600 font-medium">+4,2% / 12m</span>
        </div>
        <div className="text-[11px] text-neutral-500 mt-1">Fourchette : 605 000 — 658 000 €</div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-auto">
        <div className="rounded-md border border-neutral-200 p-2">
          <div className="text-[9.5px] text-neutral-400 uppercase tracking-wide">Surface</div>
          <div className="text-[13px] font-semibold text-neutral-900 tabular-nums">68 m²</div>
        </div>
        <div className="rounded-md border border-neutral-200 p-2">
          <div className="text-[9.5px] text-neutral-400 uppercase tracking-wide">€/m²</div>
          <div className="text-[13px] font-semibold text-neutral-900 tabular-nums">9 294</div>
        </div>
        <div className="rounded-md border border-neutral-200 p-2">
          <div className="text-[9.5px] text-neutral-400 uppercase tracking-wide">Comparables</div>
          <div className="text-[13px] font-semibold text-neutral-900 tabular-nums">14</div>
        </div>
      </div>
    </div>
  </div>
);

const VisualInvestir: React.FC = () => (
  <div className="relative w-full aspect-[4/3] rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm">
    <div className="px-4 py-2.5 border-b border-neutral-100">
      <span className="text-[11px] font-semibold text-propsight-700 uppercase tracking-wider">Simulation locative</span>
    </div>
    <div className="p-5 flex flex-col h-[calc(100%-44px)]">
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Prix d'achat</div>
          <div className="text-[15px] font-semibold text-neutral-900 tabular-nums mt-0.5">220 000 €</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Loyer mensuel</div>
          <div className="text-[15px] font-semibold text-neutral-900 tabular-nums mt-0.5">850 €</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-wide">Cash-flow</div>
          <div className="text-[15px] font-semibold text-emerald-600 tabular-nums mt-0.5">+142 €</div>
        </div>
      </div>

      <div className="flex-1 rounded-md border border-neutral-200 p-3 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10.5px] font-medium text-neutral-700">Cash-flow cumulé sur 8 ans</span>
          <span className="text-[10.5px] text-emerald-600 font-semibold">+18 200 €</span>
        </div>
        <div className="flex-1 flex items-end gap-1.5">
          {[20, 28, 32, 40, 46, 56, 64, 76].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="flex-1 bg-propsight-300 rounded-t-sm"
            />
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9.5px] text-neutral-500">
          <span>An 1</span>
          <span>An 8</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2 rounded-md bg-neutral-50 border border-neutral-200 px-2.5 py-1.5">
          <span className="text-[10px] text-neutral-500">Rendement brut</span>
          <span className="ml-auto text-[12px] font-semibold text-neutral-900 tabular-nums">6,4 %</span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-neutral-50 border border-neutral-200 px-2.5 py-1.5">
          <span className="text-[10px] text-neutral-500">Régime</span>
          <span className="ml-auto text-[11.5px] font-semibold text-propsight-700">LMNP</span>
        </div>
      </div>
    </div>
  </div>
);

const VisualZone: React.FC = () => (
  <div className="relative w-full aspect-[4/3] rounded-lg border border-neutral-200 bg-white overflow-hidden shadow-sm">
    <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full">
      <defs>
        <pattern id="gridZone3" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#E2E0DA" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="zoneFill3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7A6AF5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#7A6AF5" stopOpacity="0.06" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#gridZone3)" />
      <g stroke="#C9C6BD" strokeWidth="1" fill="none" opacity="0.55">
        <path d="M -10 90 Q 130 100 290 70 T 420 100" />
        <path d="M -10 200 Q 140 180 300 220 T 420 200" />
        <path d="M 80 -10 L 130 320" />
        <path d="M 260 -10 Q 240 160 280 320" />
      </g>
      <motion.path
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
        d="M 110 70 L 290 80 L 295 215 L 130 220 Z"
        fill="url(#zoneFill3)"
        stroke="#7A6AF5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
    </svg>

    {[
      { x: 28, y: 32, icon: GraduationCap, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', label: 'École', delay: 0.35 },
      { x: 62, y: 48, icon: Train, color: 'text-propsight-700', bg: 'bg-propsight-50', border: 'border-propsight-200', label: 'Métro', delay: 0.45 },
      { x: 44, y: 68, icon: Store, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', label: 'Commerces', delay: 0.55 },
    ].map((p, i) => {
      const Icon = p.icon;
      return (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.32, delay: p.delay }}
          className="absolute"
          style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div className={`flex items-center gap-1 h-6 px-1.5 rounded-full border bg-white shadow-sm ${p.border}`}>
            <span className={`w-4 h-4 rounded-full ${p.bg} flex items-center justify-center`}>
              <Icon size={9} className={p.color} />
            </span>
            <span className="text-[9.5px] font-medium text-neutral-700 pr-1">{p.label}</span>
          </div>
        </motion.div>
      );
    })}

    <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-white border border-neutral-200 text-[10.5px] font-medium text-neutral-700 shadow-sm">
      <span className="w-1.5 h-1.5 rounded-full bg-propsight-500" />
      Paris 15e · IRIS Cambronne
    </div>

    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.4, delay: 0.65 }}
      className="absolute bottom-3 right-3 grid grid-cols-3 gap-2 w-[244px] rounded-lg border border-neutral-200 bg-white p-2.5 shadow-sm"
    >
      <div>
        <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Tension</div>
        <div className="text-[12px] font-semibold text-rose-600">Forte</div>
      </div>
      <div>
        <div className="text-[9px] text-neutral-400 uppercase tracking-wide">Volume</div>
        <div className="text-[12px] font-semibold text-neutral-900 tabular-nums">842</div>
      </div>
      <div>
        <div className="text-[9px] text-neutral-400 uppercase tracking-wide">DPE moy.</div>
        <div className="text-[12px] font-semibold text-amber-600">D</div>
      </div>
    </motion.div>
  </div>
);

const USE_CASES: UseCase[] = [
  {
    eyebrow: 'Acheter / Louer',
    title: 'Trouvez le bon bien, au juste prix.',
    description:
      "Annonces enrichies par les transactions DVF, les diagnostics énergétiques et le contexte local. Un score honnête « bonne affaire » en face de chaque annonce.",
    cta: 'Explorer les annonces',
    href: '/achat',
    icon: Home,
    visual: <VisualAcheterLouer />,
  },
  {
    eyebrow: 'Estimer',
    title: 'Estimez un bien en 30 secondes.',
    description:
      "Une fourchette d'estimation basée sur les transactions DVF réelles, les caractéristiques du bien et le marché local. Sans création de compte, sans intermédiaire.",
    cta: 'Estimer mon bien',
    href: '/estimation',
    icon: Calculator,
    visual: <VisualEstimer />,
  },
  {
    eyebrow: 'Investir',
    title: 'Simulez la rentabilité avant de signer.',
    description:
      "Rendement brut, cash-flow mensuel, fiscalité LMNP ou nue. Un vrai moteur de décision financière, pas un calculateur de surface.",
    cta: 'Lancer une simulation',
    href: '/investissement',
    icon: TrendingUp,
    visual: <VisualInvestir />,
  },
  {
    eyebrow: 'Analyser une zone',
    title: "Comprenez un quartier avant d'y placer votre capital.",
    description:
      "Tension locative, volumes de transaction, équipements, démographie : un contexte territorial complet pour chaque arrondissement, commune ou IRIS.",
    cta: 'Explorer la carte',
    href: '/PrixImmobliers',
    icon: Map,
    visual: <VisualZone />,
  },
];

const UseCasesSection: React.FC = () => {
  return (
    <section className="relative bg-white py-16 lg:py-20">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
        <div className="max-w-[640px] mb-14">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
          >
            Cas d'usage
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 text-[32px] md:text-[40px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
          >
            Une plateforme, quatre usages.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-[15px] text-neutral-600 leading-relaxed max-w-[520px]"
          >
            Acheter, louer, estimer, simuler ou analyser un quartier — toutes les briques essentielles
            de la décision immobilière, alimentées par les mêmes données publiques.
          </motion.p>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {USE_CASES.map((uc, i) => {
            const reversed = i % 2 === 1;
            const Icon = uc.icon;
            return (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-8%' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  reversed ? 'lg:[&>*:first-child]:order-2' : ''
                }`}
              >
                <div className="max-w-[480px]">
                  <div className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-neutral-100 mb-4">
                    <Icon size={12} className="text-neutral-600" />
                    <span className="text-[11px] font-medium text-neutral-700 tracking-tight">{uc.eyebrow}</span>
                  </div>
                  <h3 className="text-[26px] md:text-[30px] font-semibold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
                    {uc.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-neutral-600 leading-relaxed">{uc.description}</p>
                  <Link
                    to={uc.href}
                    className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-medium text-propsight-700 hover:text-propsight-800 group"
                  >
                    {uc.cta}
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
                <div className="relative">{uc.visual}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
