import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const ITEMS = [
  {
    title: 'Prix réels de vente',
    description:
      "Les transactions DVF officielles, depuis 2014, nettoyées et enrichies : filtrables par type, surface, période, prix au m².",
  },
  {
    title: 'Annonces enrichies',
    description:
      "Au-delà du prix affiché : DPE, contexte local, historique de prix et proximité DVF. Pour évaluer le juste prix.",
  },
  {
    title: 'Simulation investissement',
    description:
      "Rentabilité nette-nette, cash-flow, fiscalité LMNP / nue. Un vrai moteur de décision, pas un simple calculateur.",
  },
  {
    title: 'Contexte local',
    description:
      "Tension, équipements, population, transports : comprenez un territoire avant d'y engager votre capital.",
  },
];

const WhyPropsightSection: React.FC = () => {
  return (
    <section className="relative bg-neutral-50 py-16 lg:py-20 border-y border-neutral-200">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.4 }}
              className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
            >
              Pourquoi Propsight
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-2 text-[32px] md:text-[38px] font-semibold text-neutral-900 leading-[1.15] tracking-[-0.02em] max-w-[480px]"
            >
              La clarté d'abord. Les décisions ensuite.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-4 text-[15px] text-neutral-600 leading-relaxed max-w-[460px]"
            >
              Pas d'estimation bricolée, pas d'annonce sans contexte. Propsight donne à chacun accès au même niveau de lecture du marché que les pros.
            </motion.p>
          </div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
            }}
            className="space-y-7"
          >
            {ITEMS.map(it => (
              <motion.li
                key={it.title}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="flex gap-4"
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-propsight-100 text-propsight-700 flex items-center justify-center">
                  <Check size={14} strokeWidth={2.5} />
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-neutral-900 tracking-tight">{it.title}</h3>
                  <p className="mt-1 text-[14px] text-neutral-600 leading-relaxed">{it.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default WhyPropsightSection;
