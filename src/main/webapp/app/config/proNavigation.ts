import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Activity,
  Home,
  Radar,
  Calculator,
  TrendingUp,
  LineChart,
  Eye,
  Users,
  Code2,
  Settings,
  Clapperboard,
} from 'lucide-react';
import { proRoutes } from './proRoutes';
import type { FeatureFlag } from './featureFlags';

export type UserRole = 'ROLE_OWNER' | 'ROLE_ADMIN' | 'ROLE_AGENT' | 'ROLE_VIEWER';

export interface ProNavItem {
  label: string;
  to: string;
  icon?: LucideIcon;
  children?: ProNavItem[];
  defaultTo?: string;
  roles?: UserRole[];
  featureFlag?: FeatureFlag;
  badgeKey?: string;
  ignoresZone?: boolean;
  description?: string;
}

export const proNavigation: ProNavItem[] = [
  {
    label: 'Tableau de bord',
    to: proRoutes.tableauDeBord,
    icon: LayoutDashboard,
    ignoresZone: true,
    description: "Vue d'ensemble de votre activité.",
  },
  {
    label: 'Mon activité',
    to: proRoutes.activite.root,
    icon: Activity,
    defaultTo: proRoutes.activite.pilotage,
    description: 'Pipeline commercial, leads, performance.',
    children: [
      { label: 'Pilotage commercial', to: proRoutes.activite.pilotage, description: 'Vue pipeline et actions à mener.' },
      { label: 'Leads', to: proRoutes.activite.leads, description: 'Qualifier et suivre vos leads.' },
      { label: 'Performance', to: proRoutes.activite.performance, description: 'Indicateurs business personnels.' },
    ],
  },
  {
    label: 'Biens immobiliers',
    to: proRoutes.biens.root,
    icon: Home,
    defaultTo: proRoutes.biens.portefeuille,
    description: 'Portefeuille, annonces et historique DVF.',
    children: [
      { label: 'Portefeuille', to: proRoutes.biens.portefeuille },
      { label: 'Annonces', to: proRoutes.biens.annonces },
      { label: 'Biens vendus (DVF)', to: proRoutes.biens.dvf },
    ],
  },
  {
    label: 'Prospection',
    to: proRoutes.prospection.root,
    icon: Radar,
    defaultTo: proRoutes.prospection.radar,
    description: 'Détecter les opportunités de mandats.',
    children: [
      { label: 'Radar', to: proRoutes.prospection.radar },
      { label: 'Signaux DVF', to: proRoutes.prospection.signauxDvf },
      { label: 'Signaux DPE', to: proRoutes.prospection.signauxDpe },
    ],
  },
  {
    label: 'Widgets publics',
    to: proRoutes.widgets.root,
    icon: Code2,
    featureFlag: 'widgets',
    ignoresZone: true,
    description: 'Widgets embarqués sur site partenaire.',
    children: [
      { label: "Vue d'ensemble", to: proRoutes.widgets.root },
      { label: 'Estimation vendeur', to: proRoutes.widgets.estimationVendeur },
    ],
  },
  {
    label: 'Studio Marketing',
    to: proRoutes.studioMarketing.root,
    icon: Clapperboard,
    featureFlag: 'studio-marketing',
    defaultTo: proRoutes.studioMarketing.vueDensemble,
    description: 'Cockpit acquisition · diffusion · conversion · attribution.',
    children: [
      { label: "Vue d'ensemble", to: proRoutes.studioMarketing.vueDensemble, description: "Cockpit quotidien." },
      { label: 'Mes annonces', to: proRoutes.studioMarketing.annonces, description: 'File de travail des biens à commercialiser.' },
      { label: 'Atelier', to: proRoutes.studioMarketing.atelier, description: 'Générer un kit marketing data-driven.' },
      { label: 'Diffusion & campagnes', to: proRoutes.studioMarketing.diffusion, description: 'Calendrier, publications, campagnes locales.' },
      { label: 'Interactions', to: proRoutes.studioMarketing.interactions, description: 'Inbox des réponses marketing.' },
      { label: 'Performance', to: proRoutes.studioMarketing.performance, description: 'Funnel post → mandat.' },
      { label: 'Bibliothèque', to: proRoutes.studioMarketing.bibliotheque, description: 'Kits, assets et templates réutilisables.' },
    ],
  },
  {
    label: 'Estimation',
    to: proRoutes.estimation.root,
    icon: Calculator,
    defaultTo: proRoutes.estimation.rapide,
    description: 'Estimations rapides, avis de valeur et expertises RICS/TEGOVA.',
    children: [
      { label: 'Estimation rapide', to: proRoutes.estimation.rapide },
      { label: 'Avis de valeur', to: proRoutes.estimation.avisValeur },
      { label: 'Étude locative', to: proRoutes.estimation.etudeLocative },
      { label: 'Expert', to: proRoutes.estimation.expert, description: 'Rapports d\'expertise conformes RICS / TEGOVA.' },
    ],
  },
  {
    label: 'Investissement',
    to: proRoutes.investissement.root,
    icon: TrendingUp,
    featureFlag: 'investissement',
    defaultTo: proRoutes.investissement.opportunites,
    description: 'Opportunités et dossiers investisseur.',
    children: [
      { label: 'Opportunités', to: proRoutes.investissement.opportunites },
      { label: 'Dossiers', to: proRoutes.investissement.dossiers },
    ],
  },
  {
    label: 'Observatoire',
    to: proRoutes.observatoire.root,
    icon: LineChart,
    featureFlag: 'observatoire',
    defaultTo: proRoutes.observatoire.marche,
    description: 'Analyse de marché par zone.',
    children: [
      { label: 'Marché', to: proRoutes.observatoire.marche },
      { label: 'Tension', to: proRoutes.observatoire.tension },
      { label: 'Contexte local', to: proRoutes.observatoire.contexteLocal },
    ],
  },
  {
    label: 'Veille',
    to: proRoutes.veille.root,
    icon: Eye,
    featureFlag: 'veille',
    defaultTo: proRoutes.veille.notifications,
    description: 'Alertes, notifications et biens suivis.',
    children: [
      { label: 'Mes alertes', to: proRoutes.veille.alertes },
      { label: 'Notifications', to: proRoutes.veille.notifications, badgeKey: 'notifications-unread' },
      { label: 'Biens suivis', to: proRoutes.veille.biensSuivis },
      { label: 'Agences concurrentes', to: proRoutes.veille.agencesConcurrentes },
    ],
  },
  {
    label: 'Équipe',
    to: proRoutes.equipe.root,
    icon: Users,
    featureFlag: 'equipe',
    roles: ['ROLE_OWNER', 'ROLE_ADMIN'],
    defaultTo: proRoutes.equipe.vue,
    description: 'Pilotage de votre équipe.',
    children: [
      { label: 'Vue équipe', to: proRoutes.equipe.vue },
      { label: 'Activité commerciale', to: proRoutes.equipe.activite },
      { label: 'Portefeuille & dossiers', to: proRoutes.equipe.portefeuille },
      { label: 'Agenda & charge', to: proRoutes.equipe.agenda },
      { label: 'Performance business', to: proRoutes.equipe.performance },
    ],
  },
];

export const proSettingsNav: ProNavItem = {
  label: 'Paramètres',
  to: proRoutes.parametres.root,
  icon: Settings,
  ignoresZone: true,
};

export const findProNavItem = (path: string): ProNavItem | undefined => {
  for (const section of proNavigation) {
    if (section.to === path) return section;
    if (section.children) {
      const match = section.children.find(c => c.to === path);
      if (match) return match;
    }
  }
  return undefined;
};

export const findProNavParent = (path: string): ProNavItem | undefined =>
  proNavigation.find(section => section.children?.some(c => c.to === path));
