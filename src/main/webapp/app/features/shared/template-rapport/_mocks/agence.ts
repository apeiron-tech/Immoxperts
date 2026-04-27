import { AgenceInfo, ConseillerInfo } from '../types';

export const PROPSIGHT_AGENCE: AgenceInfo = {
  nom: 'Propsight Demo',
  adresse: '15 avenue de la Grande Armée',
  code_postal: '75016',
  ville: 'Paris',
  siret: '123 456 789 00012',
  carte_t: 'CPI 7501 2024 000 000 001',
  telephone: '01 49 48 47 46',
  email: 'contact@propsight.fr',
  site: 'www.propsight.fr',
  description:
    "Propsight accompagne acquéreurs, vendeurs et investisseurs avec une expertise data-driven du marché immobilier français. Nos rapports s'appuient sur les données DVF, INSEE, BPE et un moteur d'estimation propriétaire.",
  logo_url: '',
  couleur_primaire: '#6D4DE8',
};

export const DEMO_CONSEILLER: ConseillerInfo = {
  prenom: 'Sophie',
  nom: 'Leroy',
  titre: 'Conseillère immobilière senior',
  telephone: '06 12 34 56 78',
  email: 'sophie.leroy@propsight.fr',
  photo_url: 'https://i.pravatar.cc/150?img=47',
  bio:
    "10 ans d'expérience sur le 15e arrondissement parisien. Spécialisée dans l'estimation et la vente d'appartements familiaux. Approche data + connaissance terrain.",
};
