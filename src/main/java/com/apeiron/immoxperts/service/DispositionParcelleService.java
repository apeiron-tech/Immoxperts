package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.DispositionParcelleDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.DispositionParcelle}.
 */
public interface DispositionParcelleService {
    /**
     * Save a dispositionParcelle.
     *
     * @param dispositionParcelleDTO the entity to save.
     * @return the persisted entity.
     */
    DispositionParcelleDTO save(DispositionParcelleDTO dispositionParcelleDTO);

    /**
     * Updates a dispositionParcelle.
     *
     * @param dispositionParcelleDTO the entity to update.
     * @return the persisted entity.
     */
    DispositionParcelleDTO update(DispositionParcelleDTO dispositionParcelleDTO);

    /**
     * Partially updates a dispositionParcelle.
     *
     * @param dispositionParcelleDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<DispositionParcelleDTO> partialUpdate(DispositionParcelleDTO dispositionParcelleDTO);

    /**
     * Get all the dispositionParcelles.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<DispositionParcelleDTO> findAll(Pageable pageable);

    /**
     * Get the "iddispopar" dispositionParcelle.
     *
     * @param iddispopar the iddispopar of the entity.
     * @return the entity.
     */
    Optional<DispositionParcelleDTO> findOne(Integer iddispopar);

    /**
     * Delete the "iddispopar" dispositionParcelle.
     *
     * @param iddispopar the iddispopar of the entity.
     */
    void delete(Integer iddispopar);
}
