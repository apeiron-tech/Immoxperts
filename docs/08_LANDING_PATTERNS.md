# Propsight — Landing Patterns

**Version :** V1
**Statut :** Guardrail design pour `/` et `/pro`
**Objectif :** garder les landings alignées Linear / Attio, éviter la dérive style "AI SaaS generic"
**Complémentaire à :** `/docs/01_DESIGN_SYSTEM.md` et `/docs/07_MOTION_LANGUAGE.md`

---

## 0. Principe directeur

> Une landing Propsight n'est pas une landing d'agence créative ni une landing crypto.
> C'est une landing **immobilière premium** — sobre, factuelle, confiante.

Nos références :

- **Linear** (linear.app) — rigueur typographique, dégradés subtils sur fond blanc, beaucoup d'espace négatif
- **Attio** (attio.com) — cards factuelles, couleurs en accent discret, data visible dans les previews
- **Vercel** (vercel.com) — structure grille rigoureuse, animations utilitaires
- **Stripe** (stripe.com) — confiance par la sobriété

Nos anti-références :

- Landings avec héros en plein écran et mesh gradient violet-rose-bleu animé
- Sites avec "glow effect" néon autour des cards
- Landings qui imitent l'esthétique crypto (dark mode + néons + monospace)
- Sites où chaque section a un background différent

---

## 1. Règles de base

### 1.1 Fond dominant

- **Blanc pur `#FFFFFF`** pour 90% des surfaces.
- Fond alternatif : `--neutral-50` (gris très clair) pour une section de contraste par page max.
- **Jamais** de dark mode sur les landings publiques (Propsight a un mode clair unique en V1).
- **Jamais** de fond coloré violet saturé en section pleine largeur.

### 1.2 Utilisation du violet Propsight

Le violet est un **accent**, pas un fond.

**OK :**
- CTA primaire (fond violet-500)
- Bordure d'une card active ou survolée (`violet-200`)
- Icône d'accent
- Soulignement d'un mot clé dans un titre
- Badge "Pro" ou "Nouveau"

**NON :**
- Fond de section pleine largeur violet
- Gradient violet-500 → violet-900 décoratif
- Halo violet autour d'un visuel
- Texte en violet-500 pour un paragraphe entier

### 1.3 Typographie

- **Inter** sur toutes les surfaces (cf. design system)
- **Pas de font-weight 800 ou 900** (règle du design system)
- Tailles titres landing : h1 48-56px, h2 32-40px, h3 22-28px
- Line-height généreux : 1.5 pour le corps, 1.2 pour les titres
- **Pas** de titres en italique
- **Pas** de display font secondaire (serif, script, monospace décoratif)

### 1.4 Cards

- Bordure fine `1px solid var(--neutral-200)`
- Radius 8px (cf. design system)
- Ombre : aucune par défaut, `shadow-sm` subtile au hover
- Background blanc
- Padding intérieur généreux : 24-32px
- **Pas** de glass morphism (backdrop-blur)
- **Pas** de bordure néon ou gradient
- **Pas** de card flottante avec ombre portée exagérée

### 1.5 Espacement

- Section landing standard : `py-20` à `py-32` (80-128px de padding vertical)
- Container : `max-w-[1200px]` centré, padding horizontal `px-6` sur mobile
- Entre deux cards d'une grille : gap-6 (24px) sur desktop, gap-4 (16px) sur mobile
- **Règle d'or :** plus aéré sur public que sur Pro connecté

### 1.6 Visuels

- **Photos immobilières authentiques** quand pertinent (extérieur, salon lumineux), jamais de stock photo cliché (famille souriante devant une maison)
- **Screenshots produit stylisés** pour illustrer Propsight Pro (pas de vraies données sensibles)
- **Pas** d'illustrations 3D rendues type Spline ou Dribbble
- **Pas** d'avatars génériques ChatGPT
- **Pas** de mockups floutés derrière un texte

---

## 2. Patterns autorisés

### 2.1 Hero section (landing `/` et `/pro`)

Structure type :

```
[Badge optionnel petit]
H1 en 3 lignes max, 48-56px, weight 500 ou 600
Sous-titre en 2 lignes, 18-20px, neutral-600, weight 400
[CTA primaire violet] [CTA secondaire outline]
─────── espace ───────
[Visuel product preview OU barre de recherche contextuelle]
```

**Règles :**
- Le hero prend ~80vh, pas 100vh (le scroll doit être suggéré)
- Le CTA primaire est seul visuellement dominant
- Le visuel est un **vrai screenshot** stylisé, pas une illustration abstraite

**Contre-exemples à éviter :**
- Hero 100vh avec vidéo en background
- Hero split 50/50 avec mesh gradient à droite
- Hero avec 4 CTAs alignés
- Hero avec effet "aurora" animé

### 2.2 Feature grid (3 cards)

Pattern classique Propsight :

```
─────────────────────────────────────
  Eyebrow (petit texte violet uppercase)
  H2
  Sous-titre (optionnel, 1 ligne)
─────────────────────────────────────
  ┌─────────┐ ┌─────────┐ ┌─────────┐
  │  Icon   │ │  Icon   │ │  Icon   │
  │  Titre  │ │  Titre  │ │  Titre  │
  │  Desc   │ │  Desc   │ │  Desc   │
  │  →      │ │  →      │ │  →      │
  └─────────┘ └─────────┘ └─────────┘
```

**Règles :**
- 3 cards max par ligne desktop, 1 sur mobile
- Icône en haut, 24-32px, violet-500 ou neutral-700 (pas les deux)
- Titre en weight 500, 18-20px
- Description en 2-3 lignes max, neutral-600
- CTA de card discret (texte souligné ou flèche →)

### 2.3 Bullet list "Pourquoi Propsight"

Pour WhyPropsightSection (landing `/`) et ProDifferentiators (landing `/pro`) :

```
Titre H2
─────────────────
 ✓  Prix réels de vente
    Description en 1-2 lignes.

 ✓  Annonces enrichies
    Description en 1-2 lignes.

 ✓  Simulation investissement
    Description en 1-2 lignes.
```

**Règles :**
- Check violet-500 à gauche, aligné haut
- Titre en weight 500, 16-18px
- Description neutral-600
- Pas d'encadré autour de chaque bullet (rester clean)

### 2.4 Use cases (cas d'usage)

Layout en split texte / visuel alterné :

```
Ligne 1 :  [Texte gauche 40%] [Visuel droite 60%]
Ligne 2 :  [Visuel gauche 60%] [Texte droite 40%]
Ligne 3 :  [Texte gauche 40%] [Visuel droite 60%]
```

**Règles :**
- Alterner l'alignement à chaque cas
- Le visuel est un screenshot produit ciblé (pas un visuel générique)
- Chaque cas a un CTA texte vers la route Propsight correspondante

### 2.5 Module list (landing `/pro` section Modules)

Grille 2 colonnes ou liste verticale :

```
┌──────────────────────┐  ┌──────────────────────┐
│ [Icon] Tableau bord  │  │ [Icon] Mon activité  │
│ Description courte   │  │ Description courte   │
│ Voir →               │  │ Voir →               │
└──────────────────────┘  └──────────────────────┘
...
```

**Règles :**
- 2 colonnes sur desktop, 1 sur mobile
- Icon 20-24px neutral-700
- Cards cliquables (bordure violet-200 au hover)
- Pas de mega-card avec screenshot dans chaque module (trop chargé)

### 2.6 Product preview

Pour ProProductPreviewSection : 3 previews avec tabs ou carousel sobre.

**Règles :**
- Screenshots stylisés sur fond blanc avec bordure neutral-200
- Pas de mockup de laptop ou de smartphone décoratif
- Sous chaque screenshot : un titre (ex: "Dashboard") + une phrase explicative
- Les tabs si présentes : underline violet-500 sous le tab actif, pas de pill background

### 2.7 Data sources (landing `/`)

Section "D'où viennent nos données" :

```
DVF                Annonces            DPE                 Données locales
Transactions       Biens à vendre      Indicateurs         Équipements,
immobilières       et à louer          énergétiques        contexte
réelles            observés            officiels           territorial
```

**Règles :**
- 4 colonnes, pas d'icônes lourdes, juste du texte
- Chaque source en titre neutral-900 + description neutral-600
- Fond neutral-50 optionnel pour cette section (section de contraste)

### 2.8 FAQ (optionnelle en ressources)

Accordion natif, une question par item.

**Règles :**
- Divider 1px neutral-200 entre items
- Chevron à droite, rotation 180° à l'ouverture (durée 180ms, `easings.default`)
- Pas de card individuelle par question (rester en liste)

### 2.9 CTA final

Bloc dédié en fin de landing :

```
────────────────────────
   H2 engageant
   Sous-titre court
   [CTA primaire violet]
────────────────────────
```

**Règles :**
- Fond blanc ou neutral-50, **pas** violet
- Max 1 CTA
- Pas de checkbox "Je ne suis pas un robot" visible (dans un formulaire oui, mais pas sur un bouton CTA simple)

---

## 3. Anti-patterns à bannir

### 3.1 Visuels à bannir

| ❌ | Pourquoi |
|---|---|
| Mesh gradients animés violet-rose-bleu | Anti-Linear/Attio, cheap |
| Orbes floues en background | Effet "2024 AI SaaS", générique |
| Grid lines en background qui pulse | Kitsch |
| Néon glow autour des cards | Trop crypto |
| Backdrop-blur façon iOS | Ralentit le rendu, pas premium |
| Parallax scroll sur visuels | Distrait |
| Textes en gradient animé | Illisible, gadget |
| Badges "NEW" ou "HOT" en animation | Cheap |
| Confettis à l'arrivée | Pas sérieux pour du B2B |
| Mockups flottants avec ombre 3D exagérée | Daté |
| Icônes 3D style Cosmic / iOS 16 | Anti-design system |
| Emoji dans les titres | Pas premium |
| GIFs animés | Lourd, cheap |
| Photos stock génériques "business" | Manque d'authenticité |

### 3.2 Textes à bannir

| ❌ | Pourquoi |
|---|---|
| "Boostez votre activité" | Cliché marketing |
| "Révolutionnez votre business" | Cliché marketing |
| "Game-changer pour l'immobilier" | Anglicisme inutile |
| Titres en MAJUSCULES intégrales | Criard |
| Ponctuation exagérée : "C'est simple !!" | Pas premium |
| Anglais mélangé au français sans raison | Confus |
| Jargon crypto/IA ("disruptif", "on-chain") | Hors-sujet |
| Promesses non vérifiables ("#1 en France") | Juridiquement risqué |

### 3.3 Structures à bannir

| ❌ | Pourquoi |
|---|---|
| Landing à 15+ sections | Fatigue lecteur |
| Carousel auto-défilant horizontal | Anti-UX |
| Popup "Avant de partir !" | Cheap |
| Chat widget qui rebondit | Intrusif |
| CTA qui suit le scroll (sticky bottom) | Agressif sur mobile |
| Counter animé de "clients actifs" | Pas vérifiable, gadget |
| Loop de logos clients qui défile sans fin | Daté |
| Testimonials en carousel obligé | Préférer grille statique |

---

## 4. Curation 21st.dev

21st.dev est un **excellent accélérateur de structure**, mais la majorité des composants sont **trop chargés visuellement** pour Propsight. Règles strictes de curation :

### 4.1 Ce qu'on prend

- La **structure HTML/layout** (grille, placement, responsive)
- La **logique React/TypeScript** (state, interactions)
- Les **patterns d'accessibilité** (ARIA, focus management)

### 4.2 Ce qu'on jette systématiquement

- Toute classe Tailwind avec gradient (`bg-gradient-to-*`, sauf cas rare justifié)
- Tout `backdrop-blur-*`
- Toute animation de glow (`animate-pulse` en continu, etc.)
- Toute ombre `shadow-2xl` ou plus
- Tout border radius > 12px (Propsight = 8px)
- Toute couleur hardcodée non mappée aux tokens Propsight
- Toute icône décorative Lucide non fonctionnelle
- Tout emoji dans les copies
- Tout font-weight > 700

### 4.3 Process de réintégration

1. Identifier le composant 21st.dev qui a la structure voulue.
2. L'installer dans un dossier temporaire (`/src/components/__drafts/`).
3. Restyler avec les tokens Propsight (violet, Inter, radius 8, bordures fines).
4. Retirer toutes les animations non conformes à `/docs/07_MOTION_LANGUAGE.md`.
5. Remplacer les visuels/icônes par ceux du design system.
6. Tester le contraste (WCAG AA minimum).
7. Déplacer dans le dossier final (`/src/components/public-home/` ou `pro-landing/`).
8. Supprimer le dossier `__drafts/`.

### 4.4 Composants 21st.dev particulièrement utiles

- Hero sections avec search bar (pour `/`)
- Feature grids 3 colonnes (pour PublicProductCards, ProModulesSection)
- Pricing tables (pour une future page /pricing)
- Logo clouds statiques (pour "Utilisé par...")
- FAQ accordions
- Testimonial grids statiques

### 4.5 Composants 21st.dev à éviter

- Tout ce qui s'appelle "Aurora", "Spotlight", "Meteors", "Shimmer", "Gradient" background
- Bento grids (trop chargées et à la mode 2024)
- Animated numbers (counters)
- Infinite moving logos
- 3D cards avec tilt au hover
- Glass morphism sidebars

---

## 5. Checklist avant merge d'une landing ou section

### Design

- [ ] Fond blanc dominant (ou neutral-50 pour UNE section max)
- [ ] Violet utilisé uniquement en accent, jamais en fond pleine largeur
- [ ] Radius 8px partout (sauf raisons valides documentées)
- [ ] Bordures fines `--neutral-200`, pas d'ombres lourdes
- [ ] Typographie Inter, weight ≤ 700
- [ ] Espacements généreux, respiration entre sections
- [ ] Pas de gradient décoratif, pas de mesh, pas de glass

### Contenu

- [ ] Titres sans emoji, sans majuscules intégrales, sans ponctuation exagérée
- [ ] Copies en français clair, sans jargon
- [ ] Pas de promesse non vérifiable
- [ ] Hiérarchie claire : H1 > H2 > H3
- [ ] CTA primaire visuel unique et clair

### Animation

- [ ] Conforme à `/docs/07_MOTION_LANGUAGE.md`
- [ ] Scroll reveal `once: true`
- [ ] Pas de parallax, pas de scroll-jacking
- [ ] `useReducedMotion` supporté

### Structure

- [ ] ≤ 10 sections sur la landing
- [ ] Mobile testé (burger menu, stack vertical propre)
- [ ] Pas de popup intrusive
- [ ] Pas de widget tiers qui charge des animations non conformes

### Accessibilité

- [ ] Contraste texte AA (≥ 4.5:1)
- [ ] Tous les CTAs ont un label accessible
- [ ] Hiérarchie sémantique `<h1>` → `<h6>` cohérente
- [ ] Images ont un `alt` descriptif
- [ ] Pas d'info uniquement portée par la couleur

### 21st.dev

- [ ] Aucune classe Tailwind de gradient ou backdrop-blur rémanente
- [ ] Aucune couleur hardcodée non mappée
- [ ] Aucune animation non conforme au motion language
- [ ] Code restylé, pas copié-collé brut

---

## 6. Exemples Do / Don't concrets

### Exemple 1 — Hero de `/`

**✅ Do**

```
─────────────────────────────────────────
  Prix réels, annonces, rentabilité :
  comprenez le marché avant de décider.

  Propsight rassemble les données
  immobilières essentielles pour acheter,
  louer, investir ou estimer avec plus
  de confiance.

  [ Rechercher une adresse ou une ville ]

  Exemples : Paris 15e · Lyon · Bordeaux

  [Explorer les prix]  [Voir les annonces]
─────────────────────────────────────────
         [Visuel carte DVF stylisé]
```

- Fond blanc
- Typo Inter, titre weight 500
- CTA violet-500 + CTA outline
- Visuel = vrai screenshot carte DVF

**❌ Don't**

```
  [Mesh gradient violet-rose en background]
  [Badge animé "AI-POWERED"]

  🚀 LE MEILLEUR OUTIL IMMOBILIER ! 🏠
  Boostez vos décisions avec l'IA

  [Démarrer gratuitement] [Regarder la démo]
  [Télécharger l'app]     [Nous contacter]

  ⭐⭐⭐⭐⭐ +10 000 utilisateurs actifs
```

- Mesh gradient interdit
- Emoji interdit
- Title-case marketing interdit
- 4 CTAs = dilue l'intention
- Badge "AI" non justifié

### Exemple 2 — Section modules `/pro`

**✅ Do**

Grille 2x5 de cards uniformes, bordures fines, icônes neutral-700, copies courtes, hover discret.

**❌ Don't**

Bento grid asymétrique avec 3 tailles différentes, gradients dans les cards, icônes 3D, animations de pulse en continu.

### Exemple 3 — Final CTA

**✅ Do**

```
─────────────────────────────────────
  Prêt à passer de la donnée à l'action ?

  [Demander un accès]   Se connecter
─────────────────────────────────────
```

Fond blanc, un seul CTA primaire, lien secondaire discret.

**❌ Don't**

```
  [Fond violet pleine largeur + glow]
  🎉 REJOIGNEZ LA RÉVOLUTION IMMOBILIÈRE !!! 🎉

  [💎 ESSAI GRATUIT 30 JOURS 💎]
     ⬆ pulse animation continue ⬆

  ✓ Pas de CB  ✓ Annulation à tout moment  ✓ Support 24/7
```

Tout est à proscrire.

---

## 7. Références externes à consulter avant de commencer

Pour imprégner Claude Code du bon ton visuel avant de coder, consulter dans cet ordre :

1. [linear.app](https://linear.app) — section features, pricing, page d'accueil
2. [attio.com](https://attio.com) — particulièrement la homepage et product tour
3. [stripe.com](https://stripe.com) — section produits
4. [vercel.com](https://vercel.com) — homepage et templates

**Ne pas consulter comme référence directe :**
- Lovable, Framer templates, Aceternity, Magic UI templates
- Landing pages SaaS Dribbble
- Tout ce qui a "AI" dans le nom et une esthétique néon

---

**Fin du document.**
