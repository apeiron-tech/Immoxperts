package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.LotDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.Lot}.
 */
public interface LotService {
    /**
     * Save a lot.
     *
     * @param lotDTO the entity to save.
     * @return the persisted entity.
     */
    LotDTO save(LotDTO lotDTO);

    /**
     * Updates a lot.
     *
     * @param lotDTO the entity to update.
     * @return the persisted entity.
     */
    LotDTO update(LotDTO lotDTO);

    /**
     * Partially updates a lot.
     *
     * @param lotDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LotDTO> partialUpdate(LotDTO lotDTO);

    /**
     * Get all the lots.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LotDTO> findAll(Pageable pageable);

    /**
     * Get the "id" lot.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LotDTO> findOne(Long id);

    /**
     * Delete the "id" lot.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
