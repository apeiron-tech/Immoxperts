# 04 — Wizard de Création (3 étapes)

**Durée estimée** : 2h
**Objectif** : Wizard 3 étapes réutilisable pour saisie manuelle d'une estimation, utilisé par Estimation rapide, Avis de valeur, Étude locative.

---

## Structure

```
/src/components/shared/wizard-creation/
  WizardCreation.tsx                ← composant racine
  Step1Caracteristiques.tsx         ← étape 1 (obligatoire)
  Step2Details.tsx                  ← étape 2 (facultatif)
  Step3Complementaires.tsx          ← étape 3 (facultatif)
  useWizardCreation.ts              ← hook state + navigation
  types.ts                          ← WizardFormData
```

---

## Design général

Modale large (900px), 3 steps matérialisés en haut (pattern Yanport Agent 360) :

```
┌────────────────────────────────────────────────────────────────┐
│ Création d'une nouvelle estimation                         ✕   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ●─────────── ○─────────── ○                                  │
│  Caractéristiques   Détails       Informations                 │
│  principales        (facultatif)  complémentaires              │
│                                   (facultatif)                 │
│                                                                │
│ ─────────────────────────────────────────────                  │
│                                                                │
│ [Contenu de l'étape active]                                    │
│                                                                │
│                                                                │
│                                                                │
│ ─────────────────────────────────────────────                  │
│                                                                │
│ Estimation du bien                                             │
│ [      € ] 💡 Indice de fiabilité : faible                    │
│                                                                │
│              [Annuler]  [Continuer →]  [Créer l'estimation ▸] │
└────────────────────────────────────────────────────────────────┘
```

- **Stepper visuel en haut** : les étapes 2 et 3 ont le label "(facultatif)" gris
- **Estimation en bas** : champ lié au moteur AVM, mis à jour en live quand les champs critiques changent
- **Boutons bas droite** :
  - "Continuer →" passe à l'étape suivante
  - "Créer l'estimation ▸" peut être cliqué à n'importe quelle étape (skip les suivantes)
  - "Annuler" à gauche ferme la modale

---

## Étape 1 — Caractéristiques principales (obligatoire)

### Champs

```
┌─ À qui s'adresse cette estimation ? ─────────────────────────┐
│                                                              │
│  Titre          Nom & prénom                                 │
│  [Mme ▾]        [______________________]                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Le bien ────────────────────────────────────────────────────┐
│                                                              │
│  Adresse du bien *                                           │
│  [____________________________]  [🗺 Chercher sur la carte]  │
│                                                              │
│  Type de bien *                                              │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                    │
│  │ 🏠   │  │ 🏢   │  │ 🌳   │  │ 🅿    │                    │
│  │Maison│  │Appart│  │Terr. │  │Park. │                    │
│  └──────┘  └──────┘  └──────┘  └──────┘                    │
│                                                              │
│  Caractéristiques *                                          │
│  Surface        Pièces      Chambres     Étage               │
│  [____] m²     [__]         [__]          [__]               │
│                                                              │
│  Nb étages immeuble     Surface terrain (si maison)          │
│  [__]                    [____] m²                           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Comportement

- **Adresse** : autocomplete via endpoint MSW `/api/ban/search?q=...`, résultats avec lat/lon + IRIS
- **Type de bien** : 4 cards cliquables XL, une seule sélectionnée (style radio visuel)
- **Validation** : adresse + type + surface + pièces obligatoires pour passer à étape 2 ou créer
- Quand tous les champs critiques sont remplis : appel AVM debouncé 500ms → estimation live en bas

---

## Étape 2 — Détails (facultatif)

```
┌─ Équipements ────────────────────────────────────────────────┐
│                                                              │
│  [ ] Ascenseur    [ ] Gardien     [ ] Interphone            │
│  [ ] Fibre        [ ] Piscine     [ ] Balcon                │
│  [ ] Terrasse     [ ] Parking     [ ] Cave                  │
│  [ ] Vue          [ ] Calme       [ ] Cheminée              │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Caractéristiques ───────────────────────────────────────────┐
│                                                              │
│  Année de construction      État du bien                     │
│  [____]                      [Refait à neuf ▾]               │
│                                                              │
│  Exposition                  Vue                             │
│  [Sud ▾]                     [Dégagée ▾]                     │
│                                                              │
│  Niveau sonore               Occupation                      │
│  [Calme ▾]                   [Libre ▾]                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Performances énergétiques ──────────────────────────────────┐
│                                                              │
│  DPE                                                         │
│  [A] [B] [C] [D] [E] [F] [G]  (sélecteur visuel coloré)     │
│                                                              │
│  GES                                                         │
│  [A] [B] [C] [D] [E] [F] [G]                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Chauffage ──────────────────────────────────────────────────┐
│                                                              │
│  Mode          Type                                          │
│  [Individuel ▾][Gaz ▾]                                       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

- Utilise `DPESelector` et `GESSelector` du design system
- Le prix estimé se met à jour à chaque modification

---

## Étape 3 — Complémentaires (facultatif)

```
┌─ Description ────────────────────────────────────────────────┐
│                                                              │
│  Description libre du bien                                   │
│  [textarea 5 lignes]                                         │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Points forts et à défendre ─────────────────────────────────┐
│                                                              │
│  Points forts                 Points à défendre              │
│  [+ Ajouter]                  [+ Ajouter]                    │
│  1. Emplacement recherché     1. DPE                         │
│  2. Balcon                    2. Travaux à prévoir           │
│  3. ...                                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘

┌─ Finances ───────────────────────────────────────────────────┐
│                                                              │
│  Charges mensuelles    Taxe foncière annuelle               │
│  [____] €              [____] €                              │
│                                                              │
│  Nombre de lots copro.                                       │
│  [____]                                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Form validation (Zod)

```typescript
const wizardSchema = z.object({
  // Step 1 (obligatoire)
  client_civilite: z.enum(['M', 'Mme', 'Mlle']),
  client_nom: z.string().min(1),
  client_prenom: z.string().min(1),
  adresse: z.object({
    label: z.string(),
    lat: z.number(),
    lon: z.number(),
    iris_code: z.string(),
    ban_id: z.string(),
  }),
  type_bien: z.enum(['maison', 'appartement', 'terrain', 'parking']),
  surface: z.number().positive(),
  nb_pieces: z.number().int().positive(),
  nb_chambres: z.number().int().nonnegative().optional(),
  etage: z.number().int().optional(),
  nb_etages: z.number().int().positive().optional(),
  surface_terrain: z.number().nonnegative().optional(),

  // Step 2 (facultatif)
  equipements: z.array(z.string()).default([]),
  annee_construction: z.number().int().optional(),
  etat: z.enum(['neuf', 'refait_a_neuf', 'bon', 'a_rafraichir', 'a_renover', 'a_restructurer']).optional(),
  exposition: z.string().optional(),
  vue: z.string().optional(),
  niveau_sonore: z.enum(['calme', 'normal', 'bruyant']).optional(),
  occupation: z.enum(['libre', 'occupe_proprietaire', 'loue']).optional(),
  dpe: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'inconnu']).default('inconnu'),
  ges: z.enum(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'inconnu']).default('inconnu'),
  mode_chauffage: z.enum(['individuel', 'collectif']).optional(),
  type_chauffage: z.enum(['electrique', 'gaz', 'fioul', 'pompe_chaleur', 'bois', 'autre']).optional(),

  // Step 3 (facultatif)
  description: z.string().optional(),
  points_forts: z.array(z.string()).default([]),
  points_defendre: z.array(z.string()).default([]),
  charges_mensuelles: z.number().nonnegative().optional(),
  taxe_fonciere: z.number().nonnegative().optional(),
  nb_lots_copro: z.number().int().positive().optional(),
})

type WizardFormData = z.infer<typeof wizardSchema>
```

---

## Prompt Claude Code

```
On construit le Wizard de Création d'estimation, composant partagé utilisé par Estimation rapide, Avis de valeur, Étude locative.

Lis /docs/shared/WIZARD_CREATION.md pour le détail complet.

Stack : React Hook Form + Zod, shadcn Dialog, Tailwind.

1. Crée /src/components/shared/wizard-creation/types.ts :
   - Schema Zod complet (cf spec)
   - Type WizardFormData exporté

2. Crée /src/components/shared/wizard-creation/useWizardCreation.ts :
   - Hook qui gère :
     * state currentStep (1, 2, 3)
     * form via useForm<WizardFormData>({ resolver: zodResolver(wizardSchema) })
     * avmEstimation : state du prix estimé live + confidence
     * appel AVM debouncé à chaque change des champs critiques (adresse, type, surface, pièces, état, DPE)
   - Actions : goToStep, nextStep, prevStep, submit (valide + callback), skipToEnd

3. Crée /src/components/shared/wizard-creation/Step1Caracteristiques.tsx :
   - Form controlled via react-hook-form
   - Section "À qui s'adresse" : Select civilité + Input nom/prénom
   - Section "Adresse" : <AddressAutocomplete /> (déjà créé) + bouton "Chercher sur la carte" (stub)
   - Section "Type de bien" : 4 cards cliquables avec icônes Lucide (Home, Building2, TreePine, Square). La card sélectionnée a ring violet.
   - Section "Caractéristiques" : grille 2 cols d'inputs surface/pièces/chambres/étage + nb étages + terrain (conditionnel si type = maison)
   - Validation inline avec erreurs affichées sous les champs
   - Bouton "Continuer" désactivé si validation Step1 KO

4. Crée /src/components/shared/wizard-creation/Step2Details.tsx :
   - Section "Équipements" : grille de 12 checkboxes (pills cliquables)
   - Section "Caractéristiques" : grille 2 cols de selects (année, état, expo, vue, sonore, occupation)
   - Section "Performances énergétiques" : <DPESelector /> et <GESSelector /> (du design system)
   - Section "Chauffage" : 2 selects (mode + type)

5. Crée /src/components/shared/wizard-creation/Step3Complementaires.tsx :
   - Section "Description" : Textarea 5 lignes
   - Section "Points forts / à défendre" : 2 listes éditables côte à côte (pattern Yanport)
     * Composant <ListeEditable label="Points forts" items={...} onChange={...} /> (à créer en local)
     * Chaque item a son input + bouton supprimer
     * Bouton "+ Ajouter" en bas de chaque liste
   - Section "Finances" : 3 inputs numériques (charges, taxe foncière, nb lots)

6. Crée /src/components/shared/wizard-creation/WizardCreation.tsx :
   - Props : isOpen, onClose, onSubmit (data: WizardFormData) => void, initialData?
   - Dialog shadcn, width max 900px
   - Header avec titre "Création d'une nouvelle estimation"
   - Stepper visuel en haut (3 cercles reliés par ligne)
     * Step actif en violet plein
     * Steps précédents en violet outlined avec ✓
     * Steps suivants en gris outlined
     * Labels "Caractéristiques principales", "Détails (facultatif)", "Informations complémentaires (facultatif)"
   - Contenu de l'étape active au milieu
   - Footer fixe en bas :
     * Champ "Estimation" (affichage + possibilité de saisie manuelle pour override)
     * Indice de fiabilité en pill avec couleur selon niveau
     * Boutons : "Annuler" à gauche, "← Précédent" (si step > 1), "Continuer →" (si pas dernière étape + validation OK), "Créer l'estimation ▸" (toujours dispo si Step1 validé)

7. Crée une page de test /src/app/test-wizard/page.tsx :
   - Bouton "Ouvrir le wizard"
   - Affiche les données en JSON après submit

8. Configure MSW handler pour /api/ban/search :
   - Dans /src/mocks/handlers/ban.ts
   - Retourne 3-5 suggestions mockées d'adresses françaises
   - Format : { label, lat, lon, iris_code, ban_id, ville, code_postal }
   - Exemple : "16 rue du Hameau, 75015 Paris"

9. Configure MSW handler pour /api/avm/estimate :
   - Reçoit un body { adresse, type_bien, surface, nb_pieces, etc. }
   - Retourne un prix estimé mock basé sur une fonction simple :
     * Paris intra-muros : 9000-11000 €/m²
     * Lyon centre : 4500-5500 €/m²
     * Ajustements selon état, DPE, etc.
   - Retourne aussi confidence (low/medium/high selon nb de champs remplis)
   - Structure complète selon /docs/api/CONTRAT_AVM.md (cf fichier)
   - Délai 300ms pour simuler réseau

10. Test via npm run dev :
    - Visite /test-wizard
    - Ouvre le wizard
    - Complète l'étape 1, observe l'estimation live en bas
    - Passe à étape 2, complète DPE/GES, observe l'estimation qui change
    - Skip étape 3, clique "Créer l'estimation"
    - Vérifie que les données s'affichent en JSON

11. Commit :
    git add -A
    git commit -m "04: wizard création 3 étapes + MSW handlers BAN + AVM"

IMPORTANT :
- react-hook-form avec validation Zod, pas de state manuel
- L'estimation live DOIT fonctionner (appel AVM debouncé 500ms)
- Les 4 cards de type de bien doivent avoir une vraie interaction (hover, selected, ring violet)
- Le sélecteur DPE/GES doit utiliser les composants du design system, pas un select classique
- Toutes les strings en français
- Validation Zod stricte
```

---

## Validation visuelle

- [ ] Modale s'ouvre et se ferme proprement
- [ ] Stepper visuel correct, étape active en violet
- [ ] Étape 1 : 4 cards type bien cliquables, ring violet sur sélection
- [ ] Validation bloque "Continuer" si champs obligatoires manquants
- [ ] Adresse : autocomplete fonctionne via MSW
- [ ] Étape 2 : DPE/GES en sélecteur coloré, checkboxes équipements
- [ ] Étape 3 : listes éditables fonctionnent (ajout, suppression)
- [ ] Estimation live s'affiche en bas et change avec les inputs
- [ ] Indice de fiabilité évolue
- [ ] Bouton "Créer l'estimation" accessible depuis n'importe quelle étape (après validation étape 1)
- [ ] Données soumises correctement typées

---

## Étape suivante

Quand validé → `05_MODALE_COMPARABLES.md`
