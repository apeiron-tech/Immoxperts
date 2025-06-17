package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Mutation entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MutationRepository extends JpaRepository<Mutation, Integer> {
    @Query("SELECT DISTINCT m FROM Mutation m " + "JOIN m.adresseLocals al " + "WHERE al.adresse.idadresse = :idadresse")
    List<Mutation> findByAdresseId(@Param("idadresse") Integer idadresse);

    @Query("SELECT DISTINCT m FROM Mutation m " + "JOIN m.adresseLocals al " + "WHERE al.adresse.idadresse = :idadresse")
    List<Mutation> findByAdresseLocalId(@Param("idadresse") Integer idadresse);

    @Query("SELECT DISTINCT m FROM Mutation m " + "JOIN m.adresseDispoparcs ad " + "WHERE ad.adresse.idadresse = :idadresse") // Navigate through Adresse entity
    List<Mutation> findByAdresseDispoParcId(@Param("idadresse") Integer idadresse);

    @Query(
        """
        SELECT DISTINCT m FROM Mutation m
        LEFT JOIN FETCH m.adresseLocals al
        LEFT JOIN FETCH al.adresse a
        LEFT JOIN FETCH m.adresseDispoparcs ad
        LEFT JOIN FETCH ad.adresse adr
        WHERE (:street IS NULL OR UPPER(a.voie) LIKE UPPER(CONCAT('%', :street, '%')))
          AND UPPER(a.commune) = UPPER(:commune)
        """
    )
    List<Mutation> findMutationsByStreetAndCommune(@Param("street") String street, @Param("commune") String commune);

    @Query(
        value = """
        SELECT * FROM mutation_search_mv
        WHERE (:novoie IS NULL OR novoie = :novoie)
          AND (:btq IS NULL OR UPPER(btq) = UPPER(:btq))
          AND (:typvoie IS NULL OR UPPER(typvoie) = UPPER(:typvoie))
          AND (:voieRestante IS NULL OR UPPER(voie) LIKE UPPER(CONCAT(:voieRestante, '%')))
        ORDER BY datemut DESC
        """,
        nativeQuery = true
    )
    Page<Mutation> searchMutationsByCriteria(
        @Param("novoie") Integer novoie,
        @Param("btq") String btq,
        @Param("typvoie") String typvoie,
        @Param("voieRestante") String voieRestante,
        Pageable pageable
    );

    @Query(
        value = """
        SELECT DISTINCT m.idmutation, m.coddep, m.datemut, m.idnatmut, m.sterr, m.valeurfonc, m.vefa
        FROM mutation m
        JOIN adresse_local al ON m.idmutation = al.idmutation
        JOIN adresse a ON al.idadresse = a.idadresse
        WHERE (:novoie IS NULL OR a.novoie = :novoie)
          AND (:btq IS NULL OR UPPER(CAST(a.btq AS TEXT)) = UPPER(:btq))
          AND (:typvoie IS NULL OR UPPER(a.typvoie) = UPPER(:typvoie))
          AND (:voie IS NULL OR UPPER(a.voie) LIKE CONCAT('%', UPPER(:voie), '%'))
        """,
        nativeQuery = true
    )
    List<Object[]> fastSearchMutationsNative(
        @Param("novoie") Integer novoie,
        @Param("btq") String btq,
        @Param("typvoie") String typvoie,
        @Param("voie") String voieRestante
    );

    @Query(
        """
            SELECT DISTINCT m FROM Mutation m
            JOIN m.adresseLocals al
            JOIN al.adresse a
            WHERE (:streetNumber IS NULL OR a.novoie = :streetNumber)
              AND (:streetName IS NULL OR UPPER(a.voie) LIKE UPPER(CONCAT('%', :streetName, '%')))
              AND (:postalCode IS NULL OR a.codepostal = :postalCode)
              AND (:city IS NULL OR UPPER(a.commune) LIKE UPPER(CONCAT('%', :city, '%')))
        """
    )
    List<Mutation> searchMutationsByAddress(
        @Param("streetNumber") Integer streetNumber,
        @Param("streetName") String streetName,
        @Param("postalCode") String postalCode,
        @Param("city") String city
    );

    @Query(
        value = """
        SELECT * FROM mutation_search_mv
        WHERE UPPER(commune) LIKE UPPER(CONCAT('%', :commune, '%'))
        ORDER BY datemut DESC
        """,
        nativeQuery = true
    )
    List<Mutation> findMutationsByCommune(@Param("commune") String commune);

    @Query(
        value = """
        SELECT * FROM mutation_search_mv
        WHERE UPPER(commune) LIKE UPPER(CONCAT('%', :commune, '%'))
        ORDER BY datemut DESC
        """,
        nativeQuery = true
    )
    Page<Mutation> findMutationsByCommunePageable(@Param("commune") String commune, Pageable pageable);

    @Query(
        value = """
        SELECT * FROM mutation_search_mv
        WHERE UPPER(commune) = UPPER(:commune)
          AND (:street IS NULL OR UPPER(voie) LIKE UPPER(CONCAT(:street, '%')))
        ORDER BY datemut DESC
        LIMIT :limit
        """,
        nativeQuery = true
    )
    List<Mutation> findMutationsByCommuneAndStreet(
        @Param("commune") String commune,
        @Param("street") String street,
        @Param("limit") int limit
    );

    @Query(
        value = """
        SELECT COUNT(*) FROM mutation_search_mv
        WHERE UPPER(commune) = UPPER(:commune)
          AND (:street IS NULL OR UPPER(voie) LIKE UPPER(CONCAT(:street, '%')))
        """,
        nativeQuery = true
    )
    long countMutationsByCommuneAndStreet(@Param("commune") String commune, @Param("street") String street);
}
