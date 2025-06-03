package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Lot;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Lot entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LotRepository extends JpaRepository<Lot, Integer> {}
