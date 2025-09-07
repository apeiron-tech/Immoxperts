package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.DvfLouer;
import com.apeiron.immoxperts.repository.DvfLouerRepository;
import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class DvfLouerServiceImpl implements DvfLouerService {

    private final DvfLouerRepository repository;

    public DvfLouerServiceImpl(DvfLouerRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<DvfLouerDto> getAllLouers() {
        return repository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    public List<DvfLouerDto> getLouersByPostalCode(String postalCode) {
        return repository.findByPostalCode(postalCode).stream().map(this::toDto).collect(Collectors.toList());
    }

    private DvfLouerDto toDto(DvfLouer entity) {
        DvfLouerDto dto = new DvfLouerDto();
        dto.setId(entity.getId());
        dto.setPostalCode(entity.getPostalCode());
        dto.setPropertyType(entity.getPropertyType());
        dto.setAddress(entity.getAddress());
        dto.setDetails(entity.getDetails());
        dto.setPrice(entity.getPrice());
        dto.setPriceText(entity.getPriceText());
        dto.setImages(entity.getImages());
        dto.setScrapedAt(entity.getScrapedAt());
        return dto;
    }

    @Override
    public List<DvfLouerDto> searchLouers(String postalCode, BigDecimal price, String propertyType) {
        List<DvfLouer> list = repository.searchLouers(
            (postalCode == null || postalCode.isBlank()) ? null : postalCode,
            price,
            propertyType
        );
        return list.stream().map(this::toDto).collect(Collectors.toList());
    }
}
