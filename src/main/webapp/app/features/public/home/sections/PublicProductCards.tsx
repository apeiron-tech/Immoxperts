import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, Home, TrendingUp, ArrowRight } from 'lucide-react';

const CARDS = [
  {
    icon: Map,
    title: 'Prix immobiliers',
    description: "Explorez la carte DVF, analysez les prix au m² par quartier et comparez les transactions réelles.",
    cta: 'Explorer la carte',
    href: '/PrixImmobliers',
    highlight: 'Carte DVF',
  },
  {
    icon: Home,
    title: 'Acheter / Louer',
    description: "Parcourez les annonces enrichies avec l'historique DVF, le DPE et le contexte local.",
    cta: 'Voir les annonces',
    href: '/achat',
    highlight: 'Annonces',
  },
  {
    icon: TrendingUp,
    title: 'Investissement',
    description: "Simulez la rentabilité nette-nette, le cash-flow et la fiscalité de votre projet locatif.",
    cta: 'Simuler un projet',
    href: '/investissement',
    highlight: 'Simulateur',
  },
];

const PublicProductCards: React.FC = () => {
  return (
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
            Trois outils, une plateforme
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 text-[32px] md:text-[40px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
          >
            Le marché immobilier, vu comme il est.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-3 text-[15px] text-neutral-600 leading-relaxed"
          >
            Des données publiques nettoyées, enrichies et rendues actionnables pour chaque décision.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.06, delayChildren: 0.05 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {CARDS.map(card => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                variants={{
                  hidden: { opacity: 0, y: 12 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
              >
                <Link
                  to={card.href}
                  className="group relative block h-full p-6 rounded-lg border border-neutral-200 bg-white hover:border-propsight-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="w-10 h-10 rounded-lg bg-propsight-50 text-propsight-700 flex items-center justify-center">
                      <Icon size={18} strokeWidth={2.2} />
                    </span>
                    <span className="text-[10.5px] font-semibold text-neutral-400 uppercase tracking-wider">
                      {card.highlight}
                    </span>
                  </div>
                  <h3 className="text-[19px] font-semibold text-neutral-900 tracking-tight">{card.title}</h3>
                  <p className="mt-2 text-[14px] text-neutral-600 leading-relaxed">{card.description}</p>
                  <div className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-propsight-700 group-hover:gap-2.5 transition-all">
                    {card.cta}
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default PublicProductCards;
