import React from 'react';

const CGU: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">Conditions Générales d'Utilisation (CGU)</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">1. Objet et acceptation</h2>
            <p className="text-gray-700 mb-4">
              Les présentes Conditions Générales d'Utilisation régissent l'accès et l'utilisation du site www.propsight.fr.
            </p>
            <p className="text-gray-700">
              En naviguant sur le Site, l'utilisateur reconnaît avoir pris connaissance des présentes CGU et les accepter sans réserve.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">2. Description du site</h2>
            <p className="text-gray-700 mb-4">Propsight est un site public, gratuit et accessible sans création de compte.</p>
            <p className="text-gray-700 mb-2">Le Site propose :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>une carte interactive des prix de ventes immobilières</li>
              <li>l'accès aux données publiques DVF</li>
              <li>un blog éditorial d'information immobilière</li>
              <li>un formulaire permettant d'être informé des nouveautés</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">3. Nature des informations fournies</h2>
            <p className="text-gray-700 mb-4">
              Les informations et données disponibles sur le Site sont fournies à titre strictement informatif.
            </p>
            <p className="text-gray-700 mb-2">Elles ne constituent en aucun cas :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>une expertise immobilière</li>
              <li>une estimation officielle de bien</li>
              <li>un conseil juridique, fiscal ou financier</li>
              <li>une recommandation d'achat, de vente ou d'investissement</li>
            </ul>
            <p className="text-gray-700 mt-4">Propsight n'est ni notaire, ni expert immobilier, ni conseiller professionnel.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">4. Données DVF – limites</h2>
            <p className="text-gray-700 mb-2">Les données DVF :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>sont publiées avec un décalage temporel</li>
              <li>peuvent contenir des erreurs ou omissions administratives</li>
              <li>ne couvrent pas certains territoires (Alsace-Moselle, Mayotte)</li>
              <li>ne garantissent pas l'exhaustivité des transactions</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Propsight ne garantit ni l'exactitude absolue, ni l'actualité, ni l'exhaustivité des données affichées.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">5. Utilisation autorisée et interdite</h2>
            <h3 className="text-xl font-semibold text-black mb-3">Utilisation autorisée</h3>
            <p className="text-gray-700 mb-4">
              L'utilisateur peut consulter librement les contenus du Site à des fins personnelles et informatives.
            </p>
            <h3 className="text-xl font-semibold text-black mb-3">Utilisations interdites</h3>
            <p className="text-gray-700 mb-2">Il est strictement interdit de :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>extraire ou collecter les données de manière automatisée (scraping)</li>
              <li>réutiliser ou revendre les données à des fins commerciales</li>
              <li>reproduire l'interface ou le code source</li>
              <li>porter atteinte au bon fonctionnement du Site</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">6. Responsabilité</h2>
            <p className="text-gray-700 mb-4">Le Site est fourni « en l'état ».</p>
            <p className="text-gray-700 mb-2">Propsight ne saurait être tenu responsable :</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>des décisions prises sur la base des informations consultées</li>
              <li>des pertes financières ou opportunités manquées</li>
              <li>des interruptions ou dysfonctionnements du Site</li>
              <li>de l'utilisation abusive des données par des tiers</li>
            </ul>
            <p className="text-gray-700 mt-4">La responsabilité de Propsight est expressément limitée à 0 €, le service étant gratuit.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">7. Évolution du site</h2>
            <p className="text-gray-700">
              Propsight se réserve le droit de modifier, suspendre ou faire évoluer le Site et ses fonctionnalités à tout moment, sans
              préavis.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">8. Droit applicable</h2>
            <p className="text-gray-700 mb-4">Les présentes CGU sont régies par le droit français.</p>
            <p className="text-gray-700">Tout litige relèvera de la compétence des juridictions françaises.</p>
          </section>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">Dernière mise à jour : 5 janvier 2026</p>
          </div>
        </article>
      </div>
    </div>
  );
};

export default CGU;
