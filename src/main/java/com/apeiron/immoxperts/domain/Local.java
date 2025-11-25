package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Local.
 */
@Entity
@Table(name = "dvf_plus_local", schema = "dvf_plus_2025_2")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Local implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @Column(name = "iddispoloc", nullable = false)
    private Integer iddispoloc;

    @Column(name = "idmutation")
    private Integer idmutation;

    @Column(name = "sbati", precision = 21, scale = 2)
    private BigDecimal sbati;

    @Column(name = "libtyploc")
    private String libtyploc;

    @Column(name = "nbpprinc")
    private Integer nbpprinc;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getIddispoloc() {
        return this.iddispoloc;
    }

    public Local iddispoloc(Integer iddispoloc) {
        this.setIddispoloc(iddispoloc);
        return this;
    }

    public void setIddispoloc(Integer iddispoloc) {
        this.iddispoloc = iddispoloc;
    }

    public Integer getIdmutation() {
        return this.idmutation;
    }

    public Local idmutation(Integer idmutation) {
        this.setIdmutation(idmutation);
        return this;
    }

    public void setIdmutation(Integer idmutation) {
        this.idmutation = idmutation;
    }

    public BigDecimal getSbati() {
        return this.sbati;
    }

    public Local sbati(BigDecimal sbati) {
        this.setSbati(sbati);
        return this;
    }

    public void setSbati(BigDecimal sbati) {
        this.sbati = sbati;
    }

    public String getLibtyploc() {
        return this.libtyploc;
    }

    public Local libtyploc(String libtyploc) {
        this.setLibtyploc(libtyploc);
        return this;
    }

    public void setLibtyploc(String libtyploc) {
        this.libtyploc = libtyploc;
    }

    public Integer getNbpprinc() {
        return this.nbpprinc;
    }

    public Local nbpprinc(Integer nbpprinc) {
        this.setNbpprinc(nbpprinc);
        return this;
    }

    public void setNbpprinc(Integer nbpprinc) {
        this.nbpprinc = nbpprinc;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Local)) {
            return false;
        }
        return getIddispoloc() != null && getIddispoloc().equals(((Local) o).getIddispoloc());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Local{" +
            "iddispoloc=" + getIddispoloc() +
            ", idmutation=" + getIdmutation() +
            ", sbati=" + getSbati() +
            ", libtyploc='" + getLibtyploc() + "'" +
            ", nbpprinc=" + getNbpprinc() +
            "}";
    }
}
