package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.AdresseDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.Adresse}.
 */
public interface AdresseService {
    /**
     * Save a adresse.
     *
     * @param adresseDTO the entity to save.
     * @return the persisted entity.
     */
    AdresseDTO save(AdresseDTO adresseDTO);

    /**
     * Updates a adresse.
     *
     * @param adresseDTO the entity to update.
     * @return the persisted entity.
     */
    AdresseDTO update(AdresseDTO adresseDTO);

    /**
     * Partially updates a adresse.
     *
     * @param adresseDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AdresseDTO> partialUpdate(AdresseDTO adresseDTO);

    /**
     * Get all the adresses.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AdresseDTO> findAll(Pageable pageable);

    /**
     * Get the "id" adresse.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdresseDTO> findOne(Long id);

    /**
     * Delete the "id" adresse.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
