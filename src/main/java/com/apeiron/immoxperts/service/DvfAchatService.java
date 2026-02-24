package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.DvfAchatDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface DvfAchatService {
    List<SuggestionDto> getSuggestions(String query, int limit);

    Page<DvfAchatDto> getAchatsByLocationAndFiltersPaginated(
        String value,
        String type,
        BigDecimal minBudget,
        BigDecimal maxBudget,
        String propertyType,
        String chambres,
        Pageable pageable
    );
}
