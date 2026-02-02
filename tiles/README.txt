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
