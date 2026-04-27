import React from 'react';
import { motion } from 'framer-motion';
import { Award, Globe, Radar, FileText } from 'lucide-react';

const CASES = [
  {
    icon: Award,
    title: 'Gagner des mandats vendeurs',
    description:
      "Signaux territoire, avis de valeur argumentés, tracking d'ouverture : de la première visite au compromis signé.",
  },
  {
    icon: Globe,
    title: 'Transformer votre site en source de leads',
    description:
      "Widgets estimateur et simulateur embeddables sur votre site. Les leads qualifiés atterrissent dans votre pipeline.",
  },
  {
    icon: Radar,
    title: 'Prospecter intelligemment',
    description:
      "Radar multi-critères : propriétaires âgés + DPE F/G, mandats concurrents expirants, héritiers détectés.",
  },
  {
    icon: FileText,
    title: 'Produire un dossier investisseur',
    description:
      "Rentabilité, cash-flow, fiscalité, comparables. Un dossier signé en PDF, exportable au client.",
  },
];

const ProUseCasesSection: React.FC = () => (
  <section className="relative bg-white py-16 lg:py-20">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <div className="max-w-[640px] mb-12">
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
          Quatre missions, un seul outil.
        </motion.h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {CASES.map(c => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="rounded-lg border border-neutral-200 bg-white p-6 hover:border-propsight-200 hover:shadow-sm transition-all"
            >
              <span className="w-10 h-10 rounded-lg bg-propsight-50 text-propsight-700 flex items-center justify-center mb-4">
                <Icon size={16} strokeWidth={2.2} />
              </span>
              <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">{c.title}</h3>
              <p className="mt-2 text-[14px] text-neutral-600 leading-relaxed">{c.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default ProUseCasesSection;
