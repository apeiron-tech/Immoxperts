package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.Adresse} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdresseDTO implements Serializable {

    @NotNull
    private Integer idadresse;

    private Integer novoie;

    private String btq;

    private String typvoie;

    private String codvoie;

    private String voie;

    private String codepostal;

    private String commune;

    private String coddep;

    public Integer getIdadresse() {
        return idadresse;
    }

    public void setIdadresse(Integer idadresse) {
        this.idadresse = idadresse;
    }

    public Integer getNovoie() {
        return novoie;
    }

    public void setNovoie(Integer novoie) {
        this.novoie = novoie;
    }

    public String getBtq() {
        return btq;
    }

    public void setBtq(String btq) {
        this.btq = btq;
    }

    public String getTypvoie() {
        return typvoie;
    }

    public void setTypvoie(String typvoie) {
        this.typvoie = typvoie;
    }

    public String getCodvoie() {
        return codvoie;
    }

    public void setCodvoie(String codvoie) {
        this.codvoie = codvoie;
    }

    public String getVoie() {
        return voie;
    }

    public void setVoie(String voie) {
        this.voie = voie;
    }

    public String getCodepostal() {
        return codepostal;
    }

    public void setCodepostal(String codepostal) {
        this.codepostal = codepostal;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public String getCoddep() {
        return coddep;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdresseDTO)) {
            return false;
        }

        AdresseDTO adresseDTO = (AdresseDTO) o;
        if (this.idadresse == null) {
            return false;
        }
        return Objects.equals(this.idadresse, adresseDTO.idadresse);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.idadresse);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseDTO{" +
            "idadresse=" + getIdadresse() +
            ", novoie='" + getNovoie() + "'" +
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
