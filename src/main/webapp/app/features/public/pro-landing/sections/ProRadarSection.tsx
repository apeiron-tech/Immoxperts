import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  TrendingDown,
  Zap,
  ScrollText,
  Clock4,
  Filter,
} from 'lucide-react';

interface Signal {
  id: string;
  x: number;
  y: number;
  type: 'price-drop' | 'dpe' | 'dvf' | 'mandate';
  label: string;
  delay: number;
}

const SIGNALS: Signal[] = [
  { id: 's1', x: 22, y: 28, type: 'price-drop', label: '−12% en 30j', delay: 0.4 },
  { id: 's2', x: 58, y: 24, type: 'dpe', label: 'DPE F → rénovation', delay: 0.5 },
  { id: 's3', x: 78, y: 44, type: 'dvf', label: 'Vente –8% médian', delay: 0.6 },
  { id: 's4', x: 38, y: 60, type: 'mandate', label: 'Mandat expire 9j', delay: 0.7 },
  { id: 's5', x: 70, y: 70, type: 'price-drop', label: '−5% / 7j', delay: 0.8 },
  { id: 's6', x: 18, y: 72, type: 'dvf', label: 'Vente +4 ventes', delay: 0.9 },
];

const SIGNAL_STYLE: Record<Signal['type'], { bg: string; border: string; text: string; icon: typeof TrendingDown; tone: string }> = {
  'price-drop': {
    bg: 'bg-rose-500',
    border: 'border-rose-600',
    text: 'text-white',
    icon: TrendingDown,
    tone: 'Baisse de prix',
  },
  dpe: {
    bg: 'bg-amber-500',
    border: 'border-amber-600',
    text: 'text-white',
    icon: Zap,
    tone: 'Signal DPE',
  },
  dvf: {
    bg: 'bg-propsight-600',
    border: 'border-propsight-700',
    text: 'text-white',
    icon: ScrollText,
    tone: 'Signal DVF',
  },
  mandate: {
    bg: 'bg-white',
    border: 'border-neutral-300',
    text: 'text-neutral-800',
    icon: Clock4,
    tone: 'Mandat expirant',
  },
};

const LEGEND = [
  { key: 'price-drop', dot: 'bg-rose-500', label: 'Baisse de prix' },
  { key: 'dpe', dot: 'bg-amber-500', label: 'Signal DPE' },
  { key: 'dvf', dot: 'bg-propsight-600', label: 'Signal DVF' },
  { key: 'mandate', dot: 'bg-neutral-400', label: 'Mandat expirant' },
];

const RadarMap: React.FC = () => (
  <div className="relative rounded-lg border border-neutral-200 bg-white shadow-sm overflow-hidden">
    {/* Browser chrome */}
    <div className="flex items-center justify-between px-4 h-10 border-b border-neutral-100 bg-white">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
          <span className="w-2.5 h-2.5 rounded-full bg-neutral-200" />
        </div>
        <span className="ml-3 text-[11px] text-neutral-400">app.propsight.fr/prospection/radar</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center gap-1 h-6 px-2 rounded-md border border-neutral-200 text-[10.5px] text-neutral-600">
          <Filter size={10} />
          4 filtres
        </span>
        <span className="h-6 px-2 rounded-md bg-propsight-600 text-[10.5px] font-medium text-white flex items-center">
          Radar actif
        </span>
      </div>
    </div>

    {/* Map viewport */}
    <div className="relative h-[420px] md:h-[480px] bg-neutral-50 overflow-hidden">
      {/* Grid + streets */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 420" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="radarGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2E0DA" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="radarPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7A6AF5" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#7A6AF5" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#7A6AF5" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="600" height="420" fill="url(#radarGrid)" />

        {/* Streets */}
        <g stroke="#C9C6BD" strokeWidth="1" fill="none" opacity="0.55">
          <path d="M -10 110 Q 180 130 380 90 T 620 110" />
          <path d="M -10 230 Q 200 210 400 250 T 620 230" />
          <path d="M -10 330 Q 200 320 400 350 T 620 330" />
          <path d="M 90 -10 L 140 440" />
          <path d="M 360 -10 Q 340 200 380 440" />
          <path d="M 240 -10 L 320 440" />
        </g>

        {/* Radar focus zone — soft polygon */}
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          d="M 110 90 L 470 100 L 480 320 L 130 330 Z"
          fill="url(#radarPulse)"
          stroke="#7A6AF5"
          strokeWidth="1.5"
          strokeDasharray="5 5"
        />
      </svg>

      {/* Signal markers */}
      {SIGNALS.map(s => {
        const style = SIGNAL_STYLE[s.type];
        const Icon = style.icon;
        return (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.32, delay: s.delay, ease: [0.22, 1, 0.36, 1] }}
            className="absolute"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div className={`flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-0.5 border whitespace-nowrap shadow-sm ${style.bg} ${style.border}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center ${style.bg === 'bg-white' ? 'bg-neutral-100' : 'bg-white/20'}`}>
                <Icon size={10} className={style.text} />
              </span>
              <span className={`text-[10.5px] font-semibold tabular-nums ${style.text}`}>{s.label}</span>
            </div>
            <span
              className={`absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 ${
                style.bg === 'bg-white' ? 'bg-white border-r border-b border-neutral-300' : style.bg
              }`}
            />
          </motion.div>
        );
      })}

      {/* Top-left zone label */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="absolute top-3 left-3 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md bg-white border border-neutral-200 text-[11px] font-medium text-neutral-700 shadow-sm"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-propsight-500" />
        Paris 15e · IRIS Cambronne
      </motion.div>

      {/* Top-right "6 nouveaux signaux" */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="absolute top-3 right-3 inline-flex items-center gap-2 h-7 px-2.5 rounded-md bg-emerald-50 border border-emerald-100 text-[11px] font-medium text-emerald-700"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        6 nouveaux signaux · 24h
      </motion.div>

      {/* Bottom legend */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, delay: 1.0 }}
        className="absolute left-3 right-3 bottom-3 flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2.5 rounded-lg border border-neutral-200 bg-white shadow-sm"
      >
        {LEGEND.map(l => (
          <div key={l.key} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${l.dot}`} />
            <span className="text-[11px] font-medium text-neutral-700">{l.label}</span>
          </div>
        ))}
        <div className="ml-auto text-[10.5px] text-neutral-400">Mis à jour à 10:42</div>
      </motion.div>
    </div>
  </div>
);

const ProRadarSection: React.FC = () => (
  <section className="relative bg-neutral-50 py-16 lg:py-20 border-y border-neutral-200">
    <div className="max-w-[1280px] mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.2fr)] gap-10 lg:gap-14 items-start">
        {/* Copy */}
        <div className="lg:sticky lg:top-24">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
          >
            Radar à opportunités
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 text-[30px] md:text-[36px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
          >
            Toutes les opportunités, sur une seule carte.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mt-4 text-[15px] text-neutral-600 leading-relaxed max-w-[420px]"
          >
            Annonces en baisse de prix, biens à rénover (DPE F/G), ventes inférieures au médian,
            mandats concurrents qui expirent. Tout ce qui peut devenir un mandat — au même endroit, en temps réel.
          </motion.p>

          <ul className="mt-6 space-y-2.5 max-w-[400px]">
            {[
              { dot: 'bg-rose-500', text: 'Annonces en baisse de prix sur 7 / 30 / 90 jours' },
              { dot: 'bg-amber-500', text: 'Logements DPE F et G à fort potentiel rénovation' },
              { dot: 'bg-propsight-600', text: 'Ventes DVF récentes inférieures au médian de zone' },
              { dot: 'bg-neutral-400', text: 'Mandats concurrents qui arrivent à expiration' },
            ].map(item => (
              <li key={item.text} className="flex items-start gap-2.5">
                <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${item.dot}`} />
                <span className="text-[13.5px] text-neutral-700 leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/pro#contact"
            className="mt-8 inline-flex items-center gap-1.5 text-[14px] font-medium text-propsight-700 hover:text-propsight-800 group"
          >
            Voir le radar en démo
            <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Visual */}
        <div className="relative">
          <RadarMap />
        </div>
      </div>
    </div>
  </section>
);

export default ProRadarSection;
