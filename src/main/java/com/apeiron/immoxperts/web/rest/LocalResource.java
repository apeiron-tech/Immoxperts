package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.LocalRepository;
import com.apeiron.immoxperts.service.LocalService;
import com.apeiron.immoxperts.service.dto.LocalDTO;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.Local}.
 */
@RestController
@RequestMapping("/api/locals")
public class LocalResource {

    private static final Logger LOG = LoggerFactory.getLogger(LocalResource.class);

    private static final String ENTITY_NAME = "local";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LocalService localService;

    private final LocalRepository localRepository;

    public LocalResource(LocalService localService, LocalRepository localRepository) {
        this.localService = localService;
        this.localRepository = localRepository;
    }

    /**
     * {@code POST  /locals} : Create a new local.
     *
     * @param localDTO the localDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new localDTO, or with status {@code 400 (Bad Request)} if the local has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LocalDTO> createLocal(@Valid @RequestBody LocalDTO localDTO) throws URISyntaxException {
        LOG.debug("REST request to save Local : {}", localDTO);
        if (localDTO.getId() != null) {
            throw new BadRequestAlertException("A new local cannot already have an ID", ENTITY_NAME, "idexists");
        }
        localDTO = localService.save(localDTO);
        return ResponseEntity.created(new URI("/api/locals/" + localDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, localDTO.getId().toString()))
            .body(localDTO);
    }

    /**
     * {@code PUT  /locals/:id} : Updates an existing local.
     *
     * @param id the id of the localDTO to save.
     * @param localDTO the localDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated localDTO,
     * or with status {@code 400 (Bad Request)} if the localDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the localDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<LocalDTO> updateLocal(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody LocalDTO localDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Local : {}, {}", id, localDTO);
        if (localDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, localDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!localRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        localDTO = localService.update(localDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, localDTO.getId().toString()))
            .body(localDTO);
    }

    /**
     * {@code PATCH  /locals/:id} : Partial updates given fields of an existing local, field will ignore if it is null
     *
     * @param id the id of the localDTO to save.
     * @param localDTO the localDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated localDTO,
     * or with status {@code 400 (Bad Request)} if the localDTO is not valid,
     * or with status {@code 404 (Not Found)} if the localDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the localDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LocalDTO> partialUpdateLocal(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody LocalDTO localDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Local partially : {}, {}", id, localDTO);
        if (localDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, localDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!localRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LocalDTO> result = localService.partialUpdate(localDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, localDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /locals} : get all the locals.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of locals in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LocalDTO>> getAllLocals(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Locals");
        Page<LocalDTO> page = localService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /locals/:id} : get the "id" local.
     *
     * @param id the id of the localDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the localDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<LocalDTO> getLocal(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Local : {}", id);
        Optional<LocalDTO> localDTO = localService.findOne(id);
        return ResponseUtil.wrapOrNotFound(localDTO);
    }

    /**
     * {@code DELETE  /locals/:id} : delete the "id" local.
     *
     * @param id the id of the localDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLocal(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Local : {}", id);
        localService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
