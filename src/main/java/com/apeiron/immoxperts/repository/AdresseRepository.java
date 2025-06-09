package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Adresse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Adresse entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AdresseRepository extends JpaRepository<Adresse, Integer>, JpaSpecificationExecutor<Adresse> {
    @Query(
        "SELECT a FROM Adresse a WHERE " +
        "(:voie IS NULL OR a.voie LIKE %:voie%) AND " +
        "(:commune IS NULL OR a.commune LIKE %:commune%) AND " +
        "(:codepostal IS NULL OR a.codepostal = :codepostal)"
    )
    List<Adresse> findBySearchCriteria(
        @Param("voie") String voie,
        @Param("commune") String commune,
        @Param("codepostal") String codepostal
    );

    List<Adresse> findByNovoieAndVoieAndCodepostalAndCommune(Integer novoie, String voie, String codepostal, String commune);
    List<Adresse> findByVoieContainingIgnoreCase(String voie);
}
