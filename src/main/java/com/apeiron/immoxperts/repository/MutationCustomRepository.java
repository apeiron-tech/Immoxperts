package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.service.dto.CommuneStatsDTO;

public interface MutationCustomRepository {
    CommuneStatsDTO getStatsByCommune(String commune);
}
