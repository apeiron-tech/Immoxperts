package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.AdresseDispoparcDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.AdresseDispoparc}.
 */
public interface AdresseDispoparcService {
    /**
     * Save a adresseDispoparc.
     *
     * @param adresseDispoparcDTO the entity to save.
     * @return the persisted entity.
     */
    AdresseDispoparcDTO save(AdresseDispoparcDTO adresseDispoparcDTO);

    /**
     * Updates a adresseDispoparc.
     *
     * @param adresseDispoparcDTO the entity to update.
     * @return the persisted entity.
     */
    AdresseDispoparcDTO update(AdresseDispoparcDTO adresseDispoparcDTO);

    /**
     * Partially updates a adresseDispoparc.
     *
     * @param adresseDispoparcDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AdresseDispoparcDTO> partialUpdate(AdresseDispoparcDTO adresseDispoparcDTO);

    /**
     * Get all the adresseDispoparcs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AdresseDispoparcDTO> findAll(Pageable pageable);

    /**
     * Get the "id" adresseDispoparc.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdresseDispoparcDTO> findOne(Integer id);

    /**
     * Delete the "id" adresseDispoparc.
     *
     * @param id the id of the entity.
     */
    void delete(Integer id);
}
