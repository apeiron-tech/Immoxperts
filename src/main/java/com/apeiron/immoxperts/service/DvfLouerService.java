package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;

public interface DvfLouerService {
    List<SuggestionDto> getSuggestions(String query, int limit);
    List<DvfLouerDto> getLouersByLocation(String value, String type);
    List<DvfLouerDto> getLouersByLocationAndFilters(String value, String type, BigDecimal maxBudget, String propertyType);
}
