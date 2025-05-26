package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.domain.AdresseLocal;
import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import com.apeiron.immoxperts.service.dto.AdresseLocalDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AdresseLocal} and its DTO {@link AdresseLocalDTO}.
 */
@Mapper(componentModel = "spring")
public interface AdresseLocalMapper extends EntityMapper<AdresseLocalDTO, AdresseLocal> {
    @Mapping(target = "mutation", source = "mutation", qualifiedByName = "mutationId")
    @Mapping(target = "adresse", source = "adresse", qualifiedByName = "adresseId")
    AdresseLocalDTO toDto(AdresseLocal s);

    @Named("mutationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    MutationDTO toDtoMutationId(Mutation mutation);

    @Named("adresseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    AdresseDTO toDtoAdresseId(Adresse adresse);
}
