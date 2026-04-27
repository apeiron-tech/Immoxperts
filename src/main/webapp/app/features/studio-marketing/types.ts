// === Studio Marketing — Atelier — Types V1 ===

export type AtelierSourceType =
  | 'bien'
  | 'annonce'
  | 'lead'
  | 'estimation'
  | 'opportunite'
  | 'theme'
  | 'manuel';

export type AtelierTransactionType = 'vente' | 'location' | 'investissement';
export type AtelierAudience = 'acquereur' | 'locataire' | 'investisseur' | 'mixte';
export type AtelierTone = 'professional' | 'warm' | 'punchy' | 'luxury' | 'investor';
export type AtelierEnrichmentMode = 'lite' | 'standard' | 'premium';
export type AtelierSpecialMode = 'plan_marketing_adv' | 'mandat_exclusif' | 'standard';

export type MarketingAssetType =
  | 'titre_court'
  | 'titre_seo'
  | 'description_portail'
  | 'description_site_agence'
  | 'post_instagram_carousel'
  | 'post_instagram_reel'
  | 'post_instagram_story'
  | 'post_facebook'
  | 'post_linkedin'
  | 'script_tiktok'
  | 'texte_google_business'
  | 'email_base_leads'
  | 'sms_court'
  | 'brief_video'
  | 'plan_marketing_adv';

export type MarketingChannel =
  | 'leboncoin'
  | 'seloger'
  | 'bienici'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'google_business'
  | 'email'
  | 'sms'
  | 'site_agence';

export type MarketingChannelGroup =
  | 'texte'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'google'
  | 'email'
  | 'sms'
  | 'video'
  | 'plan_adv';

export type LegalMentionType = 'hoguet' | 'carrez' | 'dpe' | 'honoraires' | 'mandat_exclusif';

export interface LegalMention {
  type: LegalMentionType;
  text: string;
  required: boolean;
}

export type VisualOverlayType =
  | 'price'
  | 'dpe'
  | 'tension'
  | 'plus_value'
  | 'demand_depth'
  | 'agency_logo'
  | 'cta';

export interface MarketingVisualOverlay {
  type: VisualOverlayType;
  position: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';
  value: string;
  style: 'badge_violet' | 'badge_dark' | 'badge_outline';
}

export interface MarketingAsset {
  asset_id: string;
  draft_id?: string;
  kit_id?: string;
  organization_id: string;

  asset_type: MarketingAssetType;
  channel?: MarketingChannel;
  channel_group: MarketingChannelGroup;

  title: string;
  content: string;
  content_format: 'plain' | 'markdown' | 'html' | 'json';
  metadata: Record<string, unknown>;

  visual_url?: string;
  visual_format?: '1:1' | '9:16' | '4:5' | '16:9';
  visual_template_id?: string;
  visual_overlays?: MarketingVisualOverlay[];

  data_points_cited: string[];

  version: number;
  parent_asset_id?: string;

  is_edited_by_user: boolean;
  is_validated: boolean;
  status: 'ready' | 'pending' | 'error' | 'unavailable';

  legal_mentions: LegalMention[];

  created_at: string;
  updated_at: string;
}

export interface DataAnchorBien {
  type: string;
  surface: number;
  pieces: number;
  etage?: number;
  annee_construction?: number;
  dpe?: string;
  ges?: string;
  prix?: number;
  prix_m2?: number;
  adresse: string;
  code_postal: string;
  ville: string;
  photo_url?: string;
  mandat_type?: 'exclusif' | 'simple';
}

export interface DataAnchorDvf {
  mediane_quartier_m2: number;
  mediane_iris_m2: number;
  nb_ventes_12m: number;
  evolution_12m_pct: number;
  ecart_bien_vs_mediane_pct?: number;
  derniere_vente_meme_immeuble?: { date: string; prix_m2: number };
}

export interface DataAnchorDpe {
  note_actuelle: string;
  consommation_kwh: number;
  classification: 'passoire' | 'mediocre' | 'standard' | 'performant';
  cout_chauffage_estime_annuel?: number;
  note_projetee_apres_renovation?: string;
}

export interface DataAnchorObservatoire {
  tension_score: number;
  delai_vente_moyen_jours: number;
  ratio_baisse_prix: number;
  types_demandes_dominants: string[];
  profil_demographique_dominant: string;
  transports_score: number;
  commerces_score: number;
  ecoles_score: number;
}

export interface DataAnchorEstimation {
  avm_estimation: number;
  avm_fourchette_basse: number;
  avm_fourchette_haute: number;
  avm_indice_confiance: number;
  nb_comparables_utilises: number;
  plus_value_potentielle?: number;
  rendement_locatif_estime?: number;
}

export interface DataAnchorProfondeurSolvable {
  nb_foyers_solvables_zone: number;
  pct_solvables_vs_zone: number;
  fourchette_revenu_cible: { min: number; max: number };
  distance_max_recherche_km: number;
}

export interface DataAnchorConcurrence {
  nb_biens_similaires_zone: number;
  prix_moyen_concurrence_m2: number;
  delai_moyen_concurrence: number;
}

export interface DataAnchorSnapshot {
  bien?: DataAnchorBien;
  dvf?: DataAnchorDvf;
  dpe?: DataAnchorDpe;
  observatoire?: DataAnchorObservatoire;
  estimation?: DataAnchorEstimation;
  profondeur_solvable?: DataAnchorProfondeurSolvable;
  concurrence?: DataAnchorConcurrence;
  snapshot_at: string;
  data_freshness: Record<string, string>;
}

export interface ModuleStatus {
  observatoire: 'active' | 'inactive';
  estimation: 'active' | 'inactive';
  leads: 'active' | 'inactive';
  veille: 'active' | 'inactive';
  investissement: 'active' | 'inactive';
}

export interface AtelierDraft {
  draft_id: string;
  organization_id: string;
  user_id: string;

  source_type: AtelierSourceType;
  source_id: string;
  source_label: string;

  status: 'draft' | 'generating' | 'ready' | 'error';
  generation_started_at?: string;
  generation_completed_at?: string;
  generation_error?: string;

  data_anchors: DataAnchorSnapshot;

  outputs: MarketingAsset[];

  enrichment_mode: AtelierEnrichmentMode;
  enrichment_score: number;
  data_points_used: string[];
  data_points_available: string[];

  transaction_type: AtelierTransactionType;
  audience: AtelierAudience;
  tone: AtelierTone;
  template_ids: string[];
  special_mode?: AtelierSpecialMode;

  created_at: string;
  updated_at: string;
  auto_saved_at?: string;
}

export interface AtelierDraftSummary {
  draft_id: string;
  source_type: AtelierSourceType;
  source_label: string;
  status: AtelierDraft['status'];
  updated_at: string;
  auto_saved_at?: string;
}

// === Source items pour la modale de sélection ===

export interface SourceItemBien {
  id: string;
  type: 'bien';
  label: string;
  sublabel: string;
  prix?: number;
  ville: string;
  mandat_type?: 'exclusif' | 'simple';
  photo_url?: string;
}

export interface SourceItemAnnonce {
  id: string;
  type: 'annonce';
  label: string;
  sublabel: string;
  source: string;
  prix?: number;
}

export interface SourceItemLead {
  id: string;
  type: 'lead';
  label: string;
  sublabel: string;
  zone: string;
}

export interface SourceItemEstimation {
  id: string;
  type: 'estimation';
  label: string;
  sublabel: string;
  avm_estimation?: number;
}

export interface SourceItemOpportunite {
  id: string;
  type: 'opportunite';
  label: string;
  sublabel: string;
  rendement?: number;
}

export type SourceItem =
  | SourceItemBien
  | SourceItemAnnonce
  | SourceItemLead
  | SourceItemEstimation
  | SourceItemOpportunite;

// === Templates Bibliothèque ===

export interface MarketingTemplate {
  template_id: string;
  organization_id: string;
  name: string;
  description?: string;
  scope: 'organization' | 'team' | 'user';
  template_type: 'channel_set' | 'visual_charter' | 'tone_voice' | 'plan_marketing_adv';
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// === Suggestion Propsight ===

export type SuggestionRuleId =
  | 'bien_sous_mediane'
  | 'bien_au_dessus_mediane'
  | 'dpe_passoire'
  | 'tension_forte'
  | 'profondeur_faible'
  | 'mandat_exclusif';

export interface SuggestionPropsight {
  rule_id: SuggestionRuleId;
  title: string;
  body: string;
  cta_label: string;
  cta_target?: string;
}

// === Plan marketing AdV ===

export type PlanMarketingSectionId =
  | 'cible'
  | 'canaux'
  | 'budget'
  | 'exemples'
  | 'reporting';

export interface PlanMarketingSection {
  id: PlanMarketingSectionId;
  title: string;
  enabled: boolean;
  content: string;
}

export type PlanMarketingPack = 'standard' | 'premium' | 'sur_mesure';
export type PlanMandatType = 'exclusif' | 'simple';
