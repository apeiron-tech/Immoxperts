import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import axios from 'axios';
import mapboxgl from 'mapbox-gl';
import PropertyMap from 'app/features/map/PropertyMap';
import PropertyCard from 'app/features/property/PropertyCard';

interface Property {
  id: number;
  address: string;
  city: string;
  numericPrice: number;
  numericSurface: number;
  price: string;
  pricePerSqm: string;
  type: string;
  surface: string;
  rooms: string | number;
  soldDate: string;
  rawData: {
    terrain: any;
    mutationType: string;
    department: string;
  };
}

interface SearchParams {
  [key: string]: string;
}

interface AddressInfo {
  address: string;
  city: string;
}

interface NormalizedAddress {
  address: string;
  city: string;
}

interface PropertyListProps {
  searchParams: SearchParams;
}

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    x: -300,
    opacity: 0,
    transition: { ease: 'easeInOut', duration: 0.3 },
  },
};

const propertyCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const PropertyList: React.FC<PropertyListProps> = ({ searchParams }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [currentAddress, setCurrentAddress] = useState<NormalizedAddress | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number] | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const closeSidebar = (): void => {
    setSelectedProperty(null);
    if (window.innerWidth < 1024) setActiveView('map');
  };

  const normalizeFrenchCharacters = (str: string): string => {
    return typeof str === 'string'
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/œ/g, 'oe')
          .replace(/æ/g, 'ae')
          .replace(/ç/g, 'c')
          .replace(/[^a-zA-Z0-9]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .toUpperCase()
      : '';
  };

  const handlePropertySelect = (property: Property): void => {
    setSelectedProperty(property);
    if (window.innerWidth < 1024) setActiveView('list');
  };

  const handlePropertiesFound = (newProperties: Property[]): void => {
    setProperties(newProperties);
    setSimilarProperties(newProperties.slice(0, 5));
    setCurrentAddress(null);
    if (newProperties.length > 0 && window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const handleAddressFound = (addressInfo: AddressInfo): void => {
    const normalizedAddress: NormalizedAddress = {
      address: normalizeFrenchCharacters(addressInfo.address),
      city: normalizeFrenchCharacters(addressInfo.city),
    };
    setCurrentAddress(normalizedAddress);
    setProperties([]);
    setSelectedProperty(null);
    if (window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const streetTypePrefixes: string[] = [
    'COURS',
    'BOULEVARD',
    'AVENUE',
    'RUE',
    'PLACE',
    'PASSAGE',
    'IMPASSE',
    'ALLEE',
    'CHEMIN',
    'ROUTE',
    'SQUARE',
    'GALERIE',
    'RESIDENCE',
    'QUAI',
    'QUARTIER',
  ];

  const removeStreetType = (streetName: string): string => {
    const prefixRegex = new RegExp(`^(${streetTypePrefixes.join('|')})\\s+`, 'i');
    return streetName.replace(prefixRegex, '');
  };

  const handleMapMove = React.useCallback(async (coordinates: [number, number]): Promise<void> => {
    setMapCoordinates(coordinates);
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${coordinates[0]},${coordinates[1]}.json?types=address&language=fr&access_token=${mapboxgl.accessToken}`,
      );

      const data = await response.json();
      let streetName = '';
      let communeName = '';

      const addressFeature = data.features.find((f: any) => f.place_type.includes('address'));
      if (addressFeature) {
        const rawStreet = addressFeature.text.replace(/^\d+[\s,]*/, '').trim();
        streetName = removeStreetType(normalizeFrenchCharacters(rawStreet)).trim();
        const communeContext = addressFeature.context?.find((c: any) => c.id.startsWith('place.'));
        communeName = communeContext?.text ? normalizeFrenchCharacters(communeContext.text) : '';
      }

      setCurrentCity(communeName && streetName ? `${communeName}, ${streetName}` : communeName || streetName);

      if (communeName && streetName) {
        const apiResponse = await axios.get('https://immoxperts.apeiron-tech.dev/api/mutations/mutations/by-street-and-commune', {
          params: {
            street: streetName,
            commune: communeName,
          },
        });

        const formatted: Property[] = apiResponse.data.map((mutation: any) => ({
          id: parseInt(mutation.idmutation, 10),
          address: mutation.addresses?.[0] || 'Adresse inconnue',
          city: communeName,
          numericPrice: mutation.valeurfonc || 0,
          numericSurface: mutation.surface || 0,
          price: `${mutation.valeurfonc?.toLocaleString('fr-FR')} €`,
          surface: `${mutation.surface?.toLocaleString('fr-FR')} m²`,
          type: mutation.libtyploc,
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR'),
          pricePerSqm:
            mutation.valeurfonc && mutation.surface
              ? `${Math.round(mutation.valeurfonc / mutation.surface).toLocaleString('fr-FR')} €/m²`
              : 'N/A',
          rooms: mutation.rooms?.toString() || 'N/A',
          rawData: {
            terrain: mutation.terrain,
            mutationType: mutation.mutationType,
            department: mutation.department,
          },
        }));

        setProperties(formatted);
      }
    } catch (error) {
      console.error('Error handling map movement:', error);
      setProperties([]);
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row w-full pb-4 h-screen overflow-hidden">
      {/* Left Sidebar */}
      <div className={`w-full lg:w-1/3 flex flex-col h-full ${activeView === 'map' && 'hidden lg:flex'}`}>
        <AnimatePresence mode="wait">
          {selectedProperty ? (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="property-details"
            >
              <div className="w-full h-full overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Header Section */}
                  <motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    <button
                      onClick={closeSidebar}
                      className="text-gray-500 hover:text-gray-700 float-right text-2xl focus:outline-none transform transition hover:scale-110"
                    >
                      &times;
                    </button>
                    <h1 className="text-xl font-bold text-gray-900">{selectedProperty.address}</h1>
                    <p className="text-gray-600 text-sm">{selectedProperty.city}</p>
                  </motion.div>

                  {/* Transaction History */}
                  <motion.div
                    className="bg-blue-50 p-3 rounded-lg space-y-2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-blue-900">{selectedProperty.price}</span>
                      <span className="text-sm text-gray-600">{selectedProperty.pricePerSqm}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{selectedProperty.type}</span>
                    </div>
                  </motion.div>

                  {/* Property Details */}
                  <motion.div
                    className="grid grid-cols-3 gap-4 text-center border-b pb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <div className="transform transition-all duration-300 hover:scale-105 hover:text-blue-600">
                      <p className="text-sm text-gray-600">Pièces</p>
                      <p className="font-medium">{selectedProperty.rooms}</p>
                    </div>
                    <div className="transform transition-all duration-300 hover:scale-105 hover:text-blue-600">
                      <p className="text-sm text-gray-600">Surface</p>
                      <p className="font-medium">{selectedProperty.surface}</p>
                    </div>
                    <div className="transform transition-all duration-300 hover:scale-105 hover:text-blue-600">
                      <p className="text-sm text-gray-600">Vendu le</p>
                      <p className="font-medium">{selectedProperty.soldDate}</p>
                    </div>
                  </motion.div>

                  {/* Scrollable Property List */}
                  <div className="pt-4">
                    <motion.h2
                      className="text-lg font-bold mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      Historique des ventes
                    </motion.h2>
                    <div className="space-y-4 overflow-y-auto">
                      {similarProperties.map((property, index) => (
                        <motion.div key={index} custom={index} variants={propertyCardVariants} initial="hidden" animate="visible">
                          <PropertyCard property={property} onClick={() => handlePropertySelect(property)} />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : currentAddress ? (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg p-6 space-y-6"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="default-content"
            >
              <div className="w-full h-full overflow-y-auto">
                <div className="space-y-4">
                  {/* Add Close Button Here */}
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setCurrentAddress(null);
                        if (window.innerWidth < 1024) setActiveView('map');
                      }}
                      className="text-gray-500 hover:text-gray-700 float-right text-2xl focus:outline-none transform transition hover:scale-110"
                    >
                      &times;
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">{currentAddress?.address || 'Adresse non disponible'}</h1>
                    <p className="text-gray-600 text-lg">{currentAddress?.city || 'Ville non disponible'}</p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">Historique des ventes</h3>
                    <p className="text-gray-600">Aucune vente identifiée à cette adresse</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-bold text-lg">En savoir plus</h3>
                    <p className="text-gray-600">Découvrez toutes les informations à cette adresse:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Les tendances de marché</li>
                      <li>L’analyse cadastrale</li>
                      <li>Une analyse du quartier</li>
                      <li>Les services de proximité</li>
                    </ul>
                  </div>

                  <div className="pt-4 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-bold mb-2">Vous vendez ?</h3>
                      <p className="text-gray-600 mb-4">Obtenez une estimation gratuite et instantanée de la valeur de votre bien.</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Estimer un bien en ligne
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="h-full w-full bg-white overflow-hidden border-r border-gray-200 rounded-lg p-6 space-y-6"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              key="property-cards"
            >
              <div className="flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4">Transactions récentes</h2>
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-4">
                    {properties.map(property => (
                      <PropertyCard key={property.id} property={property} onClick={() => setSelectedProperty(property)} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Right Section (Map) */}
      <div className={`w-full lg:w-3/4 h-full relative ${activeView === 'list' ? 'hidden lg:block' : 'block'}`}>
        <div className="h-full border  overflow-hidden">
          <PropertyMap
            onMapMove={handleMapMove}
            onPropertiesFound={handlePropertiesFound}
            onPropertySelect={handlePropertySelect}
            onAddressFound={handleAddressFound}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyList;
