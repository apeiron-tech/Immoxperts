import { calcInvest, buildWarnings, DEFAULT_SIMULATOR_INPUT, SimulatorInput } from './calcInvest';

const make = (over: Partial<SimulatorInput> = {}): SimulatorInput => ({ ...DEFAULT_SIMULATOR_INPUT, ...over });

describe('calcInvest — mensualité', () => {
  it('calcule la mensualité de référence (200 000 €, 3,8 %, 25 ans, assurance 0,3 %)', () => {
    const r = calcInvest(
      make({
        prix: 200_000,
        fraisAcquisitionPct: 0.075,
        travaux: 0,
        apport: 0,
        tauxPct: 3.8,
        dureeAnnees: 25,
        assurancePct: 0.3,
      }),
    );
    // capital emprunté : 200_000 * 1.075 = 215_000
    // mensualité hors assurance ~1108,53 €, assurance ~53,75 €/mois → ~1162 €
    expect(r.montantEmprunte).toBeCloseTo(215_000, 0);
    expect(r.mensualite).toBeGreaterThan(1110);
    expect(r.mensualite).toBeLessThan(1175);
  });

  it('apport >= prix + frais + travaux ⇒ mensualité 0, coût crédit 0, montant emprunté 0', () => {
    const r = calcInvest(make({ prix: 100_000, fraisAcquisitionPct: 0.075, travaux: 5_000, apport: 200_000 }));
    expect(r.montantEmprunte).toBe(0);
    expect(r.mensualite).toBe(0);
    expect(r.coutTotalCredit).toBe(0);
  });
});

describe('calcInvest — rendements', () => {
  it('rendement brut sans travaux', () => {
    const r = calcInvest(make({ prix: 200_000, fraisAcquisitionPct: 0.075, travaux: 0, loyerMensuel: 800 }));
    // base 215_000, loyers annuels 9 600, brut ~ 4,465 %
    expect(r.rendementBrutPct).toBeCloseTo((9_600 / 215_000) * 100, 4);
  });

  it('rendement brut avec travaux', () => {
    const r = calcInvest(make({ prix: 200_000, fraisAcquisitionPct: 0.075, travaux: 30_000, loyerMensuel: 800 }));
    // base 215_000 + 30_000 = 245_000, brut ~ 3,918 %
    expect(r.rendementBrutPct).toBeCloseTo((9_600 / 245_000) * 100, 4);
  });
});

describe('calcInvest — impôt micro', () => {
  const baseLoyers = 1_000;

  it('micro-foncier (nu) à TMI 30 %', () => {
    const r = calcInvest(make({ modeLocation: 'nu', loyerMensuel: baseLoyers, vacanceMoisParAn: 0, tmi: 30 }));
    const loyersAnnuels = baseLoyers * 12;
    const expected = loyersAnnuels * 0.7 * (0.3 + 0.172);
    expect(r.impotAnnuel).toBeCloseTo(expected, 1);
  });

  it('micro-BIC (meublé) à TMI 30 %', () => {
    const r = calcInvest(make({ modeLocation: 'meuble', loyerMensuel: baseLoyers, vacanceMoisParAn: 0, tmi: 30 }));
    const loyersAnnuels = baseLoyers * 12;
    const expected = loyersAnnuels * 0.5 * (0.3 + 0.172);
    expect(r.impotAnnuel).toBeCloseTo(expected, 1);
  });

  it.each([0, 11, 30, 41, 45] as const)('micro-foncier à TMI %i %', tmi => {
    const r = calcInvest(make({ modeLocation: 'nu', loyerMensuel: baseLoyers, vacanceMoisParAn: 0, tmi }));
    const expected = baseLoyers * 12 * 0.7 * (tmi / 100 + 0.172);
    expect(r.impotAnnuel).toBeCloseTo(expected, 1);
  });
});

describe('buildWarnings', () => {
  it('déclenche le warning seuil micro à 77 701 € annuels', () => {
    // 77 701 / 12 ≈ 6 475,1 €/mois sans vacance
    const input = make({ loyerMensuel: 77_701 / 12, vacanceMoisParAn: 0 });
    const result = calcInvest(input);
    expect(buildWarnings(input, result)).toContain('micro_threshold');
  });

  it('ne déclenche pas le warning seuil micro à 77 700 € annuels', () => {
    const input = make({ loyerMensuel: 77_700 / 12, vacanceMoisParAn: 0 });
    const result = calcInvest(input);
    expect(buildWarnings(input, result)).not.toContain('micro_threshold');
  });

  it('limite à 2 warnings affichés simultanément', () => {
    // configuration extrême : très haut loyer + très bas rendement quasi impossible mais on force avec un prix énorme
    const input = make({ loyerMensuel: 7_000, prix: 5_000_000, vacanceMoisParAn: 0, apport: 0, tauxPct: 5 });
    const result = calcInvest(input);
    expect(buildWarnings(input, result).length).toBeLessThanOrEqual(2);
  });
});
