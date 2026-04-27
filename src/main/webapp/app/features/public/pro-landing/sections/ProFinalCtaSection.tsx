import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const BULLETS = [
  'Démo personnalisée 30 minutes',
  'Mise en route accompagnée',
  'Aucun engagement à l\'essai',
];

const ProFinalCtaSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    // demo mode — no API call
    // eslint-disable-next-line no-console
    console.log('[pro-landing] demo request', { email });
    setSent(true);
  };

  return (
    <section id="contact" className="relative bg-white py-16 lg:py-24">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[840px] mx-auto rounded-lg border border-neutral-200 bg-white p-10 lg:p-14 text-center"
        >
          <div className="relative">
            <h2 className="text-[32px] md:text-[42px] font-semibold text-neutral-900 leading-[1.1] tracking-[-0.02em]">
              Prêt à passer de la donnée à l'action ?
            </h2>
            <p className="mt-4 text-[16px] text-neutral-600 leading-relaxed max-w-[520px] mx-auto">
              Demandez une démo personnalisée. Nous vous montrons comment Propsight Pro s'adapte à votre flux métier.
            </p>

            {!sent ? (
              <form onSubmit={onSubmit} className="mt-8 flex items-center gap-2 max-w-[440px] mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@votre-agence.fr"
                  required
                  className="flex-1 h-11 px-4 rounded-lg border border-neutral-200 bg-white text-[14px] text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-propsight-400 focus:shadow-focus"
                />
                <button
                  type="submit"
                  className="h-11 px-5 rounded-lg bg-propsight-600 hover:bg-propsight-700 text-white text-[14px] font-medium flex items-center gap-2 transition-colors"
                >
                  Demander une démo
                  <ArrowRight size={14} />
                </button>
              </form>
            ) : (
              <div className="mt-8 inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-[14px] font-medium">
                <Check size={15} />
                Demande envoyée. Nous vous recontactons sous 24h.
              </div>
            )}

            <div className="mt-6 flex items-center justify-center gap-5 flex-wrap">
              {BULLETS.map(b => (
                <div key={b} className="flex items-center gap-1.5 text-[13px] text-neutral-500">
                  <Check size={12} className="text-emerald-600" />
                  {b}
                </div>
              ))}
            </div>

            <div className="mt-8 text-[13px] text-neutral-500">
              Déjà client ?{' '}
              <Link to="/app/tableau-de-bord" className="text-propsight-700 font-medium hover:underline">
                Se connecter →
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProFinalCtaSection;
