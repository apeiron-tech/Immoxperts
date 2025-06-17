package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.MutationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MutationSearchService {
    /**
     * Search mutations using the materialized view.
     *
     * @param novoie the street number (optional)
     * @param btq the street number suffix (optional)
     * @param typvoie the street type (optional)
     * @param voie the street name (optional)
     * @param commune the city name (optional)
     * @param codepostal the postal code (optional)
     * @param pageable the pagination information
     * @return a page of mutations matching the search criteria
     */
    Page<MutationDTO> searchMutations(
        Integer novoie,
        String btq,
        String typvoie,
        String voie,
        String commune,
        String codepostal,
        Pageable pageable
    );

    /**
     * Refresh the materialized view.
     */
    void refreshMaterializedView();
}
