package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.DispositionParcelleAsserts.*;
import static com.apeiron.immoxperts.domain.DispositionParcelleTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class DispositionParcelleMapperTest {

    private DispositionParcelleMapper dispositionParcelleMapper;

    @BeforeEach
    void setUp() {
        dispositionParcelleMapper = new DispositionParcelleMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getDispositionParcelleSample1();
        var actual = dispositionParcelleMapper.toEntity(dispositionParcelleMapper.toDto(expected));
        assertDispositionParcelleAllPropertiesEquals(expected, actual);
    }
}
