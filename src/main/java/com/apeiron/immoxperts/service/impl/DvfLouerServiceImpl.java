package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.DvfLouer;
import com.apeiron.immoxperts.domain.DvfLouerDetailView;
import com.apeiron.immoxperts.repository.DvfLouerDetailViewRepository;
import com.apeiron.immoxperts.repository.DvfLouerRepository;
import com.apeiron.immoxperts.service.DvfLouerService;
import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import com.apeiron.immoxperts.service.dto.SuggestionDto;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class DvfLouerServiceImpl implements DvfLouerService {

    private final DvfLouerRepository repository;
    private final DvfLouerDetailViewRepository detailViewRepository;

    public DvfLouerServiceImpl(DvfLouerRepository repository, DvfLouerDetailViewRepository detailViewRepository) {
        this.repository = repository;
        this.detailViewRepository = detailViewRepository;
    }

    @Override
    public Page<DvfLouerDto> getLouersByLocationAndFiltersPaginated(
        String value,
        String type,
        BigDecimal minBudget,
        BigDecimal maxBudget,
        String propertyType,
        String chambres,
        Pageable pageable
    ) {
        if (value == null || value.trim().isEmpty() || type == null || type.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        Integer chambre1 = null, chambre2 = null, chambre3 = null, chambre4 = null, chambresMin = null;
        if (chambres != null && !chambres.trim().isEmpty()) {
            String s = chambres.trim();
            if (s.equals("5+") || s.equals("5")) {
                chambresMin = 5;
            } else {
                String[] parts = s.split("[,;]");
                int i = 0;
                for (String p : parts) {
                    try {
                        int n = Integer.parseInt(p.trim());
                        if (n >= 1 && n <= 99 && i < 4) {
                            if (i == 0) chambre1 = n;
                            else if (i == 1) chambre2 = n;
                            else if (i == 2) chambre3 = n;
                            else chambre4 = n;
                            i++;
                        }
                    } catch (NumberFormatException ignored) {}
                }
            }
        }

        boolean hasChambresFilter = chambre1 != null || chambre2 != null || chambre3 != null || chambre4 != null || chambresMin != null;
        Page<DvfLouer> page = hasChambresFilter
            ? repository.findByLocationAndFiltersPaginatedWithChambres(
                value.trim(),
                type.trim(),
                minBudget,
                maxBudget,
                propertyType != null ? propertyType.trim() : null,
                chambre1,
                chambre2,
                chambre3,
                chambre4,
                chambresMin,
                pageable
            )
            : repository.findByLocationAndFiltersPaginated(
                value.trim(),
                type.trim(),
                minBudget,
                maxBudget,
                propertyType != null ? propertyType.trim() : null,
                pageable
            );
        List<DvfLouerDto> content = page.getContent().stream().map(this::toDto).toList();
        List<Long> ids = content.stream().map(DvfLouerDto::getId).toList();
        if (!ids.isEmpty()) {
            List<DvfLouerDetailView> detailList = detailViewRepository.findByPublicationIdIn(ids);
            Map<Long, DvfLouerDetailView> detailMap = detailList.stream().collect(Collectors.toMap(DvfLouerDetailView::getPublicationId, d -> d));
            for (DvfLouerDto dto : content) {
                DvfLouerDetailView d = detailMap.get(dto.getId());
                if (d != null) {
                    dto.setSurface(d.getSurface());
                    dto.setChambre(d.getChambre());
                    dto.setPieces(d.getPieces());
                    dto.setDpe(d.getDpe());
                    dto.setTerrainSqm(d.getTerrainSqm());
                    dto.setPiscine(d.getPiscine());
                    dto.setMeuble(d.getMeuble());
                    dto.setTerrasse(d.getTerrasse());
                    dto.setBalcon(d.getBalcon());
                    dto.setCave(d.getCave());
                    dto.setJardin(d.getJardin());
                    dto.setParking(d.getParking());
                    dto.setEtage(d.getEtage());
                }
            }
        }
        return new PageImpl<>(content, page.getPageable(), page.getTotalElements());
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
