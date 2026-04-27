import { ScenarioInvest } from '../types';
import { MOCK_OPPORTUNITES } from './opportunites';
import { recomputeScenario } from '../utils/finances';

function defaultScenario(oppId: string, prix: number, surface: number, loyer: number, index = 1): ScenarioInvest {
  const apport = Math.round(prix * 0.2);
  const frais = Math.round(prix * 0.075);
  const base: ScenarioInvest = {
    scenario_id: `${oppId}_s${index}`,
    opportunity_id: oppId,
    label: index === 1 ? 'LMNP réel — apport 20%' : `Scénario ${index}`,
    is_default: index === 1,
    occupancy_mode: 'meuble',
    fiscal_regime: 'lmnp_reel',
    holding_structure: 'nom_propre',
    millesime_fiscal: 2026,
    financing: {
      achat_cash: false,
      apport,
      montant_emprunte: prix + frais - apport,
      taux: 3.6,
      duree_annees: 20,
      assurance_taux: 0.36,
      differe_mois: 0,
      frais_bancaires: 1500,
      travaux_finances: false,
      mobilier_finance: false,
    },
    assumptions: {
      prix_achat: prix,
      frais_acquisition: frais,
      travaux: 0,
      ameublement: 8000,
      loyer_mensuel_hc: loyer,
      charges_recuperables: 50,
      charges_non_recup: 60,
      taxe_fonciere: 1200,
      vacance_mois_par_an: 0.3,
      gestion_locative_pct: 0,
      gli_pct: 3,
      revalorisation_loyer_annuelle: 1.5,
      revalorisation_prix_annuelle: 2,
      horizon_annees: 10,
    },
    tmi: 30,
    nombre_parts: 2,
    results: {
      mensualite: 0,
      prix_total_projet: 0,
      rendement_brut: 0,
      rendement_net: 0,
      rendement_net_net: 0,
      cash_on_cash: 0,
      cashflow_avant_impot_mensuel: 0,
      cashflow_apres_impot_mensuel: 0,
      tri_10_ans: 0,
      dscr: 0,
      effort_mensuel: 0,
      impot_annuel: 0,
      patrimoine_net_10ans: 0,
    },
    status: 'valide',
  };
  return recomputeScenario(base);
}

export const MOCK_SCENARIOS: ScenarioInvest[] = MOCK_OPPORTUNITES.flatMap(opp => {
  const first = defaultScenario(opp.opportunity_id, opp.prix_affiche, opp.bien.surface, opp.loyer_estime, 1);
  // Quelques opps ont un scénario alternatif "Nu réel"
  if (parseInt(opp.opportunity_id.slice(4), 10) % 3 === 0) {
    const alt = defaultScenario(opp.opportunity_id, opp.prix_affiche, opp.bien.surface, opp.loyer_estime * 0.92, 2);
    alt.label = 'Nu réel — apport 25%';
    alt.fiscal_regime = 'reel_foncier';
    alt.occupancy_mode = 'nu';
    alt.financing.apport = Math.round(opp.prix_affiche * 0.25);
    alt.financing.montant_emprunte = opp.prix_affiche * 1.075 - alt.financing.apport;
    alt.is_default = false;
    return [first, recomputeScenario(alt)];
  }
  return [first];
});

export function getScenarioById(id: string): ScenarioInvest | undefined {
  return MOCK_SCENARIOS.find(s => s.scenario_id === id);
}

export function getScenariosForOpp(oppId: string): ScenarioInvest[] {
  return MOCK_SCENARIOS.filter(s => s.opportunity_id === oppId);
}

export function getDefaultScenarioForOpp(oppId: string): ScenarioInvest | undefined {
  return MOCK_SCENARIOS.find(s => s.opportunity_id === oppId && s.is_default);
}
