package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.AdresseAsserts.*;
import static com.apeiron.immoxperts.domain.AdresseTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AdresseMapperTest {

    private AdresseMapper adresseMapper;

    @BeforeEach
    void setUp() {
        adresseMapper = new AdresseMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAdresseSample1();
        var actual = adresseMapper.toEntity(adresseMapper.toDto(expected));
        assertAdresseAllPropertiesEquals(expected, actual);
    }
}
