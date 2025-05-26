package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.AdresseLocalTestSamples.*;
import static com.apeiron.immoxperts.domain.AdresseTestSamples.*;
import static com.apeiron.immoxperts.domain.MutationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AdresseLocalTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AdresseLocal.class);
        AdresseLocal adresseLocal1 = getAdresseLocalSample1();
        AdresseLocal adresseLocal2 = new AdresseLocal();
        assertThat(adresseLocal1).isNotEqualTo(adresseLocal2);

        adresseLocal2.setId(adresseLocal1.getId());
        assertThat(adresseLocal1).isEqualTo(adresseLocal2);

        adresseLocal2 = getAdresseLocalSample2();
        assertThat(adresseLocal1).isNotEqualTo(adresseLocal2);
    }

    @Test
    void mutationTest() {
        AdresseLocal adresseLocal = getAdresseLocalRandomSampleGenerator();
        Mutation mutationBack = getMutationRandomSampleGenerator();

        adresseLocal.setMutation(mutationBack);
        assertThat(adresseLocal.getMutation()).isEqualTo(mutationBack);

        adresseLocal.mutation(null);
        assertThat(adresseLocal.getMutation()).isNull();
    }

    @Test
    void adresseTest() {
        AdresseLocal adresseLocal = getAdresseLocalRandomSampleGenerator();
        Adresse adresseBack = getAdresseRandomSampleGenerator();

        adresseLocal.setAdresse(adresseBack);
        assertThat(adresseLocal.getAdresse()).isEqualTo(adresseBack);

        adresseLocal.adresse(null);
        assertThat(adresseLocal.getAdresse()).isNull();
    }
}
