import React, { useState } from 'react';
import { MapPin, Globe, Building, Home, Briefcase, Map, ParkingSquare, Plus, Minus } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useLocation } from 'react-router-dom';

interface Agent {
  id?: string;
  name: string;
  position?: string;
  avatar: string;
}

interface AgencyData {
  name: string;
  logo: string;
  postalCode: string;
  city: string;
  address: string;
  rating: number;
  reviews?: number;
  totalTransactions?: number;
  averagePrice?: string;
  agents?: Agent[];
}

interface LocationState {
  agency: AgencyData;
}

const VoirLagence: React.FC = () => {
  const location = useLocation();
  const agencyData = (location.state as LocationState)?.agency;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="container mx-auto px-20 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left content - Agency information */}
          {/* <div className="w-full lg:w-2/3">*/}
          {/*  /!* Agency Banner *!/*/}
          {/*  <div className="relative rounded-lg overflow-hidden mb-8">*/}
          {/*    <img*/}
          {/*      src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"*/}
          {/*      alt="Agency Banner"*/}
          {/*      className="w-full h-64 object-cover"*/}
          {/*    />*/}
          {/*    <div className="absolute bottom-4 left-4 bg-white p-3 rounded shadow-md">*/}
          {/*      <img src={agencyData.logo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  /!* Breadcrumb *!/*/}
          {/*  <div className="text-sm text-gray-600 mb-4">*/}
          {/*    Agence immobilière &gt; {agencyData.postalCode && agencyData.postalCode.substring(0, 2)}-{agencyData.city} &gt;{' '}*/}
          {/*    {agencyData.city} &gt; {agencyData.postalCode}*/}
          {/*  </div>*/}

          {/*  /!* Agency Name *!/*/}
          {/*  <div className="mb-6">*/}
          {/*    <h1 className="text-2xl font-bold mb-2">{agencyData.name}</h1>*/}
          {/*    <h2 className="text-gray-700">Agence immobilière</h2>*/}

          {/*    /!* Ratings *!/*/}
          {/*    <div className="flex items-center mt-2">*/}
          {/*      <div className="flex">*/}
          {/*        {[1, 2, 3, 4, 5].map(star => (*/}
          {/*          <svg*/}
          {/*            key={star}*/}
          {/*            className="w-5 h-5 text-yellow-400"*/}
          {/*            fill={star <= agencyData.rating ? 'currentColor' : 'none'}*/}
          {/*            viewBox="0 0 20 20"*/}
          {/*          >*/}
          {/*            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>*/}
          {/*          </svg>*/}
          {/*        ))}*/}
          {/*      </div>*/}
          {/*      <span className="ml-2 text-gray-600">({agencyData.reviews || 21} avis)</span>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  /!* Agency Info *!/*/}
          {/*  <div className="flex flex-col md:flex-row gap-6 mb-8">*/}
          {/*    <div className="flex items-center text-gray-600 bg-gray-200 p-2 px-4 rounded-lg">*/}
          {/*      <MapPin className="mr-2" size={20} />*/}
          {/*      <span>*/}
          {/*        {agencyData.address}, {agencyData.postalCode} {agencyData.city}, France*/}
          {/*      </span>*/}
          {/*    </div>*/}
          {/*    <div className="flex items-center  bg-gray-200 p-2 px-4 rounded-lg">*/}
          {/*      <Globe className="mr-2" size={20} />*/}
          {/*      <a href="#" className="hover:underline">*/}
          {/*        www.{agencyData.name ? agencyData.name.toLowerCase().replace(/\s+/g, '') : 'nestenn'}.com*/}
          {/*      </a>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  /!* Sales Analysis *!/*/}
          {/*  <div className="mb-8">*/}
          {/*    <h2 className="text-xl font-bold mb-4">Analyse des ventes</h2>*/}
          {/*    <p className="text-gray-600 mb-6">Analyse et suivi des performances de vente de cette agence en temps réel</p>*/}

          {/*    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">*/}
          {/*      /!* Properties Sold *!/*/}
          {/*      <div className="bg-blue-100 p-6 rounded-2xl">*/}
          {/*        <div className="flex items-center mb-4">*/}
          {/*          <Building className="text-blue-600 mr-2" size={24} />*/}
          {/*          <span className="text-2xl font-bold">{agencyData.totalTransactions || 359}</span>*/}
          {/*        </div>*/}
          {/*        <p className="text-gray-600 mb-4">Biens vendus</p>*/}

          {/*        <div className="space-y-2">*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Appartement</span>*/}
          {/*            <span className="font-medium">200</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Maison</span>*/}
          {/*            <span className="font-medium">72</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Commerce/Industrie</span>*/}
          {/*            <span className="font-medium">14</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Terrain</span>*/}
          {/*            <span className="font-medium">22</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Place de parking</span>*/}
          {/*            <span className="font-medium">4</span>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}

          {/*      /!* Median Sale Price *!/*/}
          {/*      <div className="bg-red-50 p-6 rounded-2xl">*/}
          {/*        <div className="flex items-center mb-4">*/}
          {/*          <Building className="text-red-600 mr-2" size={24} />*/}
          {/*          <span className="text-2xl font-bold">{agencyData.averagePrice || '230k EUR'}</span>*/}
          {/*        </div>*/}
          {/*        <p className="text-gray-600 mb-4">Prix de vente médian</p>*/}

          {/*        <div className="space-y-2">*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Appartement</span>*/}
          {/*            <span className="font-medium">126k EUR</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Maison</span>*/}
          {/*            <span className="font-medium">259k EUR</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Commerce/Industrie</span>*/}
          {/*            <span className="font-medium">182k EUR</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Terrain</span>*/}
          {/*            <span className="font-medium">204k EUR</span>*/}
          {/*          </div>*/}
          {/*          <div className="flex justify-between">*/}
          {/*            <span>Place de parking</span>*/}
          {/*            <span className="font-medium">12k EUR</span>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}

          {/*  /!* About Section *!/*/}
          {/*  <div className="mb-8">*/}
          {/*    <h2 className="text-xl font-bold mb-4">A propos</h2>*/}
          {/*    <p className="text-gray-600 mb-2">*/}
          {/*      {agencyData.name || 'Nestenn'}, une agence immobilière moderne qui réinvente l'expérience de vente immobilière !*/}
          {/*    </p>*/}
          {/*    <p className="text-gray-600 mb-2">Rapidement compris qu'au-delà des nouvelles technologies nécessaires pour ...</p>*/}
          {/*    <button className="text-cyan-500 hover:underline">Afficher plus</button>*/}
          {/*  </div>*/}

          {/*  /!* Team Section *!/*/}
          {/*  <div className="mb-8">*/}
          {/*    <h2 className="text-xl font-bold mb-4">L'équipe</h2>*/}

          {/*    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4">*/}
          {/*      {agencyData.agents && agencyData.agents.length > 0 ? (*/}
          {/*        // Display provided agents*/}
          {/*        agencyData.agents.map((agent, index) => (*/}
          {/*          <div key={agent.id || index} className="flex flex-col items-center">*/}
          {/*            <img src={agent.avatar} alt={agent.name} className="w-24 h-24 rounded-full object-cover mb-2" />*/}
          {/*            <h3 className="font-medium text-center">{agent.name}</h3>*/}
          {/*            <p className="text-sm text-gray-600 text-center">{agent.position || 'Agent immobilier'}</p>*/}
          {/*            <button className="text-pink-500 text-sm mt-1">Voir Plus</button>*/}
          {/*          </div>*/}
          {/*        ))*/}
          {/*      ) : (*/}
          {/*        // Default team members if no agents provided*/}
          {/*        <>*/}
          {/*          /!* Team Member 1 *!/*/}
          {/*          <div className="flex flex-col items-center">*/}
          {/*            <img*/}
          {/*              src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*              alt="Anthony Debono"*/}
          {/*              className="w-24 h-24 rounded-full object-cover mb-2"*/}
          {/*            />*/}
          {/*            <h3 className="font-medium text-center">Anthony Debono</h3>*/}
          {/*            <p className="text-sm text-gray-600 text-center">Directeur d'agence</p>*/}
          {/*            <button className="text-pink-500 text-sm mt-1">Voir Plus</button>*/}
          {/*          </div>*/}

          {/*          /!* Team Member 2 *!/*/}
          {/*          <div className="flex flex-col items-center">*/}
          {/*            <img*/}
          {/*              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*              alt="Natacha LAUTIER"*/}
          {/*              className="w-24 h-24 rounded-full object-cover mb-2"*/}
          {/*            />*/}
          {/*            <h3 className="font-medium text-center">Natacha LAUTIER</h3>*/}
          {/*            <p className="text-sm text-gray-600 text-center">Négociatrice vente</p>*/}
          {/*            <button className="text-pink-500 text-sm mt-1">Voir Plus</button>*/}
          {/*          </div>*/}

          {/*          /!* Team Member 3 *!/*/}
          {/*          <div className="flex flex-col items-center">*/}
          {/*            <img*/}
          {/*              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*              alt="Julien MUZET"*/}
          {/*              className="w-24 h-24 rounded-full object-cover mb-2"*/}
          {/*            />*/}
          {/*            <h3 className="font-medium text-center">Julien MUZET</h3>*/}
          {/*            <p className="text-sm text-gray-600 text-center">Négociateur vente</p>*/}
          {/*            <button className="text-pink-500 text-sm mt-1">Voir Plus</button>*/}
          {/*          </div>*/}

          {/*          /!* Team Member 4 *!/*/}
          {/*          <div className="flex flex-col items-center">*/}
          {/*            <img*/}
          {/*              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*              alt="Gabin MARATIER"*/}
          {/*              className="w-24 h-24 rounded-full object-cover mb-2"*/}
          {/*            />*/}
          {/*            <h3 className="font-medium text-center">Gabin MARATIER</h3>*/}
          {/*            <p className="text-sm text-gray-600 text-center">Négociateur vente</p>*/}
          {/*            <button className="text-pink-500 text-sm mt-1">Voir Plus</button>*/}
          {/*          </div>*/}
          {/*        </>*/}
          {/*      )}*/}
          {/*    </div>*/}

          {/*    <button className="text-cyan-500 hover:underline">Afficher plus</button>*/}
          {/*  </div>*/}

          {/*  /!* Recent Sales *!/*/}
          {/*  <div className="mb-8">*/}
          {/*    <h2 className="text-xl font-bold mb-4">Ventes récentes</h2>*/}

          {/*    /!* Map *!/*/}
          {/*    <div className="relative h-80 bg-gray-200 rounded-lg mb-6 overflow-hidden">*/}
          {/*      <MapContainer center={[48.8566, 2.3522]} zoom={13} className="w-full h-full" style={{ height: '100%', width: '100%' }}>*/}
          {/*        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />*/}
          {/*      </MapContainer>*/}
          {/*      <div className="absolute top-2 right-2 flex flex-col">*/}
          {/*        <button className="bg-white p-1 rounded-md shadow mb-1">*/}
          {/*          <Plus size={20} />*/}
          {/*        </button>*/}
          {/*        <button className="bg-white p-1 rounded-md shadow">*/}
          {/*          <Minus size={20} />*/}
          {/*        </button>*/}
          {/*      </div>*/}
          {/*    </div>*/}

          {/*    /!* Recent Sales List *!/*/}
          {/*    <div className="space-y-6">*/}
          {/*      /!* Sale 1 *!/*/}
          {/*      <div className="border-b border p-4 shadow rounded-xl">*/}
          {/*        <div className="flex flex-col md:flex-row gap-4">*/}
          {/*          <img*/}
          {/*            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*            alt="Apartment"*/}
          {/*            className="w-32 h-30 object-cover rounded-xl"*/}
          {/*          />*/}
          {/*          <div className="flex-1">*/}
          {/*            <div className="flex justify-between">*/}
          {/*              <div>*/}
          {/*                <h3 className="font-medium">Appartement • 2 pièces</h3>*/}
          {/*                <p className="text-gray-600">*/}
          {/*                  {agencyData.city || 'Lyon'} ({agencyData.postalCode || '69000'})*/}
          {/*                </p>*/}
          {/*                <p className="text-sm text-gray-500">*/}
          {/*                  Vendu par {agencyData.agents && agencyData.agents[0] ? agencyData.agents[0].name : 'Bruno Leroi'} avec{' '}*/}
          {/*                  {agencyData.name || 'Nestenn'}*/}
          {/*                </p>*/}
          {/*              </div>*/}
          {/*              <div className="text-right">*/}
          {/*                <p className="text-gray-600">janvier 2025</p>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*            <button className="mt-2 bg-indigo-500 text-white px-6 py-2 rounded-md text-sm" style={{ background: '#7069F9' }}>*/}
          {/*              Vendu*/}
          {/*            </button>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}

          {/*      /!* Sale 2 *!/*/}
          {/*      <div className="border-b pb-6 border p-4 shadow rounded-xl">*/}
          {/*        <div className="flex flex-col md:flex-row gap-4">*/}
          {/*          <img*/}
          {/*            src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80"*/}
          {/*            alt="Apartment"*/}
          {/*            className="w-32 h-30 object-cover rounded-xl"*/}
          {/*          />*/}
          {/*          <div className="flex-1">*/}
          {/*            <div className="flex justify-between">*/}
          {/*              <div>*/}
          {/*                <h3 className="font-medium">Appartement • 3 pièces</h3>*/}
          {/*                <p className="text-gray-600">*/}
          {/*                  {agencyData.city || 'Lyon'} ({agencyData.postalCode || '69000'})*/}
          {/*                </p>*/}
          {/*                <p className="text-sm text-gray-500">*/}
          {/*                  Vendu par {agencyData.agents && agencyData.agents[1] ? agencyData.agents[1].name : 'Julien Lautier'} avec{' '}*/}
          {/*                  {agencyData.name || 'Nestenn'}*/}
          {/*                </p>*/}
          {/*              </div>*/}
          {/*              <div className="text-right">*/}
          {/*                <p className="text-gray-600">janvier 2025</p>*/}
          {/*              </div>*/}
          {/*            </div>*/}
          {/*            <button className="mt-2 text-white px-6 py-2 rounded-md text-sm" style={{ background: '#7069F9' }}>*/}
          {/*              Vendu*/}
          {/*            </button>*/}
          {/*          </div>*/}
          {/*        </div>*/}
          {/*      </div>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/* </div>*/}

          {/* Right Sidebar - Contact Form */}
          <div className="lg:w-1/3 rounded-xl p-6 h-fit sticky top-1" style={{ background: '#dfd8f7' }}>
            <h2 className="text-center text-lg font-medium mb-2">Contactez-nous</h2>
            <h3 className="text-center text-xl font-bold mb-2">{agencyData.name || 'NESTENN'}</h3>
            <p className="text-center mb-6">Consultation gratuite</p>

            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Votre nom complet"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Téléphone"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div>
                <textarea
                  placeholder="J'ai découvert votre profil sur Immoxpert et je souhaite entrer en contact avec vous."
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>
              <div>
                <textarea
                  placeholder="De quel service avez-vous besoin ?"
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                ></textarea>
              </div>
              <button type="button" className="w-full bg-indigo-500 text-white py-3 rounded-md font-medium">
                Contacter gratuitement
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Nous traitons vos données en toute confidentialité et avec le plus grand soin, conformément aux réglementations européennes.
                En poursuivant, vous acceptez notre Politique de confidentialité et nos Conditions générales.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoirLagence;
