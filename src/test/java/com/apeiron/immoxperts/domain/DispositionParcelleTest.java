package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.DispositionParcelleTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DispositionParcelleTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(DispositionParcelle.class);
        DispositionParcelle dispositionParcelle1 = getDispositionParcelleSample1();
        DispositionParcelle dispositionParcelle2 = new DispositionParcelle();
        assertThat(dispositionParcelle1).isNotEqualTo(dispositionParcelle2);

        dispositionParcelle2.setId(dispositionParcelle1.getId());
        assertThat(dispositionParcelle1).isEqualTo(dispositionParcelle2);

        dispositionParcelle2 = getDispositionParcelleSample2();
        assertThat(dispositionParcelle1).isNotEqualTo(dispositionParcelle2);
    }
}
