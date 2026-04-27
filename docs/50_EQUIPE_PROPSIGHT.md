# 50 — ÉQUIPE

**Version** : V2 consolidée (post-arbitrages revue v1)
**Statut** : prête pour Claude Code
**Périmètre** : `/app/equipe/vue`, `/app/equipe/activite`, `/app/equipe/portefeuille`, `/app/equipe/agenda`, `/app/equipe/performance`
**Persona V1 principal** : manager d'agence / responsable commercial (rôle `ADMIN`) + propriétaire d'organisation (rôle `OWNER`)
**Persona secondaire** : agent immobilier (rôle `AGENT`) avec vue limitée à ses propres données + moyenne équipe anonymisée
**Produit** : Propsight Pro
**Design** : desktop-first 1440–1600px · dense · premium · inspiration Linear / Attio · violet Propsight
**Stack cible** : Next.js 15 App Router · TypeScript strict · Tailwind v4 · shadcn/ui · TanStack Query v5 · MSW v2 · nuqs · Zustand si nécessaire

**Changements majeurs vs v1** :
- Rôles alignés sur l'archi Propsight globale : 4 rôles (`OWNER`, `ADMIN`, `AGENT`, `VIEWER`) au lieu de 5.
- `TeamScopeType` V1 réduit à `'agence'` uniquement (hiérarchie multi-niveaux repoussée V2).
- Inbox leads non assignés : owner = Kanban Leads (`/app/activite/leads`), Équipe = compteur + lien.
- Algorithme de recommandation d'assignation V1 = zone + charge uniquement.
- Insights de coaching = catalogue fermé de 11 règles codées (listées en §17).
- Méthodologie qualité des livrables explicitée en §9.7 (liste critères + formule).
- Layout Vue équipe refondu : fusion "À surveiller / Coaching / Adoption" en un bloc à tabs internes.
- Table Collaborateurs : 8 colonnes par défaut + "Configurer colonnes".
- Performance business : partage de la lib de calcul avec Mon activité > Performance.
- Gestion des membres (invitation, édition, désactivation) vit dans Paramètres > Membres, Équipe redirige.
- Score de charge V1 sans temps dispo agenda (intégration calendrier = V1.5).
- Bloc "Absences déclarées" ajouté sur Agenda & charge (saisie manuelle V1).
- Brief RDV = drawer `?rdv=xxx` avec onglet Brief.

---

# 0. Résumé exécutif

La section **Équipe** est la surcouche manager de Propsight.

Elle ne crée pas un CRM parallèle. Elle agrège les objets déjà existants — leads, actions, biens, estimations, rapports, opportunités, dossiers, alertes, notifications, zones et collaborateurs — pour répondre à une question :

> Comment mon équipe transforme-t-elle la donnée Propsight en actions, rapports, mandats, signatures et chiffre d'affaires ?

La section Équipe doit permettre au manager de :

1. visualiser la santé collective ;
2. identifier les blocages commerciaux ;
3. réassigner les leads / actions / dossiers ;
4. suivre la qualité des livrables ;
5. piloter la charge et l'agenda ;
6. mesurer la performance business ;
7. comprendre l'adoption de Propsight ;
8. détecter les besoins de coaching / formation ;
9. relier activité commerciale et potentiel de marché.

**Promesse produit :**

> Propsight ne montre pas seulement qui travaille. Propsight montre comment l'équipe transforme la donnée en mandats, où le funnel bloque, et quelles actions lancer pour améliorer la performance.

---

# 1. Décisions V1 figées

Ces décisions sont actées. Ne plus rouvrir sans nouvelle session d'arbitrage.

| # | Sujet | Décision V1 |
|---|---|---|
| 1 | Sous-sections | 5 : Vue équipe · Activité commerciale · Portefeuille & dossiers · Agenda & charge · Performance business |
| 2 | Routes | `/app/equipe/vue`, `/app/equipe/activite`, `/app/equipe/portefeuille`, `/app/equipe/agenda`, `/app/equipe/performance` |
| 3 | Route racine | `/app/equipe` → redirection serveur vers `/app/equipe/vue` |
| 4 | Rôle produit | Surcouche manager transverse, pas module isolé |
| 5 | Pipeline commercial | Reste dans `Mon activité > Leads`, aucun Kanban équipe en V1 |
| 6 | Favoris / biens suivis | Source unique = `Veille > Biens suivis`, pas de favoris équipe |
| 7 | Fiche bien | Reste le pivot transverse pour biens, annonces, DVF, estimations, dossiers, actions |
| 8 | Adoption & coaching | Couche transverse obligatoire, mais pas sous-section sidebar V1 |
| 9 | Comparaison collaborateurs | Orientée coaching, jamais classement humiliant |
| 10 | Vue manager | Actionnable : chaque KPI / ligne / alerte doit renvoyer vers une action ou un module source |
| **A** | **Rôles Propsight** | **4 rôles stricts** : `OWNER`, `ADMIN`, `AGENT`, `VIEWER`. Pas de rôle "manager" ni "assistant". Un `ADMIN` joue le rôle manager de fait. |
| **B** | **TeamScope V1** | **Enum V1 = `'agence'` uniquement**. Les types `reseau`, `region`, `equipe`, `collaborateur` sont hors scope V1 (V2 quand hiérarchie multi-agence livrée). |
| **C** | **Inbox leads non assignés** | **Owner = Kanban Leads** (`/app/activite/leads?assigne=null`). Équipe affiche un compteur + CTA vers Kanban filtré, pas une table dupliquée. Un `AssignModal` léger permet l'assignation rapide depuis Équipe sans changer de page. |
| **D** | **Algo recommandation assignation V1** | **Inputs V1 = zone + charge uniquement**. Historique conversion, spécialité, disponibilité agenda repoussés V1.5 (dépendent de data à accumuler + OAuth calendrier). |
| **E** | **Insights de coaching** | **Catalogue fermé de 11 règles codées en dur** (§17). Pas de LLM en V1. Chaque insight = condition déclarative + template de phrase + CTA. Pas de saisie manuelle par le manager. |
| **F** | **Qualité des livrables** | **Scoring déterministe par critères booléens** (§9.7). 7 critères par rapport, formule `complet = 100% des critères vrais`. Affiché en `rapports complets / total` + taux par critère individuel. |
| **G** | **Layout Vue équipe** | **Fusion** des 3 blocs "À surveiller / Coaching / Adoption" en **un seul bloc à tabs internes** pour tenir sur 1440×900 sans scroll de page. |
| **H** | **Table Collaborateurs** | **8 colonnes par défaut** : Collaborateur, Zone, Leads actifs, Actions retard, RDV semaine, Mandats, CA pipe, Charge. Bouton "Configurer colonnes" pour ajouter les 5 autres (Rôle, Estimations, Rapports envoyés, Rapports ouverts, Tendance). |
| **I** | **KPI owner Équipe vs Mon activité** | **Même lib de calcul** (`/src/lib/performance/`). Différence = filtre scope : `scope=me` pour Mon activité, `scope=equipe` pour Équipe. Aucune duplication de logique métier. |
| **J** | **Gestion des membres** | **Vit dans `/app/parametres/membres`** (invitation, édition rôle, désactivation). Équipe est en **lecture seule** pour les données membres. Tout CTA "inviter" ou "éditer collaborateur" redirige vers Paramètres. |
| **K** | **Score de charge V1** | **Calcul sans temps dispo agenda**. Inputs V1 = `actions_open + actions_overdue + rdv_count + leads_active + rapports_a_relancer + dossiers_active`. Intégration calendrier (Google/Outlook) + facteur "temps dispo" = V1.5. |
| **L** | **Absences / congés V1** | **Saisie manuelle** dans Équipe > Agenda & charge. Un manager saisit `collaborateur + période + type` (congé, maladie, formation). Pas de workflow de validation RH en V1. |
| **M** | **Brief RDV** | **Drawer `?rdv=xxx`** ouvert depuis n'importe quelle ligne RDV dans Équipe ou Agenda individuel, avec onglet "Brief" qui génère automatiquement les infos de préparation. |
| 11 | Permissions | Accès dépendant des 4 rôles stricts (voir §12). |
| 12 | Réseau / multi-agence | Hors scope V1 — type `agence` unique. V2 livre la hiérarchie. |
| 13 | IA | Pas de gros bloc IA dans le body ; suggestion compacte dans drawer / panneaux d'aide |
| 14 | Benchmark Yanport | Enseignements intégrés explicitement dans Adoption, Reporting, Qualité livrables, Assignation leads, API/CRM, Potentiel marché |

---

# 2. Benchmark Yanport — enseignements intégrés

Cette section formalise ce que les cas clients Yanport enseignent pour Propsight Équipe. Ces enseignements ne sont pas là pour copier Yanport, mais pour ancrer la spec dans des besoins réels d'agences, réseaux, mandataires, promoteurs, banques et acteurs data-driven.

## 2.1 Sergic — reporting usage, management et formation

Le cas Sergic montre que l'avis de valeur n'est pas seulement une estimation : c'est un support commercial personnalisé pour conquérir des mandats. Le point le plus important pour Équipe : les managers veulent visualiser l'utilisation de l'application par les conseillers — volumétrie d'estimations, études créées, utilisateurs actifs — afin d'identifier les besoins de formation.

**Impact Propsight :**

- bloc `Adoption Propsight` obligatoire (tab dans le bloc fusionné §7.5) ;
- bloc `Coaching recommandé` obligatoire (tab dans le bloc fusionné §7.5) ;
- suivi des estimations créées, avis de valeur envoyés, études locatives créées, rapports ouverts ;
- détection des collaborateurs qui utilisent l'outil mais ne transforment pas → règle coaching §17.3.

## 2.2 Dôme — intégration CRM et rapport en un clic

Le partenariat Dôme montre l'importance de l'intégration dans le logiciel métier : avis de valeur généré en un clic, sans jongler entre plateformes.

**Impact Propsight :**

- chaque objet doit avoir une `source` ;
- les sources externes doivent être traçables : widget, CRM, import, API, manuel ;
- prévoir une logique future `webhooks / CRM / exports` ;
- dans Équipe, le manager doit savoir d'où viennent les leads et les rapports.

## 2.3 Square Habitat — étude locative comme livrable commercial

Square Habitat utilise les études locatives pour justifier un loyer, gagner du temps et produire un support crédible avec données marché, socio-économie, tension locative et réglementations.

**Impact Propsight :**

- les études locatives sont des objets business suivis au même niveau que les avis de valeur ;
- qualité des études locatives visible dans `Portefeuille & dossiers` (§9.7) ;
- relance post-ouverture des études ;
- conversion bailleur / mandat de gestion / action commerciale.

## 2.4 iad — réseau, prospection, veille concurrentielle, API

Le cas iad montre un besoin réseau massif : prospection, pige, veille concurrentielle, avis de valeur sur-mesure, estimation en ligne via API, mutualisation des actions.

**Impact Propsight :**

- **V1** : structure `agence` unique, pas de hiérarchie ;
- **V2** : modèle scalable réseau → région → agence → équipe → collaborateur (préfiguré par `TeamScope` mais non exposé V1) ;
- filtres hiérarchiques prévus pour V2 ;
- suivi des actions de prospection par équipe ;
- adoption et performance par périmètre.

## 2.5 Carmen Immobilier — estimateur, leads entrants, assignation manager

Carmen illustre le flux parfait : estimateur en ligne → lead → assignation manager → actions commerciales → export CRM.

**Impact Propsight :**

- compteur `Leads entrants non assignés` exposé sur Vue équipe, lien vers Kanban Leads filtré ;
- `AssignModal` depuis Équipe pour assignation rapide ;
- recommandation collaborateur basée sur zone + charge (V1) ;
- suivi des leads widget non traités ;
- passage fluide vers actions, RDV, relances.

## 2.6 Optimhome / Capifrance — API, indicateurs marché, comparables

Les réseaux de mandataires utilisent des indicateurs marché et des comparables pour alimenter leurs avis de valeur internes.

**Impact Propsight :**

- qualité des livrables = présence de comparables, contexte local, justification AVM ;
- bloc `Qualité des livrables` obligatoire (§9.7) ;
- suivi des rapports incomplets ou pauvres en données.

## 2.7 Khome — fiabilité, valeur de référence, écarts et risques

Khome compare plusieurs fournisseurs de données, mesure les écarts, analyse la fiabilité et arbitre une valeur de référence.

**Impact Propsight :**

- détecter les rapports avec `écart AVM > 5 %` non justifié → critère qualité §9.7 ;
- suivre les objets à faible score de confiance ;
- afficher la méthodologie / fiabilité dans les drawers KPI ;
- prévoir des alertes qualité méthodologique.

## 2.8 Khor Immobilier — marché, stock, segmentation, potentiel

Khor utilise Data 360 et l'API pour comprendre les volumes, les typologies, le stock, les prix et les agences actives sur une zone.

**Impact Propsight :**

- couche `Marché & potentiel` dans Performance business (§11.7) ;
- lib de calcul partagée avec Mon activité > Performance (§1 #I) ;
- part captée, marché adressable, potentiel CA restant ;
- zones sous-exploitées ;
- segments à attaquer.

## 2.9 Proprioo — l'information transformée en business

Proprioo insiste sur l'usage quotidien : l'information de qualité est transformée en business par les agents.

**Impact Propsight :**

- funnel central : data / signal → action → lead → estimation → rapport → relance → mandat ;
- l'activité produit doit être liée à la performance commerciale ;
- pas de reporting passif.

## 2.10 homeloop — API + data temps réel + expertise humaine

homeloop combine algorithmes, API, annonces agrégées en temps réel et expertise humaine.

**Impact Propsight :**

- distinguer estimation auto, ajustement humain, justification, confiance ;
- mesurer l'écart moyen agent vs AVM ;
- suivre les estimations ajustées et leur transformation business.

## 2.11 Règles produit issues du benchmark

1. Le rapport est une arme commerciale, pas un PDF.
2. Le manager pilote l'adoption et les besoins de formation.
3. Les leads entrants doivent être assignés rapidement.
4. La qualité des livrables doit être mesurée.
5. L'activité commerciale doit être reliée au potentiel marché.
6. Les sources/API/CRM doivent être traçables.
7. Le but n'est pas de surveiller les agents, mais d'améliorer la transformation donnée → mandat.

---

# 3. Place dans l'architecture Propsight

## 3.1 Sidebar Pro

```text
👥 Équipe
   ├ Vue équipe                  /app/equipe/vue
   ├ Activité commerciale        /app/equipe/activite
   ├ Portefeuille & dossiers     /app/equipe/portefeuille
   ├ Agenda & charge             /app/equipe/agenda
   └ Performance business        /app/equipe/performance
```

Visible uniquement pour les rôles `OWNER` et `ADMIN` dans la sidebar. Les rôles `AGENT` et `VIEWER` voient la section avec un contenu adapté (voir §12).

## 3.2 Routes

| Route | Description | Rôles |
|---|---|---|
| `/app/equipe` | Redirection serveur vers `/app/equipe/vue` | Tous |
| `/app/equipe/vue` | Cockpit manager : santé, blocages, adoption, coaching | OWNER, ADMIN (complet) · AGENT (vue dégradée) |
| `/app/equipe/activite` | Vue collective des leads, actions, relances, signaux, assignations | OWNER, ADMIN (complet) · AGENT (ses propres objets) |
| `/app/equipe/portefeuille` | Vue collective des biens, estimations, rapports, dossiers, opportunités | OWNER, ADMIN (complet) · AGENT (ses propres objets) |
| `/app/equipe/agenda` | Planning, charge, disponibilité, retards, réassignation | OWNER, ADMIN · AGENT (son agenda + charge équipe anonymisée) |
| `/app/equipe/performance` | Funnel, CA, mandats, adoption, potentiel marché | OWNER, ADMIN (détail nominatif) · AGENT (ses KPI + moyenne équipe anonymisée) |

## 3.3 Query params communs

Pilotables via `nuqs` sur toutes les pages Équipe :

| Param | Exemple | Effet |
|---|---|---|
| `periode` | `periode=30j` | Filtre période (7j, 30j, 90j, 12m) |
| `collaborateur` | `collaborateur=user_sophie` | Filtre collaborateur |
| `zone` | `zone=paris-15` | Filtre zone |
| `source` | `source=widget_estimation` | Filtre source |
| `type` | `type=rapport` | Filtre type objet |
| `status` | `status=en_retard` | Filtre statut |
| `preset` | `preset=rapports-ouverts-sans-relance` | Vue rapide préfiltrée |
| `drawer` | `drawer=collaborateur:user_sophie` | Ouvre drawer collab |
| `rdv` | `rdv=rdv_1234` | Ouvre drawer RDV avec onglet Brief |
| `assign` | `assign=lead_5678` | Ouvre AssignModal pour un objet |

## 3.4 Interactions URL / drawer

- Clic row/card → écrit le query param correspondant dans l'URL → drawer s'ouvre via hook d'écoute.
- Esc ou clic X → retire le param → drawer se ferme.
- Partage d'URL = partage de l'état complet (tab, filtres basiques, drawer ouvert).
- Les filtres multi-valeurs complexes restent dans le state local Zustand pour ne pas polluer l'URL.

## 3.5 Redirection route racine

Implémentation Next.js 15 :

```ts
// app/equipe/page.tsx
import { redirect } from 'next/navigation';
export default function EquipeRoot() {
  redirect('/app/equipe/vue');
}
```

Pas de page "hub" Équipe V1. On va direct au cockpit manager.

---

# 4. Principes transverses non négociables

## 4.1 Équipe est une surcouche, pas un silo

Équipe lit et agrège les objets du produit. Elle ne remplace pas leurs modules sources.

```text
Lead → Mon activité > Leads
Action → Mon activité / Objet lié
Bien → Biens immobiliers
Estimation → Estimation
Rapport → Estimation / Investissement
Signal → Prospection
Notification → Veille
Dossier → Investissement
Zone → Observatoire
Bien suivi → Veille > Biens suivis
Membre (invitation, édition) → Paramètres > Membres
```

## 4.2 Pas de Kanban équipe

Le pipeline commercial unique vit dans `Mon activité > Leads`.

Équipe peut afficher :
- des vues **filtrées** (tables, compteurs) ;
- des **raccourcis** vers Kanban Leads filtré ;
- un **AssignModal** pour l'assignation rapide (n'ouvre pas une page, juste un modal).

Équipe ne recrée **jamais** un pipeline autonome avec colonnes déplaçables.

Exemples de liens contextuels :

```text
/app/activite/leads?assigne=null
/app/activite/leads?owner=sophie
/app/activite/leads?source=widget_estimation
/app/activite/leads?stage=atraiter
```

## 4.3 Chaque ligne doit être actionnable

Une donnée affichée dans Équipe doit servir à :

- assigner ;
- réassigner ;
- relancer ;
- ouvrir un objet source ;
- créer une action ;
- expliquer un blocage ;
- identifier un besoin de coaching.

Les KPI purement décoratifs sont proscrits.

## 4.4 Les favoris restent dans Veille

Pas de `Favoris équipe`.

Le clic ♡ dans n'importe quel module alimente `Veille > Biens suivis`. Équipe peut lire les biens suivis par collaborateur (au travers du drawer Collaborateur), mais ne crée pas une nouvelle source.

## 4.5 La gestion des membres vit dans Paramètres

Toute action qui modifie un collaborateur (inviter, changer de rôle, désactiver, réinitialiser MDP, changer email) vit dans `/app/parametres/membres`.

Équipe est en **lecture seule** sur les données membres :
- affiche l'annuaire enrichi avec les KPI d'activité ;
- ouvre un drawer collaborateur en consultation ;
- redirige vers Paramètres > Membres pour toute édition ;
- les empty states avec CTA "Inviter un membre" pointent vers `/app/parametres/membres?action=invite`.

## 4.6 Manager = aide à la priorisation, pas surveillance

Le wording doit éviter l'effet surveillance.

Préférer :

```text
Coaching recommandé
Charge élevée
Relance utile
Objet à débloquer
Zone sous-exploitée
```

Éviter :

```text
Mauvais collaborateur
Classement des agents
Sous-performance personnelle
Surveillance d'activité
```

## 4.7 Lib de calcul partagée avec Mon activité > Performance

Tous les KPIs business (CA réalisé, CA pipe, funnel, taux conversion, marché & potentiel, part captée) utilisent la même lib de calcul `/src/lib/performance/`.

La différence entre `Mon activité > Performance` (perso) et `Équipe > Performance` (collectif) est **un filtre de scope**, pas une logique métier distincte :

```ts
// Mon activité > Performance
calculerCA({ scope: 'me', userId: currentUser.id, periode: '30j' });

// Équipe > Performance
calculerCA({ scope: 'equipe', organizationId: currentOrg.id, periode: '30j' });
```

Cela garantit :
- zéro dérive entre les deux modules ;
- un seul endroit à maintenir pour les changements de calcul ;
- des hypothèses modifiables partagées (taux commission, panier moyen, etc.).

## 4.8 Rôles stricts (alignés Propsight global)

4 rôles seulement : `OWNER`, `ADMIN`, `AGENT`, `VIEWER`.

Tout besoin de rôle intermédiaire (manager d'équipe, assistant, comptable) est traité par les permissions fines sur les pages, pas par un nouveau rôle V1. Un `ADMIN` joue le rôle manager de fait.

---

# 5. Data models

## 5.1 Collaborateur

```ts
export type CollaborateurRole = 'OWNER' | 'ADMIN' | 'AGENT' | 'VIEWER';
export type CollaborateurStatus = 'active' | 'invited' | 'disabled';

export type Collaborateur = {
  user_id: string;
  organization_id: string;
  display_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  role: CollaborateurRole;
  status: CollaborateurStatus;
  zones: ZoneRef[];
  specialites: CollaborateurSpecialite[];
  capacity_weekly_hours?: number;   // V1: default 35 si non renseigné. Saisie dans Paramètres > Membres.
  last_seen_at?: string;            // ISO timestamp dernière connexion
  created_at: string;
  updated_at: string;
};

export type CollaborateurSpecialite =
  | 'vente'
  | 'achat'
  | 'location'
  | 'investissement'
  | 'estimation'
  | 'gestion_locative';
```

**Règle V1** : `capacity_weekly_hours` est saisi dans `/app/parametres/membres` lors de l'invitation ou de l'édition. Valeur par défaut = 35h. Utilisée en V1 uniquement pour l'affichage, pas pour le calcul du score de charge (voir §10.5).

## 5.2 TeamScope

```ts
// V1 : un seul type exposé
export type TeamScopeTypeV1 = 'agence';

// V2+ : hiérarchie complète (réservé, non exposé V1)
export type TeamScopeTypeV2 =
  | 'agence'
  | 'equipe'
  | 'region'
  | 'reseau'
  | 'collaborateur';

export type TeamScope = {
  scope_id: string;
  type: TeamScopeTypeV1;           // V1 — changer en TeamScopeTypeV2 au moment de la livraison V2
  label: string;
  parent_scope_id?: string;         // V1 : toujours null. V2 : hiérarchie.
  organization_id: string;
};
```

**Règle V1** : un seul `TeamScope` par organisation, de type `'agence'`. Toutes les requêtes Équipe filtrent implicitement par `organization_id`. Le champ `parent_scope_id` est présent dans le type pour préparer V2, mais toujours `null` en V1.

## 5.3 Assignment

```ts
export type AssignableObjectType =
  | 'lead'
  | 'action'
  | 'bien'
  | 'estimation'
  | 'avis_valeur'
  | 'etude_locative'
  | 'opportunite'
  | 'dossier'
  | 'alerte'
  | 'notification'
  | 'signal';

export type Assignment = {
  assignment_id: string;
  object_type: AssignableObjectType;
  object_id: string;
  assignee_id: string;
  assigned_by: string;
  assigned_at: string;
  status: 'active' | 'done' | 'reassigned' | 'archived';
  note?: string;
  recommendation_score?: number;   // 0-100 si assignation via algo reco V1 (§D)
  recommendation_reason?: string;  // Ex: "zone Paris 15e, charge 42/100"
};
```

## 5.4 TeamObjective

```ts
export type TeamObjectivePeriod = 'month' | 'quarter' | 'year';

export type TeamObjective = {
  objective_id: string;
  organization_id: string;
  scope_id?: string;                        // V1 : toujours l'agence
  collaborator_id?: string;                 // Si null = objectif équipe
  period: TeamObjectivePeriod;
  period_start: string;
  period_end: string;
  ca_target: number;
  ca_pipe_target?: number;
  mandates_target: number;
  exclusive_mandates_target?: number;
  leads_target?: number;
  rdv_target?: number;
  avis_valeur_target?: number;
  etudes_locatives_target?: number;
  signaux_traites_target?: number;
  part_captee_target?: number;
  created_at: string;
  updated_at: string;
};
```

## 5.5 WorkloadSnapshot

```ts
export type WorkloadStatus = 'disponible' | 'normal' | 'charge' | 'surcharge';

export type WorkloadSnapshot = {
  collaborator_id: string;
  period_start: string;
  period_end: string;

  // Inputs V1 (§K)
  actions_open: number;
  actions_overdue: number;
  rdv_count: number;
  visits_count: number;
  leads_active: number;
  dossiers_active: number;
  rapports_a_relancer: number;
  opportunites_a_qualifier: number;

  // Output
  workload_score: number;      // 0-100 (§10.5)
  status: WorkloadStatus;

  // V1.5 (non exposé V1)
  // agenda_free_slots?: number;
  // agenda_capacity_used_pct?: number;
};
```

## 5.6 TeamActivityItem

```ts
export type TeamActivityType =
  | 'lead_created'
  | 'lead_assigned'
  | 'action_created'
  | 'action_done'
  | 'rdv_created'
  | 'estimation_created'
  | 'avis_envoye'
  | 'etude_envoyee'
  | 'rapport_opened'
  | 'relance_created'
  | 'signal_converted'
  | 'bien_suivi_added'
  | 'dossier_created'
  | 'mandat_signed';

export type TeamActivityItem = {
  activity_id: string;
  type: TeamActivityType;
  title: string;
  subtitle?: string;
  object_type: AssignableObjectType | 'rapport' | 'zone' | 'mandat';
  object_id: string;
  source_module: 'leads' | 'estimation' | 'prospection' | 'veille' | 'biens' | 'investissement' | 'observatoire' | 'equipe';
  collaborator_id?: string;
  priority?: 'haute' | 'moyenne' | 'basse';
  status?: string;
  event_at: string;
};
```

## 5.7 CoachingInsight

```ts
export type CoachingInsightType =
  | 'adoption_faible'
  | 'conversion_bloquee_avis_valeur'
  | 'conversion_bloquee_etude_locative'
  | 'relance_manquante_rapport'
  | 'charge_elevee'
  | 'qualite_livrable_faible'
  | 'zone_sous_exploitee'
  | 'signaux_prospection_non_traites'
  | 'estimations_non_promues'
  | 'ecart_avm_non_justifie'
  | 'mandat_simple_sous_pression';

export type CoachingInsight = {
  insight_id: string;
  rule_id: string;                          // Référence à une règle du catalogue §17
  scope: 'collaborateur' | 'equipe' | 'zone' | 'source';
  target_id?: string;                       // user_id / scope_id / zone_id / source_name
  target_label?: string;
  type: CoachingInsightType;
  title: string;
  explanation: string;
  recommended_action: string;
  cta_label: string;
  cta_target: string;                       // URL cible
  priority: 'haute' | 'moyenne' | 'basse';
  triggered_at: string;
  metric_snapshot?: Record<string, number>; // Valeurs ayant déclenché la règle
};
```

## 5.8 Absence

Nouveau type V1 pour la gestion manuelle des absences (§L, §10.8).

```ts
export type AbsenceType = 'conges' | 'maladie' | 'formation' | 'autre';

export type Absence = {
  absence_id: string;
  collaborator_id: string;
  type: AbsenceType;
  period_start: string;        // ISO date
  period_end: string;          // ISO date
  note?: string;
  created_by: string;           // user_id du manager qui a saisi
  created_at: string;
};
```

## 5.9 DeliverableQuality

Objet calculé pour le scoring qualité des livrables (§9.7).

```ts
export type DeliverableType = 'avis_valeur' | 'etude_locative' | 'dossier_invest';

export type DeliverableQualityCriterion =
  | 'couverture_personnalisee'
  | 'comparables_selectionnes'
  | 'contexte_local_present'
  | 'justification_avm'
  | 'relance_programmee'
  | 'branding_agence'
  | 'photos_bien';

export type DeliverableQuality = {
  deliverable_id: string;
  deliverable_type: DeliverableType;
  collaborator_id: string;
  criteria: Record<DeliverableQualityCriterion, boolean>;
  is_complete: boolean;        // true si tous les critères = true
  completeness_score: number;  // 0-100 : nb critères vrais / nb critères totaux × 100
  computed_at: string;
};
```

---

# 6. Layout commun Équipe

Toutes les pages utilisent le shell Pro existant : header, sidebar, drawers.

## 6.1 Structure standard

```text
Header Pro
Sidebar Pro
Page header         (sticky)
Filtres             (sticky)
KPI row             (sticky)
Vues rapides / tabs
Contenu principal dense (scroll interne uniquement)
Drawer contextuel
Drawer IA séparé
```

**Règle** : `<main className="h-screen flex flex-col overflow-hidden">`. Seul le contenu principal et les tables scrollent en interne. Le page header, les filtres, la KPI row ne scrollent jamais hors de vue.

## 6.2 Filtres communs

```text
[Période]
[Collaborateur]
[Zone]
[Source]
[Type objet]
[Statut]
```

Filtres persistés dans l'URL via `nuqs` (§3.3). Les filtres complexes (multi-valeurs, ranges) dans state Zustand local.

## 6.3 KPI row

- **5 tuiles maximum** sur les pages cockpit (Vue équipe, Activité, Portefeuille, Agenda).
- **6 à 7 tuiles possibles** uniquement dans Performance business.
- Chaque KPI est **cliquable** (route vers la page de détail) ou ouvre un **drawer explicatif**.
- Chaque KPI a une **définition disponible** (tooltip au survol + méthodo dans drawer).
- Chaque KPI a **delta + trend** par rapport à la période précédente.

## 6.4 Drawers

Tous les objets utilisent le même pattern :

```text
Header objet (nom, type, badges)
Key info (2-4 lignes)
Contexte (zone, source, dates)
Actions rapides (CTA principaux)
Liens inter-modules (chips vers les autres modules)
Timeline (événements par date)
Suggestion Propsight (compacte, optionnelle)
```

Drawers spécifiques à Équipe :

| Drawer | Param URL | Contenu |
|---|---|---|
| Collaborateur | `drawer=collaborateur:user_xxx` | Fiche collab + KPIs + activité + biens suivis |
| RDV | `rdv=rdv_xxx` | 3 onglets : Détails · Brief · Historique |
| AssignModal | `assign=lead_xxx` | Modal léger, pas drawer plein écran |

---

# 7. Sous-section 1 — Vue équipe

**Route** : `/app/equipe/vue`
**Rôle** : cockpit manager quotidien.

## 7.1 Intention

Répondre à :

> Qu'est-ce qui se passe dans mon équipe, où ça bloque, et quelles actions dois-je lancer maintenant ?

## 7.2 Layout V2 (refondu §G)

Le layout v1 avait 5 blocs qui ne tenaient pas sur 1440×900. V2 fusionne les 3 blocs "À surveiller / Adoption / Coaching" en **un seul bloc à tabs internes** nommé `Santé & coaching`.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Vue équipe                                                          │
│ Santé collective, blocages et coaching équipe.                      │
│                                         [Définir objectifs]         │
├─────────────────────────────────────────────────────────────────────┤
│ [Période] [Équipe] [Zone] [Source] [Collaborateur]                  │
├─────────────────────────────────────────────────────────────────────┤
│ KPI row : Leads actifs · Actions retard · RDV sem · Mandats · CA pipe│
├─────────────────────────────────────────────────────────┬───────────┤
│                                                         │           │
│ Bloc Collaborateurs                                     │ Santé &   │
│ Table 8 colonnes par défaut (§H)                        │ coaching  │
│ Scroll interne vertical                                 │           │
│                                                         │ Tabs :    │
│                                                         │ · À surv. │
│                                                         │ · Adoption│
│                                                         │ · Coaching│
│                                                         │           │
├─────────────────────────────────────────────────────────┴───────────┤
│ Leads non assignés (compteur + CTA vers Kanban filtré)              │
│ · 12 leads non assignés · 3 depuis +48h · [Voir dans Kanban] [Assigner]│
└─────────────────────────────────────────────────────────────────────┘
```

**Hauteurs indicatives** (1440×900) :
- Page header + filtres + KPI row : ~180px
- Zone contenu principale : ~560px (Collab à gauche, Santé & coaching à droite — 2/3 - 1/3)
- Bande Leads non assignés : ~60px
- Total : ~800px → tient dans 900px avec padding système

## 7.3 KPI row

5 tuiles.

| KPI | Exemple | Clic |
|---|---|---|
| Leads actifs | `128 · +12 vs semaine dernière` | `/app/activite/leads?scope=equipe` |
| Actions en retard | `18 · 5 haute priorité` | `/app/equipe/activite?preset=actions-retard` |
| RDV semaine | `34 · 9 visites · 12 estimations` | `/app/equipe/agenda?view=week` |
| Mandats en cours | `27 · 8 exclusifs` | `/app/equipe/portefeuille?type=mandats` |
| CA pipe pondéré | `286 450 € · +18 %` | `/app/equipe/performance?layer=business` |

Chaque tuile a un tooltip explicatif (définition + méthodo) au survol.

## 7.4 Bloc Collaborateurs

Table dense.

### Colonnes par défaut (§H)

8 colonnes :

```text
Collaborateur       (avatar + nom, 180px)
Zone                (chips, 120px)
Leads actifs        (nombre, 80px)
Actions retard      (nombre + priorité, 100px)
RDV semaine         (nombre, 80px)
Mandats             (nombre + exclusifs, 90px)
CA pipe             (montant, 110px)
Charge              (score + barre, 100px)
Actions             (menu ⋯, 40px)
```

Total : ~900px utilisables — tient dans 960px largeur disponible colonne gauche.

### Colonnes optionnelles (bouton "Configurer colonnes")

5 colonnes activables :

```text
Rôle                (badge OWNER/ADMIN/AGENT/VIEWER)
Estimations         (nombre période)
Rapports envoyés    (nombre période)
Rapports ouverts    (nombre + taux)
Tendance            (sparkline 30j)
```

### Actions ligne

```text
Voir                  → ouvre drawer Collaborateur (drawer=collaborateur:user_xxx)
Agenda                → /app/equipe/agenda?collaborateur=user_xxx
Performance           → /app/equipe/performance?collaborateur=user_xxx
Réassigner leads      → AssignModal bulk
Éditer (lien)         → /app/parametres/membres?edit=user_xxx (§J)
```

### Tri

Par défaut : tri par nom. Tri disponible sur toutes les colonnes numériques (Leads actifs, Actions retard, RDV, Mandats, CA pipe, Charge).

### État vide

Si aucun collaborateur sauf l'utilisateur connecté :

```text
Vous êtes seul dans votre organisation.
Invitez vos collaborateurs pour piloter l'activité collective.
[Inviter un membre →]
```

CTA pointe vers `/app/parametres/membres?action=invite` (§J).

## 7.5 Bloc Santé & coaching (fusion §G)

Panneau latéral avec 3 tabs. ~400px de large × ~560px de hauteur.

### Tab 1 — À surveiller (par défaut)

Liste de 6 à 8 signaux actionnables, triés par priorité. Ces signaux sont générés par le moteur de règles (§17).

Exemples :

```text
🔴 12 leads entrants non assignés
    Widget estimation · âge moyen 4h
    [Assigner depuis Kanban]

🟠 7 rapports ouverts sans relance
    5 AdV · 2 études locatives · plus anciens = 8j
    [Créer relances]

🟠 5 actions haute priorité en retard
    [Voir actions]

🟡 Sophie est en surcharge
    Charge 87/100 · +42 % vs moyenne équipe
    [Rééquilibrer]

🟡 14 estimations rapides non promues
    Potentiel 3 AdV
    [Voir estimations]

🟡 4 avis avec écart AVM > 5 %
    Justification manquante
    [Compléter]

⚪ Paris 15e : forte tension, faible prospection
    Part captée 1,4 % · potentiel 420 k€
    [Voir zone]

⚪ 3 mandats simples sous pression
    Concurrents actifs sur les zones
    [Voir veille]
```

Règles :
- Code couleur : 🔴 haute · 🟠 moyenne · 🟡 basse · ⚪ info
- Max 8 signaux affichés, "Voir tous (12)" si plus
- Chaque ligne = 1 titre + 1 sous-titre optionnel + 1 CTA unique
- Les signaux ignorés peuvent être masqués 7 jours (bouton "Masquer")

### Tab 2 — Adoption

KPI d'utilisation de l'outil sur la période filtrée.

```text
Utilisateurs actifs 7j              12 / 15    ████████░░  80 %
Estimations créées                  84         ▲ +18 %
Avis de valeur envoyés              37         ▲ +6 %
Études locatives créées             18         ▼ -12 %
Rapports ouverts                    21         ▲ +28 %
Signaux prospection traités         146        ▲ +42 %
Biens suivis ajoutés                58         ▲ +8 %
Alertes actives                     32         =
```

Chaque ligne cliquable → ouvre drawer explicatif avec répartition par collaborateur.

Bloc pied de tab :

```text
Adoption score équipe : 72 / 100
Basé sur : utilisateurs actifs, volumétrie estimations/avis, ratio ouverture/envoi.
[Voir méthodologie →]
```

### Tab 3 — Coaching recommandé

Liste d'insights générés par le catalogue de règles (§17). 4 à 6 insights max.

```text
💡 Marc crée des estimations mais envoie peu d'avis de valeur
   Estimations 30j : 12 · AdV envoyés : 2 · ratio 17 % (moyenne équipe : 44 %)
   → Coaching : préparation RDV vendeur
   [Planifier coaching] [Voir détails]

💡 Camille traite beaucoup de signaux DPE mais convertit peu en leads
   Signaux traités 30j : 38 · Leads créés : 3 · ratio 8 %
   → Coaching : script prospection DPE
   [Planifier coaching]

💡 Sophie a 4 rapports ouverts sans relance
   → Action : créer les relances aujourd'hui
   [Ouvrir activité]

💡 L'équipe location crée peu d'études locatives malgré 18 leads bailleurs
   → Action : campagne bailleurs
   [Lancer campagne]
```

Chaque insight a :
- ID de règle (§17)
- Explication data-driven (chiffres réels)
- CTA principal
- Bouton "Masquer 7 jours" pour éviter la nuisance

## 7.6 Bande Leads non assignés (§C)

Bande horizontale en bas de page, compacte.

```text
┌─────────────────────────────────────────────────────────────────────┐
│ 🟡 12 leads non assignés · 3 depuis +48h                            │
│                                        [Voir dans Kanban →] [Assigner]│
└─────────────────────────────────────────────────────────────────────┘
```

- **Pas de table** dans Vue équipe (la table vit dans le Kanban Leads).
- Clic "Voir dans Kanban" → `/app/activite/leads?assigne=null`.
- Clic "Assigner" → `AssignModal` en mode bulk, pré-rempli avec tous les leads non assignés.
- Si 0 lead non assigné : bande masquée.

## 7.7 Drawer Collaborateur

Ouvert via `?drawer=collaborateur:user_xxx`.

Structure :

```text
Header
  Avatar + nom + rôle + statut
  Zone(s) + spécialité(s)
  Dernière connexion

KPI perso (période filtrée)
  Leads actifs · Actions retard · RDV · Mandats · CA pipe · Estimations · AdV · Rapports ouverts

Charge
  Score + status + répartition des inputs

Activité récente
  Timeline 10 derniers événements

Biens suivis du collaborateur
  Top 5 avec lien vers Veille > Biens suivis filtré

Objets portés
  Raccourcis vers :
  - /app/activite/leads?owner=user_xxx
  - /app/equipe/portefeuille?collaborateur=user_xxx
  - /app/equipe/agenda?collaborateur=user_xxx

Actions manager
  Réassigner leads (bulk)
  Créer action pour ce collab
  Planifier coaching
  Éditer le membre → redirige Paramètres > Membres
```

---

# 8. Sous-section 2 — Activité commerciale

**Route** : `/app/equipe/activite`
**Rôle** : vue collective de l'exécution commerciale.

## 8.1 Intention

Répondre à :

> Qui traite quoi, quels leads avancent, quelles actions bloquent, et où faut-il intervenir ?

## 8.2 Objets affichés

```text
Lead
Action
Relance
RDV
Visite
Signal prospection
Notification veille à traiter
Rapport ouvert
Estimation à promouvoir
Avis de valeur à relancer
Étude locative à relancer
Opportunité invest à qualifier
```

Important : ces objets vivent dans leurs modules sources. Équipe les agrège en lecture + propose des actions (relancer, réassigner, créer action).

## 8.3 Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Activité commerciale                                                │
│ Suivez les leads, actions, relances et signaux traités par équipe. │
├─────────────────────────────────────────────────────────────────────┤
│ [Période] [Collaborateur] [Zone] [Source] [Type] [Priorité] [Statut]│
├─────────────────────────────────────────────────────────────────────┤
│ KPI : Actions réal. · Actions retard · Leads traités · Signaux · Rapp.│
├─────────────────────────────────────────────────────────────────────┤
│ [Tous] [En retard] [Sans prochaine action] [Rapports à relancer]    │
│ [Signaux non traités] [Opportunités invest]                         │
├─────────────────────────────────────────┬───────────────────────────┤
│                                         │                           │
│ Table activité commerciale              │ Panneau détails           │
│ Scroll interne                          │ (objet sélectionné)       │
│                                         │                           │
└─────────────────────────────────────────┴───────────────────────────┘
```

Note : le preset "Leads non assignés" a été **retiré** de cette page. Il vit dans `/app/activite/leads?assigne=null` (§C).

## 8.4 KPI row

5 tuiles.

| KPI | Exemple | Clic |
|---|---|---|
| Actions réalisées | `214 · +18 %` | Drawer détails actions |
| Actions en retard | `18 · 5 haute priorité` | Filtre preset `en_retard` |
| Leads traités | `72 · 56 % des leads actifs` | `/app/activite/leads?stage=en_cours` |
| Signaux convertis | `31 · DVF 18 · DPE 13` | `/app/prospection/signaux-dvf` |
| Rapports à relancer | `7 · 5 AdV · 2 études locatives` | Filtre preset `rapports-ouverts-sans-relance` |

## 8.5 Table principale

### Colonnes

```text
Objet               (icône + label court)
Type                (chip : lead / action / rapport / signal / opp / dossier)
Source              (widget / manuel / pige / signal)
Collaborateur       (avatar + nom)
Lead / client       (nom + email/tel)
Bien / adresse      (adresse courte ou "—")
Zone                (chip)
Dernière action     (texte + date relative)
Prochaine action    (texte + date ou "aucune")
Âge / retard        (colorée si retard)
Priorité            (haute / moyenne / basse)
Statut              (chip)
CTA                 (menu ⋯)
```

### Exemples de lignes

```text
🎯 Mme Bertrand · Lead · Widget estimation · Non assigné · "Appeler aujourd'hui" · [⋯]
📄 Avis de valeur 16 rue du Hameau · Rapport ouvert · Sophie · "Relance vendeur" · [⋯]
📡 DPE F détecté · Signal DPE · Marc · "Qualifier propriétaire" · [⋯]
💼 Rue du Commerce · Opportunité invest · Non assigné · "Qualifier" · [⋯]
📞 Relance Mme Durand · Action · Camille · 3 jours de retard · [⋯]
```

### Densité

- Ligne = 40px de hauteur (dense)
- Fond alterné `slate-50 / white`
- Hover : `slate-100`
- Sélection : `violet-50` + border-left violet

### Actions ligne (menu ⋯)

```text
Ouvrir objet source
Réassigner
Créer relance
Créer action
Masquer
```

## 8.6 Vues rapides (presets)

```text
[Tous]
[En retard]                   → filter = { status: 'en_retard' }
[Sans prochaine action]       → filter = { has_next_action: false }
[Rapports à relancer]         → filter = { type: 'rapport', status: 'ouvert_sans_relance' }
[Signaux non traités]         → filter = { type: 'signal', status: 'non_traite' }
[Opportunités invest]         → filter = { type: 'opportunite' }
```

Le preset "Leads non assignés" **n'est pas** dans cette page. Pour y accéder : `/app/activite/leads?assigne=null`.

## 8.7 Rapports ouverts à relancer

Condition déterministe :

```ts
rapport.status === 'ouvert'
&& rapport.last_opened_at != null
&& aucune action type 'relance' créée APRÈS last_opened_at
```

CTA principal : `Créer relance` → ouvre `CreateRelanceModal` avec template pré-rempli selon type de rapport (AdV vendeur / étude bailleur / dossier invest).

## 8.8 Signaux non traités

Agrège :

```text
Signaux DVF           (module Prospection)
Signaux DPE           (module Prospection)
Radar prospection     (module Prospection)
Notifications veille actionnables   (module Veille)
Alertes concurrence   (module Veille)
Biens suivis avec événement récent (module Veille)
```

Chaque signal doit avoir : explication, score, action recommandée, lien source.

## 8.9 Panneau détails latéral

Quand une ligne de la table est sélectionnée, un panneau latéral (~380px de large) s'ouvre à droite avec :

```text
Titre objet
Résumé 1-2 lignes
Collaborateur assigné + date
Timeline rapide 5 derniers événements
CTA rapides
Lien "Ouvrir fiche complète"
```

Ce n'est **pas** un drawer plein écran. C'est un split interne à la page.

---

# 9. Sous-section 3 — Portefeuille & dossiers

**Route** : `/app/equipe/portefeuille`
**Rôle** : vue collective des objets lourds : biens, estimations, rapports, opportunités, dossiers.

## 9.1 Intention

Répondre à :

> Quels biens, estimations, rapports, opportunités et dossiers sont portés par l'équipe, par qui, dans quel état, et où faut-il intervenir ?

## 9.2 Objets concernés

```text
Biens portefeuille
Estimations rapides
Avis de valeur
Études locatives
Opportunités investissement
Dossiers investissement
Mandats
Biens suivis importants
```

## 9.3 Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Portefeuille & dossiers                                             │
│ Suivez les biens, estimations, rapports et dossiers portés équipe. │
├─────────────────────────────────────────────────────────────────────┤
│ [Période] [Collaborateur] [Zone] [Type objet] [Statut] [Source] [Risque]│
├─────────────────────────────────────────────────────────────────────┤
│ KPI : Biens · Rapports cours · Rapports ouv. sans relance · Doss. · Qualité │
├─────────────────────────────────────────────────────────────────────┤
│ [Tous] [Biens] [Estimations] [Rapports] [Dossiers] [Opportunités]   │
│ [À relancer] [Blocages]                                             │
├──────────────────────────────────────┬──────────────────────────────┤
│                                      │                              │
│ Table objets portefeuille/dossiers   │ Panneau qualité livrables    │
│ Scroll interne                       │ (voir §9.7)                  │
│                                      │                              │
└──────────────────────────────────────┴──────────────────────────────┘
```

## 9.4 KPI row

5 tuiles.

| KPI | Exemple |
|---|---|
| Biens portefeuille | `184 · 27 mandats actifs` |
| Rapports en cours | `42 · 18 AdV · 9 études · 15 dossiers` |
| Rapports ouverts sans relance | `7 · 5 AdV · 2 études` |
| Dossiers investissement | `23 · 8 finalisés · 4 envoyés` |
| Qualité livrables | `74 % rapports complets` |

## 9.5 Table principale

### Colonnes

```text
Objet
Type                    (bien / estimation / AdV / étude loc / opportunité / dossier / mandat)
Adresse / zone
Responsable
Client / lead
Statut
Valeur / prix / loyer / rendement
Dernière activité
Prochaine action
Qualité / risque        (badge couleur)
Liens modules           (chips vers modules source)
CTA                     (menu ⋯)
```

### Densité

- Ligne = 44px de hauteur (légèrement plus haute que §8 car contenu plus riche)
- Fond alterné
- Badge risque à droite : 🔴 bloqué · 🟠 à relancer · 🟢 OK

## 9.6 Vues rapides (presets)

```text
[Tous]
[Biens]                 → filter type=bien
[Estimations]           → filter type=estimation_rapide
[Rapports]              → filter type IN (avis_valeur, etude_locative)
[Dossiers]              → filter type=dossier_invest
[Opportunités]          → filter type=opportunite
[À relancer]            → preset rapports ouverts sans relance
[Blocages]              → preset objets avec qualité/risque 🔴
```

## 9.7 Qualité des livrables (§F) — méthodologie complète

Bloc obligatoire dans le panneau latéral droit.

### 9.7.1 Critères booléens par type de livrable

Chaque livrable (AdV, étude locative, dossier invest) est évalué sur un ensemble de critères booléens. Un livrable est **complet** si **100 %** des critères applicables sont `true`.

**Avis de valeur** — 7 critères :

| Critère | Clé TS | Définition |
|---|---|---|
| Couverture personnalisée | `couverture_personnalisee` | Page de couverture avec nom vendeur + photo bien + logo agence |
| Comparables sélectionnés | `comparables_selectionnes` | ≥ 3 comparables ajoutés manuellement par l'agent |
| Contexte local présent | `contexte_local_present` | Bloc contexte (tension, prix m², délai médian) présent |
| Justification AVM | `justification_avm` | Si écart agent vs AVM > 5 %, champ justification rempli. Sinon critère = true par défaut |
| Relance programmée | `relance_programmee` | Action de type "relance" créée après envoi, quelle que soit la date |
| Branding agence | `branding_agence` | Logo + couleur agence appliqués (vient des paramètres org) |
| Photos bien | `photos_bien` | ≥ 3 photos du bien intégrées au rapport |

**Étude locative** — 7 critères (même grille avec adaptations) :

```text
couverture_personnalisee     (nom bailleur + photo bien + logo agence)
comparables_selectionnes     (≥ 3 biens en location comparables)
contexte_local_present       (tension locative, loyer médian, délai relocation)
justification_avm            (écart agent vs AVM loyer > 5% → justification)
relance_programmee           (action relance après envoi)
branding_agence              (logo + couleur)
photos_bien                  (≥ 3 photos)
```

**Dossier investissement** — 7 critères (différents) :

```text
couverture_personnalisee     (nom investisseur + bien + logo agence)
scenarios_multiples          (≥ 2 scénarios : nu / meublé / LMNP / SCI)
analyse_rendement            (bloc rendement brut + net + net-net)
analyse_fiscale              (régime fiscal + simulation impôts)
analyse_risques              (tension locative, DPE, copro)
plu_urbanisme                (extrait PLU de la zone présent)
branding_agence              (logo + couleur)
```

### 9.7.2 Formule de scoring

Pour un livrable donné :

```ts
completeness_score = (nb_criteres_true / nb_criteres_totaux) * 100
is_complete = completeness_score === 100
```

Pour l'équipe (affiché KPI) :

```ts
taux_rapports_complets = (nb_livrables_avec_is_complete / total_livrables_periode) * 100
```

### 9.7.3 Affichage panneau Qualité

```text
Qualité des livrables

Rapports complets                         74 %   ████████░░
─────────────────────────────────────────
Taux par critère :
  Couverture personnalisée                 96 %  █████████▌
  Comparables sélectionnés (≥ 3)           82 %  ████████░░
  Contexte local                           68 %  ██████▌░░░
  Justification écart AVM                  91 %  █████████░
  Relance après ouverture                  43 %  ████▌░░░░░   ← Plus faible
  Branding agence                          100 %  ██████████
  Photos bien (≥ 3)                        88 %  ████████▌░

─────────────────────────────────────────
Par type :
  Avis de valeur    (37 docs)    71 %
  Étude locative    (18 docs)    83 %
  Dossier invest    (23 docs)    69 %

[Voir rapports incomplets →]
```

Clic "Voir rapports incomplets" → filtre la table principale sur `is_complete=false`.

### 9.7.4 Cas métier prioritaires (issus des critères)

| Cas | Condition | CTA |
|---|---|---|
| Rapport ouvert sans relance | `relance_programmee=false` ET `last_opened_at != null` | Créer relance |
| Écart AVM non justifié | `justification_avm=false` | Compléter justification |
| Rapport incomplet | `completeness_score < 100` | Compléter rapport |
| Peu de comparables | `comparables_selectionnes=false` | Ajouter comparables |
| Dossier finalisé non envoyé | `status='finalise'` ET `share_token=null` | Envoyer dossier |
| Opportunité non qualifiée | `status IN ('nouveau','a_qualifier')` | Assigner / analyser |
| Mandat simple sous pression | `mandat_simple=true` ET `concurrence_active=true` | Voir veille |

---

# 10. Sous-section 4 — Agenda & charge

**Route** : `/app/equipe/agenda`
**Rôle** : vue manager de la capacité collective.

## 10.1 Intention

Répondre à :

> Qui est disponible, qui est en surcharge, quels RDV / relances / visites arrivent, et comment rééquilibrer la charge ?

## 10.2 Objets affichés

```text
RDV vendeur
RDV acquéreur
RDV estimation
Visite
Appel
Email
Relance
Préparation avis de valeur
Préparation étude locative
Préparation dossier invest
Action commerciale
Action prospection
Échéance mandat
Rapport ouvert à relancer
Signal à qualifier
Lead à rappeler
Créneau disponible
Absence (§L)
```

## 10.3 Layout

```text
┌─────────────────────────────────────────────────────────────────────┐
│ Agenda & charge                                                     │
│ Répartissez RDV, relances et actions selon la disponibilité équipe. │
├─────────────────────────────────────────────────────────────────────┤
│ [Période] [Vue] [Collaborateur] [Zone] [Type] [Charge]              │
├─────────────────────────────────────────────────────────────────────┤
│ KPI : RDV sem · Actions retard · Relances crit. · Surchargés · Créneaux│
├─────────────────────────────────────────────────────────────────────┤
│ [Semaine] [Jour] [Par collaborateur] [Charge] [Retards] [Dispos]    │
├────────────────────────────────┬────────────────────────────────────┤
│                                │                                    │
│ Planning équipe (heatmap)      │ Charge & capacité                  │
│ Agents × jours × volumétrie    │ Score charge par collab + inputs   │
│                                │                                    │
├────────────────────────────────┼────────────────────────────────────┤
│                                │                                    │
│ Absences déclarées             │ Suggestions rééquilibrage          │
│ (§10.8)                        │                                    │
│                                │                                    │
└────────────────────────────────┴────────────────────────────────────┘
```

## 10.4 KPI row

5 tuiles.

| KPI | Exemple |
|---|---|
| RDV semaine | `34 · 12 estimations · 9 visites` |
| Actions en retard | `18 · 5 haute priorité` |
| Relances critiques | `7 · rapports ouverts sans suite` |
| Collaborateurs surchargés | `2 · Sophie · Marc` |
| Créneaux disponibles | `11 cette semaine (saisie manuelle)` |

## 10.5 Score de charge V1 (§K)

### Inputs V1 (temps dispo agenda exclu)

```text
actions_open
actions_overdue           (double pondération)
rdv_count
visits_count
leads_active
rapports_a_relancer
dossiers_active
opportunites_a_qualifier
```

### Formule V1

```ts
function computeWorkloadScore(s: WorkloadSnapshot): number {
  const weighted =
    s.actions_open * 1.0 +
    s.actions_overdue * 2.5 +       // pénalité retard
    s.rdv_count * 2.0 +
    s.visits_count * 2.5 +          // visite = lourd
    s.leads_active * 0.3 +          // présence dans le pipe, pas chronophage unitairement
    s.rapports_a_relancer * 1.5 +
    s.dossiers_active * 1.8 +
    s.opportunites_a_qualifier * 0.5;

  // Normalisation 0-100 basée sur capacity_weekly_hours
  const capacityRef = s.capacity_weekly_hours ?? 35;
  const rawScore = (weighted / (capacityRef * 1.2)) * 100;
  return Math.min(100, Math.max(0, Math.round(rawScore)));
}
```

### Seuils

```text
0–39    Disponible
40–64   Normal
65–84   Chargé
85–100  Surcharge
```

### V1.5 (non exposé V1, documenté pour suite)

Ajouter :
- `agenda_free_slots` (temps dispo réel via Google Cal / Outlook OAuth)
- `agenda_capacity_used_pct`
- Recalibrer formule avec ces inputs.

## 10.6 Planning équipe (heatmap)

Vue par défaut : **semaine courante** (L → V), 5 colonnes jour + 1 colonne "WE".

```text
              Lun 28   Mar 29   Mer 30   Jeu 1    Ven 2    WE
Sophie        ▓▓▓▓▓    ▓▓▓▓     ▓▓▓▓▓    ▓▓▓▓▓    ▓▓▓▓
              5 RDV    4 RDV    5 RDV    5 RDV    4 RDV
Marc          ▓▓       ▓▓▓      CG       ▓▓▓      ▓▓
              2 RDV    3 RDV    Congé    3 RDV    2 RDV
Camille       ▓▓▓      ▓▓▓▓▓    ▓▓▓▓     ▓▓       ▓▓▓▓
              3 RDV    5 RDV    4 RDV    2 RDV    4 RDV
Thomas        ▓        ▓▓       ▓▓       ▓        ▓
              1 RDV    2 RDV    2 RDV    1 RDV    1 RDV
```

Densité couleur = volumétrie d'événements. Clic cellule → ouvre détail du jour pour le collaborateur.

Vues alternatives :
- **Jour** : timeline d'une journée avec créneaux
- **Par collaborateur** : agenda vertical d'un seul collab sur 7 jours
- **Charge** : barres de score charge par collab sur la période
- **Retards** : liste des actions en retard
- **Disponibilités** : créneaux marqués comme "disponibles" par les collabs

## 10.7 Suggestions de rééquilibrage

Panneau latéral. Max 4 suggestions.

```text
💡 Sophie est en surcharge cette semaine
   Score 87/100 · 12 actions ouvertes · 5 RDV · 3 retards
   → Réassigner 3 relances simples à Thomas (charge 22/100)
   [Appliquer]

💡 12 leads widget sont non assignés
   Distribution recommandée par zone + charge :
   Sophie 4 · Marc 3 · Camille 3 · Thomas 2
   [Assigner automatiquement] [Voir dans Kanban]

💡 Camille a 2 créneaux disponibles jeudi après-midi
   Affecter les 2 RDV estimation non planifiés ?
   [Planifier]

💡 3 actions en retard > 5 jours sur Marc
   → Coaching ou réassignation ?
   [Voir détail] [Réassigner]
```

Règle : les suggestions sont générées par le moteur §17 (règles coaching étendues aux règles de rééquilibrage).

## 10.8 Absences déclarées (§L)

Nouveau bloc V1.

```text
Absences déclarées

Sophie     Congés         28 avril → 5 mai       [Éditer] [Supprimer]
Marc       Formation      30 avril (1 jour)      [Éditer] [Supprimer]
Thomas     Maladie        25 → 26 avril          [Éditer] [Supprimer]

[+ Déclarer une absence]
```

Modal de saisie :

```text
┌─────────────────────────────────────┐
│ Déclarer une absence                │
├─────────────────────────────────────┤
│ Collaborateur  [Sélecteur]          │
│ Type           [Congés / Maladie /  │
│                 Formation / Autre]  │
│ Du             [Date picker]        │
│ Au             [Date picker]        │
│ Note           [Textarea]           │
│                                     │
│              [Annuler] [Enregistrer]│
└─────────────────────────────────────┘
```

Rôles autorisés : `OWNER` et `ADMIN` peuvent déclarer pour n'importe qui. Un `AGENT` peut déclarer sa propre absence (si activé dans Paramètres org).

Impact sur le planning : les jours d'absence apparaissent en barré dans la heatmap et bloquent les suggestions de réassignation vers ce collaborateur.

## 10.9 Brief RDV (§M)

Clic sur n'importe quel RDV dans l'agenda → drawer `?rdv=rdv_xxx` avec 3 onglets :

### Onglet 1 — Détails

```text
Date / heure
Type RDV (vendeur / acquéreur / estimation / visite)
Participants (collab + client)
Bien concerné (lien vers fiche bien)
Adresse / lieu
Statut (prévu / confirmé / réalisé / annulé)
```

### Onglet 2 — Brief (généré automatiquement)

```text
Client : Mme Bertrand
Historique : Lead créé il y a 12j via widget estimation

Bien : 16 rue du Hameau, Paris 15e
  · T2 42m² · 2010 · DPE D
  · Estimation Propsight : 420-445 k€

Dernière interaction : Appel du 18 avril (Sophie)
  Résumé : vendeuse hésitante, craint de brader.

Rapport lié : Avis de valeur envoyé le 20 avril
  · Ouvert 3 fois (dernier : hier 18h)
  · Points défendus : prix au m² zone + délai vente 62j

Points à défendre en RDV :
  · Tension Paris 15e : 82/100
  · Comparables vendus -5% en 6 mois (vs. -12% attendu par vendeuse)
  · Délai moyen vente zone : 62 jours

Contexte marché (Observatoire) :
  · Prix m² médian Paris 15e : 10 450 €/m²
  · Évolution 12m : -3,2 %

Actions recommandées :
  · Préparer 3 comparables récents vendus
  · Ouvrir la page Observatoire avant le RDV
```

### Onglet 3 — Historique

Timeline de tous les événements liés au lead et au bien : appels, emails, ouvertures rapport, actions.

Le brief se génère depuis les données existantes (lead + bien + estimation + observatoire + timeline). Pas de LLM V1.

## 10.10 Actions en retard

Panneau bas-gauche. Liste les actions `status=en_retard` triées par ancienneté du retard.

```text
🔴 15j Relance vendeur M. Lefebvre           Sophie      [Reassigner]
🔴 11j Appeler M. Dupont                     Marc        [Reassigner]
🟠 7j  Visite bien Rue Vaugirard              Camille     [Reprogrammer]
🟠 5j  Email à Mme Bertrand                  Sophie      [Traiter]
...
```

Max 10 actions affichées, "Voir toutes (18)" si plus.

---

# 11. Sous-section 5 — Performance business

**Route** : `/app/equipe/performance`
**Rôle** : vue analytique collective.

## 11.1 Intention

Répondre à :

> Est-ce que l'équipe transforme bien la donnée Propsight en leads, rapports, mandats, signatures et chiffre d'affaires ?

## 11.2 Partage de la lib de calcul avec Mon activité > Performance (§I)

Tous les KPIs business, funnel, marché & potentiel de cette page utilisent **la même lib de calcul** que `/app/activite/performance` :

```
/src/lib/performance/
  ├── funnel.ts                   (calcul taux de conversion)
  ├── ca.ts                        (calcul CA réalisé, CA pipe pondéré)
  ├── mandats.ts                   (KPI mandats)
  ├── adoption.ts                  (KPI adoption)
  ├── marche-potentiel.ts          (part captée, potentiel CA, marché adressable)
  └── hypotheses.ts                (taux commission, panier moyen, etc.)
```

Différence entre les deux modules = **filtre de scope** passé à chaque fonction :

```ts
// Mon activité > Performance
calculerFunnel({ scope: 'me', userId: currentUser.id, periode: '30j' });
calculerCA({ scope: 'me', userId: currentUser.id, periode: '30j' });

// Équipe > Performance
calculerFunnel({ scope: 'equipe', organizationId: currentOrg.id, periode: '30j' });
calculerCA({ scope: 'equipe', organizationId: currentOrg.id, periode: '30j' });

// Équipe > Performance filtré sur un collab
calculerFunnel({ scope: 'collaborateur', userId: 'user_sophie', periode: '30j' });
```

Garantie :
- Zéro dérive de logique métier entre les deux modules.
- Les hypothèses modifiables (§11.8) sont stockées **une seule fois** dans les Paramètres org.
- Quand une formule évolue, un seul endroit à modifier.

## 11.3 Structure en couches

4 couches dans cet ordre vertical :

```text
1. Funnel & conversion équipe
2. Business & mandats
3. Marché & potentiel
4. Adoption & coaching
```

Chaque couche est un bloc dépliable. Par défaut, les 4 sont ouverts mais l'utilisateur peut les plier.

## 11.4 Funnel central

```text
Signal / Widget / Lead entrant
  → Lead assigné
  → Lead qualifié
  → Action commerciale
  → Estimation rapide
  → Avis de valeur / Étude locative
  → Rapport envoyé
  → Rapport ouvert
  → Relance effectuée
  → Mandat signé
  → Vente / location signée
  → CA réalisé
```

## 11.5 Couche 1 — Funnel & conversion

### KPI

```text
Leads entrants
Taux qualification
Taux RDV
Taux estimation
Taux rapport envoyé
Taux mandat
Délai lead → mandat
```

### Funnel (visuel)

```text
Leads entrants          128   100 %  ████████████████████
Leads assignés          116    91 %  ██████████████████
Leads qualifiés          54    42 %  ████████▌
RDV obtenus              37    29 %  █████▌
Estimations créées       31    24 %  ████▌
Rapports envoyés         23    18 %  ███▌
Rapports ouverts         18    14 %  ██▌
Relances effectuées      12     9 %  █▌
Mandats signés            7     5 %  ▌
Signatures                4     3 %  ▌
```

Clic sur une étape → drawer avec détail par collaborateur.

### Conversion par source

Table :

```text
Source                Leads   Qualif   Rapports   Mandats   CA généré    Délai moyen
Widget estimation      42     45 %     18         6         94 800 €     16 j
Prospection DPE        18     33 %      6         2         31 600 €     22 j
Prospection DVF        22     38 %      8         3         47 400 €     19 j
Annonce                16     31 %      5         1         15 800 €     25 j
Ancien client           9     67 %      5         3         55 200 €     12 j
Autre                  21     24 %      3         1         14 800 €     28 j
```

## 11.6 Couche 2 — Business & mandats

### KPI

```text
CA réalisé              (période)
CA pipe pondéré         (sur mandats actifs × taux transformation historique)
Mandats signés          (période)
Taux exclusivité        (mandats exclusifs / total mandats)
Commission moyenne      (CA / nb mandats signés)
Délai mandat → signature
```

### Table par collaborateur

```text
Collaborateur    CA réalisé   CA pipe    Mandats signés   Taux exclus.   Commission moy.
Sophie           62 400 €     84 000 €   5                60 %           12 480 €
Marc             18 200 €     42 500 €   2                50 %           9 100 €
Camille          78 900 €     102 400 €  7                71 %           11 270 €
Thomas           14 500 €     28 000 €   1                100 %          14 500 €

Total équipe     174 000 €    256 900 €  15               67 %           11 600 €
```

## 11.7 Couche 3 — Marché & potentiel

### KPI

```text
Marché adressable
Part captée
Potentiel CA restant
Zones sous-exploitées
Segments à attaquer
```

### Table zones

```text
Zone              Volume DVF 12m   Leads   Mandats   Part captée   Potentiel CA   Signal
Paris 15e          842              48      12        1,4 %         420 000 €      Sous-exploité
Boulogne           488              31       9        1,8 %         260 000 €      Bon niveau
Issy               392              12       2        0,5 %         180 000 €      À attaquer
Vanves             234               8       1        0,4 %         112 000 €      À attaquer
```

### Calcul

Utilise `calculerMarchePotentiel()` depuis la lib partagée. Input : zones de l'organisation + DVF 12m glissants + hypothèses (§11.8).

### Drawer méthodologie

Un clic sur "?" à côté de "Part captée" ouvre un drawer expliquant :

```text
Part captée = (mandats signés par l'équipe sur la zone) / (nb ventes DVF sur la zone)

Période : 12 mois glissants
Source mandats : module Biens > Portefeuille (statut = "mandat signé")
Source ventes : DVF retraité par Propsight (retard moyen 6 mois)

Limites :
· Les ventes DVF les plus récentes peuvent manquer (retard publication)
· Ne tient pas compte des ventes particulier-particulier hors réseau
```

## 11.8 Hypothèses modifiables inline

Bloc dédié en haut de Performance.

```text
Hypothèses de calcul                                    [Éditer]

Taux commission moyen :          3,8 %
Panier moyen zone :              520 000 €
Taux mandat atteignable :        4 %
Part objectif agence :           2 %
Période de référence :           12 mois
```

Cliquer "Éditer" ouvre un modal pour modifier les hypothèses. Les hypothèses sont **stockées dans les Paramètres org**, pas dans la page Performance. Modifiées → recalcul immédiat dans les deux modules (Mon activité + Équipe).

## 11.9 Couche 4 — Adoption & coaching

### KPI

```text
Utilisateurs actifs 7j       (X / Y licences)
Estimations créées           (nb période)
Avis de valeur envoyés
Études locatives créées
Rapports ouverts
Signaux traités
Biens suivis ajoutés
Alertes créées
```

### Funnel adoption → business par collaborateur

```text
Collaborateur    Estimations   Rapports envoyés   Rapports ouverts   Relances   Mandats   Signal
Sophie           12            7                   4                  4          3         Très bon post-rapport
Marc              6            2                   1                  0          1         Coaching AdV
Camille          18            13                  9                  7          4         Forte adoption
Thomas            4            4                   3                  1          1         Potentiel à charger
```

Colonne "Signal" = résumé textuel issu du catalogue §17 (si une règle s'applique au collab sur la période).

### Objectifs équipe (si définis)

Si un `TeamObjective` est défini pour la période :

```text
Objectif période : Q2 2026

CA                    174 000 € / 250 000 €   ████████▌░░░   70 %
Mandats signés        15 / 24                 ██████▌░░░░░   63 %
Mandats exclusifs     10 / 15                 ██████▌░░░░░   67 %
AdV envoyés           37 / 45                 ████████▌░░░   82 %
Études locatives      18 / 25                 ███████░░░░░   72 %

[Éditer objectifs →]
```

Clic "Éditer objectifs" → `TeamObjectiveModal`.

---

# 12. Permissions

Alignement strict sur les 4 rôles Propsight (§A).

| Rôle | Accès Équipe |
|---|---|
| `OWNER` | Tout voir, tout exporter, réassigner, définir objectifs, configurer hypothèses, gérer les absences équipe. Renvoie vers Paramètres > Membres pour invitations. |
| `ADMIN` | Idem `OWNER` pour son organisation. Joue le rôle manager de fait (la spec parle de "manager" = un `ADMIN`). |
| `AGENT` | Vue dégradée : son propre périmètre + moyenne équipe anonymisée. Pas les KPI nominatifs des autres. Ne peut pas réassigner. Peut déclarer sa propre absence (si activé dans Paramètres). |
| `VIEWER` | Lecture seule complète sur les pages Équipe. Pas d'action de réassignation, pas d'export sensible, pas d'édition objectifs. |

## 12.1 Vue dégradée pour le rôle `AGENT`

Sur `/app/equipe/vue` :
- KPI row : uniquement les KPI équipe agrégés (pas la table Collaborateurs nominative)
- Bloc "Santé & coaching" : uniquement les insights qui concernent l'agent connecté
- Bande "Leads non assignés" : masquée

Sur `/app/equipe/activite` :
- Table filtrée automatiquement sur `owner=me`
- Pas de colonne "Collaborateur" (implicite)
- Vues rapides réduites (pas de "Rapports à relancer" équipe)

Sur `/app/equipe/portefeuille` :
- Idem : filtrée sur ses propres objets

Sur `/app/equipe/agenda` :
- Son propre agenda en vue principale
- Charge équipe anonymisée (nom remplacés par "Collègue A / B / C")

Sur `/app/equipe/performance` :
- Ses propres KPI en détail
- Moyenne équipe anonymisée en comparaison
- Pas de détail nominatif par collaborateur

## 12.2 Règle persona investisseur

Le persona investisseur pur (V1 couvert par Propsight) n'a pas besoin de la section Équipe. La section peut être **masquée de la sidebar** selon abonnement / rôle.

Implémentation : feature flag `equipe_enabled` dans l'organisation. Si `false`, la section Équipe est retirée de la sidebar mais les routes restent accessibles pour un utilisateur qui y arriverait via URL (dans ce cas : page 403 ou redirect vers `/app`).

---

# 13. Composants à créer

```text
/src/components/equipe/
  # Page shell
  EquipePageHeader.tsx
  EquipeFiltersBar.tsx
  EquipeKpiRow.tsx

  # Vue équipe
  CollaborateurTable.tsx               (table 8 colonnes par défaut + config)
  CollaborateurTableColumnConfig.tsx   (modal "Configurer colonnes")
  CollaborateurDrawer.tsx              (drawer latéral)
  SanteCoachingPanel.tsx               (bloc fusionné à tabs)
    SanteTabASurveiller.tsx
    SanteTabAdoption.tsx
    SanteTabCoaching.tsx
  LeadsUnassignedBanner.tsx            (bande horizontale compacte)

  # Activité commerciale
  TeamActivityTable.tsx
  TeamActivityDetailPanel.tsx          (panneau latéral droit)
  TeamActivityQuickFilters.tsx

  # Portefeuille & dossiers
  TeamPortfolioTable.tsx
  DeliverableQualityPanel.tsx          (§9.7)
  DeliverableQualityMethodologyDrawer.tsx

  # Agenda & charge
  TeamAgendaHeatmap.tsx                (vue semaine par défaut)
  TeamAgendaDayView.tsx
  TeamAgendaByCollaborator.tsx
  WorkloadPanel.tsx                     (score charge + inputs)
  RebalancingSuggestions.tsx           (panneau suggestions)
  AbsencesList.tsx                      (§10.8)
  DeclareAbsenceModal.tsx

  # Performance business
  TeamPerformanceFunnel.tsx
  SourceConversionTable.tsx
  BusinessKpiSection.tsx
  MarketPotentialSection.tsx
  AdoptionSection.tsx
  TeamObjectiveModal.tsx
  HypothesesPanel.tsx                  (lib partagée avec Mon activité)

  # Drawers & modals
  RdvDrawer.tsx                         (3 onglets : Détails · Brief · Historique, §M)
  AssignModal.tsx                       (assignation rapide, §C)
  CreateTeamActionModal.tsx
  CreateRdvModal.tsx
  CreateRelanceModal.tsx
  KpiExplanationDrawer.tsx

  # Types & data
  types.ts
  mock-data.ts
  coaching-rules.ts                     (catalogue §17)
```

## 13.1 Composants partagés avec Mon activité

```text
/src/components/shared/performance/
  FunnelVisualization.tsx
  HypothesesEditor.tsx
  MarketPotentialTable.tsx
```

```text
/src/lib/performance/
  funnel.ts
  ca.ts
  mandats.ts
  adoption.ts
  marche-potentiel.ts
  hypotheses.ts
  types.ts
```

---

# 14. API / MSW endpoints V1

## 14.1 Liste endpoints

```text
GET    /api/equipe/summary
GET    /api/equipe/collaborateurs
GET    /api/equipe/collaborateurs/:id
GET    /api/equipe/watch-items
GET    /api/equipe/adoption
GET    /api/equipe/coaching-insights
GET    /api/equipe/activity
GET    /api/equipe/portfolio
GET    /api/equipe/deliverable-quality
GET    /api/equipe/agenda
GET    /api/equipe/workload
GET    /api/equipe/absences
POST   /api/equipe/absences
DELETE /api/equipe/absences/:id
GET    /api/equipe/performance
GET    /api/equipe/objectives
PATCH  /api/equipe/objectives/:id
POST   /api/equipe/assignments
POST   /api/equipe/actions
POST   /api/equipe/rdv
GET    /api/equipe/rdv/:id/brief
```

## 14.2 Query params standards

Applicables à tous les endpoints `GET` d'agrégation :

```text
?periode=7j | 30j | 90j | 12m         (default 30j)
?collaborateur=user_xxx                (filtre par collab)
?zone=paris-15                         (slug zone)
?source=widget_estimation              (filtre source)
?scope=me | equipe | collaborateur     (détermine le filtre owner)
?status=en_retard | ouvert_sans_relance | non_assigne
?type=lead | rapport | signal | ...
```

## 14.3 Exemple `GET /api/equipe/summary`

```json
{
  "kpis": [
    { "id": "leads_actifs", "label": "Leads actifs", "value": 128, "delta": "+12", "trend": "up", "link": "/app/activite/leads?scope=equipe" },
    { "id": "actions_retard", "label": "Actions en retard", "value": 18, "subtitle": "5 haute priorité", "trend": "down", "link": "/app/equipe/activite?preset=actions-retard" },
    { "id": "rdv_semaine", "label": "RDV semaine", "value": 34, "subtitle": "9 visites · 12 estimations", "trend": "up", "link": "/app/equipe/agenda?view=week" },
    { "id": "mandats", "label": "Mandats en cours", "value": 27, "subtitle": "8 exclusifs", "trend": "up", "link": "/app/equipe/portefeuille?type=mandats" },
    { "id": "ca_pipe", "label": "CA pipe pondéré", "value": "286 450 €", "delta": "+18%", "trend": "up", "link": "/app/equipe/performance?layer=business" }
  ],
  "leads_unassigned": {
    "count": 12,
    "older_than_48h": 3
  }
}
```

## 14.4 Exemple `GET /api/equipe/coaching-insights`

```json
{
  "insights": [
    {
      "insight_id": "ci_001",
      "rule_id": "conversion_bloquee_avis_valeur",
      "scope": "collaborateur",
      "target_id": "user_marc",
      "target_label": "Marc",
      "type": "conversion_bloquee_avis_valeur",
      "title": "Marc crée des estimations mais envoie peu d'avis de valeur",
      "explanation": "Estimations 30j : 12 · AdV envoyés : 2 · ratio 17 % (moyenne équipe : 44 %)",
      "recommended_action": "Coaching : préparation RDV vendeur",
      "cta_label": "Planifier coaching",
      "cta_target": "/app/equipe/agenda?collaborateur=user_marc",
      "priority": "moyenne",
      "triggered_at": "2026-04-24T08:30:00Z",
      "metric_snapshot": {
        "estimations_30j": 12,
        "avis_envoyes_30j": 2,
        "ratio": 0.17,
        "team_avg_ratio": 0.44
      }
    }
  ]
}
```

## 14.5 Exemple `GET /api/equipe/rdv/:id/brief`

```json
{
  "rdv_id": "rdv_1234",
  "client": { "display_name": "Mme Bertrand", "contact_id": "contact_567" },
  "lead": { "lead_id": "lead_890", "created_at": "2026-04-12T14:00:00Z", "source": "widget_estimation" },
  "bien": {
    "bien_id": "bien_456",
    "adresse": "16 rue du Hameau, Paris 15e",
    "type": "appartement", "surface": 42, "pieces": 2, "annee": 2010, "dpe": "D",
    "estimation_propsight": { "min": 420000, "median": 432000, "max": 445000 }
  },
  "last_interaction": {
    "type": "appel",
    "by": "user_sophie",
    "at": "2026-04-18T10:15:00Z",
    "summary": "Vendeuse hésitante, craint de brader."
  },
  "rapport_lie": {
    "type": "avis_valeur",
    "rapport_id": "rap_321",
    "sent_at": "2026-04-20T09:00:00Z",
    "opened_count": 3,
    "last_opened_at": "2026-04-23T18:00:00Z",
    "points_defendus": ["Prix au m² zone", "Délai vente 62j"]
  },
  "points_a_defendre": [
    "Tension Paris 15e : 82/100",
    "Comparables vendus -5% en 6 mois (vs. -12% attendu par vendeuse)",
    "Délai moyen vente zone : 62 jours"
  ],
  "contexte_marche": {
    "prix_m2_median": 10450,
    "evolution_12m": -0.032,
    "link_observatoire": "/app/observatoire/contexte-local?zone=paris-15"
  },
  "actions_recommandees": [
    "Préparer 3 comparables récents vendus",
    "Ouvrir la page Observatoire avant le RDV"
  ]
}
```

## 14.6 Exemple `POST /api/equipe/assignments`

Request (bulk) :

```json
{
  "assignments": [
    { "object_type": "lead", "object_id": "lead_001", "assignee_id": "user_sophie" },
    { "object_type": "lead", "object_id": "lead_002", "assignee_id": "user_marc" },
    { "object_type": "lead", "object_id": "lead_003", "assignee_id": "user_camille" }
  ],
  "note": "Répartition auto basée sur zone + charge"
}
```

Response :

```json
{
  "success": true,
  "assigned_count": 3,
  "failed": [],
  "assignments": [
    {
      "assignment_id": "as_001",
      "object_type": "lead",
      "object_id": "lead_001",
      "assignee_id": "user_sophie",
      "assigned_by": "user_admin",
      "assigned_at": "2026-04-24T10:45:00Z",
      "status": "active"
    }
  ]
}
```

---

# 15. États vides

## Aucun membre (sauf utilisateur connecté)

```text
Vous êtes seul dans votre organisation.
Invitez vos collaborateurs pour suivre l'activité, répartir les leads et piloter la performance collective.

[Inviter un membre →]
```

CTA → `/app/parametres/membres?action=invite` (§J).

## Pas assez de données

```text
Pas encore assez d'activité pour afficher des recommandations fiables.
Les premiers insights apparaîtront après quelques leads, estimations ou actions traitées.
```

## Aucun blocage détecté

```text
Aucun blocage détecté.
Votre équipe est à jour sur les actions prioritaires.
```

## Aucune zone configurée

```text
Aucune zone suivie n'est configurée pour cette équipe.
Définissez vos zones pour croiser activité commerciale et potentiel marché.

[Configurer les zones →]
```

CTA → `/app/parametres/organisation/zones`.

## Aucun objectif défini

```text
Aucun objectif défini.
Définissez un objectif de CA, de mandats ou de part de marché pour comparer la performance.

[Définir objectifs →]
```

CTA → ouvre `TeamObjectiveModal`.

## Aucune absence

```text
Aucune absence déclarée cette période.
[+ Déclarer une absence]
```

## Aucun lead non assigné

Bande "Leads non assignés" masquée complètement si `count = 0`.

## Aucun insight coaching

```text
Pas d'insight de coaching cette semaine.
Votre équipe fonctionne dans les normes.
```

---

# 16. Règles UX finales

## À respecter

```text
✅ Équipe est une surcouche manager transverse.
✅ Le pipeline reste dans Leads.
✅ L'inbox leads non assignés vit dans Kanban Leads, Équipe = compteur + lien.
✅ Chaque objet garde son module source.
✅ Chaque KPI est cliquable ou explicable.
✅ Chaque bloc doit proposer une action.
✅ Adoption & coaching sont obligatoires.
✅ Qualité des livrables est obligatoire avec méthodologie explicite.
✅ Les rapports ouverts sans relance doivent ressortir fortement.
✅ La charge doit être expliquée, pas seulement scorée.
✅ La comparaison collaborateurs doit rester orientée coaching.
✅ Marché & potentiel sont alimentés par Observatoire via lib partagée.
✅ Gestion des membres vit dans Paramètres > Membres.
✅ 4 rôles stricts : OWNER, ADMIN, AGENT, VIEWER.
✅ Viewport 1440×900 sans scroll de page, scroll interne uniquement.
```

## À éviter

```text
❌ Un deuxième CRM.
❌ Un Kanban équipe.
❌ Une section Favoris équipe.
❌ Un dashboard décoratif.
❌ Un classement brutal des collaborateurs.
❌ Des KPI sans action.
❌ Une adoption réduite à "utilisateurs actifs".
❌ Un calendrier complet type Google Calendar (V2).
❌ Une page RH de gestion utilisateurs (vit dans Paramètres).
❌ Des insights de coaching générés par LLM (V1 = catalogue fermé).
❌ Une duplication de logique métier avec Mon activité > Performance.
❌ Un layout qui scrolle de page.
❌ Des rôles "manager" ou "assistant" (pas dans l'archi Propsight).
❌ Une hiérarchie TeamScope V1 (V1 plat, V2 hiérarchique).
```

---

# 17. Catalogue des règles de coaching (§E)

11 règles codées en dur. Chaque règle définit :
- une **condition** sur les data (déterministe)
- un **scope** (collaborateur / équipe / zone)
- une **priorité**
- un **template de phrase** avec variables injectées
- un **CTA** (label + target)

Les règles sont évaluées côté serveur (ou côté mock MSW en V1) sur un job périodique (ex : toutes les heures). Les insights générés sont stockés dans un cache et servis par `GET /api/equipe/coaching-insights`.

## 17.1 `adoption_faible`

**Condition** :
```ts
last_seen_at < now - 14 days
&& role === 'AGENT'
&& status === 'active'
```

**Scope** : `collaborateur`
**Priorité** : `moyenne` (ou `haute` si `last_seen_at < now - 30 days`)

**Template** :
> `{display_name}` ne s'est pas connecté depuis `{days_since_last_seen}` jours.

**Action recommandée** : Contacter pour comprendre le blocage ou planifier une remise à niveau.
**CTA** : `[Ouvrir drawer collab]` → `?drawer=collaborateur:{user_id}`

## 17.2 `conversion_bloquee_avis_valeur`

**Condition** :
```ts
estimations_30j >= 10
&& (avis_envoyes_30j / estimations_30j) < 0.30
&& team_avg_ratio >= 0.40
```

**Scope** : `collaborateur`
**Priorité** : `moyenne`

**Template** :
> `{display_name}` crée des estimations mais envoie peu d'avis de valeur.
> Estimations 30j : `{estimations_30j}` · AdV envoyés : `{avis_envoyes_30j}` · ratio `{ratio}%` (moyenne équipe : `{team_avg_ratio}%`)

**Action recommandée** : Coaching — préparation RDV vendeur.
**CTA** : `[Planifier coaching]` → `/app/equipe/agenda?collaborateur={user_id}&action=coaching`

## 17.3 `conversion_bloquee_etude_locative`

Même pattern que 17.2 mais pour les études locatives au lieu des AdV.

**Condition** :
```ts
leads_bailleurs_30j >= 5
&& (etudes_creees_30j / leads_bailleurs_30j) < 0.25
```

**Scope** : `collaborateur`
**Priorité** : `basse`

**Template** :
> `{display_name}` a `{leads_bailleurs_30j}` leads bailleurs mais peu d'études locatives créées.

**Action recommandée** : Campagne bailleurs ou script prospection locative.
**CTA** : `[Lancer campagne]` → modal de création d'action groupée

## 17.4 `relance_manquante_rapport`

**Condition** :
```ts
nb_rapports_ouverts_sans_relance >= 3
// Un rapport = ouvert sans relance si : last_opened_at != null ET aucune action type 'relance' après last_opened_at
```

**Scope** : `collaborateur`
**Priorité** : `haute`

**Template** :
> `{display_name}` a `{nb_rapports_ouverts_sans_relance}` rapports ouverts sans relance.

**Action recommandée** : Créer les relances aujourd'hui.
**CTA** : `[Ouvrir activité]` → `/app/equipe/activite?collaborateur={user_id}&preset=rapports-ouverts-sans-relance`

## 17.5 `charge_elevee`

**Condition** :
```ts
workload_score >= 85
&& count(other_agents_with_workload < 50) >= 1
```

**Scope** : `collaborateur`
**Priorité** : `haute`

**Template** :
> `{display_name}` est en surcharge cette semaine.
> Score `{workload_score}/100` · `{actions_open}` actions ouvertes · `{rdv_count}` RDV · `{actions_overdue}` retards

**Action recommandée** : Réassigner X relances simples à `{suggested_receiver}` (charge `{receiver_workload}/100`).
**CTA** : `[Rééquilibrer]` → ouvre `RebalancingSuggestions` pour ce collab

## 17.6 `qualite_livrable_faible`

**Condition** :
```ts
nb_rapports_livres_30j >= 5
&& (nb_rapports_complets / nb_rapports_livres_30j) < 0.50
&& team_avg_completion >= 0.70
```

**Scope** : `collaborateur`
**Priorité** : `moyenne`

**Template** :
> `{display_name}` produit des rapports souvent incomplets.
> Taux complétude : `{completion_rate}%` (moyenne équipe : `{team_avg_completion}%`)
> Critères les plus manqués : `{top_missing_criteria}`

**Action recommandée** : Coaching sur la qualité des livrables.
**CTA** : `[Voir rapports incomplets]` → `/app/equipe/portefeuille?collaborateur={user_id}&preset=incomplets`

## 17.7 `zone_sous_exploitee`

**Condition** :
```ts
zone.volume_dvf_12m >= 500
&& zone.leads_equipe_30j < (volume_dvf_12m * 0.02)
&& zone.tension_score >= 60
```

**Scope** : `zone`
**Priorité** : `basse`

**Template** :
> Zone `{zone_label}` : forte tension, faible prospection équipe.
> Volume DVF 12m : `{volume_dvf_12m}` · Leads équipe 30j : `{leads_equipe_30j}` · Part captée : `{part_captee}%`
> Potentiel CA restant : `{potentiel_ca}` €

**Action recommandée** : Lancer campagne prospection sur cette zone.
**CTA** : `[Voir zone]` → `/app/observatoire/contexte-local?zone={zone_slug}`

## 17.8 `signaux_prospection_non_traites`

**Condition** :
```ts
signaux_non_traites_30j >= 20
&& signaux_traites_30j < 10
```

**Scope** : `collaborateur`
**Priorité** : `moyenne`

**Template** :
> `{display_name}` a `{signaux_non_traites_30j}` signaux prospection non traités.

**Action recommandée** : Prioriser les signaux haute priorité aujourd'hui.
**CTA** : `[Voir signaux]` → `/app/equipe/activite?collaborateur={user_id}&preset=signaux-non-traites`

## 17.9 `estimations_non_promues`

**Condition** :
```ts
estimations_rapides_sauvegardees_60j >= 10
&& promotion_rate_avis_valeur < 0.15
```

**Scope** : `collaborateur` ou `equipe`
**Priorité** : `basse`

**Template** :
> `{count}` estimations rapides non promues en avis de valeur.
> Potentiel : ~`{avis_valeur_potentiel}` AdV supplémentaires.

**Action recommandée** : Revoir les estimations pour identifier celles avec potentiel.
**CTA** : `[Voir estimations]` → `/app/estimation/rapide?promues=false`

## 17.10 `ecart_avm_non_justifie`

**Condition** :
```ts
nb_rapports_ecart_avm_sup_5pct_sans_justif >= 3
```

**Scope** : `collaborateur`
**Priorité** : `moyenne`

**Template** :
> `{nb}` avis avec écart AVM > 5 % sans justification (`{display_name}` ou équipe).

**Action recommandée** : Compléter la justification avant de renvoyer au vendeur.
**CTA** : `[Compléter]` → `/app/equipe/portefeuille?preset=ecart-avm-non-justifie`

## 17.11 `mandat_simple_sous_pression`

**Condition** :
```ts
mandat.type === 'simple'
&& nb_agences_concurrentes_actives_zone >= 2
&& mandat.age_days >= 30
```

**Scope** : `collaborateur` (propriétaire du mandat)
**Priorité** : `moyenne`

**Template** :
> `{nb}` mandats simples sous pression concurrentielle.

**Action recommandée** : Voir Veille > Agences concurrentes et envisager la conversion en exclusif.
**CTA** : `[Voir veille]` → `/app/veille/agences-concurrentes?zone={zones}`

## 17.12 Configuration & désactivation

Chaque règle peut être **désactivée** par organisation dans Paramètres > Organisation > Coaching. Un `OWNER` peut choisir de ne pas exposer certaines règles à son équipe (ex : désactiver `charge_elevee` s'il ne veut pas du signal surcharge).

Format config :

```ts
type OrgCoachingConfig = {
  enabled_rules: string[];  // IDs des règles actives
  thresholds_override?: Record<string, Partial<RuleThresholds>>;
};
```

Par défaut, les 11 règles sont actives.

---

# 18. Prompt Claude Code

```text
Tu travailles sur Propsight Pro, SaaS immobilier data-driven français.

Objectif : construire la section Équipe complète selon /docs/50_EQUIPE.md (V2).

Contexte non négociable :
- Propsight est organisé autour d'objets transverses : Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur.
- Les modules ne sont pas des silos.
- Le pipeline commercial unique vit dans Mon activité > Leads. Ne jamais créer de Kanban équipe.
- L'inbox des leads non assignés vit dans /app/activite/leads?assigne=null. Dans Équipe, uniquement un compteur + lien + AssignModal.
- Les favoris / biens suivis vivent uniquement dans Veille > Biens suivis.
- La gestion des membres (invitation, édition, désactivation) vit dans /app/parametres/membres. Équipe est en lecture seule.
- La fiche bien reste le pivot transverse.
- La section Équipe est une surcouche manager : elle agrège, filtre, réassigne, explique, mais ne duplique pas les modules sources.
- 4 rôles stricts : OWNER, ADMIN, AGENT, VIEWER. Pas de rôle "manager" ni "assistant".
- TeamScope V1 = type 'agence' uniquement. La hiérarchie multi-niveaux est V2.
- La lib de calcul performance est partagée avec Mon activité > Performance (/src/lib/performance/).

Routes à créer :
- /app/equipe -> redirect /app/equipe/vue
- /app/equipe/vue
- /app/equipe/activite
- /app/equipe/portefeuille
- /app/equipe/agenda
- /app/equipe/performance

Design :
- desktop-first 1440–1600px
- dense, premium, Linear / Attio
- violet Propsight (accent)
- pas de gros blocs décoratifs
- pas de gros padding
- viewport 1440×900 sans scroll de page, scroll interne dans tables / panneaux
- header, filtres et KPI sticky quand pertinent

À construire :
1. Types TypeScript dans /src/components/equipe/types.ts (11 types, voir §5)
2. Mock data dans /src/components/equipe/mock-data.ts
3. Catalogue des 11 règles de coaching dans /src/components/equipe/coaching-rules.ts
4. Composants communs : EquipePageHeader, EquipeFiltersBar, EquipeKpiRow
5. Vue équipe :
   - Table Collaborateurs 8 colonnes par défaut + "Configurer colonnes" pour ajouter les 5 autres
   - Bloc Santé & coaching avec 3 tabs (À surveiller / Adoption / Coaching)
   - Bande "Leads non assignés" compacte avec lien vers Kanban
6. Activité commerciale :
   - Table activité 13 colonnes
   - 6 presets de vues rapides (sans "Leads non assignés")
   - Panneau latéral détails
7. Portefeuille & dossiers :
   - Table objets
   - Panneau Qualité livrables avec 7 critères booléens + formule complétude
   - Drawer méthodologie qualité
8. Agenda & charge :
   - Heatmap semaine par défaut
   - WorkloadPanel avec score de charge V1 (sans temps dispo agenda)
   - Bloc Absences déclarées avec modal de saisie manuelle
   - Panneau Suggestions rééquilibrage
9. Performance business :
   - 4 couches : Funnel & conversion · Business & mandats · Marché & potentiel · Adoption & coaching
   - Utiliser /src/lib/performance/ (partagé avec Mon activité)
   - HypothesesPanel partagé
   - TeamObjectiveModal
10. Drawers et modales :
    - CollaborateurDrawer
    - RdvDrawer (3 onglets : Détails · Brief · Historique)
    - AssignModal (bulk)
    - DeclareAbsenceModal
    - CreateTeamActionModal, CreateRdvModal, CreateRelanceModal
    - KpiExplanationDrawer, DeliverableQualityMethodologyDrawer

Données mockées obligatoires :
- 12 collaborateurs (10 AGENT, 1 ADMIN, 1 OWNER)
- 128 leads actifs
- 12 leads non assignés (3 > 48h)
- 18 actions en retard
- 34 RDV semaine
- 27 mandats en cours (8 exclusifs)
- 286 450 € CA pipe pondéré
- 7 rapports ouverts sans relance (5 AdV, 2 études)
- 84 estimations créées (30j)
- 37 avis de valeur envoyés (30j)
- 18 études locatives créées (30j)
- 146 signaux traités (30j)
- 23 dossiers investissement (8 finalisés, 4 envoyés)
- 3 absences déclarées
- Zones : Paris 15e, Boulogne, Issy, Vanves
- Organisation type : agence (TeamScope unique)

Règles finales :
- Chaque donnée affichée doit expliquer un blocage ou déclencher une action.
- Aucune duplication de logique métier avec Mon activité > Performance (utiliser la lib partagée).
- Aucune hiérarchie TeamScope V1 (type 'agence' uniquement).
- AGENT voit une version dégradée des pages (données perso + moyenne anonymisée).
- VIEWER a un accès lecture seule sans actions de réassignation.

MSW endpoints à mocker (§14) :
GET /api/equipe/summary
GET /api/equipe/collaborateurs
GET /api/equipe/collaborateurs/:id
GET /api/equipe/watch-items
GET /api/equipe/adoption
GET /api/equipe/coaching-insights
GET /api/equipe/activity
GET /api/equipe/portfolio
GET /api/equipe/deliverable-quality
GET /api/equipe/agenda
GET /api/equipe/workload
GET /api/equipe/absences
POST /api/equipe/absences
DELETE /api/equipe/absences/:id
GET /api/equipe/performance
GET /api/equipe/objectives
PATCH /api/equipe/objectives/:id
POST /api/equipe/assignments
POST /api/equipe/actions
POST /api/equipe/rdv
GET /api/equipe/rdv/:id/brief
```

---

# 19. Définition finale

**Équipe est la section manager de Propsight. Elle relie activité commerciale, adoption produit, qualité des livrables, charge opérationnelle, performance business et potentiel de marché. Elle ne remplace aucun module source : elle les orchestre pour aider le manager à transformer plus vite la donnée Propsight en actions, rapports, mandats, signatures et chiffre d'affaires.**

**En V1, Équipe est une surcouche lecture + assignation rapide. Elle respecte strictement les frontières avec les modules sources (Leads pour le pipeline, Paramètres pour les membres, Performance pour les calculs), utilise les 4 rôles Propsight stricts, et prépare l'extension V2 (hiérarchie multi-agence, intégration calendrier, insights IA) sans la livrer.**

