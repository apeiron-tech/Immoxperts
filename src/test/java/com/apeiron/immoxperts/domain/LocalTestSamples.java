package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LocalTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Local getLocalSample1() {
        return new Local().id(1L).iddispoloc(1).idmutation(1).libtyploc("libtyploc1").nbpprinc(1);
    }

    public static Local getLocalSample2() {
        return new Local().id(2L).iddispoloc(2).idmutation(2).libtyploc("libtyploc2").nbpprinc(2);
    }

    public static Local getLocalRandomSampleGenerator() {
        return new Local()
            .id(longCount.incrementAndGet())
            .iddispoloc(intCount.incrementAndGet())
            .idmutation(intCount.incrementAndGet())
            .libtyploc(UUID.randomUUID().toString())
            .nbpprinc(intCount.incrementAndGet());
    }
}
