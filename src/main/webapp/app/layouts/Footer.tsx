import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const footerLinks = {
    produit: [
      { label: 'Carte des prix', href: '/PrixImmobliers' },
      // { label: 'Estimation gratuite', href: '/estimation' },
      // { label: 'Simulateur locatif', href: '/investisseurs' },
      // { label: 'Recherche multi-sites', href: '/louer' },
    ],
    ressources: [
      { label: 'À propos', href: '/TrouverAgent' },
      // { label: 'Témoignages', href: '/temoignages' },
      { label: 'Blog & analyses', href: '/blog' },
    ],
    legal: [
      { label: 'Mentions légales', href: '#' },
      { label: 'CGU', href: '#' },
      { label: 'Politique de confidentialité', href: '#' },
      { label: 'Cookies', href: '#' },
    ],
  };

  return (
    <footer className="border-t border-gray-200 text-white" style={{ backgroundColor: '#211e3b' }}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ backgroundColor: 'hsl(245 58% 62%)' }}>
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Propsight</span>
            </Link>
            <p className="text-sm text-gray-300 max-w-xs">
              La data au service de vos décisions immobilières. Accédez aux prix réels du marché.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.produit.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Ressources</h4>
            <ul className="space-y-3">
              {footerLinks.ressources.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-gray-300 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400">© 2024 Propsight. Tous droits réservés.</p>
          <p className="text-sm text-gray-400">Données DVF issues de data.gouv.fr</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
