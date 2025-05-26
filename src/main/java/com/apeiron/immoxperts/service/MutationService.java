package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.MutationDTO;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.Mutation}.
 */
public interface MutationService {
    /**
     * Save a mutation.
     *
     * @param mutationDTO the entity to save.
     * @return the persisted entity.
     */
    MutationDTO save(MutationDTO mutationDTO);

    /**
     * Updates a mutation.
     *
     * @param mutationDTO the entity to update.
     * @return the persisted entity.
     */
    MutationDTO update(MutationDTO mutationDTO);

    /**
     * Partially updates a mutation.
     *
     * @param mutationDTO the entity to update partially.
     * @return the persisted entity.
     */
    Optional<MutationDTO> partialUpdate(MutationDTO mutationDTO);

    /**
     * Get all the mutations.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<MutationDTO> findAll(Pageable pageable);

    /**
     * Get the "id" mutation.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<MutationDTO> findOne(Long id);

    /**
     * Delete the "id" mutation.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
