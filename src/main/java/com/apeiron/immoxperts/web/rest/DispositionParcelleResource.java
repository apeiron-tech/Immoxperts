package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.DispositionParcelleRepository;
import com.apeiron.immoxperts.service.DispositionParcelleService;
import com.apeiron.immoxperts.service.dto.DispositionParcelleDTO;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.DispositionParcelle}.
 */
@RestController
@RequestMapping("/api/disposition-parcelles")
public class DispositionParcelleResource {

    private static final Logger LOG = LoggerFactory.getLogger(DispositionParcelleResource.class);

    private static final String ENTITY_NAME = "dispositionParcelle";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DispositionParcelleService dispositionParcelleService;

    private final DispositionParcelleRepository dispositionParcelleRepository;

    public DispositionParcelleResource(
        DispositionParcelleService dispositionParcelleService,
        DispositionParcelleRepository dispositionParcelleRepository
    ) {
        this.dispositionParcelleService = dispositionParcelleService;
        this.dispositionParcelleRepository = dispositionParcelleRepository;
    }

    /**
     * {@code POST  /disposition-parcelles} : Create a new dispositionParcelle.
     *
     * @param dispositionParcelleDTO the dispositionParcelleDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dispositionParcelleDTO, or with status {@code 400 (Bad Request)} if the dispositionParcelle has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<DispositionParcelleDTO> createDispositionParcelle(
        @Valid @RequestBody DispositionParcelleDTO dispositionParcelleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to save DispositionParcelle : {}", dispositionParcelleDTO);
        if (dispositionParcelleDTO.getId() != null) {
            throw new BadRequestAlertException("A new dispositionParcelle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        dispositionParcelleDTO = dispositionParcelleService.save(dispositionParcelleDTO);
        return ResponseEntity.created(new URI("/api/disposition-parcelles/" + dispositionParcelleDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, dispositionParcelleDTO.getId().toString()))
            .body(dispositionParcelleDTO);
    }

    /**
     * {@code PUT  /disposition-parcelles/:id} : Updates an existing dispositionParcelle.
     *
     * @param id the id of the dispositionParcelleDTO to save.
     * @param dispositionParcelleDTO the dispositionParcelleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dispositionParcelleDTO,
     * or with status {@code 400 (Bad Request)} if the dispositionParcelleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dispositionParcelleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<DispositionParcelleDTO> updateDispositionParcelle(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody DispositionParcelleDTO dispositionParcelleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update DispositionParcelle : {}, {}", id, dispositionParcelleDTO);
        if (dispositionParcelleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dispositionParcelleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dispositionParcelleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        dispositionParcelleDTO = dispositionParcelleService.update(dispositionParcelleDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dispositionParcelleDTO.getId().toString()))
            .body(dispositionParcelleDTO);
    }

    /**
     * {@code PATCH  /disposition-parcelles/:id} : Partial updates given fields of an existing dispositionParcelle, field will ignore if it is null
     *
     * @param id the id of the dispositionParcelleDTO to save.
     * @param dispositionParcelleDTO the dispositionParcelleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dispositionParcelleDTO,
     * or with status {@code 400 (Bad Request)} if the dispositionParcelleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the dispositionParcelleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the dispositionParcelleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DispositionParcelleDTO> partialUpdateDispositionParcelle(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody DispositionParcelleDTO dispositionParcelleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DispositionParcelle partially : {}, {}", id, dispositionParcelleDTO);
        if (dispositionParcelleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dispositionParcelleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dispositionParcelleRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DispositionParcelleDTO> result = dispositionParcelleService.partialUpdate(dispositionParcelleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dispositionParcelleDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /disposition-parcelles} : get all the dispositionParcelles.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dispositionParcelles in body.
     */
    @GetMapping("")
    public ResponseEntity<List<DispositionParcelleDTO>> getAllDispositionParcelles(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of DispositionParcelles");
        Page<DispositionParcelleDTO> page = dispositionParcelleService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /disposition-parcelles/:id} : get the "id" dispositionParcelle.
     *
     * @param id the id of the dispositionParcelleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dispositionParcelleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<DispositionParcelleDTO> getDispositionParcelle(@PathVariable("id") Long id) {
        LOG.debug("REST request to get DispositionParcelle : {}", id);
        Optional<DispositionParcelleDTO> dispositionParcelleDTO = dispositionParcelleService.findOne(id);
        return ResponseUtil.wrapOrNotFound(dispositionParcelleDTO);
    }

    /**
     * {@code DELETE  /disposition-parcelles/:id} : delete the "id" dispositionParcelle.
     *
     * @param id the id of the dispositionParcelleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDispositionParcelle(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete DispositionParcelle : {}", id);
        dispositionParcelleService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
