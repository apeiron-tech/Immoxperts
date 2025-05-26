package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.Mutation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MutationDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer idmutation;

    private Instant datemut;

    private BigDecimal valeurfonc;

    private Integer idnatmut;

    private String coddep;

    private Boolean vefa;

    private BigDecimal sterr;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getIdmutation() {
        return idmutation;
    }

    public void setIdmutation(Integer idmutation) {
        this.idmutation = idmutation;
    }

    public Instant getDatemut() {
        return datemut;
    }

    public void setDatemut(Instant datemut) {
        this.datemut = datemut;
    }

    public BigDecimal getValeurfonc() {
        return valeurfonc;
    }

    public void setValeurfonc(BigDecimal valeurfonc) {
        this.valeurfonc = valeurfonc;
    }

    public Integer getIdnatmut() {
        return idnatmut;
    }

    public void setIdnatmut(Integer idnatmut) {
        this.idnatmut = idnatmut;
    }

    public String getCoddep() {
        return coddep;
    }

    public void setCoddep(String coddep) {
        this.coddep = coddep;
    }

    public Boolean getVefa() {
        return vefa;
    }

    public void setVefa(Boolean vefa) {
        this.vefa = vefa;
    }

    public BigDecimal getSterr() {
        return sterr;
    }

    public void setSterr(BigDecimal sterr) {
        this.sterr = sterr;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MutationDTO)) {
            return false;
        }

        MutationDTO mutationDTO = (MutationDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, mutationDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MutationDTO{" +
            "id=" + getId() +
            ", idmutation=" + getIdmutation() +
            ", datemut='" + getDatemut() + "'" +
            ", valeurfonc=" + getValeurfonc() +
            ", idnatmut=" + getIdnatmut() +
            ", coddep='" + getCoddep() + "'" +
            ", vefa='" + getVefa() + "'" +
            ", sterr=" + getSterr() +
            "}";
    }
}
