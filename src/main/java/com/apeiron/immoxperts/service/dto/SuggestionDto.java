package com.apeiron.immoxperts.service.dto;

public class SuggestionDto {

    private String value;
    private String adresse;
    private String type;
    private Long count;

    public SuggestionDto() {}

    public SuggestionDto(String value, String adresse, String type, Long count) {
        this.value = value;
        this.adresse = adresse;
        this.type = type;
        this.count = count;
    }

    // Getters and setters
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
}
