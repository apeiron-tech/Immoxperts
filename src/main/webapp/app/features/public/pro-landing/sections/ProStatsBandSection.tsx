import React from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { value: '+ 50 M', label: 'transactions DVF analysées', sub: 'Depuis 2014' },
  { value: '23,4 M', label: 'logements diagnostiqués', sub: 'DPE temps réel' },
  { value: '36 247', label: 'communes couvertes', sub: 'France entière' },
  { value: '40+', label: 'sources publiques croisées', sub: 'DVF · ADEME · INSEE' },
];

const ProStatsBandSection: React.FC = () => (
  <section className="relative bg-white pt-2 pb-14 lg:pb-16">
    <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-lg border border-neutral-200 bg-white"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y divide-neutral-200 lg:divide-y-0 lg:divide-x lg:divide-neutral-200">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.4, delay: 0.05 + i * 0.05 }}
              className="px-6 py-7 lg:py-9 flex flex-col"
            >
              <span className="text-[34px] lg:text-[40px] font-semibold text-neutral-900 tracking-[-0.025em] tabular-nums leading-none">
                {s.value}
              </span>
              <span className="mt-3 text-[13.5px] font-medium text-neutral-800 leading-snug">{s.label}</span>
              <span className="mt-1 text-[12px] text-neutral-500">{s.sub}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProStatsBandSection;
