package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.service.MutationSearchService;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.PaginationUtil;

@RestController
@RequestMapping("/api/mutation-search")
public class MutationSearchResource {

    private static final Logger LOG = LoggerFactory.getLogger(MutationSearchResource.class);

    private final MutationSearchService mutationSearchService;

    public MutationSearchResource(MutationSearchService mutationSearchService) {
        this.mutationSearchService = mutationSearchService;
    }

    @GetMapping("")
    public ResponseEntity<List<MutationDTO>> searchMutations(
        @RequestParam(required = false) Integer novoie,
        @RequestParam(required = false) String btq,
        @RequestParam(required = false) String typvoie,
        @RequestParam(required = false) String voie,
        @RequestParam(required = false) String commune,
        @RequestParam(required = false) String codepostal,
        @org.springdoc.core.annotations.ParameterObject Pageable pageable
    ) {
        LOG.debug(
            "REST request to search mutations: novoie={}, btq={}, typvoie={}, voie={}, commune={}, codepostal={}",
            novoie,
            btq,
            typvoie,
            voie,
            commune,
            codepostal
        );

        Page<MutationDTO> page = mutationSearchService.searchMutations(novoie, btq, typvoie, voie, commune, codepostal, pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @PostMapping("/refresh")
    public ResponseEntity<Void> refreshMaterializedView() {
        LOG.debug("REST request to refresh mutation search materialized view");
        mutationSearchService.refreshMaterializedView();
        return ResponseEntity.ok().build();
    }
}
