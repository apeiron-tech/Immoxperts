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
        if (dispositionParcelleDTO.getIddispopar() != null) {
            throw new BadRequestAlertException("A new dispositionParcelle cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DispositionParcelleDTO result = dispositionParcelleService.save(dispositionParcelleDTO);
        return ResponseEntity.created(new URI("/api/disposition-parcelles/" + result.getIddispopar()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getIddispopar().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /disposition-parcelles/:iddispopar} : Updates an existing dispositionParcelle.
     *
     * @param iddispopar the iddispopar of the dispositionParcelleDTO to save.
     * @param dispositionParcelleDTO the dispositionParcelleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dispositionParcelleDTO,
     * or with status {@code 400 (Bad Request)} if the dispositionParcelleDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dispositionParcelleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{iddispopar}")
    public ResponseEntity<DispositionParcelleDTO> updateDispositionParcelle(
        @PathVariable(value = "iddispopar", required = false) final Integer iddispopar,
        @Valid @RequestBody DispositionParcelleDTO dispositionParcelleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update DispositionParcelle : {}, {}", iddispopar, dispositionParcelleDTO);
        if (dispositionParcelleDTO.getIddispopar() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(iddispopar, dispositionParcelleDTO.getIddispopar())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dispositionParcelleRepository.existsById(iddispopar)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        DispositionParcelleDTO result = dispositionParcelleService.update(dispositionParcelleDTO);
        return ResponseEntity.ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dispositionParcelleDTO.getIddispopar().toString())
            )
            .body(result);
    }

    /**
     * {@code PATCH  /disposition-parcelles/:iddispopar} : Partial updates given fields of an existing dispositionParcelle, field will ignore if it is null
     *
     * @param iddispopar the iddispopar of the dispositionParcelleDTO to save.
     * @param dispositionParcelleDTO the dispositionParcelleDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dispositionParcelleDTO,
     * or with status {@code 400 (Bad Request)} if the dispositionParcelleDTO is not valid,
     * or with status {@code 404 (Not Found)} if the dispositionParcelleDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the dispositionParcelleDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{iddispopar}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<DispositionParcelleDTO> partialUpdateDispositionParcelle(
        @PathVariable(value = "iddispopar", required = false) final Integer iddispopar,
        @NotNull @RequestBody DispositionParcelleDTO dispositionParcelleDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update DispositionParcelle partially : {}, {}", iddispopar, dispositionParcelleDTO);
        if (dispositionParcelleDTO.getIddispopar() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(iddispopar, dispositionParcelleDTO.getIddispopar())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!dispositionParcelleRepository.existsById(iddispopar)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<DispositionParcelleDTO> result = dispositionParcelleService.partialUpdate(dispositionParcelleDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dispositionParcelleDTO.getIddispopar().toString())
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
     * {@code GET  /disposition-parcelles/:iddispopar} : get the "iddispopar" dispositionParcelle.
     *
     * @param iddispopar the iddispopar of the dispositionParcelleDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dispositionParcelleDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{iddispopar}")
    public ResponseEntity<DispositionParcelleDTO> getDispositionParcelle(@PathVariable("iddispopar") Integer iddispopar) {
        LOG.debug("REST request to get DispositionParcelle : {}", iddispopar);
        Optional<DispositionParcelleDTO> dispositionParcelleDTO = dispositionParcelleService.findOne(iddispopar);
        return ResponseUtil.wrapOrNotFound(dispositionParcelleDTO);
    }

    /**
     * {@code DELETE  /disposition-parcelles/:iddispopar} : delete the "iddispopar" dispositionParcelle.
     *
     * @param iddispopar the iddispopar of the dispositionParcelleDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{iddispopar}")
    public ResponseEntity<Void> deleteDispositionParcelle(@PathVariable("iddispopar") Integer iddispopar) {
        LOG.debug("REST request to delete DispositionParcelle : {}", iddispopar);
        dispositionParcelleService.delete(iddispopar);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, iddispopar.toString()))
            .build();
    }
}
