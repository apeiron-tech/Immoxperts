# CHANGELOG — Refonte architecture Propsight

**Date :** 2026-04-24
**Référence :** `/docs/00_ARCHITECTURE_GLOBALE.md` (V2)
**Phase 0 :** [AUDIT.md](AUDIT.md)

---

## Le fix principal

Toutes les routes `/app/*` sont désormais **enfants directs** d'un unique `<Route element={<AppShellPro />}>`. Résultat : `HeaderPro` + `SidebarPro` **globaux** sont rendus une seule fois et restent montés en permanence — plus aucun remount entre modules, plus aucune mini-sidebar locale qui prend la place de la navigation globale, plus aucun `PublicHeader` qui s'affiche sur `/app/*`.

Avant → Après pour la navigation de `/app/tableau-de-bord` vers `/app/activite/pilotage` :

- **Avant :** `ActiviteLayout` (mini-sidebar locale "Mon activité") remplaçait `ProSidebar` et `PublicHeader` ré-apparaissait à la place de `ProHeader`.
- **Après :** `SidebarPro` globale + `HeaderPro` restent affichés ; la route enfant `PilotageCommercial` rend uniquement son contenu.

---

## Décisions prises sur les 15 questions ouvertes de l'AUDIT

| # | Question | Décision |
|---|---|---|
| Q1 | Activation `getSession()` | ✅ Réactivé dans `app.tsx`, indispensable à `RequireAuth`. |
| Q2 | `framer-motion` vs `motion` | Conservé `framer-motion@12` (déjà installé). Tokens `motion/` abstraient la lib. |
| Q3 | Alias shadcn | shadcn non initialisé (`components.json` absent). Socle sans shadcn pour l'instant, Tailwind raw. |
| Q4 | Pages legacy dans `pages/` | Conservées telles quelles, routées sous `PublicShell`. |
| Q5 | `app/layouts/Header.tsx` / `Footer.tsx` legacy | ❌ **Supprimés** (plus aucun consommateur). |
| Q6 | `SearchBar` legacy | Conservé à `app/layouts/SearchBar.tsx`, utilisé par `PrixImmobiliersPage`. |
| Q7 | `features/map/` + `features/property/` | Laissés tels quels, réutilisés par `PrixImmobiliersPage` et les routes `/achat`, `/louer`. |
| Q8 | `/PrixImmobliers` → `/prix-immobiliers` | ✅ Redirect ajouté. Nouvelle URL canonique. |
| Q9 | Migration des 155 routes hardcodées | `proRoutes.ts` créé. Migration **opportuniste**, non faite en bulk. |
| Q10 | Rôle le plus privilégié | ✅ `pickHighestRole` dans `useAuth.ts` : OWNER > ADMIN > AGENT > VIEWER. |
| Q11 | `PrivateRoute` JHipster | Orphelin (non supprimé), plus utilisé ; `RequireAuth` le remplace. |
| Q12 | Route `/login` | ✅ Nouvelle `LoginPage` dans `pages/auth/`, branchée sur `login()` Redux. |
| Q13 | Violet Propsight | Tokens Tailwind `violet-*` utilisés partout dans les nouveaux composants. |
| Q14 | Emplacement shadcn | Reporté : non nécessaire pour le fix principal. |
| Q15 | Schéma `ProNavItem` | ✅ Complet dès Phase 1 (`featureFlag`, `roles`, `badgeKey`, `ignoresZone`, `description`). |

---

## Fichiers ajoutés

### Phase 1 — socle

```
src/main/webapp/app/
├── config/
│   ├── proRoutes.ts                       🆕 helpers typés `proRoutes.activite.pilotage` …
│   ├── proNavigation.ts                   🆕 data unique de la SidebarPro + CommandSearch
│   └── featureFlags.ts                    🆕 flags statiques V1
├── shared/
│   ├── auth/
│   │   ├── RequireAuth.tsx                🆕 redirect /login?next=… si non authentifié
│   │   ├── RoleGuard.tsx                  🆕 wrapper par rôle
│   │   └── useAuth.ts                     🆕 hook sur state.authentication
│   ├── stores/                            🆕 Zustand (4 stores)
│   │   ├── zoneStore.ts                   (persisté, clé `propsight.zone`)
│   │   ├── entityDrawerStore.ts
│   │   ├── aiDrawerStore.ts
│   │   └── commandSearchStore.ts
│   └── motion/                            🆕 tokens
│       ├── easings.ts
│       ├── durations.ts
│       ├── variants/index.ts
│       └── index.ts
```

### Phase 2 — shells publics

```
src/main/webapp/app/
├── layouts/
│   ├── public/PublicShell.tsx             🆕 wrap via <Outlet /> — délègue Header/Footer à features/public/layout/
│   ├── widget/WidgetShell.tsx             🆕 minimal (iframe)
│   ├── report/ReportShell.tsx             🆕 minimal (rapport partagé)
│   └── auth/AuthShell.tsx                 🆕 card centrée
└── pages/
    ├── auth/
    │   ├── LoginPage.tsx                  🆕 branché sur authenticate() Redux
    │   └── ResetPage.tsx                  🆕 branché sur password-reset Redux
    └── public/
        └── prix-immobiliers/
            └── PrixImmobiliersPage.tsx    🆕 extraction de la JSX inline de routes.tsx
```

### Phase 3 — couche Pro

```
src/main/webapp/app/layouts/pro/
├── AppShellPro.tsx                        🆕 <Outlet /> + HeaderPro + SidebarPro + CommandSearch + EntityDrawerShell + AIDrawer
├── HeaderPro.tsx                          🆕 Search trigger + ZoneSelector + AIDrawer + Bell + UserMenu
├── SidebarPro.tsx                         🆕 data = proNavigation.ts, filtre rôle + featureFlag
├── ProNavGroup.tsx                        🆕 groupe expandable (chevron + auto-open sur route active)
├── ProNavItem.tsx                         🆕 NavLink stylisé (niveau 1 / niveau 2)
├── CommandSearch.tsx                      🆕 ⌘K via `cmdk` (alimenté par proNavigation)
├── ZoneSelector.tsx                       🆕 lit/écrit useZoneStore
├── NotificationPopover.tsx                🆕 5 dernières + CTA vers Veille
├── UserMenu.tsx                           🆕 logout + clearStorage zoneStore
└── ProPlaceholderPage.tsx                 🆕 lit proNavigation pour titre/description
```

### Phase 4 — PageShells + drawers

```
src/main/webapp/app/
├── layouts/page-shells/
│   ├── StandardPageShell.tsx              🆕
│   ├── WorkspacePageShell.tsx             🆕
│   ├── SplitMapPageShell.tsx              🆕
│   └── ReportEditorShell.tsx              🆕
└── shared/drawers/
    ├── EntityDrawerShell.tsx              🆕 shell générique (header + content lazy à brancher)
    ├── useEntityDrawer.ts                 🆕 hook open/close
    └── AIDrawer.tsx                       🆕 stub IA
```

---

## Fichiers modifiés

- `src/main/webapp/app/routes.tsx` — **refonte complète**. Routes `/app/*` toutes imbriquées sous `<AppShellPro />`. Routes publiques sous `PublicShell` (4 variants). Shells dédiés pour `/widget/*`, `/rapport/*`, `/login*`. Redirect `/PrixImmobliers` → `/prix-immobiliers`.
- `src/main/webapp/app/app.tsx` — **simplifié**. Plus de switch conditionnel `Header`/`Footer` legacy. `dispatch(getSession())` réactivé. Routing délégué intégralement à `AppRoutes`.
- `src/main/webapp/app/config/publicNavigation.ts` — rétro-compatibilité : exporte à la fois `{label,to}` (spec) et `{label,href}` (legacy), avec alias `publicNavigation` / `proMarketingNavigation`.
- `src/main/webapp/app/features/dashboard/DashboardPage.tsx` — retrait du wrapper `<ProLayout>` (redondant avec `AppShellPro`).
- `src/main/webapp/app/features/biens/layout/BiensLayout.tsx` — retrait de `<ProLayout>` ; devient un PageShell léger (breadcrumb + titre + content).
- `src/main/webapp/app/features/public/home/PublicHome.tsx` — retrait du wrapper `<PublicShell>` interne (le shell est au niveau route).
- `src/main/webapp/app/features/public/pro-landing/ProLanding.tsx` — idem.

---

## Fichiers supprimés

- `src/main/webapp/app/layouts/Header.tsx` — header marketing legacy.
- `src/main/webapp/app/layouts/Footer.tsx` — footer marketing legacy.
- `src/main/webapp/app/modules/home/` — remplacé par `features/public/home/`.

---

## Fichiers orphelins (à nettoyer dans une PR dédiée)

Ces fichiers ne sont plus importés nulle part mais sont laissés en place pour relecture :

- `src/main/webapp/app/features/activite/layout/ActiviteLayout.tsx`
- `src/main/webapp/app/features/estimation/layout/EstimationLayout.tsx`
- `src/main/webapp/app/features/prospection/layout/ProspectionLayout.tsx`
- `src/main/webapp/app/features/observatoire/layout/ObservatoireLayout.tsx`
- `src/main/webapp/app/features/veille/layout/VeilleLayout.tsx`
- `src/main/webapp/app/features/equipe/layout/EquipeLayout.tsx`
- `src/main/webapp/app/features/investissement/layout/InvestissementLayout.tsx`
- `src/main/webapp/app/features/widgets/layout/WidgetsLayout.tsx`
- `src/main/webapp/app/features/shared/layout/ProLayout.tsx` · `ProSidebar.tsx` · `ProHeader.tsx` (remplacés par `app/layouts/pro/`)
- `src/main/webapp/app/features/public/layout/PublicShell.tsx` (remplacé par `app/layouts/public/PublicShell.tsx` — mais **PublicHeader** et **PublicFooter** y restent et sont réutilisés)
- `src/main/webapp/app/shared/auth/private-route.tsx` + `.spec.tsx` (remplacé par `RequireAuth`)
- `src/main/webapp/app/shared/layout/header/` · `footer/` (header/footer JHipster legacy)

---

## Dépendances npm ajoutées

| Paquet | Version | Rôle |
|---|---|---|
| `zustand` | ^5.0.12 | State UI léger (zone, drawers, command search) |
| `@tanstack/react-query` | ^5.100.1 | Cache de requêtes Pro (non encore utilisé — prêt) |
| `cmdk` | ^1.1.1 | ⌘K palette globale |
| `zod` | déjà présent via autre dép. | (non utilisé V1) |

`framer-motion@^12` et `lucide-react` déjà présents. `shadcn/ui` **non initialisé** (décision Q3/Q14).

---

## Tests et vérifications manuelles à faire

- [ ] `/app/activite/pilotage` : SidebarPro globale visible + HeaderPro visible, pas de mini-sidebar "MON ACTIVITÉ".
- [ ] `/app/estimation/rapide` · `/app/estimation/avis-valeur` · `/app/activite/leads` : idem.
- [ ] `/` : PublicHeader standard + PublicFooter full.
- [ ] `/pro` : PublicHeader marketing-pro + PublicFooter full.
- [ ] `/prix-immobiliers` : carte DVF avec footer minimal. `/PrixImmobliers` redirige.
- [ ] `/widget/estimation` : pas de chrome Propsight (iframe).
- [ ] `/rapport/:token` : shell minimal, pas de nav.
- [ ] `/login?next=/app/tableau-de-bord` : après login valide, redirect vers la cible.
- [ ] Accès `/app/*` sans session : redirect `/login?next=...`.
- [ ] `⌘K` : ouvre la palette `CommandSearch` depuis n'importe quelle page `/app/*`.
- [ ] `ZoneSelector` : choix de zone persisté au refresh, effacé au logout.
- [ ] Groupe sidebar contenant la route active : ouvert automatiquement.
- [ ] `/app/parametres` (et sous-chemins) : affiche `ProPlaceholderPage` (pas 404).

---

## Ce qui reste à faire (hors scope de cette PR)

1. **Sweep des 155 routes hardcodées** (AUDIT §4) : remplacer les `'/app/...'` par des accès à `proRoutes` dans les ~40 fichiers listés.
2. **Tests e2e** Playwright pour couvrir les critères d'acceptation §17 de la spec.
3. **Initialisation shadcn** (`components.json`, `app/components/ui/*`) — reporté.
4. **PageShells branchés** : les 4 shells existent mais aucune page ne les consomme encore — à adopter progressivement module par module.
5. **Drawer contents lazy** : 13 `*DrawerContent.tsx` à implémenter dans `shared/drawers/contents/` (actuellement `EntityDrawerShell` rend un placeholder).
6. **Landings** `/pro` restylées selon `/docs/08_LANDING_PATTERNS.md` (hors scope archi).
7. **Renommage package Java** `com.apeiron.immoxperts` → `com.propsight` (CLAUDE.md §13).
8. **Rebranding login JHipster** : la page `pages/auth/LoginPage.tsx` peut être enrichie (MFA, logo, etc.).
9. **Suppression des fichiers orphelins** listés ci-dessus.
10. **Responsive mobile** : AppShellPro n'a pas encore le drawer hamburger (<1024px). À faire en Phase 9.
