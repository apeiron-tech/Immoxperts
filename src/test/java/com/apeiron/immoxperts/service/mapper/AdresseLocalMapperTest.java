package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.AdresseLocalAsserts.*;
import static com.apeiron.immoxperts.domain.AdresseLocalTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class AdresseLocalMapperTest {

    private AdresseLocalMapper adresseLocalMapper;

    @BeforeEach
    void setUp() {
        adresseLocalMapper = new AdresseLocalMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getAdresseLocalSample1();
        var actual = adresseLocalMapper.toEntity(adresseLocalMapper.toDto(expected));
        assertAdresseLocalAllPropertiesEquals(expected, actual);
    }
}
