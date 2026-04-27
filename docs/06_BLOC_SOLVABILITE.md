# 06 — Bloc Solvabilité / Profondeur de marché

**Durée estimée** : 2h
**Objectif** : Composant interactif affichant la part de population éligible à acheter/louer le bien, avec slider prix, benchmark quartier, répartition par profil de foyer.

---

## Contexte produit

Différenciateur Propsight majeur, inexistant chez Yanport/Cityscan/ImmoData. Logique :
- **Avis de valeur** (vente) : mesure la profondeur de marché acheteur ("X% des ménages peuvent acheter ce bien")
- **Étude locative** : mesure l'accessibilité réelle du loyer ("X% des ménages peuvent louer")
- **Dossier invest** : mesure la robustesse de la demande locative derrière le rendement

Interactif : l'agent peut bouger un slider de prix → voir le % éligible changer en temps réel. Permet d'argumenter en RDV : "à 272k€ on touche 28% du marché, à 285k€ on tombe à 18%".

---

## Structure visuelle

```
┌─ Solvabilité / Profondeur de marché ──────────────────────── [ℹ️] ┐
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                                                          │   │
│  │              18 %                                        │   │
│  │              des ménages peuvent acheter ce bien         │   │
│  │                                                          │   │
│  │  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  0%            18%               médiane 27%      100%   │   │
│  │                                                          │   │
│  │  [!] En dessous de la médiane du quartier                │   │
│  │  Votre bien cible une clientèle plus restreinte.         │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Simuler un autre prix :                                         │
│  ├──────[●]──────────────────────────────────────┤              │
│  250k€  272k€                                    500k€           │
│                                                                  │
│  ─────────────────────────────────────────────────               │
│                                                                  │
│  Par profil de foyer                                             │
│                                                                  │
│  👤  Personne seule     12%  ───────                             │
│  👥  Couple              32%  ───────────                        │
│  👨‍👩‍👧 Famille              8%  ──                                 │
│  👩‍👦 Monoparentalité     4%  ─                                   │
│                                                                  │
│  ─────────────────────────────────────────────────               │
│                                                                  │
│  Hypothèses de calcul [▾]                                        │
│                                                                  │
│  Taux d'intérêt : 3.63% (Banque de France, avril 2026)          │
│  Durée d'emprunt : [25 ans ▾]                                    │
│  Apport : [10 % ▾]                                               │
│  Taux d'endettement max : [33 % ▾]                               │
│  Zone de référence : Paris 15e + communes limitrophes           │
│  Source : INSEE Filosofi 2022                                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Variante "Étude locative"

Même composant mais avec :
- Règle "3x le loyer" (pas de calc emprunt)
- Libellé : "Dossiers éligibles au filtre bailleur" (pas "ménages solvables")
- Slider sur le loyer au lieu du prix
- Hypothèses simplifiées (juste le ratio 3x)

---

## Structure des fichiers

```
/src/components/shared/bloc-solvabilite/
  BlocSolvabilite.tsx                ← composant racine
  JaugePartEligible.tsx              ← jauge horizontale principale
  SliderPrix.tsx                     ← slider interactif
  RepartitionProfils.tsx             ← répartition par foyer
  HypothesesCalcul.tsx               ← panel dépliable
  useSolvabilite.ts                  ← hook + appel API + calcs
  types.ts
```

---

## Types

```typescript
// types.ts

export type TypeTransaction = 'achat' | 'location'

export interface HypothesesEmprunt {
  taux_bdf: number        // ex: 0.0363
  duree_annees: number    // défaut 25
  apport_pct: number      // défaut 0.10
  endettement_max: number // défaut 0.33
}

export interface SolvabiliteResponse {
  zone_reference: {
    type: string
    code_zone: string
    nb_communes: number
    population: number
    nb_menages: number
  }
  distribution_revenus: {
    d1: number; d2: number; d3: number; d4: number; d5: number
    d6: number; d7: number; d8: number; d9: number
    source: string
  }
  revenu_necessaire: number
  part_eligible: number
  benchmark_quartier: {
    part_eligible_mediane_ventes_12m: number
    positionnement: 'en_dessous_mediane' | 'proche_mediane' | 'au_dessus_mediane'
    message: string
  }
  repartition_profils: {
    personne_seule: number
    couple: number
    famille: number
    monoparentalite: number
  }
  hypotheses: HypothesesEmprunt | { regle_locative: string }
}
```

---

## Prompt Claude Code

```
On construit le Bloc Solvabilité / Profondeur de marché, différenciateur produit majeur de Propsight.

Lis /docs/shared/BLOC_SOLVABILITE.md pour le détail.

Stack : Recharts pour mini-graphes, shadcn Slider, Tailwind.

1. Crée /src/components/shared/bloc-solvabilite/types.ts avec les types cf spec.

2. Crée /src/components/shared/bloc-solvabilite/useSolvabilite.ts :
   - Hook qui appelle MSW /api/solvabilite via TanStack Query
   - Params : bien_id, prix_ou_loyer, typeTransaction, hypotheses
   - Retourne SolvabiliteResponse + loading
   - Recalcul en live quand prix change (debounce 300ms)

3. Crée /src/components/shared/bloc-solvabilite/JaugePartEligible.tsx :
   - Barre horizontale pleine largeur, hauteur 12px
   - Gradient de fond : rouge-orange-vert (0 à 100%)
   - Ou plus simple : fond gris, fill violet-500 pour la part éligible
   - Marker "médiane quartier" avec petit triangle pointant vers le bas
   - Tooltip au hover sur la barre expliquant la valeur
   - Labels sous la barre : 0%, la valeur, la médiane, 100%

4. Crée /src/components/shared/bloc-solvabilite/SliderPrix.tsx :
   - Props : value, onChange, min, max, step, typeTransaction
   - Utilise shadcn Slider avec handle violet
   - Affichage dual : curseur + valeur en label
   - Marque la valeur d'origine (estimation du moteur) avec un tick différent
   - Min / Max bornés : typiquement [prix_estimé * 0.7, prix_estimé * 1.3]

5. Crée /src/components/shared/bloc-solvabilite/RepartitionProfils.tsx :
   - Liste de 4 lignes (Personne seule, Couple, Famille, Monoparentalité)
   - Chaque ligne : icône + label + % + barre horizontale proportionnelle
   - Code couleur : violet-500 pour le % du profil, fond gris clair pour la base
   - Taille compacte, pas de gros icônes

6. Crée /src/components/shared/bloc-solvabilite/HypothesesCalcul.tsx :
   - Accordion/Collapsible shadcn, fermé par défaut
   - Section "Hypothèses de calcul" dépliable
   - Affiche les hypothèses actuelles en lecture
   - Permet de modifier : durée (select 15/20/25 ans), apport (slider 0-30%), endettement (select 30/33/35/40%)
   - Un bouton "Réinitialiser" pour remettre les défauts
   - En bas, texte : "Zone de référence : [zone] — Source : INSEE Filosofi 2022"

7. Crée /src/components/shared/bloc-solvabilite/BlocSolvabilite.tsx :
   - Composant racine
   - Props : bien_id, prix_initial, typeTransaction: 'achat' | 'location'
   - Layout vertical :
     * Titre "Solvabilité / Profondeur de marché" + ℹ tooltip expliquant la méthodo
     * Carte centrale avec grand chiffre % + jauge + phrase d'interprétation + benchmark
     * Slider prix avec labels
     * RepartitionProfils
     * HypothesesCalcul dépliable
   - Utilise useSolvabilite pour data + recalcul live

8. Configure MSW handler /api/solvabilite :
   - Dans /src/mocks/handlers/solvabilite.ts
   - Reçoit { bien_id, prix_ou_loyer, typeTransaction, hypotheses }
   - Calcul mock plausible :
     * Distribution revenus fixe pour Paris (d1: 1200, d5: 2500, d9: 5100)
     * Revenu nécessaire = prix * (1 - apport) / duree / mensualités → simplifié
     * part_eligible = interpolation décile atteint
     * benchmark_quartier : valeur mockée proche 0.25-0.30
     * repartition_profils : pourcentages mockés plausibles
   - Délai 200ms

9. Crée une page de test /src/app/test-solvabilite/page.tsx :
   - Affiche le bloc avec prix initial 272000
   - Typetransaction = 'achat'
   - Permet de changer le prix via le slider et de voir le % changer

10. Test via npm run dev :
    - Visite /test-solvabilite
    - Bouge le slider de prix, observe le % se mettre à jour
    - Déplie les hypothèses, change la durée d'emprunt, observe changement
    - Vérifie que le benchmark quartier est visible et comparé

11. Commit :
    git add -A
    git commit -m "06: bloc solvabilité interactif + MSW handler"

IMPORTANT :
- Le recalcul DOIT être debouncé 300ms (sinon trop d'appels au slider)
- Le chiffre central (18%) doit être énorme et lisible (text-5xl font-bold)
- La jauge doit avoir une animation smooth (transition-all duration-300)
- Le nommage doit être précis :
  * Pour achat : "ménages éligibles à l'emprunt"
  * Pour location : "dossiers éligibles au filtre 3× loyer"
- Ne JAMAIS dire "solvables" (imprécis juridiquement)
```

---

## Validation visuelle

- [ ] Bloc s'affiche avec grand chiffre % au centre
- [ ] Jauge horizontale avec marker médiane quartier
- [ ] Phrase d'interprétation cohérente (rouge/orange/vert selon positionnement)
- [ ] Slider prix fonctionne : bouger = % change (debouncé)
- [ ] Répartition par profil affichée avec barres
- [ ] Hypothèses dépliables, modifiables
- [ ] En mode location, libellés adaptés ("3× loyer", pas d'emprunt)

---

## Étape suivante

Quand validé → `10_ESTIMATION_RAPIDE.md`
