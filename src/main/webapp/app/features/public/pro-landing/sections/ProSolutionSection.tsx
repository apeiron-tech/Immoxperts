import React from 'react';
import { motion } from 'framer-motion';
import { Radar, FileCheck, FileText, Repeat, ArrowRight } from 'lucide-react';

const PILLARS = [
  {
    icon: Radar,
    step: '01',
    title: 'Détecter',
    description:
      'Mandats qui expirent chez la concurrence, propriétaires âgés + héritiers, biens en rénovation énergétique : les signaux territoire qui font basculer un mandat.',
  },
  {
    icon: FileCheck,
    step: '02',
    title: 'Qualifier',
    description:
      "Chaque signal devient un lead scoré, assigné et priorisé. Un pipeline unique, pas cinq mini-CRM dans cinq modules.",
  },
  {
    icon: FileText,
    step: '03',
    title: 'Produire',
    description:
      "Avis de valeur argumentés, étude locative, dossier d'investissement. Éditable, exportable en PDF, diffusable en lien privé.",
  },
  {
    icon: Repeat,
    step: '04',
    title: 'Relancer',
    description:
      "Tracking d'ouverture des rapports, alertes quand un client rouvre, relance recommandée. Aucun lead ne retombe sur la pile.",
  },
];

const ProSolutionSection: React.FC = () => (
  <section className="relative bg-white py-16 lg:py-20">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <div className="max-w-[680px] mb-14">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
        >
          La solution
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-[32px] md:text-[40px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
        >
          Un workflow connecté, pas des modules en silo.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="mt-3 text-[15.5px] text-neutral-600 leading-relaxed max-w-[580px]"
        >
          Les quatre mouvements du métier, outillés comme un seul produit.
        </motion.p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {PILLARS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.step}
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="relative group"
            >
              {/* Arrow connector (desktop only, between cards) */}
              {i < PILLARS.length - 1 && (
                <div className="hidden lg:flex absolute top-9 -right-2 z-10 w-4 h-4 items-center justify-center">
                  <ArrowRight size={12} className="text-neutral-300" />
                </div>
              )}
              <div className="relative h-full rounded-lg border border-neutral-200 bg-white p-6 hover:border-propsight-200 hover:shadow-sm transition-all overflow-hidden">
                <div className="absolute top-4 right-5 text-[36px] font-semibold text-neutral-100 leading-none select-none">
                  {p.step}
                </div>
                <span className="relative w-10 h-10 rounded-lg bg-propsight-50 text-propsight-700 flex items-center justify-center">
                  <Icon size={17} strokeWidth={2.2} />
                </span>
                <h3 className="relative mt-5 text-[17px] font-semibold text-neutral-900 tracking-tight">
                  {p.title}
                </h3>
                <p className="relative mt-2 text-[13.5px] text-neutral-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default ProSolutionSection;
