package com.apeiron.immoxperts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AdresseLocal.
 */
@Entity
@Table(name = "adresse_local")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdresseLocal implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name = "coddep")
    private String coddep;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "adresseLocals", "adresseDispoparcs" }, allowSetters = true)
    private Mutation mutation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "adresseLocals", "adresseDispoparcs" }, allowSetters = true)
    private Adresse adresse;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getId() {
        return this.id;
    }

    public AdresseLocal id(Integer id) {
        this.setId(id);
        return this;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCoddep() {
        return this.coddep;
    }

    public AdresseLocal coddep(String coddep) {
        this.setCoddep(coddep);
        return this;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    public Mutation getMutation() {
        return this.mutation;
    }

    public void setMutation(Mutation mutation) {
        this.mutation = mutation;
    }

    public AdresseLocal mutation(Mutation mutation) {
        this.setMutation(mutation);
        return this;
    }

    public Adresse getAdresse() {
        return this.adresse;
    }

    public void setAdresse(Adresse adresse) {
        this.adresse = adresse;
    }

    public AdresseLocal adresse(Adresse adresse) {
        this.setAdresse(adresse);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdresseLocal)) {
            return false;
        }
        return getId() != null && getId().equals(((AdresseLocal) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseLocal{" +
            "id=" + getId() +
            ", coddep='" + getCoddep() + "'" +
            "}";
    }
}
