# 32 — Performance

**Route** : `/app/activite/performance`
**Sidebar** : Mon activité → Performance (actif)
**Persona V1** : Agent immobilier

## 1. Intention produit

**Analytique personnelle de l'agent.** Répond à deux questions complémentaires :

1. **"Qu'est-ce qui marche ?"** → opérationnel (volumes, taux de conversion, sources)
2. **"Combien je peux faire ?"** → business + potentiel marché (CA, mandats, écart au potentiel)

Ce n'est pas l'analytique équipe (celle-ci vit dans `/app/equipe/performance`). C'est une vue centrée sur l'agent connecté, avec possibilité de comparaison (période précédente / objectif / équipe).

**Différenciation** : aucun CRM immo concurrent ne propose aujourd'hui la couche "Marché & potentiel" avec hypothèses personnalisables. C'est l'axe fort qui justifie l'abonnement Pro.

## 2. Layout global

Desktop-first 1440–1600px. Scroll vertical assumé (3 couches empilées, chacune faisant ~600–700px de haut). La page scrolle, pas les blocs internes.

```
┌─────────────────────────────────────────────────────────────────┐
│  Header Pro                                                      │
├──────┬──────────────────────────────────────────────────────────┤
│      │  Titre + sous-titre                                       │
│  S   │  [7j] [30j] [Trim] [12m] [Custom]   Comparer : [≡]        │
│  I   │                                      [Définir objectifs]  │
│  D   │                                                           │
│  E   │  ▼ 1. Performance opérationnelle                         │
│  B   │  [7 KPI en ligne]                                        │
│  A   │  [Pipeline par étape] [Activité perso] [Sources]         │
│  R   │                                                           │
│      │  ▼ 2. Performance business                               │
│      │  [6 KPI en ligne]                                        │
│      │  [CA par mois] [Répartition CA ×2] [Top dossiers]        │
│      │                                                           │
│      │  ▼ 3. Marché & potentiel                                 │
│      │  [Zone selector] [Indicateurs marché] [Marché adressable]│
│      │  [Part captée] [Potentiel CA] [Écart au potentiel]       │
│      │  [Hypothèses modifiables inline]                         │
└──────┴──────────────────────────────────────────────────────────┘
```

Chaque couche = un **container** avec bordure `border-tertiary`, radius 8px, padding 20px, titre de couche 14px/500 en haut-gauche. Couches séparées par 16px.

## 3. Header de page

```
Performance
Mes résultats, mon pipe et mon potentiel de marché.
```

- Titre H1 24px/500
- Sous-titre 13px `text-secondary`

### Barre de contrôles

3 groupes sur la même ligne :

**Groupe gauche — sélecteur de période** (segmented control) :
```
[7j] [30j] [Trimestre] [12 mois] [Personnalisé 📅]
```
Actif = fond `bg-secondary`, inactif transparent. Par défaut : 30j.

**Groupe centre — comparaison** :
```
Comparer :  [● vs période précédente]  [○ vs objectif]  [○ vs équipe]
```
Chips toggles, une seule active à la fois. Par défaut : "vs période précédente".

**Groupe droite — objectifs** :
```
[⚙ Définir mes objectifs]
```
Bouton ghost secondaire. Ouvre un modal/drawer de configuration des objectifs (CA annuel, mandats, etc.). En V1 : modal affichant un formulaire sans soumission réelle.

## 4. Couche 1 — Performance opérationnelle

### 4.1 Header de couche

```
1. Performance opérationnelle
```
14px/500 `text-primary`, marge bottom 16px.

### 4.2 Bandeau KPI (7 tiles)

Grille 7 colonnes égales, gap 12px. Chaque tile :
- Label 12px/400 `text-secondary`
- Valeur 22px/500 `text-primary`
- Delta : icône ↑/↓ + valeur + `pts` (pour les taux) ou valeur absolue, vert/rouge
- Sous-delta 11px `text-secondary` : "vs 98 précédemment" par exemple

### Données mock

```json
[
  { "label": "Leads entrants",          "value": "128",  "delta": "+12%",  "trend": "up",   "compare": "vs 98 précédemment" },
  { "label": "Taux de qualif",          "value": "42 %", "delta": "+4 pts","trend": "up",   "compare": "vs 38% précédemment" },
  { "label": "Taux RDV",                "value": "29 %", "delta": "+3 pts","trend": "up",   "compare": "vs 26% précédemment" },
  { "label": "Taux mandat",             "value": "21 %", "delta": "+2 pts","trend": "up",   "compare": "vs 19% précédemment" },
  { "label": "Taux transfo",            "value": "16 %", "delta": "+2 pts","trend": "up",   "compare": "vs 14% précédemment" },
  { "label": "Délai lead → mandat",     "value": "18 j", "delta": "-2 j",  "trend": "up",   "compare": "vs 16 j précédemment" },
  { "label": "Délai mandat → signature","value": "46 j", "delta": "-4 j",  "trend": "up",   "compare": "vs 42 j précédemment" }
]
```

Note : pour les KPI de délai, la trend est "up" (bon) quand la valeur **diminue** — couleur verte. Attention à l'inversion dans l'affichage.

### 4.3 Pipeline par étape

Bloc ~50% largeur. Visualisation horizontale des 6 stages du pipeline, volumes et taux.

**Structure** : 6 cartes en ligne, chacune = un stage, même code couleur que kanban Leads (voir MD 31).

```
┌───────┬───────┬───────┬───────┬───────┬───────┐
│À trai.│ Qual. │ Esti. │ Mand. │ Nego. │ Signé │
│       │       │       │       │       │       │
│  128  │  54   │  37   │  27   │  21   │  17   │
│ 100%  │  42%  │  29%  │  21%  │  16%  │  13%  │
│       │↓ 4pts │↑ 3pts │↑ 2pts │↑ 2pts │↑ 2pts │
└───────┴───────┴───────┴───────┴───────┴───────┘
```

- Header de carte = nom stage + couleur accent pleine (ex: violet pour Négociation)
- Ligne 1 : volume absolu 26px/500
- Ligne 2 : taux de passage depuis l'entrée du pipe 12px `text-secondary`
- Ligne 3 : delta vs période précédente

**Clic carte** → redirige vers `/app/activite/leads?stage=[stage]&period=…` (pré-filtré).

**Footer bloc** : lien `Voir le détail du pipe →` (ouvre vue détaillée avec conversion entre chaque étape).

### Données mock pipeline

```json
[
  { "stage": "atraiter",   "label": "À traiter",    "volume": 128, "taux": 100, "delta": null,  "deltaLabel": null },
  { "stage": "qualifie",   "label": "Qualifié",     "volume": 54,  "taux": 42,  "delta": -4,    "deltaLabel": "pts" },
  { "stage": "estimation", "label": "Estimation",   "volume": 37,  "taux": 29,  "delta": 3,     "deltaLabel": "pts" },
  { "stage": "mandat",     "label": "Mandat",       "volume": 27,  "taux": 21,  "delta": 2,     "deltaLabel": "pts" },
  { "stage": "negociation","label": "Négociation",  "volume": 21,  "taux": 16,  "delta": 2,     "deltaLabel": "pts" },
  { "stage": "signe",      "label": "Signé",        "volume": 17,  "taux": 13,  "delta": 2,     "deltaLabel": "pts" }
]
```

### 4.4 Activité personnelle

Bloc ~30% largeur. Histogramme empilé par jour, ventilé par type d'action.

**Axe X** : jours de la période (7 derniers jours : 19 mai → 25 mai).
**Axe Y** : nombre d'actions (0 à ~40).

**Légende en haut** : 5 chips couleurs horizontaux (Appels, Emails, RDV, Visites, Relances). Chaque couleur distincte.

**Cadrage éthique** : ce bloc est un **diagnostic personnel**, pas un compteur pour le manager. Message implicite : "tu fais X actions/jour". Pas de comparaison directe obligatoire.

### Données mock

```json
{
  "types": [
    { "id": "appel",   "label": "Appels",   "color": "coral"  },
    { "id": "email",   "label": "Emails",   "color": "blue"   },
    { "id": "rdv",     "label": "RDV",      "color": "purple" },
    { "id": "visite",  "label": "Visites",  "color": "teal"   },
    { "id": "relance", "label": "Relances", "color": "amber"  }
  ],
  "days": [
    { "date": "19 mai", "appel": 8,  "email": 12, "rdv": 3, "visite": 2, "relance": 4 },
    { "date": "20 mai", "appel": 6,  "email": 10, "rdv": 2, "visite": 1, "relance": 3 },
    { "date": "21 mai", "appel": 10, "email": 14, "rdv": 4, "visite": 3, "relance": 5 },
    { "date": "22 mai", "appel": 9,  "email": 11, "rdv": 3, "visite": 2, "relance": 4 },
    { "date": "23 mai", "appel": 11, "email": 13, "rdv": 5, "visite": 3, "relance": 6 },
    { "date": "24 mai", "appel": 7,  "email": 9,  "rdv": 2, "visite": 1, "relance": 3 },
    { "date": "25 mai", "appel": 8,  "email": 10, "rdv": 3, "visite": 2, "relance": 4 }
  ]
}
```

**Footer** : lien `Voir le détail des activités →`.

### 4.5 Sources

Bloc ~35% largeur. Table compacte 5 colonnes : Source · Leads · Taux conv. · CA généré · Délai moyen.

| Source | Leads | Taux conv. | CA généré | Délai moyen |
|---|---|---|---|---|
| Portails | 54 | 24 % | 426 800 € | 21 j |
| Réseau / Apporteur | 18 | 33 % | 297 600 € | 16 j |
| Site internet | 15 | 20 % | 168 300 € | 18 j |
| Réseaux sociaux | 12 | 17 % | 132 400 € | 20 j |
| Ancien client | 9 | 44 % | 238 900 € | 14 j |
| Autres | 20 | 15 % | 120 600 € | 23 j |

Chaque ligne cliquable → `/app/activite/leads?source=…`.

**Footer** : lien `Voir toutes les sources →`.

## 5. Couche 2 — Performance business

### 5.1 Header

```
2. Performance business
```

### 5.2 Bandeau KPI (6 tiles)

```json
[
  { "label": "CA réalisé",              "value": "368 450 €", "delta": "+18%",  "trend": "up",   "compare": "vs 312 350 €" },
  { "label": "CA pipe pondéré",         "value": "286 450 €", "delta": "+18%",  "trend": "up",   "compare": "vs 242 800 €" },
  { "label": "Mandats signés",          "value": "17",        "delta": "+3",    "trend": "up",   "compare": "vs 14" },
  { "label": "Panier moyen",            "value": "24 585 €",  "delta": "+7%",   "trend": "up",   "compare": "vs 22 980 €" },
  { "label": "Délai moyen transaction", "value": "64 j",      "delta": "-4 j",  "trend": "up",   "compare": "vs 68 j" },
  { "label": "Taux fidélisation / rachat","value": "32 %",    "delta": "+6 pts","trend": "up",   "compare": "vs 26%" }
]
```

### 5.3 CA par mois

Bloc ~45% largeur. Graphe barres verticales des 12 derniers mois.

- Axe X : Jan, Fév, Mar, Avr, Mai (en cours), Jun, Jul, Aoû, Sep, Oct, Nov, Déc
- Axe Y : CA réalisé en €
- Ligne horizontale pointillée = objectif mensuel (configurable via "Définir mes objectifs")
- Légende haut-droite : `● CA réalisé  --- Objectif`

### Données mock

```json
{
  "objectifMensuel": 300000,
  "months": [
    { "label": "Jan", "ca": 215000 },
    { "label": "Fév", "ca": 248000 },
    { "label": "Mar", "ca": 322000 },
    { "label": "Avr", "ca": 298000 },
    { "label": "Mai", "ca": 368450, "current": true },
    { "label": "Jun", "ca": 0 },
    { "label": "Jul", "ca": 0 },
    { "label": "Aoû", "ca": 0 },
    { "label": "Sep", "ca": 0 },
    { "label": "Oct", "ca": 0 },
    { "label": "Nov", "ca": 0 },
    { "label": "Déc", "ca": 0 }
  ]
}
```

**Footer** : lien `Voir le détail mensuel →`.

### 5.4 Répartition CA

Bloc ~30% largeur. 2 mini-donuts côte à côte.

**Donut 1 — Par type de mandat** :
- Exclusif : 62 % (violet foncé)
- Simple : 25 % (violet clair)
- Co-mandat : 13 % (violet très clair)

**Donut 2 — Par nature** :
- Vente : 68 % (teal)
- Achat : 20 % (blue)
- Locatif : 12 % (amber)

Chaque donut : valeur centrale = CA total affiché au centre (ex: `368,5 k€ Total`).

### Données mock

```json
{
  "parTypeMandat": [
    { "label": "Exclusif",   "value": 228439, "percent": 62 },
    { "label": "Simple",     "value": 92113,  "percent": 25 },
    { "label": "Co-mandat",  "value": 47898,  "percent": 13 }
  ],
  "parNature": [
    { "label": "Vente",   "value": 250546, "percent": 68 },
    { "label": "Achat",   "value": 73690,  "percent": 20 },
    { "label": "Locatif", "value": 44214,  "percent": 12 }
  ]
}
```

**Footer** : lien `Voir toutes les répartitions →`.

### 5.5 Top dossiers en cours

Bloc ~30% largeur. Table compacte 5 colonnes : Dossier · Type · Probabilité · CA pondéré · Échéance.

| Dossier | Type | Probabilité | CA pondéré | Échéance |
|---|---|---|---|---|
| Lucas Thomas | Vente | 90 % | 86 500 € | 31 mai |
| Camille Girard | Vente | 80 % | 64 200 € | 12 juin |
| Jean Moreau | Vente | 75 % | 53 800 € | 18 juin |
| Aline Perrin | Achat | 70 % | 41 600 € | 25 juin |
| Florian Brun | Vente | 65 % | 40 900 € | 2 juil. |

Chaque ligne cliquable → drawer du dossier.

**Footer** : lien `Voir tous les dossiers →`.

## 6. Couche 3 — Marché & potentiel (différenciation)

### 6.1 Header

```
3. Marché & potentiel
```

### 6.2 Zone selector (local)

Bloc à gauche ~20% largeur.

```
Zone suivie
┌──────────────────────────────┐
│ 📍 Paris 15e • Vaugirard /   │
│    Necker             [▼]    │
└──────────────────────────────┘
Périmètre : 980 transactions DVF
(12 mois)

Voir sur la carte →
```

- Dropdown avec liste des zones suivies par l'agent (default = zones dans `/app/veille/*`, override possible sans impact ailleurs)
- Affichage : nom de la zone + sous-détail (quartier, arrondissement)
- Sous-info : nombre de transactions DVF sur 12 mois (= périmètre)
- Lien `Voir sur la carte` → redirige vers `/app/biens/dvf?zone=…`

### 6.3 Indicateurs marché

Bloc ~18% largeur. 3 mini-KPI verticaux :

```
Indicateurs marché (12 derniers mois)

Volume DVF secteur
980            ↑ 6%
vs 922

Prix médian
8 210 €/m²     ↑ 3%
vs 7 980 €/m²

Tension marché
Élevée         ● vs modérée
```

### Données mock

```json
{
  "volumeDvf": { "value": 980, "delta": "+6%", "compare": 922 },
  "prixMedian": { "value": "8 210", "unite": "€/m²", "delta": "+3%", "compare": "7 980" },
  "tension": { "value": "Élevée", "delta": "vs modérée" }
}
```

### 6.4 Marché adressable / Part captée / Potentiel / Écart

4 tiles alignés, chacun ~15% largeur.

#### Tile 1 — Marché adressable

```
Marché adressable (estimation annuelle)

3 360 000 €

Volume DVF   Panier moyen   Commission moy.
   980         420 000 €         2,6 %
```

- Valeur principale en 28px/500 `text-primary`
- Formule explicite en ligne de sous-infos : `Volume × Panier × Commission`
- Icône info (ⓘ) à droite au hover → tooltip détaillant le calcul

#### Tile 2 — Part de marché captée

```
Part de marché captée

0,87 %

↑ 0,12 pt
vs 0,75 %
```

- Valeur en 28px/500
- Explication au hover : `Mes mandats signés zone / Total transactions zone`

#### Tile 3 — Potentiel CA cible

```
Potentiel CA cible

84 000 €

à 2,5 % de part de marché
```

- Valeur en violet Propsight 28px/500
- Sous-ligne : rappel de l'hypothèse utilisée

#### Tile 4 — Écart au potentiel

**C'est LE chiffre qui doit taper à l'œil**. Affichage plus visible que les 3 autres.

```
Écart au potentiel

Si vous captiez 2,5% du marché,

vous auriez   +84 000 €

de CA annuel
```

- "vous auriez" en 14px `text-primary`
- `+84 000 €` en 32px/500, couleur violet Propsight, fond très léger violet 50
- Sous-ligne "de CA annuel" en 13px

### 6.5 Hypothèses personnalisables (inline modifiables)

**C'est l'interaction-clé de cette couche.** Chaque chiffre est un input inline avec icône crayon.

```
Hypothèses personnalisables

┌──────────────────────────────────┐  ┌──────────────────────────────────┐  ┌──────────────────────────────────┐
│ % commission moyenne             │  │ % part captable cible            │  │ Objectif mandats / an            │
│                                  │  │                                  │  │                                  │
│ 2,60 %  ✎                        │  │ 2,50 %  ✎                        │  │ 28  ✎                            │
└──────────────────────────────────┘  └──────────────────────────────────┘  └──────────────────────────────────┘
```

- Chaque tile : label en haut 12px `text-secondary`, valeur en 20px/500, icône crayon à droite.
- Clic icône crayon → passe en mode édition (input number + sauvegarder/annuler).
- Modification → **recalcul live** des 4 tiles (6.4) + du chiffre "Écart au potentiel".
- Stocké user global, surchargeable par zone en V2.

### Données mock

```json
{
  "hypotheses": {
    "commissionMoyenne": 2.60,
    "partCaptableCible": 2.50,
    "objectifMandatsAnnuel": 28
  }
}
```

### Footer couche 3

```
Plus de détails marché dans l'Observatoire →
Voir l'analyse complète →
```

- Lien 1 : redirige `/app/observatoire/marche?zone=…`
- Lien 2 : ouvre modal détaillé (V2)

## 7. États

### Empty states

- **Pas assez de données (< 5 leads)** : "Pas encore assez de données pour afficher des indicateurs fiables. Revenez après avoir traité quelques leads." (placeholder sur chaque KPI)
- **Zone non configurée** : "Aucune zone suivie. [CTA] Définir une zone dans Veille."
- **Comparaison vs équipe mais pas d'équipe** : "Vous n'avez pas encore d'équipe configurée. [CTA] Inviter des membres."

### Loading

Skeleton par bloc. Graphes = barres grises fixes.

### Comparaison active

Quand "vs période précédente" active : tous les KPI affichent leur delta + label "vs … précédemment".
Quand "vs objectif" : les KPI comparent à l'objectif défini (affichage "82 % de votre objectif").
Quand "vs équipe" : comparaison à la médiane équipe (affichage "+12 pts vs médiane équipe").

## 8. Interconnexions

| Élément | Clic → |
|---|---|
| KPI "Leads entrants" | `/app/activite/leads?period=…` |
| Pipeline par étape (carte stage) | `/app/activite/leads?stage=…&period=…` |
| Activité personnelle (barre jour) | détail actions du jour (modal) |
| Sources (ligne) | `/app/activite/leads?source=…` |
| CA par mois (barre) | détail transactions du mois (modal) |
| Top dossiers (ligne) | drawer dossier |
| Zone selector | change zone locale (pas impact ailleurs) |
| "Voir sur la carte" | `/app/biens/dvf?zone=…` |
| Indicateurs marché (tile) | `/app/observatoire/marche?zone=…` |
| "Plus de détails marché dans l'Observatoire" | `/app/observatoire/marche` |
| "Définir mes objectifs" | modal paramètres objectifs |

## 9. Données mock consolidées

Fichier `/webapp/app/data/mocks/performance.json` avec structure :

```json
{
  "period": { "from": "2025-04-25", "to": "2025-05-25", "label": "30j" },
  "comparison": "period",
  "operational": {
    "kpi": [ /* 7 tiles */ ],
    "pipeline": [ /* 6 stages */ ],
    "activity": { /* types + days */ },
    "sources": [ /* rows */ ]
  },
  "business": {
    "kpi": [ /* 6 tiles */ ],
    "caParMois": { /* 12 months */ },
    "repartitionCA": { /* 2 donuts */ },
    "topDossiers": [ /* 5 rows */ ]
  },
  "marche": {
    "zone": { /* zone selectionnée */ },
    "indicateurs": { /* volume, prix, tension */ },
    "marcheAdressable": 3360000,
    "partCaptee": 0.87,
    "potentielCible": 84000,
    "ecartAuPotentiel": 84000,
    "hypotheses": {
      "commissionMoyenne": 2.60,
      "partCaptableCible": 2.50,
      "objectifMandatsAnnuel": 28
    }
  }
}
```

## 10. Notes d'implémentation

- **Stack charts** : Recharts ou Chart.js (aligné sur setup existant). Pour les donuts, soit Recharts `PieChart`, soit SVG inline custom (plus léger pour des cas simples).
- **Barres histogramme empilé** : Recharts `BarChart` + `Bar` stackId.
- **KPI tiles** : composant réutilisable `<KpiTile label value delta trend compare />` — même composant que Pilotage.
- **Hypothèses inline** : state local, recalcul déclenché par onChange. Débounce 150ms pour éviter flicker pendant saisie.
- **Recalculs live** (formules V1 statique) :
  - `marcheAdressable = volumeDVF × panierMoyen × commissionMoyenne`
  - `potentielCible = marcheAdressable × partCaptableCible`
  - `ecartAuPotentiel = potentielCible - CARealiseAnnualise` (ou différence simple)
- **Sélecteur période** : sync dans URL query param `?period=30d`.
- **Couches collapsibles** : icône ▼ dans le header de couche, permet de replier une couche entière (utile sur écran 1440).
- **Comparaison "vs équipe"** : V1 afficher avec données mock équipe plausibles, flag "mock" en tooltip si besoin.
- **Écart au potentiel** : c'est le KPI psychologique de la page. Toujours le rendre **visible au premier coup d'œil**, même sur scroll (envisager sticky V2, V1 : gros bloc visuel en couleur violet Propsight).
- **Accessibilité charts** : tous les charts doivent avoir un alt text ou une version tableau accessible en dessous.
