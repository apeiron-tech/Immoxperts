package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.MutationCustomRepository;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.PropertyStatisticsService;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
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

    /**
     * {@code POST  /mutations} : Create a new mutation.
     *
     * @param mutationDTO the mutationDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new mutationDTO, or with status {@code 400 (Bad Request)} if the mutation has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<MutationDTO> createMutation(@Valid @RequestBody MutationDTO mutationDTO) throws URISyntaxException {
        LOG.debug("REST request to save Mutation : {}", mutationDTO);
        if (mutationDTO.getIdmutation(1) != null) {
            throw new BadRequestAlertException("A new mutation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        mutationDTO = mutationService.save(mutationDTO);
        return ResponseEntity.created(new URI("/api/mutations/" + mutationDTO.getIdmutation(1)))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, mutationDTO.getIdmutation(1).toString()))
            .body(mutationDTO);
    }

    /**
     * {@code PUT  /mutations/:id} : Updates an existing mutation.
     *
     * @param id the id of the mutationDTO to save.
     * @param mutationDTO the mutationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mutationDTO,
     * or with status {@code 400 (Bad Request)} if the mutationDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the mutationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MutationDTO> updateMutation(
        @PathVariable(value = "id", required = false) final Integer id,
        @Valid @RequestBody MutationDTO mutationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Mutation : {}, {}", id, mutationDTO);
        if (mutationDTO.getIdmutation(1) == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mutationDTO.getIdmutation(1))) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mutationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        mutationDTO = mutationService.update(mutationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mutationDTO.getIdmutation(1).toString()))
            .body(mutationDTO);
    }

    /**
     * {@code PATCH  /mutations/:id} : Partial updates given fields of an existing mutation, field will ignore if it is null
     *
     * @param id the id of the mutationDTO to save.
     * @param mutationDTO the mutationDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated mutationDTO,
     * or with status {@code 400 (Bad Request)} if the mutationDTO is not valid,
     * or with status {@code 404 (Not Found)} if the mutationDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the mutationDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MutationDTO> partialUpdateMutation(
        @PathVariable(value = "id", required = false) final Integer id,
        @NotNull @RequestBody MutationDTO mutationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Mutation partially : {}, {}", id, mutationDTO);
        if (mutationDTO.getIdmutation(1) == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mutationDTO.getIdmutation(1))) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mutationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MutationDTO> result = mutationService.partialUpdate(mutationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mutationDTO.getIdmutation(1).toString())
        );
    }

    /**
     * {@code GET  /mutations} : get all the mutations.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of mutations in body.
     */
    @GetMapping("")
    public ResponseEntity<List<MutationDTO>> getAllMutations(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Mutations");
        Page<MutationDTO> page = mutationService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /mutations/:id} : get the "id" mutation.
     *
     * @param id the id of the mutationDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the mutationDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MutationDTO> getMutation(@PathVariable("id") Integer id) {
        LOG.debug("REST request to get Mutation : {}", id);
        Optional<MutationDTO> mutationDTO = mutationService.findOne(id);
        return ResponseUtil.wrapOrNotFound(mutationDTO);
    }

    /**
     * {@code DELETE  /mutations/:id} : delete the "id" mutation.
     *
     * @param id the id of the mutationDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMutation(@PathVariable("id") Integer id) {
        LOG.debug("REST request to delete Mutation : {}", id);
        mutationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/by-address/{adresseId}")
    public ResponseEntity<List<MutationDTO>> getMutationsByAddress(@PathVariable Integer adresseId) {
        List<MutationDTO> mutations = mutationService.getMutationsByAdresseId(adresseId);
        if (mutations.isEmpty()) {
            List<MutationDTO> mutations2 = mutationService.getMutationsByAdresseId2(adresseId);
            return ResponseEntity.ok(mutations2);
        }
        return ResponseEntity.ok(mutations);
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
        List<PropertyStatisticsDTO> statistics = propertyStatisticsService.getPropertyStatisticsByCommune(commune);
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/mutations/by-street-and-commune")
    public ResponseEntity<List<MutationDTO>> getMutationsByStreetAndCommune(
        @RequestParam("street") String street,
        @RequestParam("commune") String commune
    ) {
        LOG.debug("REST request to get Mutations by street : {} and commune : {}", street, commune);
        List<MutationDTO> mutations = mutationService.searchMutationsByStreetAndCommune(street, commune);
        return ResponseEntity.ok().body(mutations);
    }
}
