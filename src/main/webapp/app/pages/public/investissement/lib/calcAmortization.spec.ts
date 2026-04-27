import { amortizationMonthly } from './calcAmortization';

describe('amortizationMonthly', () => {
  it('calcule la mensualité standard 200 000 € à 3,8 % sur 25 ans', () => {
    const m = amortizationMonthly(200_000, 3.8, 25);
    // valeur de référence : ~1033,71 €
    expect(m).toBeCloseTo(1033.71, 1);
  });

  it("retourne 0 quand le montant emprunté est nul ou négatif (apport couvre tout)", () => {
    expect(amortizationMonthly(0, 3.8, 25)).toBe(0);
    expect(amortizationMonthly(-1000, 3.8, 25)).toBe(0);
  });

  it('gère un taux à 0 % (mensualité = capital / mois)', () => {
    const m = amortizationMonthly(120_000, 0, 10);
    expect(m).toBeCloseTo(120_000 / 120, 2);
  });

  it('augmente avec le taux pour une même durée', () => {
    const a = amortizationMonthly(200_000, 2, 25);
    const b = amortizationMonthly(200_000, 5, 25);
    expect(b).toBeGreaterThan(a);
  });

  it('décroît avec une durée plus longue à taux et capital constants', () => {
    const a = amortizationMonthly(200_000, 3.8, 15);
    const b = amortizationMonthly(200_000, 3.8, 25);
    expect(b).toBeLessThan(a);
  });
});
