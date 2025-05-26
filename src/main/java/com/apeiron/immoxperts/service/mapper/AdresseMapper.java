package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Adresse} and its DTO {@link AdresseDTO}.
 */
@Mapper(componentModel = "spring")
public interface AdresseMapper extends EntityMapper<AdresseDTO, Adresse> {}
