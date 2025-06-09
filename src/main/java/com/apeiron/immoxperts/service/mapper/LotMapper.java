package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Lot;
import com.apeiron.immoxperts.service.dto.LotDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Lot} and its DTO {@link LotDTO}.
 */
@Mapper(componentModel = "spring")
public interface LotMapper extends EntityMapper<LotDTO, Lot> {}
