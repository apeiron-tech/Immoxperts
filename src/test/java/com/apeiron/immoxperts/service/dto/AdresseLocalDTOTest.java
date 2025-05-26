package com.apeiron.immoxperts.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdresseLocalDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdresseLocalDTO.class);
        AdresseLocalDTO adresseLocalDTO1 = new AdresseLocalDTO();
        adresseLocalDTO1.setId(1);
        AdresseLocalDTO adresseLocalDTO2 = new AdresseLocalDTO();
        assertThat(adresseLocalDTO1).isNotEqualTo(adresseLocalDTO2);
        adresseLocalDTO2.setId(adresseLocalDTO1.getId());
        assertThat(adresseLocalDTO1).isEqualTo(adresseLocalDTO2);
        adresseLocalDTO2.setId(2);
        assertThat(adresseLocalDTO1).isNotEqualTo(adresseLocalDTO2);
        adresseLocalDTO1.setId(null);
        assertThat(adresseLocalDTO1).isNotEqualTo(adresseLocalDTO2);
    }
}
