import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import './styles/mapbox-popup.css';
import 'mapbox-gl/dist/mapbox-gl.css';

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
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/saber5180/cm8uhol1600ih01sa3d3d2xjw',
      center: [8.73692, 41.9281], // Coordonnées d'Ajaccio
      zoom: 16,
    });

    map.current.on('load', () => {
      // Recherche dans la couche adresses-cadastec-2b.org/da
      const features = map.current.querySourceFeatures('adresses-cadastec-2b.org/da', {
        filter: ['all', ['==', 'numero', '10'], ['==', 'nomVide', 'HYACINTHE CAMPIGLIA']],
      });

      if (features.length > 0) {
        const feature = features[0];
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        // Ajout du cercle
        map.current.addLayer({
          id: 'selected-address-circle',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates,
              },
              properties: {},
            },
          },
          paint: {
            'circle-radius': 25,
            'circle-color': 'rgba(0, 255, 0, 0.3)',
            'circle-stroke-color': 'rgba(0, 255, 0, 0.8)',
            'circle-stroke-width': 2,
          },
        });

        // Centrage sur l'adresse
        map.current.flyTo({
          center: coordinates,
          zoom: 18,
        });
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
