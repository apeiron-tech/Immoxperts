package com.apeiron.immoxperts.service;

import com.apeiron.immoxperts.service.dto.DvfLouerDto;
import java.math.BigDecimal;
import java.util.List;

public interface DvfLouerService {
    List<DvfLouerDto> getAllLouers();
    List<DvfLouerDto> getLouersByPostalCode(String postalCode);

    List<DvfLouerDto> searchLouers(String postalCode, BigDecimal price, String propertyType);
}
