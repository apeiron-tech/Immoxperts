package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.repository.PropertyStatisticsRepository;
import com.apeiron.immoxperts.service.PropertyStatisticsService;
import com.apeiron.immoxperts.service.dto.PropertyStatisticsDTO;
import java.util.List;
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

    @Override
    @Transactional(readOnly = true)
    public List<PropertyStatisticsDTO> getPropertyStatisticsByCommune(String commune) {
        if (!StringUtils.hasText(commune)) {
            throw new IllegalArgumentException("Commune must not be null or empty");
        }
        return propertyStatisticsRepository.findStatsByCommune(commune);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PropertyStatisticsDTO> getAllPropertyStatisticsByCommune(String commune) {
        if (!StringUtils.hasText(commune)) {
            throw new IllegalArgumentException("Commune must not be null or empty");
        }
        return propertyStatisticsRepository.findStatsByCommune(commune);
    }

    @Override
    @Transactional
    public void refreshPropertyStatistics() {
        propertyStatisticsRepository.refreshMaterializedView();
    }
}
