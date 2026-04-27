import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const POINTS = [
  {
    title: 'Données publiques officielles',
    description: 'Transactions DVF, annonces agrégées, INSEE. Toutes nos sources sont publiques et vérifiables.',
  },
  {
    title: 'Mise à jour régulière',
    description: 'Les données sont rafraîchies chaque semaine. Votre fourchette reflète le marché récent.',
  },
  {
    title: 'L’humain fait la différence',
    description: 'Un conseiller voit ce qu’un algorithme ne voit pas : la lumière, le bruit, la qualité de l’immeuble, l’ambiance du quartier.',
  },
];

const LimitationsSection: React.FC = () => (
  <section className="bg-slate-50 py-20">
    <div className="max-w-[1200px] mx-auto px-5 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4 }}
            className="text-[28px] md:text-[36px] font-medium text-slate-900 leading-[1.15] tracking-[-0.02em]"
          >
            Une fourchette, pas un avis de valeur.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="mt-4 text-[16px] text-slate-600 leading-[1.6]"
          >
            Notre estimation en ligne s&rsquo;appuie sur les prix observés dans votre quartier et sur les caractéristiques que vous avez saisies. Elle
            vous donne une première idée, utile avant toute décision. Pour un chiffrage précis tenant compte de l&rsquo;état exact, des prestations,
            du contexte de copropriété et du marché local, un conseiller reste indispensable.
          </motion.p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-10%' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } } }}
          className="space-y-6"
        >
          {POINTS.map(p => (
            <motion.li
              key={p.title}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="flex gap-3"
            >
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-propsight-100 flex items-center justify-center mt-0.5">
                <Check size={13} className="text-propsight-700" />
              </span>
              <div>
                <div className="text-[16px] font-medium text-slate-900">{p.title}</div>
                <p className="mt-1 text-[15px] text-slate-600 leading-relaxed">{p.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </div>
  </section>
);

export default LimitationsSection;
