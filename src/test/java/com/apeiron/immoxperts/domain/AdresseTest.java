package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.AdresseDispoparcTestSamples.*;
import static com.apeiron.immoxperts.domain.AdresseLocalTestSamples.*;
import static com.apeiron.immoxperts.domain.AdresseTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AdresseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Adresse.class);
        Adresse adresse1 = getAdresseSample1();
        Adresse adresse2 = new Adresse();
        assertThat(adresse1).isNotEqualTo(adresse2);

        adresse2.setId(adresse1.getId());
        assertThat(adresse1).isEqualTo(adresse2);

        adresse2 = getAdresseSample2();
        assertThat(adresse1).isNotEqualTo(adresse2);
    }

    @Test
    void adresseLocalsTest() {
        Adresse adresse = getAdresseRandomSampleGenerator();
        AdresseLocal adresseLocalBack = getAdresseLocalRandomSampleGenerator();

        adresse.addAdresseLocals(adresseLocalBack);
        assertThat(adresse.getAdresseLocals()).containsOnly(adresseLocalBack);
        assertThat(adresseLocalBack.getAdresse()).isEqualTo(adresse);

        adresse.removeAdresseLocals(adresseLocalBack);
        assertThat(adresse.getAdresseLocals()).doesNotContain(adresseLocalBack);
        assertThat(adresseLocalBack.getAdresse()).isNull();

        adresse.adresseLocals(new HashSet<>(Set.of(adresseLocalBack)));
        assertThat(adresse.getAdresseLocals()).containsOnly(adresseLocalBack);
        assertThat(adresseLocalBack.getAdresse()).isEqualTo(adresse);

        adresse.setAdresseLocals(new HashSet<>());
        assertThat(adresse.getAdresseLocals()).doesNotContain(adresseLocalBack);
        assertThat(adresseLocalBack.getAdresse()).isNull();
    }

    @Test
    void adresseDispoparcsTest() {
        Adresse adresse = getAdresseRandomSampleGenerator();
        AdresseDispoparc adresseDispoparcBack = getAdresseDispoparcRandomSampleGenerator();

        adresse.addAdresseDispoparcs(adresseDispoparcBack);
        assertThat(adresse.getAdresseDispoparcs()).containsOnly(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getAdresse()).isEqualTo(adresse);

        adresse.removeAdresseDispoparcs(adresseDispoparcBack);
        assertThat(adresse.getAdresseDispoparcs()).doesNotContain(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getAdresse()).isNull();

        adresse.adresseDispoparcs(new HashSet<>(Set.of(adresseDispoparcBack)));
        assertThat(adresse.getAdresseDispoparcs()).containsOnly(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getAdresse()).isEqualTo(adresse);

        adresse.setAdresseDispoparcs(new HashSet<>());
        assertThat(adresse.getAdresseDispoparcs()).doesNotContain(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getAdresse()).isNull();
    }
}
