import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: 1,
    title: 'Décrivez le bien',
    description: "Prix, surface, loyer estimé. C'est suffisant pour un premier regard.",
  },
  {
    n: 2,
    title: 'Le simulateur calcule',
    description: 'Rendement brut et net, cash-flow, effort mensuel après impôt simplifié.',
  },
  {
    n: 3,
    title: 'Vous ajustez',
    description: 'Apport, taux, durée : voyez en temps réel comment vos choix changent la rentabilité.',
  },
];

const InvestHowItWorksSection: React.FC = () => {
  return (
    <section className="bg-slate-50 py-20">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.4 }}
              className="text-[28px] md:text-[32px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
            >
              Trois étapes, aucune inscription.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.4, delay: 0.06 }}
              className="mt-4 text-[16px] text-slate-600 leading-[1.6] max-w-[520px]"
            >
              Notre simulateur est conçu pour les particuliers qui découvrent l&rsquo;investissement locatif comme pour ceux qui veulent rapidement
              arbitrer entre deux biens. Pas de jargon fiscal, pas de courbe TRI sur 25 ans. Juste les chiffres dont vous avez besoin pour passer à
              l&rsquo;étape suivante.
            </motion.p>
          </div>

          <motion.ol
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-10%' }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
            }}
            className="space-y-7"
          >
            {STEPS.map(step => (
              <motion.li
                key={step.n}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="flex gap-4"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-propsight-100 text-propsight-700 flex items-center justify-center text-[14px] font-semibold tabular-nums">
                  {step.n}
                </span>
                <div>
                  <div className="text-[16px] font-medium text-slate-900">{step.title}</div>
                  <p className="mt-1 text-[15px] text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </div>
    </section>
  );
};

export default InvestHowItWorksSection;
