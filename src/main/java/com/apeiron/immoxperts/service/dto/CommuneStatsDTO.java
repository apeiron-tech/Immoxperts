package com.apeiron.immoxperts.service.dto;

import java.io.Serializable;
import java.math.BigDecimal;

public class CommuneStatsDTO implements Serializable {

    private String commune;
    private Long totalMutations;
    private BigDecimal averagePrice;
    private BigDecimal averagePricePerSquareMeter;
    private int maisons;
    private int appartements;
    private int locauxCommerciaux;
    private int biensMultiples;
    private int terrains;

    public CommuneStatsDTO() {}

    public CommuneStatsDTO(String commune, Number totalMutations, Number averagePrice, Number averagePricePerSquareMeter) {
        this.commune = commune;
        this.totalMutations = totalMutations != null ? totalMutations.longValue() : 0L;
        this.averagePrice = averagePrice != null ? new BigDecimal(averagePrice.toString()) : BigDecimal.ZERO;
        this.averagePricePerSquareMeter = averagePricePerSquareMeter != null
            ? new BigDecimal(averagePricePerSquareMeter.toString())
            : BigDecimal.ZERO;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public Long getTotalMutations() {
        return totalMutations;
    }

    public void setTotalMutations(Long totalMutations) {
        this.totalMutations = totalMutations;
    }

    public BigDecimal getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(BigDecimal averagePrice) {
        this.averagePrice = averagePrice;
    }

    public BigDecimal getAveragePricePerSquareMeter() {
        return averagePricePerSquareMeter;
    }

    public void setAveragePricePerSquareMeter(BigDecimal averagePricePerSquareMeter) {
        this.averagePricePerSquareMeter = averagePricePerSquareMeter;
    }

    public int getMaisons() {
        return maisons;
    }

    public void setMaisons(int maisons) {
        this.maisons = maisons;
    }

    public int getAppartements() {
        return appartements;
    }

    public void setAppartements(int appartements) {
        this.appartements = appartements;
    }

    public int getLocauxCommerciaux() {
        return locauxCommerciaux;
    }

    public void setLocauxCommerciaux(int locauxCommerciaux) {
        this.locauxCommerciaux = locauxCommerciaux;
    }

    public int getBiensMultiples() {
        return biensMultiples;
    }

    public void setBiensMultiples(int biensMultiples) {
        this.biensMultiples = biensMultiples;
    }

    public int getTerrains() {
        return terrains;
    }

    public void setTerrains(int terrains) {
        this.terrains = terrains;
    }
}
