package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.LotAsserts.*;
import static com.apeiron.immoxperts.domain.LotTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LotMapperTest {

    private LotMapper lotMapper;

    @BeforeEach
    void setUp() {
        lotMapper = new LotMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLotSample1();
        var actual = lotMapper.toEntity(lotMapper.toDto(expected));
        assertLotAllPropertiesEquals(expected, actual);
    }
}
