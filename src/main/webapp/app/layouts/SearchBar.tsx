import React, { useState, useEffect, useRef } from 'react';
import FilterPopup from '../features/property/FilterPopup';
import { FilterState } from '../types/filters';
import { API_ENDPOINTS } from 'app/config/api.config';
import frenchCities from '../data/french-cities.json';

// Utility function to normalize accented characters
const normalizeAccents = (str: string): string => {
  return str
    .normalize('NFD') // Decompose accented characters into base + diacritic
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ç/g, 'c') // Handle 'ç' specifically
    .replace(/Ç/g, 'C'); // Handle 'Ç' specifically
};

// Utility function to expand French address abbreviations for scoring
const expandAbbreviationsForScoring = (str: string): string => {
  // Common French address abbreviations mapping (without accents for matching)
  const abbreviations: { [key: string]: string } = {
    RTE: 'ROUTE',
    RT: 'ROUTE',
    AV: 'AVENUE',
    AVE: 'AVENUE',
    AVEN: 'AVENUE',
    BD: 'BOULEVARD',
    BVD: 'BOULEVARD',
    BLVD: 'BOULEVARD',
    BOUL: 'BOULEVARD',
    R: 'RUE',
    RU: 'RUE',
    PL: 'PLACE',
    PLC: 'PLACE',
    PLE: 'PLACE',
    RES: 'RESIDENCE',
    RESID: 'RESIDENCE',
    ALL: 'ALLEE',
    AL: 'ALLEE',
    IMP: 'IMPASSE',
    CH: 'CHEMIN',
    CHEM: 'CHEMIN',
    CHE: 'CHEMIN',
    CRS: 'COURS',
    CR: 'COURS',
    SQ: 'SQUARE',
    PROM: 'PROMENADE',
    QU: 'QUAI',
    Q: 'QUAI',
    QUAI: 'QUAI',
    LOT: 'LOTISSEMENT',
    HAM: 'HAMEAU',
    PAS: 'PASSAGE',
    PASS: 'PASSAGE',
    GDE: 'GRANDE',
    GD: 'GRANDE',
    GRD: 'GRANDE',
    FG: 'FAUBOURG',
    MTE: 'MONTEE',
    NTE: 'MONTEE',
    ESP: 'ESPLANADE',
    DOM: 'DOMAINE',
    CITE: 'CITE',
    QUA: 'QUARTIER',
    CTRE: 'CENTRE',
    VTE: 'VOIE',
    VC: 'VOIE',
    ESC: 'ESCALIER',
    CLOS: 'CLOS',
    SEN: 'SENTE',
    ENC: 'ENCLAVE',
    ROC: 'ROCADE',
    PTR: 'POTERNE',
    PRT: 'PORT',
    GAL: 'GALERIE',
    ZI: 'ZONE',
    MAIS: 'MAISON',
    CD: 'CHEMIN',
    TRA: 'TRAVERSE',
    PARC: 'PARC',
    RAC: 'RACCORDEMENT',
    DSC: 'DESCENTE',
    RPE: 'RUELLE',
    RLE: 'RUELLE',
    HAB: 'HABITATION',
    CHV: 'CHEVAUCHANT',
    COUR: 'COUR',
    PTTE: 'PETITE',
    TSSE: 'TASSE',
    ZAC: 'ZONE',
    ZA: 'ZONE',
    VGE: 'VILLAGE',
    CC: 'CENTRE',
    VOIE: 'VOIE',
    GR: 'GRANDE',
    VIA: 'VIADUC',
    CAMP: 'CAMP',
  };

  // Split into tokens and expand each one
  return str
    .toUpperCase()
    .split(/\s+/)
    .map(token => {
      const cleanToken = token.replace(/[.,;]/g, ''); // Remove punctuation
      return abbreviations[cleanToken] || token;
    })
    .join(' ');
};

interface SearchBarProps {
  onSearch: (searchParams: {
    numero: number;
    nomVoie: string;
    fullAddress?: string; // Full address extracted from displayName
    hasMutations?: boolean;
    coordinates: [number, number];
    context?: Array<{ text: string }>;
    isCity?: boolean; // Flag to indicate if this is a city/commune (OSM) vs specific address
    isStreet?: boolean; // Street selection (no red point)
  }) => void;
  onFilterApply?: (filters: FilterState) => void;
  currentFilters?: FilterState;
  onFilterOpenChange?: (isOpen: boolean) => void;
  onCloseOtherPopups?: () => void; // New prop to close other popups when suggestions open
}

interface LocalAddressFeature {
  commune: string;
  codepostal: string;
  idadresse: number;
  hasMutations?: boolean;
  numero: string;
  nomVoie: string;
  longitude: number;
  typeVoie: string;
  latitude: number;
  adresseComplete: string;
}

// OpenStreetMap Nominatim result
interface OSMPlace {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
  addresstype?: string;
  name?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    postcode?: string;
    county?: string;
    state?: string;
  };
}

// Unified suggestion type
interface UnifiedSuggestion {
  id: string;
  displayName: string;
  subtitle: string;
  coordinates: [number, number]; // [longitude, latitude]
  type: 'address' | 'street' | 'city' | 'commune' | 'department';
  source: 'backend' | 'osm' | 'local';
  originalData: LocalAddressFeature | OSMPlace | LocalCity | { streetKey: string; hasMutations: boolean };
}

// Interface for local city data
interface LocalCity {
  name: string;
  postcode: string;
  department: string;
  lat: number;
  lon: number;
  type: 'city' | 'arrondissement' | 'department';
}

// FAST local search in French cities (NO API call!)
const searchLocalCities = (query: string): LocalCity[] => {
  const normalized = normalizeAccents(query).toLowerCase().trim();
  const normalizedWords = normalized.split(/\s+/).filter(w => w.length > 0);

  // Main city codes (the primary postcode for each city)
  const mainCityCodes: { [key: string]: string } = {
    paris: '75000',
    lyon: '69000',
    marseille: '13000',
  };

  // Department codes for main cities (the department that contains the city)
  const mainCityDepartments: { [key: string]: string } = {
    paris: '75000', // Paris is both city and department
    lyon: '69000', // Rhône department
    marseille: '13000', // Bouches-du-Rhône department
  };

  // Find ALL matching cities - SIMPLE matching
  const allMatches = (frenchCities as LocalCity[]).filter(city => {
    const cityName = normalizeAccents(city.name).toLowerCase();

    // Simple matching: starts with OR contains
    if (cityName.startsWith(normalized) || cityName.includes(normalized)) {
      return true;
    }

    // For multi-word queries, check if all words are present
    if (normalizedWords.length > 1) {
      return normalizedWords.every(word => cityName.includes(word));
    }

    return false;
  });

  // Separate arrondissements, departments, and regular cities
  const arrondissements: LocalCity[] = [];
  const departments: LocalCity[] = [];
  const regularCities: LocalCity[] = [];

  allMatches.forEach(city => {
    if (city.type === 'arrondissement') {
      arrondissements.push(city);
    } else if (city.type === 'department') {
      departments.push(city);
    } else {
      regularCities.push(city);
    }
  });

  // Sort arrondissements by postcode
  arrondissements.sort((a, b) => a.postcode.localeCompare(b.postcode));

  // CASE 1: Query is just a city name (e.g., "Paris")
  // Return: department (if found) + main city + ALL its arrondissements
  if (normalizedWords.length === 1 && !normalized.includes('arrondissement')) {
    const mainCityName = normalized;
    const mainCode = mainCityCodes[mainCityName];

    if (mainCode) {
      // Find the department FIRST (it should appear first in results)
      // First check in departments array (already filtered), then in all cities if not found
      const departmentCode = mainCityDepartments[mainCityName];
      let cityDepartment = departmentCode ? departments.find(city => city.postcode === departmentCode) : null;

      // If not found in departments, search in all cities
      if (!cityDepartment && departmentCode) {
        cityDepartment = (frenchCities as LocalCity[]).find(city => city.type === 'department' && city.postcode === departmentCode) || null;
      }

      // Find main city with primary postcode
      const mainCity = regularCities.find(
        city => normalizeAccents(city.name).toLowerCase() === mainCityName && city.postcode === mainCode && city.type === 'city', // Make sure it's a city, not a department
      );

      // Find ALL arrondissements for this city
      const cityPrefix = mainCode.substring(0, 2); // "75", "69", "13"
      const cityArrondissements = (frenchCities as LocalCity[])
        .filter(city => {
          if (city.type !== 'arrondissement') return false;
          const arrName = normalizeAccents(city.name).toLowerCase();
          return arrName.startsWith(mainCityName) && city.postcode.startsWith(cityPrefix);
        })
        .sort((a, b) => a.postcode.localeCompare(b.postcode));

      // Return: department (FIRST) + main city (if found) + ALL its arrondissements
      const result = [];
      if (cityDepartment) {
        result.push(cityDepartment);
      }
      if (mainCity) {
        result.push(mainCity);
      }
      result.push(...cityArrondissements);

      // If we have at least the department or city, return the result
      if (result.length > 0) {
        return result;
      }
    }
  }

  // CASE 2: Query matches an arrondissement (e.g., "Paris 14e Arrondissement")
  // Return: that arrondissement + main city
  if (arrondissements.length > 0) {
    // Find exact or best matching arrondissements
    const matchedArrondissements = arrondissements.filter(arr => {
      const arrName = normalizeAccents(arr.name).toLowerCase();
      // Exact match (highest priority)
      if (arrName === normalized) return true;
      // Contains the full query
      if (arrName.includes(normalized)) return true;
      // All words match
      if (normalizedWords.length > 1) {
        return normalizedWords.every(word => arrName.includes(word));
      }
      return false;
    });

    if (matchedArrondissements.length > 0) {
      // Find the main city for these arrondissements
      const firstArr = matchedArrondissements[0];
      const cityPrefix = firstArr.postcode.substring(0, 2);
      const mainCode = `${cityPrefix}000`;

      // Find main city by postcode from all cities
      const mainCity = (frenchCities as LocalCity[]).find(city => city.postcode === mainCode && city.type === 'city');

      // Return: main city (if found) + matched arrondissements
      if (mainCity) {
        return [mainCity, ...matchedArrondissements];
      }
      return matchedArrondissements;
    }
  }

  // CASE 3: If query matches a department, prioritize it
  if (departments.length > 0) {
    // Find exact or best matching departments
    const matchedDepartments = departments.filter(dept => {
      const deptName = normalizeAccents(dept.name).toLowerCase();
      // Exact match (highest priority)
      if (deptName === normalized) return true;
      // Contains the full query
      if (deptName.includes(normalized)) return true;
      // All words match
      if (normalizedWords.length > 1) {
        return normalizedWords.every(word => deptName.includes(word));
      }
      return false;
    });

    if (matchedDepartments.length > 0) {
      // Return departments first, then cities, then arrondissements
      return [...matchedDepartments, ...regularCities, ...arrondissements].slice(0, 30);
    }
  }

  // CASE 4: Default - return all matches (cities first, then departments, then arrondissements)
  // Limit to 30 results for performance
  const result = [...regularCities, ...departments, ...arrondissements];
  return result.slice(0, 30);
};

// Convert local city to unified suggestion
const convertLocalCityToUnified = (city: LocalCity): UnifiedSuggestion => ({
  id: `local-${city.name}-${city.postcode}`,
  displayName: city.name,
  subtitle: city.type === 'department' ? `Département • ${city.postcode}` : `${city.department} • ${city.postcode}`,
  coordinates: [city.lon, city.lat],
  type: city.type === 'department' ? 'department' : city.type === 'arrondissement' ? 'city' : 'city',
  source: 'local',
  originalData: city,
});

// Convert local city to OSMPlace format for compatibility (kept for backward compatibility)
const convertLocalCityToOSMPlace = (city: LocalCity): OSMPlace => ({
  place_id: Math.random() * 1000000, // Generate fake ID
  display_name: `${city.name}, ${city.department}, France`,
  lat: city.lat.toString(),
  lon: city.lon.toString(),
  type: city.type === 'arrondissement' ? 'administrative' : 'city',
  class: 'place',
  addresstype: city.type === 'arrondissement' ? 'suburb' : 'city',
  address: {
    city: city.name,
    postcode: city.postcode,
    county: city.department,
  },
});

// Convert backend address to unified suggestion
const convertBackendToUnified = (feature: LocalAddressFeature): UnifiedSuggestion => ({
  id: `backend-${feature.idadresse}`,
  displayName: feature.adresseComplete,
  subtitle: `${feature.commune} • ${feature.codepostal}`,
  coordinates: [feature.longitude, feature.latitude],
  type: 'address',
  source: 'backend',
  originalData: feature,
});

const buildStreetKey = (feature: LocalAddressFeature): string => {
  const type = (feature.typeVoie || '').trim();
  const voie = (feature.nomVoie || '').trim();
  const cp = (feature.codepostal || '').trim();
  const commune = (feature.commune || '').trim();
  return `${type} ${voie}`.trim() + `|${cp}|${commune}`; // stable key
};

const buildStreetDisplay = (feature: LocalAddressFeature): { displayName: string; subtitle: string } => {
  const type = (feature.typeVoie || '').trim();
  const voie = (feature.nomVoie || '').trim();
  const cp = (feature.codepostal || '').trim();
  const commune = (feature.commune || '').trim();
  const street = `${type} ${voie}`.trim();
  return {
    displayName: `${street} ${cp} ${commune}`.trim(),
    subtitle: `Rue • ${commune} • ${cp}`.trim(),
  };
};

// Convert OSM place to unified suggestion
const convertOSMToUnified = (place: OSMPlace): UnifiedSuggestion => {
  const cityName =
    place.address?.city ||
    place.address?.town ||
    place.address?.village ||
    place.address?.municipality ||
    place.name ||
    place.display_name.split(',')[0];

  const postcode = place.address?.postcode || '';
  const county = place.address?.county || '';

  let suggestionType: 'city' | 'commune' | 'department' = 'city';
  if (place.addresstype === 'village' || place.addresstype === 'municipality') {
    suggestionType = 'commune';
  } else if (place.addresstype === 'administrative' && place.type === 'administrative') {
    suggestionType = 'department';
  }

  return {
    id: `osm-${place.place_id}`,
    displayName: cityName,
    subtitle: postcode ? `${county} • ${postcode}` : county,
    coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
    type: suggestionType,
    source: 'osm',
    originalData: place,
  };
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterApply, currentFilters, onFilterOpenChange, onCloseOtherPopups }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<UnifiedSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSelectionMade, setIsSelectionMade] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Track touch events to distinguish scroll from tap
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Cache for address suggestions (frontend cache)
  // Key: normalized query string, Value: { data: UnifiedSuggestion[], timestamp: number }
  const suggestionsCacheRef = useRef<Map<string, { data: UnifiedSuggestion[]; timestamp: number }>>(new Map());
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes in milliseconds
  const MAX_CACHE_SIZE = 200; // Maximum number of cached entries

  // Notify parent when filter popup opens/closes
  useEffect(() => {
    onFilterOpenChange?.(isFilterOpen);
  }, [isFilterOpen, onFilterOpenChange]);

  // Default filter values: Type de bien & Nombre de pièces = nothing selected (means "all" for API)
  const defaultFilters = {
    propertyTypes: { maison: false, terrain: false, appartement: false, biensMultiples: false, localCommercial: false },
    roomCounts: { studio: false, deuxPieces: false, troisPieces: false, quatrePieces: false, cinqPiecesPlus: false },
    priceRange: [0, 25000000] as [number, number],
    surfaceRange: [0, 400] as [number, number],
    terrainRange: [0, 50000] as [number, number],
    pricePerSqmRange: [0, 40000] as [number, number],
    dateRange: [0, 139] as [number, number],
  };

  // Calculate active filter count (nothing selected = default = 0)
  const calculateActiveFilters = (): number => {
    if (!currentFilters) return 0;

    let count = 0;

    // Type de bien: +1 if at least one is selected (default = none selected)
    const propertyTypeKeys = Object.keys(currentFilters.propertyTypes) as (keyof typeof currentFilters.propertyTypes)[];
    const selectedPropertyTypes = propertyTypeKeys.filter(key => currentFilters.propertyTypes[key]).length;
    if (selectedPropertyTypes > 0) {
      count += 1;
    }

    // Nombre de pièces: +1 if at least one is selected (default = none selected)
    const roomCountKeys = Object.keys(currentFilters.roomCounts) as (keyof typeof currentFilters.roomCounts)[];
    const selectedRoomCounts = roomCountKeys.filter(key => currentFilters.roomCounts[key]).length;
    if (selectedRoomCounts > 0) {
      count += 1;
    }

    // Range bars: count each range separately if modified from default
    const rangeFilters: Array<{ key: keyof typeof defaultFilters; range: [number, number] }> = [
      { key: 'priceRange', range: currentFilters.priceRange },
      { key: 'surfaceRange', range: currentFilters.surfaceRange },
      { key: 'terrainRange', range: currentFilters.terrainRange },
      { key: 'pricePerSqmRange', range: currentFilters.pricePerSqmRange },
      { key: 'dateRange', range: currentFilters.dateRange },
    ];

    // Check each range individually and count if modified (use tolerance for floating point)
    rangeFilters.forEach(({ key, range }) => {
      const defaultRange = defaultFilters[key] as [number, number];
      const minChanged = Math.abs(range[0] - defaultRange[0]) > 0.01;
      const maxChanged = Math.abs(range[1] - defaultRange[1]) > 0.01;
      if (minChanged || maxChanged) {
        count += 1; // Count each modified range as a separate filter
      }
    });

    return count;
  };

  const activeFilterCount = calculateActiveFilters();

  // Reset all filters to initial/default values and close the filter popup
  const resetFilters = () => {
    if (onFilterApply) {
      onFilterApply(defaultFilters);
    }
    onFilterOpenChange?.(false);
  };

  // Build filter chips for display (selected types, rooms, and modified ranges)
  const filterChips = React.useMemo(() => {
    if (!currentFilters || !onFilterApply) return [];
    const chips: { id: string; label: string; onClear: () => void }[] = [];
    const fmtPrice = (n: number) => (n >= 1000000 ? `${n / 1000000}M` : n >= 1000 ? `${n / 1000}k` : String(n));

    Object.entries(currentFilters.propertyTypes).forEach(([key, selected]) => {
      if (!selected) return;
      const labels: Record<string, string> = {
        appartement: 'Appartement',
        maison: 'Maison',
        terrain: 'Terrain',
        biensMultiples: 'Bien multiple',
        localCommercial: 'Local commercial',
      };
      chips.push({
        id: `type-${key}`,
        label: labels[key] || key,
        onClear: () =>
          onFilterApply({
            ...currentFilters,
            propertyTypes: { ...currentFilters.propertyTypes, [key]: false },
          }),
      });
    });

    Object.entries(currentFilters.roomCounts).forEach(([key, selected]) => {
      if (!selected) return;
      const labels: Record<string, string> = {
        studio: 'Studio',
        deuxPieces: '2 pièces',
        troisPieces: '3 pièces',
        quatrePieces: '4 pièces',
        cinqPiecesPlus: '5+ pièces',
      };
      chips.push({
        id: `room-${key}`,
        label: labels[key] || key,
        onClear: () =>
          onFilterApply({
            ...currentFilters,
            roomCounts: { ...currentFilters.roomCounts, [key]: false },
          }),
      });
    });

    const [priceMin, priceMax] = currentFilters.priceRange;
    if (priceMin > 0 || priceMax < 25000000) {
      chips.push({
        id: 'price',
        label: `Prix ${fmtPrice(priceMin)}-${fmtPrice(priceMax)}`,
        onClear: () => onFilterApply({ ...currentFilters, priceRange: defaultFilters.priceRange }),
      });
    }
    const [surfMin, surfMax] = currentFilters.surfaceRange;
    if (surfMin > 0 || surfMax < 400) {
      chips.push({
        id: 'surface',
        label: `Surface ${surfMin}-${surfMax} m²`,
        onClear: () => onFilterApply({ ...currentFilters, surfaceRange: defaultFilters.surfaceRange }),
      });
    }
    const [terrMin, terrMax] = currentFilters.terrainRange;
    if (terrMin > 0 || terrMax < 50000) {
      chips.push({
        id: 'terrain',
        label: `Terrain ${terrMin}-${terrMax} m²`,
        onClear: () => onFilterApply({ ...currentFilters, terrainRange: defaultFilters.terrainRange }),
      });
    }
    const [ppmMin, ppmMax] = currentFilters.pricePerSqmRange;
    if (ppmMin > 0 || ppmMax < 40000) {
      chips.push({
        id: 'pricePerSqm',
        label: `Prix/m² ${fmtPrice(ppmMin)}-${fmtPrice(ppmMax)}`,
        onClear: () => onFilterApply({ ...currentFilters, pricePerSqmRange: defaultFilters.pricePerSqmRange }),
      });
    }
    const [dateMin, dateMax] = currentFilters.dateRange;
    if (dateMin > 0 || dateMax < 139) {
      chips.push({
        id: 'date',
        label: 'Période',
        onClear: () => onFilterApply({ ...currentFilters, dateRange: defaultFilters.dateRange }),
      });
    }
    return chips;
  }, [currentFilters, onFilterApply]);

  // Limit to max 3 chips visible + "Autres (N)" to avoid wrapping to new line
  const visibleChips = React.useMemo(() => {
    if (filterChips.length <= 3) {
      return filterChips;
    }
    return filterChips.slice(0, 3);
  }, [filterChips]);

  const hiddenChipsCount = filterChips.length > 3 ? filterChips.length - 3 : 0;

  // Debounce search input - Fetch from both backend and OSM
  useEffect(() => {
    // Create AbortController for this request
    const abortController = new AbortController();
    const signal = abortController.signal;

    // Create unique request ID to ignore stale responses
    const requestId = Date.now();
    const currentRequestIdRef = { current: requestId };

    const handler = setTimeout(async () => {
      if (searchQuery.length > 2 && !isSelectionMade) {
        try {
          setIsLoading(true);

          // Send the ORIGINAL query to backend - let backend handle abbreviations and accents
          // Only normalize accents for local city search
          const normalizedQueryForCities = normalizeAccents(searchQuery);

          // Detect if query looks like an address (has number at the start, e.g., "42 rue")
          // But allow numbers in city names (e.g., "Paris 14e Arrondissement")
          const looksLikeAddress = /^\d+\s+/.test(searchQuery); // Number at the start suggests an address

          // Check if query starts with a number (with or without space) - used to skip street suggestions
          const startsWithNumber = /^\d+/.test(searchQuery.trim());

          // 1. INSTANT local search first (for cities and arrondissements, not addresses!)
          // Allow local search even with numbers if it doesn't look like an address
          const localCities = looksLikeAddress ? [] : searchLocalCities(normalizedQueryForCities);
          const localSuggestions = localCities.map(convertLocalCityToUnified);

          // 2. Check cache first for complete results
          const cacheKey = searchQuery.trim().toLowerCase();
          const cachedResult = suggestionsCacheRef.current.get(cacheKey);
          const now = Date.now();

          let backendResponse: LocalAddressFeature[] = [];
          let backendSuggestions: UnifiedSuggestion[] = [];
          let useCachedResult = false;

          // Check if we have a valid cached result
          if (cachedResult && now - cachedResult.timestamp < CACHE_TTL) {
            // Use cached complete result
            const cachedSuggestions = cachedResult.data;
            useCachedResult = true;

            // Final check: only update if request wasn't aborted
            if (!signal.aborted) {
              setSuggestions(cachedSuggestions);
              setShowSuggestions(true);
              setIsLoading(false);
              // Close other popups when suggestions open
              onCloseOtherPopups?.();
              // Close stats popup if it exists
              if ((window as any).closeStatsPopup) {
                (window as any).closeStatsPopup();
              }
            }
            return; // Use cached result, skip API call
          }

          // No valid cache, fetch from backend
          backendResponse = await fetch(`${API_ENDPOINTS.adresses.suggestions}?q=${encodeURIComponent(searchQuery)}`, {
            signal,
          }).then(res => (res.ok ? res.json() : []));

          // Check if this request is still valid (not aborted, still the latest)
          if (signal.aborted) {
            return; // Request was cancelled, ignore results
          }

          // Convert backend response to unified suggestions
          backendSuggestions = backendResponse.map(convertBackendToUnified);

          // Build street (rue) suggestions by grouping addresses (deduplicated)
          // Don't create street suggestions if query starts with a number (user is searching for specific address)
          const streetGroups = new Map<
            string,
            { sample: LocalAddressFeature; count: number; sumLon: number; sumLat: number; hasMutations: boolean }
          >();

          // Only group into streets if query doesn't start with a number
          if (!startsWithNumber) {
            for (const f of backendResponse) {
              const key = buildStreetKey(f);
              const existing = streetGroups.get(key);
              if (!existing) {
                streetGroups.set(key, {
                  sample: f,
                  count: 1,
                  sumLon: f.longitude,
                  sumLat: f.latitude,
                  hasMutations: !!f.hasMutations,
                });
              } else {
                existing.count += 1;
                existing.sumLon += f.longitude;
                existing.sumLat += f.latitude;
                existing.hasMutations = existing.hasMutations || !!f.hasMutations;
              }
            }
          }

          const streetSuggestions: UnifiedSuggestion[] = Array.from(streetGroups.entries()).map(([key, g]) => {
            const { displayName, subtitle } = buildStreetDisplay(g.sample);
            const avgLon = g.sumLon / g.count;
            const avgLat = g.sumLat / g.count;
            return {
              id: `street-${key}`,
              displayName,
              subtitle,
              coordinates: [avgLon, avgLat],
              type: 'street',
              source: 'backend',
              originalData: { streetKey: key, hasMutations: g.hasMutations },
            };
          });

          // Check if this request is still valid (not aborted, still the latest)
          if (signal.aborted) {
            return; // Request was cancelled, ignore results
          }

          // 3. Use only LOCAL city search (no external OSM API calls needed)
          // Local suggestions are already in UnifiedSuggestion format
          const deduplicatedLocalSuggestions = localSuggestions.filter((suggestion, index, array) => {
            return (
              array.findIndex(
                s =>
                  s.displayName.toLowerCase() === suggestion.displayName.toLowerCase() &&
                  Math.abs(s.coordinates[0] - suggestion.coordinates[0]) < 0.001 &&
                  Math.abs(s.coordinates[1] - suggestion.coordinates[1]) < 0.001,
              ) === index
            );
          });

          // Separate cities, streets, and addresses for better organization
          const cities = deduplicatedLocalSuggestions;
          const streets = streetSuggestions;
          const addresses = backendSuggestions;

          // Score and sort cities
          const scoredCities = cities
            .map(suggestion => {
              // Normalize AND expand abbreviations for BOTH query and display
              // Step 1: Expand abbreviations (RTE → ROUTE)
              const queryExpanded = expandAbbreviationsForScoring(searchQuery);
              const displayExpanded = expandAbbreviationsForScoring(suggestion.displayName);
              // Step 2: Remove accents (Résidence → RESIDENCE)
              const queryNormalized = normalizeAccents(queryExpanded.toLowerCase().trim());
              const displayNormalized = normalizeAccents(displayExpanded.toLowerCase());
              let score = 10000; // Base score for cities (always prioritized)

              // Split query into tokens for multi-token matching
              const queryTokens = queryNormalized.split(/\s+/).filter(t => t.length > 0);
              const displayTokens = displayNormalized.split(/\s+/);

              // Check if ALL query tokens are present in display
              const allTokensPresent = queryTokens.every(qToken => displayTokens.some(dToken => dToken.includes(qToken)));

              if (!allTokensPresent) {
                return { suggestion, score: -1 }; // Filter out if not all tokens match
              }

              // Count exact token matches (higher is better)
              const exactMatches = queryTokens.filter(qToken => displayTokens.some(dToken => dToken === qToken)).length;
              score += exactMatches * 300;

              // Count start-matches (query token starts display token)
              const startMatches = queryTokens.filter(qToken => displayTokens.some(dToken => dToken.startsWith(qToken))).length;
              score += startMatches * 200;

              // Bonus scoring based on match quality
              if (displayNormalized.startsWith(queryNormalized)) {
                score += 1000; // Exact start match
              }

              // Penalty for extra words (favor shorter, more precise results)
              const extraTokens = displayTokens.length - queryTokens.length;
              if (extraTokens > 0) {
                score -= extraTokens * 30; // Smaller penalty for cities
              }

              // Bonus for short city names
              if (suggestion.displayName.length < 15) score += 100;

              return { suggestion, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.suggestion);

          // Score and sort addresses
          const scoredAddresses = addresses
            .map(suggestion => {
              // Normalize AND expand abbreviations for BOTH query and display
              // Step 1: Expand abbreviations (RTE → ROUTE)
              const queryExpanded = expandAbbreviationsForScoring(searchQuery);
              const displayExpanded = expandAbbreviationsForScoring(suggestion.displayName);
              // Step 2: Remove accents (Résidence → RESIDENCE)
              const queryNormalized = normalizeAccents(queryExpanded.toLowerCase().trim());
              const displayNormalized = normalizeAccents(displayExpanded.toLowerCase());
              let score = 5000; // Base score for addresses (lower than cities)

              // Split query into tokens for multi-token matching (like backend does)
              const queryTokens = queryNormalized.split(/\s+/).filter(t => t.length > 0);
              const displayTokens = displayNormalized.split(/\s+/);

              // Check if at least one token matches (more lenient for address search)
              const matchingTokens = queryTokens.filter(qToken => displayTokens.some(dToken => dToken.includes(qToken)));

              // Require at least 50% of tokens to match, or at least 1 token for short queries
              const minRequiredMatches = queryTokens.length <= 2 ? 1 : Math.ceil(queryTokens.length * 0.5);
              if (matchingTokens.length < minRequiredMatches) {
                return { suggestion, score: -1 }; // Filter out if not enough tokens match
              }

              // Count exact token matches (higher is better)
              const exactMatches = queryTokens.filter(qToken => displayTokens.some(dToken => dToken === qToken)).length;
              score += exactMatches * 300;

              // Count start-matches (query token starts display token)
              const startMatches = queryTokens.filter(qToken => displayTokens.some(dToken => dToken.startsWith(qToken))).length;
              score += startMatches * 200;

              // Bonus for matching more tokens
              score += matchingTokens.length * 100;

              // Bonus scoring based on match quality
              if (displayNormalized.startsWith(queryNormalized)) {
                score += 1000; // Exact start match
              }

              // Penalty for extra words (favor shorter, more precise results)
              const extraTokens = displayTokens.length - queryTokens.length;
              if (extraTokens > 0) {
                score -= extraTokens * 50; // Penalize each extra word
              }

              // Bonus for shorter addresses (more precise)
              if (displayTokens.length <= queryTokens.length + 2) {
                score += 200; // Close match in length
              }

              // When query doesn't start with a number, give bonus to addresses that match street name
              // (addresses like "1 STRADA..." when searching "Strada...")
              if (!looksLikeAddress) {
                const feature = suggestion.originalData as LocalAddressFeature;
                const streetName = (feature.nomVoie || '').toLowerCase();
                const queryWithoutNumber = queryNormalized.replace(/^\d+\s+/, '').trim();
                if (streetName.includes(queryWithoutNumber) || queryWithoutNumber.includes(streetName)) {
                  score += 500; // Bonus for addresses matching street name in street search
                }
              }

              return { suggestion, score };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.suggestion);

          // Determine order based on whether query starts with a number
          // If query starts with number: cities, addresses, streets
          // If query doesn't start with number: cities, streets, addresses (street search)
          let sortedSuggestions: UnifiedSuggestion[];
          if (looksLikeAddress) {
            // Query starts with number: prioritize specific addresses
            sortedSuggestions = [...scoredCities.slice(0, 5), ...scoredAddresses.slice(0, 15), ...streets.slice(0, 10)];
          } else {
            // Query doesn't start with number: prioritize street suggestions
            sortedSuggestions = [...scoredCities.slice(0, 5), ...streets.slice(0, 10), ...scoredAddresses.slice(0, 15)];
          }

          // Cache the final combined results
          // Store in cache (clean old entries if cache is too large)
          if (suggestionsCacheRef.current.size >= MAX_CACHE_SIZE) {
            // Remove oldest entries (simple FIFO - remove first entry)
            const firstKey = suggestionsCacheRef.current.keys().next().value;
            if (firstKey) {
              suggestionsCacheRef.current.delete(firstKey);
            }
          }

          // Cache the complete result (backend + OSM combined)
          suggestionsCacheRef.current.set(cacheKey, {
            data: sortedSuggestions,
            timestamp: now,
          });

          // Final check: only update if request wasn't aborted
          if (!signal.aborted) {
            setSuggestions(sortedSuggestions);
            setShowSuggestions(true);
            // Close other popups when suggestions open
            onCloseOtherPopups?.();
            // Close stats popup if it exists
            if ((window as any).closeStatsPopup) {
              (window as any).closeStatsPopup();
            }
          }
        } catch (error) {
          // Ignore errors from aborted requests
          if (error.name === 'AbortError') {
            return;
          }
          // Other errors: clear suggestions only if not aborted
          if (!signal.aborted) {
            setSuggestions([]);
          }
        } finally {
          // Only update loading state if not aborted
          if (!signal.aborted) {
            setIsLoading(false);
          }
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 100); // Reduced from 300ms - local search is instant!

    // Cleanup: abort ongoing requests when component unmounts or searchQuery changes
    return () => {
      clearTimeout(handler);
      abortController.abort(); // Cancel any ongoing fetch requests
    };
  }, [searchQuery, isSelectionMade, onCloseOtherPopups]);

  const handleSuggestionSelect = (suggestion: UnifiedSuggestion): void => {
    setSearchQuery(suggestion.displayName);
    setShowSuggestions(false); // Close suggestions
    setSuggestions([]); // Clear suggestions after selection
    setIsSelectionMade(true); // Mark that selection was made

    if (inputRef.current) {
      inputRef.current.blur(); // Blur input to prevent reopening
    }

    if (suggestion.source === 'backend' && suggestion.type === 'address') {
      // Handle backend address (with mutation data) - show red circle
      const feature = suggestion.originalData as LocalAddressFeature;
      const numero = parseInt(feature.numero, 10);
      const nomVoie = feature.nomVoie;

      // Keep the full adresse_complete string so it matches MV content on the map (and for popup)
      const fullAddress = suggestion.displayName.trim();

      onSearch({
        numero,
        nomVoie,
        fullAddress, // Add the full address
        hasMutations: feature.hasMutations ?? true,
        coordinates: suggestion.coordinates,
        context: [{ text: feature.commune }, { text: feature.codepostal }, { text: feature.typeVoie }],
        isCity: false, // This is a specific address, show red circle
      });
    } else if (suggestion.source === 'backend' && suggestion.type === 'street') {
      // Street selection: behave like city (pan/zoom, no red point)
      onSearch({
        numero: 0,
        nomVoie: suggestion.displayName,
        fullAddress: suggestion.displayName,
        hasMutations: (suggestion.originalData as any)?.hasMutations ?? false,
        coordinates: suggestion.coordinates,
        isCity: true,
        isStreet: true,
      });
    } else if (suggestion.source === 'local') {
      // Handle local city/arrondissement/department from french-cities.json
      const city = suggestion.originalData as LocalCity;
      const cityName = suggestion.displayName;
      const postcode = city.postcode;
      const isDepartment = city.type === 'department';

      // For departments, arrondissements, and cities, zoom to the area
      // PropertyMap will automatically load mutations/addresses when zoomed to this area
      onSearch({
        numero: 0,
        nomVoie: cityName,
        coordinates: suggestion.coordinates,
        context: [{ text: cityName }, { text: postcode }, { text: isDepartment ? 'Département' : city.department || '' }],
        isCity: true, // This triggers map zoom, mutations will load automatically
      });
    } else if (suggestion.source === 'osm') {
      // Handle OSM city/commune (no specific address) - just pan the map
      const place = suggestion.originalData as OSMPlace;
      const cityName = suggestion.displayName;

      onSearch({
        numero: 0, // No specific number for cities
        nomVoie: cityName,
        coordinates: suggestion.coordinates,
        context: [
          { text: cityName },
          { text: place.address?.postcode || '' },
          { text: suggestion.type }, // 'city', 'commune', or 'department'
        ],
        isCity: true, // This is a city/commune, don't show red circle
      });
    }
  };

  return (
    <>
      {/* Mobile-first design */}
      <div className="w-full">
        {/* Mobile Search Bar - Full width, clean design like ImmoData */}
        {/* z-index must be lower than Header (z-[100]) to prevent overlap on iOS Safari */}
        <div className="block md:hidden sticky top-0 z-[50] bg-white shadow-sm mobile-search-bar">
          <div className="px-4 py-3">
            <div className="flex items-center gap-2 min-w-0">
              {/* Search Input Container */}
              <div className="relative flex-1 min-w-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Entrez une adresse en France"
                  value={searchQuery}
                  onChange={e => {
                    const newValue = e.target.value;
                    setSearchQuery(newValue);
                    setIsSelectionMade(false); // Reset selection flag when typing
                    // Don't manually set showSuggestions - let useEffect handle it after fetch
                    if (newValue.length <= 2) {
                      setShowSuggestions(false);
                      setSuggestions([]);
                    }
                  }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      // When Enter is pressed, try to find a matching suggestion
                      const exactMatch = suggestions.find(suggestion => suggestion.displayName.toLowerCase() === searchQuery.toLowerCase());

                      if (exactMatch) {
                        handleSuggestionSelect(exactMatch);
                      } else {
                        // Try to find a partial match (contains the search query)
                        const partialMatch = suggestions.find(suggestion =>
                          suggestion.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
                        );

                        if (partialMatch) {
                          handleSuggestionSelect(partialMatch);
                        } else {
                          // If no match at all, trigger search with the typed query
                          // This will show the map with the search query but no specific coordinates
                          onSearch({
                            numero: null,
                            nomVoie: searchQuery.trim(),
                            coordinates: null,
                            isCity: true, // Treat as city search when no exact match
                          });
                          setShowSuggestions(false);
                          setIsSelectionMade(true);
                        }
                      }
                    }
                  }}
                  onFocus={() => {
                    if (searchQuery.length > 2 && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-0 rounded-xl text-base placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all"
                />

                {/* Loading indicator - Mobile */}
                {isLoading && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}

                {/* Mobile Suggestions Dropdown - Inside input container */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    className="absolute left-0 right-0 top-full z-[70] w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl max-h-80 overflow-y-auto"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={suggestion.id}
                        className="w-full px-5 py-4 text-left hover:bg-gray-50 border-b border-gray-50 last:border-b-0 transition-colors first:rounded-t-2xl last:rounded-b-2xl flex items-start gap-3"
                        onClick={e => {
                          e.preventDefault();
                          handleSuggestionSelect(suggestion);
                        }}
                        onMouseDown={e => {
                          // Prevent input blur before click registers
                          e.preventDefault();
                        }}
                        onTouchStart={e => {
                          const touch = e.touches[0];
                          touchStartRef.current = {
                            x: touch.clientX,
                            y: touch.clientY,
                            time: Date.now(),
                          };
                        }}
                        onTouchMove={e => {
                          // If user is scrolling, mark as moved
                          if (touchStartRef.current) {
                            const touch = e.touches[0];
                            const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                            const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                            // If moved more than 10px, consider it a scroll
                            if (deltaX > 10 || deltaY > 10) {
                              touchStartRef.current = null;
                            }
                          }
                        }}
                        onTouchEnd={e => {
                          // Only select if it was a tap (not a scroll)
                          if (touchStartRef.current) {
                            const touch = e.changedTouches[0];
                            const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                            const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                            const deltaTime = Date.now() - touchStartRef.current.time;

                            // Only select if movement was minimal (< 10px) and quick (< 300ms)
                            if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
                              e.preventDefault();
                              handleSuggestionSelect(suggestion);
                            }
                            touchStartRef.current = null;
                          }
                        }}
                        style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'pan-y', cursor: 'pointer' }}
                      >
                        {/* Icon based on type */}
                        <div className="flex-shrink-0 mt-1">
                          {suggestion.type === 'address' ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-blue-500"
                            >
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                          ) : suggestion.type === 'street' ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-indigo-600"
                            >
                              <path d="M4 19V5" />
                              <path d="M20 19V5" />
                              <path d="M9 5v14" />
                              <path d="M15 5v14" />
                              <path d="M9 12h6" />
                            </svg>
                          ) : suggestion.type === 'department' ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-purple-500"
                            >
                              <path d="M3 3h18v18H3z"></path>
                              <path d="M3 9h18"></path>
                              <path d="M9 3v18"></path>
                            </svg>
                          ) : suggestion.displayName.toLowerCase().includes('arrondissement') ||
                            (suggestion.source === 'local' && (suggestion.originalData as LocalCity)?.type === 'arrondissement') ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-orange-500"
                            >
                              <circle cx="12" cy="12" r="10"></circle>
                              <path d="M12 2v20M2 12h20"></path>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              className="text-green-500"
                            >
                              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                              <polyline points="9 22 9 12 15 12 15 22"></polyline>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-gray-900 mb-1 truncate">{suggestion.displayName}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="truncate">{suggestion.subtitle}</span>
                            {(suggestion.source === 'osm' || suggestion.source === 'local') && (
                              <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {suggestion.type === 'department'
                                  ? 'Département'
                                  : suggestion.displayName.toLowerCase().includes('arrondissement') ||
                                      (suggestion.source === 'local' && (suggestion.originalData as LocalCity)?.type === 'arrondissement')
                                    ? 'Arrondissement'
                                    : suggestion.type === 'commune'
                                      ? 'Commune'
                                      : 'Ville'}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* No results message - Mobile */}
                {showSuggestions && searchQuery.length > 2 && suggestions.length === 0 && !isLoading && !isSelectionMade && (
                  <div
                    className="absolute left-0 right-0 top-full z-[70] w-full mt-2 bg-white border border-gray-200 rounded-2xl shadow-2xl"
                    style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}
                  >
                    <div className="px-5 py-4 text-base text-gray-500 text-center">Aucune adresse trouvée</div>
                  </div>
                )}
              </div>

              {/* Mobile Filter Button - Like ImmoData */}
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-xl text-white hover:bg-opacity-90 transition-colors duration-200"
                style={{ backgroundColor: '#7069F9' }}
                onClick={() => setIsFilterOpen(true)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M3.26172 17.2446C3.26172 16.8304 3.59751 16.4946 4.01172 16.4946H10.4842C10.8985 16.4946 11.2342 16.8304 11.2342 17.2446C11.2342 17.6588 10.8985 17.9946 10.4842 17.9946H4.01172C3.59751 17.9946 3.26172 17.6588 3.26172 17.2446Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M14.6122 14.5885C15.2599 13.9409 16.2067 13.7737 17.2687 13.7737C18.3306 13.7737 19.2774 13.9409 19.9252 14.5885C20.573 15.2361 20.7405 16.183 20.7405 17.2455C20.7405 18.308 20.573 19.2548 19.9252 19.9024C19.2774 20.55 18.3306 20.7173 17.2687 20.7173C16.2067 20.7173 15.2599 20.55 14.6122 19.9024C13.9644 19.2548 13.7969 18.308 13.7969 17.2455C13.7969 16.183 13.9644 15.2361 14.6122 14.5885ZM15.6727 15.6493C15.4698 15.8521 15.2969 16.2662 15.2969 17.2455C15.2969 18.2248 15.4698 18.6388 15.6727 18.8416C15.8756 19.0445 16.2897 19.2173 17.2687 19.2173C18.2476 19.2173 18.6617 19.0445 18.8646 18.8416C19.0675 18.6388 19.2405 18.2248 19.2405 17.2455C19.2405 16.2662 19.0675 15.8521 18.8646 15.6493C18.6617 15.4465 18.2476 15.2737 17.2687 15.2737C16.2897 15.2737 15.8756 15.4465 15.6727 15.6493Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12.7676 6.75594C12.7676 6.34172 13.1034 6.00594 13.5176 6.00594H19.9892C20.4034 6.00594 20.7392 6.34172 20.7392 6.75594C20.7392 7.17015 20.4034 7.50594 19.9892 7.50594H13.5176C13.1034 7.50594 12.7676 7.17015 12.7676 6.75594Z"
                    fill="white"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.07713 4.09797C4.72495 3.45031 5.67188 3.28281 6.7344 3.28281C7.79655 3.28281 8.74326 3.45034 9.39096 4.09804C10.0387 4.74574 10.2062 5.69245 10.2062 6.7546C10.2062 7.81709 10.0387 8.76392 9.39089 9.41156C8.74313 10.0592 7.79635 10.2264 6.7344 10.2264C5.67208 10.2264 4.72509 10.0592 4.0772 9.41163C3.42921 8.76398 3.26172 7.81708 3.26172 6.7546C3.26172 5.69245 3.42924 4.74568 4.07713 4.09797ZM5.13765 5.15877C4.93464 5.36172 4.76172 5.77584 4.76172 6.7546C4.76172 7.7339 4.93468 8.1479 5.13758 8.35069C5.34059 8.55359 5.75494 8.72639 6.7344 8.72639C7.71335 8.72639 8.12747 8.55362 8.33037 8.35076C8.53324 8.14795 8.70619 7.73389 8.70619 6.7546C8.70619 5.77585 8.53328 5.36167 8.3303 5.1587C8.12733 4.95572 7.71315 4.78281 6.7344 4.78281C5.75514 4.78281 5.34072 4.95575 5.13765 5.15877Z"
                    fill="white"
                  />
                </svg>

                {/* Active Filter Counter Badge - Mobile: tap number to reset all filters */}
                {activeFilterCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md cursor-pointer active:bg-red-600 touch-manipulation"
                    title="Réinitialiser les filtres"
                    onClick={e => {
                      e.stopPropagation();
                      resetFilters();
                    }}
                    role="button"
                    aria-label="Réinitialiser les filtres"
                  >
                    <span className="text-xs">{activeFilterCount}</span>
                  </span>
                )}
              </button>
            </div>

            {/* Mobile filter chips - separate row below search bar, single line with scroll */}
            {(visibleChips.length > 0 || hiddenChipsCount > 0) && (
              <div className="flex items-center gap-2 flex-nowrap overflow-x-auto overflow-y-hidden px-1 mt-3 pb-1"
                style={{ WebkitOverflowScrolling: 'touch' }}>
                {visibleChips.map(chip => (
                  <span
                    key={chip.id}
                    className="inline-flex items-center gap-1 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                  >
                    <span className="whitespace-nowrap">{chip.label}</span>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        chip.onClear();
                      }}
                      className="flex-shrink-0 w-4 h-4 rounded-full hover:bg-indigo-200 active:bg-indigo-300 flex items-center justify-center text-indigo-600 touch-manipulation text-sm leading-none"
                      aria-label={`Retirer ${chip.label}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
                {hiddenChipsCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(true)}
                    className="inline-flex items-center gap-1 flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800 border border-indigo-100 active:bg-indigo-100 transition-colors touch-manipulation"
                  >
                    <span className="whitespace-nowrap">Autres ({hiddenChipsCount})</span>
                  </button>
                )}
              </div>
            )}

            {/* Filter Popup for Mobile */}
            {isFilterOpen && (
              <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={filters => {
                  setIsFilterOpen(false);
                  onFilterApply?.(filters);
                }}
                currentFilters={currentFilters}
              />
            )}
          </div>
        </div>

        {/* Desktop Search Bar - Keep existing design for larger screens */}
        {/* z-index must be lower than Header (z-[100]) to prevent overlap on iOS Safari */}
        <div className="hidden md:block px-4 pt-4 pb-3 sticky top-0 z-[50] bg-white shadow-sm overflow-visible">
          <div className="flex flex-nowrap items-center justify-start gap-3 w-full px-4 overflow-visible min-w-0">
            {/* Search Input - responsive width, can shrink to keep one line */}
            <div className="relative flex-1 min-w-[200px] max-w-lg lg:max-w-xl shrink">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <input
                ref={inputRef}
                type="text"
                placeholder="Entrez une adresse en France"
                value={searchQuery}
                onChange={e => {
                  const newValue = e.target.value;
                  setSearchQuery(newValue);
                  setIsSelectionMade(false); // Reset selection flag when typing
                  // Don't manually set showSuggestions - let useEffect handle it after fetch
                  if (newValue.length <= 2) {
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    // When Enter is pressed, try to find a matching suggestion
                    const exactMatch = suggestions.find(suggestion => suggestion.displayName.toLowerCase() === searchQuery.toLowerCase());

                    if (exactMatch) {
                      handleSuggestionSelect(exactMatch);
                    } else {
                      // Try to find a partial match (contains the search query)
                      const partialMatch = suggestions.find(suggestion =>
                        suggestion.displayName.toLowerCase().includes(searchQuery.toLowerCase()),
                      );

                      if (partialMatch) {
                        handleSuggestionSelect(partialMatch);
                      } else {
                        // If no match at all, trigger search with the typed query
                        // This will show the map with the search query but no specific coordinates
                        onSearch({
                          numero: null,
                          nomVoie: searchQuery.trim(),
                          coordinates: null,
                          isCity: true, // Treat as city search when no exact match
                        });
                        setShowSuggestions(false);
                        setIsSelectionMade(true);
                      }
                    }
                  }
                }}
                onFocus={() => {
                  if (searchQuery.length > 2 && suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />

              {/* Loading indicator */}
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                </div>
              )}

              {/* Desktop Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={suggestion.id}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0 transition-colors flex items-start gap-3"
                      onClick={e => {
                        e.preventDefault();
                        handleSuggestionSelect(suggestion);
                      }}
                      onMouseDown={e => {
                        // Prevent input blur before click registers
                        e.preventDefault();
                      }}
                      onTouchStart={e => {
                        const touch = e.touches[0];
                        touchStartRef.current = {
                          x: touch.clientX,
                          y: touch.clientY,
                          time: Date.now(),
                        };
                      }}
                      onTouchMove={e => {
                        // If user is scrolling, mark as moved
                        if (touchStartRef.current) {
                          const touch = e.touches[0];
                          const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                          const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                          // If moved more than 10px, consider it a scroll
                          if (deltaX > 10 || deltaY > 10) {
                            touchStartRef.current = null;
                          }
                        }
                      }}
                      onTouchEnd={e => {
                        // Only select if it was a tap (not a scroll)
                        if (touchStartRef.current) {
                          const touch = e.changedTouches[0];
                          const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
                          const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);
                          const deltaTime = Date.now() - touchStartRef.current.time;

                          // Only select if movement was minimal (< 10px) and quick (< 300ms)
                          if (deltaX < 10 && deltaY < 10 && deltaTime < 300) {
                            e.preventDefault();
                            handleSuggestionSelect(suggestion);
                          }
                          touchStartRef.current = null;
                        }
                      }}
                      style={{ WebkitTapHighlightColor: 'transparent', touchAction: 'pan-y', cursor: 'pointer' }}
                    >
                      {/* Icon based on type */}
                      <div className="flex-shrink-0 mt-0.5">
                        {suggestion.type === 'address' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-500"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        ) : suggestion.type === 'street' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-indigo-600"
                          >
                            <path d="M4 19V5" />
                            <path d="M20 19V5" />
                            <path d="M9 5v14" />
                            <path d="M15 5v14" />
                            <path d="M9 12h6" />
                          </svg>
                        ) : suggestion.type === 'department' ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-purple-500"
                          >
                            <path d="M3 3h18v18H3z"></path>
                            <path d="M3 9h18"></path>
                            <path d="M9 3v18"></path>
                          </svg>
                        ) : suggestion.displayName.toLowerCase().includes('arrondissement') ||
                          (suggestion.source === 'local' && (suggestion.originalData as LocalCity)?.type === 'arrondissement') ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-orange-500"
                          >
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 2v20M2 12h20"></path>
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-green-500"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">{suggestion.displayName}</div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                          <span className="truncate">{suggestion.subtitle}</span>
                          {(suggestion.source === 'osm' || suggestion.source === 'local') && (
                            <span className="flex-shrink-0 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              {suggestion.type === 'department'
                                ? 'Département'
                                : suggestion.displayName.toLowerCase().includes('arrondissement') ||
                                    (suggestion.source === 'local' && (suggestion.originalData as LocalCity)?.type === 'arrondissement')
                                  ? 'Arrondissement'
                                  : suggestion.type === 'commune'
                                    ? 'Commune'
                                    : 'Ville'}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* No results message */}
              {showSuggestions && searchQuery.length > 2 && suggestions.length === 0 && !isLoading && !isSelectionMade && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucune adresse trouvée</div>
                </div>
              )}
            </div>

            {/* Filter Button - Only on desktop (wrapper so badge circle is not clipped) */}
            <div className="relative flex-shrink-0 overflow-visible">
              <button
                className="flex items-center justify-center gap-2 px-4 lg:px-6 py-3 rounded-lg text-white hover:bg-opacity-90 transition-colors duration-200 font-medium relative"
                style={{ backgroundColor: '#7069F9' }}
                onClick={() => setIsFilterOpen(true)}
              >
                {/* Filter icon */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.26172 17.2446C3.26172 16.8304 3.59751 16.4946 4.01172 16.4946H10.4842C10.8985 16.4946 11.2342 16.8304 11.2342 17.2446C11.2342 17.6588 10.8985 17.9946 10.4842 17.9946H4.01172C3.59751 17.9946 3.26172 17.6588 3.26172 17.2446Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.6122 14.5885C15.2599 13.9409 16.2067 13.7737 17.2687 13.7737C18.3306 13.7737 19.2774 13.9409 19.9252 14.5885C20.573 15.2361 20.7405 16.183 20.7405 17.2455C20.7405 18.308 20.573 19.2548 19.9252 19.9024C19.2774 20.55 18.3306 20.7173 17.2687 20.7173C16.2067 20.7173 15.2599 20.55 14.6122 19.9024C13.9644 19.2548 13.7969 18.308 13.7969 17.2455C13.7969 16.183 13.9644 15.2361 14.6122 14.5885ZM15.6727 15.6493C15.4698 15.8521 15.2969 16.2662 15.2969 17.2455C15.2969 18.2248 15.4698 18.6388 15.6727 18.8416C15.8756 19.0445 16.2897 19.2173 17.2687 19.2173C18.2476 19.2173 18.6617 19.0445 18.8646 18.8416C19.0675 18.6388 19.2405 18.2248 19.2405 17.2455C19.2405 16.2662 19.0675 15.8521 18.8646 15.6493C18.6617 15.4465 18.2476 15.2737 17.2687 15.2737C16.2897 15.2737 15.8756 15.4465 15.6727 15.6493Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7676 6.75594C12.7676 6.34172 13.1034 6.00594 13.5176 6.00594H19.9892C20.4034 6.00594 20.7392 6.34172 20.7392 6.75594C20.7392 7.17015 20.4034 7.50594 19.9892 7.50594H13.5176C13.1034 7.50594 12.7676 7.17015 12.7676 6.75594Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.07713 4.09797C4.72495 3.45031 5.67188 3.28281 6.7344 3.28281C7.79655 3.28281 8.74326 3.45034 9.39096 4.09804C10.0387 4.74574 10.2062 5.69245 10.2062 6.7546C10.2062 7.81709 10.0387 8.76392 9.39089 9.41156C8.74313 10.0592 7.79635 10.2264 6.7344 10.2264C5.67208 10.2264 4.72509 10.0592 4.0772 9.41163C3.42921 8.76398 3.26172 7.81708 3.26172 6.7546C3.26172 5.69245 3.42924 4.74568 4.07713 4.09797ZM5.13765 5.15877C4.93464 5.36172 4.76172 5.77584 4.76172 6.7546C4.76172 7.7339 4.93468 8.1479 5.13758 8.35069C5.34059 8.55359 5.75494 8.72639 6.7344 8.72639C7.71335 8.72639 8.12747 8.55362 8.33037 8.35076C8.53324 8.14795 8.70619 7.73389 8.70619 6.7546C8.70619 5.77585 8.53328 5.36167 8.3303 5.1587C8.12733 4.95572 7.71315 4.78281 6.7344 4.78281C5.75514 4.78281 5.34072 4.95575 5.13765 5.15877Z"
                  fill="white"
                />
              </svg>
              <span>Filtres{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}</span>

              {/* Active Filter Counter Badge - click to reset all */}
              {activeFilterCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-md cursor-pointer hover:bg-red-600 transition-colors duration-200 group"
                  onClick={e => {
                    e.stopPropagation();
                    resetFilters();
                  }}
                  title="Réinitialiser les filtres"
                >
                  <span className="group-hover:hidden">{activeFilterCount}</span>
                  <span className="hidden group-hover:block text-lg">×</span>
                </span>
              )}
            </button>
            </div>

            {/* Filter chips - max 3 visible + "Autres" - all on same line */}
            <div className="flex flex-nowrap items-center gap-2 flex-shrink-0 min-w-0">
              {visibleChips.map(chip => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1.5 flex-shrink-0 px-2.5 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium bg-indigo-50 text-indigo-800 border border-indigo-100"
                >
                  <span className="whitespace-nowrap">{chip.label}</span>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      chip.onClear();
                    }}
                    className="flex-shrink-0 w-5 h-5 rounded-full hover:bg-indigo-200 flex items-center justify-center text-indigo-600"
                    aria-label={`Retirer ${chip.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
              {hiddenChipsCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  className="inline-flex items-center gap-1.5 flex-shrink-0 px-2.5 lg:px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium bg-indigo-50 text-indigo-800 border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <span className="whitespace-nowrap">Autres ({hiddenChipsCount})</span>
                </button>
              )}
            </div>

            {isFilterOpen && (
              <FilterPopup
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={filters => {
                  setIsFilterOpen(false);
                  onFilterApply?.(filters);
                }}
                currentFilters={currentFilters}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchBar;
