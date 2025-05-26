package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.Lot} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LotDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer iddispolot;

    private BigDecimal scarrez;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIddispolot() {
        return iddispolot;
    }

    public void setIddispolot(Integer iddispolot) {
        this.iddispolot = iddispolot;
    }

    public BigDecimal getScarrez() {
        return scarrez;
    }

    public void setScarrez(BigDecimal scarrez) {
        this.scarrez = scarrez;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LotDTO)) {
            return false;
        }

        LotDTO lotDTO = (LotDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, lotDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LotDTO{" +
            "id=" + getId() +
            ", iddispolot=" + getIddispolot() +
            ", scarrez=" + getScarrez() +
            "}";
    }
}
