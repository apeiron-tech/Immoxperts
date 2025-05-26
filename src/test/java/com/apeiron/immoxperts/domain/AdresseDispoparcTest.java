package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.AdresseDispoparcTestSamples.*;
import static com.apeiron.immoxperts.domain.AdresseTestSamples.*;
import static com.apeiron.immoxperts.domain.MutationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdresseDispoparcTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdresseDispoparc.class);
        AdresseDispoparc adresseDispoparc1 = getAdresseDispoparcSample1();
        AdresseDispoparc adresseDispoparc2 = new AdresseDispoparc();
        assertThat(adresseDispoparc1).isNotEqualTo(adresseDispoparc2);

        adresseDispoparc2.setId(adresseDispoparc1.getId());
        assertThat(adresseDispoparc1).isEqualTo(adresseDispoparc2);

        adresseDispoparc2 = getAdresseDispoparcSample2();
        assertThat(adresseDispoparc1).isNotEqualTo(adresseDispoparc2);
    }

    @Test
    void mutationTest() {
        AdresseDispoparc adresseDispoparc = getAdresseDispoparcRandomSampleGenerator();
        Mutation mutationBack = getMutationRandomSampleGenerator();

        adresseDispoparc.setMutation(mutationBack);
        assertThat(adresseDispoparc.getMutation()).isEqualTo(mutationBack);

        adresseDispoparc.mutation(null);
        assertThat(adresseDispoparc.getMutation()).isNull();
    }

    @Test
    void adresseTest() {
        AdresseDispoparc adresseDispoparc = getAdresseDispoparcRandomSampleGenerator();
        Adresse adresseBack = getAdresseRandomSampleGenerator();

        adresseDispoparc.setAdresse(adresseBack);
        assertThat(adresseDispoparc.getAdresse()).isEqualTo(adresseBack);

        adresseDispoparc.adresse(null);
        assertThat(adresseDispoparc.getAdresse()).isNull();
    }
}
