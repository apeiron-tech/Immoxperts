import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

interface LocationInfo {
  address: string;
  coordinates: {
    lng: number;
    lat: number;
  };
  properties?: any;
}

interface AddressParts {
  novoie: number;
  typvoie: string;
  voie: string;
}

interface Property {
  id: string;
  address: string;
  city: string;
  price: number;
  pricePerSqm: number;
  type: string;
  surface: number;
  rooms: number;
  soldDate: string;
  terrain: number;
}

interface MapProps {
  onPropertiesFound: (properties: Property[]) => void;
}

const TILESETS = {
  propertyPoints: 'mapbox://saber5180.04zpged2',
  buildingFootprints: 'mapbox://saber5180.diuw7cff',
  landRegistry: 'mapbox://saber5180.d5qqez0z',
  zoningAreas: 'mapbox://saber5180.8uxijcan',
  utilities: 'mapbox://saber5180.3hj4ajw4',
  transportation: 'mapbox://saber5180.d404w5bg',
} as const;

const Map: React.FC<MapProps> = ({ onPropertiesFound }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [is3D, setIs3D] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const clickListenerRef = useRef<((e: mapboxgl.MapMouseEvent) => void) | null>(null);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cm8uhol1600ih01sa3d3d2xjw',
      center: [8.73692, 41.9281],
      zoom: 17,
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.on('load', () => {
      // Add your custom layer
      map.addLayer({
        id: 'property-points',
        type: 'circle',
        source: 'your-tileset-name',
        'source-layer': 'your-source-layer',
        paint: {
          'circle-radius': 6,
          'circle-color': '#ff0000',
        },
      });

      // Add interactivity
      addLayerInteractivity(map);
    });

    map.on('load', () => {
      // Add green areas (gardens, parks, grass)
      map.addLayer({
        id: 'green-areas',
        type: 'fill',
        source: 'composite',
        'source-layer': 'landuse',
        filter: ['match', ['get', 'class'], ['grass', 'garden', 'park'], true, false],
        paint: {
          'fill-color': '#e8f5e9',
          'fill-opacity': 0.7,
        },
      });

      // Add gray paths
      map.addLayer({
        id: 'gray-paths',
        type: 'line',
        source: 'composite',
        'source-layer': 'road',
        filter: ['match', ['get', 'class'], ['path', 'footway', 'pedestrian'], true, false],
        paint: {
          'line-color': '#616161',
          'line-width': 1,
          'line-opacity': 0.8,
        },
      });

      // Property boundaries layer
      map.addLayer({
        id: 'property-boundaries',
        type: 'line',
        source: 'composite',
        'source-layer': 'building',
        paint: {
          'line-color': '#4a4a4a',
          'line-width': 1,
          'line-opacity': 0.8,
        },
      });

      // Add subtle water styling
      map.setPaintProperty('water', 'fill-color', '#e0f7fa');

      // Load initial address points when map is ready
      map.once('idle', () => {
        loadNearbyAddresses();
      });
    });

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const addLayerInteractivity = (map: mapboxgl.Map): void => {
    // Click handler
    map.on('click', 'property-points', e => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `
          <h3>${e.features[0].properties.title}</h3>
          <p>${e.features[0].properties.description}</p>
        `,
        )
        .addTo(map);
    });

    // Hover effects
    map.on('mouseenter', 'property-points', () => {
      map.getCanvas().style.cursor = 'pointer';
      map.setPaintProperty('property-points', 'circle-color', '#00ff00');
    });

    map.on('mouseleave', 'property-points', () => {
      map.getCanvas().style.cursor = '';
      map.setPaintProperty('property-points', 'circle-color', '#ff0000');
    });
  };

  const normalizeText = (text: string): string => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ç]/g, 'c')
      .toUpperCase();
  };

  const parseAddress = (address: string): AddressParts | null => {
    try {
      const regex = /(\d+)\s+([A-Za-z\.]{1,}\.?)\s+([A-Za-z\s\-]+)/i;
      const match = address.match(regex);

      if (match && match.length >= 4) {
        let typvoie = match[2].trim().toUpperCase();

        const typeMapping: Record<string, string> = {
          COURS: 'CRS',
          BOULEVARD: 'BD',
          AVENUE: 'AV',
          RUE: 'RUE',
          PLACE: 'PL',
          PASSAGE: 'PASS',
          IMPASSE: 'IMP',
          ALLEE: 'ALL',
          CHEMIN: 'CHE',
          ROUTE: 'RTE',
          SQUARE: 'SQ',
          QUAI: 'QUAI',
        };

        typvoie = typeMapping[typvoie] || typvoie;

        return {
          novoie: parseInt(match[1], 10),
          typvoie,
          voie: match[3].trim().toUpperCase(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing address:', error);
      return null;
    }
  };

  const searchMutations = async (addressParts: AddressParts): Promise<any[]> => {
    try {
      console.log('Searching for:', addressParts);
      const response = await axios.get('http://localhost:8080/api/mutations/search', {
        params: { ...addressParts },
      });

      if (!response.data || response.data.length === 0) {
        console.warn('No addresses found for this location.');
      }

      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  };

  const transformMutationsToProperties = (mutations: any[]): Property[] => {
    return mutations.map(mutation => ({
      id: mutation.idmutation,
      address: mutation.addresses[0].split(' ').slice(0, -2).join(' '),
      city: mutation.addresses[0].split(' ').slice(-2).join(' '),
      price: Math.round(mutation.valeurfonc),
      pricePerSqm: Math.round(mutation.valeurfonc / (mutation.surface || 1)),
      type: mutation.libtyplocList[0] || 'Bien immobilier',
      surface: mutation.surface || 0,
      rooms: mutation.nbpprincTotal || 0,
      soldDate: new Date(mutation.datemut).toLocaleDateString('fr-FR'),
      terrain: mutation.terrain || 0,
    }));
  };

  const handleAddressClick = async (addressData: LocationInfo): Promise<void> => {
    try {
      setLoading(true);
      setLocationInfo(addressData);

      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({
        color: '#FF0000',
        scale: 1.1,
      })
        .setLngLat([addressData.coordinates.lng, addressData.coordinates.lat])
        .addTo(mapRef.current);

      const normalizedAddress = normalizeText(addressData.address);
      const addressParts = parseAddress(normalizedAddress);

      if (addressParts) {
        const mutations = await searchMutations(addressParts);
        if (mutations && mutations.length > 0) {
          const properties = transformMutationsToProperties(mutations);
          onPropertiesFound(properties);
        } else {
          onPropertiesFound([]);
        }
      } else {
        onPropertiesFound([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error handling address click:', error);
      setLoading(false);
      onPropertiesFound([]);
    }
  };

  const loadNearbyAddresses = async (): Promise<void> => {
    if (!mapRef.current) return;

    setLoading(true);
    clearMarkers();

    try {
      const bounds = mapRef.current.getBounds();
      const center = mapRef.current.getCenter();

      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/address.json?` +
          new URLSearchParams({
            access_token: mapboxgl.accessToken,
            types: 'address',
            proximity: `${center.lng},${center.lat}`,
            limit: '40',
            country: 'FR',
          }),
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        data.features.forEach((feature: any, index: number) => {
          const el = document.createElement('div');

          let houseNumber = index + 1;
          const addressMatch = feature.place_name.match(/^(\d+)/);
          if (addressMatch && addressMatch[1]) {
            houseNumber = addressMatch[1];
          }

          el.className = 'address-marker';
          el.style.backgroundColor = is3D ? '#3b82f6' : '#4169E1';
          el.style.color = 'white';
          el.style.borderRadius = '4px';
          el.style.width = '24px';
          el.style.height = '24px';
          el.style.display = 'flex';
          el.style.justifyContent = 'center';
          el.style.alignItems = 'center';
          el.style.fontSize = '12px';
          el.style.fontWeight = 'bold';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.style.cursor = 'pointer';
          el.style.userSelect = 'none';
          el.innerText = String(houseNumber);

          const marker = new mapboxgl.Marker({
            element: el,
          })
            .setLngLat(feature.center)
            .addTo(mapRef.current);

          el.addEventListener('mouseenter', () => {
            el.style.backgroundColor = is3D ? '#2563eb' : '#3047a3';
            el.style.transform = 'translateY(-1px)';
          });

          el.addEventListener('mouseleave', () => {
            el.style.backgroundColor = is3D ? '#3b82f6' : '#4169E1';
            el.style.transform = 'translateY(0)';
          });

          el.addEventListener('mousedown', () => {
            el.style.transform = 'translateY(1px)';
          });

          el.addEventListener('mouseup', () => {
            el.style.transform = 'translateY(0)';
          });

          el.addEventListener('click', () => {
            handleAddressClick({
              address: feature.place_name,
              coordinates: {
                lng: feature.center[0],
                lat: feature.center[1],
              },
              properties: feature.properties,
            });
          });

          markersRef.current.push(marker);
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setLoading(false);
    }
  };

  const clearMarkers = (): void => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  const updateMarkerStyles = (): void => {
    markersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.backgroundColor = is3D ? '#3b82f6' : '#4169E1';
    });
  };

  const toggle3D = (): void => {
    setIs3D(!is3D);
  };

  return (
    <div className="relative h-full w-full bg-gray-50">
      <div ref={mapContainer} className="h-full w-full rounded-lg" />

      <style>
        {`
          .address-marker {
            transition: all 0.2s ease;
          }
          .address-marker:hover {
            transform: scale(1.2);
          }
        `}
      </style>

      <button
        onClick={toggle3D}
        className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-gray-200"
      >
        <svg
          className={`w-5 h-5 transition-transform ${is3D ? 'text-blue-600 rotate-45' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
        <span className="font-medium text-sm">{is3D ? '2D View' : '3D View'}</span>
      </button>

      <button
        onClick={loadNearbyAddresses}
        className="absolute top-4 right-32 bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 border border-gray-200"
      >
        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="font-medium text-sm">Refresh Addresses</span>
      </button>

      {locationInfo && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-xl border border-gray-200">
          <div className="text-center space-y-1">
            <div className="font-bold text-lg text-gray-900">{locationInfo.address}</div>
            <div className="text-sm text-gray-600 font-medium">
              {locationInfo.coordinates.lng.toFixed(5)}, {locationInfo.coordinates.lat.toFixed(5)}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p className="text-gray-700">Recherche de biens...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
