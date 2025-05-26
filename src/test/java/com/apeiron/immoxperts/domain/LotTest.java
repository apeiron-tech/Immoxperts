package com.apeiron.immoxperts.domain;

import static com.apeiron.immoxperts.domain.LotTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.apeiron.immoxperts.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class LotTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lot.class);
        Lot lot1 = getLotSample1();
        Lot lot2 = new Lot();
        assertThat(lot1).isNotEqualTo(lot2);

        lot2.setId(lot1.getId());
        assertThat(lot1).isEqualTo(lot2);

        lot2 = getLotSample2();
        assertThat(lot1).isNotEqualTo(lot2);
    }
}
