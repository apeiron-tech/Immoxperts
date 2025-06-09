package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.LocalDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.Local}.
 */
public interface LocalService {
    /**
     * Save a local.
     *
     * @param localDTO the entity to save.
     * @return the persisted entity.
     */
    LocalDTO save(LocalDTO localDTO);

    /**
     * Updates a local.
     *
     * @param localDTO the entity to update.
     * @return the persisted entity.
     */
    LocalDTO update(LocalDTO localDTO);

    /**
     * Partially updates a local.
     *
     * @param localDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<LocalDTO> partialUpdate(LocalDTO localDTO);

    /**
     * Get all the locals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<LocalDTO> findAll(Pageable pageable);

    /**
     * Get the "id" local.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<LocalDTO> findOne(Integer id);

    /**
     * Delete the "id" local.
     *
     * @param id the id of the entity.
     */
    void delete(Integer id);
}
