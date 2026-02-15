package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.DvfLouer;
import com.apeiron.immoxperts.repository.DvfLouerRepository;
import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DvfLouerServiceImpl implements DvfLouerService {

    private final DvfLouerRepository repository;

    public DvfLouerServiceImpl(DvfLouerRepository repository) {
        this.repository = repository;
    }

    @Override
    public Page<DvfLouerDto> getLouersByLocationAndFiltersPaginated(
        String value,
        String type,
        BigDecimal maxBudget,
        String propertyType,
        Pageable pageable
    ) {
        if (value == null || value.trim().isEmpty() || type == null || type.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        return repository
            .findByLocationAndFiltersPaginated(
                value.trim(),
                type.trim(),
                maxBudget,
                propertyType != null ? propertyType.trim() : null,
                pageable
            )
            .map(this::toDto);
    }

    private DvfLouerDto toDto(DvfLouer entity) {
        DvfLouerDto dto = new DvfLouerDto();
        dto.setId(entity.getId());
        dto.setSource(entity.getSource());
        dto.setSearchPostalCode(entity.getSearchPostalCode());
        dto.setDepartment(entity.getDepartment());
        dto.setDepartmentName(entity.getDepartmentName());
        dto.setCommune(entity.getCommune());
        dto.setCodeDepartment(entity.getCodeDepartment());
        dto.setPropertyType(entity.getPropertyType());
        dto.setPriceText(entity.getPriceText());
        dto.setPrice(entity.getPrice());
        dto.setAddress(entity.getAddress());
        dto.setDetails(entity.getDetails());
        dto.setDescription(entity.getDescription());
        dto.setPropertyUrl(entity.getPropertyUrl());
        dto.setImages(entity.getImages());
        return dto;
    }

    @Override
    public List<SuggestionDto> getSuggestions(String query, int limit) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        List<Object[]> results = repository.findSuggestions(query.trim(), limit);

        return results
            .stream()
            .map(result ->
                new SuggestionDto(
                    (String) result[0], // value (original value)
                    (String) result[1], // adresse (formatted address)
                    (String) result[2], // suggestion type
                    ((Number) result[3]).longValue() // count
                )
            )
            .collect(Collectors.toList());
    }
}
