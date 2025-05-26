package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Local;
import com.apeiron.immoxperts.service.dto.LocalDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Local} and its DTO {@link LocalDTO}.
 */
@Mapper(componentModel = "spring")
public interface LocalMapper extends EntityMapper<LocalDTO, Local> {}
