# 01 — Design System Propsight

**Durée estimée** : 1h
**Objectif** : Tokens de couleurs/typos/spacings, composants shadcn configurés avec la charte Propsight, page demo `/design-system`

---

## Contexte design

**Inspirations** : Linear, Attio.
**Principes** : dense, compact, desktop-first 1440-1600px, professionnel, business-oriented.
**Ce qu'on évite** : gros blocs, gros icônes, gros padding, gradients flashy, animations ostentatoires.

---

## Tokens de couleurs

### Palette principale

```css
/* Violet Propsight — couleur signature */
--violet-50:  #F4F1FE
--violet-100: #E9E2FD
--violet-200: #D4C6FB
--violet-300: #B39FF7
--violet-400: #9074F0
--violet-500: #6D4DE8   /* couleur PRIMAIRE */
--violet-600: #5A3BD4
--violet-700: #4A2FB0
--violet-800: #3B258A
--violet-900: #2E1D6B

/* Neutres (warm gray pour adoucir) */
--neutral-50:  #FAFAF9
--neutral-100: #F5F5F4
--neutral-200: #E7E5E4
--neutral-300: #D6D3D1
--neutral-400: #A8A29E
--neutral-500: #78716C
--neutral-600: #57534E
--neutral-700: #44403C
--neutral-800: #292524
--neutral-900: #1C1917
--neutral-950: #0C0A09

/* Sémantiques */
--success: #16A34A   /* green-600 */
--warning: #EA580C   /* orange-600 */
--danger:  #DC2626   /* red-600 */
--info:    #0891B2   /* cyan-600 */
```

### Tokens shadcn (variables CSS à configurer)

```css
:root {
  --background: 0 0% 100%;                  /* white */
  --foreground: 24 9.8% 10%;                /* neutral-900 */

  --card: 0 0% 100%;
  --card-foreground: 24 9.8% 10%;

  --popover: 0 0% 100%;
  --popover-foreground: 24 9.8% 10%;

  --primary: 252 76% 61%;                   /* violet-500 */
  --primary-foreground: 0 0% 100%;

  --secondary: 60 4.8% 95.9%;               /* neutral-100 */
  --secondary-foreground: 24 9.8% 10%;

  --muted: 60 4.8% 95.9%;
  --muted-foreground: 25 5.3% 44.7%;        /* neutral-500 */

  --accent: 252 76% 96%;                    /* violet-50 */
  --accent-foreground: 252 76% 30%;         /* violet-700 */

  --destructive: 0 72% 51%;                 /* red-600 */
  --destructive-foreground: 0 0% 100%;

  --border: 20 5.9% 90%;                    /* neutral-200 */
  --input: 20 5.9% 90%;
  --ring: 252 76% 61%;                      /* violet-500 */

  --radius: 0.5rem;                          /* 8px - jamais plus */
}
```

### Statuts métier (spécifiques Propsight)

```css
/* Statuts de rapport */
--status-draft-bg:     var(--neutral-100);
--status-draft-fg:     var(--neutral-700);
--status-finalized-bg: #DBEAFE;   /* blue-100 */
--status-finalized-fg: #1D4ED8;   /* blue-700 */
--status-sent-bg:      var(--violet-100);
--status-sent-fg:      var(--violet-700);
--status-opened-bg:    #DCFCE7;   /* green-100 */
--status-opened-fg:    #15803D;   /* green-700 */
--status-archived-bg:  var(--neutral-200);
--status-archived-fg:  var(--neutral-600);

/* Indicateurs de fiabilité */
--confidence-low-bg:    #FEE2E2;   /* red-100 */
--confidence-low-fg:    #B91C1C;
--confidence-medium-bg: #FEF3C7;   /* amber-100 */
--confidence-medium-fg: #B45309;
--confidence-high-bg:   #DCFCE7;
--confidence-high-fg:   #15803D;

/* DPE / GES (couleurs officielles ADEME) */
--dpe-A: #008F3D;
--dpe-B: #4CB849;
--dpe-C: #C7D933;
--dpe-D: #F5E93B;
--dpe-E: #F9B233;
--dpe-F: #EC7D2A;
--dpe-G: #E30613;
```

---

## Typographie

### Familles

- **Interface** : Inter (via `next/font/google`)
- **Monospace** : JetBrains Mono (pour chiffres de prix si besoin de tabular-nums) ou défaut système

### Échelle

Pas plus de 6 niveaux. Tout en rem. Line-heights serrés (design dense).

```
text-xs:    0.75rem  (12px) — labels micro, metadata
text-sm:    0.875rem (14px) — body courant, UI standard
text-base:  1rem     (16px) — body emphasis ou longue lecture
text-lg:    1.125rem (18px) — sous-titres de blocs
text-xl:    1.25rem  (20px) — titres de sections
text-2xl:   1.5rem   (24px) — titres de pages
text-3xl:   1.875rem (30px) — chiffres KPI vedette (rare)
```

**Weights** :
- 400 : body
- 500 : emphasis léger, labels
- 600 : titres, boutons
- 700 : rare, chiffres hero uniquement

**Pas de 800 ou 900.** Jamais.

### Règles

- Pas d'uppercase en UI (sauf badges micro comme `PRO`)
- Pas d'italique (sauf citations)
- `tabular-nums` sur tous les chiffres (prix, surfaces, pourcentages) pour alignement colonnes

---

## Espacements (grille 4px)

Uniquement :
```
gap-1  = 4px
gap-2  = 8px
gap-3  = 12px
gap-4  = 16px   (par défaut dans la plupart des cas)
gap-6  = 24px
gap-8  = 32px
gap-10 = 40px  (rare)
gap-12 = 48px  (rare)
gap-16 = 64px  (très rare, séparation de sections majeures)
```

**Jamais** : `gap-5`, `gap-7`, `gap-9`, `gap-11` — rompent la cohérence.

---

## Bordures et radius

- **Border** : `border border-border` (token shadcn, = neutral-200)
- **Radius standard** : `rounded-lg` = 8px
- **Radius small** : `rounded-md` = 6px (pour badges, pills)
- **Radius large** : `rounded-xl` = 12px (rare, pour cartes hero)
- **Radius full** : `rounded-full` (avatars, boutons ronds)

**Pas de radius arbitraires** (`rounded-[7px]` interdit).

---

## Ombres

Très discrètes. Jamais de `shadow-2xl` ou `shadow-xl`.

```
shadow-xs  : bordure subtile, cards au survol
shadow-sm  : dropdowns, popovers
shadow-md  : drawers, modales
shadow-lg  : rare, très rare (toasts)
```

---

## Composants — patterns clés

### Button

- **Primary** : violet-500 bg, blanc fg, hover violet-600
- **Secondary** : neutral-100 bg, neutral-900 fg, hover neutral-200
- **Outline** : border neutral-200, hover bg neutral-50
- **Ghost** : transparent, hover bg neutral-100
- **Destructive** : red-600 bg, blanc fg
- **Tailles** : `sm` (h-8, text-xs), `default` (h-9, text-sm), `lg` (h-10, text-sm). **Pas de XL.**

### Input / Select

- Hauteur par défaut : `h-9` (36px)
- Bordure : `border-border`
- Focus : `ring-2 ring-ring ring-offset-1`
- Padding intérieur : `px-3`
- Placeholder : `text-muted-foreground`

### Card

- `border border-border rounded-lg bg-card`
- Padding intérieur : `p-4` ou `p-6` selon densité
- Pas d'ombre par défaut (bordure suffit)
- Header : padding-bottom séparé par `border-b` subtil si besoin

### Badge

- Hauteur : `h-5` (20px)
- Padding : `px-2`
- Text size : `text-xs`
- Font weight : `font-medium`
- Radius : `rounded-md`

### Table (liste)

- Densité : `py-2` sur les cellules (pas `py-4`)
- Headers : `text-xs font-medium text-muted-foreground uppercase tracking-wide` (la seule exception uppercase autorisée)
- Hover de ligne : `hover:bg-muted/50`
- Bordures de ligne : `border-b border-border`

---

## Iconographie

- **Une seule librairie** : Lucide React
- **Tailles standard** : `w-4 h-4` (16px) UI courante, `w-5 h-5` (20px) en-têtes de section, `w-6 h-6` (24px) rare
- **Pas de gros icônes** : jamais plus que `w-6`
- **Couleur** : tokens sémantiques (`text-muted-foreground` par défaut)
- **Jamais d'emoji** dans les composants UI (sauf micro-illustration empty state)

---

## Layout — règles transverses

- **Largeur de contenu max** : 1440px, mais conteneurs intérieurs variables
- **Grille** : `grid grid-cols-12 gap-6` pour pages complexes
- **Sticky headers** : `sticky top-0 z-30 bg-background/80 backdrop-blur`
- **Séparateurs** : utiliser `<Separator />` de shadcn, pas `<hr>`

---

## Prompt Claude Code

```
Tu as le setup initial Propsight en place. Maintenant on configure le design system.

Lis /docs/DESIGN_SYSTEM.md (qui détaille tokens, composants, règles).

1. Mets à jour /src/app/globals.css avec TOUS les tokens CSS définis dans DESIGN_SYSTEM.md :
   - Variables shadcn (violet-500 comme primary)
   - Variables métier Propsight (statuts, confidence, DPE/GES)
   - Palette violet-50 à violet-900
   - Palette neutral-50 à neutral-950

2. Mets à jour /tailwind.config.ts pour exposer ces tokens comme classes Tailwind utilisables :
   - theme.extend.colors.violet (50-900)
   - theme.extend.colors.neutral (50-950, warm stone)
   - theme.extend.colors.dpe (A-G)
   - theme.extend.colors.status (draft, finalized, sent, opened, archived) avec bg et fg
   - theme.extend.colors.confidence (low, medium, high) avec bg et fg

3. Configure la police Inter via next/font/google dans /src/app/layout.tsx.
   - Variable CSS --font-sans
   - Apply sur <html> ou <body>
   - Fallback system-ui, sans-serif

4. Crée /src/components/ui/ components s'ils ne sont pas déjà installés via shadcn :
   button, input, label, card, badge, separator, tabs, tooltip, dropdown-menu
   (les autres peuvent attendre d'être installés quand on en a besoin)

5. Personnalise le button shadcn :
   - Variant "primary" utilise violet-500 (déjà le cas via CSS vars)
   - Pas de variant size "xl"
   - Size "sm" h-8 text-xs, "default" h-9 text-sm, "lg" h-10 text-sm

6. Crée des composants utilitaires dans /src/components/shared :

   a) StatusBadge.tsx
      Props : status ('draft' | 'finalized' | 'sent' | 'opened' | 'archived')
      Rend un Badge shadcn avec les bonnes couleurs bg/fg selon statut.
      Labels français : "Brouillon", "Finalisé", "Envoyé", "Ouvert", "Archivé"
      Préfixé d'un point coloré : ● Brouillon

   b) ConfidenceIndicator.tsx
      Props : level ('low' | 'medium' | 'high'), label?: string
      Rend 5 petits dots (●●●○○) + label. Couleur selon level.
      Niveau low = 2 dots, medium = 3, high = 4 ou 5.

   c) DPEBadge.tsx et GESBadge.tsx
      Props : value ('A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'inconnu')
      Rend une pill colorée avec la lettre, couleurs officielles ADEME.
      Si "inconnu", affiche "—" en gris.

   d) DPESelector.tsx et GESSelector.tsx
      Props : value, onChange
      Rend une grille horizontale A→G avec chaque case colorée cliquable.
      Case sélectionnée : ring violet-500, scale légèrement.
      Inspiration visuelle : grille type Yanport Agent 360.

   e) KPICard.tsx
      Props : label, value, change?: {value: number, period: string}, variant?: 'default' | 'success' | 'warning'
      Rend une petite card :
      - label en text-xs text-muted-foreground
      - value en text-2xl font-semibold tabular-nums
      - change optionnel : "↑ 12%" en vert ou "↓ 5%" en rouge avec period
      Compacte, bordure fine. Pas de padding excessif.

   f) PriceToggle.tsx
      Props : value, unit ('EUR' | 'PCT' | 'EUR_M2'), surface, onUnitChange, onChange
      Input de prix avec bouton de toggle entre €, %, €/m². La valeur se recalcule automatiquement selon l'unité.

   g) AddressAutocomplete.tsx
      Props : value, onChange (BanAddress)
      Input qui appelle l'API BAN (via un endpoint MSW mocké /api/ban/search?q=...)
      Suggestions dans un dropdown (cmdk ou popover).
      Retourne {label, lat, lon, iris_code, type_bien?} dans onChange.

   h) SimilarityScore.tsx
      Props : score (0 à 1)
      Rend une pill verte "87% similaire" — couleur plus verte si >0.85, plus neutre si <0.7.

   i) EmptyState.tsx
      Props : icon?, title, description, actions[]
      Composant réutilisable pour états vides. Illustration SVG simple ou icône Lucide, titre, description, liste de CTA.

7. Crée une page /src/app/design-system/page.tsx qui affiche :
   - Tous les variants de Button
   - Toutes les sizes d'Input, Select
   - Les Cards avec différentes densités
   - Tous les Badges métier (Status, Confidence, DPE/GES)
   - Les Selectors DPE et GES
   - La KPICard avec des exemples
   - Le PriceToggle
   - L'EmptyState
   - La palette de couleurs (carrés colorés avec leurs noms)
   - L'échelle typographique (xs → 3xl)

   Cette page est un catalogue pour vérifier visuellement. Organisée en sections avec titres.

8. Lance npm run dev, visite /design-system, et vérifie visuellement :
   - Les violets sont cohérents
   - Les espacements sont denses (pas d'immenses paddings)
   - Les bordures sont fines et discrètes
   - Les shadows sont subtiles ou absentes
   - La typo Inter est bien chargée
   - Aucun composant ne déborde ou ne casse

9. Commit :
   git add -A
   git commit -m "01: design system + tokens + composants shared utilitaires"

Important :
- RESPECTE la palette de couleurs EXACTEMENT comme définie
- Ne crée PAS de composants qui ne sont pas dans ma liste
- Si un composant shadcn n'est pas encore installé, installe-le via `npx shadcn@latest add [component]`
- Code français pour la logique métier, anglais pour le technique
- Types TypeScript stricts partout
```

---

## Validation visuelle

Après exécution, visite `/design-system` et vérifie :

- [ ] La palette violette est juste (pas bleutée, pas rosée — violet 6D4DE8 exact)
- [ ] Les composants sont denses, pas gonflés
- [ ] Les coins sont à 8px (pas plus)
- [ ] Les bordures sont à 1px neutral-200 (pas d'ombres marquées)
- [ ] Le DPE selector est beau et cliquable
- [ ] Les KPICard ont une apparence Linear-like (compacts, pro)
- [ ] Aucun composant n'a l'air "SaaS générique"
- [ ] `npm run build` passe sans erreur TypeScript

---

## Étape suivante

Quand validé → `02_LAYOUT_PRO.md`
