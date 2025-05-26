package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.AdresseDispoparcAsserts.*;
import static com.apeiron.immoxperts.domain.AdresseDispoparcTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AdresseDispoparcMapperTest {

    private AdresseDispoparcMapper adresseDispoparcMapper;

    @BeforeEach
    void setUp() {
        adresseDispoparcMapper = new AdresseDispoparcMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAdresseDispoparcSample1();
        var actual = adresseDispoparcMapper.toEntity(adresseDispoparcMapper.toDto(expected));
        assertAdresseDispoparcAllPropertiesEquals(expected, actual);
    }
}
