package com.apeiron.immoxperts.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdresseDispoparcDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdresseDispoparcDTO.class);
        AdresseDispoparcDTO adresseDispoparcDTO1 = new AdresseDispoparcDTO();
        adresseDispoparcDTO1.setId(1);
        AdresseDispoparcDTO adresseDispoparcDTO2 = new AdresseDispoparcDTO();
        assertThat(adresseDispoparcDTO1).isNotEqualTo(adresseDispoparcDTO2);
        adresseDispoparcDTO2.setId(adresseDispoparcDTO1.getId());
        assertThat(adresseDispoparcDTO1).isEqualTo(adresseDispoparcDTO2);
        adresseDispoparcDTO2.setId(2);
        assertThat(adresseDispoparcDTO1).isNotEqualTo(adresseDispoparcDTO2);
        adresseDispoparcDTO1.setId(null);
        assertThat(adresseDispoparcDTO1).isNotEqualTo(adresseDispoparcDTO2);
    }
}
