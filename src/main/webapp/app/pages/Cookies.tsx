import React from 'react';

const Cookies: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">Cookies</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Définition</h2>
            <p className="text-gray-700">
              Un cookie est un fichier texte déposé sur le terminal de l'utilisateur afin d'assurer le fonctionnement du site ou de mesurer
              son audience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Cookies utilisés</h2>

            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Cookies techniques (obligatoires)</h3>
            <p className="text-gray-700 mb-2">Ces cookies sont nécessaires au bon fonctionnement du Site :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>affichage correct des pages</li>
              <li>sécurité technique</li>
              <li>préférences techniques</li>
            </ul>
            <p className="text-gray-700 mt-4">Ils ne nécessitent pas de consentement.</p>

            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Cookies de mesure d'audience</h3>
            <p className="text-gray-700 mb-2">Propsight utilise Google Analytics 4 uniquement pour :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>mesurer la fréquentation</li>
              <li>analyser les pages consultées</li>
              <li>améliorer l'expérience utilisateur</li>
            </ul>
            <p className="text-gray-700 mt-4">Aucun usage publicitaire ou de profilage n'est effectué.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Consentement</h2>
            <p className="text-gray-700 mb-4">La gestion du consentement est assurée par TarteAuCitron (open-source auto-hébergé).</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Google Analytics est désactivé par défaut</li>
              <li>Il n'est activé qu'après acceptation explicite</li>
              <li>Le refus est possible sans restriction d'accès au Site</li>
              <li>Le choix peut être modifié à tout moment</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Cookies techniques :</strong> durée de session
              </li>
              <li>
                <strong>Cookies Google Analytics :</strong> 13 mois maximum
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Données transmises à Google</h2>
            <p className="text-gray-700 mb-2">En cas d'acceptation :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>adresse IP anonymisée</li>
              <li>données de navigation</li>
              <li>type d'appareil et navigateur</li>
            </ul>
            <p className="text-gray-700 mt-4">Aucune donnée personnelle identifiable (email, nom) n'est transmise.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Contact</h2>
            <p className="text-gray-700">
              📩{' '}
              <a href="mailto:contact@propsight.fr" className="hover:underline" style={{ color: 'hsl(245, 58%, 62%)' }}>
                contact@propsight.fr
              </a>
            </p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Dernière mise à jour : 5 janvier 2026</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Cookies;
