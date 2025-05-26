package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class MutationTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Mutation getMutationSample1() {
        return new Mutation().id(1L).idmutation(1).idnatmut(1).coddep("coddep1");
    }

    public static Mutation getMutationSample2() {
        return new Mutation().id(2L).idmutation(2).idnatmut(2).coddep("coddep2");
    }

    public static Mutation getMutationRandomSampleGenerator() {
        return new Mutation()
            .id(longCount.incrementAndGet())
            .idmutation(intCount.incrementAndGet())
            .idnatmut(intCount.incrementAndGet())
            .coddep(UUID.randomUUID().toString());
    }
}
