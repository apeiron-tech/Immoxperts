import React from 'react';
import { FiTwitter, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ImmoXpert</h3>
            <p className="text-gray-400 text-sm">
              est votre plateforme de référence pour la location et l&apos;achat de maisons et d&apos;appartements en France
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">L&apos;entreprise</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Qui sommes-nous ?
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Notre espace presse
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Nouveauté
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">À Découvrir</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Acheter
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Louer
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Estimer
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Tendances
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Termes et conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Confidentialité
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-6">
              <h4 className="font-bold mb-2">Adresse</h4>
              <p className="text-gray-400">
                7 rue des Fleurs
                <br />
                37000 Tours
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2">Renseignements</h4>
              <p className="text-gray-400">+33 6 11 22 33 44</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-2">Retrouvez-nous sur ...</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiYoutube size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-6 text-sm text-gray-500">
          <p>Copyright © 2025 Hestia Immo | Powered by Apeiron Technologies</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
