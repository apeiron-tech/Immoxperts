import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FiZXI1MTgwIiwiYSI6ImNtOGhqcWs4cTAybnEycXNiaHl6eWgwcjAifQ.8C8bv3cwz9skLXv-y6U3FA';

interface MapRef {
  current: mapboxgl.Map | null;
}

interface MapContainerRef {
  current: HTMLDivElement | null;
}

const AddressHighlighter: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const ADRESSE_CIBLE = '10 RUE HYACINTHE CAMPIGLIA';

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cm8uhol1600ih01sa3d3d2xjw',
      center: [8.73692, 41.9281], // Coordonnées d'Ajaccio
      zoom: 16,
    });

    map.current.on('load', () => {
      // Recherche dans la couche adresses-cadastec-2b.org/da
      const features = map.current?.querySourceFeatures('adresses-cadastec-2b.org/da', {
        filter: ['all', ['==', 'numero', '10'], ['==', 'nomVide', 'HYACINTHE CAMPIGLIA']],
      });

      if (features && features.length > 0) {
        const geometry = features[0].geometry;
        if (geometry.type === 'Point') {
          const coordinates = geometry.coordinates;

          // Ajout du cercle
          map.current?.addLayer({
            id: 'circle',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates,
                },
                properties: {}, // Add empty properties object
              },
            },
            paint: {
              'circle-radius': 100,
              'circle-color': '#B42222',
              'circle-opacity': 0.2,
            },
          });
        }
      } else {
        console.warn('Adresse non trouvée dans la couche');
      }
    });

    return () => map.current?.remove();
  }, []);

  return (
    <div>
      <div ref={mapContainer} className="h-screen w-full" />
      <div className="address-info">Recherche : {ADRESSE_CIBLE} - Cercle de 25m de rayon</div>
    </div>
  );
};

export default AddressHighlighter;
