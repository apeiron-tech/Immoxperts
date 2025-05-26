package com.apeiron.immoxperts.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AdresseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Adresse getAdresseSample1() {
        return new Adresse()
            .id(1L)
            .idadresse(1)
            .novoie(1)
            .btq("btq1")
            .typvoie("typvoie1")
            .codvoie("codvoie1")
            .voie("voie1")
            .codepostal("codepostal1")
            .commune("commune1")
            .coddep("coddep1");
    }

    public static Adresse getAdresseSample2() {
        return new Adresse()
            .id(2L)
            .idadresse(2)
            .novoie(2)
            .btq("btq2")
            .typvoie("typvoie2")
            .codvoie("codvoie2")
            .voie("voie2")
            .codepostal("codepostal2")
            .commune("commune2")
            .coddep("coddep2");
    }

    public static Adresse getAdresseRandomSampleGenerator() {
        return new Adresse()
            .id(longCount.incrementAndGet())
            .idadresse(intCount.incrementAndGet())
            .novoie(intCount.incrementAndGet())
            .btq(UUID.randomUUID().toString())
            .typvoie(UUID.randomUUID().toString())
            .codvoie(UUID.randomUUID().toString())
            .voie(UUID.randomUUID().toString())
            .codepostal(UUID.randomUUID().toString())
            .commune(UUID.randomUUID().toString())
            .coddep(UUID.randomUUID().toString());
    }
}
