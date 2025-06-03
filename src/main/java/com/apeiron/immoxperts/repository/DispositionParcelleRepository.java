package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DispositionParcelle;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the DispositionParcelle entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DispositionParcelleRepository extends JpaRepository<DispositionParcelle, Integer> {
    @Query("SELECT COALESCE(SUM(d.dcntsol), 0) FROM DispositionParcelle d " + "WHERE d.iddispopar IN :iddispopars")
    BigDecimal sumDcntsolByIddispopars(@Param("iddispopars") List<Integer> iddispopars);

    @Query("SELECT COALESCE(SUM(d.dcntagri), 0) FROM DispositionParcelle d " + "WHERE d.iddispopar IN :iddispopars")
    BigDecimal sumDcntagrclByIddispopars(@Param("iddispopars") List<Integer> iddispopars);
}
