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
  isFilterOpen?: boolean; // Track if filter popup is open
}

type SortOption = '' | 'date-desc' | 'date-asc' | 'price-desc' | 'price-asc' | 'sqm-desc' | 'sqm-asc';

// ===================================================================
// HELPER FUNCTIONS
// ===================================================================

// Calculate price per m² based on property type
// For "Terrain" type, use surface_terrain; for others, use surface_batiment
const calculatePricePerSqm = (price: number, builtSurface: number, landSurface: number, propertyType: string): string => {
  if (!price || price <= 0) {
    return '';
  }

  const isTerrain = propertyType?.toLowerCase().includes('terrain') ?? false;

  if (isTerrain) {
    if (!landSurface || landSurface <= 0) {
      return '';
    }
    const pricePerSqm = Math.round(price / landSurface);
    return `${pricePerSqm.toLocaleString('fr-FR')} \u20AC/m²`;
  }

  if (!builtSurface || builtSurface <= 0) {
    return '';
  }

  const pricePerSqm = Math.round(price / builtSurface);
  return `${pricePerSqm.toLocaleString('fr-FR')} \u20AC/m²`;
};

// ===================================================================
// REACT COMPONENT
// ===================================================================

const PropertyList: React.FC<PropertyListProps> = ({ searchParams, filterState, onFiltersChange, onMapHover, isFilterOpen }) => {
  // --- STATE MANAGEMENT ---
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);
  const [mapHoveredPropertyId, setMapHoveredPropertyId] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('');

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

  // Helper function to parse dates in various formats
  const parseDate = (dateString: string): Date => {
    if (!dateString || dateString.trim() === '') {
      return new Date(0); // Return epoch for empty dates
    }

    // Try to parse DD/MM/YYYY format (French format)
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed in JavaScript
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
    }

    // Try to parse YYYY-MM-DD format (ISO format)
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
          const date = new Date(year, month, day);
          if (!isNaN(date.getTime())) {
            return date;
          }
        }
      }
    }

    // Try standard JavaScript Date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date;
    }

    // If all parsing fails, return epoch
    return new Date(0);
  };

  // --- DERIVED STATE (MEMOIZED) ---
  const sortedProperties = useMemo(() => {
    if (!properties || properties.length === 0) {
      return [];
    }

    // Create a copy and sort based on the selected option
    let result = [...properties];

    switch (sortOption) {
      case '':
        // Return unsorted copy
        break;
      case 'date-desc': {
        result = result.sort((a, b) => {
          const dateA = parseDate(a.soldDate);
          const dateB = parseDate(b.soldDate);
          const sortResult = dateB.getTime() - dateA.getTime();
          return sortResult;
        });
        break;
      }
      case 'date-asc': {
        result = result.sort((a, b) => {
          const dateA = parseDate(a.soldDate);
          const dateB = parseDate(b.soldDate);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      }
      case 'price-desc':
        result.sort((a, b) => (Number(b.numericPrice) || 0) - (Number(a.numericPrice) || 0));
        break;
      case 'price-asc':
        result.sort((a, b) => (Number(a.numericPrice) || 0) - (Number(b.numericPrice) || 0));
        break;
      case 'sqm-desc':
        result = result.sort((a, b) => {
          // If either property has no surface, put it at the end
          if (a.numericSurface <= 0 && b.numericSurface <= 0) return 0;
          if (a.numericSurface <= 0) return 1; // Put a at the end
          if (b.numericSurface <= 0) return -1; // Put b at the end

          const pricePerSqmA = a.numericPrice / a.numericSurface;
          const pricePerSqmB = b.numericPrice / b.numericSurface;
          return pricePerSqmB - pricePerSqmA; // Descending: highest first
        });
        break;
      case 'sqm-asc':
        result = result.sort((a, b) => {
          // If either property has no surface, put it at the end
          if (a.numericSurface <= 0 && b.numericSurface <= 0) return 0;
          if (a.numericSurface <= 0) return 1; // Put a at the end
          if (b.numericSurface <= 0) return -1; // Put b at the end

          const pricePerSqmA = a.numericPrice / a.numericSurface;
          const pricePerSqmB = b.numericPrice / b.numericSurface;
          return pricePerSqmA - pricePerSqmB; // Ascending: lowest first
        });
        break;
      default:
        // Return unsorted copy
        break;
    }

    // Return a new array reference so React reliably detects the sort change when switching options
    return [...result];
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
      // Use a Map to track unique addresses - only keep first mutation per address
      const addressMap = new Map<string, Property>();

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
            const parcelId = feature.properties?.idparcelle ?? `parcel-${featureIndex}`;
            const rawAddressKey = (address.adresse_complete || 'Adresse inconnue').toLowerCase().trim();
            const uniqueAddressKey = `${parcelId}-${address.idadresse ?? addressIndex}-${rawAddressKey}`;

            if (
              !addressMap.has(uniqueAddressKey) &&
              address.mutations &&
              Array.isArray(address.mutations) &&
              address.mutations.length > 0
            ) {
              // Find the first mutation with a valid type_bien (not null)
              const mutation = address.mutations.find(m => m.type_bien != null) || address.mutations[0];

              // Generate a unique numeric ID - ensure it's always a valid number
              const parcelIdValue = feature.properties?.idparcelle || featureIndex;
              const timestamp = Date.now();
              // Create a unique numeric ID by combining indices and timestamp
              // Use modulo to keep it within safe integer range
              const uniqueId =
                Number(`${Math.abs(parcelIdValue)}${addressIndex}${timestamp % 1000000}`) ||
                Number(`${featureIndex}${addressIndex}${timestamp % 1000000}`) ||
                featureIndex * 1000 + addressIndex * 100 + (timestamp % 100);

              // Extract surface values using fallback for old/new field names
              const builtSurface = mutation.surface_batiment ?? mutation.sbati ?? 0;
              const landSurface = mutation.surface_terrain ?? mutation.sterr ?? 0;
              const propertyType = mutation.type_bien ?? mutation.type_groupe ?? 'Type inconnu';

              const coordinates: [number, number] = feature.geometry?.coordinates
                ? [feature.geometry.coordinates[0], feature.geometry.coordinates[1]]
                : [0, 0];

              const property: Property = {
                id: isNaN(uniqueId) ? featureIndex * 10000 + addressIndex * 100 + (timestamp % 10000) : uniqueId, // Ensure absolutely unique numeric ID
                address: address.adresse_complete || 'Adresse inconnue',
                city: address.commune || '',
                numericPrice: mutation.valeur || 0,
                numericSurface: builtSurface,
                price: `${Math.round(mutation.valeur || 0).toLocaleString('fr-FR')} \u20AC`,
                surface: builtSurface > 0 ? `${builtSurface.toLocaleString('fr-FR')} m²` : '',
                type: propertyType,
                soldDate: mutation.date || '',
                pricePerSqm: calculatePricePerSqm(mutation.valeur || 0, builtSurface, landSurface, propertyType),
                rooms: mutation.nbpprinc || '',
                terrain: landSurface > 0 ? `${landSurface.toLocaleString('fr-FR')} m²` : '',
                coordinates,
                rawData: {
                  terrain: landSurface,
                  mutationType: mutation.id?.toString() || '',
                  department: address.commune || '',
                },
              };

              // Store in map with normalized address as key
              addressMap.set(uniqueAddressKey, property);
            }
          });
        } catch (error) {
          // Error parsing addresses
        }
      });

      // Convert map values to array
      const allProperties: Property[] = Array.from(addressMap.values());

      // Limit to max 100 properties (keep natural order from API)
      const limitedProperties = allProperties.slice(0, 100);

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
  };

  const closeSidebar = () => {
    setSelectedProperty(null);
  };

  const handleAddressSelect = (address: { address: string; city: string; mutations?: any[] }) => {
    setCurrentAddress(address);
    setSelectedProperty(null);

    // If mutations are provided directly from the map, convert them to Property format
    if (address.mutations && Array.isArray(address.mutations)) {
      // Filter out mutations with null type_bien and map to Property format
      const mutationProperties: Property[] = address.mutations
        .filter((mutation: any) => mutation.type_bien != null)
        .map((mutation: any, index: number) => {
          // Extract surface values using fallback for old/new field names
          const builtSurface = mutation.surface_batiment ?? mutation.sbati ?? 0;
          const landSurface = mutation.surface_terrain ?? mutation.sterr ?? 0;
          const propertyType = mutation.type_bien ?? mutation.type_groupe ?? 'Type inconnu';

          return {
            id: Date.now() + index + Math.floor(Math.random() * 1000), // Ensure unique ID
            address: address.address,
            city: address.city,
            numericPrice: mutation.valeur || 0,
            numericSurface: builtSurface,
            price: `${(mutation.valeur || 0).toLocaleString('fr-FR')} €`,
            surface: builtSurface > 0 ? `${builtSurface.toLocaleString('fr-FR')} m²` : '',
            type: propertyType,
            soldDate: mutation.date || '',
            pricePerSqm: calculatePricePerSqm(mutation.valeur || 0, builtSurface, landSurface, propertyType),
            rooms: mutation.nbpprinc || '',
            terrain: landSurface > 0 ? `${landSurface.toLocaleString('fr-FR')} m²` : '',
            coordinates: [0, 0], // Not needed for display
            rawData: {
              terrain: landSurface,
              mutationType: mutation.id?.toString() || '',
              department: address.city,
            },
          };
        });

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
    <div className="flex flex-col lg:flex-row w-full h-[80vh] bg-gray-50">
      {/* --- List & Detail Panel - HIDDEN ON MOBILE for ImmoData experience --- */}
      <div className="hidden lg:flex lg:w-[456px] lg:flex-shrink-0 flex-col bg-white border-r border-gray-200 z-10 h-[80vh]">
        {currentAddress ? (
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
                <PropertyCardClick property={similarProperties[currentIndex]} onClick={() => {}} compact />
              </motion.div>
            )}

            {/* Navigation arrows if multiple properties */}
            {similarProperties.length > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentIndex(prev => (prev > 0 ? prev - 1 : similarProperties.length - 1))}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: 'white',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  &lt;
                </button>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#3b82f6',
                    fontWeight: 500,
                    padding: '0 12px',
                    fontFamily: 'Inter',
                  }}
                >
                  {currentIndex + 1} / {similarProperties.length}
                </span>
                <button
                  onClick={() => setCurrentIndex(prev => (prev < similarProperties.length - 1 ? prev + 1 : 0))}
                  style={{
                    padding: '4px 8px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    background: 'white',
                    color: '#666',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontFamily: 'Inter',
                    fontWeight: 600,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  &gt;
                </button>
              </div>
            )}
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
                  <option value="">Sélectionner...</option>
                  <option value="date-desc">Les plus récentes</option>
                  <option value="date-asc">Les plus anciennes</option>
                  <option value="price-desc">Prix le plus haut</option>
                  <option value="price-asc">Prix le plus bas</option>
                  <option value="sqm-desc">Prix au m² le plus haut</option>
                  <option value="sqm-asc">Prix au m² le plus bas</option>
                </select>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 sm:p-3 space-y-2 pb-16">
              {sortedProperties.length > 0 ? (
                sortedProperties.map((property, index) => (
                  <PropertyCard
                    key={property.id && !isNaN(property.id) ? property.id : `property-${index}-${property.address}`}
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

      {/* --- Map Container - Same height as property list --- */}
      <div className="flex-1 relative w-full h-[80vh]">
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
          isFilterOpen={isFilterOpen} // **NEW**: Pass filter popup state to close other popups
          onCloseStatsPopup={() => {}} // **NEW**: Pass empty function to enable stats popup closing
        />
      </div>
    </div>
  );
};

export default PropertyList;
