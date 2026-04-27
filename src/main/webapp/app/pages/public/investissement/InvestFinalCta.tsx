import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const InvestFinalCta: React.FC = () => {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-[680px] mx-auto px-5 lg:px-8 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4 }}
          className="text-[28px] md:text-[36px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
        >
          Prêt à chiffrer votre projet ?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4, delay: 0.06 }}
          className="mt-4 text-[16px] md:text-[18px] text-slate-600 leading-relaxed"
        >
          Quelques champs, trois chiffres, aucun engagement.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="mt-8 flex justify-center"
        >
          <Link
            to="/investissement/simulateur"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-semibold transition-colors"
          >
            Lancer la simulation
            <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestFinalCta;
