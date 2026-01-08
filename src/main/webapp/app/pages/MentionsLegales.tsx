import React from 'react';

const MentionsLegales: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 max-w-4xl">
        <article className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">Mentions légales</h1>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Identification du site</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Nom du site :</strong> Propsight
              </li>
              <li>
                <strong>Raison sociale :</strong> Propsight
              </li>
              <li>
                <strong>Forme juridique :</strong> Société par Actions Simplifiée (SAS)
              </li>
              <li>
                <strong>SIREN :</strong> 933 492 332
              </li>
              <li>
                <strong>Adresse du siège social :</strong> 8 impasse Duval, 93200 Saint-Denis, France
              </li>
              <li>
                <strong>RCS :</strong> Bobigny
              </li>
              <li>
                <strong>Responsable de la publication :</strong> Adam Gasmi
              </li>
              <li>
                <strong>Email de contact :</strong> contact@propsight.fr
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Hébergement</h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Hébergeur :</strong> Google Cloud Platform (Google Ireland Limited)
              </li>
              <li>
                <strong>Adresse :</strong> Gordon House, Barrow Street, Dublin 4, Irlande
              </li>
              <li>
                <strong>Pays d'hébergement :</strong> Union européenne
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Propriété intellectuelle</h2>
            <p className="text-gray-700 mb-4">
              L'ensemble des éléments composant le site Propsight (textes, graphiques, interfaces, logo, mise en page, structure, code
              source) est protégé par le droit de la propriété intellectuelle et demeure la propriété exclusive de Propsight.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Données immobilières</h2>
            <p className="text-gray-700 mb-4">
              Les données immobilières affichées sur Propsight proviennent de sources publiques officielles, notamment le fichier DVF
              (Demandes de Valeurs Foncières) publié par data.gouv.fr et administré par le Ministère de l'Économie.
            </p>
            <p className="text-gray-700 mb-4">Ces données sont mises à disposition sous Licence Ouverte / Etalab.</p>
            <p className="text-gray-700">
              Propsight assure uniquement leur visualisation, agrégation, mise en forme et accessibilité, sans en modifier le contenu
              substantiel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Interdictions</h2>
            <p className="text-gray-700">
              Toute reproduction, extraction massive, automatisation, réutilisation commerciale ou redistribution des contenus et données
              affichés sur le site est strictement interdite sans autorisation écrite préalable.
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

export default MentionsLegales;
