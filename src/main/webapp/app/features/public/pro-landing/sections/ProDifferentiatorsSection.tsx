import React from 'react';
import { motion } from 'framer-motion';
import { Database, FileSignature, Mail, GitMerge, Bell, Users } from 'lucide-react';

const DIFFS = [
  {
    icon: Database,
    title: 'Données enrichies',
    description: "DVF + annonces + DPE + INSEE + OSM croisées en temps réel, pas un simple agrégat.",
  },
  {
    icon: FileSignature,
    title: 'Rapports éditables',
    description: "Avis de valeur, études locatives et dossiers d'investissement personnalisables et exportables en PDF.",
  },
  {
    icon: Mail,
    title: 'Tracking client',
    description: "Chaque rapport envoyé est suivi : ouvertures, temps de lecture, relances recommandées.",
  },
  {
    icon: GitMerge,
    title: 'Pipeline unique',
    description: "Un seul CRM pour tous les leads (widget, radar, estimation). Pas de mini-CRM parallèle.",
  },
  {
    icon: Bell,
    title: 'Veille actionnable',
    description: "Alertes rangées par impact business, pas chronologiquement. Fini la charge cognitive.",
  },
  {
    icon: Users,
    title: 'Pilotage équipe',
    description: "Vue manager sur activité, portefeuille, agenda, performance. Sans outil RH parallèle.",
  },
];

const ProDifferentiatorsSection: React.FC = () => (
  <section id="cas-usage" className="relative bg-neutral-50 py-16 lg:py-20 border-y border-neutral-200">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <div className="max-w-[640px] mb-12">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4 }}
          className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
        >
          Ce qui nous distingue
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-2 text-[32px] md:text-[40px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
        >
          Ce que les autres ne font pas.
        </motion.h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {DIFFS.map(d => {
          const Icon = d.icon;
          return (
            <motion.div
              key={d.title}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="rounded-lg border border-neutral-200 bg-white p-5 hover:border-propsight-200 hover:shadow-sm transition-all"
            >
              <span className="w-9 h-9 rounded-lg bg-propsight-50 text-propsight-700 flex items-center justify-center mb-4">
                <Icon size={15} strokeWidth={2.2} />
              </span>
              <h3 className="text-[15.5px] font-semibold text-neutral-900 tracking-tight">{d.title}</h3>
              <p className="mt-1.5 text-[13.5px] text-neutral-600 leading-relaxed">{d.description}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default ProDifferentiatorsSection;
