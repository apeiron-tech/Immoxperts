import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Calculator, TrendingUp, Activity, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import FloatingMapPreview from '../components/FloatingMapPreview';

const EXAMPLES = ['Paris 15e', 'Lyon', 'Bordeaux', 'Nantes', 'Marseille'];

const KPIS = [
  { num: '+ 50 M', label: 'transactions immobilières', sub: 'analysées depuis 2014' },
  { num: '36 247', label: 'communes couvertes', sub: 'France métropolitaine et DOM' },
  { num: '1,2 M', label: 'annonces analysées chaque mois', sub: 'achat et location' },
  { num: '100%', label: 'données publiques officielles', sub: 'DVF, ADEME, INSEE' },
];

const HomeHero: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const onSearch = (q: string) => {
    if (q.trim()) navigate(`/PrixImmobliers?search=${encodeURIComponent(q)}`);
    else navigate('/PrixImmobliers');
  };

  return (
    <section className="relative overflow-hidden bg-white">
      {/* One subtle ambient — kept light, single source */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-propsight-50/60 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-8 pt-14 pb-20 lg:pt-20 lg:pb-28">
        <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-12 lg:gap-16 items-start">
          {/* Left : copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-6"
            >
              <span className="section-eyebrow">Plateforme immobilière française</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
              className="display-headline text-[48px] md:text-[60px] lg:text-[72px]"
            >
              Toute la donnée immobilière française, enfin{' '}
              <span className="bg-gradient-to-r from-propsight-700 via-propsight-500 to-propsight-400 bg-clip-text text-transparent">
                claire
              </span>
              .
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
              className="mt-6 text-[17px] text-neutral-600 leading-[1.65] max-w-[600px]"
            >
              Prix de vente, loyers, performance énergétique, équipements et démographie.
              Estimez un bien, comparez les quartiers, simulez un investissement locatif —
              le tout depuis une seule plateforme, alimentée par les sources publiques officielles.
            </motion.p>

            {/* Search bar */}
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
              onSubmit={e => {
                e.preventDefault();
                onSearch(query);
              }}
              className="mt-9 flex items-center h-14 rounded-2xl border border-neutral-200 bg-white max-w-[580px] group transition-colors focus-within:border-propsight-400 focus-within:shadow-focus"
            >
              <Search size={17} className="ml-5 text-neutral-400 group-focus-within:text-propsight-600 transition-colors" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Adresse, ville ou code postal"
                className="flex-1 px-3.5 h-full bg-transparent text-[15px] text-neutral-900 placeholder-neutral-400 focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1.5 h-11 px-4 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-medium flex items-center gap-1.5 transition-colors"
              >
                Rechercher
                <ArrowRight size={13} />
              </button>
            </motion.form>

            {/* Examples */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.32 }}
              className="mt-4 flex items-center gap-1.5 flex-wrap"
            >
              <span className="text-[12.5px] text-neutral-500 mr-1">Exemples :</span>
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => onSearch(ex)}
                  className="text-[12.5px] text-neutral-700 hover:text-propsight-700 hover:bg-propsight-50 px-2 py-1 rounded-md transition-colors"
                >
                  {ex}
                </button>
              ))}
            </motion.div>

            {/* KPI tiles — Inter typo, big numbers */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
              }}
              className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3"
            >
              {KPIS.map(k => (
                <motion.div
                  key={k.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                  }}
                  className="stat-tile"
                >
                  <div className="stat-tile__num">{k.num}</div>
                  <div className="stat-tile__label">{k.label}</div>
                  <div className="stat-tile__sub">{k.sub}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Sources line — Inter, natural sentence */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-8 text-[12.5px] text-neutral-500 leading-relaxed max-w-[640px]"
            >
              <span className="font-medium text-neutral-700">Sources publiques officielles :</span>{' '}
              base DVF (DGFiP), diagnostics ADEME, statistiques INSEE, Base Adresse Nationale,
              Base Permanente des Équipements.
            </motion.p>
          </div>

          {/* Right : floating map preview + estimation card */}
          <div className="relative">
            <FloatingMapPreview />

            {/* Live activity ping — top-right */}
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 1.05 }}
              className="hidden lg:flex absolute -top-4 -right-4 items-center gap-2 z-20 rounded-lg border border-neutral-200 bg-white shadow-sm pl-2.5 pr-3 py-2"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <div>
                <div className="text-[10.5px] font-semibold text-neutral-900 leading-tight">12 ventes aujourd&apos;hui</div>
                <div className="text-[9.5px] text-neutral-500 leading-tight">Paris 15e · DVF live</div>
              </div>
            </motion.div>

            {/* Signal détecté — middle-left, gradient accent */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 1.25 }}
              className="hidden lg:block absolute left-[-44px] top-[210px] w-[220px] z-20 rounded-lg border border-neutral-200 bg-white shadow-md overflow-hidden"
            >
              <span
                aria-hidden
                className="block h-[3px] w-full"
                style={{ background: 'var(--ps-signature-gradient)' }}
              />
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Sparkles size={11} className="text-propsight-600" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-propsight-700">
                    Signal détecté
                  </span>
                </div>
                <div className="text-[12px] font-semibold text-neutral-900 leading-snug">
                  Quartier sous-coté
                </div>
                <div className="text-[10.5px] text-neutral-500 mt-0.5 leading-snug">
                  Vaugirard sud · prix &minus;8&nbsp;% vs comparables
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-700 font-medium">
                  <Activity size={10} />
                  Forte tension locative
                </div>
              </div>
            </motion.div>

            {/* Estimation rapide — static floating card (no infinite anim) */}
            <motion.div
              initial={{ opacity: 0, y: 16, x: 12 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.85 }}
              className="hidden lg:flex absolute -right-6 -bottom-12 w-[244px] p-4 flex-col gap-3 z-20 rounded-lg border border-neutral-200 bg-white shadow-md"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-propsight-50 flex items-center justify-center">
                  <Calculator size={15} className="text-propsight-600" />
                </div>
                <div>
                  <div className="text-[12.5px] font-semibold text-neutral-900">Estimation rapide</div>
                  <div className="text-[11px] text-neutral-500">68 m², Paris 15e</div>
                </div>
              </div>
              <div>
                <div className="text-[11px] text-neutral-500">Valeur estimée</div>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-[22px] font-semibold text-neutral-900 tabular-nums tracking-tight">
                    632 000 €
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium inline-flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    +4,2%
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">Fourchette : 605 000 — 658 000 €</div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/estimation')}
                className="h-8 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-[12px] font-medium transition-colors"
              >
                Affiner mon estimation
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
