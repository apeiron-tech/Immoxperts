package com.apeiron.immoxperts.service.mapper;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.domain.AdresseDispoparc;
import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import com.apeiron.immoxperts.service.dto.AdresseDispoparcDTO;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link AdresseDispoparc} and its DTO {@link AdresseDispoparcDTO}.
 */
@Mapper(componentModel = "spring", uses = { MutationMapper.class, AdresseMapper.class })
public interface AdresseDispoparcMapper extends EntityMapper<AdresseDispoparcDTO, AdresseDispoparc> {
    @Mapping(target = "mutation", source = "mutation", qualifiedByName = "mutationId")
    @Mapping(target = "adresse", source = "adresse", qualifiedByName = "adresseId")
    AdresseDispoparcDTO toDto(AdresseDispoparc s);

    @Named("mutationId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "idmutation", source = "idmutation")
    MutationDTO toDtoMutationId(Mutation mutation);

    @Named("adresseId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "idadresse", source = "idadresse")
    AdresseDTO toDtoAdresseId(Adresse adresse);
}
