import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './styles/mapbox-popup.css';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';
import { API_ENDPOINTS } from 'app/config/api.config';
import debounce from 'lodash/debounce';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

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
  numero?: string;
  nomVoie?: string;
  coordinates?: [number, number];
  address?: string;
}

interface AddressInfo {
  address: string;
  city: string;
}

interface PropertyMapProps {
  onMapMove?: (coordinates: [number, number]) => void;
  onPropertySelect?: (property: Property) => void;
  onPropertiesFound?: (properties: Property[]) => void;
  onAddressFound?: (addressInfo: AddressInfo) => void;
  searchParams: {
    address?: string;
    coordinates?: [number, number];
    numero?: string;
    nomVoie?: string;
    [key: string]: string | [number, number] | undefined;
  };
}

interface PropertyStats {
  typeBien: string;
  nombre: number;
  prixMoyen: number;
  prixM2Moyen: number;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ onMapMove, onPropertySelect, onPropertiesFound, onAddressFound, searchParams }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const hoverPopup = useRef<mapboxgl.Popup | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeLayers, setActiveLayers] = useState<string[]>([]);
  const [showStatsPanel, setShowStatsPanel] = useState<boolean>(false);
  const [currentCity, setCurrentCity] = useState<string>('Ajaccio');
  const [is3DView, setIs3DView] = useState<boolean>(false);
  const { numero, nomVoie, coordinates } = searchParams;
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const mutationCache = useRef<Map<string, Property[]>>(new Map());
  const [propertyStats, setPropertyStats] = useState<PropertyStats[]>([]);
  const [activePropertyType, setActivePropertyType] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const statsCache = useRef<Map<string, { data: PropertyStats[]; timestamp: number }>>(new Map());
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration

  const hoveredId = useRef<string | number | null>(null);
  const selectedId = useRef<string | number | null>(null);

  const TILESET_ID = 'saber5180.0h0q6jw3';
  const SOURCE_LAYER = 'cadastre-2A2-Parcelles-2s9utu';
  const LAYER_ID = 'parcels-interactive-layer';

  const typeNames: string[] = ['Appartement', 'Maison', 'Local', 'Terrain', 'Bien Multiple'];

  // Formatter les nombres pour l'affichage
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const getShortTypeName = typeBien => {
    const names = {
      Appartement: 'Appartement',
      Maison: 'Maison',
      'Local industriel. commercial ou assimilé': 'Local',
      Terrain: 'Terrain',
      'Bien Multiple': 'Bien Multiple',
    };
    return names[typeBien] || typeBien.split(' ')[0];
  };

  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingRequestsRef = useRef<Map<string, { promise: Promise<any>; controller: AbortController }>>(new Map());

  // Cancel all pending requests
  const cancelPendingRequests = useCallback(() => {
    pendingRequestsRef.current.forEach(({ controller }) => {
      controller.abort();
    });
    pendingRequestsRef.current.clear();
  }, []);

  // Create a new abort controller for each request
  const createAbortController = useCallback(() => {
    const controller = new AbortController();
    return controller;
  }, []);

  // Create a unique key for each request
  const createRequestKey = (type: 'address' | 'stats', params: any): string => {
    if (type === 'address') {
      const { numero: addressNumero, nomVoie: addressNomVoie } = params;
      return `address_${addressNumero}_${addressNomVoie}`;
    }
    return `stats_${params}`;
  };

  // Deduplicate requests
  const deduplicateRequest = async <T,>(
    type: 'address' | 'stats',
    params: any,
    requestFn: (controller: AbortController) => Promise<T>,
  ): Promise<T> => {
    const requestKey = createRequestKey(type, params);

    // Check if there's already a pending request
    const existingRequest = pendingRequestsRef.current.get(requestKey);
    if (existingRequest) {
      return existingRequest.promise;
    }

    // Create new request
    const controller = createAbortController();
    const promise = requestFn(controller);

    pendingRequestsRef.current.set(requestKey, { promise, controller });

    try {
      const result = await promise;
      return result;
    } finally {
      pendingRequestsRef.current.delete(requestKey);
    }
  };

  // Optimized fetchAddressData with deduplication
  const fetchAddressData = async (properties: SearchParams): Promise<Property[]> => {
    return deduplicateRequest('address', properties, async controller => {
      try {
        const streetNumber = normalizeSearchParams(properties.numero?.toString() || '');
        const streetName = normalizeSearchParams(properties.nomVoie || '');

        if (!streetNumber || !streetName) {
          throw new Error("Données d'adresse incomplètes");
        }

        const cacheKey = getMutationCacheKey(properties);
        const cachedData = mutationCache.current.get(cacheKey);

        if (cachedData) {
          return cachedData;
        }

        const novoie = streetNumber.replace(/\D/g, '');
        const voie = streetName;

        const response = await fetch(`${API_ENDPOINTS.mutations.search}?novoie=${novoie}&voie=${encodeURIComponent(voie)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur API: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        const formattedProperties: Property[] = data.map((mutation: any) => {
          const surface = mutation.surface || 1;
          const valeurfonc = mutation.valeurfonc || 0;
          const rawAddress = mutation.addresses?.[0] || '';

          const addressParts = rawAddress.split(' ');
          const propertyNumber = addressParts.find(part => /^\d+/.test(part)) || '';
          const streetNameParts = addressParts.filter(part => part !== propertyNumber && !/^\d{5}/.test(part));
          const cityParts = addressParts.slice(-2);

          return {
            id: mutation.idmutation || Date.now(),
            address: `${propertyNumber} ${streetNameParts.join(' ')}`,
            city: cityParts.join(' '),
            numericPrice: valeurfonc,
            numericSurface: surface,
            price: `${Math.round(valeurfonc).toLocaleString('fr-FR')}€`,
            pricePerSqm: `${Math.round(valeurfonc / surface).toLocaleString('fr-FR')} €`,
            type: (mutation.libtyplocList?.[0] || 'Terrain')
              .replace(/\./g, '')
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, ''),
            surface: `${surface.toLocaleString('fr-FR')} m²`,
            rooms: mutation.nbpprincTotal ?? 'N/A',
            soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            rawData: {
              terrain: mutation.terrain,
              mutationType: mutation.idnatmut,
              department: mutation.coddep,
            },
          };
        });

        mutationCache.current.set(cacheKey, formattedProperties);
        return formattedProperties;
      } catch (fetchError) {
        if (fetchError.name === 'AbortError') {
          return [];
        }
        console.error('Erreur:', fetchError);
        return [];
      }
    });
  };

  // Optimized stats fetching with deduplication
  const fetchPropertyStats = useCallback(async (city: string) => {
    return deduplicateRequest('stats', city, async controller => {
      const now = Date.now();
      const cachedStats = statsCache.current.get(city);

      if (cachedStats && now - cachedStats.timestamp < CACHE_DURATION) {
        setPropertyStats(cachedStats.data);
        return cachedStats.data;
      }

      try {
        setIsLoading(true);

        const response = await axios.get(`${API_ENDPOINTS.mutations.statistics}/${city.toLowerCase()}`, {
          signal: controller.signal,
        });

        const stats = response.data;
        statsCache.current.set(city, {
          data: stats,
          timestamp: now,
        });

        setPropertyStats(stats);
        return stats;
      } catch (err) {
        if (axios.isCancel(err)) {
          return null;
        }
        console.error('Erreur:', err);
        setError('Erreur de chargement');
        return null;
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    const panelRef = document.querySelector('.sidebar-panel');
    const handleOutsideClick = (e: MouseEvent) => {
      if (showStatsPanel && panelRef && !panelRef.contains(e.target as Node)) {
        setShowStatsPanel(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [showStatsPanel]);

  const normalizeSearchParams = (str: string): string => {
    return typeof str === 'string'
      ? str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[œæ]/gi, 'oe')
          .replace(/[ç]/gi, 'c')
          .toUpperCase()
          .replace(/[^A-Z0-9]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
      : '';
  };

  const isValidCoordinates = (coords: unknown): coords is [number, number] => {
    return Array.isArray(coords) && coords.length === 2 && typeof coords[0] === 'number' && typeof coords[1] === 'number';
  };

  useEffect(() => {
    const coords = searchParams.coordinates;
    if (coords && map.current && isValidCoordinates(coords)) {
      const [mapLng, mapLat] = coords;
      map.current.flyTo({
        center: [mapLng, mapLat],
        zoom: 17,
      });
    }
  }, [searchParams.coordinates]);

  useEffect(() => {
    if (numero && nomVoie) {
      handleAddressClick({ numero, nomVoie });
    }
  }, [numero, nomVoie]);

  useEffect(() => {
    if (!map.current) return;

    const fetchMutations = async (street: string, commune: string): Promise<void> => {
      try {
        const response = await axios.get(API_ENDPOINTS.mutations.byStreetAndCommune, {
          params: {
            street: encodeURIComponent(street),
            commune: encodeURIComponent(commune),
          },
        });

        const formatted = response.data.map((mutation: any) => ({
          id: mutation.idmutation,
          address: mutation.addresses?.[0] || 'Adresse inconnue',
          city: commune,
          price: `${mutation.valeurfonc?.toLocaleString('fr-FR')} €`,
          surface: `${mutation.surface?.toLocaleString('fr-FR')} m²`,
          type: mutation.libtyploc,
          soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR'),
          pricePerSqm:
            mutation.valeurfonc && mutation.surface
              ? `${Math.round(mutation.valeurfonc / mutation.surface).toLocaleString('fr-FR')} €/m²`
              : 'N/A',
        }));

        onPropertiesFound?.(formatted);
      } catch (mutationError) {
        setError('Error fetching mutations');
        onPropertiesFound?.([]);
      }
    };

    const updateLocationName = async (): Promise<void> => {
      try {
        const center = map.current?.getCenter();
        if (!center) return;

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${center.lng},${center.lat}.json?types=place,locality&language=fr&access_token=${mapboxgl.accessToken}`,
        );

        const data = await response.json();
        const locationFeature = data.features[0];

        if (locationFeature) {
          const locationName = locationFeature.text_fr || locationFeature.text;
          setCurrentCity(locationName);
        }
      } catch (geocodingError) {
        setError('Erreur de géocodage');
      }
    };

    map.current.on('moveend', updateLocationName);
    map.current.on('zoomend', updateLocationName);

    return () => {
      if (map.current) {
        map.current.off('moveend', updateLocationName);
        map.current.off('zoomend', updateLocationName);
      }
    };
  }, [map.current]);

  const getMutationCacheKey = (properties: SearchParams): string => {
    const streetNumber = normalizeSearchParams(properties.numero?.toString() || '');
    const streetName = normalizeSearchParams(properties.nomVoie || '');
    return `${streetNumber}-${streetName}-${currentCity}`;
  };

  // Update the handleAddressClick to use the optimized fetchAddressData
  const handleAddressClick = async (properties: SearchParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const cacheKey = getMutationCacheKey(properties);
      let formattedProperties = mutationCache.current.get(cacheKey);

      if (!formattedProperties) {
        formattedProperties = await fetchAddressData(properties);
      }

      if (formattedProperties.length > 0) {
        onPropertySelect?.(formattedProperties[0]);
        onPropertiesFound?.(formattedProperties);
      } else {
        onAddressFound?.({
          address: `${properties.numero} ${properties.nomVoie}`,
          city: currentCity,
        });
      }
    } catch (addressError) {
      console.error('Erreur:', addressError);
      setError(addressError instanceof Error ? addressError.message : 'Une erreur est survenue');
      onPropertiesFound?.([]);
    } finally {
      setLoading(false);
    }
  };

  const formatFrenchDate = (dateStr: string): string => {
    const months: Record<string, string> = {
      janvier: '01',
      février: '02',
      mars: '03',
      avril: '04',
      mai: '05',
      juin: '06',
      juillet: '07',
      août: '08',
      septembre: '09',
      octobre: '10',
      novembre: '11',
      décembre: '12',
    };

    const [day, monthName, year] = dateStr.split(' ');
    const dayFormatted = day.padStart(2, '0');
    const month = months[monthName.toLowerCase()] || '01';

    return `${dayFormatted}/${month}/${year}`;
  };
  const createHoverPopupContent = async properties => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'flex items-center justify-center';
    loadingIndicator.innerHTML = '';
    container.appendChild(loadingIndicator);

    try {
      const formattedProperties = await fetchAddressData(properties);
      const getPropertyTypeColor = type => {
        const colorMap = {
          appartement: '#4F46E5',
          'local industriel commercial ou assimile': '#8B5CF6',
          terrain: '#60A5FA',
          'bien multiple': '#2563EB',
          maison: '#1E3A8A',
        };
        return colorMap[type?.toLowerCase()?.trim()] || '#9CA3AF';
      };

      if (formattedProperties && formattedProperties.length > 0) {
        container.innerHTML = '';

        const property = formattedProperties[0];
        if (!property) return container;

        const propertyTypeLabel =
          property.type
            ?.toLowerCase()
            ?.split(' ')
            ?.map(word => word.charAt(0).toUpperCase() + word.slice(1))
            ?.join(' ') || 'Type inconnu';
        const cityName = property.city?.split(' ')?.[1] || '';

        const priceFormatted = property.numericPrice?.toLocaleString('fr-FR') + ' €';
        const pricePerSqm =
          property.numericPrice && property.numericSurface
            ? Math.round(property.numericPrice / property.numericSurface).toLocaleString('fr-FR') + ' €/m²'
            : 'N/A';

        container.innerHTML = `
      <div style="
        background: #fff;
        padding: 1px;
        font-family: 'Maven Pro', sans-serif;
        max-width: 480px;
        width: 100%;
        position: relative;
        border-radius: 16px;
      ">
        <!-- Address -->
        <div style="font-weight: 700; font-size: 16px;width:75%; margin-bottom: 10px; color: #1a1a1a;">
            ${property.address?.toUpperCase() || ''} – ${cityName}
        </div>

        <!-- Property Type, Rooms, Surface -->
        <div style="font-size: 16px;width:70%; color: #333;">
          <span style="color: ${getPropertyTypeColor(propertyTypeLabel)}; font-weight: 900; margin-bottom: 10px;">
            ${propertyTypeLabel}
          </span>
            <span style="margin-top: 10px;">${property.rooms || 'N/A'} pièces – ${property.surface || 'N/A'}</span>
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
            Vendu le <strong style="color: #000;">${formatFrenchDate(property.soldDate || '')}</strong>
        </div>
      </div>
    `;

        container.querySelector('.popup-button')?.addEventListener('click', e => {
          e.stopPropagation();
          handleAddressClick(properties);
          hoverPopup.current?.remove();
        });
      } else {
        const addressLine = properties?.address || '';

        let street = '';
        let cityName = '';

        if (addressLine.includes(' - ')) {
          const [rawStreet, rawCity] = addressLine.split(' - ');
          street = rawStreet || '';
          cityName = rawCity?.split(' ')?.[1] || '';
        }

        container.innerHTML = `
        <div style="
            background: #fff;
            padding: 4px;
            font-family: 'Maven Pro', sans-serif;
            max-width: 480px;
            width: 100%;
            position: relative;
            border-radius: 16px;
        ">
            <!-- Address -->
            <div style="font-weight: 700; font-size: 16px;width:75%; margin-bottom: 10px; color: #1a1a1a;">
              ${properties.numero || ''}  ${properties.nomVoie || ''}
            </div>

            <!-- No sales message -->
            <div style="font-size: 14px; color: #333; margin-top: 8px;">
                Aucune vente identifiée à cette adresse
              </div>
          </div>`;
      }
    } catch (popupError) {
      console.error('Error creating hover popup:', popupError);
      container.innerHTML = `
        <div style="
          background: #fff;
          padding: 4px;
          font-family: 'Maven Pro', sans-serif;
          max-width: 480px;
          width: 100%;
          position: relative;
          border-radius: 16px;
        ">
          <div style="font-size: 14px; color: #333; margin-top: 8px;">
            Erreur lors du chargement des données
            </div>
        </div>`;
    }

    return container;
  };
  const createPopupContent = features => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const title = document.createElement('h3');
    title.className = 'popup-title';
    title.textContent = `choisissez une Adresse`;

    const content = document.createElement('div');
    content.className = 'popup-content';

    features.forEach((feature, index) => {
      const button = document.createElement('button');
      button.className = 'popup-item';
      button.innerHTML = `
      <span class="address-number">${feature.properties.numero || 'N/A'}</span>
      <span class="address-street">${(feature.properties.nomVoie || '').toUpperCase()}</span>

    `;

      button.addEventListener('click', e => {
        e.stopPropagation();
        handleAddressClick({
          numero: feature.properties.numero,
          nomVoie: feature.properties.nomVoie,
        });
        popup.current?.remove();
      });

      content.appendChild(button);
    });

    container.appendChild(title);
    container.appendChild(content);

    return container;
  };
  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map first
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cmawpgdtd007301sc5ww48tds',
      center: [8.73692, 41.9281],
      zoom: 17,
      attributionControl: false,
      minZoom: 17,
    });

    // Create scale elements first
    const scaleContainer = document.createElement('div');
    const scaleLine = document.createElement('div');
    const scaleText = document.createElement('div');

    // Apply styles
    Object.assign(scaleContainer.style, {
      position: 'fixed',
      zIndex: 10,
      bottom: '20px',
      right: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: '0 6px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      pointerEvents: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    });

    Object.assign(scaleLine.style, {
      border: '2px solid #7e8490',
      borderTop: 'none',
      height: '7px',
      width: '100px',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.3)',
    });

    Object.assign(scaleText.style, {
      marginLeft: '8px',
      fontSize: '12px',
      color: '#4a5568',
      fontFamily: 'Arial, sans-serif',
      fontWeight: '500',
    });

    scaleContainer.appendChild(scaleLine);
    scaleContainer.appendChild(scaleText);

    const updateScale = () => {
      if (!map.current) return;

      const zoom = map.current.getZoom();
      const center = map.current.getCenter();
      const metersPerPixel = (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom);
      const widthMeters = metersPerPixel * 100;

      let displayWidth = 100;
      let displayText = '0 m';

      if (!isNaN(widthMeters)) {
        if (widthMeters > 1000) {
          if (zoom <= 13.5) {
            displayText = '1km';
            displayWidth = 100;
          } else {
            const kmValue = (Math.round(widthMeters / 100) * 100) / 1000;
            displayText = `${kmValue}km`;
            displayWidth = (1000 / widthMeters) * 100;
          }
        } else {
          const mValue = Math.round(widthMeters / 10) * 10;
          displayText = `${mValue}m`;
        }
      }

      scaleLine.style.width = `${displayWidth}px`;
      scaleText.textContent = displayText;
    };

    // Add control after defining updateScale
    map.current.addControl(
      {
        onAdd() {
          updateScale();
          return scaleContainer;
        },
        onRemove() {
          scaleContainer.remove();
        },
      },
      'top-right',
    );

    // Set up event listeners
    const moveHandler = () => {
      const center = map.current?.getCenter();
      if (center && typeof onMapMove === 'function') {
        onMapMove([center.lng, center.lat]);
      }
    };

    map.current.on('move', updateScale);
    map.current.on('zoom', updateScale);
    map.current.on('moveend', moveHandler);

    // Add wheel zoom limits
    const wheelHandler = (e: mapboxgl.MapWheelEvent) => {
      const currentZoom = map.current?.getZoom();
      if (e.originalEvent.deltaY > 0 && currentZoom && currentZoom <= 13.5) {
        e.originalEvent.preventDefault();
      }
    };

    map.current.on('wheel', wheelHandler);

    // Configure scroll zoom
    map.current.scrollZoom.setWheelZoomRate(0.5);

    // Rest of your existing map setup...
    map.current.on('load', () => {
      map.current.addSource('parcels-source', {
        type: 'vector',
        url: `mapbox://${TILESET_ID}`,
      });

      map.current.addLayer({
        id: LAYER_ID,
        type: 'fill',
        source: 'parcels-source',
        'source-layer': SOURCE_LAYER,
        paint: {
          'fill-color': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            '#0000FF',
            ['boolean', ['feature-state', 'hover'], false],
            '#89CFF0',
            '#89CFF0',
          ],
          'fill-opacity': [
            'case',
            ['boolean', ['feature-state', 'selected'], false],
            0.2,
            ['boolean', ['feature-state', 'hover'], false],
            0.2,
            0.1,
          ],
        },
      });

      // Get visible layers
      const layers = map.current.getStyle().layers;
      const visibleLayers = layers.filter(layer => layer.type === 'circle' && layer.layout?.visibility !== 'none');
      setActiveLayers(visibleLayers.map(l => l.id));

      // Add event handlers for each visible layer
      visibleLayers.forEach(({ id: layerId }) => {
        const clickHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
          popup.current?.remove();

          if (e.features?.length) {
            const feature = e.features[0];
            const featureId = feature.id;

            if (selectedId.current) {
              map.current.setFeatureState(
                {
                  source: 'parcels-source',
                  sourceLayer: SOURCE_LAYER,
                  id: selectedId.current,
                },
                { selected: false },
              );
            }

            selectedId.current = featureId;
            map.current.setFeatureState(
              {
                source: 'parcels-source',
                sourceLayer: SOURCE_LAYER,
                id: featureId,
              },
              { selected: true },
            );

            if (e.features.length === 1) {
              handleAddressClick({
                numero: feature.properties?.numero,
                nomVoie: feature.properties?.nomVoie,
              });
            } else {
              popup.current = new mapboxgl.Popup({
                offset: 25,
                closeOnClick: true,
                className: 'multi-address-popup',
              })
                .setLngLat(e.lngLat)
                .setDOMContent(createPopupContent(e.features))
                .addTo(map.current);
            }
          }
        };

        const mouseEnterHandler = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
          if (!e.features?.length) return;

          const feature = e.features[0];
          const featureId = feature.id;

          if (hoveredId.current) {
            map.current.setFeatureState(
              {
                source: 'parcels-source',
                sourceLayer: SOURCE_LAYER,
                id: hoveredId.current,
              },
              { hover: false },
            );
          }

          hoveredId.current = featureId;
          map.current.setFeatureState(
            {
              source: 'parcels-source',
              sourceLayer: SOURCE_LAYER,
              id: featureId,
            },
            { hover: true },
          );

          map.current.getCanvas().style.cursor = 'pointer';
          popup.current?.remove();
          popup.current = null;
          hoverPopup.current?.remove();

          hoverPopup.current = new mapboxgl.Popup({
            offset: 12,
            closeOnClick: false,
            closeButton: false,
            className: 'hover-popup',
          })
            .setLngLat(e.lngLat)
            .addTo(map.current);

          if (feature.properties) {
            createHoverPopupContent({
              numero: feature.properties.numero,
              nomVoie: feature.properties.nomVoie,
            }).then(content => {
              if (hoverPopup.current) {
                hoverPopup.current.setDOMContent(content);
              }
            });
          }
        };

        const mouseLeaveHandler = () => {
          if (hoveredId.current) {
            map.current.setFeatureState(
              {
                source: 'parcels-source',
                sourceLayer: SOURCE_LAYER,
                id: hoveredId.current,
              },
              { hover: false },
            );
            hoveredId.current = null;
          }

          map.current.getCanvas().style.cursor = '';
          if (hoverPopup.current && !popup.current) {
            hoverPopup.current.remove();
            hoverPopup.current = null;
          }
        };

        map.current.on('click', layerId, clickHandler);
        map.current.on('mouseenter', layerId, mouseEnterHandler);
        map.current.on('mouseleave', layerId, mouseLeaveHandler);

        // Store handlers for cleanup
        return () => {
          if (map.current) {
            map.current.off('click', layerId, clickHandler);
            map.current.off('mouseenter', layerId, mouseEnterHandler);
            map.current.off('mouseleave', layerId, mouseLeaveHandler);
          }
        };
      });
    });

    return () => {
      if (map.current) {
        map.current.off('move', updateScale);
        map.current.off('zoom', updateScale);
        map.current.off('moveend', moveHandler);
        map.current.off('wheel', wheelHandler);
        map.current.remove();
      }
      popup.current?.remove();
      hoverPopup.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (coordinates && map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: 17,
      });

      // Remove existing layers and sources
      if (map.current.getLayer('selected-point-layer')) {
        map.current.removeLayer('selected-point-layer');
      }
      if (map.current.getSource('selected-point')) {
        map.current.removeSource('selected-point');
      }
      if (map.current.getLayer('selected-address-circle')) {
        map.current.removeLayer('selected-address-circle');
      }
      if (map.current.getSource('selected-address-circle')) {
        map.current.removeSource('selected-address-circle');
      }

      // Add new marker
      map.current.addSource('selected-point', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates,
          },
          properties: {},
        },
      });

      map.current.addLayer({
        id: 'selected-point-layer',
        type: 'circle',
        source: 'selected-point',
        paint: {
          'circle-radius': 8,
          'circle-color': '#EF4444',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });

      // Add hover popup
      map.current.on('mouseenter', 'selected-point-layer', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'selected-point-layer', () => {
        map.current.getCanvas().style.cursor = '';
      });

      map.current.on('mouseenter', 'selected-point-layer', () => {
        if (hoverPopup.current) {
          hoverPopup.current.remove();
        }

        hoverPopup.current = new mapboxgl.Popup({
          offset: 12,
          closeOnClick: false,
          closeButton: false,
          className: 'hover-popup',
        })
          .setLngLat(coordinates)
          .addTo(map.current);

        createHoverPopupContent({
          numero: searchParams.numero,
          nomVoie: searchParams.nomVoie,
        }).then(content => {
          if (hoverPopup.current) {
            hoverPopup.current.setDOMContent(content);
          }
        });
      });

      map.current.on('mouseleave', 'selected-point-layer', () => {
        if (hoverPopup.current && !popup.current) {
          hoverPopup.current.remove();
          hoverPopup.current = null;
        }
      });
    }
  }, [coordinates]);

  const propertyTypeIcons = [
    <svg key="building" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line>
      <line x1="15" y1="1" x2="15" y2="4"></line>
      <line x1="9" y1="20" x2="9" y2="23"></line>
      <line x1="15" y1="20" x2="15" y2="23"></line>
      <line x1="20" y1="9" x2="23" y2="9"></line>
      <line x1="20" y1="14" x2="23" y2="14"></line>
      <line x1="1" y1="9" x2="4" y2="9"></line>
      <line x1="1" y1="14" x2="4" y2="14"></line>
    </svg>,
    <svg key="apartment" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>,
    <svg key="house" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>,
    <svg key="grid" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>,
  ];

  // Toggle button for statistics panel
  const toggleStatsPanel = () => {
    setShowStatsPanel(prev => !prev);
  };

  // Replace the existing useEffect for stats with this optimized version
  useEffect(() => {
    if (!currentCity) return;
    fetchPropertyStats(currentCity);
  }, [currentCity]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelPendingRequests();
      mutationCache.current.clear();
      statsCache.current.clear();
      pendingRequestsRef.current.clear();
    };
  }, [cancelPendingRequests]);

  // Clear mutation cache when city changes
  useEffect(() => {
    mutationCache.current.clear();
  }, [currentCity]);

  const toggleMapStyle = () => {
    if (!map.current) return;

    const newStyle = is3DView
      ? 'mapbox://styles/saber5180/cmawpgdtd007301sc5ww48tds' // 2D style
      : 'mapbox://styles/saber5180/cm9737hvv00en01qzefcd57b7'; // 3D style

    map.current.setStyle(newStyle);
    setIs3DView(!is3DView);
  };

  // Add zoom limit functions
  const handleZoomIn = () => {
    if (!map.current) return;
    map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!map.current) return;
    const currentZoom = map.current.getZoom();
    if (currentZoom > 17) {
      map.current.zoomOut();
    }
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Toggle Button */}
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
          className="fixed sm:absolute top-0 left-0 sm:top-4 sm:left-16 z-20 bg-white rounded-none sm:rounded-xl shadow-lg p-4 w-full sm:w-[448px] h-full sm:h-auto overflow-y-auto sm:overflow-visible border-t sm:border border-gray-100"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Statistiques Marché</h3>
            <div className="text-sm font-medium text-gray-600">{currentCity}</div>
          </div>

          <div className="h-px bg-gray-200 w-full mb-3" />

          {(() => {
            const propertyTypeNames = ['Appartement', 'Maison', 'Local', 'Terrain', 'Bien Multiple'];
            const getIndigoShade = idx => ['bg-indigo-600', 'bg-violet-500', 'bg-blue-400', 'bg-blue-600', 'bg-blue-900'][idx];

            const normalizedStats = propertyTypeNames.map((shortName, index) => {
              const match = propertyStats.find(item => getShortTypeName(item.typeBien) === shortName);
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
                      className={`flex-1 py-2 px-2 rounded-lg text-center text-xs font-medium ${
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Ventes</p>
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(normalizedStats[activePropertyType]?.nombre)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Prix Médian</p>
                      <p className="text-sm font-semibold text-gray-900">{formatNumber(normalizedStats[activePropertyType]?.prixMoyen)}€</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">€/m²</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNumber(normalizedStats[activePropertyType]?.prixM2Moyen)}
                      </p>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Map Controls */}
      <div className="fixed bottom-20 right-5 flex flex-col gap-2 z-50">
        <div className="bg-white rounded-lg shadow-md flex flex-col">
          <button onClick={handleZoomIn} className="p-2 hover:bg-gray-100 rounded-t-lg flex items-center justify-center text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="border-t border-gray-200"></div>
          <button onClick={handleZoomOut} className="p-2 hover:bg-gray-100 rounded-b-lg flex items-center justify-center text-gray-700">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        <button
          onClick={toggleMapStyle}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center text-gray-700"
          title={is3DView ? 'Passer en vue 2D' : 'Passer en vue 3D'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M7.5 4.21l4.5 2.6M7.5 19.79V14.6L3 12M16.5 4.21V9.4L21 12M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
          </svg>
        </button>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="h-full w-full pb-2" />
    </div>
  );
};

export default PropertyMap;
