package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.Mutation}.
 */
@RestController
@RequestMapping("/api/mutations")
public class MutationResource {

    private static final Logger LOG = LoggerFactory.getLogger(MutationResource.class);

    private static final String ENTITY_NAME = "mutation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MutationService mutationService;

    private final MutationRepository mutationRepository;

    public MutationResource(MutationService mutationService, MutationRepository mutationRepository) {
        this.mutationService = mutationService;
        this.mutationRepository = mutationRepository;
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
        if (mutationDTO.getId() != null) {
            throw new BadRequestAlertException("A new mutation cannot already have an ID", ENTITY_NAME, "idexists");
        }
        mutationDTO = mutationService.save(mutationDTO);
        return ResponseEntity.created(new URI("/api/mutations/" + mutationDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, mutationDTO.getId().toString()))
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
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MutationDTO mutationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Mutation : {}, {}", id, mutationDTO);
        if (mutationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mutationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mutationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        mutationDTO = mutationService.update(mutationDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mutationDTO.getId().toString()))
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
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MutationDTO mutationDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Mutation partially : {}, {}", id, mutationDTO);
        if (mutationDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, mutationDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!mutationRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MutationDTO> result = mutationService.partialUpdate(mutationDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, mutationDTO.getId().toString())
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
    public ResponseEntity<MutationDTO> getMutation(@PathVariable("id") Long id) {
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
    public ResponseEntity<Void> deleteMutation(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Mutation : {}", id);
        mutationService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
