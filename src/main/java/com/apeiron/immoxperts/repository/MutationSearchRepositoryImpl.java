package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.service.dto.MutationSearchDTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Repository;

@Repository
public class MutationSearchRepositoryImpl implements MutationSearchRepository {

    @PersistenceContext
    private EntityManager em;

    @Override
    public List<MutationSearchDTO> fastSearch(Integer novoie, String btq, String typvoie, String voieRestante, int limit) {
        StringBuilder sql = new StringBuilder(
            """
                SELECT idmutation, valeurfonc, voie, typvoie, novoie, btq, commune, codepostal
                FROM mutation_search_view
                WHERE 1=1
            """
        );

        if (novoie != null) {
            sql.append(" AND novoie = :novoie");
        }
        if (btq != null) {
            sql.append(" AND btq = :btq");
        }
        if (typvoie != null) {
            sql.append(" AND UPPER(typvoie) = UPPER(:typvoie)");
        }
        if (voieRestante != null) {
            sql.append(" AND voie ILIKE CONCAT('%', :voieRestante, '%')");
        }

        sql.append(" ORDER BY datemut DESC LIMIT :limit");

        Query query = em.createNativeQuery(sql.toString());

        if (novoie != null) {
            query.setParameter("novoie", novoie);
        }
        if (btq != null) {
            query.setParameter("btq", btq);
        }
        if (typvoie != null) {
            query.setParameter("typvoie", typvoie);
        }
        if (voieRestante != null) {
            query.setParameter("voieRestante", voieRestante);
        }

        query.setParameter("limit", limit);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();

        return rows
            .stream()
            .map(r -> {
                MutationSearchDTO mutationSearchDTO = new MutationSearchDTO(
                    (Integer) r[0],
                    (BigDecimal) r[1],
                    (String) r[2],
                    (String) r[3],
                    (Integer) r[4],
                    (String) r[5],
                    (String) r[6],
                    (String) r[7]
                );
                return mutationSearchDTO;
            })
            .collect(Collectors.toList());
    }
}
