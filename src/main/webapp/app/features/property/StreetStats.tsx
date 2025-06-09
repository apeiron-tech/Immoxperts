import React from 'react';
import { ChevronRight, Search, TrendingUp } from 'lucide-react';

interface PriceCardProps {
  type: string;
  price: string;
  change: string;
  isPositive: boolean;
}

interface TransactionCardProps {
  type: string;
  count: number;
}

interface AgencyCardProps {
  name: string;
  type: string;
}

const HeaderBar: React.FC = () => (
  <div className="bg-white shadow-sm p-4 flex flex-col md:flex-row items-center justify-between border">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 md:mb-0 w-full md:w-auto overflow-x-auto">
      <a href="#" className="hover:text-blue-600 whitespace-nowrap">
        Occitanie
      </a>
      <ChevronRight size={16} className="flex-shrink-0" />
      <a href="#" className="hover:text-blue-600 whitespace-nowrap">
        Haute-Garonne
      </a>
      <ChevronRight size={16} className="flex-shrink-0" />
      <a href="#" className="hover:text-blue-600 whitespace-nowrap">
        Toulouse
      </a>
      <ChevronRight size={16} className="flex-shrink-0" />
      <span className="text-gray-900 whitespace-nowrap">Grande-rue Saint Michel</span>
    </div>
    <div className="w-full md:w-1/2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input type="text" placeholder="Entrez une adresse" className="w-full bg-gray-50 py-2 md:py-4 px-10 rounded-lg" />
      </div>
    </div>
  </div>
);

const PriceGraph: React.FC = () => {
  const years = ['2015', '2017', '2019', '2021', '2023'];
  const height = 200;
  const width = 400;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm h-full">
      <div className="mb-4">
        <h3 className="text-sm text-gray-600">Evolution du prix au m²</h3>
      </div>
      <div className="relative overflow-x-auto" style={{ height: `${height}px` }}>
        <svg width={width} height={height} className="overflow-visible">
          <text x="0" y="40" className="text-xs fill-gray-400">
            4800€/m²
          </text>
          <text x="0" y="100" className="text-xs fill-gray-400">
            4400€/m²
          </text>
          <text x="0" y="160" className="text-xs fill-gray-400">
            4000€/m²
          </text>

          {years.map((year, i) => (
            <text
              key={year}
              x={60 + (i * (width - 80)) / (years.length - 1)}
              y={height - 10}
              className="text-xs fill-gray-400"
              textAnchor="middle"
            >
              {year}
            </text>
          ))}

          <path
            d={`M 60,160
                L 140,150
                L 220,130
                L 300,90
                L 380,110`}
            fill="none"
            stroke="#FF4B91"
            strokeWidth="2"
          />

          <circle cx="60" cy="160" r="4" fill="#FF4B91" />
          <circle cx="140" cy="150" r="4" fill="#FF4B91" />
          <circle cx="220" cy="130" r="4" fill="#FF4B91" />
          <circle cx="300" cy="90" r="4" fill="#FF4B91" />
          <circle cx="380" cy="110" r="4" fill="#FF4B91" />
        </svg>
      </div>
    </div>
  );
};

const PriceCard: React.FC<PriceCardProps> = ({ type, price, change, isPositive }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-sm text-gray-600 mb-2">{type} - Prix au m² moyen</h3>
    <div className="flex items-baseline gap-3">
      <span className="text-2xl font-semibold">{price}€/m²</span>
      <span className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>{change}</span>
    </div>
  </div>
);

const TransactionCard: React.FC<TransactionCardProps> = ({ type, count }) => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
    <h3 className="text-sm text-gray-600 mb-2">{type} - Ventes</h3>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold">{count}</span>
      <span className="text-sm text-gray-600">Nombre de transactions depuis 2014</span>
    </div>
  </div>
);

const AgencyCard: React.FC<AgencyCardProps> = ({ name, type }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-3">
    <div className="mb-3 sm:mb-0">
      <h3 className="font-medium">{name}</h3>
      <p className="text-sm text-gray-600">{type}</p>
    </div>
    <button className="w-full sm:w-auto flex justify-center items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M5.84434 9.53351C6.20034 9.95451 9.39134 13.6525 12.0113 13.6525C14.6343 13.6525 17.7933 9.95151 18.1443 9.52951C18.4093 9.21251 18.3663 8.73951 18.0493 8.47451C17.7293 8.20951 17.2583 8.25251 16.9923 8.56951C15.8363 9.95451 13.4613 12.1525 12.0113 12.1525C10.5593 12.1525 8.16234 9.95251 6.99134 8.56651C6.72434 8.24951 6.25134 8.20951 5.93534 8.47651C5.61834 8.74351 5.57834 9.21651 5.84434 9.53351Z"
          fill="white"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M1.72656 12.0001C1.72656 19.2851 4.41556 21.8671 11.9996 21.8671C19.5846 21.8671 22.2736 19.2851 22.2736 12.0001C22.2736 4.71506 19.5846 2.13306 11.9996 2.13306C4.41556 2.13306 1.72656 4.71506 1.72656 12.0001ZM3.22656 12.0001C3.22656 5.58806 5.27656 3.63306 11.9996 3.63306C18.7236 3.63306 20.7736 5.58806 20.7736 12.0001C20.7736 18.4121 18.7236 20.3671 11.9996 20.3671C5.27656 20.3671 3.22656 18.4121 3.22656 12.0001Z"
          fill="white"
        />
      </svg>
      Contacter
    </button>
  </div>
);

const StreetStats: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 rounded">
        <HeaderBar />

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row items-baseline justify-between mb-6 bg-white py-8 px-6 border">
            <h1 className="text-2xl font-semibold mb-2 sm:mb-0">Grande-rue Saint Michel</h1>
            <span className="text-gray-600">31400 Toulouse</span>
          </div>

          <section className="mb-2 bg-white p-6 m-4 sm:m-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Prix au m² de l'immobilier</h2>
            <p className="text-sm text-gray-600 mb-6">
              Evolution des prix au m² des appartements et des maisons dans le quartier Saint-Michel
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PriceCard type="Appartements" price="4 210" change="+0.4%" isPositive={true} />
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <h3 className="text-sm text-gray-600 mb-2">Maisons - Prix au m² moyen</h3>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-semibold">4 804€/m²</span>
                    <span className="text-sm text-red-600">-1.4%</span>
                  </div>
                  <PriceGraph />
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-8">
              Dans le quartier Saint-Michel, le prix moyen des appartements au mois de décembre 2024 est de 4 210€/m² (en hausse de 0.4% sur
              12 mois). Le prix moyen des maisons au mois de décembre 2024 est de 4 804€/m² (en baisse de 1.4% sur 12 mois).
            </p>
          </section>

          <section className="mb-2 bg-white p-6 m-4 sm:m-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Ventes immobilières réalisées (DVF)</h2>
            <p className="text-sm text-gray-600 mb-6">
              Nombre total de transactions d'appartements et de maisons depuis 2014 Grande-rue Saint Michel
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TransactionCard type="Appartements" count={311} />
              <TransactionCard type="Maisons" count={9} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Grande-rue Saint Michel, il y a eu 311 appartements vendus et 9 maisons vendues depuis 2014.
            </p>
          </section>

          <section className="mb-12 bg-white p-6 m-4 sm:m-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Contactez un professionnel à proximité</h2>
            <p className="text-sm text-gray-600 mb-6">
              Vous vendez ? Faites estimer gratuitement la valeur de votre bien par un professionnel à proximité
            </p>
            <div>
              <AgencyCard name="INIAMO" type="Agence immobilière indépendante" />
              <AgencyCard name="Human immobilier" type="Agence immobilière indépendante" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StreetStats;
