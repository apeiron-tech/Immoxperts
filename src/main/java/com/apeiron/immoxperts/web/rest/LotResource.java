package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.repository.LotRepository;
import com.apeiron.immoxperts.service.LotService;
import com.apeiron.immoxperts.service.dto.LotDTO;
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
 * REST controller for managing {@link com.apeiron.immoxperts.domain.Lot}.
 */
@RestController
@RequestMapping("/api/lots")
public class LotResource {

    private static final Logger LOG = LoggerFactory.getLogger(LotResource.class);

    private static final String ENTITY_NAME = "lot";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final LotService lotService;

    private final LotRepository lotRepository;

    public LotResource(LotService lotService, LotRepository lotRepository) {
        this.lotService = lotService;
        this.lotRepository = lotRepository;
    }

    /**
     * {@code POST  /lots} : Create a new lot.
     *
     * @param lotDTO the lotDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new lotDTO, or with status {@code 400 (Bad Request)} if the lot has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<LotDTO> createLot(@Valid @RequestBody LotDTO lotDTO) throws URISyntaxException {
        LOG.debug("REST request to save Lot : {}", lotDTO);
        if (lotDTO.getIddispolot() != null) {
            throw new BadRequestAlertException("A new lot cannot already have an ID", ENTITY_NAME, "idexists");
        }
        lotDTO = lotService.save(lotDTO);
        return ResponseEntity.created(new URI("/api/lots/" + lotDTO.getIddispolot()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, lotDTO.getIddispolot().toString()))
            .body(lotDTO);
    }

    /**
     * {@code PUT  /lots/:iddispolot} : Updates an existing lot.
     *
     * @param iddispolot the iddispolot of the lotDTO to save.
     * @param lotDTO the lotDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lotDTO,
     * or with status {@code 400 (Bad Request)} if the lotDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the lotDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{iddispolot}")
    public ResponseEntity<LotDTO> updateLot(
        @PathVariable(value = "iddispolot", required = false) final Integer iddispolot,
        @Valid @RequestBody LotDTO lotDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Lot : {}, {}", iddispolot, lotDTO);
        if (lotDTO.getIddispolot() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(iddispolot, lotDTO.getIddispolot())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lotRepository.existsById(iddispolot)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        lotDTO = lotService.update(lotDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lotDTO.getIddispolot().toString()))
            .body(lotDTO);
    }

    /**
     * {@code PATCH  /lots/:iddispolot} : Partial updates given fields of an existing lot, field will ignore if it is null
     *
     * @param iddispolot the iddispolot of the lotDTO to save.
     * @param lotDTO the lotDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated lotDTO,
     * or with status {@code 400 (Bad Request)} if the lotDTO is not valid,
     * or with status {@code 404 (Not Found)} if the lotDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the lotDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{iddispolot}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<LotDTO> partialUpdateLot(
        @PathVariable(value = "iddispolot", required = false) final Integer iddispolot,
        @NotNull @RequestBody LotDTO lotDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Lot partially : {}, {}", iddispolot, lotDTO);
        if (lotDTO.getIddispolot() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(iddispolot, lotDTO.getIddispolot())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!lotRepository.existsById(iddispolot)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<LotDTO> result = lotService.partialUpdate(lotDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, lotDTO.getIddispolot().toString())
        );
    }

    /**
     * {@code GET  /lots} : get all the lots.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of lots in body.
     */
    @GetMapping("")
    public ResponseEntity<List<LotDTO>> getAllLots(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Lots");
        Page<LotDTO> page = lotService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /lots/:iddispolot} : get the "iddispolot" lot.
     *
     * @param iddispolot the iddispolot of the lotDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the lotDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{iddispolot}")
    public ResponseEntity<LotDTO> getLot(@PathVariable("iddispolot") Integer iddispolot) {
        LOG.debug("REST request to get Lot : {}", iddispolot);
        Optional<LotDTO> lotDTO = lotService.findOne(iddispolot);
        return ResponseUtil.wrapOrNotFound(lotDTO);
    }

    /**
     * {@code DELETE  /lots/:iddispolot} : delete the "iddispolot" lot.
     *
     * @param iddispolot the iddispolot of the lotDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{iddispolot}")
    public ResponseEntity<Void> deleteLot(@PathVariable("iddispolot") Integer iddispolot) {
        LOG.debug("REST request to delete Lot : {}", iddispolot);
        lotService.delete(iddispolot);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, iddispolot.toString()))
            .build();
    }
}
