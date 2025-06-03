package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.DispositionParcelle} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class DispositionParcelleDTO implements Serializable {

    @NotNull
    private Integer iddispopar;

    private BigDecimal dcntagri;

    private BigDecimal dcntsol;

    public Integer getIddispopar() {
        return iddispopar;
    }

    public void setIddispopar(Integer iddispopar) {
        this.iddispopar = iddispopar;
    }

    public BigDecimal getDcntagri() {
        return dcntagri;
    }

    public void setDcntagri(BigDecimal dcntagri) {
        this.dcntagri = dcntagri;
    }

    public BigDecimal getDcntsol() {
        return dcntsol;
    }

    public void setDcntsol(BigDecimal dcntsol) {
        this.dcntsol = dcntsol;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof DispositionParcelleDTO)) {
            return false;
        }

        DispositionParcelleDTO dispositionParcelleDTO = (DispositionParcelleDTO) o;
        if (this.iddispopar == null) {
            return false;
        }
        return Objects.equals(this.iddispopar, dispositionParcelleDTO.iddispopar);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.iddispopar);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "DispositionParcelleDTO{" +
            "iddispopar=" + getIddispopar() +
            ", dcntagri=" + getDcntagri() +
            ", dcntsol=" + getDcntsol() +
            "}";
    }
}
