import { Estimation, EstimationFormData, AvmResult, EnvoiInfo } from '../types';
import { computeAvm } from '../utils/avmEngine';

function mkBien(overrides: Partial<EstimationFormData>): EstimationFormData {
  return {
    adresse: '',
    ville: '',
    code_postal: '',
    lat: 0,
    lon: 0,
    type_bien: 'appartement',
    surface: 0,
    nb_pieces: 0,
    nb_chambres: 0,
    etage: 0,
    nb_etages: 0,
    surface_terrain: 0,
    annee_construction: 0,
    dpe: 'D',
    ges: 'D',
    etat: 'bon',
    exposition: '',
    caracteristiques: [],
    description: '',
    points_forts: [],
    points_defendre: [],
    charges_mensuelles: 0,
    taxe_fonciere: 0,
    ...overrides,
  };
}

function mkAvm(data: EstimationFormData): AvmResult {
  return computeAvm(data) || {
    prix: { estimation: 0, fourchette_basse: 0, fourchette_haute: 0, prix_m2: 0, confiance: 0.5, confiance_label: 'faible' },
    loyer: { estimation: 0, fourchette_basse: 0, fourchette_haute: 0, loyer_m2: 0, rendement_brut: 0 },
    ajustements: [],
    comparables: [],
    marche_reference: { prix_m2_bas: 0, prix_m2_median: 0, prix_m2_haut: 0, ecart_vs_marche_pct: 0 },
  };
}

function mkEnvoi(
  envoyeLe: string,
  email: string,
  nom: string,
  ouvertures: Array<{ jours_apres: number; device: 'mobile' | 'desktop' | 'tablette' }> = [],
): EnvoiInfo {
  const base = new Date(envoyeLe);
  const events = ouvertures.map(o => {
    const d = new Date(base);
    d.setDate(d.getDate() + o.jours_apres);
    return { date: d.toISOString(), user_agent: o.device };
  });
  return {
    envoye_le: envoyeLe,
    email_destinataire: email,
    nom_destinataire: nom,
    objet: `Votre étude locative`,
    message: 'Bonjour, veuillez trouver ci-joint l\'étude locative pour votre bien.',
    ouvertures: events,
    derniere_ouverture: events.length ? events[events.length - 1].date : undefined,
    token_public: Math.random().toString(36).substring(2, 14),
  };
}

export const MOCK_ETUDES_LOCATIVES: Estimation[] = [
  // === Brouillons ===
  {
    id: 'etl_001',
    type: 'etude_locative',
    statut: 'brouillon',
    source: 'annonce_url',
    version: 1,
    created_at: '2026-04-22T08:00:00Z',
    updated_at: '2026-04-22T09:30:00Z',
    auteur: 'Sophie Leroy',
    client: { civilite: 'M.', nom: 'Fabre', prenom: 'Julien', email: 'j.fabre@gmail.com', telephone: '06 21 43 65 87' },
    bien: mkBien({
      adresse: '12 rue Mouffetard', ville: 'Paris', code_postal: '75005',
      lat: 48.8423, lon: 2.3498, surface: 28, nb_pieces: 1, nb_chambres: 0, etage: 3, nb_etages: 6,
      annee_construction: 1920, dpe: 'D', ges: 'D', etat: 'bon', exposition: 'Sud',
      caracteristiques: ['ascenseur'], charges_mensuelles: 90, taxe_fonciere: 650,
    }),
    avm: mkAvm(mkBien({ adresse: '12 rue Mouffetard', ville: 'Paris', code_postal: '75005', surface: 28, nb_pieces: 1, etat: 'bon', dpe: 'D', caracteristiques: ['ascenseur'], type_bien: 'appartement' })),
    valeur_retenue: null,
    photo_url: 'https://picsum.photos/seed/etl001/800/600',
  },
  {
    id: 'etl_002',
    type: 'etude_locative',
    statut: 'brouillon',
    source: 'bien_portefeuille',
    version: 1,
    created_at: '2026-04-21T13:00:00Z',
    updated_at: '2026-04-22T08:15:00Z',
    auteur: 'Sophie Leroy',
    client: { civilite: 'Mme', nom: 'Nguyen', prenom: 'Lan', email: 'lan.nguyen@outlook.fr', telephone: '07 45 89 12 36' },
    bien: mkBien({
      adresse: '8 quai Saint-Antoine', ville: 'Lyon', code_postal: '69002', lat: 45.7610, lon: 4.8317,
      surface: 55, nb_pieces: 2, nb_chambres: 1, etage: 4, nb_etages: 5,
      annee_construction: 1880, dpe: 'D', ges: 'D', etat: 'bon', exposition: 'Ouest',
      caracteristiques: ['cave', 'ascenseur'], charges_mensuelles: 150, taxe_fonciere: 820,
    }),
    avm: mkAvm(mkBien({ adresse: '8 quai Saint-Antoine', ville: 'Lyon', code_postal: '69002', surface: 55, nb_pieces: 2, etat: 'bon', dpe: 'D', caracteristiques: ['cave', 'ascenseur'], type_bien: 'appartement' })),
    valeur_retenue: null,
    photo_url: 'https://picsum.photos/seed/etl002/800/600',
  },

  // === Finalisée (loyer retenu) ===
  {
    id: 'etl_003',
    type: 'etude_locative',
    statut: 'finalisee',
    source: 'manuel',
    version: 1,
    created_at: '2026-04-18T09:00:00Z',
    updated_at: '2026-04-19T15:00:00Z',
    auteur: 'Jean Dubois',
    client: { civilite: 'M.', nom: 'Chauvet', prenom: 'Romain', email: 'r.chauvet@proton.me', telephone: '06 33 77 88 99' },
    bien: mkBien({
      adresse: '45 rue Ste-Catherine', ville: 'Bordeaux', code_postal: '33000', lat: 44.8378, lon: -0.5727,
      surface: 42, nb_pieces: 2, nb_chambres: 1, etage: 2, nb_etages: 4,
      annee_construction: 1900, dpe: 'C', ges: 'C', etat: 'bon', exposition: 'Sud',
      caracteristiques: ['cave'], points_forts: ['Hyper-centre', 'Proche tram'],
      charges_mensuelles: 110, taxe_fonciere: 780,
    }),
    avm: mkAvm(mkBien({ adresse: '45 rue Ste-Catherine', ville: 'Bordeaux', code_postal: '33000', surface: 42, nb_pieces: 2, etat: 'bon', dpe: 'C', type_bien: 'appartement' })),
    valeur_retenue: 720,
    valeur_retenue_locatif: { loyer_hc: 720, charges_mensuelles: 40, honoraires: 720 },
    photo_url: 'https://picsum.photos/seed/etl003/800/600',
  },

  // === Envoyée non ouverte ===
  {
    id: 'etl_004',
    type: 'etude_locative',
    statut: 'envoyee',
    source: 'annonce_url',
    version: 1,
    created_at: '2026-04-10T10:00:00Z',
    updated_at: '2026-04-12T14:00:00Z',
    auteur: 'Sophie Leroy',
    client: { civilite: 'Mme', nom: 'Dupuis', prenom: 'Camille', email: 'c.dupuis@gmail.com', telephone: '06 54 32 10 98' },
    bien: mkBien({
      adresse: '33 rue du Faubourg Saint-Denis', ville: 'Paris', code_postal: '75010',
      lat: 48.8730, lon: 2.3540, surface: 38, nb_pieces: 2, nb_chambres: 1, etage: 4, nb_etages: 7,
      annee_construction: 1930, dpe: 'D', ges: 'D', etat: 'refait_a_neuf', exposition: 'Est',
      caracteristiques: ['ascenseur', 'fibre'],
      points_forts: ['Refait à neuf', 'Fibre', 'Proximité gares'],
      charges_mensuelles: 140, taxe_fonciere: 620,
    }),
    avm: mkAvm(mkBien({ adresse: '33 rue du Faubourg Saint-Denis', ville: 'Paris', code_postal: '75010', surface: 38, nb_pieces: 2, etat: 'refait_a_neuf', dpe: 'D', caracteristiques: ['ascenseur'], type_bien: 'appartement' })),
    valeur_retenue: 960,
    valeur_retenue_locatif: { loyer_hc: 960, charges_mensuelles: 55, honoraires: 960 },
    envoi: mkEnvoi('2026-04-12T14:00:00Z', 'c.dupuis@gmail.com', 'Mme Camille Dupuis'),
    photo_url: 'https://picsum.photos/seed/etl004/800/600',
  },

  // === Ouverte ===
  {
    id: 'etl_005',
    type: 'etude_locative',
    statut: 'ouverte',
    source: 'estimation_rapide',
    parent_estimation_id: 'est_002',
    version: 1,
    created_at: '2026-04-05T09:00:00Z',
    updated_at: '2026-04-06T11:00:00Z',
    auteur: 'Sophie Leroy',
    client: { civilite: 'M.', nom: 'Pauli', prenom: 'Stefan', email: 's.pauli@free.fr', telephone: '07 22 33 44 55' },
    bien: mkBien({
      adresse: '45 cours de la Liberté', ville: 'Lyon', code_postal: '69003', lat: 45.7480, lon: 4.8308,
      surface: 68, nb_pieces: 3, nb_chambres: 2, etage: 4, nb_etages: 6,
      annee_construction: 1985, dpe: 'C', ges: 'C', etat: 'bon', exposition: 'Est',
      caracteristiques: ['cave', 'ascenseur', 'parking'],
      points_forts: ['Parking', 'Proche Part-Dieu'],
      charges_mensuelles: 220, taxe_fonciere: 980,
    }),
    avm: mkAvm(mkBien({ adresse: '45 cours de la Liberté', ville: 'Lyon', code_postal: '69003', surface: 68, nb_pieces: 3, etat: 'bon', dpe: 'C', caracteristiques: ['cave', 'ascenseur', 'parking'], type_bien: 'appartement' })),
    valeur_retenue: 920,
    valeur_retenue_locatif: { loyer_hc: 920, charges_mensuelles: 80, honoraires: 920 },
    envoi: mkEnvoi('2026-04-06T11:00:00Z', 's.pauli@free.fr', 'M. Stefan Pauli', [
      { jours_apres: 1, device: 'mobile' },
      { jours_apres: 3, device: 'desktop' },
    ]),
    photo_url: 'https://picsum.photos/seed/etl005/800/600',
  },

  // === Archivée ===
  {
    id: 'etl_006',
    type: 'etude_locative',
    statut: 'archivee',
    source: 'manuel',
    version: 1,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-03-01T14:00:00Z',
    auteur: 'Marc Dupont',
    client: { civilite: 'Mme', nom: 'Roux', prenom: 'Valérie', email: 'v.roux@yahoo.fr', telephone: '06 98 76 54 32' },
    bien: mkBien({
      adresse: '18 rue Solférino', ville: 'Lille', code_postal: '59800', lat: 50.6255, lon: 3.0581,
      surface: 32, nb_pieces: 1, nb_chambres: 0, etage: 2, nb_etages: 4,
      annee_construction: 1960, dpe: 'E', ges: 'E', etat: 'a_rafraichir', exposition: 'Nord',
      caracteristiques: [], charges_mensuelles: 80, taxe_fonciere: 420,
    }),
    avm: mkAvm(mkBien({ adresse: '18 rue Solférino', ville: 'Lille', code_postal: '59800', surface: 32, nb_pieces: 1, etat: 'a_rafraichir', dpe: 'E', type_bien: 'appartement' })),
    valeur_retenue: 450,
    valeur_retenue_locatif: { loyer_hc: 450, charges_mensuelles: 30, honoraires: 450 },
    photo_url: 'https://picsum.photos/seed/etl006/800/600',
  },
];
