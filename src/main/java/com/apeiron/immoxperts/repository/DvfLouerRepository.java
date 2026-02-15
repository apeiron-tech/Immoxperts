package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DvfLouer;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DvfLouerRepository extends JpaRepository<DvfLouer, Long> {
    @Query(
        value = """
        WITH suggestions AS (
            -- Department: show department when query matches (e.g. "Ain" -> Ain)
            SELECT MAX(department) as value, MAX(department) as adresse, 'department' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE department IS NOT NULL
            AND LOWER(department) LIKE LOWER(CONCAT('%', :query, '%'))
            GROUP BY LOWER(department)

            UNION ALL

            -- Commune: any commune that contains the query (e.g. "ain" in name)
            SELECT DISTINCT commune as value,
                CONCAT(commune, ' (', search_postal_code, ')') as adresse,
                'commune' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE commune IS NOT NULL
            AND search_postal_code IS NOT NULL
            AND LOWER(commune) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            -- Postal code: matches containing the query
            SELECT DISTINCT search_postal_code as value,
                CONCAT(commune, ' (', search_postal_code, ')') as adresse,
                'search_postal_code' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE search_postal_code IS NOT NULL
            AND commune IS NOT NULL
            AND LOWER(search_postal_code) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            SELECT DISTINCT search_postal_code as value, search_postal_code as adresse, 'search_postal_code' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE search_postal_code IS NOT NULL
            AND commune IS NULL
            AND LOWER(search_postal_code) LIKE LOWER(CONCAT('%', :query, '%'))

            UNION ALL

            -- Adresse: any address that contains the query (e.g. "ain" in address)
            SELECT MAX(address) as value, MAX(address) as adresse, 'adresse' as suggestion_type
            FROM dvf_plus_2025_2.dvf_louer
            WHERE address IS NOT NULL AND address != ''
            AND LOWER(address) LIKE LOWER(CONCAT('%', :query, '%'))
            GROUP BY LOWER(address)
        )
        SELECT value, adresse, suggestion_type, COUNT(*) as count
        FROM suggestions
        GROUP BY value, adresse, suggestion_type
        ORDER BY CASE suggestion_type WHEN 'department' THEN 1 WHEN 'commune' THEN 2 WHEN 'search_postal_code' THEN 3 ELSE 4 END, count DESC, value ASC
        LIMIT :limit
        """,
        nativeQuery = true
    )
    List<Object[]> findSuggestions(@Param("query") String query, @Param("limit") int limit);

    @Query(
        value = """
        SELECT * FROM dvf_plus_2025_2.dvf_louer
        WHERE
            ((:type = 'commune' AND LOWER(commune) = LOWER(:value)) OR
             (:type IN ('postal_code', 'search_postal_code') AND LOWER(search_postal_code) = LOWER(:value)) OR
             (:type = 'department' AND (LOWER(department) = LOWER(:value) OR LOWER(search_postal_code) = LOWER(:value))) OR
             (:type = 'adresse' AND LOWER(address) LIKE LOWER(CONCAT('%', :value, '%')))) AND
            (:maxBudget IS NULL OR price <= :maxBudget) AND
            (:propertyType IS NULL OR LOWER(property_type) LIKE LOWER(CONCAT('%', :propertyType, '%')))
        ORDER BY source ASC, created_at DESC NULLS LAST, id ASC
        """,
        countQuery = """
        SELECT COUNT(*) FROM dvf_plus_2025_2.dvf_louer
        WHERE
            ((:type = 'commune' AND LOWER(commune) = LOWER(:value)) OR
             (:type IN ('postal_code', 'search_postal_code') AND LOWER(search_postal_code) = LOWER(:value)) OR
             (:type = 'department' AND (LOWER(department) = LOWER(:value) OR LOWER(code_department) = LOWER(:value))) OR
             (:type = 'adresse' AND LOWER(address) LIKE LOWER(CONCAT('%', :value, '%')))) AND
            (:maxBudget IS NULL OR price <= :maxBudget) AND
            (:propertyType IS NULL OR LOWER(property_type) LIKE LOWER(CONCAT('%', :propertyType, '%')))
        """,
        nativeQuery = true
    )
    Page<DvfLouer> findByLocationAndFiltersPaginated(
        @Param("value") String value,
        @Param("type") String type,
        @Param("maxBudget") BigDecimal maxBudget,
        @Param("propertyType") String propertyType,
        Pageable pageable
    );
}
