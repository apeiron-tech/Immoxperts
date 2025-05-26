package com.apeiron.immoxperts.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Adresse.
 */
@Entity
@Table(name = "adresse")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Adresse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "idadresse", nullable = false)
    private Integer idadresse;

    @Column(name = "novoie")
    private Integer novoie;

    @Column(name = "btq")
    private String btq;

    @Column(name = "typvoie")
    private String typvoie;

    @Column(name = "codvoie")
    private String codvoie;

    @Column(name = "voie")
    private String voie;

    @Column(name = "codepostal")
    private String codepostal;

    @Column(name = "commune")
    private String commune;

    @Column(name = "coddep")
    private String coddep;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "adresse")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mutation", "adresse" }, allowSetters = true)
    private Set<AdresseLocal> adresseLocals = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "adresse")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "mutation", "adresse" }, allowSetters = true)
    private Set<AdresseDispoparc> adresseDispoparcs = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Adresse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdadresse() {
        return this.idadresse;
    }

    public Adresse idadresse(Integer idadresse) {
        this.setIdadresse(idadresse);
        return this;
    }

    public void setIdadresse(Integer idadresse) {
        this.idadresse = idadresse;
    }

    public Integer getNovoie() {
        return this.novoie;
    }

    public Adresse novoie(Integer novoie) {
        this.setNovoie(novoie);
        return this;
    }

    public void setNovoie(Integer novoie) {
        this.novoie = novoie;
    }

    public String getBtq() {
        return this.btq;
    }

    public Adresse btq(String btq) {
        this.setBtq(btq);
        return this;
    }

    public void setBtq(String btq) {
        this.btq = btq;
    }

    public String getTypvoie() {
        return this.typvoie;
    }

    public Adresse typvoie(String typvoie) {
        this.setTypvoie(typvoie);
        return this;
    }

    public void setTypvoie(String typvoie) {
        this.typvoie = typvoie;
    }

    public String getCodvoie() {
        return this.codvoie;
    }

    public Adresse codvoie(String codvoie) {
        this.setCodvoie(codvoie);
        return this;
    }

    public void setCodvoie(String codvoie) {
        this.codvoie = codvoie;
    }

    public String getVoie() {
        return this.voie;
    }

    public Adresse voie(String voie) {
        this.setVoie(voie);
        return this;
    }

    public void setVoie(String voie) {
        this.voie = voie;
    }

    public String getCodepostal() {
        return this.codepostal;
    }

    public Adresse codepostal(String codepostal) {
        this.setCodepostal(codepostal);
        return this;
    }

    public void setCodepostal(String codepostal) {
        this.codepostal = codepostal;
    }

    public String getCommune() {
        return this.commune;
    }

    public Adresse commune(String commune) {
        this.setCommune(commune);
        return this;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public String getCoddep() {
        return this.coddep;
    }

    public Adresse coddep(String coddep) {
        this.setCoddep(coddep);
        return this;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    public Set<AdresseLocal> getAdresseLocals() {
        return this.adresseLocals;
    }

    public void setAdresseLocals(Set<AdresseLocal> adresseLocals) {
        if (this.adresseLocals != null) {
            this.adresseLocals.forEach(i -> i.setAdresse(null));
        }
        if (adresseLocals != null) {
            adresseLocals.forEach(i -> i.setAdresse(this));
        }
        this.adresseLocals = adresseLocals;
    }

    public Adresse adresseLocals(Set<AdresseLocal> adresseLocals) {
        this.setAdresseLocals(adresseLocals);
        return this;
    }

    public Adresse addAdresseLocals(AdresseLocal adresseLocal) {
        this.adresseLocals.add(adresseLocal);
        adresseLocal.setAdresse(this);
        return this;
    }

    public Adresse removeAdresseLocals(AdresseLocal adresseLocal) {
        this.adresseLocals.remove(adresseLocal);
        adresseLocal.setAdresse(null);
        return this;
    }

    public Set<AdresseDispoparc> getAdresseDispoparcs() {
        return this.adresseDispoparcs;
    }

    public void setAdresseDispoparcs(Set<AdresseDispoparc> adresseDispoparcs) {
        if (this.adresseDispoparcs != null) {
            this.adresseDispoparcs.forEach(i -> i.setAdresse(null));
        }
        if (adresseDispoparcs != null) {
            adresseDispoparcs.forEach(i -> i.setAdresse(this));
        }
        this.adresseDispoparcs = adresseDispoparcs;
    }

    public Adresse adresseDispoparcs(Set<AdresseDispoparc> adresseDispoparcs) {
        this.setAdresseDispoparcs(adresseDispoparcs);
        return this;
    }

    public Adresse addAdresseDispoparcs(AdresseDispoparc adresseDispoparc) {
        this.adresseDispoparcs.add(adresseDispoparc);
        adresseDispoparc.setAdresse(this);
        return this;
    }

    public Adresse removeAdresseDispoparcs(AdresseDispoparc adresseDispoparc) {
        this.adresseDispoparcs.remove(adresseDispoparc);
        adresseDispoparc.setAdresse(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Adresse)) {
            return false;
        }
        return getId() != null && getId().equals(((Adresse) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Adresse{" +
            "id=" + getId() +
            ", idadresse=" + getIdadresse() +
            ", novoie=" + getNovoie() +
            ", btq='" + getBtq() + "'" +
            ", typvoie='" + getTypvoie() + "'" +
            ", codvoie='" + getCodvoie() + "'" +
            ", voie='" + getVoie() + "'" +
            ", codepostal='" + getCodepostal() + "'" +
            ", commune='" + getCommune() + "'" +
            ", coddep='" + getCoddep() + "'" +
            "}";
    }
}
