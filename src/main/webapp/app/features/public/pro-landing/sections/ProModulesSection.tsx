import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Activity,
  Home,
  Radar,
  Calculator,
  TrendingUp,
  LineChart,
  Eye,
  Users,
  Code2,
} from 'lucide-react';

const MODULES = [
  { icon: LayoutDashboard, name: 'Tableau de bord', description: 'CA, pipe, part de marché, priorités du jour.', href: '/app/tableau-de-bord' },
  { icon: Activity, name: 'Mon activité', description: 'Pilotage commercial, leads, performance.', href: '/app/activite/pilotage' },
  { icon: Home, name: 'Biens immobiliers', description: 'Portefeuille mandats, annonces, ventes DVF.', href: '/app/biens/portefeuille' },
  { icon: Radar, name: 'Prospection', description: 'Radar, signaux DVF, signaux DPE.', href: '/app/prospection/radar' },
  { icon: Calculator, name: 'Estimation', description: 'Avis de valeur, étude locative, rapide.', href: '/app/estimation/rapide' },
  { icon: TrendingUp, name: 'Investissement', description: 'Opportunités scorées, dossiers, comparateur.', href: '/app/investissement/opportunites' },
  { icon: LineChart, name: 'Observatoire', description: 'Marché, tension, contexte local.', href: '/app/observatoire/marche' },
  { icon: Eye, name: 'Veille', description: 'Alertes, biens suivis, agences concurrentes.', href: '/app/veille/notifications' },
  { icon: Users, name: 'Équipe', description: 'Vue manager, agenda, performance équipe.', href: '/app/equipe/vue' },
  { icon: Code2, name: 'Widgets publics', description: 'Estimateur et simulateur embeddables.', href: '/app/widgets' },
];

const ProModulesSection: React.FC = () => (
  <section id="modules" className="relative bg-white py-16 lg:py-20">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
        <div className="max-w-[560px]">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
          >
            Le produit · 10 modules
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-2 text-[28px] md:text-[34px] font-semibold text-neutral-900 leading-[1.15] tracking-[-0.02em]"
          >
            Dix modules. Zéro silo.
          </motion.h2>
        </div>
        <p className="max-w-[380px] text-[14px] text-neutral-500 leading-relaxed">
          Chaque module est un angle de lecture des mêmes objets métier — biens, leads, rapports, alertes.
          Vous ne saisissez jamais la même donnée deux fois.
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3"
      >
        {MODULES.map(mod => {
          const Icon = mod.icon;
          return (
            <motion.div
              key={mod.name}
              variants={{
                hidden: { opacity: 0, y: 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Link
                to={mod.href}
                className="group block h-full rounded-lg border border-neutral-200 bg-white p-4 hover:border-propsight-200 hover:shadow-sm transition-all"
              >
                <span className="inline-flex w-8 h-8 rounded-md bg-propsight-50 text-propsight-700 items-center justify-center group-hover:bg-propsight-100 transition-colors mb-3">
                  <Icon size={14} strokeWidth={2.2} />
                </span>
                <h3 className="text-[13.5px] font-semibold text-neutral-900 tracking-tight">
                  {mod.name}
                </h3>
                <p className="mt-1 text-[12px] text-neutral-500 leading-relaxed">
                  {mod.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  </section>
);

export default ProModulesSection;
