package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.AdresseLocal;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AdresseLocal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdresseLocalRepository extends JpaRepository<AdresseLocal, Integer> {}
