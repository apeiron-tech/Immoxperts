package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Mutation} and its DTO {@link MutationDTO}.
 */
@Mapper(componentModel = "spring")
public interface MutationMapper extends EntityMapper<MutationDTO, Mutation> {}
