package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.domain.DvfLouer;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DvfLouerRepository extends JpaRepository<DvfLouer, Long> {
    List<DvfLouer> findAll();
    List<DvfLouer> findByPostalCode(String postalCode);

    @Query(
        "SELECT l FROM DvfLouer l WHERE " +
        "(:postalCode IS NULL OR l.postalCode = :postalCode) AND " +
        "(:price IS NULL OR l.price < :price) AND " +
        "(:propertyType IS NULL OR LOWER(l.propertyType) LIKE LOWER(CONCAT('%', :propertyType, '%')))"
    )
    List<DvfLouer> searchLouers(
        @Param("postalCode") String postalCode,
        @Param("price") BigDecimal price,
        @Param("propertyType") String propertyType
    );
}
