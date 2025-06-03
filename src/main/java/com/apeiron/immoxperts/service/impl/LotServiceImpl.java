package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Lot;
import com.apeiron.immoxperts.repository.LotRepository;
import com.apeiron.immoxperts.service.LotService;
import com.apeiron.immoxperts.service.dto.LotDTO;
import com.apeiron.immoxperts.service.mapper.LotMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.apeiron.immoxperts.domain.Lot}.
 */
@Service
@Transactional
public class LotServiceImpl implements LotService {

    private static final Logger LOG = LoggerFactory.getLogger(LotServiceImpl.class);

    private final LotRepository lotRepository;

    private final LotMapper lotMapper;

    public LotServiceImpl(LotRepository lotRepository, LotMapper lotMapper) {
        this.lotRepository = lotRepository;
        this.lotMapper = lotMapper;
    }

    @Override
    public LotDTO save(LotDTO lotDTO) {
        LOG.debug("Request to save Lot : {}", lotDTO);
        Lot lot = lotMapper.toEntity(lotDTO);
        lot = lotRepository.save(lot);
        return lotMapper.toDto(lot);
    }

    @Override
    public LotDTO update(LotDTO lotDTO) {
        LOG.debug("Request to update Lot : {}", lotDTO);
        Lot lot = lotMapper.toEntity(lotDTO);
        lot = lotRepository.save(lot);
        return lotMapper.toDto(lot);
    }

    @Override
    public Optional<LotDTO> partialUpdate(LotDTO lotDTO) {
        LOG.debug("Request to partially update Lot : {}", lotDTO);

        return lotRepository
            .findById(lotDTO.getIddispolot())
            .map(existingLot -> {
                lotMapper.partialUpdate(existingLot, lotDTO);

                return existingLot;
            })
            .map(lotRepository::save)
            .map(lotMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<LotDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Lots");
        return lotRepository.findAll(pageable).map(lotMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<LotDTO> findOne(Integer iddispolot) {
        LOG.debug("Request to get Lot : {}", iddispolot);
        return lotRepository.findById(iddispolot).map(lotMapper::toDto);
    }

    @Override
    public void delete(Integer iddispolot) {
        LOG.debug("Request to delete Lot : {}", iddispolot);
        lotRepository.deleteById(iddispolot);
    }
}
