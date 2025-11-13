import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';
import './styles/mapbox-popup.css';
import { API_ENDPOINTS, API_BASE_URL } from 'app/config/api.config';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FilterState } from '../../types/filters';
import MobilePropertyBottomSheet from '../property/MobilePropertyBottomSheet';
// Import map style icons - using direct path since webpack handles it via CopyWebpackPlugin
const mapSatelliteIcon = '/content/assets/map-satellite.f2bd1f82.webp';
const mapStreetsIcon = '/content/assets/20251029-091227.jpg';
const statsIcon = '/content/assets/statimg.png';

// Types definitions
interface MutationDetails {
  id?: number;
  idmutation?: number;
  type_bien?: string;
  type_groupe?: string;
  valeur?: number;
  prix_m2?: number;
  nbpprinc?: number;
  surface_batiment?: number;
  sbati?: number;
  surface_terrain?: number;
  sterr?: number;
  date?: string;
  longitude?: number;
  latitude?: number;
  [key: string]: unknown;
}

interface AddressDetails {
  commune?: string;
  idadresse?: number;
  codepostal?: string;
  adresse_complete?: string;
  mutations?: MutationDetails[];
  [key: string]: unknown;
}

interface FeatureProperties {
  numero?: string;
  commune?: string;
  prefixe?: string;
  section?: string;
  idparcelle?: string | number;
  adresses?: AddressDetails[] | string | null;
  [key: string]: unknown;
}

interface Feature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: FeatureProperties;
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
    isCity?: boolean; // Flag to indicate if this is a city/commune (no red circle)
  };
  selectedProperty?: Property | null;
  hoveredProperty?: Property | null;
  filterState?: FilterState;
  onDataUpdate?: (mutationData: Feature[]) => void; // **NEW**: Callback to update PropertyCard data
  onMapHover?: (propertyId: number | null) => void; // **NEW**: Callback for map hover
  dataVersion?: number; // **NEW**: Data version to trigger zone stats recalculation
  isFilterOpen?: boolean; // **NEW**: Track if filter popup is open to close other popups
  onCloseStatsPopup?: () => void; // **NEW**: Callback to close stats popup
}

// Type guard to check if geometry is a Point
interface PointGeometry {
  type: 'Point';
  coordinates: [number, number];
}

function isPointGeometry(geometry: any): geometry is PointGeometry {
  return geometry && geometry.type === 'Point' && Array.isArray(geometry.coordinates);
}

const isAddressDetailsArray = (value: unknown): value is AddressDetails[] => Array.isArray(value);

const parseAddresses = (adresses: FeatureProperties['adresses']): AddressDetails[] => {
  if (!adresses) {
    return [];
  }
  if (isAddressDetailsArray(adresses)) {
    return adresses;
  }
  if (typeof adresses === 'string') {
    try {
      const parsed = JSON.parse(adresses);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }
  return [];
};

const getMutationTypeLabel = (mutation?: MutationDetails): string => {
  if (!mutation) {
    return 'Type inconnu';
  }
  const preferredType = mutation.type_bien ?? mutation.type_groupe;
  if (typeof preferredType === 'string' && preferredType.trim().length > 0) {
    return preferredType;
  }
  return 'Type inconnu';
};

const getBuiltSurfaceValue = (mutation?: MutationDetails): number => {
  if (!mutation) {
    return 0;
  }
  const value = mutation.surface_batiment ?? mutation.sbati;
  return typeof value === 'number' ? value : 0;
};

const getLandSurfaceValue = (mutation?: MutationDetails): number => {
  if (!mutation) {
    return 0;
  }
  const value = mutation.surface_terrain ?? mutation.sterr;
  return typeof value === 'number' ? value : 0;
};

const formatSurfaceValue = (value?: number | null): string => {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    return '';
  }
  return `${value.toLocaleString('fr-FR')} m²`;
};

const getMutationId = (mutation?: MutationDetails): string | number => {
  if (!mutation) {
    return crypto.randomUUID?.() ?? `mutation-${Date.now()}`;
  }
  if (mutation.idmutation !== undefined) {
    return mutation.idmutation;
  }
  if (mutation.id !== undefined) {
    return mutation.id;
  }
  const datePart = mutation.date ?? 'unknown-date';
  const valuePart = mutation.valeur !== undefined ? mutation.valeur : 'unknown-value';
  const typePart = mutation.type_bien ?? mutation.type_groupe ?? 'unknown-type';
  return `${datePart}-${valuePart}-${typePart}`;
};

const formatPricePerSqm = (price?: number | null, surface?: number | null, terrain?: number | null, propertyType?: string): string => {
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    return 'N/A';
  }

  const isTerrain = propertyType?.toLowerCase().includes('terrain') ?? false;

  if (isTerrain) {
    if (typeof terrain !== 'number' || Number.isNaN(terrain) || terrain <= 0) {
      return 'N/A';
    }
    const pricePerSqm = Math.round(price / terrain);
    return `${pricePerSqm.toLocaleString('fr-FR')} €/m²`;
  }

  if (typeof surface !== 'number' || Number.isNaN(surface) || surface <= 0) {
    return 'N/A';
  }

  const pricePerSqm = Math.round(price / surface);
  return `${pricePerSqm.toLocaleString('fr-FR')} €/m²`;
};

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
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(num || 0));
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
          const addresses = parseAddresses(feature.properties.adresses);

          if (addresses.length > 0) {
            addresses.forEach((address: AddressDetails) => {
              if (address.mutations && Array.isArray(address.mutations)) {
                address.mutations.forEach((mutation: MutationDetails) => {
                  const mutationType = getMutationTypeLabel(mutation);
                  if (mutationType === mutationTypeName) {
                    // Only add if we haven't seen this mutation ID before
                    const mutationKey = getMutationId(mutation);
                    if (!uniqueMutations.has(mutationKey)) {
                      uniqueMutations.set(mutationKey, mutation);
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

// Helper function to detect and format city name with arrondissement
const formatCityWithArrondissement = (city: string, postcode: string | null, context?: string): string => {
  if (!city) return city;

  // Mapping of cities with arrondissements and their postal code patterns
  const citiesWithArrondissements: Record<string, { basePostcode: number; maxArrondissement: number; name: string }> = {
    paris: { basePostcode: 75000, maxArrondissement: 20, name: 'Paris' },
    marseille: { basePostcode: 13000, maxArrondissement: 16, name: 'Marseille' },
    lyon: { basePostcode: 69000, maxArrondissement: 9, name: 'Lyon' },
  };

  // Try to detect arrondissement from city name (e.g., "Paris 12e Arrondissement", "12e Arrondissement")
  const arrondissementInNameRegex = /(\d+)(?:er|e|ème)?\s*(?:arrondissement|arr\.?)/i;
  const nameMatch = city.match(arrondissementInNameRegex);

  if (nameMatch) {
    const arrondissementNum = parseInt(nameMatch[1], 10);
    // Extract base city name (remove arrondissement part)
    const baseCity = city.replace(/\s*\d+(?:er|e|ème)?\s*(?:arrondissement|arr\.?)/gi, '').trim();

    // Check if the base city matches one of our known cities with arrondissements
    const cityLower = baseCity.toLowerCase();
    for (const [key, info] of Object.entries(citiesWithArrondissements)) {
      if (cityLower.includes(key) || city.toLowerCase().includes(key)) {
        if (arrondissementNum >= 1 && arrondissementNum <= info.maxArrondissement) {
          const suffix = arrondissementNum === 1 ? 'er' : 'e';
          return `${info.name} ${arrondissementNum}${suffix}`;
        }
      }
    }

    // For other cities with arrondissement in name, format it
    if (baseCity) {
      const suffix = arrondissementNum === 1 ? 'er' : 'e';
      return `${baseCity} ${arrondissementNum}${suffix}`;
    }
  }

  // Check postal code to detect arrondissements
  if (postcode) {
    const postcodeNum = parseInt(postcode, 10);
    if (!isNaN(postcodeNum)) {
      for (const [key, info] of Object.entries(citiesWithArrondissements)) {
        const minPostcode = info.basePostcode + 1;
        const maxPostcode = info.basePostcode + info.maxArrondissement;

        if (postcodeNum >= minPostcode && postcodeNum <= maxPostcode) {
          const arrondissement = postcodeNum - info.basePostcode;
          const cityLower = city.toLowerCase();

          // Verify city name matches
          if (cityLower.includes(key) || context?.toLowerCase().includes(key)) {
            const suffix = arrondissement === 1 ? 'er' : 'e';
            return `${info.name} ${arrondissement}${suffix}`;
          }
        }
      }
    }
  }

  // Check context for arrondissement information (from OSM data)
  if (context) {
    const contextArrondissementRegex = /(\d+)(?:er|e|ème)?\s*(?:arrondissement|arr\.?)/i;
    const contextMatch = context.match(contextArrondissementRegex);

    if (contextMatch) {
      const arrondissementNum = parseInt(contextMatch[1], 10);
      const cityLower = city.toLowerCase();

      for (const [key, info] of Object.entries(citiesWithArrondissements)) {
        if (cityLower.includes(key) || context.toLowerCase().includes(key)) {
          if (arrondissementNum >= 1 && arrondissementNum <= info.maxArrondissement) {
            const suffix = arrondissementNum === 1 ? 'er' : 'e';
            return `${info.name} ${arrondissementNum}${suffix}`;
          }
        }
      }
    }
  }

  return city;
};

// Helper function to check if current city is an arrondissement (Paris, Marseille, Lyon, etc.)
const isCityArrondissement = (cityName: string): boolean => {
  if (!cityName) return false;

  // Cities with arrondissements and their patterns
  const arrondissementPatterns = [
    /^Paris\s+\d+(?:er|e|ème)$/i, // Paris 6e, Paris 1er
    /^Marseille\s+\d+(?:er|e|ème)$/i, // Marseille 1er, Marseille 6e
    /^Lyon\s+\d+(?:er|e|ème)$/i, // Lyon 1er, Lyon 6e
  ];

  return arrondissementPatterns.some(pattern => pattern.test(cityName.trim()));
};

// Function to get INSEE code from coordinates
const getINSEECodeFromCoords = async (lng: number, lat: number) => {
  try {
    // Use backend proxy to avoid CORS issues
    const response = await axios.get(API_ENDPOINTS.adresses.frenchAddressReverse, {
      params: {
        lon: lng,
        lat,
      },
    });

    if (response.data && response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      const properties = feature.properties;

      const city = properties.city || properties.name;
      const postcode = properties.postcode || null;

      // Try to get OSM data for additional context (arrondissement detection)
      let osmContext: string | null = null;
      try {
        const osmResponse = await axios.get(API_ENDPOINTS.adresses.osmReverse, {
          params: {
            lat,
            lon: lng,
          },
        });

        if (osmResponse.data && osmResponse.data.address) {
          const address = osmResponse.data.address;
          // Check for arrondissement in various OSM fields
          osmContext =
            address.suburb ||
            address.neighbourhood ||
            address.quarter ||
            address.district ||
            address.city_district ||
            osmResponse.data.display_name ||
            null;
        }
      } catch (osmErr) {
        // OSM data is optional, continue without it
      }

      const formattedCity = formatCityWithArrondissement(city, postcode, osmContext || undefined);

      return {
        city: formattedCity,
        insee: properties.citycode,
        postcode,
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
    // Use backend proxy to avoid CORS issues
    const response = await axios.get(API_ENDPOINTS.adresses.osmReverse, {
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        zoom: 18,
        'accept-language': 'fr',
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
  isFilterOpen,
  onCloseStatsPopup,
}) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);

  // Store searchParams in a ref to avoid stale closure issues
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // Normalize addresses to improve matching across variants (AV vs Avenue, accents, punctuation)
  const normalizeAddress = (value: string | undefined | null): string => {
    if (!value) return '';
    const lower = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .toLowerCase()
      .replace(/[.-]/g, ' ') // dots and hyphens to space
      .replace(/\s+/g, ' ') // collapse spaces
      .trim();
    // Normalize street-type codes and words to a single canonical form
    const codeToCanonical: Record<string, string> = {
      fg: 'faubourg',
      n: 'nord',
      esc: 'escalier',
      vte: 'voie terrestre',
      mte: 'montee',
      pl: 'place',
      imp: 'impasse',
      camp: 'camp',
      vc: 'voie communale',
      clos: 'clos',
      ctre: 'centre',
      sen: 'sente',
      rue: 'rue',
      esp: 'esplanade',
      enc: 'enclave',
      roc: 'rocade',
      ptr: 'poterne',
      dom: 'domaine',
      sq: 'square',
      prt: 'port',
      crs: 'cours',
      cours: 'cours',
      gal: 'galerie',
      ple: 'place',
      bd: 'boulevard',
      zi: 'zone industrielle',
      rte: 'route',
      prom: 'promenade',
      quai: 'quai',
      res: 'residence',
      pas: 'passage',
      ham: 'hameau',
      mais: 'maison',
      cd: 'chemin departemental',
      tra: 'traverse',
      parc: 'parc',
      rac: 'raccordement',
      dsc: 'descente',
      lot: 'lotissement',
      rpe: 'ruelle',
      chem: 'chemin',
      che: 'chemin',
      hab: 'habitation',
      qua: 'quartier',
      chv: 'chevauchant',
      all: 'allee',
      allee: 'allee',
      cour: 'cour',
      ptte: 'petite',
      tsse: 'tasse',
      zac: 'zone amenagement concerte',
      za: 'zone activite',
      vge: 'village',
      rle: 'ruelle',
      cc: 'centre commercial',
      cite: 'cite',
      voie: 'voie',
      cr: 'chemin rural',
      gr: 'grande randonnee',
      nte: 'montee',
      via: 'viaduc',
      av: 'avenue',
      ave: 'avenue',
      avenue: 'avenue',
      boulevard: 'boulevard',
      r: 'rue',
    };
    let normalized = lower;
    Object.entries(codeToCanonical).forEach(([code, canonical]) => {
      normalized = normalized.replace(new RegExp(`\\b${code}\\b`, 'g'), canonical);
    });
    return normalized.replace(/\s+/g, ' ').trim();
  };

  // Stats panel state
  const [showStatsPanel, setShowStatsPanel] = useState(true); // Open by default

  // Expose function to close stats popup to parent
  useEffect(() => {
    if (onCloseStatsPopup) {
      // Store the close function globally so SearchBar can call it
      (window as any).closeStatsPopup = () => setShowStatsPanel(false);
    }
    return () => {
      delete (window as any).closeStatsPopup;
    };
  }, [onCloseStatsPopup]);
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
  const showMobileBottomSheetRef = useRef(false);

  // Keep ref in sync with state
  useEffect(() => {
    showMobileBottomSheetRef.current = showMobileBottomSheet;
  }, [showMobileBottomSheet]);

  // Close all popups when filter popup opens
  useEffect(() => {
    if (isFilterOpen) {
      setShowStatsPanel(false);
      setShowMobileBottomSheet(false);
      // Clear shadow when filter opens
      if (mapRef.current) {
        const emptyFeatureCollection: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: [],
        };
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        (mapRef.current.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);
      }
    }
  }, [isFilterOpen]);
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
      const mutationTypeLabel = getMutationTypeLabel(mutation);
      const builtSurface = getBuiltSurfaceValue(mutation);
      const landSurface = getLandSurfaceValue(mutation);
      const priceValue = typeof mutation.valeur === 'number' ? mutation.valeur : 0;
      const calculatedPricePerSqm = formatPricePerSqm(priceValue, builtSurface, landSurface, mutationTypeLabel);
      setMobileSheetProperty({
        address: mobileSheetProperty.address,
        city: mobileSheetProperty.city,
        price: `${priceValue.toLocaleString('fr-FR')} €`,
        pricePerSqm: calculatedPricePerSqm === 'N/A' ? '' : calculatedPricePerSqm,
        type: mutationTypeLabel,
        rooms: mutation.nbpprinc || '',
        surface: formatSurfaceValue(builtSurface),
        terrain: formatSurfaceValue(landSurface),
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
      const mutationTypeLabel = getMutationTypeLabel(mutation);
      const builtSurface = getBuiltSurfaceValue(mutation);
      const landSurface = getLandSurfaceValue(mutation);
      const priceValue = typeof mutation.valeur === 'number' ? mutation.valeur : 0;
      const calculatedPricePerSqm = formatPricePerSqm(priceValue, builtSurface, landSurface, mutationTypeLabel);
      setMobileSheetProperty({
        address: mobileSheetProperty.address,
        city: mobileSheetProperty.city,
        price: `${priceValue.toLocaleString('fr-FR')} €`,
        pricePerSqm: calculatedPricePerSqm === 'N/A' ? '' : calculatedPricePerSqm,
        type: mutationTypeLabel,
        rooms: mutation.nbpprinc || '',
        surface: formatSurfaceValue(builtSurface),
        terrain: formatSurfaceValue(landSurface),
        soldDate: mutation.date ? new Date(mutation.date).toLocaleDateString('fr-FR') : '',
      });
    }
  };

  const handleMobileSheetClose = () => {
    setShowMobileBottomSheet(false);
    setMobileSheetProperty(null);
    setMobileSheetMutations([]);
    setMobileSheetIndex(0);

    // Clear the shadow when bottom sheet closes
    if (mapRef.current) {
      const emptyFeatureCollection: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [],
      };
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      (mapRef.current.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);
    }

    if (onMapHover) {
      onMapHover(null);
    }
  };

  // Ref to store hover popup for cleanup
  const hoverPopupRef = useRef<mapboxgl.Popup | null>(null);

  // Ref to track if mouse is hovering over the popup
  const isHoveringPopup = useRef<boolean>(false);

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
    const DEFAULT_PROPERTY_TYPES = ['0', '1', '2', '4', '5'];
    const SURFACE_DEFAULT_MIN = 0;
    const SURFACE_DEFAULT_MAX = 400;
    const TERRAIN_DEFAULT_MIN = 0;
    const TERRAIN_DEFAULT_MAX = 50000;
    const ALL_ROOM_COUNTS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

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

    const propertyTypeParam = selectedPropertyTypes.length > 0 ? selectedPropertyTypes.join(',') : DEFAULT_PROPERTY_TYPES.join(',');

    const hasMaisonOrAppartement =
      selectedPropertyTypes.length === 0 || selectedPropertyTypes.includes('0') || selectedPropertyTypes.includes('1');

    // Convert room counts to API format (unique values)
    const roomCountMap: Record<string, string[]> = {
      studio: ['1'],
      deuxPieces: ['2'],
      troisPieces: ['3'],
      quatrePieces: ['4'],
      cinqPiecesPlus: ['5', '6', '7', '8', '9', '10'],
    };

    const selectedRoomValues = new Set<string>();
    Object.entries(currentFilterState.roomCounts).forEach(([room, isSelected]) => {
      if (isSelected) {
        roomCountMap[room]?.forEach(value => selectedRoomValues.add(value));
      }
    });

    const sortedRoomValues = Array.from(selectedRoomValues).sort((a, b) => Number(a) - Number(b));
    const selectedRoomCounts = sortedRoomValues.join(',');
    const isRoomFilterActive = sortedRoomValues.length > 0 && sortedRoomValues.length < ALL_ROOM_COUNTS.length;
    const shouldIncludeRoomCount = hasMaisonOrAppartement && isRoomFilterActive;

    // Convert date range from months to actual dates
    const startDate = new Date(2014, 0, 1); // January 2014
    const minDate = new Date(startDate.getTime() + currentFilterState.dateRange[0] * 30 * 24 * 60 * 60 * 1000);
    const maxDate = new Date(startDate.getTime() + currentFilterState.dateRange[1] * 30 * 24 * 60 * 60 * 1000);

    const [surfaceMin, surfaceMax] = currentFilterState.surfaceRange;
    const isSurfaceFilterActive = surfaceMin > SURFACE_DEFAULT_MIN || surfaceMax < SURFACE_DEFAULT_MAX;
    const shouldIncludeSurfaceFilter = hasMaisonOrAppartement && isSurfaceFilterActive;

    const [terrainMin, terrainMax] = currentFilterState.terrainRange;
    const isTerrainFilterActive = terrainMin > TERRAIN_DEFAULT_MIN || terrainMax < TERRAIN_DEFAULT_MAX;
    const shouldIncludeTerrainFilter = isTerrainFilterActive;

    return {
      propertyType: propertyTypeParam,
      roomCount: selectedRoomCounts || '1,2,3,4,5,6,7,8,9,10',
      minSellPrice: currentFilterState.priceRange[0].toString(),
      maxSellPrice: currentFilterState.priceRange[1].toString(),
      minSurface: surfaceMin.toString(),
      maxSurface: surfaceMax.toString(),
      minSurfaceLand: terrainMin.toString(),
      maxSurfaceLand: terrainMax.toString(),
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
        minSellPrice: '0',
        maxSellPrice: '20000000',
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
            if (mapRef.current && mapRef.current.getLayer('mutation-point')) {
              // Use queryRenderedFeatures to get only visible mutations in the current viewport
              const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
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
              if (mapRef.current && mapRef.current.getLayer('mutation-point')) {
                // Use queryRenderedFeatures to get only visible mutations in the current viewport
                const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
                const calculatedStats = calculateZoneStats(features);
                setZoneStats(calculatedStats);
              }
            }, 500); // Wait for property list to finish updating
          }
        }

        // **NEW**: Recalculate zone stats immediately after new data is loaded
        if (statsScope === 'zone') {
          setTimeout(() => {
            if (mapRef.current && mapRef.current.getLayer('mutation-point')) {
              // Use queryRenderedFeatures to get only visible mutations in the current viewport
              const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
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
        attributionControl: false, // Disable Mapbox attribution
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
          let parcelPopup: mapboxgl.Popup | null = null;

          map.on('click', 'parcelles-layer', async (e: mapboxgl.MapMouseEvent) => {
            // Prevent event from bubbling to mutation points
            e.preventDefault();

            if (e.features && e.features.length > 0) {
              const feature = e.features[0];

              // The parcel ID is in the 'id' property, not 'idparcelle'
              const parcelId = feature.properties?.id || feature.properties?.idparcelle;

              if (!parcelId) {
                console.warn('No parcelId found in feature properties', feature.properties);
                return;
              }

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

              // Close existing parcel popup if any
              if (parcelPopup) {
                parcelPopup.remove();
                parcelPopup = null;
              }

              try {
                // Fetch parcel addresses from API
                const response = await axios.get(`${API_BASE_URL}/api/mutations/parcel/${parcelId}`);
                const parcelData = response.data;

                if (!parcelData || !parcelData.adresses || parcelData.adresses.length === 0) {
                  console.warn('No addresses found for parcel:', parcelId, parcelData);
                  return;
                }

                const addresses = Array.isArray(parcelData.adresses) ? parcelData.adresses : [];
                const sortedAddresses = sortAddressesForDisplay(addresses);
                const isMobileDevice = window.innerWidth < 768;

                // Set up global function for address selection similar to point popup
                if (sortedAddresses.length > 1) {
                  (window as any).selectAddress = (index: number) => {
                    const clickedAddress = sortedAddresses[index];
                    const hasMutations =
                      clickedAddress.mutations && Array.isArray(clickedAddress.mutations) && clickedAddress.mutations.length > 0;

                    if (hasMutations) {
                      onAddressSelect?.({
                        address: clickedAddress.adresse_complete,
                        city: clickedAddress.commune,
                        mutations: clickedAddress.mutations,
                      });
                    }

                    if (window.innerWidth < 768) {
                      handleMobileBottomSheet([clickedAddress]);
                    }
                  };
                } else if (sortedAddresses.length === 1) {
                  const singleAddress = sortedAddresses[0];
                  const hasMutations =
                    singleAddress.mutations && Array.isArray(singleAddress.mutations) && singleAddress.mutations.length > 0;

                  if (hasMutations) {
                    onAddressSelect?.({
                      address: singleAddress.adresse_complete,
                      city: singleAddress.commune,
                      mutations: singleAddress.mutations,
                    });
                  }

                  if (isMobileDevice) {
                    handleMobileBottomSheet([singleAddress]);
                  }
                }

                if (isMobileDevice && sortedAddresses.length > 1) {
                  handleMobileBottomSheet(sortedAddresses);
                }

                // Create popup content using the same helper as mutation points (addresses only)
                const popupContent = createPopupContent(sortedAddresses, { showMutations: false });

                parcelPopup = new mapboxgl.Popup({
                  closeButton: true,
                  closeOnClick: true,
                  maxWidth: '350px',
                  offset: [0, -5],
                })
                  .setLngLat(e.lngLat)
                  .setHTML(popupContent)
                  .addTo(map);

                // Add click handlers for addresses to show their mutations
                parcelPopup.on('close', () => {
                  parcelPopup = null;
                  if ((window as any).selectAddress) {
                    delete (window as any).selectAddress;
                  }
                });
              } catch (err) {
                console.error('Error fetching parcel addresses:', err);
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
              'circle-radius': 4,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#fff',
              'circle-stroke-opacity': 0.9,
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
            // On desktop, clear shadow normally. On mobile, only clear if bottom sheet is not open
            const isMobile = window.innerWidth < 768;
            const shouldClearShadow = !isMobile || !showMobileBottomSheetRef.current;

            if (shouldClearShadow) {
              // Clear the hovered-circle source (remove all features)
              const emptyFeatureCollection: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [],
              };
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);

              if (onMapHover) {
                onMapHover(null);
              }
            }

            map.getCanvas().style.cursor = '';
          });

          map.on('mousemove', e => {
            // Clear any existing timeout
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              hoverTimeout = null;
            }

            // Set a small delay to avoid too many queries
            // eslint-disable-next-line complexity
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
                  isHoveringPopup.current = false; // Reset hover flag
                }

                // Create mutation data popup
                if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
                  try {
                    const addresses = parseAddresses(feature.properties.adresses);

                    if (addresses.length > 0) {
                      // Sort addresses to prioritize searched address if available
                      let sortedAddresses = addresses;
                      if (searchParamsRef.current?.address) {
                        const searchedAddress = searchParamsRef.current.address.toLowerCase().trim();
                        sortedAddresses = [...addresses].sort((a, b) => {
                          const aMatchesAddress = normalizeAddress(a.adresse_complete) === normalizeAddress(searchedAddress);
                          const bMatchesAddress = normalizeAddress(b.adresse_complete) === normalizeAddress(searchedAddress);
                          if (aMatchesAddress && !bMatchesAddress) return -1;
                          if (!aMatchesAddress && bMatchesAddress) return 1;
                          return 0;
                        });
                      }

                      const firstAddress = sortedAddresses[0];
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
                        return shortNames[type] || type || 'Type inconnu';
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

                      // Get the first mutation for display
                      const firstMutation = mutations.length > 0 ? mutations[0] : null;

                      if (firstMutation) {
                        // Create a function to render mutation data - show ALL mutations, not just 5
                        // Sort mutations to prioritize searched address if available
                        let allMutations = mutations;
                        if (searchParams?.address && searchParams?.coordinates) {
                          const searchedCoords = searchParams.coordinates;
                          allMutations = [...mutations].sort((a, b) => {
                            const aMatchesCoords =
                              Math.abs(a.longitude - searchedCoords[0]) < 0.0001 && Math.abs(a.latitude - searchedCoords[1]) < 0.0001;
                            const bMatchesCoords =
                              Math.abs(b.longitude - searchedCoords[0]) < 0.0001 && Math.abs(b.latitude - searchedCoords[1]) < 0.0001;
                            if (aMatchesCoords && !bMatchesCoords) return -1;
                            if (!aMatchesCoords && bMatchesCoords) return 1;
                            const aDate = new Date(a.date || 0);
                            const bDate = new Date(b.date || 0);
                            return bDate.getTime() - aDate.getTime();
                          });
                        } else {
                          allMutations = [...mutations].sort((a, b) => {
                            const aDate = new Date(a.date || 0);
                            const bDate = new Date(b.date || 0);
                            return bDate.getTime() - aDate.getTime();
                          });
                        }
                        let currentIndex = 0;

                        const renderMutation = index => {
                          const mutation = allMutations[index];
                          const address = firstAddress.adresse_complete || '';
                          const propertyTypeLabel = getMutationTypeLabel(mutation);
                          const rooms = mutation.nbpprinc ?? 0;
                          const surface = getBuiltSurfaceValue(mutation);
                          const terrain = getLandSurfaceValue(mutation);
                          const price = mutation.valeur ?? 0;
                          const soldDate = mutation.date || '';
                          const priceFormatted = formatPrice(price);
                          const pricePerSqm = formatPricePerSqm(price, surface, terrain, propertyTypeLabel);

                          // Build the details string, only showing non-zero values
                          const details = [];
                          if (rooms > 0)
                            details.push(
                              `<span style="color: rgba(12, 12, 12, 0.75);">Pièce </span><span style="font-family: Maven Pro; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${rooms}</span>`,
                            );
                          if (surface > 0)
                            details.push(
                              `<span style="color: rgba(12, 12, 12, 0.75);">Surface </span><span style="font-family: Maven Pro; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${surface.toLocaleString('fr-FR')} m²</span>`,
                            );
                          if (terrain > 0)
                            details.push(
                              `<span style="color: rgba(12, 12, 12, 0.75);">Terrain </span><span style="font-family: Maven Pro; font-weight: 600; font-size: 14px; line-height: 100%; letter-spacing: 0%;">${terrain.toLocaleString('fr-FR')} m²</span>`,
                            );

                          const detailsText = details.length > 0 ? details.join('<span style="margin-left: 12px;"></span>') : '';

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
               <div style="font-weight: 700; font-size: 16px; width:60%; margin-bottom: 10px; color: #1a1a1a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                   ${address.toUpperCase() || ''}
               </div>

               <!-- Property Type -->
               <div style="color: ${getPropertyTypeColor(propertyTypeLabel)}; font-weight: 900; font-size: 16px; margin-bottom: 10px;">
                 ${getShortTypeName(propertyTypeLabel)}
               </div>

               <!-- Characteristics: pieces, terrain, surface -->
               ${
                 detailsText
                   ? `
               <div style="font-size: 16px; color: #333; margin-bottom: 8px;">
                 ${detailsText}
               </div>
               `
                   : ''
               }

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
                 background-color: rgba(112, 105, 249, 0.04);
               ">
                 <div style="color: #241c83; font-weight: 800; font-size: 18px;">${priceFormatted}</div>
                 <div style="color: #888; font-size: 14px;">${pricePerSqm}</div>
               </div>

               <!-- Sold Date -->
               <div style="
                 margin-top: 16px;
                 display: inline-block;
                 border: 1px solid #e5e7eb;
                 padding: 10px 8px;
                 border-radius: 12px;
                 font-size: 14px;
                 color: #444;
                 background-color: rgba(0, 0, 0, 0.04);
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
                          // Get the address from the sorted addresses (first one is the searched address)
                          const parentAddress = sortedAddresses && sortedAddresses.length > 0 ? sortedAddresses[0] : null;
                          const currentMutationTypeLabel = getMutationTypeLabel(currentMutation);
                          const currentBuiltSurface = getBuiltSurfaceValue(currentMutation);
                          const currentLandSurface = getLandSurfaceValue(currentMutation);
                          const currentPriceValue = typeof currentMutation.valeur === 'number' ? currentMutation.valeur : 0;
                          const currentPricePerSqm = formatPricePerSqm(
                            currentPriceValue,
                            currentBuiltSurface,
                            currentLandSurface,
                            currentMutationTypeLabel,
                          );
                          setMobileSheetProperty({
                            address: parentAddress?.adresse_complete || 'Adresse non disponible',
                            city: parentAddress?.commune || 'Ville non disponible',
                            price: `${currentPriceValue.toLocaleString('fr-FR')} €`,
                            pricePerSqm: currentPricePerSqm === 'N/A' ? '' : currentPricePerSqm,
                            type: currentMutationTypeLabel,
                            rooms: currentMutation.nbpprinc ?? '',
                            surface: formatSurfaceValue(currentBuiltSurface),
                            terrain: formatSurfaceValue(currentLandSurface),
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
                              if (!popupElement) {
                                console.warn('Popup element not found, skipping navigation listeners');
                                return;
                              }

                              // Add hover tracking to prevent popup from closing when mouse is over it
                              popupElement.addEventListener('mouseenter', () => {
                                isHoveringPopup.current = true;
                              });

                              popupElement.addEventListener('mouseleave', () => {
                                isHoveringPopup.current = false;
                                // Remove popup when mouse leaves it
                                setTimeout(() => {
                                  if (!isHoveringPopup.current && hoverPopupRef.current) {
                                    hoverPopupRef.current.remove();
                                    hoverPopupRef.current = null;
                                  }
                                }, 100);
                              });

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
                          } else {
                            // Even if no navigation buttons, add hover tracking
                            setTimeout(() => {
                              const popupElement = hoverPopupRef.current?.getElement();
                              if (popupElement) {
                                popupElement.addEventListener('mouseenter', () => {
                                  isHoveringPopup.current = true;
                                });

                                popupElement.addEventListener('mouseleave', () => {
                                  isHoveringPopup.current = false;
                                  // Remove popup when mouse leaves it
                                  setTimeout(() => {
                                    if (!isHoveringPopup.current && hoverPopupRef.current) {
                                      hoverPopupRef.current.remove();
                                      hoverPopupRef.current = null;
                                    }
                                  }, 100);
                                });
                              }
                            }, 100);
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
                  // Desktop: remove hover popup only if not hovering over the popup itself
                  if (hoverPopupRef.current && !isHoveringPopup.current) {
                    hoverPopupRef.current.remove();
                    hoverPopupRef.current = null;
                    debugLog('Hover popup removed - no features');
                  }
                }
                map.getCanvas().style.cursor = '';
              }
            }, 100); // 100ms delay
          });

          const sortAddressesForDisplay = (addresses: any[]) => {
            let sortedAddresses = addresses;
            if (searchParamsRef.current?.address) {
              const searchedAddress = searchParamsRef.current.address.toLowerCase().trim();

              sortedAddresses = [...addresses].sort((a, b) => {
                const aMatchesAddress = normalizeAddress(a.adresse_complete) === normalizeAddress(searchedAddress);
                const bMatchesAddress = normalizeAddress(b.adresse_complete) === normalizeAddress(searchedAddress);

                if (aMatchesAddress && !bMatchesAddress) return -1;
                if (!aMatchesAddress && bMatchesAddress) return 1;
                return 0;
              });
            }
            return sortedAddresses;
          };

          const handleMutationPointInteraction = (event: any) => {
            const { features, lngLat } = event;
            debugLog('Mutation point interaction triggered:', features);

            if (!features || features.length === 0) {
              return;
            }

            const feature = features[0];

            // Remove existing hover popup if any
            clearHoverPopup();

            const isMobile = window.innerWidth < 768;

            // Keep shadow on mobile for the tapped feature
            if (isMobile) {
              const hoveredFeatureData: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [feature as GeoJSON.Feature],
              };
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);
            }

            if (feature.properties && feature.properties.adresses && isPointGeometry(feature.geometry)) {
              try {
                const addresses = parseAddresses(feature.properties.adresses);
                if (addresses.length === 0) {
                  return;
                }

                const sortedAddresses = sortAddressesForDisplay(addresses);

                if (sortedAddresses.length > 1) {
                  (window as any).selectAddress = (index: number) => {
                    const clickedAddress = sortedAddresses[index];
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

                if (isMobile) {
                  handleMobileBottomSheet(sortedAddresses);
                  return;
                }

                clearClickPopup();

                const popupContent = createPopupContent(sortedAddresses);
                clickPopupRef.current = new mapboxgl.Popup({
                  closeButton: true,
                  closeOnClick: true,
                  maxWidth: '350px',
                  offset: [0, -5],
                })
                  .setLngLat(feature.geometry.coordinates || lngLat)
                  .setHTML(popupContent)
                  .addTo(map);

                clickPopupRef.current.on('close', () => {
                  if ((window as any).selectAddress) {
                    delete (window as any).selectAddress;
                  }
                  clickPopupRef.current = null;
                });

                if (sortedAddresses.length === 1) {
                  const singleAddress = sortedAddresses[0];
                  const hasMutations =
                    singleAddress.mutations && Array.isArray(singleAddress.mutations) && singleAddress.mutations.length > 0;

                  if (hasMutations) {
                    onAddressSelect?.({
                      address: singleAddress.adresse_complete,
                      city: singleAddress.commune,
                      mutations: singleAddress.mutations,
                    });
                  }
                }
              } catch (err) {
                debugLog('Error parsing addresses JSON in mutation click handler:', err);
              }
            }
          };

          const isMobileDevice = window.innerWidth < 768;
          if (isMobileDevice) {
            map.on('click', 'mutation-point', handleMutationPointInteraction);
          }

          // Helper function to create popup content
          const createPopupContent = (addresses: any[], options: { showMutations?: boolean } = {}) => {
            const { showMutations = true } = options;
            const sortedAddresses = sortAddressesForDisplay(addresses);

            // Parcel popup style (when showMutations is false) - always use same style for 1 or multiple addresses
            if (!showMutations) {
              return `
                <div style="padding: 8px 12px; font-family: 'Maven Pro', Arial, sans-serif;">
                  <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 8px;">
                    Choisissez une adresse
                  </div>
                  ${sortedAddresses
                    .map((address, index) => {
                      return `
                    <div
                      style="
                        padding: 6px 0;
                        cursor: pointer;
                        transition: opacity 0.2s;
                        ${index > 0 ? 'border-top: 1px solid #e5e7eb;' : ''}
                      "
                      onmouseover="this.style.opacity='0.7'"
                      onmouseout="this.style.opacity='1'"
                      onclick="window.selectAddress && window.selectAddress(${index})"
                    >
                      <div style="font-size: 14px; color: #3b82f6; text-transform: uppercase; font-weight: 500;">
                        ${address.adresse_complete}
                      </div>
                    </div>
                  `;
                    })
                    .join('')}
                </div>
              `;
            }

            // Mutation popup style (when showMutations is true)
            if (sortedAddresses.length === 1) {
              const address = sortedAddresses[0];
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
                    ${sortedAddresses.length} adresses:
                  </div>
                  ${sortedAddresses
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
                        showMutations
                          ? hasMutations
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
                          : ''
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
            // Sort addresses to prioritize searched address if available
            let sortedAddresses = addresses;
            if (searchParamsRef.current?.address) {
              const searchedAddress = searchParamsRef.current.address.toLowerCase().trim();
              sortedAddresses = [...addresses].sort((a, b) => {
                const aMatchesAddress = normalizeAddress(a.adresse_complete) === normalizeAddress(searchedAddress);
                const bMatchesAddress = normalizeAddress(b.adresse_complete) === normalizeAddress(searchedAddress);
                if (aMatchesAddress && !bMatchesAddress) return -1;
                if (!aMatchesAddress && bMatchesAddress) return 1;
                return 0;
              });
            }

            if (sortedAddresses.length === 1) {
              const address = sortedAddresses[0];
              const hasMutations = address.mutations && Array.isArray(address.mutations) && address.mutations.length > 0;

              if (hasMutations) {
                setMobileSheetMutations(address.mutations);
                setMobileSheetIndex(0);

                const firstMutation = address.mutations[0];
                const propertyTypeLabel = getMutationTypeLabel(firstMutation);
                const builtSurface = getBuiltSurfaceValue(firstMutation);
                const landSurface = getLandSurfaceValue(firstMutation);
                const priceValue = typeof firstMutation.valeur === 'number' ? firstMutation.valeur : 0;
                const formattedPricePerSqm = formatPricePerSqm(priceValue, builtSurface, landSurface, propertyTypeLabel);
                setMobileSheetProperty({
                  address: address.adresse_complete, // Use the address object, not mutation
                  city: address.commune, // Use the address object, not mutation
                  price: `${priceValue.toLocaleString('fr-FR')} €`,
                  pricePerSqm: formattedPricePerSqm === 'N/A' ? '' : formattedPricePerSqm,
                  type: propertyTypeLabel,
                  rooms: firstMutation.nbpprinc ?? '',
                  surface: formatSurfaceValue(builtSurface),
                  terrain: formatSurfaceValue(landSurface),
                  soldDate: firstMutation.date ? new Date(firstMutation.date).toLocaleDateString('fr-FR') : '',
                });

                setShowMobileBottomSheet(true);
              }
            } else if (sortedAddresses.length > 1) {
              // For multiple addresses, prioritize the searched address even if it has fewer mutations
              let addressWithMutations;
              if (searchParamsRef.current?.address) {
                // First try to find the searched address with mutations
                const searchedAddress = searchParamsRef.current.address.toLowerCase().trim();
                addressWithMutations = sortedAddresses.find(
                  addr => addr.adresse_complete.toLowerCase().trim() === searchedAddress && addr.mutations && addr.mutations.length > 0,
                );
              }

              // If searched address has no mutations, fall back to any address with mutations
              if (!addressWithMutations) {
                addressWithMutations = sortedAddresses.find(addr => addr.mutations && addr.mutations.length > 0);
              }

              if (addressWithMutations) {
                setMobileSheetMutations(addressWithMutations.mutations);
                setMobileSheetIndex(0);

                const firstMutation = addressWithMutations.mutations[0];
                const propertyTypeLabel = getMutationTypeLabel(firstMutation);
                const builtSurface = getBuiltSurfaceValue(firstMutation);
                const landSurface = getLandSurfaceValue(firstMutation);
                const priceValue = typeof firstMutation.valeur === 'number' ? firstMutation.valeur : 0;
                const formattedPricePerSqm = formatPricePerSqm(priceValue, builtSurface, landSurface, propertyTypeLabel);
                setMobileSheetProperty({
                  address: addressWithMutations.adresse_complete, // Use the address object, not mutation
                  city: addressWithMutations.commune, // Use the address object, not mutation
                  price: `${priceValue.toLocaleString('fr-FR')} €`,
                  pricePerSqm: formattedPricePerSqm === 'N/A' ? '' : formattedPricePerSqm,
                  type: propertyTypeLabel,
                  rooms: firstMutation.nbpprinc ?? '',
                  surface: formatSurfaceValue(builtSurface),
                  terrain: formatSurfaceValue(landSurface),
                  soldDate: firstMutation.date ? new Date(firstMutation.date).toLocaleDateString('fr-FR') : '',
                });

                setShowMobileBottomSheet(true);
              }
            }
          };

          // Touch handler for iOS devices - prevents double-tap requirement
          // Listen to touch events on the map canvas and query features
          let touchStartTime = 0;
          let touchStartX = 0;
          let touchStartY = 0;
          const lastTouchInteractionRef = { current: 0 };

          const canvas = map.getCanvasContainer();

          const handleTouchStart = (e: TouchEvent) => {
            if (e.touches && e.touches.length > 0) {
              touchStartTime = Date.now();
              const rect = canvas.getBoundingClientRect();
              touchStartX = e.touches[0].clientX - rect.left;
              touchStartY = e.touches[0].clientY - rect.top;

              // Show hover shadow on mobile when touching a mutation point
              const features = map.queryRenderedFeatures([touchStartX, touchStartY], { layers: ['mutation-point'] });

              if (features && features.length > 0) {
                const feature = features[0];

                // Add the hovered feature to show shadow effect
                const hoveredFeatureData: GeoJSON.FeatureCollection = {
                  type: 'FeatureCollection',
                  features: [feature as GeoJSON.Feature],
                };

                // Update the hovered-circle source to show shadow
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);

                // Notify PropertyList about hover
                if (onMapHover && feature.properties?.idparcelle) {
                  onMapHover(parseInt(feature.properties.idparcelle, 10));
                }
              }
            }
          };

          const handleTouchEnd = (e: TouchEvent) => {
            const touchEndTime = Date.now();
            const timeDiff = touchEndTime - touchStartTime;

            // Clear hover shadow on touch end (only if bottom sheet is not open)
            if (!showMobileBottomSheetRef.current) {
              const emptyFeatureCollection: GeoJSON.FeatureCollection = {
                type: 'FeatureCollection',
                features: [],
              };
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);

              if (onMapHover) {
                onMapHover(null);
              }
            }

            // Prevent rapid successive triggers (debounce)
            if (touchEndTime - lastTouchInteractionRef.current < 300) {
              touchStartX = 0;
              touchStartY = 0;
              touchStartTime = 0;
              return;
            }

            // Only trigger if it's a quick tap (not a drag/scroll)
            if (timeDiff < 300 && e.changedTouches && e.changedTouches.length > 0) {
              const rect = canvas.getBoundingClientRect();
              const touchX = e.changedTouches[0].clientX - rect.left;
              const touchY = e.changedTouches[0].clientY - rect.top;

              // Check if it's a tap (not a drag) - allow small movement
              const distance = Math.sqrt(Math.pow(touchX - touchStartX, 2) + Math.pow(touchY - touchStartY, 2));

              if (distance < 10) {
                // Query features at touch point
                const features = map.queryRenderedFeatures([touchX, touchY], { layers: ['mutation-point'] });

                if (features && features.length > 0) {
                  // Prevent default to avoid double-tap zoom
                  e.preventDefault();
                  lastTouchInteractionRef.current = touchEndTime;

                  // Clear hover popup immediately on touch
                  clearHoverPopup();

                  // Trigger the same handler as click for mobile
                  handleMutationPointInteraction({
                    features,
                    lngLat: map.unproject([touchX, touchY]),
                    point: new mapboxgl.Point(touchX, touchY),
                    originalEvent: e,
                  });
                }
              }
            }
            touchStartX = 0;
            touchStartY = 0;
            touchStartTime = 0;
          };

          // Also handle touchmove to clear shadow when dragging (only if bottom sheet is not open)
          const handleTouchMove = (e: TouchEvent) => {
            if (e.touches && e.touches.length > 0) {
              // If bottom sheet is open, keep the shadow and don't update it
              if (showMobileBottomSheetRef.current) {
                return;
              }

              const rect = canvas.getBoundingClientRect();
              const touchX = e.touches[0].clientX - rect.left;
              const touchY = e.touches[0].clientY - rect.top;

              // Clear hover shadow if moved away from point
              const features = map.queryRenderedFeatures([touchX, touchY], { layers: ['mutation-point'] });

              if (features && features.length === 0) {
                // Moved away from mutation point, clear shadow
                const emptyFeatureCollection: GeoJSON.FeatureCollection = {
                  type: 'FeatureCollection',
                  features: [],
                };
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(emptyFeatureCollection);

                if (onMapHover) {
                  onMapHover(null);
                }
              } else if (features && features.length > 0) {
                // Still over a mutation point, show shadow
                const feature = features[0];
                const hoveredFeatureData: GeoJSON.FeatureCollection = {
                  type: 'FeatureCollection',
                  features: [feature as GeoJSON.Feature],
                };
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
                (map.getSource('hovered-circle') as mapboxgl.GeoJSONSource).setData(hoveredFeatureData);

                if (onMapHover && feature.properties?.idparcelle) {
                  onMapHover(parseInt(feature.properties.idparcelle, 10));
                }
              }
            }
          };

          // Add touch event listeners to canvas
          canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
          canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
          canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

          // Store handlers on map for cleanup
          (map as any)._touchHandlers = {
            start: handleTouchStart,
            move: handleTouchMove,
            end: handleTouchEnd,
            canvas,
          };

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
                      // No quartier found, hide the option but don't change selection
                      setCurrentQuartier('');
                      setHasQuartier(false);
                      debugLog('No quartier found for current location');
                    }
                  } catch (err) {
                    debugLog('Error updating quartier data:', err);
                    setCurrentQuartier('');
                    setHasQuartier(false);
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

          // Add scale control (top right)
          const secondScaleContainer = document.createElement('div');
          secondScaleContainer.style.cssText = `
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

          const updateSecondScale = () => {
            const bounds = map.getBounds();
            const width = map.getContainer().offsetWidth;
            const zoom = map.getZoom();

            const metersPerPixel = (156543.03392 * Math.cos((bounds.getCenter().lat * Math.PI) / 180)) / Math.pow(2, zoom);
            const distance = (metersPerPixel * width) / 1000; // Convert to km

            // Fixed width for the scale bar (60px) - same as original
            const fixedWidth = 60;

            // Calculate the distance represented by the fixed width scale bar
            const scaleDistance = (distance * fixedWidth) / width;

            // Round to a nice number in meters only, max 1km
            let niceDistance: number;
            let unit: string;

            // Convert to meters
            const distanceInMeters = scaleDistance * 1000;

            if (distanceInMeters >= 1000) {
              // Max 1km, show as 1km
              niceDistance = 1;
              unit = 'km';
            } else if (distanceInMeters >= 100) {
              niceDistance = Math.round(distanceInMeters / 10) * 10;
              unit = 'm';
            } else if (distanceInMeters >= 10) {
              niceDistance = Math.round(distanceInMeters);
              unit = 'm';
            } else {
              niceDistance = Math.round(distanceInMeters * 10) / 10;
              unit = 'm';
            }

            // Use fixed width instead of calculating actual width
            const actualWidth = fixedWidth;

            // Clear and recreate the scale
            secondScaleContainer.innerHTML = '';

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

            const label = document.createElement('div');
            label.style.cssText = `
              padding-left: 10px;
            `;
            label.textContent = `${niceDistance} ${unit}`;

            secondScaleContainer.appendChild(scaleBar);
            secondScaleContainer.appendChild(label);
          };

          // Update on map events
          map.on('zoom', updateSecondScale);
          map.on('move', updateSecondScale);

          // Initial update
          updateSecondScale();

          // Add to map
          map.getContainer().appendChild(secondScaleContainer);
          debugLog('Second scale control added to map');
        } catch (err) {
          debugLog('Error during map setup:', err);
          setMapError(`Map setup error: ${err}`);
        }
      });
    } catch (err) {
      debugLog('Error creating map:', err);
      setMapError(`Map creation error: ${err}`);
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        const map = mapRef.current;

        // Remove touch event listeners if they exist
        if ((map as any)._touchHandlers) {
          const handlers = (map as any)._touchHandlers;
          if (handlers.canvas) {
            handlers.canvas.removeEventListener('touchstart', handlers.start);
            handlers.canvas.removeEventListener('touchmove', handlers.move);
            handlers.canvas.removeEventListener('touchend', handlers.end);
          }
          delete (map as any)._touchHandlers;
        }

        // Remove map instance
        map.remove();
        mapRef.current = null;
      }
    };
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
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getLayer('mutation-point')) {
      // Small delay to ensure map data is loaded
      setTimeout(() => {
        // Use queryRenderedFeatures to get only visible mutations in the current viewport
        const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
        debugLog('Visible mutations in zone:', features.length);
        const calculatedStats = calculateZoneStats(features);

        setZoneStats(calculatedStats);
      }, 500); // 500ms delay to ensure data is loaded
    }
  }, [statsScope, mapLoaded]); // Recalculate when scope changes or map loads

  // **NEW**: Recalculate zone stats when map moves (if zone scope is selected)
  const recalculateZoneStatsIfNeeded = useCallback(() => {
    if (statsScope === 'zone' && mapRef.current && mapRef.current.getLayer('mutation-point')) {
      setTimeout(() => {
        // Use queryRenderedFeatures to get only visible mutations in the current viewport
        const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
        debugLog('Recalculating zone stats, visible mutations:', features.length);
        const calculatedStats = calculateZoneStats(features);
        setZoneStats(calculatedStats);
      }, 300); // Longer delay to ensure data is fully loaded
    }
  }, [statsScope]);

  // **NEW**: Recalculate zone stats when data version changes (triggered by PropertyList)
  useEffect(() => {
    if (statsScope === 'zone' && dataVersion !== undefined && mapRef.current && mapRef.current.getLayer('mutation-point')) {
      // Small delay to ensure map rendering is complete
      setTimeout(() => {
        // Use queryRenderedFeatures to get only visible mutations in the current viewport
        const features = mapRef.current.queryRenderedFeatures(null, { layers: ['mutation-point'] });
        debugLog('Recalculating zone stats after data update, visible mutations:', features.length);
        const calculatedStats = calculateZoneStats(features);
        setZoneStats(calculatedStats);
      }, 300);
    }
  }, [dataVersion, statsScope]); // Trigger when dataVersion or statsScope changes

  // **NEW**: Automatically switch to commune if quartier is selected (quartier option is hidden)
  useEffect(() => {
    if (statsScope === 'quartier') {
      debugLog('Quartier option is hidden, switching to commune');
      setStatsScope('commune');
    }
  }, []); // Only run once on mount to reset any existing quartier selection

  // **NEW**: Handle statsScope change - reset stats to zeros for quartier, reload for commune
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
    } else if (statsScope === 'commune' && currentINSEE) {
      // When switching to commune, reload the statistics
      const fetchStatsByINSEE = async () => {
        try {
          setIsLoading(true);
          setError(null);
          debugLog('Reloading statistics for commune, INSEE code:', currentINSEE);

          const response = await axios.get(`${API_ENDPOINTS.mutations.statsByCity}`, {
            params: { codeInsee: currentINSEE },
          });

          debugLog('Statistics reloaded successfully:', response.data);
          setPropertyStats(response.data);
        } catch (err) {
          setError('Erreur chargement statistiques');
          setPropertyStats([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchStatsByINSEE();
    }
  }, [statsScope, currentINSEE]); // Trigger when statsScope or currentINSEE changes

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
    if (searchParams?.coordinates && !searchParams?.isCity) {
      // Only set selected address if it's NOT a city (i.e., it's a specific address)
      setSelectedAddress(searchParams.coordinates);
      debugLog('Selected address coordinates (showing red circle):', searchParams.coordinates);

      // Pan to the address
      if (mapRef.current) {
        const map = mapRef.current;

        map.flyTo({
          center: searchParams.coordinates,
          zoom: 16, // Zoom level for specific addresses
          duration: 2000,
        });

        // Force reload after animation completes with retry mechanism
        // Mobile devices need more retries as they're slower
        const isMobile = window.innerWidth < 768;
        const maxRetries = isMobile ? 15 : 5;

        setTimeout(() => {
          debugLog('FORCING data reload after address selection');

          const attemptLoad = (retries = maxRetries) => {
            if (map && map.isStyleLoaded()) {
              const bounds = map.getBounds();
              const b = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
              debugLog('New bounds:', b);
              loadMutationsData();
            } else if (retries > 0) {
              setTimeout(() => attemptLoad(retries - 1), 500);
            } else {
              // Last resort: try to load anyway after all retries
              debugLog('Forcing load after max retries');
              loadMutationsData();
            }
          };

          attemptLoad();
        }, 2300);
      }
    } else if (searchParams?.coordinates && searchParams?.isCity) {
      // For cities/communes, just pan the map without red circle
      setSelectedAddress(null);
      debugLog('Panning to city coordinates (no red circle):', searchParams.coordinates);

      // Pan to the city
      if (mapRef.current) {
        const map = mapRef.current;

        map.flyTo({
          center: searchParams.coordinates,
          zoom: 13, // Zoom level for cities
          duration: 2000,
        });

        // Force reload after animation completes with retry mechanism
        // Mobile devices need more retries as they're slower
        const isMobile = window.innerWidth < 768;
        const maxRetries = isMobile ? 15 : 5; // 15 retries for mobile (7.5 seconds), 5 for desktop (2.5 seconds)

        setTimeout(() => {
          debugLog('FORCING data reload after city selection');

          const attemptLoad = (retries = maxRetries) => {
            if (map && map.isStyleLoaded()) {
              const bounds = map.getBounds();
              const b = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()];
              debugLog('New bounds:', b);
              loadMutationsData();
            } else if (retries > 0) {
              setTimeout(() => attemptLoad(retries - 1), 500);
            } else {
              // Last resort: try to load anyway after all retries
              debugLog('Forcing load after max retries');
              loadMutationsData();
            }
          };

          attemptLoad();
        }, 2300);
      }
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

      {/* Map Attribution - Fixed at bottom right */}
      <div className="fixed bottom-2 right-2 z-40 bg-white bg-opacity-70 rounded px-0.5 py-0.5 text-[8px] shadow-sm sm:z-[9999]">
        <div className="mapboxgl-ctrl-attrib-inner" role="list">
          <a href="https://www.mapbox.com/about/maps/" target="_blank" title="Mapbox" aria-label="Mapbox" rel="noopener noreferrer">
            © Mapbox
          </a>{' '}
          <a
            href="https://www.openstreetmap.org/copyright/"
            target="_blank"
            title="OpenStreetMap"
            aria-label="OpenStreetMap"
            rel="noopener noreferrer"
          >
            © OpenStreetMap
          </a>
        </div>
      </div>
      {/* Map Controls - All buttons in a column with same size */}
      <style>{`
        @media (min-width: 640px) {
          .map-control-btn {
            width: 40px !important;
            height: 40px !important;
            min-width: 40px !important;
            min-height: 40px !important;
          }
          .map-control-icon-sm {
            width: 20px !important;
            height: 20px !important;
            min-width: 20px !important;
            min-height: 20px !important;
          }
          .map-control-icon-md {
            width: 24px !important;
            height: 24px !important;
            min-width: 24px !important;
            min-height: 24px !important;
          }
          .map-control-icon-lg {
            width: 36px !important;
            height: 36px !important;
            min-width: 36px !important;
            min-height: 36px !important;
          }
        }
      `}</style>
      <div
        className="absolute top-2 left-2 sm:top-4 sm:left-4 z-30 flex flex-col gap-1"
        style={{
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'manipulation',
        }}
      >
        {/* Stats Panel Toggle Button */}
        <button
          onClick={() => {
            if (!showStatsPanel) {
              setActivePropertyType(0);
            }
            toggleStatsPanel();
          }}
          className="bg-white text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200 map-control-btn"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          title="Statistics"
        >
          {showStatsPanel ? (
            <svg
              className="w-5 h-5 text-red-500 map-control-icon-md"
              style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
              viewBox="0 0 24 24"
            >
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <img
              src={statsIcon}
              alt="Statistics"
              className="map-control-icon-md"
              style={{ width: '20px', height: '20px', minWidth: '20px', minHeight: '20px' }}
            />
          )}
        </button>

        {/* Zoom In Button */}
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomIn();
            }
          }}
          className="bg-white text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200 map-control-btn"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          title="Zoom in"
        >
          <svg
            className="w-4 h-4 map-control-icon-sm"
            style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          className="bg-white text-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200 map-control-btn"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          title="Zoom out"
        >
          <svg
            className="w-4 h-4 map-control-icon-sm"
            style={{ width: '16px', height: '16px', minWidth: '16px', minHeight: '16px' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
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
          className="relative bg-white rounded-lg cursor-pointer flex items-center justify-center hover:bg-gray-50 shadow-md border border-gray-200 overflow-hidden map-control-btn"
          style={{
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
          }}
          title="Toggle map style"
        >
          <img
            className="rounded-md map-control-icon-lg"
            style={{ width: '28px', height: '28px', minWidth: '28px', minHeight: '28px' }}
            src={currentMapStyle === 'original' ? mapSatelliteIcon : mapStreetsIcon}
            alt={currentMapStyle === 'original' ? 'Satellite view' : 'Streets view'}
          />
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
                        value={
                          statsScope === 'commune'
                            ? currentCity
                            : statsScope === 'zone'
                              ? 'Zone affichée'
                              : hasQuartier
                                ? currentQuartier
                                : 'Quartier (non disponible)'
                        }
                        onChange={e => {
                          if (e.target.value === 'Zone affichée') {
                            setStatsScope('zone');
                          } else if (e.target.value === currentQuartier || e.target.value === 'Quartier (non disponible)') {
                            setStatsScope('quartier');
                          } else {
                            setStatsScope('commune');
                          }
                        }}
                        className="bg-white font-medium relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 text-left cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm py-2"
                      >
                        <option value={currentCity}>
                          {isCityArrondissement(currentCity) ? `Arrondissement (${currentCity})` : currentCity}
                        </option>
                        <option value="Zone affichée">Zone affichée</option>
                        {/* Quartier option temporarily hidden - not finished yet */}
                        {/* <option value={hasQuartier ? currentQuartier : 'Quartier (non disponible)'}>
                          {hasQuartier ? currentQuartier : 'Quartier (non disponible)'}
                        </option> */}
                      </select>
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
                      <svg key="maison-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M298.6 4c-6-5.3-15.1-5.3-21.2 0L5.4 244c-6.6 5.8-7.3 16-1.4 22.6s16 7.3 22.6 1.4L64 235V432c0 44.2 35.8 80 80 80H432c44.2 0 80-35.8 80-80V235l37.4 33c6.6 5.8 16.7 5.2 22.6-1.4s5.2-16.7-1.4-22.6L298.6 4zM96 432V206.7L288 37.3 480 206.7V432c0 26.5-21.5 48-48 48H368V320c0-17.7-14.3-32-32-32H240c-17.7 0-32 14.3-32 32V480H144c-26.5 0-48-21.5-48-48zm144 48V320h96V480H240z" />
                      </svg>,
                      // Appartement icon - same style
                      <svg key="appartement-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <g className="fa-duotone-group">
                          <path
                            className="fa-secondary"
                            fill="currentColor"
                            d="M0 48C0 21.5 21.5 0 48 0H336c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H240V432c0-26.5-21.5-48-48-48s-48 21.5-48 48v80H48c-26.5 0-48-21.5-48-48V48zM80 224c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H80zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zm112-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H272zM64 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zM176 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H176zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16z"
                          ></path>
                          <path
                            className="fa-primary"
                            fill="currentColor"
                            d="M80 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H80zm0 128c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H80zm96 0c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H176zm80 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V240c0-8.8-7.2-16-16-16H272c-8.8 0-16 7.2-16 16zM160 112v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H176c-8.8 0-16 7.2-16 16zM272 96c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V112c0-8.8-7.2-16-16-16H272z"
                          ></path>
                        </g>
                      </svg>,
                      // Local Commercial icon - same style
                      <svg key="local-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <g className="fa-duotone-group">
                          <path
                            className="fa-secondary"
                            fill="currentColor"
                            d="M64 192H96h32H320h64H512h32 32V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V224H384V384v80c0 26.5-21.5 48-48 48H112c-26.5 0-48-21.5-48-48V384 192zm256 32H128V384H320V224z"
                          ></path>
                          <path
                            className="fa-primary"
                            fill="currentColor"
                            d="M603.2 192H36.8C16.5 192 0 175.5 0 155.2c0-7.3 2.2-14.4 6.2-20.4L81.8 21.4C90.7 8 105.6 0 121.7 0H518.3c16.1 0 31 8 39.9 21.4l75.6 113.3c4 6.1 6.2 13.2 6.2 20.4c0 20.3-16.5 36.8-36.8 36.8z"
                          ></path>
                        </g>
                      </svg>,
                      // Terrain icon - same style
                      <svg key="terrain-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M235.3 4.7c-6.2-6.2-16.4-6.2-22.6 0L72 145.4c-5.1 5.1-8 12.1-8 19.3C64 179.8 76.2 192 91.3 192h17.9L38.7 274.3c-4.3 5-6.7 11.4-6.7 18C32 307.6 44.4 320 59.7 320H77.2L6.7 402.3c-4.3 5-6.7 11.4-6.7 18C0 435.6 12.4 448 27.7 448H160h48v48c0 8.8 7.2 16 16 16s16-7.2 16-16V448h48H420.3c15.3 0 27.7-12.4 27.7-27.7c0-6.6-2.4-13-6.7-18L370.8 320h17.5c15.3 0 27.7-12.4 27.7-27.7c0-6.6-2.4-13-6.7-18L338.8 192h17.9c15.1 0 27.3-12.2 27.3-27.3c0-7.2-2.9-14.2-8-19.3L235.3 4.7zM240 416V208c0-8.8-7.2-16-16-16s-16 7.2-16 16V416H160 37.1l87.1-101.6c4.1-4.7 5-11.4 2.4-17.1s-8.3-9.3-14.5-9.3H69.1l87.1-101.6c4.1-4.7 5-11.4 2.4-17.1s-8.3-9.3-14.5-9.3H102.6L224 38.6 345.4 160H304c-6.2 0-11.9 3.6-14.5 9.3s-1.7 12.4 2.4 17.1L378.9 288H336c-6.2 0-11.9 3.6-14.5 9.3s-1.7 12.4 2.4 17.1L410.9 416H288 240z" />
                      </svg>,
                      // Biens Multiples icon - same style
                      <svg key="biens-multiples-icon" className="text-white" fill="currentColor" viewBox="0 0 640 512">
                        <path d="M320 32H576c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H414.4c-2.4 11.8-7.4 22.7-14.4 32H576c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H320c-35.3 0-64 28.7-64 64V95.3l32 29.3V64c0-17.7 14.3-32 32-32zM496 208c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V240c0-17.7-14.3-32-32-32H496zm0 32h32v32H496V240zM464 368v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V368c0-17.7-14.3-32-32-32H496c-17.7 0-32 14.3-32 32zm64 0v32H496V368h32zM368 80c-17.7 0-32 14.3-32 32v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V112c0-17.7-14.3-32-32-32H368zm0 32h32v32H368V112zm96 0v32c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V112c0-17.7-14.3-32-32-32H496c-17.7 0-32 14.3-32 32zm64 0v32H496V112h32zM32 284.2c0-9 3.8-17.5 10.4-23.6l128-117.3c12.2-11.2 31-11.2 43.2 0l128 117.3c6.6 6.1 10.4 14.6 10.4 23.6V448c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V284.2zM0 448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V284.2c0-17.9-7.5-35.1-20.8-47.2l-128-117.3c-24.5-22.4-62-22.4-86.5 0L20.8 237C7.5 249.1 0 266.2 0 284.2V448zM224 288v64H160V288h64zm-64-32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V288c0-17.7-14.3-32-32-32H160z" />
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
                <div className="grid grid-cols-3 gap-1.5">
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
                      prixMoyen: match?.prixMoyenDec2024 || match?.prixMoyen || 0,
                      prixM2Moyen: match?.prixM2MoyenDec2024 || match?.prixM2Moyen || 0,
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
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                          <p
                            className="text-gray-600 text-center whitespace-nowrap mb-1 w-full"
                            style={{ fontSize: 'clamp(9px, 1.8vw, 11px)', lineHeight: '1.2' }}
                          >
                            Nombre de ventes
                          </p>
                          <p
                            className="font-semibold text-gray-900 text-center whitespace-nowrap w-full"
                            style={{ fontSize: 'clamp(11px, 2.4vw, 13px)', lineHeight: '1.2' }}
                          >
                            {formatNumber(currentStat.nombre)}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                          <p
                            className="text-gray-600 text-center whitespace-nowrap mb-1 w-full"
                            style={{ fontSize: 'clamp(9px, 1.8vw, 11px)', lineHeight: '1.2' }}
                          >
                            Prix moyen
                          </p>
                          <p
                            className="font-semibold text-gray-900 text-center whitespace-nowrap w-full"
                            style={{ fontSize: 'clamp(11px, 2.4vw, 13px)', lineHeight: '1.2' }}
                          >
                            {formatNumber(currentStat.prixMoyen)}€
                          </p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                          <p
                            className="text-gray-600 text-center whitespace-nowrap mb-1 w-full"
                            style={{ fontSize: 'clamp(9px, 1.8vw, 11px)', lineHeight: '1.2' }}
                          >
                            Prix moyen au m²
                          </p>
                          <p
                            className="font-semibold text-gray-900 text-center whitespace-nowrap w-full"
                            style={{ fontSize: 'clamp(11px, 2.4vw, 13px)', lineHeight: '1.2' }}
                          >
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
                    <option value="commune">
                      {isCityArrondissement(currentCity) ? `Arrondissement (${currentCity})` : `Commune (${currentCity})`}
                    </option>
                    <option value="zone">Zone affichée</option>
                    {/* Quartier option temporarily hidden - not finished yet */}
                    {/* <option value="quartier">
                      {hasQuartier ? `Quartier (${currentQuartier || 'Chargement...'})` : 'Quartier (non disponible)'}
                    </option> */}
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
                  prixMoyen: match?.prixMoyenDec2024 || match?.prixMoyen || 0,
                  prixM2Moyen: match?.prixM2MoyenDec2024 || match?.prixM2Moyen || 0,
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
                        <p className="text-xs text-gray-600 mb-1">Prix moyen</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-600 mb-1">Prix moyen au m²</p>
                        <p className="text-sm sm:text-base font-semibold text-gray-900">
                          {Math.round(normalizedStats[activePropertyType]?.prixM2Moyen || 0).toLocaleString('fr-FR')}€
                        </p>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
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
