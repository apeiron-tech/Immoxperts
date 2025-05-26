package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class LotTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Lot getLotSample1() {
        return new Lot().id(1L).iddispolot(1);
    }

    public static Lot getLotSample2() {
        return new Lot().id(2L).iddispolot(2);
    }

    public static Lot getLotRandomSampleGenerator() {
        return new Lot().id(longCount.incrementAndGet()).iddispolot(intCount.incrementAndGet());
    }
}
