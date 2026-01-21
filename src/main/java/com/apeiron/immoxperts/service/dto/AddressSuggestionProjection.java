package com.apeiron.immoxperts.service.dto;

public interface AddressSuggestionProjection {
    Long getIdadresse();
    String getAdresseComplete();
    String getNumero();
    String getNomVoie();
    String getTypeVoie();
    String getCodepostal();
    String getCommune();
    Double getLatitude();
    Double getLongitude();
    Boolean getHasMutations();
}
