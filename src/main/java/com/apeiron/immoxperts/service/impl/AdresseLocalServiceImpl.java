package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.AdresseLocal;
import com.apeiron.immoxperts.repository.AdresseLocalRepository;
import com.apeiron.immoxperts.service.AdresseLocalService;
import com.apeiron.immoxperts.service.dto.AdresseLocalDTO;
import com.apeiron.immoxperts.service.mapper.AdresseLocalMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.AdresseLocal}.
 */
@Service
@Transactional
public class AdresseLocalServiceImpl implements AdresseLocalService {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseLocalServiceImpl.class);

    private final AdresseLocalRepository adresseLocalRepository;

    private final AdresseLocalMapper adresseLocalMapper;

    public AdresseLocalServiceImpl(AdresseLocalRepository adresseLocalRepository, AdresseLocalMapper adresseLocalMapper) {
        this.adresseLocalRepository = adresseLocalRepository;
        this.adresseLocalMapper = adresseLocalMapper;
    }

    @Override
    public AdresseLocalDTO save(AdresseLocalDTO adresseLocalDTO) {
        LOG.debug("Request to save AdresseLocal : {}", adresseLocalDTO);
        AdresseLocal adresseLocal = adresseLocalMapper.toEntity(adresseLocalDTO);
        adresseLocal = adresseLocalRepository.save(adresseLocal);
        return adresseLocalMapper.toDto(adresseLocal);
    }

    @Override
    public AdresseLocalDTO update(AdresseLocalDTO adresseLocalDTO) {
        LOG.debug("Request to update AdresseLocal : {}", adresseLocalDTO);
        AdresseLocal adresseLocal = adresseLocalMapper.toEntity(adresseLocalDTO);
        adresseLocal = adresseLocalRepository.save(adresseLocal);
        return adresseLocalMapper.toDto(adresseLocal);
    }

    @Override
    public Optional<AdresseLocalDTO> partialUpdate(AdresseLocalDTO adresseLocalDTO) {
        LOG.debug("Request to partially update AdresseLocal : {}", adresseLocalDTO);

        return adresseLocalRepository
            .findById(adresseLocalDTO.getId())
            .map(existingAdresseLocal -> {
                adresseLocalMapper.partialUpdate(existingAdresseLocal, adresseLocalDTO);

                return existingAdresseLocal;
            })
            .map(adresseLocalRepository::save)
            .map(adresseLocalMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdresseLocalDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AdresseLocals");
        return adresseLocalRepository.findAll(pageable).map(adresseLocalMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdresseLocalDTO> findOne(Integer id) {
        LOG.debug("Request to get AdresseLocal : {}", id);
        return adresseLocalRepository.findById(id).map(adresseLocalMapper::toDto);
    }

    @Override
    public void delete(Integer id) {
        LOG.debug("Request to delete AdresseLocal : {}", id);
        adresseLocalRepository.deleteById(id);
    }
}
