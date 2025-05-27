import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Agent {
  id: number;
  name: string;
  avatar: string;
  address: string;
  city: string;
  postalCode: string;
  localTransactions: number;
  totalTransactions: number;
  averagePrice: string;
  agency?: {
    name: string;
    logo: string;
  };
}

interface Agency {
  id: number;
  name: string;
  logo: string;
  address: string;
  city: string;
  postalCode: string;
  localTransactions: number;
  totalTransactions: number;
  averagePrice: string;
  rating: number;
  agents: {
    id: number;
    name: string;
    avatar: string;
  }[];
}

const agencies: Agency[] = [
  {
    id: 1,
    name: 'Orpi Saint Georges',
    logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80',
    address: 'Boulevard Lazare Carnot 57',
    city: 'Toulouse',
    postalCode: '31000',
    localTransactions: 30,
    totalTransactions: 38,
    averagePrice: '210K EUR',
    rating: 5,
    agents: [
      {
        id: 1,
        name: 'Marie Dupont',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80',
      },
      {
        id: 2,
        name: 'Jean Martin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80',
      },
      {
        id: 3,
        name: 'Sophie Bernard',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=40&h=40&q=80',
      },
    ],
  },
  // ... existing code ...
];

const allAgents: Agent[] = [
  {
    id: 1,
    name: 'Claire Lefèvre',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150&q=80',
    address: 'Boulevard Lazare Carnot 57',
    city: 'Toulouse',
    postalCode: '31000',
    localTransactions: 30,
    totalTransactions: 38,
    averagePrice: '210K EUR',
    agency: {
      name: 'Orpi',
      logo: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80&q=80',
    },
  },
  // ... existing code ...
];

const TrouveAgent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agencies' | 'agents'>('agencies');
  const navigate = useNavigate();

  const handleViewAgency = (agency: Agency) => {
    navigate('/VoirLagence', { state: { agency } });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-xl md:text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>,
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <header className="bg-gray-100 rounded-xl py-4 md:py-6 mx-2 md:mx-5">
        <div className="container mx-auto px-4 py-4 md:py-7">
          <h1 className="text-center text-xl md:text-2xl font-bold text-indigo-800">Agences et mandataires immobiliers</h1>
          <h2 className="mt-2 text-center text-base md:text-lg font-medium text-indigo-600">Toulouse, Haute-Garonne</h2>

          <div className="mt-6 flex justify-center">
            <div className="relative w-full md:w-2/3 px-4 md:px-0">
              <div className="absolute left-6 md:left-3 top-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 2a8 8 0 105.293 13.707l4.314 4.314a1 1 0 01-1.414 1.414l-4.314-4.314A8 8 0 0010 2zm-6 8a6 6 0 1112 0 6 6 0 01-12 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <input
                type="text"
                className="w-full rounded-2xl border py-3 md:py-4 pl-10 md:pl-12 pr-24 text-base md:text-lg focus:outline-none"
                placeholder="Toulouse, Haute-Garonne"
              />

              <button
                className="absolute right-6 md:right-2 top-1.5 md:top-2 rounded-xl px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-white"
                style={{ background: '#7069F9' }}
              >
                Chercher
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto mt-4 md:mt-6 px-4">
        <div className="mb-4 md:mb-6 flex space-x-2 md:space-x-4">
          <button
            className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium ${
              activeTab === 'agencies' ? 'bg-black rounded-xl text-white' : 'text-black bg-gray-200 rounded-xl hover:text-indigo-600'
            }`}
            onClick={() => setActiveTab('agencies')}
          >
            Agences ({agencies.length})
          </button>
          <button
            className={`px-4 md:px-6 py-2 md:py-3 text-sm md:text-base font-medium ${
              activeTab === 'agents' ? 'bg-black rounded-xl text-white' : 'text-black bg-gray-200 rounded-xl hover:text-indigo-600'
            }`}
            onClick={() => setActiveTab('agents')}
          >
            Agents (54)
          </button>
        </div>
      </div>

      <main className="container mx-auto px-4 pb-8 md:pb-16">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="w-full space-y-4 lg:w-2/3">
            {activeTab === 'agencies'
              ? agencies.map(agency => (
                  <div key={agency.id} className="rounded-lg bg-white shadow p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-start">
                      <div className="flex-shrink-0 w-full md:w-28 flex flex-col items-center">
                        <div className="mb-2 h-24 md:h-26 aspect-square overflow-hidden rounded-lg bg-indigo-50">
                          <img src={agency.logo} alt={agency.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="mt-2 md:mt-5 flex justify-center">{renderStars(agency.rating)}</div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row items-center justify-between">
                          <h2 className="text-lg md:text-xl text-black mb-2 md:mb-0">{agency.name}</h2>
                          <div className="flex -space-x-2">
                            {agency.agents.map(agent => (
                              <img
                                key={agent.id}
                                src={agent.avatar}
                                alt={agent.name}
                                className="h-6 w-6 md:h-8 md:w-8 rounded-full border-2 border-white object-cover"
                                title={agent.name}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="mt-2 text-sm md:text-base">
                          <div className="flex items-center mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>
                              {agency.address}, {agency.postalCode} {agency.city}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <span className="block">
                              <span className="font-semibold text-indigo-800">{agency.localTransactions}</span> transactions à Toulouse
                            </span>
                            <span className="block">
                              <span className="font-semibold text-indigo-800">{agency.totalTransactions}</span> transactions à France
                            </span>
                          </div>

                          <div className="mt-4 flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
                            <div className="rounded bg-gray-100 px-3 py-1">
                              <span className="text-gray-600 text-sm">Prix de vente médian: </span>
                              <span className="text-sm">{agency.averagePrice}</span>
                            </div>
                            <button
                              onClick={() => handleViewAgency(agency)}
                              className="w-full md:w-auto rounded-2xl px-6 py-2 text-sm font-medium text-white"
                              style={{ background: '#7069F9' }}
                            >
                              Voir l'agence
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : allAgents.map(agent => (
                  <div key={agent.id} className="rounded-lg bg-white shadow p-6">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Agent Profile Section */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full bg-indigo-50 border-2 border-white">
                          <img src={agent.avatar} alt={agent.name} className="h-full w-full object-cover" />
                        </div>
                        <button
                          className="mt-3 w-full rounded-2xl px-6 py-3 text-sm font-medium text-white"
                          style={{ background: '#ff626e', borderRadius: '10px' }}
                        >
                          Contacter
                        </button>
                      </div>

                      {/* Agent Details Section */}
                      <div className="flex-1">
                        <h2 className="text-lg font-bold text-indigo-900">{agent.name}</h2>

                        <div className="mt-1 flex items-center text-sm text-gray-700">
                          <span className="mr-1 flex items-center justify-center rounded-full bg-indigo-100 p-1 text-indigo-500">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </span>
                          <span className="font-medium">
                            {agent.address}, {agent.postalCode} {agent.city}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center text-sm">
                            <span className="font-semibold">{agent.localTransactions}</span>
                            <span className="ml-1 text-gray-600">transactions à Toulouse</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="font-semibold">{agent.totalTransactions}</span>
                            <span className="ml-1 text-gray-600">transactions à France</span>
                          </div>
                        </div>

                        <div className="rounded bg-gray-100 px-3 py-2 w-2/3 mt-2">
                          <span className="text-gray-600">Prix de vente médian: </span>
                          <span>{agent.averagePrice}</span>
                        </div>
                      </div>

                      {/* Agency Logo Section */}
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-xl bg-indigo-50 border-2 border-white">
                          <img src={agent.agency?.logo} alt={agent.agency?.name} className="h-full w-full object-cover" />
                        </div>
                        <button
                          onClick={() => agent.agency && handleViewAgency(agent.agency as Agency)}
                          className="mt-3 w-full rounded-2xl px-10 py-3 text-sm font-medium text-white"
                          style={{ background: '#7069F9', borderRadius: '10px' }}
                        >
                          Voir Agence
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

          <div className="w-full lg:sticky lg:top-8 lg:w-1/3 space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-blue-100 p-6 md:p-8 shadow-sm">
              <h3 className="text-center text-base md:text-lg font-semibold text-gray-900">
                Choisissez la meilleure agence ou le meilleur agent
              </h3>
              <p className="mt-2 text-center text-xs md:text-sm text-gray-600">
                Car l'expérience client et la transparence sont les meilleurs gages de confiance.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-100 p-6 md:p-8 shadow-sm">
              <h4 className="text-center text-base font-semibold text-indigo-800">Êtes-vous agent immobilier ?</h4>
              <p className="mt-2 text-center text-xs md:text-sm text-gray-600">
                Créez votre vitrine maintenant et attirez de nouveaux clients !
              </p>
              <div className="flex justify-center mt-4">
                <button className="rounded-xl bg-purple-500 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium text-white shadow-md">
                  Créez maintenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrouveAgent;
