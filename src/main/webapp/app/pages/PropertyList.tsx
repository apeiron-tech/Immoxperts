import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import PropertyMap from '../features/map/PropertyMap';
import PropertyCard from 'app/features/property/PropertyCard';
import PropertyCardClick from 'app/features/property/PropertyCardClick';
import { FilterState } from '../types/filters';

// ===================================================================
// TYPE DEFINITIONS
// ===================================================================

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
  terrain: string;
  coordinates: [number, number];
  rawData: {
    terrain: any;
    mutationType: string;
    department: string;
  };
}

interface PropertyListProps {
  searchParams: {
    coordinates?: [number, number];
    address?: string;
  };
  filterState?: FilterState;
  onFiltersChange?: (filters: FilterState | null) => void; // Add callback for filter changes
  onMapHover?: (propertyId: number | null) => void; // Add callback for map hover
}

type SortOption = 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc' | 'sqm-desc' | 'sqm-asc';

// ===================================================================
// REACT COMPONENT
// ===================================================================

const PropertyList: React.FC<PropertyListProps> = ({ searchParams, filterState, onFiltersChange, onMapHover }) => {
  // --- STATE MANAGEMENT ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [mapHoveredPropertyId, setMapHoveredPropertyId] = useState<number | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'list'>('map');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');

  // **KEY ADDITION**: Store the currently active filters in this component
  const [currentActiveFilters, setCurrentActiveFilters] = useState<FilterState | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);
  const [dataVersion, setDataVersion] = useState(0); // Force re-render

  // New state for address selection and similar properties
  const [currentAddress, setCurrentAddress] = useState<{ address: string; city: string } | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Animation variants for sidebar
  const sidebarVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  // --- DERIVED STATE (MEMOIZED) ---
  const sortedProperties = useMemo(() => {
    const props = [...properties];
    switch (sortOption) {
      case 'date-desc':
        return props.sort((a, b) => {
          const dateA = new Date(a.soldDate);
          const dateB = new Date(b.soldDate);
          // Handle invalid dates by putting them at the end
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateB.getTime() - dateA.getTime();
        });
      case 'date-asc':
        return props.sort((a, b) => {
          const dateA = new Date(a.soldDate);
          const dateB = new Date(b.soldDate);
          // Handle invalid dates by putting them at the end
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          return dateA.getTime() - dateB.getTime();
        });
      case 'price-desc':
        return props.sort((a, b) => b.numericPrice - a.numericPrice);
      case 'price-asc':
        return props.sort((a, b) => a.numericPrice - b.numericPrice);
      case 'sqm-desc':
        return props.sort((a, b) => {
          const pricePerSqmA = a.numericSurface > 0 ? a.numericPrice / a.numericSurface : 0;
          const pricePerSqmB = b.numericSurface > 0 ? b.numericPrice / b.numericSurface : 0;
          return pricePerSqmB - pricePerSqmA;
        });
      case 'sqm-asc':
        return props.sort((a, b) => {
          const pricePerSqmA = a.numericSurface > 0 ? a.numericPrice / a.numericSurface : 0;
          const pricePerSqmB = b.numericSurface > 0 ? b.numericPrice / b.numericSurface : 0;
          return pricePerSqmA - pricePerSqmB;
        });
      default:
        return props;
    }
  }, [properties, sortOption]);

  const hoveredProperty = useMemo(() => {
    return properties.find(p => p.id === hoveredPropertyId) || null;
  }, [hoveredPropertyId, properties]);

  // --- FILTER STATE MANAGEMENT ---

  // Update active filters when filterState prop changes
  useEffect(() => {
    if (filterState) {
      setCurrentActiveFilters(filterState);
      // Notify parent component about the filter change
      onFiltersChange?.(filterState);
    }
  }, [filterState, onFiltersChange]);

  // Clear filters function (you can expose this via props if needed)
  const clearFilters = useCallback(() => {
    setCurrentActiveFilters(null);
    onFiltersChange?.(null);
  }, [onFiltersChange]);

  // Handle map hover to highlight property in list
  const handleMapHover = useCallback((propertyId: number | null) => {
    setMapHoveredPropertyId(propertyId);
  }, []);

  // --- DATA FETCHING ---

  // This function will be called by PropertyMap when it gets new mutation data
  // This function will be called by PropertyMap when it gets new mutation data
  const updatePropertiesFromMutations = useCallback((mutationData: any[]) => {
    // Start loading state
    setIsLoadingProperties(true);

    // Force clear everything first
    setProperties([]);
    setSelectedProperty(null);
    setHoveredPropertyId(null);

    // Small delay to ensure state is cleared
    setTimeout(() => {
      if (!mutationData || mutationData.length === 0) {
        setIsLoadingProperties(false);
        setDataVersion(prev => prev + 1);
        return;
      }

      // Transform mutation data into our Property interface
      const allProperties: Property[] = [];

      mutationData.forEach((feature: any, featureIndex: number) => {
        if (!feature?.properties?.adresses) {
          return;
        }

        try {
          // Parse the addresses if they're stored as a JSON string
          const addresses =
            typeof feature.properties.adresses === 'string' ? JSON.parse(feature.properties.adresses) : feature.properties.adresses;

          if (!Array.isArray(addresses)) {
            return;
          }

          addresses.forEach((address: any, addressIndex: number) => {
            if (address.mutations && Array.isArray(address.mutations)) {
              address.mutations.forEach((mutation: any, mutationIndex: number) => {
                const uniqueId = `${feature.properties.idparcelle || featureIndex}-${addressIndex}-${mutationIndex}-${Date.now()}`;

                const property: Property = {
                  id:
                    typeof uniqueId === 'string'
                      ? Number(`${feature.properties.idparcelle || featureIndex}${addressIndex}${mutationIndex}${Date.now()}`)
                      : uniqueId, // Ensure absolutely unique numeric ID
                  address: address.adresse_complete || 'Adresse inconnue',
                  city: address.commune || '',
                  numericPrice: mutation.valeur || 0,
                  numericSurface: mutation.sbati || 0,
                  price: `${(mutation.valeur || 0).toLocaleString('fr-FR')} €`,
                  surface: mutation.sbati ? `${mutation.sbati.toLocaleString('fr-FR')} m²` : '',
                  type: mutation.type_groupe || 'Type inconnu',
                  soldDate: mutation.date ? new Date(mutation.date).toLocaleDateString('fr-FR') : '',
                  pricePerSqm: mutation.prix_m2 ? `${Math.round(mutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
                  rooms: mutation.nbpprinc || '',
                  terrain: mutation.sterr ? `${mutation.sterr.toLocaleString('fr-FR')} m²` : '',
                  coordinates: feature.geometry?.coordinates ? [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] : [0, 0],
                  rawData: {
                    terrain: mutation.sterr || 0,
                    mutationType: mutation.id?.toString() || '',
                    department: address.commune || '',
                  },
                };
                allProperties.push(property);
              });
            }
          });
        } catch (error) {
          // Error parsing addresses
        }
      });

      // Limit to max 50 properties
      const limitedProperties = allProperties.slice(0, 50);

      // Set new properties and update version
      setProperties(limitedProperties);
      setDataVersion(prev => prev + 1);
      setIsLoadingProperties(false);
    }, 100); // 100ms delay to ensure clean state
  }, []);

  // --- EVENT HANDLERS ---
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);

    // Find similar properties for this property
    const similar = properties.filter(
      prop =>
        prop.id !== property.id &&
        (prop.address.toLowerCase().includes(property.address.toLowerCase()) ||
          prop.city.toLowerCase().includes(property.city.toLowerCase())),
    );
    setSimilarProperties(similar);
    setCurrentIndex(0);

    if (window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const closeSidebar = () => {
    setSelectedProperty(null);
  };

  const handleAddressSelect = (address: { address: string; city: string; mutations?: any[] }) => {
    setCurrentAddress(address);
    setSelectedProperty(null);

    // If mutations are provided directly from the map, convert them to Property format
    if (address.mutations && Array.isArray(address.mutations)) {
      const mutationProperties: Property[] = address.mutations.map((mutation: any, index: number) => ({
        id: Date.now() + index,
        address: address.address,
        city: address.city,
        numericPrice: mutation.valeur || 0,
        numericSurface: mutation.sbati || 0,
        price: `${(mutation.valeur || 0).toLocaleString('fr-FR')} €`,
        surface: mutation.sbati ? `${mutation.sbati.toLocaleString('fr-FR')} m²` : '',
        type: mutation.type_groupe || 'Type inconnu',
        soldDate: mutation.date ? new Date(mutation.date).toLocaleDateString('fr-FR') : '',
        pricePerSqm: mutation.prix_m2 ? `${Math.round(mutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
        rooms: mutation.nbpprinc || '',
        terrain: mutation.sterr ? `${mutation.sterr.toLocaleString('fr-FR')} m²` : '',
        coordinates: [0, 0], // Not needed for display
        rawData: {
          terrain: mutation.sterr || 0,
          mutationType: mutation.id?.toString() || '',
          department: address.city,
        },
      }));

      setSimilarProperties(mutationProperties);
      setCurrentIndex(0);
      return;
    }

    // Fallback: Find properties with mutations for this specific address
    const addressProperties = properties.filter(
      prop => prop.address.toLowerCase() === address.address.toLowerCase() && prop.city.toLowerCase() === address.city.toLowerCase(),
    );

    // If no exact matches, find similar properties in the same city
    const foundProperties =
      addressProperties.length > 0
        ? addressProperties
        : properties.filter(prop => prop.city.toLowerCase().includes(address.city.toLowerCase())).slice(0, 5); // Limit to 5 similar properties

    setSimilarProperties(foundProperties);
    setCurrentIndex(0);
  };

  const closeAddressSidebar = () => {
    setCurrentAddress(null);
    setSimilarProperties([]);
    setCurrentIndex(0);
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col lg:flex-row w-full h-full min-h-screen lg:min-h-full bg-gray-50">
      {/* --- Mobile View Toggle --- */}
      <div className="lg:hidden flex justify-center gap-2 py-3 bg-white shadow-md z-20 sticky top-0">
        <button
          onClick={() => setActiveView('map')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'map' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📍 Carte
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeView === 'list' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📋 Liste ({properties.length})
        </button>
      </div>

      {/* --- List & Detail Panel --- */}
      <div
        className={`w-full lg:w-[456px] lg:flex-shrink-0 flex flex-col bg-white border-r border-gray-200 z-10 h-full min-h-[calc(100vh-60px)] lg:min-h-full ${
          activeView === 'map' ? 'hidden lg:flex' : 'flex'
        }`}
      >
        {selectedProperty ? (
          <motion.div
            className="h-full w-full bg-white overflow-hidden lg:border-r border-gray-200 lg:rounded-lg"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={`property-details-${selectedProperty.id}`}
          >
            <div className="w-full h-full overflow-y-auto custom-scroll">
              <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                <div className="pt-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 p-2 w-full">
                      {similarProperties[currentIndex] ? (
                        <motion.div
                          key={`similar-property-${currentIndex}-${similarProperties[currentIndex]?.id || 'none'}`}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <PropertyCardClick
                            property={similarProperties[currentIndex]}
                            onClick={() => handlePropertySelect(similarProperties[currentIndex])}
                            compact
                          />
                        </motion.div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">Aucune propriété à afficher</div>
                      )}

                      {similarProperties.length > 0 && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : similarProperties.length - 1))}
                            className="p-1 hover:text-blue-600"
                          >
                            &lt;
                          </button>
                          <span className="text-s px-4 text-blue-600 font-medium">
                            {currentIndex + 1} / {similarProperties.length}
                          </span>
                          <button
                            onClick={() => setCurrentIndex(prev => (prev < similarProperties.length - 1 ? prev + 1 : 0))}
                            className="p-1 hover:text-blue-600"
                          >
                            &gt;
                          </button>
                        </div>
                      )}

                      <div className="relative flex items-center py-2">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <span className="relative bg-white pr-4 text-gray-900 font-semibold text-sm">En savoir plus</span>
                      </div>

                      <div className="flex flex-col gap-2 text-sm">
                        <p>Générez une analyse à cette adresse pour obtenir :</p>
                        <ul className="list-inside list-disc">
                          <li>L'estimation de la valeur du bien</li>
                          <li>L'analyse cadastrale</li>
                          <li>Une présentation des ventes réalisées à proximité</li>
                          <li>L'évolution des prix dans ce quartier</li>
                          <li>Une analyse du quartier</li>
                        </ul>
                      </div>
                    </div>
                    <button onClick={closeSidebar} className="text-gray-400 hover:text-gray-700 text-2xl sm:text-3xl p-1 sm:p-2">
                      &times;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : currentAddress ? (
          <motion.div
            className="h-full w-full bg-white overflow-hidden lg:border-r border-gray-200 lg:rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4"
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            key={`address-details-${currentAddress.address}`}
          >
            <div className="flex items-start justify-end">
              <button onClick={closeAddressSidebar} className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl p-1 sm:p-2">
                &times;
              </button>
            </div>

            {/* PropertyCardClick right after address/city */}
            {similarProperties.length > 0 && similarProperties[currentIndex] && (
              <motion.div
                key={`address-property-${currentIndex}-${similarProperties[currentIndex]?.id || 'none'}`}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PropertyCardClick
                  property={similarProperties[currentIndex]}
                  onClick={() => handlePropertySelect(similarProperties[currentIndex])}
                  compact
                />
              </motion.div>
            )}

            {/* Navigation arrows if multiple properties */}
            {similarProperties.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : similarProperties.length - 1))}
                  className="p-1 hover:text-blue-600"
                >
                  &lt;
                </button>
                <span className="text-s px-4 text-blue-600 font-medium">
                  {currentIndex + 1} / {similarProperties.length}
                </span>
                <button
                  onClick={() => setCurrentIndex(prev => (prev < similarProperties.length - 1 ? prev + 1 : 0))}
                  className="p-1 hover:text-blue-600"
                >
                  &gt;
                </button>
              </div>
            )}

            {/* Transaction count or no data message */}

            <div className="space-y-3">
              <h3 className="text-sm font-semibold">Détails supplémentaires</h3>
              <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                <li>Tendances de marché</li>
                <li>Analyse cadastrale</li>
                <li>Services proximité</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-2 rounded-md text-sm">
              <p className="text-gray-600 mb-1">Estimation gratuite</p>
              <button className="bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700">Évaluer mon bien</button>
            </div>
          </motion.div>
        ) : (
          // --- List View ---
          <>
            <div className="p-3 sm:p-4 border-b">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                <h2 className="font-semibold text-sm sm:text-base">Transactions à proximité</h2>

                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value as SortOption)}
                  className="w-full sm:w-1/2 border rounded-md px-2 py-1.5 text-sm bg-white"
                >
                  <option value="date-desc">Les plus récentes</option>
                  <option value="date-asc">Les plus anciennes</option>
                  <option value="price-desc">Prix le plus haut</option>
                  <option value="price-asc">Prix le plus bas</option>
                  <option value="sqm-desc">Prix au m² le plus haut</option>
                  <option value="sqm-asc">Prix au m² le plus bas</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-2 max-h-[calc(100vh-120px)] lg:max-h-none">
              {sortedProperties.length > 0 ? (
                sortedProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => {}} // Désactivé - pas de clic sur les cartes
                    isHovered={hoveredPropertyId === property.id}
                    isMapHovered={mapHoveredPropertyId === property.id}
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                  />
                ))
              ) : (
                <p className="p-4 text-center text-gray-500 text-sm">Aucune transaction trouvée dans cette zone.</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- Map Container --- */}
      <div className={`flex-1 relative ${activeView === 'list' ? 'hidden lg:block' : 'block'}`}>
        <PropertyMap
          properties={properties}
          onPropertySelect={handlePropertySelect}
          onAddressSelect={handleAddressSelect}
          searchParams={searchParams}
          selectedProperty={selectedProperty}
          hoveredProperty={hoveredProperty}
          filterState={currentActiveFilters} // **KEY**: Pass the currently active filters
          onDataUpdate={updatePropertiesFromMutations} // **NEW**: Callback to update PropertyCard data
          onMapHover={handleMapHover} // **NEW**: Callback for map hover
          dataVersion={dataVersion} // **NEW**: Pass data version to trigger zone stats recalculation
        />
      </div>
    </div>
  );
};

export default PropertyList;
