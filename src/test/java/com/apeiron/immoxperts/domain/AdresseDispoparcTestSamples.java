package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;

public class AdresseDispoparcTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static AdresseDispoparc getAdresseDispoparcSample1() {
        return new AdresseDispoparc().id(1);
    }

    public static AdresseDispoparc getAdresseDispoparcSample2() {
        return new AdresseDispoparc().id(2);
    }

    public static AdresseDispoparc getAdresseDispoparcRandomSampleGenerator() {
        return new AdresseDispoparc().id(intCount.incrementAndGet());
    }
}
