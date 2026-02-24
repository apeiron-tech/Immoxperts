import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, Heart, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from 'app/config/api.config';
import {
  ASSOCIATION_LOGOS,
  extractAllAttributes,
  extractFurnishing,
  getAssociationFromSource,
  getAssociationUrlFromSource,
} from './propertySearchUtils';

import { RecherchLouerFilterBar } from './RecherchLouerFilterBar';
import { RecherchLouerFiltersModal } from './RecherchLouerFiltersModal';
import { PropertySearchCard } from './PropertySearchCard';

interface Property {
  id: number;
  price: string;
  type: string;
  description: string;
  surface: string;
  rooms: string;
  chambres: string;
  bathrooms: string;
  kitchen: string;
  balcony: string;
  address: string;
  tags: string[];
  Association: string[];
  Association_url: string[];
  images: string[];
  dynamicAttributes?: { [key: string]: string };
}

interface ApiProperty {
  id: number;
  source: string;
  searchPostalCode: string;
  department: string;
  departmentName: string;
  commune: string;
  codeDepartment: string;
  propertyType: string;
  priceText: string;
  price: number;
  address: string | null;
  details: string;
  description: string | null;
  propertyUrl: string | null;
  images: string[];
}

interface SearchParams {
  location: string;
  value: string;
  type: string;
  maxBudget?: string;
  propertyType: string;
}

interface LocationState {
  searchResults: ApiProperty[];
  searchParams: SearchParams;
  totalPages?: number;
  totalElements?: number;
}

interface LocationSuggestion {
  value: string;
  adresse: string;
  type: 'commune' | 'postal_code' | 'search_postal_code' | 'department' | 'adresse';
  count: number;
}

interface ImageGalleryProps {
  images: string[];
  tags: string[];
}

const PAGE_SIZE = 30;

type SearchMode = 'louer' | 'achat';

interface PropertySearchProps {
  mode?: SearchMode;
}

const PropertySearch: React.FC<PropertySearchProps> = ({ mode = 'louer' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const searchParams = locationState?.searchParams;
  const preloadedResults = locationState?.searchResults || [];
  const initialTotalPages = locationState?.totalPages ?? 0;
  const initialTotalElements = locationState?.totalElements ?? 0;

  const associationDisplayNames: Record<string, string> = {
    bienici: 'BienIci',
    century21: 'Century 21',
    figaroimmo: 'Figaro Immobilier',
    guyhoquet: 'Guy Hoquet',
    iad: 'IAD',
    leboncoin: 'Leboncoin',
    orpi: 'Orpi',
    paruvendu: 'Paruvendu',
    safti: 'SAFTI',
    seloger: 'SeLoger',
    avendrealouer: 'AvendreA Louer',
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);
  const MAX_PRICE = mode === 'achat' ? 2000000 : 5000;

  const [filters, setFilters] = useState({
    chambres: [] as number[],
    exterieur: [] as string[],
    typeVente: 'tous' as string,
    prixMin: 0,
    prixMax: MAX_PRICE,
    surfaceMin: 0,
    surfaceMax: 500,
    etage: [] as string[],
  });
  const [apiProperties, setApiProperties] = useState<ApiProperty[]>(preloadedResults);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [totalElements, setTotalElements] = useState<number>(initialTotalElements);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Address input in bar (like Achat): suggestions dropdown, no redirect
  const [showLocationDropdown, setShowLocationDropdown] = useState<boolean>(false);
  const [locationEditQuery, setLocationEditQuery] = useState<string>('');
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([]);
  const [locationSuggestionsLoading, setLocationSuggestionsLoading] = useState<boolean>(false);
  const locationInputContainerRef = useRef<HTMLDivElement>(null);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const convertApiPropertyToProperty = (apiProp: ApiProperty): Property => {
    const details = apiProp.details || '';
    const description = apiProp.description || '';

    // Extract structured attributes from details only (not description prose)
    // to avoid false positives (e.g. "cuisine" mentioned in description text)
    const attributes = extractAllAttributes(details);

    return {
      id: apiProp.id,
      price: apiProp.priceText,
      type: apiProp.propertyType,
      description: '', // Remove description to avoid duplication with attributes
      surface: attributes['Surface'] || 'N/A',
      rooms: attributes['Pièces'] || 'N/A',
      chambres: attributes['Chambres'] || 'N/A',
      bathrooms: attributes['Salles de bain'] || 'N/A',
      kitchen: attributes['Cuisine'] || 'N/A',
      balcony: attributes['Balcon/Terrasse'] || 'N/A',
      // Add dynamic attributes as a new property
      dynamicAttributes: attributes,
      address: apiProp.address || `${apiProp.commune}, ${apiProp.department}`,
      tags: [extractFurnishing(`${details} ${description}`), mode === 'achat' ? 'À vendre' : 'À louer'].filter(tag => tag !== 'N/A'),
      Association: [getAssociationFromSource(apiProp.source)],
      Association_url: [apiProp.propertyUrl?.trim() || getAssociationUrlFromSource(apiProp.source)], // Link to property listing (property_url)
      images: apiProp.images && apiProp.images.length > 0 ? apiProp.images : ['/content/assets/logo.png'], // Images are now array
    };
  };

  // Initialize with preloaded results and pagination state
  useEffect(() => {
    if (preloadedResults.length > 0) {
      setApiProperties(preloadedResults);
      setTotalPages(initialTotalPages);
      setTotalElements(initialTotalElements);
      setCurrentPage(0);
    }
  }, [preloadedResults, initialTotalPages, initialTotalElements]);

  // Parse budget string from form or display (e.g. "200 000 €" or "200000") to number
  const parseBudgetFromParam = (s: string | undefined): number | null => {
    if (!s || !s.trim()) return null;
    const digits = s.replace(/\s/g, '').replace(/[€\s]/g, '').replace(',', '.').match(/\d+/g);
    if (!digits || digits.length === 0) return null;
    const n = parseInt(digits.join(''), 10);
    return Number.isNaN(n) ? null : n;
  };

  // Sync initial budget from search form into filters (so API uses it on first pagination)
  useEffect(() => {
    if (!searchParams?.maxBudget) return;
    const budget = parseBudgetFromParam(searchParams.maxBudget);
    if (budget != null && budget > 0)
      setFilters(f => (f.prixMax === MAX_PRICE ? { ...f, prixMax: Math.min(budget, MAX_PRICE) } : f));
  }, [searchParams?.maxBudget, MAX_PRICE]);

  // Fetch location suggestions (DVF + OSM fallback) for inline editor
  const fetchLocationSuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.length < 1) return [];
    try {
      const endpoint = mode === 'achat' ? API_ENDPOINTS.achat.suggestions : API_ENDPOINTS.louer.suggestions;
      const response = await fetch(`${endpoint}?q=${encodeURIComponent(query)}&limit=10`);
      if (response.ok) {
        const data: LocationSuggestion[] = await response.json();
        if (data?.length > 0) return data;
      }
    } catch {
      // fallback to OSM
    }
    try {
      const osmResponse = await fetch(`${API_ENDPOINTS.adresses.osmPlaces}?q=${encodeURIComponent(query)}`);
      if (!osmResponse.ok) return [];
      const osmList: Array<{ display_name: string; address?: { postcode?: string; city?: string; town?: string; village?: string } }> =
        await osmResponse.json();
      if (!Array.isArray(osmList) || osmList.length === 0) return [];
      return osmList.slice(0, 10).map(place => {
        const addr = place.address || {};
        const postcode = addr.postcode || '';
        const city = addr.city || addr.town || addr.village || place.display_name;
        const value = postcode || city;
        const adresse = place.display_name;
        const type: LocationSuggestion['type'] = postcode ? 'search_postal_code' : 'commune';
        return { value, adresse, type, count: 0 };
      });
    } catch {
      return [];
    }
  };

  // Debounced fetch suggestions when address input is open and user types
  useEffect(() => {
    if (!showLocationDropdown) return;
    if (!locationEditQuery.trim()) {
      setLocationSuggestions([]);
      return;
    }
    setLocationSuggestionsLoading(true);
    const t = setTimeout(async () => {
      const list = await fetchLocationSuggestions(locationEditQuery.trim());
      setLocationSuggestions(list);
      setLocationSuggestionsLoading(false);
    }, 300);
    return () => {
      clearTimeout(t);
      setLocationSuggestionsLoading(false);
    };
  }, [showLocationDropdown, locationEditQuery]);

  // Click outside to close address dropdown
  useEffect(() => {
    if (!showLocationDropdown) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (locationInputContainerRef.current && !locationInputContainerRef.current.contains(e.target as Node)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLocationDropdown]);

  // Fetch a specific page from API (new search on DB with current location + filters)
  // filtersOverride: use when applying modal filters so the latest values are used immediately
  // searchParamsOverride: when changing location inline, pass new params and we update URL state after
  const fetchPage = async (
    page: number,
    filtersOverride?: typeof filters,
    searchParamsOverride?: SearchParams,
  ) => {
    const params = searchParamsOverride ?? searchParams;
    if (!params) return;
    const f = filtersOverride ?? filters;
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('value', params.value);
      queryParams.append('type', params.type);
      if (f.prixMin > 0) queryParams.append('minBudget', String(f.prixMin));
      if (f.prixMax < MAX_PRICE) queryParams.append('maxBudget', String(f.prixMax));
      queryParams.append('propertyType', params.propertyType || '');
      if (f.chambres.length > 0) {
        const chambresVal =
          f.chambres.length === 1 && f.chambres[0] === 5 ? '5+' : f.chambres.sort((a, b) => a - b).join(',');
        queryParams.append('chambres', chambresVal);
      }
      queryParams.append('page', String(page));
      queryParams.append('size', String(PAGE_SIZE));

      const response = await fetch(`${API_ENDPOINTS[mode].search}?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setApiProperties(data.content || []);
      setTotalPages(data.totalPages ?? 0);
      setTotalElements(data.totalElements ?? 0);
      setCurrentPage(page);

      // When location was changed inline, update URL state so the bar shows new address
      if (searchParamsOverride) {
        const path = mode === 'achat' ? '/RecherchAchat' : '/RecherchLouer';
        navigate(path, {
          replace: true,
          state: {
            searchParams: searchParamsOverride,
            searchResults: data.content || [],
            totalPages: data.totalPages ?? 0,
            totalElements: data.totalElements ?? 0,
          },
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple retry function for error cases
  const handleRetry = () => {
    setError(null);
    if (preloadedResults.length > 0) {
      setApiProperties(preloadedResults);
    } else {
      // If no preloaded results, redirect back to search
      window.history.back();
    }
  };

  // Convert API properties to display properties
  const properties: Property[] = apiProperties.map(convertApiPropertyToProperty);

  // --- Filter helpers ---
  const parsePropertyPrice = (priceText: string): number => {
    const digits = priceText.replace(/\s/g, '').match(/\d+/g);
    return digits ? parseInt(digits.join(''), 10) : 0;
  };

  const parseSurfaceM2 = (surfaceText: string): number => {
    if (!surfaceText || surfaceText === 'N/A') return 0;
    const m = surfaceText.match(/(\d+(?:[,.]\d+)?)/);
    return m ? parseFloat(m[1].replace(',', '.')) : 0;
  };

  // Chambres (pièces) are filtered by the API; only price, surface and exterieur applied client-side
  const filteredProperties = properties.filter(property => {
    const price = parsePropertyPrice(property.price);
    if (filters.prixMin > 0 && price < filters.prixMin) return false;
    if (filters.prixMax < MAX_PRICE && price > filters.prixMax) return false;

    const surface = parseSurfaceM2(property.surface);
    if (filters.surfaceMin > 0 && surface > 0 && surface < filters.surfaceMin) return false;
    if (filters.surfaceMax < 500 && surface > 0 && surface > filters.surfaceMax) return false;

    const attrs = property.dynamicAttributes;
    for (const opt of filters.exterieur) {
      if (opt === 'Balcon') {
        const v = attrs?.['Balcon/Terrasse'];
        if (!v || v === 'N/A' || v === 'Terrasse') return false;
      }
      if (opt === 'Jardin' && !(attrs?.['Jardin'] && attrs['Jardin'] !== 'N/A')) return false;
      if (opt === 'Terrasse') {
        const hasTer = (attrs?.['Terrasse'] && attrs['Terrasse'] !== 'N/A') || attrs?.['Balcon/Terrasse'] === 'Terrasse';
        if (!hasTer) return false;
      }
      if (opt === 'Piscine' && !(attrs?.['Piscine'] && attrs['Piscine'] !== 'N/A')) return false;
    }

    return true;
  });

  // Function to render tags
  const renderTags = (tags: string[]): JSX.Element[] => {
    const tagColorMap: Record<string, string> = {
      'À vendre': 'bg-green-500',
      'En vente': 'bg-green-500',
      Géolocalisé: 'bg-orange-400',
      SeLoger: 'bg-indigo-500',
      'Baisse de prix': 'bg-green-500',
      leboncoin: 'bg-indigo-400',
      Expiré: 'bg-red-500',
      default: 'bg-gray-500',
    };

    return tags.map((tag, index) => (
      <motion.span
        key={index}
        className={`${tagColorMap[tag] || tagColorMap['default']} text-white text px-2 py-1 rounded-lg mr-1`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ scale: 1.05 }}
      >
        {tag}
      </motion.span>
    ));
  };

  const ImageGallery: React.FC<ImageGalleryProps> = ({ images, tags }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
    const [isHovering, setIsHovering] = useState<boolean>(false);

    const handleDotClick = (index: number): void => {
      setCurrentImageIndex(index);
    };

    const handleMouseEnter = (): void => {
      setIsHovering(true);
    };

    const handleMouseLeave = (): void => {
      setIsHovering(false);
    };

    // Auto-cycle images when hovering
    React.useEffect(() => {
      let intervalId: ReturnType<typeof setInterval>;
      if (isHovering && images.length > 1) {
        intervalId = setInterval(() => {
          setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 1500); // Change image every 1.5 seconds
      }

      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }, [isHovering, images.length]);

    return (
      <motion.div
        className="relative h-60 overflow-hidden rounded-2xl group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentImageIndex}
            src={images[currentImageIndex] || images[0]}
            alt={`Property image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover rounded-3xl absolute"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>
        {/* SVG Icons overlay - Fixed on top */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 pointer-events-none">
            {/* Custom SVG icons - Fixed row */}
            <div className="flex gap-1">
              {/* Icon 1 - House */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M17.5554 21C17.2544 20.9047 16.9352 20.8461 16.6487 20.7106C15.5715 20.2013 14.9948 18.9483 15.2886 17.7869C15.3285 17.6257 15.2922 17.5635 15.1508 17.4902C13.8886 16.8454 12.63 16.1932 11.3715 15.5411C11.328 15.5191 11.2844 15.4971 11.2337 15.4715C10.6533 16.2262 9.89893 16.6182 8.95229 16.5669C8.28856 16.534 7.7155 16.2629 7.25125 15.7829C6.25384 14.7424 6.25021 13.167 7.23674 12.1082C8.1725 11.1081 9.9352 10.9285 11.0741 12.2035C12.5067 11.3315 13.943 10.4596 15.3756 9.58763C14.8207 8.09284 15.6694 6.65668 16.8301 6.19505C18.0668 5.70046 19.4088 6.16941 20.0871 7.34179C20.7145 8.41891 20.4498 9.84775 19.4741 10.6684C18.5202 11.4708 16.9207 11.5733 15.829 10.3423C15.7891 10.3643 15.7492 10.3863 15.7093 10.412C14.3601 11.2326 13.0109 12.0533 11.658 12.8703C11.5565 12.9326 11.5311 12.9802 11.571 13.0974C11.7342 13.5591 11.7704 14.028 11.6399 14.508C11.6254 14.5592 11.6181 14.6105 11.6072 14.6765C12.9746 15.3836 14.3383 16.0907 15.6948 16.7904C15.887 16.6072 16.0611 16.4167 16.2606 16.2592C17.7985 15.0538 20.1306 16.0211 20.3917 17.9701C20.5912 19.4539 19.6264 20.7472 18.1539 20.9744C18.1249 20.978 18.0995 20.9927 18.0705 21C17.9036 21 17.7295 21 17.5554 21Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Icon 2 - User */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M13.148 6.00001C15.2678 5.99565 16.9863 7.70981 16.995 9.82961C16.9994 11.9451 15.2809 13.6679 13.1611 13.6723C11.0413 13.6767 9.31837 11.9581 9.31837 9.84269C9.31401 7.71853 11.0282 6.00437 13.148 6.00001Z"
                    fill="white"
                  />
                  <path
                    d="M14.1374 20.3021C14.0632 20.3065 14.024 20.3109 13.9804 20.3109C11.7254 20.3109 9.46598 20.3109 7.21096 20.3109C6.61341 20.3109 6.14234 19.9314 6.02457 19.3644C5.9984 19.2422 5.9984 19.1157 6.00276 18.9892C6.00713 18.588 5.98096 18.178 6.0333 17.781C6.12925 17.0526 6.5567 16.5031 7.09756 16.0364C7.73001 15.4999 8.46278 15.1466 9.24353 14.8849C10.8268 14.3527 12.4538 14.1957 14.1112 14.3135C14.1243 14.3135 14.1418 14.3222 14.1767 14.3309C13.4046 15.1727 12.9946 16.1585 12.9815 17.2925C12.9728 18.4309 13.3654 19.4254 14.1374 20.3021Z"
                    fill="white"
                  />
                  <path
                    d="M17.3396 21C15.3158 20.9956 13.6801 19.36 13.6758 17.3405C13.6758 15.321 15.3332 13.6636 17.3527 13.6723C19.3766 13.681 21.0079 15.3254 21.0035 17.3449C20.9991 19.3731 19.3635 21 17.3396 21ZM17.863 17.8552C18.116 17.8552 18.3472 17.8596 18.574 17.8552C18.8139 17.8508 19.0058 17.6982 19.0669 17.4757C19.1585 17.1355 18.9142 16.8258 18.5435 16.8127C18.321 16.8084 18.0986 16.8127 17.863 16.8127C17.863 16.5598 17.8674 16.333 17.863 16.1061C17.8587 15.875 17.7409 15.7136 17.5272 15.6307C17.1826 15.4955 16.8293 15.7441 16.8206 16.1367C16.8119 16.3591 16.8206 16.5772 16.8206 16.8127C16.7377 16.8127 16.6767 16.8127 16.62 16.8127C16.4498 16.8127 16.2797 16.8084 16.114 16.8171C15.8654 16.8302 15.6865 16.9785 15.6255 17.2053C15.5644 17.4147 15.6386 17.6502 15.8305 17.7636C15.9308 17.8247 16.0616 17.8508 16.1838 17.8596C16.3931 17.8726 16.6025 17.8639 16.825 17.8639C16.825 18.1038 16.8206 18.3175 16.825 18.5269C16.8293 18.8453 17.0518 19.0852 17.344 19.0896C17.645 19.0939 17.8674 18.8584 17.8718 18.5225C17.8674 18.3088 17.863 18.0951 17.863 17.8552Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                </svg>
              </div>

              {/* Icon 3 - Building */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M17.5242 12.447C17.5242 13.9684 17.5242 15.4942 17.5242 17.0156C17.5242 17.1384 17.5155 17.2699 17.4763 17.3883C17.3065 17.9144 16.6708 18.0591 16.2572 17.6777C15.9611 17.4058 15.6781 17.1121 15.3559 16.8665C14.0888 15.8976 12.652 15.424 11.0583 15.4284C10.2746 15.4328 9.49086 15.4284 8.70711 15.4284C7.33556 15.424 6.25138 14.5252 6.06415 13.166C5.97272 12.5083 5.95095 11.8331 6.19042 11.1842C6.57794 10.1363 7.54021 9.46552 8.67228 9.46113C9.54311 9.45675 10.4139 9.47428 11.2848 9.45236C13.1701 9.40413 14.7811 8.69385 16.1179 7.35658C16.2746 7.19874 16.4226 7.04966 16.6578 7.0102C17.0496 6.94444 17.4328 7.20312 17.5068 7.59772C17.5242 7.69418 17.5286 7.79503 17.5286 7.89149C17.5242 9.40852 17.5242 10.9255 17.5242 12.447Z"
                    fill="white"
                  />
                  <path
                    d="M8.25781 16.1302C9.34199 16.1302 10.4044 16.1302 11.4799 16.1302C11.5452 16.3976 11.6192 16.6431 11.6671 16.8931C11.7934 17.5288 12.0067 18.1339 12.3115 18.7082C12.5815 19.2168 12.3376 19.7956 11.8151 19.9578C11.7063 19.9929 11.5887 20.0017 11.4799 20.006C10.9791 20.0104 10.4784 20.0104 9.9777 20.006C9.29845 20.0017 8.8195 19.5807 8.70629 18.9011C8.5626 18.0111 8.41456 17.121 8.26652 16.2266C8.26652 16.1959 8.26217 16.1608 8.25781 16.1302Z"
                    fill="white"
                    fillOpacity="0.8"
                  />
                  <path
                    d="M19.962 11.921C20.1361 11.921 20.3103 11.9167 20.4845 11.921C20.7805 11.9298 20.9982 12.1578 20.9982 12.4472C20.9982 12.7366 20.7805 12.9646 20.4801 12.9689C20.1318 12.9733 19.7834 12.9733 19.4351 12.9689C19.139 12.9646 18.9126 12.7366 18.9083 12.4516C18.9039 12.1578 19.1347 11.9254 19.4351 11.921C19.6136 11.9167 19.7878 11.921 19.962 11.921Z"
                    fill="white"
                  />
                  <path
                    d="M20.1719 15.6172C20.1414 15.8364 20.05 15.9986 19.8627 16.0907C19.6712 16.1872 19.4709 16.1828 19.3141 16.0337C19.0268 15.7662 18.7481 15.49 18.4825 15.1963C18.304 15.0033 18.3344 14.6964 18.5173 14.5079C18.7002 14.3194 19.005 14.2799 19.1966 14.4597C19.4926 14.7271 19.767 15.0165 20.0369 15.3059C20.1153 15.3892 20.1327 15.5163 20.1719 15.6172Z"
                    fill="white"
                  />
                  <path
                    d="M20.1531 9.34297C20.1226 9.40435 20.0791 9.54466 19.992 9.6455C19.7613 9.8998 19.5174 10.1409 19.2692 10.3777C19.0472 10.5926 18.7293 10.5882 18.5247 10.3777C18.3244 10.1716 18.3244 9.85596 18.529 9.63673C18.7729 9.38243 19.0254 9.12813 19.2779 8.8826C19.4434 8.72476 19.6437 8.69845 19.8527 8.79053C20.0443 8.8826 20.1401 9.04921 20.1531 9.34297Z"
                    fill="white"
                  />
                </svg>
              </div>

              {/* Icon 4 - Star */}
              <div className="w-7 h-7">
                <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="13.5" cy="13.5" r="13.5" fill="#0C0C0C" fillOpacity="0.2" />
                  <path
                    d="M13.4887 8.22351C14.6031 6.95906 16.3891 6.78764 17.6791 7.20007C20.6183 8.14657 21.5361 11.5486 20.7006 14.1571C19.397 18.3023 14.8396 20.4745 13.4994 20.4745C11.9978 20.4744 7.61379 18.2612 6.29529 14.1581V14.1571C5.4599 11.548 6.37601 8.14621 9.31189 7.20104C10.5929 6.78554 12.3179 6.96801 13.4887 8.22351Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Horizontal separator line - Full width across image */}
          <div className="absolute top-10 left-0 right-0 h-px bg-white/30 z-15"></div>

          {/* Tags below the separator line */}
          <div className="absolute top-12 left-2 flex pb-1 flex-wrap gap-1 z-10">{renderTags(tags)}</div>

          {/* Image Indicator Dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 pointer-events-auto">
            {images.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                whileHover={{ scale: 1.5 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const handleSelectLocationSuggestion = (suggestion: LocationSuggestion) => {
    if (!searchParams) return;
    const newParams: SearchParams = {
      ...searchParams,
      location: suggestion.adresse,
      value: suggestion.value,
      type: suggestion.type,
    };
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
    setLocationEditQuery(suggestion.adresse);
    fetchPage(0, undefined, newParams);
  };

  const handlePropertyTypeChange = (propertyType: 'Maison' | 'Appartement') => {
    if (!searchParams) return;
    const newParams: SearchParams = { ...searchParams, propertyType };
    fetchPage(0, undefined, newParams);
  };

  // Input value: current location when dropdown closed, typed query when open
  const locationInputValue =
    showLocationDropdown ? locationEditQuery : (searchParams?.location ?? '');

  return (
    <div className="min-h-screen bg-gray-100">
      <RecherchLouerFilterBar
        maxPrice={MAX_PRICE}
        mode={mode}
        searchParams={
          searchParams
            ? {
                ...searchParams,
                maxBudget: searchParams.maxBudget
                  ? `${searchParams.maxBudget}${mode === 'achat' ? ' €' : ' €/mois'}`
                  : undefined,
              }
            : null
        }
        filters={filters}
        setFilters={setFilters}
        onFiltersChange={newFilters => fetchPage(0, newFilters)}
        onFiltersClick={() => setIsFiltersOpen(true)}
        locationInputValue={locationInputValue}
        onLocationInputChange={v => {
          setLocationEditQuery(v);
          setShowLocationDropdown(true);
        }}
        onLocationFocus={() => {
          setShowLocationDropdown(true);
          setLocationEditQuery(searchParams?.location ?? '');
        }}
        showLocationDropdown={showLocationDropdown}
        locationSuggestions={locationSuggestions}
        locationSuggestionsLoading={locationSuggestionsLoading}
        onSelectLocationSuggestion={handleSelectLocationSuggestion}
        locationInputContainerRef={locationInputContainerRef}
        onPropertyTypeChange={searchParams ? handlePropertyTypeChange : undefined}
      />

      {isFiltersOpen && (
        <RecherchLouerFiltersModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setIsFiltersOpen(false)}
          onApply={appliedFilters => fetchPage(0, appliedFilters)}
          mode={mode}
          maxPrice={MAX_PRICE}
        />
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Search results header: adresse recherchée + count (updates after each search/filter) */}
        {searchParams && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-xl font-bold text-gray-900">
              Annonces {mode === 'achat' ? 'Ventes immobilières' : 'Locations'} {searchParams.propertyType || ''} {searchParams.location}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {isLoading ? (
                <span className="inline-flex items-center gap-1">
                  <span className="animate-pulse">…</span> annonces
                </span>
              ) : (
                <>
                  {totalElements} annonce{totalElements !== 1 ? 's' : ''}
                  {totalPages > 1 && (
                    <span className="text-gray-500 font-normal">
                      {' '}(max 30 par page)
                    </span>
                  )}
                </>
              )}
            </p>
          </motion.div>
        )}

        {/* Loading state */}
        {isLoading && (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Recherche en cours...</p>
            </div>
          </motion.div>
        )}

        {/* Error state */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-800">Erreur lors de la recherche: {error}</p>
            <button
              onClick={handleRetry}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Réessayer
            </button>
          </motion.div>
        )}

        {/* Properties grid */}
        {!isLoading && !error && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property, index) => (
                <PropertySearchCard
                  key={property.id}
                  property={property}
                  index={index}
                  mode={mode}
                  associationDisplayNames={associationDisplayNames}
                  ImageGallery={ImageGallery}
                  priceLabel={mode === 'achat' ? 'Prix' : 'Loyer'}
                  priceSuffix={mode === 'achat' ? ' €' : '/mois'}
                />
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-gray-500 text-lg">Aucun bien trouvé pour cette recherche.</p>
                <p className="text-gray-400 text-sm mt-2">Essayez de modifier vos critères de recherche.</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Pagination - 30 results per page */}
        {!isLoading && !error && totalPages > 1 && (
          <motion.div
            className="mt-8 flex justify-center items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => fetchPage(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Précédent
            </button>
            <span className="px-4 py-2 text-sm text-gray-600">
              Page {currentPage + 1} / {totalPages} ({totalElements} annonces)
            </span>
            <button
              onClick={() => fetchPage(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Suivant
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PropertySearch;
