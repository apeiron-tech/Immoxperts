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
    private Integer iddispopar;

    private MutationDTO mutation;

    private AdresseDTO adresse;

    public Integer getIddispopar() {
        return iddispopar;
    }

    public void setIddispopar(Integer iddispopar) {
        this.iddispopar = iddispopar;
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
        if (this.iddispopar == null) {
            return false;
        }
        return Objects.equals(this.iddispopar, adresseDispoparcDTO.iddispopar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.iddispopar);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AdresseDispoparcDTO{" +
            "iddispopar=" + getIddispopar() +
            ", mutation=" + getMutation() +
            ", adresse=" + getAdresse() +
            "}";
    }
}
