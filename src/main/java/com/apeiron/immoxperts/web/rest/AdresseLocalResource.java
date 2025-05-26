package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.AdresseLocalRepository;
import com.apeiron.immoxperts.service.AdresseLocalService;
import com.apeiron.immoxperts.service.dto.AdresseLocalDTO;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.AdresseLocal}.
 */
@RestController
@RequestMapping("/api/adresse-locals")
public class AdresseLocalResource {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseLocalResource.class);

    private static final String ENTITY_NAME = "adresseLocal";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AdresseLocalService adresseLocalService;

    private final AdresseLocalRepository adresseLocalRepository;

    public AdresseLocalResource(AdresseLocalService adresseLocalService, AdresseLocalRepository adresseLocalRepository) {
        this.adresseLocalService = adresseLocalService;
        this.adresseLocalRepository = adresseLocalRepository;
    }

    /**
     * {@code POST  /adresse-locals} : Create a new adresseLocal.
     *
     * @param adresseLocalDTO the adresseLocalDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new adresseLocalDTO, or with status {@code 400 (Bad Request)} if the adresseLocal has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AdresseLocalDTO> createAdresseLocal(@Valid @RequestBody AdresseLocalDTO adresseLocalDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save AdresseLocal : {}", adresseLocalDTO);
        if (adresseLocalDTO.getId() != null) {
            throw new BadRequestAlertException("A new adresseLocal cannot already have an ID", ENTITY_NAME, "idexists");
        }
        adresseLocalDTO = adresseLocalService.save(adresseLocalDTO);
        return ResponseEntity.created(new URI("/api/adresse-locals/" + adresseLocalDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, adresseLocalDTO.getId().toString()))
            .body(adresseLocalDTO);
    }

    /**
     * {@code PUT  /adresse-locals/:id} : Updates an existing adresseLocal.
     *
     * @param id the id of the adresseLocalDTO to save.
     * @param adresseLocalDTO the adresseLocalDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseLocalDTO,
     * or with status {@code 400 (Bad Request)} if the adresseLocalDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the adresseLocalDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AdresseLocalDTO> updateAdresseLocal(
        @PathVariable(value = "id", required = false) final Integer id,
        @Valid @RequestBody AdresseLocalDTO adresseLocalDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update AdresseLocal : {}, {}", id, adresseLocalDTO);
        if (adresseLocalDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseLocalDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseLocalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        adresseLocalDTO = adresseLocalService.update(adresseLocalDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseLocalDTO.getId().toString()))
            .body(adresseLocalDTO);
    }

    /**
     * {@code PATCH  /adresse-locals/:id} : Partial updates given fields of an existing adresseLocal, field will ignore if it is null
     *
     * @param id the id of the adresseLocalDTO to save.
     * @param adresseLocalDTO the adresseLocalDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated adresseLocalDTO,
     * or with status {@code 400 (Bad Request)} if the adresseLocalDTO is not valid,
     * or with status {@code 404 (Not Found)} if the adresseLocalDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the adresseLocalDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AdresseLocalDTO> partialUpdateAdresseLocal(
        @PathVariable(value = "id", required = false) final Integer id,
        @NotNull @RequestBody AdresseLocalDTO adresseLocalDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update AdresseLocal partially : {}, {}", id, adresseLocalDTO);
        if (adresseLocalDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, adresseLocalDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!adresseLocalRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AdresseLocalDTO> result = adresseLocalService.partialUpdate(adresseLocalDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, adresseLocalDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /adresse-locals} : get all the adresseLocals.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of adresseLocals in body.
     */
    @GetMapping("")
    public ResponseEntity<List<AdresseLocalDTO>> getAllAdresseLocals(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of AdresseLocals");
        Page<AdresseLocalDTO> page = adresseLocalService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /adresse-locals/:id} : get the "id" adresseLocal.
     *
     * @param id the id of the adresseLocalDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the adresseLocalDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AdresseLocalDTO> getAdresseLocal(@PathVariable("id") Integer id) {
        LOG.debug("REST request to get AdresseLocal : {}", id);
        Optional<AdresseLocalDTO> adresseLocalDTO = adresseLocalService.findOne(id);
        return ResponseUtil.wrapOrNotFound(adresseLocalDTO);
    }

    /**
     * {@code DELETE  /adresse-locals/:id} : delete the "id" adresseLocal.
     *
     * @param id the id of the adresseLocalDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdresseLocal(@PathVariable("id") Integer id) {
        LOG.debug("REST request to delete AdresseLocal : {}", id);
        adresseLocalService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
