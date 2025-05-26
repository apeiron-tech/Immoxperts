package com.apeiron.immoxperts.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MutationDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(MutationDTO.class);
        MutationDTO mutationDTO1 = new MutationDTO();
        mutationDTO1.setId(1L);
        MutationDTO mutationDTO2 = new MutationDTO();
        assertThat(mutationDTO1).isNotEqualTo(mutationDTO2);
        mutationDTO2.setId(mutationDTO1.getId());
        assertThat(mutationDTO1).isEqualTo(mutationDTO2);
        mutationDTO2.setId(2L);
        assertThat(mutationDTO1).isNotEqualTo(mutationDTO2);
        mutationDTO1.setId(null);
        assertThat(mutationDTO1).isNotEqualTo(mutationDTO2);
    }
}
