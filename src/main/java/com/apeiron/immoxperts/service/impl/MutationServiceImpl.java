package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.domain.AdresseDispoparc;
import com.apeiron.immoxperts.domain.AdresseLocal;
import com.apeiron.immoxperts.domain.Local;
import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.repository.AdresseLocalRepository;
import com.apeiron.immoxperts.repository.AdresseRepository;
import com.apeiron.immoxperts.repository.DispositionParcelleRepository;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.dto.MutationSearchDTO;
import com.apeiron.immoxperts.service.mapper.MutationMapper;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.Mutation}.
 */
@Service
@Transactional
public class MutationServiceImpl implements MutationService {

    private static final Logger LOG = LoggerFactory.getLogger(MutationServiceImpl.class);
    private static final Map<String, String> TYPE_VOIE_MAPPING = Map.ofEntries(
        Map.entry("COURS", "CRS"),
        Map.entry("BOULEVARD", "BD"),
        Map.entry("AVENUE", "AV"),
        Map.entry("RUE", "RUE"),
        Map.entry("PLACE", "PL"),
        Map.entry("PASSAGE", "PASS"),
        Map.entry("IMPASSE", "IMP"),
        Map.entry("ALLEE", "ALL"),
        Map.entry("CHEMIN", "CHE"),
        Map.entry("ROUTE", "RTE"),
        Map.entry("SQUARE", "SQ"),
        Map.entry("GALERIE", "GAL"),
        Map.entry("RESIDENCE", "RES"),
        Map.entry("QUAI", "QUAI"),
        Map.entry("QUARTIER ", "QRT")
    );

    private final MutationRepository mutationRepository;
    private final MutationMapper mutationMapper;
    private final AdresseLocalRepository adresseLocalRepository;
    private final AdresseRepository adresseRepository;
    private final DispositionParcelleRepository dispositionParcelleRepository;

    public MutationServiceImpl(
        MutationRepository mutationRepository,
        MutationMapper mutationMapper,
        AdresseLocalRepository adresseLocalRepository,
        AdresseRepository adresseRepository,
        DispositionParcelleRepository dispositionParcelleRepository
    ) {
        this.mutationRepository = mutationRepository;
        this.mutationMapper = mutationMapper;
        this.adresseLocalRepository = adresseLocalRepository;
        this.adresseRepository = adresseRepository;
        this.dispositionParcelleRepository = dispositionParcelleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MutationDTO> findOne(Integer id) {
        LOG.debug("Request to get Mutation : {}", id);
        return mutationRepository.findById(id).map(mutationMapper::toDto);
    }

    @Override
    public List<MutationDTO> getMutationsByAdresseId(Integer adresseId) {
        LOG.debug("Request to get Mutations by Adresse ID : {}", adresseId);
        return mutationRepository.findByAdresseId(adresseId).stream().map(mutationMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Cacheable(
        value = "mutationSearchCache",
        key = "#novoieStr + '|' + #voie",
        unless = "#result == null || #result.isEmpty()",
        condition = "#novoieStr != null || #voie != null"
    )
    public List<MutationDTO> searchMutations(String novoieStr, String voie) {
        if ((novoieStr == null || novoieStr.trim().isEmpty()) && (voie == null || voie.trim().isEmpty())) {
            return Collections.emptyList();
        }

        // Parse street number and suffix
        Integer novoie = null;
        String btq = null;
        if (novoieStr != null && !novoieStr.trim().isEmpty()) {
            String trimmed = novoieStr.trim();
            int i = 0;
            while (i < trimmed.length() && Character.isDigit(trimmed.charAt(i))) i++;
            if (i > 0) {
                try {
                    novoie = Integer.parseInt(trimmed.substring(0, i));
                    if (i < trimmed.length()) {
                        String complement = trimmed.substring(i).toUpperCase();
                        if (complement.equals("B") || complement.equals("BIS")) {
                            btq = "BIS";
                        } else if (complement.equals("T") || complement.equals("TER")) {
                            btq = "TER";
                        } else {
                            btq = complement;
                        }
                    }
                } catch (NumberFormatException ignored) {}
            }
        }

        // Parse street type and name
        String typvoie = null;
        String voieRestante = null;
        if (voie != null && !voie.trim().isEmpty()) {
            String voieTrimmed = voie.trim().toUpperCase();
            for (Map.Entry<String, String> entry : TYPE_VOIE_MAPPING.entrySet()) {
                String typeVoieKey = entry.getKey();
                if (voieTrimmed.startsWith(typeVoieKey)) {
                    typvoie = entry.getValue();
                    voieRestante = voieTrimmed.substring(typeVoieKey.length()).trim();
                    break;
                }
            }
            if (typvoie == null && voieTrimmed.contains(" ")) {
                String firstWord = voieTrimmed.split(" ", 2)[0];
                typvoie = TYPE_VOIE_MAPPING.getOrDefault(firstWord, firstWord);
                voieRestante = voieTrimmed.substring(firstWord.length()).trim();
            }
        }

        // Use a reasonable page size and sort by mutation date
        Pageable pageable = PageRequest.of(0, 100, Sort.by("datemut").descending());

        // Use the materialized view for faster querying
        Page<Mutation> mutations = mutationRepository.searchMutationsByCriteria(novoie, btq, typvoie, voieRestante, pageable);

        // Convert to DTOs and limit results if needed
        return mutations
            .getContent()
            .stream()
            .map(this::convertToDTO)
            .limit(100) // Ensure we don't return too many results
            .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(
        value = "streetCommuneCache",
        key = "#street + '|' + #commune + '|' + #pageable.pageNumber + '|' + #pageable.pageSize",
        unless = "#result == null || #result.isEmpty()"
    )
    public Page<MutationDTO> searchMutationsByStreetAndCommune(String street, String commune, Pageable pageable) {
        if (commune == null || commune.trim().isEmpty()) {
            return Page.empty(pageable);
        }

        String trimmedCommune = commune.trim();
        String trimmedStreet = street != null ? street.trim() : null;

        // Get total count
        long total = mutationRepository.countMutationsByCommuneAndStreet(trimmedCommune, trimmedStreet);

        if (total == 0) {
            return Page.empty(pageable);
        }

        // Get paginated results
        List<Mutation> mutations = mutationRepository.findMutationsByCommuneAndStreet(
            trimmedCommune,
            trimmedStreet,
            pageable.getPageSize()
        );

        List<MutationDTO> dtos = mutations.stream().map(this::convertToDTO).collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, total);
    }

    public List<MutationDTO> getMutationsByVoie(String voie) {
        List<Adresse> addresses = adresseRepository.findByVoieContainingIgnoreCase(voie);

        // Collect unique mutations from these addresses
        return addresses
            .stream()
            .flatMap(adresse -> adresse.getAdresseLocals().stream())
            .map(AdresseLocal::getMutation)
            .distinct()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private MutationDTO convertToDTO(Mutation mutation) {
        if (mutation == null) {
            return null;
        }

        // Initialize the DTO with basic properties that don't require lazy loading
        MutationDTO dto = new MutationDTO();
        dto.setIdmutation(mutation.getIdmutation());
        dto.setDatemut(mutation.getDatemut());
        dto.setValeurfonc(mutation.getValeurfonc());
        dto.setIdnatmut(mutation.getIdnatmut());
        dto.setCoddep(mutation.getCoddep());
        dto.setTerrain(mutation.getSterr());

        Set<String> libtyplocSet = new HashSet<>();
        final int[] nbpprincTotal = { 0 };
        Set<String> addresses = new HashSet<>();

        try {
            // Safely process AdresseLocals
            if (mutation.getAdresseLocals() != null) {
                mutation
                    .getAdresseLocals()
                    .stream()
                    .filter(Objects::nonNull)
                    .forEach(adresseLocal -> {
                        if (adresseLocal.getLocal() != null) {
                            String type = adresseLocal.getLocal().getLibtyploc();
                            if (type != null && !type.trim().isEmpty()) {
                                libtyplocSet.add(type.trim().toUpperCase());
                            }
                            if (adresseLocal.getLocal().getNbpprinc() != null) {
                                nbpprincTotal[0] += adresseLocal.getLocal().getNbpprinc();
                            }
                        }
                        if (adresseLocal.getAdresse() != null) {
                            String formattedAddress = formatAddress(adresseLocal.getAdresse());
                            if (formattedAddress != null && !formattedAddress.trim().isEmpty()) {
                                addresses.add(formattedAddress);
                            }
                        }
                    });
            }

            // Safely process AdresseDispoparcs
            if (mutation.getAdresseDispoparcs() != null) {
                mutation
                    .getAdresseDispoparcs()
                    .stream()
                    .filter(Objects::nonNull)
                    .forEach(ad -> {
                        if (ad.getAdresse() != null) {
                            String formattedAddress = formatAddress(ad.getAdresse());
                            if (formattedAddress != null && !formattedAddress.trim().isEmpty()) {
                                addresses.add(formattedAddress);
                            }
                        }
                    });

                // Calculate terrain if needed
                if (addresses.isEmpty() && mutation.getSterr() == null) {
                    Set<Integer> uniqueIds = mutation
                        .getAdresseDispoparcs()
                        .stream()
                        .filter(Objects::nonNull)
                        .map(AdresseDispoparc::getIddispopar)
                        .filter(Objects::nonNull)
                        .collect(Collectors.toSet());

                    if (!uniqueIds.isEmpty()) {
                        BigDecimal dcntsolSum = dispositionParcelleRepository.sumDcntsolByIddispopars(new ArrayList<>(uniqueIds));
                        BigDecimal dcntagrSum = dispositionParcelleRepository.sumDcntagrclByIddispopars(new ArrayList<>(uniqueIds));
                        dto.setTerrain(dcntagrSum.add(dcntsolSum));
                    } else {
                        dto.setTerrain(BigDecimal.ZERO);
                    }
                }
            }
        } catch (Exception e) {
            LOG.warn("Error processing related entities for mutation {}: {}", mutation.getIdmutation(), e.getMessage());
            // Continue processing with what we have
        }

        // Set the processed data
        if (libtyplocSet.size() > 1) {
            dto.setLibtyplocList(Collections.singletonList("BIEN MULTIPLE"));
        } else {
            dto.setLibtyplocList(new ArrayList<>(libtyplocSet));
        }

        dto.setNbpprincTotal(nbpprincTotal[0]);
        dto.setAddresses(new ArrayList<>(addresses));

        // Get surface area
        try {
            BigDecimal total = adresseLocalRepository.surfaceMutaion(mutation.getIdmutation().longValue());
            dto.setSurface(total != null ? total : BigDecimal.ZERO);
        } catch (Exception e) {
            LOG.warn("Error getting surface for mutation {}: {}", mutation.getIdmutation(), e.getMessage());
            dto.setSurface(BigDecimal.ZERO);
        }

        return dto;
    }

    private String formatAddress(Adresse adresse) {
        StringBuilder sb = new StringBuilder();
        if (adresse.getNovoie() != null) {
            sb.append(adresse.getNovoie());
        }
        if (adresse.getTypvoie() != null) {
            sb.append(" ").append(adresse.getTypvoie());
        }
        if (adresse.getVoie() != null) {
            sb.append(" ").append(adresse.getVoie());
        }
        if (adresse.getCodepostal() != null) {
            sb.append(", ").append(adresse.getCodepostal());
        }
        if (adresse.getCommune() != null) {
            sb.append(" ").append(adresse.getCommune());
        }
        return sb.toString();
    }

    @Override
    @Transactional(readOnly = true)
    public List<MutationDTO> searchMutationsByAddress(Integer streetNumber, String streetName, String postalCode, String city) {
        LOG.debug(
            "Request to search mutations by address: streetNumber={}, streetName={}, postalCode={}, city={}",
            streetNumber,
            streetName,
            postalCode,
            city
        );

        List<Mutation> mutations = mutationRepository.searchMutationsByAddress(streetNumber, streetName, postalCode, city);

        return mutations
            .stream()
            .map(mutation -> {
                MutationDTO dto = mutationMapper.toDto(mutation);
                // Get the surface area for this mutation
                BigDecimal surface = adresseLocalRepository.surfaceMutaion(mutation.getIdmutation().longValue());
                dto.setSurface(surface);

                // Format addresses
                if (mutation.getAdresseLocals() != null) {
                    dto.setAddresses(
                        mutation.getAdresseLocals().stream().map(al -> formatAddress(al.getAdresse())).collect(Collectors.toList())
                    );
                }

                return dto;
            })
            .collect(Collectors.toList());
    }
}
