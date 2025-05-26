package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.LocalAsserts.*;
import static com.apeiron.immoxperts.domain.LocalTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class LocalMapperTest {

    private LocalMapper localMapper;

    @BeforeEach
    void setUp() {
        localMapper = new LocalMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getLocalSample1();
        var actual = localMapper.toEntity(localMapper.toDto(expected));
        assertLocalAllPropertiesEquals(expected, actual);
    }
}
