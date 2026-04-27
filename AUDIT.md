# AUDIT — Phase 0

**Date :** 2026-04-24
**Portée :** `src/main/webapp/app/` — aucune modification de code réalisée.
**Objectif :** cartographier l'état actuel avant la refonte architecturale décrite dans `/docs/00_ARCHITECTURE_GLOBALE.md`.

---

## 1. État actuel de `routes.tsx`

### 1.1 Chemin

[src/main/webapp/app/routes.tsx](src/main/webapp/app/routes.tsx)

### 1.2 Structure effective

Le fichier actuel **ne contient pas** de `<Routes>` racine — il rend une séquence de `<Route>` directement à l'intérieur d'`<ErrorBoundaryRoutes>`. Aucun `<Route element={<Layout />}>` parent. **Toutes les routes sont au premier niveau.**

### 1.3 Routes de premier niveau (64 routes au total)

**Public / legacy :**

| Route | Élément |
|---|---|
| `/` | `PublicHome` |
| `/pro` | `ProLanding` |
| `/home-legacy` | `Home` (legacy) |
| `/PrixImmobliers` | JSX inline (SearchBar + PropertyList) — sic, typo dans l'URL |
| `/pack-pro` | `PackPro` |
| `/apropos` | `TrouveAgent` |
| `/VoirLagence` | `VoirLagence` (camelCase, viole §4 conventions) |
| `/temoignages` | `Testimonials` |
| `/blog` · `/blog/:id` | `Blog`, `BlogArticle` |
| `/mentions-legales` · `/cgu` · `/politique-de-confidentialite` · `/cookies` | pages légales |
| `/louer` · `/RecherchLouer` · `/achat` · `/RecherchAchat` | recherche / pages acheter/louer (casing mixte) |
| `/estimation` · `/EstimationRechercher` | estimateur public |
| `/streetStats` · `/geatmap` | outils carto legacy |
| `/test-template` | playground |
| `/rapport/:token` | `RapportPublic` |
| `/widget/estimation` · `/widget/investissement` | widgets iframe |

**Auth : aucune route `/login`, `/register`, `/logout` n'est montée dans `routes.tsx`.** Les composants sont importés (`Login`, `Register`, `Activate`, `PasswordResetInit/Finish`, `Logout`) mais **jamais référencés** dans le JSX retourné. Le login JHipster n'est pas routé par cette version du fichier.

**Pro (toutes enfants du même `<ErrorBoundaryRoutes>`, jamais nested) :**

| Route | Élément | Wrapper local |
|---|---|---|
| `/app` | `<Navigate to="/app/tableau-de-bord">` | — |
| `/app/tableau-de-bord` | `DashboardPage` | **aucun wrapper dans `routes.tsx`** — le Dashboard utilise `ProLayout` en interne |
| `/app/activite/pilotage` | `PilotageCommercial` | `ActiviteLayout` (sidebar locale) |
| `/app/activite/leads` | `LeadsPage` | `ActiviteLayout` |
| `/app/activite/performance` | `PerformancePage` | `ActiviteLayout` |
| `/app/activite/leads/:id` | `WidgetLeadDetail` | `ActiviteLayout` |
| `/app/widgets` · `/app/widgets/:slug` | `WidgetsHub`, `WidgetPage` | `WidgetsLayout` (sidebar locale) |
| `/app/estimation/rapide[/:id]` · `/app/estimation/avis-valeur[/:id]` · `/app/estimation/etude-locative[/:id]` | pages estimation | `EstimationLayout` (sidebar locale) |
| `/app/biens` | redirect | — |
| `/app/biens/portefeuille` · `/annonces` · `/dvf` | pages biens | **aucun wrapper dans `routes.tsx`** — `PortefeuillePage` / `AnnoncesPage` / `DvfPage` consomment `BiensLayout` qui passe par `ProLayout` (global) |
| `/app/prospection` | redirect | — |
| `/app/prospection/{radar,signaux-dvf,signaux-dpe}` | pages prospection | `ProspectionLayout` (sidebar locale) |
| `/app/observatoire` | redirect | — |
| `/app/observatoire/{marche,tension,contexte-local,contexte}` | pages observatoire | `ObservatoireLayout` (sidebar locale) |
| `/app/veille` | redirect | — |
| `/app/veille/{notifications,alertes,biens-suivis,agences-concurrentes}` | pages veille | `VeilleLayout` (sidebar locale) |
| `/app/equipe` | redirect | — |
| `/app/equipe/{vue,activite,portefeuille,agenda,performance}` | pages équipe | `EquipeLayout` (sidebar locale) |
| `/app/investissement` | redirect | — |
| `/app/investissement/opportunites` · `/dossiers[/:id]` · `/dossiers/projets/:id` | pages investissement | `InvestissementLayout` (sidebar locale) |
| `*` | `PageNotFound` | — |

### 1.4 Diagnostic structurel

- **Aucune** route `/app/*` n'est nested sous un `AppShellPro`. La spec §14 demande le contraire.
- Deux stratégies coexistent selon le module :
  - `Dashboard` et `Biens*Page` intègrent **eux-mêmes** `ProLayout` (SidebarPro globale dispo).
  - `Activite`, `Estimation`, `Prospection`, `Observatoire`, `Veille`, `Équipe`, `Investissement`, `Widgets` sont wrappés dans `routes.tsx` par un `<XxxLayout>` qui ne contient **que** sa propre sidebar locale (pas de SidebarPro globale, pas de HeaderPro global).
- C'est exactement la pathologie décrite par la spec §11.10 : modules qui recrèent une navigation globale parallèle.
- `app.tsx` gère la séparation public/Pro/widget/rapport via `useLocation()` et rend conditionnellement le `Header` legacy JHipster. Ce n'est pas un routing imbriqué React Router — c'est une gate par `if`, fragile.

### 1.5 Divergences vs §14

- `publicNavigation.ts` existe déjà (voir §6), mais `proNavigation.ts` absent.
- `/annonces` n'existe pas comme route publique unifiée (actuellement `/achat`, `/louer`, `/RecherchAchat`, `/RecherchLouer`, `/PrixImmobliers` — 5 URLs, incohérentes).
- Aucune `RequireAuth` utilisée sur `/app/*`. `PrivateRoute` est importé mais pas câblé.
- Aucun `AppShellPro` existant — le composant le plus proche est `features/shared/layout/ProLayout.tsx`.

---

## 2. Imports layout legacy à nettoyer

### 2.1 Layout JHipster legacy — `app/shared/layout/`

Contenu : `header/`, `footer/`, `menus/`, `password/`.

**Fichiers qui importent depuis `app/shared/layout/` (6 occurrences) :**

- [src/main/webapp/app/shared/layout/menus/admin.tsx](src/main/webapp/app/shared/layout/menus/admin.tsx) — import interne au dossier
- [src/main/webapp/app/shared/layout/menus/account.tsx](src/main/webapp/app/shared/layout/menus/account.tsx) — import interne au dossier
- [src/main/webapp/app/modules/account/register/register.tsx](src/main/webapp/app/modules/account/register/register.tsx) — `PasswordStrengthBar` de `shared/layout/password/`
- [src/main/webapp/app/modules/account/password/password.tsx](src/main/webapp/app/modules/account/password/password.tsx) — idem
- [src/main/webapp/app/modules/account/password-reset/finish/password-reset-finish.tsx](src/main/webapp/app/modules/account/password-reset/finish/password-reset-finish.tsx) — idem
- [src/main/webapp/app/entities/menu.tsx](src/main/webapp/app/entities/menu.tsx) — menu admin JHipster

**À conserver** le temps de Phase 7 : `menus/` et `password/` sont consommés par les modules JHipster que la spec §13 demande de garder (`account`, `administration`). Seuls `header/` et `footer/` peuvent être archivés dès que `app/layouts/Header.tsx` et `app/layouts/Footer.tsx` le sont aussi (voir §2.2).

### 2.2 Header / Footer "Propsight legacy" — `app/layouts/`

Contenu actuel : `Header.tsx`, `Footer.tsx`, `SearchBar.tsx`. Ce n'est PAS le dossier `layouts/` cible de la spec §13 (qui doit contenir `public/`, `pro/`, `widget/`, `report/`, `auth/`, `page-shells/`). C'est un dossier "Header marketing legacy" planté à la racine.

**Fichiers qui importent depuis `app/layouts/Header` ou `Footer` :**

- [src/main/webapp/app/app.tsx](src/main/webapp/app/app.tsx) — **seul consommateur** : rend `<Header />` et `<Footer />` conditionnellement (lignes 13-14, 48-57).

**Fichiers qui importent `SearchBar` depuis `app/layouts/` :**

- [src/main/webapp/app/routes.tsx](src/main/webapp/app/routes.tsx) ligne 84 — `import SearchBar from 'app/layouts/SearchBar'` pour la route `/PrixImmobliers`.

### 2.3 PublicHeader existant

**Seuls consommateurs :**

- [src/main/webapp/app/features/public/layout/PublicShell.tsx](src/main/webapp/app/features/public/layout/PublicShell.tsx)
- [src/main/webapp/app/features/public/layout/PublicHeader.tsx](src/main/webapp/app/features/public/layout/PublicHeader.tsx) (lui-même)
- [src/main/webapp/app/config/publicNavigation.ts](src/main/webapp/app/config/publicNavigation.ts) — config

Le `PublicShell`/`PublicHeader` situé dans `features/public/layout/` **existe** mais n'est **utilisé nulle part dans `routes.tsx`**. Les pages `PublicHome` et `ProLanding` sont routées directement, sans shell parent.

### 2.4 Divergences vs spec

- La spec §13 demande `app/layouts/public/PublicShell.tsx`. L'implémentation actuelle est à `app/features/public/layout/PublicShell.tsx`. Déplacement/renommage requis.
- `app/layouts/Header.tsx`, `Footer.tsx`, `SearchBar.tsx` sont **legacy à dégager** (ou à déplacer dans `app/layouts/public/` ?). À confirmer §8.

---

## 3. Sidebars locales à supprimer

### 3.1 Grep `MON ACTIVITÉ` et variantes

10 fichiers remontent mais la plupart sont des labels métier (`persona.ts`, titres de panel). Les occurrences qui correspondent vraiment à une sidebar locale :

- [src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx](src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx) — sidebar locale 220px avec le label `Mon activité` (ligne 14). **Cible directe du bug décrit dans la spec §11.10.**
- [src/main/webapp/app/features/shared/layout/ProSidebar.tsx](src/main/webapp/app/features/shared/layout/ProSidebar.tsx) — sidebar globale (à conserver, c'est l'embryon de `SidebarPro`).

### 3.2 Grep `Pilotage commercial` (hors config)

- [src/main/webapp/app/features/shared/layout/ProSidebar.tsx](src/main/webapp/app/features/shared/layout/ProSidebar.tsx) — sidebar globale, item légitime.
- [src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx](src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx) — sidebar locale, à supprimer.
- [src/main/webapp/app/features/public/pro-landing/sections/ProModulesSection.tsx](src/main/webapp/app/features/public/pro-landing/sections/ProModulesSection.tsx) — texte marketing, OK.
- [src/main/webapp/app/features/activite/pilotage/components/PageHeaderPilotage.tsx](src/main/webapp/app/features/activite/pilotage/components/PageHeaderPilotage.tsx) — titre de page, OK.

### 3.3 Inventaire complet des "Layouts de feature" qui embarquent une sidebar locale

Chaque fichier ci-dessous rend un `<aside class="w-[196..220px]">` avec des `<NavLink>` internes au module. **Tous doivent être supprimés** (la navigation passe à SidebarPro globale). Les tabs internes à une page peuvent rester (spec §11.10).

| Chemin | Largeur | Items | Scope |
|---|---|---|---|
| [src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx](src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx) | 220px | Pilotage, Leads, Performance, + lien Widgets | **À supprimer (cause du bug principal)** |
| [src/main/webapp/app/features/estimation/layout/EstimationLayout.tsx](src/main/webapp/app/features/estimation/layout/EstimationLayout.tsx) | 220px | Rapide, Avis de valeur, Étude locative | **À supprimer** |
| [src/main/webapp/app/features/prospection/layout/ProspectionLayout.tsx](src/main/webapp/app/features/prospection/layout/ProspectionLayout.tsx) | 220px | Radar, Signaux DVF, Signaux DPE | **À supprimer** |
| [src/main/webapp/app/features/observatoire/layout/ObservatoireLayout.tsx](src/main/webapp/app/features/observatoire/layout/ObservatoireLayout.tsx) | 196px | Marché, Tension, Contexte local | **À supprimer** |
| [src/main/webapp/app/features/veille/layout/VeilleLayout.tsx](src/main/webapp/app/features/veille/layout/VeilleLayout.tsx) | 196px | Notifications, Alertes, Biens suivis, Agences concurrentes + BellPopover | **À supprimer** (BellPopover à migrer dans HeaderPro) |
| [src/main/webapp/app/features/equipe/layout/EquipeLayout.tsx](src/main/webapp/app/features/equipe/layout/EquipeLayout.tsx) | 196px | Vue, Activité, Portefeuille, Agenda, Performance | **À supprimer** |
| [src/main/webapp/app/features/investissement/layout/InvestissementLayout.tsx](src/main/webapp/app/features/investissement/layout/InvestissementLayout.tsx) | 220px | Opportunités, Dossiers | **À supprimer** |
| [src/main/webapp/app/features/widgets/layout/WidgetsLayout.tsx](src/main/webapp/app/features/widgets/layout/WidgetsLayout.tsx) | 220px | Vue d'ensemble, Estimation vendeur, Projet investisseur | **À supprimer** |

**Cas particulier :**

- [src/main/webapp/app/features/biens/layout/BiensLayout.tsx](src/main/webapp/app/features/biens/layout/BiensLayout.tsx) — ne contient **pas** de sidebar locale ; wrappe déjà le contenu dans `ProLayout` (qui lui-même monte `ProSidebar` + `ProHeader`). C'est la forme la plus proche de la cible AppShellPro. À transformer en simple `PageShell` (titre + breadcrumb).

### 3.4 Composants globaux candidats à devenir `AppShellPro`

- [src/main/webapp/app/features/shared/layout/ProLayout.tsx](src/main/webapp/app/features/shared/layout/ProLayout.tsx) — rend `<ProSidebar />` + `<ProHeader />` + `<main>{children}</main>`. **Socle du futur `AppShellPro`** (à déplacer vers `app/layouts/pro/` et à adapter pour utiliser `<Outlet />` au lieu de `{children}`).
- [src/main/webapp/app/features/shared/layout/ProSidebar.tsx](src/main/webapp/app/features/shared/layout/ProSidebar.tsx) — data structurée en dur dans `SECTIONS` (§1.5 : doit venir de `proNavigation.ts`). Items manquants vs spec §11.4 :
  - Pas de "Paramètres" pinned en bas
  - Pas de `featureFlag` / `roles` / `ignoresZone`
  - L'item "Contexte local" pointe vers `/app/observatoire/contexte` (la route canonique dans `routes.tsx` est `contexte-local` — un redirect existe mais l'URL de nav n'est pas la bonne)
  - Item "Widgets" présent, OK
- [src/main/webapp/app/features/shared/layout/ProHeader.tsx](src/main/webapp/app/features/shared/layout/ProHeader.tsx) — à auditer lors de Phase 3 pour ⌘K, ZoneSelector, AIDrawer, Avatar.

---

## 4. Routes hardcodées dans les composants

**155 occurrences de `"/app/..."` réparties sur 40 fichiers `.tsx`.** Le répartiteur ci-dessous agrège par catégorie (données brutes extraites via grep) :

| Catégorie | Fichiers | Occurrences | Action |
|---|---|---|---|
| `routes.tsx` (légitime, mais à refondre §14) | 1 | 43 | refactor complet |
| `features/shared/layout/ProSidebar.tsx` (data de nav) | 1 | 30 | **migrer vers `config/proNavigation.ts`** |
| Layouts de feature à supprimer (§3.3) | 8 | 32 | disparaissent avec les layouts |
| Composants de feature (liens inline, `navigate()`) | 24 | 40 | **migrer vers `proNavigation.ts` + helpers `proRoutes.ts`** |
| `public/pro-landing/sections/ProModulesSection.tsx` | 1 | 10 | boutons "Découvrir le module X" — pointer via helper |

**Fichiers prioritaires à nettoyer (composants de feature avec liens hardcodés) :**

- [src/main/webapp/app/features/equipe/vue/VueEquipePage.tsx](src/main/webapp/app/features/equipe/vue/VueEquipePage.tsx) (6)
- [src/main/webapp/app/features/equipe/components/CollaborateurTable.tsx](src/main/webapp/app/features/equipe/components/CollaborateurTable.tsx) (1)
- [src/main/webapp/app/features/equipe/components/CollaborateurDrawer.tsx](src/main/webapp/app/features/equipe/components/CollaborateurDrawer.tsx)
- [src/main/webapp/app/features/equipe/components/LeadsUnassignedBanner.tsx](src/main/webapp/app/features/equipe/components/LeadsUnassignedBanner.tsx)
- [src/main/webapp/app/features/dashboard/components/](src/main/webapp/app/features/dashboard/components/) — 6 panels (`AlertsPanel`, `PrioritiesPanel`, `TerritoryPanel`, `PortfolioHealthPanel`, `RapportsEngagementPanel`)
- [src/main/webapp/app/features/investissement/dossiers/ProjetWorkspace.tsx](src/main/webapp/app/features/investissement/dossiers/ProjetWorkspace.tsx) (3), [DossierEditeur.tsx](src/main/webapp/app/features/investissement/dossiers/DossierEditeur.tsx) (2), [DossiersLanding.tsx](src/main/webapp/app/features/investissement/dossiers/DossiersLanding.tsx), [OpportunitesPage.tsx](src/main/webapp/app/features/investissement/opportunites/OpportunitesPage.tsx)
- [src/main/webapp/app/features/widgets/pages/WidgetsHub.tsx](src/main/webapp/app/features/widgets/pages/WidgetsHub.tsx), [WidgetPage.tsx](src/main/webapp/app/features/widgets/pages/WidgetPage.tsx), [components/WidgetCard.tsx](src/main/webapp/app/features/widgets/components/WidgetCard.tsx), [leads/WidgetLeadDetail.tsx](src/main/webapp/app/features/widgets/leads/WidgetLeadDetail.tsx)
- [src/main/webapp/app/features/activite/pilotage/components/SynthesePipe.tsx](src/main/webapp/app/features/activite/pilotage/components/SynthesePipe.tsx), [SignauxATraiter.tsx](src/main/webapp/app/features/activite/pilotage/components/SignauxATraiter.tsx)
- [src/main/webapp/app/features/activite/performance/components/marche/ZoneSelector.tsx](src/main/webapp/app/features/activite/performance/components/marche/ZoneSelector.tsx), [operationnelle/PipelineParEtape.tsx](src/main/webapp/app/features/activite/performance/components/operationnelle/PipelineParEtape.tsx)
- [src/main/webapp/app/features/prospection/radar/RadarPage.tsx](src/main/webapp/app/features/prospection/radar/RadarPage.tsx), [signaux-dpe/SignauxDpePage.tsx](src/main/webapp/app/features/prospection/signaux-dpe/SignauxDpePage.tsx), [signaux-dvf/SignauxDvfPage.tsx](src/main/webapp/app/features/prospection/signaux-dvf/SignauxDvfPage.tsx), [components/modales/ModaleCreerLead.tsx](src/main/webapp/app/features/prospection/components/modales/ModaleCreerLead.tsx), [components/drawer-signal/OngletLiens.tsx](src/main/webapp/app/features/prospection/components/drawer-signal/OngletLiens.tsx)
- [src/main/webapp/app/features/estimation/rapide/EstimationRapideDetail.tsx](src/main/webapp/app/features/estimation/rapide/EstimationRapideDetail.tsx), [EstimationRapideList.tsx](src/main/webapp/app/features/estimation/rapide/EstimationRapideList.tsx), [avis-valeur/AvisValeurDetail.tsx](src/main/webapp/app/features/estimation/avis-valeur/AvisValeurDetail.tsx), [AvisValeurList.tsx](src/main/webapp/app/features/estimation/avis-valeur/AvisValeurList.tsx), [etude-locative/EtudeLocativeDetail.tsx](src/main/webapp/app/features/estimation/etude-locative/EtudeLocativeDetail.tsx), [EtudeLocativeList.tsx](src/main/webapp/app/features/estimation/etude-locative/EtudeLocativeList.tsx)
- [src/main/webapp/app/features/veille/notifications/NotificationsPage.tsx](src/main/webapp/app/features/veille/notifications/NotificationsPage.tsx), [biens-suivis/BiensSuivisPage.tsx](src/main/webapp/app/features/veille/biens-suivis/BiensSuivisPage.tsx), [components/shared/BellPopover.tsx](src/main/webapp/app/features/veille/components/shared/BellPopover.tsx)
- [src/main/webapp/app/features/public/home/sections/ProTeaserSection.tsx](src/main/webapp/app/features/public/home/sections/ProTeaserSection.tsx), [pro-landing/sections/ProFinalCtaSection.tsx](src/main/webapp/app/features/public/pro-landing/sections/ProFinalCtaSection.tsx)

**Pattern cible (§11.5) :** créer `config/proRoutes.ts` exportant des helpers typés (`proRoutes.activite.pilotage`, `proRoutes.biens.portefeuille(id?)`, etc.) ou des constantes, puis remplacer chaque string `/app/...` par un accès à cette config.

---

## 5. État du store Redux actuel

### 5.1 Reducers présents — [`src/main/webapp/app/shared/reducers/index.ts`](src/main/webapp/app/shared/reducers/index.ts)

| Reducer | Source | Rôle |
|---|---|---|
| `authentication` | `shared/reducers/authentication.ts` | **Session, login, logout** |
| `applicationProfile` | `shared/reducers/application-profile.ts` | Profils Spring (prod/dev) |
| `administration` | `modules/administration/administration.reducer.ts` | Conf admin JHipster |
| `userManagement` | `modules/administration/user-management/user-management.reducer.ts` | CRUD users admin |
| `register`, `activate`, `passwordReset`, `password`, `settings` | `modules/account/*` | Comptes |
| `loadingBar` | `react-redux-loading-bar` | Progress bar |
| `...entitiesReducers` | `entities/reducers.ts` | CRUD entités JHipster |

### 5.2 Reducer `authentication` — champs confirmés

- `isAuthenticated: boolean` ✅ présent (init `false`, ligne 12)
- `sessionHasBeenFetched: boolean` ✅ présent (init `false`, ligne 19, mis à `true` après `getSession`)
- `account` ✅ présent (ligne 16), peuplé par `action.payload.data` après `getAccount`
- `account.authorities: string[]` ✅ — la spec §3.3 s'appuie dessus, JHipster livre ce champ.

**→ La spec §3.1 (RequireAuth) et §3.3 (useAuth) peuvent être implémentées sans modification du reducer existant.**

### 5.3 Divergence critique — `getSession` n'est pas dispatché

Dans [src/main/webapp/app/app.tsx](src/main/webapp/app/app.tsx) ligne 11 :

```tsx
// import { getSession } from 'app/shared/reducers/authentication';
...
useEffect(() => {
  // dispatch(getSession());
  dispatch(getProfile());
}, []);
```

**`getSession` est commenté.** Conséquences :

- `sessionHasBeenFetched` reste `false` perpétuellement ⇒ un composant `RequireAuth` qui lit ce flag affichera un écran de chargement infini.
- `isAuthenticated` n'est jamais calculé à partir du back.
- Aucune auth effective aujourd'hui : toutes les routes `/app/*` sont **techniquement accessibles sans login** (ce que le mode actuel "pas de RequireAuth" confirme).

**Question ouverte (§8) :** rétablir `getSession` ou le laisser commenté tant qu'on travaille hors back ? La spec §3.1 suppose son activation.

### 5.4 Autres divergences vs spec §3

- Aucun hook `useAuth()` (§3.3) — doit être créé.
- Aucun `RoleGuard` (§3.5) — doit être créé.
- `PrivateRoute` ([src/main/webapp/app/shared/auth/private-route.tsx](src/main/webapp/app/shared/auth/private-route.tsx)) existe (convention JHipster) mais n'est **pas utilisé** dans `routes.tsx`. À remplacer par `RequireAuth` (signature différente : `PrivateRoute` wrappe un enfant, `RequireAuth` rend `<Outlet />`).

---

## 6. Dépendances npm à ajouter

### 6.1 Statut — [`package.json`](package.json)

| Dépendance | Présente ? | Version | Commentaire |
|---|---|---|---|
| `zustand` | ❌ | — | **À installer** |
| `motion` / `framer-motion` | ⚠️ | `framer-motion@^12.14.0` | Déjà là, mais spec §1.2 parle de `motion/react` (la v11+ de framer-motion est renommée en `motion`). Rester sur `framer-motion@12` qui exporte `motion/react` est acceptable. **À confirmer §8.** |
| `@tanstack/react-query` | ❌ | — | **À installer** |
| `lucide-react` | ✅ | `^0.511.0` | OK |
| `react-hook-form` | ✅ | `7.56.2` | OK |
| `zod` | ❌ | — | **À installer** |
| `cmdk` | ❌ | — | **À installer** (dépendance ⌘K) |
| `tailwindcss` | ✅ | `^3.4.1` | OK |
| `shadcn/ui` | ❌ | — | **Pas initialisé** (pas de `components.json` à la racine). À initialiser via `npx shadcn@latest init`. |

### 6.2 Alias import

`tsconfig.json` / webpack doivent exposer l'alias `app/*` (utilisé partout dans les imports existants) — confirmer que shadcn `@/*` cohabite, ou mapper shadcn sur `app/components/ui`. À trancher §8.

### 6.3 Dépendances legacy à surveiller (non bloquantes Phase 0)

- `bootstrap@5.3.6`, `reactstrap@9.2.3` — legacy JHipster (CLAUDE.md §2.1 : pas d'extension, migration progressive).
- `leaflet`, `react-leaflet` — legacy carto (CLAUDE.md §2.2 : gelé).
- `react-icons`, `@fortawesome/*` — legacy icônes (CLAUDE.md §2.3 : gelé).
- Aucun impact sur la Phase 1.

---

## 7. Structure de dossiers actuelle vs cible

### 7.1 Arbre actuel `src/main/webapp/app/` (profondeur 2)

```
app/
├── app.tsx                              ✅ existant — à simplifier (routing via <Routes>)
├── index.tsx                            ✅ existant
├── routes.tsx                           ⚠️ REFONTE COMPLÈTE (§1, §14 spec)
├── app.scss · _bootstrap-variables.scss ⚠️ legacy Bootstrap — tolérés
│
├── config/
│   ├── api.config.ts                    ✅
│   ├── axios-interceptor.ts             ✅
│   ├── constants.ts                     ✅
│   ├── dayjs.ts                         ✅
│   ├── error-middleware.ts              ✅
│   ├── icon-loader.ts                   ✅
│   ├── logger-middleware.ts             ✅
│   ├── notification-middleware.ts       ✅
│   ├── publicNavigation.ts              ⚠️ existe mais shape divergente vs spec §7.5
│   ├── store.ts                         ✅
│   └── (manquants)
│       ├── proNavigation.ts             🆕 À CRÉER
│       ├── proRoutes.ts                 🆕 À CRÉER
│       └── featureFlags.ts              🆕 À CRÉER
│
├── data/                                ⚠️ non mentionné dans la spec — à laisser tel quel
│
├── entities/                            ✅ JHipster auto-gen — conserver §13 spec
│
├── features/                            ⚠️ existe, mais mélange public + Pro
│   ├── activite/                        ⚠️ contient un layout-sidebar à supprimer
│   │   ├── layout/ActiviteLayout.tsx    ❌ À SUPPRIMER
│   │   ├── pilotage/                    ✅ page + components — conserver
│   │   ├── leads/                       ✅
│   │   └── performance/                 ✅
│   ├── biens/                           ⚠️ BiensLayout OK, à transformer en PageShell
│   ├── dashboard/                       ✅
│   ├── equipe/                          ⚠️ idem : EquipeLayout à supprimer
│   ├── estimation/                      ⚠️ idem : EstimationLayout à supprimer
│   ├── investissement/                  ⚠️ idem
│   ├── map/                             ⚠️ non mentionné dans spec — à clarifier §8
│   ├── observatoire/                    ⚠️ idem
│   ├── property/                        ⚠️ non mentionné — probablement carto DVF publique
│   ├── prospection/                     ⚠️ idem
│   ├── public/                          ⚠️ spec §13 veut `pages/public/`, pas `features/public/`
│   │   ├── home/                        → déplacer vers `pages/public/home/`
│   │   ├── pro-landing/                 → déplacer vers `pages/public/pro-landing/`
│   │   └── layout/                      → déplacer vers `layouts/public/`
│   ├── shared/                          ⚠️ contient layout ProLayout/ProSidebar/ProHeader — à déplacer vers `layouts/pro/`
│   ├── veille/                          ⚠️
│   └── widgets/                         ⚠️
│
├── layouts/                             ⚠️ dossier "legacy header marketing" — à refondre
│   ├── Header.tsx                       ❌ À ARCHIVER / remplacer par PublicHeader
│   ├── Footer.tsx                       ❌ À ARCHIVER / remplacer par PublicFooter
│   └── SearchBar.tsx                    ⚠️ utilisé par /PrixImmobliers — à déplacer vers feature carto DVF
│   (structure cible §13)
│   ├── public/                          🆕 PublicShell, PublicHeader, PublicFooter, PublicMobileMenu
│   ├── pro/                             🆕 AppShellPro, HeaderPro, SidebarPro, ProNavGroup/Item, CommandSearch, ZoneSelector, NotificationPopover, UserMenu, ProPlaceholderPage
│   ├── widget/                          🆕 WidgetShell
│   ├── report/                          🆕 ReportShell
│   ├── auth/                            🆕 AuthShell
│   └── page-shells/                     🆕 Standard/Workspace/SplitMap/ReportEditor
│
├── modules/
│   ├── account/                         ✅ conserver §13
│   ├── administration/                  ✅ conserver §13
│   ├── home/                            ❌ À SUPPRIMER (remplacé par `pages/public/home/`)
│   └── login/                           ✅ conserver (Logout utilisé)
│
├── pages/                               ⚠️ à fusionner/déplacer
│   ├── Home.tsx                         ⚠️ legacy, concurrence PublicHome
│   ├── Achat.tsx · Louer.tsx            ⚠️ à rationaliser vers `/annonces` unique
│   ├── Blog.tsx · BlogArticle.tsx       → `pages/public/ressources/` ?
│   ├── CGU.tsx · MentionsLegales.tsx · PolitiqueConfidentialite.tsx · Cookies.tsx | → `pages/public/legal/` ?
│   ├── Testimonials.tsx · TrouveAgent.tsx · VoirLagence.tsx · PackPro.tsx | ⚠️ legacy marketing à arbitrer
│   ├── GeatMapPage.tsx · PropertyList.tsx · NegotiationArticlePage.tsx | ⚠️ outils
│   (structure cible §13)
│   ├── public/                          🆕 home, pro-landing, prix-immobiliers, annonces, investissement, ressources, widget, rapport
│   └── auth/                            🆕 LoginPage, ResetPage
│
├── shared/
│   ├── auth/                            ⚠️ ne contient que private-route (JHipster). À étendre
│   │   ├── RequireAuth.tsx              🆕
│   │   ├── RoleGuard.tsx                🆕
│   │   └── useAuth.ts                   🆕
│   ├── (stores/)                        🆕 Zustand (zone, entityDrawer, aiDrawer, commandSearch)
│   ├── (drawers/)                       🆕 EntityDrawerShell + 13 contents + AIDrawer
│   ├── (motion/)                        🆕 easings, durations, variants
│   ├── error/                           ✅
│   ├── jhipster/                        ✅
│   ├── layout/                          ⚠️ header/footer/menus/password JHipster legacy
│   │   ├── header/                      ❌ À ARCHIVER après refonte
│   │   ├── footer/                      ❌ À ARCHIVER
│   │   ├── menus/                       ⚠️ consommés par modules/account — conserver
│   │   └── password/                    ⚠️ consommé par modules/account — conserver
│   ├── model/                           ✅
│   ├── reducers/                        ✅
│   ├── util/                            ✅
│   └── DurationFormat.tsx               ✅
│
├── types/                               ✅
├── typings.d.ts · setup-tests.ts        ✅
└── content/                             (hors `app/`) assets — `propsight-logo.png` présent
```

**Légende :** ✅ conforme · ⚠️ divergent / à migrer · ❌ à supprimer · 🆕 à créer.

### 7.2 Écart global

- `layouts/` racine existe mais contient encore du legacy (Header/Footer/SearchBar) au lieu des sous-dossiers prescrits par la spec §13.
- `features/` mélange modules Pro (conformes spec) ET pages publiques (`features/public/*` à déplacer vers `pages/public/*`) ET un `shared/layout` qui devrait être dans `layouts/pro/`.
- `pages/` racine est un panaché legacy qui doit être reclassé : beaucoup de pages (Blog, CGU, Testimonials…) n'ont pas leur équivalent dans la spec.
- `modules/home/` à supprimer (spec §13).

---

## 8. Questions ouvertes

### Q1 — Activation de `getSession`

Le commentaire dans `app.tsx:12` (`// dispatch(getSession())`) laisse penser qu'il y a eu un épisode de régression. Faut-il le **réactiver en Phase 1** (condition nécessaire au fonctionnement de `RequireAuth`) ou **continuer sans auth effective** en mode mock pendant la Phase 2-6 ? Selon la spec §3 et §17 ("Aucun flash de contenu Pro avant vérif session"), il faut le rétablir. À confirmer.

### Q2 — `framer-motion` vs `motion`

Le package `framer-motion@12` est déjà installé. Depuis la v11, l'import `"motion/react"` est le nouveau point d'entrée stable. La spec §1.2 et §7 mentionnent `motion/react`. Faut-il **garder `framer-motion@12`** et importer via `"framer-motion"` (façade historique) **ou** installer le package `motion` séparé ? Recommandation personnelle (non appliquée) : garder `framer-motion@12`, importer via `"motion/react"` qui est exporté par la même dist. Validation demandée.

### Q3 — Alias d'import shadcn

shadcn attend par défaut `@/components/ui/*`. Le repo utilise `app/*` (webpack alias). Option A : configurer shadcn sur `app/components/ui/*` (pas de `@`). Option B : ajouter `@/*` en alias supplémentaire. Option A est plus cohérente mais demande un `components.json` custom.

### Q4 — Dossier `features/public/` et `pages/` legacy

La spec §13 demande que les pages publiques soient dans `pages/public/`. Aujourd'hui :
- `features/public/home/` et `features/public/pro-landing/` existent et semblent propres.
- `pages/` racine contient 16 pages legacy (Blog, CGU, Testimonials, TrouveAgent, VoirLagence, PackPro, etc.) non couvertes par la spec.

**Question :** en Phase 2, déplace-t-on `features/public/home/` → `pages/public/home/` (comme demandé), et on **garde** les 16 pages legacy telles quelles dans `pages/` jusqu'à arbitrage produit module par module ? Ou on les supprime ?

### Q5 — Devenir de `app/layouts/Header.tsx` et `Footer.tsx`

Ces fichiers sont le "Header marketing Propsight" actuellement actif sur la plupart des pages publiques via `app.tsx`. Une fois `PublicHeader` (en `features/public/layout/` ou déplacé en `layouts/public/`) généralisé, ces fichiers sont **morts**. Mais on perd aussi la version marketing actuelle avec dropdowns Ressources/À-propos/Blog que PublicHeader ne couvre pas encore exhaustivement.

**Proposition (à valider) :** en Phase 2, déplacer `features/public/layout/*` vers `layouts/public/*`, mettre à jour `PublicHeader` pour couvrir les dropdowns existants, puis supprimer `app/layouts/Header.tsx` et `Footer.tsx`.

### Q6 — SearchBar legacy

`app/layouts/SearchBar.tsx` est utilisé par la route `/PrixImmobliers` inline dans `routes.tsx`. La spec §11.3 évoque un ⌘K `CommandSearch` côté Pro. Quel est le statut de ce composant côté public ? Proposition : le laisser tel quel en Phase 2 (simple déplacement vers `features/property/` ou `pages/public/prix-immobiliers/`), aucun remplacement par cmdk côté public.

### Q7 — `features/map/` et `features/property/`

Ces dossiers existent mais ne figurent pas dans l'arborescence cible §13. Ils portent vraisemblablement la carto DVF publique et les recherches `/achat`/`/louer`/`/RecherchAchat`. Les considérer comme **publics** et les migrer en Phase 2 vers `pages/public/prix-immobiliers/` et `pages/public/annonces/` ? À valider.

### Q8 — Route `/PrixImmobliers` (typo dans l'URL)

L'URL publique actuelle contient une typo (`Immobliers` au lieu de `Immobiliers`) et utilise du PascalCase, ce qui viole la convention §4 (kebab-case). La cible est `/prix-immobiliers`. **Proposition :** ajouter en Phase 5 un redirect `/PrixImmobliers` → `/prix-immobiliers` pour préserver le SEO/liens existants, et exposer la nouvelle URL comme canonique. À valider (risque SEO selon le volume de backlinks).

### Q9 — Nombre de routes `/app/*` hardcodées (§4)

155 occurrences "à migrer" est un effort significatif. Faut-il **tout migrer en Phase 1** (création de `proRoutes.ts` puis refactor massif) ou **migrer opportunistiquement** au fur et à mesure des touches Phase 6 ? Le critère d'acceptation §17 ("Aucun `\"/app/\"` hardcodé dans composant hors config") suggère tout migrer. **Ma recommandation :** création de `proRoutes.ts` en Phase 1, remplacements ciblés en Phase 3-6, sweep final en Phase 8.

### Q10 — Redux `account` vs spec §3.3 `useAuth`

Spec §3.3 lit `account?.authorities?.[0]` comme rôle principal. JHipster stocke `authorities: string[]` mais un user peut avoir plusieurs (`ROLE_USER`, `ROLE_ADMIN`). Faut-il prendre l'**autorité la plus privilégiée** selon un ordre connu (`OWNER > ADMIN > AGENT > VIEWER`) plutôt que la première ? Sinon un `ROLE_USER` + `ROLE_ADMIN` rendrait `ROLE_USER`.

### Q11 — Interaction avec `PrivateRoute` JHipster

`app/shared/auth/private-route.tsx` est déjà là, avec une signature (enfant) incompatible avec `RequireAuth` (`<Outlet />`). Faut-il **supprimer `PrivateRoute`** ou le conserver pour les routes JHipster `account`/`administration` que la spec dit de garder ? À trancher.

### Q12 — Gestion de la route `/login`

`routes.tsx` n'expose **aucune** route `/login`. Pourtant spec §3.2 la prévoit. La Phase 2 doit-elle **rebrander la `Login` JHipster** (`modules/login/login.tsx`) et la monter sur `/login`, ou **créer une `LoginPage` neuve** dans `pages/auth/LoginPage.tsx` qui réutilise l'action `authenticate()` Redux ? Spec §3.2 suggère la seconde option. À confirmer.

### Q13 — Visuel violet des layouts locaux

Les 8 layouts locaux à supprimer utilisent déjà le violet Propsight (`bg-violet-50`, `text-violet-700`) — preuve que la SidebarPro finale peut hériter de ce traitement sans effort stylistique. **Pas une question bloquante**, juste à noter pour réduire le risque de régression visuelle.

### Q14 — `components.json` shadcn

Non présent. Je recommande, avant Phase 1, de **décider de l'emplacement** (`app/components/ui/` vs `app/shared/ui/`) pour cohabiter avec la structure JHipster. CLAUDE.md §2.1 dit "Tailwind only" pour le nouveau code mais ne tranche pas shadcn. Validation demandée.

### Q15 — `proNavigation.ts` — stabilité du schéma

La spec §11.5 définit un type `ProNavItem` avec `featureFlag`, `badgeKey`, `ignoresZone`. Ces trois champs nécessitent des stores annexes (featureFlags, badges, zone). En Phase 1, doit-on créer la config **avec les champs présents mais ignorés** (pour éviter breaking change plus tard) ou commencer par un schéma minimal et étendre ? Recommandation : schéma complet dès Phase 1.

---

**Fin de l'audit. Aucune modification de code n'a été effectuée.**

Prochaine étape attendue : validation de ce document et consignes pour la Phase 1 (socle technique).
