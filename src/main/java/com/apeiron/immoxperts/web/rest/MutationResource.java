package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.MutationCustomRepository;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.PropertyStatisticsService;
import com.apeiron.immoxperts.service.dto.*;
import com.apeiron.immoxperts.service.impl.MutationServiceImpl;
import com.apeiron.immoxperts.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.apeiron.immoxperts.domain.Mutation}.
 */
@RestController
@RequestMapping("/api/mutations")
public class MutationResource {

    private static final Logger LOG = LoggerFactory.getLogger(MutationResource.class);

    private static final String ENTITY_NAME = "mutation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    @Autowired
    private final MutationCustomRepository mutationCustomRepository;

    private final MutationServiceImpl mutationServiceImp;
    private final MutationService mutationService;
    private final MutationRepository mutationRepository;
    private final PropertyStatisticsService propertyStatisticsService;

    public MutationResource(
        MutationCustomRepository mutationCustomRepository,
        MutationServiceImpl mutationServiceImp,
        MutationService mutationService,
        MutationRepository mutationRepository,
        PropertyStatisticsService propertyStatisticsService
    ) {
        this.mutationCustomRepository = mutationCustomRepository;
        this.mutationServiceImp = mutationServiceImp;
        this.mutationService = mutationService;
        this.mutationRepository = mutationRepository;
        this.propertyStatisticsService = propertyStatisticsService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<MutationDTO> getMutation(@PathVariable("id") Integer id) {
        LOG.debug("REST request to get Mutation : {}", id);
        Optional<MutationDTO> mutationDTO = mutationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mutationDTO);
    }

    @GetMapping("/by-voie/{voie}")
    public List<MutationDTO> getMutationsByVoie(@PathVariable String voie) {
        return mutationService.getMutationsByVoie(voie);
    }

    @GetMapping("/search")
    public ResponseEntity<Object> searchTransactions(
        @RequestParam String bounds,
        @RequestParam(required = false) String propertyType,
        @RequestParam(required = false) String roomCount,
        @RequestParam(required = false) String minDate,
        @RequestParam(required = false) String maxDate,
        @RequestParam(required = false) BigDecimal minSellPrice,
        @RequestParam(required = false) BigDecimal maxSellPrice,
        @RequestParam(required = false) Integer minSurface, // Surface bâtie
        @RequestParam(required = false) Integer maxSurface, // Surface bâtie
        @RequestParam(required = false) Integer minSurfaceLand, // Surface terrain
        @RequestParam(required = false) Integer maxSurfaceLand, // Surface terrain
        @RequestParam(required = false) BigDecimal minSquareMeterPrice,
        @RequestParam(required = false) BigDecimal maxSquareMeterPrice,
        @RequestParam(defaultValue = "1000") Integer limit
    ) {
        try {
            // Parse bounds
            String[] boundsArray = cleanParameter(bounds).split(",");
            Double west = Double.parseDouble(boundsArray[0]);
            Double south = Double.parseDouble(boundsArray[1]);
            Double east = Double.parseDouble(boundsArray[2]);
            Double north = Double.parseDouble(boundsArray[3]);

            // Parse property types
            String[] propertyTypes = parseStringArray(propertyType, this::mapPropertyTypeToGroup);
            Integer[] roomCounts = parseIntegerArray(roomCount);

            // Special case: if roomCount is "0", convert to array with -1 to signal "show only 0 or NULL"
            if (roomCounts != null && roomCounts.length == 1 && roomCounts[0] == 0) {
                roomCounts = new Integer[] { -1 };
            }

            Set<String> allowedTypes = propertyTypes != null ? Set.of(propertyTypes) : null;

            // Debug logging
            LOG.debug("Property types received: {}", propertyType);
            LOG.debug("Property types mapped: {}", propertyTypes != null ? String.join(",", propertyTypes) : "null");
            LOG.debug("Room counts: {}", roomCounts != null ? Arrays.toString(roomCounts) : "null");

            // Parse dates
            LocalDate startDate = parseLocalDate(minDate);
            LocalDate endDate = parseLocalDate(maxDate);

            // Treat default values as NULL (no filter)
            BigDecimal effectiveMinPrice = (minSellPrice != null && minSellPrice.compareTo(BigDecimal.ZERO) > 0) ? minSellPrice : null;
            BigDecimal effectiveMaxPrice = (maxSellPrice != null && maxSellPrice.compareTo(new BigDecimal("20000000")) < 0)
                ? maxSellPrice
                : null;
            BigDecimal effectiveMinPriceM2 = (minSquareMeterPrice != null && minSquareMeterPrice.compareTo(BigDecimal.ZERO) > 0)
                ? minSquareMeterPrice
                : null;
            BigDecimal effectiveMaxPriceM2 = (maxSquareMeterPrice != null && maxSquareMeterPrice.compareTo(new BigDecimal("40000")) < 0)
                ? maxSquareMeterPrice
                : null;
            Integer effectiveMinSurface = (minSurface != null && minSurface > 0) ? minSurface : null;
            Integer effectiveMaxSurface = (maxSurface != null && maxSurface < 400) ? maxSurface : null;
            Integer effectiveMinSurfaceLand = (minSurfaceLand != null && minSurfaceLand > 0) ? minSurfaceLand : null;
            Integer effectiveMaxSurfaceLand = (maxSurfaceLand != null && maxSurfaceLand < 50000) ? maxSurfaceLand : null;

            LOG.info("=== SEARCH REQUEST ===");
            LOG.info("Bounds: west={}, south={}, east={}, north={}", west, south, east, north);
            LOG.info("Property types: {}", propertyTypes != null ? String.join(",", propertyTypes) : "ALL");
            LOG.info("Room counts RAW: {}", roomCount);
            LOG.info("Room counts PARSED: {}", roomCounts != null ? Arrays.toString(roomCounts) : "NULL");
            LOG.info("Room counts after conversion: {}", roomCounts != null ? Arrays.toString(roomCounts) : "NULL");
            LOG.info(
                "Price filters - Original: min={}, max={} -> Effective: min={}, max={}",
                minSellPrice,
                maxSellPrice,
                effectiveMinPrice,
                effectiveMaxPrice
            );
            LOG.info(
                "PriceM2 filters - Original: min={}, max={} -> Effective: min={}, max={}",
                minSquareMeterPrice,
                maxSquareMeterPrice,
                effectiveMinPriceM2,
                effectiveMaxPriceM2
            );
            LOG.info(
                "Surface filters - Original: min={}, max={} -> Effective: min={}, max={}",
                minSurface,
                maxSurface,
                effectiveMinSurface,
                effectiveMaxSurface
            );
            LOG.info(
                "Terrain filters - Original: min={}, max={} -> Effective: min={}, max={}",
                minSurfaceLand,
                maxSurfaceLand,
                effectiveMinSurfaceLand,
                effectiveMaxSurfaceLand
            );

            // ✅ Appel repository avec TOUS les paramètres
            List<String> results = mutationRepository.findAggregatedMutations(
                west,
                south,
                east,
                north,
                propertyTypes, // Types de propriétés
                roomCounts, // Nombre de pièces
                effectiveMinPrice, // Prix minimum
                effectiveMaxPrice, // Prix maximum
                effectiveMinSurface, // Surface bâtie min
                effectiveMaxSurface, // Surface bâtie max
                effectiveMinSurfaceLand, // Surface terrain min
                effectiveMaxSurfaceLand, // Surface terrain max
                effectiveMinPriceM2, // Prix m² min
                effectiveMaxPriceM2, // Prix m² max
                startDate, // Date début
                endDate, // Date fin
                limit // Limite résultats
            );

            // ✅ Filtrer les mutations dans le JSON (si filtres spécifiques)
            ObjectMapper mapper = new ObjectMapper();
            List<Object> features = results
                .stream()
                .map(json -> {
                    try {
                        Map<String, Object> feature = mapper.readValue(json, Map.class);

                        // Si on a des types spécifiques, filtrer les mutations
                        if (allowedTypes != null && !allowedTypes.isEmpty()) {
                            filterMutationsInFeature(feature, allowedTypes);
                        }

                        return feature;
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .filter(feature -> {
                    // Éliminer les features qui n'ont plus de mutations après filtrage
                    try {
                        Map<String, Object> properties = (Map<String, Object>) ((Map<String, Object>) feature).get("properties");
                        List<Map<String, Object>> adresses = (List<Map<String, Object>>) properties.get("adresses");

                        return adresses
                            .stream()
                            .anyMatch(adresse -> {
                                List<Map<String, Object>> mutations = (List<Map<String, Object>>) adresse.get("mutations");
                                return mutations != null && !mutations.isEmpty();
                            });
                    } catch (Exception e) {
                        return true;
                    }
                })
                .collect(Collectors.toList());

            LOG.info("Results: {} raw results from DB, {} features after filtering", results.size(), features.size());

            Map<String, Object> geoJsonCollection = Map.of("type", "FeatureCollection", "features", features, "total", features.size());

            return ResponseEntity.ok(geoJsonCollection);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ✅ Méthode de filtrage des mutations dans le JSON
    private void filterMutationsInFeature(Map<String, Object> feature, Set<String> allowedTypes) {
        try {
            Map<String, Object> properties = (Map<String, Object>) feature.get("properties");
            List<Map<String, Object>> adresses = (List<Map<String, Object>>) properties.get("adresses");

            for (Map<String, Object> adresse : adresses) {
                List<Map<String, Object>> mutations = (List<Map<String, Object>>) adresse.get("mutations");

                if (mutations != null) {
                    List<Map<String, Object>> filteredMutations = mutations
                        .stream()
                        .filter(mutation -> {
                            String typeBien = (String) mutation.get("type_bien");
                            String typeGroupe = (String) mutation.get("type_groupe");
                            String effectiveType = typeBien != null ? typeBien : typeGroupe;
                            return effectiveType != null && allowedTypes.contains(effectiveType);
                        })
                        .collect(Collectors.toList());

                    adresse.put("mutations", filteredMutations);
                }
            }
        } catch (Exception e) {}
    }

    // ✅ Mapping des types de propriétés
    private String mapPropertyTypeToGroup(String code) {
        return switch (code.trim()) {
            case "0" -> "Appartement";
            case "1" -> "Maison";
            case "2" -> "Bien Multiple";
            case "4" -> "Terrain";
            case "5" -> "Local Commercial";
            // Alternative code
            default -> {
                yield "Appartement";
            }
        };
    }

    // ✅ Méthodes utilitaires
    private String cleanParameter(String param) {
        if (param == null) return null;
        return param.replaceAll("\\r\\n|\\r|\\n|_", "").trim();
    }

    private String[] parseStringArray(String param, Function<String, String> mapper) {
        if (param == null || param.trim().isEmpty()) return null;
        return Arrays.stream(cleanParameter(param).split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(mapper)
            .toArray(String[]::new);
    }

    private Integer[] parseIntegerArray(String param) {
        if (param == null || param.trim().isEmpty()) return null;
        return Arrays.stream(cleanParameter(param).split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Integer::parseInt)
            .toArray(Integer[]::new);
    }

    private LocalDate parseLocalDate(String param) {
        if (param == null || param.trim().isEmpty()) return null;
        return LocalDate.parse(cleanParameter(param));
    }

    @GetMapping("/commune")
    public ResponseEntity<CommuneStatsDTO> getCommuneStats(@RequestParam("commune") String commune) {
        return ResponseEntity.ok(mutationCustomRepository.getStatsByCommune(commune));
    }

    @GetMapping("/statistics/{commune}")
    public ResponseEntity<List<PropertyStatisticsDTO>> getPropertyStatistics(@PathVariable String commune) {
        List<PropertyStatisticsDTO> statistics = propertyStatisticsService.getAllPropertyStatisticsByCommune(commune);
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/statistics/refresh")
    public ResponseEntity<Void> refreshPropertyStatistics() {
        propertyStatisticsService.refreshPropertyStatistics();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/mutations/by-street-and-commune")
    public ResponseEntity<Page<MutationDTO>> getMutationsByStreetAndCommune(
        @RequestParam("street") String street,
        @RequestParam("commune") String commune,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get Mutations by street : {} and commune : {}", street, commune);
        Page<MutationDTO> page = mutationService.searchMutationsByStreetAndCommune(street, commune, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    @GetMapping("/stats/by-city")
    public ResponseEntity<List<StatsByCityDTO>> getStatsByCity(@RequestParam String codeInsee) {
        LOG.debug("REST request to get stats by city for code INSEE: {}", codeInsee);

        List<StatsByCityDTO> stats = mutationServiceImp.getStatsByCodeInsee(codeInsee);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/parcel/{parcelId}")
    public ResponseEntity<String> getParcelAddresses(@PathVariable String parcelId) {
        LOG.debug("REST request to get addresses for parcel: {}", parcelId);

        try {
            String parcelData = mutationRepository.findParcelAddresses(parcelId);

            if (parcelData == null || parcelData.trim().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().header("Content-Type", "application/json").body(parcelData);
        } catch (Exception e) {
            LOG.error("Error fetching parcel addresses for parcelId: {}", parcelId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
