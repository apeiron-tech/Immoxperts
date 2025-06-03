package com.apeiron.immoxperts.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class AdresseLocalId implements Serializable {

    private static final long serialVersionUID = 1L;

    @Column(name = "idmutation")
    private Integer idmutation;

    @Column(name = "idadresse")
    private Integer idadresse;

    @Column(name = "iddispoloc")
    private Integer iddispoloc;

    public Integer getIdmutation() {
        return idmutation;
    }

    public void setIdmutation(Integer idmutation) {
        this.idmutation = idmutation;
    }

    public Integer getIdadresse() {
        return idadresse;
    }

    public void setIdadresse(Integer idadresse) {
        this.idadresse = idadresse;
    }

    public Integer getIddispoloc() {
        return iddispoloc;
    }

    public void setIddispoloc(Integer iddispoloc) {
        this.iddispoloc = iddispoloc;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdresseLocalId)) {
            return false;
        }
        AdresseLocalId that = (AdresseLocalId) o;
        return (
            Objects.equals(idmutation, that.idmutation) &&
            Objects.equals(idadresse, that.idadresse) &&
            Objects.equals(iddispoloc, that.iddispoloc)
        );
    }

    @Override
    public int hashCode() {
        return Objects.hash(idmutation, idadresse, iddispoloc);
    }
}
