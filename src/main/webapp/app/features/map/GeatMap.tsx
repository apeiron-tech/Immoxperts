import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { API_ENDPOINTS } from 'app/config/api.config';

const TILE_BASE = API_ENDPOINTS.geatmapTiles;

// Use same token as PropertyMap
mapboxgl.accessToken = 'pk.eyJ1IjoiaW1tb3hwZXJ0IiwiYSI6ImNtZXV3bGtyNzBiYmQybXNoMnE5NmUzYWsifQ.mGxg2EbZxRAQJ4sOapI63w';

// Backend tiles: put regions.mbtiles, departements.mbtiles, communes.mbtiles in ./tiles folder
const GEATMAP_REGIONS_SOURCE = 'geatmap-regions';
const GEATMAP_REGIONS_LAYER = 'geatmap-regions-fill';
const REGION_CLICKED_COLOR = '#2563eb';
const REGION_DEFAULT_COLOR = '#7c3aed';

const GEATMAP_DEPARTEMENTS_SOURCE = 'geatmap-departements';
const GEATMAP_DEPARTEMENTS_LAYER = 'geatmap-departements-fill';
const DEPARTEMENT_DEFAULT_COLOR = '#059669';
const DEPARTEMENT_CLICKED_COLOR = '#2563eb';

const GEATMAP_COMMUNES_SOURCE = 'geatmap-communes';
const GEATMAP_COMMUNES_LAYER = 'geatmap-communes-fill';
const COMMUNE_DEFAULT_COLOR = '#0d9488';
const COMMUNE_CLICKED_COLOR = '#2563eb';

type DrillLevel = 'regions' | 'departements' | 'communes';

interface GeatMapProps {
  onCommuneSelect?: (codeInsee: string, nom: string) => void;
  className?: string;
}

const FRANCE_CENTER: [number, number] = [2.2137, 46.2276];
const FRANCE_ZOOM = 5.5;

function propString(props: Record<string, unknown> | undefined, key: string): string {
  const v = props?.[key];
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  return '';
}

const GeatMap: React.FC<GeatMapProps> = ({ onCommuneSelect, className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [level, setLevel] = useState<DrillLevel>('regions');
  const [zoom, setZoom] = useState(FRANCE_ZOOM);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const setLevelRef = useRef(setLevel);
  const setZoomRef = useRef(setZoom);
  const clickedRegionCodeRef = useRef<string | null>(null);
  const clickedDepartementCodeRef = useRef<string | null>(null);
  const clickedCommuneCodeRef = useRef<string | null>(null);
  const regionSourceLayerRef = useRef<string>('regions');
  const deptSourceLayerRef = useRef<string>('departements');
  const communeSourceLayerRef = useRef<string>('communes');
  setLevelRef.current = setLevel;
  setZoomRef.current = setZoom;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Use a standard Mapbox base style so we don't load custom tilesets (avoids 404 and sizerank errors).
    // Admin layers (regions, départements, communes) come from our backend only.
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: FRANCE_CENTER,
      zoom: FRANCE_ZOOM,
      minZoom: 4,
      maxZoom: 10,
    });

    map.showTileBoundaries = false;
    map.showCollisionBoxes = false;

    mapRef.current = map;

    map.on('error', (e: mapboxgl.ErrorEvent) => {
      const msg = e.error?.message ?? 'Map error';
      // Don't show "Unimplemented type: 3" in UI — backend now decompresses gzip tiles; clear cache and refresh if it persists
      if (msg.includes('Unimplemented type: 3')) return;
      setMapError(msg);
    });

    map.on('load', async () => {
      setMapLoaded(true);
      setMapError(null);

      // Update zoom and level state on zoom changes
      map.on('zoom', () => {
        const z = map.getZoom();
        setZoomRef.current(z);
        // Update level based on zoom
        if (z < 6) {
          setLevelRef.current('regions');
        } else {
          setLevelRef.current('departements');
        }
      });

      // Fetch metadata to get correct source-layer names (mbtiles often use "regions", "departements", "communes" not "default")
      type TileJSON = { vector_layers?: Array<{ id: string }> };
      let metadataMissing = false;
      const getLayerName = async (layer: string, fallback: string): Promise<string> => {
        try {
          const res = await fetch(`${TILE_BASE}/metadata/${layer}`);
          if (!res.ok) {
            metadataMissing = true;
            return fallback;
          }
          const json = (await res.json()) as TileJSON;
          const id = json?.vector_layers?.[0]?.id;
          return typeof id === 'string' ? id : fallback;
        } catch {
          metadataMissing = true;
          return fallback;
        }
      };
      const [regionsSourceLayer, deptsSourceLayer, communesSourceLayer] = await Promise.all([
        getLayerName('regions', 'regions'),
        getLayerName('departements', 'departements'),
        getLayerName('communes', 'communes'),
      ]);
      regionSourceLayerRef.current = regionsSourceLayer;
      deptSourceLayerRef.current = deptsSourceLayer;
      communeSourceLayerRef.current = communesSourceLayer;
      if (metadataMissing) {
        setMapError(
          'Fichiers .mbtiles introuvables. Copiez regions.mbtiles, departements.mbtiles et communes.mbtiles dans le dossier tiles à la racine du projet, puis rechargez.',
        );
      }

      // Cache-bust so browser fetches fresh (decompressed) tiles after backend fix
      const tileVersion = 'v=2';
      // Add regions layer from our backend (promoteId: same as PropertyMap parcelle layer — enables setFeatureState, no tile-boundary seam)
      map.addSource(GEATMAP_REGIONS_SOURCE, {
        type: 'vector',
        tiles: [`${TILE_BASE}/regions/{z}/{x}/{y}?${tileVersion}`],
        minzoom: 0,
        maxzoom: 14,
        promoteId: 'code',
      });
      // Région reste visible au zoom (maxzoom 13) : quand on zoome sur les départements, le contour de la région ne disparaît pas
      map.addLayer({
        id: GEATMAP_REGIONS_LAYER,
        type: 'fill',
        source: GEATMAP_REGIONS_SOURCE,
        'source-layer': regionsSourceLayer,
        minzoom: 0,
        maxzoom: 13,
        paint: {
          // Quand cliqué : seulement le contour (bordure) en bleu, le remplissage reste discret
          'fill-color': ['case', ['boolean', ['feature-state', 'clicked'], false], REGION_DEFAULT_COLOR, REGION_DEFAULT_COLOR],
          'fill-opacity': ['case', ['boolean', ['feature-state', 'clicked'], false], 0.25, 0.65],
          'fill-outline-color': ['case', ['boolean', ['feature-state', 'clicked'], false], REGION_CLICKED_COLOR, 'rgba(0,0,0,0.5)'],
        },
      });

      // Region labels (visible from zoom 0 to 6) - only at region level
      map.addLayer({
        id: 'geatmap-regions-labels',
        type: 'symbol',
        source: GEATMAP_REGIONS_SOURCE,
        'source-layer': regionsSourceLayer,
        minzoom: 0,
        maxzoom: 6,
        layout: {
          'text-field': ['coalesce', ['get', 'nom'], ['get', 'name'], ['get', 'code']],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 14,
          'text-anchor': 'center',
          'text-justify': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      // Fallback for region labels if source-layer is wrong
      try {
        map.addLayer({
          id: 'geatmap-regions-labels-fallback',
          type: 'symbol',
          source: GEATMAP_REGIONS_SOURCE,
          'source-layer': 'regions',
          minzoom: 0,
          maxzoom: 6,
          layout: {
            'text-field': ['coalesce', ['get', 'nom'], ['get', 'name'], ['get', 'code']],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 14,
            'text-anchor': 'center',
            'text-justify': 'center',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
          },
        });
      } catch {
        // ignore if layer already exists
      }

      // Communes SOUS les départements (ajoutée en premier = dessinée en dessous)
      // promoteId pour setFeatureState, même concept que régions/départements
      let communesLayerName = communesSourceLayer;
      map.addSource(GEATMAP_COMMUNES_SOURCE, {
        type: 'vector',
        tiles: [`${TILE_BASE}/communes/{z}/{x}/{y}?${tileVersion}`],
        minzoom: 0,
        maxzoom: 14,
        promoteId: 'code',
      });
      try {
        map.addLayer({
          id: GEATMAP_COMMUNES_LAYER,
          type: 'fill',
          source: GEATMAP_COMMUNES_SOURCE,
          'source-layer': communesLayerName,
          minzoom: 6,
          maxzoom: 13,
          paint: {
            'fill-color': ['case', ['boolean', ['feature-state', 'clicked'], false], COMMUNE_CLICKED_COLOR, COMMUNE_DEFAULT_COLOR],
            'fill-opacity': 0.55,
            'fill-outline-color': ['case', ['boolean', ['feature-state', 'clicked'], false], 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)'],
          },
        });
      } catch {
        // Source layer name may be wrong (e.g. mbtiles uses "default" or "commune"); try fallbacks
        try {
          if (map.getLayer(GEATMAP_COMMUNES_LAYER)) map.removeLayer(GEATMAP_COMMUNES_LAYER);
        } catch {
          // ignore
        }
        try {
          map.removeSource(GEATMAP_COMMUNES_SOURCE);
        } catch {
          // ignore
        }
        map.addSource(GEATMAP_COMMUNES_SOURCE, {
          type: 'vector',
          tiles: [`${TILE_BASE}/communes/{z}/{x}/{y}?${tileVersion}`],
          minzoom: 0,
          maxzoom: 14,
          promoteId: 'code',
        });
        const fallbacks = ['communes', 'default', 'commune'];
        for (const name of fallbacks) {
          if (name === communesLayerName) continue;
          try {
            map.addLayer({
              id: GEATMAP_COMMUNES_LAYER,
              type: 'fill',
              source: GEATMAP_COMMUNES_SOURCE,
              'source-layer': name,
              minzoom: 6,
              maxzoom: 14,
              paint: {
                'fill-color': ['case', ['boolean', ['feature-state', 'clicked'], false], COMMUNE_CLICKED_COLOR, COMMUNE_DEFAULT_COLOR],
                'fill-opacity': 0.55,
                'fill-outline-color': ['case', ['boolean', ['feature-state', 'clicked'], false], 'rgba(0,0,0,0.6)', 'rgba(0,0,0,0.4)'],
              },
            });
            communesLayerName = name;
            communeSourceLayerRef.current = name;
            break;
          } catch {
            // try next
          }
        }
      }

      // Départements AU-DESSUS des communes (ajoutés après = dessinés par-dessus), maxzoom 14 pour rester visibles quand on zoome sur les communes
      map.addSource(GEATMAP_DEPARTEMENTS_SOURCE, {
        type: 'vector',
        tiles: [`${TILE_BASE}/departements/{z}/{x}/{y}?${tileVersion}`],
        minzoom: 0,
        maxzoom: 14,
        promoteId: 'code',
      });

      // Departments layer (visible from zoom 6)
      map.addLayer({
        id: GEATMAP_DEPARTEMENTS_LAYER,
        type: 'fill',
        source: GEATMAP_DEPARTEMENTS_SOURCE,
        'source-layer': deptsSourceLayer,
        minzoom: 6,
        maxzoom: 13,
        paint: {
          'fill-color': ['case', ['boolean', ['feature-state', 'clicked'], false], DEPARTEMENT_CLICKED_COLOR, DEPARTEMENT_DEFAULT_COLOR],
          'fill-opacity': ['case', ['boolean', ['feature-state', 'clicked'], false], 0.25, 0.6],
          'fill-outline-color': ['case', ['boolean', ['feature-state', 'clicked'], false], REGION_CLICKED_COLOR, 'rgba(0,0,0,0.5)'],
        },
      });

      // Department labels (visible from zoom 6 to 10) - only at department level
      map.addLayer({
        id: 'geatmap-departements-labels',
        type: 'symbol',
        source: GEATMAP_DEPARTEMENTS_SOURCE,
        'source-layer': deptsSourceLayer,
        minzoom: 6,
        maxzoom: 10,
        layout: {
          'text-field': ['coalesce', ['get', 'nom'], ['get', 'name'], ['get', 'code']],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 12,
          'text-anchor': 'center',
          'text-justify': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      // Fallback for department labels if source-layer is wrong
      try {
        map.addLayer({
          id: 'geatmap-departements-labels-fallback',
          type: 'symbol',
          source: GEATMAP_DEPARTEMENTS_SOURCE,
          'source-layer': 'departements',
          minzoom: 6,
          maxzoom: 10,
          layout: {
            'text-field': ['coalesce', ['get', 'nom'], ['get', 'name'], ['get', 'code']],
            'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
            'text-size': 12,
            'text-anchor': 'center',
            'text-justify': 'center',
          },
          paint: {
            'text-color': '#ffffff',
            'text-halo-color': '#000000',
            'text-halo-width': 1,
          },
        });
      } catch {
        // ignore if layer already exists
      }

      // Commune labels (visible from zoom 8)
      map.addLayer({
        id: 'geatmap-communes-labels',
        type: 'symbol',
        source: GEATMAP_COMMUNES_SOURCE,
        'source-layer': communeSourceLayerRef.current,
        minzoom: 8,
        maxzoom: 13,
        layout: {
          'text-field': ['get', 'nom'],
          'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
          'text-size': 10,
          'text-anchor': 'center',
          'text-justify': 'center',
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 1,
        },
      });

      map.on('mousemove', GEATMAP_REGIONS_LAYER, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', GEATMAP_REGIONS_LAYER, () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });

      map.on('click', GEATMAP_REGIONS_LAYER, (e: mapboxgl.MapMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const f = e.features[0];
        setMapError(null);

        const props = f.properties as Record<string, unknown>;
        const nom = propString(props, 'nom') || propString(props, 'name') || propString(props, 'code') || 'Région';
        const codeRegion = propString(props, 'code') || propString(props, 'code_region');
        if (!codeRegion) return;

        // Same approach as PropertyMap parcelle layer: setFeatureState on the tile layer (no separate highlight layer = no tile-boundary seam)
        if (clickedRegionCodeRef.current !== null) {
          try {
            map.setFeatureState(
              { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionsSourceLayer, id: clickedRegionCodeRef.current },
              { clicked: false },
            );
          } catch {
            // ignore
          }
        }
        clickedRegionCodeRef.current = codeRegion;
        // Effacer la sélection département et commune quand on reclique sur une région
        if (clickedDepartementCodeRef.current !== null) {
          try {
            map.setFeatureState(
              {
                source: GEATMAP_DEPARTEMENTS_SOURCE,
                sourceLayer: deptsSourceLayer,
                id: clickedDepartementCodeRef.current,
              },
              { clicked: false },
            );
          } catch {
            // ignore
          }
          clickedDepartementCodeRef.current = null;
        }
        if (clickedCommuneCodeRef.current !== null) {
          try {
            map.setFeatureState(
              {
                source: GEATMAP_COMMUNES_SOURCE,
                sourceLayer: communeSourceLayerRef.current,
                id: clickedCommuneCodeRef.current,
              },
              { clicked: false },
            );
          } catch {
            // ignore
          }
          clickedCommuneCodeRef.current = null;
        }
        try {
          map.setFeatureState({ source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionsSourceLayer, id: codeRegion }, { clicked: true });
        } catch {
          // promoteId may not be supported or id mismatch
        }

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
          .setLngLat(e.lngLat)
          .setHTML(`<div class="p-2"><strong>${nom}</strong><br/>Code: ${codeRegion}</div>`)
          .addTo(map);

        // fitBounds from all tile pieces of this region
        try {
          const allLoaded = map.querySourceFeatures(GEATMAP_REGIONS_SOURCE, {
            sourceLayer: regionsSourceLayer,
          });
          const sameRegion = allLoaded.filter(fe => {
            const c = fe.properties?.code ?? fe.properties?.code_region;
            return c != null && String(c) === codeRegion;
          });
          const allBbox = sameRegion
            .map(fe => (fe as GeoJSON.Feature).bbox)
            .filter((b): b is [number, number, number, number] => !!b && b.length >= 4);
          if (allBbox.length > 0) {
            const lngs = allBbox.flatMap(b => [b[0], b[2]]);
            const lats = allBbox.flatMap(b => [b[1], b[3]]);
            map.fitBounds(
              [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
              ],
              { padding: 40, maxZoom: 8, duration: 600 },
            );
          } else {
            const first = (f as GeoJSON.Feature).bbox;
            if (first && first.length >= 4) {
              map.fitBounds(
                [
                  [first[0], first[1]],
                  [first[2], first[3]],
                ],
                { padding: 40, maxZoom: 8, duration: 600 },
              );
            }
          }
        } catch {
          const first = (f as GeoJSON.Feature).bbox;
          if (first && first.length >= 4) {
            map.fitBounds(
              [
                [first[0], first[1]],
                [first[2], first[3]],
              ],
              { padding: 40, maxZoom: 8, duration: 600 },
            );
          }
        }
      });

      // Clic sur les départements (même principe que régions : setFeatureState, pas de contour qui coupe)
      map.on('mousemove', GEATMAP_DEPARTEMENTS_LAYER, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', GEATMAP_DEPARTEMENTS_LAYER, () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
      map.on('click', GEATMAP_DEPARTEMENTS_LAYER, (e: mapboxgl.MapMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const f = e.features[0];
        setMapError(null);

        const props = f.properties as Record<string, unknown>;
        const nom = propString(props, 'nom') || propString(props, 'name') || propString(props, 'code') || 'Département';
        const codeDept = propString(props, 'code') || propString(props, 'code_dep') || propString(props, 'code_departement');
        const codeRegionFromDept =
          propString(props, 'code_region') || propString(props, 'region') || propString(props, 'code_region_parent');
        if (!codeDept) return;

        if (clickedDepartementCodeRef.current !== null) {
          try {
            map.setFeatureState(
              {
                source: GEATMAP_DEPARTEMENTS_SOURCE,
                sourceLayer: deptsSourceLayer,
                id: clickedDepartementCodeRef.current,
              },
              { clicked: false },
            );
          } catch {
            // ignore
          }
        }
        if (clickedCommuneCodeRef.current !== null) {
          try {
            map.setFeatureState(
              {
                source: GEATMAP_COMMUNES_SOURCE,
                sourceLayer: communeSourceLayerRef.current,
                id: clickedCommuneCodeRef.current,
              },
              { clicked: false },
            );
          } catch {
            // ignore
          }
          clickedCommuneCodeRef.current = null;
        }
        clickedDepartementCodeRef.current = codeDept;
        try {
          map.setFeatureState(
            {
              source: GEATMAP_DEPARTEMENTS_SOURCE,
              sourceLayer: deptsSourceLayer,
              id: codeDept,
            },
            { clicked: true },
          );
        } catch {
          // ignore
        }

        // Quand on clique sur un département : mettre le contour de la région parente en bleu
        if (codeRegionFromDept) {
          if (clickedRegionCodeRef.current !== null && clickedRegionCodeRef.current !== codeRegionFromDept) {
            try {
              map.setFeatureState(
                { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionsSourceLayer, id: clickedRegionCodeRef.current },
                { clicked: false },
              );
            } catch {
              // ignore
            }
          }
          clickedRegionCodeRef.current = codeRegionFromDept;
          try {
            map.setFeatureState(
              { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionsSourceLayer, id: codeRegionFromDept },
              { clicked: true },
            );
          } catch {
            // ignore
          }
        }

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
          .setLngLat(e.lngLat)
          .setHTML(`<div class="p-2"><strong>${nom}</strong><br/>Code: ${codeDept}</div>`)
          .addTo(map);

        try {
          const allLoaded = map.querySourceFeatures(GEATMAP_DEPARTEMENTS_SOURCE, {
            sourceLayer: deptsSourceLayer,
          });
          const sameDept = allLoaded.filter(fe => {
            const c = fe.properties?.code ?? fe.properties?.code_dep ?? fe.properties?.code_departement;
            return c != null && String(c) === codeDept;
          });
          const allBbox = sameDept
            .map(fe => (fe as GeoJSON.Feature).bbox)
            .filter((b): b is [number, number, number, number] => !!b && b.length >= 4);
          if (allBbox.length > 0) {
            const lngs = allBbox.flatMap(b => [b[0], b[2]]);
            const lats = allBbox.flatMap(b => [b[1], b[3]]);
            map.fitBounds(
              [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
              ],
              { padding: 40, maxZoom: 10, duration: 600 },
            );
          } else {
            const first = (f as GeoJSON.Feature).bbox;
            if (first && first.length >= 4) {
              map.fitBounds(
                [
                  [first[0], first[1]],
                  [first[2], first[3]],
                ],
                { padding: 40, maxZoom: 10, duration: 600 },
              );
            }
          }
        } catch {
          const first = (f as GeoJSON.Feature).bbox;
          if (first && first.length >= 4) {
            map.fitBounds(
              [
                [first[0], first[1]],
                [first[2], first[3]],
              ],
              { padding: 40, maxZoom: 10, duration: 600 },
            );
          }
        }
      });

      // Clic sur les communes (même concept que régions et départements)
      map.on('mousemove', GEATMAP_COMMUNES_LAYER, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', GEATMAP_COMMUNES_LAYER, () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      });
      map.on('click', GEATMAP_COMMUNES_LAYER, (e: mapboxgl.MapMouseEvent) => {
        if (!e.features || e.features.length === 0) return;
        const f = e.features[0];
        setMapError(null);

        const props = f.properties as Record<string, unknown>;
        const nom = propString(props, 'nom') || propString(props, 'name') || propString(props, 'code') || 'Commune';
        const codeCommune = propString(props, 'code') || propString(props, 'code_insee') || propString(props, 'code_commune');
        const codeDeptFromCommune =
          propString(props, 'departement') || propString(props, 'code_departement') || propString(props, 'code_dep');
        const codeRegionFromCommune = propString(props, 'region') || propString(props, 'code_region');
        if (!codeCommune) return;

        if (clickedCommuneCodeRef.current !== null) {
          try {
            map.setFeatureState(
              {
                source: GEATMAP_COMMUNES_SOURCE,
                sourceLayer: communeSourceLayerRef.current,
                id: clickedCommuneCodeRef.current,
              },
              { clicked: false },
            );
          } catch {
            // ignore
          }
        }
        clickedCommuneCodeRef.current = codeCommune;
        try {
          map.setFeatureState(
            {
              source: GEATMAP_COMMUNES_SOURCE,
              sourceLayer: communeSourceLayerRef.current,
              id: codeCommune,
            },
            { clicked: true },
          );
        } catch {
          // ignore
        }

        // Même concept que région & département : au clic sur une commune, contour du département parent en bleu (et région parente si dispo)
        if (codeDeptFromCommune) {
          if (clickedDepartementCodeRef.current !== null && clickedDepartementCodeRef.current !== codeDeptFromCommune) {
            try {
              map.setFeatureState(
                {
                  source: GEATMAP_DEPARTEMENTS_SOURCE,
                  sourceLayer: deptSourceLayerRef.current,
                  id: clickedDepartementCodeRef.current,
                },
                { clicked: false },
              );
            } catch {
              // ignore
            }
          }
          clickedDepartementCodeRef.current = codeDeptFromCommune;
          try {
            map.setFeatureState(
              {
                source: GEATMAP_DEPARTEMENTS_SOURCE,
                sourceLayer: deptSourceLayerRef.current,
                id: codeDeptFromCommune,
              },
              { clicked: true },
            );
          } catch {
            // ignore
          }
        }
        if (codeRegionFromCommune) {
          if (clickedRegionCodeRef.current !== null && clickedRegionCodeRef.current !== codeRegionFromCommune) {
            try {
              map.setFeatureState(
                { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionSourceLayerRef.current, id: clickedRegionCodeRef.current },
                { clicked: false },
              );
            } catch {
              // ignore
            }
          }
          clickedRegionCodeRef.current = codeRegionFromCommune;
          try {
            map.setFeatureState(
              { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionSourceLayerRef.current, id: codeRegionFromCommune },
              { clicked: true },
            );
          } catch {
            // ignore
          }
        }

        if (onCommuneSelect) onCommuneSelect(codeCommune, nom);

        if (popupRef.current) popupRef.current.remove();
        popupRef.current = new mapboxgl.Popup({ closeButton: true, maxWidth: '280px' })
          .setLngLat(e.lngLat)
          .setHTML(`<div class="p-2"><strong>${nom}</strong><br/>Code INSEE: ${codeCommune}</div>`)
          .addTo(map);

        try {
          const allLoaded = map.querySourceFeatures(GEATMAP_COMMUNES_SOURCE, {
            sourceLayer: communeSourceLayerRef.current,
          });
          const sameCommune = allLoaded.filter(fe => {
            const c = fe.properties?.code ?? fe.properties?.code_insee ?? fe.properties?.code_commune;
            return c != null && String(c) === codeCommune;
          });
          const allBbox = sameCommune
            .map(fe => (fe as GeoJSON.Feature).bbox)
            .filter((b): b is [number, number, number, number] => !!b && b.length >= 4);
          if (allBbox.length > 0) {
            const lngs = allBbox.flatMap(b => [b[0], b[2]]);
            const lats = allBbox.flatMap(b => [b[1], b[3]]);
            map.fitBounds(
              [
                [Math.min(...lngs), Math.min(...lats)],
                [Math.max(...lngs), Math.max(...lats)],
              ],
              { padding: 40, maxZoom: 14, duration: 600 },
            );
          } else {
            const first = (f as GeoJSON.Feature).bbox;
            if (first && first.length >= 4) {
              map.fitBounds(
                [
                  [first[0], first[1]],
                  [first[2], first[3]],
                ],
                { padding: 40, maxZoom: 14, duration: 600 },
              );
            }
          }
        } catch {
          const first = (f as GeoJSON.Feature).bbox;
          if (first && first.length >= 4) {
            map.fitBounds(
              [
                [first[0], first[1]],
                [first[2], first[3]],
              ],
              { padding: 40, maxZoom: 14, duration: 600 },
            );
          }
        }
      });

      setLevelRef.current('regions');
    });

    return () => {
      if (popupRef.current) popupRef.current.remove();
      map.remove();
      mapRef.current = null;
    };
  }, [onCommuneSelect]);

  const handleReset = () => {
    const map = mapRef.current;
    if (!map) return;
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }
    // Effacer uniquement le contour / sélection (région et département), pas changer la vue tout de suite
    const regionCode = clickedRegionCodeRef.current;
    if (regionCode) {
      try {
        map.setFeatureState(
          { source: GEATMAP_REGIONS_SOURCE, sourceLayer: regionSourceLayerRef.current, id: regionCode },
          { clicked: false },
        );
      } catch {
        // ignore
      }
      clickedRegionCodeRef.current = null;
    }
    const deptCode = clickedDepartementCodeRef.current;
    if (deptCode) {
      try {
        map.setFeatureState(
          { source: GEATMAP_DEPARTEMENTS_SOURCE, sourceLayer: deptSourceLayerRef.current, id: deptCode },
          { clicked: false },
        );
      } catch {
        // ignore
      }
      clickedDepartementCodeRef.current = null;
    }
    const communeCode = clickedCommuneCodeRef.current;
    if (communeCode) {
      try {
        map.setFeatureState(
          { source: GEATMAP_COMMUNES_SOURCE, sourceLayer: communeSourceLayerRef.current, id: communeCode },
          { clicked: false },
        );
      } catch {
        // ignore
      }
      clickedCommuneCodeRef.current = null;
    }
    map.fitBounds(
      [
        [-5.5, 41.2],
        [9.8, 51.2],
      ],
      { padding: 40, maxZoom: FRANCE_ZOOM, duration: 600 },
    );
  };

  return (
    <div className={`relative h-full w-full ${className}`}>
      <div ref={mapContainer} className="h-full w-full" />
      {mapError && <div className="absolute top-2 left-2 right-2 bg-red-100 text-red-800 px-3 py-2 rounded text-sm">{mapError}</div>}
      {mapLoaded && (
        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <div className="bg-white/95 shadow rounded px-3 py-2 text-sm">
            Niveau : <strong>{level === 'regions' ? 'Régions' : level === 'departements' ? 'Départements' : 'Communes'}</strong>
          </div>
          <div className="bg-white/95 shadow rounded px-3 py-2 text-sm">
            Zoom : <strong>{zoom.toFixed(1)}</strong>
          </div>
          <button type="button" onClick={handleReset} className="bg-white/95 shadow rounded px-3 py-2 text-sm hover:bg-gray-100">
            Voir toute la France
          </button>
        </div>
      )}
    </div>
  );
};

export default GeatMap;
