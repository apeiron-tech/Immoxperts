package com.apeiron.immoxperts.web.rest;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Set;
import java.util.zip.GZIPInputStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Serves vector tiles from .mbtiles files for the GeatMap administrative drill-down.
 * Expects regions.mbtiles, departements.mbtiles, communes.mbtiles in the configured folder.
 */
@RestController
@RequestMapping("/api/tiles/geatmap")
public class GeatMapTileResource {

    private static final Logger LOG = LoggerFactory.getLogger(GeatMapTileResource.class);
    private static final Set<String> ALLOWED_LAYERS = Set.of("regions", "departements", "communes");
    private static final String TILE_CONTENT_TYPE = "application/vnd.mapbox-vector-tile";

    @Value("${geatmap.tiles.path:./tiles}")
    private String tilesPath;

    /**
     * GET /api/tiles/geatmap/{layer}/{z}/{x}/{y} — returns a single vector tile (e.g. .pbf).
     * mbtiles uses TMS row: row = (1 << z) - 1 - y.
     */
    @GetMapping("/{layer}/{z}/{x}/{y}")
    public ResponseEntity<ByteArrayResource> getTile(
        @PathVariable String layer,
        @PathVariable int z,
        @PathVariable int x,
        @PathVariable int y
    ) {
        if (!ALLOWED_LAYERS.contains(layer)) {
            return ResponseEntity.badRequest().build();
        }
        Path base = Path.of(tilesPath).toAbsolutePath().normalize();
        Path mbtilesFile = base.resolve(layer + ".mbtiles");
        if (!Files.isRegularFile(mbtilesFile)) {
            LOG.debug("mbtiles file not found: {}", mbtilesFile);
            return ResponseEntity.notFound().build();
        }
        // mbtiles spec: tile_row is TMS (0 at bottom). XYZ y=0 is top, so TMS row = (1<<z)-1-y
        int tmsRow = (1 << z) - 1 - y;
        String jdbcUrl = "jdbc:sqlite:" + mbtilesFile.toString().replace("\\", "/");
        try (Connection conn = DriverManager.getConnection(jdbcUrl)) {
            String sql = "SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ?";
            try (PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, z);
                ps.setInt(2, x);
                ps.setInt(3, tmsRow);
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) {
                        return ResponseEntity.notFound().build();
                    }
                    byte[] tileData = rs.getBytes("tile_data");
                    if (tileData == null || tileData.length == 0) {
                        return ResponseEntity.notFound().build();
                    }
                    // mbtiles often store tile_data gzip-compressed; Mapbox GL expects raw PBF (fixes "Unimplemented type: 3")
                    byte[] payload = decompressIfGzip(tileData);
                    HttpHeaders headers = new HttpHeaders();
                    headers.setContentType(MediaType.parseMediaType(TILE_CONTENT_TYPE));
                    headers.setCacheControl("public, max-age=86400");
                    return ResponseEntity.ok().headers(headers).body(new ByteArrayResource(payload));
                }
            }
        } catch (SQLException e) {
            LOG.warn("mbtiles read error for {}: {}", mbtilesFile, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/tiles/geatmap/metadata/{layer} — returns the "json" metadata from the mbtiles (TileJSON).
     * Use this to find the correct source-layer name (vector_layers[].id) if layers don't show.
     */
    @GetMapping("/metadata/{layer}")
    public ResponseEntity<String> getMetadata(@PathVariable String layer) {
        if (!ALLOWED_LAYERS.contains(layer)) {
            return ResponseEntity.badRequest().build();
        }
        Path base = Path.of(tilesPath).toAbsolutePath().normalize();
        Path mbtilesFile = base.resolve(layer + ".mbtiles");
        if (!Files.isRegularFile(mbtilesFile)) {
            return ResponseEntity.notFound().build();
        }
        String jdbcUrl = "jdbc:sqlite:" + mbtilesFile.toString().replace("\\", "/");
        try (Connection conn = DriverManager.getConnection(jdbcUrl)) {
            try (PreparedStatement ps = conn.prepareStatement("SELECT value FROM metadata WHERE name = 'json'")) {
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) {
                        return ResponseEntity.notFound().build();
                    }
                    String json = rs.getString("value");
                    return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(json != null ? json : "{}");
                }
            }
        } catch (SQLException e) {
            LOG.warn("mbtiles metadata read error for {}: {}", mbtilesFile, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /** Decompress tile_data if it is gzip (mbtiles often stores PBF gzip-compressed). Returns raw bytes otherwise. */
    private static byte[] decompressIfGzip(byte[] data) {
        if (data == null || data.length < 2) return data;
        if (data[0] != (byte) 0x1f || data[1] != (byte) 0x8b) return data;
        try (
            GZIPInputStream gzip = new GZIPInputStream(new ByteArrayInputStream(data));
            ByteArrayOutputStream out = new ByteArrayOutputStream()
        ) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = gzip.read(buf)) > 0) out.write(buf, 0, n);
            return out.toByteArray();
        } catch (IOException e) {
            LOG.warn("Failed to decompress gzip tile_data: {}", e.getMessage());
            return data;
        }
    }
}
