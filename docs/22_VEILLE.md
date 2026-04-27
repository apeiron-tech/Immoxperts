# 22 — VEILLE

**Version** : V1 consolidée (post-arbitrages)
**Statut** : figée — prête pour Claude Code
**Périmètre** : `/app/veille/alertes`, `/app/veille/notifications`, `/app/veille/biens-suivis`, `/app/veille/agences-concurrentes`
**Persona V1 actifs** : Agent + Investisseur (variante réduite pour Investisseur)
**Stack** : Next.js 15 App Router · TypeScript strict · Tailwind v4 · shadcn/ui (accent violet) · TanStack Query v5 · MSW v2 · Mapbox GL v3 · react-hook-form + Zod · nuqs
**Design** : desktop-first 1280–1600px · dense · premium · inspiration Linear / Attio · violet Propsight

---

# 0. Décisions V1 figées

Ces décisions sont actées. Ne plus rouvrir sans nouvelle session d'arbitrage.

| # | Sujet | Décision V1 |
|---|---|---|
| 1 | Sous-sections | 4 : Mes alertes · Notifications · Biens suivis · Agences concurrentes |
| 2 | Routes | `/app/veille/alertes`, `/app/veille/notifications`, `/app/veille/biens-suivis`, `/app/veille/agences-concurrentes` |
| 3 | Route racine | `/app/veille` → redirection serveur vers `/app/veille/notifications` |
| 4 | **Portée des alertes V1** | **4 types de cible** : `bien` · `zone` · `recherche` · `agence` (retirés V1 : segment, lead, dossier, rapport) |
| 5 | Domaines d'alerte | 6 : `prix` · `annonce` · `dpe` · `urbanisme` · `marche` · `concurrence` |
| 6 | Canaux V1 | `in_app` + `email` uniquement (WhatsApp et Slack reportés V1.5) |
| 7 | Fréquences | `immediate` · `daily` · `weekly` |
| 8 | **Tabs Notifications** | **3 tabs macro** : `Toutes` · `Non lues` · `À traiter`. Tous les autres filtres dans un bouton "Filtres avancés" |
| 9 | Tabs Mes alertes | `Toutes` + 1 tab par domaine (Zones · Biens · Prix · DPE · Urbanisme · Concurrents · En pause) |
| 10 | Vue par défaut Mes alertes | Table dense |
| 11 | Vue par défaut Notifications | Inbox / feed groupé par date |
| 12 | Vue par défaut Biens suivis | Table dense (toggles Cards / Carte) |
| 13 | Vue par défaut Agences concurrentes | Table dense (toggles Cards / Carte) |
| 14 | **Statuts notification** | 5 : `unread` · `read` · `todo` · `done` · `ignored` (pas de `archived` — purge auto à 90j) |
| 15 | Statuts alerte | 3 : `active` · `paused` · `archived` |
| 16 | **Règle source unique Biens suivis** | Toggle ♡ dans n'importe quel module écrit uniquement dans `followed_property`. Aucun autre module n'a de section "Favoris" |
| 17 | Pipeline commercial | Aucun Kanban dans Veille. Le pipeline reste dans `Mon activité > Leads` |
| 18 | **Drawer contextuel** | 1 composant partagé `<DrawerVeille>` avec 4 variants (`alerte`, `notification`, `bien_suivi`, `agence`), structure en 7 zones identiques (cf §6) |
| 19 | **Bloc IA inline dans chaque drawer** | Oui, dérogation assumée au pattern Observatoire. Bloc compact `Suggestion Propsight IA BETA` en bas de chaque drawer avec 1 insight + 1 CTA "Voir suggestion détaillée" |
| 20 | **Règles anti-bruit** | Agrégation par (domaine × portée × heure) · throttling max 1 notif/heure/alerte pour fréquence immédiate · dédoublonnage événements cross-alertes (cf §2.5) |
| 21 | Score intérêt Biens suivis | 4 contributeurs V1 (variation_prix · tension_zone · anciennete_annonce · pression_concurrent), total 0–100, breakdown visible (cf §9.12) |
| 22 | Cas "Mandat simple sous pression" | Statut métier first-class (badge rouge), bloc dédié dans drawer Agence, suggestion IA spécifique |
| 23 | Freshness labels | Codifiés §2.7, uniformes tous modules Propsight |
| 24 | Sync lu cross-device | `read_at` serveur fait foi, pas de lecture locale |
| 25 | Pagination | Scroll infini avec pagination 50 par page. Archive auto notifications > 90j |
| 26 | Viewport minimum | 1280px (message plein-page si inférieur, aligné Observatoire) |
| 27 | Dépendances data flagguées | SIRENE (AddAgenceModal) · SMTP/template email · tracking pixel rapports (ce dernier V1.5 si Estimation pas prêt) |
| 28 | Consentement RGPD | Champ `consent_status` affiché dans drawers, CTA adaptatifs. Collecte de consentement = hors scope V1 |
| 29 | Assignation | Manuelle uniquement V1, 1 objet = 1 assigné, dropdown simple (aligné Prospection §4) |
| 30 | Notifications "santé alertes" | Séparées dans onglet/section dédié (alerte silencieuse, bruyante, en erreur) pour ne pas polluer le feed principal |

---

# 1. Contexte produit & positionnement

## 1.1 Vision Propsight (rappel)

Propsight est un SaaS immobilier data-driven à double couche : public freemium + espace Pro payant. Le produit est pensé autour d'un backbone objet transverse. Les modules ne sont pas des silos mais des lectures différentes des mêmes objets : **Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur**.

## 1.2 Rôle global de Veille

La section Veille est le **système nerveux transverse** de Propsight. Elle centralise :

- ce que l'utilisateur décide de surveiller ;
- les événements détectés par Propsight ;
- les biens sauvegardés depuis tous les modules ;
- les agences concurrentes suivies ;
- les changements actionnables à transformer en action, lead, estimation, analyse ou dossier.

Veille répond à **une seule question** :

> Qu'est-ce qui a changé sur mes biens, mes zones, mes recherches ou mes concurrents, et que dois-je faire maintenant ?

## 1.3 Principes produit clés

```text
Biens immobiliers  = base objet
Prospection        = détection de signaux
Observatoire       = intelligence territoriale
Investissement     = analyse décisionnelle
Estimation         = production de valeur / rapports
Leads              = pipeline commercial

Veille             = mémoire active + système d'alertes + inbox actionnable
```

**Règle produit finale, non négociable** :

> Aucune notification sans impact métier. Aucune alerte sans objet surveillé. Aucun bien suivi sans action possible.

## 1.4 Les 4 sous-sections

| Sous-section | Question répondue | Objet principal |
|---|---|---|
| Mes alertes | Qu'est-ce que Propsight surveille pour moi ? | `Alerte` |
| Notifications | Qu'est-ce qui vient de changer ? | `NotificationVeille` |
| Biens suivis | Quels biens j'ai sauvegardés ? | `BienSuivi` |
| Agences concurrentes | Quels concurrents sont actifs sur mes zones ? | `AgenceConcurrente` |

## 1.5 Ce que Veille n'est pas

Veille n'est pas :

- une simple page de favoris ;
- une pige annonces brute ;
- un observatoire bis ;
- une prospection bis ;
- un mini-CRM ;
- un centre de notifications passives ;
- un stockage d'alertes techniques.

## 1.6 Promesse utilisateur

**Pour un agent immobilier** :

> Je surveille mes zones, mes biens, mes recherches et mes concurrents sans jongler entre portails, CRM, alertes email et tableaux Excel. Propsight me dit ce qui change, pourquoi c'est important, et quelle action faire.

**Pour un investisseur** :

> Je suis les biens et zones qui m'intéressent, je vois les baisses de prix, les changements de rendement, et les opportunités qui correspondent à mon projet.

## 1.7 Différenciation vs outils de pige classiques

| Outil classique dit | Propsight dit |
|---|---|
| "Nouvelle annonce détectée." | "Nouvelle annonce détectée dans votre zone. Prix 6 % au-dessus du réalisé DVF. Bien comparable à 2 biens de votre portefeuille. **Action recommandée** : créer une action de pige ou surveiller 7 jours." |
| "Baisse de prix." | "Ce bien suivi vient de baisser de 4,2 %. Il est maintenant 3 % sous la médiane DVF du quartier. Le rendement simulé passe de 4,8 % à 5,4 %. **Action recommandée** : ouvrir l'analyse invest ou ajouter au comparatif." |

La différence : **chaque événement est enrichi de son impact métier et d'une action recommandée concrète.**

---

# 2. Principes structurants non-négociables

## 2.1 Backbone transverse

Veille manipule 5 objets centraux :

```text
Alerte              → règle de surveillance
NotificationVeille  → événement survenu, lisible par l'user
BienSuivi           → bien sauvegardé (♡)
AgenceConcurrente   → agence surveillée
WatchEvent          → événement brut détecté par le pipeline data
```

Règles de vie :

- Une `Alerte` peut générer plusieurs `NotificationVeille` (une par déclenchement agrégé)
- Un `WatchEvent` peut matcher plusieurs `Alerte`, mais ne génère qu'**une** `NotificationVeille` par user (dédoublonnage, cf §2.5)
- Un `BienSuivi` est créé par le toggle ♡ depuis n'importe quel module
- Une `NotificationVeille` peut référencer n'importe quel type d'objet (`bien`, `zone`, `alerte`, `agence`, `lead`, `action`, `dossier`, `rapport`, `opportunite`, `estimation`, `annonce`)

## 2.2 Règle source unique Biens suivis

`Veille > Biens suivis` est **la** source de vérité des favoris.

```text
Clic ♡ depuis n'importe quel module (Annonces, DVF, Portefeuille,
Prospection, Investissement, Observatoire, Estimation, fiche bien)
      ↓
Écriture dans la table unique `followed_property` (bien_id, user_id, source, source_id, created_at)
      ↓
Apparition immédiate dans /app/veille/biens-suivis
```

Conséquences :

- Aucun autre module n'a de sous-section "Favoris" / "Sauvegardés"
- Le toggle ♡ est **optimiste** côté UI (apparaît activé immédiatement, réconciliation backend après)
- Retirer le suivi depuis Veille désactive le ♡ partout dans l'app (broadcast via TanStack Query invalidation)

## 2.3 Drawer contextuel unique

Un seul composant `<DrawerVeille>` avec 4 variants (`alerte`, `notification`, `bien_suivi`, `agence`). Structure **identique** en 7 zones pour les 4 variants :

```text
1. Header           (titre · badge statut · menu ⋯ · close)
2. Key info         (table de champs clé, dense)
3. Performance      (KPIs inline 30j, 4 tuiles)
4. Actions rapides  (grid 2 colonnes, icônes + label court)
5. Liens inter-modules (chips avec compteur, 3-6 max)
6. Chronologie      (timeline verticale, dot + label + date)
7. Suggestion IA    (bloc violet clair, 1 insight + CTA "Voir suggestion détaillée")
+ bouton destructif rouge tout en bas si applicable
```

Largeur par défaut : `420px`. Grand mode (optionnel sur bien suivi) : `640px`.
Fermeture : `Esc`, clic X, clic overlay.

## 2.4 Règle "aucune notif sans sens métier"

Chaque `NotificationVeille` **doit** contenir :

- `title` (court, ≤ 60 caractères)
- `message` (contexte factuel : "530 000 € → 510 000 €, -3,8 % en 6 jours")
- `explanation` (interprétation : "Le bien est maintenant 2 % sous la médiane DVF du quartier")
- `business_impact` (conséquence : "Potentiel de négociation ou opportunité investisseur")
- `recommended_action` (CTA principal : `ouvrir_analyse`)
- `secondary_actions` (1-2 CTA alternatifs)

Une notification qui n'a que `title` + `message` est **non conforme** — le backend doit la rejeter.

## 2.5 Règles anti-bruit

Trois mécanismes combinés :

### 2.5.1 Agrégation

Règle : si plusieurs `WatchEvent` du même `event_type` surviennent sur la même portée (zone ou bien) dans la même heure, ils génèrent **une** `NotificationVeille` agrégée.

Exemple :
```text
Au lieu de 3 notifs séparées :
  "Baisse de prix : 45 rue X"
  "Baisse de prix : 12 av. Y"
  "Baisse de prix : 7 rue Z"

Propsight envoie 1 notif :
  "3 baisses de prix détectées sur Paris 15e ce matin"
  → CTA "Voir les 3 biens" → table filtrée
```

Seuil d'agrégation : ≥ 3 événements similaires en < 60 min → agrégation auto.

### 2.5.2 Throttling

Pour les alertes `frequency=immediate` : **max 1 notification par heure par alerte**, même si le pipeline détecte 10 événements.

Pour `daily` : 1 récap quotidien à 9h (fuseau utilisateur).
Pour `weekly` : 1 récap hebdomadaire lundi 9h.

### 2.5.3 Dédoublonnage cross-alertes

Si un unique `WatchEvent` matche plusieurs `Alerte` d'un même user, il génère **une** `NotificationVeille` qui référence toutes les alertes déclenchées.

Exemple : une baisse de prix sur un bien qui est à la fois dans "Biens suivis" ET dans "Alerte zone Paris 15e" → 1 seule notif avec `triggering_alertes = [al_123, al_456]`.

## 2.6 Pattern IA inline dans drawer

**Dérogation assumée** au pattern Observatoire ("pas d'IA dans le body").

Justification : les drawers Veille sont des surfaces de décision (traiter / ignorer / convertir). Une suggestion IA contextuelle compacte y a un impact fort sans polluer le body des écrans.

Structure du bloc IA :

```text
┌─────────────────────────────────────────────┐
│ ✨ Suggestion Propsight IA    [BETA]        │
│ [1 insight court, 2 lignes max]             │
│ [Voir suggestion détaillée →]               │
└─────────────────────────────────────────────┘
```

Règles :
- Toujours en **bas** du drawer, au-dessus du bouton destructif
- Violet clair (var `--ai-bg-subtle`)
- Badge `BETA` visible tant que la fonctionnalité n'est pas officielle
- Le CTA "Voir suggestion détaillée" ouvre le drawer IA global existant, pré-chargé avec le contexte de l'objet

## 2.7 Freshness labels codifiés

Règle unique pour tous les modules Propsight, à implémenter dans `lib/dates/freshness.ts` :

| Durée depuis `event_at` | Label affiché |
|---|---|
| < 1 min | "à l'instant" |
| 1–59 min | "il y a N min" |
| 60 min – < 4h | "il y a Nh" |
| Jour courant, ≥ 4h | "ce matin" / "cet après-midi" / "ce soir" selon heure |
| Veille | "hier" |
| 2–6 jours | "il y a Nj" |
| 7–29 jours | "il y a Ns" (semaines) |
| 30–89 jours | "il y a Nm" (mois) |
| ≥ 90 jours | date absolue "14/05/2025" |

Un tooltip au hover affiche toujours la date absolue.

## 2.8 Sync cross-device

- `read_at` côté serveur fait foi
- Toute action (marquer lu, traité, ignoré) envoie un PATCH au backend avant de refléter côté UI
- En cas d'échec réseau : rollback optimiste + toast erreur
- Polling léger côté Notifications (30s) pour refresh du compteur non lu

## 2.9 Notifications santé alertes

Les notifications **méta** (alerte silencieuse, alerte bruyante, alerte en erreur) sont **séparées** du feed principal pour ne pas polluer. Elles vivent dans un onglet dédié accessible depuis Mes alertes :

```text
/app/veille/alertes → bouton "Santé de mes alertes (3)"
→ ouvre un drawer latéral avec la liste des alertes à problème
```

Elles ne comptent pas dans le "38 non lues" du feed principal.

---

# 3. Architecture : routes, navigation, query params

## 3.1 Sidebar

```text
🔭 Veille
   ├ Mes alertes              /app/veille/alertes
   ├ Notifications            /app/veille/notifications
   ├ Biens suivis             /app/veille/biens-suivis
   └ Agences concurrentes     /app/veille/agences-concurrentes
```

## 3.2 Routes principales

| Route | Contenu | Remarque |
|---|---|---|
| `/app/veille` | **Redirection serveur → `/app/veille/notifications`** | Surface "ce qui vient de changer" en priorité |
| `/app/veille/alertes` | Gestion des règles de surveillance | |
| `/app/veille/notifications` | Inbox des événements détectés | |
| `/app/veille/biens-suivis` | Source unique des biens sauvegardés | |
| `/app/veille/agences-concurrentes` | Surveillance concurrentielle | |

## 3.3 Bell icon (header Pro)

Le bell icon du header Pro affiche :
- Un compteur rouge = nombre de notifications `status=unread`
- Un popover au clic = les 5 dernières notifications non lues, format condensé
- Un CTA "Voir toutes les notifications" → `/app/veille/notifications`

Règle : le popover **n'est pas** une surface de traitement. Les actions (marquer lu, traité) se font dans le feed ou le drawer.

## 3.4 Query params pilotables

Sur toutes les routes Veille, via `nuqs` :

| Param | Exemple | Effet |
|---|---|---|
| `alerte` | `?alerte=al_123` | Ouvre drawer alerte |
| `notification` | `?notification=nt_123` | Ouvre drawer notification |
| `bien` | `?bien=bien_123` | Ouvre drawer bien suivi |
| `agence` | `?agence=ag_123` | Ouvre drawer agence |
| `tab` | `?tab=non-lues` | Active un tab macro |
| `preset` | `?preset=haute-priorite` | Active un preset dans les filtres avancés |
| `source` | `?source=observatoire` | Filtre par source |
| `status` | `?status=unread` | Filtre par statut |
| `zone` | `?zone=paris-15` | Filtre zone |
| `period` | `?period=7j` | Filtre période |
| `assigne` | `?assigne=me` | Filtre assigné |

Les filtres complexes multi-valeurs restent dans le state local (Zustand), pas dans l'URL — sinon URLs illisibles.

## 3.5 Interactions URL / drawer

- Clic row/card → écrit `?alerte=al_123` (ou équivalent) dans l'URL → drawer s'ouvre via hook d'écoute
- Esc ou clic X → retire le param → drawer se ferme
- Partage d'URL = partage de l'état complet (tab, filtres basiques, drawer ouvert)

## 3.6 Route racine /app/veille — redirection

Implémentation Next.js 15 :

```ts
// app/veille/page.tsx
import { redirect } from 'next/navigation';
export default function VeilleRoot() {
  redirect('/app/veille/notifications');
}
```

Pas de page "hub" Veille V1. On va direct à la surface actionnable.

---

# 4. Types TypeScript — backbone

Fichier cible : `/src/types/veille.ts`

## 4.1 Enums partagés

```ts
// ─── Alertes ────────────────────────────────────────────────────────

export type AlerteTargetType = 'bien' | 'zone' | 'recherche' | 'agence';
// V1 = 4 types. V1.5 pourra ajouter 'segment', 'lead', 'dossier', 'rapport'.

export type AlerteDomain =
  | 'prix'        // seuil prix atteint, baisse, hausse
  | 'annonce'     // nouvelle annonce, remise en ligne, sortie, ancienneté
  | 'dpe'         // changement classe DPE, DPE F/G détecté
  | 'urbanisme'   // PLU, permis de construire, projet
  | 'marche'      // stock zone, tension, délai vente/location
  | 'concurrence';// concurrent détecté, mandat simple sous pression

export type AlerteStatus = 'active' | 'paused' | 'archived';

export type AlertePriority = 'info' | 'moyenne' | 'haute';

export type AlerteChannel = 'in_app' | 'email';
// V1 = 2 canaux. WhatsApp et Slack reportés V1.5.

export type AlerteFrequency = 'immediate' | 'daily' | 'weekly';

export type AlerteSourceModule =
  | 'veille'
  | 'biens'
  | 'prospection'
  | 'observatoire'
  | 'estimation'
  | 'investissement'
  | 'leads'
  | 'rapport';

// ─── Notifications ──────────────────────────────────────────────────

export type NotificationSourceType =
  | 'alerte'
  | 'bien_suivi'
  | 'prospection'
  | 'observatoire'
  | 'estimation'
  | 'investissement'
  | 'agence_concurrente'
  | 'rapport'
  | 'system';

export type NotificationObjectType =
  | 'bien'
  | 'annonce'
  | 'zone'
  | 'alerte'
  | 'agence'
  | 'lead'
  | 'action'
  | 'dossier'
  | 'rapport'
  | 'opportunite'
  | 'estimation';

export type NotificationStatus =
  | 'unread'   // par défaut à la création
  | 'read'    // automatique à l'ouverture du drawer
  | 'todo'    // marquée "à traiter" par l'user
  | 'done'    // marquée traitée par l'user
  | 'ignored';// masquée par l'user
// Pas de 'archived' V1 — purge auto à 90j.

export type NotificationPriority = 'info' | 'moyenne' | 'haute';

export type RecommendedAction =
  | 'ouvrir_bien'
  | 'ouvrir_annonce'
  | 'ouvrir_zone'
  | 'creer_action'
  | 'creer_lead'
  | 'rattacher_lead'
  | 'lancer_estimation'
  | 'ouvrir_analyse'
  | 'creer_alerte'
  | 'ouvrir_observatoire'
  | 'ajouter_comparatif'
  | 'creer_dossier'
  | 'preparer_message'
  | 'mettre_a_jour_suivi'
  | 'ignorer';

// ─── Biens suivis ───────────────────────────────────────────────────

export type BienSuiviSource =
  | 'annonces'
  | 'portefeuille'
  | 'dvf'
  | 'prospection'
  | 'investissement'
  | 'estimation'
  | 'observatoire'
  | 'fiche_bien'
  | 'manuel';

export type BienSuiviStatus = 'active' | 'paused' | 'archived';

export type BienSuiviEventType =
  | 'baisse_prix'
  | 'hausse_prix'
  | 'nouvelle_annonce'
  | 'sortie_publication'
  | 'remise_en_ligne'
  | 'nouvelle_source'
  | 'dpe_detecte'
  | 'concurrent_detecte'
  | 'vente_dvf_proche'
  | 'variation_marche'
  | 'analyse_invest_maj'
  | 'rapport_ouvert'
  | 'note_ajoutee';

export type ScoreInteretLabel = 'forte_opportunite' | 'a_surveiller' | 'faible_priorite';

// ─── Événements bruts (pipeline) ────────────────────────────────────

export type WatchEventType =
  | 'price_drop'
  | 'price_increase'
  | 'new_listing'
  | 'listing_removed'
  | 'listing_republished'
  | 'new_source_detected'
  | 'old_listing'
  | 'dpe_signal'
  | 'urbanisme_signal'
  | 'market_stock_change'
  | 'market_tension_change'
  | 'competitor_activity'
  | 'report_opened'
  | 'investment_threshold_reached';

// ─── Consentement ───────────────────────────────────────────────────

export type ConsentStatus = 'unknown' | 'opt_in' | 'contractual' | 'do_not_contact';
```

## 4.2 Objet `Alerte`

```ts
export interface AlerteCondition {
  /** Field métier surveillé (ex: 'prix', 'dpe_classe', 'stock_zone') */
  field: string;
  /** Opérateur de comparaison */
  operator:
    | 'equals' | 'not_equals'
    | 'greater_than' | 'less_than' | 'between'
    | 'contains' | 'in'
    | 'changed'
    | 'decreased_by' | 'increased_by';
  /** Valeur de référence (peut être number, string, array selon operator) */
  value: unknown;
  /** Label lisible pour affichage dans le drawer */
  label: string;
}

export interface Alerte {
  id: string;                      // ex: 'al_abc123'
  organization_id: string;
  created_by: string;              // user_id
  assigned_to?: string;            // user_id

  name: string;                    // nom court donné par l'user
  description?: string;

  domain: AlerteDomain;            // 6 valeurs
  target_type: AlerteTargetType;   // 4 valeurs
  target_id: string;               // bien_id | zone_id | recherche_id | agence_id
  target_label: string;            // "Paris 15e · Appartement T2"
  target_secondary_label?: string;

  conditions: AlerteCondition[];

  frequency: AlerteFrequency;
  channels: AlerteChannel[];       // ['in_app', 'email']
  priority: AlertePriority;

  status: AlerteStatus;

  // Performance
  last_triggered_at?: string;
  last_trigger_label?: string;     // "il y a 2h"
  triggers_count_7d: number;
  triggers_count_30d: number;
  treated_rate_30d: number;        // 0-1
  avg_treatment_time_hours?: number;

  // Provenance
  source_module: AlerteSourceModule;
  source_context?: {
    route?: string;
    object_id?: string;
    object_type?: string;
  };

  // Santé
  health_status: 'healthy' | 'silent' | 'noisy' | 'error';

  created_at: string;
  updated_at: string;
}
```

## 4.3 Objet `NotificationVeille`

```ts
export interface NotificationLink {
  label: string;      // "Ouvrir le bien"
  route: string;      // "/app/biens/annonces?id=..."
  module: string;     // "biens"
  count?: number;     // optionnel pour chips type "3 biens similaires"
}

export interface NotificationVeille {
  id: string;                              // ex: 'nt_abc123'
  organization_id: string;
  user_id: string;                         // destinataire

  source_type: NotificationSourceType;
  source_id: string;                       // alerte_id | bien_id | etc.

  object_type: NotificationObjectType;
  object_id: string;

  // Contenu obligatoire — 4 champs structurés
  title: string;                           // ≤ 60 chars
  message: string;                         // factuel
  explanation: string;                     // interprétation
  business_impact: string;                 // conséquence métier

  priority: NotificationPriority;
  status: NotificationStatus;

  // Actions
  recommended_action: RecommendedAction;
  secondary_actions: RecommendedAction[];  // 1-2 max

  // Dates
  freshness_label: string;                 // calculé côté serveur selon §2.7
  event_at: string;                        // quand l'événement réel a eu lieu
  created_at: string;                      // quand la notif a été créée

  read_at?: string;
  done_at?: string;
  ignored_at?: string;

  // Assignation (V1 : manuelle uniquement)
  assigned_to?: string;

  // Agrégation (cf §2.5.1)
  is_aggregated: boolean;
  aggregate_count?: number;                // nb d'événements agrégés
  triggering_alertes: string[];            // IDs des alertes qui ont matché

  // Contexte libre (payload métier)
  metadata: Record<string, unknown>;

  // Liens inter-modules à afficher dans le drawer
  links: NotificationLink[];
}
```

## 4.4 Objet `BienSuivi`

```ts
export interface ScoreContributor {
  key: 'variation_prix' | 'tension_zone' | 'anciennete_annonce' | 'pression_concurrent';
  label: string;                           // "Variation de prix"
  contribution: number;                    // 0–30 selon key (cf §9.12)
  detail?: string;                         // "Baisse de 3,8% en 6 jours"
}

export interface BienSuivi {
  id: string;                              // ex: 'bs_abc123'
  bien_id: string;                         // → table Bien canonique
  organization_id: string;
  followed_by: string;                     // user_id
  assigned_to?: string;

  source: BienSuiviSource;                 // d'où vient le ♡
  source_id?: string;                      // annonce_id | dvf_id | opportunite_id...
  source_label: string;                    // "Annonce SeLoger"

  reason?: string;                         // note libre de l'user
  status: BienSuiviStatus;

  alertes_actives: string[];               // IDs alertes liées à ce bien
  notifications_unread_count: number;

  // Dernier événement
  last_event_at?: string;
  last_event_type?: BienSuiviEventType;
  last_event_label?: string;               // "Baisse de prix -3,8%"

  // Score intérêt
  score_interet: number;                   // 0–100
  score_label: ScoreInteretLabel;
  score_breakdown: ScoreContributor[];     // 4 contributeurs V1

  created_at: string;
  updated_at: string;
}
```

## 4.5 Objet `AgenceConcurrente`

```ts
export interface AgenceZone {
  zone_id: string;
  label: string;                           // "Paris 15e"
  strength: 'faible' | 'moyenne' | 'forte';
  stock_actif: number;
  part_de_marche?: number;                 // 0–1, V1 "moyen" requis
  evolution_part_30d?: number;             // variation en points de %
}

export interface AgenceConcurrente {
  id: string;                              // ex: 'ag_abc123'
  organization_id: string;

  // Identité
  name: string;
  siren?: string;
  siret?: string;
  carte_t?: string;                        // N° carte T immobilière
  adresse?: string;
  ville: string;
  code_postal?: string;
  latitude?: number;
  longitude?: number;
  logo_url?: string;

  // Zones et parts de marché (V1 "moyen")
  zones: AgenceZone[];

  // Volumétrie
  stock_actif: number;
  nouvelles_annonces_7d: number;
  nouvelles_annonces_30d: number;
  baisses_prix_30d: number;
  annonces_anciennes_count: number;

  // Indicateurs
  delai_moyen_jours?: number;
  prix_moyen_m2?: number;
  loyer_moyen_m2?: number;
  types_biens_dominants: string[];         // ["T2", "T3", "maisons"]

  // Matching portefeuille (V1.5 — flag feature)
  biens_similaires_count: number;          // 0 si feature off
  mandats_simples_concurrents_count: number;
  has_mandat_simple_sous_pression: boolean;

  // Suivi
  followed: boolean;
  alertes_actives: string[];

  // Dernier mouvement
  last_event_at?: string;
  last_event_type?: string;
  last_event_label?: string;

  created_at: string;
  updated_at: string;
}
```

## 4.6 Objet `WatchEvent`

Événement brut détecté par le pipeline data. C'est l'unité d'entrée avant agrégation/dédoublonnage.

```ts
export interface WatchEvent {
  id: string;                              // ex: 'we_abc123'
  organization_id: string;

  event_type: WatchEventType;

  source_type: NotificationSourceType;
  source_id: string;

  object_type: NotificationObjectType;
  object_id: string;

  title: string;
  description: string;
  detected_at: string;

  payload: Record<string, unknown>;        // contexte métier brut

  // Matching alertes
  matched_alertes: string[];               // IDs des alertes matchées

  // Résultat après traitement
  notification_id?: string;                // si converti en notif
  aggregated_into?: string;                // si agrégé dans une notif parent
}
```

## 4.7 Consentement (§11 pour règles CTA)

```ts
export interface ContactPolicy {
  consent_status: ConsentStatus;
  contact_allowed_channels: ('email' | 'phone' | 'whatsapp' | 'postal' | 'none')[];
  consent_source?: string;
  consent_collected_at?: string;
}
```

Ce champ est **attaché au Bien ou au Lead** (pas à la notification). V1 = affichage seulement, collecte hors scope.

---

# 5. Règles transverses de création et conversion

Ces règles définissent comment une `Alerte`, une `NotificationVeille`, un `BienSuivi` ou une `AgenceConcurrente` se créent ou se transforment en autre chose (Action, Lead, Estimation, Analyse invest, Dossier). Elles sont **strictement alignées** avec Prospection §5 et Investissement pour préserver la cohérence inter-modules.

## 5.1 Créer une alerte

Trois entrées possibles :

### 5.1.1 Depuis Veille > Mes alertes
- CTA `+ Nouvelle alerte` en header → **modal compact large** 900px avec wizard 5 étapes (cf §7.11)

### 5.1.2 Depuis un autre module (Biens, Prospection, Observatoire, Investissement)
- CTA contextuel `Créer une alerte` → **modal compact** 640px pré-rempli selon contexte :
  - depuis annonce → target_type=`bien`, target_id=annonce.bien_id
  - depuis zone Observatoire → target_type=`zone`, target_id=zone.id
  - depuis recherche annonces sauvegardée → target_type=`recherche`, target_id=recherche.id
  - depuis agence concurrente → target_type=`agence`, target_id=agence.id

### 5.1.3 Depuis une notification (drawer)
- CTA `Créer alerte similaire` → modal compact pré-rempli avec domain et target de la notif source

**Effet dans tous les cas** : création d'une `Alerte` en status `active`, apparaît dans `/app/veille/alertes`. `source_module` et `source_context` sont renseignés pour tracer l'origine.

## 5.2 Créer une action depuis notification / bien suivi / alerte / agence

**Modal compact** 540px. Pattern identique à Prospection §5.2.

Champs :
```text
Objet rattaché : préfilled (bien, zone, agence, alerte)
Type : appel, email, RDV, tâche, analyse, relance, pige
Date : aujourd'hui / demain / choisir
Assigné : moi / collaborateur (dropdown)
Note : pré-remplie avec contexte (ex: "Baisse -3,8% détectée le 14/05 sur T2 Paris 15e")
```

Effet :
- Création d'une `Action` dans `Mon activité > Pilotage commercial`
- Timeline de l'objet source enrichie avec `action_creee`
- Toast succès avec lien "Voir l'action"

## 5.3 Créer ou rattacher un lead

Depuis notification ou bien suivi.

**Logique de décision** :

```text
Si contact identifié (email/tel dans le bien ou l'agence)
  → modal pré-remplie, création directe

Si contact non identifié
  → modal lead partiel avec mention "À qualifier"

Si lead existant proche (même bien_id ou même email)
  → proposer rattachement (radio "Rattacher" / "Créer nouveau")
```

Le lead vit dans `Mon activité > Leads`. Jamais dans Veille.

**Cas RGPD** : si `consent_status = do_not_contact`, le CTA "Créer lead" reste visible mais avec alerte visuelle et CTA principal devient `Préparer approche` (pas d'appel direct). Cf §11.

## 5.4 Lancer une estimation depuis bien suivi / notification

Redirection vers l'écran Estimation adéquat, pré-rempli via query params :

| Contexte déclencheur | Estimation ouverte par défaut |
|---|---|
| Bien suivi (agent) | Avis de valeur |
| Bien suivi (investisseur) | Étude locative + bouton "Analyse invest" |
| Notification `baisse_prix` | Estimation rapide |
| Notification `rapport_ouvert` | Avis de valeur (version du rapport ouvert) |
| Notification `mandat_simple_sous_pression` | Avis de valeur (pour argumentaire vendeur) |

L'utilisateur peut changer le type d'estimation une fois sur la page.

## 5.5 Ouvrir analyse invest

Bouton `Analyse invest` depuis drawer bien suivi ou notification → ouverture du modal global :

```text
?analyse=[bien_id]
```

Pattern acté côté Investissement, pas de modal Veille-spécifique.

## 5.6 Ajouter au comparatif

Sélection multi-biens dans la table Biens suivis (checkbox) → CTA `Comparer la sélection` → ouvre :

```text
?comparatif=[id1,id2,id3]
```

Max 4 biens comparés (règle Investissement).

## 5.7 Traiter / ignorer une notification

Depuis le feed ou le drawer :

| Action UI | Effet |
|---|---|
| Clic row | Ouvre drawer, passe en `read` (si `unread`) |
| Bouton "Marquer traité" | `status=done`, `done_at=now()` |
| Bouton "Marquer à traiter" | `status=todo` |
| Bouton "Ignorer" | `status=ignored`, `ignored_at=now()`, retiré du feed courant |
| Toggle "Afficher ignorées" | Réintègre les ignorées visuellement |
| Clic CTA `recommended_action` | Exécute l'action (ex: ouvre modal créer action) ET passe notif en `done` automatiquement |

**Règle automatique** : quand un `recommended_action` est cliqué et donne lieu à un succès (action créée, estimation lancée…), la notif passe automatiquement en `done`. L'utilisateur peut la repasser en `todo` si besoin.

## 5.8 Conversion Bien suivi → Opportunité invest

Cas spécial persona investisseur : un bien suivi peut devenir une `Opportunite` si son `score_interet >= 75` et qu'un projet d'investissement actif est compatible.

Flow :
- Drawer bien suivi → CTA `Promouvoir en opportunité`
- Modal confirmation avec projet cible + justification auto (score, critères matchés)
- Création de l'`Opportunite` dans `/app/investissement/opportunites` avec `source=bien_suivi`

V1 : disponible si et seulement si persona investisseur actif dans le profil. Sinon CTA masqué.

## 5.9 Retirer du suivi

Toggle ♡ depuis n'importe où (y compris drawer bien suivi) → :
- Suppression du `BienSuivi` (soft delete, status=`archived`)
- Broadcast TanStack Query → tous les ♡ du bien dans l'app passent à inactif
- Alertes liées à ce bien restent actives (l'user peut continuer à surveiller un bien qu'il ne "suit" plus)
- Toast avec bouton "Annuler" pendant 5s

## 5.10 Table récapitulative des flows

| Action | UI | Effet primaire | Timeline logge ? |
|---|---|---|---|
| Créer alerte | Modal 640-900px | `Alerte` active | oui (événement `alerte_creee`) |
| Créer action | Modal 540px | `Action` dans Pilotage | oui |
| Créer/rattacher lead | Modal 640px | `Lead` dans Mon activité > Leads | oui |
| Lancer estimation | Redirection | Écran Estimation préfilled | oui (événement `estimation_creee`) |
| Ouvrir analyse invest | Modal global `?analyse=[id]` | Vue analyse transient | non (pas d'objet créé) |
| Ajouter comparatif | Modal global `?comparatif=[ids]` | Vue comparatif transient | non |
| Promouvoir en opportunité | Modal confirmation | `Opportunite` créée | oui |
| Retirer suivi | Toggle direct | `BienSuivi` archivé | oui |
| Traiter notif | Bouton | `status=done` | oui (`notif_traitee`) |
| Ignorer notif | Bouton | `status=ignored` | oui (`notif_ignoree`) |

---

# 6. Drawer partagé `<DrawerVeille>`

## 6.1 Structure commune (7 zones)

Les 4 variants ont **la même structure**. Seul le contenu varie.

```text
┌────────────────────────────────────────────────────┐
│ HEADER                                       [×]   │
│ [Icône/Logo] Titre                                 │
│ Sous-titre (adresse, SIREN, cible…)                │
│ [Badge statut] [Badge priorité]            [⋯]     │
├────────────────────────────────────────────────────┤
│ KEY INFO                                           │
│ Champ 1 : valeur                                   │
│ Champ 2 : valeur                                   │
│ ...                                                │
├────────────────────────────────────────────────────┤
│ PERFORMANCE / KPIS INLINE                          │
│ ┌─────┬─────┬─────┬─────┐                          │
│ │ KPI │ KPI │ KPI │ KPI │                          │
│ └─────┴─────┴─────┴─────┘                          │
├────────────────────────────────────────────────────┤
│ ACTIONS RAPIDES (grid 2 cols)                      │
│ ┌──────────┐ ┌──────────┐                          │
│ │ Action 1 │ │ Action 2 │                          │
│ └──────────┘ └──────────┘                          │
│ ┌──────────┐ ┌──────────┐                          │
│ │ Action 3 │ │ Action 4 │                          │
│ └──────────┘ └──────────┘                          │
├────────────────────────────────────────────────────┤
│ LIENS INTER-MODULES (chips avec compteur)          │
│ [Biens corresp. 12] [Recherches 3] [Actions 4]     │
├────────────────────────────────────────────────────┤
│ CHRONOLOGIE (timeline verticale)                   │
│ ● Event 1                               Date       │
│ ○ Event 2                               Date       │
│ ○ Event 3                               Date       │
│ Voir toute l'activité →                            │
├────────────────────────────────────────────────────┤
│ ✨ SUGGESTION PROPSIGHT IA [BETA]                  │
│ Insight court (2 lignes max)                       │
│ [Voir suggestion détaillée →]                      │
└────────────────────────────────────────────────────┘
  [Bouton destructif rouge en bas si applicable]
```

Largeur : `420px` par défaut, `640px` en mode large (uniquement variant `bien_suivi` si la photo est grande).

## 6.2 Variant `alerte`

**Header** :
- Icône cloche (lucide `Bell`)
- Titre = `name` de l'alerte
- Sous-titre = `ID ALR-2024-XXXXX · Créée le DD MMM YYYY`
- Badges : statut (`Active` vert / `En pause` gris / `Archivée` gris foncé)

**Key info** :
- Périmètre (icône + label, ex: `Paris 15e · Appartement T2`)
- Condition (résumé lisible de `conditions[]`, ex: `prix < 550 000 €`)
- Fréquence (`Immédiat` / `Quotidien` / `Hebdo`)
- Canaux (icônes alignées : enveloppe email + cloche in-app)
- Assigné à (avatar + nom)

**Performance (30 derniers jours)** :
- 4 KPIs : `Événements` · `À traiter` · `Traités` · `Temps moyen`

**Actions rapides** :
- `Modifier` (ouvre wizard)
- `Mettre en pause` / `Réactiver`
- `Voir notifications` (filtre feed par `alerte_id`)
- `Créer action`
- `Dupliquer`
- `Tester maintenant` (trigger simulé)

**Liens inter-modules** :
- `Biens correspondants [N]`
- `Recherches associées [N]` (si target=recherche)
- `Actions liées [N]`

**Chronologie** :
- Derniers déclenchements (max 5)
- Timestamp format `Aujourd'hui 10:12` / `Hier 16:45`
- CTA `Voir toute l'activité`

**Suggestion IA** :
- Exemple : "Le volume de nouvelles annonces a augmenté de 22% sur Paris 15e ces 7 derniers jours. Envisagez d'affiner le filtre prix ou d'ajouter le critère surface pour gagner en précision."

**Bouton destructif** : `Supprimer l'alerte` (rouge, en bas, demande confirmation modal).

## 6.3 Variant `notification`

**Header** :
- Icône source (selon `source_type` : logo portail / cloche / ⚠️ / etc.)
- Badge priorité (`Haute` rouge / `Moyenne` orange / `Info` gris) + badge statut (`Nouveau` violet / `À traiter` orange / `Traité` vert)
- Titre = `notification.title`
- Sous-titre = `object_type + object_id` lisible (ex: `Appartement T2 · Paris 15e · Seloger`)
- `Reçu [freshness_label]`

**Key info — Résumé événement** :
- `notification.message` en bloc principal
- Visualisation contextuelle selon domaine (exemples) :
  - Baisse de prix : `530 000 € → 510 000 € (-3,8%)`
  - Écart marché : 4 cards `Estimation haute`, `Écart vs estimation`, `Médiane DVF`, `Écart vs DVF`
  - Mandat simple : `Prix affiché 490 000 € vs votre estimation 515 000 € (-4,9%)`

**Impact métier** :
- `explanation` + `business_impact` en texte riche
- Icône tendance (flèche haut/bas/latérale selon impact)

**Actions recommandées** (PAS Actions rapides — surface la plus visible) :
- CTA principal (violet plein) = `recommended_action` résolu en label lisible (ex: "Ouvrir le bien →")
- 1-2 CTA secondaires (outlined)
- Bouton `Ignorer cet événement` en texte

**Contexte** :
- Bloc 2 colonnes de key:value avec données de `metadata`
- Exemples : `Prix au m²`, `Dernière mise à jour`, `Annonce créée le`, `Statut`, `Surface`, `Étage`, `DPE`, `Charges`

**Liens inter-modules** :
- `Ouvrir le bien`
- `Voir l'alerte liée` (si `source_type=alerte`)
- `Comparer sur observatoire`
- `Voir annonces similaires [N]`

**Chronologie** :
- `[Event source]` (ex: "Baisse de prix détectée") - il y a 25 min
- `Prix modifié : 530 000 → 510 000` - il y a 3h
- `Annonce créée` - 02/05/2024
- CTA `Voir toute l'historique`

**Suggestion IA** :
- Exemple : "Cette baisse pourrait augmenter la probabilité de vente de +18% et améliorer la compétitivité vs le marché local."

**Footer drawer** :
- Petit texte `Événement ID ALRT-2024-05-14-0001` (copiable)
- Lien `Envoyer un feedback`

## 6.4 Variant `bien_suivi`

**Header** :
- Photo 16:9 ou placeholder (grande, 200px de haut minimum)
- Titre = type + surface + pièces (ex: `Appartement T3`)
- Sous-titre = adresse complète
- Étoile ♡ active (toggle pour retirer) + bouton ⋯
- Pagination photos si plusieurs (petit compteur `1/12` en overlay)

**Key info** (dense, 4 colonnes) :
- Type · Surface · Étage · Année · Charges
- Ligne 2 : Prix actuel · Variation (avec flèche couleur) · Score intérêt (badge coloré)

**Performance (Contexte)** :
- Chart "Historique des prix (6 mois)" — line chart recharts
- Sur le côté : Marché local (Prix moyen, Délai moyen, Tension locative avec badge)

**Actions rapides** (6 boutons en grille 2x3) :
- `Ouvrir fiche bien`
- `Analyse invest`
- `Estimer`
- `Créer action`
- `Créer lead`
- `Créer alerte`
- (7e et 8e optionnels : `Ajouter comparatif`, `Rattacher dossier`)

**Liens inter-modules** :
- `Estimation [valeur €]`
- `Analyse invest [TRI x%]`
- `Leads associés [N]`
- `Dossier Acquisition [nom]`

**Chronologie** :
- Ajout suivi · Baisse prix · Nouvelle source · Analyse ouverte · Rapport envoyé…
- Format : `Aujourd'hui 10:12 — Baisse de prix : -20 000 € (-3,6%)`

**Suggestion IA** :
- Exemple : "Le prix a baissé de 3,6% et reste 4% sous le prix estimé du marché. Bonne opportunité d'achat. Contact recommandé dans les 3 prochains jours."

**Bouton destructif** : `Retirer du suivi` (rouge + icône poubelle).

## 6.5 Variant `agence`

**Header** :
- Logo agence (fallback initiales colorées)
- Nom + ville
- Badge statut suivi (`Suivi` / `À surveiller` / `Non suivi`)
- SIREN · Carte T (en sous-titre)
- Étoile pour suivre/retirer

**Key info — Indicateurs clés** (5 cards en ligne) :
- `Stock actif [N] biens`
- `Nouvelles 7j`
- `Baisses 30j`
- `Prix moyen €/m²`
- `Délai moyen j`

**Zones principales** (chips) :
- `15e` `16e` `7e` `6e` `+2`
- CTA `Voir sur la carte →`
- Mini carte Mapbox 200px de haut avec zones highlighted

**Actions rapides** (grid 2x2) :
- `Créer alerte concurrent`
- `Voir annonces [N]`
- `Comparer à mon portefeuille`
- `Voir opportunités prospection`

**Liens inter-modules** :
- `Biens similaires [N]`
- `Mandats en concurrence [N]` (badge rouge si > 0)
- `Alertes actives [N]`
- `Notes internes [N]`

**Chronologie — Derniers mouvements** :
- `Aujourd'hui 10:32 — Baisse de prix sur 2 biens, -2,8% en moyenne`
- `Hier 16:45 — Nouvelle annonce 3 pièces 68m² · 8 900 000 € · Paris 15e`
- `Il y a 2j 10:10 — Baisse de prix sur 1 bien, -1,2%`
- CTA `Voir tout l'historique`

**Suggestion IA** :
- Exemple : "1 de vos mandats est sous pression. Le mandat `Studio 24m² · Paris 15e` est affiché 6,2% plus cher que le bien concurrent similaire de cette agence."
- CTA : `Voir le mandat en détail →`

**Bouton destructif** : `Ne plus suivre`.

---

# 7. Écran 1 — Mes alertes

## 7.1 Route

```text
/app/veille/alertes
```

## 7.2 Intention produit

Répond à :

> Qu'est-ce que Propsight surveille pour moi, sur quel périmètre, à quelle fréquence, et quelles alertes produisent des événements utiles ?

## 7.3 Layout général (référence maquette Image 4)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Mes alertes · 24                         [+ Nouvelle alerte]         │
│ Configurez les zones, biens, recherches et concurrents surveillés.   │
│                                          [Importer une zone] [Exporter] │
├──────────────────────────────────────────────────────────────────────┤
│ [Recherche] [Type▾] [Source▾] [Périmètre▾] [Statut▾] [Assigné▾] [Plus]│
├──────────────────────────────────────────────────────────────────────┤
│ KPI : Alertes actives · Déclenchements 7j · À traiter · Silencieuses │
├──────────────────────────────────────────────────────────────────────┤
│ [Toutes 24] [Zones 6] [Biens 7] [Prix 5] [DPE 3] [Urbanisme 2]       │
│ [Concurrents 3] [En pause 4]                                         │
├──────────────────────────────────────────────────────────────────────┤
│ Table alertes (scroll interne)                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 7.4 Header

- Titre : `Mes alertes · [count]`
- Sous-titre : `Configurez les zones, biens, recherches et concurrents que Propsight doit surveiller.`
- Actions droite (de gauche à droite) :
  - `[+ Nouvelle alerte]` (primaire violet plein)
  - `[Importer une zone]` (outlined, ouvre modal import GeoJSON/shapefile — V1 simple)
  - `[Exporter]` (outlined, CSV/JSON)

## 7.5 KPI row (4 tuiles, cliquables)

| KPI | Valeur exemple | Clic → filtre |
|---|---:|---|
| Alertes actives | 24 | `status=active` |
| Déclenchements 7j | 83 | filtre `triggered_last_7d=true` |
| À traiter | 12 | redirige vers `/app/veille/notifications?status=todo&source=alerte` |
| Silencieuses | 5 | filtre `health_status=silent` (pas déclenchées 30j) |

Chaque tuile affiche delta 7j en bas (`+3 vs 7 derniers jours`).

## 7.6 Tabs (presets domaine)

```text
[Toutes N] [Zones N] [Biens N] [Prix N] [DPE N] [Urbanisme N] [Concurrents N] [En pause N]
```

Mapping :
- `Toutes` : toutes status != archived
- `Zones` : target_type=`zone`
- `Biens` : target_type=`bien`
- `Prix` : domain=`prix`
- `DPE` : domain=`dpe`
- `Urbanisme` : domain=`urbanisme`
- `Concurrents` : target_type=`agence` OR domain=`concurrence`
- `En pause` : status=`paused`

## 7.7 Filtres horizontaux

- Recherche texte (sur `name`, `target_label`)
- Type (dropdown multi : `Nouvelle annonce`, `Baisse prix`, `DPE`, `Urbanisme`, `Concurrent détecté`, `Qualité annonce`, …)
- Source module (dropdown : veille / biens / prospection / observatoire / estimation / investissement / leads)
- Périmètre (dropdown : bien / zone / recherche / agence)
- Statut (dropdown : active / paused / archived)
- Assigné (dropdown user de l'org)
- `Plus` (popover filtres avancés) :
  - Fréquence
  - Priorité
  - Canaux
  - Créateur
  - Date de création
  - Dernier déclenchement
  - Nombre d'événements 30j (range)
  - Santé alerte (healthy / silent / noisy / error)

## 7.8 Table alertes — colonnes

| # | Colonne | Contenu | Tri | Largeur |
|---|---|---|---|---|
| 1 | Drag handle | Icône ⋮⋮ (V1.5 pour reorder) | — | 24px |
| 2 | Nom | `name` + description courte en hover | oui | flex |
| 3 | Type | Badge domain (icône + label) | oui | 140px |
| 4 | Périmètre | `target_label` + secondary | — | 180px |
| 5 | Condition | Résumé lisible des `conditions[]` | — | 200px |
| 6 | Fréquence | Badge `Immédiat` / `Quotidien` / `Hebdo` | oui | 100px |
| 7 | Dernier déclenchement | freshness label | oui | 120px |
| 8 | Événements 30j | nombre + mini sparkline | oui | 100px |
| 9 | Priorité | Badge | oui | 100px |
| 10 | Statut | Badge `Active` vert / `En pause` gris | oui | 90px |
| 11 | Assigné | Avatar + tooltip nom | — | 60px |
| 12 | Actions | ⋯ menu (Pause, Modifier, Dupliquer, Supprimer) | — | 40px |

Row height : 52px. Hover bg `--muted`. Clic → ouvre drawer via `?alerte=al_xxx`.

## 7.9 Exemples rows mock

```json
[
  {
    "name": "T2 Paris 15e sous 550k",
    "domain": "prix",
    "target": "Paris 15e · Appartement T2",
    "condition": "prix < 550 000 € · surface 35–60 m²",
    "frequency": "immediate",
    "last_triggered": "il y a 2h",
    "events_30d": 12,
    "priority": "moyenne",
    "status": "active"
  },
  {
    "name": "Baisses prix biens suivis",
    "domain": "prix",
    "target": "Tous mes biens suivis",
    "condition": "baisse ≥ 3 %",
    "frequency": "immediate",
    "last_triggered": "hier",
    "events_30d": 8,
    "priority": "haute",
    "status": "active"
  },
  {
    "name": "Mandats simples sous pression",
    "domain": "concurrence",
    "target": "Portefeuille · Mandats simples",
    "condition": "concurrent détecté OU prix concurrent inférieur",
    "frequency": "daily",
    "last_triggered": "il y a 3j",
    "events_30d": 5,
    "priority": "haute",
    "status": "active"
  },
  {
    "name": "DPE G détectés",
    "domain": "dpe",
    "target": "Paris 15e · Tous usages",
    "condition": "classe DPE = G",
    "frequency": "daily",
    "last_triggered": "il y a 1j",
    "events_30d": 9,
    "priority": "moyenne",
    "status": "active"
  },
  {
    "name": "PC déposés 15e",
    "domain": "urbanisme",
    "target": "Paris 15e",
    "condition": "PC, DP, PA déposés",
    "frequency": "daily",
    "last_triggered": "hier",
    "events_30d": 14,
    "priority": "moyenne",
    "status": "active"
  }
]
```

## 7.10 Drawer alerte

Variant `alerte` du `<DrawerVeille>`. Cf §6.2 pour structure complète.

## 7.11 Création d'alerte — wizard modal

**Modal compacte large** 900px, 5 étapes. Accessible depuis `[+ Nouvelle alerte]` ou pré-rempli depuis d'autres modules.

### Étape 1 — Que voulez-vous surveiller ? (target_type)

4 cards cliquables, une seule sélection :

```text
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ 🏠 Un bien      │ │ 📍 Une zone     │ │ 🔍 Une recherche│ │ 🏢 Une agence   │
│ Un bien précis  │ │ Une commune,    │ │ Une recherche   │ │ Une agence      │
│ de mon          │ │ un quartier ou  │ │ annonces que je │ │ concurrente     │
│ portefeuille ou │ │ une zone dessin.│ │ veux sauvegarder│ │ à suivre.       │
│ un bien suivi.  │ │                 │ │ comme alerte.   │ │                 │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Étape 2 — Périmètre

Selon target_type sélectionné :

- **Bien** : combobox sur portefeuille + biens suivis, recherche par adresse
- **Zone** : sélecteur hybride (ville/arrondissement/IRIS/zone veille existante) + option "Dessiner une zone" (polygone sur Mapbox)
- **Recherche** : sélecteur de recherche sauvegardée (dropdown) OU CTA "Créer une nouvelle recherche" qui ouvre les filtres annonces en mode sauvegarde
- **Agence** : autocomplete SIRENE (dépendance data, cf §17)

### Étape 3 — Condition (dépend du domaine)

D'abord choix du domaine parmi les 6 (`prix`, `annonce`, `dpe`, `urbanisme`, `marche`, `concurrence`).

Puis UI condition-builder adapté :

```text
Domaine Prix :
  [ Prix passe sous ] [ 500 000 € ]
  [ Prix baisse de plus de ] [ 3 % ]
  [ Prix augmente de plus de ] [ 5 % ]

Domaine Annonce :
  ☑ Nouvelle annonce détectée
  ☑ Remise en ligne
  ☐ Sortie de publication
  ☐ Annonce active depuis plus de [ 90 ] jours

Domaine DPE :
  ☑ Nouveau DPE F/G détecté
  ☐ Amélioration DPE détectée
  Classes : [F] [G] (multiselect)

Domaine Urbanisme :
  ☑ PC déposé (permis construire)
  ☑ DP déposée (déclaration préalable)
  ☐ PA déposé (permis aménager)

Domaine Marché :
  [ Stock zone augmente de plus de ] [ 15 % ]
  [ Délai moyen dépasse ] [ 75 ] jours
  [ Tension passe sous ] [ 60 ]

Domaine Concurrence :
  ☑ Concurrent publie bien similaire
  ☑ Prix concurrent inférieur au mien
  ☑ Mandat simple sous pression détecté
```

Plusieurs conditions peuvent être combinées (AND par défaut V1, OR en V1.5).

### Étape 4 — Notification

```text
Canaux       [✓ Notification in-app] [✓ Email]
Fréquence    (•) Immédiat  ( ) Quotidien 9h  ( ) Hebdomadaire lundi 9h
Priorité     (•) Info  ( ) Moyenne  ( ) Haute
Assigné à    [dropdown] Moi (par défaut) / autre collaborateur
```

### Étape 5 — Récapitulatif

Phrase lisible auto-générée + nommage :

```text
Propsight vous notifiera immédiatement lorsqu'un appartement T2 à Paris 15e
passera sous 550 000 € ou baissera de plus de 3%, avec une priorité moyenne.

Nom de l'alerte : [T2 Paris 15e sous 550k        ] (modifiable)

[Retour]                                                    [Créer l'alerte]
```

## 7.12 Santé des alertes (séparé)

Bouton en header `Santé de mes alertes [3]` si alertes avec `health_status != healthy` existent.

Clic → drawer latéral avec liste :

```text
Santé de mes alertes

⚠ Silencieuses (2)
  • "Studios < 250k" — aucun déclenchement depuis 42 jours
    Conseil : élargir la zone ou le seuil de prix
    [Modifier] [Archiver]

  • "DPE F Paris 14e" — aucun déclenchement depuis 38 jours
    [Modifier] [Archiver]

⚠ Bruyantes (1)
  • "Baisses biens suivis" — 89 déclenchements en 7 jours
    Conseil : augmenter le seuil de baisse (actuellement 1%)
    [Modifier]

⚠ En erreur (0)
```

Ces items ne polluent **pas** le feed Notifications principal.

---

# 8. Écran 2 — Notifications

## 8.1 Route

```text
/app/veille/notifications
```

## 8.2 Intention produit

Répond à :

> Qu'est-ce qui vient de se passer, pourquoi est-ce important, et quelle action dois-je faire maintenant ?

## 8.3 Layout général (référence maquette Image 3, réduit à 3 tabs)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Notifications · 38 non lues              [Marquer tout comme lu]     │
│ Suivez les événements importants détectés sur vos objets suivis.     │
│                                          [Préférences] [Exporter]    │
├──────────────────────────────────────────────────────────────────────┤
│ [Recherche] [Priorité▾] [Source▾] [Statut▾] [Assigné▾] [Période▾]   │
├──────────────────────────────────────────────────────────────────────┤
│ KPI : Non lues · Haute priorité · Actions suggérées · Ignorées 7j   │
├──────────────────────────────────────────────────────────────────────┤
│ [Toutes 38] [Non lues 38] [À traiter 21]      [⚙ Filtres avancés]   │
├──────────────────────────────────────────────────────────────────────┤
│ ● Aujourd'hui                                                         │
│   [Row notif 1]                                                       │
│   [Row notif 2]                                                       │
│ ● Hier                                                                │
│   [Row notif 3]                                                       │
│ ● Cette semaine                                                       │
│   ...                                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**Différence clé vs maquette** : seulement **3 tabs macro** en haut (`Toutes`, `Non lues`, `À traiter`), tous les autres filtres (priorité, source, biens suivis, alertes, prospection, concurrents, rapports ouverts, ignorées, traitées) sont dans le bouton `⚙ Filtres avancés` à droite.

## 8.4 Header

- Titre : `Notifications · [non_lues_count] non lues`
- Sous-titre : `Suivez les événements importants détectés sur vos biens, zones, alertes et concurrents.`
- Actions droite :
  - `[Marquer tout comme lu]` (outlined, demande confirmation si > 20 items)
  - `[Préférences]` (outlined, ouvre modal préférences notif — cf §8.12)
  - `[Exporter]` (outlined)

## 8.5 KPI row

| KPI | Valeur exemple | Clic → action |
|---|---:|---|
| Non lues | 38 | active tab `Non lues` |
| Haute priorité | 9 | filtre `priority=haute` |
| Actions suggérées | 17 | filtre `status=todo` |
| Ignorées 7j | 12 | filtre `status=ignored AND ignored_at >= 7j` |

Chaque tuile delta : `+12 vs 7 derniers jours`.

## 8.6 Tabs macro (3 seulement)

```text
[Toutes 214] [Non lues 38] [À traiter 21]                 [⚙ Filtres avancés]
```

Règle : seules 3 surfaces d'arrivée possibles par tab. Les autres axes de filtrage passent par le bouton `Filtres avancés`.

### Bouton "Filtres avancés"

Clic → popover ou drawer latéral droit avec sections groupées :

```text
Filtres avancés
──────────────────────────────────
Priorité       [✓ Haute] [ Moyenne] [ Info]
Statut         [ Unread] [ Read] [✓ Todo] [ Done] [ Ignored]
Source         [ Alertes] [ Biens suivis] [ Prospection]
                [ Observatoire] [ Investissement] [ Concurrents]
                [ Rapports] [ System]
Type d'objet   [ Bien] [ Zone] [ Agence] [ Rapport] ...
Assigné        [dropdown]
Période        Aujourd'hui / 7j / 30j / Custom
Zone           [dropdown]

Presets sauvegardés :
  • Haute priorité                    [Appliquer] [⋯]
  • Rapports ouverts cette semaine    [Appliquer] [⋯]
  • Concurrents uniquement            [Appliquer] [⋯]

[Réinitialiser]                              [Appliquer]
```

Les presets sont sauvegardables via `Enregistrer cette vue`. Ils remplacent les tabs multiples de l'ancienne proposition.

## 8.7 Filtres horizontaux (en top, visibles)

Au-dessus des tabs, 6 filtres rapides en dropdowns :

- Recherche texte (sur title, message, object_label)
- Priorité (multi)
- Source (multi)
- Statut (multi)
- Assigné (single)
- Période (single : Aujourd'hui / 7j / 30j / Custom)

Ces filtres horizontaux sont **en plus** du bouton Filtres avancés. Ils couvrent 80% des usages. Les filtres avancés servent pour les combinaisons fines.

## 8.8 Structure d'une notification (row)

Chaque `NotificationRow` affiche (72-88px de haut) :

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ● [badge prio] Titre notification                  il y a 2h         │
│ [icône source] Objet · détail                                        │
│ Message factuel · données chiffrées                                  │
│ Impact : [explanation ou business_impact]                            │
│ [CTA principal]  [CTA secondaire]  [⋯] [statut badge]                │
└──────────────────────────────────────────────────────────────────────┘
```

Point visuel gauche :
- `●` violet plein = unread
- `○` vide = read
- `⏰` orange = todo
- `✓` vert = done
- `✕` gris = ignored

Hover row : bg `--muted`. Clic → ouvre drawer. Clic CTA : action directe.

## 8.9 Grouping (par date)

Par défaut, notifications groupées par buckets de date :

```text
● Aujourd'hui
● Hier
● Cette semaine
● Plus ancien
```

Header de groupe cliquable pour plier/déplier. Les ignored apparaissent dans leur bucket temporel si `Afficher ignorées` est activé, grisées.

## 8.10 Types de notifications V1 — catalogue

### Biens suivis (8 types)
- Baisse de prix
- Hausse de prix
- Nouvelle annonce sur une autre source
- Sortie de publication
- Remise en ligne
- Annonce devenue ancienne (>90j sur le marché)
- Concurrent détecté (autre agence publie le même bien)
- Nouvelle vente DVF comparable dans le quartier

### Alertes (méta — cf §2.9, séparées)
- Alerte déclenchée (notif principale : l'alerte matche un événement)

### Prospection (3 types)
- Nouveau signal haute priorité dans ma zone
- Signal suivi mis à jour
- Signal ignoré réactivé par nouvel événement

### Observatoire (6 types)
- Stock zone en hausse significative
- Tension en baisse (zone devient plus dynamique/moins tendue)
- Délai de vente qui s'allonge
- Prix annonces et DVF divergent
- Nouveau permis de construire important dans zone suivie
- Nouveau signal PLU

### Investissement (5 types)
- Bien suivi devenu opportunité
- Rendement net franchit un seuil
- Baisse de prix améliore cash-flow
- Projet invest compatible détecté
- Dossier invest ouvert / mis à jour

### Estimation & Rapport (4 types)
- Avis de valeur ouvert par client (tracking pixel — dépendance V1.5 potentielle)
- Étude locative ouverte
- Dossier investissement ouvert
- Marché a changé depuis envoi du rapport → relance recommandée

### Agences concurrentes (5 types)
- Nouvelle annonce concurrente sur ma zone
- Baisse de prix concurrente
- Agence devient active sur ma zone
- Bien similaire à mon portefeuille détecté
- **Mandat simple sous pression** (cas métier fort, badge rouge)

### Système (3 types, séparés — cf §2.9)
- Alerte silencieuse depuis 30j
- Alerte très bruyante (>X déclenchements / période)
- Alerte en erreur (pipeline data)

## 8.11 Drawer notification

Variant `notification` du `<DrawerVeille>`. Cf §6.3 pour structure complète.

## 8.12 Préférences notifications (modal)

Accessible depuis `[Préférences]` en header.

```text
Préférences notifications

CANAUX PAR DÉFAUT
  ☑ In-app (toujours actif)
  ☑ Email

FRÉQUENCE EMAIL
  ( ) Instantané
  (•) Digest quotidien 9h
  ( ) Digest hebdo lundi 9h

SEUIL PRIORITÉ POUR EMAIL
  Envoyer par email seulement si priorité >= :
  ( ) Info  (•) Moyenne  ( ) Haute

RÈGLES ANTI-BRUIT
  ☑ Agréger événements similaires (≥ 3 en 1h → 1 notif)
  ☑ Throttler alertes immédiates (max 1 notif/h/alerte)

HEURES DE SILENCE
  Ne pas envoyer d'email entre [20h] et [8h]
  Ne pas envoyer le week-end (☐ samedi ☐ dimanche)

HEADER BELL ICON
  Afficher compteur rouge [✓]
  Afficher popover au clic [✓]

[Annuler]                                                   [Enregistrer]
```

## 8.13 Bulk actions

Si plusieurs rows sélectionnés (checkbox row) :

```text
3 notifications sélectionnées
[Marquer lu] [Marquer traité] [Ignorer] [Assigner] [Exporter]
```

Pas de `Créer actions groupées` V1 (Action ≠ Notification, créer 3 actions simultanées complexifie trop). Proposé V1.5.

## 8.14 Règles anti-bruit UI-side

Quand une notification `is_aggregated=true` :

```text
┌──────────────────────────────────────────────────────────────────────┐
│ ● [Moyenne] 3 baisses de prix sur Paris 15e        ce matin          │
│ [icône alerte] Alerte "T2 Paris 15e sous 550k"                       │
│ 3 événements agrégés · baisse moyenne -3,2%                          │
│ Impact : tension acheteur probable en hausse                         │
│ [Voir les 3 biens]  [Créer action groupée]  [⋯]                      │
└──────────────────────────────────────────────────────────────────────┘
```

Le clic `Voir les 3 biens` ouvre la table Biens filtrée sur les 3 biens concernés (via `metadata.bien_ids`).

---

# 9. Écran 3 — Biens suivis

## 9.1 Route

```text
/app/veille/biens-suivis
```

## 9.2 Intention produit

Répond à :

> Quels biens j'ai sauvegardés, qu'est-ce qui a changé dessus, et lesquels méritent une action aujourd'hui ?

## 9.3 Règle source unique (rappel critique)

`Veille > Biens suivis` est **la source unique de vérité** des favoris. Aucun autre module ne possède de section Favoris. Toute modif ici impacte tout le produit via broadcast.

Cf §2.2 pour le détail mécanique.

## 9.4 Layout général (référence maquette Image 1)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Biens suivis · 86                          [+ Ajouter un bien]       │
│ Tous les biens sauvegardés depuis vos annonces, signaux, analyses... │
│                                  [Créer alerte groupée] [Exporter]   │
├──────────────────────────────────────────────────────────────────────┤
│ [Recherche] [Source▾] [Ville▾] [Variation▾] [DPE▾] [Statut▾] [Plus] │
├──────────────────────────────────────────────────────────────────────┤
│ KPI : Biens suivis · Changements 7j · Baisses prix · Opportunités   │
├──────────────────────────────────────────────────────────────────────┤
│ [Table] [Cards] [Carte]                                              │
├──────────────────────────────────────────────────────────────────────┤
│ Table biens suivis (scroll interne)                                  │
│ Pagination bas                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 9.5 Header

- Titre : `Biens suivis · [count]`
- Sous-titre : `Tous les biens sauvegardés depuis vos annonces, signaux, analyses et dossiers.`
- Actions droite :
  - `[+ Ajouter un bien]` (primaire) — ouvre modal recherche pour ajouter un bien manuellement (cas rare, la majorité des ♡ viennent des autres modules)
  - `[Créer alerte groupée]` (outlined) — crée une alerte sur la sélection multiple de biens
  - `[Exporter]` (outlined)

## 9.6 KPI row

| KPI | Valeur exemple | Clic → filtre |
|---|---:|---|
| Biens suivis | 86 | reset filtres |
| Changements 7j | 21 | `last_event_at <= 7j` |
| Baisses de prix | 8 | `last_event_type=baisse_prix` |
| Opportunités | 14 | `score_interet >= 75` |

Deltas 7j visibles.

## 9.7 Vue toggle

```text
[Table] (défaut) · [Cards] · [Carte]
```

- **Table** : densité maximale pour surveillance
- **Cards** : revue qualitative (photo + infos condensées)
- **Carte** : Mapbox avec clusters par zone, clic pin → card popover

## 9.8 Filtres

Visibles horizontal :
- Recherche (adresse, description)
- Source d'ajout (annonces / portefeuille / dvf / prospection / investissement / estimation / observatoire / fiche_bien / manuel)
- Ville / Zone
- Variation prix (range % : -10% / -5% / -3% / 0 / +3%)
- DPE (multi : A à G)
- Statut annonce (actif / baisse / expiré / remis en ligne)
- `Plus` (popover) :
  - Prix (range €)
  - Surface (range m²)
  - Type bien
  - Dernier événement (type + fraîcheur)
  - Présence opportunité
  - Lead lié
  - Action ouverte
  - Alerte active
  - Score intérêt (range 0-100)
  - Assigné

## 9.9 Table — colonnes (référence maquette Image 1)

| # | Colonne | Contenu | Tri | Largeur |
|---|---|---|---|---|
| 1 | Bien | Photo 40x40 + adresse + type | — | 280px |
| 2 | Source principale | Logo portail (SeLoger, Leboncoin, Bien'ici, PAP, Logic Immo) | — | 120px |
| 3 | Ville | `ville` ou `quartier` | oui | 100px |
| 4 | Prix actuel | Prix + €/m² | oui | 120px |
| 5 | Variation | `-20 000 € / -3,6%` avec flèche colorée | oui | 120px |
| 6 | Surface | `60 m²` | oui | 70px |
| 7 | DPE | Badge classe (couleur officielle) | oui | 50px |
| 8 | Statut | Badge `Baisse` / `Actif` / `Remis en ligne` | oui | 110px |
| 9 | Dernier événement | Freshness + label | oui | 100px |
| 10 | Score intérêt | `82 · Forte opportunité` coloré | oui | 160px |
| 11 | Alertes actives | Cloche + count | oui | 60px |
| 12 | Liens | 4 icônes compactes (estimation, lead, action, analyse) | — | 140px |
| 13 | Assigné | Avatar | — | 50px |
| 14 | Actions | ⋯ menu | — | 40px |

Row height : 64px (plus haut pour la photo). Clic row → drawer.

## 9.10 Card bien suivi (vue Cards)

```text
┌─────────────────────────────────────────────┐
│ [Photo 16:9]                          ♡     │
├─────────────────────────────────────────────┤
│ Appartement T2 · Paris 15e · DPE D          │
│ 42 m² · 2p · 45 rue Lecourbe                │
├─────────────────────────────────────────────┤
│ 510 000 € · 12 143 €/m²                     │
│ ↓ -3,8 % depuis 6 jours                     │
├─────────────────────────────────────────────┤
│ Dernier événement : baisse il y a 2h        │
│ Score intérêt : 82 · Forte opportunité       │
├─────────────────────────────────────────────┤
│ 🔔 2 · 👤 1 lead · 📊 Analyse ouverte       │
├─────────────────────────────────────────────┤
│ [Analyser] [Action] [Alerte] [⋯]            │
└─────────────────────────────────────────────┘
```

## 9.11 Carte (vue Mapbox)

- Mapbox GL v3 (aligné Observatoire §3.8)
- Clusters par zoom (chiffre = nb biens)
- Clic cluster → zoom in
- Clic pin → popover mini-card avec CTA `Ouvrir drawer`
- Légende : couleur pin selon score intérêt (rouge ≥75, orange 50-74, gris <50)
- Panneau latéral gauche : liste biens filtrés (mirror table)

## 9.12 Score intérêt — formule V1

4 contributeurs, total 0-100, poids équilibrés :

```text
score_interet =
  variation_prix_score     (0–30)  // baisse récente > 0 → points
+ tension_zone_score       (0–25)  // tension zone de l'Observatoire
+ anciennete_annonce_score (0–20)  // annonce > 90j → points
+ pression_concurrent_score(0–25)  // concurrent ou mandat sous pression
```

### Règles de calcul V1 (explicables)

**variation_prix_score** :
- Baisse ≥ 5% sur 30j : 30 pts
- Baisse 3-5% : 20 pts
- Baisse 1-3% : 10 pts
- Stable ou hausse : 0 pts

**tension_zone_score** :
- Tension zone (score Observatoire 0-100) × 0,25

**anciennete_annonce_score** :
- Annonce > 120j : 20 pts
- 90-120j : 15 pts
- 60-90j : 10 pts
- < 60j : 0 pts

**pression_concurrent_score** :
- Mandat simple sous pression détecté : 25 pts
- Concurrent publie bien similaire : 15 pts
- Agence concurrente active sur zone : 10 pts
- Aucun : 0 pts

### Labels

- `forte_opportunite` : score ≥ 75 (couleur vert foncé)
- `a_surveiller` : 50–74 (couleur bleu)
- `faible_priorite` : < 50 (couleur gris)

### Breakdown visible

Dans drawer et en hover sur la cellule Score :

```text
Score intérêt : 82 · Forte opportunité

Variation de prix         +30   Baisse -3,8% en 6j
Tension de zone           +20   Paris 15e · tension 80
Ancienneté annonce        +0    Annonce récente (12j)
Pression concurrent       +25   Concurrent détecté (Agence X)
─────────────────────────
Total                     +75 → normalisé 82/100
```

### Évolutions V1.5

Pour persona investisseur : ajout d'un 5e contributeur `coherence_projet_score` (0-25) basé sur matching avec projet d'investissement actif. Score re-normalisé sur 100.

## 9.13 Drawer bien suivi

Variant `bien_suivi` du `<DrawerVeille>`. Cf §6.4.

## 9.14 Actions rapides complètes (drawer + menu ligne)

```text
Ouvrir fiche bien (canonique)
Ouvrir annonce source
Analyse invest (ouvre ?analyse=[bien_id])
Estimer (Estimation rapide / Avis de valeur / Étude locative)
Créer action
Créer / rattacher lead
Ajouter au comparatif
Créer alerte sur ce bien
Rattacher à un dossier
Retirer du suivi
```

## 9.15 Bulk actions

Avec multi-select (checkboxes) :

```text
N biens sélectionnés
[Comparer (max 4)] [Créer alerte groupée] [Assigner] [Exporter] [Retirer du suivi]
```

---

# 10. Écran 4 — Agences concurrentes

## 10.1 Route

```text
/app/veille/agences-concurrentes
```

## 10.2 Intention produit

Répond à :

> Quelles agences concurrentes sont actives sur mes zones, comment leur stock évolue, et où cela impacte mon portefeuille ou mes mandats simples ?

## 10.3 Niveau d'ambition V1 "moyen" (figé)

Inclus V1 :
- Liste d'agences suivies (add manuel via SIRENE)
- Stock actif, nouvelles annonces, baisses, prix moyen, délai moyen
- **Parts de marché par zone + évolution 30j** (différenciant V1 "moyen")
- Zones fortes, types de biens dominants

Flag V1.5 (derrière feature flag `AGENCE_MATCHING_ENABLED`) :
- Matching automatique des biens similaires avec le portefeuille
- Détection automatique "Mandat simple sous pression"
- Suggestion de zones de concurrence à surveiller

En V1 sans flag : les colonnes `Biens similaires` et `Mandats simples` affichent un placeholder "Bientôt" ou sont masquées. Les suggestions IA du drawer agence qui dépendent du matching affichent "Activation en cours".

## 10.4 Layout général (référence maquette Image 2)

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Agences concurrentes · 18 suivies        [+ Suivre une agence]       │
│ Surveillez les agences actives sur vos zones.                        │
│                                [Découvrir agences actives] [Exporter]│
├──────────────────────────────────────────────────────────────────────┤
│ [Recherche agence] [Zone▾] [Stock▾] [Baisses▾] [Biens similaires▾] [+]│
├──────────────────────────────────────────────────────────────────────┤
│ KPI : Agences suivies · Nouvelles 7j · Baisses 30j · Zones concur. │
├──────────────────────────────────────────────────────────────────────┤
│ [Table] [Cards] [Carte]                                              │
├──────────────────────────────────────────────────────────────────────┤
│ Table agences (scroll interne)                                       │
└──────────────────────────────────────────────────────────────────────┘
```

## 10.5 Header

- Titre : `Agences concurrentes · [count] suivies`
- Sous-titre : `Surveillez les agences actives sur vos zones et leurs mouvements d'annonces.`
- Actions droite :
  - `[+ Suivre une agence]` (primaire) — ouvre modal SIRENE search
  - `[Découvrir agences actives]` (outlined) — ouvre drawer avec agences actives sur mes zones que je ne suis pas encore
  - `[Exporter]` (outlined)

## 10.6 KPI row

| KPI | Valeur exemple | Clic → filtre |
|---|---:|---|
| Agences suivies | 18 | tous |
| Nouvelles annonces 7j | 42 | tri par `nouvelles_annonces_7d` desc |
| Baisses de prix 30j | 11 | tri par `baisses_prix_30d` desc |
| Zones en concurrence | 7 | zones où ≥ 1 agence concurrente active |

## 10.7 Filtres

Horizontaux visibles :
- Recherche (nom, SIREN, ville)
- Zone (multi dropdown)
- Stock actif (range)
- Baisses 30j (range)
- Biens similaires (toggle on/off — masqué si flag matching off)
- `Plus` :
  - Ville
  - Types de biens dominants
  - Prix moyen (range €/m²)
  - Mandats simples en concurrence (toggle)
  - Statut suivi (suivi / à surveiller / non suivi)
  - Alertes actives (toggle)
  - Délai moyen (range)

## 10.8 Vue toggle

```text
[Table] (défaut) · [Cards] · [Carte]
```

Table : cas principal. Carte : agences géolocalisées sur zones.

## 10.9 Table — colonnes (référence maquette Image 2)

| # | Colonne | Contenu | Tri | Largeur |
|---|---|---|---|---|
| 1 | Drag handle | ⋮⋮ (réordonner V1.5) | — | 24px |
| 2 | Agence | Logo/initiales + nom + sous-badge "À surveiller" si applicable | — | 240px |
| 3 | Zone principale | `ville` ou zone forte | oui | 140px |
| 4 | Stock actif | Nombre | oui | 80px |
| 5 | Nouvelles 7j | Nombre + mini sparkline | oui | 100px |
| 6 | Baisses 30j | Nombre | oui | 90px |
| 7 | Prix moyen | `€/m²` | oui | 100px |
| 8 | Délai moyen | `j` | oui | 80px |
| 9 | Zones fortes | Chips (max 3 + `+N` si plus) | — | 180px |
| 10 | Biens similaires | Count (flag matching) | oui | 90px |
| 11 | Mandats simples | Count (flag matching) | oui | 90px |
| 12 | Dernier mouvement | Freshness + label court | oui | 140px |
| 13 | Statut suivi | Badge `Mandat simple sous pression` rouge / `Concurrent détecté` orange / `Sous surveillance` bleu | oui | 160px |
| 14 | Actions | ⋯ | — | 40px |

Row height : 56px. Row avec `has_mandat_simple_sous_pression=true` a un liseré gauche rouge pour attirer l'œil.

## 10.10 Cas "Mandat simple sous pression"

**Statut métier first-class** dans Veille, traité avec une attention particulière.

### Définition

Une agence a un `mandat_simple_sous_pression` si :
- L'utilisateur a un mandat simple dans son portefeuille
- Cette agence publie un bien similaire (matching sur adresse OU caractéristiques fingerprint)
- Le prix concurrent est **inférieur** à celui du mandat utilisateur

### Affichage

- Badge rouge dans colonne "Statut suivi" de la table
- Liseré gauche rouge 3px sur la ligne
- Dans le drawer agence : bloc dédié en haut avec CTA "Voir le mandat en détail"
- Suggestion IA du drawer : argumentaire automatique

### Exemple complet d'affichage (dans drawer agence)

```text
⚠ Mandat simple sous pression

Votre mandat : Studio 24 m² · Paris 15e · 45 rue Lecourbe
Prix affiché : 515 000 €
Prix concurrent : 490 000 € (-4,9%)
Agence concurrente : Agence Métropole (cette agence)
Date de détection : il y a 2j

Action recommandée : préparer un point vendeur avec argumentaire de repositionnement.

[Préparer point vendeur]  [Comparer les deux annonces]  [Ignorer le signal]
```

## 10.11 Drawer agence concurrente

Variant `agence` du `<DrawerVeille>`. Cf §6.5.

## 10.12 Modal "Suivre une agence"

Accessible depuis `[+ Suivre une agence]` en header.

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Suivre une agence concurrente                               [×]      │
├──────────────────────────────────────────────────────────────────────┤
│ Rechercher par nom, SIREN, SIRET ou ville                            │
│ [🔍 Agence Métropole                                     ]            │
│                                                                      │
│ Résultats (source INSEE SIRENE) :                                    │
│                                                                      │
│ ● Agence Métropole · Paris 15e                                       │
│   SIREN 523 489 612 · Carte T CPI 7501 2018 000 034 567              │
│   36 rue de Vaugirard · 75015 Paris                                  │
│   Activité NAF : 6831Z Agences immobilières                          │
│   [Sélectionner]                                                     │
│                                                                      │
│ ○ Agence Métropole Lyon · Lyon 3e                                    │
│   ...                                                                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ CONFIGURATION DU SUIVI                                               │
│ ☑ Nouvelles annonces                                                 │
│ ☑ Baisses de prix                                                    │
│ ☐ Biens similaires à mon portefeuille    (flag matching V1.5)       │
│ ☐ Mandats simples en concurrence          (flag matching V1.5)      │
│                                                                      │
│ Fréquence : ( ) Immédiat (•) Quotidien ( ) Hebdo                     │
│ Assigné : [Dropdown] Moi                                             │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ [Annuler]                                    [Suivre cette agence]   │
└──────────────────────────────────────────────────────────────────────┘
```

## 10.13 Découverte d'agences (drawer latéral)

`[Découvrir agences actives]` → drawer droit avec liste :

```text
Agences actives sur vos zones que vous ne suivez pas encore

Paris 15e (12 agences actives)
  ● Agence X — 86 biens actifs — part de marché 12%
    [Suivre]
  ● Agence Y — 54 biens actifs — part de marché 7%
    [Suivre]
  ...

Boulogne-Billancourt (8 agences actives)
  ...
```

Classement par part de marché sur la zone (nécessite matching zone × SIRENE).

## 10.14 Parts de marché (différenciant V1 "moyen")

Dans le drawer agence, bloc dédié :

```text
Parts de marché par zone

Zone          Part actuelle    Évolution 30j
Paris 15e     12%              ↑ +1,2 pts
Paris 16e     8%               → 0
Paris 7e      4%               ↓ -0,3 pts
Paris 6e      3%               ↑ +0,1 pts
+2 autres                      [Voir tout]
```

Définition `part_de_marche` : `nb_biens_agence_zone / nb_biens_total_zone` sur période glissante 30j.

Source data : agrégation des annonces portails + `siret` de publication. À flagger comme dépendance data (pipeline doit extraire le SIREN depuis chaque annonce, certains portails le fournissent, d'autres non).

## 10.15 Bulk actions

Multi-select agences :
```text
N agences sélectionnées
[Créer alerte groupée] [Comparer à mon portefeuille] [Exporter] [Ne plus suivre]
```

---

# 11. Consentement RGPD & politique de contact

## 11.1 Principe

Veille expose des CTA d'action commerciale (Créer action, Créer lead, Appeler). Certains de ces CTA peuvent amener à un démarchage. Propsight **doit** afficher un garde-fou visuel pour protéger les utilisateurs et leurs contacts.

**V1 scope** : affichage + règles CTA adaptatives. La **collecte** de consentement (formulaires, sync CRM) est hors scope V1.

## 11.2 Champ `ContactPolicy`

Attaché à `Bien` (si propriétaire connu) et à `Lead` (toujours). Pas aux notifications directement.

Valeurs `consent_status` :
- `unknown` : non renseigné (par défaut)
- `opt_in` : consentement explicite donné
- `contractual` : relation contractuelle existante (mandat, vente)
- `do_not_contact` : opposition explicite ou liste Bloctel

## 11.3 Règles CTA

### Si `consent_status = unknown` (cas majoritaire V1)

CTA autorisés :
```text
[Créer action]         ← tâche interne, pas de contact direct
[Préparer approche]    ← préparation document, pas d'envoi
[Rattacher lead]       ← qualification interne
[Ajouter note]
```

CTA évités (boutons désactivés ou masqués) :
```text
[Appeler maintenant]
[Envoyer SMS]
[Envoyer email direct]
```

Badge UI visible : `⚠ Consentement inconnu`

### Si `opt_in` ou `contractual`

Tous CTA autorisés :
```text
[Appeler]  [Envoyer email]  [WhatsApp] (V1.5)
```

Badge UI : `✓ Consentement OK` (discret)

### Si `do_not_contact`

CTA contact **masqués** ou explicitement bloqués. Seuls actions internes disponibles.

Bandeau en top du drawer : `🚫 Ce contact est sur liste d'opposition. Aucun démarchage autorisé.`

## 11.4 Affichage dans drawer

Dans les drawers `notification`, `bien_suivi`, `agence`, section Key info :

```text
Canal recommandé : email / action interne
Consentement : inconnu
```

Avec tooltip expliquant ce que ça veut dire pour l'utilisateur.

## 11.5 V1.5 prévu

- Collecte consentement via formulaires (widget, pop-in site)
- Import Bloctel
- Sync CRM (Apimo, Hektor) pour récupérer les statuts
- Logs d'audit des actions de contact
- Règle globale d'organisation (ex : "Toujours bloquer CTA direct si unknown")

---

# 12. Liens inter-modules

## 12.1 Vue d'ensemble

Veille est un module **hub** : il reçoit des événements de tous les autres modules et redirige vers des actions dans tous les autres modules.

```text
                      ┌──────────────────┐
                      │                  │
            ┌────────►│     VEILLE       │◄──────────┐
            │         │                  │           │
   Biens ───┘         │  • Alertes       │           └─── Observatoire
   Annonces           │  • Notifications │               Marché/Tension/Contexte
   DVF                │  • Biens suivis  │
                      │  • Agences       │
   Prospection ──────►│                  │◄────── Investissement
   Radar/DVF/DPE      └──┬───────────────┘       Opportunités/Analyse/Dossier
                         │
                         ▼
                   Sortants :
                   • Fiche bien
                   • Estimations
                   • Analyses invest
                   • Comparatifs
                   • Leads / Actions
                   • Dossiers
```

## 12.2 Entrants vers Veille

### Depuis Biens immobiliers

```text
Clic ♡ sur annonce / DVF / fiche bien     → BienSuivi créé
Sauvegarde recherche annonces              → Alerte target_type=recherche créée
Bouton "Créer alerte baisse prix"          → Alerte domain=prix créée
```

### Depuis Prospection

```text
Signal → Suivi (bien)                      → BienSuivi créé
Signal → Suivi (zone)                      → Alerte target_type=zone créée
Signal → Créer alerte                      → Alerte créée avec source_module=prospection
"Gérer mes zones" → Veille > Alertes       → navigation
```

### Depuis Observatoire

```text
ReuseDataBlock "Créer alerte de veille"     → Alerte avec contexte zone/indicateur
Marché → Créer alerte prix/volume/rendement → Alerte domain=prix ou marche
Tension → Créer alerte stock/délai/baisse   → Alerte domain=marche
Contexte local → Créer alerte urbanisme/PLU → Alerte domain=urbanisme
```

### Depuis Investissement

```text
Opportunité → Suivre                        → BienSuivi créé (source=investissement)
Analyse → Créer alerte rendement/prix/loyer → Alerte créée
Dossier → Pousser alerte dans Veille        → Alerte créée
Comparatif zones → "Suivre cette zone"      → Alerte zone créée
```

### Depuis Estimation

```text
Avis de valeur → Suivre bien                → BienSuivi créé (source=estimation)
Étude locative → Alerte loyer/réglementation → Alerte créée
Rapport envoyé → Tracking ouverture          → NotificationVeille (source=rapport)
                                               (dépendance pixel, V1.5 si pas prêt)
```

### Depuis Leads

```text
Lead → Créer alerte liée au bien/zone       → Alerte créée
Lead → Suivre bien lié                      → BienSuivi créé
```

## 12.3 Sortants depuis Veille

Chaque objet Veille peut rediriger vers :

```text
→ Fiche bien canonique                      /app/biens/[id]
→ Annonce source                            portail externe (nouvelle onglet)
→ Prospection Radar                         /app/prospection/radar?zone=[x]
→ Signaux DVF / DPE                         /app/prospection/signaux-dvf?...
→ Observatoire Marché                       /app/observatoire/marche?zone=[x]
→ Observatoire Tension                      /app/observatoire/tension?zone=[x]
→ Observatoire Contexte local               /app/observatoire/contexte-local?...
→ Estimation rapide                         /app/estimation/rapide?bien=[id]
→ Avis de valeur                            /app/estimation/avis-de-valeur?bien=[id]
→ Étude locative                            /app/estimation/locative?bien=[id]
→ Analyse invest (modal global)             ?analyse=[bien_id]
→ Comparatif (modal global)                 ?comparatif=[id1,id2,id3]
→ Dossier invest                            /app/investissement/dossiers/[id]
→ Mon activité > Leads                      /app/activite/leads?id=[x]
→ Mon activité > Pilotage commercial        /app/activite/pilotage
→ Nouvelle Action (modal)                   via bouton Créer action
```

## 12.4 Matrice objet Veille × actions sortantes

| Objet Veille | Fiche bien | Estimation | Analyse | Comparatif | Lead | Action | Dossier | Observatoire |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| Notification (bien) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| Notification (zone) | — | — | — | — | — | ✓ | — | ✓ |
| Notification (agence) | — | — | — | — | ✓ | ✓ | — | — |
| Notification (rapport) | ✓ | ✓ | — | — | ✓ | ✓ | — | — |
| Bien suivi | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Alerte | — | — | — | — | — | ✓ | — | — |
| Agence concurrente | — | — | — | ✓ | ✓ | ✓ | — | — |

Légende : ✓ = action disponible, — = non applicable.

---

# 13. Composants partagés et library

## 13.1 Arborescence /src/components/veille

```text
/src/components/veille
  /layout
    VeillePageLayout.tsx         // Header + KPI + Tabs + Filters + Content
    VeillePageHeader.tsx
    VeilleKpiRow.tsx
    VeilleTabsMacro.tsx          // 3 tabs pour Notifications
    VeilleTabsDomain.tsx         // 8 tabs pour Mes alertes
    VeilleFiltersBar.tsx
    VeilleAdvancedFiltersPopover.tsx
  /drawer
    DrawerVeille.tsx              // orchestrateur 4 variants
    DrawerAlerte.tsx
    DrawerNotification.tsx
    DrawerBienSuivi.tsx
    DrawerAgence.tsx
    DrawerHeader.tsx              // zone 1
    DrawerKeyInfo.tsx             // zone 2
    DrawerPerformanceKpis.tsx     // zone 3
    DrawerActionsGrid.tsx         // zone 4
    DrawerInterModuleChips.tsx    // zone 5
    DrawerTimeline.tsx            // zone 6
    DrawerAiSuggestion.tsx        // zone 7
    DrawerDestructiveFooter.tsx
  /alertes
    AlertesTable.tsx
    AlertesTableRow.tsx
    AlerteStatusBadge.tsx
    AlerteDomainBadge.tsx
    AlerteFrequencyBadge.tsx
    AlerteCreationWizard.tsx      // modal 5 étapes
    AlerteCreationStepTarget.tsx
    AlerteCreationStepPerimeter.tsx
    AlerteCreationStepConditions.tsx
    AlerteCreationStepNotification.tsx
    AlerteCreationStepRecap.tsx
    AlertesHealthDrawer.tsx       // santé alertes séparée
  /notifications
    NotificationsFeed.tsx
    NotificationsFeedGroup.tsx    // groupe par date
    NotificationRow.tsx
    NotificationStatusDot.tsx
    NotificationSourceIcon.tsx
    NotificationPriorityBadge.tsx
    NotificationAggregatedRow.tsx // row agrégée spéciale
    NotificationsBulkBar.tsx
    NotificationsPreferencesModal.tsx
  /biens-suivis
    BiensSuivisTable.tsx
    BiensSuivisTableRow.tsx
    BiensSuivisCardsGrid.tsx
    BienSuiviCard.tsx
    BiensSuivisMap.tsx
    BiensSuivisViewToggle.tsx
    ScoreInteretBadge.tsx
    ScoreInteretBreakdown.tsx     // hover/drawer
    FollowToggle.tsx              // ♡ toggle broadcast
  /agences
    AgencesTable.tsx
    AgencesTableRow.tsx
    AgenceLogo.tsx
    AgenceZoneChips.tsx
    AgenceMarketSharePanel.tsx
    MandatSimpleSousPressionBlock.tsx
    AgenceAddModal.tsx            // SIRENE search
    AgenceDiscoveryDrawer.tsx
  /shared
    FreshnessLabel.tsx            // cf §2.7
    InterModuleChip.tsx
    ActionCard.tsx                // bouton grille actions
    DomainIcon.tsx
    SparklineMini.tsx
    AssigneeAvatar.tsx
    EmptyState.tsx
    LoadingSkeleton.tsx
```

## 13.2 Composants clés — contrats props

### VeillePageLayout

```ts
interface VeillePageLayoutProps {
  title: string;
  count: number;
  subtitle: string;
  primaryAction?: { label: string; onClick: () => void; icon?: React.ReactNode };
  secondaryActions?: Array<{ label: string; onClick: () => void; icon?: React.ReactNode }>;
  kpis: KpiTile[];
  filtersBar: React.ReactNode;
  tabs: React.ReactNode;
  viewToggle?: React.ReactNode;
  children: React.ReactNode;       // table/feed/cards
}
```

### DrawerVeille

```ts
type DrawerVeilleProps =
  | { variant: 'alerte'; id: string; onClose: () => void }
  | { variant: 'notification'; id: string; onClose: () => void }
  | { variant: 'bien_suivi'; id: string; onClose: () => void }
  | { variant: 'agence'; id: string; onClose: () => void };
```

### FollowToggle (broadcast ♡)

```ts
interface FollowToggleProps {
  bienId: string;
  source: BienSuiviSource;
  sourceId?: string;
  initialFollowed: boolean;
  onChange?: (followed: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
}
```

Comportement :
1. Optimistic update UI
2. PATCH `/api/veille/biens-suivis` (créer ou supprimer)
3. `queryClient.invalidateQueries({ queryKey: ['followed-property', bienId] })` pour broadcast cross-modules
4. Toast avec bouton Annuler (5s)
5. Rollback si PATCH échoue

### ScoreInteretBadge + Breakdown

```ts
interface ScoreInteretBadgeProps {
  score: number;              // 0-100
  label: ScoreInteretLabel;
  breakdown: ScoreContributor[];
  showBreakdownOnHover?: boolean;
  size?: 'sm' | 'md';
}
```

Rendu : `82 · Forte opportunité` avec couleur selon label. Hover → tooltip avec les 4 contributeurs alignés à droite.

### FreshnessLabel

```ts
interface FreshnessLabelProps {
  date: string | Date;          // ISO ou Date
  variant?: 'default' | 'muted' | 'bold';
  showTooltip?: boolean;        // default true
}
```

Utilise `lib/dates/freshness.ts` pour computer le label selon §2.7.

### NotificationRow

```ts
interface NotificationRowProps {
  notification: NotificationVeille;
  onClick: () => void;
  onMarkRead?: () => void;
  onMarkDone?: () => void;
  onIgnore?: () => void;
  onExecuteRecommendedAction?: () => void;
  isSelected?: boolean;
  onSelectChange?: (selected: boolean) => void;
  dense?: boolean;
}
```

### InterModuleChip

```ts
interface InterModuleChipProps {
  label: string;
  count?: number;
  href?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger' | 'warning' | 'success';
}
```

Exemples d'utilisation :
```tsx
<InterModuleChip label="Mandats en concurrence" count={3} variant="danger" />
<InterModuleChip label="Biens correspondants" count={12} />
<InterModuleChip label="Recherches associées" count={0} />
```

### DrawerAiSuggestion

```ts
interface DrawerAiSuggestionProps {
  insight: string;              // 2 lignes max
  ctaLabel?: string;            // default "Voir suggestion détaillée →"
  onCtaClick: () => void;       // ouvre drawer IA global
  context: {
    objectType: NotificationObjectType;
    objectId: string;
  };
  loading?: boolean;
}
```

Rendu : bloc violet clair `--ai-bg-subtle`, badge `BETA`, icône ✨.

## 13.3 Hooks partagés

```ts
// lib/hooks/veille/useAlertes.ts
export function useAlertes(filters: AlerteFilters): UseQueryResult<Alerte[]>
export function useAlerte(id: string): UseQueryResult<Alerte>
export function useCreateAlerte(): UseMutationResult<Alerte, Error, AlerteCreateInput>
export function useUpdateAlerte(): UseMutationResult<Alerte, Error, AlerteUpdateInput>
export function useDeleteAlerte(): UseMutationResult<void, Error, string>
export function useAlerteHealth(): UseQueryResult<AlerteHealth[]>

// lib/hooks/veille/useNotifications.ts
export function useNotifications(filters: NotifFilters): UseInfiniteQueryResult<NotificationVeille[]>
export function useUnreadCount(): UseQueryResult<number>   // polling 30s
export function useMarkAsRead(): UseMutationResult<void, Error, string>
export function useMarkAsDone(): UseMutationResult<void, Error, string>
export function useIgnoreNotification(): UseMutationResult<void, Error, string>
export function useBulkNotificationAction(): UseMutationResult<void, Error, BulkAction>

// lib/hooks/veille/useBiensSuivis.ts
export function useBiensSuivis(filters: BienSuiviFilters): UseQueryResult<BienSuivi[]>
export function useBienSuivi(id: string): UseQueryResult<BienSuivi>
export function useToggleFollow(): UseMutationResult<void, Error, ToggleFollowInput>

// lib/hooks/veille/useAgences.ts
export function useAgences(filters: AgenceFilters): UseQueryResult<AgenceConcurrente[]>
export function useAgence(id: string): UseQueryResult<AgenceConcurrente>
export function useSirene(query: string): UseQueryResult<SireneResult[]>
export function useFollowAgence(): UseMutationResult<AgenceConcurrente, Error, FollowAgenceInput>
export function useDiscoverAgences(): UseQueryResult<AgenceConcurrente[]>
```

## 13.4 State global (Zustand)

```ts
// lib/stores/veille.ts
interface VeilleStore {
  // Filters (non URL car trop complexes)
  alertesFilters: AlerteFilters;
  notificationsFilters: NotifFilters;
  biensSuivisFilters: BienSuiviFilters;
  agencesFilters: AgenceFilters;

  // UI state
  selectedNotifications: string[];
  selectedBiensSuivis: string[];
  selectedAgences: string[];

  // Presets sauvegardés (notifications)
  savedPresets: NotifPreset[];

  // View toggles
  biensSuivisView: 'table' | 'cards' | 'map';
  agencesView: 'table' | 'cards' | 'map';

  // Actions
  setAlertesFilters: (filters: AlerteFilters) => void;
  // ...
}
```

## 13.5 Design tokens spécifiques Veille

Ajouts au design system global :

```css
/* Dans /src/app/globals.css */
:root {
  /* AI suggestion bloc */
  --ai-bg-subtle: hsl(262 80% 97%);
  --ai-border: hsl(262 60% 90%);
  --ai-text: hsl(262 45% 30%);

  /* Priorités notifications */
  --prio-haute-bg: hsl(0 80% 95%);
  --prio-haute-fg: hsl(0 70% 45%);
  --prio-moyenne-bg: hsl(28 90% 94%);
  --prio-moyenne-fg: hsl(28 80% 45%);
  --prio-info-bg: hsl(215 20% 95%);
  --prio-info-fg: hsl(215 15% 45%);

  /* Statuts notifications */
  --status-unread: hsl(262 80% 55%);  /* violet */
  --status-read: hsl(215 15% 65%);
  --status-todo: hsl(28 80% 55%);
  --status-done: hsl(142 70% 45%);
  --status-ignored: hsl(215 10% 75%);

  /* Score intérêt */
  --score-fort: hsl(142 70% 45%);
  --score-surveil: hsl(215 70% 55%);
  --score-faible: hsl(215 15% 65%);

  /* Mandat simple sous pression */
  --pression-bg: hsl(0 80% 97%);
  --pression-border: hsl(0 75% 60%);
  --pression-fg: hsl(0 70% 45%);
}
```

---

# 14. États : loading, empty, error, skeleton

## 14.1 Loading

### Loading initial (skeleton)

Tableau : 8 rows skeleton avec pulse animation.
Feed notifications : 6 group skeleton.
Cards biens : 6 cards skeleton 16:9 + 3 lignes text.
Carte : placeholder gris avec spinner centré.

### Loading intermédiaire (overlay)

Après changement de filtre, overlay transparent 30% sur la table + spinner centré. La table reste lisible derrière.

### Loading drawer

Drawer skeleton : header + 3 sections vides avec pulse.

## 14.2 Empty states

### Mes alertes — aucune alerte

```text
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│                  🔔                                                  │
│                                                                      │
│            Aucune alerte configurée                                  │
│                                                                      │
│  Créez votre première alerte pour surveiller des biens, des zones,   │
│  des recherches ou des agences concurrentes.                         │
│                                                                      │
│               [+ Créer ma première alerte]                           │
│                                                                      │
│  💡 Idées rapides :                                                  │
│   • Nouvelle annonce dans ma zone de prospection                     │
│   • Baisse de prix sur mes biens suivis                              │
│   • Concurrent détecté sur mon portefeuille                          │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Mes alertes — filtre sans résultat

```text
Aucune alerte ne correspond à vos filtres.
[Réinitialiser les filtres]
```

### Notifications — aucune notif

```text
🎉 Rien de neuf

Vous avez tout traité. Propsight vous préviendra dès qu'un événement
sera détecté sur vos objets suivis.

[Voir mes alertes actives] [Configurer une nouvelle alerte]
```

### Notifications — tab "Non lues" vide

```text
✓ Tout est à jour

Aucune notification non lue.
[Afficher toutes les notifications]
```

### Biens suivis — aucun bien

```text
♡ Aucun bien suivi

Cliquez sur ♡ depuis une annonce, un signal ou une analyse
pour commencer à suivre des biens.

[Parcourir les annonces] [Explorer les signaux de prospection]
```

### Agences concurrentes — aucune agence suivie

```text
🏢 Aucune agence suivie

Suivez les agences actives sur vos zones pour surveiller
leurs annonces, baisses de prix et parts de marché.

[+ Suivre une agence] [Découvrir les agences actives sur mes zones]
```

## 14.3 Error states

### Erreur réseau (global)

Toast top-right :
```text
⚠ Erreur de connexion
Les données n'ont pas pu être mises à jour.
[Réessayer]
```

### Erreur drawer (objet introuvable)

```text
⚠ Cet objet n'existe plus

Il a peut-être été supprimé ou archivé.
[Fermer]
```

### Erreur pipeline alerte (status=error)

Badge visible dans la table : `⚠ Pipeline en erreur`
Clic → tooltip : "Le pipeline de détection a rencontré une erreur sur cette alerte. L'équipe Propsight a été notifiée."

## 14.4 Viewport < 1280px

Message plein-page (aligné Observatoire) :

```text
🖥 Propsight Pro est optimisé pour les écrans ≥ 1280px

Pour une expérience optimale, veuillez utiliser un écran plus large
ou agrandir votre fenêtre.

[Actualiser]
```

---

# 15. Mocks MSW & données test

## 15.1 Endpoints à mocker

```text
GET    /api/veille/alertes?filters...            → Alerte[]
GET    /api/veille/alertes/:id                   → Alerte
POST   /api/veille/alertes                       → Alerte
PATCH  /api/veille/alertes/:id                   → Alerte
DELETE /api/veille/alertes/:id                   → 204
GET    /api/veille/alertes/health                → AlerteHealth[]

GET    /api/veille/notifications?filters...      → paginated { items, next_cursor }
GET    /api/veille/notifications/unread-count    → { count: number }
GET    /api/veille/notifications/:id             → NotificationVeille
PATCH  /api/veille/notifications/:id             → { status, updated_at }
POST   /api/veille/notifications/bulk            → { updated: number }
GET    /api/veille/notifications/preferences     → NotificationPreferences
PATCH  /api/veille/notifications/preferences     → NotificationPreferences

GET    /api/veille/biens-suivis?filters...       → BienSuivi[]
GET    /api/veille/biens-suivis/:id              → BienSuivi
POST   /api/veille/biens-suivis                  → BienSuivi (♡ add)
DELETE /api/veille/biens-suivis/:bien_id         → 204 (♡ remove)

GET    /api/veille/agences?filters...            → AgenceConcurrente[]
GET    /api/veille/agences/:id                   → AgenceConcurrente
POST   /api/veille/agences                       → AgenceConcurrente
DELETE /api/veille/agences/:id                   → 204
GET    /api/veille/agences/discover              → AgenceConcurrente[]

GET    /api/sirene?query=...                     → SireneResult[] (proxy INSEE V1.5, mock V1)
```

## 15.2 Fichiers fixtures

```text
/src/mocks/veille
  alertes.fixtures.ts           // 25 alertes exemples
  notifications.fixtures.ts     // 200 notifs exemples
  biens-suivis.fixtures.ts      // 90 biens suivis exemples
  agences.fixtures.ts           // 20 agences exemples
  watch-events.fixtures.ts      // 500 events bruts (optionnel dev)
  sirene.fixtures.ts            // 50 agences SIRENE mockées
```

## 15.3 Fixture exemple Alerte

```ts
export const alertesMock: Alerte[] = [
  {
    id: 'al_k3m9x2',
    organization_id: 'org_001',
    created_by: 'user_001',
    assigned_to: 'user_002',
    name: 'T2 Paris 15e sous 550k',
    description: 'Opportunités pour profil acheteur Dupont',
    domain: 'prix',
    target_type: 'zone',
    target_id: 'zone_paris_15',
    target_label: 'Paris 15e · Appartement T2',
    target_secondary_label: '35–60 m² · 2 pièces',
    conditions: [
      { field: 'prix', operator: 'less_than', value: 550000, label: 'prix < 550 000 €' },
      { field: 'surface', operator: 'between', value: [35, 60], label: '35–60 m²' }
    ],
    frequency: 'immediate',
    channels: ['in_app', 'email'],
    priority: 'moyenne',
    status: 'active',
    last_triggered_at: '2026-04-24T10:12:00Z',
    last_trigger_label: 'il y a 2h',
    triggers_count_7d: 12,
    triggers_count_30d: 48,
    treated_rate_30d: 0.83,
    avg_treatment_time_hours: 18,
    source_module: 'veille',
    health_status: 'healthy',
    created_at: '2026-03-12T09:00:00Z',
    updated_at: '2026-04-24T10:12:00Z'
  },
  // ... 24 autres variés (baisses biens, mandats simples, DPE G, PC 15e, etc.)
];
```

## 15.4 Fixture exemple Notification

```ts
export const notificationsMock: NotificationVeille[] = [
  {
    id: 'nt_a1b2c3',
    organization_id: 'org_001',
    user_id: 'user_001',
    source_type: 'alerte',
    source_id: 'al_k3m9x2',
    object_type: 'bien',
    object_id: 'bien_xyz',
    title: 'Baisse de prix détectée',
    message: 'Le prix de vente a baissé de 530 000 € à 510 000 € soit -20 000 € (-3,8 %).',
    explanation: 'Passe 2 % sous la médiane DVF du quartier et sous votre fourchette haute d\'estimation.',
    business_impact: 'Bonne opportunité d\'achat. Probabilité de vente +18 % et compétitivité améliorée.',
    priority: 'haute',
    status: 'unread',
    recommended_action: 'ouvrir_bien',
    secondary_actions: ['creer_action', 'mettre_a_jour_suivi'],
    freshness_label: 'il y a 25 min',
    event_at: '2026-04-24T13:35:00Z',
    created_at: '2026-04-24T13:35:00Z',
    is_aggregated: false,
    triggering_alertes: ['al_k3m9x2'],
    metadata: {
      prix_avant: 530000,
      prix_apres: 510000,
      variation_pct: -3.8,
      prix_m2: 9273,
      surface: 55,
      dpe: 'D',
      adresse: '45 rue Lecourbe · 75015 Paris',
      portail: 'SeLoger',
      annonce_id: 'annonce_1234567',
      bien_label: 'Appartement T2 · Paris 15e · Seloger'
    },
    links: [
      { label: 'Ouvrir le bien', route: '/app/biens/bien_xyz', module: 'biens' },
      { label: 'Voir l\'alerte liée', route: '/app/veille/alertes?alerte=al_k3m9x2', module: 'veille' },
      { label: 'Comparer sur observatoire', route: '/app/observatoire/marche?zone=paris-15', module: 'observatoire' }
    ]
  },
  {
    id: 'nt_agg_001',
    organization_id: 'org_001',
    user_id: 'user_001',
    source_type: 'alerte',
    source_id: 'al_k3m9x2',
    object_type: 'zone',
    object_id: 'zone_paris_15',
    title: '3 baisses de prix sur Paris 15e',
    message: '3 événements agrégés ce matin. Baisse moyenne : -3,2 %.',
    explanation: 'Le volume de baisses sur la zone suggère une tension acheteur en évolution.',
    business_impact: 'Potentiel de négociation à observer sur votre portefeuille Paris 15e.',
    priority: 'moyenne',
    status: 'unread',
    recommended_action: 'ouvrir_observatoire',
    secondary_actions: ['creer_action'],
    freshness_label: 'ce matin',
    event_at: '2026-04-24T09:00:00Z',
    created_at: '2026-04-24T10:00:00Z',
    is_aggregated: true,
    aggregate_count: 3,
    triggering_alertes: ['al_k3m9x2'],
    metadata: {
      bien_ids: ['bien_aaa', 'bien_bbb', 'bien_ccc'],
      variation_moyenne_pct: -3.2
    },
    links: [
      { label: 'Voir les 3 biens', route: '/app/veille/biens-suivis?bien_ids=bien_aaa,bien_bbb,bien_ccc', module: 'veille', count: 3 },
      { label: 'Observatoire Paris 15e', route: '/app/observatoire/marche?zone=paris-15', module: 'observatoire' }
    ]
  }
  // + 198 autres notifs avec variations (sources, types, statuts, priorités)
];
```

## 15.5 Fixture Bien suivi

```ts
export const biensSuivisMock: BienSuivi[] = [
  {
    id: 'bs_p1q2r3',
    bien_id: 'bien_xyz',
    organization_id: 'org_001',
    followed_by: 'user_001',
    assigned_to: 'user_001',
    source: 'annonces',
    source_id: 'annonce_1234567',
    source_label: 'Annonce SeLoger',
    reason: 'Profil acheteur Dupont',
    status: 'active',
    alertes_actives: ['al_k3m9x2'],
    notifications_unread_count: 2,
    last_event_at: '2026-04-24T13:35:00Z',
    last_event_type: 'baisse_prix',
    last_event_label: 'Baisse de prix -3,8%',
    score_interet: 82,
    score_label: 'forte_opportunite',
    score_breakdown: [
      { key: 'variation_prix', label: 'Variation de prix', contribution: 30, detail: 'Baisse -3,8% en 6j' },
      { key: 'tension_zone', label: 'Tension de zone', contribution: 20, detail: 'Paris 15e · tension 80' },
      { key: 'anciennete_annonce', label: 'Ancienneté annonce', contribution: 0, detail: 'Annonce récente (12j)' },
      { key: 'pression_concurrent', label: 'Pression concurrent', contribution: 25, detail: 'Concurrent Agence X' }
    ],
    created_at: '2026-04-12T11:30:00Z',
    updated_at: '2026-04-24T13:35:00Z'
  }
  // + 89 autres
];
```

## 15.6 Fixture Agence concurrente

```ts
export const agencesMock: AgenceConcurrente[] = [
  {
    id: 'ag_m1n2o3',
    organization_id: 'org_001',
    name: 'Agence Métropole',
    siren: '523489612',
    carte_t: 'CPI 7501 2018 000 034 567',
    adresse: '36 rue de Vaugirard',
    ville: 'Paris 15e',
    code_postal: '75015',
    latitude: 48.8466,
    longitude: 2.3125,
    logo_url: undefined,
    zones: [
      { zone_id: 'zone_paris_15', label: 'Paris 15e', strength: 'forte', stock_actif: 86, part_de_marche: 0.12, evolution_part_30d: 1.2 },
      { zone_id: 'zone_paris_16', label: 'Paris 16e', strength: 'moyenne', stock_actif: 42, part_de_marche: 0.08, evolution_part_30d: 0 },
      { zone_id: 'zone_paris_7', label: 'Paris 7e', strength: 'faible', stock_actif: 14, part_de_marche: 0.04, evolution_part_30d: -0.3 }
    ],
    stock_actif: 126,
    nouvelles_annonces_7d: 8,
    nouvelles_annonces_30d: 31,
    baisses_prix_30d: 4,
    annonces_anciennes_count: 12,
    delai_moyen_jours: 34,
    prix_moyen_m2: 8420,
    types_biens_dominants: ['T2', 'T3', 'studios'],
    biens_similaires_count: 18,
    mandats_simples_concurrents_count: 3,
    has_mandat_simple_sous_pression: true,
    followed: true,
    alertes_actives: ['al_concurrent_15'],
    last_event_at: '2026-04-24T10:32:00Z',
    last_event_type: 'price_drop',
    last_event_label: 'Baisse de prix',
    created_at: '2026-03-01T10:00:00Z',
    updated_at: '2026-04-24T10:32:00Z'
  }
  // + 17 autres
];
```

## 15.7 Scénarios de seed

```text
- Utilisateur normal : 24 alertes, 38 non lues, 86 biens, 18 agences
- Utilisateur débutant : 0 alertes, 0 notifs, 0 biens, 0 agences (empty states)
- Utilisateur saturé : 150 alertes, 2400 notifs, 500 biens, 80 agences (test perf)
```

Toggle accessible via query param dev `?seed=normal|empty|heavy`.

---

# 16. Non-scope V1 (reporté V1.5 ou plus tard)

Tout ce qui **n'est pas** dans V1 et qui a été explicitement évoqué pendant la conception :

## 16.1 Alertes

- Types de cible additionnels : `segment`, `lead`, `dossier`, `rapport`
- Opérateur OR dans combinaison de conditions
- Partage d'alerte entre collaborateurs (alerte d'organisation)
- Template d'alertes prédéfinis ("Détecter les biens sous-évalués")
- Suggestion IA pour créer des alertes depuis comportement utilisateur
- Alertes conditionnelles multi-niveaux (si A alors surveiller B)

## 16.2 Notifications

- Tabs multiples (> 3) — décision figée
- Canaux additionnels : WhatsApp Business API, Slack, SMS
- Digest email riche (HTML avec preview)
- Bulk "Créer actions groupées"
- Notifications push mobile natives
- Son de notification personnalisable
- Notifications par collaborateur (équipe voit tout / propriétaire voit ses notifs)

## 16.3 Biens suivis

- Listes/dossiers de biens suivis (grouper en collection)
- Tags libres sur un bien suivi
- Note vocale sur un bien
- Comparaison > 4 biens
- Export PDF d'une sélection pour client
- Partage public d'une sélection (lien read-only)
- Collaboration en temps réel sur une sélection

## 16.4 Agences concurrentes

- Matching automatique des biens similaires avec portefeuille (derrière flag V1.5 `AGENCE_MATCHING_ENABLED`)
- Détection automatique "Mandat simple sous pression" (même flag)
- Tracking recrutement / fermeture (sources : data entreprises, LinkedIn…)
- Alertes sur évolution effectif agence
- Analyse sentiment avis clients
- Comparatif performance agence (Top 10 zone)

## 16.5 Score intérêt

- 5e contributeur `coherence_projet_score` pour persona investisseur
- Pondération configurable par utilisateur
- Machine learning sur historique d'actions pour calibrer
- Score par collaborateur (différents profils ont des priorités différentes)

## 16.6 Consentement RGPD

- Collecte consentement via formulaires / widgets
- Import Bloctel automatique
- Sync CRM (Apimo, Hektor) pour récupérer les statuts
- Logs d'audit des actions de contact
- Règle globale d'organisation (blocage fort si unknown)

## 16.7 Divers

- Dashboard Veille (hub récap) — redirection directe vers Notifications V1
- Export programmé (daily/weekly email avec CSV)
- Webhooks sortants (Zapier, Make)
- API publique Propsight pour intégrateurs
- Reorder drag&drop sur alertes et agences
- Dark mode complet Veille (hors scope design global V1)

## 16.8 Fonctionnalités rejetées (hors V1.5 également)

- Chat/commentaires par objet (trop lourd, risque de silo vs Pilotage commercial)
- Gamification (leaderboard, badges)
- Intégration email marketing (Mailchimp et cie)

---

# 17. Dépendances externes & data

## 17.1 Dépendances data

| # | Dépendance | Statut V1 | Impact si indisponible |
|---|---|---|---|
| 1 | Pipeline détection événements | **Requis V1** | Aucune alerte déclenchée, pas de notif |
| 2 | Source annonces multi-portails | **Requis V1** | Pas de baisse de prix, nouvelle annonce |
| 3 | DVF (Données de Valeurs Foncières) | **Requis V1** | Contexte marché dans notifications |
| 4 | DPE | Requis V1 | Alertes domain=dpe inopérantes |
| 5 | Urbanisme (sitadel, PLU) | Requis V1 | Alertes domain=urbanisme inopérantes |
| 6 | SIRENE (INSEE) | **Requis V1** | AddAgenceModal désactivé, saisie libre fallback |
| 7 | Scoring tension zone (Observatoire) | **Requis V1** | score_interet.tension_zone_score=0 |
| 8 | SMTP transactionnel (email notif) | **Requis V1** | Canal email désactivé |
| 9 | Template email (domaine expéditeur) | **Requis V1** | idem |
| 10 | Tracking pixel rapports (Estimation) | V1.5 si pas prêt | Notifications "rapport ouvert" masquées |
| 11 | Matching fingerprint annonces (portefeuille vs concurrent) | V1.5 feature flag | Matching manuel par l'user |
| 12 | Intégration WhatsApp Business API | V1.5 | N/A V1 |
| 13 | Intégration Slack | V1.5 | N/A V1 |
| 14 | CRM sync consentement (Apimo/Hektor) | V1.5 | consent_status reste unknown par défaut |

## 17.2 Pipeline data attendu (côté backend)

Le pipeline détection `WatchEvent` n'est pas développé dans Veille mais doit être cadré. Lecture minimale attendue :

```text
1. Ingestion annonces portails (SeLoger, Leboncoin, Bien'ici, PAP, Logic Immo)
   → Déduplication, fingerprint
   → Délai : < 1h après publication

2. Détection baisse/hausse prix
   → Comparaison J-1 vs J
   → Génération WatchEvent type=price_drop/price_increase

3. Détection nouvelle annonce, sortie, remise en ligne
   → Diff du jour
   → Génération WatchEvent type=new_listing/listing_removed/listing_republished

4. Détection DVF nouvelle vente dans zone
   → Scan quotidien DVF
   → Génération WatchEvent type=investment_threshold_reached (si match critère invest)

5. Détection PC/DP/PA urbanisme
   → Scan sitadel
   → Génération WatchEvent type=urbanisme_signal

6. Matching WatchEvent ↔ Alerte
   → Règles : target_type + target_id + conditions
   → Si match → créer NotificationVeille
   → Appliquer règles agrégation/throttling/dédoublonnage (cf §2.5)

7. Envoi notifications
   → in_app : insert en DB, visible au refresh/poll
   → email : queue SMTP avec respect heures de silence et digest
```

## 17.3 Contrats endpoints backend attendus

Les endpoints listés en §15.1 doivent être implémentés côté backend. Format JSON. Authentification via session. CORS restreint à `*.propsight.com`.

Tolérance latence :
- Liste : < 500ms p95
- Détail : < 300ms p95
- Mutation : < 800ms p95
- Unread count (polling) : < 100ms p95

## 17.4 Volumétrie cible V1

| Métrique | V1 cible |
|---|---|
| Organisations | 100 |
| Users actifs / org | 5 (moy) |
| Alertes / user | 10 (moy), 50 (max) |
| Biens suivis / user | 30 (moy), 500 (max) |
| Agences suivies / user | 15 (moy) |
| Notifications / user / jour | 20 (moy) |
| Notifications total en DB / org | 50 000 (rolling 90j) |
| Pipeline events / jour | 100 000 (toutes orgs) |

## 17.5 Purge et rétention

- Notifications > 90j : archivées (soft delete, queryable via export API)
- WatchEvents > 180j : purgés
- Alertes archivées > 365j : purgées
- Biens suivis archivés > 365j : purgés

---

# 18. Ordre de livraison / plan de sprints

Ordre technique correct (pas dans l'ordre de visibilité). Notifications nécessite Alertes et Biens suivis comme sources, donc vient après.

## Sprint 1 — Socle & Mes alertes (S1 = 1 semaine de dev)

- [ ] Types TypeScript complets (`/src/types/veille.ts`)
- [ ] Routes App Router + redirection `/app/veille`
- [ ] Layout VeillePageLayout + sous-composants (header, KPI, tabs, filtres)
- [ ] DrawerVeille shell + variant Alerte
- [ ] Table Alertes + row + filtres + tabs
- [ ] Wizard création alerte (5 étapes)
- [ ] MSW handlers alertes + fixtures
- [ ] Hooks `useAlertes`, `useAlerte`, CRUD mutations
- [ ] Santé alertes drawer séparé
- [ ] Tests empty / loading / error

**Livrable** : `/app/veille/alertes` fonctionnel, wizard marche, drawer marche.

## Sprint 2 — Biens suivis + FollowToggle broadcast

- [ ] Table + Cards + Carte (Mapbox) Biens suivis
- [ ] Drawer variant BienSuivi avec photo, chart prix, KPIs
- [ ] ScoreInteretBadge + Breakdown
- [ ] FollowToggle global broadcast (à dispatcher dans les autres modules existants)
- [ ] MSW handlers biens-suivis + fixtures (90 biens)
- [ ] Hooks `useBiensSuivis`, `useToggleFollow` avec broadcast
- [ ] Bulk actions (comparer, alerte groupée, retirer)
- [ ] CTA conversion (Analyse invest, Estimation, Action, Lead, Opportunité)

**Livrable** : `/app/veille/biens-suivis` fonctionnel, ♡ broadcast opérationnel.

## Sprint 3 — Notifications feed + anti-bruit

- [ ] Feed groupé par date (Toutes / Non lues / À traiter)
- [ ] NotificationRow + états (unread/read/todo/done/ignored)
- [ ] Règles anti-bruit côté affichage (rows agrégées)
- [ ] Drawer variant Notification
- [ ] Bouton "Filtres avancés" (popover avec presets)
- [ ] Bulk actions
- [ ] Préférences notifications (modal)
- [ ] Bell icon header Pro + popover
- [ ] Polling unread count (30s)
- [ ] MSW handlers notifications + fixtures (200 notifs variées)

**Livrable** : `/app/veille/notifications` fonctionnel, bell icon live.

## Sprint 4 — Agences concurrentes

- [ ] Table + Cards + Carte agences
- [ ] Drawer variant Agence avec mini-carte zones
- [ ] Cas "Mandat simple sous pression" (bloc dédié)
- [ ] Modal SIRENE search (mock V1)
- [ ] Drawer découverte agences actives
- [ ] Parts de marché par zone (bloc drawer)
- [ ] Feature flag `AGENCE_MATCHING_ENABLED` pour biens_similaires_count / mandats_simples
- [ ] MSW handlers agences + fixtures

**Livrable** : `/app/veille/agences-concurrentes` fonctionnel.

## Sprint 5 — Polissage, intégrations, IA drawer

- [ ] Bloc Suggestion Propsight IA dans chaque drawer (DrawerAiSuggestion)
- [ ] Chips inter-modules avec compteurs (InterModuleChip)
- [ ] Freshness labels uniformisés (FreshnessLabel utilisé partout)
- [ ] Consentement RGPD : affichage et règles CTA
- [ ] Preferences notifications — heures de silence, seuil priorité
- [ ] Export CSV (alertes, notifications, biens suivis, agences)
- [ ] Empty states finaux + illustrations
- [ ] Tests E2E (Playwright) sur flows critiques
- [ ] Review perf (virtualization si table > 500 rows)
- [ ] Review a11y (navigation clavier, aria-labels)

**Livrable V1** : module Veille complet, prêt pour intégration backend.

## Sprint 6 — Intégration backend + QA

- [ ] Remplacer handlers MSW par vrais endpoints
- [ ] Tests bout-en-bout avec données réelles
- [ ] QA cross-persona (agent / investisseur)
- [ ] Ajustements UX après retours QA
- [ ] Documentation interne

---

# 19. Prompt Claude Code

À copier-coller dans Claude Code pour implémentation. Ce prompt suppose la base Propsight déjà initialisée.

```text
Contexte projet Propsight :
- Next.js 15 App Router, TypeScript strict, Tailwind v4
- shadcn/ui avec accent violet (--accent: hsl(262 80% 55%))
- TanStack Query v5, MSW v2, Mapbox GL v3
- react-hook-form + Zod, nuqs pour URL state, Zustand pour UI state
- Design desktop-first 1280-1600px, dense, premium, inspiration Linear/Attio

Tu vas implémenter le module Veille (4 sous-sections) selon la spec 22_VEILLE.md.

Règles strictes :
1. Respecter la spec à la lettre, notamment les décisions V1 figées §0
2. Types TS depuis §4, ne pas improviser de nouvelles shapes
3. Drawer partagé avec 4 variants, structure identique 7 zones (§6)
4. Toutes les mutations optimistic via TanStack Query
5. URL state via nuqs (drawer ouvert, tab, filtres basiques)
6. Local state via Zustand pour filtres complexes
7. MSW obligatoire pour tous les endpoints
8. Aucun chemin relatif ../../ — utiliser les alias @/
9. Pas de any sauf metadata: Record<string, unknown>
10. Les composants > 200 lignes doivent être splittés

Ordre de livraison (cf §18) :
Sprint 1 : Mes alertes (layout + wizard + drawer + MSW)
Sprint 2 : Biens suivis (table + cards + carte + ♡ broadcast)
Sprint 3 : Notifications (feed + anti-bruit + préférences)
Sprint 4 : Agences concurrentes (+ cas mandat simple)
Sprint 5 : Polissage, IA drawer, inter-modules, RGPD

Démarre par Sprint 1. Ne génère pas tout en un seul prompt, découpe :
  1.1 Créer la structure de dossiers /src/components/veille + /src/types/veille.ts + routes
  1.2 Implémenter VeillePageLayout et composants header/KPI/tabs/filters
  1.3 Implémenter DrawerVeille shell + DrawerAlerte
  1.4 Implémenter AlertesTable + rows + filtres
  1.5 Implémenter AlerteCreationWizard (5 étapes)
  1.6 MSW handlers + fixtures alertes
  1.7 Hooks useAlertes + mutations CRUD
  1.8 Santé alertes drawer
  1.9 Empty/loading/error states

À chaque étape, génère les fichiers demandés, respecte les imports shadcn, et laisse des // TODO commentés quand une décision mineure (ex: couleur badge) n'est pas 100% explicite dans la spec. Je reviendrai dessus.

Commence par 1.1.
```

---

# 20. Checklist finale (go/no-go V1)

## 20.1 Produit

- [ ] 4 sous-sections livrées et accessibles depuis sidebar
- [ ] Décisions §0 respectées (4 target types, 3 tabs notifs, in-app+email, etc.)
- [ ] ♡ broadcast fonctionne depuis Biens, Annonces, DVF, Prospection, Investissement, Observatoire, Estimation, fiche bien
- [ ] Toute notification V1 a les 4 champs obligatoires (title, message, explanation, business_impact) + recommended_action
- [ ] Agrégation / throttling / dédoublonnage fonctionnent (§2.5)
- [ ] Cas "Mandat simple sous pression" visuellement first-class
- [ ] Score intérêt avec 4 contributeurs + breakdown visible
- [ ] Consentement RGPD affiché + CTA adaptatifs

## 20.2 Technique

- [ ] TypeScript strict sans errors
- [ ] 0 warnings ESLint
- [ ] Bundle size Veille < 200KB gzipped
- [ ] Lighthouse Perf > 85 sur /app/veille/notifications avec 200 rows
- [ ] Table virtualisée au-delà de 500 rows (biens suivis)
- [ ] Tests unitaires hooks critiques (useToggleFollow, agrégation, freshness)
- [ ] Tests E2E Playwright : flow création alerte, flow ♡→retirer, flow notif→action
- [ ] a11y : navigation clavier complète, aria-labels sur toutes les actions

## 20.3 UX

- [ ] Viewport < 1280 : message plein-page
- [ ] Toasts cohérents avec le reste de Propsight
- [ ] Freshness labels uniformes partout (§2.7)
- [ ] Drawer toujours fermable par Esc + X + overlay
- [ ] URL partageable reflète l'état visible (tab + drawer ouvert)
- [ ] Empty states avec illustration et CTA constructif
- [ ] Loading skeletons spécifiques par vue (pas de spinner générique)

## 20.4 Backend (pré-requis intégration)

- [ ] Endpoints §15.1 implémentés avec contrats respectés
- [ ] Pipeline WatchEvent en place, délai < 1h
- [ ] SMTP transactionnel opérationnel + template validé
- [ ] SIRENE proxy opérationnel
- [ ] Rétention 90j appliquée

## 20.5 Documentation

- [ ] README module Veille
- [ ] Guide utilisateur dans centre d'aide (comment créer une alerte, lire une notif, etc.)
- [ ] Schéma ERD à jour avec nouvelles tables (alertes, notifications, biens_suivis, agences, watch_events)
- [ ] Changelog V1 publié

---

**Fin de la spec 22_VEILLE.md V1 consolidée.**

Prochain module : `23_EQUIPE.md` (gestion collaborateurs, rôles, permissions).

