package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.service.dto.AddressSuggestionProjection;
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

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:q), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestions(@Param("q") String q);

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:token1), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestionsByToken(@Param("token1") String token1);

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:token1), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token2), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestionsByTwoTokens(@Param("token1") String token1, @Param("token2") String token2);

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:token1), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token2), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token3), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestionsByThreeTokens(
        @Param("token1") String token1,
        @Param("token2") String token2,
        @Param("token3") String token3
    );

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:token1), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token2), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token3), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token4), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestionsByFourTokens(
        @Param("token1") String token1,
        @Param("token2") String token2,
        @Param("token3") String token3,
        @Param("token4") String token4
    );

    @Query(
        value = """
        SELECT
            idadresse,
            adresse_complete as adresseComplete,
            numero,
            nom_voie as nomVoie,
            type_voie as typeVoie,
            codepostal,
            commune,
            MIN(latitude) as latitude,
            MIN(longitude) as longitude
        FROM dvf_plus_2025_2.adresse_complete_geom_mv
        WHERE adresse_complete ILIKE CONCAT('%', UPPER(:token1), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token2), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token3), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token4), '%')
          AND adresse_complete ILIKE CONCAT('%', UPPER(:token5), '%')
        GROUP BY idadresse, adresse_complete, numero, nom_voie, type_voie, codepostal, commune
        ORDER BY commune, nom_voie, numero
        LIMIT 50
        """,
        nativeQuery = true
    )
    List<AddressSuggestionProjection> findSuggestionsByFiveTokens(
        @Param("token1") String token1,
        @Param("token2") String token2,
        @Param("token3") String token3,
        @Param("token4") String token4,
        @Param("token5") String token5
    );
}
