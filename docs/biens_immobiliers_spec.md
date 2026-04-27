# Propsight — Section Biens immobiliers (spec dev)

Spec technique pour Claude Code. Section `Biens immobiliers` du SaaS Propsight Pro : 3 portes d'entrée (Portefeuille, Annonces, Biens vendus DVF) sur un objet Bien canonique.

**Stack supposée** : Next.js 14 App Router · TypeScript · Tailwind · shadcn/ui · Zustand (état UI) · TanStack Query (data).
**Design** : desktop-first 1440–1600px · dense (inspiration Linear/Attio) · violet Propsight en accent.

---

## 0. Règle de layout critique

**Chaque page tient dans la viewport 1440×900 sans scroll de page.**
Seul le contenu principal (liste, table, grille, carte) scrolle en interne. La KPI bar, les filtres, le header ne scrollent jamais hors de vue.

| Page | Scroll de page | Scroll interne |
|---|---|---|
| Portefeuille (table / cards / carte) | Non | Table body / grille cards / panneau résultats |
| Annonces (cards / liste / carte) | Non | Grille cards / table body / panneau résultats |
| DVF (carte / table) | Non | Liste gauche + carte OU table body |
| Fiche bien (modal) | Non | Contenu du tab actif |
| Drawer contextuel | Non | Contenu drawer |

**Implémentation** : `<main className="h-screen flex flex-col overflow-hidden">` sur chaque page. Seul le conteneur du contenu principal a `overflow-auto`. Jamais de `min-h-screen` sur les pages.

---

## 1. Objet Bien canonique (data model)

Objet backbone partagé par toutes les pages. Ce qui change entre les 3 portes d'entrée : la source principale affichée.

```ts
type BienSource = 'portefeuille' | 'annonce' | 'dvf';

type Bien = {
  id: string;                          // UUID interne
  source_principale: BienSource;

  // Identité
  adresse: string;
  code_postal: string;
  ville: string;
  latitude: number;
  longitude: number;
  geocoding_confidence: 'exact' | 'zone' | 'approx';

  // Caractéristiques
  type: 'appartement' | 'maison' | 'local' | 'terrain';
  surface_m2: number | null;
  pieces: number | null;
  etage: number | null;
  annee_construction: number | null;
  dpe: string | null;

  // Statut & responsable (portefeuille)
  statut_commercial: 'mandat_exclusif' | 'mandat_simple' | 'sous_compromis'
    | 'estimation_en_cours' | 'prospection' | null;
  responsable_id: string | null;
  proprietaire_nom: string | null;

  // Relations (1:N, hydratées à la demande)
  annonces: Annonce[];                 // Dedup : 1 bien = N annonces (Seloger, PAP, Leboncoin…)
  ventes_dvf: VenteDVF[];
  estimations: Estimation[];
  leads: Lead[];
  actions: Action[];
  dossier: Dossier | null;
  alertes: Alerte[];
  suivi: boolean;                      // ♡ → Veille > Biens suivis (source unique)

  // AVM
  avm: AVMResult | null;

  // Timeline
  evenements: Evenement[];

  // Meta
  created_at: string;
  updated_at: string;
};

type Annonce = {
  id: string;
  bien_id: string;                     // rattachement au bien canonique (dedup)
  source: 'seloger' | 'pap' | 'leboncoin' | 'logic_immo' | 'bienici' | 'autre';
  url_source: string;
  prix_affiche: number;
  prix_m2: number;
  publiee_le: string;
  statut: 'active' | 'baisse_prix' | 'remise_en_ligne' | 'expiree';
  evolution_prix: { date: string; prix: number }[];
  photos: string[];
  description: string;
};

type VenteDVF = {
  id: string;
  bien_id: string | null;              // null si pas de rattachement canonique
  adresse: string;
  date_vente: string;
  prix_vente: number;
  surface_m2: number;
  prix_m2: number;
  type_acquereur: 'particulier' | 'sci' | 'personne_morale';
  utilise_comme_comparable: boolean;
};

type AVMResult = {
  prix_estime: number;
  fourchette_basse: number;
  fourchette_haute: number;
  loyer_estime: number | null;
  loyer_fourchette: [number, number] | null;
  score_confiance: number;             // 0-100
  features_contributives: {            // top 3, pour tooltip explicable
    feature: string;
    impact: 'positif' | 'negatif';
    poids: number;                     // -1 à 1
  }[];
  comparables_utilises: string[];      // ids ventes DVF
};

type Evenement = {
  id: string;
  bien_id: string;
  type: 'annonce_detectee' | 'ajout_portefeuille' | 'ajout_suivi' | 'action_creee'
    | 'lead_rattache' | 'estimation_creee' | 'avis_valeur_promu' | 'analyse_invest'
    | 'dossier_cree' | 'alerte_declenchee' | 'changement_prix' | 'note_ajoutee';
  date: string;
  user_id: string | null;
  metadata: Record<string, unknown>;
};
```

**Règles de dedup annonces** : matching sur `(latitude, longitude, surface_m2, pieces)` + fuzzy sur adresse. Un bien peut avoir N annonces de sources différentes avec des prix différents — c'est visible dans l'UI (badge "3 sources" sur la card).

**Règle ♡ (favori)** : bascule `bien.suivi = true/false`. Source unique = `Veille > Biens suivis`. Aucun stockage local par page.

---

## 2. Routes

```
/app/biens                            → redirect /app/biens/portefeuille
/app/biens/portefeuille               → Portefeuille (table par défaut)
/app/biens/annonces                   → Annonces (cards par défaut)
/app/biens/dvf                        → Biens vendus DVF (carte par défaut)
```

**Modales** (URL params, partageables) — ouvrent par-dessus la page courante :
```
?bien=[bien_id]                       → Fiche bien complète
?analyse=[bien_id]                    → Modal analyse invest (7 tabs)
?comparatif=[id1,id2,id3]             → Modal comparatif
```

**Drawers** (état local, pas d'URL) : ouverts via clic sur ligne/card.

---

## 3. Composants partagés

À placer dans `/components/biens/`.

### `<KpiBar />`
Barre de 4 tuiles max. Même hauteur partout (80px). Violet en accent sur le chiffre principal. Optionnel : sélecteur de période à droite.

```ts
type KpiBarProps = {
  period?: '24h' | '7j' | '30j' | '90j' | '12m' | '24m';
  periodOptions?: string[];
  onPeriodChange?: (p: string) => void;
  items: {
    value: string | number;           // "1 842", "+47", "12 847 €/m²"
    label: string;                    // "Annonces trouvées"
    delta?: { value: number; direction: 'up' | 'down' };
  }[];
};
```

### `<ViewToggle />`
Bascule entre modes d'affichage. Persistance par page via `localStorage`.

```ts
type ViewToggleProps = {
  views: { id: string; label: string; icon: ReactNode }[];
  current: string;
  onChange: (id: string) => void;
  storageKey: string;                 // ex: 'view.annonces'
};
```

### `<FiltersBar />`
Filtres horizontaux visibles + "Plus de filtres" en popover + bouton `Réinitialiser`.

### `<SavedViewsBar />`
Vues sauvegardées (filtres + colonnes + tri). Barre horizontale au-dessus des filtres.

```ts
type SavedView = {
  id: string;
  name: string;
  filters: Record<string, unknown>;
  columns?: string[];
  sort?: { field: string; direction: 'asc' | 'desc' };
  visibility: 'me' | 'team';
};
```

### `<MultiSelectBar />`
Barre flottante en bas de page quand ≥1 ligne sélectionnée. Slide-up depuis le bas. Actions selon contexte.

### `<CardBien />`
Card réutilisée (grille Annonces, grille Portefeuille). Props : `bien`, `onClick`, `onFavorite`, `quickActions`.

### `<TableBiens />`
Table dense. Colonnes customisables (visibilité + ordre), persistance user. Row height 40px.

### `<DrawerBien />`
Drawer contextuel droit (420px). Structure fixe (section 8). Ferme sur Esc / clic hors / X.

### `<FicheBienModal />`
Modal plein écran via `?bien=[id]`. 95% viewport. Structure section 7.

### `<FavoriteButton />`
Toggle ♡. Appelle `PATCH /api/biens/:id { suivi: boolean }`. Animation cœur vide → plein violet.

### `<SourceBadge />`
Badge source annonce avec logo (Seloger, PAP, Leboncoin, Logic-Immo, Bien'ici).

### `<AVMBadge />`
Chiffre AVM + fourchette. Tooltip au hover : top 3 features contributives + comparables utilisés. **Un agent doit pouvoir défendre le chiffre devant un client.**

```ts
type AVMBadgeProps = {
  avm: AVMResult;
  type: 'prix' | 'loyer';
  compact?: boolean;                  // version dense pour cards
};
```

### `<BienLinksBlock />`
Bloc "Liens inter-modules". Grille 2 colonnes. Chaque lien = icône + label + compteur + chevron.

---

## 4. Page Portefeuille

Route : `/app/biens/portefeuille`

### Layout (viewport 1440×900, zéro scroll de page)

```
┌─────────────────────────────────────────────────────────────┐
│ Header Pro (60px)                                           │
├────────────┬────────────────────────────────────────────────┤
│            │ Breadcrumb + Titre "Portefeuille" (48px)       │
│            ├────────────────────────────────────────────────┤
│  Sidebar   │ KpiBar (80px) — 4 tuiles, période 30j          │
│            ├────────────────────────────────────────────────┤
│            │ FiltersBar + ViewToggle + [Ajouter] (48px)     │
│            ├────────────────────────────────────────────────┤
│            │                                                │
│            │ Table / Cards / Carte (flex-1, scroll interne) │
│            │                                                │
│            │ + MultiSelectBar (bottom, si sélection)        │
└────────────┴────────────────────────────────────────────────┘
```

### KPI bar (4 tuiles, sélecteur période `30j` par défaut)

1. **Mandats actifs** — `18` *(+2 vs période préc.)*
2. **Nouveaux mandats** — `4` *(sur la période)*
3. **Estimations réalisées** — `12` *(sur la période)*
4. **Valeur mandats actifs** — `2,4 M€`

Périodes : `7j · 30j · 90j · 12m`.

### Vues

Toggle `Table` (default) · `Cards` · `Carte`. Persistance user.

### Vue Table (par défaut)

Colonnes customisables (visibilité + ordre, `localStorage`) :
- Bien (miniature + nom)
- Adresse / Localisation
- Type
- Surface
- Statut *(badge coloré)*
- Propriétaire / Lead
- Estimation *(valeur + fourchette)*
- Prochaine action *(libellé + date)*
- Responsable *(avatar)*
- Signaux *(icônes : changement prix, nouvelle annonce, échéance)*
- Dernière MAJ

Interactions :
- Clic ligne → ouvre Drawer bien
- Double-clic → ouvre Fiche bien (modal)
- Shift+clic → sélection multiple
- Tri sur toutes colonnes
- Row height : `40px`

### Filtres

Statut · Type de bien · Responsable · Propriétaire/Lead · Plus de filtres (origine, date création, tag, zone).

### Actions header

- `Ajouter un bien` (bouton primary violet)
- Menu `…` : Importer CSV · Exporter · Paramètres colonnes

### Compteur

Sous la KPI bar ou en header de table : `128 biens` (résultat filtres).

---

## 5. Page Annonces

Route : `/app/biens/annonces`

### Layout (viewport 1440×900, zéro scroll de page)

```
┌─────────────────────────────────────────────────────────────┐
│ Header Pro (60px)                                           │
├────────────┬────────────────────────────────────────────────┤
│            │ Breadcrumb + "Annonces" (48px)                 │
│            ├────────────────────────────────────────────────┤
│            │ Tabs (40px)                                    │
│            ├────────────────────────────────────────────────┤
│  Sidebar   │ KpiBar (80px) — 4 tuiles, période 7j           │
│            ├────────────────────────────────────────────────┤
│            │ FiltersBar + ViewToggle +                      │
│            │ [Sauvegarder recherche] [Créer alerte] (48px)  │
│            ├────────────────────────────────────────────────┤
│            │                                                │
│            │ Cards / Liste / Carte (flex-1, scroll interne) │
│            │                                                │
└────────────┴────────────────────────────────────────────────┘
```

### Tabs

1. Toutes les annonces *(default)*
2. Nouvelles *(24h)*
3. Baisse de prix
4. Remises en ligne
5. Favoris *(♡ de l'agent)*
6. **Depuis ma dernière visite** *(hook pige quotidien)*

### KPI bar (4 tuiles, sélecteur période `7j` par défaut)

1. **Annonces trouvées** — `1 842`
2. **Nouveaux biens** — `+47` *(sur la période)*
3. **Baisses de prix** — `23` *(sur la période)*
4. **Biens expirés** — `156` *(sur la période)*

Périodes : `24h · 7j · 30j · 90j`.

Tuile 1 (`Annonces trouvées`) indépendante de la période — c'est le stock sur filtres actifs. Les 3 autres suivent la période.

### Vues

Toggle `Cards` (default) · `Liste` · `Carte`. Persistance user.

### Vue Cards (par défaut)

Grille 3 colonnes (1440px) ou 4 (≥1600px). Gap 16px.

Contenu d'une card :
- Photo ratio 4:3
- Badge coin sup gauche : `Nouveau` / `Baisse de prix` / `Opportunité` / `Remise en ligne`
- Badge coin sup droit : ♡ favori + menu `…`
- Titre : `Appartement T2` / `Maison`
- Adresse
- Prix affiché + prix/m²
- Surface · Pièces · Étage
- Footer : `Publié il y a 2h` · logo source · score potentiel (AVMBadge compact)
- Quick actions (apparaissent au hover) : persona-aware (cf. ci-dessous)

### Dedup multi-annonces

Quand un bien a ≥2 annonces détectées :
- Badge `3 sources` en bas à droite de la card
- Tooltip hover : liste des sources avec prix respectifs (`Seloger 530k · PAP 525k · Leboncoin 535k`)
- La card représente **le bien**, pas une annonce
- Clic → drawer avec bloc "Sources" qui liste les N annonces

### Quick actions (persona-aware)

**Agent immobilier** :
- Visible : `♡ Suivre · Estimer · Créer action · Créer lead · Comparer`
- Menu `…` : `Analyse invest · Créer alerte · Voir contexte local · Voir annonce source`

**Investisseur** :
- Visible : `♡ Suivre · Analyse invest · Comparer · Créer opportunité · Créer alerte`
- Menu `…` : `Estimer · Créer action · Voir contexte local · Voir annonce source`

Détection via `user.persona` dans le contexte auth.

### Actions qui n'existent PAS depuis une annonce

- Promouvoir en avis de valeur *(nécessite mandat)*
- Lancer étude locative *(nécessite relation propriétaire)*
- Rattacher à un dossier *(nécessite lead qualifié)*

**Créer un lead** : deux entrées distinctes dans le menu (jamais ambigu) :
- `Créer lead acquéreur` (un client cherche ce type de bien)
- `Créer lead vendeur` (prospection pige sur le propriétaire)

### Filtres

Localisation · Type de bien · Prix · Surface · Plus de filtres (pièces, étage, source, date publication, score potentiel min).

---

## 6. Page DVF (Biens vendus)

Route : `/app/biens/dvf`

### Layout vue Carte (viewport 1440×900, zéro scroll de page)

```
┌─────────────────────────────────────────────────────────────┐
│ Header Pro (60px)                                           │
├────────────┬────────────────────────────────────────────────┤
│            │ Breadcrumb + "Biens vendus (DVF)" (48px)       │
│            ├────────────────────────────────────────────────┤
│            │ KpiBar (80px) — 4 tuiles, période 12m          │
│            ├────────────────────────────────────────────────┤
│            │ FiltersBar + ViewToggle + [Exporter] (48px)    │
│  Sidebar   ├─────────────────┬──────────────────────────────┤
│            │                 │                              │
│            │ Liste compacte  │  Carte (flex-1)              │
│            │ (340px, scroll) │                              │
│            │                 │                              │
└────────────┴─────────────────┴──────────────────────────────┘
```

### KPI bar (4 tuiles, sélecteur période `12m` par défaut)

1. **Ventes trouvées** — `2 358`
2. **Prix/m² médian** — `12 847 €/m²`
3. **Évolution 12m** — `+3,2%`
4. **Délai médian entre ventes** — `18 j`

Périodes : `30j · 90j · 12m · 24m`.

### Vues

Toggle `Carte` (default) · `Table`. Persistance user.

### Vue Carte

3 zones : **liste gauche (340px)** + **carte centrale (flex-1)** + drawer droit à l'ouverture d'un item.

**Liste gauche** :
- Titre `Dernières ventes (DVF)` + compteur `2 358 ventes`
- Cards compactes empilées : mini photo 48px + adresse + badge `Vendu (DVF)` + date + prix + prix/m²
- Item actif : bordure violette gauche
- CTA bas : `Voir toutes les ventes (2 358)`

**Carte** :
- Points avec clusters sur zoom faible
- Point sélectionné : bulle violette avec prix
- Legend : `Afficher les clusters` · `Filtres appliqués (N)`
- Contrôles : zoom + recentrer

### Vue Table

Table dense. Colonnes : Adresse · Localisation · Type · Surface · Date vente · Prix de vente · Prix/m² · Acquéreur · Distance *(si zone centre)* · Utilisé comme comparable *(Oui/Non badge)*.

### Filtres

Localisation · Période de vente · Type de bien · Surface · Prix · Plus de filtres (type acquéreur, utilisé comme comparable).

### Actions sur une vente

- Ajouter au comparatif
- Utiliser comme comparable *(marque `utilise_comme_comparable = true`)*
- Lancer estimation *(pré-rempli avec caractéristiques)*
- Voir secteur *(Observatoire)*
- Voir annonces similaires *(filtre Annonces par critères)*
- Ouvrir fiche complète

---

## 7. Fiche Bien unifiée (modal)

Route : ouvert via `?bien=[id]` sur n'importe quelle page.
Layout : modal plein écran (95% viewport), overlay `rgba(0,0,0,0.5)`.
Structure identique quelle que soit la source — le contenu s'adapte.
**Pas de scroll de modal** : le scroll se fait dans le body du tab actif.

### Header (80px)

```
[← retour]  Appartement T2 · 45 Rue Desaix, 75015 Paris    [♡] [⋯] [↗ Partager] [✕]

Badges contexte : [Portefeuille] [Annonce active · Seloger] [Vendu DVF]
                  [Bien suivi] [3 estimations] [Opportunité]
                  [Dossier #1289] [2 actions ouvertes]

Quick actions : [Estimer] [Analyse invest] [Comparer] [Créer action] [Rattacher lead] [Plus ⌄]
```

### Body — Tabs horizontales

`Résumé` (default) · `Contexte` · `Liens` · `Activité` · `Documents`

### Tab Résumé — 6 blocs (grille 2 colonnes)

**Bloc 1 · Synthèse** *(en haut, pleine largeur)*
- Photo principale (ratio 16:9)
- Prix affiché + prix/m² *(si annonce)*
- AVM vente + fourchette + score confiance
- AVM loyer + fourchette
- Surface · Type · Pièces · Étage · Année · DPE

**Bloc 2 · Sources & statuts**
- Annonces actives liées *(cards compactes : Seloger 530k · PAP 525k · Leboncoin 535k)*
- Comparables DVF proches *(`4 ventes · distance moyenne 120m`)*
- Estimations créées *(liste)*
- Présent dans `Veille > Biens suivis` : oui/non

**Bloc 3 · Liens inter-modules** *(composant `<BienLinksBlock />`)*
- Estimations (N) → `/app/estimation/rapide?bien=[id]`
- Avis de valeur (N) → `/app/estimation/avis-valeur?bien=[id]`
- Étude locative (N)
- Opportunité (N) → `/app/investissement/opportunites/[id]`
- Dossier (N) → `/app/investissement/dossiers/[id]`
- Leads (N)
- Actions ouvertes (N)
- Alertes (N)
- Bien suivi (Oui/Non)

**Bloc 4 · Contexte marché** *(compact)*
- Niveau de marché zone : Tendu / Équilibré / Détendu
- Prix/m² médian zone
- Évolution 12m zone
- `4 comparables DVF dans un rayon de 500m`
- CTA : `Observatoire > Marché` · `Observatoire > Tension` · `Contexte local`

**Bloc 5 · Timeline** *(scroll interne, 6 derniers événements)*
- Ligne verticale violette, chaque événement = icône type + date + titre
- Exemples : `Annonce détectée sur Seloger · 12/04/2026` · `Estimation créée par Marine L. · 15/04/2026` · `Baisse de prix 545k → 530k · 20/04/2026`
- CTA : `Voir tout` → tab Activité

**Bloc 6 · IA compact** *(1 card)*
- 3 bullets de résumé IA
- 3 actions recommandées

### Tab Contexte
Détails observatoire local : POIs, transports, écoles, DPE, PLU, démo, tension locative.

### Tab Liens
Vue complète des objets liés (tables par module).

### Tab Activité
Timeline complète (tous événements, scroll interne).

### Tab Documents
Docs rattachés (photos, rapports PDF, PLU, DPE, etc.).

---

## 8. Drawer contextuel droit

Déclenché par clic sur ligne / card. Largeur `420px`. Ferme sur Esc / clic hors / X.
Structure fixe quelle que soit la source. Scroll interne uniquement.

```
┌─────────────────────────────────────┐
│ [Photo 64x64]  Titre                │
│                Sous-titre       [✕] │
├─────────────────────────────────────┤
│ [Badge source] [Badge statut]       │
│                                     │
│ Key info (grille 2 col, 4-6 champs) │
│ Prix · Surface · Type · …           │
├─────────────────────────────────────┤
│ [Tabs] Résumé · Contexte · Liens ·  │
│        Activité                     │
├─────────────────────────────────────┤
│ (scroll interne à partir d'ici)     │
│                                     │
│ Actions rapides (grille 3×2)        │
│ [♡] [Analyse invest] [Comparer]     │
│ [Créer action] [Créer lead] [Plus]  │
│                                     │
│ Liens inter-modules                 │
│ (icône + label + count, 2 col)      │
│                                     │
│ Timeline (3 derniers événements)    │
│                                     │
│ Bloc IA compact (1 card)            │
│                                     │
├─────────────────────────────────────┤
│ [Voir la fiche complète →]          │
└─────────────────────────────────────┘
```

**Quick actions** : mêmes règles persona-aware que la page Annonces (section 5). Les actions impossibles selon la source sont **masquées** (pas grisées).

---

## 9. Interactions transverses

### Favoris (♡)
- Présent partout où un bien s'affiche (card, row, drawer, fiche)
- Un clic = toggle `bien.suivi` + `PATCH /api/biens/:id`
- Effet unique : alimente `Veille > Biens suivis`
- Animation : cœur vide → plein violet

### Recherche globale (⌘K)
Command palette. Recherche : biens, leads, actions, dossiers, pages.

### Raccourcis clavier
- `⌘K` : search global
- `j` / `k` : navigation liste (suivant / précédent)
- `Enter` : ouvrir drawer sur item sélectionné
- `Esc` : fermer drawer / modal
- `Shift + clic` : sélection multiple en table
- `f` : toggle favori sur item actif
- `/` : focus filtre recherche

### Multi-select
- Checkbox sur chaque ligne (apparaît au hover en table)
- `Shift + clic` pour sélection par plage
- `<MultiSelectBar />` slide-up depuis le bas
- Actions batch : Exporter · Assigner · Créer action · Ajouter au comparatif · Supprimer

### Vues sauvegardées
- Sauvegarde filtres + colonnes + tri
- Barre horizontale au-dessus des filtres
- CRUD : créer, renommer, supprimer, définir par défaut
- Partage : `visibility: 'me' | 'team'`

### Persistance user (localStorage)
- Mode de vue par page (Table/Cards/Carte)
- Colonnes visibles + ordre (Portefeuille)
- Période active (KPI bar)
- Dernière vue sauvegardée utilisée

---

## 10. États & edge cases

### Empty states
- Portefeuille vide : illustration + "Aucun bien dans votre portefeuille" + CTA `Ajouter un bien` + `Importer CSV`
- Annonces vide : "Aucune annonce ne correspond à vos filtres" + CTA `Réinitialiser filtres`
- DVF vide : "Aucune vente sur ce périmètre" + CTA `Élargir la zone`

### Loading
- Skeletons rows pour tables (5-8 placeholders)
- Skeletons cards pour grilles (6 placeholders)
- Spinner violet sur carte DVF pendant chargement des points

### Erreurs API
- Toast rouge (`sonner`) + message concis
- Retry auto 1 fois silencieux, puis bouton `Réessayer`

### Géocodage imprécis
- Badge `Zone approximative` sur le point carte + tooltip "Adresse source imprécise"
- Dans la fiche : avertissement compact au-dessus de la mini-carte

### Annonce source morte
- Badge `Source indisponible` + grisé
- La card reste affichée, l'URL source est barrée

### Bien sans AVM
- `<AVMBadge />` affiche `—` + tooltip "Estimation indisponible pour ce bien"

### Dedup détection partielle
- Si score matching < seuil : badge `Rapprochement probable`
- Menu `…` : possibilité manuelle de fusionner / séparer

---

## 11. Contrat API AVM (mock pendant les 14 semaines de dev)

Endpoint : `POST /api/avm/estimate`

```ts
// Request
{
  adresse: string;
  latitude: number;
  longitude: number;
  type: 'appartement' | 'maison' | 'local' | 'terrain';
  surface_m2: number;
  pieces: number;
  etage?: number;
  annee_construction?: number;
  dpe?: string;
  type_valeur: 'vente' | 'loyer' | 'both';
}

// Response
{
  vente: {
    prix_estime: number;
    fourchette_basse: number;
    fourchette_haute: number;
    score_confiance: number;              // 0-100
    features_contributives: Array<{
      feature: string;
      impact: 'positif' | 'negatif';
      poids: number;                      // -1 à 1
    }>;                                    // top 3 pour tooltip
    comparables_utilises: string[];       // ids ventes DVF
  };
  loyer: { /* même structure */ } | null;
}
```

Mock déterministe respectant ce contrat pendant le dev. Branchement AVM réel fin juillet.

---

## 12. Design tokens

### Couleurs
```css
--violet-50:  #F5F3FF;
--violet-100: #EDE9FE;
--violet-500: #7C3AED;   /* primary */
--violet-600: #6D28D9;   /* hover */
--violet-700: #5B21B6;

--gray-50:  #FAFAFA;
--gray-100: #F4F4F5;
--gray-200: #E4E4E7;
--gray-500: #71717A;     /* text muted */
--gray-900: #18181B;     /* text */

--green-500: #22C55E;    /* positif / hausse */
--red-500:   #EF4444;    /* négatif / baisse */
--amber-500: #F59E0B;    /* attention */
```

### Typo
- Sans-serif système : `-apple-system, BlinkMacSystemFont, 'Inter', sans-serif`
- Tailles : `text-xs (12) · text-sm (13) · text-base (14) · text-lg (16) · text-xl (20) · text-2xl (24)`
- Poids : 400 (corps) · 500 (labels) · 600 (titres) · 700 (KPI chiffres)

### Densité
- Row table : `40px`
- Card bien (grille) : `320px`
- Padding cellule : `12px 16px`
- Gap grille cards : `16px`
- Padding page : `24px`
- Radius : `6px` (éléments) · `8px` (cards) · `12px` (modales)

### Ombres
- Card : `0 1px 2px rgba(0,0,0,0.04)`
- Drawer / Modal : `0 8px 32px rgba(0,0,0,0.12)`
- Hover card : `0 4px 12px rgba(0,0,0,0.08)`

---

## 13. Ordre de dev recommandé

1. Data model + API mocks (Bien, Annonce, VenteDVF, AVM)
2. Layout shell (Header + Sidebar + Page wrapper avec règle no-scroll)
3. Shared components (KpiBar, ViewToggle, FiltersBar, CardBien, TableBiens, FavoriteButton, AVMBadge)
4. Page Annonces (Cards + Liste) — plus visuelle, bon démarrage
5. Page Portefeuille (Table)
6. Page DVF (Carte + Liste + Table) — intégration Maplibre / Mapbox
7. Drawer contextuel
8. Fiche Bien modal
9. Multi-select + actions batch
10. Vues sauvegardées + persistance
11. Raccourcis clavier + recherche globale ⌘K
12. Empty states + loading + erreurs
13. Brancher AVM réel (fin juillet)
