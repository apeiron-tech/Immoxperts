package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DvfLouer;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DvfLouerRepository extends JpaRepository<DvfLouer, Long> {
    @Query(
        value = """
        WITH suggestions AS (
            -- Commune suggestions with postal code in adresse
            SELECT DISTINCT
                commune as value,
                CONCAT(commune, ' (', search_postal_code, ')') as adresse,
                'commune' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE commune IS NOT NULL
            AND search_postal_code IS NOT NULL
            AND LOWER(commune) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            -- Department suggestions (simple - value and adresse are the same)
            SELECT DISTINCT
                department as value,
                department as adresse,
                'department' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE department IS NOT NULL
            AND LOWER(department) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            -- Postal code suggestions with commune in adresse
            SELECT DISTINCT
                search_postal_code as value,
                CONCAT(commune, ' (', search_postal_code, ')') as adresse,
                'postal_code' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE search_postal_code IS NOT NULL
            AND commune IS NOT NULL
            AND LOWER(search_postal_code) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            -- Postal code suggestions without commune (fallback)
            SELECT DISTINCT
                search_postal_code as value,
                search_postal_code as adresse,
                'postal_code' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE search_postal_code IS NOT NULL
            AND commune IS NULL
            AND LOWER(search_postal_code) LIKE LOWER(CONCAT('%', :query, '%'))
        )
        SELECT value, adresse, suggestion_type, COUNT(*) as count
        FROM suggestions
        GROUP BY value, adresse, suggestion_type
        ORDER BY count DESC, value ASC
        LIMIT :limit
        """,
        nativeQuery = true
    )
    List<Object[]> findSuggestions(@Param("query") String query, @Param("limit") int limit);

    @Query(
        value = """
        SELECT * FROM dvf_plus_2025_2.dvf_louer
        WHERE
            (:type = 'commune' AND LOWER(commune) = LOWER(:value)) OR
            (:type = 'postal_code' AND LOWER(search_postal_code) = LOWER(:value)) OR
            (:type = 'department' AND LOWER(department) = LOWER(:value))
        ORDER BY created_at DESC, price ASC
        """,
        nativeQuery = true
    )
    List<DvfLouer> findByLocationAndType(@Param("value") String value, @Param("type") String type);

    @Query(
        value = """
        SELECT * FROM dvf_plus_2025_2.dvf_louer
        WHERE
            ((:type = 'commune' AND LOWER(commune) = LOWER(:value)) OR
             (:type = 'postal_code' AND LOWER(search_postal_code) = LOWER(:value)) OR
             (:type = 'department' AND LOWER(department) = LOWER(:value))) AND
            (:maxBudget IS NULL OR price <= :maxBudget) AND
            (:propertyType IS NULL OR LOWER(property_type) LIKE LOWER(CONCAT('%', :propertyType, '%')))
        ORDER BY price ASC NULLS LAST, created_at DESC
        """,
        nativeQuery = true
    )
    List<DvfLouer> findByLocationAndFilters(
        @Param("value") String value,
        @Param("type") String type,
        @Param("maxBudget") BigDecimal maxBudget,
        @Param("propertyType") String propertyType
    );
}
