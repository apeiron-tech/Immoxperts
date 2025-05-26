package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.Local} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LocalDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer iddispoloc;

    private Integer idmutation;

    private BigDecimal sbati;

    private String libtyploc;

    private Integer nbpprinc;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIddispoloc() {
        return iddispoloc;
    }

    public void setIddispoloc(Integer iddispoloc) {
        this.iddispoloc = iddispoloc;
    }

    public Integer getIdmutation() {
        return idmutation;
    }

    public void setIdmutation(Integer idmutation) {
        this.idmutation = idmutation;
    }

    public BigDecimal getSbati() {
        return sbati;
    }

    public void setSbati(BigDecimal sbati) {
        this.sbati = sbati;
    }

    public String getLibtyploc() {
        return libtyploc;
    }

    public void setLibtyploc(String libtyploc) {
        this.libtyploc = libtyploc;
    }

    public Integer getNbpprinc() {
        return nbpprinc;
    }

    public void setNbpprinc(Integer nbpprinc) {
        this.nbpprinc = nbpprinc;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LocalDTO)) {
            return false;
        }

        LocalDTO localDTO = (LocalDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, localDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LocalDTO{" +
            "id=" + getId() +
            ", iddispoloc=" + getIddispoloc() +
            ", idmutation=" + getIdmutation() +
            ", sbati=" + getSbati() +
            ", libtyploc='" + getLibtyploc() + "'" +
            ", nbpprinc=" + getNbpprinc() +
            "}";
    }
}
