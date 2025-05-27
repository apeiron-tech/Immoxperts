import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { TrendingUp } from 'lucide-react';

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
    [key: string]: string | undefined;
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
  const { numero, nomVoie, coordinates } = searchParams;
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const mutationCache = useRef<Map<string, Property[]>>(new Map());
  const [propertyStats, setPropertyStats] = useState<PropertyStats[]>([]);
  const [activePropertyType, setActivePropertyType] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const hoveredId = useRef<string | null>(null);
  const selectedId = useRef<string | null>(null);

  const TILESET_ID = 'saber5180.0h0q6jw3';
  const SOURCE_LAYER = 'cadastre-2A2-Parcelles-2s9utu';
  const LAYER_ID = 'parcels-interactive-layer';

  const typeNames: string[] = ['Appartement', 'Maison', 'Local', 'Terrain', 'Bien Multiple'];

  const getShortTypeName = (typeBien: string): string => {
    const names: Record<string, string> = {
      Appartement: 'Appartement',
      Maison: 'Maison',
      'Local industriel. commercial ou assimilé': 'Local',
      Terrain: 'Terrain',
      'Bien Multiple': 'Bien Multiple',
    };
    return names[typeBien] || typeBien.split(' ')[0];
  };

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
    if (coordinates && map.current && isValidCoordinates(coordinates)) {
      map.current.flyTo({
        center: coordinates,
        zoom: 17,
      });
    }
  }, [coordinates]);

  useEffect(() => {
    if (numero && nomVoie) {
      handleAddressClick({ numero, nomVoie });
    }
  }, [numero, nomVoie]);

  useEffect(() => {
    if (!map.current) return;

    const fetchMutations = async (street: string, commune: string): Promise<void> => {
      try {
        const response = await axios.get('https://immoxperts.apeiron-tech.dev/api/mutations/by-street-and-commune', {
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

  const fetchAddressData = async (properties: SearchParams): Promise<Property[]> => {
    try {
      const streetNumber = normalizeSearchParams(properties.numero?.toString() || '');
      const streetName = normalizeSearchParams(properties.nomVoie || '');

      if (!streetNumber || !streetName) {
        throw new Error("Données d'adresse incomplètes");
      }

      const cacheKey = getMutationCacheKey(properties);
      if (mutationCache.current.has(cacheKey)) {
        return mutationCache.current.get(cacheKey) || [];
      }

      const params = new URLSearchParams({
        novoie: streetNumber.replace(/\D/g, ''),
        voie: streetName,
      });

      params.append('_t', Date.now().toString());

      const response = await fetch(`https://immoxperts.apeiron-tech.dev/api/mutations/search?${params}`);

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
      console.error('Erreur:', fetchError);
      return [];
    }
  };

  const handleAddressClick = async (properties: SearchParams): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const formattedProperties = await fetchAddressData(properties);

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

  const createHoverPopupContent = async (properties: SearchParams): Promise<HTMLElement> => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'flex items-center justify-center';
    container.appendChild(loadingIndicator);

    const formattedProperties = await fetchAddressData(properties);
    const getPropertyTypeColor = (type: string): string => {
      const colorMap: Record<string, string> = {
        appartement: '#4F46E5',
        'local industriel commercial ou assimile': '#8B5CF6',
        terrain: '#60A5FA',
        'bien multiple': '#2563EB',
        maison: '#1E3A8A',
      };
      return colorMap[type.toLowerCase().trim()] || '#9CA3AF';
    };

    if (formattedProperties.length > 0) {
      container.innerHTML = '';

      const property = formattedProperties[0];

      const propertyTypeLabel = property.type
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      const cityName = property.city.split(' ')[1] || '';

      const priceFormatted = property.numericPrice.toLocaleString('fr-FR') + ' €';
      const pricePerSqm = Math.round(property.numericPrice / property.numericSurface).toLocaleString('fr-FR') + ' €/m²';
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
          ${property.address.toUpperCase()} – ${cityName}
        </div>

        <!-- Property Type, Rooms, Surface -->
        <div style="font-size: 16px;width:70%; color: #333;">
          <span style="color: ${getPropertyTypeColor(propertyTypeLabel)}; font-weight: 900; margin-bottom: 10px;">
            ${propertyTypeLabel}
          </span><br/>
          <span style="margin-top: 10px;">${property.rooms} pièces – ${property.surface}</span>
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
          Vendu le <strong style="color: #000;">${formatFrenchDate(property.soldDate)}</strong>
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
        cityName = rawCity?.split(' ')[1] || '';
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
            ${properties.numero}  ${properties.nomVoie}
            </div>

            <!-- No sales message -->
            <div style="font-size: 14px; color: #333; margin-top: 8px;">
                Aucune vente identifiée à cette adresse
            </div>
        </div>`;
    }

    return container;
  };

  const createPopupContent = (features: mapboxgl.MapboxGeoJSONFeature[]): HTMLElement => {
    const container = document.createElement('div');
    container.className = 'popup-container';

    const title = document.createElement('h3');
    title.className = 'popup-title';
    title.textContent = `choisissez une Adresse`;

    const content = document.createElement('div');
    content.className = 'popup-content';

    features.forEach(feature => {
      const button = document.createElement('button');
      button.className = 'popup-item';
      button.innerHTML = `
        <span class="address-number">${feature.properties?.numero || 'N/A'}</span>
        <span class="address-street">${(feature.properties?.nomVoie || '').toUpperCase()}</span>
      `;

      button.addEventListener('click', e => {
        e.stopPropagation();
        handleAddressClick({
          numero: feature.properties?.numero,
          nomVoie: feature.properties?.nomVoie,
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

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/saber5180/cmawpgdtd007301sc5ww48tds',
        center: [8.73692, 41.9281],
        zoom: 17,
        attributionControl: false,
      });

      map.current.on('error', e => {
        setError('Une erreur est survenue avec la carte');
      });

      map.current.on('moveend', () => {
        const center = map.current?.getCenter();
        if (center && typeof onMapMove === 'function') {
          onMapMove([center.lng, center.lat]);
        }
      });

      map.current.on('load', () => {
        try {
          map.current?.addSource('parcels-source', {
            type: 'vector',
            url: `mapbox://${TILESET_ID}`,
          });

          map.current?.addLayer({
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

          const layers = map.current?.getStyle().layers || [];
          const visibleLayers = layers.filter(layer => layer.type === 'circle' && layer.layout?.visibility !== 'none');

          setActiveLayers(visibleLayers.map(l => l.id));

          visibleLayers.forEach(({ id: layerId }) => {
            map.current?.on('click', layerId, e => {
              hoverPopup.current?.remove();
              popup.current?.remove();
              popup.current = new mapboxgl.Popup({ offset: 25, closeOnClick: false })
                .setLngLat(e.lngLat)
                .setDOMContent(createPopupContent(e.features || []))
                .addTo(map.current);
            });

            map.current?.on('mouseenter', layerId, e => {
              if (!e.features || e.features.length === 0) return;
              const canvas = map.current?.getCanvas();
              if (canvas) {
                canvas.style.cursor = 'pointer';
              }
            });

            map.current?.on('mouseleave', layerId, () => {
              const canvas = map.current?.getCanvas();
              if (canvas) {
                canvas.style.cursor = '';
              }
            });
          });
        } catch (mapError) {
          setError('Erreur lors du chargement des couches de la carte');
        }
      });

      return () => {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
        popup.current?.remove();
      };
    } catch (initError) {
      setError("Erreur lors de l'initialisation de la carte");
    }
  }, []);

  const toggleStatsPanel = (): void => {
    setShowStatsPanel(prev => !prev);
  };

  const getActiveStats = () => {
    const typeName = typeNames[activePropertyType]?.replace(/\./g, '').trim();

    return propertyStats.find(stat => stat.typeBien.replace(/\./g, '').trim() === typeName) || { nombre: 0, prixMoyen: 0, prixM2Moyen: 0 };
  };
  const activeStats = getActiveStats();

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const statsByShortType: Record<string, PropertyStats> = {};
  propertyStats.forEach(stat => {
    const shortName = getShortTypeName(stat.typeBien);
    statsByShortType[shortName] = stat;
  });

  useEffect(() => {
    mutationCache.current.clear();
  }, [currentCity]);

  // Clear mutation cache when city changes
  useEffect(() => {
    mutationCache.current.clear();
  }, [currentCity]);

  // Clear mutation cache when component unmounts
  useEffect(() => {
    return () => {
      mutationCache.current.clear();
    };
  }, []);

  return (
    <div className="relative h-screen w-full">
      <button
        onClick={() => {
          if (!showStatsPanel) {
            setActivePropertyType(0);
          }
          toggleStatsPanel();
        }}
        className="absolute top-4 left-6 z-20 bg-white text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1 text-xs hover:bg-gray-50"
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

      {showStatsPanel && (
        <div
          className="absolute top-4 left-16 z-10 bg-white rounded-xl shadow-lg p-4 w-[448px] border border-gray-100"
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

            const normalizedStats = propertyTypeNames.map(shortName => {
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
                <div className="flex mb-3 gap-1">
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
                  <div className="grid grid-cols-3 gap-2">
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

      {/* Controls */}

      <div className="absolute top-20 right-5 flex flex-col gap-2 z-10">
        <div className="bg-white rounded-lg shadow-md flex flex-col">
          <button onClick={() => map.current?.zoomIn()} className="p-2 hover:bg-gray-100 rounded-t-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
          <div className="border-t"></div>
          <button onClick={() => map.current?.zoomOut()} className="p-2 hover:bg-gray-100 rounded-b-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => map.current?.setStyle('mapbox://styles/saber5180/cm9737hvv00en01qzefcd57b7')}
          className="bg-white p-2 rounded-lg shadow-md hover:bg-gray-100 flex items-center justify-center"
          title="Changer le style de la carte"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <path d="M7.5 4.21l4.5 2.6M7.5 19.79V14.6L3 12M16.5 4.21V9.4L21 12M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
          </svg>
        </button>
      </div>

      <div ref={mapContainer} className="h-full w-full" />

      {loading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg flex items-center shadow-xl">
            <svg className="animate-spin h-5 w-5 mr-3 text-blue-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-gray-700">Recherche des propriétés...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;
