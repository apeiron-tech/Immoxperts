# 10 — Estimation Rapide (module complet)

**Durée estimée** : 4h
**Objectif** : Sous-module Estimation rapide de bout en bout : page d'accueil, 4 flows de création, écran principal, auto-save, promouvoir en avis de valeur.

---

## Écrans à construire

1. **`/app/estimation/rapide`** — Page d'accueil (liste + KPI + split button création)
2. **Modale de création** — dispatch vers 4 modes
3. **Flow URL annonce** — paste URL + prévisualisation + confirmation
4. **Flow saisie manuelle** — wizard 3 étapes (déjà fait en étape 04)
5. **Flow bien portefeuille** — modale de sélection bien
6. **`/app/estimation/rapide/[id]`** — Écran principal (formulaire + résultat)

---

## 1. Page d'accueil

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Estimation rapide · 47                                          │
│ [🔍 rechercher]  [≡ filtres]  [⊞⊟]  [+ Nouvelle estimation ▾]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌──────────┬──────────┬──────────┐  → 4 leads à qualifier      │
│ │ Ce mois  │ Conversion│ Widget   │     Voir mon pipeline       │
│ │ 47 ↑12%  │ en AdV    │ public   │                             │
│ │          │ 32%       │ 12       │                             │
│ └──────────┴──────────┴──────────┘                              │
│                                                                 │
│ [Chips filtres actifs]                                          │
│                                                                 │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                    │
│ │ Card 1 │ │ Card 2 │ │ Card 3 │ │ Card 4 │                    │
│ └────────┘ └────────┘ └────────┘ └────────┘                    │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐                    │
│ │ Card 5 │ │ Card 6 │ │ Card 7 │ │ Card 8 │                    │
│ └────────┘ └────────┘ └────────┘ └────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Split button "+ Nouvelle estimation ▾"

Mode prioritaire : **Depuis une annonce**
Dropdown :
- Depuis une annonce (prioritaire)
- Saisie manuelle
- Depuis un bien du portefeuille

(Pas "depuis une estimation existante" car c'est déjà le sous-module le plus basique.)

### Empty state

Quand aucune estimation, afficher 4 cards CTA éducatives + lien "Voir un exemple".

---

## 2. Flow URL annonce

Modale ou drawer :

```
┌─ Nouvelle estimation depuis une annonce ───────────────── ✕ ┐
│                                                             │
│  Collez l'URL d'une annonce immobilière                    │
│  ┌───────────────────────────────────────┐ [Analyser]      │
│  │ https://www.leboncoin.fr/...          │                 │
│  └───────────────────────────────────────┘                 │
│                                                             │
│  Sources supportées :                                       │
│  • Leboncoin  • SeLoger  • Bien'ici  • PAP  • Logic-immo  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Après clic "Analyser" :

```
┌─ Annonce détectée ──────────────────────────────────────── ✕ ┐
│                                                              │
│  [photo]   Appartement · 3p · 52m²                          │
│            12 rue Exemple, 75015 Paris                      │
│            450 000 € · 8 653 €/m²                           │
│            DPE : C                                          │
│                                                              │
│  ─────────────────────────────────────────────              │
│                                                              │
│  ✓ Champs préremplis (depuis l'annonce)                     │
│    Type, surface, pièces, prix affiché, DPE                 │
│                                                              │
│  ⚠ À vérifier                                                │
│    Adresse (floutée, à confirmer sur carte)                 │
│                                                              │
│  ? Non disponibles (à compléter)                            │
│    État du bien, étage, année, exposition, équipements      │
│                                                              │
│  ─────────────────────────────────────────────              │
│                                                              │
│  [Photos de l'annonce — ne seront pas importées]            │
│  [img1] [img2] [img3] [+ 4]                                 │
│                                                              │
│                            [Retour]  [Continuer → wizard]   │
└──────────────────────────────────────────────────────────────┘
```

Le "Continuer" ouvre le wizard 3 étapes (étape 04) avec les champs pré-remplis.

---

## 3. Flow bien portefeuille

Modale simple avec liste filtrable des biens du portefeuille :

```
┌─ Sélectionner un bien du portefeuille ──────────────────── ✕ ┐
│                                                              │
│  [🔍 rechercher]                                             │
│  [Filtres : type, ville, statut]                             │
│                                                              │
│  ┌──────┐ Appartement 3p 52m²                                │
│  │ 📷   │ 12 rue Exemple, 75015 Paris                       │
│  │      │ Mandat exclusif · Sophie L.                       │
│  └──────┘                                          [→]       │
│                                                              │
│  ┌──────┐ Maison 5p 120m²                                   │
│  │ 📷   │ 8 av des Tilleuls, 92100 Boulogne                 │
│  │      │ Prospection · Sophie L.                           │
│  └──────┘                                          [→]       │
│                                                              │
│  [... scroll ...]                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Clic sur un bien → navigation directe vers l'écran principal avec infos pré-remplies.

---

## 4. Écran principal

### Layout (1440px)

```
┌──────────────────────────────────────────────────────────────────┐
│ ← Estimation rapide · 16 rue du Hameau, 75015 Paris              │
│ ● Sauvegardé il y a 2s         [Sauvegarder] [Promouvoir ▾]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─ Formulaire (60%) ─────────────┐  ┌─ Résultat (40%) ────────┐ │
│ │                                 │  │                          │ │
│ │ LOCALISATION                    │  │ Prix estimé              │ │
│ │ [Adresse autocomplete]          │  │ 421 000 €                │ │
│ │                                 │  │ 10 024 €/m²              │ │
│ │ TYPE                            │  │ [●●●●○] Confiance fort   │ │
│ │ [Maison][Appart][Terr][Park]    │  │ Fourchette 399k-445k €   │ │
│ │                                 │  │                          │ │
│ │ CARACTÉRISTIQUES                │  │ Loyer estimé             │ │
│ │ Surface [_] Pièces [_]          │  │ 1 340 €                  │ │
│ │ Chambres [_] Étage [_]          │  │ 31.9 €/m² · Rdt 3.8%     │ │
│ │                                 │  │                          │ │
│ │ Année [_] DPE [A-G]             │  │ ── Ajustements ──        │ │
│ │ GES [A-G]                       │  │ + Refait à neuf +8.1%    │ │
│ │                                 │  │ + Balcon +1.2%           │ │
│ │ État [select 6]                 │  │ − Année 1960 −3.0%       │ │
│ │                                 │  │ − DPE E −0.8%            │ │
│ │ CARACTÉRISTIQUES                │  │ Voir tous les détails →  │ │
│ │ Pills équipements               │  │                          │ │
│ │                                 │  │ ── Solvabilité ──        │ │
│ │                                 │  │ 18% des ménages          │ │
│ │                                 │  │ Médiane quartier 27%     │ │
│ │                                 │  │ [Slider prix interactif] │ │
│ │                                 │  │                          │ │
│ │                                 │  │ ── Comparables (5) ──    │ │
│ │                                 │  │ [mini-cards]             │ │
│ │                                 │  │ Voir tous (47) →         │ │
│ │                                 │  │                          │ │
│ │                                 │  │ ── Actions rapides ──    │ │
│ │                                 │  │ [Promouvoir en AdV]      │ │
│ │                                 │  │ [Créer étude locative]   │ │
│ │                                 │  │ [Analyser en invest]     │ │
│ │                                 │  │ [Créer lead]             │ │
│ │                                 │  │ [Suivre ce bien ♡]       │ │
│ └─────────────────────────────────┘  └──────────────────────────┘ │
│                                                                  │
│ ─────── Historique récent (horizontal scroll) ───────           │
│ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │
│ │Est.│ │Est.│ │Est.│ │Est.│ │Est.│ │Est.│ │Est.│ │Est.│        │
│ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘        │
└──────────────────────────────────────────────────────────────────┘
```

---

## Comportements clés

### Auto-save

- Estimation en mémoire par défaut
- Déclencheurs sauvegarde :
  - 60s après début de saisie (minimum : adresse + type + surface)
  - Action "Promouvoir" (force sauvegarde)
  - Bouton "Sauvegarder" explicite
- Indicateur en haut : `● Non sauvegardé` / `● Enregistrement...` / `● Sauvegardé il y a 2s`

### Estimation live

- À chaque modification d'un champ critique (adresse, type, surface, pièces, état, DPE) : appel AVM debouncé 500ms
- Panneau résultat se met à jour (skeleton loader pendant fetch)

### Promouvoir

Bouton split `[Promouvoir ▾]` :
- Promouvoir en avis de valeur → crée nouvel objet AdV + redirection vers éditeur
- Promouvoir en étude locative → idem pour EL
- Analyser en investissement → ouvre modal 7 tabs (V2 en stub pour l'instant)

---

## Prompt Claude Code

```
On construit le sous-module Estimation rapide complet.

Lis :
- /docs/ARCHITECTURE_ESTIMATION.md (section 8)
- /docs/modules/estimation/ESTIMATION_RAPIDE.md
Et utilise les briques communes déjà construites (Wizard, Modale Comparables, Bloc Solvabilité, Template Rapport, composants shared).

1. Crée /src/types/estimation.ts avec le type complet Estimation (cf spec section 2.1 archi).

2. Configure MSW handlers /src/mocks/handlers/estimations.ts :
   - GET /api/estimations?type=rapide&status=...&... → liste
   - POST /api/estimations → crée
   - GET /api/estimations/[id] → détail
   - PATCH /api/estimations/[id] → update (auto-save)
   - POST /api/estimations/[id]/promote → crée un nouveau type (avis_valeur / etude_locative)
   - GET /api/estimations/kpi?type=rapide → retourne { ce_mois, conversion_avis_valeur, via_widget, leads_a_qualifier }
   - Fixtures dans /src/mocks/fixtures/estimations.ts avec ~20 estimations variées

3. Crée /src/mocks/handlers/biens-portefeuille.ts :
   - GET /api/biens?user_id=... → liste des biens du portefeuille
   - Fixtures dans /src/mocks/fixtures/biens.ts

4. Crée /src/mocks/handlers/scraping-annonce.ts :
   - POST /api/annonces/parse-url avec body { url } → retourne les infos extraites
   - Détecte la source (leboncoin, seloger, etc.) via regex URL
   - Retourne un objet { source, adresse_floue, type_bien, surface, nb_pieces, prix, photos[], dpe, description, champs_fiables: [], champs_incertains: [], champs_manquants: [] }
   - Délai 800ms pour simuler scraping

5. Crée /src/services/estimations.ts :
   - Fonctions typées pour appeler les endpoints via fetch
   - listEstimations, getEstimation, createEstimation, updateEstimation, promoteEstimation, getKPI
   - Toutes typées avec TS

6. Crée /src/hooks/useEstimations.ts :
   - useEstimationsQuery(filters) : TanStack useQuery
   - useEstimationMutation() : createEstimation, updateEstimation (avec optimistic updates)
   - useEstimationAutoSave(estimation, isDirty) : hook qui auto-save toutes les 60s si modifications

7. Crée /src/components/estimation/rapide/KPIRow.tsx :
   - 3 KPICard + 1 Card "lien vers pipeline"
   - Data via useQuery /api/estimations/kpi?type=rapide

8. Crée /src/components/estimation/rapide/EstimationCard.tsx :
   - Card pour la grille (1440px : 4 par ligne)
   - Photo/visu, adresse, type, prix, statut badge, client, auteur, date modif, ♡
   - Clic → navigate vers /app/estimation/rapide/[id]
   - Menu ⋯ : dupliquer, archiver, supprimer, créer avis de valeur

9. Crée /src/components/estimation/rapide/EstimationRow.tsx :
   - Ligne de tableau pour vue dense
   - Colonnes : photo, adresse, type, surface, pièces, prix, statut, client, auteur, modifié, actions

10. Crée /src/components/estimation/rapide/ListeEstimations.tsx :
    - Props : estimations, viewMode ('cards' | 'table')
    - Rend soit grille de cards, soit tableau
    - Empty state si liste vide

11. Crée /src/components/estimation/rapide/FiltresEstimations.tsx :
    - Panel latéral droit ou popover au clic sur "≡ filtres"
    - Filtres : période, auteur, statut, ville, type, source
    - Chips actifs en haut de page avec suppression individuelle

12. Crée /src/components/estimation/rapide/SplitButtonCreation.tsx :
    - Button "+ Nouvelle estimation" avec caret à droite
    - Clic principal → ouvre mode prioritaire (URL annonce)
    - Clic caret → DropdownMenu avec 3 modes

13. Crée /src/components/estimation/rapide/ModaleCreationUrl.tsx :
    - Modale avec Input URL + bouton "Analyser"
    - Appel /api/annonces/parse-url au clic
    - Affiche le résultat avec badges (prérempli / à vérifier / manquant)
    - Bouton "Continuer → wizard" qui ouvre le WizardCreation avec données préremplies

14. Crée /src/components/estimation/rapide/ModaleCreationBienPortefeuille.tsx :
    - Modale liste des biens via useQuery /api/biens
    - Recherche + filtres
    - Clic sur un bien → POST /api/estimations (crée objet) + navigate vers /app/estimation/rapide/[id]

15. Crée /src/app/(app)/estimation/rapide/page.tsx :
    - Header : titre + compteur + search + filtres + toggle vue + split button
    - <KPIRow />
    - <ListeEstimations />
    - Gère les filtres via URL search params (pour bookmarkable)

16. Crée /src/components/estimation/rapide/EcranPrincipal.tsx :
    - Props : estimationId
    - Header : retour + adresse + status sauvegarde + boutons Sauvegarder / Promouvoir
    - Split 60/40 :
      * Gauche : formulaire (inputs localisation, type, caractéristiques, année, DPE, état, équipements)
      * Droite : panneau résultat (prix + fourchette + confidence, loyer + rendement, ajustements top 5, BlocSolvabilite compact, mini-liste 5 comparables, panneau actions rapides)
    - Historique horizontal en bas : 8 dernières estimations de l'user
    - Debounce AVM 500ms à chaque modif
    - Auto-save 60s via useEstimationAutoSave

17. Crée /src/app/(app)/estimation/rapide/[id]/page.tsx :
    - Récupère id depuis params
    - Query useEstimation(id)
    - Rend <EcranPrincipal estimationId={id} />

18. Dans MSW /api/avm/estimate, renvoie aussi :
    - Les comparables (top 5)
    - Les ajustements
    - Intégré au contrat AVM complet (cf /docs/api/CONTRAT_AVM.md)

19. Test de bout en bout via npm run dev :
    - Visite /app/estimation/rapide → page d'accueil vide (empty state éducatif)
    - Crée une estimation via URL mock, puis via saisie manuelle, puis via bien portefeuille
    - Vérifie que les 3 apparaissent dans la liste
    - Filtre par période, vérifie que la liste se met à jour
    - Toggle vue cards/table
    - Clique une estimation → écran principal
    - Modifie un champ → vérifie estimation live + auto-save après 60s
    - Promouvoir en avis de valeur → vérifie création + redirection
    - Navigation ⌘K fonctionne toujours

20. Commit :
    git add -A
    git commit -m "10: estimation rapide complète (liste, 4 flows création, écran principal, auto-save, promouvoir)"

IMPORTANT :
- Réutilise WizardCreation (étape 04), pas de duplication
- Réutilise BlocSolvabilite (étape 06) dans le panneau résultat
- Auto-save via hook réutilisable, pas de setInterval direct dans le composant
- Toutes les mutations ont optimistic updates via TanStack Query
- Les statuts de sauvegarde sont visibles et clairs
- L'écran principal doit tenir en 1440px sans scroll horizontal
```

---

## Validation

- [ ] Page `/app/estimation/rapide` s'affiche avec KPI + liste ou empty state
- [ ] Split button + dropdown fonctionnent (3 modes)
- [ ] Flow URL : paste URL, résultat parsing, continue vers wizard pré-rempli
- [ ] Flow saisie manuelle : wizard s'ouvre, création aboutit
- [ ] Flow bien portefeuille : sélection → estimation créée avec données biennées
- [ ] Écran principal : split formulaire/résultat, estimation live
- [ ] Auto-save à 60s fonctionne (observer timer)
- [ ] Bouton "Sauvegarder" manuel fonctionne
- [ ] Promouvoir en AdV crée un nouveau type et redirige
- [ ] Historique horizontal en bas navigable
- [ ] Filtres de liste fonctionnent
- [ ] Toggle vue cards/tableau persiste (localStorage via Zustand)

---

## Étape suivante

Quand validé → `11_AVIS_DE_VALEUR.md`
