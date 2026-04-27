// === Studio Marketing — Mocks partagés (V1) ===
// Données fictives utilisées par Vue d'ensemble, Mes annonces, Diffusion,
// Interactions, Performance et Bibliothèque. Toutes valeurs cohérentes entre
// les écrans (le même bien apparaît partout avec la même perf).

import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  PhoneCall,
  Send,
  Smartphone,
  Sparkles,
  Video,
} from 'lucide-react';

// ── Types locaux mocks ───────────────────────────────────────────

export type MarketingChannelKey =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'google_business'
  | 'meta_ads'
  | 'google_ads'
  | 'site_agence'
  | 'email'
  | 'sms'
  | 'widget';

export type MarketingPropertyStatus =
  | 'non_prepare'
  | 'a_completer'
  | 'pret_a_publier'
  | 'publie'
  | 'campagne_active'
  | 'a_relancer'
  | 'sous_performance'
  | 'archive';

export interface MarketingKpi {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'flat';
  hint?: string;
}

export interface MarketingRecommendation {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  detail: string;
  impact: string;
  cta: string;
  source: string;
  type: 'bien' | 'campagne' | 'interaction' | 'kit' | 'plan_adv';
}

export interface CampaignRow {
  id: string;
  name: string;
  bien: string;
  channel: MarketingChannelKey;
  objective: string;
  budget: number;
  spend: number;
  leads: number;
  cpl: number;
  status: 'active' | 'paused' | 'pending_review' | 'completed';
  endsIn?: string;
}

export interface InteractionRow {
  id: string;
  source:
    | 'instagram_dm'
    | 'facebook_message'
    | 'instagram_comment'
    | 'facebook_comment'
    | 'google_call'
    | 'landing_form'
    | 'email_reply'
    | 'sms_reply'
    | 'ad_lead_form';
  contactName: string;
  contactSubtitle: string;
  message: string;
  bien?: string;
  campaign?: string;
  channel: MarketingChannelKey;
  intent:
    | 'visite'
    | 'estimation'
    | 'information'
    | 'investissement'
    | 'vente'
    | 'location'
    | 'spam';
  status: 'a_traiter' | 'repondu' | 'converti_lead' | 'ignore';
  receivedAt: string;
  receivedAgo: string;
}

export interface ScheduledItem {
  id: string;
  day: 'lun' | 'mar' | 'mer' | 'jeu' | 'ven' | 'sam' | 'dim';
  hour: string;
  channel: MarketingChannelKey;
  type: 'post' | 'campagne' | 'email' | 'sms' | 'relance';
  bien: string;
  variant?: string;
}

export interface MarketingPropertyRow {
  id: string;
  bienLabel: string;
  bienSubtitle: string;
  ville: string;
  status: MarketingPropertyStatus;
  publishabilityScore: number;
  missing: string[];
  channels: MarketingChannelKey[];
  views30d: number;
  leads30d: number;
  cpl?: number;
  lastDiffusion: string;
  recommendation?: string;
  responsable: string;
}

export interface ChannelPerfRow {
  channel: MarketingChannelKey;
  impressions: number;
  clicks: number;
  ctr: number;
  interactions: number;
  leads: number;
  rdv: number;
  mandats: number;
  spend: number;
  cpl?: number;
  trend: 'up' | 'down' | 'flat';
}

export interface FunnelStep {
  id: string;
  label: string;
  value: number;
  costPerUnit?: number;
  conversion?: number;
}

export interface PublicationRow {
  id: string;
  asset: string;
  bien: string;
  channel: MarketingChannelKey;
  account: string;
  date: string;
  status: 'brouillon' | 'programme' | 'publie' | 'echec' | 'reauth';
  views?: number;
  clicks?: number;
  leads?: number;
}

export interface ConnectorRow {
  id: string;
  provider: 'meta' | 'google' | 'tiktok' | 'linkedin' | 'gbp' | 'email' | 'sms';
  label: string;
  status: 'connected' | 'needs_reauth' | 'expired' | 'disconnected';
  pages: number;
  adAccounts: number;
  expiresIn?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  type: 'kit' | 'asset' | 'template' | 'visuel' | 'plan_adv';
  channel?: MarketingChannelKey;
  bien?: string;
  used: number;
  bestOn?: string;
  perfHint?: string;
  author: string;
  updatedAt: string;
  tags: string[];
}

export interface PropertyPotential {
  id: string;
  bien: string;
  reason: string;
  channelHint: MarketingChannelKey;
  expectedImpact: string;
}

// ── Helpers ──────────────────────────────────────────────────────

export const CHANNEL_META: Record<
  MarketingChannelKey,
  { label: string; icon: LucideIcon; tone: string }
> = {
  instagram: { label: 'Instagram', icon: Instagram, tone: 'text-pink-600 bg-pink-50' },
  facebook: { label: 'Facebook', icon: Facebook, tone: 'text-blue-700 bg-blue-50' },
  linkedin: { label: 'LinkedIn', icon: Linkedin, tone: 'text-sky-700 bg-sky-50' },
  tiktok: { label: 'TikTok', icon: Video, tone: 'text-neutral-900 bg-neutral-100' },
  google_business: { label: 'Google Business', icon: Globe, tone: 'text-emerald-700 bg-emerald-50' },
  meta_ads: { label: 'Meta Ads', icon: Sparkles, tone: 'text-propsight-700 bg-propsight-50' },
  google_ads: { label: 'Google Ads', icon: Sparkles, tone: 'text-emerald-700 bg-emerald-50' },
  site_agence: { label: 'Site agence', icon: Building2, tone: 'text-neutral-700 bg-neutral-100' },
  email: { label: 'Email', icon: Mail, tone: 'text-neutral-700 bg-neutral-100' },
  sms: { label: 'SMS', icon: Smartphone, tone: 'text-neutral-700 bg-neutral-100' },
  widget: { label: 'Widget Propsight', icon: FileText, tone: 'text-propsight-700 bg-propsight-50' },
};

export const INTERACTION_SOURCE_META: Record<
  InteractionRow['source'],
  { label: string; icon: LucideIcon; channel: MarketingChannelKey }
> = {
  instagram_dm: { label: 'Instagram DM', icon: Instagram, channel: 'instagram' },
  instagram_comment: { label: 'Instagram commentaire', icon: MessageCircle, channel: 'instagram' },
  facebook_message: { label: 'Facebook message', icon: Facebook, channel: 'facebook' },
  facebook_comment: { label: 'Facebook commentaire', icon: MessageCircle, channel: 'facebook' },
  google_call: { label: 'Appel Google Business', icon: PhoneCall, channel: 'google_business' },
  landing_form: { label: 'Formulaire landing', icon: Send, channel: 'site_agence' },
  email_reply: { label: 'Réponse email', icon: Mail, channel: 'email' },
  sms_reply: { label: 'Réponse SMS', icon: Smartphone, channel: 'sms' },
  ad_lead_form: { label: 'Lead form Meta Ads', icon: Sparkles, channel: 'meta_ads' },
};

export const STATUS_META: Record<
  MarketingPropertyStatus,
  { label: string; tone: string }
> = {
  non_prepare: { label: 'Non préparé', tone: 'bg-neutral-100 text-neutral-700' },
  a_completer: { label: 'À compléter', tone: 'bg-amber-50 text-amber-700' },
  pret_a_publier: { label: 'Prêt à publier', tone: 'bg-propsight-50 text-propsight-700' },
  publie: { label: 'Publié', tone: 'bg-success-50 text-success-700' },
  campagne_active: { label: 'Campagne active', tone: 'bg-success-50 text-success-700' },
  a_relancer: { label: 'À relancer', tone: 'bg-amber-50 text-amber-700' },
  sous_performance: { label: 'Sous-performance', tone: 'bg-danger-50 text-danger-700' },
  archive: { label: 'Archivé', tone: 'bg-neutral-100 text-neutral-500' },
};

// ── KPI Vue d'ensemble ───────────────────────────────────────────

export const OVERVIEW_KPIS: MarketingKpi[] = [
  { id: 'vues', label: 'Vues totales', value: '45 632', delta: '+18 %', trend: 'up', hint: 'vs. semaine précédente' },
  { id: 'clics', label: 'Clics', value: '3 842', delta: '+12 %', trend: 'up' },
  { id: 'leads', label: 'Leads générés', value: '128', delta: '+24 %', trend: 'up' },
  { id: 'rdv', label: 'RDV planifiés', value: '32', delta: '+14 %', trend: 'up' },
  { id: 'mandats', label: 'Mandats signés', value: '7', delta: '+40 %', trend: 'up' },
  { id: 'cpl', label: 'Coût par lead', value: '8,42 €', delta: '−12 %', trend: 'down', hint: 'baisse positive' },
];

// ── Recommendations Vue d'ensemble ───────────────────────────────

export const RECOMMENDATIONS: MarketingRecommendation[] = [
  {
    id: 'reco_001',
    priority: 'high',
    title: 'Boostez la villa à Antibes — performance élevée',
    detail: 'Le bien génère 4× plus de vues que la moyenne avec un CPL 28 % inférieur.',
    impact: 'Potentiel +18 leads / 7 j',
    cta: 'Booster',
    source: 'Performance · campagne Meta',
    type: 'bien',
  },
  {
    id: 'reco_002',
    priority: 'high',
    title: 'Relancez 12 leads sans réponse depuis 7 jours',
    detail: 'Issus du formulaire landing « Estimation Lyon 6e ».',
    impact: '+5 RDV estimés',
    cta: 'Relancer',
    source: 'Interactions · landing',
    type: 'interaction',
  },
  {
    id: 'reco_003',
    priority: 'medium',
    title: 'Créez une campagne locale à Nantes',
    detail: 'Forte tension marché et 47 acquéreurs solvables matchés.',
    impact: 'CPL estimé 6,20 €',
    cta: 'Créer',
    source: 'Observatoire · profondeur solvable',
    type: 'campagne',
  },
  {
    id: 'reco_004',
    priority: 'medium',
    title: 'Régénérez l\'accroche du T3 Paris 15e',
    detail: 'Beaucoup de vues (8 932) mais peu de clics (1,4 %).',
    impact: 'CTR cible +1,5 pt',
    cta: 'Ouvrir Atelier',
    source: 'Performance · contenu',
    type: 'kit',
  },
  {
    id: 'reco_005',
    priority: 'low',
    title: 'Ajoutez un plan marketing à l\'AdV de M. Bernard',
    detail: 'Vendeur a ouvert l\'avis de valeur 3 fois en 48h.',
    impact: 'Préempte la concurrence',
    cta: 'Ajouter',
    source: 'Veille · ouvertures',
    type: 'plan_adv',
  },
];

// ── Campagnes actives ────────────────────────────────────────────

export const ACTIVE_CAMPAIGNS: CampaignRow[] = [
  {
    id: 'cmp_001',
    name: 'Villa Antibes — Mandat exclusif',
    bien: 'Villa avec piscine — Antibes',
    channel: 'meta_ads',
    objective: 'Demandes de visite',
    budget: 1500,
    spend: 1246,
    leads: 38,
    cpl: 32.8,
    status: 'active',
    endsIn: '4 j',
  },
  {
    id: 'cmp_002',
    name: 'Acquisition vendeurs Lyon 6e',
    bien: 'Zone Lyon 6e (campagne)',
    channel: 'google_ads',
    objective: 'Leads vendeurs',
    budget: 1200,
    spend: 892,
    leads: 19,
    cpl: 46.9,
    status: 'active',
    endsIn: '6 j',
  },
  {
    id: 'cmp_003',
    name: 'Famille Nantes Centre',
    bien: 'Maison familiale — Nantes',
    channel: 'meta_ads',
    objective: 'Demandes de visite',
    budget: 800,
    spend: 634,
    leads: 14,
    cpl: 45.2,
    status: 'active',
    endsIn: '9 j',
  },
  {
    id: 'cmp_004',
    name: 'Boost LinkedIn Investisseurs',
    bien: 'Loft Bordeaux Chartrons',
    channel: 'linkedin',
    objective: 'Leads investisseurs',
    budget: 500,
    spend: 220,
    leads: 4,
    cpl: 55.0,
    status: 'paused',
    endsIn: '11 j',
  },
];

// ── Interactions récentes ────────────────────────────────────────

export const RECENT_INTERACTIONS: InteractionRow[] = [
  {
    id: 'int_001',
    source: 'instagram_dm',
    contactName: 'Élise Dupont',
    contactSubtitle: '@elise.dpt · Antibes',
    message: 'Bonjour, le bien est-il toujours disponible ?',
    bien: 'Villa avec piscine — Antibes',
    channel: 'instagram',
    intent: 'visite',
    status: 'a_traiter',
    receivedAt: '2026-04-26T10:24:00Z',
    receivedAgo: 'il y a 10 min',
  },
  {
    id: 'int_002',
    source: 'facebook_message',
    contactName: 'Thomas Bernard',
    contactSubtitle: 'Facebook · Lyon 6e',
    message: 'Peut-on visiter ce week-end ?',
    bien: 'Appartement T3 — Lyon 7e',
    channel: 'facebook',
    intent: 'visite',
    status: 'a_traiter',
    receivedAt: '2026-04-26T09:52:00Z',
    receivedAgo: 'il y a 32 min',
  },
  {
    id: 'int_003',
    source: 'landing_form',
    contactName: 'Sarah Martin',
    contactSubtitle: 'Formulaire site · Maison Nantes',
    message: 'Demande d\'informations sur le bien',
    bien: 'Maison familiale — Nantes',
    campaign: 'Famille Nantes Centre',
    channel: 'site_agence',
    intent: 'information',
    status: 'a_traiter',
    receivedAt: '2026-04-26T08:42:00Z',
    receivedAgo: 'il y a 1 h',
  },
  {
    id: 'int_004',
    source: 'email_reply',
    contactName: 'Pierre Lemoine',
    contactSubtitle: 'pierre.l@gmail.com',
    message: 'Merci pour votre réactivité ! Je suis intéressé par une estimation.',
    bien: 'Studio Paris 12e',
    channel: 'email',
    intent: 'estimation',
    status: 'repondu',
    receivedAt: '2026-04-26T07:30:00Z',
    receivedAgo: 'il y a 2 h',
  },
  {
    id: 'int_005',
    source: 'google_call',
    contactName: 'Marie Olivier',
    contactSubtitle: '06 12 34 56 78',
    message: 'Appel manqué — Google Business Profile',
    bien: 'Loft Bordeaux Chartrons',
    channel: 'google_business',
    intent: 'visite',
    status: 'a_traiter',
    receivedAt: '2026-04-26T06:18:00Z',
    receivedAgo: 'il y a 4 h',
  },
  {
    id: 'int_006',
    source: 'instagram_comment',
    contactName: 'Lucas Roy',
    contactSubtitle: '@lucasroy_invest',
    message: 'Quel est le rendement locatif estimé ?',
    bien: 'Loft Bordeaux Chartrons',
    channel: 'instagram',
    intent: 'investissement',
    status: 'a_traiter',
    receivedAt: '2026-04-25T19:02:00Z',
    receivedAgo: 'il y a 16 h',
  },
  {
    id: 'int_007',
    source: 'ad_lead_form',
    contactName: 'Fatima Benali',
    contactSubtitle: 'Lead form Meta Ads',
    message: 'Souhaite estimer son bien dans le 15e',
    campaign: 'Villa Antibes — Mandat exclusif',
    channel: 'meta_ads',
    intent: 'estimation',
    status: 'converti_lead',
    receivedAt: '2026-04-25T15:30:00Z',
    receivedAgo: 'hier',
  },
  {
    id: 'int_008',
    source: 'sms_reply',
    contactName: 'Jean Cousin',
    contactSubtitle: '+33 6 22 11 88 44',
    message: 'OK pour samedi 10h.',
    bien: 'Maison Versailles',
    channel: 'sms',
    intent: 'visite',
    status: 'repondu',
    receivedAt: '2026-04-25T11:14:00Z',
    receivedAgo: 'hier',
  },
];

// ── À publier cette semaine ──────────────────────────────────────

export const SCHEDULED_THIS_WEEK: ScheduledItem[] = [
  { id: 'sch_01', day: 'lun', hour: '09:00', channel: 'instagram', type: 'post', bien: 'T3 Lyon 7e', variant: 'Carrousel 5 visuels' },
  { id: 'sch_02', day: 'lun', hour: '14:00', channel: 'facebook', type: 'post', bien: 'T3 Lyon 7e' },
  { id: 'sch_03', day: 'mar', hour: '10:00', channel: 'meta_ads', type: 'campagne', bien: 'Villa Antibes', variant: 'Boost mandat exclusif' },
  { id: 'sch_04', day: 'mer', hour: '11:00', channel: 'instagram', type: 'post', bien: 'Maison Nantes' },
  { id: 'sch_05', day: 'jeu', hour: '08:30', channel: 'email', type: 'email', bien: 'Base acquéreurs Lyon', variant: '47 destinataires' },
  { id: 'sch_06', day: 'ven', hour: '12:00', channel: 'linkedin', type: 'post', bien: 'Loft Bordeaux' },
  { id: 'sch_07', day: 'ven', hour: '17:30', channel: 'sms', type: 'sms', bien: 'Vendeurs ouverts AdV', variant: '12 destinataires' },
];

// ── Performance par canal ────────────────────────────────────────

export const CHANNEL_PERFORMANCE: ChannelPerfRow[] = [
  { channel: 'instagram', impressions: 28450, clicks: 845, ctr: 2.97, interactions: 132, leads: 36, rdv: 11, mandats: 2, spend: 0, trend: 'up' },
  { channel: 'facebook', impressions: 32145, clicks: 720, ctr: 2.24, interactions: 98, leads: 28, rdv: 9, mandats: 1, spend: 0, trend: 'up' },
  { channel: 'google_business', impressions: 14210, clicks: 412, ctr: 2.9, interactions: 64, leads: 22, rdv: 8, mandats: 1, spend: 0, trend: 'up' },
  { channel: 'meta_ads', impressions: 145800, clicks: 4280, ctr: 2.93, interactions: 312, leads: 92, rdv: 28, mandats: 4, spend: 2102, cpl: 22.85, trend: 'up' },
  { channel: 'google_ads', impressions: 87320, clicks: 2125, ctr: 2.43, interactions: 184, leads: 41, rdv: 14, mandats: 2, spend: 1380, cpl: 33.65, trend: 'flat' },
  { channel: 'linkedin', impressions: 8420, clicks: 198, ctr: 2.35, interactions: 24, leads: 6, rdv: 2, mandats: 1, spend: 220, cpl: 36.7, trend: 'down' },
  { channel: 'tiktok', impressions: 12085, clicks: 312, ctr: 2.58, interactions: 18, leads: 4, rdv: 1, mandats: 0, spend: 0, trend: 'up' },
  { channel: 'site_agence', impressions: 9420, clicks: 9420, ctr: 100, interactions: 188, leads: 52, rdv: 18, mandats: 3, spend: 0, trend: 'up' },
  { channel: 'email', impressions: 4280, clicks: 412, ctr: 9.62, interactions: 78, leads: 24, rdv: 11, mandats: 2, spend: 0, trend: 'up' },
  { channel: 'widget', impressions: 11240, clicks: 1124, ctr: 10, interactions: 142, leads: 84, rdv: 26, mandats: 5, spend: 0, trend: 'up' },
];

// ── Funnel d'attribution ─────────────────────────────────────────

export const FUNNEL_STEPS: FunnelStep[] = [
  { id: 'impressions', label: 'Impressions', value: 354412 },
  { id: 'clicks', label: 'Clics', value: 19848, conversion: 5.6 },
  { id: 'interactions', label: 'Interactions', value: 1242, conversion: 6.3 },
  { id: 'leads', label: 'Leads', value: 389, conversion: 31.3 },
  { id: 'leads_qualifies', label: 'Leads qualifiés', value: 198, conversion: 50.9, costPerUnit: 22 },
  { id: 'rdv', label: 'RDV', value: 128, conversion: 64.6 },
  { id: 'estimations', label: 'Estimations', value: 64, conversion: 50 },
  { id: 'mandats', label: 'Mandats', value: 18, conversion: 28.1 },
];

// ── Biens à fort potentiel ───────────────────────────────────────

export const PROPERTY_POTENTIAL: PropertyPotential[] = [
  {
    id: 'pot_001',
    bien: 'Villa avec piscine — Antibes',
    reason: 'DPE B + 4 % sous médiane DVF',
    channelHint: 'meta_ads',
    expectedImpact: '+12 leads / 7 j',
  },
  {
    id: 'pot_002',
    bien: 'Appartement T3 — Lyon 7e',
    reason: 'Mandat exclusif récent · zone tendue 8/10',
    channelHint: 'instagram',
    expectedImpact: '+25 % vues',
  },
  {
    id: 'pot_003',
    bien: 'Maison familiale — Nantes',
    reason: '47 acquéreurs solvables matchés',
    channelHint: 'email',
    expectedImpact: '+8 RDV estimés',
  },
  {
    id: 'pot_004',
    bien: 'Loft Bordeaux Chartrons',
    reason: 'Rendement locatif 5,2 % — angle investisseur',
    channelHint: 'linkedin',
    expectedImpact: '+6 leads invest',
  },
];

// ── Marketing properties (Mes annonces) ──────────────────────────

export const MARKETING_PROPERTIES: MarketingPropertyRow[] = [
  {
    id: 'mp_001',
    bienLabel: 'Villa avec piscine',
    bienSubtitle: '8 chemin des Pins · 165 m² · 5p',
    ville: 'Antibes (06)',
    status: 'campagne_active',
    publishabilityScore: 92,
    missing: [],
    channels: ['instagram', 'facebook', 'meta_ads', 'google_business'],
    views30d: 12450,
    leads30d: 37,
    cpl: 32.8,
    lastDiffusion: 'il y a 2 h',
    recommendation: 'Dupliquer sur Cannes',
    responsable: 'Sophie M.',
  },
  {
    id: 'mp_002',
    bienLabel: 'Appartement T3 — Lyon 7e',
    bienSubtitle: '14 rue Garibaldi · 68 m² · 3p',
    ville: 'Lyon 7e (69)',
    status: 'publie',
    publishabilityScore: 88,
    missing: [],
    channels: ['instagram', 'facebook'],
    views30d: 8932,
    leads30d: 28,
    cpl: undefined,
    lastDiffusion: 'il y a 4 h',
    recommendation: 'Régénérer l\'accroche',
    responsable: 'Karim B.',
  },
  {
    id: 'mp_003',
    bienLabel: 'Maison familiale',
    bienSubtitle: '22 av. de la Côte · 145 m² · 6p · DPE C',
    ville: 'Nantes (44)',
    status: 'publie',
    publishabilityScore: 75,
    missing: ['Landing'],
    channels: ['instagram', 'facebook', 'google_business'],
    views30d: 6741,
    leads30d: 17,
    cpl: 45.2,
    lastDiffusion: 'il y a 1 j',
    recommendation: 'Créer landing',
    responsable: 'Sophie M.',
  },
  {
    id: 'mp_004',
    bienLabel: 'Appartement T2',
    bienSubtitle: '8 rue Notre-Dame · 46 m² · 2p',
    ville: 'Bordeaux (33)',
    status: 'a_relancer',
    publishabilityScore: 60,
    missing: ['DPE', 'Photos pro'],
    channels: ['instagram'],
    views30d: 2105,
    leads30d: 4,
    cpl: undefined,
    lastDiffusion: 'il y a 3 j',
    recommendation: 'Relancer diffusion',
    responsable: 'Lucie T.',
  },
  {
    id: 'mp_005',
    bienLabel: 'Studio rénové',
    bienSubtitle: '12 rue Lacépède · 28 m² · 1p',
    ville: 'Paris 5e (75)',
    status: 'sous_performance',
    publishabilityScore: 70,
    missing: ['Description site agence'],
    channels: ['instagram', 'meta_ads'],
    views30d: 4280,
    leads30d: 2,
    cpl: 88.5,
    lastDiffusion: 'jamais — campagne uniquement',
    recommendation: 'Changer angle (juste prix)',
    responsable: 'Karim B.',
  },
  {
    id: 'mp_006',
    bienLabel: 'Loft Chartrons',
    bienSubtitle: '14 quai des Chartrons · 92 m² · DPE C',
    ville: 'Bordeaux (33)',
    status: 'pret_a_publier',
    publishabilityScore: 85,
    missing: [],
    channels: [],
    views30d: 0,
    leads30d: 0,
    cpl: undefined,
    lastDiffusion: '—',
    recommendation: 'Programmer diffusion',
    responsable: 'Sophie M.',
  },
  {
    id: 'mp_007',
    bienLabel: 'Maison Versailles',
    bienSubtitle: '8 rue de la Paroisse · 160 m² · 4 ch.',
    ville: 'Versailles (78)',
    status: 'a_completer',
    publishabilityScore: 55,
    missing: ['DPE', 'Honoraires', 'Adresse'],
    channels: [],
    views30d: 0,
    leads30d: 0,
    cpl: undefined,
    lastDiffusion: '—',
    recommendation: 'Compléter le dossier',
    responsable: 'Lucie T.',
  },
];

// ── Diffusion · Publications ─────────────────────────────────────

export const PUBLICATIONS: PublicationRow[] = [
  {
    id: 'pub_001',
    asset: 'Carrousel 5 visuels — Villa Antibes',
    bien: 'Villa avec piscine — Antibes',
    channel: 'instagram',
    account: '@agence_horizon',
    date: 'Lun. 27 avr. · 09:00',
    status: 'programme',
    views: undefined,
  },
  {
    id: 'pub_002',
    asset: 'Post format 4:5 — T3 Lyon 7e',
    bien: 'Appartement T3 — Lyon 7e',
    channel: 'facebook',
    account: 'Agence Horizon Lyon',
    date: 'Lun. 27 avr. · 14:00',
    status: 'programme',
  },
  {
    id: 'pub_003',
    asset: 'Reel 30 s — Maison Nantes',
    bien: 'Maison familiale — Nantes',
    channel: 'instagram',
    account: '@agence_horizon',
    date: 'Mer. 29 avr. · 11:00',
    status: 'programme',
  },
  {
    id: 'pub_004',
    asset: 'Post quartier · Marché 15e',
    bien: 'Zone Paris 15e',
    channel: 'linkedin',
    account: 'Agence Horizon',
    date: 'Ven. 25 avr. · 12:00',
    status: 'publie',
    views: 1240,
    clicks: 38,
    leads: 4,
  },
  {
    id: 'pub_005',
    asset: 'Story Loft Chartrons',
    bien: 'Loft Bordeaux Chartrons',
    channel: 'instagram',
    account: '@agence_horizon',
    date: 'Jeu. 24 avr. · 18:00',
    status: 'publie',
    views: 892,
    clicks: 24,
    leads: 2,
  },
  {
    id: 'pub_006',
    asset: 'Email Base acquéreurs Lyon',
    bien: 'Base acquéreurs Lyon',
    channel: 'email',
    account: 'sophie@agence-horizon.fr',
    date: 'Mer. 23 avr. · 08:30',
    status: 'publie',
    views: 412,
    clicks: 64,
    leads: 11,
  },
  {
    id: 'pub_007',
    asset: 'Post Google Business — Maison Versailles',
    bien: 'Maison Versailles',
    channel: 'google_business',
    account: 'Agence Horizon Versailles',
    date: 'Mar. 22 avr. · 10:00',
    status: 'echec',
  },
  {
    id: 'pub_008',
    asset: 'Reel TikTok — Studio Paris 5e',
    bien: 'Studio rénové',
    channel: 'tiktok',
    account: '@horizon_immo',
    date: 'Lun. 21 avr. · 16:00',
    status: 'reauth',
  },
];

// ── Diffusion · Comptes connectés ────────────────────────────────

export const CONNECTORS: ConnectorRow[] = [
  { id: 'cn_meta', provider: 'meta', label: 'Meta (Facebook + Instagram)', status: 'connected', pages: 2, adAccounts: 1, expiresIn: '52 j' },
  { id: 'cn_google', provider: 'google', label: 'Google Ads', status: 'connected', pages: 0, adAccounts: 1, expiresIn: '— renouvellement auto' },
  { id: 'cn_gbp', provider: 'gbp', label: 'Google Business Profile', status: 'needs_reauth', pages: 3, adAccounts: 0 },
  { id: 'cn_li', provider: 'linkedin', label: 'LinkedIn Page', status: 'connected', pages: 1, adAccounts: 1, expiresIn: '38 j' },
  { id: 'cn_tt', provider: 'tiktok', label: 'TikTok Business', status: 'expired', pages: 1, adAccounts: 0 },
  { id: 'cn_email', provider: 'email', label: 'Email — agence-horizon.fr', status: 'connected', pages: 1, adAccounts: 0 },
  { id: 'cn_sms', provider: 'sms', label: 'SMS — gateway OVH', status: 'disconnected', pages: 0, adAccounts: 0 },
];

// ── Bibliothèque ─────────────────────────────────────────────────

export const LIBRARY_ITEMS: LibraryItem[] = [
  { id: 'lib_001', title: 'Kit Villa Antibes — mandat exclusif', type: 'kit', bien: 'Villa Antibes', used: 12, bestOn: 'Instagram · Côte d\'Azur', perfHint: 'CPL moyen 28 €', author: 'Sophie M.', updatedAt: '23/04/2026', tags: ['exclusif', 'luxe', 'piscine'] },
  { id: 'lib_002', title: 'Plan marketing AdV — Lyon 7e', type: 'plan_adv', bien: 'T3 Lyon 7e', used: 6, perfHint: '8 vendeurs convaincus', author: 'Karim B.', updatedAt: '20/04/2026', tags: ['plan', 'AdV'] },
  { id: 'lib_003', title: 'Template post Insta « Juste prix »', type: 'template', channel: 'instagram', used: 38, bestOn: 'Lyon · Bordeaux', perfHint: 'CTR 3,4 %', author: 'Org', updatedAt: '02/04/2026', tags: ['template', 'prix'] },
  { id: 'lib_004', title: 'Visuel 9:16 « Nouveau prix »', type: 'visuel', channel: 'instagram', used: 21, perfHint: 'Reach +18 %', author: 'Lucie T.', updatedAt: '14/04/2026', tags: ['visuel', '9:16'] },
  { id: 'lib_005', title: 'Email base acquéreurs zone', type: 'asset', channel: 'email', used: 17, bestOn: 'Paris 15e', perfHint: 'Taux ouverture 38 %', author: 'Sophie M.', updatedAt: '11/04/2026', tags: ['email', 'acquéreurs'] },
  { id: 'lib_006', title: 'Script TikTok 30 s — Visite éclair', type: 'asset', channel: 'tiktok', used: 8, bestOn: 'TikTok', perfHint: '12 K vues moyennes', author: 'Karim B.', updatedAt: '05/04/2026', tags: ['vidéo', 'visite'] },
  { id: 'lib_007', title: 'Template campagne vendeurs Meta', type: 'template', channel: 'meta_ads', used: 14, perfHint: 'CPL 18 €', author: 'Org', updatedAt: '01/04/2026', tags: ['campagne', 'vendeurs'] },
  { id: 'lib_008', title: 'Plan marketing AdV — Premium', type: 'plan_adv', used: 3, perfHint: 'Mandats exclusifs +22 %', author: 'Org', updatedAt: '28/03/2026', tags: ['plan', 'premium'] },
  { id: 'lib_009', title: 'Story DPE F → angle travaux', type: 'asset', channel: 'instagram', used: 9, perfHint: 'CTR 2,8 %', author: 'Lucie T.', updatedAt: '24/03/2026', tags: ['DPE', 'rénovation'] },
];

// ── Helpers de présentation ──────────────────────────────────────

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('fr-FR').format(n);

export const formatEuros = (n: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

export const formatEurosCents = (n: number): string =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 }).format(n);
