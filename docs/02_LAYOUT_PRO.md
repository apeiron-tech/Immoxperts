# 02 — Layout Pro (Header + Sidebar + Drawers)

**Durée estimée** : 2h
**Objectif** : Shell de l'application authentifiée avec Header Pro, Sidebar Pro complète, layout `(app)` qui les compose, drawer contextuel et drawer AI.

---

## Header Pro (hauteur fixe 52px)

Barre horizontale collée en haut, sticky, fond blanc/bordure fine bas.

### Structure (gauche à droite)

```
┌────────────────────────────────────────────────────────────────────────┐
│ [Logo] Propsight [PRO] │ [⌘K Rechercher...] │ [Zone ▾]  [✨AI] [🔔3] [👤]│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Logo Propsight** (à gauche, largeur sidebar = 240px)
   - Logo SVG placeholder + texte "Propsight" en `font-semibold text-sm`
   - Badge `PRO` à côté : micro pill violet-500 bg, blanc fg, `text-[10px] font-semibold px-1.5 py-0.5 rounded`

2. **⌘K Search global** (centré-gauche, max-w-md flex-1)
   - Input readonly avec icône loupe + placeholder "Rechercher un bien, un lead, une adresse..." + raccourci `⌘K` en pill à droite
   - Clic → ouvre une command palette (shadcn `<Command>`)
   - Results : biens, leads, estimations, actions, zones (liens directs)

3. **Zone selector** (droite de la search)
   - Bouton outline compact avec icône `MapPin` + "Paris 15e ▾"
   - Clic → dropdown de zones favorites + "Changer de zone"

4. **✨ Assistant IA** (bouton icône)
   - Icône Sparkles Lucide + label "Assistant" (masqué < 1280px)
   - Clic → ouvre drawer AI à droite

5. **🔔 Notifications** (bouton icône avec badge compteur)
   - Icône Bell + badge rouge avec nb notifications non lues
   - Clic → dropdown avec 5 dernières + "Tout voir"

6. **Avatar user** (à l'extrême droite)
   - Photo ou initiales
   - Clic → dropdown : Profil / Paramètres / Mon organisation / Déconnexion

---

## Sidebar Pro (largeur fixe 240px, sticky left)

### Structure (figée, ne change jamais)

```
📊 Tableau de bord

📋 Mon activité
   ├ Pilotage commercial
   ├ Leads
   └ Performance

🏠 Biens immobiliers
   ├ Portefeuille
   ├ Annonces
   └ Biens vendus (DVF)

📡 Prospection
   ├ Radar
   ├ Signaux DVF
   └ Signaux DPE

📏 Estimation
   ├ Estimation rapide
   ├ Avis de valeur
   └ Étude locative

💼 Investissement
   ├ Opportunités
   └ Dossiers

🔬 Observatoire
   ├ Marché
   ├ Tension
   └ Contexte local

🔭 Veille
   ├ Mes alertes
   ├ Notifications
   ├ Biens suivis
   └ Agences concurrentes

👥 Équipe
   ├ Vue équipe
   ├ Activité commerciale
   ├ Portefeuille & dossiers
   ├ Agenda & charge
   └ Performance business

─────────────
⚙️ Paramètres (tout en bas, pinned)
```

### Spécifications visuelles

- Fond : `bg-background` (blanc)
- Bordure droite : `border-r border-border`
- Padding : `p-3`
- Gap vertical entre items de 1er niveau : `gap-1`
- Item 1er niveau : hauteur `h-8`, icône + label, `text-sm font-medium`
- Item 2ème niveau : `pl-8`, hauteur `h-7`, `text-sm font-normal`
- Item actif : `bg-violet-50 text-violet-700` (2ème niveau) / `bg-neutral-100` (1er niveau)
- Item hover : `hover:bg-neutral-50`
- Séparateurs entre groupes : `border-t border-border mt-2 pt-2`
- Paramètres : pinned tout en bas via `mt-auto`

### Comportement

- Les items 1er niveau avec enfants sont des groupes expandables (caret ▸/▾)
- Par défaut, le groupe qui contient la route active est expandé
- Pas de collapse de la sidebar en V1 (toujours à 240px)
- En scroll dans une page longue, la sidebar reste sticky

---

## Layout `(app)`

Fichier : `/src/app/(app)/layout.tsx`

Structure en grid 2 colonnes :

```tsx
<div className="min-h-screen bg-background">
  <HeaderPro />
  <div className="flex">
    <SidebarPro />
    <main className="flex-1 min-w-0">
      {children}
    </main>
  </div>
  <DrawerContextuel />   {/* Drawer droit */}
  <DrawerAI />            {/* Drawer droit séparé */}
</div>
```

---

## Drawer Contextuel (droite)

Tiroir latéral droit qui affiche la fiche d'un objet (lead, bien, action, estimation, etc.) en overlay.

### Largeur

- Par défaut : 420px
- Grand mode : 640px (option user "agrandir")
- Plein écran mobile : 100vw

### Structure

```
┌─ Drawer ─────────────── ✕ ┐
│                            │
│ [Type d'objet]    [Menu ⋯]│
│                            │
│ Titre principal            │
│ Sous-titre / métadonnées   │
│                            │
│ ─────────────              │
│                            │
│ Key info                   │
│ (ex : prix, surface...)    │
│                            │
│ ─────────────              │
│                            │
│ Contexte (adresse + map)   │
│                            │
│ ─────────────              │
│                            │
│ Actions rapides            │
│ [Estimer] [Créer lead]     │
│ [Suivre ♡] [Analyser]      │
│                            │
│ ─────────────              │
│                            │
│ Liens inter-modules        │
│ → 3 estimations            │
│ → 1 dossier invest         │
│ → Lead actif               │
│                            │
│ ─────────────              │
│                            │
│ Timeline (5 derniers évts) │
│ • Estimé il y a 2j         │
│ • Ajouté en portef. 14j    │
│ • Vu sur le marché 1m      │
│                            │
│ ─────────────              │
│                            │
│ Bloc AI compact            │
│ "Ce bien a baissé de prix  │
│  3 fois. Bonne opportunité"│
│                            │
└────────────────────────────┘
```

### Comportement

- Overlay sombre transparent derrière (cliquer dessus ferme)
- Échap ferme
- Bouton X en haut à droite
- Animation slide-in depuis la droite (200ms ease-out)
- Shadow-md sur la gauche

### États selon le type d'objet

Le contenu du drawer s'adapte : lead, bien, action, estimation, opportunité, alerte, zone. Même squelette, sections différentes.

---

## Drawer AI Assistant (droite, séparé du contextuel)

Même position, mais distinct du drawer contextuel. **Jamais les deux ouverts en même temps** — si l'un ouvre, l'autre se ferme.

### Structure

```
┌─ Assistant IA ──── ✕ ┐
│                       │
│ Contexte page :       │
│ Estimation rapide     │
│ 16 rue du Hameau      │
│                       │
│ ─────────────         │
│                       │
│ Ce que je vois :      │
│ • Appartement 2p 42m² │
│ • Zone équilibrée     │
│ • Prix dans fourchette│
│                       │
│ ─────────────         │
│                       │
│ Recommandations :     │
│ ① Lancer une étude    │
│   locative (rdt 3.8%) │
│ ② Suivre la zone DVF  │
│                       │
│ Quick actions :       │
│ [Générer rapport]     │
│ [Comparer avec XX]    │
│                       │
│ ─────────────         │
│                       │
│ Liens modules :       │
│ → Observatoire zone   │
│ → Biens similaires    │
│                       │
│ ─────────────         │
│                       │
│ Synthèse :            │
│ "Bien correct, légère │
│  surcote, rotation    │
│  du quartier moyenne" │
│                       │
│ ─────────────         │
│                       │
│ [Input prompt]        │
│ > Posez une question  │
│                       │
└───────────────────────┘
```

### Comportement

- Contenu pré-rempli selon la page active (contexte automatique)
- Input bas : textarea pour prompts libres
- Suggestions pré-écrites sous forme de pills cliquables
- Loading state pendant génération (skeleton)

---

## Prompt Claude Code

```
On construit maintenant le shell de l'application authentifiée Propsight.

Lis /docs/LAYOUT_PRO.md pour les specs détaillées.

1. Crée /src/components/layout/HeaderPro.tsx :
   - Hauteur 52px, sticky top-0, z-40, bg-white/80 backdrop-blur, border-b
   - Logo + badge PRO à gauche (largeur 240px alignée avec sidebar)
   - Cmd+K search : composant <CommandSearch /> (à créer, utilise shadcn Command + Dialog)
   - Zone selector : <ZoneSelector /> (bouton outline + dropdown)
   - Bouton Assistant IA : icône Sparkles + label (masqué < lg)
   - Bouton Notifications : icône Bell + badge compteur (mock 3 notifs)
   - Avatar : shadcn Avatar + DropdownMenu

2. Crée /src/components/layout/SidebarPro.tsx :
   - Largeur fixe 240px, sticky top-52px, height calc(100vh - 52px)
   - bg-white, border-r, padding p-3
   - Structure en groups avec icônes Lucide :
     * Tableau de bord (icône LayoutDashboard)
     * Mon activité (icône Activity) > Pilotage, Leads, Performance
     * Biens immobiliers (icône Home) > Portefeuille, Annonces, Biens vendus (DVF)
     * Prospection (icône Radar) > Radar, Signaux DVF, Signaux DPE
     * Estimation (icône Calculator) > Estimation rapide, Avis de valeur, Étude locative
     * Investissement (icône TrendingUp) > Opportunités, Dossiers
     * Observatoire (icône LineChart) > Marché, Tension, Contexte local
     * Veille (icône Eye) > Mes alertes, Notifications, Biens suivis, Agences concurrentes
     * Équipe (icône Users) > Vue équipe, Activité, Portefeuille, Agenda, Performance
   - Paramètres pinned en bas (mt-auto)
   - Items 1er niveau : h-8, text-sm font-medium, caret expand/collapse
   - Items 2ème niveau : pl-8, h-7, text-sm
   - Groupes avec enfants : auto-expand si route active dedans
   - Item actif : bg-violet-50 text-violet-700 (2ème niveau) / bg-neutral-100 (1er niveau)
   - Hover : bg-neutral-50
   - Utilise usePathname() Next.js pour détecter la route active
   - URLs : /app/tableau-de-bord, /app/activite/pilotage, /app/activite/leads, etc.

3. Crée /src/components/layout/DrawerContextuel.tsx :
   - Shadcn Sheet, position right, width 420px (et width 640px en mode agrandi)
   - State global via Zustand store : /src/stores/useDrawerStore.ts
     * isOpen, type ('lead' | 'bien' | 'action' | 'estimation' | 'opportunite' | 'alerte' | 'zone')
     * data (any)
     * open(type, data), close()
   - Structure : header type + titre, séparateurs, sections (key info, contexte, actions, liens, timeline, AI)
   - Pour l'instant, crée un rendu générique "sections vides avec placeholders" — le contenu réel selon type viendra plus tard

4. Crée /src/components/layout/DrawerAI.tsx :
   - Shadcn Sheet, position right, width 420px
   - State Zustand : /src/stores/useAIDrawerStore.ts (isOpen, context, open, close)
   - MUTEX : quand on ouvre DrawerAI, on ferme DrawerContextuel (et vice versa). Gère ça via un store commun ou effet croisé.
   - Contenu : sections "Contexte page", "Ce que je vois", "Recommandations", "Quick actions", "Liens modules", "Synthèse", input bas
   - Pour l'instant placeholder avec texte exemple, pas de vraie IA

5. Crée /src/app/(app)/layout.tsx :
   - <HeaderPro /> en haut
   - Div flex : <SidebarPro /> à gauche, <main> à droite
   - <DrawerContextuel /> + <DrawerAI /> en overlay
   - Le <main> a min-w-0 pour éviter les débordements

6. Crée des pages STUB pour chaque route sidebar afin que la navigation fonctionne :
   /src/app/(app)/tableau-de-bord/page.tsx → "Tableau de bord (stub)"
   /src/app/(app)/activite/pilotage/page.tsx → "Pilotage (stub)"
   /src/app/(app)/activite/leads/page.tsx → "Leads (stub)"
   /src/app/(app)/activite/performance/page.tsx
   /src/app/(app)/biens/portefeuille/page.tsx
   /src/app/(app)/biens/annonces/page.tsx
   /src/app/(app)/biens/dvf/page.tsx
   /src/app/(app)/prospection/radar/page.tsx
   /src/app/(app)/prospection/signaux-dvf/page.tsx
   /src/app/(app)/prospection/signaux-dpe/page.tsx
   /src/app/(app)/estimation/rapide/page.tsx → "Estimation rapide (stub)"
   /src/app/(app)/estimation/avis-valeur/page.tsx → "Avis de valeur (stub)"
   /src/app/(app)/estimation/etude-locative/page.tsx → "Étude locative (stub)"
   /src/app/(app)/investissement/opportunites/page.tsx
   /src/app/(app)/investissement/dossiers/page.tsx
   /src/app/(app)/observatoire/marche/page.tsx
   /src/app/(app)/observatoire/tension/page.tsx
   /src/app/(app)/observatoire/contexte-local/page.tsx
   /src/app/(app)/veille/alertes/page.tsx
   /src/app/(app)/veille/notifications/page.tsx
   /src/app/(app)/veille/biens-suivis/page.tsx
   /src/app/(app)/veille/agences-concurrentes/page.tsx
   /src/app/(app)/equipe/vue/page.tsx
   /src/app/(app)/equipe/activite/page.tsx
   /src/app/(app)/equipe/portefeuille/page.tsx
   /src/app/(app)/equipe/agenda/page.tsx
   /src/app/(app)/equipe/performance/page.tsx
   /src/app/(app)/parametres/page.tsx

   Chaque stub affiche juste un <h1> avec le nom + un paragraphe "Cette page sera développée ultérieurement".

7. Crée /src/components/layout/CommandSearch.tsx :
   - Cmd+K déclenche l'ouverture (useHotkeys ou listener)
   - Shadcn Command dans un Dialog
   - Sections : "Navigation rapide" (routes principales), "Actions" (créer estimation rapide, créer lead...), "Récents" (placeholder)
   - Filtrage par input
   - Click sur item → navigate via useRouter

8. Redirige la page d'accueil racine vers /app/tableau-de-bord :
   /src/app/page.tsx → redirect() vers /app/tableau-de-bord

   Mais conserve la page /design-system accessible via /design-system.

9. Test de bout en bout :
   - npm run dev
   - Va sur localhost:3000 → redirigé vers /app/tableau-de-bord
   - Clique chaque item de sidebar, vérifie que la route change et l'item est surligné
   - Clique sur l'avatar → dropdown s'ouvre
   - Ouvre Cmd+K, tape "estimation" → résultats filtrés
   - Ouvre Notifications dropdown, Zone selector dropdown
   - Teste le Drawer AI (bouton Assistant) → s'ouvre à droite
   - Teste que DrawerContextuel et DrawerAI sont mutuellement exclusifs (ouvre l'un, l'autre se ferme)

10. Commit :
    git add -A
    git commit -m "02: layout pro (header + sidebar + drawers) + stubs routes"

Important :
- La sidebar DOIT avoir exactement la structure décrite (ordre figé)
- Les URLs DOIVENT être exactement celles listées (kebab-case, français)
- Les drawers utilisent Shadcn Sheet (pas Dialog)
- Zustand pour le state des drawers (créer store si besoin)
- Pas de gros composants : chaque partie dans son fichier
```

---

## Validation visuelle

- [ ] Header sticky, Cmd+K ouvre la command palette
- [ ] Sidebar à gauche avec tous les items, ordre respecté
- [ ] Les groupes s'expandent/rétractent correctement
- [ ] L'item actif est surligné en violet clair
- [ ] Navigation entre routes fonctionne (toutes les stubs s'affichent)
- [ ] Drawer contextuel s'ouvre à droite
- [ ] Drawer AI s'ouvre à droite
- [ ] Drawer contextuel et Drawer AI ne sont jamais ouverts en même temps
- [ ] Responsive OK entre 1280 et 1920px
- [ ] `npm run build` passe

---

## Étape suivante

Quand validé → `03_TEMPLATE_RAPPORT.md`
