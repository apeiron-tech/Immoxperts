package com.apeiron.immoxperts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Mutation.
 */
@Entity
@Table(name = "mutation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Mutation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @NotNull
    @Column(name = "idmutation", nullable = false)
    private Integer idmutation;

    @Column(name = "datemut")
    private Instant datemut;

    @Column(name = "valeurfonc", precision = 21, scale = 2)
    private BigDecimal valeurfonc;

    @Column(name = "idnatmut")
    private Integer idnatmut;

    @Column(name = "coddep")
    private String coddep;

    @Column(name = "vefa")
    private Boolean vefa;

    @Column(name = "sterr", precision = 21, scale = 2)
    private BigDecimal sterr;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "mutation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mutation", "adresse" }, allowSetters = true)
    private Set<AdresseLocal> adresseLocals = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "mutation")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mutation", "adresse" }, allowSetters = true)
    private Set<AdresseDispoparc> adresseDispoparcs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Integer getIdmutation() {
        return this.idmutation;
    }

    public Mutation idmutation(Integer idmutation) {
        this.setIdmutation(idmutation);
        return this;
    }

    public void setIdmutation(Integer idmutation) {
        this.idmutation = idmutation;
    }

    public Instant getDatemut() {
        return this.datemut;
    }

    public Mutation datemut(Instant datemut) {
        this.setDatemut(datemut);
        return this;
    }

    public void setDatemut(Instant datemut) {
        this.datemut = datemut;
    }

    public BigDecimal getValeurfonc() {
        return this.valeurfonc;
    }

    public Mutation valeurfonc(BigDecimal valeurfonc) {
        this.setValeurfonc(valeurfonc);
        return this;
    }

    public void setValeurfonc(BigDecimal valeurfonc) {
        this.valeurfonc = valeurfonc;
    }

    public Integer getIdnatmut() {
        return this.idnatmut;
    }

    public Mutation idnatmut(Integer idnatmut) {
        this.setIdnatmut(idnatmut);
        return this;
    }

    public void setIdnatmut(Integer idnatmut) {
        this.idnatmut = idnatmut;
    }

    public String getCoddep() {
        return this.coddep;
    }

    public Mutation coddep(String coddep) {
        this.setCoddep(coddep);
        return this;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    public Boolean getVefa() {
        return this.vefa;
    }

    public Mutation vefa(Boolean vefa) {
        this.setVefa(vefa);
        return this;
    }

    public void setVefa(Boolean vefa) {
        this.vefa = vefa;
    }

    public BigDecimal getSterr() {
        return this.sterr;
    }

    public Mutation sterr(BigDecimal sterr) {
        this.setSterr(sterr);
        return this;
    }

    public void setSterr(BigDecimal sterr) {
        this.sterr = sterr;
    }

    public Set<AdresseLocal> getAdresseLocals() {
        return this.adresseLocals;
    }

    public void setAdresseLocals(Set<AdresseLocal> adresseLocals) {
        if (this.adresseLocals != null) {
            this.adresseLocals.forEach(i -> i.setMutation(null));
        }
        if (adresseLocals != null) {
            adresseLocals.forEach(i -> i.setMutation(this));
        }
        this.adresseLocals = adresseLocals;
    }

    public Mutation adresseLocals(Set<AdresseLocal> adresseLocals) {
        this.setAdresseLocals(adresseLocals);
        return this;
    }

    public Mutation addAdresseLocals(AdresseLocal adresseLocal) {
        this.adresseLocals.add(adresseLocal);
        adresseLocal.setMutation(this);
        return this;
    }

    public Mutation removeAdresseLocals(AdresseLocal adresseLocal) {
        this.adresseLocals.remove(adresseLocal);
        adresseLocal.setMutation(null);
        return this;
    }

    public Set<AdresseDispoparc> getAdresseDispoparcs() {
        return this.adresseDispoparcs;
    }

    public void setAdresseDispoparcs(Set<AdresseDispoparc> adresseDispoparcs) {
        if (this.adresseDispoparcs != null) {
            this.adresseDispoparcs.forEach(i -> i.setMutation(null));
        }
        if (adresseDispoparcs != null) {
            adresseDispoparcs.forEach(i -> i.setMutation(this));
        }
        this.adresseDispoparcs = adresseDispoparcs;
    }

    public Mutation adresseDispoparcs(Set<AdresseDispoparc> adresseDispoparcs) {
        this.setAdresseDispoparcs(adresseDispoparcs);
        return this;
    }

    public Mutation addAdresseDispoparcs(AdresseDispoparc adresseDispoparc) {
        this.adresseDispoparcs.add(adresseDispoparc);
        adresseDispoparc.setMutation(this);
        return this;
    }

    public Mutation removeAdresseDispoparcs(AdresseDispoparc adresseDispoparc) {
        this.adresseDispoparcs.remove(adresseDispoparc);
        adresseDispoparc.setMutation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Mutation)) {
            return false;
        }
        return getIdmutation() != null && getIdmutation().equals(((Mutation) o).getIdmutation());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getIdmutation());
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Mutation{" +
            "idmutation=" + getIdmutation() +
            ", datemut='" + getDatemut() + "'" +
            ", valeurfonc=" + getValeurfonc() +
            ", idnatmut=" + getIdnatmut() +
            ", coddep='" + getCoddep() + "'" +
            ", vefa='" + getVefa() + "'" +
            ", sterr=" + getSterr() +
            "}";
    }
}
