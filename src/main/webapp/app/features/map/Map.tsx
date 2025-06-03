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
      map.on('load', () => {
        // Add your tileset source
        map.addSource('your-tileset-name', {
          type: 'vector',
          url: 'mapbox://your-username.tileset-id',
        });

        // Add layer using this source
        map.addLayer(
          {
            id: 'custom-layer',
            type: 'fill', // or circle, line, etc.
            source: 'your-tileset-name',
            'source-layer': 'your-source-layer-name', // Check in Studio
            paint: {
              'fill-color': '#ff0000',
              'fill-opacity': 0.5,
            },
          },
          'road-label',
        ); // Add before road labels
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
  const addLayerInteractivity = map => {
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
  // Normalize text by removing accents/diacritics
  const normalizeText = text => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[ç]/g, 'c')
      .toUpperCase();
  };

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.on('click', 'your-layer-name', e => {
      const features = mapRef.current.queryRenderedFeatures(e.point, {
        layers: ['your-layer-name'],
      });

      if (features.length > 0) {
        console.log('Clicked feature:', features[0].properties);
        // Add your click handling logic here
      }
    });
    // Add hover effect
    mapRef.current.on('mouseenter', 'your-layer-name', () => {
      mapRef.current.getCanvas().style.cursor = 'pointer';
    });

    mapRef.current.on('mouseleave', 'your-layer-name', () => {
      mapRef.current.getCanvas().style.cursor = '';
    });
    mapRef.current.on('load', () => {
      console.log('Available sources:', mapRef.current.getStyle().sources);
      console.log('Available layers:', mapRef.current.getStyle().layers);
    });
  }, []);
  // Handle 3D mode changes separately
  useEffect(() => {
    if (!mapRef.current) return;

    // Update map view settings for 3D
    mapRef.current.easeTo({
      pitch: is3D ? 60 : 0,
      bearing: is3D ? -30 : 0,
      duration: 1000,
    });

    // Add or remove 3D buildings layer based on 3D mode
    if (is3D && !mapRef.current.getLayer('3d-buildings')) {
      // Make sure the map is fully loaded
      if (mapRef.current.isStyleLoaded()) {
        add3DBuildings();
      } else {
        mapRef.current.once('styledata', add3DBuildings);
      }
    } else if (!is3D && mapRef.current.getLayer('3d-buildings')) {
      mapRef.current.removeLayer('3d-buildings');
    }

    // Update property boundaries style based on 3D mode
    if (mapRef.current.getLayer('property-boundaries')) {
      mapRef.current.setPaintProperty('property-boundaries', 'line-color', is3D ? '#ffffff' : '#4a4a4a');
      mapRef.current.setPaintProperty('property-boundaries', 'line-width', is3D ? 2 : 1);
    }

    // Update existing markers to match the current style
    updateMarkerStyles();

    function add3DBuildings() {
      if (!mapRef.current.getLayer('3d-buildings')) {
        mapRef.current.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          paint: {
            'fill-extrusion-color': '#ddd',
            'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
            'fill-extrusion-opacity': 0.6,
          },
        });
      }
    }
  }, [is3D]);

  // Load nearby addresses
  const loadNearbyAddresses = async () => {
    if (!mapRef.current) return;

    setLoading(true);
    clearMarkers();

    try {
      // Get current map bounds
      const bounds = mapRef.current.getBounds();
      const center = mapRef.current.getCenter();

      // Use the Mapbox API to find nearby addresses
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/address.json?` +
          new URLSearchParams({
            access_token: mapboxgl.accessToken,
            types: 'address',
            proximity: `${center.lng},${center.lat}`,
            limit: '40', // Convert to string
            country: 'FR',
          }),
      );

      const data = await response.json();

      // Create markers for each address
      if (data.features && data.features.length > 0) {
        data.features.forEach((feature, index) => {
          // Create marker element
          const el = document.createElement('div');

          // Extract house number from address
          let houseNumber = index + 1;
          const addressMatch = feature.place_name.match(/^(\d+)/);
          if (addressMatch && addressMatch[1]) {
            houseNumber = addressMatch[1];
          }

          // Style the marker
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
          el.innerText = houseNumber;

          // Create marker
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
          // Add click handler
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

          // Store marker reference
          markersRef.current.push(marker);
        });
      }

      setLoading(false);
    } catch (error) {
      console.error('Error loading addresses:', error);
      setLoading(false);
    }
  };

  // Clear all markers
  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  };

  // Update marker styles
  const updateMarkerStyles = () => {
    markersRef.current.forEach(marker => {
      const el = marker.getElement();
      el.style.backgroundColor = is3D ? '#3b82f6' : '#4169E1';
    });
  };

  // Handle address marker click
  const handleAddressClick = async addressData => {
    try {
      setLoading(true);
      setLocationInfo(addressData);

      // Highlight the clicked address
      if (markerRef.current) markerRef.current.remove();

      markerRef.current = new mapboxgl.Marker({
        color: '#FF0000',
        scale: 1.1,
      })
        .setLngLat([addressData.coordinates.lng, addressData.coordinates.lat])
        .addTo(mapRef.current);

      // Parse address without accents
      const normalizedAddress = normalizeText(addressData.address);
      const addressParts = parseAddress(normalizedAddress);

      if (addressParts) {
        // Call the API to search for mutations (without accents)
        const mutations = await searchMutations(addressParts);
        if (mutations && mutations.length > 0) {
          // Transform mutations into property format and pass to parent component
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

  // Set up click handler for map
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing click handler if exists
    if (clickListenerRef.current) {
      mapRef.current.off('click', clickListenerRef.current);
    }

    // Create new click handler
    const handleClick = async e => {
      try {
        setLoading(true);
        if (markerRef.current) markerRef.current.remove();

        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?` +
            new URLSearchParams({
              access_token: mapboxgl.accessToken,
              types: 'address', // Remove POIs
              country: 'FR', // Restrict to France
              language: 'fr',
              limit: '1', // Convert to string
            }),
        );

        const data = await response.json();
        const feature = data.features[0];

        if (feature) {
          const address = feature.properties.address
            ? `${feature.properties.address} ${feature.text}`.toUpperCase()
            : feature.place_name.toUpperCase();

          // Normalize the address (remove accents)
          const normalizedAddress = normalizeText(address);

          setLocationInfo({
            address: normalizedAddress,
            coordinates: e.lngLat,
          });

          markerRef.current = new mapboxgl.Marker({
            color: is3D ? '#3b82f6' : '#FF0000',
            scale: 0.9,
          })
            .setLngLat(e.lngLat)
            .addTo(mapRef.current);

          // Parse address to get street number and name (with normalized text)
          const addressParts = parseAddress(normalizedAddress);
          if (addressParts) {
            // Call the API to search for mutations
            const mutations = await searchMutations(addressParts);
            if (mutations && mutations.length > 0) {
              // Transform mutations into property format and pass to parent component
              const properties = transformMutationsToProperties(mutations);
              onPropertiesFound(properties);
            } else {
              onPropertiesFound([]);
            }
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
        onPropertiesFound([]);
      }
    };

    // Save reference to handler and add to map
    clickListenerRef.current = handleClick;
    mapRef.current.on('click', handleClick);

    return () => {
      if (mapRef.current && clickListenerRef.current) {
        mapRef.current.off('click', clickListenerRef.current);
      }
    };
  }, [is3D, onPropertiesFound]);

  // Parse address to extract street number, type, and name
  const parseAddress = address => {
    try {
      // Enhanced regex to better capture French address formats
      const regex = /(\d+)\s+([A-Za-z\.]{1,}\.?)\s+([A-Za-z\s\-]+)/i;
      const match = address.match(regex);

      if (match && match.length >= 4) {
        let typvoie = match[2].trim().toUpperCase();

        // Convert abbreviations to full names for API
        const typeMapping = {
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

        // Use the mapping if available
        typvoie = typeMapping[typvoie] || typvoie;

        return {
          novoie: parseInt(match[1], 10),
          typvoie: typvoie,
          voie: match[3].trim().toUpperCase(),
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing address:', error);
      return null;
    }
  };

  const searchMutations = async addressParts => {
    try {
      console.log('Searching for:', addressParts);
      const response = await axios.get('http://localhost:8080/api/mutations/search', {
        params: { ...addressParts }, // Parameters without accents
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

  // Transform mutations into property format for display
  const transformMutationsToProperties = mutations => {
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

  const toggle3D = () => {
    setIs3D(!is3D);
  };

  return (
    <div className="relative h-screen w-screen bg-gray-50">
      <div ref={mapContainer} className="h-full w-full" />

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
