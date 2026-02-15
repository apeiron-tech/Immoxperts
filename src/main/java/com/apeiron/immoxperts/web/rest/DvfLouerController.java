package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/louer")
public class DvfLouerController {

    private static final int DEFAULT_PAGE_SIZE = 30;

    private final DvfLouerService service;

    public DvfLouerController(DvfLouerService service) {
        this.service = service;
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<SuggestionDto>> getSuggestions(
        @RequestParam("q") String query,
        @RequestParam(value = "limit", defaultValue = "10") int limit
    ) {
        List<SuggestionDto> suggestions = service.getSuggestions(query, limit);
        return ResponseEntity.ok(suggestions);
    }

    @GetMapping("/search-with-filters")
    public ResponseEntity<Page<DvfLouerDto>> searchWithFilters(
        @RequestParam("value") String value,
        @RequestParam("type") String type,
        @RequestParam(value = "maxBudget", required = false) BigDecimal maxBudget,
        @RequestParam(value = "propertyType", required = false) String propertyType,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "30") int size
    ) {
        int pageSize = Math.min(Math.max(size, 1), 100);
        Pageable pageable = PageRequest.of(Math.max(page, 0), pageSize);
        Page<DvfLouerDto> louers = service.getLouersByLocationAndFiltersPaginated(
            value, type, maxBudget, propertyType, pageable
        );
        return ResponseEntity.ok(louers);
    }
}
