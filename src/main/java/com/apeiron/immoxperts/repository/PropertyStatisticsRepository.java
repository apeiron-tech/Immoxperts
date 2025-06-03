package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PropertyStatisticsRepository extends JpaRepository<Mutation, Long> {
    @Query(
        value = """
        WITH filtered_mutations AS (
            SELECT
                m.idmutation,
                m.valeurfonc,
                CASE
                    WHEN COUNT(DISTINCT l.libtyploc) >= 2 THEN 'Bien Multiple'
                    ELSE MAX(l.libtyploc)
                END AS type_bien,
                SUM(l.sbati) as total_surface
            FROM mutation m
            JOIN adresse_local al ON m.idmutation = al.idmutation
            JOIN adresse a ON al.idadresse = a.idadresse
            JOIN local l ON al.iddispoloc = l.iddispoloc
            WHERE UPPER(a.commune) = UPPER(:commune)
            AND UPPER(m.libnatmut) = UPPER('Vente')
            AND m.valeurfonc > 0
            AND l.sbati > 0
            GROUP BY m.idmutation, m.valeurfonc
        )
        SELECT
            type_bien as typeBien,
            COUNT(*) AS nombre,
            ROUND(AVG(valeurfonc)::NUMERIC) AS prixMoyen,
            ROUND(AVG(CASE
                WHEN total_surface > 0 THEN valeurfonc / total_surface
                ELSE NULL
            END)::NUMERIC) AS prixM2Moyen
        FROM filtered_mutations
        GROUP BY type_bien
        """,
        nativeQuery = true
    )
    List<Object[]> getPropertyStatistics(@Param("commune") String commune);
}
