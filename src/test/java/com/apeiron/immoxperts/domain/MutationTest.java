package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.AdresseDispoparcTestSamples.*;
import static com.apeiron.immoxperts.domain.AdresseLocalTestSamples.*;
import static com.apeiron.immoxperts.domain.MutationTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class MutationTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Mutation.class);
        Mutation mutation1 = getMutationSample1();
        Mutation mutation2 = new Mutation();
        assertThat(mutation1).isNotEqualTo(mutation2);

        mutation2.setId(mutation1.getId());
        assertThat(mutation1).isEqualTo(mutation2);

        mutation2 = getMutationSample2();
        assertThat(mutation1).isNotEqualTo(mutation2);
    }

    @Test
    void adresseLocalsTest() {
        Mutation mutation = getMutationRandomSampleGenerator();
        AdresseLocal adresseLocalBack = getAdresseLocalRandomSampleGenerator();

        mutation.addAdresseLocals(adresseLocalBack);
        assertThat(mutation.getAdresseLocals()).containsOnly(adresseLocalBack);
        assertThat(adresseLocalBack.getMutation()).isEqualTo(mutation);

        mutation.removeAdresseLocals(adresseLocalBack);
        assertThat(mutation.getAdresseLocals()).doesNotContain(adresseLocalBack);
        assertThat(adresseLocalBack.getMutation()).isNull();

        mutation.adresseLocals(new HashSet<>(Set.of(adresseLocalBack)));
        assertThat(mutation.getAdresseLocals()).containsOnly(adresseLocalBack);
        assertThat(adresseLocalBack.getMutation()).isEqualTo(mutation);

        mutation.setAdresseLocals(new HashSet<>());
        assertThat(mutation.getAdresseLocals()).doesNotContain(adresseLocalBack);
        assertThat(adresseLocalBack.getMutation()).isNull();
    }

    @Test
    void adresseDispoparcsTest() {
        Mutation mutation = getMutationRandomSampleGenerator();
        AdresseDispoparc adresseDispoparcBack = getAdresseDispoparcRandomSampleGenerator();

        mutation.addAdresseDispoparcs(adresseDispoparcBack);
        assertThat(mutation.getAdresseDispoparcs()).containsOnly(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getMutation()).isEqualTo(mutation);

        mutation.removeAdresseDispoparcs(adresseDispoparcBack);
        assertThat(mutation.getAdresseDispoparcs()).doesNotContain(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getMutation()).isNull();

        mutation.adresseDispoparcs(new HashSet<>(Set.of(adresseDispoparcBack)));
        assertThat(mutation.getAdresseDispoparcs()).containsOnly(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getMutation()).isEqualTo(mutation);

        mutation.setAdresseDispoparcs(new HashSet<>());
        assertThat(mutation.getAdresseDispoparcs()).doesNotContain(adresseDispoparcBack);
        assertThat(adresseDispoparcBack.getMutation()).isNull();
    }
}
