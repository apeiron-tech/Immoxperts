package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.AdresseLocal;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AdresseLocal entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdresseLocalRepository extends JpaRepository<AdresseLocal, Integer> {
    @Query("SELECT SUM(l.sbati) FROM Local l WHERE l.idmutation = :idMutation")
    BigDecimal surfaceMutaion(@Param("idMutation") Long idMutation);
}
