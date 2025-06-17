package com.apeiron.immoxperts.repository;

import com.apeiron.immoxperts.service.dto.MutationSearchDTO;
import java.util.List;

public interface MutationSearchRepository {
    List<MutationSearchDTO> fastSearch(Integer novoie, String btq, String typvoie, String voieRestante, int limit);
}
