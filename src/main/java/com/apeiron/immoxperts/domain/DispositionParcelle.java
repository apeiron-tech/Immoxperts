package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A DispositionParcelle.
 */
@Entity
@Table(name = "dvf_plus_disposition_parcelle", schema = "dvf_plus_2025_2")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DispositionParcelle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Column(name = "iddispopar", nullable = false)
    private Integer iddispopar;

    @Column(name = "dcntagri", precision = 21, scale = 2)
    private BigDecimal dcntagri;

    @Column(name = "dcntsol", precision = 21, scale = 2)
    private BigDecimal dcntsol;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getIddispopar() {
        return this.iddispopar;
    }

    public DispositionParcelle iddispopar(Integer iddispopar) {
        this.setIddispopar(iddispopar);
        return this;
    }

    public void setIddispopar(Integer iddispopar) {
        this.iddispopar = iddispopar;
    }

    public BigDecimal getDcntagri() {
        return this.dcntagri;
    }

    public DispositionParcelle dcntagri(BigDecimal dcntagri) {
        this.setDcntagri(dcntagri);
        return this;
    }

    public void setDcntagri(BigDecimal dcntagri) {
        this.dcntagri = dcntagri;
    }

    public BigDecimal getDcntsol() {
        return this.dcntsol;
    }

    public DispositionParcelle dcntsol(BigDecimal dcntsol) {
        this.setDcntsol(dcntsol);
        return this;
    }

    public void setDcntsol(BigDecimal dcntsol) {
        this.dcntsol = dcntsol;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DispositionParcelle)) {
            return false;
        }
        return getIddispopar() != null && getIddispopar().equals(((DispositionParcelle) o).getIddispopar());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DispositionParcelle{" +
            "iddispopar=" + getIddispopar() +
            ", dcntagri=" + getDcntagri() +
            ", dcntsol=" + getDcntsol() +
            "}";
    }
}
