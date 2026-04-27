export const INVEST_MINI_CALC_DEFAULTS = {
  prix: 200_000,
  loyer: 800,
  apport: 40_000,
  tauxEmprunt: 3.8,
  dureeAnnees: 25,
  chargesPct: 0.08,
};

export const INVEST_MINI_CALC_LIMITS = {
  prix: { min: 50_000, max: 800_000, step: 5_000 },
  loyer: { min: 300, max: 3_500, step: 10 },
  apport: { min: 0, max: 200_000, step: 1_000 },
};
