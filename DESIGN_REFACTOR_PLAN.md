# DESIGN_REFACTOR_PLAN

**Date :** 2026-04-25
**Document de référence :** [AUDIT_DESIGN_PROPSIGHT.md](AUDIT_DESIGN_PROPSIGHT.md)
**Objectif :** plan de refonte progressive du design Propsight vers la cible Linear / Attio / Vercel / Stripe, **sans casser l'app, sans big bang, en commits courts et reviewables**.

---

## Principes directeurs

1. **Tokens d'abord, primitives ensuite, sweep en dernier.** On ne touche pas une page tant que ses primitives partagées n'existent pas.
2. **Une dimension à la fois par PR.** Le shell change OU les tokens changent OU une page change. Jamais deux ensemble.
3. **Aucun composant existant supprimé sans son remplaçant déjà mergé.** On ajoute → on bascule → on supprime, pas l'inverse.
4. **Snapshot visuel** sur 5 pages clés avant chaque phase qui touche le shell ou les primitives. Comparer manuellement après merge.
5. **Pas de refonte "from scratch" d'une page.** On migre par couches transverses : tokens, primitives, shell, ornement.
6. **Aucune décision design prise dans le code.** Toute décision passe par un ADR (Phase 0).

---

## Phase 0 — Décisions design (1-2 jours, zéro code)

**Sortie :** un fichier `docs/ADR/2026-04-design-system-v1.md` qui acte les choix bloquants et rend toutes les phases suivantes purement mécaniques.

**Format ADR proposé :**

```md
# ADR — Design System V1 (avril 2026)

## Statut
Accepté — 2026-04-XX

## Décisions

1. Fond app : BLANC PUR `#FFFFFF` (override de `--ps-bg-app`)
2. Radius standard : 8 px (`rounded-lg`). Exception unique : hero search bar
   landing publique → `rounded-2xl` (16 px).
3. Toggle dark mode utilisateur : SUPPRIMÉ V1. Tokens dark conservés en CSS,
   pas de UI exposée.
4. Bouton "Assistant IA" header : PASSÉ EN GHOST (texte + icône, sans fond
   plein), conserve la couleur violette uniquement sur l'icône.
5. Glassmorphism (`backdrop-blur-*`) : INTERDIT. PublicHeader passe en
   `bg-white` solide + `border-b border-neutral-200`.
6. Gradient texte : AUTORISÉ 1× MAX par page, uniquement landing publique.
   Interdit dans /app/*.
7. Couleur de fond sémantique : `neutral` est le NOM CANONIQUE.
   `slate` et `gray` deviennent legacy à supprimer.
8. Animations infinies hors skeleton : INTERDITES. `animate-float-slow`
   est retiré.
9. Cards Pro : bordure 1 px, AUCUNE OMBRE par défaut. `hover:shadow-sm`
   acceptable, jamais `shadow-md` ou plus.
10. Cards landing publiques : bordure 1 px, AUCUNE OMBRE par défaut.
    `hover:shadow-md` autorisé.

## Conséquences
- Sweep token mécanique sur 100+ fichiers (Phase 5).
- Refresh PublicHeader + HomeHero (Phase 4).
- Suppression du toggle theme du HeaderPro (Phase 3).
```

**Livrables Phase 0 :**
- [ ] `docs/ADR/2026-04-design-system-v1.md` rédigé et validé.
- [ ] [AUDIT_DESIGN_PROPSIGHT.md §B](AUDIT_DESIGN_PROPSIGHT.md) — checklist de décisions cochée.

**Critère de sortie :** ADR mergé sur `main`. Aucun code modifié.

---

## Phase 1 — Tokens (3-4 jours)

**But :** rendre les tokens du design system **utilisables** côté code (sémantiques + ergonomiques) **sans changer aucune apparence**.

### 1.1 Étendre `tailwind.config.js` avec couches sémantiques

Exposer les CSS custom properties `--ps-*` ([app.scss:331-414](src/main/webapp/app/app.scss#L331-L414)) en utilities sémantiques :

```js
// theme.extend.colors
surface: {
  DEFAULT:   'var(--ps-bg-surface)',
  app:       'var(--ps-bg-app)',
  elevated:  'var(--ps-bg-elevated)',
  muted:     'var(--ps-bg-muted)',
},
fg: {
  1:        'var(--ps-fg-1)',
  2:        'var(--ps-fg-2)',
  3:        'var(--ps-fg-3)',
  disabled: 'var(--ps-fg-disabled)',
},
border: {
  subtle: 'var(--ps-border-subtle)',
  strong: 'var(--ps-border-strong)',
  focus:  'var(--ps-border-focus)',
},
```

Conséquence : `bg-surface`, `bg-surface-app`, `text-fg-1`, `border-subtle` deviennent disponibles. Le dark mode tournera automatiquement (les variables changent dans `.dark`), sans la feuille de remap manuelle de [app.scss:504-607](src/main/webapp/app/app.scss#L504-L607).

### 1.2 Aligner Phase 0 décisions dans tailwind.config et app.scss

- Fond app `#FFFFFF` : changer `--ps-bg-app: #FFFFFF` (Phase 0 décision 1).
- Marquer alias `shadow-{subtle, map-panel, float-sm/md/lg}` comme `@deprecated` dans le commentaire (suppression Phase 7).

### 1.3 Créer `app/shared/motion/`

Selon [docs/07_MOTION_LANGUAGE.md §7](docs/07_MOTION_LANGUAGE.md#L407-L424) :

```
app/shared/motion/
├── easings.ts
├── durations.ts
├── distances.ts
├── staggers.ts
├── useSafeMotion.ts
├── variants/
│   ├── scrollReveal.ts
│   ├── staggerGrid.ts
│   ├── drawer.ts
│   ├── modal.ts
│   └── toggle.ts
└── index.ts
```

Aucun composant n'utilise ces tokens en Phase 1. C'est juste mis à disposition.

### 1.4 Documentation utilisable par Claude Code

Mettre à jour [CLAUDE.md §5](CLAUDE.md) avec une section "Tokens design" qui liste explicitement :
- les noms de classes sémantiques disponibles (`bg-surface`, `text-fg-1`, etc.) ;
- les radii à utiliser (`rounded-lg` standard) ;
- l'interdit de `text-[Npx]`, `shadow-[...]`, `rounded-{xl,2xl}` (sauf opt-out marketing explicite) ;
- l'usage des tokens motion.

**Livrables Phase 1 :**
- [ ] PR "design: tokens sémantiques + motion lib" — extension tailwind.config + app.scss + dossier motion + CLAUDE.md
- [ ] Le design system actuel rend identiquement après PR (snapshot visuel == identité).
- [ ] Page `/app/design-system` minimale qui rend la palette + l'échelle typo + les radii + les ombres (preview avant primitives).

**Critère de sortie :** un dev peut écrire `<div className="bg-surface border-subtle text-fg-1 rounded-lg shadow-sm">` et obtenir le rendu attendu.

---

## Phase 2 — Primitives UI (5-7 jours)

**But :** créer les composants `app/shared/ui/*` qui deviendront la **seule** source de Button/Card/Input/Drawer/Modal/Badge/PageHeader/Table.

Aucun composant existant n'est touché. Les primitives sont testées sur la page `/app/design-system` uniquement.

### 2.1 Ordre de création (par dépendance, du plus simple au plus complexe)

| # | Primitive | Dépend de | Effort |
|---|---|---|---|
| 1 | `Button.tsx` | tokens | 0.5 j |
| 2 | `Badge.tsx` (+ `StatusBadge`, `DPEBadge`, `ConfidenceIndicator`) | tokens | 0.5 j |
| 3 | `Card.tsx` | tokens | 0.5 j |
| 4 | `Input.tsx` (+ Textarea, Select, Checkbox, Radio, Switch) | tokens | 1 j |
| 5 | `ToggleGroup.tsx` | Button | 0.5 j |
| 6 | `PageHeader.tsx` | Button | 0.5 j |
| 7 | `Modal.tsx` | tokens, motion | 1 j |
| 8 | `Drawer.tsx` (généralisation EntityDrawerShell) | tokens, motion | 1 j |
| 9 | `Table.tsx` (basic) | tokens | 1 j |

### 2.2 Spécifications par primitive (extraits)

**`Button.tsx`** :

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg';      // h-7 / h-8 / h-9 / h-10
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

- `primary` : `bg-propsight-600 hover:bg-propsight-700 text-white`. Aucune ombre par défaut. Focus ring `shadow-focus`.
- `secondary` : `bg-neutral-100 hover:bg-neutral-200 text-neutral-900`.
- `outline` : `border border-subtle hover:bg-neutral-50`.
- `ghost` : `hover:bg-neutral-100`.
- `destructive` : `bg-danger-500 hover:bg-danger-700 text-white`.
- Tous radius 8 px (`rounded-lg`) sauf opt-out via prop `radius="md"`.
- Ombre violette CTA hero exceptionnelle : nouveau token `shadow-cta-violet` ajouté en Phase 1, utilisé uniquement par `<Button variant="primary" emphasis="hero">`.

**`Card.tsx`** :

```ts
type CardProps = {
  density?: 'compact' | 'default' | 'comfort';   // p-3 / p-4 / p-6
  hover?: boolean;                                // hover:shadow-sm
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

<Card>
  <Card.Header title="..." subtitle="..." actions={<>...</>} />
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

`bg-surface border border-subtle rounded-lg`. Aucune ombre par défaut.

**`Drawer.tsx`** :

```ts
type DrawerProps = {
  open: boolean;
  onClose: () => void;
  size?: 'sm' | 'md' | 'lg';  // 420 / 480 / 640 px
  title?: string;
  subtitle?: string;
};
```

Backdrop `bg-neutral-900/30`, header h-13 sticky, body scrollable, footer optionnel sticky-bottom. Animation `enter` 280 ms.

**`PageHeader.tsx`** :

```ts
type PageHeaderProps = {
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; to?: string }[];
  actions?: React.ReactNode;
  sticky?: boolean;
};
```

Hauteur fixe 56 px, `border-b border-subtle`, padding `px-4`.

### 2.3 Page de référence

Étendre `/app/design-system` (créée en Phase 1) avec **toutes** les primitives × **tous** les états (default, hover, focus, disabled, loading, error). C'est la **page de validation visuelle de l'équipe**.

**Livrables Phase 2 :**
- [ ] PR par primitive (9 PR au total, courts, parallélisables).
- [ ] Page `/app/design-system` complète et accessible.
- [ ] Section "Primitives" ajoutée à [CLAUDE.md](CLAUDE.md) avec règle : *"Tout nouveau composant doit utiliser les primitives de `app/shared/ui/`. Pas de nouveau `<button className="...">` inline."*
- [ ] Règle ESLint custom (ou commentaire dans `.eslintrc`) qui flag `<button` sans wrapper Button dans `app/features/` (à activer en Phase 7).

**Critère de sortie :** un dev peut implémenter une nouvelle page Pro **sans écrire un seul `className=`** sur un `<button>`, `<input>`, `<div className="border ...">` ou `<aside className="fixed ...">`.

---

## Phase 3 — Bascule du shell Pro (1-2 jours)

**But :** unifier `HeaderPro` + `SidebarPro` + `AppShellPro` en une seule version officielle, supprimer la version dupliquée.

### 3.1 Inventorier les pages encore sur version B

```bash
grep -rn "from 'app/features/shared/layout/" src/main/webapp/app/
```

Probablement DashboardPage et BiensPages (cf. [AUDIT.md §1.4](AUDIT.md)). Pour chacune :
- Supprimer l'import local de `ProLayout`.
- S'assurer que la page est **bien rendue à l'intérieur de `<AppShellPro />`** via [routes.tsx](src/main/webapp/app/routes.tsx).

### 3.2 Décisions Phase 0 → exécution

- Retirer le toggle theme du [HeaderPro.tsx:43-51](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L43-L51). Si on veut garder un accès, le mettre dans `UserMenu`.
- Passer le bouton Assistant IA en `ghost` ([HeaderPro.tsx:34-41](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L34-L41)) :

  ```tsx
  // avant : bg-propsight-500 hover:bg-propsight-600 text-white
  // après : <Button variant="ghost" size="md" leftIcon={<Sparkles className="text-propsight-600" />}>Assistant IA</Button>
  ```

- Aligner verticalement Logo header + Logo sidebar : tous deux à h-13 (52 px). [SidebarPro.tsx:21](src/main/webapp/app/layouts/pro/SidebarPro.tsx#L21) actuellement à h-14.

### 3.3 Migrer les drawers existants sur la primitive `<Drawer>`

| Cible | Action |
|---|---|
| [shared/drawers/EntityDrawerShell.tsx](src/main/webapp/app/shared/drawers/EntityDrawerShell.tsx) | Réimplémenter par-dessus `<Drawer>`. |
| [shared/drawers/AIDrawer.tsx](src/main/webapp/app/shared/drawers/AIDrawer.tsx) | Idem. |
| [features/activite/leads/components/LeadDrawer.tsx](src/main/webapp/app/features/activite/leads/components/LeadDrawer.tsx) | Idem. |
| [features/biens/shared/DrawerBien.tsx](src/main/webapp/app/features/biens/shared/DrawerBien.tsx) | Idem. |
| [features/veille/components/drawer/DrawerShell.tsx](src/main/webapp/app/features/veille/components/drawer/DrawerShell.tsx) | Idem. |

### 3.4 Refresh PublicHeader

Selon Phase 0 décision 5 :
- Remplacer `bg-white/85 backdrop-blur-md` par `bg-white` solide + `border-b border-neutral-200`.
- Conserver `shadow-[0_1px_0_rgba(15,23,42,0.06)]` au scroll mais **via token** : `shadow-xs`.
- Rendre les CTA (`Espace Pro`, `Explorer gratuitement`, `Demander une démo`) avec `<Button variant="..." size="sm">`.

**Livrables Phase 3 :**
- [ ] PR "design(shell): unify Pro shell, remove duplicate" — supprime `features/shared/layout/{ProHeader,ProSidebar,ProLayout}.tsx`.
- [ ] PR "design(shell): refresh HeaderPro per ADR" — toggle theme retiré, bouton AI ghost.
- [ ] PR "design(shell): refresh PublicHeader, remove backdrop-blur".
- [ ] PR "design(shell): unify drawers on <Drawer> primitive" — 5 fichiers migrés.
- [ ] Snapshot visuel pre/post sur 5 pages : Dashboard, Portefeuille, Radar, EstimationRapideList, HomeHero.

**Critère de sortie :** un seul Header Pro, une seule Sidebar Pro, un seul shell, un seul drawer. Aucun `backdrop-blur` dans le repo (hors mapbox popup CSS).

---

## Phase 4 — Pages pilotes (3-5 jours)

**But :** valider que primitives + tokens tiennent sur des pages réelles **avant** d'imposer le sweep sur tout le repo.

### 4.1 Pilote Pro #1 — DashboardPage

**Branche :** `feat/dashboard-design-refresh`

**Plan :**
1. Remplacer le header inline de la page par `<PageHeader title="Tableau de bord" actions={...} />`.
2. Remplacer chaque `<div className="...border-slate-200 rounded-lg bg-white...">` par `<Card density="compact">`.
3. Remplacer chaque `<button className="...">` par `<Button variant="..." size="...">`.
4. Le KpiStrip devient un composant `<KpiStrip>` qui consomme `<Card>` en interne.
5. Aucun `text-[Npx]` ne survit, aucun `shadow-[...]` inline ne survit, aucun `rounded-2xl` ne survit.
6. Les animations utilisent `app/shared/motion`.

**Validation :** comparaison pixel-par-pixel avec la version actuelle (acceptable que le rendu change si l'ADR le justifie).

### 4.2 Pilote Pro #2 — PortefeuillePage

**Branche :** `feat/portefeuille-design-refresh`

Plan similaire + spécifique :
- Toggle table/cards/map = `<ToggleGroup>`.
- Table = `<Table>` partagée.
- Drawer bien = `<Drawer size="md">`.
- Filters toolbar = `<FiltersBar>` (si pattern récurrent, sinon inline avec primitives).

### 4.3 Pilote Public — HomeHero

**Branche :** `feat/home-hero-design-refresh`

Plan :
- Retirer `animate-float-slow` ([HomeHero.tsx:171](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L171)).
- Retirer un des deux gradient blurs ([HomeHero.tsx:29-36](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L29)) — garder le top-right uniquement.
- Garder le gradient texte (Phase 0 décision 6, 1× par page autorisé landing).
- Search bar : remplacer `shadow-md hover:shadow-lg` par `shadow-sm hover:shadow-md`. Focus ring `shadow-focus` au lieu du custom inline.
- CTA : `<Button variant="primary" size="lg" emphasis="hero">` (le seul cas où l'ombre violette CTA est autorisée, encapsulée dans la primitive).
- Stat tiles : `<KpiTile>` (variant aéré du KPI Pro, mêmes tokens).
- Mini-card flottante : `<Card density="compact">` sans `animate-float-slow`.

**Livrables Phase 4 :**
- [ ] 3 PR pilotes (Dashboard, Portefeuille, HomeHero).
- [ ] Capture d'écran avant/après pour chaque pilote, posté en commentaire de la PR.
- [ ] Validation produit (utilisateur final ou design lead) sur les 3 pilotes.

**Critère de sortie :** les 3 pages pilotes ne contiennent **aucune** classe Tailwind hors-primitives qui ne soit issue des tokens. Elles servent de **modèle** pour les pages suivantes.

---

## Phase 5 — Sweeps tokens (2-3 jours, parallélisable)

**But :** appliquer mécaniquement les décisions sur tout le code restant. Chaque sweep est un PR indépendant, court, mécanique, facile à reviewer (diff homogène).

### 5.1 Sweep 1 — `text-[Npx]` → tokens nommés

Mapping (sortie config Phase 1) :

| Custom | Token cible |
|---|---|
| `text-[10px]`, `text-[10.5px]` | `text-caption` |
| `text-[11px]`, `text-[11.5px]` | `text-micro` |
| `text-[12px]`, `text-[12.5px]` | `text-small` |
| `text-[13px]`, `text-[13.5px]` | `text-body` |
| `text-[14px]`, `text-[14.5px]` | `text-body-lg` |
| `text-[15px]` | `text-lead` |
| `text-[17px]`, `text-[18px]` | `text-title` |
| `text-[22px]` | `text-h3` |
| `text-[28px]` | `text-h2` |
| `text-[36px]` | `text-h1` |
| `text-[48px+]` | `text-display` |

Script : grep mécanique + sed (à valider à la main sur ~10 fichiers en pré-revue).

### 5.2 Sweep 2 — `shadow-[...]` inline → ladder

Mapping :

| Custom | Token cible |
|---|---|
| `shadow-[0_1px_2px_...]` | `shadow-xs` |
| `shadow-[0_1px_3px_...]` | `shadow-sm` |
| `shadow-[0_4px_...]` (cards hover) | `shadow-md` |
| `shadow-[0_12px_28px_...]` (drawers) | `shadow-lg` |
| `shadow-[0_2px_8px_-2px_rgba(109,77,232,...)]` (CTA public small) | `shadow-cta-violet-sm` (nouveau token) |
| `shadow-[0_4px_14px_-4px_rgba(122,106,245,...)]` (CTA hero large) | `shadow-cta-violet` (nouveau token) |
| `shadow-[0_0_0_4px_rgba(122,106,245,0.12)]` (focus violet) | `shadow-focus` |

### 5.3 Sweep 3 — `rounded-{xl,2xl}` → `rounded-lg`

Sauf opt-out marketing explicite (HomeHero search bar). Tout le reste passe à 8 px.

### 5.4 Sweep 4 — `slate-*` / `gray-*` → `neutral-*`

Find/replace global. Comme les 3 ramps pointent sur la même rampe (cf. [tailwind.config.js:60-81](tailwind.config.js#L60-L81)), aucune apparence ne change. **Ce sweep est purement de la cosmétique de code.**

### 5.5 Sweep 5 — Couleurs hors-palette landing

Cibles :
- [features/public/home/sections/PublicProductCards.tsx](src/main/webapp/app/features/public/home/sections/PublicProductCards.tsx) : `from-sky-100 to-sky-50`, `from-emerald-100 to-emerald-50` → tons violets dérivés ou neutres.

### 5.6 Sweep 6 — Durées / easings motion → tokens

Pattern : `transition={{ duration: 0.X, ease: [0.22, 1, 0.36, 1] }}` → `transition={{ duration: durations.base, ease: easings.default }}`.

**Livrables Phase 5 :**
- [ ] 6 PR de sweep, indépendants, mergeable parallèlement.
- [ ] Aucune régression visuelle (hors décisions ADR).
- [ ] Métrique : `grep -r "text-\[" src/main/webapp/app/features/ | wc -l` < 5.
- [ ] Métrique : `grep -r "shadow-\[" src/main/webapp/app/features/ | wc -l` = 0.
- [ ] Métrique : `grep -r "rounded-2xl" src/main/webapp/app/features/ | wc -l` < 5.

---

## Phase 6 — Migration des autres pages (au fil de l'eau, 1-2 mois)

**But :** appliquer le pattern des pilotes sur les ~30 autres pages quand elles sont touchées pour une raison fonctionnelle.

**Règle :** dès qu'on touche une page pour un ticket fonctionnel, on applique en plus le refresh design (primitives + tokens). Pas de PR purement "refresh design" sur ces pages — sauf si une page est explicitement priorisée produit.

**Pages prioritaires** (à toucher de façon proactive si bande passante) :
1. RadarPage (très utilisée, pattern split-map intéressant à standardiser).
2. EstimationRapideList / Detail (vitrine du produit, UX critique).
3. PilotageCommercial (page d'entrée par persona agent).
4. ObservatoireMarche (visuels chart, à aligner avec les charts standardisés).

**Pages en "queue passive"** (migration uniquement quand touchées) :
- Toutes les pages publiques secondaires (Blog, Testimonials, PackPro, MentionsLegales, etc.).
- Les pages d'investissement (Opportunites, Dossiers, ProjetWorkspace).
- Veille / Equipe (déjà denses, faible ROI esthétique).

**Livrables Phase 6 :**
- [ ] Tableau de tracking dans `docs/DESIGN_REFACTOR_STATUS.md` listant chaque page avec son statut (V0 = legacy, V1 = primitives, V2 = ADR-aligné).
- [ ] Commit message convention : `refactor(design): migrate <page> to primitives`.

**Critère de sortie (asymptotique) :** 100 % des pages en V1 ou V2 d'ici fin V1 produit (juillet 2026).

---

## Phase 7 — Nettoyage (2-3 jours)

**But :** supprimer le code mort et appliquer les garde-fous.

### 7.1 Suppressions

- [ ] Alias d'ombres legacy `subtle / map-panel / float-sm/md/lg` dans [tailwind.config.js:152-156](tailwind.config.js#L152-L156).
- [ ] Aliases `slate-*` et `gray-*` dans tailwind.config (après Sweep 4 propre).
- [ ] Keyframes `animate-pulse-ring` et `animate-shimmer` si toujours inutilisés.
- [ ] Fichier [_bootstrap-variables.scss](src/main/webapp/app/_bootstrap-variables.scss) (intégralement commenté, mort).
- [ ] CSS custom des popups Mapbox dans [app.scss:747-922](src/main/webapp/app/app.scss#L747-L922) qui utilisent `font-family: 'Courier New'` (legacy, à passer Inter).
- [ ] 8 layouts locaux modules listés dans [AUDIT.md §3.3](AUDIT.md).
- [ ] Pages legacy non migrées et non utilisées (à confirmer par routing audit) : `pages/Home.tsx`, `pages/Achat.tsx` vs `pages/public/`.

### 7.2 Garde-fous

- [ ] Règle ESLint custom (ou commit-hook) :
  ```
  - "no inline shadow-[]" sur app/features/*
  - "no inline text-[Npx]" sur app/features/* (max 5 exceptions documentées)
  - "no rounded-{xl,2xl}" sur app/features/* (max 5 exceptions)
  - "no bg-slate-*", "no bg-gray-*" → bg-neutral-*
  - "no <button> raw, use <Button>"
  ```
- [ ] Test ArchUnit : aucun composant `app/features/*/` n'importe `framer-motion` directement (uniquement via `app/shared/motion/`).
- [ ] CI step : `grep` qui fail si nouvelles violations.

### 7.3 Documentation

- [ ] [docs/01_DESIGN_SYSTEM.md](docs/01_DESIGN_SYSTEM.md) : mettre à jour pour qu'il reflète l'état réel (pas l'état spec V0).
- [ ] [CLAUDE.md §5](CLAUDE.md) : pointer vers `/app/design-system` comme source de vérité.
- [ ] Créer `docs/DESIGN_PATTERNS.md` qui documente les patterns récurrents non couverts par les primitives (split-map layout, KPI strip Pro, hero landing, etc.).

**Livrables Phase 7 :**
- [ ] PR "chore(design): cleanup legacy aliases & dead CSS"
- [ ] PR "chore(eslint): enforce design tokens"
- [ ] PR "docs: refresh design system documentation"

**Critère de sortie :** un nouveau dev qui rejoint l'équipe peut écrire sa première page Pro **sans** consulter une seule autre page existante, juste en lisant `docs/01_DESIGN_SYSTEM.md` + `/app/design-system`.

---

## Synthèse — calendrier proposé

| Phase | Effort | Bloquant pour | Peut tourner en parallèle de |
|---|---|---|---|
| 0 — Décisions ADR | 1-2 j | Tout | rien |
| 1 — Tokens + motion lib | 3-4 j | 2, 3 | rien |
| 2 — Primitives UI | 5-7 j | 4 | sweeps "preview" sur fichiers isolés |
| 3 — Bascule shell Pro | 1-2 j | 4 | Phase 5 sweep 4 (slate→neutral) |
| 4 — Pages pilotes | 3-5 j | 6 | Phase 5 sweeps 1-2-3 sur fichiers hors pilotes |
| 5 — Sweeps tokens | 2-3 j | 6 | Tout (sauf shell en cours) |
| 6 — Migration pages | continu (1-2 mois) | — | Tout |
| 7 — Nettoyage | 2-3 j | — | rien |

**Effort total estimé : 18-26 jours-développeur** sur la fenêtre développement V1 (avril → juillet 2026), dont :
- ~10 jours en concentration (Phases 0-3) avant tout autre dev.
- ~8 jours sweep + pilotes (Phases 4-5).
- ~continu (Phase 6) intégré aux tickets fonctionnels.
- ~3 jours hygiène finale (Phase 7).

**Risques** :
- Phase 3 (bascule shell) peut causer une régression visuelle sur Dashboard / Biens si la migration B → A est mal faite. → Snapshot visuel obligatoire.
- Phase 5 sweep 4 (`slate` → `neutral`) peut sembler bruyant en review (gros diff) mais ne change rien à l'apparence. → Faire en un PR séparé clairement labellisé "mechanical refactor".
- Phase 6 dérive (jamais terminée) si pas de tracking. → Tableau de statut obligatoire.

---

## Annexe — Mapping ADR vers actions concrètes

| Décision ADR | Phase | Fichiers impactés (échantillon) |
|---|---|---|
| 1. Fond app blanc pur | 1 | [app.scss:331](src/main/webapp/app/app.scss#L331) `--ps-bg-app` |
| 2. Radius 8 px standard | 5.3 | tout fichier avec `rounded-xl`/`rounded-2xl` |
| 3. Pas de toggle dark V1 | 3 | [HeaderPro.tsx:43-51](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L43-L51) |
| 4. Bouton AI ghost | 3 | [HeaderPro.tsx:34-41](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L34-L41) |
| 5. Pas de glassmorphism | 3 | [PublicHeader.tsx:39](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L39) |
| 6. Gradient texte 1×/page | 4 (HomeHero) | [HomeHero.tsx:58](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L58) |
| 7. `neutral` canonique | 5.4 | tout fichier avec `slate-*` ou `gray-*` |
| 8. Pas d'animation infinie | 4 (HomeHero) | [HomeHero.tsx:171](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L171) |
| 9. Cards Pro sans ombre | 5.2 | [PanelCard.tsx](src/main/webapp/app/features/dashboard/components/PanelCard.tsx) etc. |
| 10. Cards landing hover-shadow-md max | 5.2 | PublicProductCards, ProSolutionSection |

---

**Fin du plan.** Document associé : [AUDIT_DESIGN_PROPSIGHT.md](AUDIT_DESIGN_PROPSIGHT.md).
