package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Local;
import com.apeiron.immoxperts.repository.LocalRepository;
import com.apeiron.immoxperts.service.LocalService;
import com.apeiron.immoxperts.service.dto.LocalDTO;
import com.apeiron.immoxperts.service.mapper.LocalMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.Local}.
 */
@Service
@Transactional
public class LocalServiceImpl implements LocalService {

    private static final Logger LOG = LoggerFactory.getLogger(LocalServiceImpl.class);

    private final LocalRepository localRepository;

    private final LocalMapper localMapper;

    public LocalServiceImpl(LocalRepository localRepository, LocalMapper localMapper) {
        this.localRepository = localRepository;
        this.localMapper = localMapper;
    }

    @Override
    public LocalDTO save(LocalDTO localDTO) {
        LOG.debug("Request to save Local : {}", localDTO);
        Local local = localMapper.toEntity(localDTO);
        local = localRepository.save(local);
        return localMapper.toDto(local);
    }

    @Override
    public LocalDTO update(LocalDTO localDTO) {
        LOG.debug("Request to update Local : {}", localDTO);
        Local local = localMapper.toEntity(localDTO);
        local = localRepository.save(local);
        return localMapper.toDto(local);
    }

    @Override
    public Optional<LocalDTO> partialUpdate(LocalDTO localDTO) {
        LOG.debug("Request to partially update Local : {}", localDTO);

        return localRepository
            .findById(localDTO.getId())
            .map(existingLocal -> {
                localMapper.partialUpdate(existingLocal, localDTO);

                return existingLocal;
            })
            .map(localRepository::save)
            .map(localMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LocalDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Locals");
        return localRepository.findAll(pageable).map(localMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LocalDTO> findOne(Long id) {
        LOG.debug("Request to get Local : {}", id);
        return localRepository.findById(id).map(localMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Local : {}", id);
        localRepository.deleteById(id);
    }
}
