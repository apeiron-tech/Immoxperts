package com.apeiron.immoxperts.service.dto;

import java.io.Serializable;

public class AddressSearchDTO implements Serializable {

    private String voie;
    private String commune;
    private String codepostal;

    public String getVoie() {
        return voie;
    }

    public void setVoie(String voie) {
        this.voie = voie;
    }

    public String getCommune() {
        return commune;
    }

    public void setCommune(String commune) {
        this.commune = commune;
    }

    public String getCodepostal() {
        return codepostal;
    }

    public void setCodepostal(String codepostal) {
        this.codepostal = codepostal;
    }
}
