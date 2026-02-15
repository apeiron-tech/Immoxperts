package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DvfLouerService {
    List<SuggestionDto> getSuggestions(String query, int limit);

    Page<DvfLouerDto> getLouersByLocationAndFiltersPaginated(
        String value,
        String type,
        BigDecimal maxBudget,
        String propertyType,
        Pageable pageable
    );
}
