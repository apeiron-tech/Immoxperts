import React from 'react';
import { Link } from 'react-router-dom';
import { FiLinkedin, FiTwitter } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import { Home } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: '#211e3b' }} className="text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 px-16">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(245 58% 62%)' }}>
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Propsight</span>
            </div>
            <p className="text-gray-300 text-smll mb-6 leading-relaxed">
              Toute l'immobilier, en un seul endroit. Explorez le marché, estimez votre bien et simulez vos investissements.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition hover:opacity-80"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition hover:opacity-80"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="Twitter"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg flex items-center justify-center transition hover:opacity-80"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold mb-4 text-base">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/acheter" className="text-gray-300 hover:text-white transition text-sml">
                  Acheter
                </Link>
              </li>
              <li>
                <Link to="/louer" className="text-gray-300 hover:text-white transition text-sml">
                  Louer
                </Link>
              </li>
              <li>
                <Link to="/estimation" className="text-gray-300 hover:text-white transition text-sml">
                  Estimation
                </Link>
              </li>
              <li>
                <Link to="/investisseurs" className="text-gray-300 hover:text-white transition text-sml">
                  Investisseurs
                </Link>
              </li>
              <li>
                <Link to="/PrixImmobliers" className="text-gray-300 hover:text-white transition text-sml">
                  Prix immobiliers
                </Link>
              </li>
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h4 className="font-bold mb-4 text-base">Entreprise</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/TrouverAgent" className="text-gray-300 hover:text-white transition text-sml">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/pack-pro" className="text-gray-300 hover:text-white transition text-sml">
                  Pack Pro
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition text-sml">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h4 className="font-bold mb-4 text-base">Légal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition text-sml">
                  Mentions légales
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition text-sml">
                  CGU
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition text-sml">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-gray-700 mt-12 pt-6">
          <p className="text-gray-400 text-sml text-center">Copyright © 2025 Propsight | Powered by Apeiron Technologies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
