# 05 — Modale Sélection Comparables

**Durée estimée** : 2h
**Objectif** : Modale de sélection de biens comparables, utilisée dans le template rapport (bloc `comp_vente`, `comp_vendus`, `comp_location`, `comp_loues`).

---

## Design (inspiration Yanport Agent 360)

Modale plein écran ou 95% viewport, avec carte à gauche et liste à droite.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Ajouter des biens comparables                                    ✕   │
├──────────────────────────────────────────────────────────────────────┤
│ Catégorie                                                            │
│ [Tous ▾]  [✓ Afficher uniquement ma sélection (6)]                  │
│ ─────────────────────────────────────────────────────────────────── │
│ [Biens publiés (Annonce)] [Biens vendus (DVF)]                      │
│ ─────────────────────────────────────────────────────────────────── │
│ Paris (75)  Appartement  Entre 250-330k€  65-75m²  Depuis 6 mois  ▾│
│ ─────────────────────────────────────────────────────────────────── │
│                                                                     │
│ ┌─ Carte Leaflet ──────────────┐ ┌─ Liste (scroll) ──────────────┐ │
│ │                              │ │ [SCORE][LISTE][CARTE]         │ │
│ │    [map interactive]         │ │                               │ │
│ │                              │ │ ☑ Appt 3p 70m²      il y a 6m│ │
│ │    • • •                     │ │ ─ photo ─ 294 000 €  D  4ème  │ │
│ │     • [📍]  •                │ │   95% similaire               │ │
│ │      •                       │ │                               │ │
│ │                              │ │ ☑ Appt 3p 67m²      il y a 5m│ │
│ │                              │ │ ─ photo ─ 254 000 €  D  2ème  │ │
│ │                              │ │   87% similaire               │ │
│ │                              │ │                               │ │
│ │                              │ │ ☐ Appt 3p 71m²      il y a 5m│ │
│ │                              │ │ ─ photo ─ 285 000 €  C  6ème  │ │
│ │                              │ │   71% similaire               │ │
│ │                              │ │                               │ │
│ │                              │ │ [... scroll ...]              │ │
│ └──────────────────────────────┘ └───────────────────────────────┘ │
│                                                                     │
│                       [Quitter]  [Valider ma sélection (6)]        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Structure des fichiers

```
/src/components/shared/modale-comparables/
  ModaleComparables.tsx              ← racine
  CarteComparables.tsx                ← Leaflet avec markers
  ListeComparables.tsx                ← liste scrollable
  CardComparable.tsx                  ← une card dans la liste
  FiltresComparables.tsx              ← barre de filtres
  useComparablesSelection.ts          ← hook state sélection + filtrage
  types.ts                            ← Comparable, FiltresComparables
```

---

## Types

```typescript
// types.ts

export type SourceComparable = 'annonce' | 'dvf'
export type StatutComparable = 'en_vente' | 'vendu' | 'invendu' | 'a_louer' | 'loue'

export interface Comparable {
  id: string
  source: SourceComparable
  statut: StatutComparable
  type_bien: 'appartement' | 'maison'
  adresse: string
  ville: string
  code_postal: string
  lat: number
  lon: number
  surface: number
  nb_pieces: number
  nb_chambres?: number
  etage?: number
  annee_construction?: number
  dpe?: string
  photo_url?: string
  prix?: number           // si vente ou annonce vente
  prix_m2?: number
  loyer?: number          // si location
  loyer_m2?: number
  date_transaction?: string  // pour DVF
  date_publication?: string  // pour annonces
  date_expiration?: string   // pour annonces expirées
  score_similarite: number   // 0 à 1
  description?: string
  parcelle_ref?: string
}

export interface FiltresComparables {
  source: SourceComparable | 'all'
  statuts: StatutComparable[]
  ville?: string
  type_bien?: 'appartement' | 'maison'
  prix_min?: number
  prix_max?: number
  surface_min?: number
  surface_max?: number
  nb_pieces?: number[]
  periode_mois?: number         // "Depuis 6 mois"
}
```

---

## Prompt Claude Code

```
On construit la Modale de sélection des biens Comparables, brique partagée utilisée dans le template rapport.

Lis /docs/shared/MODALE_COMPARABLES.md pour les specs détaillées.

Stack : Leaflet + react-leaflet (déjà installé), shadcn Dialog, Tailwind.

1. Crée /src/components/shared/modale-comparables/types.ts avec les types Comparable, FiltresComparables, SourceComparable, StatutComparable.

2. Crée /src/components/shared/modale-comparables/useComparablesSelection.ts :
   - Hook qui gère :
     * state selectedIds: Set<string>
     * state filtres: FiltresComparables
     * query MSW /api/comparables (TanStack Query) avec filtres en params
     * derivated : visibleComparables (filtrés côté client si besoin)
     * toggleSelection(id), clearSelection(), selectAll(ids)
   - Retourne { comparables, selectedIds, filtres, actions, isLoading }

3. Crée /src/components/shared/modale-comparables/FiltresComparables.tsx :
   - Barre horizontale de filtres façon pills + popovers (inspiration Linear filters)
   - Filtres : Ville, Type de bien, Prix (range), Surface (range), Pièces (multi), Période
   - Toggle "Afficher uniquement ma sélection" (switch)
   - Dropdown "Catégorie" pour basculer annonce / DVF / tous
   - Quand un filtre est actif, pill en violet, sinon outlined

4. Crée /src/components/shared/modale-comparables/CardComparable.tsx :
   - Card dense (pas gonflée)
   - Photo à gauche (carrée 80x80, ou placeholder illustré si pas de photo)
   - Infos à droite :
     * Ligne 1 : "Appt 3p 70m²" + date (ex: "il y a 6 mois")
     * Ligne 2 : Adresse complète
     * Ligne 3 : Prix total + prix/m² + badge statut (En vente / Vendu)
     * Ligne 4 : DPE pill + étage pill + année pill
     * Ligne 5 : Score similarité (pill vert "95% similaire" — couleur dégradée selon score)
   - Checkbox à droite pour sélection
   - Clic sur la card → toggle sélection
   - Clic sur photo → zoom lightbox (V2, juste placeholder V1)

5. Crée /src/components/shared/modale-comparables/ListeComparables.tsx :
   - Liste virtualisée si >50 items (pour l'instant simple map() est OK)
   - Tri : par score de similarité décroissant par défaut
   - Option de tri via dropdown (similarité / prix / date / distance)
   - Header avec nb résultats + actions "Tout sélectionner / Désélectionner"
   - ScrollArea shadcn pour le scroll interne

6. Crée /src/components/shared/modale-comparables/CarteComparables.tsx :
   - MapContainer Leaflet avec tuiles OSM
   - Centré sur le bien cible (marker spécial violet plus gros)
   - Markers pour chaque comparable visible
     * Couleur du marker selon statut (vert vendu, bleu en vente, orange à louer, etc.)
     * Au hover : popup avec résumé (prix, surface, pièces)
     * Au clic : scroll dans la liste vers l'item + toggle sélection
   - Les markers sélectionnés ont un ring + plus gros
   - Zoom automatique pour afficher tous les markers

7. Crée /src/components/shared/modale-comparables/ModaleComparables.tsx :
   - Props : isOpen, onClose, onValidate (selected: Comparable[]) => void, bienCible: {lat, lon, ...}, initialSelection?
   - Dialog shadcn full-screen (ou 95vw / 95vh)
   - Header avec titre + bouton close
   - Onglets "Biens publiés (Annonce)" / "Biens vendus (DVF)" en haut (tabs shadcn)
   - Barre de filtres sous les tabs
   - Split 50/50 : carte à gauche, liste à droite
   - Footer : boutons "Quitter" et "Valider ma sélection (N)" en violet

8. Configure MSW handler /api/comparables :
   - Dans /src/mocks/handlers/comparables.ts
   - Reçoit les params de filtres
   - Retourne 15-20 comparables mockés cohérents (variations de surface, prix, dates)
   - Chaque comparable a un score_similarite calculé en fonction des inputs
   - Utilise /src/mocks/fixtures/comparables.ts pour la liste brute

9. Crée /src/mocks/fixtures/comparables.ts :
   - Array de 30 comparables mockés (mix Paris 15e + Lyon 7e + Bordeaux centre)
   - Photos placeholders via picsum.photos (https://picsum.photos/200?random=N)
   - Dates variées sur les 24 derniers mois
   - DPE variés

10. Crée une page de test /src/app/test-comparables/page.tsx :
    - Bouton "Ouvrir modale"
    - Au submit, affiche les comparables sélectionnés en JSON

11. Test via npm run dev :
    - Visite /test-comparables
    - Ouvre la modale
    - Vérifie carte à gauche avec markers
    - Filtre par prix, vérifie que liste ET carte se mettent à jour
    - Clique plusieurs cards pour sélectionner, observe le compteur en bas
    - Clique un marker sur la carte, vérifie qu'il sélectionne / scroll
    - Bascule Annonces / DVF, vérifie que données changent
    - Toggle "Afficher uniquement ma sélection"
    - Valide la sélection, vérifie callback

12. Commit :
    git add -A
    git commit -m "05: modale comparables + carte Leaflet + liste + filtres"

IMPORTANT :
- Leaflet nécessite que les tuiles CSS soient importées dans globals.css : @import 'leaflet/dist/leaflet.css';
- Fix icônes Leaflet : dans CarteComparables.tsx, configurer les URLs de marker par défaut (bug connu Leaflet + Next.js)
- Le score de similarité doit avoir un code couleur visible (vert >85%, orange 70-85%, gris <70%)
- La performance compte : ne pas re-render toute la liste à chaque toggle
- Responsive : même en 1280px la modale doit rester lisible
```

---

## Validation visuelle

- [ ] Modale s'ouvre en full-screen
- [ ] Carte Leaflet affichée à gauche avec tuiles OSM
- [ ] Marker du bien cible visible et distinctif
- [ ] Markers comparables cliquables
- [ ] Liste comparables à droite, scroll interne
- [ ] Score de similarité visible sur chaque card
- [ ] Filtres fonctionnent (prix, surface, période)
- [ ] Onglets Annonces / DVF changent les données
- [ ] Toggle "Uniquement ma sélection" filtre correctement
- [ ] Compteur "(N)" sur le bouton de validation

---

## Étape suivante

Quand validé → `06_BLOC_SOLVABILITE.md`
