package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.DispositionParcelle;
import com.apeiron.immoxperts.service.dto.DispositionParcelleDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link DispositionParcelle} and its DTO {@link DispositionParcelleDTO}.
 */
@Mapper(componentModel = "spring")
public interface DispositionParcelleMapper extends EntityMapper<DispositionParcelleDTO, DispositionParcelle> {}
