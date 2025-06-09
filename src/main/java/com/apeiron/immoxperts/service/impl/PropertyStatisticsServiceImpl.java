package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.repository.PropertyStatisticsRepository;
import com.apeiron.immoxperts.service.PropertyStatisticsService;
import com.apeiron.immoxperts.service.dto.PropertyStatisticsDTO;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@Transactional
public class PropertyStatisticsServiceImpl implements PropertyStatisticsService {

    private final PropertyStatisticsRepository propertyStatisticsRepository;

    public PropertyStatisticsServiceImpl(PropertyStatisticsRepository propertyStatisticsRepository) {
        this.propertyStatisticsRepository = propertyStatisticsRepository;
    }

    public List<PropertyStatisticsDTO> getPropertyStatisticsByCommune(String commune) {
        if (!StringUtils.hasText(commune)) {
            throw new IllegalArgumentException("Commune must not be null or empty");
        }

        List<Object[]> results = propertyStatisticsRepository.getPropertyStatistics(commune);

        if (results == null || results.isEmpty()) {
            return new ArrayList<>();
        }

        return results
            .stream()
            .filter(Objects::nonNull)
            .map(this::mapToPropertyStatisticsDTO)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private PropertyStatisticsDTO mapToPropertyStatisticsDTO(Object[] result) {
        try {
            if (result == null || result.length < 4) {
                return null;
            }

            String typeBien = result[0] != null ? (String) result[0] : "Unknown";
            Long nombre = result[1] != null ? ((Number) result[1]).longValue() : 0L;
            BigDecimal prixMoyen = result[2] != null ? new BigDecimal(result[2].toString()) : BigDecimal.ZERO;
            BigDecimal prixM2Moyen = result[3] != null ? new BigDecimal(result[3].toString()) : BigDecimal.ZERO;

            return new PropertyStatisticsDTO(typeBien, nombre, prixMoyen, prixM2Moyen);
        } catch (Exception e) {
            return null;
        }
    }
}
