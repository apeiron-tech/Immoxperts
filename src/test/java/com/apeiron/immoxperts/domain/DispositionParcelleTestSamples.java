package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class DispositionParcelleTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static DispositionParcelle getDispositionParcelleSample1() {
        return new DispositionParcelle().id(1L).iddispopar(1);
    }

    public static DispositionParcelle getDispositionParcelleSample2() {
        return new DispositionParcelle().id(2L).iddispopar(2);
    }

    public static DispositionParcelle getDispositionParcelleRandomSampleGenerator() {
        return new DispositionParcelle().id(longCount.incrementAndGet()).iddispopar(intCount.incrementAndGet());
    }
}
