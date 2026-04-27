# AUDIT_DESIGN_PROPSIGHT

**Date :** 2026-04-25
**Portée :** design uniquement — frontend `src/main/webapp/app/`, [tailwind.config.js](tailwind.config.js), [app.scss](src/main/webapp/app/app.scss), `docs/01_DESIGN_SYSTEM.md`, `docs/02_LAYOUT_PRO.md`, `docs/07_MOTION_LANGUAGE.md`.
**Cible :** style premium Linear / Attio / Vercel / Stripe. Fond blanc dominant, violet Propsight en accent, Inter, radius 8 px, bordures fines, cards sobres, sans glow, sans glassmorphism, sans gradient décoratif lourd, sans animation gadget. Pro dense desktop-first / public plus aéré.

> **Aucune modification de code dans cet audit.** Ce document complète [AUDIT.md](AUDIT.md) (axé architecture/routing). Il se concentre sur la dimension visuelle/design system.
>
> **Note :** les fichiers `migration/CLAUDE_CODE_PROMPT.md`, `migration/MIGRATION.md`, `migration/README.md` n'existent pas dans le repo. Les références à un fichier `MIGRATION.md` dans [tailwind.config.js:151](tailwind.config.js#L151) sont orphelines.

---

## 0. État réel du design system actuel — résumé en un paragraphe

Le design system **existe sur le papier** : [tailwind.config.js](tailwind.config.js) définit une palette violet calibrée (`#7A6AF5`), une rampe de neutres chauds (cream `#F8F7F4` → ink `#14130F`), une échelle typographique nommée (`text-caption` → `text-display`), une ladder d'ombres unifiée (`xs/sm/md/lg/popover/focus`), des radii cohérents (`xs=3 / sm=4 / md=6 / lg=8 / xl=12 / 2xl=16`), des tokens motion (4 durées + 4 easings) et un dark mode par class. [app.scss](src/main/webapp/app/app.scss) miroir ces tokens en CSS custom properties (`--ps-*`).

**Mais en pratique, ce design system n'est presque jamais utilisé tel quel.** Les composants live re-définissent leurs propres valeurs : `text-[13px]` au lieu de `text-body`, `shadow-[0_4px_14px_-4px_rgba(122,106,245,0.5)]` au lieu de `shadow-md`, `rounded-2xl` au lieu de `rounded-lg`, `slate-200` au lieu de `neutral-200` (alors que les deux ramps pointent sur la **même** valeur via les alias du config). Il y a un design system *configuré* et un design system *réellement utilisé*, et l'écart entre les deux est la cause principale de l'incohérence visuelle.

À cela s'ajoute une dette structurelle : **deux implémentations actives** du shell Pro coexistent (`layouts/pro/*` et `features/shared/layout/*`), chacune avec sa propre Header et sa propre Sidebar. Les pages choisissent l'une ou l'autre selon leur historique. Tant que ce doublon vit, aucune cohérence visuelle n'est possible.

---

## 1. Incohérences UI actuelles

### 1.1 Trois noms pour la même rampe de gris

[tailwind.config.js:60-81](tailwind.config.js#L60-L81) définit `neutral`, `slate`, `gray` comme **trois alias de la même rampe warm-cream**. Conséquence : `bg-neutral-50`, `bg-slate-50`, `bg-gray-50` rendent le même pixel. Mais le code traite ces noms comme s'ils étaient distincts :

| Famille | Fichiers utilisateurs principaux | Volume estimé |
|---|---|---|
| `neutral-*` | [layouts/pro/HeaderPro.tsx](src/main/webapp/app/layouts/pro/HeaderPro.tsx), [layouts/pro/SidebarPro.tsx](src/main/webapp/app/layouts/pro/SidebarPro.tsx), [shared/drawers/EntityDrawerShell.tsx](src/main/webapp/app/shared/drawers/EntityDrawerShell.tsx), [features/public/home/sections/HomeHero.tsx](src/main/webapp/app/features/public/home/sections/HomeHero.tsx) | shells officiels + landings récentes |
| `slate-*` | [features/shared/layout/ProSidebar.tsx](src/main/webapp/app/features/shared/layout/ProSidebar.tsx), [features/dashboard/components/PanelCard.tsx](src/main/webapp/app/features/dashboard/components/PanelCard.tsx), [features/public/layout/PublicHeader.tsx](src/main/webapp/app/features/public/layout/PublicHeader.tsx), majorité des modules Pro (`features/biens`, `features/activite`, `features/prospection`, `features/veille`, `features/equipe`) | **dominant** |
| `gray-*` | rare, hérité JHipster | marginal |

Effet : impossible de faire un *grep & replace* propre. Lire le code donne l'illusion qu'il y a 3 nuances de gris distinctes alors qu'il n'y en a qu'une.

### 1.2 Sizes de texte : 7+ valeurs custom pour des cas adjacents

L'échelle typo nommée du config (`text-body=13px`, `text-body-lg=14px`, `text-small=12px`, `text-caption=10.5px`, `text-micro=11px`) est ignorée. À la place, on trouve dans le code :

- `text-[13px]` — partout
- `text-[12.5px]` — [HomeHero.tsx:110](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L110), [HomeHero.tsx:154](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L154), [PanelCard.tsx:17](src/main/webapp/app/features/dashboard/components/PanelCard.tsx#L17)
- `text-[13.5px]` — [PublicHeader.tsx:55](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L55), [PublicHeader.tsx:65](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L65)
- `text-[11.5px]`, `text-[11px]`, `text-[14.5px]`, `text-[10px]`, `text-[15px]`, `text-[17px]`, `text-[22px]`

L'échelle nommée existe mais reste inutilisée. Résultat : aucun moyen de garantir que deux labels de même rôle UI ont la même taille à travers les pages.

### 1.3 Ombres inline custom au lieu de la ladder

[tailwind.config.js:140-156](tailwind.config.js#L140-L156) définit `shadow-xs/sm/md/lg/popover/focus`. Mais :

- [HomeHero.tsx:84](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L84) : `shadow-[0_0_0_4px_rgba(122,106,245,0.12)]` (focus violet custom)
- [HomeHero.tsx:96](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L96) : `shadow-[0_4px_14px_-4px_rgba(122,106,245,0.5)]`
- [PublicHeader.tsx:100](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L100), [PublicHeader.tsx:116](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L116) : `shadow-[0_2px_8px_-2px_rgba(109,77,232,0.5)]`
- [PublicHeader.tsx:40](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L40) : `shadow-[0_1px_0_rgba(15,23,42,0.06)]`
- `features/biens/shared/CardBien.tsx`, `LeadDrawer.tsx` etc. : `shadow-[-8px_0_32px_rgba(0,0,0,0.08)]`, `shadow-[0_4px_12px_rgba(0,0,0,0.08)]`

Chaque ombre est une re-invention. Le token `shadow-focus` (`0 0 0 3px rgba(122,106,245,0.25)`) existe pour exactement le cas du HomeHero — il n'est pas utilisé.

### 1.4 Radius : la cible est 8 px, le code va jusqu'à 24 px

L'instruction est radius 8 px. Constat :

- `rounded-2xl` (16 px) : [HomeHero.tsx:84](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L84) (search bar), product cards landing publique (PublicProductCards), ProSolutionSection.
- `rounded-xl` (12 px) : 50+ occurrences (cards landing, boutons héro, badges, search bar pro stop).
- `rounded-lg` (8 px) — la cible — utilisé surtout pour les boutons Pro et nav.
- `rounded-md` (6 px) — utilisé pour mini-actions et inputs Pro.
- Aucun `rounded-[7px]` ou autre arbitraire — ✓ ce point est propre.

Le radius standard varie donc entre 6 et 16 px selon la page. Les pages publiques tirent vers le rond/aéré (12-16 px), les pages Pro vers le sec (6-8 px). C'est cohérent en interne mais **non aligné** avec un radius unique de 8 px dans tout le système.

### 1.5 Mélange de "blanc pur" et "warm cream" comme fond

[app.scss:331](src/main/webapp/app/app.scss#L331) : `--ps-bg-app: #F8F7F4` (warm cream). C'est le fond app par défaut, appliqué via `html, body { background: var(--ps-bg-app) }`.
Mais [AppShellPro.tsx:14](src/main/webapp/app/layouts/pro/AppShellPro.tsx#L14) force `bg-white` sur le shell racine et `bg-neutral-50` sur `<main>`. [PublicShell.tsx:24](src/main/webapp/app/layouts/public/PublicShell.tsx#L24) force `bg-white`.

Concrètement, le warm cream (`#F8F7F4`) ne s'affiche **nulle part** : il est toujours overridé par un blanc pur ou un slate-50 (= warm cream alias). Les utilisateurs voient donc soit du blanc, soit du `#F8F7F4` — selon que la zone est wrappée par AppShellPro ou pas. Décision produit nécessaire : blanc pur partout (Linear/Vercel) ou warm cream (Notion/Attio).

### 1.6 Couleurs sémantiques hors-palette dans le marketing

[features/public/home/sections/PublicProductCards.tsx](src/main/webapp/app/features/public/home/sections/PublicProductCards.tsx) utilise `from-sky-100 to-sky-50`, `from-emerald-100 to-emerald-50` selon le type de carte produit. Ces couleurs ne sont **pas** définies dans le tailwind.config et tombent sur les défauts Tailwind (qui ne sont *pas* alignés avec le warm cream). Ils sortent donc de la palette Propsight visuellement.

### 1.7 Animations résiduelles à la limite du gadget

- `animate-float-slow` (boucle infinie translate-Y -6 px) appliqué sur la mini-card flottante du hero ([HomeHero.tsx:171](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L171)). Boucle infinie sur élément non-skeleton — interdit par [docs/07_MOTION_LANGUAGE.md:377](docs/07_MOTION_LANGUAGE.md#L377).
- `animate-pulse-ring` défini dans le config mais non utilisé (mort).
- `bg-grid-dots` + 2 gradient blurs dans HomeHero ([HomeHero.tsx:28-36](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L28)) : limite haute, à arbitrer.
- Texte gradient violet (`bg-gradient-to-r from-propsight-700 via-propsight-500 to-propsight-400 bg-clip-text text-transparent`) dans HomeHero, ProHero, DataSourcesSection. Cohérent avec une landing SaaS, mais pas Linear/Stripe (qui restent en couleur unie).

---

## 2. Problèmes de design system

### 2.1 Décalage entre `docs/01_DESIGN_SYSTEM.md` (V1 spec) et l'implémentation

| Dimension | docs/01 spec | Tailwind config + app.scss | Code live |
|---|---|---|---|
| Violet primary | `#6D4DE8` | `#7A6AF5` | `#7A6AF5` |
| Neutres | `stone` warm Tailwind | `#F8F7F4 → #14130F` warm propre | `slate-*` ≡ `neutral-*` ≡ rampe propre, mais nommé "slate" |
| Radius standard | `0.5rem = 8px` | `lg = 8px` | mélange 6/8/12/16 px |
| Échelle typo | `text-xs → text-3xl` Tailwind par défaut | `caption/micro/small/body/body-lg/lead/title/h3/h2/h1/display` (custom nommée) | `text-[13px]` & co |
| Densité table | `py-2` | non précisé | ✓ `py-2` (cohérent) |
| Card | `border + p-4/p-6 + pas d'ombre` | non explicite | ✓ globalement aligné côté Pro |
| Header sticky | `sticky top-0 z-30 bg-background/80 backdrop-blur` | non explicite | ⚠ glassmorphism côté public uniquement |
| Box-shadow | `shadow-xs/sm/md/lg` | ladder définie | ⚠ peu utilisée |

**Trois sources de vérité (docs/01, tailwind.config, code live) qui divergent.** Aucune ne fait foi seule.

### 2.2 Pas de couche "sémantique" au-dessus des couleurs Tailwind

L'app a `bg-white`, `bg-neutral-50`, `border-slate-200`, `text-neutral-900`. Pas de `bg-surface`, `bg-surface-elevated`, `bg-surface-muted`, `text-fg-primary`, `text-fg-secondary`, `border-subtle`, `border-strong`. Les CSS custom properties `--ps-bg-surface`, `--ps-fg-1`, `--ps-border-subtle` existent dans [app.scss:331-345](src/main/webapp/app/app.scss#L331-L345) mais ne sont pas exposées en classes Tailwind. Conséquence : pour adapter dark mode, [app.scss:504-607](src/main/webapp/app/app.scss#L504-L607) doit *réécrire* à la main toutes les utilities `.bg-white`, `.bg-neutral-*`, `.text-slate-*`, `.border-gray-*` une par une — c'est une feuille de remap manuelle de 100+ lignes, fragile.

### 2.3 Ladder d'ombres dupliquée

[tailwind.config.js:140-156](tailwind.config.js#L140-L156) définit `shadow-xs/sm/md/lg/popover/focus` (la ladder cible) **plus** des alias legacy `subtle / map-panel / float-sm / float-md / float-lg`. Le commentaire dit "Delete these two blocks AFTER you've run the find/replace documented in MIGRATION.md" — mais MIGRATION.md n'existe pas. Les alias survivent. Aucun composant live ne les utilise, mais ils restent comme bruit.

### 2.4 Tokens dark mode non testés

Le dark mode est implémenté dans [app.scss:442-607](src/main/webapp/app/app.scss#L442-L607) avec 100+ lignes de remap de classes. Ce mode n'est jamais activé par défaut — mais [layouts/pro/HeaderPro.tsx:13-50](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L13-L50) propose un toggle (Moon/Sun) qui appelle `useThemeStore`. Risque : du dark mode existe dans l'app, ouvert au user, mais sans testing visuel systématique des composants. Premium Linear/Attio ne propose pas de dark mode par défaut sur leur app principale ; à arbitrer si on garde le toggle V1.

### 2.5 Tokens motion existent mais le code utilise des litéraux

[tailwind.config.js:160-171](tailwind.config.js#L160-L171) définit `transitionDuration.{120,180,240,320}` et `transitionTimingFunction.{standard,enter,exit,emphasis}`. Côté code, on a partout :

```tsx
transition={{ duration: 0.45 }}
transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
```

Les tokens existent, les conventions [docs/07_MOTION_LANGUAGE.md](docs/07_MOTION_LANGUAGE.md) décrivent un fichier `app/shared/motion/easings.ts` à créer — il n'existe pas. Chaque composant ré-écrit `[0.22, 1, 0.36, 1]` à la main. Quand on voudra fine-tuner le rythme global, il faudra grep & replace 100+ occurrences.

### 2.6 Pas de primitives UI partagées

Aucun `app/shared/ui/{Button,Card,Input,Badge,Drawer,Modal,Table}.tsx`. shadcn/ui n'est pas initialisé (pas de `components.json`). Chaque composant roule ses classes Tailwind inline. Conséquence : il y a probablement 30+ "boutons primaires" différents dans le code, chacun avec une variante mineure de hauteur/radius/ombre.

---

## 3. Problèmes de structure layout / shell

### 3.1 Doublon critique du shell Pro

**Deux Header Pro et deux Sidebar Pro coexistent**, chacun monté par un sous-ensemble de pages :

| Doublon | Version A — `layouts/pro/*` | Version B — `features/shared/layout/*` |
|---|---|---|
| Header | [HeaderPro.tsx](src/main/webapp/app/layouts/pro/HeaderPro.tsx) — h-13 (52 px), `border-neutral-200`, ⌘K central, Assistant IA bouton plein, theme toggle, ZoneSelector, Notifications, UserMenu | [ProHeader.tsx](src/main/webapp/app/features/shared/layout/ProHeader.tsx) — h-14 (56 px), `border-slate-200`, search local stateful, AI bouton **gradient `from-propsight-500 to-propsight-600`**, focus ring custom |
| Sidebar | [SidebarPro.tsx](src/main/webapp/app/layouts/pro/SidebarPro.tsx) — w-60 (240 px), config externalisée dans [config/proNavigation.ts](src/main/webapp/app/config/proNavigation.ts), feature flags + roles, item actif `bg-slate-100` ou `bg-propsight-50` | [ProSidebar.tsx](src/main/webapp/app/features/shared/layout/ProSidebar.tsx) — w-[236px], SECTIONS hardcodées inline, item actif idem mais avec **pastille violet 1.5×1.5 px** à droite ([ProSidebar.tsx:206](src/main/webapp/app/features/shared/layout/ProSidebar.tsx#L206)) |
| Layout wrapper | [AppShellPro.tsx](src/main/webapp/app/layouts/pro/AppShellPro.tsx) — utilise `<Outlet />`, intègre `EntityDrawerShell` + `AIDrawer` + `CommandSearch` | [features/shared/layout/ProLayout.tsx](src/main/webapp/app/features/shared/layout/ProLayout.tsx) — `{children}`, pas de drawer global |

[AUDIT.md §1.4](AUDIT.md) confirme : Dashboard et BiensPages utilisent encore ProLayout (version B), tandis que [routes.tsx](src/main/webapp/app/routes.tsx) **monte** la version A (`AppShellPro`). Il y a donc des pages avec la *version A montée par routing* mais qui *importent localement* la version B. Le rendu visuel devient imprévisible.

### 3.2 Header public : micro-glassmorphism interdit

[PublicHeader.tsx:39](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L39) :
```tsx
className="sticky top-0 z-40 bg-white/85 backdrop-blur-md ... border-b border-slate-200/60"
```
`bg-white/85 backdrop-blur-md` = exactement le pattern Apple/glassmorphism que la cible interdit. Linear, Vercel, Stripe : header solide blanc avec bordure 1 px ; pas de blur. À supprimer.

### 3.3 Sidebars locales dans 8 modules — déjà tracées dans AUDIT.md

[AUDIT.md §3.3](AUDIT.md) liste 8 layouts de feature (`ActiviteLayout`, `EstimationLayout`, `ProspectionLayout`, `ObservatoireLayout`, `VeilleLayout`, `EquipeLayout`, `InvestissementLayout`, `WidgetsLayout`) qui rendent chacun leur propre `<aside>` 196-220 px à côté de la SidebarPro globale. **Visuellement, l'utilisateur voit deux sidebars empilées dans certains modules** — incompatible avec la cible Linear/Attio (sidebar unique stricte). Suppression déjà actée dans l'audit archi, à exécuter.

### 3.4 Page-shells partiellement déployés

[layouts/page-shells/](src/main/webapp/app/layouts/page-shells/) contient `StandardPageShell`, `WorkspacePageShell`, `SplitMapPageShell`, `ReportEditorShell`. Bonne intention. Mais les pages live (Dashboard, RadarPage, EstimationRapideList, PortefeuillePage) ne les consomment pas — chaque page rolle son propre header de page (`<header>` inline avec titre + actions). Conséquence : aucune garantie de cohérence sur la zone *au-dessus du contenu* (titre, breadcrumb, actions, KPI strip).

### 3.5 Pas de `Toolbar` / `PageHeader` standardisé

Lié à 3.4. Chaque page Pro réinvente sa barre de titre. Hauteurs varient (40 px à 56 px), padding varie (px-4 vs px-6), structure varie (titre seul / titre+sous-titre / titre+actions à droite / titre+filtres+actions). Linear et Attio ont une barre de titre **identique** sur toutes leurs pages.

---

## 4. Problèmes par catégorie de composants

### 4.1 Boutons

**Aucun composant `Button` partagé.** Tous les boutons sont des `<button className="...">` inline. Variantes observées :

| Variant | Hauteur | Radius | Ombre | Échantillon |
|---|---|---|---|---|
| Primary Pro | h-9 (36 px) | rounded-md (6 px) | aucune | [HeaderPro.tsx:37](src/main/webapp/app/layouts/pro/HeaderPro.tsx#L37) |
| Primary public CTA | h-9 (36 px) | rounded-lg (8 px) | `shadow-[0_2px_8px_-2px_rgba(109,77,232,0.5)]` | [PublicHeader.tsx:100](src/main/webapp/app/features/public/layout/PublicHeader.tsx#L100) |
| Primary hero CTA | h-11 (44 px) | rounded-xl (12 px) | `shadow-[0_4px_14px_-4px_rgba(122,106,245,0.5)]` | [HomeHero.tsx:96](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L96) |
| Primary hero CTA (autre) | h-12 (48 px) | rounded-xl (12 px) | `shadow-[0_4px_16px_-4px_rgba(109,77,232,0.45)]` | ProFinalCtaSection |
| Primary mini-card | h-8 (32 px) | rounded-lg (8 px) | aucune | [HomeHero.tsx:195](src/main/webapp/app/features/public/home/sections/HomeHero.tsx#L195) |
| Secondary | h-9 | rounded-lg | aucune | PublicHeader "Espace Pro" |

**Constat :** 5+ variantes du "bouton primaire" pour la même couleur de marque. Aucun `Button size="sm" variant="primary"` partagé.

### 4.2 Cards

| Pattern | Surface | Radius | Border | Ombre | Échantillon |
|---|---|---|---|---|---|
| PanelCard (Pro) | bg-white | rounded-lg (8) | slate-200 | aucune | [PanelCard.tsx:14](src/main/webapp/app/features/dashboard/components/PanelCard.tsx#L14) |
| KPI tile | bg-white | rounded-lg | slate-200 | hover:shadow-sm | KpiStrip dashboard |
| Card public produit | bg-white | rounded-2xl (16) | slate-200 | hover:shadow-lg | PublicProductCards |
| Card pro module landing | bg-white | rounded-xl (12) | slate-200 | hover:shadow-md | ProModulesSection |
| Card solution | bg-white | rounded-2xl | slate-200 | hover:shadow-md | ProSolutionSection |
| Float card hero | bg-white | rounded-[14px] (CSS custom) | neutral-200 | shadow-lg permanent | [.float-card](src/main/webapp/app/app.scss#L722-L727) |
| Stat tile hero | bg-white | rounded-[10px] | neutral-200 | hover:shadow-sm | [.stat-tile](src/main/webapp/app/app.scss#L646-L656) |
| Drawer card lead | bg-white | aucun radius | slate-200 | shadow-[-8px_0_32px_rgba(0,0,0,0.08)] | DrawerBien |

**8 patterns différents pour "une surface élevée".** Trois familles de radius coexistent (8 / 12 / 16 px), et la "stat-tile" / "float-card" du hero utilisent des radius custom CSS (10 et 14 px) qui ne correspondent à aucun token Tailwind. La cible 8 px est rarement respectée.

### 4.3 Tables

[features/activite/leads/components/TableView.tsx](src/main/webapp/app/features/activite/leads/components/TableView.tsx), [features/biens/shared/TableBiens.tsx](src/main/webapp/app/features/biens/shared/TableBiens.tsx) et autres tables pages-Pro ont une bonne densité (`py-2`, `text-[12px]` corps, header `text-[10px] uppercase`, hover faible). Bon point. **Mais aucun composant `<Table>` / `<DataTable>` partagé.** Chaque module redessine sa structure HTML, sa logique de tri, ses badges de statut. Risque de divergence dès qu'une page ajoute un détail (ex : sticky header, sélection multiple, virtualisation pour grandes listes).

### 4.4 Headers

Voir §3.1 (doublon Pro) et §3.2 (glassmorphism public). Plus subtil :

- **Hauteurs incohérentes** entre les deux versions Pro (52 vs 56 px) — l'EntityDrawerShell utilise h-13 (52 px) qui s'aligne sur la version A. Si version B est utilisée, le drawer s'aligne mal.
- **Pas de PageHeader standardisé** : voir §3.5.

### 4.5 Sidebars

Voir §3.1 (doublon) et §3.3 (sidebars locales). Spécifiquement sur la version A officielle ([SidebarPro.tsx](src/main/webapp/app/layouts/pro/SidebarPro.tsx)) :

- **Logo dans le header de la sidebar** (h-14, 56 px) au lieu de dans le HeaderPro (52 px). Désalignement vertical de 4 px entre haut de sidebar et haut de page. Linear/Attio alignent toujours logo et page top.
- **Item actif** : 1er niveau utilise `bg-slate-100` (gris), 2e niveau `bg-propsight-50` (violet pâle). Logique correcte mais le 1er niveau actif sans son sous-item ouvert n'est pas traité (groupe collapsible avec un enfant actif n'a pas de marker visuel sur le parent).

### 4.6 Drawers

[EntityDrawerShell.tsx](src/main/webapp/app/shared/drawers/EntityDrawerShell.tsx) — drawer "officiel" — est sobre :
- Backdrop : `bg-neutral-900/30`
- Largeur : 480 px
- Header : h-13 (52 px), `border-b`, label uppercase `text-[10px]` + ID
- Pas d'ombre custom, juste `shadow-md`
- Animation : aucune (pas de `motion`)

→ **Excellent point de départ**, c'est le pattern à généraliser. Mais les drawers métiers ([LeadDrawer.tsx](src/main/webapp/app/features/activite/leads/components/LeadDrawer.tsx), [DrawerBien.tsx](src/main/webapp/app/features/biens/shared/DrawerBien.tsx), [DrawerShell.tsx](src/main/webapp/app/features/veille/components/drawer/DrawerShell.tsx)) ne l'utilisent pas et ré-implémentent leur propre `<aside fixed>` avec :
- Largeur variable (420 / 440 / 480 px)
- Top offset variable (0 / 76 px)
- Z-index variable (40 / 50 / 100)
- Ombre custom (`shadow-2xl` / `shadow-lg` / `shadow-[-8px_0_32px_rgba(0,0,0,0.08)]`)
- Animation parfois (`motion.aside`) parfois pas

**4+ implémentations de drawers en parallèle.** À unifier sur EntityDrawerShell (renforcé).

---

## 5. Écarts vs style premium cible

Référence visuelle cible (claire, par produit) :

- **Linear** : blanc pur, violet/bleu unique, sidebar 220-240 px collapsible, table 32 px de ligne, bord 1 px slate-200, zéro ombre permanente, focus ring 2 px violet, micro-stagger uniquement sur les listes.
- **Attio** : blanc pur, accent gris-bleu, command palette omniprésente, drawers larges (560-640 px), tables avec sticky cols, beaucoup de inline-edit.
- **Vercel** : blanc pur, noir, minuscules ombres, monospace pour les IDs, cards avec border et **aucune ombre par défaut**.
- **Stripe** : blanc pur (sauf docs), bleu profond unique, tables denses, illustrations isométriques minimales, hover = changement de couleur, jamais de scale.

### 5.1 Tableau d'écarts

| Critère cible | Réalité actuelle | Écart | Sévérité |
|---|---|---|---|
| Fond blanc dominant | warm cream `#F8F7F4` côté `<main>`, blanc côté `<header>` et drawers | mélange | **Bloquant** — décision produit |
| Violet en accent uniquement | violet utilisé en aplat + gradient texte + gradient icone + ombres custom violettes | sur-utilisation | Moyen |
| Inter | ✓ utilisé partout | aucun | OK |
| Radius 8 px | mélange 6/8/12/16 px, custom 10/14 px | divergence | **Bloquant** — sweep nécessaire |
| Bordures fines | ✓ 1 px partout | aucun | OK |
| Cards sobres | bordure OK, mais ombres au hover (`hover:shadow-md`) trop marquées sur landing | léger | Faible |
| Pas de glow | ✓ aucun glow | aucun | OK |
| Pas de glassmorphism | ⚠ `backdrop-blur-md` PublicHeader | présent | **Moyen** |
| Pas de gradient décoratif lourd | ⚠ 2 gradient blurs hero + texte gradient + icon gradient | discutable | Moyen |
| Pas d'animation gadget | ⚠ `animate-float-slow` infini sur mini-card hero | présent | Faible |
| Pro dense desktop-first | ✓ densité respectée (py-2, h-8, gap-2.5) | aucun | OK |
| Public plus aéré | ✓ hero respire | aucun | OK |
| Motion micro-utiles uniquement | ⚠ scroll-reveal à toutes les sections du hero | acceptable mais à doser | Faible |

### 5.2 Verdict

**70 % du chemin est déjà fait** (palette, fonts, densité Pro, ladder d'ombres, neutres warm définis). Les 30 % restants sont :

1. **Choix produit blanc pur vs warm cream** (5 minutes de décision).
2. **Discipline tokens** : faire utiliser `text-body`, `shadow-md`, `rounded-lg` — sweep sur 100+ fichiers.
3. **Suppression du doublon Pro** (HeaderPro/SidebarPro V2).
4. **Suppression du backdrop-blur PublicHeader**.
5. **Allégement des ornements hero** (1 gradient blur max, pas de float-slow, gradient texte conservé en option).
6. **Création des primitives Button/Card/Input/Drawer**.

Aucun de ces points ne demande de "redesign". C'est de la rigueur d'application.

---

## 6. Composants à refactorer en priorité

Classés par ROI design (impact visuel × surface couverte).

### Priorité 1 — Le shell Pro (impact maximum, touche toutes les pages /app/*)

1. **Choisir entre `layouts/pro/SidebarPro` et `features/shared/layout/ProSidebar`** → garder version A officielle, supprimer V2 et tous les imports vers V2.
2. **Choisir entre `layouts/pro/HeaderPro` et `features/shared/layout/ProHeader`** → garder version A.
3. **Aligner verticalement Logo header + Logo sidebar** (les deux à h-13 ou h-14 — pas un mix).
4. **Supprimer toggle dark mode** ou le déplacer dans UserMenu (pas dans la barre principale — Linear/Attio ne montrent pas un toggle perma).
5. **Supprimer le bouton "Assistant IA" plein violet** du header ou le rendre `ghost` — il vole l'attention en permanence et n'est pas le bouton primaire de la page.

### Priorité 2 — Les primitives manquantes (touche tous les nouveaux développements)

6. **`app/shared/ui/Button.tsx`** — variants `primary | secondary | outline | ghost | destructive`, sizes `xs | sm | md | lg`, `loading`, `icon-only`. Source unique de tous les boutons.
7. **`app/shared/ui/Card.tsx`** — slot `header / body / footer`, padding tokens (`compact | default | comfort`), bordure 1 px, sans ombre par défaut, `hover` opt-in.
8. **`app/shared/ui/Input.tsx`** + `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch` — h-9 par défaut, focus ring violet `shadow-focus`.
9. **`app/shared/ui/Drawer.tsx`** — wrap d'EntityDrawerShell, sizes `sm=420 | md=480 | lg=640`, animation slide standardisée.
10. **`app/shared/ui/Modal.tsx`** — fade + scale 0.96 → 1 (pattern doc/07 §2.4).
11. **`app/shared/ui/Badge.tsx`** + `StatusBadge` (statuts Propsight) + `DPEBadge`.
12. **`app/shared/ui/PageHeader.tsx`** — titre + sous-titre + actions droite + breadcrumb optionnel. Hauteur fixe 56 px, sticky.
13. **`app/shared/ui/Table.tsx`** — header sticky, sort, dense par défaut, sélection multiple opt-in.

### Priorité 3 — Les ornements landing (impact perception premium)

14. **HomeHero** : retirer `animate-float-slow`, retirer un des 2 gradient blurs, dé-ovrer le texte gradient (passer en plain `text-propsight-700`), unifier la search bar (h-14, rounded-2xl) sur les autres pages publiques.
15. **PublicHeader** : retirer `backdrop-blur-md`, passer en `bg-white` solide + `border-b border-neutral-200`.
16. **PublicProductCards** : remplacer `from-sky-100 to-sky-50` et `from-emerald-100 to-emerald-50` par des accents semantiques internes à la palette Propsight (un seul accent violet + 1 neutre).
17. **`.float-card` / `.stat-tile`** dans [app.scss:646-727](src/main/webapp/app/app.scss#L646-L727) : unifier radius (passer à 8 px), supprimer si remplacés par `<Card>` partagé.

### Priorité 4 — Les sweeps token (gros volume, faible risque)

18. **Sweep `text-[Npx]` → tokens** : remplacer chaque `text-[13px]` par `text-body`, `text-[12px]` par `text-small`, etc. Migration mécanique.
19. **Sweep `shadow-[...]` inline → ladder** : remplacer chaque ombre custom par `shadow-{xs|sm|md|lg|popover|focus}`.
20. **Sweep `rounded-2xl` / `rounded-xl` → `rounded-lg`** sauf hero search.
21. **Sweep `slate-*` ↔ `neutral-*`** : choisir un seul nom (recommandé : `neutral`), migrer tout le reste.
22. **Sweep durée/easing motion** : créer `app/shared/motion/` (variants, easings, durations) et remplacer les literals dans les composants.

### Priorité 5 — Hygiène

23. Supprimer les 8 layouts locaux modules (`features/*/layout/*Layout.tsx`) — voir [AUDIT.md §3.3](AUDIT.md).
24. Supprimer `features/shared/layout/{ProHeader, ProSidebar, ProLayout}.tsx` après bascule sur version A.
25. Supprimer les alias `shadow-{subtle, map-panel, float-sm/md/lg}` dans tailwind.config (legacy mort).
26. Supprimer `animate-pulse-ring` et `animate-shimmer` du config s'ils ne sont vraiment utilisés nulle part.

---

## 7. Stratégie de refonte progressive sans casser l'app

Principe : **tokens d'abord, primitives ensuite, sweep en dernier.** À aucun moment on ne refait une page entière "from scratch". On change toujours par couches transverses.

### Phase A — Décisions (1-2 jours, zéro code)

**Sortie :** un ADR (architecture decision record) court qui acte :

1. **Fond app** : blanc pur `#FFFFFF` ou warm cream `#F8F7F4` ? *Recommandation : blanc pur, c'est l'esthétique Linear/Vercel/Stripe.*
2. **Radius standard** : 8 px partout pour le Pro ; 12 px autorisé sur landing hero search uniquement. Tous les autres `rounded-xl/2xl` repassent à `rounded-lg`.
3. **Mode sombre** : on conserve les tokens dark mais on retire le toggle visible V1. *Recommandation : pas de toggle utilisateur, on évite la surface de bug.*
4. **Glassmorphism** : interdit, y compris `backdrop-blur` sur le PublicHeader.
5. **Gradient texte** : autorisé une fois max sur landing publique, jamais en Pro.
6. **Animation infinite** : interdite hors skeleton (donc retrait de `float-slow`).
7. **Slate vs neutral** : on choisit `neutral` comme nom canonique. Les classes `slate-*` deviennent legacy à supprimer.

### Phase B — Primitives & tokens (3-5 jours)

Travail sans casser l'existant. Tout ce qu'on ajoute est nouveau, donc sans risque de régression :

1. Créer `app/shared/ui/{Button, Card, Input, Drawer, Modal, Badge, PageHeader, Table}.tsx` (+ `index.ts` qui réexporte).
2. Créer `app/shared/motion/{easings, durations, distances, variants/}.ts` selon [docs/07_MOTION_LANGUAGE.md §7](docs/07_MOTION_LANGUAGE.md#L407-L424).
3. Créer une page `/design-system` (Pro uniquement) qui rend toutes les primitives × toutes leurs variantes.
4. Étendre `tailwind.config.js` pour exposer les CSS custom properties `--ps-*` en classes utilities sémantiques (`bg-surface`, `bg-surface-elevated`, `text-fg-1`, `text-fg-2`, `border-subtle`, `border-strong`). Ça simplifie le dark mode et la sémantique générale.

### Phase C — Bascule du shell Pro (1-2 jours)

Un seul commit, focalisé :

1. Faire de [layouts/pro/AppShellPro.tsx](src/main/webapp/app/layouts/pro/AppShellPro.tsx) la seule porte d'entrée : confirmer que [routes.tsx](src/main/webapp/app/routes.tsx) le monte (déjà le cas). Identifier les pages qui montent encore `ProLayout` localement et les migrer.
2. Supprimer `features/shared/layout/{ProHeader, ProSidebar, ProLayout}.tsx`.
3. Aligner Logo header + Logo sidebar à la même hauteur (h-13 = 52 px partout).
4. Retirer le toggle theme du HeaderPro (le mettre dans UserMenu pour V1).
5. Retirer ou ghost-iser le bouton Assistant IA du header.

### Phase D — Pages pilotes (1 page Pro + 1 page publique en // = 2-3 jours)

Voir §8 pour le choix des pilotes. Sur ces pages :
- Toutes les surfaces passent par `<Card>` partagé.
- Tous les boutons par `<Button>` partagé.
- Tous les inputs par `<Input>` partagé.
- Le PageHeader par `<PageHeader>`.
- Aucun `text-[Npx]`, aucun `shadow-[...]`, aucun `rounded-2xl`.

C'est le moment de **valider visuellement** que le design cible se tient avant de l'imposer sur 30+ pages.

### Phase E — Sweep token (parallélisable, mécanique, 2-3 jours)

Un PR par sweep, indépendant des autres :
1. Sweep `text-[*]` → tokens nommés.
2. Sweep `shadow-[*]` inline → ladder.
3. Sweep `rounded-{xl,2xl}` → `rounded-lg` sauf opt-out marketing explicite.
4. Sweep `slate-*` → `neutral-*`.
5. Sweep durée motion → tokens.

Chaque sweep est purement mécanique, peut tourner avec un script `find/replace`, et est très facile à reviewer (diff homogène).

### Phase F — Migration des pages restantes (au fil de l'eau)

Dès qu'une page est touchée pour une raison fonctionnelle, on la migre sur les primitives. Pas de big bang. CLAUDE.md §2.1 le dit déjà : *"Les composants JHipster legacy restent en place jusqu'à ce qu'on les touche."* Même règle pour la dette design.

### Phase G — Nettoyage

- Supprimer les 8 layouts locaux modules.
- Supprimer les alias d'ombres legacy.
- Supprimer les keyframes inutilisés (`pulse-ring`, `shimmer` si non rebranchés).
- Régénérer la page `/design-system` comme source de vérité.

### Garde-fous

- **Snapshot visuel** sur 5 pages clés avant Phase C (Dashboard, Portefeuille, Radar, EstimationRapideList, HomeHero). Comparer après chaque phase.
- **Pas de modification simultanée** Phase C + Phase E. Le shell change, OU les tokens changent, jamais les deux dans le même PR.
- **ArchUnit / ESLint** : ajouter une règle qui interdit `text-[`, `shadow-[`, `rounded-[` dans `app/features/` après Phase E (autorisés uniquement dans `app/shared/ui/` et `app/shared/motion/`).

---

## 8. Pages pilotes recommandées pour commencer

Critère de choix : page **représentative** d'un pattern, **isolée** du reste du flow (pas de risque de casse), avec **propriétaire métier clair**.

### 8.1 Pilote Pro #1 — `app/features/dashboard/DashboardPage.tsx`

**Pourquoi :**
- Page d'entrée Pro : la première impression visuelle.
- Couvre les patterns : `PageHeader`, `KPI strip`, `PanelCard` × 6, scroll layout fixe.
- Déjà dense et bien structurée → migration vers primitives = juste remplacement.
- Aucune logique métier critique à risquer.

**Patterns à matérialiser sur cette page :**
- `<PageHeader title="Tableau de bord" subtitle="..." actions={...} />`
- `<KpiStrip>` ← composant primaire
- `<Card>` × 6 panels
- `<Button variant="ghost" size="sm">` pour les actions de panel header

### 8.2 Pilote Pro #2 — `app/features/biens/portefeuille/PortefeuillePage.tsx`

**Pourquoi :**
- Couvre les patterns table dense + cards + map (3 view modes).
- Prouve que `<Table>` / `<Card>` partagés tiennent sur une grosse liste avec filtres.
- Page très utilisée — premier vrai test de robustesse.

**Patterns à matérialiser :**
- `<Table>` avec sort + sticky header.
- `<ToggleGroup>` (table | cards | map).
- `<Drawer size="md">` pour le détail bien (réunir [DrawerBien.tsx](src/main/webapp/app/features/biens/shared/DrawerBien.tsx) + EntityDrawerShell).
- `<Filters>` toolbar.

### 8.3 Pilote Public — `app/features/public/home/PublicHome.tsx` (HomeHero seul, pas toute la page)

**Pourquoi :**
- Vitrine : ce que voit un prospect en arrivant.
- Bon test du curseur "premium sobre" — c'est ici qu'on tranche le débat gradient/glow/float.
- Touche aux primitives `<Button>` (CTA), `<Card>` (stat-tile, float-card), `<Input>` (search hero).

**Patterns à matérialiser :**
- `<HeroSearch>` (composant landing).
- `<KpiTile>` (variant aéré du KPI Pro, mêmes tokens).
- `<Button size="lg" variant="primary">` cohérent avec Pro.

### 8.4 Pilote drawer — refonte `<Drawer>` partagé sur 1 cas

Ré-implémenter [LeadDrawer.tsx](src/main/webapp/app/features/activite/leads/components/LeadDrawer.tsx) **par-dessus** `<Drawer size="md">`. C'est le drawer le plus utilisé de l'app — si la primitive tient ici, elle tient partout.

### 8.5 Page de design system

Créer `/app/design-system` (route Pro, behind `featureFlag` debug) qui rend :
- Tous les `<Button>` × variants × sizes × états (default/hover/focus/loading/disabled).
- Tous les `<Card>` × densités.
- Tous les `<Input>` × états.
- L'échelle typo (`text-caption` → `text-display`).
- La rampe violette + neutres + sémantiques.
- Les ladder d'ombres + radii.
- Les statuts Propsight (`StatusBadge` × tous statuts).
- Une `<Table>` exemple.
- Un `<Drawer>` exemple.

C'est le **repoint visuel unique** pour toute l'équipe + référence pour Claude Code dans les prochaines sessions.

---

## 9. Comment utiliser Motion proprement

Référence : [docs/07_MOTION_LANGUAGE.md](docs/07_MOTION_LANGUAGE.md) — **excellent document, à appliquer sans modification.** Les règles ci-dessous sont l'extrait actionnable.

### 9.1 Bibliothèque

Garder **`framer-motion@12`** (déjà installé). Importer via `"framer-motion"` (pas via `"motion/react"` qui demande un package séparé). À mettre comme convention dans [.eslintrc] : interdire `import * as Motion`, autoriser uniquement `import { motion, AnimatePresence, useReducedMotion } from "framer-motion"`.

### 9.2 Tokens à créer dans `app/shared/motion/`

```
app/shared/motion/
├── easings.ts           — { default, enter, exit, linear }
├── durations.ts         — { instant: 0, fast: 0.15, base: 0.22, slow: 0.32 }
├── distances.ts         — { xs: 4, sm: 8, md: 12, lg: 20 }
├── staggers.ts          — { tight: 0.04, base: 0.06, loose: 0.08 }
├── variants/
│   ├── scrollReveal.ts
│   ├── staggerGrid.ts
│   ├── drawer.ts
│   ├── modal.ts
│   └── toggle.ts
├── useSafeMotion.ts     — helper reduced-motion
└── index.ts
```

Toute valeur de durée/easing/distance utilisée dans un composant **doit** venir de ce dossier. Aucun `[0.22, 1, 0.36, 1]` en dur ailleurs.

### 9.3 Règles dures (issues de docs/07)

| Règle | Application |
|---|---|
| Durée ≤ 320 ms (instant/fast/base/slow), 480 ms en exception unique sur hero | `transition={{ duration: durations.base }}` |
| Easing par défaut = `easings.default` (`[0.22, 1, 0.36, 1]`) | 95 % des cas |
| Easings `.enter` et `.exit` réservés overlays (modal, drawer) | Drawer EntityDrawerShell, AIDrawer |
| Stagger ≤ 80 ms (`staggers.tight = 40 ms` par défaut sur listes denses) | Listes leads, kanban, KPI grid |
| Distance reveal ≤ 24 px (`distances.md = 12 px` par défaut) | `initial={{ y: distances.md }}` |
| `useReducedMotion` obligatoire dès qu'il y a `initial`/`animate` | Helper `useSafeMotion` |
| Aucune animation infinie hors skeleton | À retirer de HomeHero |
| Aucune animation décorative dans `/app/*` | Drawers, toggles, badges count uniquement |
| Pas de `width`/`height`/`top`/`left` animés | Transform / opacity uniquement |
| `whileInView` avec `once: true, margin: "-10% 0px"` | Sections landing |

### 9.4 Patterns autorisés (exhaustif)

Le code futur n'a le droit de copier que ces patterns, repris de [docs/07_MOTION_LANGUAGE.md §2](docs/07_MOTION_LANGUAGE.md#L98-L268) :

1. **Scroll reveal section** (`whileInView` + `once: true`).
2. **Stagger grille** (children fade + y).
3. **Drawer slide-in** (x: 100 % → 0).
4. **Modale fade + scale** (0.96 → 1).
5. **Hover card Pro** (y: -1 px max + shadow change).
6. **Toggle pill** (layoutId).
7. **Tab switch** (layoutId + crossfade).
8. **Badge count** (key animation, popLayout).
9. **Skeleton shimmer** (CSS, pas JS).

**Tout autre pattern doit être discuté en review.**

### 9.5 Pour la refonte premium

- **Phase A décisions :** confirmer pas de scroll-jacking, pas de parallax, pas de mesh-gradient animé, pas de morphing.
- **Phase B :** créer `app/shared/motion/` complet.
- **Phase D pilote DashboardPage :** zéro animation d'entrée de page (les KPI strip et les panels apparaissent avec leur skeleton, le skeleton fait place au contenu sans transition). Hover sur cards = `y: -1`, ombre passe de `none` à `shadow-sm`.
- **Phase D pilote HomeHero :** garder le scroll reveal staggered sur les sections, **retirer `animate-float-slow`** sur la mini-card, **garder** le fade + y du h1/p/search bar (durée 320-480 ms acceptable sur hero unique).

---

## 10. Comment utiliser 21st.dev Magic comme inspiration uniquement

21st.dev Magic (le MCP `mcp__magic__*`) propose des composants pré-faits à coller. **Risque pour Propsight :** ces composants sont presque tous "SaaS générique néon" (gradients vifs, ombres marquées, glow, glassmorphism) — exactement ce qu'on veut éviter.

### 10.1 Règles d'utilisation

| À faire | À ne pas faire |
|---|---|
| Demander à `21st_magic_component_inspiration` une **structure d'interaction** (ex : "drawer avec header sticky + body scroll + footer pinned"). Reprendre la structure HTML/JSX et la **réimplémenter** avec nos tokens et nos primitives. | Demander un composant complet et coller le résultat tel quel. |
| Demander une **logique de composition** (ex : "table avec sticky header + sélection multiple + bulk actions"). Reproduire le découpage. | Reprendre les classes Tailwind du résultat (couleurs, ombres, radii). |
| Utiliser `21st_magic_component_refiner` sur **notre composant existant** pour challenger la hiérarchie et l'accessibilité. | Utiliser le refiner pour adopter un style externe. |
| `logo_search` pour des intégrations partenaires (DVF, ADEME, INSEE). | `logo_search` pour le logo Propsight (déjà fixé). |

### 10.2 Procédé pratique

1. Quand on doit créer un composant non trivial (ex : `DataTable`, `Combobox`, `RangeSlider`, `DatePicker`), invoquer `21st_magic_component_inspiration` avec la requête.
2. Lire 2-3 résultats. **Noter uniquement** : structure HTML, hiérarchie d'accessibilité (aria-*), gestion de focus, gestion clavier, états (loading/empty/error).
3. **Jeter** : couleurs, gradients, radii, ombres, animations.
4. Réimplémenter en utilisant `app/shared/ui/{Button,Card,Input,...}` + tokens Propsight.
5. Mettre l'inspiration en commentaire d'en-tête : `// Pattern inspiré de [source]`.

### 10.3 Exclusions strictes

Ne **jamais** invoquer `21st_magic_component_builder` pour :
- Header / Sidebar (on a notre shell).
- Boutons / Cards / Inputs (on a nos primitives ou on les construit).
- Hero landing (notre HomeHero est notre identité).
- Logo, brand element.

---

## Annexes

### A. Tableau récapitulatif des fichiers à supprimer / refondre / créer

| Action | Chemin | Phase |
|---|---|---|
| Supprimer | `src/main/webapp/app/features/shared/layout/ProHeader.tsx` | C |
| Supprimer | `src/main/webapp/app/features/shared/layout/ProSidebar.tsx` | C |
| Supprimer | `src/main/webapp/app/features/shared/layout/ProLayout.tsx` | C |
| Supprimer | 8 × `features/*/layout/*Layout.tsx` (cf. [AUDIT.md §3.3](AUDIT.md)) | C |
| Supprimer | Alias `shadow-{subtle, map-panel, float-sm/md/lg}` dans tailwind.config | G |
| Supprimer | `animate-pulse-ring`, `animate-shimmer` (si inutilisés après audit) | G |
| Supprimer | `animate-float-slow` sur mini-card | D (HomeHero) |
| Supprimer | `backdrop-blur-md` du PublicHeader | C |
| Refondre | `app/features/dashboard/components/PanelCard.tsx` → `app/shared/ui/Card.tsx` | B |
| Refondre | `app/shared/drawers/EntityDrawerShell.tsx` (renforcer) → `app/shared/ui/Drawer.tsx` | B |
| Refondre | `app/shared/drawers/AIDrawer.tsx` (utiliser nouvelle primitive Drawer) | C |
| Refondre | `app/layouts/page-shells/StandardPageShell.tsx` (utiliser PageHeader primitive) | D |
| Créer | `app/shared/ui/Button.tsx` | B |
| Créer | `app/shared/ui/Card.tsx` | B |
| Créer | `app/shared/ui/Input.tsx` (+ Textarea, Select, Checkbox, Radio, Switch) | B |
| Créer | `app/shared/ui/Drawer.tsx` | B |
| Créer | `app/shared/ui/Modal.tsx` | B |
| Créer | `app/shared/ui/Badge.tsx` (+ StatusBadge, DPEBadge, ConfidenceIndicator) | B |
| Créer | `app/shared/ui/PageHeader.tsx` | B |
| Créer | `app/shared/ui/Table.tsx` | B (ou D si gros chantier) |
| Créer | `app/shared/ui/ToggleGroup.tsx` | B |
| Créer | `app/shared/motion/{easings,durations,distances,staggers,variants/}.ts` | B |
| Créer | `app/shared/ui/index.ts` (réexports) | B |
| Créer | Page `/app/design-system` (Pro, behind feature flag) | D |
| Créer | ADR design (décisions Phase A) → `docs/ADR/2026-04-design-system-v1.md` | A |

### B. Décisions Phase A à prendre — checklist

- [ ] Fond app : blanc pur ou warm cream ? (recommandé : blanc pur)
- [ ] Radius standard : 8 px max ou ouvrir 12 px sur exceptions hero ? (recommandé : 8 px partout, exception hero search bar uniquement)
- [ ] Toggle dark mode V1 : visible header / dans UserMenu / supprimé ? (recommandé : supprimé V1)
- [ ] Bouton Assistant IA : plein violet header / ghost / déplacé en sidebar ? (recommandé : ghost dans header, OU pinned bas-sidebar)
- [ ] Glassmorphism PublicHeader : retirer ? (recommandé : oui)
- [ ] Gradient texte hero : conserver / passer plain / autoriser uniquement landing publique ? (recommandé : autoriser uniquement landing publique, max 1 par page)
- [ ] `slate` vs `neutral` : nom canonique ? (recommandé : `neutral`)
- [ ] `animate-float-slow` : retirer ? (recommandé : oui)
- [ ] Mode sombre : tester systématiquement / accepter dette / supprimer ? (recommandé : accepter dette V1, retest V2)

### C. Métriques de succès

À tracker avant/après refonte :

| Métrique | Méthode | Cible post-refonte |
|---|---|---|
| Nombre de classes `text-[Npx]` arbitraires | grep | < 5 (uniquement hero exceptions) |
| Nombre de classes `shadow-[...]` inline | grep | 0 |
| Nombre de `rounded-{xl,2xl}` | grep | < 10 (hero uniquement) |
| Nombre de `bg-slate-*` (vs `bg-neutral-*`) | grep | 0 (tout en `neutral`) |
| Nombre de Header Pro distincts | grep `<header` dans layouts | 1 |
| Nombre de Sidebar Pro distincts | idem | 1 |
| Nombre d'implémentations `Button` | grep `<button` avec `bg-propsight` | 1 (primitive) |
| Nombre de fichiers important `framer-motion` directement | grep | < 5 (uniquement variants partagés) |
| Nombre de fichiers important `<Drawer>` partagé | grep | tous les drawers métier |
| Lighthouse "Best practices" sur HomeHero | Lighthouse CI | ≥ 95 |
| Score d'accessibilité (axe-core) sur Dashboard | jest-axe | 0 erreur critique |

---

**Fin de l'audit.** Prochain livrable : [DESIGN_REFACTOR_PLAN.md](DESIGN_REFACTOR_PLAN.md).
