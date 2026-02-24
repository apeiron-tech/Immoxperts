package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "dvf_achat", schema = "dvf_plus_2025_2")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class DvfAchat implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "source", length = 50)
    private String source;

    @Column(name = "search_postal_code", length = 10)
    private String searchPostalCode;

    @Column(name = "department", length = 100)
    private String department;

    @Column(name = "department_name", length = 100)
    private String departmentName;

    @Column(name = "commune", length = 100)
    private String commune;

    @Column(name = "code_department", length = 10)
    private String codeDepartment;

    @Column(name = "property_type", length = 100)
    private String propertyType;

    @Column(name = "price_text", length = 50)
    private String priceText;

    @Column(name = "price", precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "address", columnDefinition = "text")
    private String address;

    @Column(name = "details", columnDefinition = "text")
    private String details;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "property_url", columnDefinition = "text")
    private String propertyUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "images", columnDefinition = "jsonb")
    private List<String> images;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public DvfAchat() {}

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
