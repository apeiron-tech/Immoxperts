import React from 'react';
import { Link } from 'react-router-dom';
import PublicLogo from './PublicLogo';

export type PublicFooterVariant = 'full' | 'minimal';

interface Props {
  variant?: PublicFooterVariant;
}

interface Column {
  title: string;
  links: { label: string; href: string }[];
}

const COLUMNS: Column[] = [
  {
    title: 'Produit',
    links: [
      { label: 'Prix immobiliers', href: '/PrixImmobliers' },
      { label: 'Acheter / Louer', href: '/achat' },
      { label: 'Investissement', href: '/investissement' },
      { label: 'Espace Pro', href: '/pro' },
    ],
  },
  {
    title: 'Ressources',
    links: [
      { label: 'Blog & analyses', href: '/blog' },
      { label: 'Méthodologie DVF', href: '/blog' },
      { label: 'Données utilisées', href: '/blog' },
      { label: 'FAQ', href: '/blog' },
    ],
  },
  {
    title: 'Société',
    links: [
      { label: 'À propos', href: '/apropos' },
      { label: 'Témoignages', href: '/temoignages' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Légal',
    links: [
      { label: 'Confidentialité', href: '/politique-de-confidentialite' },
      { label: 'CGU', href: '/cgu' },
      { label: 'Mentions légales', href: '/mentions-legales' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
];

const PublicFooter: React.FC<Props> = ({ variant = 'full' }) => {
  if (variant === 'minimal') {
    return (
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-[12.5px] text-slate-500">
            <span>© {new Date().getFullYear()} Propsight</span>
            <span className="text-slate-300">·</span>
            <span>Données publiques DVF / ADEME / INSEE</span>
          </div>
          <nav className="flex items-center gap-4 text-[12.5px] text-slate-500">
            <Link to="/politique-de-confidentialite" className="hover:text-slate-800">
              Confidentialité
            </Link>
            <Link to="/pro" className="hover:text-slate-800">
              Espace Pro
            </Link>
          </nav>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="max-w-[1240px] mx-auto px-5 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2">
            <PublicLogo />
            <p className="mt-4 text-[13px] text-slate-500 leading-relaxed max-w-xs">
              La donnée immobilière qui vous aide à acheter, louer, investir et estimer avec plus de confiance.
            </p>
          </div>
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h4 className="text-[12px] font-semibold text-slate-900 tracking-tight mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link.label}>
                    {link.href.startsWith('/') ? (
                      <Link to={link.href} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-[13px] text-slate-500 hover:text-slate-900 transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-slate-400">
            © {new Date().getFullYear()} Propsight SASU · Siège Paris, France
          </p>
          <p className="text-[12px] text-slate-400">
            Données DVF & ADEME & INSEE · Mises à jour en continu
          </p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
