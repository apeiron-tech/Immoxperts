package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import java.math.BigDecimal;
import java.time.LocalDate;
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
        SELECT
            type_bien,
            nombre_mutations,
            prix_moyen_dec2024,
            prix_m2_moyen_dec2024
        FROM dvf.mutation_stats_by_city
        WHERE code_insee = :codeInsee
        ORDER BY nombre_mutations DESC
        """,
        nativeQuery = true
    )
    List<Object[]> findStatsByCodeInsee(@Param("codeInsee") String codeInsee);

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
        SELECT DISTINCT * FROM mutation_search_mv
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

    @Query(
        value = """
        SELECT feature_json::text
        FROM dvf.parcelles_mutations_aggregated_mv
        WHERE point_geom && ST_MakeEnvelope(:west, :south, :east, :north, 4326)
        AND (COALESCE(:propertyTypes, NULL) IS NULL OR type_groupe = ANY(CAST(:propertyTypes AS text[])))
        AND (
            COALESCE(:roomCounts, NULL) IS NULL
            OR
            CASE
                WHEN type_groupe IN ('Terrain', 'Local Commercial', 'Bien Multiple') THEN true
                ELSE nombre_pieces_principales = ANY(CAST(:roomCounts AS integer[]))
            END
        )
        AND (COALESCE(:minPrice, NULL) IS NULL OR valeur_fonciere >= CAST(:minPrice AS numeric))
        AND (COALESCE(:maxPrice, NULL) IS NULL OR valeur_fonciere <= CAST(:maxPrice AS numeric))
        AND (COALESCE(:minSurfaceBatie, NULL) IS NULL OR surface_batie >= CAST(:minSurfaceBatie AS integer))
        AND (COALESCE(:maxSurfaceBatie, NULL) IS NULL OR surface_batie <= CAST(:maxSurfaceBatie AS integer))
        AND (COALESCE(:minSurfaceTerrain, NULL) IS NULL OR surface_terrain >= CAST(:minSurfaceTerrain AS integer))
        AND (COALESCE(:maxSurfaceTerrain, NULL) IS NULL OR surface_terrain <= CAST(:maxSurfaceTerrain AS integer))
        AND (COALESCE(:minPriceM2, NULL) IS NULL OR prix_m2 >= CAST(:minPriceM2 AS numeric))
        AND (COALESCE(:maxPriceM2, NULL) IS NULL OR prix_m2 <= CAST(:maxPriceM2 AS numeric))
        AND (COALESCE(:minDate, NULL) IS NULL OR date_mutation >= CAST(:minDate AS date))
        AND (COALESCE(:maxDate, NULL) IS NULL OR date_mutation <= CAST(:maxDate AS date))
        ORDER BY valeur_fonciere DESC
        LIMIT CAST(:limit AS integer)
        """,
        nativeQuery = true
    )
    List<String> findAggregatedMutations(
        @Param("west") Double west,
        @Param("south") Double south,
        @Param("east") Double east,
        @Param("north") Double north,
        @Param("propertyTypes") String[] propertyTypes,
        @Param("roomCounts") Integer[] roomCounts,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("minSurfaceBatie") Integer minSurfaceBatie,
        @Param("maxSurfaceBatie") Integer maxSurfaceBatie,
        @Param("minSurfaceTerrain") Integer minSurfaceTerrain,
        @Param("maxSurfaceTerrain") Integer maxSurfaceTerrain,
        @Param("minPriceM2") BigDecimal minPriceM2,
        @Param("maxPriceM2") BigDecimal maxPriceM2,
        @Param("minDate") LocalDate minDate,
        @Param("maxDate") LocalDate maxDate,
        @Param("limit") Integer limit
    );
}
