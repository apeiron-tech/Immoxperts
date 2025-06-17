package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MutationSearchMaterializedViewRepository extends JpaRepository<Mutation, Integer> {
    @Query(
        value = """
        SELECT * FROM mutation_search_mv
        WHERE (:novoie IS NULL OR novoie = :novoie)
          AND (:btq IS NULL OR UPPER(btq) = UPPER(:btq))
          AND (:typvoie IS NULL OR UPPER(typvoie) = UPPER(:typvoie))
          AND (:voie IS NULL OR UPPER(voie) LIKE UPPER(CONCAT('%', :voie, '%')))
          AND (:commune IS NULL OR UPPER(commune) LIKE UPPER(CONCAT('%', :commune, '%')))
          AND (:codepostal IS NULL OR codepostal = :codepostal)
        """,
        nativeQuery = true
    )
    Page<Mutation> searchMutations(
        @Param("novoie") Integer novoie,
        @Param("btq") String btq,
        @Param("typvoie") String typvoie,
        @Param("voie") String voie,
        @Param("commune") String commune,
        @Param("codepostal") String codepostal,
        Pageable pageable
    );

    @Modifying
    @Query(value = "REFRESH MATERIALIZED VIEW CONCURRENTLY mutation_search_mv", nativeQuery = true)
    void refreshMaterializedView();
}
