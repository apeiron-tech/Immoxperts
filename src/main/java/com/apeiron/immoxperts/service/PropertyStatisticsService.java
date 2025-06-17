package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.PropertyStatisticsDTO;
import java.util.List;

public interface PropertyStatisticsService {
    List<PropertyStatisticsDTO> getPropertyStatisticsByCommune(String commune);
    List<PropertyStatisticsDTO> getAllPropertyStatisticsByCommune(String commune);
    void refreshPropertyStatistics();
}
