package com.apeiron.immoxperts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AdresseDispoparc.
 */
@Entity
@Table(name = "adresse_dispoparc")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdresseDispoparc implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "iddispopar", nullable = false)
    private Integer iddispopar;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idmutation")
    @JsonIgnoreProperties(value = { "adresseLocals", "adresseDispoparcs" }, allowSetters = true)
    private Mutation mutation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "idadresse")
    @JsonIgnoreProperties(value = { "adresseLocals", "adresseDispoparcs" }, allowSetters = true)
    private Adresse adresse;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getIddispopar() {
        return this.iddispopar;
    }

    public void setIddispopar(Integer iddispopar) {
        this.iddispopar = iddispopar;
    }

    public AdresseDispoparc iddispopar(Integer iddispopar) {
        this.setIddispopar(iddispopar);
        return this;
    }

    public Mutation getMutation() {
        return this.mutation;
    }

    public void setMutation(Mutation mutation) {
        this.mutation = mutation;
    }

    public AdresseDispoparc mutation(Mutation mutation) {
        this.setMutation(mutation);
        return this;
    }

    public Adresse getAdresse() {
        return this.adresse;
    }

    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }

    public AdresseDispoparc adresse(Adresse adresse) {
        this.setAdresse(adresse);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdresseDispoparc)) {
            return false;
        }
        return getIddispopar() != null && getIddispopar().equals(((AdresseDispoparc) o).getIddispopar());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseDispoparc{" +
            "iddispopar=" + getIddispopar() +
            "}";
    }
}
