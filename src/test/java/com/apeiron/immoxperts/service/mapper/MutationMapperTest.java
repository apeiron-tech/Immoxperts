package com.apeiron.immoxperts.service.mapper;

import static com.apeiron.immoxperts.domain.MutationAsserts.*;
import static com.apeiron.immoxperts.domain.MutationTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class MutationMapperTest {

    private MutationMapper mutationMapper;

    @BeforeEach
    void setUp() {
        mutationMapper = new MutationMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getMutationSample1();
        var actual = mutationMapper.toEntity(mutationMapper.toDto(expected));
        assertMutationAllPropertiesEquals(expected, actual);
    }
}
