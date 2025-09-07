package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import org.hibernate.annotations.CacheConcurrencyStrategy;

@Entity
@Table(name = "dvf_louer")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DvfLouer implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String postalCode; // mapped from 'postal_code'

    private String propertyType;

    @Column(columnDefinition = "text")
    private String address;

    @Column(columnDefinition = "text")
    private String details;

    private BigDecimal price;

    private String priceText;

    @Column(columnDefinition = "jsonb")
    private String images;

    private Timestamp scrapedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Timestamp getScrapedAt() {
        return scrapedAt;
    }

    public void setScrapedAt(Timestamp scrapedAt) {
        this.scrapedAt = scrapedAt;
    }

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

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
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
}
