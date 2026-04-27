import { Estimation } from 'app/features/estimation/types';
import { computeAvm } from 'app/features/estimation/utils/avmEngine';

const bien = {
  adresse: '16 rue du Hameau',
  ville: 'Paris',
  code_postal: '75015',
  lat: 48.8323,
  lon: 2.2893,
  type_bien: 'appartement' as const,
  surface: 52,
  nb_pieces: 3,
  nb_chambres: 2,
  etage: 4,
  nb_etages: 7,
  surface_terrain: 0,
  annee_construction: 1962,
  dpe: 'D' as const,
  ges: 'D' as const,
  etat: 'bon' as const,
  exposition: 'Sud',
  caracteristiques: ['balcon', 'cave', 'ascenseur'],
  description:
    "Bel appartement traversant 3 pièces au 4e étage avec ascenseur. Lumineux, exposition sud. Cuisine séparée équipée, séjour donnant sur balcon, deux chambres calmes côté cour. Cave en sous-sol.",
  points_forts: [
    'Emplacement recherché à 5 min du métro Convention',
    'Lumière exceptionnelle (traversant sud)',
    'Balcon de 4 m² avec vue dégagée',
    'Immeuble bien tenu avec gardien',
  ],
  points_defendre: [
    'DPE D — performance énergétique correcte mais pas premium',
    'Cuisine à rafraîchir',
    'Pas de parking',
  ],
  charges_mensuelles: 220,
  taxe_fonciere: 1450,
};

export const DEMO_ESTIMATION: Estimation = {
  id: 'demo_est_001',
  type: 'avis_valeur',
  statut: 'brouillon',
  source: 'estimation_rapide',
  created_at: '2026-04-20T10:30:00Z',
  updated_at: '2026-04-22T14:15:00Z',
  auteur: 'Sophie Leroy',
  client: {
    civilite: 'M.',
    nom: 'Prévost',
    prenom: 'Antoine',
    email: 'antoine.prevost@example.com',
    telephone: '06 78 91 23 45',
  },
  bien,
  avm: computeAvm(bien),
  valeur_retenue: null,
  photo_url: 'https://picsum.photos/seed/demo_avis/800/500',
};
