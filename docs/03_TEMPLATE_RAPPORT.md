# 03 — Template Rapport Mutualisé

**Durée estimée** : 4h
**Objectif** : Moteur de rendu des 40 blocs modulaires partagé entre Avis de valeur, Étude locative et Dossier investissement. Panneau Contenu droit (toggles + drag-reorder), mode édition split 50/50, mode preview, export PDF mock.

---

## Architecture conceptuelle

Le template rapport est **le composant le plus structurant du projet**. Il est utilisé par 3 écrans (Avis de valeur, Étude locative, Dossier invest) avec des blocs par défaut différents mais la même infrastructure.

### Principe

- Chaque **bloc** est un composant React autonome qui reçoit ses données et son état d'édition
- Le **moteur** gère l'ordre, l'activation, l'édition inline, le rendu preview/PDF
- Le **panneau Contenu** permet de toggler/réordonner les blocs
- Le **mode édition** est un split 50/50 : éditeur à gauche (liste des blocs + poignées drag), preview à droite (rendu live)
- Le **mode preview** affiche le rendu paginé plein écran
- L'**export PDF** utilise le même rendu preview, imprimé via `window.print()` avec CSS `@media print` dédié

---

## Liste des 40 blocs (référence)

| ID | Nom | Data source | Défaut AdV | Défaut EL | Défaut DI |
|----|-----|-------------|------------|-----------|-----------|
| `couverture` | Couverture | bien + client + conseiller | ✓ | ✓ | ✓ |
| `sommaire` | Sommaire | auto | optionnel | optionnel | optionnel |
| `agence` | Présentation agence | Paramètres Organisation | ✓ | ✓ | ✓ |
| `conseiller` | Présentation conseiller | Profil user | ✓ | ✓ | ✓ |
| `bien` | Présentation du bien | Estimation.bien | ✓ | ✓ | ✓ |
| `photos` | Photos du bien | Upload user | ✓ | ✓ | ✓ |
| `points` | Points forts / à défendre | Inline | ✓ | ✓ | ✓ |
| `cadastre` | Cadastre + parcelle | IGN/data.gouv | optionnel | optionnel | ✓ |
| `urbanisme` | Autorisations urbanisme | Sitadel | optionnel | — | ✓ |
| `historique_ventes` | Historique ventes adresse | DVF filtré | optionnel | — | ✓ |
| `socio_eco` | Éléments socio-économiques | INSEE | ✓ | ✓ | ✓ |
| `profil_cible` | Profil acquéreur/locataire cible | INSEE + calc | ✓ | ✓ | ✓ |
| `budget_revenu` | Budget/revenu nécessaire par profil | Calc | ✓ | ✓ | ✓ |
| `solvabilite` | Solvabilité (profondeur marché) | Filosofi | ✓ | ✓ | ✓ |
| `score_emplacement` | Score emplacement | BPE + OSM | ✓ | ✓ | ✓ |
| `services_proximite` | Services de proximité | BPE + OSM | ✓ | ✓ | ✓ |
| `repartition_logements` | Répartition logements secteur | INSEE | ✓ | ✓ | ✓ |
| `prix_marche` | Prix du marché + heatmap | DVF + annonces | ✓ | — | ✓ |
| `evolution_prix` | Évolution prix 6m/1a/2a | DVF séries | ✓ | — | ✓ |
| `loyers_marche` | Loyers du marché | Annonces | — | ✓ | ✓ |
| `evolution_loyers` | Évolution loyers | Annonces séries | — | ✓ | ✓ |
| `rendement` | Rendement locatif | Calc croisé | — | optionnel | ✓ |
| `tension` | Tension marché (tensiomètre) | Calc interne | ✓ | ✓ | ✓ |
| `delais` | Délais de vente/location | Annonces | ✓ | ✓ | ✓ |
| `comp_vente` | Comparables en vente | Annonces actives | ✓ | — | ✓ |
| `comp_vendus` | Comparables vendus (DVF) | DVF 24m | ✓ | — | ✓ |
| `comp_invendus` | Comparables invendus | Annonces expirées | optionnel | — | optionnel |
| `comp_location` | Comparables à louer | Annonces loc actives | — | ✓ | ✓ |
| `comp_loues` | Comparables loués | Annonces loc expirées | — | ✓ | ✓ |
| `focus_comp` | Focus comparable | 1 comp épinglé | optionnel | optionnel | optionnel |
| `synthese_3_methodes` | Synthèse 3 méthodes | AVM + agrégats | ✓ | ✓ | ✓ |
| `ajustements` | Ajustements feature par feature | AVM | ✓ | ✓ | ✓ |
| `reglementations` | Réglementations locatives | Arrêtés préfectoraux | — | ✓ | optionnel |
| `projet_invest` | Projet investissement | Dossier invest | — | — | ✓ |
| `analyse_financiere` | Analyse financière | Calc invest | — | — | ✓ |
| `fiscalite` | Fiscalité (LMNP, Pinel) | Calc + param | — | optionnel | ✓ |
| `simulation_renov` | Simulation "refait à neuf" | AVM variants | optionnel | — | ✓ |
| `conclusion` | Conclusion + recommandation | Inline | ✓ | ✓ | ✓ |
| `annexes` | Annexes (DPE, diagnostics) | Upload user | ✓ | ✓ | optionnel |
| `footer` | Footer / mentions légales | Paramètres | ✓ | ✓ | ✓ |

---

## Structure des fichiers à créer

```
/src/components/shared/template-rapport/
  TemplateRapport.tsx              ← composant racine (mode split édition/preview)
  PanneauContenu.tsx                ← sidebar droite avec toggles/reorder
  BlocRenderer.tsx                  ← dispatcher : prend un bloc, rend le bon composant
  BlocEditInline.tsx                ← wrapper édition inline avec crayon
  BlocsRegistry.ts                  ← registry de tous les blocs disponibles
  /blocs                            ← un fichier par bloc
    BlocCouverture.tsx
    BlocSommaire.tsx
    BlocAgence.tsx
    BlocConseiller.tsx
    BlocBien.tsx
    BlocPhotos.tsx
    BlocPoints.tsx
    ... (40 blocs au total, mais on peut commencer par les essentiels)
  types.ts                          ← types (Bloc, BlocConfig, RapportConfig)
  useTemplateRapport.ts             ← hook principal (state + actions)

/src/app/test-template/page.tsx     ← page de test pour valider visuellement
```

---

## Types TypeScript

```typescript
// types.ts

export type BlocId = 
  | 'couverture' | 'sommaire' | 'agence' | 'conseiller'
  | 'bien' | 'photos' | 'points' | 'cadastre' | 'urbanisme'
  | 'historique_ventes' | 'socio_eco' | 'profil_cible'
  | 'budget_revenu' | 'solvabilite' | 'score_emplacement'
  | 'services_proximite' | 'repartition_logements'
  | 'prix_marche' | 'evolution_prix' | 'loyers_marche'
  | 'evolution_loyers' | 'rendement' | 'tension' | 'delais'
  | 'comp_vente' | 'comp_vendus' | 'comp_invendus'
  | 'comp_location' | 'comp_loues' | 'focus_comp'
  | 'synthese_3_methodes' | 'ajustements' | 'reglementations'
  | 'projet_invest' | 'analyse_financiere' | 'fiscalite'
  | 'simulation_renov' | 'conclusion' | 'annexes' | 'footer'

export type RapportType = 'avis_valeur' | 'etude_locative' | 'dossier_invest'

export interface BlocDefinition {
  id: BlocId
  label: string
  description?: string
  group: 'identity' | 'bien' | 'marche' | 'comparables' | 'socio' | 'invest' | 'conclusion' | 'annexes'
  defaultActiveBy: Partial<Record<RapportType, boolean>>
  requiredData?: string[]     // liste d'endpoints nécessaires
  editable: boolean            // peut-on éditer inline ?
  pageBreakBefore?: boolean    // forcer saut de page avant ce bloc en PDF
}

export interface BlocConfig {
  id: BlocId
  active: boolean
  order: number
  customContent?: Record<string, unknown>  // override du contenu par l'agent
}

export interface RapportConfig {
  rapportType: RapportType
  style: 'style_1' | 'style_2' | 'style_3'
  blocs: BlocConfig[]
  metadata: {
    titre?: string
    client?: { civilite: string; nom: string; prenom: string }
    conseiller_id: string
    organization_id: string
    bien_id?: string
    estimation_id?: string
  }
}
```

---

## Moteur : `useTemplateRapport`

Hook principal qui gère l'état du rapport, les actions de modification.

```typescript
// useTemplateRapport.ts

export function useTemplateRapport(initialConfig: RapportConfig) {
  const [config, setConfig] = useState(initialConfig)
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [editingBlocId, setEditingBlocId] = useState<BlocId | null>(null)

  return {
    config,
    mode,
    editingBlocId,
    actions: {
      toggleBloc: (id: BlocId) => void,
      reorderBlocs: (from: number, to: number) => void,
      updateBlocContent: (id: BlocId, content: Record<string, unknown>) => void,
      setStyle: (style: 'style_1' | 'style_2' | 'style_3') => void,
      setMode: (mode: 'edit' | 'preview') => void,
      openEditBloc: (id: BlocId) => void,
      closeEditBloc: () => void,
      resetToDefault: () => void,
      saveAsTemplate: () => void,      // sauvegarde comme modèle orga
      exportPDF: () => void,            // window.print() + CSS print
    }
  }
}
```

---

## Panneau Contenu (sidebar droite)

Largeur 320px, sticky, scrollable.

### Structure

```
┌─ Contenu ───────── ✕ ┐
│                       │
│ Style                 │
│ [Style 1 ▾]           │
│                       │
│ ────────────          │
│                       │
│ Blocs actifs          │
│ (drag pour réordonner)│
│                       │
│ ⋮⋮ ☑ Couverture       │
│ ⋮⋮ ☑ Présentation bien│
│ ⋮⋮ ☑ Photos du bien   │
│ ⋮⋮ ▶ Marché local     │
│       ☑ Prix du marché│
│       ☑ Évolution     │
│       ☑ Tension       │
│ ⋮⋮ ▶ Comparables      │
│       ☑ En vente      │
│       ☑ Vendus        │
│       ☐ Invendus      │
│                       │
│ ────────────          │
│                       │
│ Blocs disponibles     │
│ (désactivés)          │
│                       │
│ ☐ Cadastre            │
│ ☐ PLU                 │
│                       │
│ ────────────          │
│                       │
│ [Sauver comme modèle] │
│ [Réinit. par défaut]  │
└───────────────────────┘
```

### Comportement

- Drag sur poignée `⋮⋮` pour réordonner (via `@dnd-kit`)
- Checkbox pour activer/désactiver
- Groupes expandables (Marché local, Comparables) — sous-blocs en retrait
- Deux sections : "Blocs actifs" (ordonnables) et "Blocs disponibles" (inactifs)
- Les blocs disponibles se trient par ordre alphabétique ou par groupe

---

## Mode édition (split 50/50)

### Layout

```
┌──────────────────────────────────────────────────┐
│ Header rapport                                   │
│ [← Retour] · Titre · Statut · [Preview] [PDF] [⋯]│
├───────────────────┬──────────────────────────────┤
│ ÉDITEUR (50%)     │ PREVIEW (50%) — scroll liée  │
│                   │                              │
│ [Bloc Couverture] │ ┌────────────────────┐       │
│ ⋮⋮ [Nom bloc] [✎] │ │                    │       │
│ ─ preview mini ─  │ │  Rendu preview     │       │
│                   │ │  page par page     │       │
│ [Bloc Agence]     │ │                    │       │
│ ⋮⋮ [Nom bloc] [✎] │ │                    │       │
│ ─ preview mini ─  │ │                    │       │
│                   │ │                    │       │
│ [...]             │ │                    │       │
│                   │ │                    │       │
│ [+ Ajouter bloc]  │ └────────────────────┘       │
└───────────────────┴──────────────────────────────┘
```

- **Gauche** : liste compacte des blocs actifs, poignée drag à gauche, nom du bloc, bouton crayon à droite. Un mini-aperçu du contenu sous chaque ligne (2-3 lignes texte ou vignette image)
- **Droite** : preview pleine page du rapport PDF final, scroll synchronisé avec la gauche (clic sur un bloc à gauche → scroll vers lui à droite)

### Édition inline d'un bloc

Clic sur le crayon `[✎]` → ouvre un **popover** ou **modal latérale** pour éditer le contenu du bloc :
- **Blocs texte** (Conclusion, Points forts, Commentaire expert) : textarea WYSIWYG simple (juste gras/italique/liste)
- **Blocs data** (Comparables, Photos) : modale de sélection
- **Blocs visuels** (Couverture, Style) : sélecteur de variantes

---

## Mode preview (plein écran)

Rendu pleine page, largeur max 900px centrée, scroll vertical. Chaque bloc est rendu en grand. Pagination par `.page-break-after` en CSS.

Header du mode preview : bouton "← Retour à l'édition", "Exporter PDF", zoom in/out.

---

## Export PDF (mock V1)

Simple `window.print()` avec CSS `@media print` qui :
- Masque les éléments UI (header, sidebar, panneau Contenu, boutons crayon)
- Affiche uniquement le rendu preview
- Force les sauts de page avant les blocs critiques (`couverture`, `conclusion`, `synthese_3_methodes`)
- Applique des couleurs brandées (violet Propsight)

Pour V2, passer à une lib comme `react-pdf` ou server-side via Puppeteer.

---

## Blocs : implémentation prioritaire

Pour l'étape 03, implémente **uniquement les 10 blocs essentiels** :
1. `couverture`
2. `agence`
3. `conseiller`
4. `bien`
5. `photos`
6. `points`
7. `prix_marche` (pour AdV)
8. `comp_vendus` (pour AdV)
9. `synthese_3_methodes`
10. `conclusion`

Les 30 autres blocs seront ajoutés au fil des étapes suivantes (un bloc par-ci, par-là). Pour l'instant, ils apparaissent dans le panneau Contenu mais sont "inactifs par défaut" et affichent un placeholder si activés.

---

## Registry des blocs

```typescript
// BlocsRegistry.ts

export const BLOCS_REGISTRY: Record<BlocId, BlocDefinition> = {
  couverture: {
    id: 'couverture',
    label: 'Couverture',
    group: 'identity',
    defaultActiveBy: { avis_valeur: true, etude_locative: true, dossier_invest: true },
    editable: true,
    pageBreakBefore: true,
  },
  // ... 40 entrées
}

export const BLOCS_COMPONENTS: Record<BlocId, React.ComponentType<BlocProps>> = {
  couverture: BlocCouverture,
  agence: BlocAgence,
  // ...
}
```

---

## Prompt Claude Code

```
On construit le Template Rapport Mutualisé, composant central utilisé par 3 écrans (Avis de valeur, Étude locative, Dossier invest).

Lis ATTENTIVEMENT /docs/TEMPLATE_RAPPORT.md dans son intégralité avant de commencer. C'est la spec la plus structurante du projet.

Stack : React, TypeScript strict, Tailwind, shadcn, @dnd-kit pour drag-reorder, Zustand pour state si besoin.

1. Crée /src/components/shared/template-rapport/types.ts avec tous les types listés dans la spec (BlocId, BlocDefinition, BlocConfig, RapportConfig, RapportType).

2. Crée /src/components/shared/template-rapport/BlocsRegistry.ts :
   - Objet BLOCS_REGISTRY typé Record<BlocId, BlocDefinition> avec les 40 entrées (cf tableau dans la spec)
   - Objet BLOCS_COMPONENTS typé Record<BlocId, ComponentType> — vide pour l'instant sauf les 10 blocs prioritaires
   - Fonction getDefaultConfig(type: RapportType): BlocConfig[] qui retourne la config par défaut selon le type de rapport

3. Crée /src/components/shared/template-rapport/useTemplateRapport.ts :
   - Hook qui gère le state du rapport
   - Actions : toggleBloc, reorderBlocs, updateBlocContent, setStyle, setMode, openEditBloc, closeEditBloc, resetToDefault, exportPDF
   - Utilise useState ou useReducer selon ta préférence
   - Retourne { config, mode, editingBlocId, actions }

4. Crée les 10 blocs prioritaires dans /src/components/shared/template-rapport/blocs/ :
   Chaque bloc a le même pattern :
   - Props : data (selon type de bloc), isEditing: boolean, onEdit: () => void, customContent?: Record<string, unknown>
   - Rend un <div className="bloc bloc-{id}"> avec le contenu
   - Si isEditing, affiche un bouton crayon [✎] en hover
   
   Blocs à créer :
   - BlocCouverture.tsx : titre "Avis de valeur" ou "Étude locative", date, client, bien (adresse), conseiller (photo + nom), logo agence
   - BlocAgence.tsx : bloc horizontal avec logo agence, nom, adresse, SIRET, contact, courte description
   - BlocConseiller.tsx : photo conseiller, nom, titre, téléphone, email, bio courte
   - BlocBien.tsx : photo bien + carte mini, surface, pièces, étage, année, DPE, GES, caractéristiques
   - BlocPhotos.tsx : grille de 6-8 photos du bien, avec lightbox au clic (optionnel V1)
   - BlocPoints.tsx : 2 colonnes "Points forts" (+) et "Points à défendre" (-), listes éditables inline
   - BlocPrixMarche.tsx : mini-heatmap Leaflet placeholder, 3 valeurs (bas, médian, haut), courbe évolution Recharts
   - BlocCompVendus.tsx : liste de 10 cards comparables vendus (photo, adresse, surface, prix/m², date, score similarité)
   - BlocSynthese3Methodes.tsx : 3 blocs côte à côte (Prix du marché / Comparables / Moteur IA) avec fourchettes, indice fiabilité
   - BlocConclusion.tsx : texte éditable inline + bloc "Notre estimation" avec prix/loyer retenu (toggles €/%/m²)

   Pour les 30 autres blocs, crée un fichier BlocPlaceholder.tsx qui affiche juste "Bloc [nom] — à venir".

5. Crée /src/components/shared/template-rapport/BlocRenderer.tsx :
   - Props : blocConfig: BlocConfig, data: Estimation, isEditing: boolean, onEdit: () => void
   - Dispatcher qui trouve le composant dans BLOCS_COMPONENTS et le rend avec les bonnes props
   - Si le bloc n'existe pas ou inactif, rend null
   - Wrap dans un <div> avec un ID pour scroll sync

6. Crée /src/components/shared/template-rapport/PanneauContenu.tsx :
   - Sidebar droite 320px
   - Section "Style" avec select 3 variantes
   - Section "Blocs actifs" avec liste drag-ordonnable (@dnd-kit) + checkboxes
   - Section "Blocs disponibles" (inactifs)
   - Groupes expandables (Marché local, Comparables, Socio-éco, etc.)
   - Boutons "Sauver comme modèle" et "Réinitialiser" en bas
   - Utilise la spec de la section "Panneau Contenu" dans /docs/TEMPLATE_RAPPORT.md pour le visuel exact

7. Crée /src/components/shared/template-rapport/TemplateRapport.tsx :
   - Composant racine
   - Props : rapportType, estimationData, initialConfig?
   - Mode edit : split 50/50 avec éditeur à gauche (liste blocs compacte avec drag + crayon) et preview à droite (rendu complet)
   - Mode preview : plein écran, largeur max 900px centrée
   - Header avec boutons "Preview" / "Édition" / "Exporter PDF"
   - Panneau Contenu ouvrable via bouton "Contenu ▸" en haut à droite
   - Utilise le hook useTemplateRapport

8. Crée /src/styles/print.css avec les règles @media print :
   - Masque les elements avec class .no-print (header, sidebar, boutons, panneau Contenu)
   - Force page-break-before sur les blocs marqués pageBreakBefore
   - Couleurs brandées conservées (color-adjust: exact)
   - Largeur page A4

9. Crée une page de test /src/app/test-template/page.tsx :
   - Utilise TemplateRapport avec rapportType="avis_valeur"
   - Données mockées : un bien à Paris 15e (cf exemple Yanport)
   - Permet de tester toutes les interactions : toggle, reorder, edit inline, switch mode, export PDF

10. Test visuel via npm run dev :
    - Visite /test-template
    - Vérifie que le split 50/50 fonctionne
    - Drag un bloc dans l'éditeur, vérifie qu'il se réordonne dans la preview
    - Toggle un bloc dans le panneau Contenu, vérifie qu'il apparaît/disparaît
    - Clique crayon sur un bloc texte, édite, vérifie que la preview se met à jour
    - Bascule en mode preview, vérifie le rendu plein écran
    - Clique "Exporter PDF", vérifie que la fenêtre d'impression s'ouvre avec le bon rendu

11. Commit :
    git add -A
    git commit -m "03: template rapport mutualisé + 10 blocs prioritaires + panneau contenu"

IMPORTANT :
- Les 10 blocs prioritaires doivent avoir du contenu REEL (même si mocké), pas juste des placeholders
- Le drag-reorder DOIT fonctionner en temps réel
- Le panneau Contenu DOIT refléter l'état réel (cases cochées = blocs actifs)
- La preview DOIT refléter toutes les modifications en live
- Le style violet Propsight DOIT être appliqué partout (pas de couleurs par défaut shadcn)
- Couleurs et spacings selon DESIGN_SYSTEM.md
- Pas de animations ostentatoires, tout doit être sobre et pro
```

---

## Validation visuelle

- [ ] `/test-template` s'affiche correctement
- [ ] Split 50/50 : éditeur gauche, preview droite
- [ ] Les 10 blocs prioritaires rendent du contenu réel
- [ ] Drag-reorder d'un bloc dans l'éditeur → preview se réordonne
- [ ] Toggle dans panneau Contenu → bloc apparaît/disparaît dans les deux vues
- [ ] Clic sur crayon → édition inline fonctionne
- [ ] Mode preview plein écran fonctionne
- [ ] Export PDF (window.print) rend uniquement le contenu preview, sans UI
- [ ] Style violet Propsight appliqué
- [ ] `npm run build` passe

---

## Étape suivante

Quand validé → `04_WIZARD_CREATION.md`
