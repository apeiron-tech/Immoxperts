package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.AdresseLocalDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.AdresseLocal}.
 */
public interface AdresseLocalService {
    /**
     * Save a adresseLocal.
     *
     * @param adresseLocalDTO the entity to save.
     * @return the persisted entity.
     */
    AdresseLocalDTO save(AdresseLocalDTO adresseLocalDTO);

    /**
     * Updates a adresseLocal.
     *
     * @param adresseLocalDTO the entity to update.
     * @return the persisted entity.
     */
    AdresseLocalDTO update(AdresseLocalDTO adresseLocalDTO);

    /**
     * Get all the adresseLocals.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<AdresseLocalDTO> findAll(Pageable pageable);

    /**
     * Get the "id" adresseLocal.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AdresseLocalDTO> findOne(Integer id);

    /**
     * Delete the "id" adresseLocal.
     *
     * @param id the id of the entity.
     */
    void delete(Integer id);
}
