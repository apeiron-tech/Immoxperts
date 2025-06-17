package com.apeiron.immoxperts.service.impl;

import com.apeiron.immoxperts.domain.Mutation;
import com.apeiron.immoxperts.repository.MutationSearchMaterializedViewRepository;
import com.apeiron.immoxperts.service.MutationSearchService;
import com.apeiron.immoxperts.service.dto.MutationDTO;
import com.apeiron.immoxperts.service.mapper.MutationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class MutationSearchServiceImpl implements MutationSearchService {

    private static final Logger LOG = LoggerFactory.getLogger(MutationSearchServiceImpl.class);

    private final MutationSearchMaterializedViewRepository mutationSearchMaterializedViewRepository;
    private final MutationMapper mutationMapper;

    public MutationSearchServiceImpl(
        MutationSearchMaterializedViewRepository mutationSearchMaterializedViewRepository,
        MutationMapper mutationMapper
    ) {
        this.mutationSearchMaterializedViewRepository = mutationSearchMaterializedViewRepository;
        this.mutationMapper = mutationMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MutationDTO> searchMutations(
        Integer novoie,
        String btq,
        String typvoie,
        String voie,
        String commune,
        String codepostal,
        Pageable pageable
    ) {
        LOG.debug(
            "Request to search mutations using materialized view: novoie={}, btq={}, typvoie={}, voie={}, commune={}, codepostal={}",
            novoie,
            btq,
            typvoie,
            voie,
            commune,
            codepostal
        );

        Page<Mutation> mutations = mutationSearchMaterializedViewRepository.searchMutations(
            novoie,
            btq,
            typvoie,
            voie,
            commune,
            codepostal,
            pageable
        );

        return mutations.map(mutationMapper::toDto);
    }

    @Override
    public void refreshMaterializedView() {
        LOG.debug("Request to refresh mutation search materialized view");
        mutationSearchMaterializedViewRepository.refreshMaterializedView();
    }
}
