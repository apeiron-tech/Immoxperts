package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Adresse;
import com.apeiron.immoxperts.repository.AdresseRepository;
import com.apeiron.immoxperts.service.AdresseService;
import com.apeiron.immoxperts.service.dto.AddressSearchDTO;
import com.apeiron.immoxperts.service.dto.AddressSuggestionProjection;
import com.apeiron.immoxperts.service.dto.AdresseDTO;
import com.apeiron.immoxperts.service.mapper.AdresseMapper;
import java.text.Normalizer;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.Adresse}.
 */
@Service
@Transactional
public class AdresseServiceImpl implements AdresseService {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseServiceImpl.class);

    private final AdresseRepository adresseRepository;

    private final AdresseMapper adresseMapper;

    public AdresseServiceImpl(AdresseRepository adresseRepository, AdresseMapper adresseMapper) {
        this.adresseRepository = adresseRepository;
        this.adresseMapper = adresseMapper;
    }

    /**
     * Remove accents from text for better matching
     * Example: "Résidence" -> "Residence"
     */
    private String removeAccents(String text) {
        if (text == null) {
            return null;
        }
        // Normalize to decomposed form (separate base chars from diacritics)
        String normalized = Normalizer.normalize(text, Normalizer.Form.NFD);
        // Remove all diacritical marks
        return normalized.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
    }

    /**
     * Normalize address abbreviations to full words WITHOUT accents
     * The database stores full words WITH accents, but ILIKE is accent-insensitive
     * when using the trigram indexes properly
     */
    private String normalizeAbbreviation(String token) {
        if (token == null || token.isEmpty()) {
            return token;
        }

        String upperToken = token.toUpperCase();

        // Expand abbreviations to full words (will be used with % similarity search)
        switch (upperToken) {
            // Route variants
            case "RTE":
            case "RT":
                return "Route";
            // Avenue variants
            case "AV":
            case "AVE":
            case "AVEN":
                return "Avenue";
            // Boulevard variants
            case "BD":
            case "BVD":
            case "BLVD":
            case "BOUL":
                return "Boulevard";
            // Rue variants
            case "R":
            case "RU":
                return "Rue";
            // Place variants
            case "PL":
            case "PLC":
                return "Place";
            // Résidence variants (return without accent for ILIKE matching)
            case "RES":
            case "RESID":
                return "Residence";
            // Allée variants (return without accent)
            case "ALL":
            case "AL":
                return "Allee";
            // Impasse variants
            case "IMP":
                return "Impasse";
            // Chemin variants
            case "CH":
            case "CHEM":
            case "CHE":
                return "Chemin";
            // Cours variants
            case "CRS":
            case "CR":
                return "Cours";
            // Square variants
            case "SQ":
                return "Square";
            // Promenade variants
            case "PROM":
                return "Promenade";
            // Quai variants
            case "QU":
            case "Q":
                return "Quai";
            // Lotissement variants
            case "LOT":
                return "Lotissement";
            // Hameau variants
            case "HAM":
                return "Hameau";
            // Passage variants
            case "PAS":
            case "PASS":
                return "Passage";
            // Grande variants
            case "GDE":
            case "GD":
            case "GRD":
                return "Grande";
            // Faubourg variants
            case "FG":
                return "Faubourg";
            // Montée variants
            case "MTE":
            case "NTE":
                return "Montee";
            // Esplanade variants
            case "ESP":
                return "Esplanade";
            // Domaine variants
            case "DOM":
                return "Domaine";
            // Cité variants
            case "CITE":
                return "Cite";
            // Quartier variants
            case "QUA":
                return "Quartier";
            // Centre variants
            case "CTRE":
            case "CC":
                return "Centre";
            // Voie variants
            case "VTE":
            case "VC":
            case "VOIE":
                return "Voie";
            // Escalier variants
            case "ESC":
                return "Escalier";
            // Sente variants
            case "SEN":
                return "Sente";
            // Enclave variants
            case "ENC":
                return "Enclave";
            // Rocade variants
            case "ROC":
                return "Rocade";
            // Poterne variants
            case "PTR":
                return "Poterne";
            // Port variants
            case "PRT":
                return "Port";
            // Galerie variants
            case "GAL":
                return "Galerie";
            // Zone variants
            case "ZI":
            case "ZA":
            case "ZAC":
                return "Zone";
            // Maison variants
            case "MAIS":
                return "Maison";
            // Chemin Départemental variant
            case "CD":
                return "Chemin";
            // Traverse variants
            case "TRA":
                return "Traverse";
            // Parc variant
            case "PARC":
                return "Parc";
            // Raccordement variants
            case "RAC":
                return "Raccordement";
            // Descente variants
            case "DSC":
                return "Descente";
            // Ruelle variants
            case "RPE":
            case "RLE":
                return "Ruelle";
            // Habitation variants
            case "HAB":
                return "Habitation";
            // Chevauchant variants
            case "CHV":
                return "Chevauchant";
            // Cour variants
            case "COUR":
                return "Cour";
            // Petite variants
            case "PTTE":
                return "Petite";
            // Tasse variants
            case "TSSE":
                return "Tasse";
            // Village variants
            case "VGE":
                return "Village";
            // Viaduc variants
            case "VIA":
                return "Viaduc";
            // Camp variants
            case "CAMP":
                return "Camp";
            // Clos variants
            case "CLOS":
                return "Clos";
            default:
                // If it's already a full word, remove accents
                return token;
        }
    }

    @Override
    public AdresseDTO save(AdresseDTO adresseDTO) {
        LOG.debug("Request to save Adresse : {}", adresseDTO);
        Adresse adresse = adresseMapper.toEntity(adresseDTO);
        adresse = adresseRepository.save(adresse);
        return adresseMapper.toDto(adresse);
    }

    public List<AddressSuggestionProjection> getSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of();
        }

        // Split query into tokens and filter out very short ones
        String[] tokens = query.trim().split("\\s+");
        List<String> validTokens = new java.util.ArrayList<>();

        for (String token : tokens) {
            String cleanToken = token.trim();
            // Keep tokens that are at least 1 character (numbers included)
            if (!cleanToken.isEmpty()) {
                // Normalize abbreviations (e.g., RTE -> Route, RES -> Résidence)
                String normalizedToken = normalizeAbbreviation(cleanToken);
                // Remove accents for DB matching (Résidence -> Residence)
                // ILIKE is case-insensitive but NOT accent-insensitive
                normalizedToken = removeAccents(normalizedToken);
                validTokens.add(normalizedToken);
            }
        }

        LOG.debug("Search tokens (after normalization): {}", validTokens);

        List<AddressSuggestionProjection> results;

        // If we have multiple tokens, use multi-token search
        if (validTokens.size() >= 5) {
            results = adresseRepository.findSuggestionsByFiveTokens(
                validTokens.get(0),
                validTokens.get(1),
                validTokens.get(2),
                validTokens.get(3),
                validTokens.get(4)
            );

            // If no results with 5 tokens, try with 4
            if (results.isEmpty() && validTokens.size() >= 4) {
                results = adresseRepository.findSuggestionsByFourTokens(
                    validTokens.get(0),
                    validTokens.get(1),
                    validTokens.get(2),
                    validTokens.get(3)
                );
            }

            // If no results with 4 tokens, try with 3
            if (results.isEmpty() && validTokens.size() >= 3) {
                results = adresseRepository.findSuggestionsByThreeTokens(validTokens.get(0), validTokens.get(1), validTokens.get(2));
            }
        } else if (validTokens.size() == 4) {
            results = adresseRepository.findSuggestionsByFourTokens(
                validTokens.get(0),
                validTokens.get(1),
                validTokens.get(2),
                validTokens.get(3)
            );

            // If no results with 4 tokens, try with 3
            if (results.isEmpty()) {
                results = adresseRepository.findSuggestionsByThreeTokens(validTokens.get(0), validTokens.get(1), validTokens.get(2));
            }
        } else if (validTokens.size() == 3) {
            results = adresseRepository.findSuggestionsByThreeTokens(validTokens.get(0), validTokens.get(1), validTokens.get(2));

            // If no results with 3 tokens, try with 2
            if (results.isEmpty()) {
                results = adresseRepository.findSuggestionsByTwoTokens(validTokens.get(0), validTokens.get(1));
            }
        } else if (validTokens.size() == 2) {
            results = adresseRepository.findSuggestionsByTwoTokens(validTokens.get(0), validTokens.get(1));

            // If no results with 2 tokens, try with first token only
            if (results.isEmpty()) {
                results = adresseRepository.findSuggestionsByToken(validTokens.get(0));
            }
        } else if (validTokens.size() == 1) {
            results = adresseRepository.findSuggestionsByToken(validTokens.get(0));
        } else {
            // Fallback to original method if no valid tokens
            results = adresseRepository.findSuggestions(query);
        }

        // ✅ Éliminer les doublons par idadresse et limiter à 20 résultats
        return results
            .stream()
            .collect(Collectors.toMap(AddressSuggestionProjection::getIdadresse, result -> result, (existing, replacement) -> existing))
            .values()
            .stream()
            .limit(20)
            .collect(Collectors.toList());
    }

    @Override
    public AdresseDTO update(AdresseDTO adresseDTO) {
        LOG.debug("Request to update Adresse : {}", adresseDTO);
        Adresse adresse = adresseMapper.toEntity(adresseDTO);
        adresse = adresseRepository.save(adresse);
        return adresseMapper.toDto(adresse);
    }

    @Override
    public Optional<AdresseDTO> partialUpdate(AdresseDTO adresseDTO) {
        LOG.debug("Request to partially update Adresse : {}", adresseDTO);

        return adresseRepository
            .findById(adresseDTO.getIdadresse())
            .map(existingAdresse -> {
                adresseMapper.partialUpdate(existingAdresse, adresseDTO);

                return existingAdresse;
            })
            .map(adresseRepository::save)
            .map(adresseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdresseDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Adresses");
        return adresseRepository.findAll(pageable).map(adresseMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdresseDTO> findOne(Integer id) {
        LOG.debug("Request to get Adresse : {}", id);
        return adresseRepository.findById(id).map(adresseMapper::toDto);
    }

    @Override
    public void delete(Integer id) {
        LOG.debug("Request to delete Adresse : {}", id);
        adresseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdresseDTO> searchAddresses(AddressSearchDTO searchDTO) {
        LOG.debug("Request to search Adresses with criteria : {}", searchDTO);
        return adresseRepository
            .findBySearchCriteria(searchDTO.getVoie(), searchDTO.getCommune(), searchDTO.getCodepostal())
            .stream()
            .map(adresseMapper::toDto)
            .collect(Collectors.toList());
    }
}
