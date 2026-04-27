import React from 'react';
import { motion } from 'framer-motion';
import { X, Check, ArrowRight } from 'lucide-react';

interface Pair {
  before: string;
  after: string;
}

const PAIRS: Pair[] = [
  {
    before: 'Prospection éclatée dans 5 outils — pige, CRM, Excel, dashboards.',
    after: 'Un radar unique : signaux DVF, DPE, mandats expirants, propriétaires âgés.',
  },
  {
    before: 'Estimations difficiles à justifier, sans comparables argumentés.',
    after: 'Avis de valeur PDF avec historique DVF, comparables et méthodologie.',
  },
  {
    before: "Rapport envoyé par email, silence radio, aucun signal du moment chaud.",
    after: "Tracking d'ouverture, alerte quand le client rouvre, relance recommandée.",
  },
  {
    before: 'Zéro vision business : pipe, part de marché, mandats qui meurent — invisibles.',
    after: 'Tableau de bord : CA réalisé, pipe pondéré, part de marché, priorités du jour.',
  },
];

const ProProblemSection: React.FC = () => (
  <section id="produit" className="relative bg-neutral-50 py-16 lg:py-20 border-y border-neutral-200">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <div className="max-w-[680px] mb-10">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
        >
          Le constat
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-[32px] md:text-[38px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
        >
          L'immobilier travaille avec ce qu'il a.{' '}
          <span className="text-neutral-500">Trop souvent, ça ne suffit pas.</span>
        </motion.h2>
      </div>

      {/* Before / After table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-lg border border-neutral-200 bg-white overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] items-stretch">
          {/* Header — Before */}
          <div className="hidden md:flex items-center gap-2 px-6 py-3.5 border-b border-neutral-200 bg-rose-50/60">
            <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
              <X size={11} strokeWidth={2.6} />
            </span>
            <span className="text-[12px] font-semibold text-rose-700 uppercase tracking-wider">Avant Propsight</span>
          </div>
          <div aria-hidden className="hidden md:block border-b border-neutral-200 bg-neutral-50" />
          <div className="hidden md:flex items-center gap-2 px-6 py-3.5 border-b border-neutral-200 bg-emerald-50/40">
            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Check size={11} strokeWidth={2.6} />
            </span>
            <span className="text-[12px] font-semibold text-emerald-700 uppercase tracking-wider">Avec Propsight</span>
          </div>

          {/* Rows */}
          {PAIRS.map((p, i) => (
            <React.Fragment key={i}>
              {/* Before cell */}
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                className={`flex items-start gap-3 px-6 py-5 ${i < PAIRS.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                <span className="md:hidden flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mt-0.5">
                  <X size={11} strokeWidth={2.6} />
                </span>
                <p className="text-[14px] text-neutral-600 leading-relaxed">{p.before}</p>
              </motion.div>

              {/* Arrow connector */}
              <div
                aria-hidden
                className={`hidden md:flex items-center justify-center bg-neutral-50 ${i < PAIRS.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                <ArrowRight size={14} className="text-neutral-300" />
              </div>

              {/* After cell */}
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                className={`flex items-start gap-3 px-6 py-5 bg-white md:bg-neutral-50/30 ${i < PAIRS.length - 1 ? 'border-b border-neutral-100' : ''}`}
              >
                <span className="md:hidden flex-shrink-0 w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5">
                  <Check size={11} strokeWidth={2.6} />
                </span>
                <p className="text-[14px] font-medium text-neutral-900 leading-relaxed">{p.after}</p>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProProblemSection;
