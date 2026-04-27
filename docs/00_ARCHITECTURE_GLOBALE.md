# Propsight — Architecture Globale V2

**Version :** V2 (React Router / JHipster)
**Statut :** Spécification finale prête pour Claude Code
**Stack :** JHipster · Spring Boot · React 18 · TypeScript · React Router v6 · Redux Toolkit · Zustand · Tailwind · shadcn/ui · motion/react
**Projet :** `immoxperts-clean` (monorepo JHipster existant)
**Périmètre :** socle de navigation, layouts, séparation Public / Pro, authentification, responsive, state global zone

---

## 0. Objectif du document

Ce document définit le **socle global** de Propsight, en partant d'un projet JHipster existant (React côté frontend). Il ne rebuild pas les modules métier (leurs specs existent déjà dans `/docs`). Il existe parce que l'app actuelle souffre d'un problème précis :

**Quand on clique sur "Mon activité > Pilotage commercial" depuis le dashboard Pro, deux régressions surviennent simultanément :**
1. La SidebarPro globale disparaît, remplacée par une mini-sidebar locale qui ne contient que 3 items
2. Le HeaderPro Pro disparaît, remplacé par le PublicHeader (avec "Prix immobiliers / Ressources / Espace Pro")

C'est architectural : les modules sont aujourd'hui des **routes racines** qui héritent du layout public par défaut, au lieu d'être des **routes enfants** d'un `AppShellPro` partagé. Cette spec résout ça.

À la fin du chantier : **ouvrir n'importe quelle URL `/app/*` depuis n'importe où affiche AppShellPro (HeaderPro + SidebarPro globale), sans que le header public n'apparaisse jamais.**

---

## 1. Framework & décisions techniques

### 1.1 Framework

**React Router v6+ dans le template JHipster existant.** On ne migre pas vers Next.js. La logique de layouts imbriqués se fait via des `Route` parents qui rendent un layout + `<Outlet />`.

### 1.2 Stack

| Couche | Outil | Raison |
|---|---|---|
| Routing | React Router v6+ | Déjà présent dans JHipster |
| Composants primitifs | shadcn/ui | À installer, tokenisable |
| Styling | Tailwind + CSS vars | Tokens design system natifs |
| Animations | motion/react | Voir `/docs/07_MOTION_LANGUAGE.md` |
| Formulaires | react-hook-form + zod | Standard |
| State serveur (auth, entités) | Redux Toolkit | Déjà présent dans JHipster, on le garde |
| State UI léger (zone, drawers) | Zustand | Ajout, léger, typé, hors Redux |
| Data fetching custom | Axios (déjà présent) + TanStack Query (ajout) | Query pour cache Pro |
| Icônes | lucide-react | Cohérent avec shadcn |
| Inspiration layouts | 21st.dev (structure only) | Cf. `/docs/08_LANDING_PATTERNS.md` |

**Règles de cohabitation avec le Redux existant :**
- Redux Toolkit reste la source de vérité pour : auth/session, user, entités JHipster CRUD.
- Zustand est ajouté **uniquement** pour le state UI non critique : zone sélectionnée, EntityDrawer ouvert, AIDrawer ouvert.
- **Ne pas** migrer l'auth ou les entités vers Zustand.

### 1.3 Les 4 chantiers

```
1. PublicShell (couche publique freemium)
2. Landing publique `/` (freemium grand public)
3. Landing Pro `/pro` (B2B marketing)
4. AppShellPro `/app/*` (application connectée)
```

### 1.4 Sources à lire avant implémentation

**Priorité haute :**
- `/docs/00_ARCHITECTURE_GLOBALE.md` (ce document)
- `/docs/01_DESIGN_SYSTEM.md`
- `/docs/02_LAYOUT_PRO.md`
- `/docs/07_MOTION_LANGUAGE.md`
- `/docs/08_LANDING_PATTERNS.md`
- `/docs/propsight_tableau_de_bord_spec_v.md`

**Contexte métier (à garder accessible) :**
- Tous les autres fichiers `/docs/*.md`

**Fichiers projet à comprendre avant de modifier :**
- `src/main/webapp/app/routes.tsx` (à refondre)
- `src/main/webapp/app/app.tsx`
- `src/main/webapp/app/shared/layout/` (ancien layout JHipster, à archiver)
- `src/main/webapp/app/config/store.ts` (Redux existant)
- `CLAUDE.md` (conventions actuelles)

---

## 2. Routes et séparation des mondes

### 2.1 Table des routes

| Route | Shell parent | Auth | Rôle |
|---|---|---|---|
| `/` | PublicShell | Non | Landing publique freemium |
| `/pro` | PublicShell variant="marketing-pro" | Non | Landing commerciale Pro |
| `/prix-immobiliers` | PublicShell variant="map" | Non | Carte DVF |
| `/annonces` | PublicShell variant="search" | Non | Acheter / Louer (toggle) |
| `/investissement` | PublicShell | Non | Landing invest freemium |
| `/investissement/simulateur` | PublicShell variant="simulator" | Non | Simulateur public |
| `/ressources` | PublicShell | Non | Hub ressources |
| `/ressources/:slug` | PublicShell | Non | Article / guide |
| `/widget/estimation` | WidgetShell | Non | Iframe partenaire |
| `/widget/investissement` | WidgetShell | Non | Iframe partenaire |
| `/rapport/:token` | ReportShell | Token | Rapport partagé |
| `/login` | AuthShell | Non | Connexion |
| `/app/*` | AppShellPro | Oui (RequireAuth) | Application connectée |

### 2.2 Règle d'or de séparation

```
Aucune route /app/* n'affiche PublicHeader ou PublicFooter.
Aucune route publique n'affiche HeaderPro ou SidebarPro.
Le bouton "Espace Pro" du header public pointe vers /pro.
Le bouton "Se connecter" de /pro pointe vers /app/tableau-de-bord (si auth) ou /login (sinon).
```

### 2.3 Règles produit non négociables

- La navigation publique et la navigation Pro sont centralisées, chacune dans un fichier de config unique.
- Aucun module Pro n'a de sidebar locale de navigation globale. Les tabs internes à une page restent autorisées.
- Les routes Pro non développées affichent un placeholder propre, jamais une page blanche ni une 404.
- Le pipeline commercial unique vit dans `/app/activite/leads`. Aucun mini-CRM parallèle dans Prospection, Estimation, Veille, Investissement.
- Les favoris et biens suivis vivent dans Veille > Biens suivis. Pas de duplication ailleurs.

---

## 3. Authentification et protection des routes

### 3.1 RequireAuth (remplace le middleware Next)

Fichier : `src/main/webapp/app/shared/auth/RequireAuth.tsx`

Composant wrapper qui :
- Lit le state Redux `authentication.isAuthenticated` (déjà présent dans JHipster)
- Si faux : redirect vers `/login?next=<current_path>` via `<Navigate />`
- Si vrai : rend `<Outlet />`

```tsx
// src/main/webapp/app/shared/auth/RequireAuth.tsx

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "app/config/store"

export function RequireAuth() {
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated)
  const sessionHasBeenFetched = useAppSelector(state => state.authentication.sessionHasBeenFetched)
  const location = useLocation()

  if (!sessionHasBeenFetched) {
    return <AuthLoadingScreen />
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }

  return <Outlet />
}
```

### 3.2 Route `/login`

- Shell dédié minimaliste (AuthShell) : logo centré + card de login, pas de header public complet.
- Champs : email + password, MFA optionnel.
- Branché sur l'action Redux `authenticate()` existante de JHipster.
- Après login réussi : redirect vers `?next=` si présent, sinon `/app/tableau-de-bord`.
- Lien "Mot de passe oublié" → `/login/reset` (déjà existant dans JHipster, à rebrander).

### 3.3 Hook `useAuth()`

Wrapper léger au-dessus du store Redux existant :

```ts
// src/main/webapp/app/shared/auth/useAuth.ts

export function useAuth() {
  const { account, isAuthenticated } = useAppSelector(state => state.authentication)
  const role = account?.authorities?.[0] ?? "ROLE_VIEWER"

  return {
    user: account,
    role: role as UserRole,
    isAuthenticated,
    isLoading: !useAppSelector(s => s.authentication.sessionHasBeenFetched)
  }
}
```

### 3.4 Rôles (s'appuie sur JHipster Authorities)

```
ROLE_OWNER   → accès total, facturation, suppression
ROLE_ADMIN   → accès total sauf facturation
ROLE_AGENT   → accès modules métier, Équipe en vue limitée
ROLE_VIEWER  → lecture seule
```

### 3.5 Guard par rôle

`<RoleGuard allow={["ROLE_OWNER","ROLE_ADMIN"]}>` pour les pages sensibles.

---

## 4. Responsive et breakpoints

### 4.1 Breakpoints globaux (Tailwind)

```
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### 4.2 PublicHeader

- **≥ 768px** : nav horizontale complète
- **< 768px** : logo + burger menu → drawer vertical plein écran

### 4.3 AppShellPro

- **≥ 1024px** : SidebarPro fixe 240px visible
- **< 1024px** : SidebarPro en drawer, ouverte via hamburger dans HeaderPro
- **≥ 1024px** : HeaderPro 52px complet
- **< 768px** : HeaderPro compact (logo + search icon + avatar), reste dans overflow

### 4.4 Règles par PageShell

| PageShell | Desktop | Mobile |
|---|---|---|
| StandardPageShell | Scroll normal | Scroll normal |
| WorkspacePageShell | Pas de scroll global, scroll interne | Scroll global autorisé |
| SplitMapPageShell | Split panneau/carte | Tabs Panneau ↔ Carte |
| ReportEditorShell | Split édition/preview | Tabs Édition ↔ Preview |

### 4.5 `⌘K` mobile

Remplacée par une icône loupe dans le HeaderPro compact. Ouvre un plein-écran de recherche.

---

## 5. State global et contexte de zone

### 5.1 Pourquoi Zustand (et pas Redux ici)

Le `ZoneSelector` est un state UI volatil partagé entre composants. Zustand : 2 lignes d'installation, typé, persistable, zéro boilerplate, sans polluer le store Redux JHipster.

### 5.2 Store Zustand

Fichier : `src/main/webapp/app/shared/stores/zoneStore.ts`

```ts
import { create } from "zustand"
import { persist } from "zustand/middleware"

type Zone = {
  id: string
  label: string
  type: "city" | "district" | "custom"
  geometry?: GeoJSON
}

type ZoneState = {
  current: Zone | null
  recents: Zone[]
  setZone: (z: Zone) => void
  clearZone: () => void
}

export const useZoneStore = create<ZoneState>()(
  persist(
    (set) => ({
      current: null,
      recents: [],
      setZone: (z) => set((s) => ({
        current: z,
        recents: [z, ...s.recents.filter(r => r.id !== z.id)].slice(0, 5)
      })),
      clearZone: () => set({ current: null })
    }),
    { name: "propsight.zone" }
  )
)

export const useZone = () => useZoneStore(s => s.current)
```

### 5.3 Contrat d'intégration

Les pages qui **consomment** la zone :
- Lisent `useZone()` et filtrent leurs data
- Affichent un chip "Filtré par : Paris 15e"
- Permettent de retirer le filtre en 1 clic

Les pages qui **ignorent** la zone sont déclarées `ignoresZone: true` dans `proNavigation.ts`.

### 5.4 Persistance

`persist` middleware, clé `propsight.zone`. Reset via `useZoneStore.persist.clearStorage()` au logout Redux.

### 5.5 Autres stores Zustand

- `entityDrawerStore.ts` → pilote `<EntityDrawer>` (type + id ouvert)
- `aiDrawerStore.ts` → pilote `<AIDrawer>`
- `commandSearchStore.ts` → pilote `<CommandSearch>`

---

## 6. PublicShell et ses variantes

### 6.1 Philosophie

**Un seul composant `PublicShell` avec des variantes par prop.** 4 familles :

```
PublicShell           → pages publiques marketing et outils
WidgetShell           → iframe partenaires, minimal
ReportShell           → rapport partagé
AuthShell             → /login, /login/reset
```

### 6.2 API PublicShell

```tsx
import { Outlet } from "react-router-dom"

type PublicShellProps = {
  variant?: "marketing" | "marketing-pro" | "search" | "map" | "simulator"
  footer?: "full" | "minimal"
  header?: "standard" | "marketing-pro"
}

export function PublicShell({
  variant = "marketing",
  footer = "full",
  header = "standard"
}: PublicShellProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader variant={header} />
      <main data-variant={variant} className="flex-1">
        <Outlet />
      </main>
      <PublicFooter variant={footer} />
    </div>
  )
}
```

### 6.3 Configuration via route

```tsx
<Route element={<PublicShell variant="marketing" footer="full" />}>
  <Route path="/" element={<HomePage />} />
</Route>

<Route element={<PublicShell variant="map" footer="minimal" />}>
  <Route path="/prix-immobiliers" element={<PrixImmobiliersPage />} />
</Route>
```

### 6.4 Variant `marketing-pro`

Utilisé uniquement sur `/pro`. PublicHeader change son contenu (§7.2). **Pas un nouveau composant**, juste un switch. Le header reste **public** — jamais HeaderPro.

### 6.5 WidgetShell

- Aucun PublicHeader ni PublicFooter
- Branding partenaire en header
- Mention "Propulsé par Propsight" discrète en footer
- Largeur et hauteur libres (iframe responsive)

### 6.6 ReportShell

- Header minimal : logo agence (ou Propsight) + "Rapport sécurisé"
- Footer minimal : mentions légales + date
- Pas de navigation

### 6.7 AuthShell

- Logo Propsight centré en haut
- Card centrée verticalement
- Background neutral-50, card blanche avec bordure fine
- Aucun lien de navigation

---

## 7. PublicHeader

### 7.1 Variant `standard`

```
[Logo]  [Prix immobiliers] [Acheter / Louer] [Investissement] [Ressources]   [Espace Pro]
```

Routes :
- Logo → `/`
- Prix immobiliers → `/prix-immobiliers`
- Acheter / Louer → `/annonces`
- Investissement → `/investissement`
- Ressources → `/ressources`
- Espace Pro → `/pro` (bouton violet outline)

### 7.2 Variant `marketing-pro`

```
[Logo + badge PRO]  [Produit] [Modules] [Cas d'usage] [Ressources]   [Se connecter] [Demander un accès]
```

Routes :
- Produit → `#produit`
- Modules → `#modules`
- Cas d'usage → `#cas-usage`
- Ressources → `/ressources`
- Se connecter → `/app/tableau-de-bord` si auth, `/login?next=/app/tableau-de-bord` sinon
- Demander un accès → `#contact` ou `/contact`

### 7.3 Style

- Hauteur 64px, fond blanc, bordure basse `neutral-200`
- Logo à gauche, nav centre (desktop), CTA droite
- Radius 8px sur boutons, sticky top

### 7.4 Mobile

- Logo + burger à droite, drawer plein écran vertical au tap
- Pas de sticky sur mobile

### 7.5 Navigation centralisée

Fichier : `src/main/webapp/app/config/publicNavigation.ts`

```ts
export type PublicNavItem = {
  label: string
  to: string
  external?: boolean
}

export const publicNavStandard: PublicNavItem[] = [
  { label: "Prix immobiliers", to: "/prix-immobiliers" },
  { label: "Acheter / Louer", to: "/annonces" },
  { label: "Investissement", to: "/investissement" },
  { label: "Ressources", to: "/ressources" },
]

export const publicNavMarketingPro: PublicNavItem[] = [
  { label: "Produit", to: "#produit" },
  { label: "Modules", to: "#modules" },
  { label: "Cas d'usage", to: "#cas-usage" },
  { label: "Ressources", to: "/ressources" },
]
```

---

## 8. PublicFooter

### 8.1 Variant `full`

Pour : `/`, `/pro`, `/ressources`, `/investissement`

Colonnes :
- **Propsight** : baseline + réseaux
- **Produit** : Prix immobiliers, Acheter/Louer, Investissement, Espace Pro
- **Ressources** : Guides, Méthodologie DVF, Données, FAQ
- **Professionnels** : Propsight Pro, Widgets, Estimation, Observatoire
- **Légal** : Confidentialité, CGU, Mentions légales

### 8.2 Variant `minimal`

Pour : `/prix-immobiliers`, `/annonces`, `/investissement/simulateur`

```
© Propsight · Données publiques · Confidentialité · Espace Pro
```

---

## 9. Landing publique `/`

### 9.1 Rôle

Landing freemium grand public. Cible : acheteurs, locataires, investisseurs particuliers. Elle **ne vend pas** l'offre Pro — elle oriente vers les outils freemium.

### 9.2 Structure

```
PublicHeader (standard)
HomeHero
PublicProductCards (3 cards)
WhyPropsightSection
UseCasesSection
DataSourcesSection
ProTeaserSection
PublicFooter (full)
```

### 9.3 Promesse

```
Titre      : Prix réels, annonces, rentabilité : comprenez le marché avant de décider.
Sous-titre : Propsight rassemble les données immobilières essentielles pour acheter,
             louer, investir ou estimer avec plus de confiance.
```

Contenu détaillé en annexe 9.x.

### 9.4 À proscrire sur `/`

- Pas de SidebarPro, pas de HeaderPro
- Pas de dashboard complet, pas de KPIs business
- Ne pas séparer Acheter et Louer en deux entrées nav
- Espace Pro ne pointe **jamais** vers `/app` directement

---

## 10. Landing Pro `/pro`

### 10.1 Rôle

Landing commerciale B2B. Utilise `PublicShell variant="marketing-pro"` — **jamais AppShellPro**.

### 10.2 Structure

```
PublicHeader (marketing-pro)
ProHero
ProProblemSection
ProSolutionSection
ProModulesSection
ProDifferentiatorsSection
ProUseCasesSection
ProProductPreviewSection
ProFinalCtaSection
PublicFooter (full)
```

### 10.3 Promesse

```
Titre      : Transformez la data immobilière en mandats.
Sous-titre : Propsight Pro aide les agents, mandataires et équipes immobilières à
             détecter les opportunités, produire des estimations crédibles, suivre
             leurs leads et piloter leur activité depuis une seule application.
```

Contenu détaillé en annexe 10.x.

### 10.4 CTA principaux

- **Demander un accès** (primaire violet)
- **Se connecter** (secondaire outline)

### 10.5 À proscrire sur `/pro`

- Pas d'AppShellPro, pas de SidebarPro
- Pas de dashboard réel connecté (previews stylisées uniquement)
- Pas de mélange public/Pro dans les CTA
- Ne pas détailler chaque module exhaustivement

---

## 11. AppShellPro `/app/*`

### 11.1 Structure

```tsx
// src/main/webapp/app/layouts/pro/AppShellPro.tsx

import { Outlet } from "react-router-dom"

export function AppShellPro() {
  return (
    <div className="h-screen flex flex-col bg-white">
      <HeaderPro />
      <div className="flex-1 flex overflow-hidden">
        <SidebarPro />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <EntityDrawer />
      <AIDrawer />
      <CommandSearch />
    </div>
  )
}
```

**Point clé :** `<Outlet />` rend la route enfant. Toutes les routes `/app/*` doivent être **nested** sous `AppShellPro` dans `routes.tsx` (voir §14). C'est ce qui résout le bug actuel.

### 11.2 Dimensions

- HeaderPro : 52px, sticky top
- SidebarPro : 240px, fixe gauche (desktop), drawer (mobile)
- Main : `flex-1`, scroll géré par le PageShell enfant

### 11.3 HeaderPro

```
[Logo + PRO]  [⌘K Rechercher...]  |  [Zone ▾] [Assistant IA] [🔔] [Avatar]
```

**Logo** : clic → `/app/tableau-de-bord`

**CommandSearch (`⌘K`)** : palette globale alimentée par `cmdk`. Source = local fuzzy sur entités chargées + appel serveur debounced 200ms. Objets recherchables :

```
Biens · Leads · Actions · Estimations · Rapports · Annonces · Dossiers ·
Zones · Collaborateurs · Notifications · Alertes
```

Raccourci global `⌘K` / `Ctrl+K` via `useHotkeys`.

**ZoneSelector** : lit/écrit `useZoneStore()`. Dropdown avec recherche + récentes + "Définir une zone personnalisée".

**Assistant IA** : icône étoile, ouvre AIDrawer.

**Notifications** : popover avec 5 dernières, CTA "Voir toutes → `/app/veille/notifications`".

**Avatar** : dropdown avec Profil, Mon organisation, Paramètres, Déconnexion (`logout()` Redux).

### 11.4 SidebarPro

Structure exacte :

```
Tableau de bord                 /app/tableau-de-bord

Mon activité
├── Pilotage commercial         /app/activite/pilotage
├── Leads                       /app/activite/leads
└── Performance                 /app/activite/performance

Biens immobiliers
├── Portefeuille                /app/biens/portefeuille
├── Annonces                    /app/biens/annonces
└── Biens vendus DVF            /app/biens/dvf

Prospection
├── Radar                       /app/prospection/radar
├── Signaux DVF                 /app/prospection/signaux-dvf
└── Signaux DPE                 /app/prospection/signaux-dpe

Widgets publics
├── Vue d'ensemble              /app/widgets
├── Estimation vendeur          /app/widgets/estimation-vendeur
└── Projet investisseur         /app/widgets/projet-investisseur

Estimation
├── Estimation rapide           /app/estimation/rapide
├── Avis de valeur              /app/estimation/avis-valeur
└── Étude locative              /app/estimation/etude-locative

Investissement
├── Opportunités                /app/investissement/opportunites
└── Dossiers                    /app/investissement/dossiers

Observatoire
├── Marché                      /app/observatoire/marche
├── Tension                     /app/observatoire/tension
└── Contexte local              /app/observatoire/contexte-local

Veille
├── Mes alertes                 /app/veille/alertes
├── Notifications               /app/veille/notifications
├── Biens suivis                /app/veille/biens-suivis
└── Agences concurrentes        /app/veille/agences-concurrentes

Équipe (ROLE_OWNER / ROLE_ADMIN uniquement)
├── Vue équipe                  /app/equipe/vue
├── Activité commerciale        /app/equipe/activite
├── Portefeuille & dossiers     /app/equipe/portefeuille
├── Agenda & charge             /app/equipe/agenda
└── Performance business        /app/equipe/performance

─────────────────────────
Paramètres                      /app/parametres
```

Règles :
- Groupe contenant la route active ouvert automatiquement (via `useLocation().pathname`)
- Item actif en violet Propsight (`--violet-500`)
- Paramètres pinned en bas
- Groupes expandables (chevron à droite)
- Padding 12px, item niveau 1 haut 32px, niveau 2 haut 28px

### 11.5 Navigation Pro centralisée

Fichier : `src/main/webapp/app/config/proNavigation.ts`

```ts
import type { LucideIcon } from "lucide-react"

export type UserRole = "ROLE_OWNER" | "ROLE_ADMIN" | "ROLE_AGENT" | "ROLE_VIEWER"

export type ProNavItem = {
  label: string
  to: string
  icon?: LucideIcon
  children?: ProNavItem[]
  defaultTo?: string
  roles?: UserRole[]
  featureFlag?: string
  badgeKey?: string
  ignoresZone?: boolean
  description?: string
}

export const proNavigation: ProNavItem[] = [ /* ... */ ]
```

Usages : `SidebarPro`, `CommandSearch`, `Breadcrumbs`, redirects, placeholders, `RoleGuard`.

**Règle dure : aucune navigation Pro hardcodée dans les composants.**

### 11.6 Drawers globaux

#### EntityDrawer

Vue contextuelle sur une entité sans navigation. Architecture **shell + content lazy** :

```
src/main/webapp/app/shared/drawers/
├── EntityDrawerShell.tsx
├── useEntityDrawer.ts
└── contents/
    ├── LeadDrawerContent.tsx
    ├── BienDrawerContent.tsx
    ├── ActionDrawerContent.tsx
    ├── EstimationDrawerContent.tsx
    ├── RapportDrawerContent.tsx
    ├── SignalDrawerContent.tsx
    ├── OpportuniteDrawerContent.tsx
    ├── DossierDrawerContent.tsx
    ├── AlerteDrawerContent.tsx
    ├── NotificationDrawerContent.tsx
    ├── ZoneDrawerContent.tsx
    ├── CollaborateurDrawerContent.tsx
    └── RdvDrawerContent.tsx
```

Chaque `*DrawerContent` est **lazy-loadé** via `React.lazy`. Le shell impose :

```
Header      : titre + type + close
Key info    : 3-5 métriques
Actions     : boutons contextuels
Liens       : vers modules liés
Timeline    : événements récents
Suggestion  : IA compacte (3 lignes max)
```

Hook :

```ts
const { open } = useEntityDrawer()
open("lead", "lead_abc123")
```

#### AIDrawer

Assistant Propsight contextuel. **Règle :** l'IA n'est jamais un bloc central permanent. Elle est drawer-only.

### 11.7 Redirections Pro (via `<Navigate>`)

```tsx
<Route path="activite">
  <Route index element={<Navigate to="pilotage" replace />} />
  <Route path="pilotage" element={<PilotagePage />} />
  {/* ... */}
</Route>
```

Liste des redirects de groupe :

```
/app                         → /app/tableau-de-bord
/app/activite                → /app/activite/pilotage
/app/biens                   → /app/biens/portefeuille
/app/prospection             → /app/prospection/radar
/app/estimation              → /app/estimation/rapide
/app/investissement          → /app/investissement/opportunites
/app/observatoire            → /app/observatoire/marche
/app/veille                  → /app/veille/notifications
/app/equipe                  → /app/equipe/vue
```

Exception : `/app/widgets` garde une vraie page "hub".

### 11.8 Placeholders

Fichier : `src/main/webapp/app/layouts/pro/ProPlaceholderPage.tsx`

Lit `proNavigation.ts` pour afficher :

```
Titre (du nav item)
Module parent
Description (depuis nav item)
Badge "Module en préparation"
CTA contextuel
```

**Règle :** jamais de page blanche, jamais de 404 pour une route déclarée.

### 11.9 PageShells internes

Dans `src/main/webapp/app/layouts/page-shells/` :

```
StandardPageShell      → Dashboard, Estimation rapide, AVR, Étude loc, Widgets,
                         Dossiers, Performance, Équipe, Paramètres
WorkspacePageShell     → Pilotage, Leads, Biens Portefeuille, Biens Annonces,
                         Signaux DVF, Signaux DPE, Notifications
SplitMapPageShell      → Observatoire (Marché, Tension, Contexte local),
                         Prospection Radar, Biens vendus DVF
ReportEditorShell      → AVR [id], Étude loc [id], Dossier invest [id]
```

Chaque shell expose `<PageHeader>`, `<PageToolbar>`, `<PageKpiRow>`, `<PageContent>` en slots.

**Règle WorkspacePageShell :** pas de scroll page global sur desktop. Scroll interne aux widgets.

### 11.10 Suppression des sidebars locales (chantier critique)

Cibles à supprimer (visibles dans l'app actuelle) :
- Sidebar locale "MON ACTIVITÉ" dans Pilotage commercial
- Sidebar locale dans Estimation rapide
- Sidebar locale dans AVR
- Sidebar locale dans Étude locative
- Bloc "Widgets publics" flottant dans la sidebar Pilotage
- Toute page qui recrée une nav globale parallèle

**Règle :** tabs internes = OK. Sidebar de nav globale parallèle = NON.

---

## 12. Design global

Voir `/docs/01_DESIGN_SYSTEM.md`, `/docs/07_MOTION_LANGUAGE.md`, `/docs/08_LANDING_PATTERNS.md`.

Rappels :
- Violet Propsight série 50→900
- Typographie Inter
- Radius 8px
- Bordures fines `neutral-200`
- Pas de gradients flashy, pas d'animations ostentatoires
- Public : aéré. Pro : dense.

---

## 13. Arborescence cible dans `src/main/webapp/app/`

```
src/main/webapp/app/
├── app.tsx                              (existant, minimal change)
├── index.tsx                            (existant, inchangé)
├── routes.tsx                           ⚠️ REFONTE COMPLÈTE
│
├── config/
│   ├── store.ts                         (existant, inchangé)
│   ├── constants.ts                     (existant)
│   ├── publicNavigation.ts              🆕
│   ├── proNavigation.ts                 🆕
│   ├── proRoutes.ts                     🆕
│   └── featureFlags.ts                  🆕
│
├── shared/
│   ├── auth/                            🆕
│   │   ├── RequireAuth.tsx
│   │   ├── RoleGuard.tsx
│   │   └── useAuth.ts
│   ├── stores/                          🆕 (Zustand)
│   │   ├── zoneStore.ts
│   │   ├── entityDrawerStore.ts
│   │   ├── aiDrawerStore.ts
│   │   └── commandSearchStore.ts
│   ├── drawers/                         🆕
│   │   ├── EntityDrawerShell.tsx
│   │   ├── useEntityDrawer.ts
│   │   ├── AIDrawer.tsx
│   │   └── contents/                    (13 fichiers)
│   ├── motion/                          🆕
│   │   ├── easings.ts
│   │   ├── durations.ts
│   │   ├── variants/
│   │   └── index.ts
│   ├── reducers/                        (existant JHipster)
│   ├── util/                            (existant JHipster)
│   └── layout/                          ⚠️ À ARCHIVER (header/footer legacy)
│
├── layouts/                             🆕 dossier racine
│   ├── public/
│   │   ├── PublicShell.tsx
│   │   ├── PublicHeader.tsx
│   │   ├── PublicFooter.tsx
│   │   └── PublicMobileMenu.tsx
│   ├── pro/
│   │   ├── AppShellPro.tsx
│   │   ├── HeaderPro.tsx
│   │   ├── SidebarPro.tsx
│   │   ├── ProNavGroup.tsx
│   │   ├── ProNavItem.tsx
│   │   ├── CommandSearch.tsx
│   │   ├── ZoneSelector.tsx
│   │   ├── NotificationPopover.tsx
│   │   ├── UserMenu.tsx
│   │   └── ProPlaceholderPage.tsx
│   ├── widget/
│   │   └── WidgetShell.tsx
│   ├── report/
│   │   └── ReportShell.tsx
│   ├── auth/
│   │   └── AuthShell.tsx
│   └── page-shells/
│       ├── StandardPageShell.tsx
│       ├── WorkspacePageShell.tsx
│       ├── SplitMapPageShell.tsx
│       └── ReportEditorShell.tsx
│
├── pages/                               🆕 pour pages publiques
│   ├── public/
│   │   ├── home/
│   │   │   ├── HomePage.tsx
│   │   │   └── sections/...
│   │   ├── pro-landing/
│   │   │   ├── ProLandingPage.tsx
│   │   │   └── sections/...
│   │   ├── prix-immobiliers/
│   │   ├── annonces/
│   │   ├── investissement/
│   │   ├── ressources/
│   │   ├── widget/
│   │   └── rapport/
│   └── auth/
│       ├── LoginPage.tsx
│       └── ResetPage.tsx
│
├── features/                            ⚠️ MODULES PRO
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── activite/
│   │   ├── pilotage/PilotagePage.tsx
│   │   ├── leads/LeadsPage.tsx
│   │   └── performance/PerformancePage.tsx
│   ├── biens/
│   │   ├── portefeuille/
│   │   ├── annonces/
│   │   └── dvf/
│   ├── prospection/
│   │   ├── radar/
│   │   ├── signaux-dvf/
│   │   └── signaux-dpe/
│   ├── widgets/
│   │   ├── hub/
│   │   ├── estimation-vendeur/
│   │   └── projet-investisseur/
│   ├── estimation/
│   │   ├── rapide/
│   │   ├── avis-valeur/
│   │   └── etude-locative/
│   ├── investissement/
│   │   ├── opportunites/
│   │   └── dossiers/
│   ├── observatoire/
│   │   ├── marche/
│   │   ├── tension/
│   │   └── contexte-local/
│   ├── veille/
│   │   ├── alertes/
│   │   ├── notifications/
│   │   ├── biens-suivis/
│   │   └── agences-concurrentes/
│   ├── equipe/
│   │   ├── vue/
│   │   ├── activite/
│   │   ├── portefeuille/
│   │   ├── agenda/
│   │   └── performance/
│   └── parametres/
│
├── entities/                            (JHipster auto-gen, inchangé)
├── modules/                             (JHipster : account, administration, login)
│                                         ⚠️ home à supprimer (remplacé par pages/public/home/)
└── types/                               (existant)
```

**Arbitrage `modules/` vs `features/` :**
- `entities/` : CRUD JHipster auto-générés — inchangé.
- `modules/` JHipster : garder `account`, `administration`, `login` (legacy Redux utilisé par auth). **Supprimer** `modules/home/`.
- `features/` : **nouveau dossier** pour modules métier Pro. Toutes les pages `/app/*` y vivent.
- Ne **pas** mélanger pages publiques dans `features/`. Elles vont dans `pages/public/`.

---

## 14. `routes.tsx` cible (le cœur du fix)

C'est **le fichier qui résout le bug actuel.**

```tsx
// src/main/webapp/app/routes.tsx

import { Navigate, Route, Routes } from "react-router-dom"
import { PublicShell } from "app/layouts/public/PublicShell"
import { WidgetShell } from "app/layouts/widget/WidgetShell"
import { ReportShell } from "app/layouts/report/ReportShell"
import { AuthShell } from "app/layouts/auth/AuthShell"
import { AppShellPro } from "app/layouts/pro/AppShellPro"
import { RequireAuth } from "app/shared/auth/RequireAuth"
// ... imports pages

export const AppRoutes = () => (
  <Routes>
    {/* Monde public — marketing & outils freemium */}
    <Route element={<PublicShell variant="marketing" footer="full" />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/investissement" element={<InvestLandingPage />} />
      <Route path="/ressources" element={<RessourcesHubPage />} />
      <Route path="/ressources/:slug" element={<RessourceArticlePage />} />
    </Route>

    <Route element={<PublicShell variant="marketing-pro" footer="full" header="marketing-pro" />}>
      <Route path="/pro" element={<ProLandingPage />} />
    </Route>

    <Route element={<PublicShell variant="map" footer="minimal" />}>
      <Route path="/prix-immobiliers" element={<PrixImmobiliersPage />} />
    </Route>

    <Route element={<PublicShell variant="search" footer="minimal" />}>
      <Route path="/annonces" element={<AnnoncesPage />} />
    </Route>

    <Route element={<PublicShell variant="simulator" footer="minimal" />}>
      <Route path="/investissement/simulateur" element={<SimulateurPage />} />
    </Route>

    {/* Widgets iframe */}
    <Route element={<WidgetShell />}>
      <Route path="/widget/estimation" element={<WidgetEstimationPage />} />
      <Route path="/widget/investissement" element={<WidgetInvestissementPage />} />
    </Route>

    {/* Rapports partagés */}
    <Route element={<ReportShell />}>
      <Route path="/rapport/:token" element={<RapportPublicPage />} />
    </Route>

    {/* Auth */}
    <Route element={<AuthShell />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/login/reset" element={<ResetPage />} />
    </Route>

    {/* Monde Pro — TOUTES les routes /app/* enfants d'AppShellPro */}
    <Route element={<RequireAuth />}>
      <Route path="/app" element={<AppShellPro />}>
        <Route index element={<Navigate to="tableau-de-bord" replace />} />
        <Route path="tableau-de-bord" element={<DashboardPage />} />

        <Route path="activite">
          <Route index element={<Navigate to="pilotage" replace />} />
          <Route path="pilotage" element={<PilotagePage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="performance" element={<PerformancePage />} />
        </Route>

        <Route path="biens">
          <Route index element={<Navigate to="portefeuille" replace />} />
          <Route path="portefeuille" element={<PortefeuillePage />} />
          <Route path="annonces" element={<BiensAnnoncesPage />} />
          <Route path="dvf" element={<BiensDvfPage />} />
        </Route>

        <Route path="prospection">
          <Route index element={<Navigate to="radar" replace />} />
          <Route path="radar" element={<RadarPage />} />
          <Route path="signaux-dvf" element={<SignauxDvfPage />} />
          <Route path="signaux-dpe" element={<SignauxDpePage />} />
        </Route>

        <Route path="widgets">
          <Route index element={<WidgetsHubPage />} />
          <Route path="estimation-vendeur" element={<WidgetVendeurPage />} />
          <Route path="projet-investisseur" element={<WidgetInvestPage />} />
        </Route>

        <Route path="estimation">
          <Route index element={<Navigate to="rapide" replace />} />
          <Route path="rapide" element={<EstimationRapidePage />} />
          <Route path="avis-valeur" element={<AvisValeurListPage />} />
          <Route path="avis-valeur/:id" element={<AvisValeurEditPage />} />
          <Route path="etude-locative" element={<EtudeLocListPage />} />
          <Route path="etude-locative/:id" element={<EtudeLocEditPage />} />
        </Route>

        <Route path="investissement">
          <Route index element={<Navigate to="opportunites" replace />} />
          <Route path="opportunites" element={<OpportunitesPage />} />
          <Route path="dossiers" element={<DossiersListPage />} />
          <Route path="dossiers/:id" element={<DossierEditPage />} />
        </Route>

        <Route path="observatoire">
          <Route index element={<Navigate to="marche" replace />} />
          <Route path="marche" element={<MarchePage />} />
          <Route path="tension" element={<TensionPage />} />
          <Route path="contexte-local" element={<ContexteLocalPage />} />
        </Route>

        <Route path="veille">
          <Route index element={<Navigate to="notifications" replace />} />
          <Route path="alertes" element={<AlertesPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="biens-suivis" element={<BiensSuivisPage />} />
          <Route path="agences-concurrentes" element={<AgencesConcurrentesPage />} />
        </Route>

        <Route path="equipe">
          <Route index element={<Navigate to="vue" replace />} />
          <Route path="vue" element={<EquipeVuePage />} />
          <Route path="activite" element={<EquipeActivitePage />} />
          <Route path="portefeuille" element={<EquipePortefeuillePage />} />
          <Route path="agenda" element={<EquipeAgendaPage />} />
          <Route path="performance" element={<EquipePerformancePage />} />
        </Route>

        <Route path="parametres" element={<ParametresPage />} />
      </Route>
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
)
```

**Points critiques :**
1. Toutes les routes `/app/*` sont **enfants** de `<Route element={<AppShellPro />}>`. Sans exception.
2. `<AppShellPro>` rend `<HeaderPro>` + `<SidebarPro>` + `<main><Outlet /></main>`.
3. `<RequireAuth>` englobe `<AppShellPro>` pour vérification avant rendu du layout (évite flash).
4. Les routes index avec `<Navigate replace>` remplacent les redirects Next.js.
5. Les variants de `PublicShell` sont **par groupe de routes**, pas par page.

---

## 15. Composants à créer / modifier

### Layouts public
- `PublicShell`, `PublicHeader` (standard + marketing-pro), `PublicFooter` (full + minimal), `PublicMobileMenu`
- `WidgetShell`, `ReportShell`, `AuthShell`

### Layouts Pro
- `AppShellPro`, `HeaderPro`, `SidebarPro`, `ProNavGroup`, `ProNavItem`
- `CommandSearch`, `ZoneSelector`, `NotificationPopover`, `UserMenu`
- `ProPlaceholderPage`

### Guards
- `RequireAuth`, `RoleGuard`

### PageShells
- `StandardPageShell`, `WorkspacePageShell`, `SplitMapPageShell`, `ReportEditorShell`

### Drawers
- `EntityDrawerShell`, `AIDrawer`, 13 `*DrawerContent`

### Config
- `publicNavigation.ts`, `proNavigation.ts`, `proRoutes.ts`, `featureFlags.ts`

### Stores Zustand
- `zoneStore`, `entityDrawerStore`, `aiDrawerStore`, `commandSearchStore`

### Hooks
- `useAuth`, `useZone`, `useEntityDrawer`, `useBadges`

### Pages
- Toutes celles référencées dans `routes.tsx` (§14)

---

## 16. Plan de travail recommandé pour Claude Code

### Phase 0 — Audit obligatoire

1. Lire `src/main/webapp/app/routes.tsx` actuel, exporter dans `AUDIT_ROUTES_BEFORE.md`.
2. Lister fichiers qui importent header/footer JHipster legacy (`shared/layout/`).
3. Lister sidebars locales existantes (grep `MON ACTIVITÉ`, grep imports Sidebar dans `/features/`).
4. Identifier pages qui ré-importent PublicHeader/PublicNav.
5. Produire `AUDIT.md` avant toute modification.

### Phase 1 — Socle technique

6. Installer : `zustand`, `motion` (ou `framer-motion`), `@tanstack/react-query`, `lucide-react`, `react-hook-form`, `zod`, `cmdk`.
7. Créer `config/publicNavigation.ts` et `config/proNavigation.ts`.
8. Créer `shared/auth/RequireAuth.tsx`, `useAuth.ts`, `RoleGuard.tsx`.
9. Créer `shared/stores/zoneStore.ts` + autres stores.
10. Créer `shared/motion/`.

### Phase 2 — Couche publique

11. Créer `layouts/public/PublicShell.tsx`, `PublicHeader.tsx`, `PublicFooter.tsx`, `PublicMobileMenu.tsx`.
12. Créer `layouts/widget/WidgetShell.tsx`.
13. Créer `layouts/report/ReportShell.tsx`.
14. Créer `layouts/auth/AuthShell.tsx`.
15. Créer la landing `/` dans `pages/public/home/`.
16. Créer la landing `/pro` dans `pages/public/pro-landing/`.
17. Créer `pages/auth/LoginPage.tsx` connecté à `authenticate()` Redux.

### Phase 3 — Couche Pro

18. Créer `layouts/pro/AppShellPro.tsx`, `HeaderPro.tsx`, `SidebarPro.tsx`, `ProNavGroup.tsx`, `ProNavItem.tsx`.
19. Créer `CommandSearch.tsx` avec `cmdk`, alimenté par `proNavigation.ts`.
20. Créer `ZoneSelector.tsx`, `NotificationPopover.tsx`, `UserMenu.tsx`.
21. Créer `ProPlaceholderPage.tsx`.

### Phase 4 — PageShells et Drawers

22. Créer les 4 PageShells.
23. Créer `EntityDrawerShell` + `useEntityDrawer` + 13 content files (stubs).
24. Créer `AIDrawer` (stub).

### Phase 5 — Refonte `routes.tsx`

25. **Étape critique.** Réécrire selon §14. Valider manuellement avant de continuer.
26. Vérifier `/app/tableau-de-bord` : AppShellPro complet.
27. Vérifier `/app/activite/pilotage` : AppShellPro **avec SidebarPro globale** (plus de mini-sidebar).
28. Vérifier absence de PublicHeader sur `/app/*`.

### Phase 6 — Migration modules (un module par commit)

29. Pilotage : déplacer dans `features/activite/pilotage/`, nettoyer imports sidebar/header legacy, brancher `WorkspacePageShell`.
30. Leads : idem.
31. Performance : sur `StandardPageShell`.
32. Estimation rapide : supprimer sidebar locale, `StandardPageShell`, garder tabs internes.
33. AVR (liste + détail) : idem.
34. Étude locative : idem.
35. Continuer module par module. Chaque commit doit laisser l'app bootable.

### Phase 7 — Archivage legacy JHipster

36. Déplacer `shared/layout/` dans `_legacy/` ou supprimer si aucun import restant.
37. Supprimer `modules/home/`.
38. Supprimer composants sidebar locale orphelins.

### Phase 8 — Vérifications finales

39. Grep PublicHeader dans pages `/app/*` : aucune occurrence.
40. Tester chaque shell en responsive mobile + desktop.
41. Produire `CHANGELOG_ARCHI.md` complet.

---

## 17. Critères d'acceptation

### Le fix principal (priorité 1)

- [ ] Sur `/app/activite/pilotage`, la SidebarPro globale (Tableau de bord, Mon activité expandé avec 3 sous-items, Biens, Prospection…) est visible à gauche.
- [ ] Sur `/app/activite/pilotage`, le HeaderPro est en haut (logo PRO, zone, assistant IA, avatar).
- [ ] Sur `/app/activite/pilotage`, le PublicHeader **n'apparaît pas**.
- [ ] Sur `/app/activite/pilotage`, aucune mini-sidebar "MON ACTIVITÉ" n'apparaît.
- [ ] Même vérification sur `/app/estimation/rapide`, `/app/estimation/avis-valeur`, `/app/activite/leads`.

### Public

- [ ] `/` affiche PublicHeader standard + PublicFooter full.
- [ ] `/pro` affiche PublicHeader marketing-pro + PublicFooter full.
- [ ] `/prix-immobiliers` affiche PublicFooter minimal, sans HeaderPro.
- [ ] `/annonces` affiche toggle Acheter/Louer, PublicFooter minimal.
- [ ] `/widget/*` n'affiche ni PublicHeader ni PublicFooter.
- [ ] `/rapport/:token` shell minimal sans navigation.
- [ ] Bouton Espace Pro → `/pro`.

### Pro

- [ ] `/app` redirige vers `/app/tableau-de-bord`.
- [ ] Tous sous-groupes redirigent vers leur défaut.
- [ ] Toutes routes `/app/*` affichent HeaderPro + SidebarPro.
- [ ] SidebarPro conforme §11.4.
- [ ] Item actif en violet.
- [ ] Groupe de la route active ouvert auto.
- [ ] Routes non développées → `ProPlaceholderPage`.
- [ ] Aucun `"/app/"` hardcodé dans composant hors config (vérifiable par grep).

### Authentification

- [ ] Accès `/app/tableau-de-bord` sans session → redirect `/login?next=...`.
- [ ] Après login, redirect vers `next` initial.
- [ ] Après logout, redirect sur `/`.
- [ ] Aucun flash de contenu Pro avant vérif session.

### Responsive

- [ ] < 1024px : SidebarPro cachée, accessible via hamburger.
- [ ] < 768px : PublicHeader en burger.
- [ ] ⌘K accessible sur mobile via icône loupe.

### Zone

- [ ] ZoneSelector lit/écrit `useZoneStore()`.
- [ ] Observatoire, Radar, Veille alertes filtrent par zone.
- [ ] Pages `ignoresZone: true` ne filtrent pas.
- [ ] Zone persiste au refresh, reset au logout.

### Architecture

- [ ] `/pro` ne charge jamais AppShellPro.
- [ ] `/app/*` ne charge jamais PublicShell.
- [ ] Aucun import de route hardcodé dans composant.
- [ ] `shared/layout/` JHipster archivé ou supprimé.
- [ ] `modules/home/` supprimé.

---

## 18. À ne pas faire

- Mélanger `/pro` et `/app` (layouts, composants, styles).
- Afficher HeaderPro sur route publique.
- Afficher PublicHeader sur `/app/*`.
- Créer une route `/app/*` de premier niveau sans parent `<AppShellPro>`.
- Créer deux sections publiques séparées Acheter et Louer.
- Dupliquer des sidebars de nav globale dans les modules.
- Hardcoder des routes ou labels de nav dans composants.
- Construire modules métier avant les shells.
- Transformer landing publique en dashboard.
- Transformer landing Pro en application connectée.
- Migrer l'auth vers Zustand (reste dans Redux Toolkit).
- Supprimer `modules/account/` ou `modules/administration/`.
- Envoyer "Espace Pro" directement vers `/app` depuis header public.
- Dupliquer favoris hors Veille > Biens suivis.
- Créer mini-CRM dans Prospection, Estimation, Veille, Investissement.
- Générer design system parallèle.
- Animer au-delà de `/docs/07_MOTION_LANGUAGE.md`.
- Piocher composants 21st.dev sans restyler.
- Mélanger pages publiques dans `features/`.

---

## 19. Prompt Claude Code final

```md
# Objectif
Refondre l'architecture de l'app Propsight (JHipster + React Router) pour résoudre
le bug de silos : chaque module /app/* doit partager le même AppShellPro (HeaderPro
+ SidebarPro globale) au lieu d'hériter du layout public.

# Stack (inchangée)
JHipster · Spring Boot · React 18 · TypeScript · React Router v6+ · Redux Toolkit
(auth/entités) · Zustand (UI léger) · Tailwind · shadcn/ui · motion/react.

# Contexte
Lire avant tout :
- /docs/00_ARCHITECTURE_GLOBALE.md (ce document)
- /docs/01_DESIGN_SYSTEM.md
- /docs/07_MOTION_LANGUAGE.md
- /docs/08_LANDING_PATTERNS.md
- src/main/webapp/app/routes.tsx (actuel)
- CLAUDE.md (conventions projet)

# Règle critique
Toutes les routes /app/* DOIVENT être enfants d'un unique <Route element={<AppShellPro />}>
dans routes.tsx. Aucune route /app/* de premier niveau. C'est le fix principal.

# Ordre d'exécution
Suivre strictement le plan §16 : audit → socle → public → Pro → PageShells & drawers →
refonte routes.tsx → migration modules → archivage legacy → vérifications.

# Livrable
Composants §15, arborescence §13.
AUDIT.md avant modifications, CHANGELOG_ARCHI.md après.

# Règles dures
- Respect strict des critères d'acceptation §17, commencer par "Le fix principal".
- Aucune navigation Pro hardcodée.
- Un module par commit en phase 6.
- Zéro page blanche, zéro 404 pour route déclarée.
- Redux Toolkit : auth + entités. Zustand : UI léger uniquement.

# Design
Violet Propsight, Inter, radius 8px, bordures fines, layouts Linear / Attio.
Animations selon motion_language. Landings selon landing_patterns.
```

---

## Annexe 9.x — Contenu détaillé landing `/`

### HomeHero

- **Titre** : `Prix réels, annonces, rentabilité : comprenez le marché avant de décider.`
- **Sous-titre** : voir §9.3
- **Barre de recherche** : placeholder "Rechercher une adresse, une ville ou un code postal" → `/prix-immobiliers?search=...`
- **Exemples cliquables** : Paris 15e · Lyon · Bordeaux · Nantes
- **CTAs** :
  - Primaire violet : Explorer les prix → `/prix-immobiliers`
  - Secondaire outline : Voir les annonces → `/annonces`
  - Tertiaire text : Simuler un projet → `/investissement`

### PublicProductCards

3 cards : Prix immobiliers, Acheter/Louer, Investissement.

### WhyPropsightSection

4 blocs : Prix réels de vente, Annonces enrichies, Simulation investissement, Contexte local.

### UseCasesSection

4 cas : Acheter, Louer / mettre en location, Investir, Analyser une zone.

### DataSourcesSection

4 sources : DVF, Annonces, DPE, Données locales.

### ProTeaserSection

Bloc orientant vers `/pro`.

---

## Annexe 10.x — Contenu détaillé landing `/pro`

### ProHero

- **Titre** : `Transformez la data immobilière en mandats.`
- **Sous-titre** : voir §10.3
- **CTAs** : Demander un accès (primaire) + Se connecter (secondaire)
- **Visuel** : dashboard Pro stylisé

### ProProblemSection

4 problèmes : Prospection éclatée, Estimations difficiles à justifier, Leads mal suivis, Manque de vision business.

### ProSolutionSection

4 piliers : Détecter, Qualifier, Produire, Relancer.

### ProModulesSection

10 modules avec 2-3 phrases max chacun.

### ProDifferentiatorsSection

6 différenciateurs : Données enrichies, Rapports éditables, Tracking client, Pipeline unique, Veille actionnable, Pilotage équipe.

### ProUseCasesSection

5 cas : Gagner des mandats vendeurs, Transformer votre site en source de leads, Prospecter intelligemment, Produire un dossier investisseur, Manager une équipe.

### ProProductPreviewSection

3 previews visuelles : Dashboard, Rapport/estimation, Prospection/veille.

### ProFinalCtaSection

CTA final avec formulaire ou lien `/contact`.

---

**Fin du document.**
