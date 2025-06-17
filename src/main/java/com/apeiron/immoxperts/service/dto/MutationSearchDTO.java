package com.apeiron.immoxperts.service.dto;

import java.math.BigDecimal;
import java.time.Instant;

public class MutationSearchDTO {

    private Integer idmutation;
    private BigDecimal valeurfonc;
    private String voie;
    private String typvoie;
    private Integer novoie;
    private String btq;
    private String commune;
    private String codepostal;

    // Constructor
    public MutationSearchDTO(
        Integer idmutation,
        BigDecimal valeurfonc,
        String voie,
        String typvoie,
        Integer novoie,
        String btq,
        String commune,
        String codepostal
    ) {
        this.idmutation = idmutation;
        this.valeurfonc = valeurfonc;
        this.voie = voie;
        this.typvoie = typvoie;
        this.novoie = novoie;
        this.btq = btq;
        this.commune = commune;
        this.codepostal = codepostal;
    }
    // Getters and Setters (or use Lombok @Data)
}
