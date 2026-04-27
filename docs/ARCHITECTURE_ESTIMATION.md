# Propsight — Architecture du module Estimation

**Document de travail — v1.0**
Date : 22 avril 2026
Destinataires : produit, équipe ML, équipe dev
Objectif : figer l'architecture du module Estimation avant production des maquettes (deadline vendredi 14h) et début du dev (27 avril → 31 juillet).

---

## 0. Principes transverses

Ces principes s'appliquent au module Estimation mais doivent être considérés comme des règles Propsight générales.

### 0.1. Pipeline commercial unique

Tout suivi commercial (statuts, relances, conversion, pipeline) vit dans le module Leads / Pilotage commercial. Les autres modules (Estimation, Prospection, Investissement, Veille, Observatoire) sont des **outils de production** qui créent ou enrichissent des leads mais ne dupliquent jamais le pipeline commercial.

Conséquence pratique : aucun module produit n'affiche de Kanban ni de statut de relance autonome. À la place, chaque page d'accueil de module affiche un lien contextuel vers le Kanban filtré sur sa source (ex : "→ 4 leads issus d'avis de valeur à relancer").

### 0.2. Interconnexion transverse

Tous les modules sont reliés par un graphe d'objets partagés. Depuis n'importe quel bien on peut : estimer, analyser en invest, suivre, créer une action, créer un lead, voir le contexte local. Chaque fiche objet affiche ses liens vers les autres modules. La timeline est unifiée par objet.

### 0.3. Template rapport mutualisé

Avis de valeur, Étude locative et Dossier investissement partagent le même moteur de rendu (blocs modulaires). Blocs par défaut différents selon le type de rapport, mais infrastructure commune : drag-reorder, toggle de visibilité, édition inline, preview live, export PDF branded.

### 0.4. V1 complète par défaut, customisable

Tous les blocs/features sont activés par défaut en V1. L'agent peut désactiver des sections via un panneau latéral droit (pattern Yanport Agent 360). La customisation se fait à deux niveaux :
- **Organisation** : template par défaut de l'agence (Paramètres > Organisation > Templates)
- **Document individuel** : override au niveau d'un rapport spécifique

### 0.5. Stock par sous-module, pas de mélange

Chaque sous-module a sa propre liste d'objets persistants, ses propres filtres, ses propres KPI. Pas de liste mixte. La navigation entre sous-modules se fait par la sidebar (onglets séparés).

### 0.6. Création multi-entrée

4 points d'entrée systématiques pour créer un objet (estimation / avis / étude) :
- Depuis une annonce (URL)
- Saisie manuelle
- Depuis un bien du portefeuille
- Depuis une estimation existante

Le mode "prioritaire" (action par défaut du split button) varie selon le sous-module.

---

## 1. Structure du module

### 1.1. URLs

```
/app/estimation/rapide              → Estimation rapide (liste + créer)
/app/estimation/rapide/[id]         → Détail d'une estimation rapide

/app/estimation/avis-valeur         → Avis de valeur (liste + créer)
/app/estimation/avis-valeur/[id]    → Édition d'un avis de valeur

/app/estimation/etude-locative      → Étude locative (liste + créer)
/app/estimation/etude-locative/[id] → Édition d'une étude locative
```

Routes contextuelles (modales avec URL partageable) déjà définies dans le contexte général :
- `?analyse=[bien_id]` : modal analyse bien (7 tabs)
- `?comparatif=[id1,id2,id3]` : modal comparatif

### 1.2. Sidebar (rappel, figée)

```
5. Estimation
   • Estimation rapide         /app/estimation/rapide
   • Avis de valeur            /app/estimation/avis-valeur
   • Étude locative            /app/estimation/etude-locative
```

### 1.3. Matrice des points d'entrée par sous-module

| Mode de création | Estimation rapide | Avis de valeur | Étude locative |
|---|---|---|---|
| Depuis une annonce (URL) | **prioritaire** | disponible | **prioritaire** |
| Saisie manuelle | disponible | disponible | disponible |
| Depuis un bien portefeuille | disponible | disponible | disponible |
| Depuis une estimation existante | — | **prioritaire** | disponible |

---

## 2. Objet Estimation (modèle de données)

### 2.1. Schéma d'entité

```yaml
Estimation:
  id: uuid
  organization_id: uuid
  created_by: user_id
  created_at: datetime
  updated_at: datetime

  type: enum [rapide, avis_valeur, etude_locative]
  status: enum [brouillon, finalisee, envoyee, ouverte, archivee]
  source: enum [manuel, annonce_url, bien_portefeuille, estimation_rapide, widget_public]

  # Lien optionnels
  bien_id: uuid nullable        # si lié à un bien du portefeuille
  annonce_id: uuid nullable     # si créée depuis une annonce
  parent_estimation_id: uuid nullable  # si promotion d'une estimation rapide
  lead_id: uuid nullable        # créé auto si "À l'attention de" rempli

  # Caractéristiques bien (snapshot au moment de l'estimation)
  adresse: string
  ban_id: string nullable
  lat: float
  lon: float
  iris_code: string
  type_bien: enum [appartement, maison, terrain, local_commercial, parking]
  surface: float
  surface_terrain: float nullable
  nb_pieces: int
  nb_chambres: int
  etage: int nullable
  nb_etages: int nullable
  annee_construction: int nullable
  dpe: enum [A, B, C, D, E, F, G, inconnu]
  ges: enum [A, B, C, D, E, F, G, inconnu]
  etat: enum [neuf, refait_a_neuf, bon, a_rafraichir, a_renover, a_restructurer]
  exposition: enum nullable
  caracteristiques: array [balcon, terrasse, parking, cave, ascenseur, gardien,
                           piscine, jardin, vue, calme, cheminee, fibre, meuble]

  # Estimation AVM (ce que renvoie le moteur)
  avm_response: json  # cf section 6

  # Valeur retenue par l'agent (peut dévier de l'AVM)
  valeur_retenue: json
    prix: int                   # si type vente
    prix_m2: int
    loyer: int                  # si type locative ou invest
    loyer_m2: int
    honoraires_pct: float
    honoraires_montant: int
    honoraires_charge: enum [acquereur, vendeur]
    net_vendeur: int
    justification_ecart: string nullable  # obligatoire si ecart >5%

  # Rapport (si formel)
  rapport:
    blocs_actifs: array [bloc_id]     # blocs cochés dans le panneau Contenu
    blocs_ordre: array [bloc_id]      # ordre drag-reorder
    blocs_contenus: map               # contenu édité inline par bloc
    style: enum [style_1, style_2, style_3]
    commentaire_expert: string

  # Client destinataire (si rapport)
  client:
    civilite: enum
    nom: string
    prenom: string
    email: string
    telephone: string

  # Tracking envoi
  envoi:
    envoye_le: datetime nullable
    email_destinataire: string nullable
    ouvertures: array [datetime]      # chaque ouverture tracée
    derniere_ouverture: datetime nullable

  # Liens inter-modules (dénormalisés pour perfs)
  actions_liees: array [action_id]
  dossier_invest_id: uuid nullable
  alertes_liees: array [alerte_id]

  # Versioning (avis de valeur + étude locative)
  version: int                        # 1, 2, 3...
  versions_precedentes: array [estimation_id]
```

### 2.2. Règles de transition d'état

```
brouillon ──(finaliser)──▶ finalisee
finalisee ──(envoyer)───▶ envoyee
envoyee ──(ouverture)──▶ ouverte (non bloquant)
* ────(archiver)─────▶ archivee
```

- Le brouillon n'est pas envoyable tant que les blocs obligatoires ne sont pas remplis.
- Une estimation finalisée n'est plus éditable ; pour modifier, créer une nouvelle version.
- L'archivage est réversible (désarchiver possible).

### 2.3. Règles de création de lead associé

| Événement | Action sur les leads |
|---|---|
| Estimation rapide créée sans client | Pas de lead |
| Estimation rapide créée avec client (champ "À l'attention de") | Création lead statut "À qualifier" |
| Avis de valeur créé | Création ou enrichissement lead vendeur statut "Avis en cours" |
| Avis de valeur envoyé | Lead passe statut "Avis envoyé" |
| Avis de valeur ouvert par vendeur | Lead passe statut "Rapport consulté" + notification |
| Étude locative créée | Création ou enrichissement lead bailleur statut "Étude en cours" |
| Étude locative envoyée | Lead passe statut "Étude envoyée" |
| Widget public : estimation entrante | Création lead statut "Lead entrant widget" |

Les changements de statut lead sont gérés par le module Leads, le module Estimation émet juste les événements.

---

## 3. Page d'accueil d'un sous-module (squelette commun)

Les 3 sous-modules (Estimation rapide, Avis de valeur, Étude locative) partagent le même squelette de page d'accueil. Seuls le contenu des KPI, les filtres disponibles et le mode prioritaire de création diffèrent.

### 3.1. Structure verticale (1440px)

```
┌────────────────────────────────────────────────────────────────┐
│ [Header Pro global : logo + PRO + ⌘K + zone + AI + 🔔 + avatar]│
├────────────────────────────────────────────────────────────────┤
│ [Sidebar]  │  [Page d'accueil sous-module]                     │
│            │                                                    │
│            │  Avis de valeur · 23                               │
│            │  [🔍 rechercher]  [≡ filtres]  [⊞⊟ vue]  [+ Nouvel avis de valeur ▾] │
│            │                                                    │
│            │  ┌──────┬──────┬──────┐   → 4 leads à relancer    │
│            │  │ KPI1 │ KPI2 │ KPI3 │                           │
│            │  └──────┴──────┴──────┘                           │
│            │                                                    │
│            │  [Chips filtres actifs × supprimables]             │
│            │                                                    │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│            │  │ Card │ │ Card │ │ Card │ │ Card │              │
│            │  └──────┘ └──────┘ └──────┘ └──────┘              │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│            │  │ Card │ │ Card │ │ Card │ │ Card │              │
│            │  └──────┘ └──────┘ └──────┘ └──────┘              │
│            │                                                    │
│            │  [Pagination ou infinite scroll]                   │
│            │                                                    │
└────────────────────────────────────────────────────────────────┘
```

### 3.2. Header de page

- **Titre** : nom du sous-module + compteur total (ex : "Avis de valeur · 23")
- **Barre de recherche** : recherche full-text sur adresse, client, notes
- **Bouton filtres** : ouvre un panneau latéral droit avec tous les filtres
- **Toggle vue** : cards (par défaut) / tableau dense (persisté par user)
- **Split button CTA** : action principale + dropdown 3 autres modes

Comportement du split button :
```
[+ Nouvel avis de valeur ▾]
   │
   └─ Clic principal : ouvre le mode prioritaire direct
   └─ Clic flèche : dropdown
      ├ Depuis une estimation rapide  (prioritaire, déjà le défaut)
      ├ Depuis une annonce
      ├ Depuis un bien du portefeuille
      └ Saisie manuelle
```

### 3.3. KPI row

3 KPI + 1 lien Kanban. Taille contenue (pas de gros blocs, cohérent avec design system dense).

**Estimation rapide** :
1. **Ce mois-ci** — nb créées + évolution vs mois -1
2. **Converties en avis de valeur** — % sur les 90 derniers jours
3. **Via le widget public** — nb ce mois (si widget activé, sinon : "Sources" avec mini-donut)

→ Lien : "N leads à qualifier → Mon pipeline commercial"

**Avis de valeur** :
1. **En cours** — nb brouillons + envoyés non signés
2. **Taux d'ouverture vendeur** — % ouverts au moins 1 fois sur 30 derniers jours
3. **Signés en mandat** — nb ce mois

→ Lien : "N leads à relancer → Mon pipeline commercial"

**Étude locative** :
1. **En cours** — nb brouillons + envoyés non signés
2. **Taux d'ouverture bailleur** — %
3. **Ce mois** — nb créées + évolution

→ Lien : "N leads à relancer → Mon pipeline commercial"

### 3.4. Filtres (panneau latéral)

Filtres communs aux 3 sous-modules :
- Période (créé le) : aujourd'hui / 7j / 30j / 90j / custom
- Auteur (multi-select si multi-user)
- Statut (multi-select : brouillon, finalisée, envoyée, ouverte, archivée)
- Zone géographique : ville, code postal, IRIS
- Type de bien : appartement, maison, terrain, local, parking
- Fourchette prix (ou loyer)
- Client (multi-select)
- Source (multi-select : annonce, manuel, bien portefeuille, estimation, widget)

Filtres spécifiques :
- Avis de valeur : écart AVM vs retenu, ouvert par vendeur oui/non, mandat signé oui/non
- Étude locative : zone tendue oui/non, DPE minimum, type location (vide / meublé)

Chips filtres actifs affichées au-dessus de la grille, suppression par ×.

### 3.5. Vue cards (1440px : 4 cartes/ligne, 1600px : 5/ligne)

Contenu d'une card :

```
┌──────────────────────────────┐
│ [photo/visu miniature]     ♡ │
│                              │
│ 16 rue du Hameau             │
│ 75015 Paris · Appartement    │
│ 2p · 42 m²                   │
│                              │
│ 421 000 € · 10 024 €/m²      │
│                              │
│ ┌──────────┐                 │
│ │ ●Envoyé  │  M. Prévost     │
│ └──────────┘                 │
│                              │
│ Modifié il y a 2h par S.L.   │
│                              │
│ [⋯ menu]                     │
└──────────────────────────────┘
```

- **Photo/visu** : miniature si photos uploadées, sinon illustration SVG standardisée par type de bien
- **Adresse + caractéristiques** : ligne dense
- **Valeur retenue** : prix ou loyer (selon type)
- **Badge statut** : couleur selon status (gris brouillon, bleu finalisé, violet envoyé, vert ouvert)
- **Client** : nom + prénom (si rempli)
- **Dernière modif** : ago + auteur
- **Menu ⋯** : dupliquer, archiver, supprimer, créer avis de valeur depuis (si estimation rapide), etc.

Click sur la card → ouverture de la fiche détail (édition).

### 3.6. Vue tableau (dense)

Colonnes : photo (petite), adresse, type, surface, pièces, valeur retenue, statut, client, auteur, modifié le, actions ⋯.

Tri par colonne. Sélection multi-lignes par checkbox à gauche.

### 3.7. Actions bulk

Activées dès qu'au moins une card/ligne est sélectionnée :
- Archiver
- Exporter (PDF pour les formels, CSV pour tous)
- Réassigner à un autre membre
- Supprimer (confirmation)

### 3.8. Empty state (premier usage)

Pour un agent qui ouvre l'onglet sans aucun objet :

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│    [Illustration produit en usage]                       │
│                                                          │
│    Vous n'avez encore aucun avis de valeur               │
│                                                          │
│    Créez votre premier avis de valeur pour générer       │
│    un rapport professionnel que vous pourrez envoyer     │
│    à votre vendeur.                                      │
│                                                          │
│    4 façons de commencer :                               │
│                                                          │
│    [Depuis une estimation rapide]                        │
│    [Depuis une annonce]                                  │
│    [Depuis un bien du portefeuille]                      │
│    [Saisie manuelle]                                     │
│                                                          │
│    → Voir un exemple d'avis de valeur                    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Flow de création

### 4.1. Mode "Depuis une annonce" (URL)

**Entrée** : champ URL.

**UX** :

1. L'agent colle une URL Leboncoin / SeLoger / Bien'ici / PAP / logic-immo.com
2. Système détecte la source et identifie l'annonce
3. Si l'annonce est déjà dans la base Propsight (scraping depuis janvier 2025) : récupération directe
4. Sinon : scraping à la demande (fallback si possible) ou message "Annonce non lisible, saisir manuellement"
5. Pré-remplissage des champs structurés
6. Affichage d'un **panneau de validation** avec :
   - Champs préremplis (badge "depuis l'annonce")
   - Champs à confirmer/compléter (surlignés)
   - Champs douteux (surlignés + icône ⚠)
   - Photos de l'annonce (affichées en référence, non importées)
7. L'agent complète, valide → création de l'objet → écran d'édition

**Sources fiables** (structurées) :
- Type, surface, pièces, prix : ~95%+
- Terrain (si maison) : ~80%
- DPE/GES : ~70%

**Sources à double-check** :
- Adresse : souvent floue (ville + rue sans numéro). Géocoding BAN + confirmation visuelle sur mini-carte obligatoire.
- Étage : parfois dans description libre
- Année de construction : parfois dans description

**Sources non fiables (ne pas préremplir, demander)** :
- État du bien
- Exposition
- Nombre d'étages de l'immeuble
- Caractéristiques détaillées (balcon, parking, cave) sauf si déclarées explicitement

**Règle droits d'image** : les photos de l'annonce ne sont **jamais** importées automatiquement dans le rapport final. Elles sont affichées comme référence visuelle pendant la saisie (dans un carrousel à côté du formulaire). Pour le rapport, l'agent doit uploader ses propres photos.

### 4.2. Mode "Saisie manuelle"

**UX** : ouverture d'une modale en wizard 3 étapes (pattern Yanport).

**Étape 1 — Caractéristiques principales** (obligatoire) :
- Civilité + nom + prénom du client (champ "À l'attention de")
- Adresse : autocomplete BAN + "Chercher sur la carte" (fallback géocoding manuel)
- Typologie : 4 icônes XL (Maison / Appartement / Terrain / Parking) — un clic pour sélectionner
- Caractéristiques essentielles : surface (m²), pièces, chambres, étage, nb étages immeuble, terrain (si maison)
- Champ estimation : live-update selon infos saisies (AVM temps réel, avec **indice de fiabilité** affiché dessous qui évolue)

Bouton "Continuer" → étape 2 OU "Créer l'étude" → skip étapes 2-3 (brouillon rapide).

**Étape 2 — Détails du bien** (facultatif) :
- Année de construction
- Type de bien (ancien, neuf)
- État (select 6 options)
- Exposition
- Vue
- Équipements : ascenseur, interphone, gardien, fibre
- Service : chauffage type + mode (individuel/collectif)
- **DPE/GES en sélecteurs visuels colorés** (grille A→G avec couleurs, clic pour sélectionner)

L'estimation en bas se met à jour live. Indice de fiabilité monte à mesure que l'agent remplit.

Bouton "Continuer" → étape 3 OU "Créer l'étude" → skip étape 3.

**Étape 3 — Informations complémentaires** (facultatif) :
- Description libre
- Points forts (liste éditable)
- Points à défendre (liste éditable)
- Charges mensuelles
- Taxe foncière
- État d'occupation (libre, occupé, loué)
- Nombre de lots copropriété
- Ravalement

Bouton "Créer l'étude" → création de l'objet → redirection vers écran d'édition.

### 4.3. Mode "Depuis un bien du portefeuille"

**UX** :

1. Ouverture d'une modale avec liste filtrable de tous les biens du portefeuille de l'agent
2. Filtres : type, ville, surface, statut du bien
3. Sélection d'un bien → pré-remplissage automatique (toutes les infos déjà connues)
4. Redirection directe vers écran d'édition (pas de wizard, les infos sont déjà là)

**Avantage** : l'agent ne ressaisit rien. Cas d'usage massif : mandat signé, besoin de produire l'avis de valeur.

### 4.4. Mode "Depuis une estimation existante"

**UX** (uniquement pour Avis de valeur et Étude locative) :

1. Modale avec liste des estimations rapides de l'agent, ordre chronologique descendant
2. Filtres : période, adresse
3. Sélection → pré-remplissage de toutes les infos de l'estimation rapide
4. Redirection vers écran d'édition en mode "Avis de valeur" (le template est différent mais les données sont partagées)
5. La nouvelle estimation garde un `parent_estimation_id` qui pointe vers l'estimation rapide source
6. La timeline du bien affiche les deux objets liés

**Avantage** : parcours funnel natif — estimation rapide vite faite en amont, puis escalade en formel quand le mandat est proche.

---

## 5. Template rapport mutualisé

### 5.1. Architecture

Le template est partagé entre :
- Avis de valeur
- Étude locative
- Dossier investissement (module Investissement, hors scope ce doc mais même moteur)

Blocs = composants indépendants, ordonnables, activables/désactivables, éditables inline. Chaque bloc a une data source, un mode édition, un mode preview, une règle de visibilité.

### 5.2. Liste exhaustive des blocs

| # | Bloc | Avis de valeur | Étude locative | Dossier invest | Data source |
|---|---|---|---|---|---|
| 1 | Couverture | ✓ défaut | ✓ défaut | ✓ défaut | Bien + client + conseiller + date |
| 2 | Sommaire | optionnel | optionnel | optionnel | Généré à partir des blocs actifs |
| 3 | Présentation agence | ✓ défaut | ✓ défaut | ✓ défaut | Paramètres > Organisation |
| 4 | Présentation conseiller | ✓ défaut | ✓ défaut | ✓ défaut | Profil user |
| 5 | Présentation du bien | ✓ défaut | ✓ défaut | ✓ défaut | Objet Estimation (caractéristiques) |
| 6 | Photos du bien | ✓ défaut | ✓ défaut | ✓ défaut | Upload user (pas annonce) |
| 7 | Points forts / à défendre | ✓ défaut | ✓ défaut | ✓ défaut | Édition inline |
| 8 | Cadastre + parcelle | optionnel | optionnel | ✓ défaut | IGN / data.gouv + PLU |
| 9 | Autorisations urbanisme à proximité | optionnel | — | ✓ défaut | Sitadel |
| 10 | Historique ventes à l'adresse | optionnel | — | ✓ défaut | DVF filtré adresse exacte |
| 11 | Éléments socio-économiques | ✓ défaut | ✓ défaut | ✓ défaut | INSEE Filosofi IRIS |
| 12 | Profil acquéreur / locataire cible | ✓ défaut | ✓ défaut | ✓ défaut | INSEE Filosofi + calc |
| 13 | Budget / revenu nécessaire par profil | ✓ défaut | ✓ défaut | ✓ défaut | Calc : prix + taux BDF |
| 14 | **Bloc Solvabilité (profondeur de marché)** | ✓ défaut | ✓ défaut | ✓ défaut | INSEE Filosofi déciles |
| 15 | Score emplacement | ✓ défaut | ✓ défaut | ✓ défaut | 6 dimensions BPE + OSM + calc |
| 16 | Services de proximité (liste + mini-carte) | ✓ défaut | ✓ défaut | ✓ défaut | BPE + OSM |
| 16bis | Isochrones piétonniers 5 min | — (V2) | — (V2) | — (V2) | OSRM (V2) |
| 17 | Répartition des logements du secteur | ✓ défaut | ✓ défaut | ✓ défaut | INSEE 2021 |
| 18 | Prix du marché secteur (heatmap + fourchette) | ✓ défaut | — | ✓ défaut | DVF + annonces agrégées |
| 19 | Évolution prix 6m / 1a / 2a | ✓ défaut | — | ✓ défaut | DVF séries temporelles |
| 20 | Loyer du marché secteur | — | ✓ défaut | ✓ défaut | Annonces agrégées |
| 21 | Évolution loyers | — | ✓ défaut | ✓ défaut | Annonces séries temporelles |
| 22 | Rendement locatif secteur | — | optionnel | ✓ défaut | Calc croisé prix / loyer |
| 23 | Tension marché (tensiomètre) | ✓ défaut | ✓ défaut | ✓ défaut | Calc interne : stocks, délais, révisions |
| 24 | Délais de vente / location | ✓ défaut | ✓ défaut | ✓ défaut | Annonces agrégées |
| 25 | Biens comparables en vente | ✓ défaut | — | ✓ défaut | Annonces actives + score similarité |
| 26 | Biens comparables vendus (DVF) | ✓ défaut | — | ✓ défaut | DVF 24 mois + score similarité |
| 27 | Biens comparables invendus (annonces expirées) | optionnel | — | optionnel | Annonces expirées sans vente |
| 28 | Biens comparables à louer | — | ✓ défaut | ✓ défaut | Annonces location actives |
| 29 | Biens comparables loués (annonces expirées succès) | — | ✓ défaut | ✓ défaut | Annonces location expirées |
| 30 | Focus comparable | optionnel | optionnel | optionnel | 1 comparable épinglé |
| 31 | Synthèse 3 méthodes (marché / comparables / IA) | ✓ défaut | ✓ défaut | ✓ défaut | AVM + agrégations |
| 32 | Ajustements feature par feature | ✓ défaut | ✓ défaut | ✓ défaut | AVM features_importance |
| 33 | Réglementations (encadrement loyers, Pinel, permis louer) | — | ✓ défaut | optionnel | Arrêtés préfectoraux |
| 34 | Projet d'investissement (achat / revente / location) | — | — | ✓ défaut | Objet Dossier invest |
| 35 | Analyse financière (coût revient, plus-value, marge) | — | — | ✓ défaut | Calculs invest |
| 36 | Fiscalité (LMNP, Pinel, etc.) | — | optionnel | ✓ défaut | Calc + param fiscal user |
| 37 | Simulation "refait à neuf vs état" | optionnel | — | ✓ défaut | AVM avec variants |
| 38 | Conclusion + recommandation | ✓ défaut | ✓ défaut | ✓ défaut | Édition inline + valeur retenue |
| 39 | Annexes (DPE, diagnostics) | ✓ défaut | ✓ défaut | optionnel | Upload user |
| 40 | Footer / mentions légales | ✓ défaut | ✓ défaut | ✓ défaut | Paramètres > Organisation |

### 5.3. Panneau "Contenu" latéral droit

Pendant l'édition du rapport, panneau latéral droit (comme Yanport Agent 360) :

```
┌─ Contenu ────────── × ┐
│                       │
│ Style   [Style 1 ▾]   │
│                       │
│ ☑ Couverture          │
│ ☑ Sommaire            │
│ ☑ Présentation agence │
│ ☑ Présentation bien   │
│ ☑ Photos du bien      │
│ ▶ Marché local        │
│   ☑ Prix du marché    │
│   ☑ Évolution prix    │
│   ☑ Tension           │
│ ▶ Comparables         │
│   ☑ En vente          │
│   ☑ Vendus            │
│   ☐ Invendus          │
│   ☐ Focus             │
│ ▶ Socio-économie      │
│   ☑ Éléments socio-éco│
│   ☑ Profil acquéreur  │
│   ☑ Budget / revenu   │
│   ☑ Solvabilité       │
│ ☑ Synthèse 3 méthodes │
│ ☑ Ajustements         │
│ ☑ Conclusion          │
│ ☑ Annexes             │
│                       │
│ ──────────────        │
│ [Sauver comme modèle] │
│ [Réinitialiser défaut]│
└───────────────────────┘
```

Chaque case cochée = bloc inclus dans le PDF.
"Sauver comme modèle" = ce template devient le défaut de l'organisation.

### 5.4. Modes d'affichage

- **Mode édition** : split 50/50 — gauche formulaire/édition, droite preview live
- **Mode preview** : pleine page, pagination PDF, navigation via sommaire
- **Mode export PDF** : branded (logo + couleurs agence tirées de Paramètres > Organisation > Branding)

### 5.5. Édition inline par bloc

Chaque bloc a un bouton crayon bleu sur le côté droit dans la preview (pattern Yanport). Clic → ouvre l'édition du bloc :
- Blocs texte (conclusion, points forts, commentaire expert) : textarea WYSIWYG
- Blocs data (marché, comparables) : modale de sélection (ex : sélectionner quels comparables afficher)
- Blocs visuels (couverture, style) : sélecteur de variantes

---

## 6. Contrat AVM (équipe ML)

### 6.1. Inputs minimaux requis

```json
{
  "adresse": "16 rue du Hameau, 75015 Paris",
  "ban_id": "75115_4340_00016",
  "lat": 48.8323,
  "lon": 2.2893,
  "iris_code": "751156408",
  "type_bien": "appartement",
  "surface_habitable": 42,
  "nb_pieces": 2,
  "nb_chambres": 1,
  "etage": 2,
  "nb_etages": 7,
  "annee_construction": 1960,
  "dpe": "E",
  "ges": "E",
  "etat": "a_rafraichir",
  "caracteristiques": ["balcon", "cave", "ascenseur", "parking"]
}
```

### 6.2. Inputs optionnels enrichissants

```json
{
  "surface_terrain": 0,
  "exposition": "sud",
  "vue": "calme",
  "niveau_sonore": "calme",
  "mode_chauffage": "collectif",
  "type_chauffage": "gaz",
  "charges_mensuelles": 180,
  "taxe_fonciere": 1200,
  "description_libre": "..."
}
```

### 6.3. Outputs attendus

```json
{
  "prix": {
    "estimation": 421000,
    "fourchette_basse": 399000,
    "fourchette_haute": 445000,
    "prix_m2": 10024,
    "prix_m2_fourchette_basse": 9500,
    "prix_m2_fourchette_haute": 10595,
    "confiance": 0.82,
    "confiance_label": "fort"
  },
  "loyer": {
    "estimation": 1340,
    "fourchette_basse": 1224,
    "fourchette_haute": 1494,
    "loyer_m2": 31.9,
    "confiance": 0.76,
    "confiance_label": "bon"
  },
  "comparables": [
    {
      "type": "dvf",
      "ref": "2024-DVF-XXX",
      "adresse_approx": "14 rue du Hameau",
      "distance_m": 40,
      "surface": 45,
      "nb_pieces": 2,
      "etage": 3,
      "annee": 1962,
      "dpe": "D",
      "prix": 435000,
      "prix_m2": 9667,
      "date": "2024-08-15",
      "score_similarite": 0.94
    }
    // ... jusqu'à 50 comparables, triés par score décroissant
  ],
  "features_importance": [
    { "feature": "localisation_iris", "contribution": 0.34 },
    { "feature": "surface", "contribution": 0.28 },
    { "feature": "etat", "contribution": 0.12 },
    { "feature": "dpe", "contribution": 0.08 },
    { "feature": "etage", "contribution": 0.06 }
  ],
  "ajustements": [
    { "critere": "etat_refait_a_neuf", "delta_prix_pct": 0.0813,
      "delta_prix_m2": 763, "libelle": "Refait à neuf" },
    { "critere": "balcon", "delta_prix_pct": 0.0122,
      "delta_prix_m2": 115, "libelle": "Balcon : Oui" },
    { "critere": "annee_construction_1960", "delta_prix_pct": -0.0302,
      "delta_prix_m2": -285, "libelle": "Construction : 1960" },
    { "critere": "dpe_E_ges_E", "delta_prix_pct": -0.0076,
      "delta_prix_m2": -72, "libelle": "DPE : (E), GES : (E)" }
  ],
  "marche_reference": {
    "prix_m2_bas": 8267,
    "prix_m2_median": 9355,
    "prix_m2_haut": 10582,
    "ecart_vs_marche_pct": 0.0715,
    "message": "Surcote de +7.15% par rapport au prix de référence"
  },
  "meta": {
    "nb_comparables_dvf": 47,
    "nb_comparables_annonces": 23,
    "rayon_analyse_m": 500,
    "periode_analyse_mois": 18,
    "model_version": "v0.3.1",
    "computed_at": "2026-04-22T14:23:00Z"
  }
}
```

### 6.4. Points à figer avec l'équipe ML cette semaine

1. **Score de confiance** : float 0-1 ET/OU classe (faible/bon/fort) ? Je propose les deux (`confiance` float + `confiance_label` string dérivée de seuils configurables).
2. **Disponibilité des `features_importance` en V1** ? Si non, on mock et on prévient l'UI pour afficher un placeholder.
3. **Temps de réponse cible** : <2s pour estimation rapide. Si >2s, prévoir état de chargement + queue async.
4. **Score de similarité comparables** : fait côté ML ou côté app ? Je propose côté ML (calculé dans le même run, plus efficace).
5. **Fréquence de recalcul** : on recalcule à chaque modification de champ (live) ou au bouton "Estimer" ? Je propose debounce 500ms sur modif de champs critiques (surface, pièces, état, DPE).
6. **Mock pendant les 14 semaines** : fournir un mock server qui renvoie cette structure avec données cohérentes, variables selon les inputs (pas juste constant).

---

## 7. Bloc Solvabilité / Profondeur de marché

### 7.1. Principe

Différenciateur Propsight. Mesure si le prix/loyer est soutenable par la population cible locale. Logique commune aux 3 types de rapport :
- **Avis de valeur** : profondeur de marché acheteur
- **Dossier invest** : robustesse de la demande locative derrière le rendement
- **Étude locative** : accessibilité réelle du loyer

### 7.2. Méthodologie

**Inputs calculés côté app** (pas ML) :

```
1. Zone de chalandise :
   - Achat résidentiel : commune + communes limitrophes
   - Achat investissement : département / métropole
   - Location : IRIS + rayon 2-3km

2. Distribution des revenus de la zone :
   - Source : INSEE Filosofi (déciles D1-D9 par IRIS)
   - Agrégation pondérée par population sur la zone de chalandise

3. Revenu nécessaire selon transaction :
   - Achat : f(prix, taux BDF actuel, durée, apport, endettement max)
     Défaut V1 : taux BDF live, durée 25 ans, apport 10%, endettement 33%
     Paramétrable par l'agent dans le rapport
   - Location : 3 × loyer (règle bailleur standard)

4. Part de population éligible :
   Interpolation sur la distribution : quel décile atteint le revenu nécessaire ?

5. Benchmark sectoriel :
   Calcul de la part éligible MÉDIANE sur les ventes du quartier 12 derniers mois
```

### 7.3. Outputs (schéma)

```json
{
  "zone_reference": {
    "type": "commune_et_limitrophe",
    "code_zone": "75115",
    "nb_communes": 4,
    "population": 245000,
    "nb_menages": 135000
  },
  "distribution_revenus": {
    "d1": 1200, "d2": 1500, "d3": 1800, "d4": 2100, "d5": 2400,
    "d6": 2800, "d7": 3200, "d8": 3900, "d9": 5100,
    "source": "INSEE Filosofi 2022"
  },
  "hypotheses": {
    "taux_bdf": 0.0363,
    "duree_annees": 25,
    "apport_pct": 0.10,
    "endettement_max": 0.33,
    "regle_locative": "3x_loyer"
  },
  "revenu_necessaire": 5402,
  "part_eligible": 0.18,
  "benchmark_quartier": {
    "part_eligible_mediane_ventes_12m": 0.27,
    "positionnement": "en_dessous_mediane",
    "message": "Votre bien cible une clientèle plus restreinte que la médiane du quartier"
  }
}
```

### 7.4. UI — bloc interactif

Le bloc affiche :
- **Chiffre principal** : "18% des ménages de votre secteur peuvent acheter ce bien"
- **Benchmark** : "Médiane du quartier : 27%" (avec indicateur < / ~ / >)
- **Slider prix** : curseur de prix → mise à jour live du %éligible
- **Détail hypothèses** (dépliable) : taux, durée, apport, endettement → modifiables par l'agent
- **Répartition par profil de foyer** : personne seule / couple / famille / mono, avec % éligible par profil
- **Explication pédagogique** : "À 272 000 €, ce bien touche X% du marché. À 260 000 €, il en touche X%..."

Code couleur : vert (>médiane), orange (~médiane), rouge (<médiane / 2). Pas de jugement binaire, toujours contextualisé.

### 7.5. Nommage précis

- Pour l'achat : "part de ménages éligibles à l'emprunt"
- Pour la location : "dossiers éligibles au filtre bailleur (3× loyer)", **pas** "locataires solvables"

### 7.6. Dépendances

- API INSEE Filosofi (à intégrer au backbone)
- API Banque de France pour taux live (endpoint public)
- Aucune dépendance ML : c'est du calcul pur + agrégations

---

## 8. Écran Estimation rapide détaillé

### 8.1. Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Estimation rapide · 16 rue du Hameau, 75015 Paris            │
│  ● Sauvegardé il y a 2s         [Sauvegarder] [Promouvoir ▾]    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────┐  ┌─────────────────────────┐  │
│  │ Formulaire (60%)             │  │ Panneau résultat (40%)  │  │
│  │                              │  │                         │  │
│  │ Localisation                 │  │ Prix estimé             │  │
│  │ [adresse autocomplete BAN]   │  │ 421 000 €               │  │
│  │                              │  │ 10 024 €/m²             │  │
│  │ Type [Maison][Appt][Terr][P] │  │ [●●●○○] Confiance fort  │  │
│  │                              │  │ Fourchette 399k-445k    │  │
│  │ Surface [__]  Pièces [__]    │  │                         │  │
│  │ Chambres [__] Étage [__]     │  │ Loyer estimé            │  │
│  │                              │  │ 1 340 €                 │  │
│  │ Année [__] DPE [A-G grid]    │  │ 31.9 €/m²               │  │
│  │ GES [A-G grid]               │  │ Rendement brut 3.8%     │  │
│  │                              │  │                         │  │
│  │ État [select 6 options]      │  │ ─────────────────       │  │
│  │                              │  │                         │  │
│  │ Caractéristiques             │  │ Ajustements             │  │
│  │ [○ balcon] [○ parking]       │  │ + Refait à neuf +8.1%   │  │
│  │ [○ cave]   [○ ascenseur]     │  │ + Balcon        +1.2%   │  │
│  │ [○ calme]  [○ vue]           │  │ - Année 1960    -3.0%   │  │
│  │                              │  │ - DPE E         -0.8%   │  │
│  │                              │  │                         │  │
│  │                              │  │ Voir tous les détails → │  │
│  │                              │  │                         │  │
│  │                              │  │ ─────────────────       │  │
│  │                              │  │                         │  │
│  │                              │  │ Solvabilité             │  │
│  │                              │  │ 18% des ménages         │  │
│  │                              │  │ Médiane quartier : 27%  │  │
│  │                              │  │ [Slider prix interactif]│  │
│  │                              │  │                         │  │
│  │                              │  │ ─────────────────       │  │
│  │                              │  │                         │  │
│  │                              │  │ Comparables (5)         │  │
│  │                              │  │ [mini-cards cliquables] │  │
│  └─────────────────────────────┘  │ Voir tous (47) →        │  │
│                                    │                         │  │
│                                    │ ─────────────────       │  │
│                                    │                         │  │
│                                    │ Actions rapides         │  │
│                                    │ [Promouvoir en AdV]     │  │
│                                    │ [Créer étude locative]  │  │
│                                    │ [Analyser en invest]    │  │
│                                    │ [Créer lead]            │  │
│                                    │ [Suivre ce bien ♡]      │  │
│                                    └─────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│  Historique : 10 dernières estimations de Sophie L. [Horizontal]│
└──────────────────────────────────────────────────────────────────┘
```

### 8.2. Comportements

- Formulaire réactif : chaque modif triggère un debounce 500ms puis appel AVM
- Indice de fiabilité sous le prix estimé, évolue en temps réel
- Panneau résultat vide au départ, remplit progressivement
- Click sur un comparable → drawer contextuel (réutilise le drawer bien/annonce standard)
- Historique : carousel horizontal des 10 dernières estimations de l'user (clic = réouverture)

### 8.3. Auto-save

Rappel des règles :
- Estimation jetable par défaut (en mémoire)
- Déclencheurs de sauvegarde auto :
  - 60s après début de saisie (si au moins adresse + type + surface remplis)
  - OU action "Promouvoir en avis de valeur" (force la sauvegarde)
  - OU bouton explicite "Sauvegarder"
- Indicateur de statut en haut : `● Non sauvegardé` / `● Sauvegardé il y a Xs` / `● Enregistrement...`
- Si l'user ferme l'onglet avant sauvegarde : prompt "Abandonner cette estimation ?" (bouton "Sauvegarder et quitter" en alternative)

### 8.4. Promouvoir en avis de valeur / étude locative

Bouton split dans le header : `[Promouvoir ▾]` avec options :
- Promouvoir en avis de valeur
- Promouvoir en étude locative
- Analyser en investissement (ouvre modal 7 tabs)

Promouvoir = crée un nouvel objet Avis de valeur (ou Étude) avec toutes les données préremplies + `parent_estimation_id` qui pointe vers l'estimation rapide. L'agent bascule sur l'écran d'édition du nouveau rapport.

---

## 9. Écran Avis de valeur détaillé

### 9.1. Vue édition — split 50/50

Comme décrit en section 5 (template mutualisé). Récap rapide :

```
┌────────────────────────────────────────────────────────────────┐
│ ← Avis de valeur · M. Prévost · Brouillon                      │
│ [Sauvegardé] [Aperçu PDF] [Envoyer] [Exporter ▾]     Contenu > │
├──────────────────────────────────────┬─────────────────────────┤
│ ÉDITEUR (50%)                         │ PREVIEW PDF (50%)       │
│                                       │                         │
│ [Poignée] Couverture            [✎] │ [Rendu page 1]          │
│ [Poignée] Présentation bien     [✎] │                         │
│ [Poignée] Photos                [✎] │                         │
│ [Poignée] Éléments socio-éco    [✎] │ [Rendu page 2]          │
│ [Poignée] Marché local          [✎] │                         │
│ [Poignée] Comparables           [✎] │                         │
│ [Poignée] Synthèse 3 méthodes   [✎] │ [...]                   │
│ [Poignée] Conclusion            [✎] │                         │
│                                       │                         │
│ [+ Ajouter un bloc]                   │                         │
└──────────────────────────────────────┴─────────────────────────┘
```

- Poignée drag à gauche → réordonne les blocs
- Bouton crayon [✎] → édition inline du bloc
- Bouton "+ Ajouter un bloc" → liste des blocs disponibles mais désactivés

### 9.2. Valeur retenue (bloc Conclusion)

Bloc spécial en fin de rapport :

```
┌──── Notre estimation ──────────────────────┐
│                                            │
│ 📊 Prix de vente  [272 000 €] [🔄 €/m²]   │
│                     5 117 €/m²             │
│                                            │
│ 🏷 Honoraires    [6] [🔄 €] [%]           │
│                    15 396 € TTC            │
│                    À la charge de          │
│                    [Acquéreur ▾]           │
│                                            │
│ ─────────────────────────                  │
│                                            │
│ 🏠 Net vendeur    256 604 €                │
│                                            │
└────────────────────────────────────────────┘
```

Toggles € ↔ % ↔ €/m² comme Yanport. "À la charge" en select (acquéreur / vendeur).

Si l'agent entre une valeur qui dévie de plus de 5% de l'AVM, un champ **justification obligatoire** apparaît sous le prix : "Votre estimation dévie de -8% par rapport à l'AVM. Justifier cet écart :" + textarea. Cette justification est stockée et affichée dans la timeline, pas dans le rapport.

### 9.3. Envoi

Bouton "Envoyer" ouvre une modale :
- Destinataire : email + nom (prérempli avec le client)
- Objet email : prérempli, modifiable
- Message : prérempli (template paramétrable en Paramètres > Organisation), modifiable
- Options : "Demander un accusé de lecture" (coché par défaut)
- CTA "Envoyer maintenant" / "Programmer l'envoi"

Après envoi :
- Statut passe à "envoyée"
- Email envoyé avec un **lien sécurisé** vers une version web du rapport (tracking ouverture)
- PDF attaché également
- Event loggé dans la timeline du bien + du lead associé
- Lead passe statut "Avis envoyé" dans le Kanban

### 9.4. Versioning

- Une fois envoyée, une étude n'est plus éditable
- Pour modifier, l'agent crée une **nouvelle version** (bouton "Nouvelle version" sur l'étude envoyée)
- Les versions sont liées : chaque nouvelle version garde le `versions_precedentes` en array
- La timeline du bien montre toutes les versions
- Le rapport envoyé au vendeur affiche toujours la dernière version (URL stable qui redirige)

---

## 10. Écran Étude locative détaillé

Même structure que Avis de valeur, blocs par défaut orientés location (voir section 5.2).

### 10.1. Spécificités

**Bloc Réglementations** (obligatoire si bien en zone tendue) :
- Encadrement des loyers : zone tendue oui/non, loyer de référence minoré/majoré, loyer proposé vs plafond (badge conformité)
- Permis de louer : zone concernée oui/non + lien vers procédure
- Logement décent : checklist (surface >9m², DPE minimum, etc.)
- Loi Pinel : zonage + plafond si applicable

**Bloc Profil locataire cible** : spécifique location, tiré du bloc 12 du template avec les données INSEE adaptées :
- Composition foyer dominante
- Revenus médians
- Budget loyer accessible selon règle 3×

**Bloc Tension locative** : vacance moyenne IRIS, durée moyenne vacance, ratio demande/offre. Source : annonces agrégées + durée de diffusion.

**Valeur retenue** :
```
Loyer H.C.        [1 000 €]  19 €/m²
Charges mensuelles [60 €]
Loyer C.C.         1 060 €   20 €/m²
Honoraires         965 €
```

Dans zone encadrée : badge "Dans l'encadrement : 587-1003 €" + warning si loyer retenu > majoré.

---

## 11. États et cas limites

### 11.1. États d'un écran d'estimation

| État | Trigger | UI |
|---|---|---|
| Vide (saisie) | Nouveau, aucun champ rempli | Panneau résultat vide + message "Commencez par saisir l'adresse" |
| Chargement AVM | Champs modifiés, appel en cours | Skeleton loader sur le panneau résultat |
| AVM OK | Réponse reçue | Affichage normal |
| AVM erreur | Timeout, 500, pas de données | Message "Estimation momentanément indisponible" + possibilité de saisir manuellement une valeur retenue |
| AVM confiance faible | `confiance < 0.5` | Badge orange "Confiance faible" + message "Données limitées sur ce secteur, estimation à pondérer" |
| Pas de comparables | `nb_comparables < 5` | Message "Peu de transactions récentes dans le secteur, l'estimation s'appuie principalement sur le modèle" |
| Hors zone couverte | Adresse hors France | "Propsight couvre uniquement la France métropolitaine en V1" |

### 11.2. États d'un rapport

| Statut | Éditable | Envoyable | Nouvelle version | Archivable |
|---|---|---|---|---|
| Brouillon | ✓ | ✗ (blocs obligatoires non remplis) | — | ✓ |
| Finalisée | ✓ | ✓ | — | ✓ |
| Envoyée | ✗ | ✗ | ✓ | ✓ |
| Ouverte | ✗ | ✗ | ✓ | ✓ |
| Archivée | ✗ | ✗ | ✗ | ✗ (désarchivable) |

### 11.3. Erreur de scraping d'annonce

Si l'URL ne peut pas être lue :
- Message clair "Nous n'arrivons pas à lire cette annonce. Vous pouvez saisir manuellement ou essayer un autre lien."
- Fallback : bouton "Saisir manuellement" qui ouvre le wizard 3 étapes pré-rempli avec ce qu'on a pu extraire (prix, peut-être ville)

---

## 12. Interconnexion avec les autres modules

### 12.1. Depuis Estimation vers ailleurs

Sur toute estimation sauvegardée, actions disponibles (dans le drawer ou panneau actions) :
- Créer un lead à partir du client
- Créer une action (RDV, relance, visite)
- Promouvoir en avis de valeur / étude locative
- Analyser en investissement (ouvre modal 7 tabs)
- Créer un dossier investissement
- Ajouter aux biens suivis (♡)
- Créer une alerte de revalorisation (surveiller l'évolution du prix du secteur)
- Partager lien public (pour le client)

### 12.2. Vers Estimation depuis ailleurs

Entrées possibles :
- Sidebar directe
- Fiche bien → bouton "Estimer" (portefeuille, annonces, DVF, opportunités, signaux prospection)
- Fiche lead → "Estimer le bien du lead"
- Widget public → lead entrant avec estimation pré-faite
- ⌘K → "Estimer [adresse]"
- Observatoire > Contexte local → "Estimer un bien ici"
- Signaux DVF / DPE (Prospection) → "Estimer ce bien"

### 12.3. Mises à jour automatiques

- Chaque estimation/avis/étude crée/enrichit un lead (cf section 2.3)
- Chaque estimation apparaît dans la timeline du bien lié
- Chaque estimation apparaît dans la timeline du lead lié
- Chaque estimation est indexée par zone pour alimenter l'Observatoire (volumes d'activité)
- Chaque envoi/ouverture génère une notification dans Veille > Notifications

---

## 13. Ordre de production des maquettes (semaine du 22-25 avril)

### Jour 1 (mer 22 avril) — Alignement + template

**Matin (meeting 45min)** : validation du présent doc d'archi avec l'équipe ML + dev.

**Aprem** : maquette du template rapport mutualisé
- Mode édition split 50/50
- Panneau Contenu droit
- Édition inline bloc (ex : bloc Conclusion avec toggles)
- Preview PDF rendu
- États brouillon / finalisé / envoyé

### Jour 2 (jeu 23 avril) — Estimation rapide + Avis de valeur liste

**Matin** : maquette Estimation rapide
- Écran principal split formulaire / résultat
- Bloc Solvabilité interactif
- Panneau actions rapides
- Historique en bas
- État vide, chargement, erreur

**Aprem** : maquette Avis de valeur — liste + création
- Page d'accueil cards + KPI + split button
- Modale création 4 modes
- Wizard saisie manuelle 3 étapes
- Flow URL annonce
- Vue tableau

### Jour 3 (ven 24 avril) — Étude locative + cohérence

**Matin** : maquette Étude locative
- Différences vs Avis de valeur (bloc réglementations, valeur retenue HC/CC)
- Page d'accueil
- Écran édition

**Aprem** : passe de cohérence
- États d'erreur
- Drawer contextuel des objets Estimation
- Liens inter-modules visibles
- Récap final avant livraison

### Jour 4 (ven 25 avril soir / sam) — Review

Envoi à l'équipe pour revue, intégration feedback. Prêt pour démarrage dev lundi 27 avril.

---

## 14. Décisions figées (précédemment questions ouvertes)

Tranchées le 22 avril 2026 :

| # | Sujet | Décision V1 / V2 | Notes |
|---|---|---|---|
| 1 | Scoring emplacement (6 dim A→E) | **V1** | Scope réduit : 6 dimensions (Transports, Commerces, Santé, Éducation, Services, Vie de quartier) + note globale + 4-5 forces majeures + carte POI colorée. Abandon V1 : pollution fine, nuisances sonores, sécurité. |
| 2 | Isochrones piétonniers | V2 | Nécessite OSRM/GraphHopper. |
| 3 | Co-édition rapport | **V1 asynchrone avec verrou** | Un seul éditeur à la fois, verrou visible ("Sophie L. édite actuellement"). Pas de simultané temps réel. |
| 4 | Commentaires sur blocs (Google Docs-like) | V2 | |
| 5 | Pagination PDF | **Flux continu** | Sauts forcés avant blocs critiques uniquement (couverture, conclusion, synthèse). |
| 6 | Planification envoi (date future) | V2 | |
| 7 | Templates d'email personnalisables par organisation | **V1** | Champ textarea en Paramètres > Organisation > Communication, variables de template. |
| 8 | Historique envois par rapport | **V1** | Table `email_events` + UI simple sur fiche rapport. |
| 9 | Formats d'export | **PDF uniquement V1** | Word jamais prévu, PowerPoint jamais. |
| 10 | Rapport version web publique + PDF | **V1 les deux** | Route `/rapport/[token]` brandée + responsive + tracking scroll. |
| 11 | Watermark "Brouillon" sur PDF non finalisé | **V1** | Overlay CSS sur rendu. |
| 12 | Compteurs par plan (pricing) | **V1 compteurs sans enforcement** | Compteurs en base dès V1 pour pouvoir enforcer plus tard sans migration. |
| 13 | Langue du rapport | **V1 FR uniquement** | Bilingue V2 si demande. |
| 14 | Délégation / réassignation entre membres | **V1** | Action bulk + champ `assignee_id` sur objet. |

## 14 bis. Scoring emplacement V1 — scope précis

Puisque retenu V1, voici le scope à implémenter par l'équipe data :

### 6 dimensions notées A→E

| Dimension | Sources | Indicateurs agrégés |
|---|---|---|
| Transports | BPE + OSM | Bus (nb lignes, distance arrêt le plus proche), Métro/Tram (distance), RER/Train (distance) |
| Commerces | BPE | Boulangerie (distance + nb à 5 min), Supermarché, Épicerie, Autres commerces de proximité (nb) |
| Santé | BPE | Pharmacie (distance + nb), Médecin généraliste (nb à 5 min), Médecin spécialiste, Hôpital (distance) |
| Éducation | BPE + Open Data Éducation | Crèche (distance), Maternelle, Élémentaire, Collège, Lycée (distance + effectifs) |
| Services aux particuliers | BPE | Bureau de poste, Banque, Coiffeur, Garage auto (distance au plus proche) |
| Vie de quartier | OSM | Restaurants (nb à 5 min), Bars, Cafés, Parcs/espaces verts (distance), Musées/culture (nb) |

### Note globale

Moyenne pondérée simple des 6 dimensions (pondération configurable, défaut équiprobable).

### Forces majeures (pills)

Détection automatique parmi ~15 détecteurs pré-définis :
- "Bâtiment fibré" (si adresse dans zone fibre Arcep)
- "Vie de quartier" (si Vie de quartier >= B)
- "Aucun quartier prioritaire" (si pas dans QPV)
- "Pour les enfants" (si Éducation >= B ET Crèche à <5 min ET Parc à <10 min)
- "Vie sans voiture" (si Transports >= B ET Commerces >= B)
- "Besoins quotidiens" (si Commerces + Santé >= B moyenne)
- "Pour les personnes âgées" (si Santé >= B ET Services >= B ET Transports >= C min)
- "Proche nature" (si parc/forêt/espace vert à <500m)
- "Centre-ville" (si densité POI très haute)
- "Cadre calme" (si densité POI faible sans dégrader les notes)
- etc.

4-5 pills max affichées, les mieux classées.

### Méthodologie de notation

- Pour chaque indicateur : seuil absolu (ex : "pharmacie à <300m = bon") ET calibrage distribution nationale (percentiles)
- Note A : top 20% national
- Note B : 20-40%
- Note C : 40-60% (médiane)
- Note D : 60-80%
- Note E : bottom 20%

### Pré-calcul

Score calculé à la demande pour une adresse (pas de pré-calcul massif V1). Cache 7 jours par adresse géocodée. Temps cible : <1s par adresse.

### Abandonné V1 (V2)

- Pollution (Atmo)
- Nuisances sonores (cartes bruit)
- Sécurité (délinquance) — décision politique
- Risques naturels (zones inondables, argile)
- Environnement (bio-indicateurs)

---

## 15. Récapitulatif des dépendances externes

Services / API nécessaires (à figer avec ops + ML) :

| Dépendance | Criticité | Fréquence appel | Fallback |
|---|---|---|---|
| AVM interne (ML) | Bloquante | Chaque modification saisie | Mock pendant 14 sem |
| BAN (adresse) | Bloquante | Autocomplete adresse | Saisie libre + géocoding manuel |
| INSEE Filosofi | Bloquante bloc solvabilité | Cache journalier | Masquer bloc |
| Banque de France taux | Non bloquante | Daily refresh | Valeur figée 3.63% |
| DVF (data.gouv) | Bloquante | Cache hebdo | Message "données indisponibles" |
| Annonces agrégées (scraping interne) | Bloquante | Real-time + cache | Liste vide |
| OSM / BPE | Bloquante scoring V1 | Cache 7 jours | Masquer bloc scoring |
| Open Data Éducation | Bloquante scoring V1 | Cache mensuel | Fallback BPE |
| Arcep (fibre) | Non bloquante | Cache trimestriel | Pas de pill "Bâtiment fibré" |
| QPV (quartiers prioritaires) | Non bloquante | Cache annuel | Pas de pill "Aucun QPV" |
| Sitadel (autorisations urbanisme) | Non bloquante | Cache mensuel | Masquer bloc |
| SendGrid ou équivalent (email) | Bloquante envoi | Real-time | Retry queue |
| Tracking pixel email | Non bloquante | Real-time | Statut reste "envoyé" |
| Stockage PDF (S3 ou équivalent) | Bloquante | Upload/download | Aucun |

---

**Fin du document — v1.0.**

Ce document est un point de départ. À mettre à jour au fur et à mesure des décisions produit et retours techniques.
