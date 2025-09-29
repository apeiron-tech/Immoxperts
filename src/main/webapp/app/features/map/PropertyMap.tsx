import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './styles/mapbox-popup.css';
import { API_ENDPOINTS } from 'app/config/api.config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FilterState } from '../../types/filters';
import MobilePropertyBottomSheet from '../property/MobilePropertyBottomSheet';

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
  const propertyTypeNames = ['Appartement', 'Maison', 'Terrain', 'Local', 'Bien Multiple'];
  const stats = [];

  propertyTypeNames.forEach(typeName => {
    const uniqueMutations = new Map(); // Use Map to track unique mutations by ID

    // ✅ Mapping des noms pour correspondre aux données des mutations
    const mutationTypeMap = {
      Local: 'Local Commercial',
      Appartement: 'Appartement',
      Maison: 'Maison',
      Terrain: 'Terrain',
      'Bien Multiple': 'Bien Multiple',
    };

    const mutationTypeName = mutationTypeMap[typeName] || typeName;

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
                  if (mutation.type_groupe === mutationTypeName) {
                    // Only add if we haven't seen this mutation ID before
                    if (!uniqueMutations.has(mutation.id)) {
                      uniqueMutations.set(mutation.id, mutation);
                    }
                  }
                });
              }
            });
          }
        } catch (err) {
          // Error parsing addresses
        }
      }
    });

    // Convert Map values back to array
    const mutations = Array.from(uniqueMutations.values());

    // Calculate statistics for this property type
    if (mutations.length > 0) {
      const prices = mutations.map(m => m.valeur || 0).filter(p => p > 0);
      const pricesPerM2 = mutations.map(m => m.prix_m2 || 0).filter(p => p > 0);

      // Calculate medians
      const medianPrice = prices.length > 0 ? calculateMedian(prices) : 0;
      const medianPricePerM2 = pricesPerM2.length > 0 ? calculateMedian(pricesPerM2) : 0;

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
    // Error getting INSEE code
    return null;
  }
};

const getQuartierFromCoords = async (lng: number, lat: number) => {
  try {
    // Use OpenStreetMap Nominatim API for reverse geocoding
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        zoom: 18,
        'accept-language': 'fr',
      },
      headers: {
        'User-Agent': 'Immoxperts-App/1.0',
      },
    });

    if (response.data && response.data.address) {
      const address = response.data.address;
      // Try to extract quartier/suburb from different possible fields (excluding city-level fields)
      const quartier = address.suburb || address.neighbourhood || address.quarter || address.district || address.city_district;

      const commune = address.city || address.town || address.village || address.municipality || address.county;

      // Only return quartier if we found a real quartier (not just city/town/village)
      if (quartier && quartier !== commune) {
        return {
          quartier,
          commune: commune || quartier,
          adresse_complete: response.data.display_name,
        };
      }
    }
    return null;
  } catch (err) {
    // Error getting quartier data from OpenStreetMap
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
  const [showStatsPanel, setShowStatsPanel] = useState(false); // Closed by default
  const [activePropertyType, setActivePropertyType] = useState(0);
  const [propertyStats, setPropertyStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statsError, setStatsError] = useState('');
  const [currentCity, setCurrentCity] = useState('AJACCIO');
  const [currentMapStyle, setCurrentMapStyle] = useState('original'); // Track current map style
  const [selectedAddress, setSelectedAddress] = useState<[number, number] | null>(null);
  const [currentINSEE, setCurrentINSEE] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  // **NEW**: Stats scope selection (commune, zone, or quartier)
  const [statsScope, setStatsScope] = useState<'commune' | 'zone' | 'quartier'>('commune');
  const [zoneStats, setZoneStats] = useState([]);
  const [currentQuartier, setCurrentQuartier] = useState<string>('');
  const [isLoadingQuartier, setIsLoadingQuartier] = useState(false);
  const [hasQuartier, setHasQuartier] = useState<boolean>(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [debugging, setDebugging] = useState<boolean>(true); // Enable debugging
  const hoveredSelectedId = useRef<string | number | null>(null);
  const [currentActiveFilters, setCurrentActiveFilters] = useState<FilterState | null>(null);

  // Mobile bottom sheet state
  const [showMobileBottomSheet, setShowMobileBottomSheet] = useState(false);
  const [mobileSheetProperty, setMobileSheetProperty] = useState<any>(null);
  const [mobileSheetIndex, setMobileSheetIndex] = useState(0);
  const [mobileSheetMutations, setMobileSheetMutations] = useState<any[]>([]);
  // Save filter parameters locally so they persist between map moves
  const [savedFilterParams, setSavedFilterParams] = useState<any>(null);
  // Use a ref to store current active filters to prevent state reset issues
  const currentActiveFiltersRef = useRef<FilterState | null>(null);

  // Mobile bottom sheet navigation functions
  const handleMobileSheetPrevious = () => {
    if (mobileSheetIndex > 0) {
      const newIndex = mobileSheetIndex - 1;
      setMobileSheetIndex(newIndex);

      // Update property data
      const mutation = mobileSheetMutations[newIndex];
      setMobileSheetProperty({
        address: mobileSheetProperty.address,
        city: mobileSheetProperty.city,
        price: `${(mutation.valeur || 0).toLocaleString('fr-FR')} €`,
        pricePerSqm: mutation.prix_m2 ? `${Math.round(mutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
        type: mutation.type_groupe || 'Type inconnu',
        rooms: mutation.nbpprinc || '',
        surface: mutation.sbati ? `${mutation.sbati.toLocaleString('fr-FR')} m²` : '',
        soldDate: mutation.date ? new Date(mutation.date).toLocaleDateString('fr-FR') : '',
      });
    }
  };

  const handleMobileSheetNext = () => {
    if (mobileSheetIndex < mobileSheetMutations.length - 1) {
      const newIndex = mobileSheetIndex + 1;
      setMobileSheetIndex(newIndex);

      // Update property data
      const mutation = mobileSheetMutations[newIndex];
      setMobileSheetProperty({
        address: mobileSheetProperty.address,
        city: mobileSheetProperty.city,
        price: `${(mutation.valeur || 0).toLocaleString('fr-FR')} €`,
        pricePerSqm: mutation.prix_m2 ? `${Math.round(mutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
        type: mutation.type_groupe || 'Type inconnu',
        rooms: mutation.nbpprinc || '',
        surface: mutation.sbati ? `${mutation.sbati.toLocaleString('fr-FR')} m²` : '',
        soldDate: mutation.date ? new Date(mutation.date).toLocaleDateString('fr-FR') : '',
      });
    }
  };

  const handleMobileSheetClose = () => {
    setShowMobileBottomSheet(false);
    setMobileSheetProperty(null);
    setMobileSheetMutations([]);
    setMobileSheetIndex(0);
  };

  // Ref to store hover popup for cleanup
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);

  // Ref to store click popup for cleanup
  const clickPopupRef = useRef<mapboxgl.Popup | null>(null);

  // Debug logging
  const debugLog = (message: string, data?: any) => {
    // Debug logging disabled
  };

  // Function to clear hover popups
  const clearHoverPopup = () => {
    if (hoverPopupRef.current) {
      hoverPopupRef.current.remove();
      hoverPopupRef.current = null;
      debugLog('Hover popup cleared');
    }
  };

  // Function to clear click popups
  const clearClickPopup = () => {
    if (clickPopupRef.current) {
      clickPopupRef.current.remove();
      clickPopupRef.current = null;
      debugLog('Click popup cleared');
    }
  };

  // Function to preserve all map data when changing styles
  const preserveMapState = () => {
    if (!mapRef.current) return null;

    const map = mapRef.current;
    const state = {
      center: map.getCenter(),
      zoom: map.getZoom(),
      sources: {},
      layers: [],
    };

    // Save all sources data
    const sourceIds = ['mutations-live', 'hovered-circle', 'selected-address-marker', 'selected-address'];
    sourceIds.forEach(sourceId => {
      const source = map.getSource(sourceId);
      if (source && source.type === 'geojson') {
        state.sources[sourceId] = source._data;
      }
    });

    debugLog('Map state preserved:', state);
    return state;
  };

  // Function to restore all map data after style change
  const restoreMapState = state => {
    if (!mapRef.current || !state) return;

    const map = mapRef.current;
    debugLog('Restoring map state...');

    // Restore center and zoom
    map.setCenter(state.center);
    map.setZoom(state.zoom);

    // Wait a bit for style to be fully loaded, then restore data
    setTimeout(() => {
      // Restore sources data
      Object.keys(state.sources).forEach(sourceId => {
        const source = map.getSource(sourceId);
        if (source && source.type === 'geojson') {
          source.setData(state.sources[sourceId]);
        }
      });

      debugLog('Map state restored successfully');
    }, 100);
  };

  // Function to clear all popups
  const clearAllPopups = () => {
    clearHoverPopup();
    clearClickPopup();
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

      const apiUrl = `${API_ENDPOINTS.mutations.search}?${params.toString()}`;
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

        // **NEW**: Recalculate zone stats immediately after initial data is loaded
        if (statsScope === 'zone') {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.getSource('mutations-live')) {
              const features = mapRef.current.querySourceFeatures('mutations-live');
              const calculatedStats = calculateZoneStats(features);
              setZoneStats(calculatedStats);
            }
          }, 200); // Increased delay to ensure map data is fully processed
        }
      }
    } catch (e) {
      debugLog('Failed to load initial data:', e);
      // Failed to load initial data
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

      const apiUrl = `${API_ENDPOINTS.mutations.search}?${params.toString()}`;
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

          // **ADDITIONAL**: Force zone stats recalculation right after property list update
          if (statsScope === 'zone') {
            setTimeout(() => {
              const features = mapRef.current.querySourceFeatures('mutations-live');
              const calculatedStats = calculateZoneStats(features);
              setZoneStats(calculatedStats);
            }, 500); // Wait for property list to finish updating
          }
        }

        // **NEW**: Recalculate zone stats immediately after new data is loaded
        if (statsScope === 'zone') {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.getSource('mutations-live')) {
              const features = mapRef.current.querySourceFeatures('mutations-live');
              const calculatedStats = calculateZoneStats(features);
              setZoneStats(calculatedStats);
            }
          }, 200); // Increased delay to ensure map data is fully processed
        }
      }
    } catch (e) {
      debugLog('Failed to load mutations:', e);
      // Failed to load mutations
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
        zoom: 14,
        minZoom: 12, // Limit zoom out to maximum 1km
        maxZoom: 18,
        antialias: true, // Enable antialiasing for better performance
        attributionControl: false, // Remove Mapbox attribution
      });

      const map = mapRef.current;
      debugLog('Map instance created');

      // Enhanced error handling
      map.on('error', (e: mapboxgl.ErrorEvent) => {
        debugLog('Mapbox error occurred:', e.error);
        // Mapbox error
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
              'fill-color': [
                'case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#3B82F6', // Bleu quand cliqué
                '#6e599f', // Violet par défaut
              ],
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'clicked'], false],
                0.7, // Plus opaque quand cliqué
                ['boolean', ['feature-state', 'hover'], false],
                0.5, // Opacité hover
                0.2, // Opacité par défaut
              ],
              'fill-outline-color': [
                'case',
                ['boolean', ['feature-state', 'clicked'], false],
                '#1D4ED8', // Bordure bleue foncée quand cliqué
                'rgba(0, 0, 0, 0.5)', // Bordure par défaut
              ],
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

          // Parcel click functionality - make clicked parcels blue
          let clickedParcelId: string | number | null = null;

          map.on('click', 'parcelles-layer', (e: mapboxgl.MapMouseEvent) => {
            if (e.features && e.features.length > 0) {
              // Remove blue from previously clicked parcel
              if (clickedParcelId !== null) {
                map.setFeatureState(
                  {
                    source: 'parcelles-source',
                    sourceLayer: 'parcelles_pour_mapbox_final',
                    id: clickedParcelId,
                  },
                  { clicked: false },
                );
              }

              // Set new clicked parcel to blue
              clickedParcelId = e.features[0].id;
              if (clickedParcelId !== null && clickedParcelId !== undefined) {
                map.setFeatureState(
                  {
                    source: 'parcelles-source',
                    sourceLayer: 'parcelles_pour_mapbox_final',
                    id: clickedParcelId,
                  },
                  { clicked: true },
                );
              }
            }
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
                if (hoverPopupRef.current) {
                  hoverPopupRef.current.remove();
                  hoverPopupRef.current = null;
                }

                // Create mutation data popup
                if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
                  try {
                    const addresses = JSON.parse(feature.properties.adresses);

                    if (addresses && addresses.length > 0) {
                      const firstAddress = addresses[0];
                      const mutations = firstAddress.mutations || [];

                      // Helper functions for your styling - Nouvelles couleurs spécifiées
                      const getPropertyTypeColor = type => {
                        const colors = {
                          Appartement: '#504CC5', // #504CC5 - Violet
                          Maison: '#7A72D5', // #7A72D5 - Violet clair
                          Terrain: '#4F96D6', // #4F96D6 - Bleu
                          Local: '#205F9D', // #205F9D - Bleu foncé
                          'Bien Multiple': '#022060', // #022060 - Bleu très foncé
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

                      const formatPricePerSqm = (price, surface, terrain, propertyType) => {
                        // For terrain, use terrain size (sterr)
                        if (propertyType && propertyType.toLowerCase().includes('terrain')) {
                          if (!terrain || terrain === 0) return 'N/A';
                          const pricePerSqm = Math.round(price / terrain);
                          return `${pricePerSqm.toLocaleString('fr-FR')} €/m²`;
                        }
                        // For other types (appartement, maison, etc.), use surface (sbati)
                        else {
                          if (!surface || surface === 0) return 'N/A';
                          const pricePerSqm = Math.round(price / surface);
                          return `${pricePerSqm.toLocaleString('fr-FR')} €/m²`;
                        }
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
                          const pricePerSqm = formatPricePerSqm(price, surface, terrain, propertyTypeLabel);

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

                        // Check if mobile device for hover popup
                        const isMobile = window.innerWidth < 768;

                        if (isMobile) {
                          // Use mobile bottom sheet for hover on mobile
                          setMobileSheetMutations(allMutations);
                          setMobileSheetIndex(currentIndex);

                          // Convert current mutation to property format
                          const currentMutation = allMutations[currentIndex];
                          // Get the address from the parent address object, not from mutation
                          const parentAddress = addresses && addresses.length > 0 ? addresses[0] : null;
                          setMobileSheetProperty({
                            address: parentAddress?.adresse_complete || 'Adresse non disponible',
                            city: parentAddress?.commune || 'Ville non disponible',
                            price: `${(currentMutation.valeur || 0).toLocaleString('fr-FR')} €`,
                            pricePerSqm: currentMutation.prix_m2
                              ? `${Math.round(currentMutation.prix_m2).toLocaleString('fr-FR')} €/m²`
                              : '',
                            type: currentMutation.type_groupe || 'Type inconnu',
                            rooms: currentMutation.nbpprinc || '',
                            surface: currentMutation.sbati ? `${currentMutation.sbati.toLocaleString('fr-FR')} m²` : '',
                            terrain: currentMutation.sterr ? `${currentMutation.sterr.toLocaleString('fr-FR')} m²` : '',
                            soldDate: currentMutation.date ? new Date(currentMutation.date).toLocaleDateString('fr-FR') : '',
                          });

                          setShowMobileBottomSheet(true);
                        } else {
                          // Desktop: use original popup
                          const popupContent = renderMutation(currentIndex);

                          hoverPopupRef.current = new mapboxgl.Popup({
                            closeButton: false,
                            closeOnClick: false,
                            maxWidth: '450px',
                            offset: [0, -5],
                            className: 'mutation-hover-popup',
                          })
                            .setLngLat(feature.geometry.coordinates)
                            .setHTML(popupContent)
                            .addTo(map);
                        }

                        // Function to add navigation event listeners (only for desktop)
                        if (!isMobile) {
                          const addNavigationListeners = () => {
                            setTimeout(() => {
                              const popupElement = hoverPopupRef.current?.getElement();
                              const prevBtn = popupElement.querySelector('.prev-btn');
                              const nextBtn = popupElement.querySelector('.next-btn');

                              if (prevBtn) {
                                prevBtn.addEventListener('click', event => {
                                  event.stopPropagation();
                                  currentIndex = currentIndex > 0 ? currentIndex - 1 : allMutations.length - 1;
                                  hoverPopupRef.current?.setHTML(renderMutation(currentIndex));
                                  addNavigationListeners(); // Re-add listeners after HTML update
                                });
                              }

                              if (nextBtn) {
                                nextBtn.addEventListener('click', event => {
                                  event.stopPropagation();
                                  currentIndex = currentIndex < allMutations.length - 1 ? currentIndex + 1 : 0;
                                  hoverPopupRef.current?.setHTML(renderMutation(currentIndex));
                                  addNavigationListeners(); // Re-add listeners after HTML update
                                });
                              }
                            }, 100);
                          };

                          // Add navigation event listeners if multiple mutations
                          if (allMutations.length > 1) {
                            addNavigationListeners();
                          }
                        }

                        debugLog('Mutation popup created with data');
                      } else {
                        // Fallback if no mutations
                        const isMobile = window.innerWidth < 768;

                        if (!isMobile) {
                          // Desktop: show fallback popup
                          hoverPopupRef.current = new mapboxgl.Popup({
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
                        // Mobile: don't show anything for addresses without mutations
                      }
                    } else {
                      // Fallback if no addresses
                      const isMobile = window.innerWidth < 768;

                      if (!isMobile) {
                        // Desktop: show fallback popup
                        hoverPopupRef.current = new mapboxgl.Popup({
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
                      // Mobile: don't show anything for features without addresses
                    }
                  } catch (err) {
                    debugLog('Error parsing addresses JSON:', err);
                    // Fallback popup on error
                    const isMobile = window.innerWidth < 768;

                    if (!isMobile) {
                      // Desktop: show error popup
                      hoverPopupRef.current = new mapboxgl.Popup({
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
                    // Mobile: don't show error popups
                  }
                } else {
                  // Fallback if no properties
                  const isMobile = window.innerWidth < 768;

                  if (!isMobile) {
                    // Desktop: show fallback popup
                    hoverPopupRef.current = new mapboxgl.Popup({
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
                  // Mobile: don't show anything for features without properties
                }

                debugLog('Hover popup created at:', e.lngLat);
                map.getCanvas().style.cursor = 'pointer';
              } else {
                // No features under mouse
                const isMobile = window.innerWidth < 768;

                if (isMobile) {
                  // Mobile: close bottom sheet when moving away from features
                  if (showMobileBottomSheet) {
                    setShowMobileBottomSheet(false);
                    setMobileSheetProperty(null);
                    setMobileSheetMutations([]);
                    setMobileSheetIndex(0);
                  }
                } else {
                  // Desktop: remove hover popup
                  if (hoverPopupRef.current) {
                    hoverPopupRef.current.remove();
                    hoverPopupRef.current = null;
                    debugLog('Hover popup removed - no features');
                  }
                }
                map.getCanvas().style.cursor = '';
              }
            }, 100); // 100ms delay
          });

          // Helper function to create popup content
          const createPopupContent = (addresses: any[]) => {
            if (addresses.length === 1) {
              const address = addresses[0];
              return `
                <div style="padding: 12px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
                  <div style="font-weight: bold; font-size: 14px; color: #3b82f6;">
                    ${address.adresse_complete}
                  </div>
                </div>
              `;
            } else {
              return `
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
          };

          // Helper function to handle mobile bottom sheet
          const handleMobileBottomSheet = (addresses: any[]) => {
            if (addresses.length === 1) {
              const address = addresses[0];
              const hasMutations = address.mutations && Array.isArray(address.mutations) && address.mutations.length > 0;

              if (hasMutations) {
                setMobileSheetMutations(address.mutations);
                setMobileSheetIndex(0);

                const firstMutation = address.mutations[0];
                setMobileSheetProperty({
                  address: address.adresse_complete, // Use the address object, not mutation
                  city: address.commune, // Use the address object, not mutation
                  price: `${(firstMutation.valeur || 0).toLocaleString('fr-FR')} €`,
                  pricePerSqm: firstMutation.prix_m2 ? `${Math.round(firstMutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
                  type: firstMutation.type_groupe || 'Type inconnu',
                  rooms: firstMutation.nbpprinc || '',
                  surface: firstMutation.sbati ? `${firstMutation.sbati.toLocaleString('fr-FR')} m²` : '',
                  terrain: firstMutation.sterr ? `${firstMutation.sterr.toLocaleString('fr-FR')} m²` : '',
                  soldDate: firstMutation.date ? new Date(firstMutation.date).toLocaleDateString('fr-FR') : '',
                });

                setShowMobileBottomSheet(true);
              }
            } else if (addresses.length > 1) {
              const addressWithMutations = addresses.find(addr => addr.mutations && addr.mutations.length > 0);

              if (addressWithMutations) {
                setMobileSheetMutations(addressWithMutations.mutations);
                setMobileSheetIndex(0);

                const firstMutation = addressWithMutations.mutations[0];
                setMobileSheetProperty({
                  address: addressWithMutations.adresse_complete, // Use the address object, not mutation
                  city: addressWithMutations.commune, // Use the address object, not mutation
                  price: `${(firstMutation.valeur || 0).toLocaleString('fr-FR')} €`,
                  pricePerSqm: firstMutation.prix_m2 ? `${Math.round(firstMutation.prix_m2).toLocaleString('fr-FR')} €/m²` : '',
                  type: firstMutation.type_groupe || 'Type inconnu',
                  rooms: firstMutation.nbpprinc || '',
                  surface: firstMutation.sbati ? `${firstMutation.sbati.toLocaleString('fr-FR')} m²` : '',
                  terrain: firstMutation.sterr ? `${firstMutation.sterr.toLocaleString('fr-FR')} m²` : '',
                  soldDate: firstMutation.date ? new Date(firstMutation.date).toLocaleDateString('fr-FR') : '',
                });

                setShowMobileBottomSheet(true);
              }
            }
          };

          // Click handler for mutations (separate from hover)
          map.on('click', 'mutation-point', e => {
            debugLog('Clicked mutation point:', e.features);
            if (e.features && e.features.length > 0) {
              const feature = e.features[0];

              // Remove hover popup if it exists (click popup will replace it)
              clearHoverPopup();

              if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
                try {
                  const addresses = JSON.parse(feature.properties.adresses);

                  if (addresses && addresses.length > 0) {
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

                    // Clear any existing click popup first
                    clearClickPopup();

                    // Check if mobile device
                    const isMobile = window.innerWidth < 768;

                    if (isMobile) {
                      handleMobileBottomSheet(addresses);
                      return; // Don't create Mapbox popup on mobile
                    }

                    // Create click popup for desktop
                    const popupContent = createPopupContent(addresses);
                    clickPopupRef.current = new mapboxgl.Popup({
                      closeButton: true,
                      closeOnClick: true,
                      maxWidth: '350px',
                      offset: [0, -5],
                    })
                      .setLngLat(feature.geometry.coordinates)
                      .setHTML(popupContent)
                      .addTo(map);

                    // Clean up global function when popup is closed
                    clickPopupRef.current.on('close', () => {
                      if ((window as any).selectAddress) {
                        delete (window as any).selectAddress;
                      }
                      clickPopupRef.current = null;
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

          // Add click handler for map (not on any feature) to clear popups
          map.on('click', e => {
            const features = map.queryRenderedFeatures(e.point, { layers: ['mutation-point'] });
            if (features.length === 0) {
              // Clicked on empty area, clear all popups
              clearAllPopups();
              debugLog('Clicked on empty area, cleared all popups');
            }
          });

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

            // Load initial INSEE code for statistics
            const loadInitialINSEE = async () => {
              try {
                const center = map.getCenter();
                if (!center) return;

                const locationData = await getINSEECodeFromCoords(center.lng, center.lat);

                if (locationData) {
                  setCurrentCity(locationData.city);
                  setCurrentINSEE(locationData.insee);
                  debugLog('Initial INSEE code loaded:', locationData.insee);
                }

                // Load initial quartier data
                const loadInitialQuartier = async () => {
                  try {
                    setIsLoadingQuartier(true);
                    const quartierData = await getQuartierFromCoords(center.lng, center.lat);
                    if (quartierData && quartierData.quartier) {
                      setCurrentQuartier(quartierData.quartier);
                      setHasQuartier(true);
                      debugLog('Initial quartier loaded:', quartierData.quartier);
                    } else {
                      setCurrentQuartier('');
                      setHasQuartier(false);
                      // Switch to commune if quartier was selected but no quartier found
                      if (statsScope === 'quartier') {
                        setStatsScope('commune');
                      }
                      debugLog('No quartier found for initial location');
                    }
                  } catch (err) {
                    debugLog('Error loading initial quartier:', err);
                    setCurrentQuartier('');
                    setHasQuartier(false);
                    if (statsScope === 'quartier') {
                      setStatsScope('commune');
                    }
                  } finally {
                    setIsLoadingQuartier(false);
                  }
                };
                loadInitialQuartier();
              } catch (err) {
                debugLog('Error loading initial INSEE code:', err);
                setError('Erreur géocodage initial');
              }
            };

            loadInitialINSEE();
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

                // **NEW**: Update quartier data when map moves
                const updateQuartierData = async () => {
                  try {
                    setIsLoadingQuartier(true);
                    const quartierData = await getQuartierFromCoords(center.lng, center.lat);
                    if (quartierData && quartierData.quartier) {
                      const newQuartier = quartierData.quartier;
                      // Only update if quartier has actually changed
                      if (newQuartier !== currentQuartier) {
                        setCurrentQuartier(newQuartier);
                        setHasQuartier(true);
                        // Reset stats to zeros when quartier changes (if quartier scope is selected)
                        if (statsScope === 'quartier') {
                          // Reset property stats to show zeros temporarily
                          const resetStats = [
                            { typeGroupe: 'Appartement', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
                            { typeGroupe: 'Maison', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
                            { typeGroupe: 'Terrain', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
                            { typeGroupe: 'Local Commercial', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
                            { typeGroupe: 'Bien Multiple', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
                          ];
                          setPropertyStats(resetStats);
                        }
                      }
                    } else {
                      // No quartier found, hide the option and switch to commune if needed
                      setCurrentQuartier('');
                      setHasQuartier(false);
                      if (statsScope === 'quartier') {
                        setStatsScope('commune');
                      }
                      debugLog('No quartier found for current location');
                    }
                  } catch (err) {
                    debugLog('Error updating quartier data:', err);
                    setCurrentQuartier('');
                    setHasQuartier(false);
                    if (statsScope === 'quartier') {
                      setStatsScope('commune');
                    }
                  } finally {
                    setIsLoadingQuartier(false);
                  }
                };
                updateQuartierData();
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
    if (!currentINSEE) return; // Load stats when we have INSEE code, regardless of panel visibility

    const fetchStatsByINSEE = async () => {
      try {
        setIsLoading(true);
        setError(null);
        debugLog('Loading statistics for INSEE code:', currentINSEE);

        // ✅ Appel à votre nouvelle API
        const response = await axios.get(`${API_ENDPOINTS.mutations.statsByCity}`, {
          params: { codeInsee: currentINSEE },
        });

        debugLog('Statistics loaded successfully:', response.data);
        setPropertyStats(response.data);
      } catch (err) {
        // Error fetching statistics
        setError('Erreur chargement statistiques');
        setPropertyStats([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatsByINSEE();
  }, [currentINSEE]);

  // **NEW**: Calculate zone statistics when scope is "zone" and map has data
  useEffect(() => {
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getSource('mutations-live')) {
      // Small delay to ensure map data is loaded
      setTimeout(() => {
        const features = mapRef.current.querySourceFeatures('mutations-live');
        const calculatedStats = calculateZoneStats(features);

        setZoneStats(calculatedStats);
      }, 500); // 500ms delay to ensure data is loaded
    }
  }, [statsScope, mapLoaded]); // Recalculate when scope changes or map loads

  // **NEW**: Recalculate zone stats when map moves (if zone scope is selected)
  const recalculateZoneStatsIfNeeded = useCallback(() => {
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getSource('mutations-live')) {
      setTimeout(() => {
        const features = mapRef.current.querySourceFeatures('mutations-live');
        const calculatedStats = calculateZoneStats(features);
        setZoneStats(calculatedStats);
      }, 300); // Longer delay to ensure data is fully loaded
    }
  }, [statsScope]);

  // **NEW**: Recalculate zone stats when data version changes (triggered by PropertyList)
  useEffect(() => {
    if (statsScope === 'zone' && dataVersion !== undefined && mapRef.current && mapRef.current.getSource('mutations-live')) {
      // Small delay to ensure map rendering is complete
      setTimeout(() => {
        const features = mapRef.current.querySourceFeatures('mutations-live');
        const calculatedStats = calculateZoneStats(features);
        setZoneStats(calculatedStats);
      }, 300);
    }
  }, [dataVersion, statsScope]); // Trigger when dataVersion or statsScope changes

  // **NEW**: Handle statsScope change to quartier - reset stats to zeros
  useEffect(() => {
    if (statsScope === 'quartier') {
      // Reset property stats to show zeros when quartier scope is selected
      const resetStats = [
        { typeGroupe: 'Appartement', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
        { typeGroupe: 'Maison', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
        { typeGroupe: 'Terrain', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
        { typeGroupe: 'Local Commercial', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
        { typeGroupe: 'Bien Multiple', nombre: 0, prixMoyen: 0, prixM2Moyen: 0 },
      ];
      setPropertyStats(resetStats);
      setIsLoading(false); // Stop loading state for quartier
    }
  }, [statsScope]); // Trigger when statsScope changes

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
      // Find the corresponding feature on the map by matching coordinates
      const features = mapRef.current.querySourceFeatures('mutations-live');

      for (const feature of features) {
        if (feature.geometry && feature.geometry.type === 'Point') {
          const featureCoords = feature.geometry.coordinates;
          const propertyCoords = hoveredProperty.coordinates;

          // Check if coordinates match exactly (they should be exactly the same)
          const coordsMatch = featureCoords[0] === propertyCoords[0] && featureCoords[1] === propertyCoords[1];

          if (coordsMatch) {
            // Show blue box shadow for this feature
            const hoveredFeatureData: GeoJSON.FeatureCollection = {
              type: 'FeatureCollection',
              features: [feature as GeoJSON.Feature],
            };

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
            (mapRef.current.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);
            // Applied blue shadow to map point
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
    clearAllPopups(); // Clear all popups when opening stats panel
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
        className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 bg-white text-gray-600 px-2 py-1 sm:px-3 sm:py-2 rounded-lg flex items-center gap-1 text-xs sm:text-sm hover:bg-gray-50 shadow-md"
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
      <div className="absolute top-16 left-2 sm:top-20 sm:left-4 z-30 flex flex-col gap-1">
        {/* Zoom In Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomIn();
            }
          }}
          className="bg-white text-gray-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200"
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
          className="bg-white text-gray-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200"
          title="Zoom out"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
          </svg>
        </button>

        {/* Map Style Toggle Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              const map = mapRef.current;

              try {
                if (currentMapStyle === 'original') {
                  // Change to satellite/alternative view by modifying layers
                  debugLog('Switching to alternative style...');

                  // Change the background layer or add satellite layer
                  if (map.getLayer('satellite-layer')) {
                    map.setLayoutProperty('satellite-layer', 'visibility', 'visible');
                  } else {
                    // Add satellite layer if it doesn't exist
                    map.addLayer(
                      {
                        id: 'satellite-layer',
                        type: 'raster',
                        source: {
                          type: 'raster',
                          tiles: [
                            'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=' + mapboxgl.accessToken,
                          ],
                          tileSize: 512,
                        },
                        layout: {
                          visibility: 'visible',
                        },
                        paint: {
                          'raster-opacity': 0.8,
                        },
                      },
                      'mutation-point',
                    ); // Add below mutation points
                  }

                  setCurrentMapStyle('alternative');
                } else {
                  // Switch back to original style
                  debugLog('Switching back to original style...');

                  // Hide satellite layer
                  if (map.getLayer('satellite-layer')) {
                    map.setLayoutProperty('satellite-layer', 'visibility', 'none');
                  }

                  setCurrentMapStyle('original');
                }

                debugLog('Style change completed successfully');
              } catch (err) {
                // Error switching map style
                setError('Erreur lors du changement de style de carte');
              }
            }
          }}
          className="bg-white text-gray-600 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200"
          title="Toggle map style"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
            />
          </svg>
        </button>
      </div>

      {/* Stats Panel */}
      {showStatsPanel && (
        <div
          className="absolute top-0 left-0 right-0 sm:top-4 sm:left-16 sm:right-auto z-50 bg-white rounded-none sm:rounded-xl shadow-xl p-2 sm:p-4 w-full sm:w-[520px] max-h-64 sm:h-auto overflow-y-auto sm:overflow-visible border sm:border border-gray-200"
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Version - ImmoData Style */}
          <div className="block sm:hidden">
            <div className="flex flex-col w-full px-2 py-1 gap-1 lg:gap-1">
              <div className="flex lg:flex-row flex-col justify-between items-center gap-2">
                <div className="flex flex-row w-full items-center py-1.5">
                  <h2 className="text-sm font-semibold text-gray-900 w-full whitespace-nowrap">Statistiques de marché</h2>
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowStatsPanel(false)}
                      className="z-10 w-6 h-6 text-xs rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-200"
                    >
                      <svg className="w-3 h-3 mx-auto" fill="currentColor" viewBox="0 0 384 512">
                        <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex flex-row items-center w-full gap-2">
                  <div className="w-full">
                    <div className="relative flex lg:justify-end">
                      <select
                        value={statsScope === 'commune' ? currentCity : statsScope === 'zone' ? 'Zone affichée' : currentQuartier}
                        onChange={e => {
                          if (e.target.value === 'Zone affichée') {
                            setStatsScope('zone');
                          } else if (e.target.value === currentQuartier) {
                            setStatsScope('quartier');
                          } else {
                            setStatsScope('commune');
                          }
                        }}
                        className="bg-white font-medium relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm py-2"
                      >
                        <option value={currentCity}>{currentCity}</option>
                        <option value="Zone affichée">Zone affichée</option>
                        {hasQuartier && <option value={currentQuartier}>{currentQuartier}</option>}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400 transition-transform duration-200" fill="currentColor" viewBox="0 0 512 512">
                          <path d="M267.3 395.3c-6.2 6.2-16.4 6.2-22.6 0l-192-192c-6.2-6.2-6.2-16.4 0-22.6s16.4-6.2 22.6 0L256 361.4 436.7 180.7c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6l-192 192z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {/* Property Type Buttons */}
                <div className="flex space-x-1 rounded-lg bg-gray-100 p-1 gap-2">
                  {(() => {
                    const propertyTypeNames = ['Maison', 'Appartement', 'Local Commercial', 'Terrain', 'Biens Multiples'];

                    // Use the same background colors as desktop version
                    const getPropertyTypeButtonColor = typeName => {
                      const colorMap = {
                        Maison: '#7A72D5', // #7A72D5 - Violet clair
                        Appartement: '#504CC5', // #504CC5 - Violet
                        'Local Commercial': '#205F9D', // #205F9D - Bleu foncé
                        Terrain: '#4F96D6', // #4F96D6 - Bleu
                        'Biens Multiples': '#022060', // #022060 - Bleu très foncé
                      };
                      return colorMap[typeName] || '#6B7280';
                    };

                    const propertyIcons = [
                      // Maison icon - same style as reference
                      <svg key="maison-icon" className="text-white" fill="currentColor" viewBox="0 0 576 512">
                        <path d="M298.6 4c-6-5.3-15.1-5.3-21.2 0L5.4 244c-6.6 5.8-7.3 16-1.4 22.6s16 7.3 22.6 1.4L64 235V432c0 44.2 35.8 80 80 80H432c44.2 0 80-35.8 80-80V235l37.4 33c6.6 5.8 16.7 5.2 22.6-1.4s5.2-16.7-1.4-22.6L298.6 4zM96 432V206.7L288 37.3 480 206.7V432c0 26.5-21.5 48-48 48H368V320c0-17.7-14.3-32-32-32H240c-17.7 0-32 14.3-32 32V480H144c-26.5 0-48-21.5-48-48zm144 48V320h96V480H240z" />
                      </svg>,
                      // Appartement icon - same style
                      <svg key="appartement-icon" className="text-white" fill="currentColor" viewBox="0 0 384 512">
                        <path d="M0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H240V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H48c-26.5 0-48-21.5-48-48V48zM80 224c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H80zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm112-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H272z" />
                      </svg>,
                      // Local Commercial icon - same style
                      <svg key="local-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M603.2 192H36.8C16.5 192 0 175.5 0 155.2c0-7.3 2.2-14.4 6.2-20.4L81.8 21.4C90.7 8 105.6 0 121.7 0H518.3c16.1 0 31 8 39.9 21.4l75.6 113.3c4 6.1 6.2 13.2 6.2 20.4c0 20.3-16.5 36.8-36.8 36.8z" />
                      </svg>,
                      // Terrain icon - same style
                      <svg key="terrain-icon" className="text-white" fill="currentColor" viewBox="0 0 448 512">
                        <path d="M64 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm0-96c29.8 0 54.9 20.4 62 48H322c7.1-27.6 32.2-48 62-48c35.3 0 64 28.7 64 64c0 29.8-20.4 54.9-48 62V354c27.6 7.1 48 32.2 48 62c0 35.3-28.7 64-64 64c-29.8 0-54.9-20.4-62-48H126c-7.1 27.6-32.2 48-62 48c-35.3 0-64-28.7-64-64c0-29.8 20.4-54.9 48-62V158C20.4 150.9 0 125.8 0 96C0 60.7 28.7 32 64 32zm62 368H322c5.8-22.5 23.5-40.2 46-46V158c-22.5-5.8-40.2-23.5-46-46H126c-5.8 22.5-23.5 40.2-46 46V354c22.5 5.8 40.2 23.5 46 46zM96 416a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm256 0a32 32 0 1 0 64 0 32 32 0 1 0 -64 0zm32-288a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
                      </svg>,
                      // Biens Multiples icon - same style
                      <svg key="biens-multiples-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M0 464V277.1c0-13.5 5.6-26.3 15.6-35.4l144-132c18.4-16.8 46.5-16.8 64.9 0l144 132c9.9 9.1 15.6 21.9 15.6 35.4V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48z" />
                      </svg>,
                    ];

                    return propertyTypeNames.map((typeName, index) => (
                      <div
                        key={typeName}
                        className={`flex justify-center w-full rounded-md py-2 text-xs leading-4 px-3 ring-white/60 ring-offset-0 ring-offset-blue-400 focus:outline-none focus:ring-2 hover:cursor-pointer transition-all duration-200 ${
                          activePropertyType === index
                            ? 'text-white shadow font-medium'
                            : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-900'
                        }`}
                        style={activePropertyType === index ? { backgroundColor: getPropertyTypeButtonColor(typeName) } : {}}
                        onClick={() => setActivePropertyType(index)}
                      >
                        <p className="flex items-center justify-center group">
                          <span className={`w-4 h-4 ${activePropertyType === index ? 'text-white' : ''}`}>
                            {React.cloneElement(propertyIcons[index], {
                              className: activePropertyType === index ? 'text-white' : '',
                              style: activePropertyType === index ? { color: 'white' } : { color: getPropertyTypeButtonColor(typeName) },
                            })}
                          </span>
                          <span
                            className={`overflow-hidden whitespace-nowrap pl-1.5 ${activePropertyType === index ? 'inline-block' : 'w-0 hidden'}`}
                          >
                            {typeName}
                          </span>
                        </p>
                      </div>
                    ));
                  })()}
                </div>

                {/* Statistics Display - Cards like Desktop */}
                <div className="grid grid-cols-3 gap-2">
                  {(() => {
                    const propertyTypeNames = ['Maison', 'Appartement', 'Local Commercial', 'Terrain', 'Biens Multiples'];
                    const apiTypeMap = {
                      'Local Commercial': 'Local Commercial',
                      Appartement: 'Appartement',
                      Maison: 'Maison',
                      Terrain: 'Terrain',
                      'Biens Multiples': 'Bien Multiple',
                    };

                    const currentStatsData = statsScope === 'commune' ? propertyStats : statsScope === 'zone' ? zoneStats : propertyStats;
                    const selectedTypeName = propertyTypeNames[activePropertyType];
                    const apiTypeName = apiTypeMap[selectedTypeName] || selectedTypeName;

                    const match = currentStatsData.find(item => item.typeGroupe === apiTypeName);
                    const currentStat = {
                      nombre: match?.nombreMutations || match?.nombre || 0,
                      prixMoyen: match?.prixMedian || match?.prixMoyen || 0,
                      prixM2Moyen: match?.prixM2Median || match?.prixM2Moyen || 0,
                    };

                    if (isLoading || (statsScope === 'quartier' && isLoadingQuartier)) {
                      return (
                        <div className="flex justify-center w-full py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      );
                    }

                    if (error) {
                      return (
                        <div className="text-center w-full py-4">
                          <p className="text-red-500 text-sm">⚠️ {error}</p>
                        </div>
                      );
                    }

                    return (
                      <>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Nombre de ventes</p>
                          <p className="text-sm font-semibold text-gray-900">{formatNumber(currentStat.nombre)}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Prix médian</p>
                          <p className="text-sm font-semibold text-gray-900">{formatNumber(currentStat.prixMoyen)}€</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Prix médian au m²</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {Math.round(currentStat.prixM2Moyen || 0).toLocaleString('fr-FR')}€
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Version - Original Style */}
          <div className="hidden sm:block">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800">Statistiques Marché</h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div>
                  <select
                    id="stats-scope"
                    value={statsScope}
                    onChange={e => setStatsScope(e.target.value as 'commune' | 'zone' | 'quartier')}
                    className="border border-gray-300 rounded-lg px-2 py-1 sm:px-3 sm:py-2 text-xs font-semibold bg-gray-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 transition-colors duration-150 shadow-sm cursor-pointer w-full sm:min-w-[120px]"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
                  >
                    <option value="commune">Commune ({currentCity})</option>
                    <option value="zone">Zone affichée</option>
                    {hasQuartier && <option value="quartier">Quartier ({currentQuartier || 'Chargement...'})</option>}
                  </select>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full mb-3" />

            {(() => {
              // ✅ Adaptation pour les nouvelles données de l'API
              const propertyTypeNames = ['Appartement', 'Maison', 'Terrain', 'Local', 'Bien Multiple'];
              // ✅ Nouvelles couleurs spécifiées
              const getPropertyTypeButtonColor = typeName => {
                const colorMap = {
                  Appartement: 'bg-[#504CC5]', // #504CC5 - Violet
                  Maison: 'bg-[#7A72D5]', // #7A72D5 - Violet clair
                  Terrain: 'bg-[#4F96D6]', // #4F96D6 - Bleu
                  Local: 'bg-[#205F9D]', // #205F9D - Bleu foncé
                  'Bien Multiple': 'bg-[#022060]', // #022060 - Bleu très foncé
                };
                return colorMap[typeName] || 'bg-gray-500';
              };

              // **NEW**: Choose data source based on selected scope
              const currentStatsData =
                statsScope === 'commune'
                  ? propertyStats
                  : statsScope === 'zone'
                    ? zoneStats
                    : // For quartier, use propertyStats but they will be zeros when quartier changes
                      propertyStats;

              const normalizedStats = propertyTypeNames.map((typeName, index) => {
                // ✅ Mapping des noms pour correspondre aux données API
                const apiTypeMap = {
                  Local: 'Local Commercial',
                  Appartement: 'Appartement',
                  Maison: 'Maison',
                  Terrain: 'Terrain',
                  'Bien Multiple': 'Bien Multiple',
                };

                const apiTypeName = apiTypeMap[typeName] || typeName;

                // ✅ Recherche directe par typeGroupe depuis l'API ou zone data
                const match = currentStatsData.find(item => {
                  return item.typeGroupe === apiTypeName;
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
                  <div className="grid grid-cols-2 sm:flex sm:flex-nowrap mb-3 gap-1 sm:gap-2">
                    {normalizedStats.map((stat, index) => (
                      <button
                        key={stat.typeBien}
                        className={`flex-1 py-2 px-1 sm:px-2 rounded-lg text-center text-xs font-medium whitespace-nowrap ${
                          activePropertyType === index
                            ? `${getPropertyTypeButtonColor(stat.typeBien)} text-white`
                            : 'text-gray-600 hover:bg-gray-100 bg-gray-50'
                        }`}
                        onClick={() => setActivePropertyType(index)}
                      >
                        {stat.typeBien}
                      </button>
                    ))}
                  </div>

                  {isLoading || (statsScope === 'quartier' && isLoadingQuartier) ? (
                    <div className="flex justify-center py-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
                    </div>
                  ) : error ? (
                    <div className="text-red-500 text-center py-1 text-xs">⚠️ {error}</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Nombre de ventes</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatNumber(normalizedStats[activePropertyType]?.nombre)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Prix médian</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Prix médian au m²</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {Math.round(normalizedStats[activePropertyType]?.prixM2Moyen || 0).toLocaleString('fr-FR')}€
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            <button
              onClick={() => setShowStatsPanel(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mobile Bottom Sheet */}
      <MobilePropertyBottomSheet
        isOpen={showMobileBottomSheet}
        onClose={handleMobileSheetClose}
        property={mobileSheetProperty}
        currentIndex={mobileSheetIndex}
        totalCount={mobileSheetMutations.length}
        onPrevious={handleMobileSheetPrevious}
        onNext={handleMobileSheetNext}
      />
    </div>
  );
};

export default PropertyMap;
