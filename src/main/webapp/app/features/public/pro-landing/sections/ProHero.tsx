import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, MapPin, Activity, Bell } from 'lucide-react';
import FloatingDashboardPreview from '../components/FloatingDashboardPreview';

const COMPLEMENTS = ['MeilleursAgents', 'Yanport', 'Apimo', 'Hektor'];

interface Signal {
  ville: string;
  adresse: string;
  insight: string;
  badge: string;
  tone: 'positive' | 'neutral' | 'negative';
}

const SIGNALS: Signal[] = [
  {
    ville: 'Paris 15e',
    adresse: 'Rue Lecourbe',
    insight: '+12% vs marché local',
    badge: 'Bonne affaire',
    tone: 'positive',
  },
  {
    ville: 'Lyon 2e',
    adresse: 'Place Bellecour',
    insight: 'Tension locative élevée',
    badge: 'À surveiller',
    tone: 'neutral',
  },
  {
    ville: 'Nantes Centre',
    adresse: 'Quai de la Fosse',
    insight: 'DPE F · stock +22%',
    badge: 'Saturé',
    tone: 'negative',
  },
];

const ProHero: React.FC = () => (
  <section className="relative overflow-hidden bg-white">
    <div
      aria-hidden
      className="absolute -top-32 right-[-12%] w-[600px] h-[480px] rounded-full bg-propsight-50/60 blur-3xl pointer-events-none"
    />

    <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-14 pb-16 lg:pt-20 lg:pb-24">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-10 lg:gap-14 items-start">
        {/* Left : copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-6"
          >
            <span className="section-eyebrow">Logiciel pour professionnels de l'immobilier</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            className="display-headline text-[40px] md:text-[52px] lg:text-[60px]"
          >
            La plateforme qui transforme la donnée en{' '}
            <span className="bg-gradient-to-r from-propsight-700 to-propsight-400 bg-clip-text text-transparent">
              mandats
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            className="mt-6 text-[17px] text-neutral-600 leading-[1.65] max-w-[600px]"
          >
            Conçue pour les agents immobiliers, mandataires, équipes et investisseurs.
            Détection d'opportunités, estimation crédible, prospection ciblée et pilotage commercial —
            depuis une seule application connectée aux sources publiques.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-9 flex items-center gap-3 flex-wrap"
          >
            <button
              type="button"
              className="h-11 px-5 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-medium flex items-center gap-2 transition-colors"
            >
              Réserver une démo
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              className="h-11 px-5 rounded-lg border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-800 text-[14px] font-medium flex items-center gap-2 transition-colors"
            >
              <Play size={12} fill="currentColor" className="text-propsight-600" />
              Voir la plateforme en 2 min
            </button>
          </motion.div>

          {/* Compatibilité — natural sentence, no mono */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.36 }}
            className="mt-9 border-l-2 border-propsight-500 pl-4 py-1 max-w-[600px]"
          >
            <div className="text-[13.5px] text-neutral-700 leading-snug">
              <span className="block text-[12px] text-neutral-500 mb-1">Compatible avec votre stack</span>
              <span className="font-semibold text-neutral-900">{COMPLEMENTS.join(' · ')}</span>
              <span className="text-neutral-500"> — un abonnement unique, données croisées, tarification transparente.</span>
            </div>
          </motion.div>

          {/* Opportunités du jour — natural badges, full addresses */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.5 } } }}
            className="mt-10"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] font-semibold text-neutral-900">3 opportunités détectées cette semaine</span>
              <a href="#" className="text-[12px] text-propsight-700 hover:text-propsight-900 font-medium">
                Voir toutes les zones →
              </a>
            </div>
            <div className="space-y-1.5">
              {SIGNALS.map(s => (
                <motion.div
                  key={s.adresse}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                  }}
                  className="flex items-center gap-3 px-3.5 h-12 rounded-lg border border-neutral-200 bg-white hover:border-propsight-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-propsight-50 flex items-center justify-center shrink-0">
                    <MapPin size={14} className="text-propsight-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-neutral-900 truncate">{s.adresse}</div>
                    <div className="text-[11.5px] text-neutral-500 truncate">{s.ville} · {s.insight}</div>
                  </div>
                  <span className={`estate-badge estate-badge--${s.tone}`}>{s.badge}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right : floating dashboard preview */}
        <div className="relative">
          <FloatingDashboardPreview />

          {/* Live agent activity — middle-right with gradient accent */}
          <motion.div
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.35 }}
            className="hidden lg:block absolute -right-8 top-[200px] w-[228px] z-20 rounded-lg border border-neutral-200 bg-white shadow-md overflow-hidden"
          >
            <span
              aria-hidden
              className="block h-[3px] w-full"
              style={{ background: 'var(--ps-signature-gradient)' }}
            />
            <div className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-propsight-700">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-propsight-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-propsight-500" />
                  </span>
                  En direct
                </span>
                <span className="text-[9.5px] text-neutral-400">Équipe · 4</span>
              </div>
              <div className="text-[12px] font-semibold text-neutral-900 leading-snug">
                +3 leads ce matin
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-600">
                  <Activity size={10} className="text-emerald-600" />
                  <span className="font-medium text-neutral-800">Marc</span>
                  <span className="text-neutral-500">a signé un mandat</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10.5px] text-neutral-600">
                  <Bell size={10} className="text-amber-600" />
                  <span className="font-medium text-neutral-800">Léa</span>
                  <span className="text-neutral-500">RDV à 14h30</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

export default ProHero;
