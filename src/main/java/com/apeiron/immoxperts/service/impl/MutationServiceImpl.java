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
import com.apeiron.immoxperts.service.mapper.MutationMapper;
import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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
    public MutationDTO save(MutationDTO mutationDTO) {
        LOG.debug("Request to save Mutation : {}", mutationDTO);
        Mutation mutation = mutationMapper.toEntity(mutationDTO);
        mutation = mutationRepository.save(mutation);
        return mutationMapper.toDto(mutation);
    }

    @Override
    public MutationDTO update(MutationDTO mutationDTO) {
        LOG.debug("Request to update Mutation : {}", mutationDTO);
        Mutation mutation = mutationMapper.toEntity(mutationDTO);
        mutation = mutationRepository.save(mutation);
        return mutationMapper.toDto(mutation);
    }

    @Override
    public Optional<MutationDTO> partialUpdate(MutationDTO mutationDTO) {
        LOG.debug("Request to partially update Mutation : {}", mutationDTO);

        return mutationRepository
            .findById(mutationDTO.getIdmutation(1))
            .map(existingMutation -> {
                mutationMapper.partialUpdate(existingMutation, mutationDTO);

                return existingMutation;
            })
            .map(mutationRepository::save)
            .map(mutationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MutationDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Mutations");
        return mutationRepository.findAll(pageable).map(mutationMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<MutationDTO> findOne(Integer id) {
        LOG.debug("Request to get Mutation : {}", id);
        return mutationRepository.findById(id).map(mutationMapper::toDto);
    }

    @Override
    public void delete(Integer id) {
        LOG.debug("Request to delete Mutation : {}", id);
        mutationRepository.deleteById(id);
    }

    @Override
    public List<MutationDTO> getMutationsByAdresseId(Integer adresseId) {
        LOG.debug("Request to get Mutations by Adresse ID : {}", adresseId);
        return mutationRepository.findByAdresseId(adresseId).stream().map(mutationMapper::toDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MutationDTO> searchMutations(String novoieStr, String voie) {
        // Early return if both inputs are empty
        if ((novoieStr == null || novoieStr.trim().isEmpty()) && (voie == null || voie.trim().isEmpty())) {
            return Collections.emptyList();
        }

        // Parse number and complement in one pass
        final Integer novoie;
        final String btq;
        {
            Integer parsedNovoie = null;
            String parsedBtq = null;

            if (novoieStr != null && !novoieStr.trim().isEmpty()) {
                String trimmed = novoieStr.trim();
                int i = 0;
                while (i < trimmed.length() && Character.isDigit(trimmed.charAt(i))) {
                    i++;
                }
                if (i > 0) {
                    try {
                        parsedNovoie = Integer.parseInt(trimmed.substring(0, i));
                        if (i < trimmed.length()) {
                            String complement = trimmed.substring(i).toUpperCase();
                            if (complement.equals("B") || complement.equals("BIS")) {
                                parsedBtq = "BIS";
                            } else if (complement.equals("T") || complement.equals("TER")) {
                                parsedBtq = "TER";
                            } else {
                                parsedBtq = complement;
                            }
                        }
                    } catch (NumberFormatException ignored) {
                        // Keep null values
                    }
                }
            }
            novoie = parsedNovoie;
            btq = parsedBtq;
        }

        // Process voie more efficiently
        final String typvoie;
        final String voieRestante;
        {
            String foundTypvoie = null;
            String foundVoieRestante = null;

            if (voie != null && !voie.trim().isEmpty()) {
                String voieTrimmed = voie.trim().toUpperCase();

                for (Map.Entry<String, String> entry : TYPE_VOIE_MAPPING.entrySet()) {
                    String typeVoieKey = entry.getKey();
                    if (voieTrimmed.startsWith(typeVoieKey)) {
                        foundTypvoie = entry.getValue();
                        foundVoieRestante = voieTrimmed.substring(typeVoieKey.length()).trim();
                        break;
                    }
                }

                if (foundTypvoie == null && voieTrimmed.contains(" ")) {
                    String firstWord = voieTrimmed.split(" ", 2)[0];
                    foundTypvoie = TYPE_VOIE_MAPPING.getOrDefault(firstWord, firstWord);
                    foundVoieRestante = voieTrimmed.substring(firstWord.length()).trim();
                }
            }

            typvoie = foundTypvoie;
            voieRestante = foundVoieRestante;
        }

        // Use a Set to ensure uniqueness of mutations
        Set<Mutation> uniqueMutations = new HashSet<>();
        boolean hasMorePages = true;
        int pageNumber = 0;
        int pageSize = 100;

        while (hasMorePages) {
            Pageable pageable = PageRequest.of(pageNumber, pageSize);
            Page<Adresse> addressPage = adresseRepository.findAll(
                (root, query, cb) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (novoie != null) {
                        predicates.add(cb.equal(root.get("novoie"), novoie));
                    }
                    if (btq != null) {
                        predicates.add(cb.equal(root.get("btq"), btq));
                    }
                    if (typvoie != null) {
                        predicates.add(cb.equal(cb.upper(root.get("typvoie")), typvoie));
                    }
                    if (voieRestante != null && !voieRestante.isEmpty()) {
                        predicates.add(cb.like(cb.upper(root.get("voie")), "%" + voieRestante + "%"));
                    }

                    return cb.and(predicates.toArray(new Predicate[0]));
                },
                pageable
            );

            // Process addresses and collect unique mutations
            for (Adresse adresse : addressPage.getContent()) {
                // Add mutations from adresseLocals
                if (adresse.getAdresseLocals() != null) {
                    adresse
                        .getAdresseLocals()
                        .stream()
                        .map(AdresseLocal::getMutation)
                        .filter(Objects::nonNull)
                        .forEach(uniqueMutations::add);
                }

                // Add mutations from adresseDispoparcs
                if (adresse.getAdresseDispoparcs() != null) {
                    adresse
                        .getAdresseDispoparcs()
                        .stream()
                        .map(AdresseDispoparc::getMutation)
                        .filter(Objects::nonNull)
                        .forEach(uniqueMutations::add);
                }
            }

            hasMorePages = addressPage.hasNext();
            pageNumber++;
        }

        // Convert to DTOs
        return uniqueMutations.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Cacheable(value = "streetCommuneCache", key = "#street + '|' + #commune", unless = "#result == null || #result.isEmpty()")
    public List<MutationDTO> searchMutationsByStreetAndCommune(String street, String commune) {
        if (street == null || street.trim().isEmpty() || commune == null || commune.trim().isEmpty()) {
            return Collections.emptyList();
        }

        String normalizedStreet = street.trim().toUpperCase();
        String normalizedCommune = commune.trim().toUpperCase();

        List<Adresse> addresses = adresseRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(cb.upper(root.get("voie")), normalizedStreet));
            predicates.add(cb.equal(cb.upper(root.get("commune")), normalizedCommune));
            return cb.and(predicates.toArray(new Predicate[0]));
        });

        // Use a Set to ensure uniqueness of mutations
        Set<Mutation> uniqueMutations = new HashSet<>();

        // Process addresses and collect unique mutations
        for (Adresse adresse : addresses) {
            // Add mutations from adresseLocals
            if (adresse.getAdresseLocals() != null) {
                adresse.getAdresseLocals().stream().map(AdresseLocal::getMutation).filter(Objects::nonNull).forEach(uniqueMutations::add);
            }

            // Add mutations from adresseDispoparcs
            if (adresse.getAdresseDispoparcs() != null) {
                adresse
                    .getAdresseDispoparcs()
                    .stream()
                    .map(AdresseDispoparc::getMutation)
                    .filter(Objects::nonNull)
                    .forEach(uniqueMutations::add);
            }
        }

        // Convert unique mutations to DTOs
        return uniqueMutations.stream().map(this::convertToDTO).collect(Collectors.toList());
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
        MutationDTO dto = new MutationDTO();
        dto.setIdmutation(mutation.getIdmutation());
        dto.setDatemut(mutation.getDatemut());
        dto.setValeurfonc(mutation.getValeurfonc());
        dto.setIdnatmut(mutation.getIdnatmut());
        dto.setCoddep(mutation.getCoddep());
        dto.setTerrain(mutation.getSterr());

        List<String> libtyplocList = new ArrayList<>();
        int nbpprincTotal = 0;
        List<String> addresses = new ArrayList<>();

        if (mutation.getAdresseLocals() != null) {
            for (AdresseLocal adresseLocal : mutation.getAdresseLocals()) {
                Local local = adresseLocal.getLocal();
                if (local != null) {
                    String type = local.getLibtyploc();
                    if (type != null && !type.trim().isEmpty()) {
                        libtyplocList.add(type.trim().toUpperCase());
                    }
                    if (local.getNbpprinc() != null) {
                        nbpprincTotal += local.getNbpprinc();
                    }
                }
            }

            addresses.addAll(mutation.getAdresseLocals().stream().map(al -> formatAddress(al.getAdresse())).collect(Collectors.toList()));
        }

        dto.setLibtyplocList(libtyplocList);

        if (mutation.getAdresseDispoparcs() != null) {
            List<String> dispoparcAddresses = mutation
                .getAdresseDispoparcs()
                .stream()
                .map(ad -> formatAddress(ad.getAdresse()))
                .collect(Collectors.toList());
            addresses.addAll(dispoparcAddresses);

            if (addresses.isEmpty() && mutation.getSterr() == null) {
                BigDecimal dcntsolSum = mutation.getAdresseDispoparcs().isEmpty()
                    ? BigDecimal.ZERO
                    : dispositionParcelleRepository.sumDcntsolByIddispopars(
                        mutation.getAdresseDispoparcs().stream().map(AdresseDispoparc::getIddispopar).collect(Collectors.toList())
                    );

                BigDecimal dcntagrSum = mutation.getAdresseDispoparcs().isEmpty()
                    ? BigDecimal.ZERO
                    : dispositionParcelleRepository.sumDcntagrclByIddispopars(
                        mutation.getAdresseDispoparcs().stream().map(AdresseDispoparc::getIddispopar).collect(Collectors.toList())
                    );

                dto.setTerrain(dcntagrSum.add(dcntsolSum));
            }
        }

        List<String> normalized = libtyplocList
            .stream()
            .filter(Objects::nonNull)
            .map(s -> s.trim().toUpperCase())
            .distinct()
            .collect(Collectors.toList());

        if (normalized.size() > 1) {
            dto.setLibtyplocList(Collections.singletonList("BIEN MULTIPLE"));
        } else {
            dto.setLibtyplocList(normalized);
        }

        dto.setNbpprincTotal(nbpprincTotal);
        dto.setAddresses(addresses);

        // Surface
        BigDecimal total = adresseLocalRepository.surfaceMutaion(mutation.getIdmutation().longValue());
        dto.setSurface(total != null ? total : BigDecimal.ZERO);

        return dto;
    }

    private String formatAddress(Adresse adresse) {
        return Stream.of(
            adresse.getNovoie(),
            adresse.getBtq(),
            adresse.getTypvoie(),
            adresse.getVoie(),
            adresse.getCodepostal(),
            adresse.getCommune()
        )
            .filter(Objects::nonNull)
            .map(Object::toString)
            .collect(Collectors.joining(" "));
    }

    public List<MutationDTO> getMutationsByAdresseId2(Integer idadresse) {
        // Get mutations from both sources
        List<Mutation> mutationsDispo = mutationRepository.findByAdresseDispoParcId(idadresse);

        // Combine and deduplicate
        Set<Mutation> uniqueMutations = new LinkedHashSet<>();
        uniqueMutations.addAll(mutationsDispo);

        // Calculate land sizes
        return uniqueMutations
            .stream()
            .map(mutation -> {
                // Get land size for mutations from adresse_dispoparc
                BigDecimal dcntsolSum = mutation.getAdresseDispoparcs().isEmpty()
                    ? BigDecimal.ZERO
                    : dispositionParcelleRepository.sumDcntsolByIddispopars(
                        mutation.getAdresseDispoparcs().stream().map(AdresseDispoparc::getIddispopar).collect(Collectors.toList())
                    );

                // Get land size for mutations from adresse_dispoparc
                BigDecimal dcntagrSum = mutation.getAdresseDispoparcs().isEmpty()
                    ? BigDecimal.ZERO
                    : dispositionParcelleRepository.sumDcntagrclByIddispopars(
                        mutation.getAdresseDispoparcs().stream().map(AdresseDispoparc::getIddispopar).collect(Collectors.toList())
                    );
                dcntsolSum = dcntagrSum.add(dcntsolSum);
                return convertToDTO(mutation, dcntsolSum);
            })
            .collect(Collectors.toList());
    }

    private MutationDTO convertToDTO(Mutation mutation, BigDecimal dcntsolSum) {
        MutationDTO dto = new MutationDTO();
        // Existing mappings
        dto.setIdmutation(mutation.getIdmutation());
        dto.setDatemut(mutation.getDatemut());
        dto.setValeurfonc(mutation.getValeurfonc());
        dto.setTerrain(dcntsolSum);
        if (mutation.getAdresseDispoparcs() != null) {
            dto.setAddresses(
                mutation.getAdresseDispoparcs().stream().map(al -> formatAddress(al.getAdresse())).collect(Collectors.toList())
            );
        }
        return dto;
    }
}
