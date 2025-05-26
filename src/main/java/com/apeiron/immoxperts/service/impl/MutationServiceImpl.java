package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.repository.MutationRepository;
import com.apeiron.immoxperts.service.MutationService;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.mapper.MutationMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
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

    private final MutationRepository mutationRepository;

    private final MutationMapper mutationMapper;

    public MutationServiceImpl(MutationRepository mutationRepository, MutationMapper mutationMapper) {
        this.mutationRepository = mutationRepository;
        this.mutationMapper = mutationMapper;
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
            .findById(mutationDTO.getId())
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
    public Optional<MutationDTO> findOne(Long id) {
        LOG.debug("Request to get Mutation : {}", id);
        return mutationRepository.findById(id).map(mutationMapper::toDto);
    }

    @Override
    public void delete(Long id) {
        LOG.debug("Request to delete Mutation : {}", id);
        mutationRepository.deleteById(id);
    }
}
