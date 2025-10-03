import React, { useState } from 'react';

interface StatisticsData {
  city: string;
  totalSales: number;
  medianPrice: number;
  medianPricePerSqm: number;
  propertyTypes: {
    maison: number;
    appartement: number;
    terrain: number;
    autres: number;
  };
}

interface StatisticsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  searchLocation?: string;
}

const StatisticsPopup: React.FC<StatisticsPopupProps> = ({ isOpen, onClose, searchLocation }) => {
  const [selectedCity, setSelectedCity] = useState(searchLocation || 'Bordeaux');

  // Mock data - in real app, this would come from an API
  const statisticsData: StatisticsData = {
    city: selectedCity,
    totalSales: 12797,
    medianPrice: 485000,
    medianPricePerSqm: 4250,
    propertyTypes: {
      maison: 7234,
      appartement: 4128,
      terrain: 1205,
      autres: 230,
    },
  };

  const cities = ['Bordeaux', 'Lyon', 'Marseille', 'Paris', 'Toulouse', 'Nice', 'Nantes', 'Montpellier', 'Strasbourg', 'Lille'];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9000] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Statistiques de marché</h2>
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#3B82F6" />
            </svg>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* City Selector */}
        <div className="mb-6">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="w-full p-4 bg-white border border-gray-200 rounded-xl text-base font-medium text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {cities.map(city => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Property Type Icons */}
        <div className="flex justify-around mb-6 bg-white rounded-xl p-4">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#3B82F6" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Maison</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M17 7l-10 0 0 10 10 0z M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"
                  fill="#10B981"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Appt</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="#F97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Terrain</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 3v6h8l-8-6zM3 9v12h8V9H3zM13 21h8V11h-8v10z" fill="#8B5CF6" />
              </svg>
            </div>
            <span className="text-xs text-gray-600">Autres</span>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="space-y-4">
          {/* Total Sales */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Nombre de Ventes</p>
                <p className="text-2xl font-bold text-gray-900">{statisticsData.totalSales.toLocaleString('fr-FR')}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 3v18h18" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18 17l-5-5-4 4-6-6" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Median Price */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prix Médian</p>
                <p className="text-2xl font-bold text-gray-900">{statisticsData.medianPrice.toLocaleString('fr-FR')} €</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="#10B981"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Price per sqm */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prix au m² Médian</p>
                <p className="text-2xl font-bold text-gray-900">{statisticsData.medianPricePerSqm.toLocaleString('fr-FR')} €/m²</p>
              </div>
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
                    stroke="#F97316"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M9 22V12h6v10" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Property Type Breakdown */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Répartition par type</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Maisons</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statisticsData.propertyTypes.maison.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Appartements</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statisticsData.propertyTypes.appartement.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Terrains</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statisticsData.propertyTypes.terrain.toLocaleString('fr-FR')}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Autres</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{statisticsData.propertyTypes.autres.toLocaleString('fr-FR')}</span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800">
            Plus de détails sur le marché immobilier dans ce <span className="font-medium underline">secteur géographique</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPopup;
