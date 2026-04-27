import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Map } from 'lucide-react';

const CARDS = [
  {
    icon: TrendingUp,
    title: 'Rendement estimé',
    description: 'Rendement brut et net, calculés à partir des loyers de marché observés dans votre zone.',
  },
  {
    icon: Wallet,
    title: 'Effort mensuel',
    description: 'Mensualité de prêt, charges, fiscalité simplifiée : combien sort de votre poche chaque mois.',
  },
  {
    icon: Map,
    title: 'Tension locative',
    description: 'Un indicateur clair par ville : tendu, équilibré, détendu. Basé sur les annonces agrégées.',
  },
];

const InvestWhatYouGetSection: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="max-w-[640px] mb-12">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.32 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
          >
            Ce que vous obtenez
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="mt-2 text-[28px] md:text-[36px] lg:text-[40px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
          >
            Les chiffres essentiels, pas le bruit.
          </motion.h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {CARDS.map(card => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
                }}
                className="rounded-lg border border-slate-200 bg-white p-8 hover:border-propsight-200 transition-colors"
              >
                <Icon size={24} className="text-propsight-600" />
                <h3 className="mt-5 text-[20px] font-medium text-slate-900 tracking-tight">{card.title}</h3>
                <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{card.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default InvestWhatYouGetSection;
