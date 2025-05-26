package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.DispositionParcelle;
import com.apeiron.immoxperts.repository.DispositionParcelleRepository;
import com.apeiron.immoxperts.service.DispositionParcelleService;
import com.apeiron.immoxperts.service.dto.DispositionParcelleDTO;
import com.apeiron.immoxperts.service.mapper.DispositionParcelleMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.DispositionParcelle}.
 */
@Service
@Transactional
public class DispositionParcelleServiceImpl implements DispositionParcelleService {

    private static final Logger LOG = LoggerFactory.getLogger(DispositionParcelleServiceImpl.class);

    private final DispositionParcelleRepository dispositionParcelleRepository;

    private final DispositionParcelleMapper dispositionParcelleMapper;

    public DispositionParcelleServiceImpl(
        DispositionParcelleRepository dispositionParcelleRepository,
        DispositionParcelleMapper dispositionParcelleMapper
    ) {
        this.dispositionParcelleRepository = dispositionParcelleRepository;
        this.dispositionParcelleMapper = dispositionParcelleMapper;
    }

    @Override
    public DispositionParcelleDTO save(DispositionParcelleDTO dispositionParcelleDTO) {
        LOG.debug("Request to save DispositionParcelle : {}", dispositionParcelleDTO);
        DispositionParcelle dispositionParcelle = dispositionParcelleMapper.toEntity(dispositionParcelleDTO);
        dispositionParcelle = dispositionParcelleRepository.save(dispositionParcelle);
        return dispositionParcelleMapper.toDto(dispositionParcelle);
    }

    @Override
    public DispositionParcelleDTO update(DispositionParcelleDTO dispositionParcelleDTO) {
        LOG.debug("Request to update DispositionParcelle : {}", dispositionParcelleDTO);
        DispositionParcelle dispositionParcelle = dispositionParcelleMapper.toEntity(dispositionParcelleDTO);
        dispositionParcelle = dispositionParcelleRepository.save(dispositionParcelle);
        return dispositionParcelleMapper.toDto(dispositionParcelle);
    }

    @Override
    public Optional<DispositionParcelleDTO> partialUpdate(DispositionParcelleDTO dispositionParcelleDTO) {
        LOG.debug("Request to partially update DispositionParcelle : {}", dispositionParcelleDTO);

        return dispositionParcelleRepository
            .findById(dispositionParcelleDTO.getId())
            .map(existingDispositionParcelle -> {
                dispositionParcelleMapper.partialUpdate(existingDispositionParcelle, dispositionParcelleDTO);

                return existingDispositionParcelle;
            })
            .map(dispositionParcelleRepository::save)
            .map(dispositionParcelleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DispositionParcelleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all DispositionParcelles");
        return dispositionParcelleRepository.findAll(pageable).map(dispositionParcelleMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<DispositionParcelleDTO> findOne(Long id) {
        LOG.debug("Request to get DispositionParcelle : {}", id);
        return dispositionParcelleRepository.findById(id).map(dispositionParcelleMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete DispositionParcelle : {}", id);
        dispositionParcelleRepository.deleteById(id);
    }
}
