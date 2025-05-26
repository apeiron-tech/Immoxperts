package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class AdresseLocalTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static AdresseLocal getAdresseLocalSample1() {
        return new AdresseLocal().id(1).coddep("coddep1");
    }

    public static AdresseLocal getAdresseLocalSample2() {
        return new AdresseLocal().id(2).coddep("coddep2");
    }

    public static AdresseLocal getAdresseLocalRandomSampleGenerator() {
        return new AdresseLocal().id(intCount.incrementAndGet()).coddep(UUID.randomUUID().toString());
    }
}
