import type { DataAnchorSnapshot, ModuleStatus } from '../types';

export const MOCK_MODULE_STATUS: ModuleStatus = {
  observatoire: 'active',
  estimation: 'active',
  leads: 'active',
  veille: 'active',
  investissement: 'active',
};

export const MOCK_SNAPSHOT: DataAnchorSnapshot = {
  bien: {
    type: 'Appartement T3',
    surface: 65,
    pieces: 3,
    etage: 4,
    annee_construction: 1962,
    dpe: 'D',
    ges: 'D',
    prix: 720000,
    prix_m2: 11077,
    adresse: '8 avenue Suffren',
    code_postal: '75015',
    ville: 'Paris 15e',
    mandat_type: 'exclusif',
  },
  dvf: {
    mediane_quartier_m2: 11080,
    mediane_iris_m2: 11240,
    nb_ventes_12m: 47,
    evolution_12m_pct: -3.2,
    ecart_bien_vs_mediane_pct: 0,
    derniere_vente_meme_immeuble: { date: '2025-09-12', prix_m2: 11250 },
  },
  dpe: {
    note_actuelle: 'D',
    consommation_kwh: 215,
    classification: 'standard',
    cout_chauffage_estime_annuel: 1480,
    note_projetee_apres_renovation: 'C',
  },
  observatoire: {
    tension_score: 7.8,
    delai_vente_moyen_jours: 38,
    ratio_baisse_prix: 0.18,
    types_demandes_dominants: ['T2', 'T3'],
    profil_demographique_dominant: 'Jeunes actifs cadres',
    transports_score: 92,
    commerces_score: 88,
    ecoles_score: 81,
  },
  estimation: {
    avm_estimation: 718000,
    avm_fourchette_basse: 695000,
    avm_fourchette_haute: 745000,
    avm_indice_confiance: 87,
    nb_comparables_utilises: 12,
    plus_value_potentielle: 38000,
    rendement_locatif_estime: 3.4,
  },
  profondeur_solvable: {
    nb_foyers_solvables_zone: 1240,
    pct_solvables_vs_zone: 14.2,
    fourchette_revenu_cible: { min: 4800, max: 7200 },
    distance_max_recherche_km: 25,
  },
  concurrence: {
    nb_biens_similaires_zone: 8,
    prix_moyen_concurrence_m2: 11320,
    delai_moyen_concurrence: 41,
  },
  snapshot_at: new Date().toISOString(),
  data_freshness: {
    dvf: 'mensuel',
    dpe: 'temps réel',
    observatoire: 'hebdomadaire',
    estimation: 'temps réel',
  },
};
