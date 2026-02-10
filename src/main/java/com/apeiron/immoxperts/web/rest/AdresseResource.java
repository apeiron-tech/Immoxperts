package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.repository.AdresseRepository;
import com.apeiron.immoxperts.service.AdresseService;
import com.apeiron.immoxperts.service.dto.AddressSearchDTO;
import com.apeiron.immoxperts.service.dto.AddressSuggestionProjection;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import com.apeiron.immoxperts.service.impl.AdresseServiceImpl;
import com.apeiron.immoxperts.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.apeiron.immoxperts.domain.Adresse}.
 */
@RestController
@RequestMapping("/api/adresses")
public class AdresseResource {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseResource.class);

    private static final String ENTITY_NAME = "adresse";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdresseServiceImpl adresseService1;
    private final AdresseService adresseService;

    private final AdresseRepository adresseRepository;

    public AdresseResource(AdresseServiceImpl adresseService1, AdresseService adresseService, AdresseRepository adresseRepository) {
        this.adresseService1 = adresseService1;
        this.adresseService = adresseService;
        this.adresseRepository = adresseRepository;
    }

    /**
     * {@code POST  /adresses} : Create a new adresse.
     *
     * @param adresseDTO the adresseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adresseDTO, or with status {@code 400 (Bad Request)} if the adresse has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AdresseDTO> createAdresse(@Valid @RequestBody AdresseDTO adresseDTO) throws URISyntaxException {
        LOG.debug("REST request to save Adresse : {}", adresseDTO);
        if (adresseDTO.getIdadresse() != null) {
            throw new BadRequestAlertException("A new adresse cannot already have an ID", ENTITY_NAME, "idexists");
        }
        adresseDTO = adresseService.save(adresseDTO);
        return ResponseEntity.created(new URI("/api/adresses/" + adresseDTO.getIdadresse()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, adresseDTO.getIdadresse().toString()))
            .body(adresseDTO);
    }

    /**
     * {@code PUT  /adresses/:id} : Updates an existing adresse.
     *
     * @param id the id of the adresseDTO to save.
     * @param adresseDTO the adresseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseDTO,
     * or with status {@code 400 (Bad Request)} if the adresseDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adresseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdresseDTO> updateAdresse(
        @PathVariable(value = "id", required = false) final Integer id,
        @Valid @RequestBody AdresseDTO adresseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Adresse : {}, {}", id, adresseDTO);
        if (adresseDTO.getIdadresse() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseDTO.getIdadresse())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        adresseDTO = adresseService.update(adresseDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseDTO.getIdadresse().toString()))
            .body(adresseDTO);
    }

    /**
     * {@code PATCH  /adresses/:id} : Partial updates given fields of an existing adresse, field will ignore if it is null
     *
     * @param id the id of the adresseDTO to save.
     * @param adresseDTO the adresseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseDTO,
     * or with status {@code 400 (Bad Request)} if the adresseDTO is not valid,
     * or with status {@code 404 (Not Found)} if the adresseDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the adresseDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdresseDTO> partialUpdateAdresse(
        @PathVariable(value = "id", required = false) final Integer id,
        @NotNull @RequestBody AdresseDTO adresseDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Adresse partially : {}, {}", id, adresseDTO);
        if (adresseDTO.getIdadresse() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseDTO.getIdadresse())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdresseDTO> result = adresseService.partialUpdate(adresseDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseDTO.getIdadresse().toString())
        );
    }

    /**
     * {@code GET  /adresses} : get all the adresses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adresses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AdresseDTO>> getAllAdresses(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Adresses");
        Page<AdresseDTO> page = adresseService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /adresses/:id} : get the "id" adresse.
     *
     * @param id the id of the adresseDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adresseDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdresseDTO> getAdresse(@PathVariable Integer id) {
        LOG.debug("REST request to get Adresse : {}", id);
        Optional<AdresseDTO> adresseDTO = adresseService.findOne(id);
        return ResponseUtil.wrapOrNotFound(adresseDTO);
    }

    /**
     * {@code DELETE  /adresses/:id} : delete the "id" adresse.
     *
     * @param id the id of the adresseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdresse(@PathVariable Integer id) {
        LOG.debug("REST request to delete Adresse : {}", id);
        adresseService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    /**
     * {@code POST  /adresses/search} : Search for adresses.
     *
     * @param searchDTO the search criteria.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of matching adresses in body.
     */
    @PostMapping("/search")
    public ResponseEntity<List<AdresseDTO>> searchAdresses(@Valid @RequestBody AddressSearchDTO searchDTO) {
        LOG.debug("REST request to search Adresses with criteria : {}", searchDTO);
        List<AdresseDTO> results = adresseService.searchAddresses(searchDTO);
        return ResponseEntity.ok().body(results);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<AddressSuggestionProjection>> getSuggestions(@RequestParam("q") String query) {
        List<AddressSuggestionProjection> suggestions = adresseService1.getSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }

    /**
     * {@code GET  /adresses/osm-places} : Proxy for OpenStreetMap Nominatim API to avoid CORS issues.
     *
     * @param query the search query.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and OSM places in body.
     */
    @GetMapping("/osm-places")
    public ResponseEntity<String> getOsmPlaces(@RequestParam("q") String query) {
        LOG.debug("REST request to get OSM places for query : {}", query);
        try {
            String url = String.format(
                "https://nominatim.openstreetmap.org/search?q=%s&format=json&addressdetails=1&countrycodes=fr&limit=5&featuretype=city",
                java.net.URLEncoder.encode(query, java.nio.charset.StandardCharsets.UTF_8)
            );

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(url))
                .header("Accept", "application/json")
                .header("User-Agent", "Immoxperts/1.0 (contact@immoxperts.com)")
                .GET()
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.ok().header("Content-Type", "application/json").body(response.body());
        } catch (Exception e) {
            LOG.error("Error fetching OSM places", e);
            return ResponseEntity.ok("[]");
        }
    }

    /**
     * {@code GET  /adresses/osm-reverse} : Proxy for OpenStreetMap reverse geocoding API to avoid CORS issues.
     *
     * @param lat the latitude.
     * @param lon the longitude.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and reverse geocoding result in body.
     */
    @GetMapping("/osm-reverse")
    public ResponseEntity<String> getOsmReverse(@RequestParam("lat") double lat, @RequestParam("lon") double lon) {
        LOG.debug("REST request to get OSM reverse geocoding for lat: {}, lon: {}", lat, lon);
        try {
            String url = String.format(
                "https://nominatim.openstreetmap.org/reverse?lat=%s&lon=%s&format=json&addressdetails=1&zoom=18&accept-language=fr",
                lat,
                lon
            );

            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(url))
                .header("Accept", "application/json")
                .header("User-Agent", "Immoxperts/1.0 (contact@immoxperts.com)")
                .GET()
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            return ResponseEntity.ok().header("Content-Type", "application/json").body(response.body());
        } catch (Exception e) {
            LOG.error("Error fetching OSM reverse geocoding", e);
            return ResponseEntity.ok("{}");
        }
    }

    /**
     * {@code GET  /adresses/french-address-reverse} : Proxy for French Address API reverse geocoding to avoid CORS issues.
     * Returns 200 with empty JSON on external API errors or network issues so the frontend does not break.
     *
     * @param lat the latitude.
     * @param lon the longitude.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and reverse geocoding result in body.
     */
    @GetMapping("/french-address-reverse")
    public ResponseEntity<String> getFrenchAddressReverse(@RequestParam("lat") String lat, @RequestParam("lon") String lon) {
        LOG.info("REST request to get French Address reverse geocoding for lat: {}, lon: {}", lat, lon);

        try {
            String url = String.format("https://api-adresse.data.gouv.fr/reverse/?lon=%s&lat=%s", lon, lat);
            LOG.debug("Calling French Address API: {}", url);

            java.net.http.HttpClient client = java.net.http.HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(java.net.URI.create(url))
                .header("Accept", "application/json")
                .timeout(Duration.ofSeconds(10))
                .GET()
                .build();

            java.net.http.HttpResponse<String> response = client.send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            int status = response.statusCode();
            LOG.debug("French Address API response status: {}", status);

            if (status >= 200 && status < 300) {
                return ResponseEntity.ok().header("Content-Type", "application/json").body(response.body());
            }
            LOG.warn("French Address API returned non-OK status {} for lon={}, lat={}", status, lon, lat);
            return ResponseEntity.ok().header("Content-Type", "application/json").body("{}");
        } catch (Exception e) {
            LOG.error("Error fetching French Address reverse geocoding for lon={}, lat={}: {}", lon, lat, e.getMessage());
            return ResponseEntity.ok().header("Content-Type", "application/json").body("{}");
        }
    }
}
