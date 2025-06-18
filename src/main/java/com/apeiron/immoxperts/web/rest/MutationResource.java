package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.MutationCustomRepository;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.PropertyStatisticsService;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.dto.MutationSearchDTO;
import com.apeiron.immoxperts.service.dto.PropertyStatisticsDTO;
import com.apeiron.immoxperts.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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

    private final MutationService mutationService;
    private final MutationRepository mutationRepository;
    private final PropertyStatisticsService propertyStatisticsService;

    public MutationResource(
        MutationCustomRepository mutationCustomRepository,
        MutationService mutationService,
        MutationRepository mutationRepository,
        PropertyStatisticsService propertyStatisticsService
    ) {
        this.mutationCustomRepository = mutationCustomRepository;
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
    public ResponseEntity<List<MutationDTO>> searchMutations(
        @RequestParam(required = false) String novoie,
        @RequestParam(required = false) String voie
    ) {
        try {
            List<MutationDTO> results = mutationService.searchMutations(novoie, voie);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            LOG.error("Error searching mutations: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Collections.emptyList());
        }
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
}
