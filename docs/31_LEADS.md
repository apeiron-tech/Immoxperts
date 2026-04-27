# 31 — Leads

**Route** : `/app/activite/leads`
**Sidebar** : Mon activité → Leads (actif)
**Persona V1** : Agent immobilier

## 1. Intention produit

**Pipeline commercial unique du produit.** Tous les leads du produit arrivent ici, quelle que soit leur source (widget estimateur, prospection pige, conversion depuis fiche annonce/DVF, import CSV, création manuelle).

Ce n'est pas un module : c'est **le** point de transformation. Les modules amont (Prospection, Biens, Estimation) produisent de la matière, Leads la transforme en activité commerciale, Performance mesure le résultat.

Principe : **kanban dominant** (vue par défaut, optimisée pour le pilotage visuel), **table secondaire** (vue analytique, bulk actions, export).

## 2. Layout global

Desktop-first 1440–1600px. La page ne scrolle pas, le scroll est interne aux colonnes du kanban. Drawer contextuel droit (420px) qui s'ouvre sur clic d'une carte.

```
┌─────────────────────────────────────────────────────────────────┐
│  Header Pro                                                      │
├──────┬──────────────────────────────────────────────────────────┤
│      │  Titre + sous-titre                                       │
│  S   │  [Kanban|Table] [Recherche…]                              │
│  I   │  [Source ▼][Intention ▼][Propriétaire ▼][Zone ▼][Tag ▼]  │
│  D   │  [Date ▼] [Période]              [Gérer colonnes] [+ Lead]│
│  E   │  [Tous | Vendeurs | Acquéreurs | Estim | Locatif]         │
│  B   │  ┌────┬────┬────┬────┬────┬────┬─┐ ┌──────────────────┐  │
│  A   │  │À tr│Qual│Esti│Mand│Nego│Sign│P│ │  DRAWER LEAD     │  │
│  R   │  │    │    │    │    │    │    │e│ │                  │  │
│      │  │[card│[car│[car│[car│[car│[car│r│ │                  │  │
│  P   │  │card│card│card│card│card│card│d│ │                  │  │
│  R   │  │card│card│card│card│card│card│u│ │                  │  │
│  O   │  │card│card│card│card│card│card│]│ │                  │  │
│      │  │…  ]│…  ]│…  ]│…  ]│…  ]│…  ]│ │ │                  │  │
│      │  └────┴────┴────┴────┴────┴────┴─┘ └──────────────────┘  │
└──────┴──────────────────────────────────────────────────────────┘
```

**Largeur colonnes kanban** : flex équitable, min-width 210px, max 260px. Colonne Perdu collapsed = 32px (juste label vertical).

**Quand le drawer est ouvert** : le kanban réduit sa largeur visible, les colonnes rétrécissent proportionnellement (min 180px) et un scroll horizontal apparaît si besoin.

## 3. Header de page

```
Leads
Pipeline commercial unique, centralisant tous les leads du produit.
```

- Titre H1 24px/500
- Sous-titre 13px `text-secondary`

## 4. Barre de contrôles (sous le titre)

3 rangées compactes :

### Rangée 1 — Toggle de vue + recherche

- **Toggle Kanban/Table** : segmented control, 2 options. Actif = fond `bg-secondary`, inactif = transparent. Icônes : grid pour Kanban, rows pour Table.
- **Recherche** : input avec icône loupe, placeholder `Rechercher un lead, un bien, un email, un téléphone…`. Largeur flex-grow, max 520px.

### Rangée 2 — Filtres + actions

Boutons filtres (dropdown chacun) alignés à gauche, bouton primaire + Lead aligné à droite. Entre les deux : "Gérer les colonnes" (bouton ghost, pour réorganiser les stages visibles).

| Filtre | Options |
|---|---|
| Source | Widget · Pige (DVF/DPE/Annonce) · Manuel · Import · Estimation · Recommandation |
| Intention | Vente · Achat · Location · Estimation |
| Propriétaire | Moi · [membres équipe] · Non assigné |
| Zone | Liste zones suivies (multi-select) |
| Tag | Tags custom (multi-select) |
| Date | Création / Dernière action (+ sélecteur période) |
| Période | 7j / 30j / Trim / 12m / Custom |

Chaque dropdown : chevron ▼, compteur de filtres actifs en chip violet si sélection.

### Rangée 3 — Tabs intention (filtres rapides)

```
[Tous] [Vendeurs] [Acquéreurs] [Estim] [Locatif]
```

Tabs underline, actif = violet Propsight + underline 2px, compteur à droite du label (ex: "Vendeurs 42"). Acte comme un filtre rapide sur la colonne "intention" (override le dropdown Intention).

## 5. Vue Kanban (par défaut)

### 5.1 Header de colonne

```
À traiter
28 leads · 391 255 €
```

- Nom du stage : 13px/500 `text-primary`
- Sous-ligne : compteur + valeur cumulée (somme des commissions estimées des cartes de la colonne) en 12px `text-secondary`
- À droite : icône ⋯ (menu colonne : renommer, masquer, trier par valeur / date / priorité)
- Fond header colonne : `bg-secondary` très légère teinte selon stage (ex: teinte violette pour "Négociation") — cf. couleurs stages ci-dessous
- Bordure bas 1px `border-tertiary`

### 5.2 Couleurs des stages

Chaque stage a une teinte d'accent (barre verticale gauche de la carte + teinte header) :

| Stage | Accent | Fond header |
|---|---|---|
| À traiter | gray 400 | gray 50 |
| Qualifié | blue 400 | blue 50 |
| Estimation | teal 400 | teal 50 |
| Mandat | purple 400 | purple 50 |
| Négociation | amber 400 | amber 50 |
| Signé | green 500 | green 50 |
| Perdu | red 400 | red 50 (collapsé 32px) |

### 5.3 Carte lead (très dense, 3 lignes)

Hauteur 92–104px, padding 12px, radius 8px, fond `bg-primary`, bordure `border-tertiary` 0.5px, hover bordure `border-secondary` + léger shadow.

**Barre verticale gauche** (4px) de couleur selon **intention** (pas stage) :
- Vente : purple 400
- Achat : teal 400
- Locatif : amber 400
- Estim : gray 400

Structure :

```
[avatar] [Nom lead]                 [icône source]
         Adresse tronquée, code postal
         Prix du bien
         [chip intention]  [commission €]  [dot] [il y a Xj]
```

- **Ligne 1** : Avatar initiales (24px) + nom 13px/500 + icône source à droite (14px, couleur selon source : widget=violet, pige=orange, manuel=gray, import=blue, estimation=teal) avec tooltip label source au hover.
- **Ligne 2** : Adresse tronquée ellipsis, 12px `text-secondary`.
- **Ligne 3** : Prix du bien (si connu), 12px/500 `text-primary` (ex: "820 000 €"). Si lead locatif : "1 380 € / mois".
- **Ligne 4** (footer carte) : chip intention (11px, fond teinté intention) + commission estimée (12px/500 `text-primary`, ex: "14 400 €") + dot rouge (8px) si next action en retard + "il y a Xj" 11px `text-tertiary`.

**Badge "Exclusif"** ou **"Urgent"** : si applicable, chip en haut à droite de la carte, sous le nom (ex: Mme Thauvain a un chip "Exclusif", Famille Bernard a "Urgent").

### 5.4 Interactions kanban

- **Clic carte** → ouvre drawer lead (voir section 7). URL devient `/app/activite/leads?lead=[id]` (partageable).
- **Drag & drop** entre colonnes : valide changement de stage, log une entrée dans la timeline unifiée (V1 statique : pas d'action, juste prévoir le curseur).
- **Scroll vertical** : scroll interne à chaque colonne (pas la page). Virtual scroll dès 50+ cartes (lib type `react-virtual`).
- **Footer colonne** : si > N cartes visibles, afficher `+ X leads` clicable pour charger plus (pagination visuelle).

### 5.5 Exemple de données mock (par colonne)

```json
{
  "stages": [
    { "id": "atraiter",   "label": "À traiter",   "count": 28, "valeurCumulee": 391255,
      "cards": [
        { "lead_id": "L-001", "nom": "Mme Bertrand",     "initiales": "MB", "source": "widget",     "intention": "vente",   "adresse": "45 avenue Roger Ch…, 75015 Paris", "prix": 820000,  "commission": 14400,  "age": "il y a 2 j", "badge": null },
        { "lead_id": "L-002", "nom": "Jean-Luc Moreau",  "initiales": "JL", "source": "pige",       "intention": "achat",   "adresse": "22 rue de l'Assomption, 75016",     "prix": 550000,  "commission": 9625,   "age": "il y a 5 h", "badge": null },
        { "lead_id": "L-003", "nom": "Emma Dubois",      "initiales": "ED", "source": "estimation", "intention": "estim",   "adresse": "Estimation – Appartement",           "prix": 600000,  "commission": null,   "age": "il y a 1 j", "badge": null },
        { "lead_id": "L-004", "nom": "Pierre Cornet",    "initiales": "PC", "source": "manuel",     "intention": "vente",   "adresse": "12 rue Blomet, 75015",               "prix": 1150000, "commission": 20700,  "age": "il y a 3 j", "badge": null },
        { "lead_id": "L-005", "nom": "Alexandre Simon",  "initiales": "AS", "source": "import",     "intention": "locatif", "adresse": "7 rue de Vouillé, 75015",            "prix": 470000,  "commission": null,   "age": "il y a 6 j", "badge": null }
      ]
    },
    { "id": "qualifie",   "label": "Qualifié",    "count": 22, "valeurCumulee": 382455,
      "cards": [
        { "lead_id": "L-010", "nom": "Camille Lefort",   "initiales": "CL", "source": "widget",     "intention": "vente",   "adresse": "16 rue Lecourbe, 75015",             "prix": 780000, "commission": 14040, "age": "il y a 1 j" },
        { "lead_id": "L-011", "nom": "Mathieu Martin",   "initiales": "MM", "source": "pige",       "intention": "achat",   "adresse": "34 rue de Vaugirard, …",             "prix": 690000, "commission": 12420, "age": "il y a 1 j" },
        { "lead_id": "L-012", "nom": "Alice Meyer",      "initiales": "AM", "source": "pige",       "intention": "estim",   "adresse": "Estimation – Maison",                "prix": 950000, "commission": null,   "age": "il y a 1 j" },
        { "lead_id": "L-013", "nom": "Benoît Durand",    "initiales": "BD", "source": "manuel",     "intention": "vente",   "adresse": "3 rue Blomet, 75015",                "prix": 1250000,"commission": null,  "age": "il y a 4 j", "badge": "À relancer" },
        { "lead_id": "L-014", "nom": "Sophie Renaud",    "initiales": "SR", "source": "import",     "intention": "locatif", "adresse": "Appartement – 40m²",                 "prix": 1100,   "commission": null,  "age": "il y a 1 j" }
      ]
    },
    { "id": "estimation", "label": "Estimation",  "count": 16, "valeurCumulee": 255650,
      "cards": [
        { "lead_id": "L-020", "nom": "M. Pley",           "initiales": "MP", "source": "widget",   "intention": "vente",   "adresse": "1 rue de la Ferme Exp…, 15e",        "prix": 780000, "commission": null, "age": "il y a 15 j" },
        { "lead_id": "L-021", "nom": "Nicolas Bernard",   "initiales": "NB", "source": "pige",     "intention": "achat",   "adresse": "16 rue Blomet, 75015",               "prix": 690000, "commission": 16020, "age": "il y a 6 h" },
        { "lead_id": "L-022", "nom": "Julie Thomas",      "initiales": "JT", "source": "manuel",   "intention": "locatif", "adresse": "Appartement – 70m²",                 "prix": 1550,   "commission": null, "age": "il y a 1 j" },
        { "lead_id": "L-023", "nom": "François Petit",    "initiales": "FP", "source": "pige",     "intention": "estim",   "adresse": "Estimation – Loft",                  "prix": 1200000,"commission": null, "age": "il y a 2 j" },
        { "lead_id": "L-024", "nom": "L. Morel",          "initiales": "LM", "source": "import",   "intention": "vente",   "adresse": "57 rue de Ponthieu, 75008",          "prix": 1350000,"commission": 24300, "age": "il y a 1 j" }
      ]
    },
    { "id": "mandat",     "label": "Mandat",      "count": 10, "valeurCumulee": 417500,
      "cards": [
        { "lead_id": "L-030", "nom": "Mme Thauvain",      "initiales": "MT", "source": "widget", "intention": "vente", "adresse": "14 rue Emmanuel Frém… 16e", "prix": 1650000, "commission": 29240, "age": "il y a 1 h", "badge": "Exclusif" },
        { "lead_id": "L-031", "nom": "C. Touré",          "initiales": "CT", "source": "manuel", "intention": "vente", "adresse": "Appartement – 85m²",         "prix": 1380000, "commission": null,  "age": "il y a 1 j", "sousStatut": "Manuel" },
        { "lead_id": "L-032", "nom": "Jacques Laurent",   "initiales": "JL", "source": "pige",   "intention": "vente", "adresse": "Maison – Marseille 8e",      "prix": 1890000, "commission": 34020, "age": "il y a 4 j", "badge": "Exclusif" },
        { "lead_id": "L-033", "nom": "A. Legrand",        "initiales": "AL", "source": "pige",   "intention": "vente", "adresse": "Estimation – Maison",        "prix": 1100000, "commission": null,  "age": "il y a 2 j" }
      ]
    },
    { "id": "negociation","label": "Négociation", "count": 8,  "valeurCumulee": 365800,
      "cards": [
        { "lead_id": "L-040", "nom": "Famille Bernard",   "initiales": "FB", "source": "widget",     "intention": "vente", "adresse": "22 quai de Saône, 690…Lyon", "prix": 1890000, "commission": 34000, "age": "il y a 3 h", "badge": "Urgent" },
        { "lead_id": "L-041", "nom": "L. Garcé",          "initiales": "LG", "source": "manuel",     "intention": "vente", "adresse": "Appartement – 85m²",          "prix": 2050000, "commission": null,  "age": "il y a 1 j" },
        { "lead_id": "L-042", "nom": "D. Robert",         "initiales": "DR", "source": "pige",       "intention": "vente", "adresse": "Maison – Bordeaux Caudéran",  "prix": 1250000, "commission": 22500, "age": "il y a 2 j" },
        { "lead_id": "L-043", "nom": "Sarah Cohen",       "initiales": "SC", "source": "pige",       "intention": "estim", "adresse": "17 rue Brancas, 75015",       "prix": 795000,  "commission": 14310, "age": "il y a 5 h" }
      ]
    },
    { "id": "signe",      "label": "Signé",        "count": 12, "valeurCumulee": 580200,
      "cards": [
        { "lead_id": "L-050", "nom": "Jean Hameau",       "initiales": "JH", "source": "widget",     "intention": "vente",   "adresse": "10 rue du Hameau, 75015", "prix": 2450000, "commission": 44100, "age": "il y a 2 j", "badge": "Exclusif" },
        { "lead_id": "L-051", "nom": "Marie Vallet",      "initiales": "MV", "source": "manuel",     "intention": "locatif", "adresse": "Appartement – 110m²",      "prix": 2600,    "commission": null,  "age": "il y a 1 j" },
        { "lead_id": "L-052", "nom": "P. Robert",         "initiales": "PR", "source": "pige",       "intention": "vente",   "adresse": "Maison – Boulogne-Billancourt", "prix": 1980000, "commission": 25640, "age": "il y a 1 j" },
        { "lead_id": "L-053", "nom": "Julie Dumas",       "initiales": "JD", "source": "estimation", "intention": "estim",   "adresse": "Estimation – Appartement", "prix": 720000,  "commission": null,  "age": "il y a 3 j" }
      ]
    },
    { "id": "perdu", "label": "Perdu", "collapsed": true, "count": 6, "valeurCumulee": 0 }
  ]
}
```

## 6. Vue Table (alternative)

Déclenchée par toggle Table. Mêmes filtres persistent.

### Colonnes par défaut

| Colonne | Contenu | Tri |
|---|---|---|
| ☐ | Checkbox bulk | — |
| Nom | Avatar + nom + email (ligne 2 small) | Alpha |
| Source | Icône + label | Group |
| Intention | Chip coloré | Group |
| Stage | Chip stage coloré | Custom (ordre pipeline) |
| Bien | Adresse tronquée + prix | — |
| Commission | Valeur € | Numérique |
| Propriétaire | Avatar + nom | Alpha |
| Dernière action | "Il y a Xj" | Date |
| Prochaine action | Label + date/retard | Date |
| Date création | Date | Date |
| ⋯ | Menu contextuel | — |

### Interactions table

- Tri cliquable sur header de colonne (3 états : none, asc, desc)
- Sélection multiple avec checkbox
- Bulk actions (apparaît en footer flottant quand sélection ≥ 1) : **Changer stage · Réassigner · Ajouter tag · Exporter · Archiver · Supprimer**
- "Gérer les colonnes" permet d'ajouter/retirer colonnes (zones, scoring AVM V2, etc.)
- Clic ligne → même drawer que kanban

### Pagination

25 lignes par page par défaut. Footer : `Afficher 25 | 50 | 100` + pager.

## 7. Drawer contextuel lead

Largeur 420px, s'ouvre depuis la droite. Fond `bg-primary`, bordure gauche 1px `border-tertiary`. URL partageable `?lead=[id]`.

### 7.1 Header drawer

```
[avatar]   Mme Bertrand                       [Éditer] [X]
           [icône Widget] Widget
           ID #L-000234
```

- Avatar 40px + nom 16px/500
- Ligne 2 : icône source + label source 12px `text-secondary`
- Ligne 3 : ID lead 11px `text-tertiary`
- Actions top-right : "Éditer" (bouton ghost secondaire) + close X

### 7.2 Bandeau KPI drawer (2 tiles)

```
┌─────────────────┬──────────────────┐
│ Vente           │                  │
│ 820 000 €       │ 14 400 €         │
│ Prix du bien    │ Potentiel comm.  │
│ estimé          │                  │
└─────────────────┴──────────────────┘
```

Ligne 1 = chip intention en 11px, ligne 2 = valeur 18px/500, ligne 3 = label 11px `text-secondary`.

### 7.3 Blocs info

**Identité & contact** (déjà dans tab Résumé) :
- Adresse du bien : 📍 `45 avenue Roger Ch…, 75015 Paris · Appartement · 62 m² · 2 pièces · 4e étage`
- Propriétaire lead : avatar + "Sophie Leroy"
- Créé le : `19 mai 2025`
- Source : `Widget`
- Préférences : "Vente appartement 2–3 pièces"
- Secteur : "15e, 16e arr."
- Téléphone : `06 12 34 56 78` (avec icône phone cliquable call + icône copy)
- Email : `mme.bertrand@email.com` (icône mail cliquable + icône copy)

### 7.4 Tabs drawer

```
[Résumé] [Biens] [Actions] [Estimations] [AI]
```

Tabs underline, actif = violet + underline 2px. Scrollable horizontalement si espace insuffisant (quand intention = achat/estim, onglet "Biens" change de contenu — voir 7.8).

#### Tab Résumé (par défaut)

Affiche tous les blocs 7.3 + bloc Timeline unifiée (7.5) + bloc Actions rapides (7.6) + Bloc IA (7.7).

#### Tab Biens

**Affichage conditionnel selon intention** :

- **Si vendeur** (intention = vente ou estim) → onglet `Bien à vendre` :
  - Adresse complète
  - Typologie (pièces, surface, étage, balcon/terrasse, parking)
  - Prix souhaité (éditable)
  - DPE / GES
  - Urgence (chip : Rapide / Normale / Longue)
  - Photos (grille 3 colonnes, max 6)
  - Bouton `Transformer en mandat →` si stage ≥ Estimation

- **Si acquéreur** (intention = achat ou locatif) → onglet `Critères de recherche` :
  - Zones (tags multi)
  - Budget min / max (range slider + inputs)
  - Typologie souhaitée (pièces min, surface min)
  - Critères "must have" (checkboxes : balcon, parking, ascenseur, calme…)
  - Bouton `Voir les rapprochements →` (V2, pour V1 bouton grisé + tooltip "V2")

#### Tab Actions

Liste de toutes les actions passées et futures sur ce lead (appels, emails, RDV, relances, notes). Chaque ligne = même pattern que Pilotage > Actions prioritaires. Bouton `+ Nouvelle action` en haut.

#### Tab Estimations

Liste des estimations/avis/études liés à ce lead. Chaque carte : type + prix estimé + date + statut (Draft/Envoyé/Consulté) + lien "Ouvrir".

Bouton `+ Nouvelle estimation rapide` → redirige vers `/app/estimation/rapide` avec le bien pré-rempli.

#### Tab AI

Version étendue du bloc IA (7.7) : score détaillé, facteurs, historique des recommandations.

### 7.5 Timeline unifiée

```
Timeline unifiée                                      Voir tout →

[📞] Appel sortant              Aujourd'hui · 10:32
     Sophie Leroy
     Discussion sur le projet de vente. Est déjà en contact avec un notaire.

[✉] Email envoyé               Hier · 16:05
     Sophie Leroy
     Envoi de l'estimation et des comparables.

[📅] RDV planifié              23 mai 2025 · 11:00
     Visite de l'appartement.

[📝] Note                       19 mai 2025 · 09:15
     Sophie Leroy
     Lead entrant Widget. Souhaite vendre rapidement.
```

Chaque événement :
- Icône type (24px, rond pastel)
- Label type + auteur + timestamp
- Contenu (texte libre ou description)

Limité à 5 entrées visibles + lien "Voir tout".

### 7.6 Actions rapides

4 boutons en grille 2×2, radius 6px, fond `bg-secondary` :

```
┌─────────────────┬──────────────────────┐
│ [📞]             │ [▶] Promouvoir       │
│ Créer une action│     en AdV           │
│                 │ (primary violet)     │
├─────────────────┼──────────────────────┤
│ [📄]             │ [✉]                  │
│ Créer un mandat │ Envoyer email        │
└─────────────────┴──────────────────────┘
```

"Promouvoir en AdV" = bouton principal violet (call to action dominant pour un agent vente).

### 7.7 Bloc IA (compact)

Collapsible, fermé par défaut un clic sur le chevron.

```
BLOC IA                                               [▼]

Score d'opportunité                              Élevé ▸
████████████████████████░░░░░░░  88/100

Probabilité de signature                          73%
████████████████████░░░░░░░░░░░

Meilleure action suivante
Proposer un RDV de visite

[Voir l'analyse complète]
```

- Score opportunité : barre horizontale + chip qualitatif (Faible/Moyen/Élevé)
- Probabilité signature : barre + %
- Meilleure action : texte court
- CTA : "Voir l'analyse complète" (lien vers tab AI)

**Note V1** : IA non connectée, valeurs hardcodées différentes par lead (mock plausible). Chip et % doivent varier entre leads pour ne pas paraître statique.

### 7.8 Tab "Biens" — comportement conditionnel

Le tab s'appelle "Biens" quel que soit le cas, mais le contenu change selon `lead.intention` :

```js
if (intention === 'vente' || intention === 'estim') {
  render <BienAVendre />
} else if (intention === 'achat' || intention === 'locatif') {
  render <CriteresRecherche />
}
```

Si le lead a les deux (rare mais possible : un vendeur qui cherche aussi) : afficher un sous-toggle `Bien à vendre | Critères recherche` dans l'onglet.

## 8. Création d'un lead

Clic sur `+ Lead` (bouton primaire violet en top-right). Ouvre un drawer d'ajout (ou modal plein écran sur mobile, mais V1 = desktop).

### Étape 1 — Qui

- Nom / Prénom (req)
- Email OU Téléphone (req, au moins un)
- Avatar auto-généré (initiales)

### Étape 2 — Intention

Radio cards 2×2 : Vente · Achat · Location · Estimation. Obligatoire.

### Étape 3 — Contexte (conditionnel)

- **Si Vente / Estim** : adresse bien (BAN autocomplete) + typologie rapide + prix souhaité
- **Si Achat / Locatif** : zones (multi) + budget + typologie souhaitée

### Étape 4 — Métadonnées

- Source (dropdown, par défaut "Manuel")
- Propriétaire (par défaut : user courant)
- Tag (optionnel)
- Note libre (textarea)

### Étape 5 — Submit

Crée le lead en stage "À traiter" par défaut. Redirige vers le drawer du lead créé.

**Note V1 statique** : le drawer d'ajout peut être simplifié à un formulaire unique (pas de multi-étape), avec les 4 sections visibles en même temps.

### Points d'entrée de création de lead (ailleurs dans le produit)

1. Bouton `+ Lead` ici (manuel)
2. Widget estimateur (auto)
3. Conversion depuis signal Prospection (`/app/prospection/*`)
4. Depuis fiche annonce (`/app/biens/annonces/[id]`) ou bien DVF (`/app/biens/dvf/[id]`)
5. Import CSV (`/app/imports-exports`)

## 9. États

### Empty states

- **Pipeline vide (stage sans card)** : texte centré "Aucun lead à ce stade" en 12px `text-tertiary`, padding 24px.
- **Kanban entièrement vide** : illustration + "Aucun lead pour le moment. Créez votre premier lead ou connectez votre widget estimateur." + CTA `+ Lead`.
- **Table vide** : même pattern.
- **Filtres sans résultat** : "Aucun lead ne correspond à ces filtres." + CTA `Réinitialiser les filtres`.

### Loading

Skeleton de 3 cartes par colonne en bg-tertiary.

### Erreur de chargement

"Impossible de charger les leads." + bouton `Réessayer`.

## 10. Interconnexions

| Élément | Clic → |
|---|---|
| Carte lead (kanban/table) | Drawer lead |
| Adresse du bien (drawer) | Drawer bien (si DVF/annonce connu) |
| "Créer une action" | Modal création action liée au lead |
| "Créer un mandat" | Redirige `/app/estimation/avis-valeur?lead=[id]` ou modal mandat |
| "Promouvoir en AdV" | `/app/estimation/avis-valeur?lead=[id]` (pré-rempli) |
| Tab Estimations — item | `/app/estimation/…/[id]` |
| Timeline — note | édition inline |
| Bloc IA → "Voir analyse complète" | Tab AI |
| "Voir les rapprochements" (V2) | vue rapprochements acheteur↔bien |

## 11. Shortcuts clavier

- `⌘K` → recherche globale (header Pro)
- `N` → nouveau lead (quand focus sur page Leads)
- `F` → ouvre popover filtres
- `K / T` → toggle Kanban / Table
- `Esc` → ferme drawer

## 12. Données mock consolidées

Fichier `/webapp/app/data/mocks/leads.json` avec structure :

```json
{
  "leads": [ /* tous les objets lead avec id, stage, intention, source, etc. */ ],
  "stages": [ /* metadata stages */ ],
  "sources": [ /* liste sources */ ],
  "membres": [ /* pour filtre Propriétaire */ ]
}
```

Fichier `/webapp/app/data/mocks/lead-drawer.json` : detail complet d'un lead (timeline, actions, estimations) pour drawer.

## 13. Notes d'implémentation

- **Kanban** : librairie `@dnd-kit/core` recommandée. Virtual scroll `react-virtual` si > 50 cartes/colonne.
- **Drawer** : overlay natif ou lib type Radix Dialog en mode side. URL sync via query param `?lead=…`.
- **Filtres** : état persisté dans URL (shareable). Reset via bouton dédié.
- **Recherche** : fuzzy sur nom, email, téléphone, adresse. Debounce 200ms.
- **Barre verticale gauche de carte** : attention au radius — ne pas arrondir, sinon l'accent visuel se perd. Carte entière arrondie, barre en `position: absolute` avec `border-radius: 0`.
- **Drag & drop V1 statique** : curseur grab + drop zones visibles, pas d'action réelle nécessaire pour la maquette.
- **Drawer : 5 tabs** mais tab Biens conditionnel — prévoir le toggle acheteur/vendeur pour montrer les 2 cas dans la démo.
- **Comptes cumulés par colonne** : recalculer dynamiquement à chaque filtre (si V1 statique, pré-calculer 2–3 sets de filtres pour la démo).
- **Styles stages** : ne pas redéfinir le design system — utiliser les tokens de couleur existants (voir 01_DESIGN_SYSTEM.md).
