import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3 } from 'lucide-react';

const PILLS = [
  { label: '✓ Gratuit' },
  { label: '✓ Sans inscription' },
  { label: 'Données DVF officielles', icon: BarChart3 },
];

const InvestHero: React.FC = () => {
  return (
    <section className="relative bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-16 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
            >
              Investir dans la pierre
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04, ease: [0.22, 1, 0.36, 1] }}
              className="mt-3 text-[40px] md:text-[48px] lg:text-[56px] font-medium text-slate-900 leading-[1.05] tracking-[-0.02em]"
            >
              Investir dans l&rsquo;immobilier en confiance.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-[18px] lg:text-[20px] text-slate-600 leading-[1.5] max-w-[560px]"
            >
              Testez un projet locatif en quelques secondes. Rendement, cash-flow, effort mensuel : les chiffres essentiels pour décider, expliqués
              simplement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/investissement/simulateur"
                className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-semibold transition-colors w-full sm:w-auto justify-center"
              >
                Lancer la simulation
                <ArrowRight size={14} />
              </Link>
              <a
                href="#exemple"
                className="inline-flex items-center h-11 px-5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[14px] font-medium text-slate-700 transition-colors w-full sm:w-auto justify-center"
              >
                Voir un exemple
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 flex flex-wrap items-center gap-2"
            >
              {PILLS.map(p => {
                const Icon = p.icon;
                return (
                  <span
                    key={p.label}
                    className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] text-slate-600"
                  >
                    {Icon ? <Icon size={12} className="text-propsight-600" /> : null}
                    {p.label}
                  </span>
                );
              })}
            </motion.div>
          </div>

          {/* Mockup statique simulateur */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.48, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
            aria-hidden
          >
            <div className="rounded-lg border border-slate-200 bg-white shadow-sm p-6">
              <div className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Simulation d&rsquo;un T2</div>
              <div className="text-[15px] text-slate-700 mt-1">Lyon 69003</div>

              <div className="mt-5 space-y-2 font-mono text-[13.5px] tabular-nums">
                <div className="flex justify-between text-slate-700">
                  <span>Prix d&rsquo;achat</span>
                  <span>180&nbsp;000&nbsp;€</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Loyer mensuel</span>
                  <span>720&nbsp;€</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Apport</span>
                  <span>36&nbsp;000&nbsp;€</span>
                </div>
              </div>

              <div className="my-5 h-px bg-slate-200" />
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Résultats</div>

              <div className="mt-3 space-y-2 font-mono text-[13.5px] tabular-nums">
                <div className="flex justify-between">
                  <span className="text-slate-700">Rendement brut</span>
                  <span className="text-propsight-700 font-semibold">4,8 %</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Cash-flow mensuel</span>
                  <span className="text-emerald-700 font-semibold">+120&nbsp;€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-700">Effort net</span>
                  <span className="text-rose-700 font-semibold">-280&nbsp;€</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default InvestHero;
