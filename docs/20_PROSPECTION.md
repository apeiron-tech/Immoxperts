# Propsight — Module Prospection — Spec détaillée

**Version** : V1 consolidée
**Format** : source de vérité produit / design / dev
**Langue produit** : français
**Périmètre** : `/app/prospection/radar`, `/app/prospection/signaux-dvf`, `/app/prospection/signaux-dpe`
**Persona V1 principal** : agent immobilier
**Complémentaire de** : `02_LAYOUT_PRO.md`, `12_OPPORTUNITES_INVESTISSEMENT.md`, `13_DOSSIER_INVESTISSEMENT.md`, `32_PERFORMANCE.md`, `40_WIDGETS_PUBLICS.md`

---

# 0. Décisions V1 (figées, ne pas rediscuter)

| # | Sujet | Décision |
|---|---|---|
| 1 | Sous-sections | 3 : Radar · Signaux DVF · Signaux DPE (ordre figé) |
| 2 | Routes | `/app/prospection/radar` · `/app/prospection/signaux-dvf` · `/app/prospection/signaux-dpe` |
| 3 | Nombre de KPIs | 3 (Radar) · 3 (DVF) · 4 (DPE) — pas de "Convertis" en header |
| 4 | Période comparative KPIs | 30 derniers jours, homogène sur toutes les sous-sections |
| 5 | Vue par défaut | Radar = split map/list · DVF = table · DPE = table |
| 6 | Dédoublonnage Radar | Oui, méta-signal par `bien_id` quand connu (fusion annonce + DVF + DPE) |
| 7 | Types DVF | 9 dans le typing TS, 7 actifs V1, 2 en V2 (`poche_mutations`, `faible_activite_zone`) |
| 8 | Types DPE | 8 dans le typing TS, flag `kind: 'business' \| 'support'` pour distinguer les 4 scénarios commerciaux des 4 types support |
| 9 | Drawer signal | 1 seul composant `<DrawerSignal />` partagé entre les 3 sous-sections, avec variants selon source |
| 10 | Conversion Signal → Lead / Action / Alerte | Modal compact pré-rempli, pas de redirection |
| 11 | Conversion Signal → Estimation | Redirection vers `/app/estimation/*` avec préremplissage via query params. Type d'estimation déterminé par le type de signal |
| 12 | Conversion Signal → Analyse invest | Ouverture du modal global `?analyse=[bien_id]` déjà acté côté Investissement |
| 13 | Suivre un signal | Toggle immédiat (pas de modal), alimente `Veille > Biens suivis` ou `Veille > Alertes` |
| 14 | Assignation V1 | Oui, simple — dropdown 1-clic dans la colonne `Assigné` des tables DVF/DPE et dans le drawer Radar. Un signal = un seul assigné. Pas d'auto-assignation. |
| 15 | Territoires / "mes zones" | Pas de nouvelle route — géré dans `/app/veille/alertes` (anti-silos). Lien `Gérer mes zones` visible dans les empty states et la barre sticky. |
| 16 | Scoring | Score 0-100 visible partout. Breakdown des 3 principaux contributeurs affiché dans le drawer. Seuils : ≥80 haute · 60-79 moyenne · <60 basse. |
| 17 | Signaux ignorés | Filtrés par défaut. Toggle "Afficher les ignorés" dans la barre sticky. Un signal ignoré peut réapparaître si nouvel événement métier advient (ex : nouvelle baisse de prix). |
| 18 | Empty states | 4 cas distincts (aucun territoire · filtres trop stricts · secteur peu actif · erreur) |
| 19 | Géographie | Honnête : point exact si précision ≥ adresse, cluster/centroïde si partielle, zone colorée/heatmap si territoriale. Jamais de pin simulé. |
| 20 | Pipeline commercial | Vit dans `Mon activité > Leads` uniquement. Prospection ne contient aucun mini-CRM. |

---

# 1. Contexte produit & positionnement

## 1.1 Vision produit Propsight

Propsight est un SaaS immobilier data-driven à double couche : public freemium + espace Pro payant. Le produit est pensé autour d'un backbone objet transverse. Les modules ne sont pas des silos mais des lectures différentes des mêmes objets : Bien, Annonce, Lead, Action, Estimation, Opportunité, Dossier, Alerte, Bien suivi, Zone, Collaborateur.

Le module **Prospection** est la **couche amont** du produit. Il précède tout le reste : sans signal détecté, pas de lead, pas d'estimation, pas de dossier.

## 1.2 Rôle global de Prospection

La section Prospection est la couche de **détection, priorisation et transformation** des opportunités amont du produit.

Elle répond à une seule question :

> **Qu'est-ce qui mérite mon attention maintenant, et que dois-je en faire ?**

Ce n'est ni :
- une base brute de biens,
- un simple moteur de pige,
- un mini-CRM,
- un observatoire de marché,
- ni un module d'analyse invest autonome.

## 1.3 Principe produit clé

La Prospection ne possède pas le pipeline commercial.

Le pipeline commercial unique vit dans :

`Mon activité > Leads`

Conséquences :
- Prospection **détecte**
- Prospection **qualifie**
- Prospection **priorise**
- Prospection **convertit** (en lead, action, estimation, suivi)
- mais le suivi commercial détaillé vit ailleurs

## 1.4 Les 3 sous-sections

### Radar — "Où dois-je prospecter maintenant ?"

Vue de synthèse **map-first**, hybride, priorisée, mixant plusieurs familles de signaux.

### Signaux DVF — "Quels patterns de mutation sont commercialement exploitables ?"

Vue détaillée **transactionnelle** de prospection. Table dense pour analyse et qualification.

### Signaux DPE — "Quels signaux liés à la performance énergétique créent une opportunité commerciale ?"

Vue détaillée **énergétique / rénovation / arbitrage**. Transforme les DPE bruts en 4 scénarios commerciaux actionnables.

## 1.5 Positionnement vs autres modules

| Module | Relation avec Prospection |
|---|---|
| `Mon activité > Leads` | Cible de la conversion Signal → Lead. Pipeline commercial unique. |
| `Mon activité > Pilotage commercial` | Remontée des signaux à traiter dans le dashboard agent. |
| `Biens immobiliers > Portefeuille` | Un signal peut déjà concerner un bien du portefeuille. Lien bidirectionnel. |
| `Biens immobiliers > Annonces` | Source de signaux (baisse de prix, ancienneté, remise en ligne). |
| `Biens immobiliers > Biens vendus (DVF)` | Source de signaux DVF. Un clic "Ouvrir la vente" depuis le drawer renvoie ici. |
| `Estimation` | Cible de la conversion Signal → Estimation. Règles de défaut par type de signal. |
| `Investissement` | Cible de la conversion Signal → Analyse invest (modal `?analyse=[bien_id]`). |
| `Observatoire` | Source du contexte local (tension, prix, profondeur de demande) dans le drawer. |
| `Veille > Alertes` | Gère les territoires et zones suivies. Source des presets "Mes zones". |
| `Veille > Biens suivis` | Cible de la conversion Signal → Suivi. |
| `Équipe` | Fournit la liste des membres pour l'assignation. |

## 1.6 Différenciateurs V1 à rendre visibles

1. **Signal-first, pas annonce-first** — la prospection est pilotée par des signaux qualifiés, pas par un flux d'annonces brutes.
2. **Géographie honnête** — aucune fausse précision géographique, la représentation s'adapte à la qualité de la donnée.
3. **4 scénarios commerciaux DPE** — vendeur probable, bailleur à arbitrer, potentiel rénovation, opportunité investisseur : transformation business d'une donnée brute difficile à exploiter ailleurs.
4. **Méta-signal Radar** — fusion intelligente des signaux annonce + DVF + DPE sur un même bien, au lieu de 3 lignes concurrentes.
5. **Explicabilité du score** — jamais de score magique, les 3 principaux contributeurs sont visibles dans chaque drawer.
6. **Conversion en 1 clic** — de chaque signal on peut créer lead/action/estimation/suivi sans quitter la vue.

---

# 2. Principes structurants (non négociables)

## 2.1 Pipeline commercial unique

Tout signal créé ou converti doit renvoyer vers :
- un **lead**
- une **action**
- une **estimation**
- un **suivi**
- ou une **alerte**

Mais jamais vers un mini-pipeline autonome dans Prospection. Le statut commercial d'un lead évolue dans `Mon activité > Leads`, pas dans Prospection.

## 2.2 Signal-first, pas annonce-first

L'objet central de Prospection est le **signal**.

- Une annonce peut générer un signal.
- Une vente DVF peut générer un signal.
- Un DPE peut générer un signal.
- Une zone peut générer un signal synthétique.

Une même annonce peut ne PAS générer de signal si elle n'apporte pas d'angle commercial. La prospection ne montre jamais de donnée brute sans interprétation.

## 2.3 Géographie honnête

La représentation cartographique dépend du niveau réel de précision géographique.

Règle absolue :

- **si précision exacte** → point / pin
- **si précision partielle** → cluster / centroïde / bulle agrégée
- **si phénomène territorial** → zone colorée / heatmap / maille IRIS ou quartier

On ne simule jamais une adresse exacte si la donnée ne la permet pas.

Le champ `geo_precision` de l'objet `SignalProspection` dicte la représentation visuelle.

## 2.4 Drawer contextuel partagé

Les 3 sous-sections utilisent un **drawer signal standardisé** (`<DrawerSignal />`). Structure fixe, contenu variant selon la source.

## 2.5 CTA de transformation immédiate

Depuis n'importe quel signal, l'utilisateur doit pouvoir :
- créer une action
- créer un lead
- lancer une estimation
- suivre
- créer une alerte
- ouvrir le contexte local (Observatoire)
- ouvrir la fiche bien si elle existe
- ignorer

## 2.6 Règle produit la plus importante

> **Aucun signal ne doit être affiché sans proposer un sens métier et une action suivante.**

Si on ne sait pas pourquoi un signal remonte ET quelle action l'utilisateur peut faire, le signal ne doit pas être montré.

---

# 3. Architecture — Routes & sidebar

## 3.1 Place dans la sidebar Pro

```
4. Prospection                              ← position figée
   • Radar                    /app/prospection/radar
   • Signaux DVF              /app/prospection/signaux-dvf
   • Signaux DPE              /app/prospection/signaux-dpe
```

Pas de sous-item `/app/prospection` racine : la redirection par défaut pointe sur Radar.

## 3.2 Table des routes

| Route | Contenu |
|---|---|
| `/app/prospection` | Redirection 302 vers `/app/prospection/radar` |
| `/app/prospection/radar` | Vue Radar, split map/list |
| `/app/prospection/signaux-dvf` | Vue Signaux DVF, table par défaut |
| `/app/prospection/signaux-dpe` | Vue Signaux DPE, table par défaut |
| `/app/prospection/radar?signal=[meta_id]` | Radar avec drawer signal ouvert (URL shareable) |
| `/app/prospection/signaux-dvf?signal=[signal_id]` | DVF avec drawer ouvert |
| `/app/prospection/signaux-dpe?signal=[signal_id]` | DPE avec drawer ouvert |
| `/app/prospection/radar?vue=[vue_id]` | Vue enregistrée active |

## 3.3 Query params pilotables

Sur toutes les sous-sections :

| Param | Exemple | Effet |
|---|---|---|
| `signal` | `signal=sgn_abc123` | Ouvre le drawer sur ce signal |
| `vue` | `vue=vue_mes_zones_chaudes` | Active une vue enregistrée |
| `preset` | `preset=haute_priorite` | Active un preset rapide |
| `periode` | `periode=30j` | Filtre temporel |
| `recherche` | `recherche=93200` | Recherche adresse/zone |
| `show_ignored` | `show_ignored=1` | Affiche les ignorés |

Les filtres avancés ne passent PAS en query params (drawer filtres uniquement, URL stable).

---

# 4. Objets backbone

## 4.1 `SignalProspection` (base commune)

```ts
type SignalSource = 'annonce' | 'dvf' | 'dpe' | 'zone'

type SignalStatus =
  | 'nouveau'
  | 'vu'
  | 'a_traiter'
  | 'converti_action'
  | 'converti_lead'
  | 'suivi'
  | 'ignore'
  | 'archive'

type SignalPriority = 'haute' | 'moyenne' | 'basse'

type GeoPrecision = 'exacte' | 'adresse_approx' | 'quartier' | 'iris' | 'zone'

type SignalProspection = {
  signal_id: string                    // UUID
  source: SignalSource
  type: string                         // voir types DVF / DPE / annonce
  title: string                        // "Baisse de prix répétée"
  subtitle: string                     // "Appartement · 3 pièces · 68 m²"

  // Géographie
  geo_precision: GeoPrecision
  lat?: number
  lon?: number
  adresse?: string
  ville: string
  code_postal?: string
  quartier?: string
  iris_code?: string
  zone_id?: string                     // FK si territorial

  // Scoring et priorisation
  score: number                        // 0-100
  score_breakdown: ScoreContributor[]  // 3 à 5 items (voir §4.6)
  priority: SignalPriority             // dérivé du score
  status: SignalStatus

  // Liens backbone
  bien_id?: string                     // FK bien canonique (clé de fusion méta-signal)
  annonce_id?: string
  vente_dvf_id?: string
  lead_id?: string                     // si converti_lead
  action_id?: string                   // si converti_action
  estimation_id?: string               // si estimation créée
  alerte_id?: string                   // si suivi via alerte
  opportunite_id?: string              // si basculé en invest

  // Assignation
  assignee_id?: string                 // user_id de l'assigné

  // Explication
  explanation_short: string            // "Baisse de -7% en 14 jours"
  explanation_long?: string            // texte complet pour drawer
  tags: string[]                       // ["chaud", "nouveau", "zone tendue"]

  // Timestamps
  detected_at: string                  // date de création du signal
  first_seen_at?: string               // première ouverture par un user
  last_event_at?: string               // dernier événement métier
  created_at: string
  updated_at: string
}

type ScoreContributor = {
  label: string                        // "Fraîcheur du signal"
  contribution: number                 // +20, -5 (peut être négatif)
  detail?: string                      // "Détecté il y a 2h"
}
```

## 4.2 `SignalDVF`

```ts
type DVFSignalType =
  // V1 — 7 types actifs
  | 'vente_proche'
  | 'detention_longue'
  | 'revente_rapide'
  | 'cycle_revente_regulier'
  | 'zone_rotation_forte'
  | 'ecart_marche'
  | 'comparables_denses'
  // V2 — présents dans le typing mais pas remontés V1
  | 'poche_mutations'
  | 'faible_activite_zone'

type SignalDVF = SignalProspection & {
  source: 'dvf'
  type: DVFSignalType
  is_territorial: boolean              // true si le signal concerne une zone, pas un bien
  dvf_payload: {
    date_vente?: string                // ISO
    prix_vente?: number                // €
    prix_m2?: number                   // €/m²
    surface_m2?: number
    type_bien?: 'appartement' | 'maison' | 'local' | 'terrain'
    type_acquereur?: 'particulier' | 'sci' | 'personne_morale'
    duree_detention_ans?: number
    nb_mutations_10_ans?: number
    ecart_vs_marche_pct?: number       // -12 = 12% sous marché
    prix_median_secteur?: number
    volume_mutations_30j?: number
  }
}
```

## 4.3 `SignalDPE`

```ts
type DPESignalKind = 'business' | 'support'

type DPESignalType =
  // business (4) — remontent comme scénario principal dans les KPIs et presets
  | 'vendeur_probable'
  | 'bailleur_a_arbitrer'
  | 'potentiel_renovation'
  | 'opportunite_investisseur'
  // support (4) — enrichissent un scénario business, jamais CTA recommandé seul
  | 'passoire_thermique'
  | 'risque_locatif'
  | 'poche_passoires'
  | 'revalorisation_apres_travaux'

// Mapping kind → types (calculé côté front)
const DPE_KIND_MAP: Record<DPESignalType, DPESignalKind> = {
  vendeur_probable: 'business',
  bailleur_a_arbitrer: 'business',
  potentiel_renovation: 'business',
  opportunite_investisseur: 'business',
  passoire_thermique: 'support',
  risque_locatif: 'support',
  poche_passoires: 'support',
  revalorisation_apres_travaux: 'support',
}

type SignalDPE = SignalProspection & {
  source: 'dpe'
  type: DPESignalType
  kind: DPESignalKind
  support_types?: DPESignalType[]      // types support qui enrichissent le signal business
  dpe_payload: {
    classe_dpe?: 'A'|'B'|'C'|'D'|'E'|'F'|'G'
    date_dpe?: string
    type_bien?: 'appartement' | 'maison'
    surface_m2?: number
    usage_probable?: 'residence_principale' | 'locatif' | 'vacant' | 'inconnu'
    zone_tendue?: boolean
    potentiel_gain_classe?: number     // nombre de classes récupérables
    loyer_ou_valeur_apres_travaux_pct?: number
    risque_reglementaire?: 'faible' | 'moyen' | 'fort'
    conso_energie_kwh_m2_an?: number
    ges_kgco2_m2_an?: number
    travaux_estimes_euros?: number
  }
}
```

## 4.4 `SignalAnnonce` (alimente Radar uniquement V1)

```ts
type AnnonceSignalType =
  | 'baisse_prix'
  | 'remise_en_ligne'
  | 'annonce_ancienne'
  | 'anomalie_prix_m2'
  | 'zone_suivie_active'

type SignalAnnonce = SignalProspection & {
  source: 'annonce'
  type: AnnonceSignalType
  annonce_payload: {
    prix_actuel: number
    prix_initial?: number
    variation_pct?: number
    date_mise_en_ligne: string
    age_jours: number
    prix_m2?: number
    ecart_prix_m2_secteur_pct?: number
  }
}
```

## 4.5 `MetaSignalRadar` (fusion Radar)

Les signaux de différentes sources concernant un même `bien_id` sont fusionnés côté Radar. Sur les vues DVF et DPE, on garde la granularité d'origine (pas de méta-signal).

```ts
type MetaSignalRadar = {
  meta_id: string                      // hash stable de bien_id
  bien_id: string                      // clé de fusion
  sources: SignalSource[]              // ['annonce', 'dvf', 'dpe']

  // Agrégat
  score_agrege: number                 // max des scores enfants
  priority_agregee: SignalPriority
  status_agrege: SignalStatus          // hiérarchie : voir §4.5.1
  reasons_short: string[]              // 1 raison courte par source, ordonnée par score

  // Géographie (reprise du bien canonique)
  ville: string
  code_postal?: string
  adresse?: string
  lat?: number
  lon?: number

  // Enfants
  children: SignalProspection[]        // les signaux sources

  // Assignation (héritée du bien ou saisie manuelle)
  assignee_id?: string

  created_at: string
  updated_at: string
}
```

### 4.5.1 Règle de hiérarchie de statut du méta-signal

Le statut du méta-signal est dérivé des enfants selon la hiérarchie (du plus "avancé" au plus "neuf") :

```
converti_lead > converti_action > suivi > a_traiter > vu > nouveau > ignore > archive
```

Si un seul enfant est `converti_lead`, le parent est `converti_lead`.

### 4.5.2 Règle de fusion

- Fusion uniquement si `bien_id` connu et identique.
- Un signal sans `bien_id` ne fusionne jamais (toujours présenté tel quel).
- Un signal territorial (`is_territorial: true`, ex : `zone_rotation_forte`) ne fusionne jamais.
- Les signaux annonce + DVF + DPE concernant un même `bien_id` fusionnent en un seul méta-signal même s'ils ont des scores très différents.

## 4.6 `ZoneRadar`

```ts
type ZoneRadar = {
  zone_id: string
  label: string                        // "Quartier Centre-Ville"
  type: 'quartier' | 'iris' | 'commune' | 'zone_custom'
  ville: string
  code_postal?: string

  // Scoring de zone
  score_zone: number                   // 0-100
  nb_signaux_total: number
  nb_signaux_annonce: number
  nb_signaux_dvf: number
  nb_signaux_dpe: number
  nb_biens_concernes: number

  // Tendance
  tendance_7j: 'hausse' | 'stable' | 'baisse'
  tendance_30j: 'hausse' | 'stable' | 'baisse'
  evolution_pct?: number

  // Catégorisation
  priorite: 'chaude' | 'interessante' | 'froide'

  // Raisons
  reasons: string[]                    // "Forte proportion d'appartements ≤40m²", etc.

  // Géographie
  centroid_lat?: number
  centroid_lon?: number
  geojson_boundary?: string            // ou FK vers une table de polygones
}
```

## 4.7 `VueEnregistree`

```ts
type VueEnregistree = {
  vue_id: string
  nom: string                          // "Mes zones chaudes 93"
  sous_section: 'radar' | 'signaux_dvf' | 'signaux_dpe'
  user_id: string
  is_shared: boolean                   // partagée avec l'équipe

  filters: Record<string, unknown>     // snapshot des filtres
  preset?: string
  period: '24h' | '7j' | '30j' | '90j' | '12m' | '24m'
  sort?: string
  view_mode?: 'table' | 'carte' | 'split'
  visible_columns?: string[]           // pour DVF / DPE

  created_at: string
  updated_at: string
}
```

---

# 5. Règles transverses de conversion

## 5.1 Signal → Action (modal compact)

**Quand** : le signal est utile mais pas assez qualifié pour devenir un lead.

**Flow** : clic `Créer une action` dans les actions rapides → ouverture d'un **modal compact** pré-rempli.

**Contenu du modal** :
- Type d'action (dropdown : Appel · Email · RDV physique · RDV visio · Prospection terrain · Autre)
- Objet (input, pré-rempli : `{type_signal} · {adresse}`)
- Échéance (date picker, défaut +3j ouvrés)
- Assigné (dropdown, défaut = utilisateur courant)
- Note (textarea optionnelle)
- Lien signal (affiché en lecture seule : `Signal #{signal_id}`)
- Boutons : `Annuler` · `Créer l'action` (primaire violet)

**Effets après validation** :
- Création d'une `Action` dans `Mon activité`
- `signal.status` = `converti_action`
- `signal.action_id` rempli
- Timeline du signal enrichie (événement `action_creee`)
- Toast succès + lien "Voir dans Mon activité"

## 5.2 Signal → Lead (modal compact)

**Quand** : il existe une opportunité commerciale ou un angle de contact crédible.

**Flow** : clic `Créer un lead [vendeur|bailleur|acquéreur]` → modal compact pré-rempli.

**Contenu du modal** :
- Type de lead (dropdown : Vendeur · Bailleur · Acquéreur · Investisseur — pré-sélectionné selon signal)
- Nom / Prénom (inputs, vides si contact inconnu)
- Téléphone / Email (inputs optionnels)
- Bien concerné (lecture seule : `{adresse}`, `{type_bien}`, `{surface}`)
- Source (lecture seule : `Signal {type} — {sous_section}`)
- Assigné (dropdown, défaut = utilisateur courant)
- Stage initial (dropdown, défaut `À traiter`)
- Note (textarea)
- Boutons : `Annuler` · `Créer le lead` (primaire violet)

**Effets après validation** :
- Création d'un `Lead` dans `Mon activité > Leads` avec stage `À traiter`
- `signal.status` = `converti_lead`
- `signal.lead_id` rempli
- Timeline du lead enrichie avec origine : `Origine : Signal Prospection (type, zone, date)`
- Timeline du signal enrichie (événement `lead_cree`)
- Toast succès + lien "Voir dans Leads"

### 5.2.1 Règle CTA recommandé selon type signal

Le label du bouton primaire `Créer un lead` est personnalisé selon le type de signal :

| Type signal | CTA recommandé |
|---|---|
| DPE `vendeur_probable` | `Créer un lead vendeur` |
| DPE `bailleur_a_arbitrer` | `Créer un lead bailleur` |
| DPE `potentiel_renovation` | `Estimer ce bien` (non Lead par défaut — voir §5.3) |
| DPE `opportunite_investisseur` | `Analyser en investissement` (voir §5.5) |
| DVF `detention_longue` | `Créer un lead vendeur` |
| DVF `revente_rapide` | `Créer un lead vendeur` |
| DVF `vente_proche` | `Créer un lead acquéreur` (si disponible en V1, sinon `Créer une action`) |
| DVF territorial | `Créer une action` (pas de bien unique) |
| Annonce `baisse_prix` | `Créer un lead vendeur` |
| Annonce `annonce_ancienne` | `Créer un lead vendeur` |

## 5.3 Signal → Estimation (redirection)

**Quand** : le signal justifie un chiffrage rapide, un RDV ou une préparation commerciale.

**Flow** : clic `Estimer ce bien` → redirection vers `/app/estimation/{type_estimation}?signal_id={signal_id}&bien_id={bien_id}&prefill=1`.

**Page cible préremplie** avec les champs disponibles (adresse, surface, type, nb pièces, classe DPE).

### 5.3.1 Règle du type d'estimation par défaut

| Type signal | Type d'estimation ouvert |
|---|---|
| DPE `vendeur_probable` | Avis de valeur (`/app/estimation/avis-valeur`) |
| DPE `bailleur_a_arbitrer` | Étude locative (`/app/estimation/etude-locative`) |
| DPE `potentiel_renovation` | Avis de valeur |
| DPE `opportunite_investisseur` | Étude locative + ouverture Analyse invest en parallèle |
| DVF ponctuel (vente_proche, revente_rapide, detention_longue) | Estimation rapide (`/app/estimation/rapide`) |
| DVF territorial | Pas de CTA `Estimer` (pas de bien unique) |
| Annonce `baisse_prix`, `annonce_ancienne` | Estimation rapide |

L'utilisateur peut toujours changer le type d'estimation une fois sur la page. On donne juste le meilleur défaut selon le contexte.

**Effets** :
- `signal.estimation_id` rempli après création de l'estimation
- Timeline enrichie (événement `estimation_creee`)

## 5.4 Signal → Suivi (toggle immédiat)

**Quand** : l'utilisateur ne veut pas agir tout de suite mais veut garder le signal dans son univers actif.

**Flow** : clic sur l'icône ♡ ou bouton `Suivre ce bien` → **pas de modal**, toggle immédiat.

**Effets** :
- Si signal lié à un bien (`bien_id` connu) : ajout dans `Veille > Biens suivis` (table `followed_property`, source unique).
- Si signal territorial (zone) : création d'une alerte de zone dans `Veille > Alertes`.
- `signal.status` = `suivi`
- `signal.alerte_id` rempli le cas échéant
- Toast succès : `Ajouté à vos biens suivis` ou `Alerte de zone créée`

**Règle** : un signal peut être à la fois `suivi` ET en statut actif (un suivi n'exclut pas une action ou un lead ultérieur).

## 5.5 Signal → Analyse invest (modal global)

**Quand** : le signal a un angle investisseur (opportunité, décote, potentiel travaux).

**Flow** : clic `Analyser en investissement` → ouverture du modal global `?analyse=[bien_id]` déjà acté côté Investissement.

**Effets** :
- Timeline enrichie (événement `analyse_invest_ouverte`)
- Pas de création d'objet — l'analyse est transient (voir §2.4 du spec 12_OPPORTUNITES_INVESTISSEMENT.md).

## 5.6 Signal → Alerte (modal compact)

**Quand** : l'utilisateur veut recevoir des notifications sur évolution du bien ou de la zone.

**Flow** : clic `Créer une alerte` → modal compact.

**Contenu** :
- Portée (radio : `Ce bien uniquement` · `Cette zone (quartier/IRIS)` · `Ce pattern dans mes zones`)
- Événements déclencheurs (checkboxes : baisse de prix · remise en ligne · nouveau signal similaire · changement de statut bien)
- Fréquence (radio : immédiat · quotidien · hebdomadaire)
- Canal (checkboxes : notification in-app · email)
- Boutons : `Annuler` · `Créer l'alerte` (primaire violet)

**Effets** :
- Création d'une `Alerte` dans `Veille > Alertes`
- `signal.alerte_id` rempli
- Toast succès

## 5.7 Signal → Ignorer (toggle avec undo)

**Quand** : l'utilisateur estime que le signal n'est pas pertinent.

**Flow** : clic `Ignorer` dans les actions rapides ou le menu kebab → **pas de modal**, action immédiate avec undo de 5s.

**Effets** :
- `signal.status` = `ignore`
- Signal retiré de la vue par défaut (filtré)
- Toast undo 5s : `Signal ignoré. Annuler ?`

**Règle de réapparition** : un signal ignoré peut ré-apparaître automatiquement en statut `nouveau` si un nouvel événement métier majeur advient (ex : nouvelle baisse de prix > 3%, changement de classe DPE, nouvelle mutation DVF). Un log explicite est ajouté dans la timeline.

Un toggle `Afficher les ignorés` dans la barre sticky permet de les revoir à tout moment.

## 5.8 Récapitulatif des flows

| Action | UI | Redirection ? | Création objet backbone |
|---|---|---|---|
| Créer action | Modal compact | Non | `Action` |
| Créer lead | Modal compact | Non | `Lead` + enrichit timeline |
| Créer alerte | Modal compact | Non | `Alerte` |
| Estimer | — | Oui (`/app/estimation/*`) | `Estimation` (à la soumission sur la page cible) |
| Analyser invest | Modal plein écran `?analyse=` | Non (overlay global) | Aucun (transient) |
| Suivre | Toggle | Non | Entrée `followed_property` ou `Alerte` |
| Ignorer | Toggle + undo | Non | Aucun (mutation statut) |

---

# 6. Drawer signal partagé

## 6.1 Structure fixe

```text
┌─ Drawer Signal ─────────────────────────────── ✕ ┐
│ [icône source] [Type signal] [Score] [Statut]    │
│ Titre principal                                  │
│ Sous-titre · localisation · précision géo        │
│ ──────────────────────────────────────────────── │
│ Onglets : Résumé · Contexte · Liens · Historique │
│          · IA                                    │
│ ──────────────────────────────────────────────── │
│ (contenu onglet actif)                           │
│                                                  │
│ Actions rapides (sticky bas)                     │
│ [Créer lead X] (primaire)                        │
│ [Créer action] [Estimer] [Suivre] [Ignorer]      │
└──────────────────────────────────────────────────┘
```

**Largeur** : 420px sur desktop (cohérent avec les autres drawers du produit). Scroll interne.

**Comportement** : overlay droit, fermeture par ✕, clic hors du drawer ou touche Échap. URL mise à jour avec `?signal={signal_id}`.

## 6.2 Header (sticky)

Contenu minimal :
- Icône ronde de source (annonce : badge violet · DVF : badge bleu · DPE : badge orange · zone : badge violet foncé)
- Badge texte type signal (pill)
- Badge score (pill avec couleur selon seuil : vert ≥80 · jaune 60-79 · gris <60)
- Badge statut (pill : Nouveau · Chaud · Intéressant · Vu · À qualifier · En cours · Converti · Ignoré)
- Titre : type de signal en clair
- Sous-titre : adresse ou zone + précision (`Précision : exacte` / `approx.` / `quartier` / `zone`)
- Menu kebab à droite : Assigner à · Marquer comme vu · Partager le lien · Copier l'ID · Archiver

## 6.3 Onglet `Résumé` (défaut)

**Bloc 1 — Pourquoi ça remonte** (obligatoire)

Liste de 3 à 5 puces avec ✓ vert, chaque puce = 1 raison courte :
- `Baisse de prix de -7% en 14 jours`
- `Annonce en ligne depuis 38 jours`
- `Prix/m² 12% sous la médiane du secteur`
- `Classe F détectée`

**Bloc 2 — Action recommandée** (obligatoire)

Card violet pâle :
- Icône + titre : `Créer un lead vendeur`
- Sous-texte : `Probabilité de mise en vente élevée.`

**Bloc 3 — Données clés**

Grille 2 colonnes, variable selon source :
- DVF : Date vente · Prix vente · Prix/m² · Surface · Type bien · Type acquéreur
- DPE : Classe DPE · Date DPE · Surface · Type bien · Zone tendue · Usage probable
- Annonce : Prix actuel · Prix initial · Variation · Âge annonce · Prix/m²
- Zone : Nb signaux · Biens concernés · Score moyen · Évolution 7j

**Bloc 4 — Score breakdown** (expandable)

Liste compacte des 3 principaux contributeurs positifs + 1 négatif s'il existe :
```
Score 82/100

+25  Fraîcheur du signal          Détecté il y a 2h
+20  Proximité portefeuille       3 biens à moins de 500m
+18  Tension zone                 Zone chaude, demande forte
 -5  Donnée DPE ancienne          Date DPE > 5 ans

[Voir le détail complet ▾]
```

## 6.4 Onglet `Contexte`

**Bloc — Contexte marché**

- Prix/m² secteur
- Évolution 12 mois (sparkline)
- Volume mutations 30j
- Tension du marché (Forte / Correcte / Faible)
- Rotation biens secteur

**Bloc — Profil locataire / demande** (si pertinent)

- Type dominant
- Profondeur de demande
- Revenu indicatif requis
- Niveau de confiance

**Bloc — Contexte urbanisme** (si signal territorial ou zone tendue)

- Projets urbains en cours
- Risques PLU
- Permis proches

## 6.5 Onglet `Liens`

Affiche les liens inter-modules disponibles :
- Bien canonique (fiche bien) → bouton "Ouvrir la fiche"
- Annonce liée (si existe)
- Vente DVF liée (si existe)
- Lead lié (si converti)
- Action liée (si créée)
- Estimation liée (si créée)
- Bien suivi (si suivi)
- Alerte liée (si créée)
- Opportunité invest liée (si basculée)
- Observatoire local → bouton "Voir le contexte local"

Chaque lien est un bouton secondaire avec icône + label + chevron `→`.

## 6.6 Onglet `Historique`

Timeline verticale compacte. Événements (voir §10 pour la liste canonique) :

```
● Détecté                              23/04/2026 09:41
○ Vu par Paul Martin                   23/04/2026 10:15
○ Assigné à Clara Dubois               23/04/2026 10:20
○ Action créée : Appel J+3             23/04/2026 10:22
○ Converti en lead vendeur             24/04/2026 14:30
```

Filtres au-dessus : Tous · Événements système · Événements utilisateurs.

## 6.7 Onglet `IA` (compact, pas décoratif)

3 blocs courts :

**Angle de contact suggéré** (1-2 phrases)
> `Contacter en mettant en avant la baisse récente et le délai de vente. Approche directe recommandée.`

**Objection probable**
> `Le prix reste au-dessus du marché. Préparer 3 comparables récents < 8 500 €/m².`

**Next best action**
> `Créer un lead vendeur + RDV d'estimation sous 7 jours.`

Pas de génération "chaude" en V1 — contenu mocké mais typé pour branchement LLM ultérieur.

## 6.8 Actions rapides (sticky bas)

Toujours visibles, même en scroll :

- CTA principal violet : label dérivé selon type signal (voir §5.2.1)
- Row 2 secondaires : `Créer une action` · `Estimer` · `Suivre`
- Row 3 outline : `Créer une alerte` · `Ignorer`

Les CTAs indisponibles (ex : `Estimer` sur zone territoriale) sont cachés, pas grisés.

## 6.9 Variants du drawer par source

Le composant `<DrawerSignal />` prend en props :
```ts
type DrawerSignalProps = {
  signal: SignalProspection | MetaSignalRadar
  variant: 'annonce' | 'dvf' | 'dpe' | 'zone' | 'meta'
  onClose: () => void
}
```

Les blocs affichés s'adaptent :

| Bloc | Annonce | DVF | DPE | Zone | Méta |
|---|---|---|---|---|---|
| Pourquoi ça remonte | ✓ | ✓ | ✓ | ✓ | ✓ (3 sections, 1 par source) |
| Action recommandée | ✓ | ✓ | ✓ | ✓ (action terrain) | ✓ |
| Données clés | Annonce payload | DVF payload | DPE payload | Stats zone | Agrégat |
| Contexte marché | ✓ | ✓ | ✓ | ✓ | ✓ |
| Profil locataire | ✓ | ✓ | ✓ | ✓ | ✓ |
| Contexte urbanisme | si tendue | si tendue | si tendue | ✓ | si tendue |
| Liens | tous | tous | tous | réduits (pas bien) | tous + enfants |
| IA | ✓ | ✓ | ✓ | ✓ | ✓ |

---

# 7. Section 1 — Radar

## 7.1 Rôle

Le **Radar** est la vue de synthèse priorisée et géographique de Prospection.

Question produit :
> **Où dois-je prospecter maintenant ?**

Le Radar mélange plusieurs familles de signaux :
- annonces chaudes (baisse prix, remise en ligne, anomalie)
- DVF ponctuel (vente proche, détention longue, comparable exploitable)
- DVF territorial (zone rotation forte, cycle régulier)
- DPE (passoires, potentiel rénovation, scénarios business)
- indice Radar de zone (synthèse)

Les signaux concernant un même bien sont **fusionnés en méta-signal** (voir §4.5).

## 7.2 Ce que Radar n'est pas

- une page d'annonces complète
- une base DVF brute
- une page de DPE brute
- une carte de marché généraliste (c'est Observatoire)

## 7.3 Layout général

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb : Prospection › Radar                                         │
│ Header : Radar                                                            │
│ Sous-titre : Repérez les zones et signaux les plus actionnables de…      │
│                                  [Créer une alerte] [Vues enregistrées▾]│
├──────────────────────────────────────────────────────────────────────────┤
│ KPI row (3 KPIs)                                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ Barre sticky : recherche · presets · couches · filtres · tri · période   │
│               · légende · densité                                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────┬──────────────────┬───────────────────┐ │
│  │                             │                  │                   │ │
│  │                             │                  │                   │ │
│  │     Carte (62%)             │  Liste (38%)     │  Drawer (si       │ │
│  │                             │  file d'actions  │  signal ouvert)   │ │
│  │                             │                  │                   │ │
│  │                             │                  │                   │ │
│  │                             │                  │                   │ │
│  └─────────────────────────────┴──────────────────┴───────────────────┘ │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

**Ratios** :
- Sans drawer : carte 62% · liste 38%
- Avec drawer : carte ~45% · liste ~30% · drawer ~25%

**Scroll** : pas de scroll vertical de page. Liste scrollable en interne, carte visible en permanence.

## 7.4 Header

### Titre
`Radar`

### Sous-titre
`Repérez les zones et signaux les plus actionnables de vos secteurs.`

### Actions droite
- `Créer une alerte` (secondaire, icône cloche)
- `Vues enregistrées ▾` (dropdown menu)

### Badge notifications
Bell icon à l'extrême droite avec compteur de signaux non vus. Clic → ouvre les notifications globales.

## 7.5 KPI row (3 KPIs — figés)

Cards horizontales, cliquables. Chacune porte un filtre actif quand cliquée (bordure violette + badge Ⓧ pour clear).

### KPI 1 — À traiter (position 1, urgence stock)

```
À traiter              ⓘ
163 ↑ +12%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `status in [nouveau, a_traiter]`

### KPI 2 — Haute priorité (position 2, urgence qualité)

```
Haute priorité         ⓘ
37 ↑ +5                ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `score ≥ 80 AND status in [nouveau, a_traiter]`

### KPI 3 — Zones chaudes (position 3, lecture stratégique)

```
Zones chaudes          ⓘ
12 → stable            ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : focus carte sur zones `priorite = chaude` + filtre liste aux signaux de ces zones.

### Règles transverses

- Pas de KPI "Convertis" en V1 (déplacé vers `Mon activité > Performance`)
- Chaque KPI a un tooltip `ⓘ` qui explique sa définition
- Delta avec flèche colorée : vert `↑` (positif), rouge `↓` (négatif), gris `→` (stable)
- Sparkline 30 derniers jours

## 7.6 Barre sticky de contrôle

Ordre horizontal, gauche à droite :

1. **Champ recherche** (flex-1, min 280px)
   - Placeholder : `Rechercher une adresse, un quartier, une commune…`
2. **Presets ▾** (dropdown)
3. **Couches ▾** (dropdown multiselect avec checkboxes)
4. **Filtres** (bouton ouvrant drawer filtres, avec badge compteur si actifs)
5. **Tri ▾** (dropdown)
6. **Période ▾** : 24h · 7j · 30j (défaut) · 90j
7. **Légende ▾** (popover explicatif des badges et couleurs)
8. **Densité ▾** : Légère · Standard (défaut) · Dense
9. **Toggle `Afficher les ignorés`** (à droite, switch discret)
10. **`Gérer mes zones`** (lien secondaire à droite, renvoie vers `/app/veille/alertes`)

Sticky lors du scroll.

### 7.6.1 Presets

- `Tous`
- `Haute priorité` (score ≥ 80, non traités)
- `Mes zones` (zones suivies dans Veille)
- `Annonces chaudes` (source = annonce, tous types)
- `Détention longue` (source = dvf, type = detention_longue)
- `DPE critiques` (source = dpe, classe F/G)
- `Zones à forte rotation` (source = zone, priorite = chaude)
- `Non traités` (status in [nouveau, a_traiter])
- `Convertis récemment (30j)` (status in [converti_lead, converti_action], updated_at ≥ -30j)

### 7.6.2 Couches (multiselect, défaut tout coché sauf Cadastre)

- ☑ Annonces (badge violet)
- ☑ DVF ponctuel (badge bleu)
- ☑ DVF territorial (zones colorées)
- ☑ DPE (badge orange)
- ☐ Cadastre / parcelles (support de lecture)
- ☑ Indice Radar (synthèse zones, chiffres dans bulles)

Chaque couche est toggleable dans la carte ET dans la liste (affiche/masque les lignes de cette source).

### 7.6.3 Densité

- **Légère** : 1 bulle agrégée par quartier, peu de pins
- **Standard** : mix bulles + pins
- **Dense** : tous les pins visibles, clusters zoom par zoom

## 7.7 Les couches du Radar en détail

### 7.7.1 Couche Annonces

**Contenu** : annonces chaudes uniquement (pas toutes les annonces).

Types de signaux annonce :
- `baisse_prix`
- `remise_en_ligne`
- `annonce_ancienne` (>60j)
- `anomalie_prix_m2` (écart significatif)
- `zone_suivie_active` (zone suivie avec forte activité)

**Représentation** :
- Pin violet si `geo_precision = exacte`
- Bulle agrégée par quartier/IRIS sinon

### 7.7.2 Couche DVF ponctuel

**Contenu** : signaux DVF localisables individuellement.
- `vente_proche`
- `revente_rapide`
- `detention_longue`
- `cycle_revente_regulier`
- `ecart_marche`

**Représentation** :
- Pin bleu (point)
- Cluster si densité forte (> 10 pins dans 200px)

### 7.7.3 Couche DVF territorial

**Contenu** : patterns de zone.
- `zone_rotation_forte`
- `comparables_denses`

**Représentation** :
- Zone colorée (maille IRIS ou quartier)
- Heatmap légère en fond
- Halo pour zones priorisées

### 7.7.4 Couche DPE

**Contenu** : signaux énergétiques utiles.

Tous les types DPE (business + support) sont remontés sur Radar, mais filtrables par `kind`.

**Représentation** :
- Pin orange si géo précise
- Agrégat si partielle
- Heatmap légère pour `poche_passoires`

### 7.7.5 Couche Cadastre / parcelles

**Support de lecture spatiale** (optionnel, désactivée par défaut).
- Contours parcelles affichés en overlay léger
- Surlignage parcelle du signal actif

### 7.7.6 Couche Indice Radar

**Synthèse de zone** :
- Bulle par zone avec chiffre = score de zone
- Couleur selon priorité :
  - Rouge = chaude (score ≥ 80)
  - Violet = intéressante (60-79)
  - Gris clair = froide (<60)

## 7.8 Code couleur carte (récap)

| Type signal | Couleur | Forme |
|---|---|---|
| Annonce (pin) | Violet `#6366F1` | Icône maison |
| DVF ponctuel | Bleu `#3B82F6` | Point |
| DVF territorial | Rouge-orange dégradé | Zone |
| DPE (pin) | Orange `#F59E0B` | Icône éclair |
| Zone chaude (indice) | Rouge `#EF4444` | Bulle |
| Zone intéressante | Violet `#A855F7` | Bulle |

## 7.9 Liste (file d'actions)

La liste à droite de la carte est une **file d'action**, pas une table.

### Structure d'une ligne (méta-signal ou signal simple)

```
┌────────────────────────────────────────────────────────────┐
│ [icônes sources] MÉTA · Baisse prix + DVF          Score 82│
│ Appartement · 3 pièces · 68 m²                     Chaud   │
│ 📍 Rue Gabriel Péri, 93200 Saint-Denis             Nouveau │
│ Baisse de -7% en 14 jours                                  │
└────────────────────────────────────────────────────────────┘
```

**Contenu** :
- Icônes sources en badge rond (1 à 3 badges si méta-signal)
- Type signal (si méta : `MÉTA` + description des 2-3 types agrégés)
- Sous-titre bien (type, surface, pièces)
- Adresse ou zone
- Raison courte
- Score à droite (pill couleur selon seuil)
- Pills statut : `Chaud` · `Intéressant` · `Froid` + `Nouveau` / `Vu`
- Menu kebab en hover

### Interaction

- Clic ligne → ouvre le drawer signal, centre la carte sur le point
- Hover ligne → halo sur la carte (ou zoom léger sur la zone)
- Menu kebab → Assigner · Marquer vu · Ignorer · Copier lien

### Scroll infini

Pagination automatique au scroll (chargement par lots de 30).

Footer liste : `[Voir plus de signaux]` si pagination non automatique (fallback).

## 7.10 Interactions carte

- **Clic sur une bulle de zone** → filtre la liste aux signaux de cette zone + ouvre drawer zone
- **Clic sur un cluster** → zoom automatique +3 niveaux
- **Clic sur un point** → mini popover (titre signal + score + CTA "Voir détail")
- **Clic sur popover ou "Voir détail"** → ouvre le drawer signal
- **Hover sur une ligne de liste** → halo coloré sur la carte
- **Hover sur un point carte** → surlignage dans la liste (scroll auto si hors vue)
- **Drag carte** → recalcul automatique de la liste selon nouvelle vue (debounce 500ms)
- **Double-clic zone** → zoom sur la zone et filtre actif

## 7.11 Scoring Radar

Score sur 100 basé sur 7 contributeurs, pondérés :

| Contributeur | Poids max | Détail |
|---|---|---|
| Fraîcheur du signal | 25 | Signal < 24h : +25 · < 7j : +15 · < 30j : +8 · >30j : +0 |
| Proximité portefeuille | 20 | Biens portefeuille ou suivis à < 500m |
| Intensité territoriale | 20 | Densité signaux dans la zone (IRIS) |
| Potentiel commercial | 15 | Type signal + contexte marché |
| Qualité donnée | 10 | `geo_precision` + complétude payload |
| Cohérence zones suivies | 5 | Signal dans les zones configurées dans Veille |
| Comportement historique | 5 | Taux de conversion historique de ce type signal |

Seuils :
- ≥ 80 : Haute priorité (chaud)
- 60-79 : Moyenne (intéressant)
- < 60 : Basse (froid)

Le breakdown est affiché dans le drawer onglet Résumé (bloc 4).

## 7.12 Définition finale du Radar

> **Radar est la vue cartographique et priorisée de Prospection. Il agrège les signaux Annonces, DVF et DPE, les fusionne par bien quand possible, les affiche au bon niveau géographique, puis permet de les transformer immédiatement en action, lead, estimation ou suivi.**

---

# 8. Section 2 — Signaux DVF

## 8.1 Rôle

`Signaux DVF` est la vue détaillée transactionnelle de Prospection.

Question produit :
> **Quels patterns de mutation sont commercialement exploitables ?**

## 8.2 Ce que la page n'est pas

- la base DVF brute (c'est `Biens > Biens vendus (DVF)`)
- un observatoire marché pur (c'est `Observatoire`)
- une page de consultation simple

Formule simple :
> `Biens > DVF` montre les ventes. `Signaux DVF` montre ce qu'il faut en faire.

## 8.3 Types de signaux DVF V1

**Actifs V1 (7)** :
- `vente_proche` — vente < 90j (ponctuel)
- `detention_longue` — détention ≥ 10 ans (ponctuel)
- `revente_rapide` — revente ≤ 2 ans (ponctuel)
- `cycle_revente_regulier` — cycle médian < 5 ans (ponctuel)
- `zone_rotation_forte` — rotation > moyenne secteur (territorial)
- `ecart_marche` — prix ±10% vs médiane zone (ponctuel)
- `comparables_denses` — densité forte de transactions comparables (territorial)

**V2 (présents en typing, pas remontés en V1)** :
- `poche_mutations`
- `faible_activite_zone`

## 8.4 Layout général

```
┌──────────────────────────────────────────────────────────────────────────┐
│ Breadcrumb : Prospection › Signaux DVF                                   │
│ Header : Signaux DVF                                                      │
│ Sous-titre                                                                │
│                                          [Exporter] [Vues enregistrées▾] │
├──────────────────────────────────────────────────────────────────────────┤
│ KPI row (3 KPIs)                                                         │
├──────────────────────────────────────────────────────────────────────────┤
│ Barre sticky : recherche · presets · filtres · tri · période · vue       │
│               · colonnes                                                  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  Table dense (défaut)                                  Drawer (si ouvert)│
│  ┌─────────────────────────────────────────────────┬──────────────────┐ │
│  │                                                 │                  │ │
│  │  Table avec colonnes configurables              │                  │ │
│  │                                                 │                  │ │
│  │                                                 │                  │ │
│  │                                                 │                  │ │
│  └─────────────────────────────────────────────────┴──────────────────┘ │
│                                                                           │
│  Pagination                                                               │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 8.5 Vues disponibles

Toggle dans la barre sticky : `Table` (défaut) · `Carte` · `Split table/map`.

- **Table** (défaut) — travail analytique, tri/filtrage/qualification
- **Carte** — lecture spatiale, utile pour comparer des secteurs
- **Split** — 45% table · 55% carte, interaction bidirectionnelle

## 8.6 Header

### Titre
`Signaux DVF`

### Sous-titre
`Détectez les patterns de mutation exploitables pour votre prospection.`

### Actions droite
- `Exporter ▾` : CSV · XLSX · PDF (liste visible)
- `Vues enregistrées ▾`

## 8.7 KPI row (3 KPIs — figés)

### KPI 1 — Vendeurs probables (position 1, actionnable commercial)

```
Vendeurs probables     ⓘ
482 ↑ +14%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : signaux DVF dont le pattern suggère un vendeur : `detention_longue` + contexte pas d'annonce active + type acquéreur `particulier`.

**Tooltip** : `Biens en détention longue sans annonce active, dont le contexte suggère une mise en vente à venir.`

### KPI 2 — Haute priorité (position 2, urgence qualité)

```
Haute priorité         ⓘ
156 ↑ +21%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `score ≥ 80 AND status in [nouveau, a_traiter]`

### KPI 3 — Patterns de zone (position 3, angle stratégique)

```
Patterns de zone       ⓘ
243 → stable           ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `is_territorial = true` (zone_rotation_forte, comparables_denses).

**Tooltip** : `Phénomènes territoriaux : rotation forte, poches de comparables.`

## 8.8 Barre sticky

Ordre :
1. Champ recherche : `Rechercher une adresse, une zone, un vendeur…`
2. `Presets ▾`
3. `Filtres` (badge compteur)
4. `Tri ▾`
5. `Période ▾` : 30j · 90j (défaut) · 12m · 24m
6. `Vue ▾` : Table · Carte · Split
7. `Colonnes` (bouton ouvrant popover de config)
8. Toggle `Afficher les ignorés`

### 8.8.1 Presets

- `Tous`
- `Détention longue`
- `Revente rapide`
- `Zones actives` (zone_rotation_forte)
- `Comparables exploitables`
- `Non traités`
- `Haute priorité`

### 8.8.2 Tri

- Score décroissant (défaut)
- Score croissant
- Date vente récente
- Date vente ancienne
- Prix/m² décroissant
- Durée détention décroissante
- Date détection récente

## 8.9 Filtres (drawer gauche)

Ouverture par clic sur `Filtres`. Drawer 380px, fond blanc, fermeture par ✕ ou clic hors.

### Groupes de filtres

**Géographie**
- Commune (multiselect autocomplete)
- Code postal (multiselect)
- Quartier (multiselect dépendant de la commune)
- IRIS (multiselect)
- Rayon autour d'un point (input + distance)
- Zones suivies (checkbox : `Uniquement mes zones`)

**Bien / mutation**
- Type de bien (appartement · maison · local · terrain)
- Prix vente (min / max)
- Prix/m² (min / max)
- Surface m² (min / max)
- Date vente (range)
- Type acquéreur (particulier · SCI · personne morale)
- Nombre mutations 10 ans (min / max)

**Signal**
- Type signal (multiselect V1 : 7 types actifs)
- Score min (slider 0-100)
- Priorité (chaude · intéressante · froide)
- Statut (multiselect)
- Fraîcheur (< 24h · < 7j · < 30j · < 90j · toutes)

**Potentiel commercial**
- Vendeur probable (checkbox)
- Investisseur probable (checkbox)
- Comparables utiles (checkbox)
- Estimation pertinente (checkbox)

**Liaison produit**
- Déjà converti (checkbox)
- Sans lead (checkbox)
- Sans action (checkbox)
- Déjà suivi (checkbox)
- Proche portefeuille (checkbox + distance)

### Pied du drawer filtres

- `Réinitialiser` (secondaire)
- `Appliquer` (primaire violet)
- Lien : `Enregistrer comme vue`

## 8.10 Vue Table (défaut)

### Colonnes par défaut (ordre figé)

| # | Colonne | Contenu | Largeur |
|---|---|---|---|
| 1 | ☐ | Checkbox sélection multiple | 32px |
| 2 | Type signal | Badge coloré + label | 180px |
| 3 | Adresse / Zone | Adresse ou zone + code postal | 280px |
| 4 | Date vente | Format DD/MM/YYYY | 100px |
| 5 | Prix vente | € formaté | 120px |
| 6 | Prix / m² | €/m² formaté | 110px |
| 7 | Durée détention | En années + mois | 110px |
| 8 | Score | Pill couleur + nombre | 80px |
| 9 | Statut | Pill : Nouveau · À qualifier · En cours · Converti | 110px |
| 10 | Assigné | Avatar + prénom + dropdown (assignation V1) | 140px |
| 11 | Actions | Menu kebab + CTA inline | 100px |

### Colonnes optionnelles (toggleable via popover `Colonnes`)

- Type acquéreur
- Nb mutations 10 ans
- Écart vs marché (%)
- Proximité portefeuille
- Bien lié (nom)
- Lead lié (nom)
- Date détection

### CTA inline colonne Actions

Menu kebab qui ouvre :
- `Créer une action`
- `Créer un lead vendeur` (ou acquéreur selon type)
- `Estimer ce bien`
- `Suivre`
- `Ignorer`

### Clic ligne

Ouvre le drawer signal à droite (la table se rétrécit automatiquement).

### Sélection multiple (V1 basique)

Checkbox header + par ligne. Permet :
- `Ignorer la sélection`
- `Exporter la sélection`

Pas de bulk action de conversion en V1 (voir §17 hors périmètre).

## 8.11 Vue Carte

Layout carte plein écran, drawer signal ouvre à droite.

### Représentation
- Point violet pour signal ponctuel
- Cluster si densité (seuil dynamique selon zoom)
- Zone colorée pour signal territorial

### Code couleur
- Violet clair = ponctuel classique
- Violet foncé = récurrence (cycle_revente_regulier)
- Rouge = zone chaude / rotation forte
- Jaune-orange = écart marché significatif

### Légende bas-gauche
Accordéon avec code couleur, toggleable (comme sur Radar).

## 8.12 Vue Split

**Ratio recommandé** : table 45% · carte 55%.

**Comportement** :
- Clic ligne → centre carte sur le point/zone du signal
- Clic point carte → sélectionne la ligne et scroll auto
- Hover bidirectionnel (halo sur la carte / surlignage de ligne)

## 8.13 Drawer Signal DVF — spécificités

Hérite de la structure §6.

### Données clés (onglet Résumé, bloc 3)

Grille 2 colonnes :
- Date vente
- Prix vente
- Prix / m²
- Surface
- Type bien
- Type acquéreur
- Durée détention
- Nb mutations 10 ans

### Bloc `Pourquoi ça remonte` — exemples

- `Dernière vente il y a 16 ans`
- `Prix -11% sous marché (secteur 4 030 €/m²)`
- `Secteur à forte rotation sur 24 mois`
- `Revente 8 mois après achat (flip probable)`
- `3 mutations en 10 ans (cycle régulier)`

### Bloc Contexte marché

- Prix/m² secteur + évolution 12m (sparkline)
- Volume mutations 90j
- Délai médian vente
- Tension marché (Forte / Correcte / Faible)

### Actions rapides — spécifiques DVF

- `Créer lead vendeur` (primaire, par défaut pour détention_longue + revente_rapide)
- `Créer lead acquéreur` (pour vente_proche)
- `Créer action`
- `Estimer ce bien` (ouvre estimation rapide)
- `Suivre`
- `Ouvrir Biens > DVF` (lien vers la transaction dans Biens)
- `Ouvrir fiche bien` (si bien canonique connu)
- `Créer une alerte`
- `Ignorer`

## 8.14 Scoring DVF

Score sur 100 basé sur 7 contributeurs :

| Contributeur | Poids max | Détail |
|---|---|---|
| Fraîcheur | 20 | Vente récente = + fort (moins de temps pour contacter un vendeur fraîchement accompli) |
| Exploitabilité commerciale | 20 | Type acquéreur, durée détention, présence annonce |
| Intérêt du pattern | 20 | Type signal × cohérence contexte |
| Intensité marché zone | 15 | Volume 90j, tension, rotation |
| Qualité donnée | 10 | Précision géo, complétude payload |
| Proximité portefeuille | 10 | Biens < 500m |
| Cohérence stratégie user | 5 | Zones suivies, historique utilisateur |

Seuils identiques à Radar (≥80 / 60-79 / <60).

## 8.15 Définition finale de Signaux DVF

> **Signaux DVF est la vue détaillée transactionnelle de Prospection. Elle transforme la donnée DVF brute en signaux commerciaux actionnables, filtrables et convertibles en action, lead, estimation ou suivi.**

---

# 9. Section 3 — Signaux DPE

## 9.1 Rôle

`Signaux DPE` est la vue détaillée énergétique, rénovation et arbitrage de Prospection.

Question produit :
> **Quels signaux liés à la performance énergétique créent une opportunité commerciale ?**

## 9.2 Value propre

La valeur ne doit pas être :
- "montrer des DPE"
- ni "montrer des passoires sur une carte"

Mais :

> **Transformer un DPE en scénario commercial clair, explicable et actionnable.**

## 9.3 Les 4 scénarios business (owner des KPIs)

### `vendeur_probable`
Le DPE ressemble à un pré-signal de mise en vente. Indices : baisse de prix récente, DPE ancien non rafraîchi, secteur vendeur probable, usage probable RP.

### `bailleur_a_arbitrer`
Le DPE suggère une pression ou une décision locative à prendre. Indices : classe F/G en zone tendue, usage probable locatif, travaux évitables estimés.

### `potentiel_renovation`
Le bien est faible aujourd'hui mais revalorisable. Indices : gain de classe ≥2 atteignable, contexte travaux favorable, quartier en transition.

### `opportunite_investisseur`
Le DPE crée une décote, une lecture travaux ou un angle de repositionnement. Indices : décote DPE vs marché, rendement potentiel post-travaux, secteur à tension locative forte.

## 9.4 Les 4 types support (enrichissent un scénario business)

- `passoire_thermique` — classe F/G
- `risque_locatif` — interdiction de louer à venir
- `poche_passoires` — densité > moyenne zone (territorial)
- `revalorisation_apres_travaux` — potentiel valeur post-travaux fort

**Règle** : un type support ne remonte jamais seul comme signal actionnable. Il enrichit l'explication d'un signal business via le champ `support_types`.

## 9.5 Layout général

Identique à DVF (§8.4), avec 4 KPIs au lieu de 3.

## 9.6 Vues disponibles

Toggle dans la barre sticky : `Table` (défaut) · `Carte` · `Split`.

La vue Carte est particulièrement utile pour `poche_passoires` (overlay zones).

## 9.7 Header

### Titre
`Signaux DPE`

### Sous-titre
`Repérez les biens et zones où la performance énergétique crée une opportunité commerciale.`

### Actions droite
- `Exporter ▾`
- `Vues enregistrées ▾`

## 9.8 KPI row (4 KPIs — figés)

Les 4 KPIs sont alignés 1-pour-1 avec les 4 scénarios business.

### KPI 1 — Vendeurs probables

```
Vendeurs probables     ⓘ
412 ↑ +18%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `type = vendeur_probable`

### KPI 2 — Bailleurs à arbitrer

```
Bailleurs à arbitrer   ⓘ
236 ↑ +12%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `type = bailleur_a_arbitrer`

### KPI 3 — Potentiels rénovation

```
Potentiels rénovation  ⓘ
689 ↑ +21%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `type = potentiel_renovation`

### KPI 4 — Opportunités investisseur

```
Opportunités invest.   ⓘ
856 ↑ +16%             ╱╲╱╲╱
vs 30 derniers jours
```

**Filtre au click** : `type = opportunite_investisseur`

**Pont vers Investissement** : le drawer de ce type de signal propose `Analyser en investissement` en CTA principal.

## 9.9 Barre sticky

Ordre :
1. Champ recherche : `Rechercher une adresse, une zone, un propriétaire…`
2. `Presets ▾`
3. `Filtres` (badge compteur)
4. `Tri ▾`
5. `Période ▾` : 14j · 30j (défaut) · 90j
6. `Vue ▾` : Table · Carte · Split
7. `Colonnes`
8. Toggle `Afficher les ignorés`

### 9.9.1 Presets

- `Tous`
- `Vendeurs probables`
- `Bailleurs à arbitrer`
- `Potentiel rénovation`
- `Opportunités investisseur`
- `Passoires thermiques` (support, utile pour croisement)
- `Non traités`
- `Haute priorité`

### 9.9.2 Tri

- Pertinence décroissante (défaut)
- Score décroissant
- Classe DPE (G → A)
- Potentiel décroissant
- Date DPE ancienne
- Date détection récente

## 9.10 Filtres (drawer gauche)

### Groupes

**Scénario commercial**
- Vendeur probable
- Bailleur à arbitrer
- Potentiel rénovation
- Opportunité investisseur

**DPE / réglementation**
- Classe DPE (A à G, multiselect)
- Date DPE (range)
- Zone tendue (oui/non)
- Risque locatif (faible/moyen/fort)
- Usage probable (RP/locatif/vacant/inconnu)

**Potentiel**
- Gain de classe min (slider 1-5)
- Revalorisation estimée (min %)
- Potentiel loyer (seuil €/m²)
- Potentiel valeur (seuil €)
- Rénovation (légère / moyenne / lourde)

**Produit / CRM**
- Sans lead
- Sans action
- Déjà converti
- Proche portefeuille
- Proche bien suivi

**Géographie**
- Commune · Quartier · IRIS · Zones suivies · Rayon

## 9.11 Vue Table (défaut)

### Colonnes par défaut

| # | Colonne | Contenu | Largeur |
|---|---|---|---|
| 1 | ☐ | Checkbox | 32px |
| 2 | Scénario | Badge scénario business + icône | 180px |
| 3 | Adresse / Zone | Adresse + CP + type bien | 280px |
| 4 | Pourquoi ça remonte | Raison courte (truncate 60 chars) | 240px |
| 5 | Classe DPE | Badge couleur classe | 80px |
| 6 | Potentiel | 4 dots colorés (Faible → Élevé) | 100px |
| 7 | CTA recommandé | Bouton inline contextuel | 180px |
| 8 | Score | Pill | 80px |
| 9 | Statut | Pill | 110px |
| 10 | Assigné | Avatar + dropdown | 140px |
| 11 | Actions | Menu kebab | 60px |

### Colonnes optionnelles

- Date DPE
- Type bien
- Surface
- Zone tendue
- Usage probable
- Risque locatif
- Gain de classe estimé
- Impact valeur / loyer après travaux
- Bien lié
- Lead lié
- Proximité portefeuille

### CTA inline colonne `CTA recommandé`

Bouton contextuel selon scénario :

| Scénario | CTA inline (bouton outline cliquable) |
|---|---|
| `vendeur_probable` | `Créer un lead vendeur` |
| `bailleur_a_arbitrer` | `Créer un lead bailleur` |
| `potentiel_renovation` | `Estimer ce bien` |
| `opportunite_investisseur` | `Analyser invest` |

## 9.12 Vue Carte

### Représentation
- Point pour signaux ponctuels (couleur selon scénario)
- Agrégat si précision faible
- Overlay pour `poche_passoires` (heatmap orange)
- Coloration modérée des zones

### Code couleur par scénario
- `vendeur_probable` : violet
- `bailleur_a_arbitrer` : bleu
- `potentiel_renovation` : vert
- `opportunite_investisseur` : rose-violet

Les types support s'affichent en gris clair en fond.

## 9.13 Vue Split

**Ratio** : table 45% · carte 55%.

## 9.14 Drawer Signal DPE — spécificités

### Données DPE (onglet Résumé, bloc 3)

- Classe DPE (badge couleur grand format)
- Conso énergie (kWh/m²/an)
- GES (kgCO₂/m²/an)
- Date DPE
- Surface
- Type bien
- Zone tendue (Oui/Non)
- Usage probable
- Travaux estimés (€)

### Bloc `Pourquoi ça remonte` — exemples

- `42% des biens en DPE E/F`
- `Part élevée de biens construits avant 1975`
- `Forte tension locative dans ce secteur`
- `Peu de biens rénovés récemment`
- `Demande soutenue pour des biens à rénover`
- `Décote locative estimée : -18% vs marché`
- `Classe DPE G : risque d'interdiction locative`
- `Travaux énergétiques estimés : 28 à 35 k€`
- `Forte probabilité d'arbitrage bailleur`

### Contexte marché (onglet Contexte)

- Prix médian (secteur)
- Tension locative (score /10)
- Projets urbains (nombre + impact)
- Loyer médian €/m²
- Volume mutations 90j

### Actions rapides (sticky bas)

CTA principal dérivé du scénario :

| Scénario | CTA primaire |
|---|---|
| vendeur_probable | `Créer un lead vendeur` |
| bailleur_a_arbitrer | `Créer un lead bailleur` |
| potentiel_renovation | `Estimer ce bien` |
| opportunite_investisseur | `Analyser en investissement` |

CTA secondaires : `Créer action` · `Estimer invest` · `Suivre ce bien` · `Ignorer`.

## 9.15 Scoring DPE

Score sur 100 basé sur 7 contributeurs :

| Contributeur | Poids max | Détail |
|---|---|---|
| Gravité énergétique | 15 | Classe + conso |
| Risque locatif / réglementaire | 20 | Calendrier interdiction louage |
| Potentiel commercial | 20 | Alignement scénario + secteur |
| Potentiel revalorisation | 15 | Gain classe + valeur estimée post-travaux |
| Qualité donnée | 10 | Date DPE fraîche, complétude payload |
| Proximité objets Propsight | 10 | Bien suivi, portefeuille, leads actifs zone |
| Cohérence zone / stratégie | 10 | Zones suivies, stratégies utilisateur |

Seuils identiques (≥80 / 60-79 / <60).

## 9.16 Définition finale de Signaux DPE

> **Signaux DPE est la vue de prospection énergétique de Propsight. Elle ne se contente pas d'afficher des DPE : elle transforme chaque signal en scénario commercial lisible — vendeur probable, bailleur à arbitrer, potentiel rénovation ou opportunité investisseur — puis propose l'action la plus pertinente à lancer dans le produit.**

---

# 10. Événements & timeline

## 10.1 Liste canonique des événements

9 événements loggés, visibles dans l'onglet Historique du drawer :

| # | Événement | Déclencheur | Acteur |
|---|---|---|---|
| 1 | `signal_detecte` | Création du signal par le pipeline data | système |
| 2 | `signal_vu` | Premier clic d'un utilisateur | user |
| 3 | `signal_assigne` | Changement d'assignation | user |
| 4 | `action_creee` | Conversion Signal → Action | user |
| 5 | `lead_cree` | Conversion Signal → Lead | user |
| 6 | `estimation_creee` | Conversion Signal → Estimation (à la soumission) | user |
| 7 | `suivi_ajoute` | Toggle Suivi (bien ou zone) | user |
| 8 | `commentaire_ajoute` | Ajout d'une note dans le drawer | user |
| 9 | `signal_ignore` | Action Ignorer | user |

Chaque événement porte un timestamp, un acteur (user_id ou système), et une charge utile optionnelle.

## 10.2 Timeline unifiée

La timeline d'un signal est accessible :
- dans le drawer signal onglet Historique
- dans la timeline d'un lead (si converti) via l'entrée `Origine : Signal Prospection`
- dans la timeline d'un bien (si bien canonique connu)

## 10.3 Notifications bell icon

Les événements qui déclenchent une notification (bell icon en haut à droite de toutes les sous-sections) :
- Nouveau signal haute priorité dans une zone suivie
- Signal assigné à moi
- Conversion d'un signal que j'ai créé

Pas de notification spam : max 1 notification agrégée par heure par type.

---

# 11. États (loading, empty, erreurs)

## 11.1 Loading

- **Chargement initial de la page** : skeleton KPIs (4 cards grises) + skeleton liste (6 lignes) + fond carte immédiat (pas de skeleton carte)
- **Carte** : fond tiles chargé immédiatement, overlays (pins, zones) apparaissent progressivement avec fade-in 200ms
- **Drawer signal** : skeleton des blocs pendant fetch détails (300ms max)
- **Table DVF/DPE** : skeleton rows pendant chargement
- **Pagination** : loader inline en bas de liste

## 11.2 Empty states (4 cas)

### 11.2.1 Aucun territoire configuré

**Cas** : l'utilisateur n'a jamais configuré de zone dans Veille > Alertes.

**Affichage** :
- Illustration neutre (pictogramme carte stylisée)
- Titre : `Configurez vos zones de prospection`
- Description : `Pour que les signaux remontent, définissez les territoires où vous êtes actif. Vous pouvez aussi explorer toute la France en mode découverte.`
- CTAs :
  - `Définir mes zones` (primaire) → `/app/veille/alertes`
  - `Explorer toute la France` (secondaire, mode découverte)

### 11.2.2 Filtres trop stricts

**Cas** : pas de résultat malgré des signaux disponibles.

**Affichage** :
- Message : `Aucun signal ne remonte sur cette sélection.`
- Description : `Essayez d'élargir votre période ou de retirer certains filtres.`
- CTAs :
  - `Réinitialiser les filtres` (primaire)
  - `Élargir la période` (secondaire)
  - `Afficher toutes les couches` (Radar uniquement)

### 11.2.3 Secteur peu actif

**Cas** : zone configurée mais peu de données DVF/DPE/annonces disponibles.

**Affichage** :
- Message : `Peu d'activité détectée sur ce secteur.`
- Description : `Ce secteur enregistre peu de transactions récentes. Essayez d'étendre le rayon ou d'allonger la période.`
- CTAs :
  - `Étendre le rayon` (primaire, +5 km)
  - `Période 12 mois` (secondaire)

### 11.2.4 Erreur chargement

**Cas** : erreur technique de fetch.

**Affichage** :
- Icône ⚠️ orange
- Message : `Impossible de charger les signaux.`
- Description : `Un problème technique est survenu. Veuillez réessayer.`
- CTA :
  - `Réessayer` (primaire)

## 11.3 Erreurs ponctuelles

- **Erreur conversion Signal → Lead** : toast rouge `Impossible de créer le lead. Réessayer.`
- **Erreur assignation** : rollback UI + toast rouge
- **Erreur export** : toast rouge avec code erreur

## 11.4 Succès / confirmations

- **Créer lead** : toast vert 5s `Lead créé. [Voir dans Mon activité]`
- **Créer action** : toast vert 5s `Action créée. [Voir dans Mon activité]`
- **Suivre** : toast vert 3s `Ajouté à vos biens suivis.`
- **Ignorer** : toast undo 5s `Signal ignoré. [Annuler]`
- **Assignation** : toast 3s `Assigné à {nom}.`

## 11.5 Confirmations destructives

- **Ignorer multi-sélection (>3 signaux)** : modal `Vous allez ignorer N signaux. Confirmer ?` → `Annuler` / `Ignorer`
- **Archiver** (V1.5) : idem

---

# 12. Mocks & fixtures V1

Toutes les données sont mockées côté MSW v2. Branchement backend ultérieur (après V1 produit).

## 12.1 Fixture `signals_radar.json` (méta-signaux Radar)

```json
[
  {
    "meta_id": "meta_abc123",
    "bien_id": "bien_001",
    "sources": ["annonce", "dvf", "dpe"],
    "score_agrege": 82,
    "priority_agregee": "haute",
    "status_agrege": "nouveau",
    "reasons_short": [
      "Baisse de -7% en 14 jours",
      "Annonce en ligne depuis 38 jours",
      "Prix/m² 12% sous la médiane du secteur"
    ],
    "ville": "Saint-Denis",
    "code_postal": "93200",
    "adresse": "Rue Gabriel Péri",
    "lat": 48.9362,
    "lon": 2.3574,
    "children": [ /* 3 SignalProspection */ ],
    "assignee_id": "user_paul",
    "created_at": "2026-04-23T09:41:00Z",
    "updated_at": "2026-04-23T09:41:00Z"
  },
  /* ~50 méta-signaux pour couvrir les cas : Paris, 93, Lyon, Marseille */
]
```

## 12.2 Fixture `signals_dvf.json`

```json
[
  {
    "signal_id": "sgn_dvf_001",
    "source": "dvf",
    "type": "detention_longue",
    "title": "Détention longue",
    "subtitle": "Appartement · 145 m² · 5 pièces",
    "geo_precision": "exacte",
    "lat": 48.9362,
    "lon": 2.3574,
    "adresse": "18 Rue Gabriel Péri",
    "ville": "Saint-Denis",
    "code_postal": "93200",
    "is_territorial": false,
    "score": 92,
    "score_breakdown": [
      { "label": "Fraîcheur", "contribution": 20, "detail": "Détecté il y a 1 jour" },
      { "label": "Intérêt du pattern", "contribution": 20, "detail": "Détention > 15 ans" },
      { "label": "Intensité marché zone", "contribution": 15, "detail": "Secteur en tension forte" },
      { "label": "Proximité portefeuille", "contribution": 10, "detail": "2 biens à < 500m" }
    ],
    "priority": "haute",
    "status": "nouveau",
    "bien_id": "bien_001",
    "assignee_id": "user_paul",
    "explanation_short": "Détention supérieure à 15 ans (18 ans 4 mois)",
    "explanation_long": "Ce bien a été acquis il y a plus de 15 ans…",
    "tags": ["chaud", "nouveau"],
    "dvf_payload": {
      "date_vente": "2025-05-14",
      "prix_vente": 620000,
      "prix_m2": 4271,
      "surface_m2": 145,
      "type_bien": "appartement",
      "type_acquereur": "particulier",
      "duree_detention_ans": 18,
      "nb_mutations_10_ans": 1,
      "ecart_vs_marche_pct": 18,
      "prix_median_secteur": 4030,
      "volume_mutations_30j": 36
    },
    "detected_at": "2026-04-22T14:00:00Z",
    "created_at": "2026-04-22T14:00:00Z",
    "updated_at": "2026-04-23T09:41:00Z"
  },
  /* ~200 signaux DVF couvrant les 7 types V1 */
]
```

## 12.3 Fixture `signals_dpe.json`

```json
[
  {
    "signal_id": "sgn_dpe_001",
    "source": "dpe",
    "type": "bailleur_a_arbitrer",
    "kind": "business",
    "support_types": ["passoire_thermique", "risque_locatif"],
    "title": "Bailleur à arbitrer",
    "subtitle": "Appartement · 68 m²",
    "geo_precision": "exacte",
    "lat": 48.9422,
    "lon": 2.3481,
    "adresse": "8 rue Carnot",
    "ville": "La Plaine Saint-Denis",
    "code_postal": "93210",
    "score": 89,
    "score_breakdown": [
      { "label": "Risque locatif / réglementaire", "contribution": 20, "detail": "Classe G : interdiction 2025" },
      { "label": "Potentiel commercial", "contribution": 18, "detail": "Zone tendue + usage locatif probable" },
      { "label": "Potentiel revalorisation", "contribution": 15, "detail": "Gain 2 classes possible" }
    ],
    "priority": "haute",
    "status": "a_traiter",
    "bien_id": "bien_002",
    "assignee_id": "user_sophie",
    "explanation_short": "Décote locative -18% vs marché · DPE G · Travaux 28-35 k€",
    "tags": ["a_qualifier"],
    "dpe_payload": {
      "classe_dpe": "G",
      "date_dpe": "2024-02-14",
      "type_bien": "appartement",
      "surface_m2": 68,
      "usage_probable": "locatif",
      "zone_tendue": true,
      "potentiel_gain_classe": 2,
      "loyer_ou_valeur_apres_travaux_pct": 22,
      "risque_reglementaire": "fort",
      "conso_energie_kwh_m2_an": 512,
      "ges_kgco2_m2_an": 76,
      "travaux_estimes_euros": 32000
    },
    "detected_at": "2026-04-20T10:00:00Z",
    "created_at": "2026-04-20T10:00:00Z",
    "updated_at": "2026-04-22T09:00:00Z"
  },
  /* ~200 signaux DPE couvrant les 8 types (4 business + 4 support) */
]
```

## 12.4 Fixture `zones_radar.json`

```json
[
  {
    "zone_id": "zone_93200_centre",
    "label": "Quartier Centre-Ville",
    "type": "quartier",
    "ville": "Saint-Denis",
    "code_postal": "93200",
    "score_zone": 74,
    "nb_signaux_total": 36,
    "nb_signaux_annonce": 12,
    "nb_signaux_dvf": 14,
    "nb_signaux_dpe": 10,
    "nb_biens_concernes": 68,
    "tendance_7j": "hausse",
    "tendance_30j": "hausse",
    "evolution_pct": 12,
    "priorite": "chaude",
    "reasons": [
      "Vitesse de mise en vente élevée : 12 mois",
      "Baisse de prix médiane : -6,4%",
      "Forte proportion d'appartements ≤40 m²",
      "Rotation élevée : 28% des biens concernés"
    ],
    "centroid_lat": 48.9362,
    "centroid_lon": 2.3574
  },
  /* ~20 zones pour les grandes métropoles */
]
```

## 12.5 Fixture `users.json` (pour assignation)

```json
[
  { "user_id": "user_paul", "prenom": "Paul", "nom": "Martin", "avatar_url": "/avatars/paul.png" },
  { "user_id": "user_clara", "prenom": "Clara", "nom": "Dubois", "avatar_url": "/avatars/clara.png" },
  { "user_id": "user_mehdi", "prenom": "Mehdi", "nom": "Amar", "avatar_url": "/avatars/mehdi.png" },
  { "user_id": "user_alice", "prenom": "Alice", "nom": "Girard", "avatar_url": "/avatars/alice.png" },
  { "user_id": "user_sophie", "prenom": "Sophie", "nom": "Leroy", "avatar_url": "/avatars/sophie.png" },
  { "user_id": "user_thomas", "prenom": "Thomas", "nom": "Bernard", "avatar_url": "/avatars/thomas.png" },
  { "user_id": "user_emilie", "prenom": "Émilie", "nom": "Rossi", "avatar_url": "/avatars/emilie.png" }
]
```

## 12.6 Fixture `vues_enregistrees.json`

```json
[
  {
    "vue_id": "vue_mes_zones_chaudes",
    "nom": "Mes zones chaudes 93",
    "sous_section": "radar",
    "user_id": "user_paul",
    "is_shared": false,
    "filters": { "codes_postaux": ["93200", "93210", "93400"], "score_min": 75 },
    "preset": null,
    "period": "30j",
    "sort": "score_desc",
    "view_mode": "split",
    "visible_columns": null,
    "created_at": "2026-04-10T12:00:00Z",
    "updated_at": "2026-04-20T09:00:00Z"
  }
]
```

---

# 13. Liens entrants et sortants

## 13.1 Liens entrants vers Prospection

- **Pilotage commercial** (`/app/activite/pilotage`) — bloc `Signaux à traiter` → clic redirige vers Radar avec preset `Non traités` + filtres utilisateur.
- **Veille > Alertes** — clic sur une alerte de zone active redirige vers Radar filtré sur la zone.
- **Veille > Biens suivis** — clic sur un bien suivi ouvre la fiche bien (module Biens), qui elle-même peut rediriger vers les signaux actifs du bien.
- **Recherche sauvegardée** — clic ouvre la sous-section Prospection correspondante avec les filtres.
- **Carte Observatoire** — clic sur une zone → lien "Voir les signaux de cette zone" → Radar filtré.

## 13.2 Liens sortants de Prospection

- **→ Mon activité > Leads** — via conversion Signal → Lead.
- **→ Mon activité > Actions** — via conversion Signal → Action.
- **→ Estimation (rapide / avis-valeur / étude-locative)** — via conversion Signal → Estimation (redirection avec prefill).
- **→ Investissement > Analyse (`?analyse=[bien_id]`)** — via conversion Signal → Analyse invest.
- **→ Biens > Portefeuille ou Annonces ou DVF** — via lien "Ouvrir la fiche bien" dans le drawer.
- **→ Veille > Biens suivis** — via toggle Suivi.
- **→ Veille > Alertes** — via conversion Signal → Alerte OU gestion des territoires.
- **→ Observatoire > Contexte local** — via bouton "Voir le contexte local" dans l'onglet Contexte du drawer.

---

# 14. Composants partagés à créer

Ces composants sont réutilisés entre les 3 sous-sections. Les factoriser dès le départ.

## 14.1 Composants Prospection

- `<HeaderProspection />` — header de sous-section avec titre, sous-titre, actions droite
- `<KpiRowProspection count={3 | 4} />` — row de KPIs cliquables
- `<KpiCardProspection />` — card KPI avec sparkline + delta
- `<BarreStickyProspection />` — barre de contrôle (recherche, presets, filtres, tri, période, vue)
- `<DrawerFiltres />` — drawer gauche de filtres (variante par sous-section)
- `<DrawerSignal />` — drawer droit signal, variante par source
- `<BadgeSource />` — pill icônique pour indiquer la source (annonce/DVF/DPE/zone/méta)
- `<BadgeScore />` — pill score avec couleur selon seuil
- `<BadgeStatut />` — pill statut signal
- `<BadgePriorite />` — pill priorité
- `<ClasseDPEBadge />` — badge carré classe DPE avec couleur officielle

## 14.2 Composants Radar spécifiques

- `<RadarCarte />` — wrapper Leaflet avec couches configurables
- `<RadarListeSignaux />` — liste scrollable de méta-signaux / signaux
- `<CardSignalListe />` — item ligne de liste (compact)
- `<LegendeCarte />` — légende bas-gauche de la carte
- `<CouchesSelector />` — multiselect couches avec checkboxes
- `<ZoneBulle />` — bulle zone avec score (Indice Radar)

## 14.3 Composants Signaux DVF / DPE

- `<TableSignaux />` — table dense avec colonnes configurables (adapter variant DVF / DPE)
- `<ColonnesConfigPopover />` — popover de configuration des colonnes visibles
- `<SignalRow />` — ligne de table avec CTA inline
- `<AssigneDropdown />` — dropdown d'assignation (V1 simple)
- `<PotentielDots />` — 4 dots colorés (Faible → Élevé)

## 14.4 Composants conversion (modals)

- `<ModaleCreerAction />` — modal compact création action
- `<ModaleCreerLead />` — modal compact création lead (variants vendeur/bailleur/acquéreur/investisseur)
- `<ModaleCreerAlerte />` — modal compact création alerte

## 14.5 Composants transverses déjà existants (à importer)

- `<EntityDrawer />` (layout-pro)
- `<BadgeTension />`, `<BadgeDPE />` (shared)
- `<SparkLine />` (shared charts)
- `<AvatarUser />` (shared)
- `<EmptyState />` (shared)
- `<Toast />` (shared)

---

# 15. Structure technique recommandée

## 15.1 Arborescence dossiers

```text
/app/prospection
├── page.tsx                            ← redirect 302 vers /radar
├── layout.tsx                          ← layout commun (header + breadcrumb)
├── /radar/page.tsx                     ← vue Radar
├── /signaux-dvf/page.tsx               ← vue DVF
└── /signaux-dpe/page.tsx               ← vue DPE

/components/prospection/
├── shared/
│   ├── HeaderProspection.tsx
│   ├── KpiRowProspection.tsx
│   ├── KpiCardProspection.tsx
│   ├── BarreStickyProspection.tsx
│   ├── DrawerFiltres.tsx
│   ├── DrawerSignal/
│   │   ├── index.tsx                   ← router variant
│   │   ├── HeaderDrawerSignal.tsx
│   │   ├── OngletResume.tsx
│   │   ├── OngletContexte.tsx
│   │   ├── OngletLiens.tsx
│   │   ├── OngletHistorique.tsx
│   │   ├── OngletIA.tsx
│   │   ├── ActionsRapides.tsx
│   │   └── variants/
│   │       ├── DrawerSignalAnnonce.tsx
│   │       ├── DrawerSignalDVF.tsx
│   │       ├── DrawerSignalDPE.tsx
│   │       ├── DrawerSignalZone.tsx
│   │       └── DrawerSignalMeta.tsx
│   ├── BadgeSource.tsx
│   ├── BadgeScore.tsx
│   ├── BadgeStatut.tsx
│   ├── BadgePriorite.tsx
│   ├── ClasseDPEBadge.tsx
│   ├── PotentielDots.tsx
│   └── AssigneDropdown.tsx
├── radar/
│   ├── RadarCarte.tsx
│   ├── RadarListeSignaux.tsx
│   ├── CardSignalListe.tsx
│   ├── LegendeCarte.tsx
│   ├── CouchesSelector.tsx
│   └── ZoneBulle.tsx
├── signaux-dvf/
│   ├── TableSignauxDVF.tsx
│   ├── SignalRowDVF.tsx
│   ├── FiltresDVF.tsx
│   └── ColonnesConfigDVF.tsx
├── signaux-dpe/
│   ├── TableSignauxDPE.tsx
│   ├── SignalRowDPE.tsx
│   ├── FiltresDPE.tsx
│   ├── ColonnesConfigDPE.tsx
│   └── ScenarioBadge.tsx
└── modales/
    ├── ModaleCreerAction.tsx
    ├── ModaleCreerLead.tsx
    └── ModaleCreerAlerte.tsx

/services/prospection/
├── useSignauxRadar.ts                  ← TanStack Query hook (méta-signaux)
├── useSignauxDVF.ts
├── useSignauxDPE.ts
├── useZonesRadar.ts
├── useKpisProspection.ts               ← hook unifié KPIs
├── useVuesEnregistrees.ts
├── useConversionSignal.ts              ← hooks create-lead / action / estimation
├── useAssignation.ts
└── useIgnoreSignal.ts

/lib/prospection/
├── scoring.ts                          ← helpers de calcul et affichage scores
├── dedupe-radar.ts                     ← logique de fusion méta-signal
├── cta-recommande.ts                   ← règles CTA selon type signal
├── estimation-defaut.ts                ← règles type estimation par défaut
└── formatters.ts                       ← formatSignalType, formatClasseDPE, etc.

/types/prospection.ts                   ← tous les types TS de ce doc

/mocks/handlers/prospection/
├── signaux.ts                          ← handlers MSW
├── zones.ts
├── vues-enregistrees.ts
└── conversions.ts

/mocks/fixtures/prospection/
├── signals_radar.json
├── signals_dvf.json
├── signals_dpe.json
├── zones_radar.json
├── users.json
└── vues_enregistrees.json
```

## 15.2 Réutilisations obligatoires

- `<EntityDrawer />` (layout-pro) — base structurale du drawer
- Moteur de cartes Leaflet + plugin Heatmap déjà installés
- Système de toasts global
- `<EmptyState />` partagé
- Routage Next App Router
- Store Zustand pour filtres persistants par user (optionnel V1)

## 15.3 Hooks clés (contract)

```ts
// Signaux Radar (méta-signaux dédoublonnés par bien_id)
useSignauxRadar({
  filters,
  period,
  sort,
  show_ignored,
}): {
  data: MetaSignalRadar[],
  isLoading: boolean,
  error: Error | null,
  totalCount: number,
}

// Signaux DVF (pas de dédoublonnage)
useSignauxDVF({
  filters,
  period,
  sort,
  show_ignored,
  page,
  pageSize,
}): {
  data: SignalDVF[],
  isLoading,
  error,
  totalCount,
}

// Conversion Signal → Lead
useConversionSignalLead(): {
  mutateAsync: (input: { signal_id, lead_payload }) => Promise<Lead>,
  isPending,
}

// Assignation
useAssignerSignal(): {
  mutateAsync: (input: { signal_id, assignee_id }) => Promise<void>,
}
```

## 15.4 Query keys TanStack Query

```ts
const qk = {
  prospection: {
    radar: (filters, period, sort) => ['prospection', 'radar', filters, period, sort],
    dvf: (filters, period, sort, page) => ['prospection', 'dvf', filters, period, sort, page],
    dpe: (filters, period, sort, page) => ['prospection', 'dpe', filters, period, sort, page],
    signal: (signal_id) => ['prospection', 'signal', signal_id],
    kpis: (sous_section, period) => ['prospection', 'kpis', sous_section, period],
    zones: (filters) => ['prospection', 'zones', filters],
  }
}
```

## 15.5 URL state management

Utiliser `nuqs` (ou `next-usequerystate`) pour :
- `signal` (drawer ouvert)
- `vue` (vue enregistrée active)
- `preset` (preset rapide)
- `periode` (période)
- `recherche` (recherche)
- `show_ignored`

Les filtres avancés NE sont PAS dans l'URL (volume trop grand, URL illisibles).

---

# 16. Mapping maquettes fournies → sections

| Maquette | Section MD | Notes d'ajustement |
|---|---|---|
| Image 1 (Radar split map/list, drawer Annonce) | §7.3 Layout général · §7.9 Liste · §6 Drawer | Référence pixel pour split ratio 62/38. Drawer bien cadré. |
| Image 2 (Signaux DVF table simple, 4 KPIs) | §8.4 Layout · §8.10 Table | ⚠️ Remplacer KPIs par les 3 figés (Vendeurs probables · Haute priorité · Patterns de zone). |
| Image 3 (Signaux DPE vue carte + liste gauche, 5 KPIs) | §9.5 Layout · §9.12 Vue Carte | ⚠️ Remplacer KPIs par les 4 figés (Vendeurs probables · Bailleurs à arbitrer · Potentiels rénovation · Opportunités investisseur). Virer "Passoires thermiques" et "Potentiel rénovation" du header (passoires devient un preset, potentiel rénovation est déjà dedans). |
| Image 4 (Signaux DVF split, 7 KPIs) | §8.4 Layout · §8.12 Vue Split | ⚠️ 7 KPIs à ramener à 3. Garder le ratio split 45/55. Les 7 anciens KPIs deviennent des **presets** dans la barre sticky. |
| Image 5 (Signaux DPE table avec CTA recommandé, 4 KPIs) | §9.11 Vue Table | ✓ Référence pixel. Colonne `CTA recommandé` à garder telle quelle. |
| Image 6 (Radar carte pleine, drawer Zone) | §7.3 Layout général · §6.9 Drawer variant Zone | Référence pour drawer zone (stats de zone, pas de bien). |

**Règle générale** : les maquettes sont illustratives. La spec MD fait foi sur :
- le nombre de KPIs (3/3/4)
- la vue par défaut (split pour Radar, table pour DVF et DPE)
- la période homogène (30j)
- le nom exact des KPIs

---

# 17. Non-scope V1 (à reporter V1.5+)

- **Bulk conversions** : créer 10 leads d'un coup depuis sélection multiple. V1 = bulk ignore + bulk export seulement.
- **Automatisations dans la page** : règles auto du type "tous les signaux score≥90 assignés à X". Déplacé vers `Veille > Alertes` en V1.5.
- **Scénarios travaux détaillés** natifs dans Signaux DPE (simulation coût + ROI par scénario).
- **Moteur de campagnes commerciales** embarqué.
- **Assignation automatique** basée sur zone / charge / secteur. V1 = manuel uniquement.
- **Timeline unifiée cross-module** : aujourd'hui la timeline signal reste dans le drawer signal ; V1.5 = vue timeline unifiée par bien / lead / zone.
- **Export PDF multi-signaux** : rapport condensé sélection. V1 = export CSV/XLSX uniquement.
- **Préview live carte dans drawer** (mini carte dans le drawer).
- **Partage drawer signal** via lien public temporaire.
- **Notifications push navigateur** sur nouveaux signaux haute priorité.
- **Comparatif de zones** depuis Radar (existe en Investissement, pas en Prospection V1).
- **V2** : types DVF `poche_mutations` et `faible_activite_zone` (présents en typing, activés V2).
- **V2** : mode découverte interactive (pas de zones configurées) avec onboarding.

---

# 18. Ordre de livraison recommandé

Pour que Claude Code attaque dans le bon ordre et qu'on puisse dérisquer :

1. **Types TS & fixtures** (§4, §12) — types dans `/types/prospection.ts`, fixtures JSON. Rien de visible encore.
2. **Handlers MSW** — mocks d'API pour les 3 endpoints (radar, dvf, dpe) + conversions + assignation.
3. **Composants shared & badges** (§14.1) — `BadgeSource`, `BadgeScore`, `BadgeStatut`, `ClasseDPEBadge`, `AssigneDropdown`, `KpiCardProspection`.
4. **Layout & routes** — `/app/prospection/layout.tsx`, redirect racine, breadcrumb, squelette des 3 pages.
5. **Header + KPI row + Barre sticky** (§7.4-7.6, §8.6-8.8, §9.7-9.9) — identiques à 80% entre les 3 sous-sections.
6. **Signaux DPE** en premier (§9) — le plus simple techniquement (table par défaut, pas de carte complexe, 4 scénarios business lisibles). Permet de valider le drawer et le flow de conversion.
7. **Signaux DVF** (§8) — même pattern que DPE, table dense.
8. **Drawer signal partagé complet** (§6) — onglets Résumé, Contexte, Liens, Historique, IA, Actions rapides. À ce stade, DPE et DVF sont fonctionnels.
9. **Modales de conversion** (§5.1-5.6) — `ModaleCreerLead`, `ModaleCreerAction`, `ModaleCreerAlerte`. Brancher aux handlers MSW.
10. **Radar** (§7) — plus complexe : carte Leaflet + couches + méta-signaux dédoublonnage. À faire en dernier car dépend des fondations.
11. **Vues carte / split sur DVF et DPE** (§8.11, §8.12, §9.12, §9.13) — raffinement visuel.
12. **États empty / loading / erreurs** (§11) — 4 empty states, skeletons, toasts.
13. **URL state management** (§15.5) — persistance des filtres dans l'URL.
14. **Vues enregistrées** — CRUD simple, dropdown, application des filtres.
15. **Toggle `Afficher les ignorés`** + règle de réapparition (§5.7).
16. **Responsive / tablette** — non prioritaire V1 (desktop-first 1440-1600px assumé).

---

# 19. Prompt Claude Code de démarrage

À coller au premier prompt dans Claude Code :

```text
On construit le module Prospection pour Propsight.

Lis d'abord dans cet ordre :
- /docs/02_LAYOUT_PRO.md (layout Pro commun, sidebar, header)
- /docs/20_PROSPECTION.md (ce document)
- /docs/12_OPPORTUNITES_INVESTISSEMENT.md (pour le modal `?analyse=[bien_id]` commun)

Objectif : implémenter le module complet Prospection avec ses 3 sous-sections :
1. `/app/prospection/radar` — vue map/list avec méta-signaux fusionnés
2. `/app/prospection/signaux-dvf` — vue table transactionnelle
3. `/app/prospection/signaux-dpe` — vue table énergétique avec 4 scénarios business

Stack à respecter :
- Next.js 15 App Router + TypeScript strict
- Tailwind v4 + shadcn/ui thème new-york violet
- TanStack Query v5 pour le data fetching
- MSW v2 pour les mocks (fixtures JSON dans /mocks/fixtures/prospection/)
- Leaflet + react-leaflet pour les cartes
- react-hook-form + Zod pour les modals
- nuqs pour l'URL state

Avant de coder, propose-moi :
1. Un plan d'implémentation avec l'ordre de livraison de §18
2. Les types TS complets dans /types/prospection.ts
3. Les handlers MSW prévus

Attends ma validation sur ce plan avant d'implémenter.

Règles strictes :
- Pas de backend réel, tout est mocké via MSW
- Chaque composant de §14 doit exister dans son fichier dédié
- Les 3 sous-sections partagent le drawer signal, la barre sticky, les KPIs
  (pas de copie-colle, factorise)
- Respecte le nombre de KPIs figé (3/3/4)
- Respecte le dédoublonnage méta-signal sur Radar (§4.5)
- Toutes les routes sont en kebab-case français
- Language produit = français (pas d'anglais dans les labels utilisateur)
```

---

# 20. Résumé exécutif

## 20.1 Ce qu'on livre V1

- 3 sous-sections complètes : Radar, Signaux DVF, Signaux DPE
- Drawer signal partagé avec 5 onglets
- 6 flows de conversion : Signal → Action / Lead / Estimation / Suivi / Alerte / Analyse invest
- Scoring explicable à 3 contributeurs visibles
- Assignation simple (dropdown 1-clic)
- Méta-signaux Radar par fusion `bien_id`
- 4 empty states distincts
- URL shareable via query params pour signal et vue
- Pas de mini-CRM : le pipeline vit dans `Mon activité > Leads`

## 20.2 Règle produit la plus importante

> **Aucun signal ne doit être affiché sans proposer un sens métier et une action suivante.**

## 20.3 Définitions finales

- **Prospection** : couche de détection et de transformation des opportunités amont de Propsight.
- **Radar** : vue cartographique et priorisée agrégeant les signaux Annonces, DVF et DPE, avec fusion par bien.
- **Signaux DVF** : vue détaillée transactionnelle des patterns de mutation exploitables commercialement.
- **Signaux DPE** : vue détaillée énergétique transformant les DPE en 4 scénarios commerciaux (vendeur probable, bailleur à arbitrer, potentiel rénovation, opportunité investisseur).

---

**Fin de la spec.** Toute décision produit non tranchée dans ce doc remonte en question avant implémentation.
