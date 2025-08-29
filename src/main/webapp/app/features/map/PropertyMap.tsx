import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './styles/mapbox-popup.css';
// Add CSS import at the top (make sure this is included)
import 'mapbox-gl/dist/mapbox-gl.css';

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

interface FilterState {
  propertyTypes: {
    maison: boolean;
    terrain: boolean;
    appartement: boolean;
    biensMultiples: boolean;
    localCommercial: boolean;
  };
  roomCounts: {
    studio: boolean;
    deuxPieces: boolean;
    troisPieces: boolean;
    quatrePieces: boolean;
    cinqPiecesPlus: boolean;
  };
  priceRange: [number, number];
  surfaceRange: [number, number];
  pricePerSqmRange: [number, number];
  dateRange: [number, number];
}

interface MapPageProps {
  selectedFeature?: Feature | null;
  properties?: Property[];
  onMapMove?: (coordinates: [number, number]) => void;
  onPropertySelect?: (property: Property) => void;
  searchParams?: {
    coordinates?: [number, number];
    address?: string;
  };
  selectedProperty?: Property | null;
  hoveredProperty?: Property | null;
  filterState?: FilterState;
  onDataUpdate?: (mutationData: any[]) => void; // **NEW**: Callback to update PropertyCard data
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
    'Local Commercial': 'Local',
    'Bien Multiple': 'Bien Multiple',
  };
  return shortNames[type] || type;
};

const PropertyMap: React.FC<MapPageProps> = ({
  selectedFeature,
  properties,
  onMapMove,
  onPropertySelect,
  searchParams,
  selectedProperty,
  hoveredProperty,
  filterState,
  onDataUpdate,
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [debugging, setDebugging] = useState<boolean>(true); // Enable debugging
  const hoveredSelectedId = useRef<string | number | null>(null);
  const [currentActiveFilters, setCurrentActiveFilters] = useState<FilterState | null>(null);
  // Save filter parameters locally so they persist between map moves
  const [savedFilterParams, setSavedFilterParams] = useState<any>(null);

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
      minSurfaceLand: currentFilterState.surfaceRange[0].toString(), // Using surface range for land too
      maxSurfaceLand: currentFilterState.surfaceRange[1].toString(),
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
        maxSurfaceLand: '400',
        minSquareMeterPrice: '0',
        maxSquareMeterPrice: '40000',
        minDate: '2013-12-31',
        maxDate: new Date().toISOString().split('T')[0],
        limit: '500',
      });

      const apiUrl = `http://localhost:8080/api/mutations/search?${params.toString()}`;
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
          onDataUpdate(geojsonData.features);
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

      if (filterState) {
        // New filters from parent component - use these and update active filters
        filtersToUse = filterState;
        setCurrentActiveFilters(filterState);
        debugLog('Using new filter state from parent:', filterState);
        filterParams = convertFilterStateToParams(filtersToUse);
      } else if (currentActiveFilters) {
        // Use previously set active filters
        filtersToUse = currentActiveFilters;
        debugLog('Using current active filters:', currentActiveFilters);
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

      const apiUrl = `http://localhost:8080/api/mutations/search?${params.toString()}`;
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
          onDataUpdate(geojsonData.features);
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
        minZoom: 13, // Limit zoom out to exactly 1km (zoom level 13 = ~1km scale)
        maxZoom: 18,
        antialias: true, // Enable antialiasing for better performance
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

          // Add mutation point layers

          map.addLayer({
            id: 'mutation-point-shadow',
            type: 'circle',
            source: 'mutations-live',
            paint: {
              'circle-radius': 25,
              'circle-color': 'rgba(255, 0, 0, 0.4)', // Red shadow
              'circle-blur': 2,
              'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
            },
          });

          map.addLayer({
            id: 'mutation-point',
            type: 'circle',
            source: 'mutations-live',
            paint: {
              'circle-color': ['case', ['boolean', ['feature-state', 'hover'], false], '#ff0000', '#3b82f6'],
              'circle-radius': ['case', ['boolean', ['feature-state', 'hover'], false], 15, 6],
              'circle-stroke-width': ['case', ['boolean', ['feature-state', 'hover'], false], 5, 2],
              'circle-stroke-color': '#fff',
              'circle-stroke-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0.8],
            },
          });

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
          let hoveredFeatureId: string | null = null;

          // Handle mouse enter for hover effects
          map.on('mouseenter', 'mutation-point', e => {
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];
              if (feature.id) {
                hoveredFeatureId = feature.id as string;
                map.setFeatureState({ source: 'mutations-live', id: feature.id }, { hover: true });
              }
            }
          });

          // Handle mouse leave for hover effects
          map.on('mouseleave', 'mutation-point', e => {
            if (hoveredFeatureId) {
              map.setFeatureState({ source: 'mutations-live', id: hoveredFeatureId }, { hover: false });
              hoveredFeatureId = null;
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
                        // Create a function to render mutation data
                        const lastFiveMutations = mutations.slice(0, 5);
                        let currentIndex = 0;

                        const renderMutation = index => {
                          const mutation = lastFiveMutations[index];
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
                lastFiveMutations.length > 1
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
                ">${index + 1} / ${lastFiveMutations.length}</span>
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
                                currentIndex = currentIndex > 0 ? currentIndex - 1 : lastFiveMutations.length - 1;
                                hoverPopup.setHTML(renderMutation(currentIndex));
                                addNavigationListeners(); // Re-add listeners after HTML update
                              });
                            }

                            if (nextBtn) {
                              nextBtn.addEventListener('click', event => {
                                event.stopPropagation();
                                currentIndex = currentIndex < lastFiveMutations.length - 1 ? currentIndex + 1 : 0;
                                hoverPopup.setHTML(renderMutation(currentIndex));
                                addNavigationListeners(); // Re-add listeners after HTML update
                              });
                            }
                          }, 100);
                        };

                        // Add navigation event listeners if multiple mutations
                        if (lastFiveMutations.length > 1) {
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
                  } catch (error) {
                    debugLog('Error parsing addresses JSON:', error);
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
                          ${error.message}
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
                      popupContent = `
                        <div style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
                          <div style="font-weight: bold; font-size: 14px; color: #3b82f6;">
                            ${addresses[0].adresse_complete}
                          </div>
                          <div style="font-size: 11px; color: #666; margin-top: 3px;">
                            ${addresses[0].commune} (${addresses[0].codepostal})
                          </div>
                        </div>
                      `;
                    } else {
                      popupContent = `
                        <div style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
                          <div style="margin-bottom: 8px; font-weight: bold; color: #3b82f6;">
                            ${addresses.length} adresses:
                          </div>
                          ${addresses
                            .map(
                              (address, index) => `
                            <div style="
                              margin: 4px 0; 
                              padding: 6px; 
                              background: #f8f9fa; 
                              border-radius: 4px;
                              ${index > 0 ? 'border-top: 1px solid #e0e0e0;' : ''}
                            ">
                              <div style="font-weight: bold;">${address.adresse_complete}</div>
                              <div style="font-size: 11px; color: #666;">${address.commune} (${address.codepostal})</div>
                            </div>
                          `,
                            )
                            .join('')}
                        </div>
                      `;
                    }

                    // Create click popup (this one has close button)
                    new mapboxgl.Popup({
                      closeButton: true,
                      closeOnClick: true,
                      maxWidth: '400px',
                      offset: [0, -5], // Reduced offset - closer to the point
                    })
                      .setLngLat(feature.geometry.coordinates)
                      .setHTML(popupContent)
                      .addTo(map);
                  }
                } catch (error) {
                  debugLog('Error parsing addresses JSON in click handler:', error);
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
              inset: 10px 10px auto auto;
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

              if (scaleDistance >= 0.9) {
                // If we're close to 1km, show 1km
                niceDistance = 1;
                unit = 'km';
              } else if (scaleDistance >= 0.5) {
                // Show 0.5km or 1km
                niceDistance = scaleDistance >= 0.75 ? 1 : 0.5;
                unit = 'km';
              } else if (scaleDistance >= 0.1) {
                // Show 0.1km, 0.2km, 0.5km
                if (scaleDistance >= 0.4) {
                  niceDistance = 0.5;
                } else if (scaleDistance >= 0.15) {
                  niceDistance = 0.2;
                } else {
                  niceDistance = 0.1;
                }
                unit = 'km';
              } else if (scaleDistance >= 0.01) {
                // Show in meters
                if (scaleDistance >= 0.05) {
                  niceDistance = 100;
                } else if (scaleDistance >= 0.02) {
                  niceDistance = 50;
                } else {
                  niceDistance = 20;
                }
                unit = 'm';
              } else {
                niceDistance = 10;
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

          // Add navigation control
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Load initial data after a short delay to ensure map is fully ready
          setTimeout(() => {
            debugLog('Loading initial data with default parameters...');
            loadInitialData();
          }, 1000);
          // Debounced function to prevent multiple rapid API calls
          const debouncedDataLoad = debounce(() => {
            debugLog('Debounced data load triggered');
            if (currentActiveFilters) {
              loadMutationsData();
            } else {
              loadInitialData();
            }
          }, 300);

          // Add event listeners for map movement
          map.on('moveend', () => {
            debugLog('Map move event triggered');
            debouncedDataLoad();

            if (onMapMove) {
              const center = map.getCenter();
              onMapMove([center.lng, center.lat]);
            }
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
        } catch (error) {
          debugLog('Error during map setup:', error);
          setMapError(`Map setup error: ${error}`);
        }
      });
    } catch (error) {
      debugLog('Error creating map:', error);
      setMapError(`Map creation error: ${error}`);
    }
  }, []);

  // Event handlers are now set up in the map load event

  // Trigger data reload when filter state changes
  // Trigger data reload when filter state changes
  useEffect(() => {
    if (mapLoaded) {
      if (filterState) {
        debugLog('Filter state changed, triggering data reload');
        // The loadMutationsData function will handle setting currentActiveFilters
        loadMutationsData();
      } else if (!currentActiveFilters) {
        // Only load with defaults if no active filters are set
        debugLog('No filters available, loading with defaults or skipping');
        // You can either skip or load with default filters here
      }
    }
  }, [filterState, mapLoaded]);

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
    <div className="relative h-screen w-full">
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
                  className="border border-gray-300 rounded-lg px-3 py-2 text-xs font-semibold bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-150 shadow-sm cursor-pointer min-w-[120px]"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  <option value="commune">Commune</option>
                  <option value="quartier">Quartier</option>
                  <option value="zone">Zone affichée</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-200 w-full mb-3" />

          {(() => {
            const propertyTypeNames = ['Appartement', 'Maison', 'Terrain', 'Local', 'Bien Multiple'];
            const getIndigoShade = (idx: number) => ['#6929CF', '#121852', '#2971CF', '#862CC7', '#381EB0'][idx];

            const normalizedStats = propertyTypeNames.map((shortName, index) => {
              const match = propertyStats.find(item => getStatsShortTypeName(item.typeBien) === shortName);
              return {
                typeBien: shortName,
                nombre: match?.nombre || 0,
                prixMoyen: match?.prixMoyen || 0,
                prixM2Moyen: match?.prixM2Moyen || 0,
              };
            });

            return (
              <>
                <div className="flex flex-wrap sm:flex-nowrap mb-3 gap-2">
                  {normalizedStats.map((stat, index) => (
                    <button
                      key={stat.typeBien}
                      className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-medium whitespace-nowrap ${
                        activePropertyType === index ? 'text-white' : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                      }`}
                      style={{
                        backgroundColor: activePropertyType === index ? getIndigoShade(index) : undefined,
                      }}
                      onClick={() => setActivePropertyType(index)}
                    >
                      {stat.typeBien}
                    </button>
                  ))}
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500 border-t-transparent" />
                  </div>
                ) : statsError ? (
                  <div className="text-red-500 text-center py-1 text-xs">⚠️ {statsError}</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Nombre de ventes</p>
                      <p className="text-base font-semibold text-gray-900">{formatNumber(normalizedStats[activePropertyType]?.nombre)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Prix Médian</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Prix au m² Médian</p>
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

      {debugging && (
        <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow text-xs">
          Map Status: {mapLoaded ? 'Loaded' : 'Loading...'}
          {mapError && <div className="text-red-500">Error: {mapError}</div>}
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
