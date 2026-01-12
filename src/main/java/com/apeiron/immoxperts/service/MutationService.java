package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.dto.MutationSearchDTO;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link com.apeiron.immoxperts.domain.Mutation}.
 */
public interface MutationService {
    Optional<MutationDTO> findOne(Integer id);

    List<MutationDTO> getMutationsByAdresseId(Integer adresseId);

    List<MutationDTO> getMutationsByVoie(String voie);

    List<MutationDTO> searchMutations(String novoie, String voie);

    /**
     * Search mutations by street and commune.
     *
     * @param street the street name
     * @param commune the commune name
     * @param pageable the pagination information
     * @return a page of mutations matching the criteria
     */
    Page<MutationDTO> searchMutationsByStreetAndCommune(String street, String commune, Pageable pageable);

    /**
     * Search mutations by address components.
     *
     * @param streetNumber the street number (optional)
     * @param streetName the street name (optional)
     * @param postalCode the postal code (optional)
     * @param city the city name (optional)
     * @return the list of mutations matching the address criteria
     */
    List<MutationDTO> searchMutationsByAddress(Integer streetNumber, String streetName, String postalCode, String city);

    /**
     * Get parcel addresses by parcel ID.
     *
     * @param parcelId the parcel ID
     * @return the parcel addresses as JSON string, or null if not found
     */
    String getParcelAddresses(String parcelId);
}
