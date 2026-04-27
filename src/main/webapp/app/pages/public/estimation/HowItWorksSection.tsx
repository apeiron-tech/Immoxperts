import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, BarChart3, MessageSquare } from 'lucide-react';

const STEPS = [
  { icon: MapPin, n: 1, title: 'Une adresse', description: 'Saisissez l’adresse du bien et ses caractéristiques principales.' },
  {
    icon: BarChart3,
    n: 2,
    title: 'Des données réelles',
    description: 'On croise votre bien avec les transactions DVF et les annonces du secteur.',
  },
  {
    icon: MessageSquare,
    n: 3,
    title: 'Un avis humain',
    description: 'Un conseiller peut affiner gratuitement l’estimation si vous le souhaitez.',
  },
];

const HowItWorksSection: React.FC = () => (
  <section className="bg-white py-20 lg:py-24">
    <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
      <div className="max-w-[640px] mb-12">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.32 }}
          className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
        >
          Comment ça marche
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4, delay: 0.04 }}
          className="mt-2 text-[28px] md:text-[36px] lg:text-[40px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
        >
          Trois étapes pour situer la valeur de votre bien.
        </motion.h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {STEPS.map(s => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.n}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="rounded-lg border border-slate-200 bg-white p-7"
            >
              <Icon size={24} className="text-propsight-600" />
              <h3 className="mt-4 text-[20px] font-medium text-slate-900 tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] text-slate-600 leading-relaxed">{s.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
