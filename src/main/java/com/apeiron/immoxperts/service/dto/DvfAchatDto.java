package com.apeiron.immoxperts.service.dto;

import java.math.BigDecimal;
import java.util.List;

public class DvfAchatDto {

    private Long id;
    private String source;
    private String searchPostalCode;
    private String department;
    private String departmentName;
    private String commune;
    private String codeDepartment;
    private String propertyType;
    private String priceText;
    private BigDecimal price;
    private String address;
    private String details;
    private String description;
    private String propertyUrl;
    private List<String> images;

    /** From detail MV: surface (m²), chambre, pieces, DPE, terrain_sqm - for display and search */
    private java.math.BigDecimal surface;
    private Integer chambre;
    private Integer pieces;
    private String dpe;
    private java.math.BigDecimal terrainSqm;
    private String piscine;
    private String meuble;
    private String terrasse;
    private String balcon;
    private String cave;
    private String jardin;
    private String parking;
    private String etage;

    public DvfAchatDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSearchPostalCode() {
        return searchPostalCode;
    }

    public void setSearchPostalCode(String searchPostalCode) {
        this.searchPostalCode = searchPostalCode;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public String getCodeDepartment() {
        return codeDepartment;
    }

    public void setCodeDepartment(String codeDepartment) {
        this.codeDepartment = codeDepartment;
    }

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getPriceText() {
        return priceText;
    }

    public void setPriceText(String priceText) {
        this.priceText = priceText;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPropertyUrl() {
        return propertyUrl;
    }

    public void setPropertyUrl(String propertyUrl) {
        this.propertyUrl = propertyUrl;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public java.math.BigDecimal getSurface() {
        return surface;
    }

    public void setSurface(java.math.BigDecimal surface) {
        this.surface = surface;
    }

    public Integer getChambre() {
        return chambre;
    }

    public void setChambre(Integer chambre) {
        this.chambre = chambre;
    }

    public Integer getPieces() {
        return pieces;
    }

    public void setPieces(Integer pieces) {
        this.pieces = pieces;
    }

    public String getDpe() {
        return dpe;
    }

    public void setDpe(String dpe) {
        this.dpe = dpe;
    }

    public java.math.BigDecimal getTerrainSqm() {
        return terrainSqm;
    }

    public void setTerrainSqm(java.math.BigDecimal terrainSqm) {
        this.terrainSqm = terrainSqm;
    }

    public String getPiscine() {
        return piscine;
    }

    public void setPiscine(String piscine) {
        this.piscine = piscine;
    }

    public String getMeuble() {
        return meuble;
    }

    public void setMeuble(String meuble) {
        this.meuble = meuble;
    }

    public String getTerrasse() {
        return terrasse;
    }

    public void setTerrasse(String terrasse) {
        this.terrasse = terrasse;
    }

    public String getBalcon() {
        return balcon;
    }

    public void setBalcon(String balcon) {
        this.balcon = balcon;
    }

    public String getCave() {
        return cave;
    }

    public void setCave(String cave) {
        this.cave = cave;
    }

    public String getJardin() {
        return jardin;
    }

    public void setJardin(String jardin) {
        this.jardin = jardin;
    }

    public String getParking() {
        return parking;
    }

    public void setParking(String parking) {
        this.parking = parking;
    }

    public String getEtage() {
        return etage;
    }

    public void setEtage(String etage) {
        this.etage = etage;
    }
}
