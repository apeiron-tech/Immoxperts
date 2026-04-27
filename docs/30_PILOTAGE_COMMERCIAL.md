# 30 — Pilotage commercial

**Route** : `/app/activite/pilotage`
**Sidebar** : Mon activité → Pilotage commercial (actif)
**Persona V1** : Agent immobilier (l'investisseur aura une variante en V2)

## 1. Intention produit

Cockpit quotidien de l'agent. Répond à une seule question : **"qu'est-ce que je fais maintenant ?"**.

Ce n'est pas un tableau de bord d'analytique (voir `/app/activite/performance`) ni le command center macro business (voir `/app/tableau-de-bord`). C'est un écran d'action, dense, opérationnel, pensé pour être ouvert le matin et utilisé toute la journée.

Principe : tout ce qui est affiché doit être **actionnable en 1 clic** (CTA inline sur chaque ligne) ou **cliquable vers un drawer contextuel** (pour voir/éditer sans changer de page).

## 2. Layout global

Desktop-first 1440–1600px. Pas de scroll page (tout tient à l'écran), scroll interne à chaque bloc si nécessaire.

```
┌─────────────────────────────────────────────────────────────────┐
│  Header Pro (voir 02_LAYOUT_PRO)                                 │
├──────┬──────────────────────────────────────────────────────────┤
│      │  Titre + sous-titre                                       │
│  S   │  [Période ▼] [Propriétaire ▼] [Filtres ▼]  [Personnaliser]│
│  I   │                                                           │
│  D   │  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐                     │
│  E   │  │KPI1│ │KPI2│ │KPI3│ │KPI4│ │KPI5│   ← Bandeau KPI     │
│  B   │  └────┘ └────┘ └────┘ └────┘ └────┘                     │
│  A   │                                                           │
│  R   │  ┌──────────────┐ ┌──────────┐ ┌──────────────────┐     │
│      │  │              │ │          │ │ Entrants récents │     │
│  P   │  │   Actions    │ │ Agenda   │ ├──────────────────┤     │
│  R   │  │ prioritaires │ │  du jour │ │ Signaux à traiter│     │
│  O   │  │              │ │          │ ├──────────────────┤     │
│      │  │              │ ├──────────┤ │ Synthèse pipe    │     │
│      │  │              │ │ Leads    │ ├──────────────────┤     │
│      │  │              │ │ chauds   │ │ Dossiers en cours│     │
│      │  │              │ │          │ ├──────────────────┤     │
│      │  │              │ │          │ │ Mandats échéance │     │
│      │  └──────────────┘ └──────────┘ └──────────────────┘     │
└──────┴──────────────────────────────────────────────────────────┘
```

**Grille principale** : 3 colonnes, ratio `minmax(0, 1.35fr) minmax(0, 1fr) minmax(0, 1fr)`. Gaps 16px. Padding outer 24px.

## 3. Header de page

```
Pilotage commercial
Suivez votre activité, priorisez vos actions et développez votre portefeuille.
```

- Titre : H1 24px/500, couleur `text-primary`
- Sous-titre : 13px/400, couleur `text-secondary`, marge top 4px
- Marge bottom 20px

**Barre de filtres** (ligne sous le titre) :

| Élément | Type | Détail |
|---|---|---|
| Sélecteur période | Dropdown | "19 – 25 mai 2025" (défaut : semaine en cours). Options : Aujourd'hui, 7j, 30j, Mois en cours, Trimestre, Personnalisé |
| Propriétaire | Dropdown | "Tous les propriétaires" (défaut). Liste membres équipe + "Moi uniquement" |
| Filtres | Popover | Bouton "Filtres" avec icône funnel, ouvre popover avec zones, intentions, sources |
| Personnaliser | Bouton ghost | Icône ⚙, ouvre modal de réorganisation des blocs (V2, en V1 : non fonctionnel, juste affiché) |

Alignement : filtres à gauche, Personnaliser à droite.

## 4. Bandeau KPI (5 tiles)

Grille 5 colonnes égales, gap 12px. Chaque tile :

- Fond `bg-primary`, bordure `border-tertiary`, radius 8px, padding 16px
- Ligne 1 : label 12px/400 `text-secondary` + icône à droite (16px, `text-tertiary`)
- Ligne 2 : valeur 26px/500 `text-primary`
- Ligne 3 : delta (↑/↓ + valeur + label) en 12px, vert si positif, rouge si négatif

### Données mock

```json
[
  { "label": "Leads actifs",         "value": "128",        "delta": "+12",    "deltaLabel": "vs sem. précédente", "trend": "up",   "icon": "users" },
  { "label": "Actions du jour",      "value": "18",         "delta": "+4",     "deltaLabel": "vs hier",             "trend": "up",   "icon": "check-circle" },
  { "label": "RDV semaine",          "value": "9",          "delta": "-1",     "deltaLabel": "vs sem. précédente", "trend": "down", "icon": "calendar" },
  { "label": "Mandats en cours",     "value": "17",         "delta": "+3",     "deltaLabel": "vs sem. précédente", "trend": "up",   "icon": "file-text" },
  { "label": "CA pipe pondéré",      "value": "286 450 €",  "delta": "+18%",   "deltaLabel": "vs sem. précédente", "trend": "up",   "icon": "euro" }
]
```

## 5. Colonne gauche — Actions prioritaires

**Bloc principal** (~40% largeur). C'est le bloc le plus regardé, il mérite le plus de place.

### Header bloc

- Titre : "Actions prioritaires" 14px/500
- Actions : icône ⤢ (expand inline, toggle pleine largeur) + icône ⋯ (menu : marquer tout comme vu, trier par…)

### Contenu : liste groupée par urgence

3 groupes, séparés par un sous-header fin :

```
En retard   5
[lignes…]

Aujourd'hui   6
[lignes…]

Cette semaine   7
[lignes…]
```

Sous-header : 12px/500 `text-primary` + compteur 11px `text-secondary` dans un chip gris clair, padding vertical 8px.

### Ligne d'action (très dense)

Chaque ligne = hauteur 52px, padding 8px 12px, hover bg `bg-tertiary`, curseur pointer. Structure :

```
[icône type]   [Label action]                          [chip retard]   [dot prio]  [CTA]   [⋯]
              [Objet concerné – sous-info]
```

- **Icône type** (24px, arrondi 6px, fond pastel selon type) : appel (coral), email (blue), calendar/RDV (purple), location (teal), relance (amber), file (gray)
- **Label** : 13px/500 `text-primary`
- **Sous-info** : 12px/400 `text-secondary`, tronqué (ellipsis)
- **Chip retard** (si applicable) : "En retard 2j", rouge 50/800
- **Dot priorité** : •Haute (rouge) / •Moyenne (amber) / •Basse (gray)
- **CTA inline** : bouton ghost primaire ("Appeler", "Envoyer", "Ouvrir RDV", "Voir RDV", "Voir visite", "Relancer", "Préparer", "Ouvrir")
- **Menu ⋯** : visible au hover. Options : Reporter, Marquer fait, Réassigner, Supprimer

### Données mock (exemples calés sur les maquettes)

```json
[
  { "group": "En retard",
    "items": [
      { "type": "appel", "label": "Relancer Mme Martin", "target": "45 cours de la Liberté, Lyon 3e", "lead_id": "L-004", "retard": "2j", "priority": "haute", "cta": "Appeler" },
      { "type": "email", "label": "Envoyer estimation", "target": "12 rue Péclet, Paris 15e", "lead_id": "L-008", "retard": "1j", "priority": "moyenne", "cta": "Envoyer" },
      { "type": "rdv",   "label": "RDV suivi",            "target": "M. Durand – 8 avenue Suffren", "lead_id": "L-011", "retard": "1j", "priority": "haute", "cta": "Ouvrir RDV" },
      { "type": "appel", "label": "Relancer M. Bernard",  "target": "Appartement – 75015 Paris", "lead_id": "L-019", "retard": "3j", "priority": "moyenne", "cta": "Appeler" },
      { "type": "file",  "label": "Compléter dossier",    "target": "Mme Dupuis – AVR", "dossier_id": "AVR-2025-012", "retard": "5j", "priority": "moyenne", "cta": "Ouvrir" }
    ]
  },
  { "group": "Aujourd'hui",
    "items": [
      { "type": "rdv",      "label": "RDV estimation", "target": "M. Collin – 22 rue du Commerce", "lead_id": "L-023", "heure": "10:00", "priority": "moyenne", "cta": "Voir RDV" },
      { "type": "location", "label": "Visite bien",    "target": "Appartement – 33 rue Lecourbe",  "lead_id": "L-027", "heure": "14:30", "priority": "moyenne", "cta": "Voir visite" },
      { "type": "relance",  "label": "Relance annonce","target": "Signal DVF – 16 rue Blomet",      "signal_id": "SIG-042", "heure": "16:00", "priority": "basse", "cta": "Relancer" },
      { "type": "email",    "label": "Envoyer étude locative", "target": "18 avenue Jean Jaurès, Bordeaux", "lead_id": "L-031", "heure": "17:30", "priority": "moyenne", "cta": "Envoyer" },
      { "type": "appel",    "label": "Appel découverte","target": "M. Moreau – Lead web",            "lead_id": "L-035", "heure": "18:00", "priority": "moyenne", "cta": "Appeler" },
      { "type": "email",    "label": "Relance mail",   "target": "Mme Petit – Investissement",       "lead_id": "L-038", "heure": "18:30", "priority": "basse", "cta": "Relancer" }
    ]
  },
  { "group": "Cette semaine",
    "items": [
      { "type": "rdv",    "label": "Préparer RDV vendeur", "target": "M. Leroy – Appartement Paris 7e", "lead_id": "L-042", "date": "21 mai", "priority": "moyenne", "cta": "Préparer" },
      { "type": "file",   "label": "Suivi dossier",        "target": "Mme Roche – Étude locative",       "dossier_id": "EL-2025-008", "date": "22 mai", "priority": "basse", "cta": "Ouvrir" },
      { "type": "relance","label": "Relance devis",         "target": "M. Nicolas – Estimation",          "lead_id": "L-045", "date": "23 mai", "priority": "moyenne", "cta": "Relancer" }
    ]
  }
]
```

### Footer du bloc

Lien centré : `Voir toutes les actions (32) →`, 13px/400 `text-info`.

## 6. Colonne centre — Agenda du jour + Leads chauds

### 6.1 Agenda du jour

Bloc haut, ~60% de la colonne centre.

**Header** : "Agenda du jour" + ⤢ + ⋯

**Contenu** : liste d'événements, chaque ligne :

```
[heure]   [Titre événement]              [chip statut]
          [sous-info]
```

- Colonne heure : 13px/500 `text-secondary`, width fixe 60px
- Titre : 13px/500
- Sous-info : 12px `text-secondary`
- Chip statut : "Confirmé" (vert 50/800), "À faire" (amber 50/800), "Interne" (gray 50/800)

### Données mock

```json
[
  { "heure": "10:00", "titre": "RDV estimation",  "sousInfo": "M. Collin – 22 rue du Commerce", "statut": "Confirmé", "lead_id": "L-023" },
  { "heure": "11:30", "titre": "Appel découverte","sousInfo": "Mme Martin – Lead web",          "statut": "À faire",  "lead_id": "L-004" },
  { "heure": "14:30", "titre": "Visite bien",     "sousInfo": "Appartement – 33 rue Lecourbe",  "statut": "Confirmé", "lead_id": "L-027" },
  { "heure": "16:00", "titre": "RDV suivi",       "sousInfo": "M. Durand – 8 avenue Suffren",   "statut": "À faire",  "lead_id": "L-011" },
  { "heure": "17:30", "titre": "Point équipe",    "sousInfo": "Réunion interne",                "statut": "Interne" }
]
```

**Footer** : lien `Voir tout l'agenda →` (redirige vers vue agenda semaine, pas en V1).

### 6.2 Leads chauds

Bloc bas, ~40% de la colonne centre.

**Header** : "Leads chauds" + ⋯

**Contenu** : tableau compact 5 colonnes (Lead/Bien, Estimation, Prochaine action, Priorité), sans header de table visible, lignes simples.

Chaque ligne :
- **Avatar initiales** (2 lettres) + nom 13px/500 + sous-info 12px `text-secondary`
- **Estimation** : 13px/500 `text-primary` (ex: "1 025 000 €")
- **Prochaine action** : 13px/500 + sous-info date (ex: "RDV suivi" + "Aujourd'hui" ou "En retard (2 j)")
- **Priorité** : dot + label ("Haute", "Moyenne")
- Ligne entière cliquable → ouvre drawer lead

### Données mock

```json
[
  { "lead_id": "L-011", "initiales": "MD", "nom": "M. Durand",     "sousInfo": "8 avenue Suffren",           "estimation": "1 025 000 €", "nextAction": "RDV suivi",           "nextDate": "Aujourd'hui",     "priority": "haute" },
  { "lead_id": "L-004", "initiales": "MM", "nom": "Mme Martin",    "sousInfo": "45 cours Liberté",            "estimation": "620 000 €",   "nextAction": "Relance appel",       "nextDate": "En retard (2 j)", "priority": "haute" },
  { "lead_id": "L-023", "initiales": "MC", "nom": "M. Collin",     "sousInfo": "22 rue du Commerce",          "estimation": "1 150 000 €", "nextAction": "RDV estimation",      "nextDate": "Aujourd'hui",     "priority": "haute" },
  { "lead_id": "L-035", "initiales": "AL", "nom": "Audrey Leroy",  "sousInfo": "Lead web",                    "estimation": "—",           "nextAction": "Appel découverte",    "nextDate": "Aujourd'hui",     "priority": "moyenne" },
  { "lead_id": "L-047", "initiales": "NB", "nom": "Nicolas Bernard","sousInfo": "16 rue Blomet",              "estimation": "890 000 €",   "nextAction": "Envoyer étude",       "nextDate": "Demain",          "priority": "moyenne" }
]
```

**Footer** : lien `Voir tous les leads chauds →`.

## 7. Colonne droite — Entrants / Signaux / Pipe / Dossiers / Mandats

5 blocs empilés, chacun compact (80–180px de haut), séparés par 16px.

### 7.1 Entrants récents

**Header** : "Entrants récents" + ⋯

**Contenu** : liste 4–6 items, chaque ligne :
- Avatar initiales (petit, 32px)
- Nom 13px/500 + bien/type 12px `text-secondary`
- À droite : "Il y a Xh" 12px `text-tertiary`

### Données mock

```json
[
  { "lead_id": "L-050", "initiales": "LT", "nom": "Lucas Thomas",    "sousInfo": "Appartement – Paris 15e",    "time": "Il y a 1 h" },
  { "lead_id": "L-051", "initiales": "CG", "nom": "Camille Girard",  "sousInfo": "Maison – Boulogne (92)",     "time": "Il y a 2 h" },
  { "lead_id": "L-052", "initiales": "JM", "nom": "Jean Moreau",     "sousInfo": "Investissement – Lyon 3e",   "time": "Il y a 4 h" },
  { "lead_id": "L-053", "initiales": "AP", "nom": "Aline Perrin",    "sousInfo": "Appartement – Bordeaux",     "time": "Il y a 6 h" },
  { "lead_id": "L-054", "initiales": "FB", "nom": "Florian Brun",    "sousInfo": "Appartement – Nantes",       "time": "Il y a 8 h" }
]
```

**Footer** : `Voir tous les entrants →`.

### 7.2 Signaux à traiter

Alimenté par la couche Prospection (signaux DVF/DPE/annonces des zones suivies, pas encore convertis en lead/action).

**Header** : "Signaux à traiter" + ⋯

**Contenu** : liste, chaque ligne :
- Tag type (3 lettres, couleur) : `DVF` (blue), `DPE` (green), `ANN` (purple)
- Titre du signal 13px/500
- Localisation 12px `text-secondary`
- "Il y a Xh" à droite

### Données mock

```json
[
  { "type": "DVF", "titre": "Vente proche – 12 rue Péclet",    "loc": "Paris 15e – Appartement", "time": "Il y a 2 h", "signal_id": "SIG-101" },
  { "type": "DPE", "titre": "DPE F → G – 18 rue Blomet",        "loc": "Paris 15e – Appartement", "time": "Il y a 3 h", "signal_id": "SIG-102" },
  { "type": "ANN", "titre": "Annonce publiée – 22 rue Lecourbe","loc": "Paris 15e – Appartement", "time": "Il y a 5 h", "signal_id": "SIG-103" }
]
```

**Footer** : `Voir tous les signaux →` (redirige vers `/app/prospection/radar`).

### 7.3 Synthèse pipe

Visualisation compacte du pipeline commercial.

**Header** : "Synthèse pipe" + à droite `Total pondéré` 12px `text-secondary` + valeur 15px/500 `text-primary` (286 450 €)

**Contenu** : barre horizontale segmentée (hauteur 8px, radius 4px), 6 segments aux proportions des valeurs par stage. Chaque segment d'une couleur du pipeline :

| Stage | Couleur | Valeur pondérée (mock) |
|---|---|---|
| À traiter | gray 200 | 38 650 € |
| Qualifié | blue 400 | 71 200 € |
| Estimation | teal 400 | 54 300 € |
| Mandat | purple 400 | 68 900 € |
| Négociation | amber 400 | 33 400 € |
| Signé | green 500 | 19 000 € |

Sous la barre : légende compacte en flex-wrap (4 colonnes sur 2 rangs), chaque item = dot couleur + label 11px + valeur 12px/500.

**Footer** : lien `Ouvrir les leads →` (redirige vers `/app/activite/leads` en vue kanban).

### 7.4 Dossiers en cours

Synthèse des livrables (avis de valeur, études locatives, dossiers invest) en draft ou envoyés sans retour.

**Header** : "Dossiers en cours" + ⋯

**Contenu** : grille 3 colonnes, chaque colonne = 1 type :

```
Avis de valeur    Études locatives    Investissement
    12                   8                   5
6 en brouillon       4 en brouillon       3 en brouillon
6 envoyés            4 en attente         2 envoyés
```

Chaque colonne cliquable → redirige vers `/app/estimation/avis-valeur`, `/app/estimation/etude-locative`, `/app/investissement/dossiers`.

**Footer** : `Voir tous les dossiers →`.

### 7.5 Mandats à échéance

Bloc crucial métier (souvent absent des CRM immo concurrents).

**Header** : "Mandats à échéance" + ⋯

**Contenu** : liste 3–5 mandats les plus proches d'expirer, chaque ligne :
- Type mandat en 12px/500 + adresse bien 13px/500
- À droite : date expiration + chip `J-X` (rouge si <15j, amber si 15–30j, gray si >30j)

### Données mock

```json
[
  { "type": "Mandat exclusif", "adresse": "45 cours de la Liberté, Lyon 3e", "expireLe": "31 mai 2025", "jours": 12, "mandat_id": "M-2025-017" },
  { "type": "Mandat simple",   "adresse": "8 avenue Suffren, Paris 15e",      "expireLe": "15 juin 2025","jours": 27, "mandat_id": "M-2025-014" },
  { "type": "Mandat simple",   "adresse": "22 rue du Commerce, Paris 15e",    "expireLe": "30 juin 2025","jours": 42, "mandat_id": "M-2025-011" }
]
```

**Footer** : `Voir tous les mandats →`.

## 8. États

### Empty states (par bloc)

- **Actions prioritaires vides** : illustration légère + "Aucune action prévue. Profitez-en pour prospecter."
- **Agenda vide** : "Pas de RDV aujourd'hui. [Bouton : Créer un RDV]"
- **Leads chauds vide** : "Aucun lead identifié comme chaud. Marquez un lead en priorité haute depuis le pipeline."
- **Entrants vide** : "Aucun nouvel entrant. Vérifiez votre widget."
- **Signaux vide** : "Aucun signal en attente."
- **Dossiers vide** : "Aucun dossier en cours."
- **Mandats vide** : "Aucun mandat à échéance proche."

### Loading state

Skeleton rectangulaire par bloc (pas de shimmer, juste `bg-tertiary` fixe). Durée affichée avant mock = 250ms pour simuler.

### Expand inline (icône ⤢)

Clic sur ⤢ d'un bloc → le bloc prend toute la largeur de la zone principale (collapse les 2 autres colonnes vers le bas en liste empilée). Icône devient ⤡ (minimize). Re-clic → retour au layout 3 colonnes.

**Comportement non fonctionnel en V1 statique : afficher un cursor pointer + tooltip "Agrandir", pas d'action.**

## 9. Interconnexions (obligatoires)

Chaque ligne des blocs a une destination :

| Source | Clic → |
|---|---|
| KPI "Leads actifs" | `/app/activite/leads` |
| KPI "Mandats en cours" | `/app/activite/leads?stage=mandat` |
| KPI "CA pipe pondéré" | `/app/activite/performance` (couche business) |
| Ligne Actions prioritaires | drawer contextuel objet lié (lead ou dossier) |
| Ligne Agenda | drawer RDV |
| Ligne Leads chauds | drawer lead |
| Ligne Entrants récents | drawer lead |
| Ligne Signaux | drawer signal ou redirect Prospection |
| Synthèse pipe (clic segment) | `/app/activite/leads?stage=[stage]` |
| Bloc Dossiers (clic colonne) | `/app/estimation/…` ou `/app/investissement/dossiers` |
| Ligne Mandats | drawer bien/mandat |

## 10. Données mock consolidées

Les mocks sont à stocker dans `/webapp/app/data/mocks/pilotage.json` (ou équivalent selon structure existante). Fichier unique contenant tous les blocs en clés (`kpi`, `actions`, `agenda`, `leadsChauds`, `entrants`, `signaux`, `pipe`, `dossiers`, `mandats`).

## 11. Notes d'implémentation

- **Stack** : suivre le setup existant (voir `.claude` et `webapp/` de la base de code). Pas d'API, tout en JSON statique.
- **Design system** : utiliser les tokens définis dans `01_DESIGN_SYSTEM.md` (violet Propsight primaire, bordures 0.5px, radius 8px blocs / 6px chips).
- **Header/Sidebar** : ne pas les redéfinir, les réutiliser depuis `02_LAYOUT_PRO.md`.
- **Drawer contextuel** : pour les clics sur lignes, réutiliser le composant Drawer générique (voir layout pro). Les drawers spécifiques (lead, signal, mandat) seront détaillés dans leurs MD respectifs. En V1 statique, un drawer minimal avec titre + close suffit, le contenu complet viendra avec le MD 31.
- **Icônes** : Lucide React (phosphor en backup) — stick à `users`, `check-circle`, `calendar`, `file-text`, `euro`, `phone`, `mail`, `map-pin`, `rotate-cw`, `folder`, `chevron-right`, `more-horizontal`, `maximize-2`.
- **Typo** : Inter ou équivalent sans-serif système, weights 400/500 uniquement (jamais 600+).
- **Dark mode** : pas prioritaire V1, mais utiliser variables CSS si existantes pour ne pas hardcoder.
- **Accessibilité** : chaque ligne d'action doit être accessible clavier (tab → enter = CTA). ⋯ en focus visible.
