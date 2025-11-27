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
        SELECT DISTINCT m.*
        FROM dvf_plus_2025_2.dvf_plus_mutation m
        JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON m.idmutation = pam.idmutation
        WHERE (:novoie IS NULL OR pam.adresse_json->>'novoie' = CAST(:novoie AS text))
          AND (:btq IS NULL OR UPPER(pam.adresse_json->>'btq') = UPPER(:btq))
          AND (:typvoie IS NULL OR UPPER(pam.adresse_json->>'typvoie') = UPPER(:typvoie))
          AND (:voieRestante IS NULL OR UPPER(pam.adresse_json->>'voie') LIKE UPPER(CONCAT(:voieRestante, '%')))
        ORDER BY pam.mutation_date DESC
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
        FROM dvf_plus_2025_2.mutation_stats_by_city
        WHERE code_insee = :codeInsee
        ORDER BY nombre_mutations DESC
        """,
        nativeQuery = true
    )
    List<Object[]> findStatsByCodeInsee(@Param("codeInsee") String codeInsee);

    @Query(
        value = """
        SELECT DISTINCT m.*
        FROM dvf_plus_2025_2.dvf_plus_mutation m
        JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON m.idmutation = pam.idmutation
        WHERE UPPER(pam.adresse_json->>'commune') LIKE UPPER(CONCAT('%', :commune, '%'))
        ORDER BY pam.mutation_date DESC
        """,
        nativeQuery = true
    )
    List<Mutation> findMutationsByCommune(@Param("commune") String commune);

    @Query(
        value = """
        SELECT DISTINCT m.*
        FROM dvf_plus_2025_2.dvf_plus_mutation m
        JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON m.idmutation = pam.idmutation
        WHERE UPPER(pam.adresse_json->>'commune') LIKE UPPER(CONCAT('%', :commune, '%'))
        ORDER BY pam.mutation_date DESC
        """,
        nativeQuery = true
    )
    Page<Mutation> findMutationsByCommunePageable(@Param("commune") String commune, Pageable pageable);

    @Query(
        value = """
        SELECT DISTINCT m.*
        FROM dvf_plus_2025_2.dvf_plus_mutation m
        JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON m.idmutation = pam.idmutation
        WHERE UPPER(pam.adresse_json->>'commune') = UPPER(:commune)
          AND (:street IS NULL OR UPPER(pam.adresse_json->>'voie') LIKE UPPER(CONCAT(:street, '%')))
        ORDER BY pam.mutation_date DESC
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
        SELECT COUNT(DISTINCT m.idmutation)
        FROM dvf_plus_2025_2.dvf_plus_mutation m
        JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON m.idmutation = pam.idmutation
        WHERE UPPER(pam.adresse_json->>'commune') = UPPER(:commune)
          AND (:street IS NULL OR UPPER(pam.adresse_json->>'voie') LIKE UPPER(CONCAT(:street, '%')))
        """,
        nativeQuery = true
    )
    long countMutationsByCommuneAndStreet(@Param("commune") String commune, @Param("street") String street);

    @Query(
        value = """
        WITH filtered_mutations AS (
            SELECT
                pg.idparcelle,
                pg.feature,
                pa.idpar,
                pa.canonical_id AS idadresse,
                pa.adresse_info AS adresse,
                pam.mutation,
                pam.mutation_date,
                pam.type_bien,
                pam.nombre_piece,
                pam.surface_batiment,
                pam.surface_terrain,
                (pam.mutation->>'valeur')::numeric AS valeur,
                (pam.mutation->>'prix_m2')::numeric AS prix_m2
            FROM dvf_plus_2025_2.parcelles_geojson_mv pg
            JOIN dvf_plus_2025_2.parcelle_adresse_mv pa ON pg.idparcelle = pa.idpar
            JOIN dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam ON pa.idpar = pam.idpar
                AND pa.canonical_id = pam.idadresse
            WHERE pg.point_geom && ST_MakeEnvelope(:west, :south, :east, :north, 4326)
              -- Step 1: Filter by property type (REQUIRED - always applied)
              AND (COALESCE(:propertyTypes, NULL) IS NULL OR pam.type_bien = ANY(CAST(:propertyTypes AS text[])))
              -- Step 2: Filter by price (total transaction price)
              AND (COALESCE(:minPrice, NULL) IS NULL OR (pam.mutation->>'valeur')::numeric >= CAST(:minPrice AS numeric))
              AND (COALESCE(:maxPrice, NULL) IS NULL OR (pam.mutation->>'valeur')::numeric <= CAST(:maxPrice AS numeric))
              -- Step 2b: Filter by price per m² (if specified)
              AND (COALESCE(:minPriceM2, NULL) IS NULL OR (pam.mutation->>'prix_m2')::numeric >= CAST(:minPriceM2 AS numeric))
              AND (COALESCE(:maxPriceM2, NULL) IS NULL OR (pam.mutation->>'prix_m2')::numeric <= CAST(:maxPriceM2 AS numeric))
              -- Step 3: Filter by date
              AND (COALESCE(:minDate, NULL) IS NULL OR pam.mutation_date >= CAST(:minDate AS date))
              AND (COALESCE(:maxDate, NULL) IS NULL OR pam.mutation_date <= CAST(:maxDate AS date))
              -- Step 4: Filter by room count (only for Appartement and Maison)
              AND (
                  pam.type_bien NOT IN ('Appartement', 'Maison')
                  OR (
                      pam.type_bien IN ('Appartement', 'Maison')
                      AND (
                          CAST(:roomCounts AS integer[]) IS NULL
                          OR (-1 = ANY(CAST(:roomCounts AS integer[])) AND (pam.nombre_piece IS NULL OR pam.nombre_piece = 0))
                          OR (-1 <> ALL(CAST(:roomCounts AS integer[])) AND pam.nombre_piece = ANY(CAST(:roomCounts AS integer[])))
                      )
                  )
              )
              -- Step 5: Filter by built surface (only for Appartement, Maison, Local Commercial)
              AND (
                  COALESCE(:minSurfaceBatie, NULL) IS NULL
                  OR pam.type_bien NOT IN ('Appartement', 'Maison', 'Local Commercial')
                  OR (pam.surface_batiment IS NOT NULL AND pam.surface_batiment >= CAST(:minSurfaceBatie AS integer))
              )
              AND (
                  COALESCE(:maxSurfaceBatie, NULL) IS NULL
                  OR pam.type_bien NOT IN ('Appartement', 'Maison', 'Local Commercial')
                  OR (pam.surface_batiment IS NOT NULL AND pam.surface_batiment <= CAST(:maxSurfaceBatie AS integer))
              )
              -- Step 6: Filter by land surface (only for Maison and Terrain)
              AND (
                  COALESCE(:minSurfaceTerrain, NULL) IS NULL
                  OR pam.type_bien NOT IN ('Maison', 'Terrain')
                  OR (pam.surface_terrain IS NOT NULL AND pam.surface_terrain >= CAST(:minSurfaceTerrain AS integer))
              )
              AND (
                  COALESCE(:maxSurfaceTerrain, NULL) IS NULL
                  OR pam.type_bien NOT IN ('Maison', 'Terrain')
                  OR (pam.surface_terrain IS NOT NULL AND pam.surface_terrain <= CAST(:maxSurfaceTerrain AS integer))
              )
        ),
        mutations_by_address AS (
            SELECT
                idparcelle,
                feature,
                idadresse,
                adresse,
                jsonb_agg(
                    mutation ORDER BY mutation_date DESC
                ) AS mutations
            FROM filtered_mutations
            GROUP BY idparcelle, feature, idadresse, adresse
        ),
        addresses_by_parcelle AS (
            SELECT
                idparcelle,
                feature,
                jsonb_agg(
                    jsonb_build_object(
                        'idadresse', idadresse,
                        'adresse_complete', adresse->>'adresse_complete',
                        'commune', adresse->>'commune',
                        'codepostal', adresse->>'codepostal',
                        'mutations', mutations
                    )
                    ORDER BY idadresse
                ) AS adresses
            FROM mutations_by_address
            GROUP BY idparcelle, feature
        )
        SELECT jsonb_build_object(
            'type', 'Feature',
            'geometry', feature->'geometry',
            'properties', feature->'properties' || jsonb_build_object('adresses', adresses)
        )::text AS feature_json
        FROM addresses_by_parcelle
        ORDER BY RANDOM()
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

    @Query(
        value = """
        SELECT jsonb_build_object(
            'idparcelle', pa.idpar,
            'adresses', jsonb_agg(
                jsonb_build_object(
                    'idadresse', pa.canonical_id,
                    'adresse_complete', pa.adresse_info->>'adresse_complete',
                    'commune', pa.adresse_info->>'commune',
                    'codepostal', pa.adresse_info->>'codepostal',
                    'mutations', (
                        SELECT jsonb_agg(pam.mutation ORDER BY pam.mutation_date DESC)
                        FROM dvf_plus_2025_2.parcelle_adresse_mutation_mv_2025 pam
                        WHERE pam.idpar = pa.idpar AND pam.idadresse = pa.canonical_id
                    )
                )
                ORDER BY pa.canonical_id
            )
        )::text AS parcel_data
        FROM dvf_plus_2025_2.parcelle_adresse_mv pa
        WHERE pa.idpar = :parcelId
        GROUP BY pa.idpar
        """,
        nativeQuery = true
    )
    String findParcelAddresses(@Param("parcelId") String parcelId);
}
