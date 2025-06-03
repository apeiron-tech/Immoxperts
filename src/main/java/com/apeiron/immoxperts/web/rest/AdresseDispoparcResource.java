package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.AdresseDispoparcRepository;
import com.apeiron.immoxperts.service.AdresseDispoparcService;
import com.apeiron.immoxperts.service.dto.AdresseDispoparcDTO;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.AdresseDispoparc}.
 */
@RestController
@RequestMapping("/api/adresse-dispoparcs")
public class AdresseDispoparcResource {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseDispoparcResource.class);

    private static final String ENTITY_NAME = "adresseDispoparc";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdresseDispoparcService adresseDispoparcService;

    private final AdresseDispoparcRepository adresseDispoparcRepository;

    public AdresseDispoparcResource(
        AdresseDispoparcService adresseDispoparcService,
        AdresseDispoparcRepository adresseDispoparcRepository
    ) {
        this.adresseDispoparcService = adresseDispoparcService;
        this.adresseDispoparcRepository = adresseDispoparcRepository;
    }

    /**
     * {@code POST  /adresse-dispoparcs} : Create a new adresseDispoparc.
     *
     * @param adresseDispoparcDTO the adresseDispoparcDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adresseDispoparcDTO, or with status {@code 400 (Bad Request)} if the adresseDispoparc has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AdresseDispoparcDTO> createAdresseDispoparc(@Valid @RequestBody AdresseDispoparcDTO adresseDispoparcDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AdresseDispoparc : {}", adresseDispoparcDTO);
        if (adresseDispoparcDTO.getIddispopar() != null) {
            throw new BadRequestAlertException("A new adresseDispoparc cannot already have an ID", ENTITY_NAME, "idexists");
        }
        adresseDispoparcDTO = adresseDispoparcService.save(adresseDispoparcDTO);
        return ResponseEntity.created(new URI("/api/adresse-dispoparcs/" + adresseDispoparcDTO.getIddispopar()))
            .headers(
                HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, adresseDispoparcDTO.getIddispopar().toString())
            )
            .body(adresseDispoparcDTO);
    }

    /**
     * {@code PUT  /adresse-dispoparcs/:id} : Updates an existing adresseDispoparc.
     *
     * @param id the id of the adresseDispoparcDTO to save.
     * @param adresseDispoparcDTO the adresseDispoparcDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseDispoparcDTO,
     * or with status {@code 400 (Bad Request)} if the adresseDispoparcDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adresseDispoparcDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdresseDispoparcDTO> updateAdresseDispoparc(
        @PathVariable(value = "id", required = false) final Integer id,
        @Valid @RequestBody AdresseDispoparcDTO adresseDispoparcDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AdresseDispoparc : {}, {}", id, adresseDispoparcDTO);
        if (adresseDispoparcDTO.getIddispopar() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseDispoparcDTO.getIddispopar())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseDispoparcRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        adresseDispoparcDTO = adresseDispoparcService.update(adresseDispoparcDTO);
        return ResponseEntity.ok()
            .headers(
                HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseDispoparcDTO.getIddispopar().toString())
            )
            .body(adresseDispoparcDTO);
    }

    /**
     * {@code PATCH  /adresse-dispoparcs/:id} : Partial updates given fields of an existing adresseDispoparc, field will ignore if it is null
     *
     * @param id the id of the adresseDispoparcDTO to save.
     * @param adresseDispoparcDTO the adresseDispoparcDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseDispoparcDTO,
     * or with status {@code 400 (Bad Request)} if the adresseDispoparcDTO is not valid,
     * or with status {@code 404 (Not Found)} if the adresseDispoparcDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the adresseDispoparcDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdresseDispoparcDTO> partialUpdateAdresseDispoparc(
        @PathVariable(value = "id", required = false) final Integer id,
        @NotNull @RequestBody AdresseDispoparcDTO adresseDispoparcDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AdresseDispoparc partially : {}, {}", id, adresseDispoparcDTO);
        if (adresseDispoparcDTO.getIddispopar() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseDispoparcDTO.getIddispopar())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseDispoparcRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdresseDispoparcDTO> result = adresseDispoparcService.partialUpdate(adresseDispoparcDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseDispoparcDTO.getIddispopar().toString())
        );
    }

    /**
     * {@code GET  /adresse-dispoparcs} : get all the adresseDispoparcs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adresseDispoparcs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AdresseDispoparcDTO>> getAllAdresseDispoparcs(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug("REST request to get a page of AdresseDispoparcs");
        Page<AdresseDispoparcDTO> page = adresseDispoparcService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /adresse-dispoparcs/:id} : get the "id" adresseDispoparc.
     *
     * @param id the id of the adresseDispoparcDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adresseDispoparcDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdresseDispoparcDTO> getAdresseDispoparc(@PathVariable("id") Integer id) {
        LOG.debug("REST request to get AdresseDispoparc : {}", id);
        Optional<AdresseDispoparcDTO> adresseDispoparcDTO = adresseDispoparcService.findOne(id);
        return ResponseUtil.wrapOrNotFound(adresseDispoparcDTO);
    }

    /**
     * {@code DELETE  /adresse-dispoparcs/:id} : delete the "id" adresseDispoparc.
     *
     * @param id the id of the adresseDispoparcDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdresseDispoparc(@PathVariable("id") Integer id) {
        LOG.debug("REST request to delete AdresseDispoparc : {}", id);
        adresseDispoparcService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
