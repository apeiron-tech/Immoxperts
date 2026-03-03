package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Immutable;

/**
 * Read-only mapping to materialized view dvf_louer_detail_mv.
 * One row per dvf_louer.id with parsed characteristics from the details column.
 */
@Entity
@Immutable
@Table(name = "dvf_louer_detail_mv", schema = "dvf_plus_2025_2")
public class DvfLouerDetailView implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "publication_id")
    private Long publicationId;

    @Column(name = "surface", precision = 12, scale = 2)
    private BigDecimal surface;

    @Column(name = "chambre")
    private Integer chambre;

    @Column(name = "pieces")
    private Integer pieces;

    @Column(name = "dpe", length = 1)
    private String dpe;

    @Column(name = "terrain_sqm", precision = 12, scale = 2)
    private BigDecimal terrainSqm;

    @Column(name = "piscine", length = 3)
    private String piscine;

    @Column(name = "meuble", length = 3)
    private String meuble;

    @Column(name = "balcon", length = 3)
    private String balcon;

    @Column(name = "cave", length = 3)
    private String cave;

    @Column(name = "jardin", length = 3)
    private String jardin;

    @Column(name = "parking", length = 3)
    private String parking;

    @Column(name = "etage", length = 50)
    private String etage;

    @Column(name = "terrasse", length = 3)
    private String terrasse;

    public Long getPublicationId() {
        return publicationId;
    }

    public BigDecimal getSurface() {
        return surface;
    }

    public Integer getChambre() {
        return chambre;
    }

    public Integer getPieces() {
        return pieces;
    }

    public String getDpe() {
        return dpe;
    }

    public BigDecimal getTerrainSqm() {
        return terrainSqm;
    }

    public String getPiscine() {
        return piscine;
    }

    public String getMeuble() {
        return meuble;
    }

    public String getBalcon() {
        return balcon;
    }

    public String getCave() {
        return cave;
    }

    public String getJardin() {
        return jardin;
    }

    public String getParking() {
        return parking;
    }

    public String getEtage() {
        return etage;
    }

    public String getTerrasse() {
        return terrasse;
    }
}
