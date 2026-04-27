import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Database } from 'lucide-react';

interface Source {
  short: string;
  name: string;
  authority: string;
  description: string;
  metric: string;
  metricLabel: string;
  freshness: string;
}

const SOURCES: Source[] = [
  {
    short: 'DVF',
    name: 'Demandes de Valeurs Foncières',
    authority: 'DGFiP — Finances publiques',
    description: "Toutes les transactions immobilières enregistrées par l'administration fiscale française.",
    metric: '+ 50 M',
    metricLabel: 'transactions',
    freshness: 'Depuis 2014',
  },
  {
    short: 'DPE',
    name: 'Diagnostic de Performance Énergétique',
    authority: 'ADEME — Transition écologique',
    description: 'Étiquettes énergétiques et émissions GES, à validité légale opposable.',
    metric: '23,4 M',
    metricLabel: 'logements',
    freshness: 'Temps réel',
  },
  {
    short: 'INSEE',
    name: 'Statistiques INSEE · IRIS',
    authority: 'Institut national de la statistique',
    description: 'Population, revenus médians, CSP à l\'échelle du quartier (IRIS).',
    metric: '49 800',
    metricLabel: 'IRIS',
    freshness: 'Révision 2024',
  },
  {
    short: 'BPE',
    name: 'Base Permanente des Équipements',
    authority: 'INSEE',
    description: 'Commerces, écoles, crèches, transports, services — géolocalisés à la rue.',
    metric: '2,1 M',
    metricLabel: 'équipements',
    freshness: 'Révision 2024',
  },
  {
    short: 'BAN',
    name: 'Base Adresse Nationale',
    authority: 'IGN · DGFiP · La Poste',
    description: "Référentiel d'adresses certifié, fondation de tout géocodage français.",
    metric: '26 M',
    metricLabel: 'adresses',
    freshness: 'Temps réel',
  },
  {
    short: 'Annonces',
    name: 'Annonces immobilières agrégées',
    authority: 'Agrégation Propsight',
    description: 'Annonces achat et location dédupliquées et rattachées aux adresses certifiées.',
    metric: '1,2 M',
    metricLabel: 'annonces / mois',
    freshness: 'Mise à jour quotidienne',
  },
];

const DataSourcesSection: React.FC = () => (
  <section className="relative bg-white py-16 lg:py-24 border-t border-neutral-200">
    <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
        <div className="max-w-[640px]">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-[11px] font-semibold text-propsight-600 uppercase tracking-wider"
          >
            <Database size={12} />
            Plus de 40 sources publiques · 6 piliers data
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-[32px] md:text-[40px] lg:text-[44px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]"
          >
            Des données traçables, datées, à jour.
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="max-w-[400px] text-[14.5px] text-neutral-600 leading-[1.65]"
        >
          Propsight n'invente rien. Chaque chiffre est rattaché à une source publique officielle,
          datée et auditable. Audit-trail complet, par défaut, partout dans la plateforme.
        </motion.p>
      </div>

      {/* Sources grid — 3 cols on desktop */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
      >
        {SOURCES.map(s => (
          <motion.div
            key={s.short}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
            }}
            className="group relative rounded-lg border border-neutral-200 bg-white p-5 hover:border-propsight-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="estate-badge estate-badge--brand">{s.short}</span>
              <ArrowUpRight size={14} className="text-neutral-300 group-hover:text-propsight-600 transition-colors" />
            </div>

            <div className="text-[14px] font-semibold text-neutral-900 leading-tight">{s.name}</div>
            <div className="text-[11.5px] text-neutral-500 mt-0.5">{s.authority}</div>

            <div className="flex items-baseline gap-2 mt-4 mb-2">
              <span className="text-[24px] font-semibold text-neutral-900 tabular-nums leading-none tracking-[-0.02em]">
                {s.metric}
              </span>
              <span className="text-[12px] text-neutral-500">{s.metricLabel}</span>
            </div>

            <p className="text-[13px] text-neutral-600 leading-relaxed">{s.description}</p>

            <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
              <span className="text-[11.5px] text-neutral-500">{s.freshness}</span>
              <span className="text-[11.5px] font-medium text-propsight-700 opacity-0 group-hover:opacity-100 transition-opacity">
                Voir la méthodologie →
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom trust anchor */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 flex flex-wrap items-center justify-between gap-4 px-6 py-5 rounded-lg border border-neutral-200 bg-neutral-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <ShieldCheck size={18} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-[14px] font-semibold text-neutral-900">RGPD &amp; audit-trail complet</div>
            <div className="text-[12.5px] text-neutral-500 mt-0.5">
              Export CSV / JSON · API documentée · hébergement français
            </div>
          </div>
        </div>
        <a
          href="#"
          className="text-[13px] font-medium text-propsight-700 hover:text-propsight-900 inline-flex items-center gap-1.5 transition-colors"
        >
          Lire la méthodologie complète
          <ArrowUpRight size={14} />
        </a>
      </motion.div>
    </div>
  </section>
);

export default DataSourcesSection;
