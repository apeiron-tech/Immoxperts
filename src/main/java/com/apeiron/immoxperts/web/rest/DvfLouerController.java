package com.apeiron.immoxperts.web.rest;

import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/louer")
public class DvfLouerController {

    private final DvfLouerService service;

    public DvfLouerController(DvfLouerService service) {
        this.service = service;
    }

    @GetMapping("/by-location")
    public ResponseEntity<List<DvfLouerDto>> getByLocation(@RequestParam("value") String value, @RequestParam("type") String type) {
        List<DvfLouerDto> louers = service.getLouersByLocation(value, type);
        return ResponseEntity.ok(louers);
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
    public ResponseEntity<List<DvfLouerDto>> searchWithFilters(
        @RequestParam("value") String value,
        @RequestParam("type") String type,
        @RequestParam(value = "maxBudget", required = false) BigDecimal maxBudget,
        @RequestParam(value = "propertyType", required = false) String propertyType
    ) {
        List<DvfLouerDto> louers = service.getLouersByLocationAndFilters(value, type, maxBudget, propertyType);
        return ResponseEntity.ok(louers);
    }
}
