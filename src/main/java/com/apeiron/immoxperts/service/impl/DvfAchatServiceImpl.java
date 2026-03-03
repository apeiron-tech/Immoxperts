package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.DvfAchat;
import com.apeiron.immoxperts.domain.DvfAchatDetailView;
import com.apeiron.immoxperts.repository.DvfAchatDetailViewRepository;
import com.apeiron.immoxperts.repository.DvfAchatRepository;
import com.apeiron.immoxperts.service.DvfAchatService;
import com.apeiron.immoxperts.service.dto.DvfAchatDto;
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
public class DvfAchatServiceImpl implements DvfAchatService {

    private final DvfAchatRepository repository;
    private final DvfAchatDetailViewRepository detailViewRepository;

    public DvfAchatServiceImpl(DvfAchatRepository repository, DvfAchatDetailViewRepository detailViewRepository) {
        this.repository = repository;
        this.detailViewRepository = detailViewRepository;
    }

    @Override
    public Page<DvfAchatDto> getAchatsByLocationAndFiltersPaginated(
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
        Page<DvfAchat> page = hasChambresFilter
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
        List<DvfAchatDto> content = page.getContent().stream().map(this::toDto).toList();
        List<Long> ids = content.stream().map(DvfAchatDto::getId).toList();
        if (!ids.isEmpty()) {
            List<DvfAchatDetailView> detailList = detailViewRepository.findByPublicationIdIn(ids);
            Map<Long, DvfAchatDetailView> detailMap = detailList.stream().collect(Collectors.toMap(DvfAchatDetailView::getPublicationId, d -> d));
            for (DvfAchatDto dto : content) {
                DvfAchatDetailView d = detailMap.get(dto.getId());
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

    private DvfAchatDto toDto(DvfAchat entity) {
        DvfAchatDto dto = new DvfAchatDto();
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
                    (String) result[0],
                    (String) result[1],
                    (String) result[2],
                    ((Number) result[3]).longValue()
                )
            )
            .collect(Collectors.toList());
    }
}
