package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.AdresseDispoparc} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AdresseDispoparcDTO implements Serializable {

    @NotNull
    private Integer id;

    private MutationDTO mutation;

    private AdresseDTO adresse;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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
        if (!(o instanceof AdresseDispoparcDTO)) {
            return false;
        }

        AdresseDispoparcDTO adresseDispoparcDTO = (AdresseDispoparcDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, adresseDispoparcDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseDispoparcDTO{" +
            "id=" + getId() +
            ", mutation=" + getMutation() +
            ", adresse=" + getAdresse() +
            "}";
    }
}
