package com.apeiron.immoxperts.service.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class DvfLouerDto {

    private Long id;
    private String postalCode;
    private String propertyType;
    private String address;
    private String details;
    private BigDecimal price;
    private String priceText;
    private String images;
    private Timestamp scrapedAt;

    public String getImages() {
        return images;
    }

    public void setImages(String images) {
        this.images = images;
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

    public String getPropertyType() {
        return propertyType;
    }

    public void setPropertyType(String propertyType) {
        this.propertyType = propertyType;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Timestamp getScrapedAt() {
        return scrapedAt;
    }

    public void setScrapedAt(Timestamp scrapedAt) {
        this.scrapedAt = scrapedAt;
    }
}
