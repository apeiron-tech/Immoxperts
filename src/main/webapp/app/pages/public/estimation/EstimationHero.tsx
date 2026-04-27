import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import EstimationFormCard from './EstimationFormCard';
import type { EstimationResult } from './lib/api';
import type { toApiRequest } from './lib/schema';

interface Props {
  onResult: (result: EstimationResult, request: ReturnType<typeof toApiRequest>) => void;
}

const PILLS: { label: string; icon?: React.ReactNode }[] = [
  { label: '✓ Gratuit' },
  { label: '✓ Sans engagement' },
  { label: 'Confidentiel', icon: <Lock size={12} className="text-slate-500" /> },
];

const EstimationHero: React.FC<Props> = ({ onResult }) => {
  return (
    <section className="bg-white">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32 }}
              className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
            >
              Estimation gratuite
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.04 }}
              className="mt-3 text-[40px] md:text-[48px] lg:text-[56px] font-medium text-slate-900 leading-[1.05] tracking-[-0.02em]"
            >
              Combien vaut votre bien ?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-5 text-[18px] lg:text-[20px] text-slate-600 leading-[1.5] max-w-[520px]"
            >
              Recevez en quelques secondes une fourchette indicative basée sur les prix réels observés dans votre secteur. Sans inscription, sans
              engagement.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.16 }}
              className="mt-7 flex flex-wrap items-center gap-2"
            >
              {PILLS.map(p => (
                <span
                  key={p.label}
                  className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-slate-50 border border-slate-200 text-[12.5px] text-slate-600"
                >
                  {p.icon}
                  {p.label}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.48, delay: 0.2 }}
          >
            <EstimationFormCard onResult={onResult} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EstimationHero;
