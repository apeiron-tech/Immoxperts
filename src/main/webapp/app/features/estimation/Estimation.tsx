import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type PropertyType = 'house' | 'apartment';

interface FeatureItem {
  title: string;
  description: string;
}

const Estimation: React.FC = () => {
  const [propertyType, setPropertyType] = useState<PropertyType>('house');
  const navigate = useNavigate();

  const features: FeatureItem[] = [
    {
      title: 'Résultats instantanés :',
      description: "Pas d'attente. Notre outil vous fournit une estimation immédiate de la valeur de votre bien.",
    },
    {
      title: 'Précision basée sur les données :',
      description:
        'Nous utilisons les dernières données du marché et des algorithmes avancés pour calculer la valeur de votre maison, sans approximation.',
    },
    {
      title: 'Sans engagement :',
      description: "Ce service est totalement gratuit et sans obligation. Vous pouvez l'utiliser aussi souvent que vous le souhaitez.",
    },
    {
      title: '100 % en ligne :',
      description: 'Pas besoin de rendez-vous ni de paperasse. Obtenez votre estimation confortablement chez vous, 24 h/24, 7 j/7.',
    },
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ background: '#F9FAFB' }}>
      <div className="max-w-6xl mx-auto">
        <div className="w-full bg-gradient-to-b from-gray-400 to-white p-4 sm:p-6 md:p-10 rounded-3xl">
          <div className="bg-white max-w-lg  rounded-3xl shadow-sm p-4 sm:p-6 mb-8">
            <h2 className="text-xl font-semibold mb-2">Quelle est l'adresse du logement à estimer ?</h2>
            <p className="text-sm text-gray-600 mb-6">
              Accédez à une vaste base de données immobilières et obtenez une estimation gratuite de votre bien en ligne en quelques
              secondes.
            </p>

            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Entrez une adresse"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <label className="sm:flex-1">
                <input type="radio" className="hidden" checked={propertyType === 'house'} onChange={() => setPropertyType('house')} />
                <div
                  className={`cursor-pointer rounded-lg p-3 text-center border ${
                    propertyType === 'house' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-200'
                  }`}
                >
                  Maison
                </div>
              </label>
              <label className="sm:flex-1">
                <input
                  type="radio"
                  className="hidden"
                  checked={propertyType === 'apartment'}
                  onChange={() => setPropertyType('apartment')}
                />
                <div
                  className={`cursor-pointer rounded-lg p-3 text-center border ${
                    propertyType === 'apartment' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'border-gray-200'
                  }`}
                >
                  Appartement
                </div>
              </label>
            </div>

            <button
              onClick={() => navigate('/EstimationRechercher')}
              className="w-full bg-emerald-500 text-white py-3 rounded-lg hover:bg-emerald-600 transition-colors"
              style={{ background: '#44CE9B' }}
            >
              Rechercher
            </button>
          </div>
        </div>
        <div className="mb-2 bg-white px-2 my-4 rounded-3xl border">
          <div className="text-center mb-8 mt-10 bg-gray-100 p-4 sm:p-6 m-4 sm:m-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">
              Obtenez une estimation immédiate de la valeur
              <br />
              de votre maison
            </h2>
            <p className="text-sm text-gray-600">Essayez notre outil d'évaluation immobilière en ligne gratuit</p>
          </div>

          <div className="space-y-6 p-4 sm:p-6">
            {features.map((item, index) => (
              <div key={index}>
                <h3 className="font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estimation;
