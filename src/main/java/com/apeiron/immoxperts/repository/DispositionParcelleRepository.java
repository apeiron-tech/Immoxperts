package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DispositionParcelle;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DispositionParcelle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DispositionParcelleRepository extends JpaRepository<DispositionParcelle, Long> {}
