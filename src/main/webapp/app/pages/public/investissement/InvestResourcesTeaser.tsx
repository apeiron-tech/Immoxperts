import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    title: 'Comprendre le rendement locatif',
    description: 'Brut, net, net-net : les trois chiffres à distinguer avant d’investir.',
    slug: '/ressources/rendement-locatif',
  },
  {
    title: 'Où investir aujourd’hui ?',
    description: 'Ce que disent les transactions récentes sur la tension et les prix en France.',
    slug: '/ressources/ou-investir',
  },
  {
    title: 'Nu, meublé, colocation',
    description: 'Trois modes d’exploitation, trois profils de rendement. Choisir selon votre horizon.',
    slug: '/ressources/modes-exploitation',
  },
];

const InvestResourcesTeaser: React.FC = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
        <div className="max-w-[640px] mb-12">
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.32 }}
            className="text-[11px] font-semibold text-propsight-600 uppercase tracking-[0.12em]"
          >
            Pour aller plus loin
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.04 }}
            className="mt-2 text-[28px] md:text-[36px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
          >
            Les bases, sans détour.
          </motion.h2>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {ARTICLES.map(a => (
            <motion.div
              key={a.slug}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
              }}
            >
              <Link
                to={a.slug}
                className="group block h-full rounded-lg border border-slate-200 bg-white p-7 hover:border-propsight-200 transition-colors"
              >
                <h3 className="text-[18px] font-medium text-slate-900 tracking-tight">{a.title}</h3>
                <p className="mt-2 text-[14px] text-slate-600 leading-relaxed">{a.description}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-propsight-700 group-hover:gap-2 transition-all">
                  Lire
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default InvestResourcesTeaser;
