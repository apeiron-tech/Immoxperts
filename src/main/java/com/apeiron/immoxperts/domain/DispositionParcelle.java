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
@Table(name = "disposition_parcelle")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DispositionParcelle implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "iddispopar", nullable = false)
    private Integer iddispopar;

    @Column(name = "dcntagri", precision = 21, scale = 2)
    private BigDecimal dcntagri;

    @Column(name = "dcntsol", precision = 21, scale = 2)
    private BigDecimal dcntsol;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public DispositionParcelle id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

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
        return getId() != null && getId().equals(((DispositionParcelle) o).getId());
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
            "id=" + getId() +
            ", iddispopar=" + getIddispopar() +
            ", dcntagri=" + getDcntagri() +
            ", dcntsol=" + getDcntsol() +
            "}";
    }
}
