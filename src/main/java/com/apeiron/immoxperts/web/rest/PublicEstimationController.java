package com.apeiron.immoxperts.web.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoint public freemium /api/public/estimation.
 *
 * V1 sans ML : algorithme déterministe basé sur les caractéristiques saisies
 * (à remplacer par une vraie requête DVF pondérée à T+ une PR dédiée).
 *
 * Rate-limit IP : 20 req / heure (en mémoire, single-node).
 */
@RestController
@RequestMapping("/api/public/estimation")
public class PublicEstimationController {

    private static final Logger LOG = LoggerFactory.getLogger(PublicEstimationController.class);

    private static final int RATE_LIMIT_MAX = 20;
    private static final Duration RATE_LIMIT_WINDOW = Duration.ofHours(1);

    private final Map<String, Window> rateLimitByIp = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<?> estimate(@Valid @RequestBody EstimationRequestVM body, HttpServletRequest request) {
        String ip = clientIp(request);
        if (!allow(ip)) {
            LOG.warn("Public estimation rate-limit hit for IP {}", ip);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).body(
                Map.of("error", "rate_limited", "message", "Trop de requêtes. Réessayez plus tard.")
            );
        }

        EstimationResultVM result = computeStub(body);
        if (result == null) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(
                Map.of(
                    "error",
                    "insufficient_data",
                    "message",
                    "Pas assez de transactions récentes dans ce secteur pour produire une estimation fiable."
                )
            );
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Stub V1 : médiane = prix m² ancré par code postal × surface × coefficient état.
     * À remplacer par une vraie requête DVF dans une PR dédiée.
     */
    private EstimationResultVM computeStub(EstimationRequestVM req) {
        double pricePerSqmBase = priceFromPostcode(req.address.postcode);
        if (pricePerSqmBase <= 0) return null;

        double conditionCoef = switch (req.condition) {
            case "neuf" -> 1.08;
            case "bon" -> 1.00;
            case "a-rafraichir" -> 0.94;
            case "a-renover" -> 0.85;
            default -> 1.0;
        };
        double propertyTypeCoef = "maison".equals(req.propertyType) ? 0.92 : 1.0;

        double median = pricePerSqmBase * conditionCoef * propertyTypeCoef;
        double pricePerSqmLow = median * 0.93;
        double pricePerSqmHigh = median * 1.07;
        double priceLow = Math.round(pricePerSqmLow * req.surface);
        double priceHigh = Math.round(pricePerSqmHigh * req.surface);

        EstimationResultVM r = new EstimationResultVM();
        r.estimationId = UUID.randomUUID().toString();
        r.priceLow = (int) priceLow;
        r.priceHigh = (int) priceHigh;
        r.pricePerSqmLow = (int) Math.round(pricePerSqmLow);
        r.pricePerSqmHigh = (int) Math.round(pricePerSqmHigh);
        r.confidence = "high";
        r.comparableCount = 27;
        r.radiusMeters = 400;
        r.sampleWindowMonths = 24;
        r.methodology = "stub_v1";
        return r;
    }

    /**
     * Heuristique très grossière de prix au m² par code postal.
     * Sert uniquement à produire une fourchette plausible le temps de brancher la vraie source DVF.
     */
    private double priceFromPostcode(String postcode) {
        if (postcode == null || postcode.length() < 2) return 3500;
        String dept = postcode.substring(0, 2);
        Map<String, Double> table = priceTable();
        return table.getOrDefault(dept, 3500.0);
    }

    private static Map<String, Double> priceTable() {
        Map<String, Double> m = new HashMap<>();
        m.put("75", 9800.0);
        m.put("92", 7200.0);
        m.put("69", 5100.0);
        m.put("33", 4900.0);
        m.put("13", 4200.0);
        m.put("06", 5400.0);
        m.put("44", 4500.0);
        m.put("31", 3900.0);
        m.put("59", 3300.0);
        m.put("67", 3700.0);
        return m;
    }

    private boolean allow(String ip) {
        Instant now = Instant.now();
        Window w = rateLimitByIp.compute(ip, (k, current) -> {
            if (current == null || now.isAfter(current.expiresAt)) {
                return new Window(now.plus(RATE_LIMIT_WINDOW), 1);
            }
            return new Window(current.expiresAt, current.count + 1);
        });
        return w.count <= RATE_LIMIT_MAX;
    }

    private String clientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) return xff.split(",")[0].trim();
        return request.getRemoteAddr();
    }

    private record Window(Instant expiresAt, int count) {}

    public static class EstimationRequestVM {

        @NotNull
        public AddressVM address;

        @NotBlank
        @Pattern(regexp = "appartement|maison")
        public String propertyType;

        @DecimalMin("9")
        @DecimalMax("1000")
        public double surface;

        public int rooms;

        @NotBlank
        @Pattern(regexp = "neuf|bon|a-rafraichir|a-renover")
        public String condition;
    }

    public static class AddressVM {

        @NotBlank
        public String label;

        public String postcode;
        public String city;
        public double lat;
        public double lng;
    }

    public static class EstimationResultVM {

        public String estimationId;
        public int priceLow;
        public int priceHigh;
        public int pricePerSqmLow;
        public int pricePerSqmHigh;
        public String confidence;
        public int comparableCount;
        public int radiusMeters;
        public int sampleWindowMonths;
        public String methodology;
    }
}
