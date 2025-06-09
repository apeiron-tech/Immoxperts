package com.apeiron.immoxperts.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lot.
 */
@Entity
@Table(name = "lot")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Lot implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Column(name = "iddispolot", nullable = false)
    private Integer iddispolot;

    @Column(name = "scarrez", precision = 21, scale = 2)
    private BigDecimal scarrez;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getIddispolot() {
        return this.iddispolot;
    }

    public Lot iddispolot(Integer iddispolot) {
        this.setIddispolot(iddispolot);
        return this;
    }

    public void setIddispolot(Integer iddispolot) {
        this.iddispolot = iddispolot;
    }

    public BigDecimal getScarrez() {
        return this.scarrez;
    }

    public Lot scarrez(BigDecimal scarrez) {
        this.setScarrez(scarrez);
        return this;
    }

    public void setScarrez(BigDecimal scarrez) {
        this.scarrez = scarrez;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lot)) {
            return false;
        }
        return getIddispolot() != null && getIddispolot().equals(((Lot) o).getIddispolot());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lot{" +
            "iddispolot=" + getIddispolot() +
            ", scarrez=" + getScarrez() +
            "}";
    }
}
