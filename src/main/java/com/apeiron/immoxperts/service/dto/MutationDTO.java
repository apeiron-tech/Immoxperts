package com.apeiron.immoxperts.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for the {@link com.apeiron.immoxperts.domain.Mutation} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MutationDTO implements Serializable {

    @NotNull
    private Integer idmutation;

    private Instant datemut;

    private BigDecimal valeurfonc;

    private Integer idnatmut;

    private String coddep;

    private Boolean vefa;

    private BigDecimal sterr;

    private BigDecimal terrain;

    private List<String> libtyplocList;

    private int nbpprincTotal;

    private List<String> addresses;

    private BigDecimal surface;

    public MutationDTO() {}

    public MutationDTO(Integer idmutation, Instant datemut, BigDecimal valeurfonc) {
        this.idmutation = idmutation;
        this.datemut = datemut;
        this.valeurfonc = valeurfonc;
    }

    public Integer getIdmutation(int i) {
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

    public BigDecimal getTerrain() {
        return terrain;
    }

    public void setTerrain(BigDecimal terrain) {
        this.terrain = terrain;
    }

    public List<String> getLibtyplocList() {
        return libtyplocList;
    }

    public void setLibtyplocList(List<String> libtyplocList) {
        this.libtyplocList = libtyplocList;
    }

    public int getNbpprincTotal() {
        return nbpprincTotal;
    }

    public void setNbpprincTotal(int nbpprincTotal) {
        this.nbpprincTotal = nbpprincTotal;
    }

    public List<String> getAddresses() {
        return addresses;
    }

    public void setAddresses(List<String> addresses) {
        this.addresses = addresses;
    }

    public BigDecimal getSurface() {
        return surface;
    }

    public void setSurface(BigDecimal surface) {
        this.surface = surface;
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
        if (this.idmutation == null) {
            return false;
        }
        return Objects.equals(this.idmutation, mutationDTO.idmutation);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.idmutation);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MutationDTO{" +
            "idmutation=" + getIdmutation(1) +
            ", datemut='" + getDatemut() + "'" +
            ", valeurfonc=" + getValeurfonc() +
            ", idnatmut=" + getIdnatmut() +
            ", coddep='" + getCoddep() + "'" +
            ", vefa='" + getVefa() + "'" +
            ", sterr=" + getSterr() +
            "}";
    }
}
