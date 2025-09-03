import React, { useEffect, useState, useMemo, useCallback } from 'react';
import PropertyMap from '../features/map/PropertyMap';
import PropertyCard from 'app/features/property/PropertyCard';
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

  // --- DERIVED STATE (MEMOIZED) ---
  const sortedProperties = useMemo(() => {
    const props = [...properties];
    switch (sortOption) {
      case 'date-desc':
        return props.sort((a, b) => new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime());
      case 'date-asc':
        return props.sort((a, b) => new Date(a.soldDate).getTime() - new Date(b.soldDate).getTime());
      case 'price-desc':
        return props.sort((a, b) => b.numericPrice - a.numericPrice);
      case 'price-asc':
        return props.sort((a, b) => a.numericPrice - b.numericPrice);
      case 'sqm-desc':
        return props.sort((a, b) => b.numericPrice / b.numericSurface - a.numericPrice / a.numericSurface);
      case 'sqm-asc':
        return props.sort((a, b) => a.numericPrice / a.numericSurface - b.numericPrice / b.numericSurface);
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
    console.warn('🔥 PropertyList: Starting data update process with', mutationData?.length || 0, 'features');
    console.warn('🔥 PropertyList: Current properties count before update:', properties.length);

    // Start loading state
    setIsLoadingProperties(true);

    // Force clear everything first
    setProperties([]);
    setSelectedProperty(null);
    setHoveredPropertyId(null);

    // Small delay to ensure state is cleared
    setTimeout(() => {
      console.warn('PropertyList: Processing', mutationData?.length || 0, 'mutation features');

      if (!mutationData || mutationData.length === 0) {
        console.warn('PropertyList: No data received, keeping list empty');
        setIsLoadingProperties(false);
        setDataVersion(prev => prev + 1);
        return;
      }

      // Transform mutation data into our Property interface
      const allProperties: Property[] = [];

      mutationData.forEach((feature: any, featureIndex: number) => {
        if (!feature?.properties?.adresses) {
          console.warn(`Feature ${featureIndex} has no addresses, skipping`);
          return;
        }

        try {
          // Parse the addresses if they're stored as a JSON string
          const addresses =
            typeof feature.properties.adresses === 'string' ? JSON.parse(feature.properties.adresses) : feature.properties.adresses;

          if (!Array.isArray(addresses)) {
            console.warn(`Feature ${featureIndex} addresses is not an array, skipping`);
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
          console.error(`Error parsing addresses for feature ${featureIndex}:`, error);
        }
      });

      // Limit to max 50 properties
      const limitedProperties = allProperties.slice(0, 50);

      console.warn('PropertyList: Setting NEW property list with', limitedProperties.length, 'properties');
      console.warn('PropertyList: Sample properties:', limitedProperties.slice(0, 3));

      // Set new properties and update version
      setProperties(limitedProperties);
      setDataVersion(prev => prev + 1);
      setIsLoadingProperties(false);

      console.warn('🔥 PropertyList: FINISHED updating! New properties count:', limitedProperties.length);
      console.warn(
        '🔥 PropertyList: First 3 properties:',
        limitedProperties.slice(0, 3).map(p => ({ id: p.id, address: p.address, coordinates: p.coordinates })),
      );
    }, 100); // 100ms delay to ensure clean state
  }, []);

  // --- EVENT HANDLERS ---
  const handlePropertySelect = (property: Property) => {
    setSelectedProperty(property);
    if (window.innerWidth < 1024) {
      setActiveView('list');
    }
  };

  const closeSidebar = () => {
    setSelectedProperty(null);
  };

  // --- RENDER ---
  return (
    <div className="flex flex-col lg:flex-row w-full h-full bg-gray-50">
      {/* --- Mobile View Toggle --- */}
      <div className="lg:hidden flex justify-center gap-2 py-2 bg-white shadow-md z-20">
        <button
          onClick={() => setActiveView('map')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            activeView === 'map' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Carte
        </button>
        <button
          onClick={() => setActiveView('list')}
          className={`px-4 py-2 rounded text-sm font-medium ${
            activeView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Liste ({properties.length})
        </button>
      </div>

      {/* --- List & Detail Panel --- */}
      <div
        className={`w-full lg:flex-shrink-0 flex flex-col bg-white border-r border-gray-200 z-10 ${
          activeView === 'map' ? 'hidden lg:flex' : 'flex'
        }`}
        style={{ width: window.innerWidth >= 1024 ? '480px' : '100%' }}
      >
        {selectedProperty ? (
          // --- Detail View ---
          <div className="p-4 flex-1 overflow-y-auto">
            <button onClick={closeSidebar} className="text-blue-600 hover:underline text-sm mb-4">
              ← Retour à la liste
            </button>
            <h2 className="text-xl font-bold text-gray-800">{selectedProperty.address}</h2>
            <p className="text-md text-gray-600">{selectedProperty.city}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Prix de vente</div>
                <div className="font-semibold text-lg">{selectedProperty.price}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Surface</div>
                <div className="font-semibold text-lg">{selectedProperty.surface || 'Non spécifiée'}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Prix/m²</div>
                <div className="font-semibold text-lg">{selectedProperty.pricePerSqm || 'Non spécifié'}</div>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="text-sm text-gray-500">Pièces</div>
                <div className="font-semibold text-lg">{selectedProperty.rooms || 'Non spécifié'}</div>
              </div>
            </div>
            {selectedProperty.terrain && (
              <div className="mt-4 text-center">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Terrain</div>
                  <div className="font-semibold text-lg">{selectedProperty.terrain}</div>
                </div>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-4">Vendu le: {selectedProperty.soldDate || 'Date non spécifiée'}</p>
          </div>
        ) : (
          // --- List View ---
          <>
            <div className="p-4 border-b">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Transactions à proximité</h2>

                <select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value as SortOption)}
                  className="w-1/2 border rounded-md px-2 py-1.5 text-sm bg-white"
                >
                  <option value="date-desc">Plus récentes</option>
                  <option value="date-asc">Plus anciennes</option>
                  <option value="price-desc">Prix ↓</option>
                  <option value="price-asc">Prix ↑</option>
                  <option value="sqm-desc">€/m² ↓</option>
                  <option value="sqm-asc">€/m² ↑</option>
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {sortedProperties.length > 0 ? (
                sortedProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onClick={() => handlePropertySelect(property)}
                    isHovered={hoveredPropertyId === property.id}
                    isMapHovered={mapHoveredPropertyId === property.id}
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                  />
                ))
              ) : (
                <p className="p-4 text-center text-gray-500">Aucune transaction trouvée dans cette zone.</p>
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
