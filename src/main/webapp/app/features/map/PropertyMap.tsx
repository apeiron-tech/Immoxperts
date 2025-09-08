import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './styles/mapbox-popup.css';
// Add CSS import at the top (make sure this is included)
import 'mapbox-gl/dist/mapbox-gl.css';
import { FilterState } from '../../types/filters';

// Types definitions
interface Feature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    [key: string]: any;
  };
  id?: string | number;
}

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
  coordinates: [number, number];
  rawData: {
    terrain: any;
    mutationType: string;
    department: string;
  };
}

interface MapPageProps {
  selectedFeature?: Feature | null;
  properties?: Property[];
  onMapMove?: (coordinates: [number, number]) => void;
  onPropertySelect?: (property: Property) => void;
  onAddressSelect?: (address: { address: string; city: string; mutations?: any[] }) => void;
  searchParams?: {
    coordinates?: [number, number];
    address?: string;
  };
  selectedProperty?: Property | null;
  hoveredProperty?: Property | null;
  filterState?: FilterState;
  onDataUpdate?: (mutationData: any[]) => void; // **NEW**: Callback to update PropertyCard data
  onMapHover?: (propertyId: number | null) => void; // **NEW**: Callback for map hover
  dataVersion?: number; // **NEW**: Data version to trigger zone stats recalculation
}

interface AddressProperties {
  id: string | number;
  numero: string;
  nomVoie: string;
  codeCommune: string;
}

interface ParcelProperties {
  id: string | number;
  commune: string;
  contenance: number;
  numero: string;
}

// Type guard to check if geometry is a Point
interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

function isPointGeometry(geometry: any): geometry is PointGeometry {
  return geometry && geometry.type === 'Point' && Array.isArray(geometry.coordinates);
}

// Set access token
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1tb3hwZXJ0IiwiYSI6ImNtZXV3bGtyNzBiYmQybXNoMnE5NmUzYWsifQ.mGxg2EbZxRAQJ4sOapI63w';

// Debounce utility
function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Helper functions for stats panel
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num);
};

const getStatsShortTypeName = (type: string) => {
  const shortNames = {
    Appartement: 'Appartement',
    Maison: 'Maison',
    Terrain: 'Terrain',
    'Bien Multiple': 'Bien Multiple',
  };
  return shortNames[type] || type;
};

// **NEW**: Function to calculate statistics from map data
const calculateZoneStats = (mapFeatures: any[]) => {
  console.warn('🔄 calculateZoneStats called with', mapFeatures.length, 'features');

  const propertyTypeNames = ['Appartement', 'Maison', 'Terrain', 'Bien Multiple'];
  const stats = [];

  propertyTypeNames.forEach(typeName => {
    const uniqueMutations = new Map(); // Use Map to track unique mutations by ID

    // Extract all mutations of this type from map features
    mapFeatures.forEach(feature => {
      if (feature.properties && feature.properties.adresses) {
        try {
          const addresses =
            typeof feature.properties.adresses === 'string' ? JSON.parse(feature.properties.adresses) : feature.properties.adresses;

          if (Array.isArray(addresses)) {
            addresses.forEach(address => {
              if (address.mutations && Array.isArray(address.mutations)) {
                address.mutations.forEach(mutation => {
                  if (mutation.type_groupe === typeName) {
                    // Only add if we haven't seen this mutation ID before
                    if (!uniqueMutations.has(mutation.id)) {
                      uniqueMutations.set(mutation.id, mutation);
                      console.warn(
                        `✅ Added unique mutation: ${mutation.id} (${mutation.type_groupe}) - Price: ${mutation.valeur}, Price/m²: ${mutation.prix_m2}`,
                      );
                    } else {
                      console.warn(`🔄 Skipped duplicate mutation: ${mutation.id} (${mutation.type_groupe})`);
                    }
                  }
                });
              }
            });
          }
        } catch (err) {
          console.error('Error parsing addresses:', err);
        }
      }
    });

    // Convert Map values back to array
    const mutations = Array.from(uniqueMutations.values());

    console.warn(`🔍 ${typeName}: Found ${uniqueMutations.size} unique mutations out of total processed`);

    // Calculate statistics for this property type
    if (mutations.length > 0) {
      const prices = mutations.map(m => m.valeur || 0).filter(p => p > 0);
      const pricesPerM2 = mutations.map(m => m.prix_m2 || 0).filter(p => p > 0);

      // Calculate medians
      const medianPrice = prices.length > 0 ? calculateMedian(prices) : 0;
      const medianPricePerM2 = pricesPerM2.length > 0 ? calculateMedian(pricesPerM2) : 0;

      // Debug logging
      console.warn(
        `📊 ${typeName}: ${mutations.length} unique mutations, median price: ${medianPrice}, median price/m²: ${medianPricePerM2}`,
      );

      stats.push({
        typeGroupe: typeName,
        nombre: mutations.length, // This now represents unique mutations
        prixMoyen: Math.round(medianPrice),
        prixM2Moyen: Math.round(medianPricePerM2),
      });
    } else {
      // No data for this type
      stats.push({
        typeGroupe: typeName,
        nombre: 0,
        prixMoyen: 0,
        prixM2Moyen: 0,
      });
    }
  });

  console.warn('📊 Final zone stats calculated:', stats);
  return stats;
};

// Helper function to calculate median
const calculateMedian = (values: number[]) => {
  if (values.length === 0) return 0;

  const sorted = values.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
};

// Function to get INSEE code from coordinates
const getINSEECodeFromCoords = async (lng: number, lat: number) => {
  try {
    const response = await axios.get(`https://api-adresse.data.gouv.fr/reverse/`, {
      params: {
        lon: lng,
        lat,
      },
    });

    if (response.data && response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      const properties = feature.properties;

      return {
        city: properties.city || properties.name,
        insee: properties.citycode,
      };
    }
    return null;
  } catch (err) {
    console.error('Error getting INSEE code:', err);
    return null;
  }
};

const PropertyMap: React.FC<MapPageProps> = ({
  selectedFeature,
  properties,
  onMapMove,
  onPropertySelect,
  onAddressSelect,
  searchParams,
  selectedProperty,
  hoveredProperty,
  filterState,
  onDataUpdate,
  onMapHover,
  dataVersion,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // Stats panel state
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [activePropertyType, setActivePropertyType] = useState(0);
  const [propertyStats, setPropertyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [currentCity, setCurrentCity] = useState('AJACCIO');
  const [selectedAddress, setSelectedAddress] = useState<[number, number] | null>(null);
  const [currentINSEE, setCurrentINSEE] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // **NEW**: Stats scope selection (commune or zone)
  const [statsScope, setStatsScope] = useState<'commune' | 'zone'>('commune');
  const [zoneStats, setZoneStats] = useState([]);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [debugging, setDebugging] = useState<boolean>(true); // Enable debugging
  const hoveredSelectedId = useRef<string | number | null>(null);
  const [currentActiveFilters, setCurrentActiveFilters] = useState<FilterState | null>(null);
  // Save filter parameters locally so they persist between map moves
  const [savedFilterParams, setSavedFilterParams] = useState<any>(null);
  // Use a ref to store current active filters to prevent state reset issues
  const currentActiveFiltersRef = useRef<FilterState | null>(null);

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    if (debugging) {
      console.warn(`[MapboxDebug] ${message}`, data || '');
    }
  };

  // Function to check WebGL support
  const checkWebGLSupport = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        debugLog('WebGL is supported');
        return true;
      } else {
        debugLog('WebGL is NOT supported');
        setMapError('WebGL is not supported in this browser');
        return false;
      }
    } catch (e) {
      debugLog('Error checking WebGL support:', e);
      setMapError('Error checking WebGL support');
      return false;
    }
  };

  // Helper function to convert filter state to API parameters
  const convertFilterStateToParams = (currentFilterState: FilterState) => {
    // Convert property types to API format
    const propertyTypeMap = {
      appartement: '0', // Appartement
      maison: '1', // Maison
      biensMultiples: '2', // Bien Multiple
      terrain: '4', // Terrain
      localCommercial: '5', // Local Commercial
    };

    const selectedPropertyTypes = Object.entries(currentFilterState.propertyTypes)
      .filter(([_, isSelected]) => isSelected)
      .map(([type, _]) => propertyTypeMap[type as keyof typeof propertyTypeMap])
      .filter(Boolean);

    // Convert room counts to API format
    const roomCountMap = {
      studio: '1',
      deuxPieces: '2',
      troisPieces: '3',
      quatrePieces: '4',
      cinqPiecesPlus: '5,6,7,8,9,10',
    };

    const selectedRoomCounts = Object.entries(currentFilterState.roomCounts)
      .filter(([_, isSelected]) => isSelected)
      .map(([room, _]) => roomCountMap[room as keyof typeof roomCountMap])
      .filter(Boolean)
      .join(',');

    // Convert date range from months to actual dates
    const startDate = new Date(2014, 0, 1); // January 2014
    const minDate = new Date(startDate.getTime() + currentFilterState.dateRange[0] * 30 * 24 * 60 * 60 * 1000);
    const maxDate = new Date(startDate.getTime() + currentFilterState.dateRange[1] * 30 * 24 * 60 * 60 * 1000);

    return {
      propertyType: selectedPropertyTypes.length > 0 ? selectedPropertyTypes.join(',') : '0,1,2,4,5',
      roomCount: selectedRoomCounts || '1,2,3,4,5,6,7,8,9,10',
      minSellPrice: currentFilterState.priceRange[0].toString(),
      maxSellPrice: currentFilterState.priceRange[1].toString(),
      minSurface: currentFilterState.surfaceRange[0].toString(),
      maxSurface: currentFilterState.surfaceRange[1].toString(),
      minSurfaceLand: currentFilterState.terrainRange[0].toString(), // Using terrain range for land
      maxSurfaceLand: currentFilterState.terrainRange[1].toString(),
      minSquareMeterPrice: currentFilterState.pricePerSqmRange[0].toString(),
      maxSquareMeterPrice: currentFilterState.pricePerSqmRange[1].toString(),
      minDate: minDate.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
    };
  };

  // Load initial data with default parameters (no filters)
  const loadInitialData = async () => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) {
      debugLog('Map not ready for initial data loading');
      return;
    }

    try {
      const b = mapRef.current.getBounds();
      const bounds = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
      debugLog('Loading initial data with current map bounds:', bounds);

      const params = new URLSearchParams({
        bounds: bounds.join(','),
        propertyType: '0,1,2,4,5', // All property types
        roomCount: '1,2,3,4,5,6,7,8,9,10', // All room counts
        minSellPrice: '0',
        maxSellPrice: '20000000',
        minSurface: '0',
        maxSurface: '400',
        minSurfaceLand: '0',
        maxSurfaceLand: '50000',
        minSquareMeterPrice: '0',
        maxSquareMeterPrice: '40000',
        minDate: '2013-12-31',
        maxDate: new Date().toISOString().split('T')[0],
        limit: '500',
      });

      const apiUrl = `https://immoxperts.apeiron-tech.dev/api/mutations/search?${params.toString()}`;
      debugLog('Calling initial API:', apiUrl);

      const { data } = await axios.get(apiUrl);
      debugLog('Initial API response data:', data);
      debugLog('Number of features in response:', data.features?.length || 0);

      // Transform the data to GeoJSON format for Mapbox
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: (data.features || []).map((feature: any, index: number) => ({
          ...feature,
          id: feature.properties?.idparcelle || `mutation-${index}`,
        })),
      };

      debugLog('Initial GeoJSON data created with features:', geojsonData.features.length);

      const source = mapRef.current.getSource('mutations-live');
      if (source && 'setData' in source) {
        source.setData(geojsonData);
        debugLog(`Updated mutations source with ${geojsonData.features.length} initial features`);

        // **NEW**: Notify PropertyList about new data
        if (onDataUpdate) {
          console.warn('🔄 PropertyMap (initial): Calling onDataUpdate with', geojsonData.features.length, 'features');
          onDataUpdate(geojsonData.features);
        } else {
          console.warn('⚠️ PropertyMap (initial): onDataUpdate callback not provided!');
        }

        // **NEW**: Recalculate zone stats immediately after initial data is loaded
        if (statsScope === 'zone') {
          setTimeout(() => {
            console.warn('📊 Recalculating zone stats after initial data load...');
            console.warn('📊 Current statsScope:', statsScope);

            if (mapRef.current && mapRef.current.getSource('mutations-live')) {
              const features = mapRef.current.querySourceFeatures('mutations-live');
              console.warn('📊 Found', features.length, 'features for initial zone stats calculation');

              const calculatedStats = calculateZoneStats(features);
              console.warn('📊 Initial zone stats calculated:', calculatedStats);

              setZoneStats(calculatedStats);
            } else {
              console.warn('📊 ERROR: Map or source not available for initial zone stats calculation');
            }
          }, 200); // Increased delay to ensure map data is fully processed
        }
      }
    } catch (e) {
      debugLog('Failed to load initial data:', e);
      console.error('Échec du chargement des données initiales:', e);
    }
  };

  // Load mutations data from the new API
  const loadMutationsData = async () => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) {
      debugLog('Map not ready for mutations loading');
      return;
    }

    try {
      const b = mapRef.current.getBounds();
      const bounds = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
      debugLog('Loading mutations for bounds:', bounds);

      // Determine which filters to use - prioritize current active filters
      let filtersToUse;
      let filterParams;

      debugLog('=== FILTER STATE DEBUG ===');
      debugLog('filterState:', filterState);
      debugLog('currentActiveFilters:', currentActiveFilters);
      debugLog('currentActiveFiltersRef.current:', currentActiveFiltersRef.current);

      if (filterState) {
        // New filters from parent component - use these and update active filters
        filtersToUse = filterState;
        setCurrentActiveFilters(filterState);
        currentActiveFiltersRef.current = filterState;
        debugLog('Using new filter state from parent:', filterState);
        filterParams = convertFilterStateToParams(filtersToUse);
      } else if (currentActiveFiltersRef.current) {
        // Use previously set active filters from ref
        filtersToUse = currentActiveFiltersRef.current;
        debugLog('Using current active filters from ref:', currentActiveFiltersRef.current);
        filterParams = convertFilterStateToParams(filtersToUse);
      } else {
        // No filters available - use default parameters
        debugLog('No filter parameters available - using default parameters');
        filterParams = {
          bounds: bounds.join(','),
          limit: '500',
        };
      }
      debugLog('Using filter parameters:', filterParams);

      // Build the API URL with current bounds and filter parameters
      const params = new URLSearchParams({
        bounds: bounds.join(','),
        ...filterParams,
      });

      const apiUrl = `https://immoxperts.apeiron-tech.dev/api/mutations/search?${params.toString()}`;
      debugLog('Calling API:', apiUrl);

      const { data } = await axios.get(apiUrl);
      debugLog('API response data:', data);
      debugLog('Number of features in response:', data.features?.length || 0);

      // Transform the data to GeoJSON format for Mapbox
      const geojsonData = {
        type: 'FeatureCollection' as const,
        features: (data.features || []).map((feature: any, index: number) => ({
          ...feature,
          id: feature.properties?.idparcelle || `mutation-${index}`,
        })),
      };

      debugLog('GeoJSON data created with features:', geojsonData.features.length);

      const source = mapRef.current.getSource('mutations-live');
      if (source && 'setData' in source) {
        source.setData(geojsonData);
        debugLog(`Updated mutations source with ${geojsonData.features.length} features`);

        // **NEW**: Notify PropertyList about new data
        if (onDataUpdate) {
          console.warn('🔄 PropertyMap (move): Calling onDataUpdate with', geojsonData.features.length, 'features');
          onDataUpdate(geojsonData.features);

          // **ADDITIONAL**: Force zone stats recalculation right after property list update
          if (statsScope === 'zone') {
            setTimeout(() => {
              console.warn('📊 DIRECT: Force recalculating zone stats after property list update');
              const features = mapRef.current.querySourceFeatures('mutations-live');
              console.warn('📊 DIRECT: Features found for calculation:', features.length);
              const calculatedStats = calculateZoneStats(features);
              console.warn('📊 DIRECT: New zone stats calculated:', calculatedStats);
              setZoneStats(calculatedStats);
            }, 500); // Wait for property list to finish updating
          }
        } else {
          console.warn('⚠️ PropertyMap (move): onDataUpdate callback not provided!');
        }

        // **NEW**: Recalculate zone stats immediately after new data is loaded
        if (statsScope === 'zone') {
          setTimeout(() => {
            console.warn('📊 Recalculating zone stats after new data load...');
            console.warn('📊 Current statsScope:', statsScope);

            if (mapRef.current && mapRef.current.getSource('mutations-live')) {
              const features = mapRef.current.querySourceFeatures('mutations-live');
              console.warn('📊 Found', features.length, 'features for zone stats recalculation');

              const calculatedStats = calculateZoneStats(features);
              console.warn('📊 Newly calculated zone stats:', calculatedStats);

              setZoneStats(calculatedStats);
              console.warn('📊 Zone stats state updated!');
            } else {
              console.warn('📊 ERROR: Map or source not available for zone stats recalculation');
            }
          }, 200); // Increased delay to ensure map data is fully processed
        } else {
          console.warn('📊 Not recalculating zone stats because statsScope is:', statsScope);
        }
      }
    } catch (e) {
      debugLog('Failed to load mutations:', e);
      console.error('Échec du chargement des mutations:', e);
    }
  };

  // Map initialization with extensive error handling
  useEffect(() => {
    if (mapRef.current) {
      debugLog('Map already initialized, skipping');
      return;
    }

    if (!mapContainer.current) {
      debugLog('Map container not found');
      setMapError('Map container not found');
      return;
    }

    // Check WebGL support before initializing
    if (!checkWebGLSupport()) {
      return;
    }

    debugLog('Initializing Mapbox map...');

    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/immoxpert/cmck83rh6001501r1dlt1fy8k',
        center: [8.73692, 41.9281], // Corsica center
        zoom: 12,
        minZoom: 13, // Limit zoom out to 1km maximum (zoom level 13 = ~1km scale)
        maxZoom: 18,
        antialias: true, // Enable antialiasing for better performance
        attributionControl: false, // Remove Mapbox attribution
      });

      const map = mapRef.current;
      debugLog('Map instance created');

      // Enhanced error handling
      map.on('error', (e: mapboxgl.ErrorEvent) => {
        debugLog('Mapbox error occurred:', e.error);
        console.error('Erreur Mapbox:', e.error);
        setMapError(`Mapbox error: ${e.error.message || 'Unknown error'}`);
      });

      // Style loading events
      map.on('styledata', () => {
        debugLog('Style data loaded');
      });

      map.on('sourcedataloading', e => {
        debugLog('Source data loading:', e.sourceId);
      });

      map.on('sourcedata', e => {
        debugLog('Source data loaded:', e.sourceId);
      });

      // Main load event with comprehensive setup
      map.on('load', () => {
        debugLog('Map loaded successfully!');
        setMapLoaded(true);
        setMapError(null);

        try {
          // ===================================================================
          // SECTION 1: CADASTRAL PARCELS LAYER
          // ===================================================================
          debugLog('Adding parcels source...');

          map.addSource('parcelles-source', {
            type: 'vector',
            url: 'mapbox://immoxpert.parcelles-finales',
            promoteId: 'id',
          });

          debugLog('Adding parcels layer...');
          map.addLayer({
            id: 'parcelles-layer',
            type: 'fill',
            source: 'parcelles-source',
            'source-layer': 'parcelles_pour_mapbox_final',
            paint: {
              'fill-color': '#6e599f',
              'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.5, 0.2],
              'fill-outline-color': 'rgba(0, 0, 0, 0.5)',
            },
          });

          // Parcel interactivity
          let hoveredParcelId: string | number | null = null;

          map.on('mousemove', 'parcelles-layer', (e: mapboxgl.MapMouseEvent) => {
            map.getCanvas().style.cursor = 'pointer';
            if (e.features && e.features.length > 0) {
              if (hoveredParcelId !== null) {
                map.setFeatureState(
                  {
                    source: 'parcelles-source',
                    sourceLayer: 'parcelles_pour_mapbox_final',
                    id: hoveredParcelId,
                  },
                  { hover: false },
                );
              }
              hoveredParcelId = e.features[0].id!;
              map.setFeatureState(
                {
                  source: 'parcelles-source',
                  sourceLayer: 'parcelles_pour_mapbox_final',
                  id: hoveredParcelId,
                },
                { hover: true },
              );
            }
          });

          map.on('mouseleave', 'parcelles-layer', () => {
            map.getCanvas().style.cursor = '';
            if (hoveredParcelId !== null) {
              map.setFeatureState(
                {
                  source: 'parcelles-source',
                  sourceLayer: 'parcelles_pour_mapbox_final',
                  id: hoveredParcelId,
                },
                { hover: false },
              );
            }
            hoveredParcelId = null;
          });

          // ===================================================================
          // SECTION 2: MUTATIONS LAYER (Blue Points)
          // ===================================================================
          debugLog('Adding mutations source...');

          map.addSource('mutations-live', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
            promoteId: 'id',
          });

          // Main circle layer - normal appearance
          map.addLayer({
            id: 'mutation-point',
            type: 'circle',
            source: 'mutations-live',
            paint: {
              'circle-color': '#7069F9',
              'circle-radius': 4,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
              'circle-stroke-opacity': 0.9,
              'circle-opacity': 0.8,
            },
          });

          // Add a separate source for the hovered circle shadow
          map.addSource('hovered-circle', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });

          // Shadow layer for the hovered circle only
          map.addLayer(
            {
              id: 'hovered-circle-shadow',
              type: 'circle',
              source: 'hovered-circle',
              paint: {
                'circle-radius': 22, // Slightly larger than main circle for shadow effect
                'circle-color': 'rgba(112, 105, 249, 0.99)', // Shadow matching new circle color #7069F9
                'circle-blur': 1,
                'circle-opacity': 1.0,
              },
            },
            'mutation-point',
          ); // Insert below main layer

          // Add shadow layer for depth effect

          // ===================================================================
          // SECTION 4: SELECTED ADDRESS RED MARKER
          // ===================================================================
          debugLog('Adding selected address marker source...');

          map.addSource('selected-address-marker', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });

          map.addLayer({
            id: 'selected-address-marker',
            type: 'circle',
            source: 'selected-address-marker',
            paint: {
              'circle-color': '#ff0000', // Red color
              'circle-radius': 8,
              'circle-stroke-width': 3,
              'circle-stroke-color': '#fff',
              'circle-stroke-opacity': 0.8,
            },
          });

          debugLog('Mutation layers added to map');

          // ===================================================================
          // SECTION 3: MUTATION POINT INTERACTIVITY - FIXED VERSION
          // ===================================================================

          // Mutation point interactivity with hover popup - CLEANED UP VERSION
          let hoverPopup = null;

          // Simple hover detection - try a different approach
          let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

          // Handle mouse enter - add only the hovered circle to separate source
          map.on('mouseenter', 'mutation-point', e => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];

              // Add the hovered feature to the separate source
              const hoveredFeatureData: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [feature as GeoJSON.Feature],
              };

              // Update the hovered-circle source with just this feature
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);

              map.getCanvas().style.cursor = 'pointer';

              // Notify PropertyList about hover
              if (onMapHover && feature.properties?.idparcelle) {
                onMapHover(parseInt(feature.properties.idparcelle, 10));
              }
            }
          });

          map.on('mouseleave', 'mutation-point', () => {
            // Clear the hovered-circle source (remove all features)
            const emptyFeatureCollection: GeoJSON.FeatureCollection = {
              type: 'FeatureCollection',
              features: [],
            };
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);

            map.getCanvas().style.cursor = '';

            if (onMapHover) {
              onMapHover(null);
            }
          });

          map.on('mousemove', e => {
            // Clear any existing timeout
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              hoverTimeout = null;
            }

            // Set a small delay to avoid too many queries
            hoverTimeout = setTimeout(() => {
              const features = map.queryRenderedFeatures(e.point, { layers: ['mutation-point'] });

              debugLog('Mouse moved, features found:', features.length);

              if (features.length > 0) {
                const feature = features[0];
                debugLog('Feature found:', feature);

                // Remove existing popup
                if (hoverPopup) {
                  hoverPopup.remove();
                  hoverPopup = null;
                }

                // Create mutation data popup
                if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
                  try {
                    const addresses = JSON.parse(feature.properties.adresses);

                    if (addresses && addresses.length > 0) {
                      const firstAddress = addresses[0];
                      const mutations = firstAddress.mutations || [];

                      // Helper functions for your styling
                      const getPropertyTypeColor = type => {
                        const colors = {
                          Appartement: '#6929CF',
                          Maison: '#121852',
                          Terrain: '#2971CF',
                          Local: '#862CC7',
                          'Bien Multiple': '#381EB0',
                        };
                        const shortType = getShortTypeName(type);
                        return colors[shortType] || '#9CA3AF';
                      };

                      const getShortTypeName = type => {
                        const shortNames = {
                          Appartement: 'Appartement',
                          Maison: 'Maison',
                          Terrain: 'Terrain',
                          'Local Commercial': 'Local',
                          'Bien Multiple': 'Bien Multiple',
                        };
                        return shortNames[type];
                      };

                      const formatFrenchDate = dateString => {
                        if (!dateString) return 'N/A';
                        const date = new Date(dateString);
                        return date.toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        });
                      };

                      const formatPrice = price => {
                        return new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(price);
                      };

                      const formatPricePerSqm = (price, surface) => {
                        if (!surface || surface === 0) return 'N/A';
                        const pricePerSqm = Math.round(price / surface);
                        return `${pricePerSqm.toLocaleString('fr-FR')} €/m²`;
                      };

                      // Get the first mutation for display
                      const firstMutation = mutations.length > 0 ? mutations[0] : null;

                      if (firstMutation) {
                        // Create a function to render mutation data - show ALL mutations, not just 5
                        const allMutations = mutations; // Remove the slice(0, 5) limit
                        let currentIndex = 0;

                        const renderMutation = index => {
                          const mutation = allMutations[index];
                          const address = firstAddress.adresse_complete || '';
                          const propertyTypeLabel = mutation.type_groupe || 'Default';
                          const rooms = mutation.nbpprinc || 0;
                          const surface = mutation.sbati || 0;
                          const terrain = mutation.sterr || 0;
                          const price = mutation.valeur || 0;
                          const soldDate = mutation.date || '';
                          const priceFormatted = formatPrice(price);
                          const pricePerSqm = formatPricePerSqm(price, surface);

                          // Build the details string, only showing non-zero values
                          const details = [];
                          if (rooms > 0) details.push(`${rooms} pièces`);
                          if (surface > 0) details.push(`${surface.toLocaleString('fr-FR')} m²`);
                          if (terrain > 0) details.push(`Terrain ${terrain.toLocaleString('fr-FR')} m²`);

                          const detailsText = details.length > 0 ? details.join(' – ') : 'N/A';

                          return `
             <div style="
               background: #fff;
               padding: 1px;
               font-family: 'Maven Pro', sans-serif;
               max-width: 450px;
               width: 100%;
               position: relative;
               border-radius: 16px;
             ">
               <!-- Address -->
               <div style="font-weight: 700; font-size: 16px;width:75%; margin-bottom: 10px; color: #1a1a1a;">
                   ${address.toUpperCase() || ''}
               </div>

               <!-- Property Type, Rooms, Surface, Terrain -->
               <div style="font-size: 16px;width:70%; color: #333;">
                 <span style="color: ${getPropertyTypeColor(propertyTypeLabel)}; font-weight: 900; margin-bottom: 10px;">
                   ${getShortTypeName(propertyTypeLabel)}
                 </span>
                   <span style="margin-top: 10px;">${detailsText}</span>
               </div>

               <!-- Price Box -->
               <div style="
                 position: absolute;
                 top: 0px;
                 right: 0px;
                 border: 1px solid #e5e7eb;
                 padding: 10px 14px;
                 border-radius: 12px;
                 text-align: right;
                 min-width: 110px;
               ">
                 <div style="color: #241c83; font-weight: 800; font-size: 18px;">${priceFormatted}</div>
                 <div style="color: #888; font-size: 14px;">${pricePerSqm}</div>
               </div>

               <!-- Sold Date -->
               <div style="
                 margin-top: 16px;
                 display: inline-block;
                 border: 1px solid #e5e7eb;
                 padding: 10px 14px;
                 border-radius: 12px;
                 font-size: 14px;
                 color: #444;
               ">
                   Vendu le <strong style="color: #000;">${formatFrenchDate(soldDate || '')}</strong>
               </div>
               
               ${
                 allMutations.length > 1
                   ? `
               <!-- Navigation -->
               <div style="
                 margin-top: 8px;
                 display: flex;
                 align-items: center;
                 justify-content: center;
                 gap: 4px;
                 padding: 4px;
                 
               ">
                 <button class="prev-btn" style="
                   padding: 4px 8px;
                   border: 1px solid #e5e7eb;
                   border-radius: 6px;
                   background: white;
                   color: #666;
                   cursor: pointer;
                   font-size: 12px;
                   hover:background: #f9fafb;
                 ">&lt;</button>
                 <span style="
                   font-size: 12px;
                   color: #3b82f6;
                   font-weight: 500;
                   padding: 0 12px;
                 ">${index + 1} / ${allMutations.length}</span>
                 <button class="next-btn" style="
                   padding: 4px 8px;
                   border: 1px solid #e5e7eb;
                   border-radius: 6px;
                   background: white;
                   color: #666;
                   cursor: pointer;
                   font-size: 12px;
                   hover:background: #f9fafb;
                 ">&gt;</button>
               </div>
               `
                   : ''
               }
             </div>
           `;
                        };

                        const popupContent = renderMutation(currentIndex);

                        hoverPopup = new mapboxgl.Popup({
                          closeButton: false,
                          closeOnClick: false,
                          maxWidth: '450px',
                          offset: [0, -5],
                          className: 'mutation-hover-popup',
                        })
                          .setLngLat(feature.geometry.coordinates)
                          .setHTML(popupContent)
                          .addTo(map);

                        // Function to add navigation event listeners
                        const addNavigationListeners = () => {
                          setTimeout(() => {
                            const popupElement = hoverPopup.getElement();
                            const prevBtn = popupElement.querySelector('.prev-btn');
                            const nextBtn = popupElement.querySelector('.next-btn');

                            if (prevBtn) {
                              prevBtn.addEventListener('click', event => {
                                event.stopPropagation();
                                currentIndex = currentIndex > 0 ? currentIndex - 1 : allMutations.length - 1;
                                hoverPopup.setHTML(renderMutation(currentIndex));
                                addNavigationListeners(); // Re-add listeners after HTML update
                              });
                            }

                            if (nextBtn) {
                              nextBtn.addEventListener('click', event => {
                                event.stopPropagation();
                                currentIndex = currentIndex < allMutations.length - 1 ? currentIndex + 1 : 0;
                                hoverPopup.setHTML(renderMutation(currentIndex));
                                addNavigationListeners(); // Re-add listeners after HTML update
                              });
                            }
                          }, 100);
                        };

                        // Add navigation event listeners if multiple mutations
                        if (allMutations.length > 1) {
                          addNavigationListeners();
                        }

                        debugLog('Mutation popup created with data');
                      } else {
                        // Fallback if no mutations
                        hoverPopup = new mapboxgl.Popup({
                          closeButton: false,
                          closeOnClick: false,
                          maxWidth: '200px',
                          offset: [0, -10],
                        })
                          .setLngLat(e.lngLat)
                          .setHTML(
                            `
                            <div style="padding: 10px; background: #ffaa00; color: white; border-radius: 4px;">
                              <strong>No Mutation Data</strong><br>
                              Feature ID: ${feature.id || 'No ID'}
                            </div>
                          `,
                          )
                          .addTo(map);
                      }
                    } else {
                      // Fallback if no addresses
                      hoverPopup = new mapboxgl.Popup({
                        closeButton: false,
                        closeOnClick: false,
                        maxWidth: '200px',
                        offset: [0, -10],
                      })
                        .setLngLat(e.lngLat)
                        .setHTML(
                          `
                          <div style="padding: 10px; background: #ffaa00; color: white; border-radius: 4px;">
                            <strong>No Address Data</strong><br>
                            Feature ID: ${feature.id || 'No ID'}
                          </div>
                        `,
                        )
                        .addTo(map);
                    }
                  } catch (err) {
                    debugLog('Error parsing addresses JSON:', err);
                    // Fallback popup on error
                    hoverPopup = new mapboxgl.Popup({
                      closeButton: false,
                      closeOnClick: false,
                      maxWidth: '200px',
                      offset: [0, -10],
                    })
                      .setLngLat(e.lngLat)
                      .setHTML(
                        `
                        <div style="padding: 10px; background: #ff0000; color: white; border-radius: 4px;">
                          <strong>Error Parsing Data</strong><br>
                          ${err.message}
                        </div>
                      `,
                      )
                      .addTo(map);
                  }
                } else {
                  // Fallback if no properties
                  hoverPopup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false,
                    maxWidth: '200px',
                    offset: [0, -10],
                  })
                    .setLngLat(e.lngLat)
                    .setHTML(
                      `
                      <div style="padding: 10px; background: #ffaa00; color: white; border-radius: 4px;">
                        <strong>No Properties</strong><br>
                        Feature ID: ${feature.id || 'No ID'}
                      </div>
                    `,
                    )
                    .addTo(map);
                }

                debugLog('Hover popup created at:', e.lngLat);
                map.getCanvas().style.cursor = 'pointer';
              } else {
                // No features under mouse
                if (hoverPopup) {
                  hoverPopup.remove();
                  hoverPopup = null;
                  debugLog('Hover popup removed - no features');
                }
                map.getCanvas().style.cursor = '';
              }
            }, 100); // 100ms delay
          });

          // Click handler for mutations (separate from hover)
          map.on('click', 'mutation-point', e => {
            debugLog('Clicked mutation point:', e.features);
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];

              // Remove hover popup if it exists (click popup will replace it)
              if (hoverPopup) {
                hoverPopup.remove();
                hoverPopup = null;
              }

              if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
                try {
                  const addresses = JSON.parse(feature.properties.adresses);

                  if (addresses && addresses.length > 0) {
                    let popupContent = '';

                    if (addresses.length === 1) {
                      const address = addresses[0];
                      const hasMutations = address.mutations && Array.isArray(address.mutations) && address.mutations.length > 0;

                      popupContent = `
                        <div style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
                          <div style="font-weight: bold; font-size: 14px; color: #3b82f6;">
                            ${address.adresse_complete}
                          </div>
                          <div style="font-size: 11px; color: #666; margin-top: 3px;">
                            ${address.commune} (${address.codepostal})
                          </div>
                          ${
                            hasMutations
                              ? `
                            <div style="margin-top: 8px; font-size: 10px; color: #059669;">
                              ${address.mutations.length} transaction(s) disponible(s)
                            </div>
                          `
                              : `
                            <div style="margin-top: 8px; font-size: 10px; color: #dc2626;">
                              Aucune transaction récente
                            </div>
                          `
                          }
                        </div>
                      `;
                    } else {
                      popupContent = `
                        <div style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
                          <div style="margin-bottom: 8px; font-weight: bold; color: #3b82f6;">
                            ${addresses.length} adresses:
                          </div>
                          ${addresses
                            .map((address, index) => {
                              const hasMutations = address.mutations && Array.isArray(address.mutations) && address.mutations.length > 0;
                              return `
                            <div 
                              style="
                                margin: 4px 0; 
                                padding: 6px; 
                                background: #f8f9fa; 
                                border-radius: 4px;
                                cursor: pointer;
                                transition: background-color 0.2s;
                                ${index > 0 ? 'border-top: 1px solid #e0e0e0;' : ''}
                              "
                              onmouseover="this.style.backgroundColor='#e5f3ff'"
                              onmouseout="this.style.backgroundColor='#f8f9fa'"
                              onclick="window.selectAddress && window.selectAddress(${index})"
                            >
                              <div style="font-weight: bold;">${address.adresse_complete}</div>
                              <div style="font-size: 11px; color: #666;">${address.commune} (${address.codepostal})</div>
                              ${
                                hasMutations
                                  ? `
                                <div style="font-size: 10px; color: #059669; margin-top: 2px;">
                                  ${address.mutations.length} transaction(s)
                                </div>
                              `
                                  : `
                                <div style="font-size: 10px; color: #dc2626; margin-top: 2px;">
                                  Aucune transaction
                                </div>
                              `
                              }
                            </div>
                          `;
                            })
                            .join('')}
                        </div>
                      `;
                    }

                    // Set up global function for address selection in multi-address popups
                    if (addresses.length > 1) {
                      (window as any).selectAddress = (index: number) => {
                        const clickedAddress = addresses[index];
                        const hasMutations =
                          clickedAddress.mutations && Array.isArray(clickedAddress.mutations) && clickedAddress.mutations.length > 0;

                        if (hasMutations) {
                          onAddressSelect?.({
                            address: clickedAddress.adresse_complete,
                            city: clickedAddress.commune,
                            mutations: clickedAddress.mutations,
                          });
                        }
                      };
                    }

                    // Create click popup (this one has close button)
                    const popup = new mapboxgl.Popup({
                      closeButton: true,
                      closeOnClick: true,
                      maxWidth: '400px',
                      offset: [0, -5], // Reduced offset - closer to the point
                    })
                      .setLngLat(feature.geometry.coordinates)
                      .setHTML(popupContent)
                      .addTo(map);

                    // Clean up global function when popup is closed
                    popup.on('close', () => {
                      if ((window as any).selectAddress) {
                        delete (window as any).selectAddress;
                      }
                    });

                    // Call onAddressSelect when an address is clicked (only for single address with mutations)
                    if (addresses.length === 1) {
                      const address = addresses[0];
                      const hasMutations = address.mutations && Array.isArray(address.mutations) && address.mutations.length > 0;

                      if (hasMutations) {
                        onAddressSelect?.({
                          address: address.adresse_complete,
                          city: address.commune,
                          mutations: address.mutations,
                        });
                      }
                    }
                  }
                } catch (err) {
                  debugLog('Error parsing addresses JSON in click handler:', err);
                }
              }
            }
          });

          debugLog('Mutation point event handlers set up successfully');

          // Add custom scale bar instead of default Mapbox scale control
          const createCustomScaleBar = () => {
            const scaleBarContainer = document.createElement('div');
            scaleBarContainer.style.cssText = `
               position: absolute;
               z-index: 10;
               box-shadow: none;
               border: none;
               inset: auto 10px 10px auto;
               background-color: rgb(255, 255, 255);
               opacity: 0.9;
               display: flex;
               flex-direction: row;
               align-items: baseline;
               padding: 0px 6px;
               border-radius: 0.2rem;
             `;

            const updateScaleBar = () => {
              const bounds = map.getBounds();
              const width = map.getContainer().offsetWidth;

              // Calculate the distance represented by the current view using zoom level
              const zoom = map.getZoom();
              const metersPerPixel = (156543.03392 * Math.cos((bounds.getCenter().lat * Math.PI) / 180)) / Math.pow(2, zoom);
              const distance = (metersPerPixel * width) / 1000; // Convert to km

              // Fixed width for the scale bar (60px)
              const fixedWidth = 60;

              // Calculate the distance represented by the fixed width scale bar
              const scaleDistance = (distance * fixedWidth) / width;

              // Round to a nice number with better precision
              let niceDistance = 1;
              let unit = 'km';

              if (scaleDistance >= 1) {
                // If we're at 1km or more, show in km
                if (scaleDistance >= 2) {
                  niceDistance = Math.round(scaleDistance);
                } else {
                  niceDistance = 1;
                }
                unit = 'km';
              } else {
                // Show in meters for distances less than 1km
                if (scaleDistance >= 0.9) {
                  niceDistance = 900;
                } else if (scaleDistance >= 0.8) {
                  niceDistance = 800;
                } else if (scaleDistance >= 0.7) {
                  niceDistance = 700;
                } else if (scaleDistance >= 0.6) {
                  niceDistance = 600;
                } else if (scaleDistance >= 0.5) {
                  niceDistance = 500;
                } else if (scaleDistance >= 0.4) {
                  niceDistance = 400;
                } else if (scaleDistance >= 0.3) {
                  niceDistance = 300;
                } else if (scaleDistance >= 0.2) {
                  niceDistance = 200;
                } else if (scaleDistance >= 0.1) {
                  niceDistance = 100;
                } else if (scaleDistance >= 0.05) {
                  niceDistance = 50;
                } else if (scaleDistance >= 0.02) {
                  niceDistance = 20;
                } else {
                  niceDistance = 10;
                }
                unit = 'm';
              }

              // Use fixed width instead of calculating actual width
              const actualWidth = fixedWidth;

              // Clear previous content
              scaleBarContainer.innerHTML = '';

              // Create scale bar element
              const scaleBar = document.createElement('div');
              scaleBar.style.cssText = `
                border-top: none;
                border-right: 2px solid rgb(126, 132, 144);
                border-bottom: 2px solid rgb(126, 132, 144);
                border-left: 2px solid rgb(126, 132, 144);
                box-shadow: rgba(0, 0, 0, 0.3) 0px 1px 4px;
                height: 7px;
                border-bottom-left-radius: 1px;
                border-bottom-right-radius: 1px;
                width: ${actualWidth}px;
              `;

              // Create label
              const label = document.createElement('div');
              label.style.cssText = `
                padding-left: 10px;
                font-family: Arial, sans-serif;
                font-size: 12px;
                color: #333;
              `;
              label.textContent = `${niceDistance} ${unit}`;

              scaleBarContainer.appendChild(scaleBar);
              scaleBarContainer.appendChild(label);
            };

            // Update scale bar on map events
            map.on('zoom', updateScaleBar);
            map.on('move', updateScaleBar);

            // Initial update
            updateScaleBar();

            return scaleBarContainer;
          };

          // Add custom scale bar to map
          const customScaleBar = createCustomScaleBar();
          map.getContainer().appendChild(customScaleBar);

          // Navigation controls will be added manually in JSX for better positioning

          // Load initial data after a short delay to ensure map is fully ready
          setTimeout(() => {
            debugLog('Loading initial data with default parameters...');
            loadInitialData();
          }, 1000);
          // Debounced function to prevent multiple rapid API calls
          const debouncedDataLoad = debounce(() => {
            debugLog('Debounced data load triggered');
            // Always use loadMutationsData which will handle both filtered and unfiltered cases
            loadMutationsData();
          }, 300);

          // Add event listeners for map movement
          map.on('moveend', () => {
            debugLog('Map move event triggered');
            debouncedDataLoad();

            if (onMapMove) {
              const center = map.getCenter();
              onMapMove([center.lng, center.lat]);
            }

            // **NEW**: Recalculate zone stats if needed
            recalculateZoneStatsIfNeeded();

            // ✅ MODIFIER cette partie dans votre useEffect existant
            const updateLocationName = async () => {
              try {
                const center = map.getCenter();
                if (!center) return;

                const locationData = await getINSEECodeFromCoords(center.lng, center.lat);

                if (locationData) {
                  setCurrentCity(locationData.city);
                  setCurrentINSEE(locationData.insee);
                  // ✅ SUPPRIMER cette ligne - les stats se chargent automatiquement via le useEffect ci-dessus
                  // await fetchPropertyStatsByINSEE(locationData.insee);
                }
              } catch (err) {
                setError('Erreur géocodage');
              }
            };

            updateLocationName();
          });

          map.on('zoomend', () => {
            debugLog('Map zoom event triggered');
            debouncedDataLoad();

            if (onMapMove) {
              const center = map.getCenter();
              onMapMove([center.lng, center.lat]);
            }
          });

          debugLog('Map event handlers set up successfully');
        } catch (err) {
          debugLog('Error during map setup:', err);
          setMapError(`Map setup error: ${err}`);
        }
      });
    } catch (err) {
      debugLog('Error creating map:', err);
      setMapError(`Map creation error: ${err}`);
    }
  }, []);

  // Event handlers are now set up in the map load event

  // Load initial data when map is first loaded
  useEffect(() => {
    if (mapLoaded && !currentActiveFilters && !filterState) {
      debugLog('Map loaded, loading initial data with defaults');
      loadInitialData();
    }
  }, [mapLoaded]);

  // Debug: Track currentActiveFilters changes
  useEffect(() => {
    debugLog('currentActiveFilters changed:', currentActiveFilters);
  }, [currentActiveFilters]);

  // Trigger data reload when filter state changes
  // Trigger data reload when filter state changes
  useEffect(() => {
    if (mapLoaded) {
      if (filterState) {
        debugLog('Filter state changed, triggering data reload');
        // The loadMutationsData function will handle setting currentActiveFilters
        loadMutationsData();
      } else if (!currentActiveFilters) {
        // Load initial data with default parameters when no filters are set
        debugLog('No filters available, loading initial data with defaults');
        loadInitialData();
      }
    }
  }, [filterState, mapLoaded]);

  // ✅ NOUVEAU - Simple appel API basé sur currentINSEE
  useEffect(() => {
    if (!currentINSEE || !showStatsPanel) return;

    const fetchStatsByINSEE = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // ✅ Appel à votre nouvelle API
        const response = await axios.get('/api/mutations/stats/by-city', {
          params: { codeInsee: currentINSEE },
        });

        setPropertyStats(response.data);
      } catch (err) {
        console.error('Erreur récupération statistiques:', err);
        setError('Erreur chargement statistiques');
        setPropertyStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatsByINSEE();
  }, [currentINSEE, showStatsPanel]);

  // **NEW**: Calculate zone statistics when scope is "zone" and map has data
  useEffect(() => {
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getSource('mutations-live')) {
      // Small delay to ensure map data is loaded
      setTimeout(() => {
        console.warn('📊 Calculating zone statistics from current map data...');

        const features = mapRef.current.querySourceFeatures('mutations-live');
        console.warn('📊 Found', features.length, 'features on map for zone stats');

        const calculatedStats = calculateZoneStats(features);
        console.warn('📊 Calculated zone stats:', calculatedStats);

        setZoneStats(calculatedStats);
      }, 500); // 500ms delay to ensure data is loaded
    }
  }, [statsScope, mapLoaded]); // Recalculate when scope changes or map loads

  // **NEW**: Recalculate zone stats when map moves (if zone scope is selected)
  const recalculateZoneStatsIfNeeded = useCallback(() => {
    console.warn('🔄 recalculateZoneStatsIfNeeded called, statsScope:', statsScope);
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getSource('mutations-live')) {
      setTimeout(() => {
        console.warn('📊 FORCE Recalculating zone stats after map move...');
        const features = mapRef.current.querySourceFeatures('mutations-live');
        console.warn('📊 FORCE Found', features.length, 'features for recalculation');
        const calculatedStats = calculateZoneStats(features);
        console.warn('📊 FORCE Recalculated zone stats after map move:', calculatedStats);
        setZoneStats(calculatedStats);
      }, 300); // Longer delay to ensure data is fully loaded
    } else {
      console.warn('📊 Not recalculating: statsScope =', statsScope, ', map ready =', !!mapRef.current);
    }
  }, [statsScope]);

  // **NEW**: Recalculate zone stats when data version changes (triggered by PropertyList)
  useEffect(() => {
    if (statsScope === 'zone' && dataVersion !== undefined && mapRef.current && mapRef.current.getSource('mutations-live')) {
      console.warn('🚀 TRIGGERED: Zone stats recalculation by dataVersion change:', dataVersion);

      // Small delay to ensure map rendering is complete
      setTimeout(() => {
        const features = mapRef.current.querySourceFeatures('mutations-live');
        console.warn('🚀 TRIGGERED: Found', features.length, 'features for zone stats');

        const calculatedStats = calculateZoneStats(features);
        console.warn('🚀 TRIGGERED: Calculated new zone stats:', calculatedStats);

        setZoneStats(calculatedStats);
        console.warn('🚀 TRIGGERED: Zone stats updated successfully!');
      }, 300);
    } else {
      console.warn('🚀 NOT TRIGGERED: statsScope =', statsScope, ', dataVersion =', dataVersion, ', map ready =', !!mapRef.current);
    }
  }, [dataVersion, statsScope]); // Trigger when dataVersion or statsScope changes

  // **NEW**: Handle property card hover to highlight corresponding point on map
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.getSource('mutations-live')) return;

    // Clear existing hover effect first
    const emptyFeatureCollection: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: [],
    };
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    (mapRef.current.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);

    if (hoveredProperty) {
      console.warn('🎯 PropertyMap: Looking for hovered property:', hoveredProperty.address, hoveredProperty.coordinates);

      // Find the corresponding feature on the map by matching coordinates
      const features = mapRef.current.querySourceFeatures('mutations-live');
      console.warn('🎯 PropertyMap: Found', features.length, 'map features to check');

      for (const feature of features) {
        if (feature.geometry && feature.geometry.type === 'Point') {
          const featureCoords = feature.geometry.coordinates;
          const propertyCoords = hoveredProperty.coordinates;

          // Check if coordinates match exactly (they should be exactly the same)
          const coordsMatch = featureCoords[0] === propertyCoords[0] && featureCoords[1] === propertyCoords[1];

          console.warn('🔍 Comparing coordinates:', {
            featureCoords: [featureCoords[0], featureCoords[1]],
            propertyCoords: [propertyCoords[0], propertyCoords[1]],
            exactMatch: coordsMatch,
          });

          if (coordsMatch) {
            console.warn('🎯 PropertyMap: Found exact coordinate match!');

            // Show blue box shadow for this feature
            const hoveredFeatureData: GeoJSON.FeatureCollection = {
              type: 'FeatureCollection',
              features: [feature as GeoJSON.Feature],
            };

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            (mapRef.current.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);
            console.warn('🎯 PropertyMap: Applied blue shadow to map point!');
            break; // Exit early once found
          }
        }
      }
    }
  }, [hoveredProperty]);

  // Selected feature effect (unchanged but with debug logging)
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    debugLog('Processing selected feature:', selectedFeature);
    const map = mapRef.current;

    if (!map.getSource('selected-address')) {
      debugLog('Adding selected address source');
      map.addSource('selected-address', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
        generateId: true,
      });

      map.addLayer({
        id: 'selected-address-shadow',
        type: 'circle',
        source: 'selected-address',
        paint: {
          'circle-radius': 15,
          'circle-color': 'rgba(255, 0, 0, 0.48)',
          'circle-blur': 0.5,
        },
        filter: ['==', ['id'], ''],
      });

      map.addLayer({
        id: 'selected-address-layer',
        type: 'circle',
        source: 'selected-address',
        paint: {
          'circle-radius': 4,
          'circle-color': '#ff0000',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
      });

      // Selected address interactivity
      map.on('mouseenter', 'selected-address-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'selected-address-layer', () => {
        map.getCanvas().style.cursor = '';
        if (hoveredSelectedId.current !== null) {
          map.setFilter('selected-address-shadow', ['==', ['id'], '']);
          hoveredSelectedId.current = null;
        }
      });

      map.on('mousemove', 'selected-address-layer', (e: mapboxgl.MapMouseEvent) => {
        if (e.features && e.features.length > 0) {
          const featureId = e.features[0].id;
          if (featureId !== hoveredSelectedId.current) {
            hoveredSelectedId.current = featureId;
            map.setFilter('selected-address-shadow', ['==', ['id'], featureId]);
          }
        }
      });
    }

    const source = map.getSource('selected-address');
    if (source && 'setData' in source) {
      if (selectedFeature) {
        debugLog('Setting selected feature data');
        source.setData({ type: 'FeatureCollection', features: [selectedFeature] });
        map.flyTo({ center: selectedFeature.geometry.coordinates, zoom: 18 });
      } else {
        debugLog('Clearing selected feature data');
        source.setData({ type: 'FeatureCollection', features: [] });
      }
    }
  }, [selectedFeature, mapLoaded]);

  // Handle searchParams to show red marker for selected address
  useEffect(() => {
    if (searchParams?.coordinates) {
      setSelectedAddress(searchParams.coordinates);
      debugLog('Selected address coordinates:', searchParams.coordinates);
    } else {
      setSelectedAddress(null);
    }
  }, [searchParams]);

  // Update red marker when selectedAddress changes
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    const map = mapRef.current;
    const source = map.getSource('selected-address-marker');

    if (source && source.type === 'geojson') {
      if (selectedAddress) {
        const feature: GeoJSON.Feature<GeoJSON.Point> = {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: selectedAddress,
          },
          properties: {
            id: 'selected-address',
          },
        };

        source.setData({
          type: 'FeatureCollection',
          features: [feature],
        });

        // Fly to the selected address
        map.flyTo({
          center: selectedAddress,
          zoom: 16,
          duration: 2000,
        });

        debugLog('Red marker added at:', selectedAddress);
      } else {
        // Clear the marker
        source.setData({
          type: 'FeatureCollection',
          features: [],
        });
        debugLog('Red marker cleared');
      }
    }
  }, [selectedAddress, mapLoaded]);

  // Stats panel toggle function
  const toggleStatsPanel = () => {
    setShowStatsPanel(!showStatsPanel);
  };

  // Render with error handling
  if (mapError) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <h2 className="text-xl font-bold text-red-600 mb-4">Map Loading Error</h2>
          <p className="text-gray-700 mb-4">{mapError}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} className="h-full w-full" />

      {/* Stats Panel Toggle Button */}
      <button
        onClick={() => {
          if (!showStatsPanel) {
            setActivePropertyType(0);
          }
          toggleStatsPanel();
        }}
        className="absolute top-4 left-4 z-30 bg-white text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1 text-xs hover:bg-gray-50 sm:text-sm"
      >
        {showStatsPanel ? (
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Custom Zoom Controls */}
      <div className="absolute top-20 left-4 z-30 flex flex-col gap-1">
        {/* Zoom In Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomIn();
            }
          }}
          className="bg-white text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-sm border border-gray-200"
          title="Zoom in"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>

        {/* Zoom Out Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomOut();
            }
          }}
          className="bg-white text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-sm border border-gray-200"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>

        {/* Reset View Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              // Reset to search coordinates or default view
              if (searchParams?.coordinates) {
                mapRef.current.flyTo({
                  center: searchParams.coordinates,
                  zoom: 16,
                  duration: 1000,
                });
              } else {
                // Default to Paris if no search coordinates
                mapRef.current.flyTo({
                  center: [2.3522, 48.8566],
                  zoom: 12,
                  duration: 1000,
                });
              }
            }
          }}
          className="bg-white text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-sm border border-gray-200"
          title="Reset to search location"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Stats Panel */}
      {showStatsPanel && (
        <div
          className="fixed sm:absolute top-0 left-0 sm:top-4 sm:left-16 z-20 bg-white rounded-none sm:rounded-xl shadow-lg p-4 w-full sm:w-[520px] h-full sm:h-auto overflow-y-auto sm:overflow-visible border-t sm:border border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Statistiques Marché</h3>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium text-gray-600 mr-2">{currentCity}</div>
              <div>
                <select
                  id="stats-scope"
                  value={statsScope}
                  onChange={e => setStatsScope(e.target.value as 'commune' | 'zone')}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-150 shadow-sm cursor-pointer min-w-[120px]"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <option value="commune">Commune</option>
                  Statistiques Marché <option value="zone">Zone affichée</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full mb-3" />

          {(() => {
            // ✅ Adaptation pour les nouvelles données de l'API
            const propertyTypeNames = ['Appartement', 'Maison', 'Terrain', 'Bien Multiple'];
            const getIndigoShade = idx => ['bg-indigo-600', 'bg-violet-500', 'bg-blue-400', 'bg-blue-600'][idx];

            // **NEW**: Choose data source based on selected scope
            const currentStatsData = statsScope === 'commune' ? propertyStats : zoneStats;
            console.warn('📊 Using stats data:', { statsScope, currentStatsData });

            const normalizedStats = propertyTypeNames.map((typeName, index) => {
              // ✅ Recherche directe par typeGroupe depuis l'API ou zone data
              const match = currentStatsData.find(item => {
                return item.typeGroupe === typeName;
              });

              return {
                typeBien: typeName,
                nombre: match?.nombreMutations || match?.nombre || 0,
                prixMoyen: match?.prixMedian || match?.prixMoyen || 0,
                prixM2Moyen: match?.prixM2Median || match?.prixM2Moyen || 0,
              };
            });

            return (
              <>
                <div className="flex flex-wrap sm:flex-nowrap mb-3 gap-2">
                  {normalizedStats.map((stat, index) => (
                    <button
                      key={stat.typeBien}
                      className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-medium whitespace-nowrap ${
                        activePropertyType === index ? `${getIndigoShade(index)} text-white` : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                      }`}
                      onClick={() => setActivePropertyType(index)}
                    >
                      {stat.typeBien}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-1 text-xs">⚠️ {error}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Number of sales</p>
                      <p className="text-base font-semibold text-gray-900">{formatNumber(normalizedStats[activePropertyType]?.nombre)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Median Price</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Median Price per m²</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixM2Moyen)}€
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
