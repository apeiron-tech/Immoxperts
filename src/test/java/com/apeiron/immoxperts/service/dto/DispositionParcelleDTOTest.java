package com.apeiron.immoxperts.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DispositionParcelleDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(DispositionParcelleDTO.class);
        DispositionParcelleDTO dispositionParcelleDTO1 = new DispositionParcelleDTO();
        dispositionParcelleDTO1.setId(1L);
        DispositionParcelleDTO dispositionParcelleDTO2 = new DispositionParcelleDTO();
        assertThat(dispositionParcelleDTO1).isNotEqualTo(dispositionParcelleDTO2);
        dispositionParcelleDTO2.setId(dispositionParcelleDTO1.getId());
        assertThat(dispositionParcelleDTO1).isEqualTo(dispositionParcelleDTO2);
        dispositionParcelleDTO2.setId(2L);
        assertThat(dispositionParcelleDTO1).isNotEqualTo(dispositionParcelleDTO2);
        dispositionParcelleDTO1.setId(null);
        assertThat(dispositionParcelleDTO1).isNotEqualTo(dispositionParcelleDTO2);
    }
}
