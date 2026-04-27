import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, LineChart, Bell, Radar } from 'lucide-react';

const BENEFITS = [
  { icon: Building2, label: 'Portefeuille mandats unifié', sub: 'Annonces, DVF, signaux territoriaux' },
  { icon: LineChart, label: 'Pilotage commercial', sub: 'Pipe pondéré, performance, équipe' },
  { icon: Radar, label: 'Prospection intelligente', sub: 'Signaux DPE, mandats expirants' },
  { icon: Bell, label: 'Veille actionnable', sub: 'Alertes priorisées, jamais chronologiques' },
];

const ProTeaserSection: React.FC = () => (
  <section className="relative bg-white py-16 lg:py-20">
    <div className="relative max-w-[1240px] mx-auto px-5 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-neutral-200 bg-white overflow-hidden"
      >
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          {/* Left : copy + CTA */}
          <div className="p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-neutral-200">
            <span className="text-[11px] font-semibold text-propsight-600 uppercase tracking-wider">
              Propsight Pro
            </span>
            <h2 className="mt-3 text-[28px] md:text-[34px] font-semibold text-neutral-900 leading-[1.15] tracking-[-0.02em]">
              La même donnée, en cockpit métier.
            </h2>
            <p className="mt-4 text-[15px] text-neutral-600 leading-relaxed max-w-[460px]">
              Pour les agents, mandataires et équipes immobilières. Détection, estimation,
              prospection et pilotage commercial — depuis une seule application.
            </p>

            <div className="mt-8 flex items-center gap-3 flex-wrap">
              <Link
                to="/pro"
                className="h-10 px-4 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-medium flex items-center gap-2 transition-colors"
              >
                Découvrir Propsight Pro
                <ArrowRight size={14} />
              </Link>
              <Link
                to="/pro#contact"
                className="h-10 px-4 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-800 text-[14px] font-medium flex items-center transition-colors"
              >
                Demander une démo
              </Link>
            </div>
          </div>

          {/* Right : benefit list */}
          <div className="p-8 lg:p-12 bg-neutral-50">
            <ul className="space-y-5">
              {BENEFITS.map(b => {
                const Icon = b.icon;
                return (
                  <li key={b.label} className="flex items-start gap-3.5">
                    <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-neutral-200 text-propsight-700 flex items-center justify-center">
                      <Icon size={15} strokeWidth={2.2} />
                    </span>
                    <div>
                      <div className="text-[14px] font-semibold text-neutral-900 tracking-tight">{b.label}</div>
                      <div className="mt-0.5 text-[13px] text-neutral-500 leading-relaxed">{b.sub}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProTeaserSection;
