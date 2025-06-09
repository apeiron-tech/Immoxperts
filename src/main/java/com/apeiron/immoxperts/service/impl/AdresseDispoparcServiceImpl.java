package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.AdresseDispoparc;
import com.apeiron.immoxperts.repository.AdresseDispoparcRepository;
import com.apeiron.immoxperts.service.AdresseDispoparcService;
import com.apeiron.immoxperts.service.dto.AdresseDispoparcDTO;
import com.apeiron.immoxperts.service.mapper.AdresseDispoparcMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.AdresseDispoparc}.
 */
@Service
@Transactional
public class AdresseDispoparcServiceImpl implements AdresseDispoparcService {

    private static final Logger LOG = LoggerFactory.getLogger(AdresseDispoparcServiceImpl.class);

    private final AdresseDispoparcRepository adresseDispoparcRepository;

    private final AdresseDispoparcMapper adresseDispoparcMapper;

    public AdresseDispoparcServiceImpl(
        AdresseDispoparcRepository adresseDispoparcRepository,
        AdresseDispoparcMapper adresseDispoparcMapper
    ) {
        this.adresseDispoparcRepository = adresseDispoparcRepository;
        this.adresseDispoparcMapper = adresseDispoparcMapper;
    }

    @Override
    public AdresseDispoparcDTO save(AdresseDispoparcDTO adresseDispoparcDTO) {
        LOG.debug("Request to save AdresseDispoparc : {}", adresseDispoparcDTO);
        AdresseDispoparc adresseDispoparc = adresseDispoparcMapper.toEntity(adresseDispoparcDTO);
        adresseDispoparc = adresseDispoparcRepository.save(adresseDispoparc);
        return adresseDispoparcMapper.toDto(adresseDispoparc);
    }

    @Override
    public AdresseDispoparcDTO update(AdresseDispoparcDTO adresseDispoparcDTO) {
        LOG.debug("Request to update AdresseDispoparc : {}", adresseDispoparcDTO);
        AdresseDispoparc adresseDispoparc = adresseDispoparcMapper.toEntity(adresseDispoparcDTO);
        adresseDispoparc = adresseDispoparcRepository.save(adresseDispoparc);
        return adresseDispoparcMapper.toDto(adresseDispoparc);
    }

    @Override
    public Optional<AdresseDispoparcDTO> partialUpdate(AdresseDispoparcDTO adresseDispoparcDTO) {
        LOG.debug("Request to partially update AdresseDispoparc : {}", adresseDispoparcDTO);

        return adresseDispoparcRepository
            .findById(adresseDispoparcDTO.getIddispopar())
            .map(existingAdresseDispoparc -> {
                adresseDispoparcMapper.partialUpdate(existingAdresseDispoparc, adresseDispoparcDTO);

                return existingAdresseDispoparc;
            })
            .map(adresseDispoparcRepository::save)
            .map(adresseDispoparcMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AdresseDispoparcDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all AdresseDispoparcs");
        return adresseDispoparcRepository.findAll(pageable).map(adresseDispoparcMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AdresseDispoparcDTO> findOne(Integer id) {
        LOG.debug("Request to get AdresseDispoparc : {}", id);
        return adresseDispoparcRepository.findById(id).map(adresseDispoparcMapper::toDto);
    }

    @Override
    public void delete(Integer id) {
        LOG.debug("Request to delete AdresseDispoparc : {}", id);
        adresseDispoparcRepository.deleteById(id);
    }
}
