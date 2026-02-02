GeatMap vector tiles
===================

Put these .mbtiles files in this folder so the map can show regions, départements and communes:

  - regions.mbtiles
  - departements.mbtiles
  - communes.mbtiles

The backend looks for them here (path is configurable in application-dev.yml: geatmap.tiles.path).

Example: copy from your Downloads folder:
  copy C:\Users\djoso\Downloads\regions.mbtiles      D:\Projects\Immoxperts\tiles\
  copy C:\Users\djoso\Downloads\departements.mbtiles D:\Projects\Immoxperts\tiles\
  copy C:\Users\djoso\Downloads\communes.mbtiles    D:\Projects\Immoxperts\tiles\

Then restart the Spring Boot backend (or just reload the map — files are read on each request).


Régénérer les communes avec maxzoom 14
--------------------------------------
Le maxzoom d’un .mbtiles ne peut pas être modifié dans le fichier : il est fixé à la création.
Pour avoir des tuiles jusqu’au zoom 14, il faut régénérer le mbtiles depuis les données sources.

1. Installer Tippecanoe (outil Mapbox) :
   - Windows : https://github.com/felt/tippecanoe/releases ou via WSL
   - macOS : brew install tippecanoe

2. Avoir un GeoJSON des communes (ex. communes.json) avec au minimum :
   - une propriété "code" (ou code_insee) pour chaque feature
   - géométries Polygon/MultiPolygon

3. Lancer (depuis le dossier qui contient communes.json) :
   tippecanoe -z14 -Z3 -o communes.mbtiles -l communes communes.json

   -z14  = maxzoom 14
   -Z3   = minzoom 3 (optionnel)
   -l    = nom de la couche dans le mbtiles (doit correspondre au "source-layer" dans GeatMap, ex. "communes")

4. Remplacer tiles/communes.mbtiles par le nouveau fichier généré.
