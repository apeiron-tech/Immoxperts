package com.apeiron.immoxperts.service.dto;

import com.apeiron.immoxperts.domain.AdresseLocalId;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.AdresseLocal} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdresseLocalDTO implements Serializable {

    @NotNull
    private AdresseLocalId id;

    private String coddep;

    private MutationDTO mutation;

    private AdresseDTO adresse;

    public AdresseLocalId getId() {
        return id;
    }

    public void setId(AdresseLocalId id) {
        this.id = id;
    }

    public String getCoddep() {
        return coddep;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    public MutationDTO getMutation() {
        return mutation;
    }

    public void setMutation(MutationDTO mutation) {
        this.mutation = mutation;
    }

    public AdresseDTO getAdresse() {
        return adresse;
    }

    public void setAdresse(AdresseDTO adresse) {
        this.adresse = adresse;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AdresseLocalDTO)) {
            return false;
        }

        AdresseLocalDTO adresseLocalDTO = (AdresseLocalDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, adresseLocalDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseLocalDTO{" +
            "id=" + getId() +
            ", coddep='" + getCoddep() + "'" +
            ", mutation=" + getMutation() +
            ", adresse=" + getAdresse() +
            "}";
    }
}
