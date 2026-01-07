import React from 'react';

const PolitiqueConfidentialite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">Politique de confidentialité</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Responsable du traitement</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Responsable :</strong> Propsight
              </li>
              <li>
                <strong>Responsable légal :</strong> Adam Gasmi
              </li>
              <li>
                <strong>Adresse :</strong> 8 impasse Duval, 93200 Saint-Denis
              </li>
              <li>
                <strong>Email :</strong> contact@propsight.fr
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Données collectées</h2>
            <p className="text-gray-700 mb-4">Propsight collecte uniquement :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>
                <strong>Adresse email</strong>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">Cette donnée est fournie volontairement via le formulaire « Être prévenu des nouveautés ».</p>
            <p className="text-gray-700">Aucun compte utilisateur n'est créé.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Finalité</h2>
            <p className="text-gray-700 mb-2">L'adresse email est utilisée exclusivement pour :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>informer l'utilisateur du lancement de nouveaux modules ou fonctionnalités Propsight</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Base légale</h2>
            <p className="text-gray-700">Le traitement repose sur le consentement explicite de l'utilisateur.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Durée de conservation</h2>
            <p className="text-gray-700 mb-2">Les données sont conservées :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>jusqu'au désabonnement</li>
              <li>ou 3 ans maximum après le dernier contact</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Destinataires</h2>
            <p className="text-gray-700 mb-2">Les données :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>ne sont ni vendues, ni louées, ni cédées</li>
              <li>sont hébergées techniquement par Google Cloud Platform</li>
              <li>ne sont accessibles qu'à Propsight</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Sécurité</h2>
            <p className="text-gray-700 mb-2">Propsight met en œuvre des mesures raisonnables de sécurité :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>chiffrement HTTPS</li>
              <li>accès restreint</li>
              <li>hébergement sécurisé</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Droits des utilisateurs</h2>
            <p className="text-gray-700 mb-4">Conformément au RGPD, l'utilisateur dispose des droits :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>d'accès</li>
              <li>de rectification</li>
              <li>de suppression</li>
              <li>d'opposition</li>
            </ul>
            <p className="text-gray-700 mt-4">
              📩{' '}
              <a href="mailto:contact@propsight.fr" className="text-purple-600 hover:underline" style={{ color: 'hsl(245, 58%, 62%)' }}>
                contact@propsight.fr
              </a>
            </p>
            <p className="text-gray-700">Délai de réponse : 30 jours maximum.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">9. Autorité de contrôle</h2>
            <p className="text-gray-700">
              CNIL –{' '}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: 'hsl(245, 58%, 62%)' }}
              >
                www.cnil.fr
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

export default PolitiqueConfidentialite;
