package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import java.util.List;
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
        SELECT m FROM Mutation m
        JOIN m.adresseLocals al
        JOIN al.adresse a
        WHERE UPPER(a.voie) LIKE %:street%
          AND UPPER(a.commune) = UPPER(:commune)
        """
    )
    List<Mutation> findMutationsByStreetAndCommune(@Param("street") String street, @Param("commune") String commune);

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
}
