import { ScenarioInvest } from '../types';

export function computeMensualite(
  capital: number,
  tauxAnnuel: number,
  dureeAnnees: number,
  assurancePct = 0.36
): number {
  if (capital <= 0 || dureeAnnees <= 0) return 0;
  const n = dureeAnnees * 12;
  const r = tauxAnnuel / 100 / 12;
  if (r === 0) return capital / n;
  const mens = (capital * r) / (1 - Math.pow(1 + r, -n));
  const assMensuelle = (capital * (assurancePct / 100)) / 12;
  return mens + assMensuelle;
}

export function recomputeScenario(s: ScenarioInvest): ScenarioInvest {
  const a = s.assumptions;
  const f = s.financing;

  const prixTotal = a.prix_achat + a.frais_acquisition + a.travaux + a.ameublement;

  const mensualite = f.achat_cash
    ? 0
    : computeMensualite(f.montant_emprunte, f.taux, f.duree_annees, f.assurance_taux);

  const loyerAnnuel = a.loyer_mensuel_hc * 12;
  const vacancePerte = a.loyer_mensuel_hc * a.vacance_mois_par_an;
  const chargesAnn = a.charges_non_recup * 12;
  const gestion = loyerAnnuel * (a.gestion_locative_pct / 100);
  const gli = loyerAnnuel * (a.gli_pct / 100);
  const tf = a.taxe_fonciere;

  const revenuNet = loyerAnnuel - vacancePerte - chargesAnn - gestion - gli - tf;
  const mensualiteAnn = mensualite * 12;

  const cashflowAvantImpotAn = revenuNet - mensualiteAnn;
  const cashflowAvantImpotMensuel = cashflowAvantImpotAn / 12;

  const rendementBrut = prixTotal > 0 ? (loyerAnnuel / prixTotal) * 100 : 0;
  const rendementNet = prixTotal > 0 ? (revenuNet / prixTotal) * 100 : 0;

  // Fiscalité simplifiée (mock selon régime)
  const impotAnnuel = estimerImpot(s, revenuNet);
  const cashflowApresImpotAn = cashflowAvantImpotAn - impotAnnuel;
  const cashflowApresImpotMensuel = cashflowApresImpotAn / 12;

  const rendementNetNet = prixTotal > 0 ? ((revenuNet - impotAnnuel) / prixTotal) * 100 : 0;

  // Cash-on-cash : cash flow net / apport
  const apportTotal = f.apport + (f.achat_cash ? 0 : 0);
  const cashOnCash = apportTotal > 0 ? (cashflowApresImpotAn / apportTotal) * 100 : 0;

  // DSCR : revenus nets / service dette
  const dscr = mensualiteAnn > 0 ? revenuNet / mensualiteAnn : 99;

  // Effort mensuel (= |cashflow| si négatif, 0 sinon)
  const effortMensuel = cashflowApresImpotMensuel < 0 ? -cashflowApresImpotMensuel : 0;

  // TRI 10 ans approximation : rendement net + revalorisation prix
  const tri10 = rendementNetNet + a.revalorisation_prix_annuelle;

  // Patrimoine net à 10 ans (approximation)
  const valeurFuture = a.prix_achat * Math.pow(1 + a.revalorisation_prix_annuelle / 100, 10);
  const capitalRembourse = f.montant_emprunte * 0.35; // approx sur 10 ans / 20 ans
  const patrimoineNet = valeurFuture - (f.montant_emprunte - capitalRembourse) + cashflowApresImpotAn * 10;

  return {
    ...s,
    results: {
      mensualite: Math.round(mensualite),
      prix_total_projet: Math.round(prixTotal),
      rendement_brut: Number(rendementBrut.toFixed(2)),
      rendement_net: Number(rendementNet.toFixed(2)),
      rendement_net_net: Number(rendementNetNet.toFixed(2)),
      cash_on_cash: Number(cashOnCash.toFixed(2)),
      cashflow_avant_impot_mensuel: Math.round(cashflowAvantImpotMensuel),
      cashflow_apres_impot_mensuel: Math.round(cashflowApresImpotMensuel),
      tri_10_ans: Number(tri10.toFixed(1)),
      dscr: Number(dscr.toFixed(2)),
      effort_mensuel: Math.round(effortMensuel),
      impot_annuel: Math.round(impotAnnuel),
      patrimoine_net_10ans: Math.round(patrimoineNet),
    },
  };
}

export function estimerImpot(s: ScenarioInvest, revenuNet: number): number {
  const tmi = s.tmi / 100;
  const cs = 0.172; // CSG/CRDS
  switch (s.fiscal_regime) {
    case 'micro_foncier': {
      const abattement = 0.3;
      const base = revenuNet * (1 - abattement);
      return Math.max(0, base * (tmi + cs));
    }
    case 'reel_foncier': {
      return Math.max(0, revenuNet * (tmi + cs));
    }
    case 'lmnp_micro': {
      const abattement = 0.5;
      const baseBIC = revenuNet * (1 - abattement);
      return Math.max(0, baseBIC * (tmi + 0.172));
    }
    case 'lmnp_reel': {
      // Avec amortissements, base fiscale très réduite
      const amortissements = s.assumptions.prix_achat * 0.03;
      const base = Math.max(0, revenuNet - amortissements);
      return base * (tmi + 0.172);
    }
    case 'lmp':
    case 'sci_ir':
    case 'sci_is':
    case 'courte_duree':
      // Mockés V1 : approximation simple
      return Math.max(0, revenuNet * tmi * 0.6);
    default:
      return 0;
  }
}

export function formatEuro(n: number, suffix = ''): string {
  if (n === 0) return '0 €' + suffix;
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  if (abs >= 1000000) return `${sign}${(abs / 1000000).toFixed(2)} M€${suffix}`;
  if (abs >= 10000) return `${sign}${(abs / 1000).toFixed(0)} k€${suffix}`;
  return `${sign}${Math.round(abs).toLocaleString('fr-FR')} €${suffix}`;
}

export function formatPrice(n: number): string {
  return Math.round(n).toLocaleString('fr-FR') + ' €';
}

export function formatPct(n: number, digits = 1): string {
  return `${n.toFixed(digits)} %`;
}

export function formatSigned(n: number, unit = '€'): string {
  const sign = n >= 0 ? '+' : '';
  return `${sign}${Math.round(n).toLocaleString('fr-FR')} ${unit}`;
}
