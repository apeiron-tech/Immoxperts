package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.AdresseDispoparc;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AdresseDispoparc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdresseDispoparcRepository extends JpaRepository<AdresseDispoparc, Integer> {}
