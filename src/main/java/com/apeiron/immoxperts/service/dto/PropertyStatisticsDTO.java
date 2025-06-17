package com.apeiron.immoxperts.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class PropertyStatisticsDTO implements Serializable {

    private String typeBien;
    private String commune;
    private Long nombre;
    private BigDecimal prixMoyen;
    private BigDecimal prixM2Moyen;

    public PropertyStatisticsDTO(String typeBien, String commune, Long nombre, BigDecimal prixMoyen, BigDecimal prixM2Moyen) {
        this.typeBien = typeBien;
        this.commune = commune;
        this.nombre = nombre;
        this.prixMoyen = prixMoyen;
        this.prixM2Moyen = prixM2Moyen;
    }

    public String getTypeBien() {
        return typeBien;
    }

    public void setTypeBien(String typeBien) {
        this.typeBien = typeBien;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public Long getNombre() {
        return nombre;
    }

    public void setNombre(Long nombre) {
        this.nombre = nombre;
    }

    public BigDecimal getPrixMoyen() {
        return prixMoyen;
    }

    public void setPrixMoyen(BigDecimal prixMoyen) {
        this.prixMoyen = prixMoyen;
    }

    public BigDecimal getPrixM2Moyen() {
        return prixM2Moyen;
    }

    public void setPrixM2Moyen(BigDecimal prixM2Moyen) {
        this.prixM2Moyen = prixM2Moyen;
    }
}
