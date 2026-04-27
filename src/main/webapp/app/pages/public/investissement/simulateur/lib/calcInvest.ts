/**
 * Moteur de calcul du simulateur d'investissement public.
 * 100 % côté client. Régimes V1 : micro-foncier (nu) et micro-BIC (meublé).
 */

export type SimulatorInput = {
  prix: number;
  fraisAcquisitionPct: 0.075 | 0.03;
  travaux: number;
  ville: string | null;
  modeLocation: 'nu' | 'meuble';
  loyerMensuel: number;
  chargesNonRecuperables: number;
  taxeFonciere: number;
  vacanceMoisParAn: number;
  apport: number;
  tauxPct: number;
  dureeAnnees: 10 | 15 | 20 | 25;
  assurancePct: number;
  tmi: 0 | 11 | 30 | 41 | 45;
};

export type SimulatorResult = {
  rendementBrutPct: number;
  rendementNetPct: number;
  cashflowMensuelAvantImpot: number;
  effortMensuelApresImpot: number;
  mensualite: number;
  coutTotalCredit: number;
  impotAnnuel: number;
  montantEmprunte: number;
  dureeMois: number;
};

export const PRELEVEMENTS_SOCIAUX_PCT = 17.2;

const ABATTEMENT_MICRO: Record<SimulatorInput['modeLocation'], number> = {
  nu: 0.3,
  meuble: 0.5,
};

export function calcInvest(input: SimulatorInput): SimulatorResult {
  const baseInvestissement = input.prix * (1 + input.fraisAcquisitionPct) + input.travaux;
  const montantEmprunteRaw = input.prix + input.travaux + input.prix * input.fraisAcquisitionPct - input.apport;
  const montantEmprunte = Math.max(0, montantEmprunteRaw);

  const dureeMois = input.dureeAnnees * 12;
  const tauxMensuel = input.tauxPct / 100 / 12;
  const tauxAssuranceM = input.assurancePct / 100 / 12;

  let mensualite = 0;
  if (montantEmprunte > 0) {
    const denom = 1 - Math.pow(1 + tauxMensuel, -dureeMois);
    const mensualiteHorsAss = tauxMensuel === 0 ? montantEmprunte / dureeMois : (montantEmprunte * tauxMensuel) / denom;
    const mensualiteAssurance = montantEmprunte * tauxAssuranceM;
    mensualite = mensualiteHorsAss + mensualiteAssurance;
  }

  const coutTotalCredit = montantEmprunte > 0 ? mensualite * dureeMois - montantEmprunte : 0;

  const loyersAnnuelsEncaisses = input.loyerMensuel * (12 - input.vacanceMoisParAn);
  const chargesAnnuelles = input.chargesNonRecuperables * 12 + input.taxeFonciere;

  const rendementBrutPct = baseInvestissement > 0 ? ((input.loyerMensuel * 12) / baseInvestissement) * 100 : 0;
  const rendementNetPct = baseInvestissement > 0 ? ((loyersAnnuelsEncaisses - chargesAnnuelles) / baseInvestissement) * 100 : 0;

  const cashflowMensuelAvantImpot = loyersAnnuelsEncaisses / 12 - mensualite - input.chargesNonRecuperables - input.taxeFonciere / 12;

  const abattement = ABATTEMENT_MICRO[input.modeLocation];
  const revenuImposable = loyersAnnuelsEncaisses * (1 - abattement);
  const impotAnnuel = revenuImposable * (input.tmi / 100 + PRELEVEMENTS_SOCIAUX_PCT / 100);

  const effortMensuelApresImpot = cashflowMensuelAvantImpot - impotAnnuel / 12;

  return {
    rendementBrutPct,
    rendementNetPct,
    cashflowMensuelAvantImpot,
    effortMensuelApresImpot,
    mensualite,
    coutTotalCredit,
    impotAnnuel,
    montantEmprunte,
    dureeMois,
  };
}

export type WarningKey = 'micro_threshold' | 'effort_high' | 'rendement_low' | 'rendement_high';

export const WARNING_MESSAGES: Record<WarningKey, string> = {
  micro_threshold:
    'Vos recettes dépassent le seuil micro. Le régime réel est souvent plus avantageux. Un conseiller peut vous orienter.',
  effort_high: 'Cet effort mensuel élevé mérite une revue avec un conseiller.',
  rendement_low: 'Rendement brut inférieur à 3 %. Un projet plus patrimonial que locatif.',
  rendement_high: 'Rendement brut élevé. Vérifiez la cohérence du loyer saisi avec le marché local.',
};

const SEUIL_MICRO = 77_700;

/**
 * Renvoie au plus 2 warnings, dans l'ordre de priorité défini §6.9.
 */
export function buildWarnings(input: SimulatorInput, result: SimulatorResult): WarningKey[] {
  const loyersAnnuelsEncaisses = input.loyerMensuel * (12 - input.vacanceMoisParAn);
  const ordered: WarningKey[] = [];

  if (loyersAnnuelsEncaisses > SEUIL_MICRO) ordered.push('micro_threshold');
  if (result.effortMensuelApresImpot < -1000) ordered.push('effort_high');
  if (result.rendementBrutPct < 3) ordered.push('rendement_low');
  if (result.rendementBrutPct > 10) ordered.push('rendement_high');

  return ordered.slice(0, 2);
}

export const DEFAULT_SIMULATOR_INPUT: SimulatorInput = {
  prix: 200_000,
  fraisAcquisitionPct: 0.075,
  travaux: 0,
  ville: null,
  modeLocation: 'nu',
  loyerMensuel: 800,
  chargesNonRecuperables: 50,
  taxeFonciere: 800,
  vacanceMoisParAn: 0.5,
  apport: 40_000,
  tauxPct: 3.8,
  dureeAnnees: 25,
  assurancePct: 0.3,
  tmi: 30,
};
