# Propsight — Module Studio Marketing — Spécification complète

**Version :** consolidée complète  
**Format :** source de vérité produit / UX / data / dev  
**Produit :** Propsight Pro  
**Module :** Studio Marketing  
**Langue produit :** français  
**Persona principal :** agent immobilier transaction / location  
**Personas secondaires :** manager d’agence, chasseur immobilier, conseiller investisseur, investisseur en direct, tête de réseau  
**Stack cible :** Next.js App Router · TypeScript strict · Tailwind · shadcn/ui · TanStack Query · MSW · nuqs · Zustand · motion/react  
**Design :** desktop-first 1440–1600px · dense · premium · Linear / Attio · violet Propsight en accent  

---

# 0. Résumé exécutif

Studio Marketing est le module Propsight qui transforme un bien, une estimation, une zone ou un lead en **campagne commerciale mesurable**.

Il ne s’agit pas d’un simple outil de publication social media. Studio Marketing doit couvrir toute la chaîne :

```text
Bien / estimation / zone / widget / lead
→ création de contenu data-driven
→ diffusion organique
→ campagne locale sponsorisée
→ landing / widget / formulaire
→ interaction
→ lead qualifié
→ estimation / avis de valeur
→ mandat
→ performance business
```

La promesse produit :

> **Studio Marketing aide l’agent à générer plus de visibilité, plus de leads et plus de mandats sans dépendre uniquement des portails payants, en s’appuyant sur la donnée Propsight.**

La promesse différenciante :

> Les concurrents publient ou programment des annonces. Propsight explique pourquoi un bien est attractif, génère un kit marketing multi-canal, diffuse, mesure, attribue les leads et relie la performance au mandat.

---

# 1. Principes structurants

## 1.1 Studio Marketing n’est pas un mini-CRM

Le pipeline commercial unique reste dans :

```text
/app/activite/leads
```

Studio Marketing peut créer des interactions, recommander des actions, attribuer des sources, générer des formulaires, pousser des événements, mais il ne possède pas de Kanban commercial autonome.

Règle :

```text
Studio Marketing détecte, crée, diffuse, mesure.
Leads qualifie, suit, convertit.
Performance mesure l’impact.
Équipe pilote l’adoption et la transformation.
```

## 1.2 Studio Marketing est un module autonome mais naturellement composable

Le module peut être vendu seul, mais sa valeur augmente avec les autres briques Propsight.

| Modules activés | Valeur Studio Marketing |
|---|---|
| Studio seul | Création de contenus, diffusion, campagnes, statistiques simples |
| + Widgets publics | Campagnes de captation vendeur / investisseur vers widget |
| + Leads | Attribution post → lead, conversion des interactions en pipeline |
| + Estimation | Plan marketing intégré dans l’avis de valeur |
| + Observatoire | Contenus enrichis par tension, marché, profondeur solvable |
| + Veille | Relance marketing sur biens stagnants, concurrence, baisses de prix |
| + Équipe | Adoption par collaborateur, coaching, validation manager |
| + Performance | ROI complet jusqu’au mandat, CA pipe, objectifs |

## 1.3 Différenciation data-driven obligatoire

Tout contenu généré doit être ancré dans la donnée quand elle est disponible.

Datapoints utilisables :

```text
DVF
DPE / GES
AVM Propsight
comparables
tension de zone
délai moyen de vente / location
profondeur solvable
profil acquéreur / locataire
rendement estimé
concurrence locale
historique de performance marketing
base leads matchée
```

Règle :

```text
Un contenu Studio Marketing ne doit jamais ressembler à un texte IA générique.
Il doit citer, utiliser ou exploiter des arguments immobiliers vérifiables.
```

## 1.4 Chaque écran doit être actionnable

Aucun écran ne doit être un simple reporting passif.

Chaque ligne, carte, campagne, interaction ou recommandation doit proposer au moins une action :

```text
Créer un kit
Programmer une diffusion
Lancer une campagne
Créer / associer un lead
Relancer
Ajouter au plan marketing AdV
Ouvrir la fiche bien
Ouvrir l’estimation
Ouvrir l’Observatoire
Créer une alerte Veille
```

## 1.5 Design et densité

Studio Marketing suit le design system Propsight :

```text
Interface claire
Fond blanc dominant
Violet Propsight en accent
Cards sobres
Bordures fines
Radius 8px
Pas de gros effets décoratifs
Pas de glow
Pas de dashboard social media flashy
```

Le module doit rester professionnel, dense et orienté business.

---

# 2. Navigation du module

## 2.1 Placement dans la sidebar Pro

Studio Marketing est placé après Widgets publics, car ces deux modules forment la couche d’acquisition externe :

```text
Prospection
Widgets publics
Studio Marketing
Estimation
Investissement
Observatoire
Veille
Équipe
```

## 2.2 Sous-sections Studio Marketing

La navigation complète recommandée contient **7 sous-sections** :

```text
🎬 Studio Marketing
├ Vue d’ensemble              /app/studio-marketing
├ Mes annonces                /app/studio-marketing/annonces
├ Atelier                     /app/studio-marketing/atelier
├ Diffusion & campagnes       /app/studio-marketing/diffusion
├ Interactions                /app/studio-marketing/interactions
├ Performance                 /app/studio-marketing/performance
└ Bibliothèque                /app/studio-marketing/bibliotheque
```

Les paramètres ne sont pas une sous-section sidebar. Ils vivent dans :

```text
/app/parametres/studio-marketing
```

## 2.3 Pourquoi 7 sous-sections

Les 7 sous-sections correspondent aux 7 moments de la chaîne de valeur :

| Moment | Section | Question utilisateur |
|---|---|---|
| Piloter | Vue d’ensemble | Qu’est-ce qui mérite mon attention aujourd’hui ? |
| Prioriser les biens | Mes annonces | Quels biens dois-je promouvoir ou corriger ? |
| Créer | Atelier | Comment produire un kit marketing convaincant ? |
| Diffuser | Diffusion & campagnes | Où, quand et avec quel budget publier ? |
| Convertir | Interactions | Quelles réponses dois-je transformer en leads ? |
| Mesurer | Performance | Qu’est-ce qui génère vraiment du business ? |
| Capitaliser | Bibliothèque | Quels assets et templates réutiliser ? |

Cette structure est complète mais lisible, car chaque section correspond à une tâche métier distincte.

---

# 3. Routes

```text
/app/studio-marketing
/app/studio-marketing/annonces
/app/studio-marketing/atelier
/app/studio-marketing/diffusion
/app/studio-marketing/interactions
/app/studio-marketing/performance
/app/studio-marketing/bibliotheque

/app/parametres/studio-marketing
```

Routes publiques associées :

```text
/a/[slug-bien]
/agence/[slug]/bien/[slug-bien]
/campagne/[token]
/landing/[token]
```

Routes contextuelles :

```text
/app/studio-marketing/atelier?bien=[bien_id]
/app/studio-marketing/atelier?annonce=[annonce_id]
/app/studio-marketing/atelier?lead=[lead_id]
/app/studio-marketing/atelier?estimation=[estimation_id]&type=plan_marketing_adv
/app/studio-marketing/atelier?opportunite=[opportunite_id]
/app/studio-marketing/atelier?zone=[zone_id]&type=acquisition_vendeur
/app/studio-marketing/diffusion?kit=[kit_id]
/app/studio-marketing/diffusion?campagne=[campaign_id]
/app/studio-marketing/interactions?interaction=[interaction_id]
/app/studio-marketing/performance?bien=[bien_id]
```

Tous les paramètres d’URL doivent être gérés via `nuqs`.

---

# 4. Objets métier

## 4.1 Vue d’ensemble des objets

```text
MarketingProperty
MarketingKit
MarketingAsset
MarketingPublication
MarketingCampaign
MarketingInteraction
MarketingAttribution
MarketingMetricSnapshot
MarketingTemplate
MarketingLandingPage
SocialConnection
AdAccountConnection
DataAnchorSnapshot
MarketingRecommendation
```

## 4.2 Objets consommés du backbone Propsight

```text
Bien
Annonce
Lead
Action
Estimation
AvisDeValeur
EtudeLocative
Opportunite
DossierInvestissement
Zone
Alerte
BienSuivi
Collaborateur
Organization
User
```

## 4.3 MarketingProperty

Représente l’état marketing d’un bien.

```ts
export type MarketingStatus =
  | 'non_prepare'
  | 'a_completer'
  | 'pret_a_publier'
  | 'publie'
  | 'campagne_active'
  | 'a_relancer'
  | 'sous_performance'
  | 'archive';

export interface MarketingProperty {
  marketing_property_id: string;
  organization_id: string;
  bien_id: string;
  annonce_id?: string;

  status: MarketingStatus;
  publishability_score: number; // 0-100

  missing_items: Array<
    'photos' |
    'dpe' |
    'prix' |
    'surface' |
    'description' |
    'mandat' |
    'honoraires' |
    'adresse' |
    'landing'
  >;

  active_channels: MarketingChannel[];
  last_publication_at?: string;
  next_scheduled_at?: string;

  kit_id?: string;
  landing_page_id?: string;

  metrics_30d: {
    impressions: number;
    clicks: number;
    interactions: number;
    leads: number;
    rdv: number;
    estimations: number;
    mandates: number;
    spend: number;
    cpl?: number;
  };

  recommendation?: MarketingRecommendation;

  created_at: string;
  updated_at: string;
}
```

## 4.4 MarketingAsset

Un asset est un contenu produit par l’Atelier ou ajouté manuellement.

```ts
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
  | 'visuel_1_1'
  | 'visuel_9_16'
  | 'landing_copy'
  | 'plan_marketing_adv';

export type MarketingChannel =
  | 'site_agence'
  | 'landing_propsight'
  | 'leboncoin'
  | 'seloger'
  | 'bienici'
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'google_business'
  | 'meta_ads'
  | 'google_ads'
  | 'tiktok_ads'
  | 'linkedin_ads'
  | 'email'
  | 'sms'
  | 'whatsapp'
  | 'qr_code';

export interface MarketingAsset {
  asset_id: string;
  organization_id: string;
  kit_id?: string;
  source_type: 'bien' | 'annonce' | 'lead' | 'estimation' | 'opportunite' | 'zone' | 'manuel';
  source_id?: string;

  asset_type: MarketingAssetType;
  channel?: MarketingChannel;

  title: string;
  content: string;
  content_format: 'plain' | 'markdown' | 'html' | 'json';

  visual_url?: string;
  visual_format?: '1:1' | '4:5' | '9:16' | '16:9';
  visual_overlays?: MarketingVisualOverlay[];

  data_points_cited: string[];
  legal_mentions: LegalMention[];

  version: number;
  parent_asset_id?: string;

  status: 'draft' | 'generated' | 'edited' | 'validated' | 'published' | 'archived';

  created_by: string;
  created_at: string;
  updated_at: string;
}
```

## 4.5 MarketingKit

Un kit regroupe les assets générés pour un bien, une zone ou une estimation.

```ts
export interface MarketingKit {
  kit_id: string;
  organization_id: string;
  created_by: string;

  source_type: 'bien' | 'annonce' | 'lead' | 'estimation' | 'opportunite' | 'zone' | 'manuel';
  source_id?: string;
  source_label: string;

  title: string;
  description?: string;

  asset_ids: string[];
  data_anchors: DataAnchorSnapshot;

  status: 'draft' | 'ready' | 'scheduled' | 'in_diffusion' | 'completed' | 'archived';

  linked_bien_id?: string;
  linked_lead_id?: string;
  linked_estimation_id?: string;
  linked_opportunite_id?: string;

  publication_ids: string[];
  campaign_ids: string[];

  performance_summary: {
    impressions: number;
    clicks: number;
    interactions: number;
    leads: number;
    rdv: number;
    mandates: number;
    spend: number;
  };

  created_at: string;
  updated_at: string;
}
```

## 4.6 MarketingPublication

Une publication organique sur un canal.

```ts
export interface MarketingPublication {
  publication_id: string;
  organization_id: string;
  kit_id?: string;
  asset_id: string;
  bien_id?: string;

  provider:
    | 'instagram'
    | 'facebook'
    | 'linkedin'
    | 'tiktok'
    | 'google_business'
    | 'site_agence'
    | 'email'
    | 'sms'
    | 'whatsapp';

  account_id?: string;
  channel: MarketingChannel;

  scheduled_at?: string;
  published_at?: string;
  external_post_id?: string;
  external_url?: string;

  status:
    | 'draft'
    | 'scheduled'
    | 'publishing'
    | 'published'
    | 'failed'
    | 'deleted'
    | 'needs_reauth';

  failure_reason?: string;

  utm: {
    source: string;
    medium: string;
    campaign: string;
    content: string;
  };

  created_at: string;
  updated_at: string;
}
```

## 4.7 MarketingCampaign

Une campagne sponsorisée locale.

```ts
export interface MarketingCampaign {
  campaign_id: string;
  organization_id: string;
  bien_id?: string;
  kit_id?: string;

  provider: 'meta_ads' | 'google_ads' | 'tiktok_ads' | 'linkedin_ads';
  objective:
    | 'visibilite_bien'
    | 'demandes_visite'
    | 'leads_vendeurs'
    | 'leads_bailleurs'
    | 'leads_investisseurs'
    | 'notoriete_locale'
    | 'retargeting';

  name: string;
  status:
    | 'draft'
    | 'pending_review'
    | 'active'
    | 'paused'
    | 'completed'
    | 'rejected'
    | 'failed';

  budget_total: number;
  budget_daily?: number;
  spend: number;

  start_date: string;
  end_date: string;

  geo_target: {
    label: string;
    type: 'radius' | 'city' | 'district' | 'custom_zone';
    radius_km?: number;
    zone_id?: string;
    geometry?: GeoJSON.Geometry;
  };

  audience_strategy:
    | 'local_large'
    | 'vendeurs_zone'
    | 'acquereurs_probables'
    | 'investisseurs'
    | 'retargeting_site'
    | 'base_leads';

  landing_url: string;
  special_category?: 'housing';

  external_campaign_id?: string;
  external_adset_id?: string;
  external_ad_id?: string;

  metrics: MarketingPaidMetrics;

  created_at: string;
  updated_at: string;
}
```

## 4.8 MarketingInteraction

Une interaction entrante.

```ts
export interface MarketingInteraction {
  interaction_id: string;
  organization_id: string;

  source:
    | 'instagram_dm'
    | 'facebook_message'
    | 'facebook_comment'
    | 'instagram_comment'
    | 'google_call'
    | 'google_message'
    | 'landing_form'
    | 'email_reply'
    | 'sms_reply'
    | 'whatsapp_click'
    | 'ad_lead_form';

  channel: MarketingChannel;

  bien_id?: string;
  publication_id?: string;
  campaign_id?: string;
  asset_id?: string;
  landing_page_id?: string;

  contact: {
    name?: string;
    email?: string;
    phone?: string;
    external_user_id?: string;
    profile_url?: string;
  };

  message?: string;
  intent_detected?:
    | 'visite'
    | 'information'
    | 'estimation'
    | 'vente'
    | 'location'
    | 'investissement'
    | 'autre';

  status:
    | 'nouveau'
    | 'a_traiter'
    | 'repondu'
    | 'converti_lead'
    | 'associe_lead'
    | 'ignore'
    | 'archive';

  linked_lead_id?: string;
  assignee_id?: string;

  received_at: string;
  created_at: string;
  updated_at: string;
}
```

## 4.9 DataAnchorSnapshot

Snapshot des données utilisées pour générer un contenu.

```ts
export interface DataAnchorSnapshot {
  bien?: {
    type: string;
    surface?: number;
    pieces?: number;
    chambres?: number;
    etage?: number;
    annee_construction?: number;
    dpe?: string;
    ges?: string;
    prix?: number;
    prix_m2?: number;
    loyer?: number;
    loyer_m2?: number;
    adresse?: string;
    ville?: string;
    code_postal?: string;
    mandat_type?: 'simple' | 'exclusif' | 'recherche' | 'aucun';
  };

  dvf?: {
    mediane_quartier_m2?: number;
    mediane_iris_m2?: number;
    nb_ventes_12m?: number;
    evolution_12m_pct?: number;
    ecart_bien_vs_mediane_pct?: number;
    derniere_vente_meme_immeuble?: {
      date: string;
      prix_m2: number;
    };
  };

  dpe?: {
    note_actuelle?: string;
    classification?: 'passoire' | 'mediocre' | 'standard' | 'performant';
    cout_chauffage_estime_annuel?: number;
    note_projetee_apres_renovation?: string;
  };

  observatoire?: {
    tension_score?: number;
    delai_vente_moyen_jours?: number;
    delai_location_moyen_jours?: number;
    ratio_baisse_prix?: number;
    type_demande_dominant?: string;
    profil_demographique_dominant?: string;
    transports_score?: number;
    commerces_score?: number;
    ecoles_score?: number;
    cadre_vie_score?: number;
  };

  estimation?: {
    avm_estimation?: number;
    avm_fourchette_basse?: number;
    avm_fourchette_haute?: number;
    avm_indice_confiance?: number;
    nb_comparables_utilises?: number;
    loyer_estime?: number;
    rendement_locatif_estime?: number;
  };

  profondeur_solvable?: {
    nb_foyers_solvables_zone?: number;
    pct_solvables_vs_zone?: number;
    revenu_cible_min?: number;
    revenu_cible_max?: number;
    distance_max_recherche_km?: number;
  };

  leads?: {
    nb_leads_match_zone?: number;
    nb_leads_match_budget?: number;
    nb_leads_acquereurs?: number;
    nb_leads_vendeurs?: number;
    nb_leads_investisseurs?: number;
  };

  concurrence?: {
    nb_biens_similaires_zone?: number;
    prix_moyen_concurrence_m2?: number;
    delai_moyen_concurrence?: number;
    nb_agences_actives_zone?: number;
  };

  performance?: {
    canal_top_zone?: MarketingChannel;
    format_top_zone?: string;
    cpl_moyen_zone?: number;
    meilleur_angle_recent?: string;
  };

  snapshot_at: string;
  data_freshness: Record<string, string>;
}
```

---

# 5. Sous-section 1 — Vue d’ensemble

**Route :** `/app/studio-marketing`

## 5.1 Rôle

La Vue d’ensemble est le cockpit quotidien du module. Elle répond à :

> Quels biens et campagnes méritent mon attention aujourd’hui, quels canaux performent, et quelles actions dois-je lancer ?

Ce n’est pas seulement un reporting social media. L’écran doit faire apparaître la chaîne business :

```text
vues → clics → interactions → leads → RDV → estimations → mandats
```

## 5.2 Layout

```text
Studio Marketing
Créez, diffusez et mesurez vos campagnes immobilières.

[Recherche bien / contact / campagne] [Période] [Créer un kit] [Lancer campagne]

KPI business
┌──────┬──────┬──────┬──────┬──────┬──────┐
│Vues  │Clics │Leads │RDV   │Mandats│CPL  │
└──────┴──────┴──────┴──────┴──────┴──────┘

Grille principale
┌───────────────────────────────┬───────────────────────────────┬──────────────────────────────┐
│ Actions recommandées          │ Campagnes actives              │ Interactions récentes         │
├───────────────────────────────┼───────────────────────────────┼──────────────────────────────┤
│ À publier cette semaine        │ Biens à fort potentiel         │ Performance par canal         │
└───────────────────────────────┴───────────────────────────────┴──────────────────────────────┘

Funnel attribution
Publication → clic → lead → RDV → estimation → mandat
```

## 5.3 KPI haut de page

6 KPI maximum :

| KPI | Définition |
|---|---|
| Vues totales | Impressions / vues organiques + paid |
| Clics | Clics vers landing, widget, site agence |
| Leads générés | Leads créés ou associés depuis Studio |
| RDV générés | RDV associés à des leads Studio |
| Mandats attribués | Mandats dont l’origine ou l’influence inclut Studio |
| Coût par lead | Dépense campagne / leads |

Chaque KPI affiche :
- valeur ;
- delta vs période précédente ;
- lien vers Performance filtrée.

## 5.4 Bloc Actions recommandées

Bloc prioritaire.

Exemples de recommandations :

```text
3 biens actifs n’ont aucune diffusion depuis 14 jours.
→ Voir les biens

Le T3 Paris 15e génère beaucoup de vues mais peu de clics.
→ Régénérer l’accroche

Votre campagne vendeurs Paris 15e a un CPL 28 % inférieur à la moyenne.
→ Dupliquer sur Paris 14e

Le bien de Lyon 6e est 4 % sous la médiane DVF.
→ Lancer une campagne “au juste prix”

12 interactions Instagram sont sans réponse depuis 24h.
→ Traiter les interactions
```

Chaque recommandation contient :
- raison ;
- impact métier ;
- CTA principal ;
- source de données ;
- niveau de priorité.

## 5.5 Bloc Campagnes actives

Liste compacte :

```text
Bien / campagne
Canal
Objectif
Budget
Dépensé
Leads
CPL
Statut
Action
```

Actions :
- ouvrir campagne ;
- pause ;
- ajuster budget ;
- dupliquer ;
- voir performance.

## 5.6 Bloc Interactions récentes

Affiche les dernières interactions entrantes :

```text
Instagram DM
Facebook commentaire
Google appel manqué
Landing formulaire
Email réponse
```

Actions rapides :
- répondre ;
- créer lead ;
- associer lead ;
- créer action ;
- ignorer.

## 5.7 Bloc À publier cette semaine

Mini-calendrier affichant :
- posts programmés ;
- campagnes sponsorisées ;
- emails prévus ;
- relances recommandées ;
- trous de planning.

## 5.8 Bloc Biens à fort potentiel marketing

Classement des biens à promouvoir, basé sur :
- score de publiabilité ;
- écart prix vs marché ;
- tension locale ;
- statut de mandat ;
- ancienneté annonce ;
- performance précédente ;
- opportunité commerciale.

Colonnes :

```text
Bien
Raison Propsight
Canal recommandé
Impact attendu
CTA
```

## 5.9 Bloc Performance par canal

Table compacte :

```text
Canal
Vues
Clics
Interactions
Leads
RDV
Mandats
CPL
Tendance
```

Canaux :
- Instagram ;
- Facebook ;
- Google Business ;
- Google Ads ;
- Meta Ads ;
- LinkedIn ;
- TikTok ;
- Site agence ;
- Email ;
- Widget.

## 5.10 Funnel d’attribution

Visualisation horizontale :

```text
Publications
→ Vues
→ Clics
→ Interactions
→ Leads
→ RDV
→ Estimations
→ Mandats
→ CA pipe
```

Le clic sur chaque étape renvoie vers la section correspondante filtrée.

---

# 6. Sous-section 2 — Mes annonces

**Route :** `/app/studio-marketing/annonces`

## 6.1 Rôle

Mes annonces est la file de travail des biens à commercialiser.

Elle répond à :

> Quels biens sont prêts, lesquels sont mal préparés, lesquels sont publiés, lesquels stagnent, et que dois-je faire pour chacun ?

Cette section est centrée sur le **bien**, pas sur le post.

## 6.2 Layout

```text
Mes annonces
Suivez l’état marketing de vos biens et priorisez les actions de diffusion.

[Recherche] [Statut] [Canal] [Agent] [Zone] [Score] [Créer annonce]

Tabs rapides :
Toutes · À préparer · Prêtes · Publiées · Campagnes actives · À relancer · Sous-performance

Vue table dense par défaut
```

## 6.3 KPI

4 KPI :

| KPI | Rôle |
|---|---|
| Biens actifs | Tous les biens commercialisables |
| Prêts à publier | Score publiabilité ≥ 80 |
| Sous-performance | Beaucoup de vues, peu de leads |
| À relancer | Sans diffusion récente ou baisse de performance |

## 6.4 Table Mes annonces

Colonnes par défaut :

```text
Bien
Statut
Score publiabilité
Canaux actifs
Vues 30j
Leads 30j
CPL
Dernière diffusion
Action recommandée
Responsable
```

Statuts :
- Non préparé ;
- À compléter ;
- Prêt à publier ;
- Publié ;
- Campagne active ;
- À relancer ;
- Sous-performance ;
- Archivé.

## 6.5 Score de publiabilité

Score 0–100.

Contributeurs :

| Critère | Poids |
|---|---:|
| Photos présentes et exploitables | 20 |
| Données bien complètes | 15 |
| DPE / GES renseignés | 10 |
| Prix / loyer renseigné | 10 |
| Mentions légales complètes | 10 |
| Estimation / comparables disponibles | 10 |
| Landing page créée | 10 |
| Kit marketing généré | 10 |
| Plan de diffusion prêt | 5 |

Affichage :

```text
Score 72/100
Manque : DPE, description site agence, landing
[Compléter]
```

## 6.6 Drawer annonce / bien marketing

Clic sur une ligne → drawer 520px.

Zones :

1. Header bien ;
2. Score de publiabilité ;
3. Checklist ;
4. Canaux actifs ;
5. Performance 30j ;
6. Historique publications ;
7. Recommandations ;
8. Actions rapides.

Actions :
- générer kit Atelier ;
- créer landing ;
- programmer diffusion ;
- lancer campagne ;
- ouvrir fiche bien ;
- ouvrir performance ;
- archiver.

## 6.7 Vue cards

Vue alternative pour agents qui préfèrent une lecture visuelle.

Card :

```text
Photo
Adresse
Prix / surface / DPE
Statut marketing
Score publiabilité
Canaux actifs
Vues · Leads · CPL
CTA principal
```

## 6.8 Intégration avec Biens immobiliers

Depuis la fiche bien :
- onglet Marketing ;
- score publiabilité ;
- kit associé ;
- campagnes ;
- interactions ;
- CTA “Ouvrir dans Studio Marketing”.

Depuis Mes annonces :
- lien fiche bien ;
- lien estimation ;
- lien observatoire zone ;
- lien leads associés.

---

# 7. Sous-section 3 — Atelier

**Route :** `/app/studio-marketing/atelier`

## 7.1 Rôle

L’Atelier est la sous-section de production.

Il répond à :

> Comment transformer un bien, une estimation, un lead ou une zone en kit marketing complet, prêt à diffuser ?

L’Atelier est le cœur différenciant du module.

## 7.2 Sources d’entrée

L’Atelier accepte :

```text
bien portefeuille
annonce marché
lead vendeur / bailleur / investisseur
estimation rapide
avis de valeur
étude locative
opportunité investissement
zone / quartier / IRIS
saisie manuelle
```

## 7.3 Modes de production

### 7.3.1 Création depuis un bien

Usage principal : un mandat vient d’être signé, l’agent veut commercialiser.

Outputs :
- descriptif portail ;
- descriptif site agence ;
- posts sociaux ;
- landing ;
- email base acquéreurs ;
- visuels ;
- campagne locale ;
- plan de diffusion.

### 7.3.2 Création depuis une zone

Usage : campagne d’acquisition vendeur / bailleur.

Exemple :
> “Vous vendez dans le 15e ? Découvrez la valeur de votre bien.”

Outputs :
- post Instagram ;
- Facebook ;
- Google Business Profile ;
- landing estimation ;
- campagne Meta Ads ;
- script TikTok ;
- email base vendeurs ;
- lien widget estimation.

### 7.3.3 Création depuis une estimation / avis de valeur

Usage : préparer un plan marketing à intégrer dans le rapport vendeur.

Outputs :
- bloc plan marketing ;
- cible acquéreurs ;
- canaux ;
- budget recommandé ;
- exemples de posts ;
- reporting vendeur ;
- argumentaire mandat exclusif.

### 7.3.4 Création depuis un lead

Usage : contenu personnalisé pour convertir un prospect.

Exemple :
- lead vendeur issu widget ;
- lead acquéreur intéressé par une zone ;
- investisseur cherchant rendement.

Outputs :
- email personnalisé ;
- SMS ;
- kit relance ;
- fiche bien recommandée ;
- campagne retargeting.

### 7.3.5 Création depuis une opportunité investissement

Usage : promouvoir un bien à une base investisseurs.

Outputs :
- email investisseurs ;
- post LinkedIn ;
- argumentaire rendement ;
- fiche opportunité ;
- landing investisseur.

## 7.4 Layout Atelier

Workspace 3 panneaux :

```text
┌───────────────┬────────────────────────────┬──────────────────────┐
│ Inputs        │ Preview / édition           │ Sidebar contextuelle │
│ 320px         │ flex                         │ 380px                │
└───────────────┴────────────────────────────┴──────────────────────┘
```

### Panneau Inputs

Contient :
- source ;
- type transaction ;
- public visé ;
- objectif ;
- ton ;
- canaux ;
- budget optionnel ;
- templates ;
- bouton générer.

### Preview / édition

Contient :
- tabs par canal ;
- output sélectionné ;
- preview visuelle ;
- édition inline ;
- variantes ;
- liste outputs ;
- actions : sauvegarder, programmer, campagne, ajouter au rapport.

### Sidebar contextuelle

Affiche :
- datapoints bien ;
- DVF ;
- DPE ;
- Observatoire ;
- AVM ;
- profondeur solvable ;
- leads matchés ;
- concurrence ;
- suggestion Propsight ;
- actions transverses.

## 7.5 Outputs générables

### Textes immobiliers

```text
Titre court
Titre SEO
Description portail
Description site agence
Résumé court
Accroche vitrine
```

### Réseaux sociaux

```text
Instagram carrousel
Instagram Reel script
Instagram Story
Facebook post
LinkedIn post
TikTok script
Google Business Profile post
```

### Conversion

```text
Email base leads
SMS court
Message WhatsApp
Landing copy
CTA widget estimation
CTA demande visite
```

### Visuels

```text
Visuel 1:1
Visuel 4:5
Visuel 9:16
Overlay prix
Overlay DPE
Overlay “nouveau prix”
Overlay “mandat exclusif”
Overlay data marché
```

### Rapport vendeur

```text
Plan marketing avis de valeur
Plan diffusion mandat exclusif
Budget recommandé
Reporting vendeur
```

### Vidéo

```text
Brief vidéo 30s
Script agent face caméra
Liste plans à filmer
Storyboard Reel / TikTok
```

## 7.6 Règles de génération

Chaque output doit respecter :

```text
pas d’invention de chiffres
datapoints cités quand disponibles
mentions légales injectées
ton adapté au canal
CTA clair
pas de promesse trompeuse
pas de ciblage discriminant logement
```

## 7.7 Score de richesse data

Affiché dans l’Atelier :

```text
Texte enrichi : 5 datapoints utilisés sur 7 disponibles
```

Niveaux :
- Faible ;
- Correct ;
- Fort ;
- Premium.

Exemples de datapoints :
- médiane DVF ;
- écart prix vs médiane ;
- volume ventes ;
- tension ;
- délai vente ;
- DPE ;
- AVM ;
- solvabilité ;
- leads matchés ;
- concurrence.

## 7.8 Plan marketing dans l’avis de valeur

Le bloc `Plan marketing` est généré par l’Atelier et injecté dans le template rapport.

Structure du bloc :

```text
Plan marketing de commercialisation

1. Cible d’acquéreurs
2. Positionnement prix
3. Canaux de diffusion
4. Exemples de contenus
5. Budget recommandé
6. Calendrier de diffusion
7. Reporting vendeur
```

Objectif commercial :

> Aider l’agent à prouver au vendeur qu’il ne va pas seulement “mettre l’annonce en ligne”, mais piloter une vraie stratégie de commercialisation.

## 7.9 Variantes

Chaque output peut avoir des variantes :

```text
Plus data
Plus émotion
Plus premium
Plus investisseur
Plus court
Plus local
Plus mandat exclusif
```

## 7.10 Sauvegarde et versioning

Tout output peut être :
- sauvegardé dans Bibliothèque ;
- ajouté à un kit ;
- programmé ;
- dupliqué ;
- archivé ;
- comparé à une version précédente.

## 7.11 Suggestions Propsight

Exemples :

```text
Le bien est 4 % sous la médiane DVF : angle “juste prix”.
Le DPE F peut être transformé en angle “potentiel travaux”.
La zone est très tendue : privilégier campagne courte 7 jours.
Les posts quartier performent mieux que les posts prix sur cette zone.
Votre base contient 47 acquéreurs compatibles.
```

---

# 8. Sous-section 4 — Diffusion & campagnes

**Route :** `/app/studio-marketing/diffusion`

## 8.1 Rôle

Cette section orchestre la distribution organique et sponsorisée.

Elle répond à :

> Où, quand et avec quel budget publier mes contenus pour générer des leads ?

Elle regroupe :
- calendrier de diffusion ;
- publications organiques ;
- campagnes sponsorisées ;
- comptes connectés ;
- statuts de publication ;
- erreurs et validations.

## 8.2 Structure

Tabs internes :

```text
Calendrier
Publications
Campagnes locales
Comptes connectés
```

## 8.3 Calendrier

Vue calendrier semaine / mois.

Affiche :
- posts programmés ;
- posts publiés ;
- campagnes actives ;
- emails planifiés ;
- relances ;
- recommandations.

Interaction :
- drag & drop d’un post ;
- clic → drawer publication ;
- bouton “Programmer depuis Atelier” ;
- bouton “Remplir les trous de calendrier”.

## 8.4 Publications organiques

Table dense :

```text
Asset
Bien
Canal
Compte
Date
Statut
Vues
Clics
Leads
Action
```

Statuts :
- brouillon ;
- programmé ;
- en cours ;
- publié ;
- échec ;
- besoin reconnexion ;
- supprimé.

Actions :
- publier maintenant ;
- reprogrammer ;
- dupliquer ;
- voir post externe ;
- voir performance ;
- transformer en campagne.

## 8.5 Canaux organiques

Canaux supportés :

```text
Facebook Page
Instagram Business
Google Business Profile
LinkedIn Page
TikTok
Site agence / landing
Email
SMS
WhatsApp lien prérempli
```

Règle :
- TikTok peut commencer par export prêt à poster si l’API directe n’est pas disponible ;
- SMS réel nécessite intégration gateway ;
- WhatsApp Business API est optionnelle, le lien prérempli suffit pour un premier parcours ;
- Google Business Profile est prioritaire pour le SEO local.

## 8.6 Campagnes locales

Objectifs campagne :

```text
Booster un bien
Générer des demandes de visite
Générer des leads vendeurs
Générer des leads bailleurs
Générer des leads investisseurs
Promouvoir une estimation gratuite
Promouvoir une page quartier
Retargeter visiteurs landing
```

Canaux paid :

```text
Meta Ads
Google Ads
TikTok Ads
LinkedIn Ads
```

## 8.7 Assistant de création campagne

Flow :

```text
1. Choisir l’objectif
2. Choisir source : bien / zone / widget / landing / kit
3. Choisir canal
4. Choisir zone
5. Choisir budget
6. Choisir durée
7. Vérifier conformité
8. Prévisualiser créatifs
9. Lancer
```

## 8.8 Campagne locale — écran détail

Zones :

1. Résumé ;
2. Budget ;
3. Ciblage ;
4. Créatifs ;
5. Landing ;
6. KPI ;
7. Recommandations ;
8. Historique.

KPI :
- impressions ;
- reach ;
- clics ;
- CTR ;
- leads ;
- CPL ;
- RDV ;
- estimations ;
- mandats ;
- dépense ;
- fréquence ;
- score qualité.

## 8.9 Conformité logement

Pour les campagnes immobilières :
- catégorie logement activée ;
- pas de ciblage âge / situation familiale / origine ;
- géographie conforme ;
- exclusion de formulations discriminantes ;
- traçabilité des validations.

## 8.10 Comptes connectés

Affiche :
- Meta ;
- Google ;
- TikTok ;
- LinkedIn ;
- Google Business Profile ;
- Email/SMS provider.

Pour chaque compte :
- statut ;
- pages disponibles ;
- comptes publicitaires ;
- permissions ;
- date d’expiration token ;
- CTA reconnecter ;
- dernier test API.

---

# 9. Sous-section 5 — Interactions

**Route :** `/app/studio-marketing/interactions`

## 9.1 Rôle

Interactions est l’inbox marketing.

Elle répond à :

> Quelles réponses générées par mes publications, landing pages ou campagnes dois-je traiter maintenant ?

Ce n’est pas un CRM. C’est une file de tri et de conversion.

## 9.2 Sources d’interaction

```text
Formulaire landing
Formulaire campagne Meta
DM Instagram
Message Facebook
Commentaire Instagram
Commentaire Facebook
Appel Google Business
Message Google
Réponse email
Clic WhatsApp
Réponse SMS
```

## 9.3 Layout

```text
Interactions
Transformez les réponses marketing en leads et actions commerciales.

Tabs :
Toutes · À traiter · Messages · Commentaires · Formulaires · Appels · Converties · Ignorées

Table / inbox
```

## 9.4 Colonnes

```text
Type
Contact
Message
Bien / campagne
Canal
Intention détectée
Priorité
Assigné
Reçu le
Action
```

## 9.5 Drawer interaction

Zones :

1. Message complet ;
2. Contexte source ;
3. Bien / campagne lié ;
4. Historique contact ;
5. Suggestion Propsight ;
6. Actions.

Actions :
- répondre ;
- créer lead ;
- associer à lead existant ;
- créer action ;
- créer RDV ;
- ouvrir bien ;
- ouvrir campagne ;
- ignorer ;
- assigner.

## 9.6 Détection d’intention

Intentions :

```text
Demande visite
Question prix
Question financement
Demande estimation
Vente potentielle
Location potentielle
Investissement
Hors cible
Spam
```

## 9.7 Création / association lead

Si module Leads actif :

```text
Créer lead
Associer à lead existant
Créer action
Créer RDV
```

Le lead reçoit :
- source marketing ;
- canal ;
- campagne ;
- publication ;
- bien ;
- message initial ;
- UTM ;
- coût associé ;
- agent assigné.

Si module Leads non actif :
- interaction reste dans l’inbox ;
- export CSV possible ;
- CTA upsell pédagogique.

## 9.8 Règles anti-doublon

Avant création lead :
- recherche email ;
- téléphone ;
- nom ;
- profil social ;
- bien associé ;
- campagne ;
- lead déjà ouvert.

Si doublon probable :
> “Ce contact ressemble à un lead existant.”

---

# 10. Sous-section 6 — Performance

**Route :** `/app/studio-marketing/performance`

## 10.1 Rôle

Performance mesure l’impact business du module.

Elle répond à :

> Quels canaux, contenus, biens, agents et campagnes génèrent vraiment du business ?

Elle doit aller au-delà des métriques sociales.

## 10.2 Couches de lecture

```text
1. Performance marketing
2. Performance conversion
3. Performance business
4. Performance par canal
5. Performance par bien
6. Performance par collaborateur
7. Performance par zone
```

## 10.3 KPI

KPI haut de page :

```text
Impressions
Clics
Interactions
Leads
RDV
Estimations
Mandats
CA pipe
Dépense
CPL
Coût par RDV
Coût par mandat
```

## 10.4 Funnel d’attribution

Visualisation principale :

```text
Impressions
→ Clics
→ Interactions
→ Leads
→ Leads qualifiés
→ RDV
→ Estimations
→ Avis de valeur
→ Mandats
→ Signature
```

Chaque étape affiche :
- volume ;
- taux de conversion ;
- coût ;
- delta ;
- canal dominant.

## 10.5 Analyse par canal

Table :

```text
Canal
Impressions
Clics
CTR
Interactions
Leads
Taux qualification
RDV
Mandats
Dépense
CPL
Coût mandat
ROI estimé
```

## 10.6 Analyse par bien

Table :

```text
Bien
Statut
Canaux
Vues
Clics
Leads
RDV
Offres
Mandats
Dépense
CPL
Score marketing
Action recommandée
```

## 10.7 Analyse par contenu

Permet de répondre :

> Quels angles de contenu marchent ?

Dimensions :
- prix vs marché ;
- quartier ;
- DPE ;
- rénovation ;
- rendement ;
- luxe ;
- mandat exclusif ;
- “nouveau prix” ;
- “visite virtuelle” ;
- “estimation gratuite”.

## 10.8 Analyse par zone

Dimensions :
- arrondissement ;
- commune ;
- quartier ;
- IRIS ;
- zone agence.

Exemples :
```text
Paris 15e : meilleur CPL sur campagnes vendeurs
Lyon 6e : beaucoup d’engagement mais faible conversion
Bordeaux Chartrons : LinkedIn performe mieux sur investissement
```

## 10.9 Analyse par collaborateur

Si Équipe activé :
- kits créés ;
- biens promus ;
- campagnes lancées ;
- interactions traitées ;
- leads générés ;
- taux de conversion ;
- coût par lead ;
- mandats attribués.

## 10.10 Attribution

Niveaux :

```text
last click
first click
assisté
pondéré
manuel
```

Le système doit afficher quand l’attribution est incomplète.

Exemple :
> “Ce mandat est attribué à 60 % au widget estimation et 40 % à une campagne Meta.”

## 10.11 Recommandations performance

Exemples :
```text
Dupliquez le format “quartier + prix juste” sur 3 biens similaires.
Réduisez le budget LinkedIn : CPL 2,4x supérieur à Meta.
Relancez les interactions Google : fort taux RDV.
Le canal Email convertit peu en volume mais fort en mandat.
```

---

# 11. Sous-section 7 — Bibliothèque

**Route :** `/app/studio-marketing/bibliotheque`

## 11.1 Rôle

La Bibliothèque capitalise la mémoire marketing de l’agence.

Elle répond à :

> Quels contenus, templates, visuels, plans marketing et scripts puis-je réutiliser ?

## 11.2 Contenus

```text
Kits marketing
Assets texte
Posts sociaux
Visuels
Scripts vidéo
Plans marketing AdV
Templates de ton
Templates de charte
Templates de canaux
Templates campagne
Landing pages
Emails
SMS
```

## 11.3 Layout

```text
Bibliothèque
Réutilisez vos meilleurs contenus et standardisez la communication de l’agence.

Tabs :
Kits · Assets · Templates · Visuels · Plans AdV · Archives

Recherche + filtres
Grille ou table
```

## 11.4 Filtres

```text
Type asset
Canal
Zone
Type bien
Objectif
Auteur
Performance
Date
Statut
Template agence
```

## 11.5 Card asset

Affiche :
- preview ;
- type ;
- canal ;
- bien source ;
- performance ;
- date ;
- auteur ;
- tags ;
- CTA réutiliser.

## 11.6 Templates

Types :

```text
Charte visuelle
Ton de voix
Pack canaux
Plan marketing AdV
Campagne vendeurs
Campagne acquéreurs
Campagne investisseur
Mandat exclusif
Nouveau prix
Bien premium
DPE travaux
```

## 11.7 Mémoire de performance

Chaque asset peut afficher :

```text
Utilisé 12 fois
Moyenne CPL : 18 €
Taux clic : 3,2 %
Meilleur sur : Instagram · Paris 15e · T3
```

## 11.8 Gouvernance équipe

Si Équipe activé :
- templates organisation ;
- templates équipe ;
- templates utilisateur ;
- validation manager ;
- verrouillage corporate ;
- recommandation de formation.

## 11.9 Réutilisation

Actions :
- réutiliser pour un nouveau bien ;
- dupliquer ;
- transformer en template ;
- envoyer vers Atelier ;
- programmer ;
- lancer campagne ;
- archiver.

---

# 12. Paramètres Studio Marketing

**Route :** `/app/parametres/studio-marketing`

## 12.1 Rôle

Centraliser les connexions, comptes, templates par défaut, tracking et règles de conformité.

## 12.2 Onglets

```text
Connexions
Comptes publicitaires
Charte & branding
Tracking
Templates
Conformité
Facturation média
Notifications
```

## 12.3 Connexions

Provider :
- Meta ;
- Google ;
- TikTok ;
- LinkedIn ;
- Google Business Profile ;
- Email ;
- SMS ;
- WhatsApp.

Pour chaque :
- statut ;
- permissions ;
- pages ;
- ad accounts ;
- token expiration ;
- reconnecter ;
- test.

## 12.4 Tracking

Paramètres :
- domaine landing ;
- UTM par défaut ;
- pixel Propsight ;
- Meta Pixel ;
- Google Tag ;
- conversions offline ;
- consentement cookies ;
- webhook.

## 12.5 Charte

Paramètres :
- logo ;
- couleur principale ;
- couleur secondaire ;
- police ;
- style overlay ;
- mentions légales ;
- signature agence ;
- signature conseiller.

## 12.6 Conformité

Règles :
- mentions obligatoires ;
- mots interdits ;
- logement / housing category ;
- validation manager ;
- disclaimer IA ;
- conservation prompts ;
- consentement email / SMS.

---

# 13. Intégration avec l’écosystème Propsight

## 13.1 Biens immobiliers

Studio ajoute un onglet Marketing dans la fiche bien :

```text
Statut marketing
Score publiabilité
Kit associé
Landing
Diffusion
Campagnes
Interactions
Performance
```

Actions :
- générer kit ;
- publier ;
- lancer campagne ;
- voir performance ;
- créer alerte.

## 13.2 Widgets publics

Studio peut envoyer du trafic vers :
- widget estimation vendeur ;
- widget projet investisseur.

Cas d’usage :
```text
Campagne Meta locale
→ lien widget estimation
→ lead vendeur
→ Leads
→ estimation rapide
→ avis de valeur
→ mandat
```

Les posts générés peuvent inclure un CTA secondaire :
> “Vous vendez aussi dans ce quartier ? Estimez votre bien gratuitement.”

## 13.3 Leads

Toutes les interactions converties deviennent des leads dans le pipeline unique.

Sources ajoutées :
```text
studio_marketing_landing
studio_marketing_instagram
studio_marketing_facebook
studio_marketing_google
studio_marketing_email
studio_marketing_ads_meta
studio_marketing_ads_google
studio_marketing_widget_rebond
```

Filtres Leads à prévoir :
- source Studio ;
- canal ;
- campagne ;
- bien ;
- coût d’acquisition ;
- attribution.

## 13.4 Estimation

Studio alimente :
- estimation rapide depuis lead marketing ;
- avis de valeur ;
- étude locative ;
- plan marketing dans rapport ;
- reporting vendeur.

Dans Avis de valeur :
- bloc `marketing` ;
- CTA “Générer plan marketing” ;
- badge “Plan à actualiser” si prix changé.

## 13.5 Observatoire

Studio consomme :
- marché ;
- tension ;
- contexte local ;
- profil cible ;
- profondeur solvable ;
- scores transport / commerces / écoles.

Utilisation :
- textes plus riches ;
- campagnes mieux ciblées ;
- plan marketing plus crédible ;
- recommandations.

## 13.6 Veille

Studio consomme :
- biens suivis ;
- alertes prix ;
- alertes stagnation ;
- concurrence agence ;
- baisse de prix.

Exemples :
```text
Bien stagnant 21 jours → générer kit “nouveau prix”
Agence concurrente très active → lancer campagne zone
Baisse de prix concurrente → ajuster angle commercial
```

## 13.7 Prospection

Studio peut transformer un signal en campagne :

```text
Signal DPE → campagne bailleurs rénovation
Signal DVF → campagne vendeurs zone
Radar chaud → campagne acquisition locale
```

## 13.8 Investissement

Studio peut produire des contenus investisseurs :
- opportunité à rendement ;
- dossier investisseur ;
- comparaison ville ;
- email base investisseurs ;
- post LinkedIn patrimonial.

## 13.9 Équipe

Équipe mesure :
- adoption Studio ;
- kits créés ;
- campagnes lancées ;
- interactions traitées ;
- leads marketing générés ;
- conversion par collaborateur ;
- besoin de coaching.

Règles de coaching :
```text
Agent avec biens actifs mais peu de kits
Campagnes lancées mais interactions non traitées
Taux conversion marketing inférieur équipe
Contenus sans datapoints malgré données disponibles
```

## 13.10 Performance

Studio nourrit :
- Performance personnelle ;
- Performance équipe ;
- sources ;
- CA pipe ;
- potentiel marché ;
- attribution.

---

# 14. Architecture technique

## 14.1 Services

```text
Studio Marketing Frontend
│
├── Atelier Service
├── Asset Service
├── Publication Service
├── Campaign Service
├── Interaction Service
├── Performance Service
├── Connector Service
├── Tracking Service
├── Recommendation Service
└── Compliance Service
```

## 14.2 Connecteurs

Architecture par adaptateurs :

```ts
interface MarketingConnector {
  provider: MarketingProvider;
  connect(): Promise<AuthUrl>;
  refreshToken(connectionId: string): Promise<void>;
  publish(payload: PublishPayload): Promise<PublishResult>;
  getMetrics(externalId: string): Promise<MetricResult>;
  delete?(externalId: string): Promise<void>;
}

interface AdsConnector {
  provider: AdsProvider;
  createCampaign(payload: CreateCampaignPayload): Promise<CreateCampaignResult>;
  updateBudget(campaignId: string, budget: number): Promise<void>;
  pause(campaignId: string): Promise<void>;
  getInsights(campaignId: string): Promise<PaidMetricResult>;
}
```

## 14.3 Job queue

Les actions asynchrones passent par queue :

```text
publish_post
refresh_metrics
launch_campaign
sync_interactions
refresh_tokens
send_email
send_sms
compute_attribution
generate_recommendations
```

## 14.4 Tracking

Chaque lien généré contient :
- `utm_source`;
- `utm_medium`;
- `utm_campaign`;
- `utm_content`;
- `asset_id`;
- `publication_id`;
- `campaign_id`;
- `bien_id`.

Tracking events :

```text
landing_view
cta_click
form_start
form_submit
phone_click
whatsapp_click
widget_start
widget_submit
lead_created
rdv_created
estimation_created
mandat_signed
```

## 14.5 Landing pages

Chaque bien peut avoir une landing :

```text
photo
description
points forts
données marché
DPE
carte
CTA visite
CTA dossier
CTA estimation
formulaire
tracking
```

URL :
```text
/a/[slug-bien]
```

Option marque blanche :
```text
agence.fr/bien/[slug]
```

---

# 15. API attendues

## 15.1 Atelier

```http
GET /api/studio/atelier/snapshot?source_type=&source_id=
POST /api/studio/atelier/generate
PATCH /api/studio/atelier/draft/{id}
POST /api/studio/atelier/regenerate
POST /api/studio/atelier/finalize
GET /api/studio/atelier/drafts
DELETE /api/studio/atelier/draft/{id}
POST /api/studio/atelier/plan-marketing/save
```

## 15.2 Annonces marketing

```http
GET /api/studio/marketing-properties
GET /api/studio/marketing-properties/{id}
PATCH /api/studio/marketing-properties/{id}
POST /api/studio/marketing-properties/{id}/score
```

## 15.3 Diffusion

```http
GET /api/studio/publications
POST /api/studio/publications
PATCH /api/studio/publications/{id}
POST /api/studio/publications/{id}/publish-now
POST /api/studio/publications/{id}/reschedule
DELETE /api/studio/publications/{id}
```

## 15.4 Campagnes

```http
GET /api/studio/campaigns
POST /api/studio/campaigns
GET /api/studio/campaigns/{id}
PATCH /api/studio/campaigns/{id}
POST /api/studio/campaigns/{id}/launch
POST /api/studio/campaigns/{id}/pause
POST /api/studio/campaigns/{id}/duplicate
GET /api/studio/campaigns/{id}/insights
```

## 15.5 Interactions

```http
GET /api/studio/interactions
GET /api/studio/interactions/{id}
PATCH /api/studio/interactions/{id}
POST /api/studio/interactions/{id}/create-lead
POST /api/studio/interactions/{id}/attach-lead
POST /api/studio/interactions/{id}/create-action
POST /api/studio/interactions/{id}/reply
```

## 15.6 Performance

```http
GET /api/studio/performance/overview
GET /api/studio/performance/funnel
GET /api/studio/performance/channels
GET /api/studio/performance/properties
GET /api/studio/performance/campaigns
GET /api/studio/performance/assets
GET /api/studio/performance/team
```

## 15.7 Bibliothèque

```http
GET /api/studio/library/assets
GET /api/studio/library/kits
GET /api/studio/library/templates
POST /api/studio/library/assets
POST /api/studio/library/templates
PATCH /api/studio/library/assets/{id}
PATCH /api/studio/library/templates/{id}
POST /api/studio/library/assets/{id}/reuse
DELETE /api/studio/library/assets/{id}
```

## 15.8 Connecteurs

```http
GET /api/studio/connections
POST /api/studio/connections/{provider}/connect
POST /api/studio/connections/{provider}/callback
POST /api/studio/connections/{id}/refresh
DELETE /api/studio/connections/{id}
GET /api/studio/connections/{id}/accounts
GET /api/studio/connections/{id}/test
```

---

# 16. États UX

## 16.1 Empty states

### Aucun bien marketing
> Ajoutez un bien ou importez une annonce pour commencer à créer vos campagnes.

CTA :
- importer bien ;
- créer manuellement ;
- ouvrir Biens immobiliers.

### Aucun compte connecté
> Connectez vos comptes pour publier et mesurer vos performances.

CTA :
- connecter Meta ;
- connecter Google ;
- continuer en export manuel.

### Pas assez de données
> Les performances seront disponibles après vos premières publications.

### Module Leads absent
> Vous pouvez mesurer les clics et interactions. Activez Leads pour suivre la conversion jusqu’au mandat.

### Erreur publication
> La publication a échoué car le compte doit être reconnecté.

CTA :
- reconnecter ;
- réessayer ;
- exporter manuellement.

## 16.2 Loading

- skeleton par bloc ;
- shimmer léger ;
- progression génération ;
- statut publication asynchrone.

## 16.3 Erreurs

Types :
```text
TOKEN_EXPIRED
MISSING_PERMISSION
PUBLISH_FAILED
AD_REJECTED
INSUFFICIENT_DATA
COMPLIANCE_BLOCKED
RATE_LIMITED
CONNECTOR_UNAVAILABLE
```

Chaque erreur doit avoir :
- message utilisateur ;
- explication courte ;
- action de résolution.

---

# 17. Permissions

| Action | OWNER | ADMIN | AGENT | VIEWER |
|---|---:|---:|---:|---:|
| Voir Studio | ✓ | ✓ | ✓ | lecture |
| Créer kit | ✓ | ✓ | ✓ | ✗ |
| Publier | ✓ | ✓ | ✓ | ✗ |
| Lancer campagne payante | ✓ | ✓ | selon permission | ✗ |
| Modifier budget | ✓ | ✓ | selon permission | ✗ |
| Connecter comptes | ✓ | ✓ | ✗ | ✗ |
| Modifier templates org | ✓ | ✓ | ✗ | ✗ |
| Voir performance équipe | ✓ | ✓ | limitée | ✗ |
| Valider publication équipe | ✓ | ✓ | ✗ | ✗ |

---

# 18. Règles conformité

## 18.1 Mentions immobilières

Injection automatique selon cas :
- honoraires ;
- DPE ;
- GES ;
- surface Carrez ;
- copropriété ;
- mandat ;
- loi Hoguet ;
- prix ;
- loyer charges comprises / hors charges.

## 18.2 Publicité logement

Règles :
- pas de ciblage discriminant ;
- pas de mention d’âge, origine, situation familiale comme critère ;
- catégorie logement activée sur plateformes ads ;
- validation des textes avant sponsorisation.

## 18.3 RGPD

- consentement pour emailing ;
- opt-out ;
- conservation interactions ;
- conservation prompts ;
- données personnelles dans LLM ;
- export / suppression contact.

## 18.4 Responsabilité contenu

Le contenu généré doit être validé par l’agent avant publication.

UI :
```text
Le contenu généré doit être vérifié avant diffusion.
[✓ Je valide ce contenu]
```

---

# 19. Recommandations Propsight

## 19.1 Types de recommandations

```text
bien_a_promouvoir
bien_sous_performance
campagne_a_dupliquer
campagne_a_arreter
interaction_a_traiter
kit_a_generer
plan_adv_a_ajouter
budget_a_ajuster
canal_a_privilegier
zone_a_prospecter
contenu_a_regenerer
```

## 19.2 Structure

```ts
export interface MarketingRecommendation {
  recommendation_id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  explanation: string;
  business_impact: string;
  primary_cta: {
    label: string;
    href?: string;
    action?: string;
  };
  related_entity_type: 'bien' | 'campaign' | 'publication' | 'interaction' | 'zone' | 'lead';
  related_entity_id: string;
  created_at: string;
}
```

## 19.3 Exemples

```text
Le bien est visible mais ne convertit pas.
→ Régénérer l’accroche avec angle quartier.

Le CPL Meta est inférieur de 32 % à Google sur cette zone.
→ Déplacer 100 € de budget vers Meta.

47 leads acquéreurs matchent ce bien.
→ Envoyer email ciblé.

Le vendeur a ouvert l’avis de valeur 3 fois.
→ Ajouter plan marketing et relancer.
```

---

# 20. Arborescence fichiers

```text
/src/app/(app)/studio-marketing/
├── page.tsx
├── annonces/page.tsx
├── atelier/page.tsx
├── diffusion/page.tsx
├── interactions/page.tsx
├── performance/page.tsx
└── bibliotheque/page.tsx

/src/components/studio-marketing/
├── overview/
├── annonces/
├── atelier/
├── diffusion/
├── campagnes/
├── interactions/
├── performance/
├── bibliotheque/
├── shared/
└── settings/

/src/lib/studio-marketing/
├── attribution/
├── compliance/
├── connectors/
├── generation/
├── metrics/
├── recommendations/
├── tracking/
└── utils/

/src/types/
└── studio-marketing.ts

/src/stores/
└── studioMarketingStore.ts

/src/mocks/studio-marketing/
├── handlers.ts
├── fixtures.ts
├── generation.ts
├── metrics.ts
└── connectors.ts
```

---

# 21. Plan de livraison Claude Code conseillé

## Phase 1 — Socle

1. Types TypeScript.
2. Routes.
3. Navigation Pro.
4. Fixtures MSW.
5. Layouts de base.

## Phase 2 — Vue d’ensemble

1. KPI.
2. Actions recommandées.
3. Campagnes actives.
4. Interactions récentes.
5. Funnel attribution.

## Phase 3 — Mes annonces

1. Table.
2. Score publiabilité.
3. Drawer.
4. Actions.

## Phase 4 — Atelier

1. Source selector.
2. Inputs.
3. Data sidebar.
4. Outputs.
5. Édition.
6. Variantes.
7. Plan marketing AdV.

## Phase 5 — Diffusion & campagnes

1. Calendrier.
2. Publications.
3. Campagnes.
4. Comptes connectés mock.
5. Statuts.

## Phase 6 — Interactions

1. Inbox.
2. Drawer.
3. Conversion lead.
4. Déduplication mock.

## Phase 7 — Performance

1. Funnel.
2. Canal.
3. Bien.
4. Campagne.
5. Collaborateur.
6. Attribution.

## Phase 8 — Bibliothèque

1. Assets.
2. Kits.
3. Templates.
4. Réutilisation.

## Phase 9 — Intégrations transverses

1. Onglet Marketing dans fiche bien.
2. Bloc Plan marketing dans Avis de valeur.
3. Sources Leads.
4. Widget rebond.
5. Équipe adoption.
6. Performance globale.

---

# 22. Critères d’acceptation

## 22.1 Produit

- Un agent comprend en moins de 30 secondes quoi faire.
- Chaque section a un rôle clair.
- Aucun mini-CRM dupliqué.
- L’Atelier met en avant la donnée Propsight.
- La performance va jusqu’au lead, RDV, estimation, mandat.
- Le plan marketing AdV est activable et compréhensible.
- Les modules absents dégradent proprement l’expérience.

## 22.2 UX

- Desktop-first.
- Pas de page blanche.
- Pas de sidebar locale hors AppShell.
- CTA principal clair par écran.
- Drawers contextuels cohérents.
- États vides utiles.
- Erreurs actionnables.

## 22.3 Technique

- Types stricts.
- MSW complet.
- Routes stables.
- Query params avec nuqs.
- State local maîtrisé.
- Connecteurs abstraits.
- Jobs asynchrones simulables.
- Tracking unifié.

## 22.4 Business

- Studio vendable seul.
- Studio augmente la valeur des Widgets.
- Studio augmente la valeur d’Estimation.
- Studio nourrit Leads.
- Studio nourrit Équipe.
- Studio prouve un ROI via Performance.

---

# 23. Message produit final

Studio Marketing doit être présenté comme :

> **Le moteur de commercialisation de Propsight : il transforme chaque bien en kit marketing data-driven, diffuse sur les bons canaux, génère des leads, alimente le pipeline commercial et prouve le ROI jusqu’au mandat.**

Ce n’est pas :
```text
un Hootsuite immobilier
un Canva immobilier
un simple générateur d’annonces
un CRM
un outil de pige
```

C’est :
```text
la couche acquisition + diffusion + conversion + attribution de Propsight.
```

---

**Fin de la spécification complète Studio Marketing.**
